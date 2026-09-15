import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

export var CaseStatus;
(function (CaseStatus) {
  CaseStatus[CaseStatus['Submitted'] = 0] = 'Submitted';
  CaseStatus[CaseStatus['Acknowledged'] = 1] = 'Acknowledged';
  CaseStatus[CaseStatus['UnderInvestigation'] = 2] = 'UnderInvestigation';
  CaseStatus[CaseStatus['ActionRequired'] = 3] = 'ActionRequired';
  CaseStatus[CaseStatus['Resolved'] = 4] = 'Resolved';
  CaseStatus[CaseStatus['Closed'] = 5] = 'Closed';
})(CaseStatus || (CaseStatus = {}));

export var OrganizationAction;
(function (OrganizationAction) {
  OrganizationAction[OrganizationAction['UpdateMetadata'] = 0] = 'UpdateMetadata';
  OrganizationAction[OrganizationAction['SetActive'] = 1] = 'SetActive';
  OrganizationAction[OrganizationAction['AddInvestigator'] = 2] = 'AddInvestigator';
  OrganizationAction[OrganizationAction['RemoveInvestigator'] = 3] = 'RemoveInvestigator';
  OrganizationAction[OrganizationAction['AdvanceReportingEpoch'] = 4] = 'AdvanceReportingEpoch';
  OrganizationAction[OrganizationAction['AdvanceCredentialEpoch'] = 5] = 'AdvanceCredentialEpoch';
})(OrganizationAction || (OrganizationAction = {}));

export var ReporterContentKind;
(function (ReporterContentKind) {
  ReporterContentKind[ReporterContentKind['Message'] = 0] = 'Message';
  ReporterContentKind[ReporterContentKind['Evidence'] = 1] = 'Evidence';
})(ReporterContentKind || (ReporterContentKind = {}));

export var InvestigatorAction;
(function (InvestigatorAction) {
  InvestigatorAction[InvestigatorAction['Message'] = 0] = 'Message';
  InvestigatorAction[InvestigatorAction['AdvanceStatus'] = 1] = 'AdvanceStatus';
})(InvestigatorAction || (InvestigatorAction = {}));

export var DisclosureKind;
(function (DisclosureKind) {
  DisclosureKind[DisclosureKind['Department'] = 0] = 'Department';
  DisclosureKind[DisclosureKind['Tenure'] = 1] = 'Tenure';
})(DisclosureKind || (DisclosureKind = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeEnum(1, 1);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_3 = new __compactRuntime.CompactTypeEnum(1, 1);

const _descriptor_4 = __compactRuntime.CompactTypeOpaqueString;

const _descriptor_5 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_6 = new __compactRuntime.CompactTypeEnum(1, 1);

const _descriptor_7 = new __compactRuntime.CompactTypeEnum(5, 1);

const _descriptor_8 = __compactRuntime.CompactTypeBoolean;

class _CaseRecord_0 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_5.alignment().concat(_descriptor_5.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_5.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_7.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_8.alignment().concat(_descriptor_2.alignment()))))))))))));
  }
  fromValue(value_0) {
    return {
      organizationId: _descriptor_5.fromValue(value_0),
      reporterKey: _descriptor_5.fromValue(value_0),
      nullifier: _descriptor_5.fromValue(value_0),
      payloadRef: _descriptor_4.fromValue(value_0),
      reportCommitment: _descriptor_5.fromValue(value_0),
      evidenceCommitment: _descriptor_5.fromValue(value_0),
      category: _descriptor_2.fromValue(value_0),
      urgency: _descriptor_2.fromValue(value_0),
      status: _descriptor_7.fromValue(value_0),
      submittedAt: _descriptor_1.fromValue(value_0),
      departmentProof: _descriptor_2.fromValue(value_0),
      hasDepartmentProof: _descriptor_8.fromValue(value_0),
      tenureProof: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.organizationId).concat(_descriptor_5.toValue(value_0.reporterKey).concat(_descriptor_5.toValue(value_0.nullifier).concat(_descriptor_4.toValue(value_0.payloadRef).concat(_descriptor_5.toValue(value_0.reportCommitment).concat(_descriptor_5.toValue(value_0.evidenceCommitment).concat(_descriptor_2.toValue(value_0.category).concat(_descriptor_2.toValue(value_0.urgency).concat(_descriptor_7.toValue(value_0.status).concat(_descriptor_1.toValue(value_0.submittedAt).concat(_descriptor_2.toValue(value_0.departmentProof).concat(_descriptor_8.toValue(value_0.hasDepartmentProof).concat(_descriptor_2.toValue(value_0.tenureProof)))))))))))));
  }
}

const _descriptor_9 = new _CaseRecord_0();

const _descriptor_10 = new __compactRuntime.CompactTypeEnum(5, 1);

class _StatusEvent_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_7.alignment().concat(_descriptor_7.alignment().concat(_descriptor_1.alignment())));
  }
  fromValue(value_0) {
    return {
      caseId: _descriptor_1.fromValue(value_0),
      fromStatus: _descriptor_7.fromValue(value_0),
      toStatus: _descriptor_7.fromValue(value_0),
      changedAt: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.caseId).concat(_descriptor_7.toValue(value_0.fromStatus).concat(_descriptor_7.toValue(value_0.toStatus).concat(_descriptor_1.toValue(value_0.changedAt))));
  }
}

const _descriptor_11 = new _StatusEvent_0();

const _descriptor_12 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _MessageRecord_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_2.alignment().concat(_descriptor_1.alignment()))));
  }
  fromValue(value_0) {
    return {
      caseId: _descriptor_1.fromValue(value_0),
      payloadRef: _descriptor_4.fromValue(value_0),
      payloadCommitment: _descriptor_5.fromValue(value_0),
      authorRole: _descriptor_2.fromValue(value_0),
      sentAt: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.caseId).concat(_descriptor_4.toValue(value_0.payloadRef).concat(_descriptor_5.toValue(value_0.payloadCommitment).concat(_descriptor_2.toValue(value_0.authorRole).concat(_descriptor_1.toValue(value_0.sentAt)))));
  }
}

const _descriptor_13 = new _MessageRecord_0();

class _EvidenceRecord_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_2.alignment().concat(_descriptor_1.alignment()))));
  }
  fromValue(value_0) {
    return {
      caseId: _descriptor_1.fromValue(value_0),
      payloadRef: _descriptor_4.fromValue(value_0),
      commitment: _descriptor_5.fromValue(value_0),
      authorRole: _descriptor_2.fromValue(value_0),
      submittedAt: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.caseId).concat(_descriptor_4.toValue(value_0.payloadRef).concat(_descriptor_5.toValue(value_0.commitment).concat(_descriptor_2.toValue(value_0.authorRole).concat(_descriptor_1.toValue(value_0.submittedAt)))));
  }
}

const _descriptor_14 = new _EvidenceRecord_0();

const _descriptor_15 = __compactRuntime.CompactTypeJubjubPoint;

class _Organization_0 {
  alignment() {
    return _descriptor_4.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_5.alignment().concat(_descriptor_15.alignment().concat(_descriptor_8.alignment())))));
  }
  fromValue(value_0) {
    return {
      name: _descriptor_4.fromValue(value_0),
      metadataRef: _descriptor_4.fromValue(value_0),
      encryptionKeyHash: _descriptor_5.fromValue(value_0),
      adminKey: _descriptor_5.fromValue(value_0),
      issuerKey: _descriptor_15.fromValue(value_0),
      active: _descriptor_8.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_4.toValue(value_0.name).concat(_descriptor_4.toValue(value_0.metadataRef).concat(_descriptor_5.toValue(value_0.encryptionKeyHash).concat(_descriptor_5.toValue(value_0.adminKey).concat(_descriptor_15.toValue(value_0.issuerKey).concat(_descriptor_8.toValue(value_0.active))))));
  }
}

const _descriptor_16 = new _Organization_0();

class _MembershipCredential_0 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_5.alignment().concat(_descriptor_2.alignment().concat(_descriptor_1.alignment().concat(_descriptor_12.alignment()))));
  }
  fromValue(value_0) {
    return {
      organizationId: _descriptor_5.fromValue(value_0),
      subject: _descriptor_5.fromValue(value_0),
      department: _descriptor_2.fromValue(value_0),
      employmentStartedAt: _descriptor_1.fromValue(value_0),
      validityEpoch: _descriptor_12.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.organizationId).concat(_descriptor_5.toValue(value_0.subject).concat(_descriptor_2.toValue(value_0.department).concat(_descriptor_1.toValue(value_0.employmentStartedAt).concat(_descriptor_12.toValue(value_0.validityEpoch)))));
  }
}

const _descriptor_17 = new _MembershipCredential_0();

const _descriptor_18 = __compactRuntime.CompactTypeField;

const _descriptor_19 = new __compactRuntime.CompactTypeVector(5, _descriptor_18);

