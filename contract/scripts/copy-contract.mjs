import { cp, mkdir } from 'node:fs/promises';

await mkdir(new URL('../dist/managed/ghostdrop', import.meta.url), { recursive: true });
await cp(
  new URL('../src/managed/ghostdrop/contract', import.meta.url),
  new URL('../dist/managed/ghostdrop/contract', import.meta.url),
  { recursive: true },
);
