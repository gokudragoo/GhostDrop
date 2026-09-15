import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Clipboard,
  ClockCounterClockwise,
  DownloadSimple,
  EyeSlash,
  FileArrowUp,
  Fingerprint,
  Key,
  LockKey,
  PaperPlaneTilt,
  ShieldCheck,
  Sparkle,
  UserFocus,
  Warning,
  X,
} from '@phosphor-icons/react';
import type { Subscription } from 'rxjs';
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import pino from 'pino';
import {
  CiphertextStorageClient,
  decryptForOrganization,
  deriveReporterSubject,
  encryptForOrganization,
  exportIssuerSecret,
  fromBase64Url,
  fromHex,
  generateEncryptionKeyPair,
  generateIssuerKeyPair,
  importIssuerSecret,
  issueCredential,
  parseCredentialBundle,
  serializeCredentialBundle,
  sha256,
  stableJson,
  toBase64Url,
  toHex,
  type ChainReceipt,
  type CredentialBundle,
  type EncryptedEnvelope,
  type GhostDropAPI,
} from 'ghostdrop-api';
import {
  CaseStatus,
  GhostDrop,
  type CaseRecord,
  type EvidenceRecord,
  type Ledger,
  type MessageRecord,
  type Organization,
  type StatusEvent,
} from 'ghostdrop-contract';
import { connectBrowserWallet, resolveGhostDrop, type BrowserConnection } from './lib/browser-manager.js';
import {
  exportInvestigatorAccess,
  getCredential,
  getInvestigatorPrivateKey,
  getInvestigatorPrivateKeys,
  getOrganizationSecrets,
  getPrivateState,
  getReporterEncryptionKeys,
  getUserSecret,
  importInvestigatorAccess,
  removeCredential,
  saveCredential,
  saveOrganizationSecrets,
  saveReporterEncryptionKeys,
} from './lib/local-secrets.js';

const logger = pino({ level: 'warn', browser: { asObject: true } });
const storage = new CiphertextStorageClient(import.meta.env.VITE_STORAGE_URL ?? 'http://127.0.0.1:8787');
const ZERO_COMMITMENT = new Uint8Array(32);

const CATEGORIES = [
  { id: 1n, label: 'Workplace & HR' },
  { id: 2n, label: 'Financial integrity' },
  { id: 3n, label: 'Cybersecurity' },
  { id: 4n, label: 'Legal & ethics' },
] as const;
const DEPARTMENTS = [
  { id: 1n, label: 'People' },
  { id: 2n, label: 'Finance' },
  { id: 3n, label: 'Engineering' },
  { id: 4n, label: 'Operations' },
  { id: 5n, label: 'Legal' },
] as const;
const STATUS_LABELS = ['Submitted', 'Acknowledged', 'Under investigation', 'Action required', 'Resolved', 'Closed'] as const;

type View = 'home' | 'report' | 'cases' | 'organization';
type WalletStatus = 'idle' | 'detecting' | 'connecting' | 'connected' | 'error';
type Toast = { readonly tone: 'success' | 'error' | 'info'; readonly title: string; readonly detail: string };
type OrganizationEntry = { readonly id: Uint8Array; readonly idHex: string; readonly organization: Organization };
type CaseEntry = { readonly id: bigint; readonly record: CaseRecord };
type MessageEntry = { readonly id: bigint; readonly record: MessageRecord };
type EvidenceEntry = { readonly id: bigint; readonly record: EvidenceRecord };
type StatusEntry = { readonly id: bigint; readonly record: StatusEvent };
type PublicOrganizationMetadata = {
  readonly version: 2;
  readonly organizationName: string;
  readonly categoryEncryptionPublicKeys: Readonly<Record<string, JsonWebKey>>;
};
type EvidencePayload = { readonly version: 1; readonly name: string; readonly type: string; readonly bytes: string };
type ReportPayload = {
  readonly version: 1;
  readonly title: string;
  readonly description: string;
  readonly category: number;
  readonly urgency: number;
  readonly reporterEncryptionPublicKey: JsonWebKey;
  readonly evidence?: EvidencePayload;
};
type ChatPayload = { readonly version: 1; readonly body: string };
type DecryptedPayload = ReportPayload | ChatPayload | EvidencePayload;
type ReceiptRecord = ChainReceipt & { readonly operation: string; readonly recordedAt: number };
type Notify = (title: string, detail: string, tone?: Toast['tone']) => void;

const friendlyError = (error: unknown): string => {
  const raw = error instanceof Error ? error.message : String(error);
  if (/User rejected|cancel/i.test(raw)) return 'The wallet request was cancelled.';
  if (/proof server/i.test(raw)) return 'The local proof server is unavailable. Start it on port 6300 and try again.';
  if (/Failed to fetch/i.test(raw)) return 'A required network service could not be reached. Check the indexer and encrypted storage endpoints.';
  if (/DUST|balance|fund/i.test(raw)) return 'The wallet needs preprod tNIGHT and generated tDUST before it can submit transactions.';
  if (/mismatched verifier/i.test(raw)) return 'The contract and proving keys do not match. Rebuild the Compact artifacts.';
  return raw || 'The operation did not complete.';
};

const short = (value: string, head = 8, tail = 6): string =>
  value.length <= head + tail + 3 ? value : `${value.slice(0, head)}…${value.slice(-tail)}`;

const timestamp = (): bigint => BigInt(Math.floor(Date.now() / 1000));
const dateLabel = (value: bigint): string => new Date(Number(value) * 1000).toLocaleDateString(undefined, {
  day: '2-digit', month: 'short', year: 'numeric',
});

const saveLocalPlaintext = (commitment: Uint8Array, value: unknown): void =>
  localStorage.setItem(`ghostdrop:plaintext:${toHex(commitment)}`, stableJson(value));
const getLocalPlaintext = <T,>(commitment: Uint8Array): T | null => {
  const value = localStorage.getItem(`ghostdrop:plaintext:${toHex(commitment)}`);
  return value ? JSON.parse(value) as T : null;
};

const readFilePayload = async (file: File | null): Promise<EvidencePayload | undefined> => {
  if (!file) return undefined;
  if (file.size > 2_000_000) throw new Error('Evidence files are limited to 2 MB in this preprod build.');
  return {
    version: 1,
    name: file.name,
    type: file.type || 'application/octet-stream',
    bytes: toBase64Url(new Uint8Array(await file.arrayBuffer())),
  };
};

const verifyBlobCommitment = (ref: string, commitment: Uint8Array): void => {
  if (ref !== `blob:${toHex(commitment)}`) throw new Error('The on-chain commitment does not match the encrypted payload reference.');
};

const downloadEvidence = (payload: EvidencePayload): void => {
  const url = URL.createObjectURL(new Blob([Uint8Array.from(fromBase64Url(payload.bytes))], { type: payload.type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = payload.name;
  anchor.click();
  URL.revokeObjectURL(url);
};

const decryptWithKeys = async <T,>(envelope: EncryptedEnvelope, privateKeys: readonly JsonWebKey[]): Promise<T> => {
  let lastError: unknown;
  for (const privateKey of privateKeys) {
    try { return await decryptForOrganization<T>(envelope, privateKey); }
    catch (error) { lastError = error; }
  }
  throw lastError ?? new Error('No local decryption key is available for this encrypted payload.');
};

function useReveal(): void {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }, { threshold: 0.12 });
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  });
}