class _SchnorrSignature_0 {
  alignment() {
    return _descriptor_15.alignment().concat(_descriptor_18.alignment());
  }
  fromValue(value_0) {
    return {
      announcement: _descriptor_15.fromValue(value_0),
      response: _descriptor_18.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_15.toValue(value_0.announcement).concat(_descriptor_18.toValue(value_0.response));
  }
}

const _descriptor_20 = new _SchnorrSignature_0();

class _tuple_0 {
  alignment() {
    return _descriptor_17.alignment().concat(_descriptor_20.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_17.fromValue(value_0),
      _descriptor_20.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_17.toValue(value_0[0]).concat(_descriptor_20.toValue(value_0[1]));
  }
}

const _descriptor_21 = new _tuple_0();

const _descriptor_22 = new __compactRuntime.CompactTypeUnsignedInteger(127n, 1);

const _descriptor_23 = new __compactRuntime.CompactTypeUnsignedInteger(452312848583266388373324160190187140051835877600158453279131187530910662655n, 31);

class _tuple_1 {
  alignment() {
    return _descriptor_22.alignment().concat(_descriptor_23.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_22.fromValue(value_0),
      _descriptor_23.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_22.toValue(value_0[0]).concat(_descriptor_23.toValue(value_0[1]));
  }
}

const _descriptor_24 = new _tuple_1();

const _descriptor_25 = new __compactRuntime.CompactTypeVector(4, _descriptor_5);

const _descriptor_26 = new __compactRuntime.CompactTypeVector(3, _descriptor_5);

class _SchnorrHashInput_0 {
  alignment() {
    return _descriptor_18.alignment().concat(_descriptor_18.alignment().concat(_descriptor_18.alignment().concat(_descriptor_18.alignment().concat(_descriptor_19.alignment()))));
  }
  fromValue(value_0) {
    return {
      ann_x: _descriptor_18.fromValue(value_0),
      ann_y: _descriptor_18.fromValue(value_0),
      pk_x: _descriptor_18.fromValue(value_0),
      pk_y: _descriptor_18.fromValue(value_0),
      msg: _descriptor_19.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_18.toValue(value_0.ann_x).concat(_descriptor_18.toValue(value_0.ann_y).concat(_descriptor_18.toValue(value_0.pk_x).concat(_descriptor_18.toValue(value_0.pk_y).concat(_descriptor_19.toValue(value_0.msg)))));
  }
}

const _descriptor_27 = new _SchnorrHashInput_0();

const _descriptor_28 = new __compactRuntime.CompactTypeVector(2, _descriptor_5);

class _Either_0 {
  alignment() {
    return _descriptor_8.alignment().concat(_descriptor_5.alignment().concat(_descriptor_5.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_8.fromValue(value_0),
      left: _descriptor_5.fromValue(value_0),
      right: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_8.toValue(value_0.is_left).concat(_descriptor_5.toValue(value_0.left).concat(_descriptor_5.toValue(value_0.right)));
  }
}

const _descriptor_29 = new _Either_0();

const _descriptor_30 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_5.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.bytes);
  }
}

const _descriptor_31 = new _ContractAddress_0();

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.getSchnorrReduction) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getSchnorrReduction');
    }
    if (typeof(witnesses_0.getMembershipWitness) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getMembershipWitness');
    }
    if (typeof(witnesses_0.getUserSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getUserSecret');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      deriveCredentialSubject(context, ...args_1) {
        return { result: pureCircuits.deriveCredentialSubject(...args_1), context };
      },
      deriveAdminKey(context, ...args_1) {
        return { result: pureCircuits.deriveAdminKey(...args_1), context };
      },
      deriveInvestigatorKey(context, ...args_1) {
        return { result: pureCircuits.deriveInvestigatorKey(...args_1), context };
      },
      deriveReporterKey(context, ...args_1) {
        return { result: pureCircuits.deriveReporterKey(...args_1), context };
      },
      deriveReportNullifier(context, ...args_1) {
        return { result: pureCircuits.deriveReportNullifier(...args_1), context };
      },
      credentialMessage(context, ...args_1) {
        return { result: pureCircuits.credentialMessage(...args_1), context };
      },
      schnorrChallenge(context, ...args_1) {
        return { result: pureCircuits.schnorrChallenge(...args_1), context };
      },
      registerOrganization: (...args_1) => {
        if (args_1.length !== 6) {
          throw new __compactRuntime.CompactError(`registerOrganization: expected 6 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const organizationId_0 = args_1[1];
        const name_0 = args_1[2];
        const metadataRef_0 = args_1[3];
        const encryptionKeyHash_0 = args_1[4];
        const issuerKey_0 = args_1[5];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('registerOrganization',
                                     'argument 1 (as invoked from Typescript)',
                                     'ghostdrop.compact line 255 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(organizationId_0.buffer instanceof ArrayBuffer && organizationId_0.BYTES_PER_ELEMENT === 1 && organizationId_0.length === 32)) {
          __compactRuntime.typeError('registerOrganization',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ghostdrop.compact line 255 char 1',
                                     'Bytes<32>',
                                     organizationId_0)
        }
        if (!(encryptionKeyHash_0.buffer instanceof ArrayBuffer && encryptionKeyHash_0.BYTES_PER_ELEMENT === 1 && encryptionKeyHash_0.length === 32)) {
          __compactRuntime.typeError('registerOrganization',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'ghostdrop.compact line 255 char 1',
                                     'Bytes<32>',
                                     encryptionKeyHash_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_5.toValue(organizationId_0).concat(_descriptor_4.toValue(name_0).concat(_descriptor_4.toValue(metadataRef_0).concat(_descriptor_5.toValue(encryptionKeyHash_0).concat(_descriptor_15.toValue(issuerKey_0))))),
            alignment: _descriptor_5.alignment().concat(_descriptor_4.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_15.alignment()))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._registerOrganization_0(context,
                                                      partialProofData,
                                                      organizationId_0,
                                                      name_0,
                                                      metadataRef_0,
                                                      encryptionKeyHash_0,
                                                      issuerKey_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      createAnonymousCase: (...args_1) => {
        if (args_1.length !== 8) {
          throw new __compactRuntime.CompactError(`createAnonymousCase: expected 8 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const organizationId_0 = args_1[1];
        const payloadRef_0 = args_1[2];
        const reportCommitment_0 = args_1[3];
        const evidenceCommitment_0 = args_1[4];
        const category_0 = args_1[5];
        const urgency_0 = args_1[6];
        const submittedAt_0 = args_1[7];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('createAnonymousCase',
                                     'argument 1 (as invoked from Typescript)',
                                     'ghostdrop.compact line 348 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(organizationId_0.buffer instanceof ArrayBuffer && organizationId_0.BYTES_PER_ELEMENT === 1 && organizationId_0.length === 32)) {
          __compactRuntime.typeError('createAnonymousCase',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ghostdrop.compact line 348 char 1',
                                     'Bytes<32>',
                                     organizationId_0)
        }
        if (!(reportCommitment_0.buffer instanceof ArrayBuffer && reportCommitment_0.BYTES_PER_ELEMENT === 1 && reportCommitment_0.length === 32)) {
          __compactRuntime.typeError('createAnonymousCase',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'ghostdrop.compact line 348 char 1',
                                     'Bytes<32>',
                                     reportCommitment_0)
        }
        if (!(evidenceCommitment_0.buffer instanceof ArrayBuffer && evidenceCommitment_0.BYTES_PER_ELEMENT === 1 && evidenceCommitment_0.length === 32)) {
          __compactRuntime.typeError('createAnonymousCase',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'ghostdrop.compact line 348 char 1',
                                     'Bytes<32>',
                                     evidenceCommitment_0)
        }
        if (!(typeof(category_0) === 'bigint' && category_0 >= 0n && category_0 <= 255n)) {
          __compactRuntime.typeError('createAnonymousCase',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'ghostdrop.compact line 348 char 1',
                                     'Uint<0..256>',
                                     category_0)
        }
        if (!(typeof(urgency_0) === 'bigint' && urgency_0 >= 0n && urgency_0 <= 255n)) {
          __compactRuntime.typeError('createAnonymousCase',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'ghostdrop.compact line 348 char 1',
                                     'Uint<0..256>',
                                     urgency_0)
        }
        if (!(typeof(submittedAt_0) === 'bigint' && submittedAt_0 >= 0n && submittedAt_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('createAnonymousCase',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'ghostdrop.compact line 348 char 1',
                                     'Uint<0..18446744073709551616>',
                                     submittedAt_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_5.toValue(organizationId_0).concat(_descriptor_4.toValue(payloadRef_0).concat(_descriptor_5.toValue(reportCommitment_0).concat(_descriptor_5.toValue(evidenceCommitment_0).concat(_descriptor_2.toValue(category_0).concat(_descriptor_2.toValue(urgency_0).concat(_descriptor_1.toValue(submittedAt_0))))))),
            alignment: _descriptor_5.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_5.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_1.alignment()))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._createAnonymousCase_0(context,
                                                     partialProofData,
                                                     organizationId_0,
                                                     payloadRef_0,
                                                     reportCommitment_0,
                                                     evidenceCommitment_0,
                                                     category_0,
                                                     urgency_0,
                                                     submittedAt_0);
        partialProofData.output = { value: _descriptor_1.toValue(result_0), alignment: _descriptor_1.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      manageOrganization: (...args_1) => {
        if (args_1.length !== 8) {
          throw new __compactRuntime.CompactError(`manageOrganization: expected 8 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const action_0 = args_1[1];
        const organizationId_0 = args_1[2];
        const metadataRef_0 = args_1[3];
        const encryptionKeyHash_0 = args_1[4];
        const active_0 = args_1[5];
        const investigatorKey_0 = args_1[6];
        const categoryScope_0 = args_1[7];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('manageOrganization',
                                     'argument 1 (as invoked from Typescript)',
                                     'ghostdrop.compact line 561 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(action_0) === 'number' && action_0 >= 0 && action_0 <= 5)) {
          __compactRuntime.typeError('manageOrganization',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ghostdrop.compact line 561 char 1',
                                     'Enum<OrganizationAction, UpdateMetadata, SetActive, AddInvestigator, RemoveInvestigator, AdvanceReportingEpoch, AdvanceCredentialEpoch>',
                                     action_0)
        }
        if (!(organizationId_0.buffer instanceof ArrayBuffer && organizationId_0.BYTES_PER_ELEMENT === 1 && organizationId_0.length === 32)) {
          __compactRuntime.typeError('manageOrganization',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'ghostdrop.compact line 561 char 1',
                                     'Bytes<32>',
                                     organizationId_0)
        }
        if (!(encryptionKeyHash_0.buffer instanceof ArrayBuffer && encryptionKeyHash_0.BYTES_PER_ELEMENT === 1 && encryptionKeyHash_0.length === 32)) {
          __compactRuntime.typeError('manageOrganization',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'ghostdrop.compact line 561 char 1',
                                     'Bytes<32>',
                                     encryptionKeyHash_0)
        }
        if (!(typeof(active_0) === 'boolean')) {
          __compactRuntime.typeError('manageOrganization',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'ghostdrop.compact line 561 char 1',
                                     'Boolean',
                                     active_0)
        }
        if (!(investigatorKey_0.buffer instanceof ArrayBuffer && investigatorKey_0.BYTES_PER_ELEMENT === 1 && investigatorKey_0.length === 32)) {
          __compactRuntime.typeError('manageOrganization',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'ghostdrop.compact line 561 char 1',
                                     'Bytes<32>',
                                     investigatorKey_0)
        }
        if (!(typeof(categoryScope_0) === 'bigint' && categoryScope_0 >= 0n && categoryScope_0 <= 255n)) {
          __compactRuntime.typeError('manageOrganization',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'ghostdrop.compact line 561 char 1',
                                     'Uint<0..256>',
                                     categoryScope_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_10.toValue(action_0).concat(_descriptor_5.toValue(organizationId_0).concat(_descriptor_4.toValue(metadataRef_0).concat(_descriptor_5.toValue(encryptionKeyHash_0).concat(_descriptor_8.toValue(active_0).concat(_descriptor_5.toValue(investigatorKey_0).concat(_descriptor_2.toValue(categoryScope_0))))))),
            alignment: _descriptor_10.alignment().concat(_descriptor_5.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_8.alignment().concat(_descriptor_5.alignment().concat(_descriptor_2.alignment()))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._manageOrganization_0(context,
                                                    partialProofData,
                                                    action_0,
                                                    organizationId_0,
                                                    metadataRef_0,
                                                    encryptionKeyHash_0,
                                                    active_0,
                                                    investigatorKey_0,
                                                    categoryScope_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      submitReporterContent: (...args_1) => {
        if (args_1.length !== 6) {
          throw new __compactRuntime.CompactError(`submitReporterContent: expected 6 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const kind_0 = args_1[1];
        const caseId_0 = args_1[2];
        const payloadRef_0 = args_1[3];
        const commitment_0 = args_1[4];
        const submittedAt_0 = args_1[5];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('submitReporterContent',
                                     'argument 1 (as invoked from Typescript)',
                                     'ghostdrop.compact line 587 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(kind_0) === 'number' && kind_0 >= 0 && kind_0 <= 1)) {
          __compactRuntime.typeError('submitReporterContent',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ghostdrop.compact line 587 char 1',
                                     'Enum<ReporterContentKind, Message, Evidence>',
                                     kind_0)
        }
        if (!(typeof(caseId_0) === 'bigint' && caseId_0 >= 0n && caseId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('submitReporterContent',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'ghostdrop.compact line 587 char 1',
                                     'Uint<0..18446744073709551616>',
                                     caseId_0)
        }
        if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
          __compactRuntime.typeError('submitReporterContent',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'ghostdrop.compact line 587 char 1',
                                     'Bytes<32>',
                                     commitment_0)
        }
        if (!(typeof(submittedAt_0) === 'bigint' && submittedAt_0 >= 0n && submittedAt_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('submitReporterContent',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'ghostdrop.compact line 587 char 1',
                                     'Uint<0..18446744073709551616>',
                                     submittedAt_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(kind_0).concat(_descriptor_1.toValue(caseId_0).concat(_descriptor_4.toValue(payloadRef_0).concat(_descriptor_5.toValue(commitment_0).concat(_descriptor_1.toValue(submittedAt_0))))),
            alignment: _descriptor_3.alignment().concat(_descriptor_1.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_1.alignment()))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._submitReporterContent_0(context,
                                                       partialProofData,
                                                       kind_0,
                                                       caseId_0,
                                                       payloadRef_0,
                                                       commitment_0,
                                                       submittedAt_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      submitInvestigatorAction: (...args_1) => {
        if (args_1.length !== 7) {
          throw new __compactRuntime.CompactError(`submitInvestigatorAction: expected 7 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const action_0 = args_1[1];
        const caseId_0 = args_1[2];
        const payloadRef_0 = args_1[3];
        const commitment_0 = args_1[4];
        const nextStatus_0 = args_1[5];
        const submittedAt_0 = args_1[6];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('submitInvestigatorAction',
                                     'argument 1 (as invoked from Typescript)',
                                     'ghostdrop.compact line 603 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(action_0) === 'number' && action_0 >= 0 && action_0 <= 1)) {
          __compactRuntime.typeError('submitInvestigatorAction',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ghostdrop.compact line 603 char 1',
                                     'Enum<InvestigatorAction, Message, AdvanceStatus>',
                                     action_0)
        }
        if (!(typeof(caseId_0) === 'bigint' && caseId_0 >= 0n && caseId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('submitInvestigatorAction',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'ghostdrop.compact line 603 char 1',
                                     'Uint<0..18446744073709551616>',
                                     caseId_0)
        }
        if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
          __compactRuntime.typeError('submitInvestigatorAction',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'ghostdrop.compact line 603 char 1',
                                     'Bytes<32>',
                                     commitment_0)
        }
        if (!(typeof(nextStatus_0) === 'number' && nextStatus_0 >= 0 && nextStatus_0 <= 5)) {
          __compactRuntime.typeError('submitInvestigatorAction',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'ghostdrop.compact line 603 char 1',
                                     'Enum<CaseStatus, Submitted, Acknowledged, UnderInvestigation, ActionRequired, Resolved, Closed>',
                                     nextStatus_0)
        }
        if (!(typeof(submittedAt_0) === 'bigint' && submittedAt_0 >= 0n && submittedAt_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('submitInvestigatorAction',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'ghostdrop.compact line 603 char 1',
                                     'Uint<0..18446744073709551616>',
                                     submittedAt_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_6.toValue(action_0).concat(_descriptor_1.toValue(caseId_0).concat(_descriptor_4.toValue(payloadRef_0).concat(_descriptor_5.toValue(commitment_0).concat(_descriptor_7.toValue(nextStatus_0).concat(_descriptor_1.toValue(submittedAt_0)))))),
            alignment: _descriptor_6.alignment().concat(_descriptor_1.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_7.alignment().concat(_descriptor_1.alignment())))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._submitInvestigatorAction_0(context,
                                                          partialProofData,
                                                          action_0,
                                                          caseId_0,
                                                          payloadRef_0,
                                                          commitment_0,
                                                          nextStatus_0,
                                                          submittedAt_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      proveFact: (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`proveFact: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const kind_0 = args_1[1];
        const caseId_0 = args_1[2];
        const value_0 = args_1[3];
        const verifiedAt_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('proveFact',
                                     'argument 1 (as invoked from Typescript)',
                                     'ghostdrop.compact line 620 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(kind_0) === 'number' && kind_0 >= 0 && kind_0 <= 1)) {
          __compactRuntime.typeError('proveFact',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'ghostdrop.compact line 620 char 1',
                                     'Enum<DisclosureKind, Department, Tenure>',
                                     kind_0)
        }
        if (!(typeof(caseId_0) === 'bigint' && caseId_0 >= 0n && caseId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('proveFact',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'ghostdrop.compact line 620 char 1',
                                     'Uint<0..18446744073709551616>',
                                     caseId_0)
        }
        if (!(typeof(value_0) === 'bigint' && value_0 >= 0n && value_0 <= 255n)) {
          __compactRuntime.typeError('proveFact',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'ghostdrop.compact line 620 char 1',
                                     'Uint<0..256>',
                                     value_0)
        }
        if (!(typeof(verifiedAt_0) === 'bigint' && verifiedAt_0 >= 0n && verifiedAt_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('proveFact',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'ghostdrop.compact line 620 char 1',
                                     'Uint<0..18446744073709551616>',
                                     verifiedAt_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(kind_0).concat(_descriptor_1.toValue(caseId_0).concat(_descriptor_2.toValue(value_0).concat(_descriptor_1.toValue(verifiedAt_0)))),
            alignment: _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_1.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._proveFact_0(context,
                                           partialProofData,
                                           kind_0,
                                           caseId_0,
                                           value_0,
                                           verifiedAt_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      registerOrganization: this.circuits.registerOrganization,
      createAnonymousCase: this.circuits.createAnonymousCase,
      manageOrganization: this.circuits.manageOrganization,
      submitReporterContent: this.circuits.submitReporterContent,
      submitInvestigatorAction: this.circuits.submitInvestigatorAction,
      proveFact: this.circuits.proveFact
    };
    this.provableCircuits = {
      registerOrganization: this.circuits.registerOrganization,
      createAnonymousCase: this.circuits.createAnonymousCase,
      manageOrganization: this.circuits.manageOrganization,
      submitReporterContent: this.circuits.submitReporterContent,
      submitInvestigatorAction: this.circuits.submitInvestigatorAction,
      proveFact: this.circuits.proveFact
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('registerOrganization', new __compactRuntime.ContractOperation());
    state_0.setOperation('createAnonymousCase', new __compactRuntime.ContractOperation());
    state_0.setOperation('manageOrganization', new __compactRuntime.ContractOperation());
    state_0.setOperation('submitReporterContent', new __compactRuntime.ContractOperation());
    state_0.setOperation('submitInvestigatorAction', new __compactRuntime.ContractOperation());
    state_0.setOperation('proveFact', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(1n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(2n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(3n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(4n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(5n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(6n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(7n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(8n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(9n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(10n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(11n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(12n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _blockTimeLt_0(context, partialProofData, time_0) {
    return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 2 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_2.toValue(2n),
                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(time_0),
                                                                                                                             alignment: _descriptor_1.alignment() }).encode() } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  _blockTimeGte_0(context, partialProofData, time_0) {
    return !this._blockTimeLt_0(context, partialProofData, time_0);
  }
  _transientHash_0(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_1, value_0);
    return result_0;
  }
  _transientHash_1(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_5, value_0);
    return result_0;
  }
  _transientHash_2(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_27, value_0);
    return result_0;
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_28, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_26, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_1, value_0);
    return result_0;
  }
  _persistentHash_3(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_25, value_0);
    return result_0;
  }
  _persistentHash_4(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_12, value_0);
    return result_0;
  }
  _jubjubPointX_0(np_0) {
    const result_0 = __compactRuntime.jubjubPointX(np_0);
    return result_0;
  }
  _jubjubPointY_0(np_0) {
    const result_0 = __compactRuntime.jubjubPointY(np_0);
    return result_0;
  }
  _ecAdd_0(a_0, b_0) {
    const result_0 = __compactRuntime.ecAdd(a_0, b_0);
    return result_0;
  }
  _ecMul_0(a_0, b_0) {
    const result_0 = __compactRuntime.ecMul(a_0, b_0);
    return result_0;
  }
  _ecMulGenerator_0(b_0) {
    const result_0 = __compactRuntime.ecMulGenerator(b_0);
    return result_0;
  }
  _getSchnorrReduction_0(context, partialProofData, challengeHash_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getSchnorrReduction(witnessContext_0,
                                                                              challengeHash_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(Array.isArray(result_0) && result_0.length === 2  && typeof(result_0[0]) === 'bigint' && result_0[0] >= 0n && result_0[0] <= 127n && typeof(result_0[1]) === 'bigint' && result_0[1] >= 0n && result_0[1] <= 452312848583266388373324160190187140051835877600158453279131187530910662655n)) {
      __compactRuntime.typeError('getSchnorrReduction',
                                 'return value',
                                 'schnorr.compact line 17 char 3',
                                 '[Uint<0..128>, Uint<0..452312848583266388373324160190187140051835877600158453279131187530910662656>]',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_24.toValue(result_0),
      alignment: _descriptor_24.alignment()
    });
    return result_0;
  }
  _schnorrVerify_0(context, partialProofData, msg_0, signature_0, pk_0) {
    const __compact_pattern_tmp2_0 = signature_0;
    const announcement_0 = __compact_pattern_tmp2_0.announcement;
    const response_0 = __compact_pattern_tmp2_0.response;
    const cFull_0 = this._transientHash_2({ ann_x:
                                              this._jubjubPointX_0(announcement_0),
                                            ann_y:
                                              this._jubjubPointY_0(announcement_0),
                                            pk_x: this._jubjubPointX_0(pk_0),
                                            pk_y: this._jubjubPointY_0(pk_0),
                                            msg: msg_0 });
    const TWO_248_0 = 452312848583266388373324160190187140051835877600158453279131187530910662656n;
    const __compact_pattern_tmp1_0 = this._getSchnorrReduction_0(context,
                                                                 partialProofData,
                                                                 cFull_0);
    const q_0 = __compact_pattern_tmp1_0[0];
    const cTruncated_0 = __compact_pattern_tmp1_0[1];
    let t_0;
    __compactRuntime.assert((t_0 = q_0, t_0 < 116n),
                            'Schnorr quotient out of range');
    __compactRuntime.assert(__compactRuntime.addField(__compactRuntime.mulField(q_0,
                                                                                TWO_248_0),
                                                      cTruncated_0)
                            ===
                            cFull_0,
                            'Invalid challenge reduction');
    const c_0 = cTruncated_0;
    const lhs_0 = this._ecMulGenerator_0(response_0);
    const rhs_0 = this._ecAdd_0(announcement_0, this._ecMul_0(pk_0, c_0));
    __compactRuntime.assert(this._jubjubPointX_0(lhs_0)
                            ===
                            this._jubjubPointX_0(rhs_0)
                            &&
                            this._jubjubPointY_0(lhs_0)
                            ===
                            this._jubjubPointY_0(rhs_0),
                            'Invalid membership credential');
    return [];
  }
  _schnorrChallenge_0(ann_x_0, ann_y_0, pk_x_0, pk_y_0, msg_0) {
    return this._transientHash_2({ ann_x: ann_x_0,
                                   ann_y: ann_y_0,
                                   pk_x: pk_x_0,
                                   pk_y: pk_y_0,
                                   msg: msg_0 });
  }
  _getMembershipWitness_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getMembershipWitness(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(Array.isArray(result_0) && result_0.length === 2  && typeof(result_0[0]) === 'object' && result_0[0].organizationId.buffer instanceof ArrayBuffer && result_0[0].organizationId.BYTES_PER_ELEMENT === 1 && result_0[0].organizationId.length === 32 && result_0[0].subject.buffer instanceof ArrayBuffer && result_0[0].subject.BYTES_PER_ELEMENT === 1 && result_0[0].subject.length === 32 && typeof(result_0[0].department) === 'bigint' && result_0[0].department >= 0n && result_0[0].department <= 255n && typeof(result_0[0].employmentStartedAt) === 'bigint' && result_0[0].employmentStartedAt >= 0n && result_0[0].employmentStartedAt <= 18446744073709551615n && typeof(result_0[0].validityEpoch) === 'bigint' && result_0[0].validityEpoch >= 0n && result_0[0].validityEpoch <= 65535n && typeof(result_0[1]) === 'object' && true && typeof(result_0[1].response) === 'bigint' && result_0[1].response >= 0 && result_0[1].response <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('getMembershipWitness',
                                 'return value',
                                 'ghostdrop.compact line 111 char 1',
                                 '[struct MembershipCredential<organizationId: Bytes<32>, subject: Bytes<32>, department: Uint<0..256>, employmentStartedAt: Uint<0..18446744073709551616>, validityEpoch: Uint<0..65536>>, struct SchnorrSignature<announcement: Opaque<"JubjubPoint">, response: Field>]',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_21.toValue(result_0),
      alignment: _descriptor_21.alignment()
    });
    return result_0;
  }
  _getUserSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getUserSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('getUserSecret',
                                 'return value',
                                 'ghostdrop.compact line 112 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_5.toValue(result_0),
      alignment: _descriptor_5.alignment()
    });
    return result_0;
  }
  _deriveCredentialSubject_0(secret_0) {
    return this._persistentHash_0([new Uint8Array([103, 104, 111, 115, 116, 100, 114, 111, 112, 58, 115, 117, 98, 106, 101, 99, 116, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   secret_0]);
  }
  _deriveAdminKey_0(secret_0, organizationId_0) {
    return this._persistentHash_1([new Uint8Array([103, 104, 111, 115, 116, 100, 114, 111, 112, 58, 97, 100, 109, 105, 110, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   organizationId_0,
                                   secret_0]);
  }
  _deriveInvestigatorKey_0(secret_0, organizationId_0) {
    return this._persistentHash_1([new Uint8Array([103, 104, 111, 115, 116, 100, 114, 111, 112, 58, 105, 110, 118, 101, 115, 116, 105, 103, 97, 116, 111, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0]),
                                   organizationId_0,
                                   secret_0]);
  }
  _deriveReporterKey_0(secret_0, organizationId_0, caseId_0) {
    return this._persistentHash_3([new Uint8Array([103, 104, 111, 115, 116, 100, 114, 111, 112, 58, 114, 101, 112, 111, 114, 116, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   organizationId_0,
                                   this._persistentHash_2(caseId_0),
                                   secret_0]);
  }
  _deriveReportNullifier_0(secret_0, organizationId_0, epoch_0) {
    return this._persistentHash_3([new Uint8Array([103, 104, 111, 115, 116, 100, 114, 111, 112, 58, 110, 117, 108, 108, 105, 102, 105, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   organizationId_0,
                                   this._persistentHash_4(epoch_0),
                                   secret_0]);
  }
  _credentialMessage_0(organizationId_0,
                       subject_0,
                       department_0,
                       employmentStartedAt_0,
                       validityEpoch_0)
  {
    return [this._transientHash_1(organizationId_0),
            this._transientHash_1(subject_0),
            department_0,
            this._transientHash_0(employmentStartedAt_0),
            validityEpoch_0];
  }
  _schnorrChallenge_1(ann_x_0, ann_y_0, pk_x_0, pk_y_0, msg_0) {
    return this._schnorrChallenge_0(ann_x_0, ann_y_0, pk_x_0, pk_y_0, msg_0);
  }
  _requireCurrentTimestamp_0(context, partialProofData, timestamp_0) {
    const publicTimestamp_0 = timestamp_0;
    __compactRuntime.assert(this._blockTimeGte_0(context,
                                                 partialProofData,
                                                 publicTimestamp_0),
                            'Timestamp is in the future');
    __compactRuntime.assert(this._blockTimeLt_0(context,
                                                partialProofData,
                                                ((t1) => {
                                                  if (t1 > 18446744073709551615n) {
                                                    throw new __compactRuntime.CompactError('ghostdrop.compact line 194 char 22: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                                                  }
                                                  return t1;
                                                })(publicTimestamp_0 + 600n)),
                            'Timestamp is older than ten minutes');
    return [];
  }
  _requireAdmin_0(context, partialProofData, organizationId_0) {
    const disclosedOrganizationId_0 = organizationId_0;
    __compactRuntime.assert(_descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Organization not found');
    const organization_0 = _descriptor_16.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                                                  alignment: _descriptor_5.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value);
    __compactRuntime.assert(this._equal_0(organization_0.adminKey,
                                          this._deriveAdminKey_0(this._getUserSecret_0(context,
                                                                                       partialProofData),
                                                                 organizationId_0)),
                            'Only the organization admin may perform this action');
    return organization_0;
  }
  _requireInvestigator_0(context, partialProofData, organizationId_0, category_0)
  {
    const disclosedOrganizationId_0 = organizationId_0;
    __compactRuntime.assert(_descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(3n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'No investigators registered');
    const key_0 = this._deriveInvestigatorKey_0(this._getUserSecret_0(context,
                                                                      partialProofData),
                                                organizationId_0);
    const disclosedKey_0 = key_0;
    __compactRuntime.assert(_descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(3n),
                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                                                  alignment: _descriptor_5.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedKey_0),
                                                                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Investigator is not authorized');
    const scope_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                              partialProofData,
                                                                              [
                                                                               { dup: { n: 0 } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_2.toValue(3n),
                                                                                                          alignment: _descriptor_2.alignment() } },
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                                          alignment: _descriptor_5.alignment() } }] } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_5.toValue(disclosedKey_0),
                                                                                                          alignment: _descriptor_5.alignment() } }] } },
                                                                               { popeq: { cached: false,
                                                                                          result: undefined } }]).value);
    __compactRuntime.assert(this._equal_1(scope_0, 0n)
                            ||
                            this._equal_2(scope_0, category_0),
                            'Investigator is not authorized for this category');
    return [];
  }
  _verifyMembership_0(context, partialProofData, organizationId_0) {
    const disclosedOrganizationId_0 = organizationId_0;
    __compactRuntime.assert(_descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Organization not found');
    const organization_0 = _descriptor_16.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                                                  alignment: _descriptor_5.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value);
    __compactRuntime.assert(organization_0.active,
                            'Organization is not accepting reports');
    const __compact_pattern_tmp1_0 = this._getMembershipWitness_0(context,
                                                                  partialProofData);
    const credential_0 = __compact_pattern_tmp1_0[0];
    const signature_0 = __compact_pattern_tmp1_0[1];
    __compactRuntime.assert(this._equal_3(credential_0.organizationId,
                                          organizationId_0),
                            'Credential belongs to another organization');
    __compactRuntime.assert(this._equal_4(credential_0.subject,
                                          this._deriveCredentialSubject_0(this._getUserSecret_0(context,
                                                                                                partialProofData))),
                            'Credential does not belong to this reporter');
    __compactRuntime.assert(this._equal_5(credential_0.validityEpoch,
                                          this._reportCredentialEpoch_0(context,
                                                                        partialProofData,
                                                                        disclosedOrganizationId_0)),
                            'Credential is no longer valid');
    this._schnorrVerify_0(context,
                          partialProofData,
                          this._credentialMessage_0(credential_0.organizationId,
                                                    credential_0.subject,
                                                    credential_0.department,
                                                    credential_0.employmentStartedAt,
                                                    credential_0.validityEpoch),
                          signature_0,
                          organization_0.issuerKey);
    return credential_0;
  }
  _reportCredentialEpoch_0(context, partialProofData, organizationId_0) {
    __compactRuntime.assert(_descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(2n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(organizationId_0),
                                                                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Credential epoch not found');
    return _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                      partialProofData,
                                                                      [
                                                                       { dup: { n: 0 } },
                                                                       { idx: { cached: false,
                                                                                pushPath: false,
                                                                                path: [
                                                                                       { tag: 'value',
                                                                                         value: { value: _descriptor_2.toValue(2n),
                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                       { idx: { cached: false,
                                                                                pushPath: false,
                                                                                path: [
                                                                                       { tag: 'value',
                                                                                         value: { value: _descriptor_5.toValue(organizationId_0),
                                                                                                  alignment: _descriptor_5.alignment() } }] } },
                                                                       { popeq: { cached: false,
                                                                                  result: undefined } }]).value);
  }
  _registerOrganization_0(context,
                          partialProofData,
                          organizationId_0,
                          name_0,
                          metadataRef_0,
                          encryptionKeyHash_0,
                          issuerKey_0)
  {
    const disclosedOrganizationId_0 = organizationId_0;
    __compactRuntime.assert(!_descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(0n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                                                                               alignment: _descriptor_5.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Organization already registered');
    const adminKey_0 = this._deriveAdminKey_0(this._getUserSecret_0(context,
                                                                    partialProofData),
                                              organizationId_0);
    const investigatorKey_0 = this._deriveInvestigatorKey_0(this._getUserSecret_0(context,
                                                                                  partialProofData),
                                                            organizationId_0);
    const tmp_0 = { name: name_0,
                    metadataRef: metadataRef_0,
                    encryptionKeyHash: encryptionKeyHash_0,
                    adminKey: adminKey_0,
                    issuerKey: issuerKey_0,
                    active: true };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(tmp_0),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(tmp_1),
                                                                                              alignment: _descriptor_12.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_2 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(2n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(tmp_2),
                                                                                              alignment: _descriptor_12.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(3n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_3 = 0n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(3n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(investigatorKey_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(tmp_3),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    return [];
  }
  _updateOrganizationMetadata_0(context,
                                partialProofData,
                                organizationId_0,
                                metadataRef_0,
                                encryptionKeyHash_0)
  {
    const organization_0 = this._requireAdmin_0(context,
                                                partialProofData,
                                                organizationId_0);
    const tmp_0 = { name: organization_0.name,
                    metadataRef: metadataRef_0,
                    encryptionKeyHash: encryptionKeyHash_0,
                    adminKey: organization_0.adminKey,
                    issuerKey: organization_0.issuerKey,
                    active: organization_0.active };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(organizationId_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(tmp_0),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _setOrganizationActive_0(context, partialProofData, organizationId_0, active_0)
  {
    const organization_0 = this._requireAdmin_0(context,
                                                partialProofData,
                                                organizationId_0);
    const tmp_0 = { name: organization_0.name,
                    metadataRef: organization_0.metadataRef,
                    encryptionKeyHash: organization_0.encryptionKeyHash,
                    adminKey: organization_0.adminKey,
                    issuerKey: organization_0.issuerKey,
                    active: active_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(organizationId_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(tmp_0),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _addInvestigator_0(context,
                     partialProofData,
                     organizationId_0,
                     investigatorKey_0,
                     categoryScope_0)
  {
    this._requireAdmin_0(context, partialProofData, organizationId_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(3n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(organizationId_0),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(investigatorKey_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(categoryScope_0),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    return [];
  }
  _removeInvestigator_0(context,
                        partialProofData,
                        organizationId_0,
                        investigatorKey_0)
  {
    this._requireAdmin_0(context, partialProofData, organizationId_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(3n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_5.toValue(organizationId_0),
                                                                  alignment: _descriptor_5.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(investigatorKey_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    return [];
  }
  _advanceReportingEpoch_0(context, partialProofData, organizationId_0) {
    this._requireAdmin_0(context, partialProofData, organizationId_0);
    const disclosedOrganizationId_0 = organizationId_0;
    const nextEpoch_0 = ((t1) => {
                          if (t1 > 65535n) {
                            throw new __compactRuntime.CompactError('ghostdrop.compact line 337 char 21: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 65535');
                          }
                          return t1;
                        })(_descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                                                  alignment: _descriptor_5.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value)
                           +
                           1n);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(nextEpoch_0),
                                                                                              alignment: _descriptor_12.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _advanceCredentialEpoch_0(context, partialProofData, organizationId_0) {
    this._requireAdmin_0(context, partialProofData, organizationId_0);
    const disclosedOrganizationId_0 = organizationId_0;
    const nextEpoch_0 = ((t1) => {
                          if (t1 > 65535n) {
                            throw new __compactRuntime.CompactError('ghostdrop.compact line 344 char 21: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 65535');
                          }
                          return t1;
                        })(_descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(2n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                                                  alignment: _descriptor_5.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value)
                           +
                           1n);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(2n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(nextEpoch_0),
                                                                                              alignment: _descriptor_12.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _createAnonymousCase_0(context,
                         partialProofData,
                         organizationId_0,
                         payloadRef_0,
                         reportCommitment_0,
                         evidenceCommitment_0,
                         category_0,
                         urgency_0,
                         submittedAt_0)
  {
    this._verifyMembership_0(context, partialProofData, organizationId_0);
    this._requireCurrentTimestamp_0(context, partialProofData, submittedAt_0);
    const disclosedOrganizationId_0 = organizationId_0;
    const epoch_0 = _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_5.toValue(disclosedOrganizationId_0),
                                                                                                           alignment: _descriptor_5.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const nullifier_0 = this._deriveReportNullifier_0(this._getUserSecret_0(context,
                                                                            partialProofData),
                                                      organizationId_0,
                                                      epoch_0);
    const disclosedNullifier_0 = nullifier_0;
    __compactRuntime.assert(!_descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(4n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedNullifier_0),
                                                                                                                                               alignment: _descriptor_5.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Reporter has already submitted in this epoch');
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(9n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_12.toValue(tmp_0),
                                                                alignment: _descriptor_12.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    const caseId_0 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(9n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { popeq: { cached: true,
                                                                                           result: undefined } }]).value);
    const reporterKey_0 = this._deriveReporterKey_0(this._getUserSecret_0(context,
                                                                          partialProofData),
                                                    organizationId_0,
                                                    caseId_0);
    const tmp_1 = { organizationId: organizationId_0,
                    reporterKey: reporterKey_0,
                    nullifier: nullifier_0,
                    payloadRef: payloadRef_0,
                    reportCommitment: reportCommitment_0,
                    evidenceCommitment: evidenceCommitment_0,
                    category: category_0,
                    urgency: urgency_0,
                    status: 0,
                    submittedAt: submittedAt_0,
                    departmentProof: 0n,
                    hasDepartmentProof: false,
                    tenureProof: 0n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(5n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(caseId_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_1),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(4n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(disclosedNullifier_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return caseId_0;
  }
  _requireReporter_0(context, partialProofData, caseId_0) {
    const disclosedCaseId_0 = caseId_0;
    __compactRuntime.assert(_descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(5n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(disclosedCaseId_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Case not found');
    const caseRecord_0 = _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_2.toValue(5n),
                                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_1.toValue(disclosedCaseId_0),
                                                                                                               alignment: _descriptor_1.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value);
    __compactRuntime.assert(this._equal_6(caseRecord_0.reporterKey,
                                          this._deriveReporterKey_0(this._getUserSecret_0(context,
                                                                                          partialProofData),
                                                                    caseRecord_0.organizationId,
                                                                    caseId_0)),
                            'Only the anonymous reporter may perform this action');
    return caseRecord_0;
  }
  _submitReporterMessage_0(context,
                           partialProofData,
                           caseId_0,
                           payloadRef_0,
                           payloadCommitment_0,
                           sentAt_0)
  {
    const caseRecord_0 = this._requireReporter_0(context,
                                                 partialProofData,
                                                 caseId_0);
    __compactRuntime.assert(caseRecord_0.status !== 5,
                            'Closed cases cannot receive messages');
    this._requireCurrentTimestamp_0(context, partialProofData, sentAt_0);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(10n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_12.toValue(tmp_0),
                                                                alignment: _descriptor_12.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_2.toValue(10n),
                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                             { popeq: { cached: true,
                                                                                        result: undefined } }]).value);
    const tmp_2 = { caseId: caseId_0,
                    payloadRef: payloadRef_0,
                    payloadCommitment: payloadCommitment_0,
                    authorRole: 1n,
                    sentAt: sentAt_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(6n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_1),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(tmp_2),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _submitInvestigatorMessage_0(context,
                               partialProofData,
                               caseId_0,
                               payloadRef_0,
                               payloadCommitment_0,
                               sentAt_0)
  {
    const disclosedCaseId_0 = caseId_0;
    __compactRuntime.assert(_descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(5n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(disclosedCaseId_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Case not found');
    const caseRecord_0 = _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_2.toValue(5n),
                                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_1.toValue(disclosedCaseId_0),
                                                                                                               alignment: _descriptor_1.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value);
    this._requireInvestigator_0(context,
                                partialProofData,
                                caseRecord_0.organizationId,
                                caseRecord_0.category);
    __compactRuntime.assert(caseRecord_0.status !== 5,
                            'Closed cases cannot receive messages');
    this._requireCurrentTimestamp_0(context, partialProofData, sentAt_0);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(10n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_12.toValue(tmp_0),
                                                                alignment: _descriptor_12.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_2.toValue(10n),
                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                             { popeq: { cached: true,
                                                                                        result: undefined } }]).value);
    const tmp_2 = { caseId: caseId_0,
                    payloadRef: payloadRef_0,
                    payloadCommitment: payloadCommitment_0,
                    authorRole: 2n,
                    sentAt: sentAt_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(6n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_1),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(tmp_2),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _addReporterEvidence_0(context,
                         partialProofData,
                         caseId_0,
                         payloadRef_0,
                         commitment_0,
                         submittedAt_0)
  {
    const caseRecord_0 = this._requireReporter_0(context,
                                                 partialProofData,
                                                 caseId_0);
    __compactRuntime.assert(caseRecord_0.status !== 5,
                            'Closed cases cannot receive evidence');
    this._requireCurrentTimestamp_0(context, partialProofData, submittedAt_0);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(11n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_12.toValue(tmp_0),
                                                                alignment: _descriptor_12.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_2.toValue(11n),
                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                             { popeq: { cached: true,
                                                                                        result: undefined } }]).value);
    const tmp_2 = { caseId: caseId_0,
                    payloadRef: payloadRef_0,
                    commitment: commitment_0,
                    authorRole: 1n,
                    submittedAt: submittedAt_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(7n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_1),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(tmp_2),
                                                                                              alignment: _descriptor_14.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _updateCaseStatus_0(context,
                      partialProofData,
                      caseId_0,
                      nextStatus_0,
                      changedAt_0)
  {
    const disclosedCaseId_0 = caseId_0;
    __compactRuntime.assert(_descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(5n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(disclosedCaseId_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Case not found');
    const caseRecord_0 = _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_2.toValue(5n),
                                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_1.toValue(disclosedCaseId_0),
                                                                                                               alignment: _descriptor_1.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value);
    this._requireInvestigator_0(context,
                                partialProofData,
                                caseRecord_0.organizationId,
                                caseRecord_0.category);
    this._requireCurrentTimestamp_0(context, partialProofData, changedAt_0);
    const expectedStatus_0 = ((t1) => {
                               if (t1 > 255n) {
                                 throw new __compactRuntime.CompactError('ghostdrop.compact line 475 char 26: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 255');
                               }
                               return t1;
                             })(BigInt(caseRecord_0.status) + 1n);
    __compactRuntime.assert(this._equal_7(BigInt(nextStatus_0), expectedStatus_0),
                            'Case status must advance exactly one step');
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(12n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_12.toValue(tmp_0),
                                                                alignment: _descriptor_12.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_2.toValue(12n),
                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                             { popeq: { cached: true,
                                                                                        result: undefined } }]).value);
    const tmp_2 = { caseId: caseId_0,
                    fromStatus: caseRecord_0.status,
                    toStatus: nextStatus_0,
                    changedAt: changedAt_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(8n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_1),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(tmp_2),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_3 = { organizationId: caseRecord_0.organizationId,
                    reporterKey: caseRecord_0.reporterKey,
                    nullifier: caseRecord_0.nullifier,
                    payloadRef: caseRecord_0.payloadRef,
                    reportCommitment: caseRecord_0.reportCommitment,
                    evidenceCommitment: caseRecord_0.evidenceCommitment,
                    category: caseRecord_0.category,
                    urgency: caseRecord_0.urgency,
                    status: nextStatus_0,
                    submittedAt: caseRecord_0.submittedAt,
                    departmentProof: caseRecord_0.departmentProof,
                    hasDepartmentProof: caseRecord_0.hasDepartmentProof,
                    tenureProof: caseRecord_0.tenureProof };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(5n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(disclosedCaseId_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_3),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _proveDepartment_0(context, partialProofData, caseId_0, department_0) {
    const caseRecord_0 = this._requireReporter_0(context,
                                                 partialProofData,
                                                 caseId_0);
    const credential_0 = this._verifyMembership_0(context,
                                                  partialProofData,
                                                  caseRecord_0.organizationId);
    __compactRuntime.assert(this._equal_8(credential_0.department, department_0),
                            'Credential does not contain this department');
    const tmp_0 = { organizationId: caseRecord_0.organizationId,
                    reporterKey: caseRecord_0.reporterKey,
                    nullifier: caseRecord_0.nullifier,
                    payloadRef: caseRecord_0.payloadRef,
                    reportCommitment: caseRecord_0.reportCommitment,
                    evidenceCommitment: caseRecord_0.evidenceCommitment,
                    category: caseRecord_0.category,
                    urgency: caseRecord_0.urgency,
                    status: caseRecord_0.status,
                    submittedAt: caseRecord_0.submittedAt,
                    departmentProof: department_0,
                    hasDepartmentProof: true,
                    tenureProof: caseRecord_0.tenureProof };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(5n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(caseId_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_0),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _proveTenure_0(context,
                 partialProofData,
                 caseId_0,
                 minimumYears_0,
                 verifiedAt_0)
  {
    const caseRecord_0 = this._requireReporter_0(context,
                                                 partialProofData,
                                                 caseId_0);
    const credential_0 = this._verifyMembership_0(context,
                                                  partialProofData,
                                                  caseRecord_0.organizationId);
    __compactRuntime.assert(minimumYears_0 > 0n && minimumYears_0 <= 20n,
                            'Tenure range is unsupported');
    __compactRuntime.assert(minimumYears_0 > caseRecord_0.tenureProof,
                            'Tenure proof must strictly increase');
    this._requireCurrentTimestamp_0(context, partialProofData, verifiedAt_0);
    const tenureSeconds_0 = minimumYears_0 * 31557600n;
    __compactRuntime.assert(verifiedAt_0 > tenureSeconds_0,
                            'Tenure timestamp is invalid');
    const cutoff_0 = (__compactRuntime.assert(verifiedAt_0 >= tenureSeconds_0,
                                              'result of subtraction would be negative'),
                      verifiedAt_0 - tenureSeconds_0);
    let t_0;
    __compactRuntime.assert((t_0 = credential_0.employmentStartedAt,
                             t_0 <= cutoff_0),
                            'Credential does not meet the tenure requirement');
    const tmp_0 = { organizationId: caseRecord_0.organizationId,
                    reporterKey: caseRecord_0.reporterKey,
                    nullifier: caseRecord_0.nullifier,
                    payloadRef: caseRecord_0.payloadRef,
                    reportCommitment: caseRecord_0.reportCommitment,
                    evidenceCommitment: caseRecord_0.evidenceCommitment,
                    category: caseRecord_0.category,
                    urgency: caseRecord_0.urgency,
                    status: caseRecord_0.status,
                    submittedAt: caseRecord_0.submittedAt,
                    departmentProof: caseRecord_0.departmentProof,
                    hasDepartmentProof: caseRecord_0.hasDepartmentProof,
                    tenureProof: minimumYears_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(5n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(caseId_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_0),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _manageOrganization_0(context,
                        partialProofData,
                        action_0,
                        organizationId_0,
                        metadataRef_0,
                        encryptionKeyHash_0,
                        active_0,
                        investigatorKey_0,
                        categoryScope_0)
  {
    const publicAction_0 = action_0;
    if (publicAction_0 === 0) {
      this._updateOrganizationMetadata_0(context,
                                         partialProofData,
                                         organizationId_0,
                                         metadataRef_0,
                                         encryptionKeyHash_0);
    } else {
      if (publicAction_0 === 1) {
        this._setOrganizationActive_0(context,
                                      partialProofData,
                                      organizationId_0,
                                      active_0);
      } else {
        if (publicAction_0 === 2) {
          this._addInvestigator_0(context,
                                  partialProofData,
                                  organizationId_0,
                                  investigatorKey_0,
                                  categoryScope_0);
        } else {
          if (publicAction_0 === 3) {
            this._removeInvestigator_0(context,
                                       partialProofData,
                                       organizationId_0,
                                       investigatorKey_0);
          } else {
            if (publicAction_0 === 4) {
              this._advanceReportingEpoch_0(context,
                                            partialProofData,
                                            organizationId_0);
            } else {
              __compactRuntime.assert(publicAction_0 === 5,
                                      'Unsupported organization action');
              this._advanceCredentialEpoch_0(context,
                                             partialProofData,
                                             organizationId_0);
            }
          }
        }
      }
    }
    return [];
  }
  _submitReporterContent_0(context,
                           partialProofData,
                           kind_0,
                           caseId_0,
                           payloadRef_0,
                           commitment_0,
                           submittedAt_0)
  {
    const publicKind_0 = kind_0;
    if (publicKind_0 === 0) {
      this._submitReporterMessage_0(context,
                                    partialProofData,
                                    caseId_0,
                                    payloadRef_0,
                                    commitment_0,
                                    submittedAt_0);
    } else {
      __compactRuntime.assert(publicKind_0 === 1,
                              'Unsupported reporter content kind');
      this._addReporterEvidence_0(context,
                                  partialProofData,
                                  caseId_0,
                                  payloadRef_0,
                                  commitment_0,
                                  submittedAt_0);
    }
    return [];
  }
  _submitInvestigatorAction_0(context,
                              partialProofData,
                              action_0,
                              caseId_0,
                              payloadRef_0,
                              commitment_0,
                              nextStatus_0,
                              submittedAt_0)
  {
    const publicAction_0 = action_0;
    if (publicAction_0 === 0) {
      this._submitInvestigatorMessage_0(context,
                                        partialProofData,
                                        caseId_0,
                                        payloadRef_0,
                                        commitment_0,
                                        submittedAt_0);
    } else {
      __compactRuntime.assert(publicAction_0 === 1,
                              'Unsupported investigator action');
      this._updateCaseStatus_0(context,
                               partialProofData,
                               caseId_0,
                               nextStatus_0,
                               submittedAt_0);
    }
    return [];
  }
  _proveFact_0(context,
               partialProofData,
               kind_0,
               caseId_0,
               value_0,
               verifiedAt_0)
  {
    const publicKind_0 = kind_0;
    if (publicKind_0 === 0) {
      this._proveDepartment_0(context, partialProofData, caseId_0, value_0);
    } else {
      __compactRuntime.assert(publicKind_0 === 1, 'Unsupported disclosure kind');
      this._proveTenure_0(context,
                          partialProofData,
                          caseId_0,
                          value_0,
                          verifiedAt_0);
    }
    return [];
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_8(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    organizations: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ghostdrop.compact line 97 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(key_0),
                                                                                                                                 alignment: _descriptor_5.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'ghostdrop.compact line 97 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_16.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(0n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_5.toValue(key_0),
                                                                                                      alignment: _descriptor_5.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[0];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_5.fromValue(key.value),      _descriptor_16.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    reportEpochs: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ghostdrop.compact line 98 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(key_0),
                                                                                                                                 alignment: _descriptor_5.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'ghostdrop.compact line 98 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_5.toValue(key_0),
                                                                                                      alignment: _descriptor_5.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_5.fromValue(key.value),      _descriptor_12.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    credentialEpochs: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(2n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(2n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ghostdrop.compact line 99 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(2n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(key_0),
                                                                                                                                 alignment: _descriptor_5.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'ghostdrop.compact line 99 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(2n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_5.toValue(key_0),
                                                                                                      alignment: _descriptor_5.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_5.fromValue(key.value),      _descriptor_12.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    investigatorPermissions: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(3n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(3n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ghostdrop.compact line 100 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(3n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(key_0),
                                                                                                                                 alignment: _descriptor_5.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'ghostdrop.compact line 100 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        if (state.asArray()[3].asMap().get({ value: _descriptor_5.toValue(key_0),
                                             alignment: _descriptor_5.alignment() }) === undefined) {
          throw new __compactRuntime.CompactError(`Map value undefined for ${key_0}`);
        }
        return {
          isEmpty(...args_1) {
            if (args_1.length !== 0) {
              throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_1.length}`);
            }
            return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(3n),
                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_5.toValue(key_0),
                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                              'size',
                                                                              { push: { storage: false,
                                                                                        value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                     alignment: _descriptor_1.alignment() }).encode() } },
                                                                              'eq',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          },
          size(...args_1) {
            if (args_1.length !== 0) {
              throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_1.length}`);
            }
            return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(3n),
                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_5.toValue(key_0),
                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                              'size',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          },
          member(...args_1) {
            if (args_1.length !== 1) {
              throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_1.length}`);
            }
            const key_1 = args_1[0];
            if (!(key_1.buffer instanceof ArrayBuffer && key_1.BYTES_PER_ELEMENT === 1 && key_1.length === 32)) {
              __compactRuntime.typeError('member',
                                         'argument 1',
                                         'ghostdrop.compact line 100 char 55',
                                         'Bytes<32>',
                                         key_1)
            }
            return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(3n),
                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_5.toValue(key_0),
                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                              { push: { storage: false,
                                                                                        value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(key_1),
                                                                                                                                     alignment: _descriptor_5.alignment() }).encode() } },
                                                                              'member',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          },
          lookup(...args_1) {
            if (args_1.length !== 1) {
              throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_1.length}`);
            }
            const key_1 = args_1[0];
            if (!(key_1.buffer instanceof ArrayBuffer && key_1.BYTES_PER_ELEMENT === 1 && key_1.length === 32)) {
              __compactRuntime.typeError('lookup',
                                         'argument 1',
                                         'ghostdrop.compact line 100 char 55',
                                         'Bytes<32>',
                                         key_1)
            }
            return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(3n),
                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_5.toValue(key_0),
                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_5.toValue(key_1),
                                                                                                         alignment: _descriptor_5.alignment() } }] } },
                                                                              { popeq: { cached: false,
                                                                                         result: undefined } }]).value);
          },
          [Symbol.iterator](...args_1) {
            if (args_1.length !== 0) {
              throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_1.length}`);
            }
            const self_0 = state.asArray()[3].asMap().get({ value: _descriptor_5.toValue(key_0),
                                                            alignment: _descriptor_5.alignment() });
            return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_5.fromValue(key.value),      _descriptor_2.fromValue(value.value)    ];  })[Symbol.iterator]();
          }
        }
      }
    },
    usedNullifiers: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(4n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(4n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ghostdrop.compact line 101 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(4n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_5.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[4];
        return self_0.asMap().keys().map((elem) => _descriptor_5.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    cases: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(5n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(5n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ghostdrop.compact line 102 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(5n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'ghostdrop.compact line 102 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(5n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(key_0),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[5];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_1.fromValue(key.value),      _descriptor_9.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    messages: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(6n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(6n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ghostdrop.compact line 103 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(6n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'ghostdrop.compact line 103 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_13.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(6n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(key_0),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[6];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_1.fromValue(key.value),      _descriptor_13.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    evidence: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(7n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(7n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ghostdrop.compact line 104 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(7n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'ghostdrop.compact line 104 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_14.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(7n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(key_0),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[7];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_1.fromValue(key.value),      _descriptor_14.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    statusEvents: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(8n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(8n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'ghostdrop.compact line 105 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(8n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'ghostdrop.compact line 105 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(8n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(key_0),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[8];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_1.fromValue(key.value),      _descriptor_11.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get caseSequence() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(9n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get messageSequence() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(10n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get evidenceSequence() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(11n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get statusSequence() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(12n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  getSchnorrReduction: (...args) => undefined,
  getMembershipWitness: (...args) => undefined,
  getUserSecret: (...args) => undefined
});
export const pureCircuits = {
  deriveCredentialSubject: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`deriveCredentialSubject: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('deriveCredentialSubject',
                                 'argument 1',
                                 'ghostdrop.compact line 116 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    return _dummyContract._deriveCredentialSubject_0(secret_0);
  },
  deriveAdminKey: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`deriveAdminKey: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    const organizationId_0 = args_0[1];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('deriveAdminKey',
                                 'argument 1',
                                 'ghostdrop.compact line 123 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    if (!(organizationId_0.buffer instanceof ArrayBuffer && organizationId_0.BYTES_PER_ELEMENT === 1 && organizationId_0.length === 32)) {
      __compactRuntime.typeError('deriveAdminKey',
                                 'argument 2',
                                 'ghostdrop.compact line 123 char 1',
                                 'Bytes<32>',
                                 organizationId_0)
    }
    return _dummyContract._deriveAdminKey_0(secret_0, organizationId_0);
  },
  deriveInvestigatorKey: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`deriveInvestigatorKey: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    const organizationId_0 = args_0[1];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('deriveInvestigatorKey',
                                 'argument 1',
                                 'ghostdrop.compact line 131 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    if (!(organizationId_0.buffer instanceof ArrayBuffer && organizationId_0.BYTES_PER_ELEMENT === 1 && organizationId_0.length === 32)) {
      __compactRuntime.typeError('deriveInvestigatorKey',
                                 'argument 2',
                                 'ghostdrop.compact line 131 char 1',
                                 'Bytes<32>',
                                 organizationId_0)
    }
    return _dummyContract._deriveInvestigatorKey_0(secret_0, organizationId_0);
  },
  deriveReporterKey: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`deriveReporterKey: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    const organizationId_0 = args_0[1];
    const caseId_0 = args_0[2];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('deriveReporterKey',
                                 'argument 1',
                                 'ghostdrop.compact line 139 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    if (!(organizationId_0.buffer instanceof ArrayBuffer && organizationId_0.BYTES_PER_ELEMENT === 1 && organizationId_0.length === 32)) {
      __compactRuntime.typeError('deriveReporterKey',
                                 'argument 2',
                                 'ghostdrop.compact line 139 char 1',
                                 'Bytes<32>',
                                 organizationId_0)
    }
    if (!(typeof(caseId_0) === 'bigint' && caseId_0 >= 0n && caseId_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('deriveReporterKey',
                                 'argument 3',
                                 'ghostdrop.compact line 139 char 1',
                                 'Uint<0..18446744073709551616>',
                                 caseId_0)
    }
    return _dummyContract._deriveReporterKey_0(secret_0,
                                               organizationId_0,
                                               caseId_0);
  },
  deriveReportNullifier: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`deriveReportNullifier: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    const organizationId_0 = args_0[1];
    const epoch_0 = args_0[2];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('deriveReportNullifier',
                                 'argument 1',
                                 'ghostdrop.compact line 152 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    if (!(organizationId_0.buffer instanceof ArrayBuffer && organizationId_0.BYTES_PER_ELEMENT === 1 && organizationId_0.length === 32)) {
      __compactRuntime.typeError('deriveReportNullifier',
                                 'argument 2',
                                 'ghostdrop.compact line 152 char 1',
                                 'Bytes<32>',
                                 organizationId_0)
    }
    if (!(typeof(epoch_0) === 'bigint' && epoch_0 >= 0n && epoch_0 <= 65535n)) {
      __compactRuntime.typeError('deriveReportNullifier',
                                 'argument 3',
                                 'ghostdrop.compact line 152 char 1',
                                 'Uint<0..65536>',
                                 epoch_0)
    }
    return _dummyContract._deriveReportNullifier_0(secret_0,
                                                   organizationId_0,
                                                   epoch_0);
  },
  credentialMessage: (...args_0) => {
    if (args_0.length !== 5) {
      throw new __compactRuntime.CompactError(`credentialMessage: expected 5 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const organizationId_0 = args_0[0];
    const subject_0 = args_0[1];
    const department_0 = args_0[2];
    const employmentStartedAt_0 = args_0[3];
    const validityEpoch_0 = args_0[4];
    if (!(organizationId_0.buffer instanceof ArrayBuffer && organizationId_0.BYTES_PER_ELEMENT === 1 && organizationId_0.length === 32)) {
      __compactRuntime.typeError('credentialMessage',
                                 'argument 1',
                                 'ghostdrop.compact line 165 char 1',
                                 'Bytes<32>',
                                 organizationId_0)
    }
    if (!(subject_0.buffer instanceof ArrayBuffer && subject_0.BYTES_PER_ELEMENT === 1 && subject_0.length === 32)) {
      __compactRuntime.typeError('credentialMessage',
                                 'argument 2',
                                 'ghostdrop.compact line 165 char 1',
                                 'Bytes<32>',
                                 subject_0)
    }
    if (!(typeof(department_0) === 'bigint' && department_0 >= 0n && department_0 <= 255n)) {
      __compactRuntime.typeError('credentialMessage',
                                 'argument 3',
                                 'ghostdrop.compact line 165 char 1',
                                 'Uint<0..256>',
                                 department_0)
    }
    if (!(typeof(employmentStartedAt_0) === 'bigint' && employmentStartedAt_0 >= 0n && employmentStartedAt_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('credentialMessage',
                                 'argument 4',
                                 'ghostdrop.compact line 165 char 1',
                                 'Uint<0..18446744073709551616>',
                                 employmentStartedAt_0)
    }
    if (!(typeof(validityEpoch_0) === 'bigint' && validityEpoch_0 >= 0n && validityEpoch_0 <= 65535n)) {
      __compactRuntime.typeError('credentialMessage',
                                 'argument 5',
                                 'ghostdrop.compact line 165 char 1',
                                 'Uint<0..65536>',
                                 validityEpoch_0)
    }
    return _dummyContract._credentialMessage_0(organizationId_0,
                                               subject_0,
                                               department_0,
                                               employmentStartedAt_0,
                                               validityEpoch_0);
  },
  schnorrChallenge: (...args_0) => {
    if (args_0.length !== 5) {
      throw new __compactRuntime.CompactError(`schnorrChallenge: expected 5 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const ann_x_0 = args_0[0];
    const ann_y_0 = args_0[1];
    const pk_x_0 = args_0[2];
    const pk_y_0 = args_0[3];
    const msg_0 = args_0[4];
    if (!(typeof(ann_x_0) === 'bigint' && ann_x_0 >= 0 && ann_x_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('schnorrChallenge',
                                 'argument 1',
                                 'ghostdrop.compact line 181 char 1',
                                 'Field',
                                 ann_x_0)
    }
    if (!(typeof(ann_y_0) === 'bigint' && ann_y_0 >= 0 && ann_y_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('schnorrChallenge',
                                 'argument 2',
                                 'ghostdrop.compact line 181 char 1',
                                 'Field',
                                 ann_y_0)
    }
    if (!(typeof(pk_x_0) === 'bigint' && pk_x_0 >= 0 && pk_x_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('schnorrChallenge',
                                 'argument 3',
                                 'ghostdrop.compact line 181 char 1',
                                 'Field',
                                 pk_x_0)
    }
    if (!(typeof(pk_y_0) === 'bigint' && pk_y_0 >= 0 && pk_y_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('schnorrChallenge',
                                 'argument 4',
                                 'ghostdrop.compact line 181 char 1',
                                 'Field',
                                 pk_y_0)
    }
    if (!(Array.isArray(msg_0) && msg_0.length === 5 && msg_0.every((t) => typeof(t) === 'bigint' && t >= 0 && t <= __compactRuntime.MAX_FIELD))) {
      __compactRuntime.typeError('schnorrChallenge',
                                 'argument 5',
                                 'ghostdrop.compact line 181 char 1',
                                 'Vector<5, Field>',
                                 msg_0)
    }
    return _dummyContract._schnorrChallenge_1(ann_x_0,
                                              ann_y_0,
                                              pk_x_0,
                                              pk_y_0,
                                              msg_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
