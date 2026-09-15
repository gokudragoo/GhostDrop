import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { ContractAddress, JubjubPoint } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import {
  CaseStatus,
  CompiledGhostDropContract,
  DisclosureKind,
  InvestigatorAction,
  OrganizationAction,
  ReporterContentKind,
  type GhostDropPrivateState,
} from 'ghostdrop-contract';
import type { Logger } from 'pino';
import type { GhostDropProviders, DeployedGhostDropContract } from './common-types.js';
import { ghostDropPrivateStateId } from './common-types.js';

export type ChainReceipt = {
  readonly transactionId: string;
  readonly blockHeight: bigint;
};

const EMPTY_COMMITMENT = new Uint8Array(32);

const receipt = (tx: { public: object }): ChainReceipt => {
  const data = tx.public as { txId?: unknown; txHash?: unknown; blockHeight?: unknown };
  return {
    transactionId: String(data.txId ?? data.txHash ?? ''),
    blockHeight: BigInt(String(data.blockHeight ?? 0)),
  };
};

export class GhostDropAPI {
  private constructor(
    readonly deployedContract: DeployedGhostDropContract,
    private readonly providers: GhostDropProviders,
    private readonly logger?: Logger,
  ) {
    providers.privateStateProvider.setContractAddress(this.contractAddress);
  }

  get contractAddress(): ContractAddress {
    return this.deployedContract.deployTxData.public.contractAddress;
  }

  static async deploy(
    providers: GhostDropProviders,
    initialPrivateState: GhostDropPrivateState,
    logger?: Logger,
  ): Promise<GhostDropAPI> {
    const deployed = await deployContract(providers, {
      compiledContract: CompiledGhostDropContract,
      privateStateId: ghostDropPrivateStateId,
      initialPrivateState,
    });
    return new GhostDropAPI(deployed, providers, logger);
  }

  static async join(
    providers: GhostDropProviders,
    address: ContractAddress,
    initialPrivateState: GhostDropPrivateState,
    logger?: Logger,
  ): Promise<GhostDropAPI> {
    const deployed = await findDeployedContract(providers, {
      contractAddress: address,
      compiledContract: CompiledGhostDropContract,
      privateStateId: ghostDropPrivateStateId,
      initialPrivateState,
    });
    return new GhostDropAPI(deployed, providers, logger);
  }

  async setPrivateState(state: GhostDropPrivateState): Promise<void> {
    this.providers.privateStateProvider.setContractAddress(this.contractAddress);
    await this.providers.privateStateProvider.set(ghostDropPrivateStateId, state);
  }

  observeState() {
    return this.providers.publicDataProvider.contractStateObservable(this.contractAddress, { type: 'latest' });
  }

  async registerOrganization(organizationId: Uint8Array, name: string, metadataRef: string, encryptionKeyHash: Uint8Array, issuerKey: JubjubPoint): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.registerOrganization(organizationId, name, metadataRef, encryptionKeyHash, issuerKey));
  }

  async setOrganizationActive(organizationId: Uint8Array, active: boolean): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.manageOrganization(
      OrganizationAction.SetActive, organizationId, '', EMPTY_COMMITMENT, active, EMPTY_COMMITMENT, 0n,
    ));
  }

  async updateOrganizationMetadata(organizationId: Uint8Array, metadataRef: string, encryptionKeyHash: Uint8Array): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.manageOrganization(
      OrganizationAction.UpdateMetadata, organizationId, metadataRef, encryptionKeyHash, false, EMPTY_COMMITMENT, 0n,
    ));
  }

  async addInvestigator(organizationId: Uint8Array, investigatorKey: Uint8Array, categoryScope: bigint): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.manageOrganization(
      OrganizationAction.AddInvestigator, organizationId, '', EMPTY_COMMITMENT, false, investigatorKey, categoryScope,
    ));
  }

  async removeInvestigator(organizationId: Uint8Array, investigatorKey: Uint8Array): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.manageOrganization(
      OrganizationAction.RemoveInvestigator, organizationId, '', EMPTY_COMMITMENT, false, investigatorKey, 0n,
    ));
  }

  async advanceReportingEpoch(organizationId: Uint8Array): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.manageOrganization(
      OrganizationAction.AdvanceReportingEpoch, organizationId, '', EMPTY_COMMITMENT, false, EMPTY_COMMITMENT, 0n,
    ));
  }

  async advanceCredentialEpoch(organizationId: Uint8Array): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.manageOrganization(
      OrganizationAction.AdvanceCredentialEpoch, organizationId, '', EMPTY_COMMITMENT, false, EMPTY_COMMITMENT, 0n,
    ));
  }

  async createAnonymousCase(organizationId: Uint8Array, payloadRef: string, reportCommitment: Uint8Array, evidenceCommitment: Uint8Array, category: bigint, urgency: bigint, submittedAt: bigint): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.createAnonymousCase(organizationId, payloadRef, reportCommitment, evidenceCommitment, category, urgency, submittedAt));
  }

  async submitReporterMessage(caseId: bigint, payloadRef: string, payloadCommitment: Uint8Array, sentAt: bigint): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.submitReporterContent(
      ReporterContentKind.Message, caseId, payloadRef, payloadCommitment, sentAt,
    ));
  }

  async submitInvestigatorMessage(caseId: bigint, payloadRef: string, payloadCommitment: Uint8Array, sentAt: bigint): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.submitInvestigatorAction(
      InvestigatorAction.Message, caseId, payloadRef, payloadCommitment, CaseStatus.Submitted, sentAt,
    ));
  }

  async addReporterEvidence(caseId: bigint, payloadRef: string, commitment: Uint8Array, submittedAt: bigint): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.submitReporterContent(
      ReporterContentKind.Evidence, caseId, payloadRef, commitment, submittedAt,
    ));
  }

  async updateCaseStatus(caseId: bigint, status: CaseStatus, timestamp: bigint): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.submitInvestigatorAction(
      InvestigatorAction.AdvanceStatus, caseId, '', EMPTY_COMMITMENT, status, timestamp,
    ));
  }

  async proveDepartment(caseId: bigint, department: bigint): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.proveFact(
      DisclosureKind.Department, caseId, department, 0n,
    ));
  }

  async proveTenure(caseId: bigint, minimumYears: bigint, verifiedAt: bigint): Promise<ChainReceipt> {
    return receipt(await this.deployedContract.callTx.proveFact(
      DisclosureKind.Tenure, caseId, minimumYears, verifiedAt,
    ));
  }
}
