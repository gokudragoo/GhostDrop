const endpoints = [
  {
    name: 'Proof server',
    url: `${process.env.MIDNIGHT_PROOF_SERVER_URL ?? 'http://127.0.0.1:6300'}/version`,
    options: {},
  },
  {
    name: 'Opaque storage',
    url: `${process.env.GHOSTDROP_STORAGE_URL ?? 'http://127.0.0.1:8787'}/health`,
    options: {},
  },
  {
    name: 'Preprod indexer',
    url: process.env.MIDNIGHT_INDEXER_URL ?? 'https://indexer.preprod.midnight.network/api/v4/graphql',
    options: {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: 'query GhostDropReadiness { __typename }' }),
    },
  },
];

let failed = false;
for (const endpoint of endpoints) {
  try {
    const response = await fetch(endpoint.url, {
      ...endpoint.options,
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log(`OK  ${endpoint.name}: ${endpoint.url}`);
  } catch (error) {
    failed = true;
    console.error(`ERR ${endpoint.name}: ${endpoint.url} (${error instanceof Error ? error.message : String(error)})`);
  }
}

if (failed) process.exit(1);
