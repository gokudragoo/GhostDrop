import { fromBase64Url, fromUtf8, ownedBuffer, sha256, stableJson, toBase64Url, utf8 } from './codec.js';

export type EncryptionKeyPair = {
  readonly publicKey: JsonWebKey;
  readonly privateKey: JsonWebKey;
};

export type EncryptedEnvelope = {
  readonly version: 1;
  readonly algorithm: 'ECDH-P256/HKDF-SHA256/AES-256-GCM';
  readonly ephemeralPublicKey: JsonWebKey;
  readonly salt: string;
  readonly iv: string;
  readonly ciphertext: string;
};

const deriveEnvelopeKey = async (
  privateKey: CryptoKey,
  publicKey: CryptoKey,
  salt: Uint8Array,
): Promise<CryptoKey> => {
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: publicKey },
    privateKey,
    256,
  );
  const keyMaterial = await crypto.subtle.importKey('raw', sharedSecret, 'HKDF', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: ownedBuffer(salt),
      info: ownedBuffer(utf8('GhostDrop encrypted envelope v1')),
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
};

export const generateEncryptionKeyPair = async (): Promise<EncryptionKeyPair> => {
  const pair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey', 'deriveBits'],
  );
  return {
    publicKey: await crypto.subtle.exportKey('jwk', pair.publicKey),
    privateKey: await crypto.subtle.exportKey('jwk', pair.privateKey),
  };
};

export const encryptForOrganization = async (
  value: unknown,
  organizationPublicKey: JsonWebKey,
): Promise<EncryptedEnvelope> => {
  const recipientPublicKey = await crypto.subtle.importKey(
    'jwk',
    organizationPublicKey,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    [],
  );
  const ephemeral = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits'],
  );
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveEnvelopeKey(ephemeral.privateKey, recipientPublicKey, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ownedBuffer(iv), additionalData: ownedBuffer(utf8('GhostDrop:v1')) },
    key,
    ownedBuffer(utf8(stableJson(value))),
  );

  return {
    version: 1,
    algorithm: 'ECDH-P256/HKDF-SHA256/AES-256-GCM',
    ephemeralPublicKey: await crypto.subtle.exportKey('jwk', ephemeral.publicKey),
    salt: toBase64Url(salt),
    iv: toBase64Url(iv),
    ciphertext: toBase64Url(new Uint8Array(ciphertext)),
  };
};

export const decryptForOrganization = async <T>(
  envelope: EncryptedEnvelope,
  organizationPrivateKey: JsonWebKey,
): Promise<T> => {
  if (envelope.version !== 1 || envelope.algorithm !== 'ECDH-P256/HKDF-SHA256/AES-256-GCM') {
    throw new Error('Unsupported encrypted envelope.');
  }
  const recipientPrivateKey = await crypto.subtle.importKey(
    'jwk',
    organizationPrivateKey,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    ['deriveBits'],
  );
  const ephemeralPublicKey = await crypto.subtle.importKey(
    'jwk',
    envelope.ephemeralPublicKey,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    [],
  );
  const key = await deriveEnvelopeKey(recipientPrivateKey, ephemeralPublicKey, fromBase64Url(envelope.salt));
  const plaintext = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ownedBuffer(fromBase64Url(envelope.iv)),
      additionalData: ownedBuffer(utf8('GhostDrop:v1')),
    },
    key,
    ownedBuffer(fromBase64Url(envelope.ciphertext)),
  );
  return JSON.parse(fromUtf8(plaintext)) as T;
};

export const envelopeCommitment = (envelope: EncryptedEnvelope): Promise<Uint8Array> =>
  sha256(stableJson(envelope));

export const encryptionPublicKeyHash = (publicKey: JsonWebKey): Promise<Uint8Array> =>
  sha256(stableJson(publicKey));
