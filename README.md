# GhostDrop

> **Live demo (Midnight Preprod): https://ghostdrop-theta.vercel.app**
>
> Connected contract: `4ff1ff67e2400cff88c8f8e31acf12ce9332ba7afe4342788d92217551710461`
> (`deployments/preprod.json`). Open the link in Chrome with a Midnight
> Lace-compatible wallet on `preprod`, join the contract above, and report.

GhostDrop is a privacy-first reporting DApp for Midnight. A reporter proves possession of an organization-issued membership credential without publishing their identity, submits an encrypted report, receives a case pseudonym, and can continue an encrypted conversation with authorized investigators. The Compact contract records verifiable commitments, access policy, report epochs, selective disclosures, and forward-only case status.

The repository is an npm workspace:

- `contract/` — Compact contract, generated bindings and simulator tests.
- `sdk/` — contract client, credential signing, encryption and storage clients.
- `web/` — React/Vite browser DApp and bundled ZK artifacts.
- `storage/` — minimal content-addressed blob service for opaque payloads.
- `proof-server/` — local Midnight proof-server configuration.

Read [DEPLOYMENT.md](./DEPLOYMENT.md) before deploying or publishing a Preprod instance.

## Compatibility baseline

GhostDrop targets the official Midnight Preprod support matrix below. These versions are intentionally pinned because proving keys, generated bindings and runtime packages must agree.

| Component | Version |
| --- | ---: |
| Midnight node | `1.0.2` |
| Compact developer tools | `0.5.1` |
| Compact compiler | `0.31.1` |
| Compact language | `0.23.0` (`pragma >=0.22 && <=0.23`) |
| Compact runtime | `0.16.0` |
| Compact JS | `2.5.1` |
| Midnight.js | `4.1.1` |
| Midnight.js testkit | `4.1.1` |
| DApp Connector API | `4.0.1` |
| Indexer | `4.3.3-hotfix` |
| Proof server | `8.1.0` |

The checked-in generated contract metadata records compiler `0.31.1`, language `0.23.0`, and runtime `0.16.0`. Recompile and rebuild the web application together whenever the contract changes.

## Preprod endpoints

| Service | Endpoint |
| --- | --- |
| Network ID | `preprod` |
| Node RPC | `https://rpc.preprod.midnight.network` |
| Node WebSocket | `wss://rpc.preprod.midnight.network` |
| Indexer GraphQL | `https://indexer.preprod.midnight.network/api/v4/graphql` |
| Indexer WebSocket | `wss://indexer.preprod.midnight.network/api/v4/graphql/ws` |
| Proof server | Wallet-managed HTTPS service, or privacy-preferred local `http://127.0.0.1:6300` |
| Faucet | `https://midnight-tmnight-preprod.nethermind.dev/` |
| Explorer | `https://preprod.midnightexplorer.com/` |

The wallet connector supplies the active indexer and proof-server URLs after it confirms the `preprod` network. The values in `web/.env.preprod` document the expected environment; `VITE_STORAGE_URL` and `VITE_DEFAULT_CONTRACT` are consumed directly by the DApp.

## Prerequisites

- Node.js `24.14.1` is recommended by `.node-version`; use at least a Vite-compatible Node 22 release.
- Google Chrome with a Midnight Lace-compatible wallet exposing Connector API `4.x`.
- A Preprod wallet funded with tNIGHT and able to generate/use tDUST for transaction fees.
- Docker. Compose v2 is optional; the Windows helper uses `docker run` through WSL.
- Compact developer tools with compiler `0.31.1`.
- On Windows, WSL 2 with the toolchain and Docker available in the selected distribution. `GHOSTDROP_WSL_DISTRO` defaults to `Ubuntu` for contract compilation.

Install dependencies from the repository root:

```powershell
npm ci
```

Inside the Linux/WSL environment, select the compiler version:

```bash
compact update 0.31.1
compact --version
compact compile --version
```

## Build and verify

```powershell
npm run contract:compile
npm run typecheck
npm test
npm run build
```

`npm run contract:compile` resolves the repository path dynamically. On Windows it invokes Compact through WSL; on Linux or macOS it invokes the native `compact` binary. Set `GHOSTDROP_WSL_DISTRO` if Compact is installed in a WSL distribution other than `Ubuntu`.

The web `predev` and `prebuild` hooks copy prover, verifier and binary ZKIR files from `contract/src/managed/ghostdrop` to `web/public`. Do not edit generated bindings or ZK assets by hand. A contract change is not complete until the contract is recompiled, tests pass, and the web bundle is rebuilt.

