import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import * as ContractModule from './managed/ghostdrop/contract/index.js';
import { witnesses, type GhostDropPrivateState } from './witnesses.js';

export * as GhostDrop from './managed/ghostdrop/contract/index.js';
export * from './managed/ghostdrop/contract/index.js';
export * from './witnesses.js';

export const CompiledGhostDropContract = CompiledContract.make<
  ContractModule.Contract<GhostDropPrivateState>
>('GhostDrop', ContractModule.Contract<GhostDropPrivateState>).pipe(
  CompiledContract.withWitnesses(witnesses),
  CompiledContract.withCompiledFileAssets('./managed/ghostdrop'),
);
