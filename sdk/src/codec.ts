const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const utf8 = (value: string): Uint8Array => encoder.encode(value);
export const fromUtf8 = (value: BufferSource): string => decoder.decode(value);
export const ownedBuffer = (value: Uint8Array): ArrayBuffer => Uint8Array.from(value).buffer;

export const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

export const fromHex = (hex: string): Uint8Array => {
  if (!/^[0-9a-f]*$/i.test(hex) || hex.length % 2 !== 0) {
    throw new Error('Expected an even-length hexadecimal value.');
  }
  return Uint8Array.from(hex.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16));
};

export const toBase64Url = (bytes: Uint8Array): string => {
  const base64 = typeof Buffer !== 'undefined'
    ? Buffer.from(bytes).toString('base64')
    : btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

export const fromBase64Url = (value: string): Uint8Array => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return typeof Buffer !== 'undefined'
    ? Uint8Array.from(Buffer.from(base64, 'base64'))
    : Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
};

export const stableJson = (value: unknown): string => {
  const normalize = (entry: unknown): unknown => {
    if (Array.isArray(entry)) return entry.map(normalize);
    if (entry && typeof entry === 'object') {
      return Object.fromEntries(
        Object.entries(entry as Record<string, unknown>)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([key, child]) => [key, normalize(child)]),
      );
    }
    return entry;
  };
  return JSON.stringify(normalize(value));
};

export const sha256 = async (value: Uint8Array | string): Promise<Uint8Array> => {
  const input = typeof value === 'string' ? utf8(value) : value;
  return new Uint8Array(await crypto.subtle.digest('SHA-256', ownedBuffer(input)));
};
