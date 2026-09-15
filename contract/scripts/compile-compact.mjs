import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const contractDirectory = fileURLToPath(new URL('../', import.meta.url));
const compilerArguments = [
  'compile',
  'src/ghostdrop.compact',
  'src/managed/ghostdrop',
];

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};

if (process.platform !== 'win32') {
  run('compact', compilerArguments, { cwd: contractDirectory });
  process.exit(0);
}

const distribution = process.env.GHOSTDROP_WSL_DISTRO ?? 'Ubuntu';
run('wsl.exe', [
  '-d',
  distribution,
  '--cd',
  contractDirectory,
  '--',
  'bash',
  '-lc',
  `compact ${compilerArguments.join(' ')}`,
]);
