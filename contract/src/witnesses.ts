import type { WitnessContext } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import type {
  Ledger,
  MembershipCredential,
  Schnorr_SchnorrSignature,
} from './managed/ghostdrop/contract/index.js';

export type GhostDropPrivateState = {
  readonly userSecret: Uint8Array;
  readonly credential: MembershipCredential;
  readonly credentialSignature: Schnorr_SchnorrSignature;
};

const TWO_248 = 452312848583266388373324160190187140051835877600158453279131187530910662656n;

export const emptyCredential = (): MembershipCredential => ({
  organizationId: new Uint8Array(32),
  subject: new Uint8Array(32),
  department: 0n,
  employmentStartedAt: 0n,
  validityEpoch: 0n,
});

export const emptySignature = (): Schnorr_SchnorrSignature => ({
  announcement: { x: 0n, y: 1n },
  response: 0n,
});

export const createGhostDropPrivateState = (userSecret?: Uint8Array): GhostDropPrivateState => ({
  userSecret: userSecret ?? crypto.getRandomValues(new Uint8Array(32)),
  credential: emptyCredential(),
  credentialSignature: emptySignature(),
});

export const witnesses = {
  getMembershipWitness: ({
    privateState,
  }: WitnessContext<Ledger, GhostDropPrivateState>): [
    GhostDropPrivateState,
    [MembershipCredential, Schnorr_SchnorrSignature],
  ] => [privateState, [privateState.credential, privateState.credentialSignature]],

  getUserSecret: ({
    privateState,
  }: WitnessContext<Ledger, GhostDropPrivateState>): [GhostDropPrivateState, Uint8Array] => {
    if (privateState.userSecret.length !== 32) {
      throw new Error('GhostDrop private user secret must contain exactly 32 bytes.');
    }
    return [privateState, privateState.userSecret];
  },

  getSchnorrReduction: (
    { privateState }: WitnessContext<Ledger, GhostDropPrivateState>,
    challengeHash: bigint,
  ): [GhostDropPrivateState, [bigint, bigint]] => [
    privateState,
    [challengeHash / TWO_248, challengeHash % TWO_248],
  ],
};
