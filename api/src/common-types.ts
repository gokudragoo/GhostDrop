import type { FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { Contract, GhostDropPrivateState, Witnesses } from 'ghostdrop-contract';

export const ghostDropPrivateStateId = 'ghostdropPrivateState' as const;
export type GhostDropContract = Contract<GhostDropPrivateState, Witnesses<GhostDropPrivateState>>;
export type GhostDropCircuitKeys = Exclude<keyof GhostDropContract['impureCircuits'], number | symbol>;
export type GhostDropProviders = MidnightProviders<GhostDropCircuitKeys, typeof ghostDropPrivateStateId, GhostDropPrivateState>;
export type DeployedGhostDropContract = FoundContract<GhostDropContract>;