function Bezel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bezel ${className}`}><div className="bezel-core">{children}</div></div>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow"><Sparkle size={11} weight="fill" />{children}</span>;
}

function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button className="copy-button" type="button" onClick={copy} aria-label={`${label} to clipboard`}>
    {copied ? <Check size={14} /> : <Clipboard size={14} />}{copied ? 'Copied' : label}
  </button>;
}

function PrimaryButton({ children, disabled, type = 'button', onClick, busy }: {
  children: ReactNode; disabled?: boolean; type?: 'button' | 'submit'; onClick?: () => void; busy?: boolean;
}) {
  return <button className="primary-button group" type={type} disabled={disabled || busy} onClick={onClick}>
    <span>{busy ? 'Proving…' : children}</span>
    <span className="button-orbit" aria-hidden="true"><ArrowUpRight size={15} weight="light" /></span>
  </button>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="field"><span className="field-label">{label}</span>{children}{hint && <span className="field-hint">{hint}</span>}</label>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="empty-state"><EyeSlash size={24} weight="light" /><h3>{title}</h3><p>{body}</p></div>;
}

function ToastView({ toast, clear }: { toast: Toast; clear: () => void }) {
  return <div className={`toast toast-${toast.tone}`} role="status">
    <span className="toast-icon">{toast.tone === 'success' ? <Check size={16} /> : toast.tone === 'error' ? <Warning size={16} /> : <Sparkle size={16} />}</span>
    <div><strong>{toast.title}</strong><p>{toast.detail}</p></div>
    <button type="button" onClick={clear} aria-label="Dismiss notification"><X size={14} /></button>
  </div>;
}

export default function App() {
  useReveal();
  const [view, setView] = useState<View>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>('idle');
  const [connection, setConnection] = useState<BrowserConnection | null>(null);
  const [api, setApi] = useState<GhostDropAPI | null>(null);
  const [ledgerState, setLedgerState] = useState<Ledger | null>(null);
  const [contractInput, setContractInput] = useState(import.meta.env.VITE_DEFAULT_CONTRACT ?? localStorage.getItem('ghostdrop:contract:preprod') ?? '');
  const [walletAddress, setWalletAddress] = useState('');
  const [operation, setOperation] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [receipts, setReceipts] = useState<ReceiptRecord[]>(() => {
    try { return JSON.parse(localStorage.getItem('ghostdrop:receipts:preprod') ?? '[]') as ReceiptRecord[]; }
    catch { return []; }
  });
  const subscription = useRef<Subscription | null>(null);

  const organizations = useMemo<OrganizationEntry[]>(() => ledgerState
    ? Array.from(ledgerState.organizations).map(([id, organization]) => ({ id, idHex: toHex(id), organization }))
    : [], [ledgerState]);
  const cases = useMemo<CaseEntry[]>(() => ledgerState
    ? Array.from(ledgerState.cases).map(([id, record]) => ({ id, record })).sort((a, b) => Number(b.id - a.id))
    : [], [ledgerState]);
  const messages = useMemo<MessageEntry[]>(() => ledgerState
    ? Array.from(ledgerState.messages).map(([id, record]) => ({ id, record }))
    : [], [ledgerState]);
  const evidence = useMemo<EvidenceEntry[]>(() => ledgerState
    ? Array.from(ledgerState.evidence).map(([id, record]) => ({ id, record }))
    : [], [ledgerState]);
  const statusEvents = useMemo<StatusEntry[]>(() => ledgerState
    ? Array.from(ledgerState.statusEvents).map(([id, record]) => ({ id, record }))
    : [], [ledgerState]);

  useEffect(() => () => subscription.current?.unsubscribe(), []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), toast.tone === 'error' ? 30_000 : 7000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const watch = useCallback((resolved: GhostDropAPI) => {
    subscription.current?.unsubscribe();
    subscription.current = resolved.observeState().subscribe({
      next: (contractState) => setLedgerState(GhostDrop.ledger(contractState.data)),
      error: (error) => setToast({ tone: 'error', title: 'Indexer disconnected', detail: friendlyError(error) }),
    });
  }, []);
  const notify = useCallback<Notify>((title, detail, tone = 'error') => setToast({ title, detail, tone }), []);

  const connect = async (deploy: boolean) => {
    setWalletStatus('connecting');
    setOperation(deploy ? 'deploy' : 'connect');
    try {
      const nextConnection = connection ?? await connectBrowserWallet(logger);
      setConnection(nextConnection);
      setWalletAddress(nextConnection.shieldedAddress);
      const address = deploy ? undefined : contractInput.trim();
      if (!deploy && !address) throw new Error('Enter a deployed GhostDrop contract address or deploy a new one.');
      const resolved = await resolveGhostDrop(nextConnection, getPrivateState(), address, logger);
      setApi(resolved);
      setContractInput(resolved.contractAddress);
      localStorage.setItem('ghostdrop:contract:preprod', resolved.contractAddress);
      watch(resolved);
      setWalletStatus('connected');
      setToast({
        tone: 'success',
        title: deploy ? 'Contract deployed' : 'Private wallet connected',
        detail: `Preprod contract ${short(resolved.contractAddress, 12, 8)} is ready.`,
      });
      setView(deploy ? 'organization' : 'report');
    } catch (error) {
      logger.error({ error }, 'Wallet connection or contract deployment failed');
      setWalletStatus('error');
      setToast({ tone: 'error', title: deploy ? 'Deployment stopped' : 'Connection stopped', detail: friendlyError(error) });
    } finally {
      setOperation(null);
    }
  };

  const transact = async (name: string, action: () => Promise<ChainReceipt>): Promise<ChainReceipt | null> => {
    setOperation(name);
    try {
      const result = await action();
      const nextReceipt: ReceiptRecord = { ...result, operation: name, recordedAt: Date.now() };
      setReceipts((current) => {
        const next = [nextReceipt, ...current].slice(0, 12);
        localStorage.setItem('ghostdrop:receipts:preprod', JSON.stringify(next, (_, value) => typeof value === 'bigint' ? value.toString() : value));
        return next;
      });
      setToast({ tone: 'success', title: 'On-chain proof finalized', detail: result.transactionId ? `Transaction ${short(result.transactionId, 12, 8)}` : 'The Midnight transaction was finalized.' });
      return result;
    } catch (error) {
      setToast({ tone: 'error', title: 'Proof not submitted', detail: friendlyError(error) });
      return null;
    } finally {
      setOperation(null);
    }
  };

  const navigate = (target: View) => {
    setView(target);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <div className="app-shell">
    <div className="ambient ambient-one" aria-hidden="true" />
    <div className="ambient ambient-two" aria-hidden="true" />
    <div className="noise" aria-hidden="true" />

    <header className="nav-shell">
      <button className="brand" onClick={() => navigate('home')} type="button" aria-label="GhostDrop home">
        <span className="brand-mark"><span /></span><span>GhostDrop</span>
      </button>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {(['report', 'cases', 'organization'] as View[]).map((item) => <button key={item} className={view === item ? 'active' : ''} onClick={() => navigate(item)} type="button">{item}</button>)}
      </nav>
      <div className="network-pill"><span className={walletStatus === 'connected' ? 'live' : ''} />Preprod</div>
      <button className={`menu-toggle ${menuOpen ? 'open' : ''}`} type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
        <span /><span />
      </button>
    </header>

    <div className={`menu-overlay ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen} inert={!menuOpen ? true : undefined}>
      {(['home', 'report', 'cases', 'organization'] as View[]).map((item, index) => <button key={item} style={{ '--delay': `${100 + index * 70}ms` } as React.CSSProperties} onClick={() => navigate(item)} type="button">{item}</button>)}
    </div>

    <main>
      {view === 'home' && <Home walletStatus={walletStatus} contractInput={contractInput} setContractInput={setContractInput} connect={connect} operation={operation} />}
      {view === 'report' && <ReporterView api={api} organizations={organizations} cases={cases} operation={operation} transact={transact} navigate={navigate} notify={notify} />}
      {view === 'cases' && <CasesView api={api} ledgerState={ledgerState} organizations={organizations} cases={cases} messages={messages} evidence={evidence} statusEvents={statusEvents} operation={operation} transact={transact} notify={notify} />}
      {view === 'organization' && <OrganizationView api={api} ledgerState={ledgerState} organizations={organizations} operation={operation} transact={transact} notify={notify} />}
    </main>

    <footer><span>GhostDrop / Midnight Preprod</span><span>{api ? `Contract ${short(api.contractAddress)}` : 'No contract connected'}</span><span>{walletAddress ? `Wallet ${short(walletAddress)}` : 'Identity stays local'}</span></footer>
    {receipts[0] && <div className="receipt-dock" aria-label="Latest finalized transaction"><ClockCounterClockwise size={15} /><span>{receipts[0].operation.replaceAll('-', ' ')}</span><code>{short(receipts[0].transactionId || `block-${receipts[0].blockHeight}`, 12, 8)}</code>{receipts[0].transactionId && <CopyButton value={receipts[0].transactionId} label="Copy receipt" />}</div>}
    {toast && <ToastView toast={toast} clear={() => setToast(null)} />}
  </div>;
}

