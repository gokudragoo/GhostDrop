# GhostDrop Preprod deployment

This runbook separates the three systems involved in a usable GhostDrop deployment:

1. the Compact contract deployed to Midnight Preprod;
2. the static browser DApp, including its generated ZK assets;
3. shared durable HTTPS storage for encrypted reports and messages.

Deploying only the contract is not sufficient for a multi-user end-to-end instance.

## 1. Release gate

From the repository root, confirm the expected toolchain and a clean verification run:

```powershell
node --version
npm ci
npm run contract:compile
npm run typecheck
npm test
npm run build
```

The generated `contract-info.json` must report compiler `0.31.1`, language `0.23.0`, and runtime `0.16.0`. The web build must contain matching files under `web/dist/keys` and `web/dist/zkir`. The largest current static artifact is roughly 11 MiB, so choose a frontend host whose per-file and total deployment limits accommodate the complete bundle.

Do not deploy if contract source, generated bindings, prover keys, verifier keys, and ZKIR files were produced by different compiler runs.

## 2. Deploy shared opaque storage

For same-machine testing, `npm run dev:storage` is enough. For real reporter/investigator use, deploy the storage service to one durable HTTPS origin reachable by every browser.

Required runtime configuration:

```text
GHOSTDROP_STORAGE_HOST=0.0.0.0
GHOSTDROP_STORAGE_PORT=8787
GHOSTDROP_STORAGE_DATA_DIR=/durable/mount/ghostdrop
```

Build and run:

```bash
npm ci
npm run build -w ghostdrop-storage
npm run start -w ghostdrop-storage
```

Place the service behind TLS, preserve `GHOSTDROP_STORAGE_DATA_DIR` across releases, and verify:

```bash
curl https://storage.example.org/health
```

The response should identify `opaque-content-addressed` storage and `client-encrypted` sensitive payloads. The server intentionally permits public reads by content hash; confidentiality comes from client encryption and key custody. Before public use, add platform-level rate limiting, storage quotas, backups, uptime monitoring, and origin policy appropriate to the chosen host.

Set the final URL in `web/.env.preprod`:

```dotenv
VITE_NETWORK_ID=preprod
VITE_INDEXER_URL=https://indexer.preprod.midnight.network/api/v4/graphql
VITE_INDEXER_WS_URL=wss://indexer.preprod.midnight.network/api/v4/graphql/ws
VITE_STORAGE_URL=https://storage.example.org
VITE_DEFAULT_CONTRACT=
```

The wallet's Preprod configuration is authoritative for the live indexer connection. The two indexer variables retain the release's expected endpoints for inspection and future non-wallet clients.

## 3. Prepare the wallet and proof server

1. Open the Chrome profile containing the Midnight wallet extension.
2. Select `preprod` in the wallet.
3. Fund its Preprod address through `https://midnight-tmnight-preprod.nethermind.dev/`.
4. Wait for the wallet to synchronize and ensure it can provide the DUST needed for transaction fees.
5. Choose the wallet proof server. Use `http://127.0.0.1:6300`/`Local` for maximum privacy, or the wallet-managed HTTPS service for convenience after accepting that its operator receives proving witness data.

Start and verify proof server `8.1.0`:

```powershell
npm run proof-server:up
npm run proof-server:status
curl.exe http://127.0.0.1:6300/version
```

Proving requests include private witness data. A local proof server keeps that data under the user's control; a wallet-managed HTTPS server adds its operator to the deployment trust boundary.

On non-Windows hosts, either run the same Compose file directly:

```bash
docker compose -f proof-server/compose.yml up -d
```

or start the pinned image with Docker:

```bash
docker run -d --name ghostdrop-proof-server --restart unless-stopped \
  -p 127.0.0.1:6300:6300 -e RUST_BACKTRACE=full \
  midnightntwrk/proof-server:8.1.0 midnight-proof-server -v
```

## 4. Deploy the Compact contract

Build the DApp with the shared storage URL, then serve it locally in the wallet-enabled Chrome profile:

```powershell
npm run build
npm run preview -w ghostdrop-web
```

Open the displayed local URL and select **Deploy new contract**. Review and approve the Preprod transaction in the wallet. Proof generation can take time and the browser, proof server, wallet, and preview server must remain open until finalization.

After finalization, copy the full contract address from GhostDrop. If the transaction identifier is available, copy it too. Record both without abbreviating them:

```powershell
npm run deployment:record -- <contract-address> <deployment-transaction-id>
```

The transaction ID is optional:

```powershell
npm run deployment:record -- <contract-address>
```

The recorder performs two explicit release updates:

- writes `deployments/preprod.json` with the address, timestamp, toolchain versions and public verification endpoints;
- sets `VITE_DEFAULT_CONTRACT` in `web/.env.preprod`.

The contract address and deployment transaction are public data and should be committed with the release. Never put wallet seeds, user secrets, credentials, issuer secrets, or encryption private keys in a deployment record.

Rebuild after recording, because Vite embeds environment values at build time:

```powershell
npm run build
```

## 5. Publish the browser DApp

Publish the complete `web/dist` directory. The host must:

- serve the site over HTTPS;
- preserve every file in `keys/` and `zkir/` without text transformation;
- serve `.prover`, `.verifier`, and `.bzkir` files as binary data;
- allow files of at least 11 MiB and a release of roughly 75 MiB;
- route application paths to `index.html` without rewriting asset requests;
- permit connections to the Preprod indexer, local proof server, wallet extension, and configured storage origin.

For a restrictive Content Security Policy, account for at least the DApp's own origin, the configured HTTPS storage origin, Preprod HTTPS/WSS indexer endpoints, and loopback proof-server URL. Test the exact policy in the wallet-enabled browser; do not weaken it globally merely to silence an unknown error.

## 6. Verify the deployed release

Run the service check with the production storage URL:

```powershell
$env:GHOSTDROP_STORAGE_URL='https://storage.example.org'
npm run services:check
```

Then verify with two isolated browser profiles, ideally on separate machines:

1. Both profiles join the address recorded in `deployments/preprod.json`.
2. An admin registers an organization and securely saves the one-time recovery material.
3. A reporter copies their subject and receives/imports a matching credential.
4. The reporter submits a report with evidence and sees its on-chain case.
5. A separately authorized investigator retrieves and decrypts the case from shared storage.
6. Each side sends at least one encrypted message and the other side decrypts it.
7. The reporter submits department and tenure proofs.
8. The investigator advances case status and both profiles observe the change through the indexer.
9. The report commitment and transaction are visible through `https://preprod.midnightexplorer.com/` without revealing plaintext.
10. Restart the storage service and confirm old blobs remain available from the durable mount.

Record the release URL, storage URL, contract address, deployment transaction, verification transaction IDs, and verification date in release notes. Do not record private credentials or keys.

## Rollback and redeployment

A static frontend rollback can point back to the same contract and storage origin. Contract code itself is immutable for this release flow; a contract change requires recompilation, a fresh Preprod deployment, a new deployment record, and a rebuilt frontend.

Do not delete the old storage volume when replacing a contract or frontend. Existing on-chain cases retain their opaque blob references and need the corresponding encrypted objects for as long as those cases must remain readable.
