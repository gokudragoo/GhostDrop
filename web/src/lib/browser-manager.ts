import { type ConnectedAPI, type InitialAPI } from '@midnight-ntwrk/dapp-connector-api';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { type NetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { fromHex, toHex } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import {
  Binding,
  type FinalizedTransaction,
  Proof,
  SignatureEnabled,
  Transaction,
  type TransactionId,
} from '@midnight-ntwrk/midnight-js-protocol/ledger';
import type { UnboundTransaction } from '@midnight-ntwrk/midnight-js-types';
import {
  GhostDropAPI,
  type GhostDropCircuitKeys,
  type GhostDropProviders,
} from 'ghostdrop-api';
import type { GhostDropPrivateState } from 'ghostdrop-contract';
import type { Logger } from 'pino';
import semver from 'semver';
import { localPrivateStateProvider } from './private-state-provider.js';

declare global {
  interface Window {
    midnight?: Record<string, InitialAPI>;
  }
}

const CONNECTOR_RANGE = '4.x';
const PROOF_SERVER_TIMEOUT_MS = 15 * 60 * 1_000;

const findWallet = (): InitialAPI | undefined => Object.values(window.midnight ?? {}).find(
  (wallet) => wallet && semver.satisfies(wallet.apiVersion, CONNECTOR_RANGE),
);

const waitForWallet = async (): Promise<InitialAPI> => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 4_000) {
    const wallet = findWallet();
    if (wallet) return wallet;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Midnight Lace wallet was not detected. Install or enable the extension, then refresh.');
};

export type BrowserConnection = {
  readonly connectedWallet: ConnectedAPI;
  readonly providers: GhostDropProviders;
  readonly shieldedAddress: string;
  readonly walletApiVersion: string;
};

export const connectBrowserWallet = async (logger: Logger): Promise<BrowserConnection> => {
  const networkId = (import.meta.env.VITE_NETWORK_ID ?? 'preprod') as NetworkId;
  setNetworkId(networkId);
  const initialWallet = await waitForWallet();
  const connectedWallet = await initialWallet.connect(networkId);
  const status = await connectedWallet.getConnectionStatus();
  if (status.status !== 'connected' || status.networkId !== networkId) {
    throw new Error(`Wallet authorization for ${networkId} was not completed.`);
  }
  const configuration = await connectedWallet.getConfiguration();
  if (!configuration.proverServerUri) throw new Error('Configure the wallet proof server at http://127.0.0.1:6300.');
  const proverUrl = new URL(configuration.proverServerUri);
  const localProverHosts = new Set(['localhost', '127.0.0.1', '[::1]']);
  const isLocalProver = proverUrl.protocol === 'http:'
    && localProverHosts.has(proverUrl.hostname)
    && proverUrl.port === '6300';
  if (!isLocalProver && proverUrl.protocol !== 'https:') {
    throw new Error('The wallet proof server must use HTTPS, or the local endpoint http://127.0.0.1:6300.');
  }
  const addresses = await connectedWallet.getShieldedAddresses();
  const zkConfigProvider = new FetchZkConfigProvider<GhostDropCircuitKeys>(window.location.origin, fetch.bind(window));

  const providers: GhostDropProviders = {
    privateStateProvider: localPrivateStateProvider(),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(proverUrl.href, zkConfigProvider, {
      timeout: PROOF_SERVER_TIMEOUT_MS,
    }),
    publicDataProvider: indexerPublicDataProvider(
      configuration.indexerUri,
      configuration.indexerWsUri,
      window.WebSocket,
    ),
    walletProvider: {
      getCoinPublicKey: () => addresses.shieldedCoinPublicKey,
      getEncryptionPublicKey: () => addresses.shieldedEncryptionPublicKey,
      balanceTx: async (transaction: UnboundTransaction): Promise<FinalizedTransaction> => {
        const balanced = await connectedWallet.balanceUnsealedTransaction(toHex(transaction.serialize()));
        return Transaction.deserialize<SignatureEnabled, Proof, Binding>(
          'signature',
          'proof',
          'binding',
          fromHex(balanced.tx),
        );
      },
    },
    midnightProvider: {
      submitTx: async (transaction: FinalizedTransaction): Promise<TransactionId> => {
        await connectedWallet.submitTransaction(toHex(transaction.serialize()));
        return transaction.identifiers()[0];
      },
    },
  };

  logger.info({ networkId, status, configuration }, 'Midnight wallet connected');
  return {
    connectedWallet,
    providers,
    shieldedAddress: addresses.shieldedAddress,
    walletApiVersion: initialWallet.apiVersion,
  };
};

export const resolveGhostDrop = async (
  connection: BrowserConnection,
  privateState: GhostDropPrivateState,
  contractAddress: string | undefined,
  logger: Logger,
): Promise<GhostDropAPI> => contractAddress
  ? GhostDropAPI.join(connection.providers, contractAddress, privateState, logger)
  : GhostDropAPI.deploy(connection.providers, privateState, logger);
