import { sha256, toHex } from './codec.js';

export class CiphertextStorageClient {
  constructor(private readonly baseUrl: string) {}

  async put(data: Uint8Array | string): Promise<{ ref: string; commitment: Uint8Array }> {
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    const commitment = await sha256(bytes);
    const response = await fetch(`${this.baseUrl}/blobs`, {
      method: 'PUT',
      headers: { 'content-type': 'application/octet-stream' },
      body: new Blob([Uint8Array.from(bytes)]),
    });
    if (!response.ok) throw new Error(`Encrypted storage rejected the upload (${response.status}).`);
    const result = await response.json() as { ref: string; sha256: string };
    if (result.sha256 !== toHex(commitment)) throw new Error('Encrypted storage returned a mismatched commitment.');
    return { ref: result.ref, commitment };
  }

  async get(ref: string): Promise<Uint8Array> {
    if (!/^blob:[0-9a-f]{64}$/i.test(ref)) throw new Error('Invalid encrypted blob reference.');
    const response = await fetch(`${this.baseUrl}/blobs/${ref.slice(5)}`);
    if (!response.ok) throw new Error(response.status === 404 ? 'Encrypted payload was not found.' : 'Encrypted storage is unavailable.');
    const bytes = new Uint8Array(await response.arrayBuffer());
    const digest = await sha256(bytes);
    if (toHex(digest) !== ref.slice(5)) throw new Error('Encrypted payload failed its integrity check.');
    return bytes;
  }
}
