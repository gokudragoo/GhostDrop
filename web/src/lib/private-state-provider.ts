import type { ContractAddress, SigningKey } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import type {
  ExportPrivateStatesOptions,
  ExportSigningKeysOptions,
  ImportPrivateStatesOptions,
  ImportPrivateStatesResult,
  ImportSigningKeysOptions,
  ImportSigningKeysResult,
  PrivateStateExport,
  PrivateStateId,
  PrivateStateProvider,
  SigningKeyExport,
} from '@midnight-ntwrk/midnight-js-types';

const stringify = (value: unknown): string => JSON.stringify(value, (_key, entry: unknown) => {
  if (typeof entry === 'bigint') return { __ghostdropType: 'bigint', value: entry.toString() };
  if (entry instanceof Uint8Array) return { __ghostdropType: 'bytes', value: Array.from(entry) };
  return entry;
});

const parse = <T>(value: string): T => JSON.parse(value, (_key, entry: unknown) => {
  if (!entry || typeof entry !== 'object' || !('__ghostdropType' in entry)) return entry;
  const tagged = entry as { __ghostdropType: string; value: string | number[] };
  if (tagged.__ghostdropType === 'bigint') return BigInt(tagged.value as string);
  if (tagged.__ghostdropType === 'bytes') return Uint8Array.from(tagged.value as number[]);
  return entry;
}) as T;

export const localPrivateStateProvider = <PSI extends PrivateStateId, PS>(): PrivateStateProvider<PSI, PS> => {
  let contractAddress: ContractAddress | null = null;
  const memoryStates = new Map<string, PS>();
  const signingKeys = new Map<ContractAddress, SigningKey>();
  const scope = (): ContractAddress => {
    if (!contractAddress) throw new Error('Contract address has not been selected.');
    return contractAddress;
  };
  const stateKey = (address: ContractAddress, id: PSI): string => `ghostdrop:private:${address}:${id}`;
  const signingKeyName = (address: ContractAddress): string => `ghostdrop:signing:${address}`;

  return {
    setContractAddress(address) { contractAddress = address; },
    async set(id, state) {
      const key = stateKey(scope(), id);
      memoryStates.set(key, state);
      localStorage.setItem(key, stringify(state));
    },
    async get(id) {
      const key = stateKey(scope(), id);
      if (memoryStates.has(key)) return memoryStates.get(key)!;
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      const state = parse<PS>(stored);
      memoryStates.set(key, state);
      return state;
    },
    async remove(id) {
      const key = stateKey(scope(), id);
      memoryStates.delete(key);
      localStorage.removeItem(key);
    },
    async clear() {
      const prefix = `ghostdrop:private:${scope()}:`;
      for (const key of Object.keys(localStorage)) if (key.startsWith(prefix)) localStorage.removeItem(key);
      for (const key of memoryStates.keys()) if (key.startsWith(prefix)) memoryStates.delete(key);
    },
    async setSigningKey(address, key) {
      signingKeys.set(address, key);
      localStorage.setItem(signingKeyName(address), stringify(key));
    },
    async getSigningKey(address) {
      if (signingKeys.has(address)) return signingKeys.get(address)!;
      const stored = localStorage.getItem(signingKeyName(address));
      if (!stored) return null;
      const key = parse<SigningKey>(stored);
      signingKeys.set(address, key);
      return key;
    },
    async removeSigningKey(address) {
      signingKeys.delete(address);
      localStorage.removeItem(signingKeyName(address));
    },
    async clearSigningKeys() {
      for (const key of Object.keys(localStorage)) if (key.startsWith('ghostdrop:signing:')) localStorage.removeItem(key);
      signingKeys.clear();
    },
    async exportPrivateStates(_options?: ExportPrivateStatesOptions): Promise<PrivateStateExport> {
      const address = scope();
      const states = Object.fromEntries(
        Object.keys(localStorage)
          .filter((key) => key.startsWith(`ghostdrop:private:${address}:`))
          .map((key) => [key, localStorage.getItem(key)]),
      );
      return { format: 'midnight-private-state-export', encryptedPayload: stringify(states), salt: 'ghostdrop-local-v1' };
    },
    async importPrivateStates(data: PrivateStateExport, _options?: ImportPrivateStatesOptions): Promise<ImportPrivateStatesResult> {
      const states = parse<Record<string, string>>(data.encryptedPayload);
      for (const [key, value] of Object.entries(states)) localStorage.setItem(key, value);
      return { imported: Object.keys(states).length, skipped: 0, overwritten: 0 };
    },
    async exportSigningKeys(_options?: ExportSigningKeysOptions): Promise<SigningKeyExport> {
      return { format: 'midnight-signing-key-export', encryptedPayload: stringify(Object.fromEntries(signingKeys)), salt: 'ghostdrop-local-v1' };
    },
    async importSigningKeys(data: SigningKeyExport, _options?: ImportSigningKeysOptions): Promise<ImportSigningKeysResult> {
      const keys = parse<Record<ContractAddress, SigningKey>>(data.encryptedPayload);
      for (const [address, key] of Object.entries(keys)) await this.setSigningKey(address, key);
      return { imported: Object.keys(keys).length, skipped: 0, overwritten: 0 };
    },
  };
};
