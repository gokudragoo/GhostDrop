import { createGhostDropPrivateState, type GhostDropPrivateState } from 'ghostdrop-contract';
import {
  fromBase64Url,
  fromHex,
  parseCredentialBundle,
  toBase64Url,
  toHex,
  utf8,
  type CredentialBundle,
  type EncryptionKeyPair,
} from 'ghostdrop-api';

const USER_SECRET_KEY = 'ghostdrop:user-secret:v1';
const LEGACY_CREDENTIAL_KEY = 'ghostdrop:credential:v1';
const ACTIVE_CREDENTIAL_KEY = 'ghostdrop:credential:active:v2';
const CREDENTIAL_PREFIX = 'ghostdrop:credential:v2:';
const LEGACY_REPORTER_ENCRYPTION_KEY = 'ghostdrop:reporter-encryption:v1';
const REPORTER_ENCRYPTION_PREFIX = 'ghostdrop:reporter-encryption:v2:';
const ORGANIZATION_PREFIX = 'ghostdrop:organization:';
const LEGACY_INVESTIGATOR_ACCESS_PREFIX = 'ghostdrop:investigator-access:';
const INVESTIGATOR_ACCESS_PREFIX = 'ghostdrop:investigator-access:v2:';

type Category = string | number | bigint;
type CredentialValidator = (bundle: CredentialBundle) => void;
type CategoryPrivateKeyInput = Readonly<Record<string, JsonWebKey | EncryptionKeyPair>>;

export type OrganizationSecrets = {
  readonly issuerSecret: string;
  readonly currentEncryptionKeys: Readonly<Record<string, EncryptionKeyPair>>;
  readonly archivedEncryptionKeys: Readonly<Record<string, readonly EncryptionKeyPair[]>>;
};

type LegacyOrganizationSecrets = {
  readonly issuerSecret: string;
  readonly encryptionKeys: EncryptionKeyPair;
};

type InvestigatorAccessPackage = {
  readonly version: 2;
  readonly organizationIdHex: string;
  readonly categoryPrivateKeys: Readonly<Record<string, JsonWebKey>>;
};

type StoredInvestigatorAccess = {
  readonly version: 2;
  readonly currentPrivateKeys: Readonly<Record<string, JsonWebKey>>;
  readonly archivedPrivateKeys: Readonly<Record<string, readonly JsonWebKey[]>>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeOrganizationId = (organizationIdHex: string): string => {
  const normalized = organizationIdHex.trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(normalized)) throw new Error('Organization identifier must be 32-byte hexadecimal.');
  return normalized;
};

const normalizeCommitment = (commitment: Uint8Array | string): string => {
  const normalized = typeof commitment === 'string' ? commitment.trim().toLowerCase() : toHex(commitment);
  if (!/^[0-9a-f]{64}$/.test(normalized)) throw new Error('Report commitment must be 32-byte hexadecimal.');
  return normalized;
};

const normalizeCategory = (category: Category): string => {
  const numeric = typeof category === 'bigint' ? category : BigInt(category);
  if (numeric < 0n || numeric > 255n) throw new Error('Category must be between 0 and 255.');
  return numeric.toString();
};

const isPrivateKey = (value: unknown): value is JsonWebKey =>
  isRecord(value) && typeof value.kty === 'string' && typeof value.d === 'string' && value.d.length > 0;

const isEncryptionKeyPair = (value: unknown): value is EncryptionKeyPair =>
  isRecord(value) && isRecord(value.publicKey) && isPrivateKey(value.privateKey);

const sameKey = (left: JsonWebKey, right: JsonWebKey): boolean =>
  JSON.stringify(left) === JSON.stringify(right);

const uniquePrivateKeys = (keys: readonly JsonWebKey[]): JsonWebKey[] => {
  const result: JsonWebKey[] = [];
  for (const key of keys) if (!result.some((candidate) => sameKey(candidate, key))) result.push(key);
  return result;
};

const normalizeKeyPairRecord = (value: unknown): Record<string, EncryptionKeyPair> => {
  if (!isRecord(value)) throw new Error('Organization category keys are invalid.');
  const result: Record<string, EncryptionKeyPair> = {};
  for (const [category, pair] of Object.entries(value)) {
    const normalizedCategory = normalizeCategory(category);
    if (!isEncryptionKeyPair(pair)) throw new Error(`Organization key for category ${normalizedCategory} is invalid.`);
    result[normalizedCategory] = pair;
  }
  return result;
};

