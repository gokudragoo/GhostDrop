import { describe, expect, it } from 'vitest';
import { toHex } from './codec.js';
import {
  decryptForOrganization,
  encryptForOrganization,
  encryptionPublicKeyHash,
  envelopeCommitment,
  generateEncryptionKeyPair,
} from './crypto.js';

describe('GhostDrop client encryption', () => {
  it('round-trips confidential report data with an organization key', async () => {
    const keys = await generateEncryptionKeyPair();
    const original = { title: 'Vendor anomaly', description: 'Private details', evidence: ['invoice.pdf'] };
    const envelope = await encryptForOrganization(original, keys.publicKey);
    const decrypted = await decryptForOrganization<typeof original>(envelope, keys.privateKey);
    expect(decrypted).toEqual(original);
    expect(envelope.ciphertext).not.toContain(original.description);
  });

  it('rejects decryption with another organization key', async () => {
    const recipient = await generateEncryptionKeyPair();
    const stranger = await generateEncryptionKeyPair();
    const envelope = await encryptForOrganization({ secret: 'protected' }, recipient.publicKey);
    await expect(decryptForOrganization(envelope, stranger.privateKey)).rejects.toThrow();
  });

  it('produces stable 32-byte commitments for public verification', async () => {
    const keys = await generateEncryptionKeyPair();
    const envelope = await encryptForOrganization({ value: 42 }, keys.publicKey);
    expect((await envelopeCommitment(envelope)).length).toBe(32);
    expect(toHex(await encryptionPublicKeyHash(keys.publicKey))).toMatch(/^[0-9a-f]{64}$/);
  });
});
