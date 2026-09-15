import { describe, expect, it } from 'vitest';
import { GhostDrop } from 'ghostdrop-contract';
import {
  deriveReporterSubject,
  generateIssuerKeyPair,
  issueCredential,
  parseCredentialBundle,
  serializeCredentialBundle,
} from './credentials.js';

describe('membership credential exchange', () => {
  it('serializes an issuer-signed private credential without losing field precision', () => {
    const issuer = generateIssuerKeyPair();
    const secret = crypto.getRandomValues(new Uint8Array(32));
    const organizationId = crypto.getRandomValues(new Uint8Array(32));
    const bundle = issueCredential(
      issuer.secretKey,
      organizationId,
      deriveReporterSubject(secret),
      3n,
      1_700_000_000n,
      7n,
    );
    const parsed = parseCredentialBundle(serializeCredentialBundle(bundle));
    expect(parsed).toEqual(bundle);
    expect(parsed.credential.subject).toEqual(GhostDrop.pureCircuits.deriveCredentialSubject(secret));
  });

  it('rejects malformed credential exchange codes', () => {
    expect(() => parseCredentialBundle('not-a-credential')).toThrow('gdc2_');
  });
});
