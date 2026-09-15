import { spawnSync } from 'node:child_process';

const action = process.argv[2] ?? 'status';
const distro = process.env.GHOSTDROP_WSL_DISTRO ?? 'Ubuntu';
const container = 'ghostdrop-proof-server';

const healthy = async () => {
  try {
    const response = await fetch('http://127.0.0.1:6300/version', { signal: AbortSignal.timeout(2_000) });
    return response.ok ? (await response.text()).trim() : '';
  } catch { return ''; }
};

const docker = (args, quiet = false) => spawnSync('wsl.exe', ['-d', distro, '--', 'docker', ...args], {
  stdio: quiet ? 'ignore' : 'inherit',
});

if (action === 'up') {
  const version = await healthy();
  if (version) {
    console.log(`A local Midnight proof server is already healthy on port 6300 (version ${version}).`);
    process.exit(0);
  }
  const exists = docker(['container', 'inspect', container], true).status === 0;
  const result = exists
    ? docker(['start', container])
    : docker([
      'run', '-d', '--name', container, '--restart', 'unless-stopped',
      '-p', '127.0.0.1:6300:6300', '-e', 'RUST_BACKTRACE=full',
      'midnightntwrk/proof-server:8.1.0', 'midnight-proof-server', '-v',
    ]);
  process.exit(result.status ?? 1);
}

if (action === 'down') {
  const exists = docker(['container', 'inspect', container], true).status === 0;
  if (!exists) {
    console.log('The GhostDrop-managed proof server container does not exist.');
    process.exit(0);
  }
  process.exit(docker(['stop', container]).status ?? 1);
}

if (action === 'status') {
  const version = await healthy();
  if (version) {
    console.log(`OK  Proof server: http://127.0.0.1:6300 (version ${version})`);
    process.exit(0);
  }
  console.error('ERR Proof server is not responding on http://127.0.0.1:6300');
  process.exit(1);
}

console.error('Usage: node scripts/proof-server.mjs <up|down|status>');
process.exit(1);