const normalizeArchiveRecord = (value: unknown): Record<string, EncryptionKeyPair[]> => {
  if (value === undefined) return {};
  if (!isRecord(value)) throw new Error('Organization archived category keys are invalid.');
  const result: Record<string, EncryptionKeyPair[]> = {};
  for (const [category, pairs] of Object.entries(value)) {
    const normalizedCategory = normalizeCategory(category);
    if (!Array.isArray(pairs) || !pairs.every(isEncryptionKeyPair)) {
      throw new Error(`Organization key archive for category ${normalizedCategory} is invalid.`);
    }
    result[normalizedCategory] = pairs;
  }
  return result;
};

const normalizeOrganizationSecrets = (value: unknown): OrganizationSecrets => {
  if (!isRecord(value) || typeof value.issuerSecret !== 'string') throw new Error('Organization secrets are invalid.');
  if (isEncryptionKeyPair(value.encryptionKeys)) {
    return {
      issuerSecret: value.issuerSecret,
      currentEncryptionKeys: { 0: value.encryptionKeys },
      archivedEncryptionKeys: {},
    };
  }
  return {
    issuerSecret: value.issuerSecret,
    currentEncryptionKeys: normalizeKeyPairRecord(value.currentEncryptionKeys),
    archivedEncryptionKeys: normalizeArchiveRecord(value.archivedEncryptionKeys),
  };
};

const organizationStorageKey = (organizationIdHex: string): string =>
  `${ORGANIZATION_PREFIX}${normalizeOrganizationId(organizationIdHex)}`;

const investigatorStorageKey = (organizationIdHex: string): string =>
  `${INVESTIGATOR_ACCESS_PREFIX}${normalizeOrganizationId(organizationIdHex)}`;

const readStoredInvestigatorAccess = (organizationIdHex: string): StoredInvestigatorAccess | null => {
  const normalizedId = normalizeOrganizationId(organizationIdHex);
  const stored = localStorage.getItem(investigatorStorageKey(normalizedId));
  if (stored) {
    const parsed = JSON.parse(stored) as unknown;
    if (!isRecord(parsed) || parsed.version !== 2 || !isRecord(parsed.currentPrivateKeys) || !isRecord(parsed.archivedPrivateKeys)) {
      throw new Error('Stored investigator access is invalid.');
    }
    const currentPrivateKeys: Record<string, JsonWebKey> = {};
    const archivedPrivateKeys: Record<string, JsonWebKey[]> = {};
    for (const [category, key] of Object.entries(parsed.currentPrivateKeys)) {
      const normalizedCategory = normalizeCategory(category);
      if (!isPrivateKey(key)) throw new Error(`Stored investigator key for category ${normalizedCategory} is invalid.`);
      currentPrivateKeys[normalizedCategory] = key;
    }
    for (const [category, keys] of Object.entries(parsed.archivedPrivateKeys)) {
      const normalizedCategory = normalizeCategory(category);
      if (!Array.isArray(keys) || !keys.every(isPrivateKey)) {
        throw new Error(`Stored investigator key archive for category ${normalizedCategory} is invalid.`);
      }
      archivedPrivateKeys[normalizedCategory] = uniquePrivateKeys(keys);
    }
    return { version: 2, currentPrivateKeys, archivedPrivateKeys };
  }

  const legacy = localStorage.getItem(`${LEGACY_INVESTIGATOR_ACCESS_PREFIX}${normalizedId}`);
  if (!legacy) return null;
  const privateKey = JSON.parse(legacy) as unknown;
  if (!isPrivateKey(privateKey)) throw new Error('Stored legacy investigator access is invalid.');
  const migrated: StoredInvestigatorAccess = {
    version: 2,
    currentPrivateKeys: { 0: privateKey },
    archivedPrivateKeys: {},
  };
  localStorage.setItem(investigatorStorageKey(normalizedId), JSON.stringify(migrated));
  return migrated;
};

export const getUserSecret = (): Uint8Array => {
  const existing = localStorage.getItem(USER_SECRET_KEY);
  if (existing) return fromHex(existing);
  const secret = crypto.getRandomValues(new Uint8Array(32));
  localStorage.setItem(USER_SECRET_KEY, toHex(secret));
  return secret;
};

