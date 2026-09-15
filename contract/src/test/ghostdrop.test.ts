import {
  createCircuitContext,
  createConstructorContext,
  ecMulGenerator,
  sampleContractAddress,
  type CircuitContext,
  type JubjubPoint,
} from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { describe, expect, it } from 'vitest';
import {
  CaseStatus,
  Contract,
  DisclosureKind,
  InvestigatorAction,
  OrganizationAction,
  ReporterContentKind,
  ledger,
  pureCircuits,
  type Ledger,
  type MembershipCredential,
  type Schnorr_SchnorrSignature,
} from '../managed/ghostdrop/contract/index.js';
import {
  createGhostDropPrivateState,
  type GhostDropPrivateState,
  witnesses,
} from '../witnesses.js';

const NOW = 1_800_000_000n;
const YEAR = 31_557_600n;
const JUBJUB_ORDER = 6554484396890773809930967563523245729705921265872317281365359162392183254199n;
const TWO_248 = 452312848583266388373324160190187140051835877600158453279131187530910662656n;
const EMPTY_COMMITMENT = new Uint8Array(32);

const bytes = (seed: number): Uint8Array => Uint8Array.from({ length: 32 }, (_, index) => (seed + index) % 256);

const sign = (secretKey: bigint, message: bigint[], nonce = 987654321n): Schnorr_SchnorrSignature => {
  const normalizedSecret = ((secretKey % JUBJUB_ORDER) + JUBJUB_ORDER) % JUBJUB_ORDER;
  const publicKey = ecMulGenerator(normalizedSecret);
  const announcement = ecMulGenerator(nonce);
  const challenge =
    pureCircuits.schnorrChallenge(
      announcement.x,
      announcement.y,
      publicKey.x,
      publicKey.y,
      message,
    ) % TWO_248;
  return {
    announcement,
    response: (nonce + challenge * normalizedSecret) % JUBJUB_ORDER,
  };
};

class GhostDropSimulator {
  readonly contract = new Contract<GhostDropPrivateState>(witnesses);
  readonly organizationId = bytes(11);
  readonly issuerSecret = 123456789n;
  readonly issuerPublicKey: JubjubPoint = ecMulGenerator(this.issuerSecret);
  readonly adminSecret = bytes(31);
  readonly reporterSecret = bytes(71);
  context: CircuitContext<GhostDropPrivateState>;

  constructor() {
    const initial = this.contract.initialState(
      createConstructorContext(createGhostDropPrivateState(this.adminSecret), '0'.repeat(64)),
    );
    this.context = createCircuitContext(
      sampleContractAddress(),
      initial.currentZswapLocalState,
      initial.currentContractState,
      initial.currentPrivateState,
      undefined,
      undefined,
      Number(NOW),
    );
    this.registerOrganization();
  }

  get state(): Ledger {
    return ledger(this.context.currentQueryContext.state);
  }

  setSecret(secret: Uint8Array): void {
    this.context = {
      ...this.context,
      currentPrivateState: {
        ...this.context.currentPrivateState,
        userSecret: secret,
      },
    };
  }

  setCredential(secret = this.reporterSecret, department = 2n, validityEpoch = 1n): MembershipCredential {
    const credential: MembershipCredential = {
      organizationId: this.organizationId,
      subject: pureCircuits.deriveCredentialSubject(secret),
      department,
      employmentStartedAt: NOW - 3n * YEAR,
      validityEpoch,
    };
    const signature = sign(
      this.issuerSecret,
      pureCircuits.credentialMessage(
        credential.organizationId,
        credential.subject,
        credential.department,
        credential.employmentStartedAt,
        credential.validityEpoch,
      ),
    );
    this.context = {
      ...this.context,
      currentPrivateState: {
        ...this.context.currentPrivateState,
        userSecret: secret,
        credential,
        credentialSignature: signature,
      },
    };
    return credential;
  }

