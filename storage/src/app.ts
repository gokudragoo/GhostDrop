import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { join } from 'node:path';

const MAX_BLOB_BYTES = 5 * 1024 * 1024;
const HASH_PATTERN = /^[0-9a-f]{64}$/;

const sendJson = (response: ServerResponse, status: number, body: unknown): void => {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,PUT,OPTIONS',
    'access-control-allow-headers': 'content-type',
    'cache-control': 'no-store',
  });
  response.end(JSON.stringify(body));
};

const readBody = async (request: IncomingMessage): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const bytes = Buffer.from(chunk);
    size += bytes.length;
    if (size > MAX_BLOB_BYTES) throw new Error('PAYLOAD_TOO_LARGE');
    chunks.push(bytes);
  }
  return Buffer.concat(chunks);
};

export const createStorageServer = (dataDirectory: string) => createServer(async (request, response) => {
  try {
    if (request.method === 'OPTIONS') {
      response.writeHead(204, {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET,PUT,OPTIONS',
        'access-control-allow-headers': 'content-type',
      });
      response.end();
      return;
    }

    if (request.method === 'GET' && request.url === '/health') {
      sendJson(response, 200, {
        status: 'ok',
        storage: 'opaque-content-addressed',
        sensitivePayloads: 'client-encrypted',
        maxBlobBytes: MAX_BLOB_BYTES,
      });
      return;
    }

    if (request.method === 'PUT' && request.url === '/blobs') {
      const bytes = await readBody(request);
      if (bytes.length === 0) {
        sendJson(response, 400, { error: 'Encrypted blob cannot be empty.' });
        return;
      }
      const hash = createHash('sha256').update(bytes).digest('hex');
      await mkdir(dataDirectory, { recursive: true });
      await writeFile(join(dataDirectory, hash), bytes, { flag: 'wx' }).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== 'EEXIST') throw error;
      });
      sendJson(response, 201, { ref: `blob:${hash}`, sha256: hash, bytes: bytes.length });
      return;
    }

    const match = request.method === 'GET' ? request.url?.match(/^\/blobs\/([0-9a-f]{64})$/) : null;
    if (match && HASH_PATTERN.test(match[1])) {
      try {
        const bytes = await readFile(join(dataDirectory, match[1]));
        response.writeHead(200, {
          'content-type': 'application/octet-stream',
          'content-length': bytes.length,
          'access-control-allow-origin': '*',
          'cache-control': 'public, max-age=31536000, immutable',
        });
        response.end(bytes);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') sendJson(response, 404, { error: 'Blob not found.' });
        else throw error;
      }
      return;
    }

    sendJson(response, 404, { error: 'Route not found.' });
  } catch (error) {
    if (error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE') {
      sendJson(response, 413, { error: `Encrypted blobs are limited to ${MAX_BLOB_BYTES} bytes.` });
    } else {
      sendJson(response, 500, { error: 'Encrypted storage failed.' });
    }
  }
});
