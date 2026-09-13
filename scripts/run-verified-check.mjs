import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { captureReleaseSource, createCheckReceipt, RELEASE_RECEIPT_PATH } from './lib/release-identity.mjs';

const before = captureReleaseSource();
const startedAt = new Date().toISOString();
mkdirSync(dirname(RELEASE_RECEIPT_PATH), { recursive: true });
const write = (exitCode, after) => {
  let buildIdentity;
  try {
    const root = JSON.parse(readFileSync('dist/_build.json', 'utf8'));
    const client = JSON.parse(readFileSync('dist/client/_build.json', 'utf8'));
    if (JSON.stringify(root) === JSON.stringify(client)) buildIdentity = root;
  } catch { /* Missing build evidence keeps the release receipt unverified. */ }
  const receipt = createCheckReceipt(before, after, { exitCode, startedAt, completedAt: new Date().toISOString(), buildIdentity });
  writeFileSync(RELEASE_RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
  return receipt;
};
// Invalidate an earlier receipt even if this run is interrupted.
write(null, before);
if (!process.env.npm_execpath) throw new Error('Run this check through npm run check.');
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'check:steps'], { stdio: 'inherit', windowsHide: true });
const receipt = write(result.status, captureReleaseSource());
console.log(`Release source receipt: ${receipt.verified ? 'verified' : 'unverified (failed checks, dirty source, or unavailable Git)'}; ${RELEASE_RECEIPT_PATH}`);
process.exitCode = result.status === 0 ? 0 : 1;
