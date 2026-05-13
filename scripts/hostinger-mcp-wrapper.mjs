import { spawnSync } from 'node:child_process';
import { readHostingerToken } from './lib/hostinger-api.mjs';

const args = process.argv.slice(2);
const commandArgs = args[0] === '--' ? args.slice(1) : args;
const packageName = process.env.HOSTINGER_MCP_PACKAGE || 'hostinger-api-mcp';
const binaryName = process.env.HOSTINGER_MCP_BINARY || 'hostinger-hosting-mcp';
const npxCommand = process.platform === 'win32' ? (process.env.ComSpec || 'cmd.exe') : 'npx';
const npxArgs =
  process.platform === 'win32'
    ? ['/d', '/s', '/c', 'npx', '-y', '-p', packageName, binaryName, ...commandArgs]
    : ['-y', '-p', packageName, binaryName, ...commandArgs];

if (commandArgs.length === 0) {
  console.log(`Usage: node scripts/hostinger-mcp-wrapper.mjs -- [${binaryName} args]`);
  console.log('Example: npm run hostinger:mcp:help');
  process.exit(0);
}

const result = spawnSync(npxCommand, npxArgs, {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
  env: {
    ...process.env,
    API_TOKEN: readHostingerToken(),
    APITOKEN: readHostingerToken(),
  },
});

const redact = (value = '') => value.replace(/Bearer\s+[A-Za-z0-9._~+/=-]{20,}/g, 'Bearer [REDACTED_HOSTINGER_TOKEN]');

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(redact(result.stderr));

if (result.error) {
  process.stderr.write(`Hostinger MCP wrapper failed to launch MCP package: ${result.error.message}\n`);
}

process.exit(result.status ?? 1);
