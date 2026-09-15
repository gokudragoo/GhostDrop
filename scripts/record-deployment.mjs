import { mkdir, readFile, writeFile } from 'node:fs/promises';

const [, , rawAddress, rawTransactionId = ''] = process.argv;
const contractAddress = rawAddress?.trim();
const transactionId = rawTransactionId.trim();

if (!contractAddress || /\s/.test(contractAddress)) {
  console.error('Usage: npm run deployment:record -- <contract-address> [deployment-transaction-id]');
  process.exit(1);
}

const root = new URL('../', import.meta.url);
const envUrl = new URL('web/.env.preprod', root);
const deploymentsUrl = new URL('deployments/', root);
const recordUrl = new URL('preprod.json', deploymentsUrl);
const contractInfo = JSON.parse(await readFile(
  new URL('contract/src/managed/ghostdrop/compiler/contract-info.json', root),
  'utf8',
));

let environment = await readFile(envUrl, 'utf8');
const setting = `VITE_DEFAULT_CONTRACT=${contractAddress}`;
environment = /^VITE_DEFAULT_CONTRACT=.*$/m.test(environment)
  ? environment.replace(/^VITE_DEFAULT_CONTRACT=.*$/m, setting)
  : `${environment.trimEnd()}\n${setting}\n`;

const record = {
  network: 'preprod',
  contractAddress,
  deploymentTransactionId: transactionId || null,
  recordedAt: new Date().toISOString(),
  compilerVersion: contractInfo['compiler-version'],
  languageVersion: contractInfo['language-version'],
  runtimeVersion: contractInfo['runtime-version'],
  indexerUrl: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  explorerUrl: 'https://preprod.midnightexplorer.com/',
};

await mkdir(deploymentsUrl, { recursive: true });
await Promise.all([
  writeFile(envUrl, environment),
  writeFile(recordUrl, `${JSON.stringify(record, null, 2)}\n`),
]);

console.log(`Recorded Preprod contract ${contractAddress}`);
console.log('Rebuild the web application before publishing so VITE_DEFAULT_CONTRACT is embedded.');