  registerOrganization(): void {
    this.context = this.contract.impureCircuits.registerOrganization(
      this.context,
      this.organizationId,
      'Northstar Labs',
      'blob:organization-metadata',
      bytes(91),
      this.issuerPublicKey,
    ).context;
  }

  createCase(category = 2n): bigint {
    this.setCredential();
    const result = this.contract.impureCircuits.createAnonymousCase(
      this.context,
      this.organizationId,
      'blob:encrypted-report',
      bytes(101),
      bytes(121),
      category,
      3n,
      NOW,
    );
    this.context = result.context;
    return result.result;
  }
}

describe('GhostDrop Compact contract', () => {
  it('registers organizations and derives a secret-bound administrator', () => {
    const simulator = new GhostDropSimulator();
    expect(simulator.state.organizations.size()).toBe(1n);
    expect(simulator.state.organizations.lookup(simulator.organizationId).name).toBe('Northstar Labs');
    expect(simulator.state.reportEpochs.lookup(simulator.organizationId)).toBe(1n);
    expect(simulator.state.credentialEpochs.lookup(simulator.organizationId)).toBe(1n);
  });

  it('accepts an attested employee without revealing the credential and creates a receipt', () => {
    const simulator = new GhostDropSimulator();
    const caseId = simulator.createCase();
    const record = simulator.state.cases.lookup(caseId);

    expect(caseId).toBe(1n);
    expect(record.status).toBe(CaseStatus.Submitted);
    expect(record.payloadRef).toBe('blob:encrypted-report');
    expect(record.reportCommitment).toEqual(bytes(101));
    expect(simulator.state.usedNullifiers.size()).toBe(1n);
  });

  it('rejects a forged membership signature', () => {
    const simulator = new GhostDropSimulator();
    simulator.setCredential();
    simulator.context = {
      ...simulator.context,
      currentPrivateState: {
        ...simulator.context.currentPrivateState,
        credentialSignature: sign(999999n, pureCircuits.credentialMessage(
          simulator.context.currentPrivateState.credential.organizationId,
          simulator.context.currentPrivateState.credential.subject,
          simulator.context.currentPrivateState.credential.department,
          simulator.context.currentPrivateState.credential.employmentStartedAt,
          simulator.context.currentPrivateState.credential.validityEpoch,
        )),
      },
    };

    expect(() => simulator.contract.impureCircuits.createAnonymousCase(
      simulator.context,
      simulator.organizationId,
      'blob:forged',
      bytes(1),
      bytes(2),
      1n,
      1n,
      NOW,
    )).toThrow('Invalid membership credential');
  });

  it('prevents a second report from the same credential in the same policy epoch', () => {
    const simulator = new GhostDropSimulator();
    simulator.createCase();

    expect(() => simulator.contract.impureCircuits.createAnonymousCase(
      simulator.context,
      simulator.organizationId,
      'blob:duplicate',
      bytes(2),
      bytes(3),
      2n,
      2n,
      NOW,
    )).toThrow('Reporter has already submitted in this epoch');
  });

  it('keeps the case inbox bound to its anonymous reporter secret', () => {
    const simulator = new GhostDropSimulator();
    const caseId = simulator.createCase();
    simulator.setSecret(bytes(200));

    expect(() => simulator.contract.impureCircuits.submitReporterContent(
      simulator.context,
      ReporterContentKind.Message,
      caseId,
      'blob:impostor-message',
      bytes(12),
      NOW,
    )).toThrow('Only the anonymous reporter');
  });

  it('enforces investigator category scopes and records forward-only status history', () => {
    const simulator = new GhostDropSimulator();
    const caseId = simulator.createCase(2n);
    const scopedInvestigator = bytes(155);
    const investigatorKey = pureCircuits.deriveInvestigatorKey(scopedInvestigator, simulator.organizationId);

    simulator.setSecret(simulator.adminSecret);
    simulator.context = simulator.contract.impureCircuits.manageOrganization(
      simulator.context,
      OrganizationAction.AddInvestigator,
      simulator.organizationId,
      '',
      EMPTY_COMMITMENT,
      false,
      investigatorKey,
      2n,
    ).context;
    simulator.setSecret(scopedInvestigator);
    simulator.context = simulator.contract.impureCircuits.submitInvestigatorAction(
      simulator.context,
      InvestigatorAction.AdvanceStatus,
      caseId,
      '',
      EMPTY_COMMITMENT,
      CaseStatus.Acknowledged,
      NOW,
    ).context;
    simulator.context = simulator.contract.impureCircuits.submitInvestigatorAction(
      simulator.context,
      InvestigatorAction.AdvanceStatus,
      caseId,
      '',
      EMPTY_COMMITMENT,
      CaseStatus.UnderInvestigation,
      NOW,
    ).context;

    expect(simulator.state.cases.lookup(caseId).status).toBe(CaseStatus.UnderInvestigation);
    expect(simulator.state.statusEvents.size()).toBe(2n);
    expect(() => simulator.contract.impureCircuits.submitInvestigatorAction(
      simulator.context,
      InvestigatorAction.AdvanceStatus,
      caseId,
      '',
      EMPTY_COMMITMENT,
      CaseStatus.Resolved,
      NOW,
    )).toThrow('Case status must advance exactly one step');
  });

  it('rejects an investigator whose category scope does not match the case', () => {
    const simulator = new GhostDropSimulator();
    const caseId = simulator.createCase(1n);
    const scopedInvestigator = bytes(166);
    const investigatorKey = pureCircuits.deriveInvestigatorKey(scopedInvestigator, simulator.organizationId);
    simulator.setSecret(simulator.adminSecret);
    simulator.context = simulator.contract.impureCircuits.manageOrganization(
      simulator.context,
      OrganizationAction.AddInvestigator,
      simulator.organizationId,
      '',
      EMPTY_COMMITMENT,
      false,
      investigatorKey,
      2n,
    ).context;
    simulator.setSecret(scopedInvestigator);

    expect(() => simulator.contract.impureCircuits.submitInvestigatorAction(
      simulator.context,
      InvestigatorAction.Message,
      caseId,
      'blob:unauthorized',
      bytes(90),
      CaseStatus.Submitted,
      NOW,
    )).toThrow('not authorized for this category');
  });

  it('selectively proves department and tenure while retaining all other credential fields privately', () => {
    const simulator = new GhostDropSimulator();
    const caseId = simulator.createCase();
    simulator.context = simulator.contract.impureCircuits.proveFact(
      simulator.context,
      DisclosureKind.Department,
      caseId,
      2n,
      0n,
    ).context;
    simulator.context = simulator.contract.impureCircuits.proveFact(
      simulator.context,
      DisclosureKind.Tenure,
      caseId,
      2n,
      NOW,
    ).context;

    const record = simulator.state.cases.lookup(caseId);
    expect(record.hasDepartmentProof).toBe(true);
    expect(record.departmentProof).toBe(2n);
    expect(record.tenureProof).toBe(2n);
  });

  it('invalidates all prior credentials when the administrator advances the shared epoch', () => {
    const simulator = new GhostDropSimulator();
    simulator.setCredential();
    simulator.setSecret(simulator.adminSecret);
    simulator.context = simulator.contract.impureCircuits.manageOrganization(
      simulator.context,
      OrganizationAction.AdvanceCredentialEpoch,
      simulator.organizationId,
      '',
      EMPTY_COMMITMENT,
      false,
      EMPTY_COMMITMENT,
      0n,
    ).context;
    expect(simulator.state.credentialEpochs.lookup(simulator.organizationId)).toBe(2n);

    simulator.setCredential(simulator.reporterSecret, 2n, 1n);
    expect(() => simulator.contract.impureCircuits.createAnonymousCase(
      simulator.context,
      simulator.organizationId,
      'blob:stale-credential',
      bytes(4),
      bytes(5),
      2n,
      2n,
      NOW,
    )).toThrow('Credential is no longer valid');

    simulator.setCredential(simulator.reporterSecret, 2n, 2n);
    expect(simulator.contract.impureCircuits.createAnonymousCase(
      simulator.context,
      simulator.organizationId,
      'blob:current-credential',
      bytes(6),
      bytes(7),
      2n,
      2n,
      NOW,
    ).result).toBe(1n);
  });

  it('rotates organization encryption metadata only for the administrator', () => {
    const simulator = new GhostDropSimulator();
    simulator.context = simulator.contract.impureCircuits.manageOrganization(
      simulator.context,
      OrganizationAction.UpdateMetadata,
      simulator.organizationId,
      'blob:rotated-metadata',
      bytes(222),
      false,
      EMPTY_COMMITMENT,
      0n,
    ).context;
    const organization = simulator.state.organizations.lookup(simulator.organizationId);
    expect(organization.metadataRef).toBe('blob:rotated-metadata');
    expect(organization.encryptionKeyHash).toEqual(bytes(222));
    expect(organization.issuerKey).toEqual(simulator.issuerPublicKey);

    simulator.setSecret(bytes(223));
    expect(() => simulator.contract.impureCircuits.manageOrganization(
      simulator.context,
      OrganizationAction.UpdateMetadata,
      simulator.organizationId,
      'blob:unauthorized-rotation',
      bytes(224),
      false,
      EMPTY_COMMITMENT,
      0n,
    )).toThrow('Only the organization admin');
  });

  it('rejects messages and evidence after close and only accepts stronger tenure proofs', () => {
    const simulator = new GhostDropSimulator();
    const caseId = simulator.createCase();
    simulator.context = simulator.contract.impureCircuits.proveFact(
      simulator.context,
      DisclosureKind.Tenure,
      caseId,
      2n,
      NOW,
    ).context;
    expect(() => simulator.contract.impureCircuits.proveFact(
      simulator.context,
      DisclosureKind.Tenure,
      caseId,
      1n,
      NOW,
    )).toThrow('Tenure proof must strictly increase');

    const investigatorSecret = bytes(180);
    const investigatorKey = pureCircuits.deriveInvestigatorKey(investigatorSecret, simulator.organizationId);
    simulator.setSecret(simulator.adminSecret);
    simulator.context = simulator.contract.impureCircuits.manageOrganization(
      simulator.context,
      OrganizationAction.AddInvestigator,
      simulator.organizationId,
      '',
      EMPTY_COMMITMENT,
      false,
      investigatorKey,
      0n,
    ).context;
    simulator.setSecret(investigatorSecret);
    for (const status of [
      CaseStatus.Acknowledged,
      CaseStatus.UnderInvestigation,
      CaseStatus.ActionRequired,
      CaseStatus.Resolved,
      CaseStatus.Closed,
    ]) {
      simulator.context = simulator.contract.impureCircuits.submitInvestigatorAction(
        simulator.context,
        InvestigatorAction.AdvanceStatus,
        caseId,
        '',
        EMPTY_COMMITMENT,
        status,
        NOW,
      ).context;
    }
    expect(() => simulator.contract.impureCircuits.submitInvestigatorAction(
      simulator.context,
      InvestigatorAction.Message,
      caseId,
      'blob:closed-investigator-message',
      bytes(181),
      CaseStatus.Submitted,
      NOW,
    )).toThrow('Closed cases cannot receive messages');

    simulator.setSecret(simulator.reporterSecret);
    expect(() => simulator.contract.impureCircuits.submitReporterContent(
      simulator.context,
      ReporterContentKind.Message,
      caseId,
      'blob:closed-reporter-message',
      bytes(182),
      NOW,
    )).toThrow('Closed cases cannot receive messages');
    expect(() => simulator.contract.impureCircuits.submitReporterContent(
      simulator.context,
      ReporterContentKind.Evidence,
      caseId,
      'blob:closed-evidence',
      bytes(183),
      NOW,
    )).toThrow('Closed cases cannot receive evidence');
  });
});