const migrateLegacyCredential = (): CredentialBundle | null => {
  const value = localStorage.getItem(LEGACY_CREDENTIAL_KEY);
  if (!value) return null;
  const bundle = parseCredentialBundle(value);
  const organizationIdHex = toHex(bundle.credential.organizationId);
  localStorage.setItem(`${CREDENTIAL_PREFIX}${organizationIdHex}`, value);
  localStorage.setItem(ACTIVE_CREDENTIAL_KEY, organizationIdHex);
  return bundle;
};

export const getCredential = (organizationIdHex?: string): CredentialBundle | null => {
  const requestedId = organizationIdHex ? normalizeOrganizationId(organizationIdHex) : null;
  const activeId = requestedId ?? localStorage.getItem(ACTIVE_CREDENTIAL_KEY);
  if (activeId) {
    const value = localStorage.getItem(`${CREDENTIAL_PREFIX}${normalizeOrganizationId(activeId)}`);
    if (value) return parseCredentialBundle(value);
  }
  const legacy = migrateLegacyCredential();
  if (!legacy) return null;
  return !requestedId || toHex(legacy.credential.organizationId) === requestedId ? legacy : null;
};

export const saveCredential = (code: string, validate?: CredentialValidator): CredentialBundle => {
  const normalizedCode = code.trim();
  const bundle = parseCredentialBundle(normalizedCode);
  validate?.(bundle);
  const organizationIdHex = normalizeOrganizationId(toHex(bundle.credential.organizationId));
  localStorage.setItem(`${CREDENTIAL_PREFIX}${organizationIdHex}`, normalizedCode);
  localStorage.setItem(ACTIVE_CREDENTIAL_KEY, organizationIdHex);
  return bundle;
};

export const removeCredential = (organizationIdHex: string): void => {
  const normalizedId = normalizeOrganizationId(organizationIdHex);
  localStorage.removeItem(`${CREDENTIAL_PREFIX}${normalizedId}`);
  if (localStorage.getItem(ACTIVE_CREDENTIAL_KEY) === normalizedId) localStorage.removeItem(ACTIVE_CREDENTIAL_KEY);
};

export const getPrivateState = (organizationIdHex?: string): GhostDropPrivateState => {
  const bundle = getCredential(organizationIdHex);
  if (!bundle) return createGhostDropPrivateState(getUserSecret());
  return {
    userSecret: getUserSecret(),
    credential: bundle.credential,
    credentialSignature: bundle.signature,
  };
};

export function saveReporterEncryptionKeys(reportCommitment: Uint8Array | string, keys: EncryptionKeyPair): void;
/** @deprecated Supply the report commitment as the first argument. */
export function saveReporterEncryptionKeys(keys: EncryptionKeyPair): void;
export function saveReporterEncryptionKeys(
  reportCommitmentOrKeys: Uint8Array | string | EncryptionKeyPair,
  keys?: EncryptionKeyPair,
): void {
  if (keys) {
    const commitment = normalizeCommitment(reportCommitmentOrKeys as Uint8Array | string);
    localStorage.setItem(`${REPORTER_ENCRYPTION_PREFIX}${commitment}`, JSON.stringify(keys));
    return;
  }
  if (!isEncryptionKeyPair(reportCommitmentOrKeys)) throw new Error('Reporter encryption keys are invalid.');
  localStorage.setItem(LEGACY_REPORTER_ENCRYPTION_KEY, JSON.stringify(reportCommitmentOrKeys));
}

export const getReporterEncryptionKeys = (reportCommitment?: Uint8Array | string): EncryptionKeyPair | null => {
  if (reportCommitment !== undefined) {
    const commitment = normalizeCommitment(reportCommitment);
    const scoped = localStorage.getItem(`${REPORTER_ENCRYPTION_PREFIX}${commitment}`);
    if (scoped) return JSON.parse(scoped) as EncryptionKeyPair;
    const legacy = localStorage.getItem(LEGACY_REPORTER_ENCRYPTION_KEY);
    if (!legacy) return null;
    const migrated = JSON.parse(legacy) as EncryptionKeyPair;
    if (!isEncryptionKeyPair(migrated)) throw new Error('Stored reporter encryption keys are invalid.');
    localStorage.setItem(`${REPORTER_ENCRYPTION_PREFIX}${commitment}`, JSON.stringify(migrated));
    return migrated;
  }
  const legacy = localStorage.getItem(LEGACY_REPORTER_ENCRYPTION_KEY);
  return legacy ? JSON.parse(legacy) as EncryptionKeyPair : null;
};