function Home({ walletStatus, contractInput, setContractInput, connect, operation }: {
  walletStatus: WalletStatus; contractInput: string; setContractInput: (value: string) => void; connect: (deploy: boolean) => void; operation: string | null;
}) {
  return <>
    <section className="hero section-pad">
      <div className="hero-copy" data-reveal>
        <Eyebrow>Anonymous by design · verified by proof</Eyebrow>
        <h1>Speak truth.<br /><em>Leave no trace.</em></h1>
        <p>GhostDrop lets an employee prove the right to report without revealing who they are. Confidential evidence stays encrypted. Accountability stays on-chain.</p>
        <div className="hero-actions">
          <button className="text-link" type="button" onClick={() => document.getElementById('connect-panel')?.scrollIntoView({ behavior: 'smooth' })}>Enter the secure channel <ArrowDownRight size={17} /></button>
          <span className="privacy-note"><LockKey size={15} weight="light" />No email. No account. No identity trail.</span>
        </div>
      </div>
      <div className="proof-orbit" data-reveal>
        <div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" />
        <div className="proof-core"><Fingerprint size={54} weight="thin" /><span>Proof valid</span><small>Identity undisclosed</small></div>
        <div className="orbit-label label-one"><Check size={13} /> Employee</div>
        <div className="orbit-label label-two"><EyeSlash size={13} /> Anonymous</div>
        <div className="orbit-label label-three"><ShieldCheck size={13} /> Preprod</div>
      </div>
    </section>

    <section className="trust-grid section-pad" data-reveal>
      <Bezel className="trust-main"><div className="card-kicker">The trust layer</div><h2>Verification without surveillance.</h2><p>Membership credentials are checked inside a zero-knowledge circuit. The company receives a valid/invalid result—not your name, email, employee number, or wallet identity.</p><div className="flow-line"><span>Private credential</span><i /><span>ZK circuit</span><i /><span>Verified fact</span></div></Bezel>
      <Bezel><EyeSlash className="card-icon" size={25} weight="thin" /><strong>Identity</strong><span className="muted">Never disclosed</span></Bezel>
      <Bezel><ShieldCheck className="card-icon" size={25} weight="thin" /><strong>Receipt</strong><span className="muted">Finalized on Midnight</span></Bezel>
      <Bezel><Key className="card-icon" size={25} weight="thin" /><strong>Content</strong><span className="muted">Encrypted before upload</span></Bezel>
    </section>

    <section id="connect-panel" className="connect-section section-pad" data-reveal>
      <div><Eyebrow>Midnight Preprod</Eyebrow><h2>Open a private line.</h2><p>Connect the installed Midnight Lace wallet to join the deployed network contract, or deploy a fresh GhostDrop instance.</p></div>
      <Bezel className="connect-card">
        <div className="connect-status"><span className={walletStatus === 'connected' ? 'live' : ''} /><span>{walletStatus === 'connected' ? 'Wallet connected' : 'Awaiting wallet'}</span><small>Connector API 4.x</small></div>
        <Field label="Contract address" hint="Leave blank only when deploying a new contract."><input value={contractInput} onChange={(event) => setContractInput(event.target.value)} placeholder="Midnight contract address" spellCheck={false} /></Field>
        <div className="connect-actions">
          <PrimaryButton onClick={() => connect(false)} disabled={!contractInput.trim()} busy={operation === 'connect'}>Join contract</PrimaryButton>
          <button className="secondary-button" type="button" onClick={() => connect(true)} disabled={operation !== null}>{operation === 'deploy' ? 'Generating proofs…' : 'Deploy new contract'}</button>
        </div>
        <p className="technical-note"><LockKey size={14} /> The wallet supplies transaction balancing and the proof-server URL. GhostDrop never receives a seed phrase.</p>
      </Bezel>
    </section>
  </>;
}

