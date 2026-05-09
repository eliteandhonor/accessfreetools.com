import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 4328);
const HOST = '127.0.0.1';
const baseURL = `http://${HOST}:${PORT}`;
const npmBin = 'npm';
const nodeBin = process.execPath;
const playwrightCli = 'node_modules/@playwright/test/cli.js';

function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
          resolve();
          return;
        }
        retry();
      });

      req.on('error', retry);

      function retry() {
        req.destroy();
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`));
          return;
        }
        setTimeout(attempt, 150);
      }
    };

    attempt();
  });
}

function killTree(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore', shell: false });
    return;
  }
  try {
    child.kill('SIGTERM');
  } catch {
    // ignore
  }
}

const server =
  process.platform === 'win32'
    ? spawn(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', `npm run preview -- --host ${HOST} --port ${PORT}`], {
        stdio: 'inherit',
        shell: false,
        env: { ...process.env, PLAYWRIGHT_PORT: String(PORT) },
      })
    : spawn(npmBin, ['run', 'preview', '--', '--host', HOST, '--port', String(PORT)], {
        stdio: 'inherit',
        shell: false,
        env: { ...process.env, PLAYWRIGHT_PORT: String(PORT) },
      });

let exiting = false;
function cleanup() {
  if (exiting) return;
  exiting = true;
  killTree(server);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

try {
  await waitForServer(`${baseURL}/`, 120_000);
} catch (error) {
  cleanup();
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
}

const pw = spawn(nodeBin, [playwrightCli, 'test'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: false,
  env: { ...process.env, PLAYWRIGHT_PORT: String(PORT) },
});

let lastOutputAt = Date.now();
let outputBuffer = '';
let exitTimer = null;
const inactivityTimer = setInterval(() => {
  if (Date.now() - lastOutputAt < 300_000) {
    return;
  }

  // eslint-disable-next-line no-console
  console.error('Playwright smoke test produced no output for 5 minutes; stopping preview and failing the run.');
  cleanup();
  process.exit(1);
}, 10_000);

function detectCompletion(output) {
  const failedMatch = output.match(/\b(\d+)\s+failed\b/i);
  if (failedMatch && Number(failedMatch[1]) > 0) {
    return { done: true, code: 1 };
  }

  const passedMatch = output.match(/\b(\d+)\s+passed\s*\(/i);
  if (passedMatch && !/\b\d+\s+failed\b/i.test(output)) {
    return { done: true, code: 0 };
  }

  return { done: false, code: 1 };
}

function appendOutput(chunk) {
  const text = chunk.toString();
  const plain = text.replace(/\u001b\[[0-9;]*m/g, '');
  process.stdout.write(text);
  outputBuffer += plain;
  lastOutputAt = Date.now();
  const completion = detectCompletion(outputBuffer);
  if (completion.done) {
    if (!exitTimer) {
      exitTimer = setTimeout(() => {
        cleanup();
        process.exit(completion.code);
      }, 5000);
    }
  }
  if (outputBuffer.length > 250_000) {
    outputBuffer = outputBuffer.slice(-125_000);
  }
}

pw.stdout?.on('data', appendOutput);
pw.stderr?.on('data', appendOutput);

pw.on('close', (code) => {
  if (exitTimer) clearTimeout(exitTimer);
  clearInterval(inactivityTimer);
  cleanup();
  process.exit(code ?? 1);
});