export const saveOrganizationSecrets = (
  organizationIdHex: string,
  secrets: OrganizationSecrets | LegacyOrganizationSecrets,
): void => {
  localStorage.setItem(organizationStorageKey(organizationIdHex), JSON.stringify(normalizeOrganizationSecrets(secrets)));
};

export const getOrganizationSecrets = (organizationIdHex: string): OrganizationSecrets | null => {
  const key = organizationStorageKey(organizationIdHex);
  const value = localStorage.getItem(key);
  if (!value) return null;
  const normalized = normalizeOrganizationSecrets(JSON.parse(value) as unknown);
  localStorage.setItem(key, JSON.stringify(normalized));
  return normalized;
};

export const rotateOrganizationCategoryKey = (
  organizationIdHex: string,
  category: Category,
  nextKeys: EncryptionKeyPair,
): OrganizationSecrets => {
  if (!isEncryptionKeyPair(nextKeys)) throw new Error('The replacement organization encryption key is invalid.');
  const existing = getOrganizationSecrets(organizationIdHex);
  if (!existing) throw new Error('Organization secrets were not found in this browser.');
  const categoryKey = normalizeCategory(category);
  const current = { ...existing.currentEncryptionKeys };
  const archived = Object.fromEntries(
    Object.entries(existing.archivedEncryptionKeys).map(([key, values]) => [key, [...values]]),
  ) as Record<string, EncryptionKeyPair[]>;
  const previous = current[categoryKey];
  if (previous && !sameKey(previous.privateKey, nextKeys.privateKey)) {
    const priorArchive = archived[categoryKey] ?? [];
    if (!priorArchive.some((pair) => sameKey(pair.privateKey, previous.privateKey))) archived[categoryKey] = [previous, ...priorArchive];
  }
  current[categoryKey] = nextKeys;
  const updated: OrganizationSecrets = {
    issuerSecret: existing.issuerSecret,
    currentEncryptionKeys: current,
    archivedEncryptionKeys: archived,
  };
  saveOrganizationSecrets(organizationIdHex, updated);
  return updated;
};

export const getOrganizationEncryptionKeys = (
  organizationIdHex: string,
  category: Category,
): readonly EncryptionKeyPair[] => {
  const secrets = getOrganizationSecrets(organizationIdHex);
  if (!secrets) return [];
  const categoryKey = normalizeCategory(category);
  const exact = [
    secrets.currentEncryptionKeys[categoryKey],
    ...(secrets.archivedEncryptionKeys[categoryKey] ?? []),
  ].filter((entry): entry is EncryptionKeyPair => Boolean(entry));
  if (categoryKey === '0') return exact;
  const legacy = [
    secrets.currentEncryptionKeys['0'],
    ...(secrets.archivedEncryptionKeys['0'] ?? []),
  ].filter((entry): entry is EncryptionKeyPair => Boolean(entry));
  return [...exact, ...legacy];
};

const normalizeAccessInput = (input: CategoryPrivateKeyInput | EncryptionKeyPair): Record<string, JsonWebKey> => {
  if (isEncryptionKeyPair(input)) return { 0: input.privateKey };
  const result: Record<string, JsonWebKey> = {};
  for (const [category, keyOrPair] of Object.entries(input)) {
    const categoryKey = normalizeCategory(category);
    const privateKey = isEncryptionKeyPair(keyOrPair) ? keyOrPair.privateKey : keyOrPair;
    if (!isPrivateKey(privateKey)) throw new Error(`Investigator key for category ${categoryKey} is invalid.`);
    result[categoryKey] = privateKey;
  }
  if (Object.keys(result).length === 0) throw new Error('Encoded investigator access must contain at least one category key.');
  return result;
};

export const encodeInvestigatorAccess = (
  organizationIdHex: string,
  categoryKeys: CategoryPrivateKeyInput,
): string => {
  const payload: InvestigatorAccessPackage = {
    version: 2,
    organizationIdHex: normalizeOrganizationId(organizationIdHex),
    categoryPrivateKeys: normalizeAccessInput(categoryKeys),
  };
  return `gda2_${toBase64Url(utf8(JSON.stringify(payload)))}`;
};

