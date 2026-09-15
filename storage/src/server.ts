import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStorageServer } from './app.js';

const port = Number.parseInt(process.env.GHOSTDROP_STORAGE_PORT ?? '8787', 10);
const host = process.env.GHOSTDROP_STORAGE_HOST ?? '127.0.0.1';
const root = resolve(
  process.env.GHOSTDROP_STORAGE_DATA_DIR ?? fileURLToPath(new URL('../data', import.meta.url)),
);
const server = createStorageServer(root);

server.listen(port, host, () => {
  console.log(`GhostDrop content-addressed storage listening on http://${host}:${port} (data: ${root})`);
});
