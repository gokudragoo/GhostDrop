import { beforeEach, describe, expect, it } from 'vitest';
import {
  exportInvestigatorAccess,
  getInvestigatorPrivateKey,
  getUserSecret,
  importInvestigatorAccess,
} from './local-secrets.js';

class MemoryStorage implements Storage {
  readonly #values = new Map<string, string>();

  get length(): number { return this.#values.size; }
  clear(): void { this.#values.clear(); }
  getItem(key: string): string | null { return this.#values.get(key) ?? null; }
  key(index: number): string | null { return [...this.#values.keys()][index] ?? null; }
  removeItem(key: string): void { this.#values.delete(key); }
  setItem(key: string, value: string): void { this.#values.set(key, value); }
}

describe('local identity and investigator access', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    });
  });

  it('creates one stable 32-byte private identity per browser profile', () => {
    const first = getUserSecret();
    const second = getUserSecret();

    expect(first).toHaveLength(32);
    expect(second).toEqual(first);
  });

  it('round-trips a category-scoped investigator decryption key without exposing it on-chain', () => {
    const organizationIdHex = 'ab'.repeat(32);
    const privateKey: JsonWebKey = { kty: 'EC', crv: 'P-256', d: 'private-material' };
    const accessCode = exportInvestigatorAccess(organizationIdHex, { 2: privateKey });

    expect(accessCode).toMatch(/^gda2_/);
    expect(importInvestigatorAccess(accessCode)).toEqual({ organizationIdHex, categoryPrivateKeys: { 2: privateKey } });
    expect(getInvestigatorPrivateKey(organizationIdHex, 2)).toEqual(privateKey);
    expect(getInvestigatorPrivateKey(organizationIdHex, 1)).toBeNull();
  });

  it('rejects malformed investigator access packages', () => {
    expect(() => importInvestigatorAccess('bad-package')).toThrow(/gda2_/);
    expect(() => importInvestigatorAccess(`gda1_${btoa(JSON.stringify({ version: 2 }))}`)).toThrow(/Invalid/);
  });
});
