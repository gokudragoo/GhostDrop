import { ecMulGenerator, type JubjubPoint } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import {
  GhostDrop,
  type MembershipCredential,
  type Schnorr_SchnorrSignature,
} from 'ghostdrop-contract';
import { fromBase64Url, fromHex, stableJson, toBase64Url, toHex, utf8 } from './codec.js';

const JUBJUB_ORDER = 6554484396890773809930967563523245729705921265872317281365359162392183254199n;
const TWO_248 = 452312848583266388373324160190187140051835877600158453279131187530910662656n;

const randomScalar = (): bigint => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return BigInt(`0x${toHex(bytes)}`) % JUBJUB_ORDER;
};

export type IssuerKeyPair = {
  readonly secretKey: bigint;
  readonly publicKey: JubjubPoint;
};

export type CredentialBundle = {
  readonly version: 2;
  readonly credential: MembershipCredential;
  readonly signature: Schnorr_SchnorrSignature;
};

type SerializedCredentialBundle = {
  readonly version: 2;
  readonly organizationId: string;
  readonly subject: string;
  readonly department: string;
  readonly employmentStartedAt: string;
  readonly validityEpoch: string;
  readonly announcementX: string;
  readonly announcementY: string;
  readonly response: string;
};

export const generateIssuerKeyPair = (): IssuerKeyPair => {
  const secretKey = randomScalar();
  return { secretKey, publicKey: ecMulGenerator(secretKey) };
};

export const getIssuerPublicKey = (secretKey: bigint): JubjubPoint =>
  ecMulGenerator(((secretKey % JUBJUB_ORDER) + JUBJUB_ORDER) % JUBJUB_ORDER);

const sign = (secretKey: bigint, message: bigint[]): Schnorr_SchnorrSignature => {
  const normalizedSecret = ((secretKey % JUBJUB_ORDER) + JUBJUB_ORDER) % JUBJUB_ORDER;
  const publicKey = ecMulGenerator(normalizedSecret);
  const nonce = randomScalar();
  const announcement = ecMulGenerator(nonce);
  const challenge = GhostDrop.pureCircuits.schnorrChallenge(
    announcement.x,
    announcement.y,
    publicKey.x,
    publicKey.y,
    message,
  ) % TWO_248;
  return {
    announcement,
    response: (nonce + challenge * normalizedSecret) % JUBJUB_ORDER,
  };
};

export const issueCredential = (
  issuerSecret: bigint,
  organizationId: Uint8Array,
  reporterSubject: Uint8Array,
  department: bigint,
  employmentStartedAt: bigint,
  validityEpoch: bigint,
): CredentialBundle => {
  if (department < 1n || department > 255n) throw new Error('Department must be between 1 and 255.');
  if (employmentStartedAt < 0n || employmentStartedAt > 18_446_744_073_709_551_615n) {
    throw new Error('Employment start timestamp is outside the supported range.');
  }
  if (validityEpoch < 1n || validityEpoch > 65_535n) {
    throw new Error('Credential validity epoch must be between 1 and 65535.');
  }
  const credential: MembershipCredential = {
    organizationId,
    subject: reporterSubject,
    department,
    employmentStartedAt,
    validityEpoch,
  };
  return {
    version: 2,
    credential,
    signature: sign(
      issuerSecret,
      GhostDrop.pureCircuits.credentialMessage(
        credential.organizationId,
        credential.subject,
        credential.department,
        credential.employmentStartedAt,
        credential.validityEpoch,
      ),
    ),
  };
};

export const serializeCredentialBundle = (bundle: CredentialBundle): string => {
  const serialized: SerializedCredentialBundle = {
    version: 2,
    organizationId: toHex(bundle.credential.organizationId),
    subject: toHex(bundle.credential.subject),
    department: bundle.credential.department.toString(),
    employmentStartedAt: bundle.credential.employmentStartedAt.toString(),
    validityEpoch: bundle.credential.validityEpoch.toString(),
    announcementX: bundle.signature.announcement.x.toString(),
    announcementY: bundle.signature.announcement.y.toString(),
    response: bundle.signature.response.toString(),
  };
  return `gdc2_${toBase64Url(utf8(stableJson(serialized)))}`;
};

export const parseCredentialBundle = (value: string): CredentialBundle => {
  if (!value.startsWith('gdc2_')) throw new Error('Credential code must begin with gdc2_.');
  const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(value.slice(5)))) as SerializedCredentialBundle;
  if (parsed.version !== 2) throw new Error('Unsupported credential version.');
  const organizationId = fromHex(parsed.organizationId);
  const subject = fromHex(parsed.subject);
  if (organizationId.length !== 32 || subject.length !== 32) throw new Error('Credential contains invalid identifiers.');
  return {
    version: 2,
    credential: {
      organizationId,
      subject,
      department: BigInt(parsed.department),
      employmentStartedAt: BigInt(parsed.employmentStartedAt),
      validityEpoch: BigInt(parsed.validityEpoch),
    },
    signature: {
      announcement: { x: BigInt(parsed.announcementX), y: BigInt(parsed.announcementY) },
      response: BigInt(parsed.response),
    },
  };
};

export const deriveReporterSubject = (secret: Uint8Array): Uint8Array =>
  GhostDrop.pureCircuits.deriveCredentialSubject(secret);

export const exportIssuerSecret = (secret: bigint): string => `gdi1_${secret.toString(16)}`;

export const importIssuerSecret = (value: string): bigint => {
  if (!/^gdi1_[0-9a-f]+$/i.test(value)) throw new Error('Invalid issuer secret.');
  return BigInt(`0x${value.slice(5)}`);
};
