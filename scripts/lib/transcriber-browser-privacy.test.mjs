import { createServer } from 'node:http';
import { chromium } from 'playwright';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { classifyTranscriberRequest } from './transcriber-browser-proof.mjs';

let browser;
let server;
let origin;
let received = 0;
const sentinel = 'synthetic-transcriber-private-value';

beforeAll(async () => {
  server = createServer((_request, response) => {
    received++;
    response.setHeader('Content-Type', 'text/html');
    response.end('<!doctype html><title>Local privacy detector fixture</title><link rel="icon" href="data:,">');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
}, 30_000);

afterAll(async () => {
  try { await browser?.close(); }
  finally {
    server?.closeAllConnections();
    if (server?.listening) await new Promise((resolve) => server.close(resolve));
  }
});

// These are deliberate synthetic leak mutations, not model inference or proof
// of a production recorder's complete payload. Only reason counts are retained.
it.each(['get', 'body', 'beacon', 'worker', 'telemetry', 'header', 'encoded-header'])(
  'detects and blocks the %s privacy mutation in a real browser', async (kind) => {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    let resolveObserved;
    const observed = new Promise((resolve) => { resolveObserved = resolve; });
    const reasons = [];
    const staticPaths = new Set(['/']);
    await context.route('**/*', async (route) => {
      const request = route.request();
      const reason = classifyTranscriberRequest({
        url: request.url(), method: request.method(),
        body: request.postData(), headers: request.headers(),
      }, { origin, started: false, sentinels: [sentinel], staticPaths });
      if (reason === 'local') return route.continue();
      await route.abort();
      if (new URL(request.url()).origin === origin) {
        reasons.push(reason);
        resolveObserved(reason);
      }
    });
    try {
      const page = await context.newPage();
      await page.goto(origin, { waitUntil: 'load' });
      const baseline = received;
      await page.evaluate(async ({ kind, sentinel }) => {
        const ignore = (promise) => promise.catch(() => {});
        if (kind === 'get') await ignore(fetch(`/collect?text=${sentinel}`));
        if (kind === 'body') await ignore(fetch('/collect', { method: 'POST', body: sentinel }));
        if (kind === 'beacon') navigator.sendBeacon('/collect', sentinel);
        if (kind === 'telemetry') await ignore(fetch('/collect', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recorder: { text: sentinel } }),
        }));
        if (kind === 'header') await ignore(fetch('/collect', { headers: { 'X-Private': sentinel } }));
        if (kind === 'encoded-header') {
          const encoded = [...sentinel].map((character) => `%${character.charCodeAt(0).toString(16)}`).join('');
          await ignore(fetch('/collect', { headers: { 'X-Private': `%FF ${encoded}` } }));
        }
        if (kind === 'worker') {
          const url = URL.createObjectURL(new Blob([
            `onmessage = async ({data}) => {
              try { await fetch(data.origin + '/collect', {method: 'POST', body: data.sentinel}); }
              catch {} finally { postMessage('finished'); }
            };`,
          ], { type: 'text/javascript' }));
          const worker = new Worker(url);
          try {
            await new Promise((resolve, reject) => {
              worker.onmessage = resolve;
              worker.onerror = () => reject(new Error('Synthetic worker failed'));
              worker.postMessage({ origin: location.origin, sentinel });
            });
          } finally { worker.terminate(); URL.revokeObjectURL(url); }
        }
      }, { kind, sentinel });
      expect(await observed).toBe('blocked-private-data');
      expect(reasons).toEqual(['blocked-private-data']);
      expect(received).toBe(baseline);
    } finally { await context.close(); }
  }, 15_000,
);
