import { expect, test } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { request } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

let server: ChildProcess;
let temporaryDirectory: string;
let port: number;

test.beforeAll(async () => {
  temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'aft-dependency-runtime-'));
  const entry = pathToFileURL(path.resolve('dist/server/entry.mjs')).href;
  const runner = `
    import net from 'node:net';
    import tls from 'node:tls';
    import http from 'node:http';
    import https from 'node:https';
    import dgram from 'node:dgram';
    import { syncBuiltinESMExports } from 'node:module';
    import { createServer } from 'node:http';
    const denied = () => { throw new Error('Outbound network forbidden in isolated runtime'); };
    net.Socket.prototype.connect = denied;
    net.connect = denied;
    net.createConnection = denied;
    tls.connect = denied;
    http.request = denied;
    http.get = denied;
    https.request = denied;
    https.get = denied;
    dgram.createSocket = denied;
    globalThis.fetch = denied;
    syncBuiltinESMExports();
    const { handler } = await import(process.argv[1]);
    const server = createServer((request, response) => handler(request, response));
    server.listen(0, '127.0.0.1', () => console.log(JSON.stringify({ port: server.address().port })));
    process.on('SIGTERM', () => server.close(() => process.exit(0)));
  `;
  // An empty temporary cwd prevents loading a checkout-local private env file.
  // Only operating-system settings and the existing test guard are inherited.
  const env: NodeJS.ProcessEnv = {};
  for (const key of ['PATH', 'Path', 'SystemRoot', 'SYSTEMROOT', 'WINDIR', 'TEMP', 'TMP', 'NODE_OPTIONS']) {
    if (process.env[key]) env[key] = process.env[key];
  }
  Object.assign(env, {
    ASTRO_NODE_AUTOSTART: 'disabled', ASTRO_TELEMETRY_DISABLED: '1',
    SMTP_HOST: 'smtp.example.invalid', SMTP_USER: 'sender@example.invalid', SMTP_PASS: '',
    CONTACT_TO: 'recipient@example.invalid', AFT_ANALYTICS_ENABLED: 'false',
    AFT_ANALYTICS_DIR: path.join(temporaryDirectory, 'analytics'),
    AFT_ANALYTICS_CONFIG: path.join(temporaryDirectory, 'missing-analytics-config.json'),
    AFT_API_BETA_TOKEN: 'synthetic-runtime-token', AFT_ASK_ENABLED: 'false',
  });
  server = spawn(process.execPath, ['--input-type=module', '-e', runner, entry], {
    cwd: temporaryDirectory, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  });
  port = await new Promise<number>((resolve, reject) => {
    let output = '';
    let errors = '';
    const timeout = setTimeout(() => reject(new Error(`Built server startup timed out: ${errors}`)), 15_000);
    const onError = (error: Error) => { clearTimeout(timeout); reject(error); };
    const onClose = () => onError(new Error(`Built server closed before startup: ${errors}`));
    server.once('error', onError);
    server.once('close', onClose);
    server.stderr!.on('data', (data: Buffer) => { errors = `${errors}${data}`.slice(-4000); });
    server.stdout!.on('data', (data: Buffer) => {
      output += data.toString();
      for (const line of output.split('\n')) {
        if (!line.startsWith('{"port":')) continue;
        const result = JSON.parse(line) as { port: number };
        clearTimeout(timeout);
        server.removeListener('error', onError);
        server.removeListener('close', onClose);
        resolve(result.port);
        return;
      }
    });
  });
});

test.afterAll(async () => {
  if (server && server.exitCode === null && server.signalCode === null) {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        server.kill('SIGKILL');
        reject(new Error('Owned built server did not stop within five seconds'));
      }, 5000);
      server.once('close', () => { clearTimeout(timeout); resolve(); });
      server.kill();
    });
  }
  if (temporaryDirectory) {
    if (path.dirname(temporaryDirectory) !== path.resolve(tmpdir())) throw new Error('Unexpected temporary directory');
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

function contactRequest(host: string, method = 'GET', body?: string) {
  return new Promise<{ status: number; body: string }>((resolve, reject) => {
    const outgoing = request({
      hostname: '127.0.0.1', port, path: '/api/contact', method, agent: false,
      headers: { host, 'content-type': 'application/json', ...(body ? { 'content-length': Buffer.byteLength(body) } : {}) },
    }, (incoming) => {
      let responseBody = '';
      incoming.setEncoding('utf8');
      incoming.on('data', (chunk: string) => { responseBody += chunk; });
      incoming.once('end', () => resolve({ status: incoming.statusCode ?? 0, body: responseBody }));
      incoming.once('error', reject);
    });
    outgoing.setTimeout(5000, () => outgoing.destroy(new Error('Loopback runtime request timed out')));
    outgoing.once('error', reject);
    outgoing.end(body);
  });
}

test('built Node adapter survives malformed Host ports and keeps contact unavailable without SMTP', async () => {
  for (const host of ['localhost:not-a-port', 'localhost:999999', '[::1]:not-a-port']) {
    const malformed = await contactRequest(host);
    // This isolated build routes invalid authorities to its fallback URL,
    // producing 404. Require the observed non-500 outcome as well as survival;
    // this fixture does not reproduce the advisory on an affected adapter.
    expect(malformed.status).toBe(404);
    const healthy = await contactRequest(`127.0.0.1:${port}`);
    expect(healthy.status).toBe(405);
    expect(JSON.parse(healthy.body)).toEqual({ ok: false, message: 'Use POST to send contact messages.' });
  }
  const response = await contactRequest(`127.0.0.1:${port}`, 'POST', JSON.stringify({
    company: '', email: 'visitor@example.invalid', name: 'Synthetic runtime test',
    topic: 'General feedback', message: 'Synthetic message that must never be sent.',
  }));
  expect(response.status).toBe(503);
  expect(JSON.parse(response.body)).toEqual({ ok: false, message: 'Contact form is not configured yet.' });
  expect(server.exitCode).toBeNull();
});
