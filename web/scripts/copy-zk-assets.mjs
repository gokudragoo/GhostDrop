import { cp, mkdir, rm } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const publicDirectory = new URL('public/', root);
const source = new URL('../contract/src/managed/ghostdrop/', root);

await mkdir(publicDirectory, { recursive: true });
for (const directory of ['keys', 'zkir']) {
  const target = new URL(`${directory}/`, publicDirectory);
  await rm(target, { recursive: true, force: true });
  await cp(new URL(`${directory}/`, source), target, { recursive: true });
}
