import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { preview } from 'astro';

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 4328);
const HOST = '127.0.0.1';
const STARTUP_TIMEOUT_MS = 120_000;
const STALL_TIMEOUT_MS = 300_000;
const CLEANUP_TIMEOUT_MS = 10_000;
const timers = new Set();

async function bounded(promise, milliseconds, label) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out`)), milliseconds);
      timers.add(timer);
    })]);
  } finally {
    clearTimeout(timer);
    timers.delete(timer);
  }
}

function requireFreePort() {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error('PLAYWRIGHT_PORT must be an integer from 1 to 65535.');
  }
  return new Promise((resolve, reject) => {
    const reservation = createServer();
    reservation.once('error', reject);
    reservation.once('listening', () => reservation.close((error) => error ? reject(error) : resolve()));
    reservation.listen({ port: PORT, host: HOST, exclusive: true });
  });
}

function killPlaywrightTree(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    const result = spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
      stdio: 'pipe', encoding: 'utf8', shell: false, windowsHide: true,
      timeout: CLEANUP_TIMEOUT_MS, maxBuffer: 8192,
    });
    if (result.error || result.status !== 0) throw new Error('Could not terminate the owned Playwright process tree.');
  } else {
    // This child starts a new process group; never signal the runner's own group.
    try { process.kill(-child.pid, 'SIGKILL'); } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
  }
}

let server;
let starting;
let previewDone;
let previewClosed = false;
let pw;
let pwDone;
let pwClosed = false;
let closing = false;
let stallTimer;
let signalCode;
let exitCode = 1;
let interrupt;
const interrupted = new Promise((_, reject) => { interrupt = reject; });
interrupted.catch(() => {});
const onInterrupt = () => { signalCode ??= 130; interrupt(new Error('Smoke interrupted by SIGINT.')); };
const onTerminate = () => { signalCode ??= 143; interrupt(new Error('Smoke interrupted by SIGTERM.')); };
process.on('SIGINT', onInterrupt);
process.on('SIGTERM', onTerminate);
const previousHost = process.env.HOST;
const previousTelemetry = process.env.ASTRO_TELEMETRY_DISABLED;

function resetStallTimer() {
  clearTimeout(stallTimer);
  if (!closing) stallTimer = setTimeout(() => {
    interrupt(new Error('Playwright produced no output for 5 minutes.'));
  }, STALL_TIMEOUT_MS);
}

try {
  await Promise.race([bounded(requireFreePort(), STARTUP_TIMEOUT_MS, 'Port admission'), interrupted]);
  // The Node adapter also reads HOST; the public preview API avoids CLI agent backgrounding.
  process.env.HOST = HOST;
  process.env.ASTRO_TELEMETRY_DISABLED = '1';
  starting = preview({
    root: process.cwd(), server: { host: HOST, port: PORT, open: false },
    vite: { preview: { strictPort: true } },
  }).then((owned) => {
    server = owned;
    previewDone = owned.closed();
    previewDone.then(() => {
      previewClosed = true;
      if (!closing) interrupt(new Error('Owned preview closed before Playwright completed.'));
    }, interrupt);
    return owned;
  });
  await Promise.race([bounded(starting, STARTUP_TIMEOUT_MS, 'Preview startup'), interrupted]);
  if (server.port !== PORT || (server.host && server.host !== HOST)) {
    throw new Error('Preview did not bind the requested loopback address and port.');
  }

  pw = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test'], {
    stdio: ['ignore', 'pipe', 'pipe'], shell: false, windowsHide: true,
    detached: process.platform !== 'win32',
    env: { ...process.env, PLAYWRIGHT_PORT: String(PORT) },
  });
  pwDone = new Promise((resolve, reject) => {
    pw.once('error', reject);
    pw.once('close', (code) => { pwClosed = true; resolve(code ?? 1); });
  });
  for (const [stream, output] of [[pw.stdout, process.stdout], [pw.stderr, process.stderr]]) {
    stream?.on('data', (chunk) => { output.write(chunk); resetStallTimer(); });
  }
  resetStallTimer();
  // Only child close determines completion; printed test summaries are not exit evidence.
  exitCode = await Promise.race([pwDone, interrupted]);
} catch (error) {
  console.error(error.message);
  exitCode = signalCode ?? 1;
} finally {
  closing = true;
  clearTimeout(stallTimer);
  if (pw && !pwClosed) {
    try {
      killPlaywrightTree(pw);
      await bounded(pwDone.catch(() => {}), CLEANUP_TIMEOUT_MS, 'Playwright close');
    } catch (error) {
      console.error(`Smoke cleanup failed: ${error.message}`);
      exitCode = 1;
    }
  }
  // The API cannot cancel startup. Collect a late handle before exiting this owning process.
  if (starting && !server) {
    try { await bounded(starting.catch(() => null), CLEANUP_TIMEOUT_MS, 'Preview startup cleanup'); } catch (error) {
      console.error(`Smoke cleanup failed: ${error.message}`);
      exitCode = 1;
    }
  }
  if (server && !previewClosed) {
    try {
      await bounded(server.stop(), CLEANUP_TIMEOUT_MS, 'Preview stop');
      await bounded(previewDone, CLEANUP_TIMEOUT_MS, 'Preview close');
      console.log('Smoke cleanup: owned preview stopped.');
    } catch (error) {
      console.error(`Smoke cleanup failed: ${error.message}`);
      exitCode = 1;
    }
  }
  for (const timer of timers) clearTimeout(timer);
  process.removeListener('SIGINT', onInterrupt);
  process.removeListener('SIGTERM', onTerminate);
  if (previousHost === undefined) delete process.env.HOST;
  else process.env.HOST = previousHost;
  if (previousTelemetry === undefined) delete process.env.ASTRO_TELEMETRY_DISABLED;
  else process.env.ASTRO_TELEMETRY_DISABLED = previousTelemetry;
}
// Also bounds a failed stop/startup with live in-process handles; never kills a foreign daemon.
if (exitCode === 0 && signalCode) exitCode = signalCode;
process.exit(exitCode);