function ReporterView({ api, organizations, cases, operation, transact, navigate, notify }: {
  api: GhostDropAPI | null; organizations: OrganizationEntry[]; cases: CaseEntry[]; operation: string | null; transact: (name: string, action: () => Promise<ChainReceipt>) => Promise<ChainReceipt | null>; navigate: (view: View) => void; notify: Notify;
}) {
  const [credentialCode, setCredentialCode] = useState('');
  const [credential, setCredential] = useState<CredentialBundle | null>(() => getCredential());
  const [organizationId, setOrganizationId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('2');
  const [urgency, setUrgency] = useState('2');
  const [file, setFile] = useState<File | null>(null);
  const subject = toHex(deriveReporterSubject(getUserSecret()));
  const myCases = cases.filter(({ id, record }) => toHex(record.reporterKey) === toHex(GhostDrop.pureCircuits.deriveReporterKey(getUserSecret(), record.organizationId, id)));

  useEffect(() => {
    const active = organizations.filter((entry) => entry.organization.active);
    if (!active.some((entry) => entry.idHex === organizationId)) setOrganizationId(active[0]?.idHex ?? '');
  }, [organizationId, organizations]);
  useEffect(() => {
    if (organizationId) setCredential(getCredential(organizationId));
  }, [organizationId]);

  const importCredential = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const next = parseCredentialBundle(credentialCode.trim());
      if (toHex(next.credential.subject) !== subject) throw new Error('This credential was issued to a different private reporter subject.');
      saveCredential(credentialCode, (bundle) => {
        if (toHex(bundle.credential.subject) !== subject) throw new Error('This credential was issued to a different private reporter subject.');
      });
      setCredential(next);
      if (api) await api.setPrivateState(getPrivateState(toHex(next.credential.organizationId)));
    } catch (error) {
      notify('Credential not imported', friendlyError(error));
    }
  };

  const submitReport = async (event: FormEvent) => {
    event.preventDefault();
    if (!api || !credential) return;
    const selected = organizations.find((entry) => entry.idHex === organizationId);
    if (!selected) return;
    if (!selected.organization.active) {
      notify('Reporting paused', 'This organization is not currently accepting reports.');
      return;
    }
    if (toHex(credential.credential.organizationId) !== selected.idHex) {
      notify('Wrong organization', 'The imported credential belongs to another organization.');
      return;
    }
    try {
      await api.setPrivateState(getPrivateState(selected.idHex));
      const metadataBytes = await storage.get(selected.organization.metadataRef);
      const metadata = JSON.parse(new TextDecoder().decode(metadataBytes)) as PublicOrganizationMetadata;
      if (toHex(await sha256(stableJson(metadata.categoryEncryptionPublicKeys))) !== toHex(selected.organization.encryptionKeyHash)) {
        throw new Error('Organization encryption metadata does not match its on-chain commitment.');
      }
      const organizationPublicKey = metadata.categoryEncryptionPublicKeys[category];
      if (!organizationPublicKey) throw new Error('This organization has no encryption key for the selected category.');
      const reporterKeys = await generateEncryptionKeyPair();
      const evidence = await readFilePayload(file);
      const payload: ReportPayload = {
        version: 1,
        title: title.trim(),
        description: description.trim(),
        category: Number(category),
        urgency: Number(urgency),
        reporterEncryptionPublicKey: reporterKeys.publicKey,
        evidence,
      };
      const encrypted = await encryptForOrganization(payload, organizationPublicKey);
      const stored = await storage.put(stableJson(encrypted));
      const evidenceCommitment = evidence ? await sha256(fromBase64Url(evidence.bytes)) : ZERO_COMMITMENT;
      const result = await transact('create-case', () => api.createAnonymousCase(
        selected.id,
        stored.ref,
        stored.commitment,
        evidenceCommitment,
        BigInt(category),
        BigInt(urgency),
        timestamp(),
      ));
      if (result) {
        saveReporterEncryptionKeys(stored.commitment, reporterKeys);
        saveLocalPlaintext(stored.commitment, payload);
        setTitle(''); setDescription(''); setFile(null);
        navigate('cases');
      }
    } catch (error) {
      notify('Report not submitted', friendlyError(error));
    }
  };

  if (!api) return <Gate title="Connect to report" body="A Midnight contract connection is required before a private membership proof can be generated." />;

  return <section className="workspace section-pad">
    <div className="workspace-heading" data-reveal><div><Eyebrow>Reporter channel</Eyebrow><h1>Protected from the first word.</h1></div><p>Your local secret creates a fresh case pseudonym. It never leaves this browser and is never sent to the organization.</p></div>
    <div className="report-grid">
      <Bezel className="identity-card" >
        <div className="card-kicker">01 / Private identity</div>
        <div className="identity-symbol"><Fingerprint size={42} weight="thin" /></div>
        <h2>{credential ? 'Credential ready' : 'Receive a credential'}</h2>
        <p>{credential ? 'The credential is stored locally and will be verified inside the proof circuit.' : 'Share only this one-way subject with your organization’s credential issuer.'}</p>
        <div className="code-line"><code>{short(subject, 18, 12)}</code><CopyButton value={subject} label="Copy subject" /></div>
        <form className="stack-form" onSubmit={importCredential}>
          <Field label={credential ? 'Replace private credential' : 'Private credential code'}><textarea value={credentialCode} onChange={(event) => setCredentialCode(event.target.value)} placeholder="gdc2_…" rows={3} /></Field>
          <PrimaryButton type="submit" disabled={!credentialCode.trim()}>{credential ? 'Replace credential' : 'Import credential'}</PrimaryButton>
        </form>
        {credential && <div className="verified-row"><ShieldCheck size={18} weight="light" /><span>Signed membership loaded</span><small>Validity epoch {credential.credential.validityEpoch.toString()}</small><button type="button" className="text-link" onClick={() => { removeCredential(toHex(credential.credential.organizationId)); setCredential(null); }}>Remove</button></div>}
      </Bezel>

      <Bezel className="report-card">
        <form onSubmit={submitReport}>
          <div className="card-kicker">02 / Confidential report</div>
          <div className="form-split">
            <Field label="Organization"><select value={organizationId} onChange={(event) => setOrganizationId(event.target.value)}><option value="">Select organization</option>{organizations.filter((entry) => entry.organization.active).map((entry) => <option value={entry.idHex} key={entry.idHex}>{entry.organization.name}</option>)}</select></Field>
            <Field label="Category"><select value={category} onChange={(event) => setCategory(event.target.value)}>{CATEGORIES.map((entry) => <option value={entry.id.toString()} key={entry.id.toString()}>{entry.label}</option>)}</select></Field>
          </div>
          <Field label="Report title"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A clear, non-identifying summary" maxLength={120} required /></Field>
          <Field label="What happened?" hint="Remove names or details that could identify you unless essential."><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the event, dates, and relevant context…" rows={7} maxLength={8000} required /></Field>
          <div className="form-split">
            <Field label="Urgency"><select value={urgency} onChange={(event) => setUrgency(event.target.value)}><option value="1">Standard</option><option value="2">High</option><option value="3">Critical</option></select></Field>
            <Field label="Encrypted evidence" hint="Up to 2 MB in preprod."><input className="file-input" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></Field>
          </div>
          <div className="submit-bar"><div><LockKey size={17} /><span>Encrypted locally before upload</span></div><PrimaryButton type="submit" disabled={!credential || !organizationId || !title.trim() || !description.trim()} busy={operation === 'create-case'}>Submit with proof</PrimaryButton></div>
        </form>
      </Bezel>
    </div>
    <div className="mini-ledger" data-reveal><span>{myCases.length.toString().padStart(2, '0')}</span><p>private case{myCases.length === 1 ? '' : 's'} linked to this local secret</p><button type="button" onClick={() => navigate('cases')}>Open inbox <ArrowUpRight size={14} /></button></div>
  </section>;
}

