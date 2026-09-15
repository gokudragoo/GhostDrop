import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum CaseStatus { Submitted = 0,
                         Acknowledged = 1,
                         UnderInvestigation = 2,
                         ActionRequired = 3,
                         Resolved = 4,
                         Closed = 5
}

export enum OrganizationAction { UpdateMetadata = 0,
                                 SetActive = 1,
                                 AddInvestigator = 2,
                                 RemoveInvestigator = 3,
                                 AdvanceReportingEpoch = 4,
                                 AdvanceCredentialEpoch = 5
}

export enum ReporterContentKind { Message = 0, Evidence = 1 }

export enum InvestigatorAction { Message = 0, AdvanceStatus = 1 }

export enum DisclosureKind { Department = 0, Tenure = 1 }

export type MembershipCredential = { organizationId: Uint8Array;
                                     subject: Uint8Array;
                                     department: bigint;
                                     employmentStartedAt: bigint;
                                     validityEpoch: bigint
                                   };

export type Organization = { name: string;
                             metadataRef: string;
                             encryptionKeyHash: Uint8Array;
                             adminKey: Uint8Array;
                             issuerKey: __compactRuntime.JubjubPoint;
                             active: boolean
                           };

export type CaseRecord = { organizationId: Uint8Array;
                           reporterKey: Uint8Array;
                           nullifier: Uint8Array;
                           payloadRef: string;
                           reportCommitment: Uint8Array;
                           evidenceCommitment: Uint8Array;
                           category: bigint;
                           urgency: bigint;
                           status: CaseStatus;
                           submittedAt: bigint;
                           departmentProof: bigint;
                           hasDepartmentProof: boolean;
                           tenureProof: bigint
                         };

export type MessageRecord = { caseId: bigint;
                              payloadRef: string;
                              payloadCommitment: Uint8Array;
                              authorRole: bigint;
                              sentAt: bigint
                            };

export type EvidenceRecord = { caseId: bigint;
                               payloadRef: string;
                               commitment: Uint8Array;
                               authorRole: bigint;
                               submittedAt: bigint
                             };

export type StatusEvent = { caseId: bigint;
                            fromStatus: CaseStatus;
                            toStatus: CaseStatus;
                            changedAt: bigint
                          };

export type Schnorr_SchnorrSignature = { announcement: __compactRuntime.JubjubPoint;
                                         response: bigint
                                       };