## Run locally against Preprod

Start the local proof server:

```powershell
npm run proof-server:up
npm run proof-server:status
curl.exe http://127.0.0.1:6300/version
```

In the wallet, select the Preprod network. For maximum privacy, configure the Midnight proof server as `http://127.0.0.1:6300` (or the wallet's equivalent `Local` option). A wallet-managed HTTPS proof service is supported for convenience, but that service receives private witness data while constructing proofs.

Start the development storage service in a second terminal:

```powershell
npm run dev:storage
curl.exe http://127.0.0.1:8787/health
```

Start the DApp in a third terminal:

```powershell
npm run dev
```

Open `http://127.0.0.1:5173` in the Chrome profile containing the wallet extension. The application discovers the wallet through `window.midnight`; it never asks for or receives a seed phrase.

With all services running, this command checks the local proof server, local storage, and remote Preprod indexer:

```powershell
npm run services:check
```

The checker accepts `MIDNIGHT_PROOF_SERVER_URL`, `GHOSTDROP_STORAGE_URL`, and `MIDNIGHT_INDEXER_URL` overrides.

## First end-to-end flow

1. Open the organization console and register an organization on the connected contract.
2. Save the displayed issuer secret and investigator access material outside the browser.
3. In the reporter view, copy the reporter subject.
4. Use the organization credential desk to sign that subject, then import the resulting `gdc2_` credential in the reporter view.
5. Submit a report. The browser encrypts report content before upload; the contract receives only the opaque reference, commitments and disclosed case metadata.
6. Authorize an investigator commitment and transfer the investigator access material out of band.
7. In the case inbox, verify reporter/investigator messaging, selective department or tenure proof, and forward-only status changes.

## Privacy and trust boundaries

Midnight is the privacy-aware trust and accountability layer; it is not the report-file store.

On-chain state includes organization configuration, case pseudonyms, anti-spam nullifiers, opaque payload references, content commitments, category, urgency, timestamps, case status, message roles, and any selective fact the reporter chooses to disclose. Report text, evidence bytes, credentials, issuer secrets, user secrets, and encryption private keys are not intentionally written on-chain.

Sensitive payloads are encrypted in the browser with authenticated encryption before being uploaded. The storage service is deliberately content-addressed and treats bytes as opaque; it also stores public organization encryption metadata. Its health response therefore does not claim that every accepted byte is ciphertext.

Important current boundaries:

- `http://127.0.0.1:8787` is suitable only for same-machine development. Two users on different machines require one shared, durable HTTPS storage deployment; otherwise an investigator cannot retrieve the reporter's blobs.
- Browser private state and recovery material are currently stored in localStorage. Treat the browser profile as sensitive and do not describe this build as hardened production custody.
- Investigator content access uses category-scoped encryption keys shared out of band. Removing an investigator and rotating that category prevents the removed package from decrypting future cases; authorized browsers retain archived keys for earlier cases. Secure transfer and custody of access packages remain an operational responsibility.
- The proof server receives private inputs needed to generate a proof. Local operation provides the strongest custody; a wallet-managed HTTPS service adds the service operator to the trust boundary.
- Public case metadata can itself be identifying in a small organization. Choose categories, urgency and timestamps with that disclosure risk in mind.

## Storage configuration

The local defaults are host `127.0.0.1`, port `8787`, and `storage/data`. A shared deployment can configure:

| Variable | Purpose |
| --- | --- |
| `GHOSTDROP_STORAGE_HOST` | Listener address; use `0.0.0.0` inside a container or private service network. |
| `GHOSTDROP_STORAGE_PORT` | Listener port; defaults to `8787`. |
| `GHOSTDROP_STORAGE_DATA_DIR` | Durable mounted data directory. |

Build and start the service:

```bash
npm run build -w ghostdrop-storage
GHOSTDROP_STORAGE_HOST=0.0.0.0 \
GHOSTDROP_STORAGE_PORT=8787 \
GHOSTDROP_STORAGE_DATA_DIR=/var/lib/ghostdrop \
npm run start -w ghostdrop-storage
```

Terminate TLS at a reverse proxy or platform load balancer, attach durable storage, and add deployment-appropriate request limits and monitoring. Set the final HTTPS URL in `web/.env.preprod` before building the frontend.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the web DApp on `127.0.0.1:5173`. |
| `npm run dev:storage` | Run local opaque storage on `127.0.0.1:8787`. |
| `npm run proof-server:up` | Start proof server `8.1.0` through WSL Docker. |
| `npm run proof-server:down` | Stop the proof server. |
| `npm run services:check` | Check proof server, storage and Preprod indexer. |
| `npm run contract:compile` | Regenerate Compact bindings and ZK assets. |
| `npm run contract:test` | Run Compact simulator tests. |
| `npm run deployment:record -- <address> [tx-id]` | Record a completed Preprod deployment and set the default address. |

## What GhostDrop can do today

Live on the Vercel link above (Midnight `preprod` + the contract address at the
top of this file):

- **Anonymous-but-verified reporting** — a reporter derives a one-way subject
  from a local secret, gets a signed membership credential (`gdc2_…`) from the
  organization desk, and submits a report through a zero-knowledge membership
  proof. The organization learns "valid member", never who.
- **End-to-end encrypted payloads** — title, description and evidence are
  encrypted in the browser (category-scoped organization keys) before upload.
  The ledger carries only opaque refs, SHA-256 commitments, category, urgency,
  timestamps and status.
- **Investigator workflow** — admins authorize investigator commitments,
  transfer access packages (`gda1_…`) out of band, and investigators decrypt
  only cases in their scope (all categories or one category).
- **Two-way encrypted correspondence** — reporter and investigator exchange
  encrypted messages per case; each side decrypts only what is addressed to it.
- **Encrypted evidence attachments** — initial evidence (up to 2 MB) plus
  follow-up reporter evidence, each commitment-checked against the chain.
- **Selective disclosure** — reporters can prove department or 2+ year tenure
  on a case without revealing anything else.
- **Forward-only case lifecycle** — Submitted → Acknowledged → Under
  investigation → Action required → Resolved → Closed, with on-chain history.
- **Receipts and auditability** — finalized transaction receipts are docked in
  the UI; commitments and transactions are checkable on the Preprod explorer
  without exposing plaintext.

## Current limitations (read before the demo)

- The Vercel build embeds `VITE_STORAGE_URL=http://127.0.0.1:8787` from
  `web/.env.preprod`. For a true two-machine flow, deploy `storage/` to one
  shared durable HTTPS origin and rebuild the frontend with that URL (see
  [DEPLOYMENT.md](./DEPLOYMENT.md) §2). Until then, run
  `npm run dev:storage` locally alongside the hosted UI.
- Browser private state and recovery material live in localStorage — treat the
  browser profile as sensitive; this is not hardened production custody.
- Category encryption keys are shared out of band; rotation protects future
  cases only, and secure transfer/custody of access packages is operational.
- A wallet-managed HTTPS proof service works but adds its operator to the
  trust boundary; local proof server (`127.0.0.1:6300`) is the private option.
- Public case metadata (category, urgency, timestamps) can itself identify
  someone in a small organization — choose it carefully.

## Roadmap — what we will improve and add

**UI/UX improvements**

- Guided first-run wizard (connect → credential → report → inbox) replacing
  the current tab-hopping flow, with progress, contextual help and empty states.
- Mobile-responsive layout and accessibility pass (keyboard flow, focus order,
  ARIA roles, contrast, reduced-motion support).
- Case inbox upgrades: search/filter/sort, unread badges, urgency and status
  filters, paginated history for large organizations.
- Richer feedback: per-step transaction progress (proving → submitting →
  finalizing), retry affordances, and plain-language error recovery instead of
  raw chain errors.
- Visual polish: design-system tokens, dark/light themes, loading skeletons,
  and consistent iconography across reporter, investigator and admin views.

**Platform and trust hardening**

- Hosted shared storage as a first-class deployment (durable HTTPS origin with
  rate limiting, quotas, backups, monitoring), wired into the Vercel build.
- Move secrets and keys out of localStorage into safer custody (e.g. encrypted
  export/import, optional hardware-wallet-backed subjects).
- Stronger anti-spam/anti-abuse: rate-limited nullifiers and organization-level
  reporting windows without weakening anonymity.
- Automated end-to-end checks against Preprod on every release (wallet,
  indexer, storage, proof server).

**New features planned**

- Multi-evidence bundles and larger encrypted attachments with chunked upload.
- Organization templates and multi-organization dashboards for admins.
- Time-boxed investigator grants (auto-expiring access scopes).
- Anonymous satisfaction/closure ratings so reporters can confirm resolution.
- Public transparency page: aggregate case statistics with zero identifying
  data (counts by category/status only).
- Notifications: opt-in, privacy-preserving case-update alerts (no plaintext
  ever leaves the encrypted channel).
- i18n: multi-language UI starting with the reporter flow.