function CasesView({ api, ledgerState, organizations, cases, messages, evidence, statusEvents, operation, transact, notify }: {
  api: GhostDropAPI | null; ledgerState: Ledger | null; organizations: OrganizationEntry[]; cases: CaseEntry[]; messages: MessageEntry[]; evidence: EvidenceEntry[]; statusEvents: StatusEntry[]; operation: string | null; transact: (name: string, action: () => Promise<ChainReceipt>) => Promise<ChainReceipt | null>; notify: Notify;
}) {
  const [mode, setMode] = useState<'reporter' | 'investigator'>('reporter');
  const [selectedId, setSelectedId] = useState<bigint | null>(null);
  const [decrypted, setDecrypted] = useState<Record<string, DecryptedPayload>>({});
  const [decryptError, setDecryptError] = useState('');
  const [message, setMessage] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const userSecret = getUserSecret();
  const reporterCases = cases.filter(({ id, record }) => toHex(record.reporterKey) === toHex(GhostDrop.pureCircuits.deriveReporterKey(userSecret, record.organizationId, id)));
  const investigatorCases = cases.filter(({ record }) => {
    const orgIdHex = toHex(record.organizationId);
    if (!getInvestigatorPrivateKey(orgIdHex, record.category)) return false;
    try {
      const key = GhostDrop.pureCircuits.deriveInvestigatorKey(userSecret, record.organizationId);
      if (!ledgerState?.investigatorPermissions.member(record.organizationId)) return false;
      const permissions = ledgerState.investigatorPermissions.lookup(record.organizationId);
      if (!permissions.member(key)) return false;
      const scope = permissions.lookup(key);
      return scope === 0n || scope === record.category;
    } catch { return false; }
  });
  const visibleCases = mode === 'reporter' ? reporterCases : investigatorCases;
  const selected = visibleCases.find((entry) => entry.id === selectedId) ?? visibleCases[0] ?? null;
  const selectedMessages = selected ? messages.filter(({ record }) => record.caseId === selected.id) : [];
  const selectedEvidence = selected ? evidence.filter(({ record }) => record.caseId === selected.id) : [];
  const selectedStatusEvents = selected ? statusEvents.filter(({ record }) => record.caseId === selected.id).sort((left, right) => Number(left.id - right.id)) : [];

  useEffect(() => {
    if (selected && selectedId !== selected.id) setSelectedId(selected.id);
  }, [selected, selectedId]);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    const decryptAll = async () => {
      const next: Record<string, DecryptedPayload> = {};
      const failures: string[] = [];
      const localReport = getLocalPlaintext<ReportPayload>(selected.record.reportCommitment);
      if (localReport) next[`case:${selected.id}`] = localReport;
      if (!localReport && mode === 'investigator') {
        const privateKeys = getInvestigatorPrivateKeys(toHex(selected.record.organizationId), selected.record.category);
        if (privateKeys.length > 0) {
          try {
            verifyBlobCommitment(selected.record.payloadRef, selected.record.reportCommitment);
            const bytes = await storage.get(selected.record.payloadRef);
            const value = await decryptWithKeys<ReportPayload>(JSON.parse(new TextDecoder().decode(bytes)) as EncryptedEnvelope, privateKeys);
            if (value.evidence && toHex(await sha256(fromBase64Url(value.evidence.bytes))) !== toHex(selected.record.evidenceCommitment)) {
              throw new Error('The initial evidence does not match its on-chain commitment.');
            }
            next[`case:${selected.id}`] = value;
          } catch { failures.push('report'); }
        }
      }
      for (const entry of selectedMessages) {
        const local = getLocalPlaintext<ChatPayload>(entry.record.payloadCommitment);
        if (local) { next[`message:${entry.id}`] = local; continue; }
        const privateKeys = mode === 'reporter'
          ? [getReporterEncryptionKeys(selected.record.reportCommitment)?.privateKey].filter((value): value is JsonWebKey => Boolean(value))
          : getInvestigatorPrivateKeys(toHex(selected.record.organizationId), selected.record.category);
        const intendedForMode = (mode === 'reporter' && entry.record.authorRole === 2n) || (mode === 'investigator' && entry.record.authorRole === 1n);
        if (privateKeys.length > 0 && intendedForMode) {
          try {
            verifyBlobCommitment(entry.record.payloadRef, entry.record.payloadCommitment);
            const bytes = await storage.get(entry.record.payloadRef);
            next[`message:${entry.id}`] = await decryptWithKeys<ChatPayload>(JSON.parse(new TextDecoder().decode(bytes)) as EncryptedEnvelope, privateKeys);
          } catch { failures.push(`message ${entry.id}`); }
        }
      }
      for (const entry of selectedEvidence) {
        const local = getLocalPlaintext<EvidencePayload>(entry.record.commitment);
        if (local) { next[`evidence:${entry.id}`] = local; continue; }
        const privateKeys = mode === 'investigator'
          ? getInvestigatorPrivateKeys(toHex(selected.record.organizationId), selected.record.category)
          : [];
        if (privateKeys.length > 0) {
          try {
            verifyBlobCommitment(entry.record.payloadRef, entry.record.commitment);
            const bytes = await storage.get(entry.record.payloadRef);
            next[`evidence:${entry.id}`] = await decryptWithKeys<EvidencePayload>(JSON.parse(new TextDecoder().decode(bytes)) as EncryptedEnvelope, privateKeys);
          } catch { failures.push(`evidence ${entry.id}`); }
        }
      }
      if (!cancelled) {
        setDecrypted(next);
        setDecryptError(failures.length ? `Could not authenticate ${failures.join(', ')}.` : '');
      }
    };
    void decryptAll().catch((error) => { if (!cancelled) setDecryptError(friendlyError(error)); });
    return () => { cancelled = true; };
  }, [mode, selected?.id, selectedMessages.length, selectedEvidence.length]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    if (!api || !selected || !message.trim()) return;
    const organization = organizations.find((entry) => entry.idHex === toHex(selected.record.organizationId));
    if (!organization) return;
    try {
      const report = decrypted[`case:${selected.id}`] as ReportPayload | undefined;
      let publicKey: JsonWebKey;
      if (mode === 'investigator') {
        if (!report?.reporterEncryptionPublicKey) throw new Error('Decrypt the report before replying.');
        publicKey = report.reporterEncryptionPublicKey;
      } else {
        const metadata = JSON.parse(new TextDecoder().decode(await storage.get(organization.organization.metadataRef))) as PublicOrganizationMetadata;
        if (toHex(await sha256(stableJson(metadata.categoryEncryptionPublicKeys))) !== toHex(organization.organization.encryptionKeyHash)) {
          throw new Error('Organization encryption metadata does not match its on-chain commitment.');
        }
        const categoryPublicKey = metadata.categoryEncryptionPublicKeys[selected.record.category.toString()];
        if (!categoryPublicKey) throw new Error('This case category has no active organization encryption key.');
        publicKey = categoryPublicKey;
      }
      const payload: ChatPayload = { version: 1, body: message.trim() };
      const envelope = await encryptForOrganization(payload, publicKey);
      const stored = await storage.put(stableJson(envelope));
      const action = mode === 'reporter'
        ? () => api.submitReporterMessage(selected.id, stored.ref, stored.commitment, timestamp())
        : () => api.submitInvestigatorMessage(selected.id, stored.ref, stored.commitment, timestamp());
      const result = await transact('send-message', action);
      if (result) { saveLocalPlaintext(stored.commitment, payload); setMessage(''); }
    } catch (error) { notify('Message not sent', friendlyError(error)); }
  };

  const updateStatus = async (status: CaseStatus) => {
    if (api && selected) await transact('update-status', () => api.updateCaseStatus(selected.id, status, timestamp()));
  };

  const prove = async (kind: 'department' | 'tenure', value: bigint) => {
    if (!api || !selected) return;
    await api.setPrivateState(getPrivateState(toHex(selected.record.organizationId)));
    await transact(`prove-${kind}`, () => kind === 'department'
      ? api.proveDepartment(selected.id, value)
      : api.proveTenure(selected.id, value, timestamp()));
  };

  const addEvidence = async (event: FormEvent) => {
    event.preventDefault();
    if (!api || !selected || !evidenceFile || mode !== 'reporter') return;
    try {
      const organization = organizations.find((entry) => entry.idHex === toHex(selected.record.organizationId));
      if (!organization) throw new Error('The case organization is no longer available.');
      const metadata = JSON.parse(new TextDecoder().decode(await storage.get(organization.organization.metadataRef))) as PublicOrganizationMetadata;
      if (toHex(await sha256(stableJson(metadata.categoryEncryptionPublicKeys))) !== toHex(organization.organization.encryptionKeyHash)) {
        throw new Error('Organization encryption metadata does not match its on-chain commitment.');
      }
      const publicKey = metadata.categoryEncryptionPublicKeys[selected.record.category.toString()];
      if (!publicKey) throw new Error('This case category has no active organization encryption key.');
      const payload = await readFilePayload(evidenceFile);
      if (!payload) return;
      const envelope = await encryptForOrganization(payload, publicKey);
      const stored = await storage.put(stableJson(envelope));
      await api.setPrivateState(getPrivateState(toHex(selected.record.organizationId)));
      const result = await transact('add-evidence', () => api.addReporterEvidence(selected.id, stored.ref, stored.commitment, timestamp()));
      if (result) {
        saveLocalPlaintext(stored.commitment, payload);
        setEvidenceFile(null);
      }
    } catch (error) {
      notify('Evidence not added', friendlyError(error));
    }
  };

  const importAccess = (event: FormEvent) => {
    event.preventDefault();
    try { importInvestigatorAccess(accessCode.trim()); setAccessCode(''); setMode('investigator'); }
    catch (error) { notify('Access package rejected', friendlyError(error)); }
  };

  if (!api) return <Gate title="Connect to open cases" body="Case ownership and investigator permissions are resolved from the connected Midnight contract." />;

  const report = selected ? decrypted[`case:${selected.id}`] as ReportPayload | undefined : undefined;
  return <section className="workspace section-pad">
    <div className="workspace-heading" data-reveal><div><Eyebrow>Private case inbox</Eyebrow><h1>One case. Two sides. Zero identity.</h1></div><div className="segmented"><button className={mode === 'reporter' ? 'active' : ''} onClick={() => setMode('reporter')} type="button">Reporter</button><button className={mode === 'investigator' ? 'active' : ''} onClick={() => setMode('investigator')} type="button">Investigator</button></div></div>
    {mode === 'investigator' && investigatorCases.length === 0 && <Bezel className="access-import"><form onSubmit={importAccess}><div><h3>Import investigation access</h3><p>This encrypted key package is shared out-of-band by the organization admin.</p></div><input value={accessCode} onChange={(event) => setAccessCode(event.target.value)} placeholder="gda1_…" /><PrimaryButton type="submit" disabled={!accessCode.trim()}>Import access</PrimaryButton></form></Bezel>}
    <div className="case-layout">
      <aside className="case-list">
        <div className="list-heading"><span>{mode === 'reporter' ? 'My anonymous cases' : 'Authorized queue'}</span><small>{visibleCases.length}</small></div>
        {visibleCases.map((entry) => <button type="button" className={`case-row ${selected?.id === entry.id ? 'active' : ''}`} key={entry.id.toString()} onClick={() => setSelectedId(entry.id)}>
          <span className={`urgency-dot urgency-${entry.record.urgency}`} aria-hidden="true" /><span><strong>GH-{entry.id.toString().padStart(5, '0')}</strong><small>{CATEGORIES.find((category) => category.id === entry.record.category)?.label ?? 'Other'} · {entry.record.urgency === 3n ? 'Critical' : entry.record.urgency === 2n ? 'High' : 'Standard'}</small></span><em>{STATUS_LABELS[entry.record.status]}</em>
        </button>)}
        {visibleCases.length === 0 && <EmptyState title="No cases in this view" body={mode === 'reporter' ? 'Submitted reports linked to this local secret appear here.' : 'Import access and have an admin register your investigator commitment.'} />}
      </aside>

      <Bezel className="case-detail">
        {!selected ? <EmptyState title="No case selected" body="Choose a case from the private queue." /> : <>
          <div className="case-topline"><div><span className="case-number">GH-{selected.id.toString().padStart(5, '0')}</span><span className="verified-badge"><ShieldCheck size={13} /> Verified member</span></div><div className="case-state"><span className={`priority priority-${selected.record.urgency}`}>{selected.record.urgency === 3n ? 'Critical' : selected.record.urgency === 2n ? 'High priority' : 'Standard'}</span><span className={`status status-${selected.record.status}`}>{STATUS_LABELS[selected.record.status]}</span></div></div>
          <div className="case-title"><h2>{report?.title ?? 'Encrypted report'}</h2><p>{report?.description ?? 'This payload is encrypted for the authorized organization key.'}</p></div>
          <div className="case-facts"><div><span>Organization</span><strong>{organizations.find((entry) => entry.idHex === toHex(selected.record.organizationId))?.organization.name ?? short(toHex(selected.record.organizationId))}</strong></div><div><span>Submitted</span><strong>{dateLabel(selected.record.submittedAt)}</strong></div><div><span>Commitment</span><strong>{short(toHex(selected.record.reportCommitment))}</strong></div><div><span>Identity</span><strong>Undisclosed</strong></div></div>
          {mode === 'reporter' && <div className="proof-actions"><span>Selective disclosure</span><button type="button" onClick={() => prove('department', getCredential(toHex(selected.record.organizationId))?.credential.department ?? 0n)} disabled={operation !== null || !getCredential(toHex(selected.record.organizationId))}>{selected.record.hasDepartmentProof ? <Check size={14} /> : <Fingerprint size={14} />} Department</button><button type="button" onClick={() => prove('tenure', 2n)} disabled={operation !== null || !getCredential(toHex(selected.record.organizationId)) || selected.record.tenureProof >= 2n}>{selected.record.tenureProof >= 2n ? <Check size={14} /> : <Fingerprint size={14} />} 2+ year tenure</button></div>}
          {mode === 'investigator' && <div className="disclosure-results"><span>Disclosed proofs</span><strong>{selected.record.hasDepartmentProof ? `Department: ${DEPARTMENTS.find((entry) => entry.id === selected.record.departmentProof)?.label ?? selected.record.departmentProof}` : 'Department private'}</strong><strong>{selected.record.tenureProof > 0n ? `Tenure: ${selected.record.tenureProof}+ years` : 'Tenure private'}</strong></div>}
          {mode === 'investigator' && selected.record.status !== CaseStatus.Closed && <div className="status-actions"><span>Move case forward</span>{([CaseStatus.Acknowledged, CaseStatus.UnderInvestigation, CaseStatus.ActionRequired, CaseStatus.Resolved, CaseStatus.Closed] as CaseStatus[]).filter((status) => status === selected.record.status + 1).map((status) => <button type="button" key={status} onClick={() => updateStatus(status)} disabled={operation !== null}>{STATUS_LABELS[status]}</button>)}</div>}
          <div className="evidence-panel"><div className="thread-heading"><span>Encrypted evidence</span><small>{(report?.evidence ? 1 : 0) + selectedEvidence.length} file{(report?.evidence ? 1 : 0) + selectedEvidence.length === 1 ? '' : 's'}</small></div>{report?.evidence && <button className="evidence-row" type="button" onClick={() => downloadEvidence(report.evidence!)}><DownloadSimple size={16} /><span><strong>{report.evidence.name}</strong><small>Initial evidence · commitment verified</small></span></button>}{selectedEvidence.map((entry) => { const payload = decrypted[`evidence:${entry.id}`] as EvidencePayload | undefined; return <button className="evidence-row" type="button" key={entry.id.toString()} onClick={() => payload && downloadEvidence(payload)} disabled={!payload}><DownloadSimple size={16} /><span><strong>{payload?.name ?? 'Encrypted evidence'}</strong><small>{dateLabel(entry.record.submittedAt)} · {short(toHex(entry.record.commitment))}</small></span></button>; })}{!report?.evidence && selectedEvidence.length === 0 && <p className="thread-empty">No evidence attached.</p>}{mode === 'reporter' && selected.record.status !== CaseStatus.Closed && <form className="evidence-upload" onSubmit={addEvidence}><input className="file-input" type="file" onChange={(event) => setEvidenceFile(event.target.files?.[0] ?? null)} /><button type="submit" disabled={!evidenceFile || operation !== null}><FileArrowUp size={15} /> Add encrypted evidence</button></form>}</div>
          {selectedStatusEvents.length > 0 && <div className="status-timeline"><div className="thread-heading"><span>On-chain status history</span><small>{selectedStatusEvents.length} event{selectedStatusEvents.length === 1 ? '' : 's'}</small></div>{selectedStatusEvents.map((entry) => <div key={entry.id.toString()}><span /><p><strong>{STATUS_LABELS[entry.record.fromStatus]}</strong> → <strong>{STATUS_LABELS[entry.record.toStatus]}</strong><small>{dateLabel(entry.record.changedAt)}</small></p></div>)}</div>}
          {decryptError && <p className="decrypt-error"><Warning size={14} />{decryptError}</p>}
          <div className="thread"><div className="thread-heading"><span>Encrypted correspondence</span><small>{selectedMessages.length} message{selectedMessages.length === 1 ? '' : 's'}</small></div>{selectedMessages.map((entry) => <div className={`message ${entry.record.authorRole === 1n ? 'reporter' : 'investigator'}`} key={entry.id.toString()}><span>{entry.record.authorRole === 1n ? 'Anonymous reporter' : 'Investigator'}</span><p>{(decrypted[`message:${entry.id}`] as ChatPayload | undefined)?.body ?? 'Encrypted for the other participant'}</p><small>{dateLabel(entry.record.sentAt)} · {short(toHex(entry.record.payloadCommitment))}</small></div>)}{selectedMessages.length === 0 && <p className="thread-empty">The secure conversation begins here.</p>}</div>
          {selected.record.status !== CaseStatus.Closed ? <form className="message-compose" onSubmit={sendMessage}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder={mode === 'reporter' ? 'Reply without revealing who you are…' : 'Ask for clarification securely…'} /><button type="submit" disabled={!message.trim() || operation !== null} aria-label="Send encrypted message"><PaperPlaneTilt size={18} weight="light" /></button></form> : <p className="thread-empty">This case is closed. Its record remains available for audit.</p>}
        </>}
      </Bezel>
    </div>
  </section>;
}

