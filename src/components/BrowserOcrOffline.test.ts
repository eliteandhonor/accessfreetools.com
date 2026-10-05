import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { chromium, expect as browserExpect } from '@playwright/test';
import { build } from 'esbuild';
import { expect, it } from 'vitest';
import { inspectOcrImage } from '../lib/browserOcrInput';
import { ocrEnglishQaFixture } from './ocrEnglishQaFixture';

// An adapter upgrade must review these exact client/worker contracts, not just bump a semver range.
const pinned = {
  version: '7.0.0',
  client: '730c82036c801416256cdbf4bf36df934b0f25f2dcb3913454bccd9e2cfdb857',
  dispatch: 'a5759d6d3d8beda31134dd041e2d3482b3adf26b6da4a3e7da9b1c5379114268',
  worker: '576b7df7e3393e137e51849357c9adb53fe7ac1bb69bfa06cf3d61520f182c6d',
  cores: {
    'tesseract-core-lstm.wasm.js': 'eef5f8b2f8e20e150680b20adaec4a60babafee3adbe8a94583c81fee46e8680',
    'tesseract-core-simd-lstm.wasm.js': 'c58b46a4c796c0b8afccf77591d5b875b6896b45d402bbce8caa6f5362447b38',
    'tesseract-core-relaxedsimd-lstm.wasm.js': '861a536cf9ef8e63cb644d57bab39c388f37f7d6b6f60024b741c5f6b39a59b3',
  },
  english: 'ed350f3752f81ee8f38769edc14d92d997dababe23b565c59879372cc46a2468',
  qaImage: 'a62b60a70b2763cc4c93c8f86acb62121a2f3e145c13303e8f35629517b53be8',
};
const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

it('pins v7.0.0 client, self-hosted assets and the downloadable synthetic English file against drift', () => {
  for (const name of ['tesseract.js', 'tesseract.js-core']) {
    expect(JSON.parse(readFileSync(`node_modules/${name}/package.json`, 'utf8')).version).toBe(pinned.version);
  }
  expect(sha256(readFileSync('node_modules/tesseract.js/src/createWorker.js'))).toBe(pinned.client);
  expect(sha256(readFileSync('node_modules/tesseract.js/src/worker-script/index.js'))).toBe(pinned.dispatch);
  expect(sha256(readFileSync('node_modules/tesseract.js/dist/worker.min.js'))).toBe(pinned.worker);
  expect(sha256(readFileSync('public/ai-models/tesseract/worker.min.js'))).toBe(pinned.worker);
  for (const [name, hash] of Object.entries(pinned.cores)) {
    expect(sha256(readFileSync(`node_modules/tesseract.js-core/${name}`))).toBe(hash);
    expect(sha256(readFileSync(`public/ai-models/tesseract/core/${name}`))).toBe(hash);
  }
  expect(sha256(readFileSync('public/ai-models/tesseract/lang/eng.traineddata.gz'))).toBe(pinned.english);
  const image = readFileSync(`public${ocrEnglishQaFixture.path}`);
  expect(sha256(image)).toBe(pinned.qaImage);
  expect(inspectOcrImage(new Uint8Array(image))).toEqual({
    width: ocrEnglishQaFixture.width, height: ocrEnglishQaFixture.height, mime: 'image/png',
  });
});

