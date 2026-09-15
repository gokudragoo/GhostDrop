import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createStorageServer } from './app.js';

const servers: ReturnType<typeof createStorageServer>[] = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))));
});

describe('ciphertext content-addressed storage', () => {
  it('stores encrypted bytes by SHA-256 and returns them unchanged', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'ghostdrop-storage-'));
    const server = createStorageServer(directory);
    servers.push(server);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Expected TCP server address.');
    const origin = `http://127.0.0.1:${address.port}`;
    const body = Buffer.from('{"ciphertext":"private"}');

    const upload = await fetch(`${origin}/blobs`, { method: 'PUT', body });
    const result = await upload.json() as { ref: string; sha256: string };
    const download = await fetch(`${origin}/blobs/${result.sha256}`);

    expect(upload.status).toBe(201);
    expect(result.ref).toBe(`blob:${result.sha256}`);
    expect(Buffer.from(await download.arrayBuffer())).toEqual(body);
  });

  it('never exposes directory traversal paths', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'ghostdrop-storage-'));
    const server = createStorageServer(directory);
    servers.push(server);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Expected TCP server address.');
    const response = await fetch(`http://127.0.0.1:${address.port}/blobs/../../project.md`);
    expect(response.status).toBe(404);
  });
});