/** @deprecated Use encodeInvestigatorAccess with an explicit category-key map. */
export const exportInvestigatorAccess = (
  organizationIdHex: string,
  categoryKeys: CategoryPrivateKeyInput | EncryptionKeyPair,
): string => {
  const payload: InvestigatorAccessPackage = {
    version: 2,
    organizationIdHex: normalizeOrganizationId(organizationIdHex),
    categoryPrivateKeys: normalizeAccessInput(categoryKeys),
  };
  return `gda2_${toBase64Url(utf8(JSON.stringify(payload)))}`;
};

const parseInvestigatorAccessPackage = (code: string): InvestigatorAccessPackage => {
  const normalized = code.trim();
  if (normalized.startsWith('gda2_')) {
    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(normalized.slice(5)))) as unknown;
    if (!isRecord(parsed) || parsed.version !== 2 || typeof parsed.organizationIdHex !== 'string' || !isRecord(parsed.categoryPrivateKeys)) {
      throw new Error('Invalid encoded investigator access package.');
    }
    return {
      version: 2,
      organizationIdHex: normalizeOrganizationId(parsed.organizationIdHex),
      categoryPrivateKeys: normalizeAccessInput(parsed.categoryPrivateKeys as CategoryPrivateKeyInput),
    };
  }
  if (normalized.startsWith('gda1_')) {
    const parsed = JSON.parse(atob(normalized.slice(5))) as unknown;
    if (!isRecord(parsed) || parsed.version !== 1 || typeof parsed.organizationIdHex !== 'string' || !isPrivateKey(parsed.encryptionPrivateKey)) {
      throw new Error('Invalid legacy investigator access package.');
    }
    return {
      version: 2,
      organizationIdHex: normalizeOrganizationId(parsed.organizationIdHex),
      categoryPrivateKeys: { 0: parsed.encryptionPrivateKey },
    };
  }
  throw new Error('Encoded investigator access package must begin with gda2_ (or legacy gda1_).');
};

export const importInvestigatorAccess = (code: string): {
  readonly organizationIdHex: string;
  readonly categoryPrivateKeys: Readonly<Record<string, JsonWebKey>>;
} => {
  const access = parseInvestigatorAccessPackage(code);
  const existing = readStoredInvestigatorAccess(access.organizationIdHex);
  const currentPrivateKeys: Record<string, JsonWebKey> = { ...(existing?.currentPrivateKeys ?? {}) };
  const archivedPrivateKeys = Object.fromEntries(
    Object.entries(existing?.archivedPrivateKeys ?? {}).map(([category, keys]) => [category, [...keys]]),
  ) as Record<string, JsonWebKey[]>;

  for (const [category, nextKey] of Object.entries(access.categoryPrivateKeys)) {
    const previous = currentPrivateKeys[category];
    if (previous && !sameKey(previous, nextKey)) {
      archivedPrivateKeys[category] = uniquePrivateKeys([previous, ...(archivedPrivateKeys[category] ?? [])]);
    }
    currentPrivateKeys[category] = nextKey;
  }

  const stored: StoredInvestigatorAccess = { version: 2, currentPrivateKeys, archivedPrivateKeys };
  localStorage.setItem(investigatorStorageKey(access.organizationIdHex), JSON.stringify(stored));
  return { organizationIdHex: access.organizationIdHex, categoryPrivateKeys: access.categoryPrivateKeys };
};

export const getInvestigatorPrivateKeys = (
  organizationIdHex: string,
  category: Category,
): readonly JsonWebKey[] => {
  const categoryKey = normalizeCategory(category);
  const organizationKeys = getOrganizationEncryptionKeys(organizationIdHex, category).map((pair) => pair.privateKey);
  const access = readStoredInvestigatorAccess(organizationIdHex);
  const exact = access
    ? [access.currentPrivateKeys[categoryKey], ...(access.archivedPrivateKeys[categoryKey] ?? [])]
      .filter((entry): entry is JsonWebKey => Boolean(entry))
    : [];
  const legacy = access && categoryKey !== '0'
    ? [access.currentPrivateKeys['0'], ...(access.archivedPrivateKeys['0'] ?? [])]
      .filter((entry): entry is JsonWebKey => Boolean(entry))
    : [];
  return uniquePrivateKeys([...organizationKeys, ...exact, ...legacy]);
};

export const getInvestigatorPrivateKey = (
  organizationIdHex: string,
  category: Category = 0,
): JsonWebKey | null => getInvestigatorPrivateKeys(organizationIdHex, category)[0] ?? null;