const harness = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import Component from './src/components/AiBrowserTool';
const state = window.realOcr = { workers: [], progress: [], packets: [] };
const NativeWorker = window.Worker;
window.Worker = class extends NativeWorker {
  terminations = 0;
  constructor(...args) {
    super(...args);
    state.workers.push(this);
    this.addEventListener('message', ({ data }) => {
      if (data.status === 'progress') state.progress.push({
        workerId: data.workerId, jobId: data.jobId, action: data.action,
        status: data.data.status, nestedJobId: data.data.jobId, progress: data.data.progress,
      });
    });
  }
  postMessage(packet, ...args) {
    state.packets.push({ action: packet.action, workerId: packet.workerId, jobId: packet.jobId });
    super.postMessage(packet, ...args);
  }
  terminate() { this.terminations++; super.terminate(); }
};
const root = createRoot(document.getElementById('root'));
state.unmount = () => root.unmount();
root.render(<Component variant="ocr" />);
`;

it('downloads the existing synthetic English file, recognizes it with the actual cached worker and copies its text offline', async () => {
  // Missing local cache is an explicit test failure, never a permission to fetch models.
  const assets = new Map<string, Buffer>();
  for (const name of ['worker.min.js', 'lang/eng.traineddata.gz', ...Object.keys(pinned.cores).map(name => `core/${name}`)]) {
    assets.set(`/ai-models/tesseract/${name}`, readFileSync(`public/ai-models/tesseract/${name}`));
  }
  const sampleBytes = readFileSync(`public${ocrEnglishQaFixture.path}`);
  assets.set(ocrEnglishQaFixture.path, sampleBytes);
  const bundle = await build({
    stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic',
  });
  const browser = await chromium.launch({ headless: true });
  const served: string[] = []; const blocked: string[] = []; const errors: string[] = [];
  // A real loopback response is required for Chromium's file-download path.
  // Only the exact fixture and committed OCR assets can be served.
  const server = createServer((request, response) => {
    const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
    if (pathname === '/') {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(`<link rel="icon" href="data:,"><a href="${ocrEnglishQaFixture.path}" download="${ocrEnglishQaFixture.filename}">Download the synthetic English OCR sample (PNG)</a><div id="root"></div>`);
      return;
    }
    const bytes = assets.get(pathname);
    if (!bytes) { response.writeHead(404); response.end(); return; }
    served.push(pathname);
    const contentType = pathname.endsWith('.js') ? 'text/javascript'
      : pathname.endsWith('.png') ? 'image/png' : 'application/octet-stream';
    response.writeHead(200, {
      'Content-Type': contentType,
      ...(pathname === ocrEnglishQaFixture.path
        ? { 'Content-Disposition': `attachment; filename="${ocrEnglishQaFixture.filename}"` } : {}),
    });
    response.end(bytes);
  });
  try {
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Loopback fixture server did not bind a port.');
    const origin = `http://127.0.0.1:${address.port}`;
    const context = await browser.newContext({ serviceWorkers: 'block', permissions: ['clipboard-read', 'clipboard-write'] });
    // Route every page AND worker request. Only this loopback whitelist may connect.
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === origin && !url.search && (url.pathname === '/' || assets.has(url.pathname))) {
        await route.continue(); return;
      }
      blocked.push(url.href); await route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin);
    await page.addScriptTag({ content: bundle.outputFiles[0]!.text });
    await page.getByRole('button', { name: 'Read text', exact: true }).waitFor();
    expect(await page.evaluate(() => (window as any).realOcr.workers.length)).toBe(0);
    expect(served).toEqual([]);
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('link', { name: 'Download the synthetic English OCR sample (PNG)', exact: true }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe(ocrEnglishQaFixture.filename);
    const stream = await download.createReadStream();
    if (!stream) throw new Error('Fixture download did not produce readable bytes.');
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    const downloadedBytes = Buffer.concat(chunks);
    expect(downloadedBytes.equals(sampleBytes)).toBe(true);
    expect(sha256(downloadedBytes)).toBe(pinned.qaImage);
    await page.getByLabel('Image file', { exact: false }).setInputFiles({
      name: download.suggestedFilename(), mimeType: 'image/png', buffer: downloadedBytes,
    });
    // File selection alone must not load the OCR worker, core or language assets.
    expect(await page.evaluate(() => (window as any).realOcr.workers.length)).toBe(0);
    expect(served).toEqual([ocrEnglishQaFixture.path]);
    const started = Date.now();
    await page.getByRole('button', { name: 'Read text', exact: true }).click();
    await browserExpect(page.locator('pre'), 'Real offline OCR must return the synthetic file\'s reference text').toHaveText(ocrEnglishQaFixture.text, { timeout: 60_000 });
    await browserExpect(page.locator('.ai-status')).toHaveText('Done');
    await page.getByRole('button', { name: 'Copy result', exact: true }).click();
    await browserExpect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(ocrEnglishQaFixture.text);
    const evidence = await page.evaluate(() => {
      const s = (window as any).realOcr;
      return {
        text: document.querySelector('pre')!.textContent,
        packets: s.packets as Array<{ action: string; jobId: string; workerId: string }>,
        progress: s.progress as Array<{ action: string; jobId: string; nestedJobId?: string; status: string }>,
        workers: s.workers.map((w: any) => ({ terminations: w.terminations, callbacks: Boolean(w.onmessage || w.onerror || w.onmessageerror) })),
      };
    });
    expect(evidence.packets.map(packet => packet.action)).toEqual(['load', 'loadLanguage', 'initialize', 'recognize']);
    const recognition = evidence.progress.filter(packet => packet.status === 'recognizing text');
    expect(recognition.length).toBeGreaterThan(0);
    // v7's nested data.jobId still names the original load; dispatch's outer jobId is authoritative.
    expect(recognition.every(packet => packet.action === 'recognize' && packet.jobId === evidence.packets[3]!.jobId)).toBe(true);
    expect(recognition.every(packet => packet.nestedJobId === evidence.packets[0]!.jobId)).toBe(true);
    expect(evidence.workers).toEqual([{ terminations: 1, callbacks: false }]);
    expect(served).toContain('/ai-models/tesseract/worker.min.js');
    expect(served).toContain('/ai-models/tesseract/lang/eng.traineddata.gz');
    expect(served.some(path => path.startsWith('/ai-models/tesseract/core/'))).toBe(true);
    // This Windows environment can inject AdGuard's content script into loopback
    // HTTP pages. Its request remains blocked; it is not a tool/model asset.
    const environmentBlocked = blocked.filter(href => {
      const url = new URL(href);
      return url.origin === 'http://local.adguard.org' && url.pathname === '/'
        && url.searchParams.get('type') === 'content-script'
        && url.searchParams.get('url') === `${origin}/`
        && url.searchParams.get('app') === 'chrome-headless-shell.exe';
    });
    const unexpectedBlocked = blocked.filter(href => !environmentBlocked.includes(href));
    expect(unexpectedBlocked).toEqual([]); expect(errors).toEqual([]);
    const proof = {
      verifiedAt: new Date().toISOString(),
      node: process.version,
      browser: browser.version(),
      tesseractVersion: pinned.version,
      fixture: { ...ocrEnglishQaFixture, bytes: sampleBytes.length, sha256: pinned.qaImage },
      downloadedSha256: sha256(downloadedBytes),
      clipboardText,
      elapsedMs: Date.now() - started,
      served,
      assetSha256: Object.fromEntries(served.map(assetPath => [assetPath, sha256(assets.get(assetPath)!)])),
      blocked, environmentBlocked, unexpectedBlocked, errors, ...evidence,
      scope: 'One pre-existing synthetic English QA definition, now an exact downloadable byte file. Actual local inference and native clipboard copy; not the six-image Node experiment or multilingual/device/memory acceptance.',
    };
    mkdirSync('output/ocr-english-qa', { recursive: true });
    writeFileSync('output/ocr-english-qa/latest.json', `${JSON.stringify(proof, null, 2)}\n`);
    console.info(JSON.stringify(proof));
    await context.close();
  } finally {
    await browser.close();
    if (server.listening) await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}, 90_000);