export type Witnesses<PS> = {
  getSchnorrReduction(context: __compactRuntime.WitnessContext<Ledger, PS>,
                      challengeHash_0: bigint): [PS, [bigint, bigint]];
  getMembershipWitness(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, [MembershipCredential,
                                                                                    Schnorr_SchnorrSignature]];
  getUserSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  registerOrganization(context: __compactRuntime.CircuitContext<PS>,
                       organizationId_0: Uint8Array,
                       name_0: string,
                       metadataRef_0: string,
                       encryptionKeyHash_0: Uint8Array,
                       issuerKey_0: __compactRuntime.JubjubPoint): __compactRuntime.CircuitResults<PS, []>;
  createAnonymousCase(context: __compactRuntime.CircuitContext<PS>,
                      organizationId_0: Uint8Array,
                      payloadRef_0: string,
                      reportCommitment_0: Uint8Array,
                      evidenceCommitment_0: Uint8Array,
                      category_0: bigint,
                      urgency_0: bigint,
                      submittedAt_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  manageOrganization(context: __compactRuntime.CircuitContext<PS>,
                     action_0: OrganizationAction,
                     organizationId_0: Uint8Array,
                     metadataRef_0: string,
                     encryptionKeyHash_0: Uint8Array,
                     active_0: boolean,
                     investigatorKey_0: Uint8Array,
                     categoryScope_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitReporterContent(context: __compactRuntime.CircuitContext<PS>,
                        kind_0: ReporterContentKind,
                        caseId_0: bigint,
                        payloadRef_0: string,
                        commitment_0: Uint8Array,
                        submittedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitInvestigatorAction(context: __compactRuntime.CircuitContext<PS>,
                           action_0: InvestigatorAction,
                           caseId_0: bigint,
                           payloadRef_0: string,
                           commitment_0: Uint8Array,
                           nextStatus_0: CaseStatus,
                           submittedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveFact(context: __compactRuntime.CircuitContext<PS>,
            kind_0: DisclosureKind,
            caseId_0: bigint,
            value_0: bigint,
            verifiedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  registerOrganization(context: __compactRuntime.CircuitContext<PS>,
                       organizationId_0: Uint8Array,
                       name_0: string,
                       metadataRef_0: string,
                       encryptionKeyHash_0: Uint8Array,
                       issuerKey_0: __compactRuntime.JubjubPoint): __compactRuntime.CircuitResults<PS, []>;
  createAnonymousCase(context: __compactRuntime.CircuitContext<PS>,
                      organizationId_0: Uint8Array,
                      payloadRef_0: string,
                      reportCommitment_0: Uint8Array,
                      evidenceCommitment_0: Uint8Array,
                      category_0: bigint,
                      urgency_0: bigint,
                      submittedAt_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  manageOrganization(context: __compactRuntime.CircuitContext<PS>,
                     action_0: OrganizationAction,
                     organizationId_0: Uint8Array,
                     metadataRef_0: string,
                     encryptionKeyHash_0: Uint8Array,
                     active_0: boolean,
                     investigatorKey_0: Uint8Array,
                     categoryScope_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitReporterContent(context: __compactRuntime.CircuitContext<PS>,
                        kind_0: ReporterContentKind,
                        caseId_0: bigint,
                        payloadRef_0: string,
                        commitment_0: Uint8Array,
                        submittedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitInvestigatorAction(context: __compactRuntime.CircuitContext<PS>,
                           action_0: InvestigatorAction,
                           caseId_0: bigint,
                           payloadRef_0: string,
                           commitment_0: Uint8Array,
                           nextStatus_0: CaseStatus,
                           submittedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveFact(context: __compactRuntime.CircuitContext<PS>,
            kind_0: DisclosureKind,
            caseId_0: bigint,
            value_0: bigint,
            verifiedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  deriveCredentialSubject(secret_0: Uint8Array): Uint8Array;
  deriveAdminKey(secret_0: Uint8Array, organizationId_0: Uint8Array): Uint8Array;
  deriveInvestigatorKey(secret_0: Uint8Array, organizationId_0: Uint8Array): Uint8Array;
  deriveReporterKey(secret_0: Uint8Array,
                    organizationId_0: Uint8Array,
                    caseId_0: bigint): Uint8Array;
  deriveReportNullifier(secret_0: Uint8Array,
                        organizationId_0: Uint8Array,
                        epoch_0: bigint): Uint8Array;
  credentialMessage(organizationId_0: Uint8Array,
                    subject_0: Uint8Array,
                    department_0: bigint,
                    employmentStartedAt_0: bigint,
                    validityEpoch_0: bigint): bigint[];
  schnorrChallenge(ann_x_0: bigint,
                   ann_y_0: bigint,
                   pk_x_0: bigint,
                   pk_y_0: bigint,
                   msg_0: bigint[]): bigint;
}

export type Circuits<PS> = {
  deriveCredentialSubject(context: __compactRuntime.CircuitContext<PS>,
                          secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  deriveAdminKey(context: __compactRuntime.CircuitContext<PS>,
                 secret_0: Uint8Array,
                 organizationId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  deriveInvestigatorKey(context: __compactRuntime.CircuitContext<PS>,
                        secret_0: Uint8Array,
                        organizationId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  deriveReporterKey(context: __compactRuntime.CircuitContext<PS>,
                    secret_0: Uint8Array,
                    organizationId_0: Uint8Array,
                    caseId_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  deriveReportNullifier(context: __compactRuntime.CircuitContext<PS>,
                        secret_0: Uint8Array,
                        organizationId_0: Uint8Array,
                        epoch_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  credentialMessage(context: __compactRuntime.CircuitContext<PS>,
                    organizationId_0: Uint8Array,
                    subject_0: Uint8Array,
                    department_0: bigint,
                    employmentStartedAt_0: bigint,
                    validityEpoch_0: bigint): __compactRuntime.CircuitResults<PS, bigint[]>;
  schnorrChallenge(context: __compactRuntime.CircuitContext<PS>,
                   ann_x_0: bigint,
                   ann_y_0: bigint,
                   pk_x_0: bigint,
                   pk_y_0: bigint,
                   msg_0: bigint[]): __compactRuntime.CircuitResults<PS, bigint>;
  registerOrganization(context: __compactRuntime.CircuitContext<PS>,
                       organizationId_0: Uint8Array,
                       name_0: string,
                       metadataRef_0: string,
                       encryptionKeyHash_0: Uint8Array,
                       issuerKey_0: __compactRuntime.JubjubPoint): __compactRuntime.CircuitResults<PS, []>;
  createAnonymousCase(context: __compactRuntime.CircuitContext<PS>,
                      organizationId_0: Uint8Array,
                      payloadRef_0: string,
                      reportCommitment_0: Uint8Array,
                      evidenceCommitment_0: Uint8Array,
                      category_0: bigint,
                      urgency_0: bigint,
                      submittedAt_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  manageOrganization(context: __compactRuntime.CircuitContext<PS>,
                     action_0: OrganizationAction,
                     organizationId_0: Uint8Array,
                     metadataRef_0: string,
                     encryptionKeyHash_0: Uint8Array,
                     active_0: boolean,
                     investigatorKey_0: Uint8Array,
                     categoryScope_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitReporterContent(context: __compactRuntime.CircuitContext<PS>,
                        kind_0: ReporterContentKind,
                        caseId_0: bigint,
                        payloadRef_0: string,
                        commitment_0: Uint8Array,
                        submittedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitInvestigatorAction(context: __compactRuntime.CircuitContext<PS>,
                           action_0: InvestigatorAction,
                           caseId_0: bigint,
                           payloadRef_0: string,
                           commitment_0: Uint8Array,
                           nextStatus_0: CaseStatus,
                           submittedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveFact(context: __compactRuntime.CircuitContext<PS>,
            kind_0: DisclosureKind,
            caseId_0: bigint,
            value_0: bigint,
            verifiedAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  organizations: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Organization;
    [Symbol.iterator](): Iterator<[Uint8Array, Organization]>
  };
  reportEpochs: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  credentialEpochs: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  investigatorPermissions: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): {
      isEmpty(): boolean;
      size(): bigint;
      member(key_1: Uint8Array): boolean;
      lookup(key_1: Uint8Array): bigint;
      [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
    }
  };
  usedNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  cases: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): CaseRecord;
    [Symbol.iterator](): Iterator<[bigint, CaseRecord]>
  };
  messages: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): MessageRecord;
    [Symbol.iterator](): Iterator<[bigint, MessageRecord]>
  };
  evidence: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): EvidenceRecord;
    [Symbol.iterator](): Iterator<[bigint, EvidenceRecord]>
  };
  statusEvents: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): StatusEvent;
    [Symbol.iterator](): Iterator<[bigint, StatusEvent]>
  };
  readonly caseSequence: bigint;
  readonly messageSequence: bigint;
  readonly evidenceSequence: bigint;
  readonly statusSequence: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