function OrganizationView({ api, ledgerState, organizations, operation, transact, notify }: {
  api: GhostDropAPI | null; ledgerState: Ledger | null; organizations: OrganizationEntry[]; operation: string | null; transact: (name: string, action: () => Promise<ChainReceipt>) => Promise<ChainReceipt | null>; notify: Notify;
}) {
  const [name, setName] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('2');
  const [employmentStart, setEmploymentStart] = useState('');
  const [issuedCode, setIssuedCode] = useState('');
  const [investigatorKey, setInvestigatorKey] = useState('');
  const [scope, setScope] = useState('0');
  const [investigatorAccess, setInvestigatorAccess] = useState('');

  useEffect(() => { if (!selectedOrg && organizations[0]) setSelectedOrg(organizations[0].idHex); }, [selectedOrg, organizations]);
  const currentOrg = organizations.find((entry) => entry.idHex === selectedOrg);
  const currentSecrets = currentOrg ? getOrganizationSecrets(currentOrg.idHex) : null;
  const myInvestigatorKey = currentOrg ? toHex(GhostDrop.pureCircuits.deriveInvestigatorKey(getUserSecret(), currentOrg.id)) : '';
  const reportEpoch = currentOrg && ledgerState?.reportEpochs.member(currentOrg.id) ? ledgerState.reportEpochs.lookup(currentOrg.id) : 0n;
  const credentialEpoch = currentOrg && ledgerState?.credentialEpochs.member(currentOrg.id) ? ledgerState.credentialEpochs.lookup(currentOrg.id) : 0n;
  const currentAdminAccess = currentOrg && currentSecrets
    ? exportInvestigatorAccess(currentOrg.idHex, currentSecrets.currentEncryptionKeys)
    : '';

  const makeMetadata = (organizationName: string, keyPairs: Readonly<Record<string, { readonly publicKey: JsonWebKey }>>): PublicOrganizationMetadata => ({
    version: 2,
    organizationName,
    categoryEncryptionPublicKeys: Object.fromEntries(Object.entries(keyPairs).map(([category, pair]) => [category, pair.publicKey])),
  });

  const register = async (event: FormEvent) => {
    event.preventDefault();
    if (!api) return;
    try {
      const organizationId = crypto.getRandomValues(new Uint8Array(32));
      const issuer = generateIssuerKeyPair();
      const currentEncryptionKeys = Object.fromEntries(await Promise.all(CATEGORIES.map(async ({ id }) => [id.toString(), await generateEncryptionKeyPair()] as const)));
      const metadata = makeMetadata(name.trim(), currentEncryptionKeys);
      const stored = await storage.put(stableJson(metadata));
      const publicKeyHash = await sha256(stableJson(metadata.categoryEncryptionPublicKeys));
      const result = await transact('register-organization', () => api.registerOrganization(
        organizationId,
        name.trim(),
        stored.ref,
        publicKeyHash,
        issuer.publicKey,
      ));
      if (result) {
        const idHex = toHex(organizationId);
        saveOrganizationSecrets(idHex, {
          issuerSecret: exportIssuerSecret(issuer.secretKey),
          currentEncryptionKeys,
          archivedEncryptionKeys: {},
        });
        setSelectedOrg(idHex);
        setName('');
      }
    } catch (error) { notify('Organization not registered', friendlyError(error)); }
  };

  const issue = (event: FormEvent) => {
    event.preventDefault();
    if (!currentOrg) return;
    try {
      const secrets = getOrganizationSecrets(currentOrg.idHex);
      if (!secrets) throw new Error('This browser does not hold the issuer key for that organization.');
      const employmentStartedAt = BigInt(Math.floor(new Date(`${employmentStart}T00:00:00`).getTime() / 1000));
      if (!employmentStart || employmentStartedAt <= 0n || employmentStartedAt > timestamp()) throw new Error('Enter a valid employment start date that is not in the future.');
      if (credentialEpoch < 1n) throw new Error('The on-chain credential epoch is unavailable.');
      const bundle = issueCredential(
        importIssuerSecret(secrets.issuerSecret),
        currentOrg.id,
        fromHex(subject.trim()),
        BigInt(department),
        employmentStartedAt,
        credentialEpoch,
      );
      setIssuedCode(serializeCredentialBundle(bundle));
    } catch (error) { notify('Credential not issued', friendlyError(error)); }
  };

  const addInvestigator = async (event: FormEvent) => {
    event.preventDefault();
    if (!api || !currentOrg) return;
    const result = await transact('add-investigator', () => api.addInvestigator(currentOrg.id, fromHex(investigatorKey.trim()), BigInt(scope)));
    if (result) {
      const secrets = getOrganizationSecrets(currentOrg.idHex);
      if (!secrets) return notify('Access key unavailable', 'This browser does not hold the organization encryption keys.');
      const granted = scope === '0'
        ? secrets.currentEncryptionKeys
        : { [scope]: secrets.currentEncryptionKeys[scope] };
      setInvestigatorAccess(exportInvestigatorAccess(currentOrg.idHex, granted));
    }
  };

  const removeInvestigator = async () => {
    if (!api || !currentOrg || !investigatorKey.trim()) return;
    const result = await transact('remove-investigator', () => api.removeInvestigator(currentOrg.id, fromHex(investigatorKey.trim())));
    if (result) notify('Investigator removed', 'Rotate the affected category encryption key next to prevent access to future cases.', 'info');
  };

  const rotateKeys = async () => {
    if (!api || !currentOrg || !currentSecrets) return;
    try {
      const categories = scope === '0' ? CATEGORIES.map(({ id }) => id.toString()) : [scope];
      const replacements = Object.fromEntries(await Promise.all(categories.map(async (category) => [category, await generateEncryptionKeyPair()] as const)));
      const nextCurrent = { ...currentSecrets.currentEncryptionKeys, ...replacements };
      const metadata = makeMetadata(currentOrg.organization.name, nextCurrent);
      const stored = await storage.put(stableJson(metadata));
      const keyHash = await sha256(stableJson(metadata.categoryEncryptionPublicKeys));
      const result = await transact('rotate-encryption', () => api.updateOrganizationMetadata(currentOrg.id, stored.ref, keyHash));
      if (result) {
        const archived = Object.fromEntries(Object.entries(currentSecrets.archivedEncryptionKeys).map(([category, pairs]) => [category, [...pairs]])) as Record<string, Array<(typeof replacements)[string]>>;
        for (const category of categories) archived[category] = [currentSecrets.currentEncryptionKeys[category], ...(archived[category] ?? [])].filter(Boolean);
        saveOrganizationSecrets(currentOrg.idHex, { issuerSecret: currentSecrets.issuerSecret, currentEncryptionKeys: nextCurrent, archivedEncryptionKeys: archived });
        setInvestigatorAccess('');
      }
    } catch (error) { notify('Encryption keys not rotated', friendlyError(error)); }
  };

  if (!api) return <Gate title="Connect to administer" body="Organization setup, credential issuers, and investigator permissions are recorded on the connected contract." />;

  return <section className="workspace section-pad">
    <div className="workspace-heading" data-reveal><div><Eyebrow>Organization console</Eyebrow><h1>Trust is configured, not assumed.</h1></div><p>Issuer keys, encryption commitments, reporting epochs, and investigator scopes are controlled here. Private recovery keys never go on-chain.</p></div>
    <div className="admin-grid">
      <Bezel className="admin-register"><form onSubmit={register}><div className="card-kicker">01 / Register organization</div><h2>Create an on-chain reporting boundary.</h2><p>A fresh credential issuer and separate P-256 key for every report category are generated locally. Only public keys and commitments are registered.</p><Field label="Organization name"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Northstar Labs" required maxLength={80} /></Field><PrimaryButton type="submit" disabled={!name.trim()} busy={operation === 'register-organization'}>Register on Preprod</PrimaryButton></form></Bezel>
      <Bezel className="registry-card"><div className="card-kicker">Live registry</div><div className="registry-count">{organizations.length.toString().padStart(2, '0')}</div><p>organization{organizations.length === 1 ? '' : 's'} anchored to this contract</p>{organizations.map((entry) => <div className="registry-row" key={entry.idHex}><span className={entry.organization.active ? 'live' : ''} /><strong>{entry.organization.name}</strong><code>{short(entry.idHex)}</code></div>)}</Bezel>
      {currentSecrets && <Bezel className="recovery-card"><div className="card-kicker">Local recovery materials</div><h3>Back up privately. Never publish.</h3><Field label="Issuer secret"><div className="code-line"><code>{short(currentSecrets.issuerSecret, 18, 8)}</code><CopyButton value={currentSecrets.issuerSecret} /></div></Field><Field label="Admin decryption package"><div className="code-line"><code>{short(currentAdminAccess, 18, 8)}</code><CopyButton value={currentAdminAccess} /></div></Field></Bezel>}
    </div>

    {organizations.length > 0 && <div className="admin-tools" data-reveal>
      <div className="tool-tabs"><Field label="Active organization"><select value={selectedOrg} onChange={(event) => setSelectedOrg(event.target.value)}>{organizations.map((entry) => <option key={entry.idHex} value={entry.idHex}>{entry.organization.name}</option>)}</select></Field><div className="my-key"><span>Your investigator commitment</span><code>{short(myInvestigatorKey, 16, 10)}</code><CopyButton value={myInvestigatorKey} /></div></div>
      <Bezel><form className="tool-form" onSubmit={issue}><div><div className="card-kicker">Credential desk · epoch {credentialEpoch.toString()}</div><h3>Issue a private membership credential</h3></div><Field label="Reporter subject"><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="64-character subject commitment" pattern="[0-9a-fA-F]{64}" required /></Field><div className="form-split"><Field label="Department"><select value={department} onChange={(event) => setDepartment(event.target.value)}>{DEPARTMENTS.map((entry) => <option key={entry.id.toString()} value={entry.id.toString()}>{entry.label}</option>)}</select></Field><Field label="Employment start"><input type="date" value={employmentStart} max={new Date().toISOString().slice(0, 10)} onChange={(event) => setEmploymentStart(event.target.value)} required /></Field></div><PrimaryButton type="submit">Sign credential</PrimaryButton>{issuedCode && <div className="issued-code"><span>Private credential</span><code>{short(issuedCode, 24, 12)}</code><CopyButton value={issuedCode} label="Copy credential" /></div>}</form></Bezel>
      <Bezel><form className="tool-form" onSubmit={addInvestigator}><div><div className="card-kicker">Access control</div><h3>Authorize or revoke a scoped investigator</h3></div><Field label="Investigator commitment"><input value={investigatorKey} onChange={(event) => setInvestigatorKey(event.target.value)} placeholder="64-character investigator commitment" pattern="[0-9a-fA-F]{64}" required /></Field><Field label="Case scope"><select value={scope} onChange={(event) => setScope(event.target.value)}><option value="0">All categories</option>{CATEGORIES.map((entry) => <option key={entry.id.toString()} value={entry.id.toString()}>{entry.label}</option>)}</select></Field><div className="connect-actions"><PrimaryButton type="submit" busy={operation === 'add-investigator'}>Authorize investigator</PrimaryButton><button type="button" className="secondary-button" disabled={!investigatorKey.trim() || operation !== null} onClick={removeInvestigator}>Remove</button><button type="button" className="secondary-button" disabled={!currentSecrets || operation !== null} onClick={rotateKeys}>Rotate scoped key</button></div>{investigatorAccess && <div className="issued-code"><span>Encoded scoped access package</span><code>{short(investigatorAccess, 24, 12)}</code><CopyButton value={investigatorAccess} label="Copy access" /></div>}</form></Bezel>
      <Bezel><div className="epoch-tool"><div><div className="card-kicker">Anti-abuse epoch</div><h3>Reporting epoch {reportEpoch.toString()}</h3><p>Advancing lets each valid member report once again. The separate credential epoch revokes every previously issued credential.</p></div><div className="epoch-buttons"><button className="secondary-button" type="button" disabled={!currentOrg || operation !== null} onClick={() => currentOrg && transact('advance-reporting-epoch', () => api.advanceReportingEpoch(currentOrg.id))}>Advance reporting epoch</button><button className="secondary-button" type="button" disabled={!currentOrg || operation !== null} onClick={() => currentOrg && transact('revoke-credentials', () => api.advanceCredentialEpoch(currentOrg.id))}>Revoke old credentials</button><button className="secondary-button" type="button" disabled={!currentOrg || operation !== null} onClick={() => currentOrg && transact('toggle-organization', () => api.setOrganizationActive(currentOrg.id, !currentOrg.organization.active))}>{currentOrg?.organization.active ? 'Pause reporting' : 'Resume reporting'}</button></div></div></Bezel>
    </div>}
  </section>;
}

function Gate({ title, body }: { title: string; body: string }) {
  return <section className="gate section-pad"><Bezel><LockKey size={34} weight="thin" /><Eyebrow>Connection required</Eyebrow><h1>{title}</h1><p>{body}</p><a href="/">Return to connection panel <ArrowUpRight size={15} /></a></Bezel></section>;
}
