import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { chromium, expect as browserExpect } from '@playwright/test';
import { build } from 'esbuild';
import { expect, it } from 'vitest';

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
};
const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

it('pins the installed v7.0.0 client, dispatch, self-hosted worker, cores and English fixture against drift', () => {
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

it('recognizes one synthesized English image with the actual cached v7 worker/core offline', async () => {
  // Missing local cache is an explicit test failure, never a permission to fetch models.
  const assets = new Map<string, Buffer>();
  for (const name of ['worker.min.js', 'lang/eng.traineddata.gz', ...Object.keys(pinned.cores).map(name => `core/${name}`)]) {
    assets.set(`/ai-models/tesseract/${name}`, readFileSync(`public/ai-models/tesseract/${name}`));
  }
  const bundle = await build({
    stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic',
  });
  const browser = await chromium.launch({ headless: true });
  const served: string[] = []; const blocked: string[] = []; const errors: string[] = [];
  try {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    // Route every page AND worker request. There is no network fallback, HTTP server or download.
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === 'http://ocr.test' && url.pathname === '/') {
        await route.fulfill({ contentType: 'text/html', body: '<div id="root"></div>' }); return;
      }
      const bytes = url.origin === 'http://ocr.test' ? assets.get(url.pathname) : undefined;
      if (!bytes) { blocked.push(url.href); await route.abort('blockedbyclient'); return; }
      served.push(url.pathname);
      await route.fulfill({ contentType: url.pathname.endsWith('.js') ? 'text/javascript' : 'application/octet-stream', body: bytes });
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://ocr.test/');
    await page.addScriptTag({ content: bundle.outputFiles[0]!.text });
    await page.getByRole('button', { name: 'Read text', exact: true }).waitFor();
    expect(await page.evaluate(() => (window as any).realOcr.workers.length)).toBe(0);
    expect(served).toEqual([]);
    await page.evaluate(async () => {
      const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 220;
      const context = canvas.getContext('2d')!;
      context.fillStyle = 'white'; context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'black'; context.font = '64px Arial';
      context.fillText('ACCESS FREE TOOLS 12345', 40, 130);
      const blob = await new Promise<Blob>(resolve => canvas.toBlob(blob => resolve(blob!), 'image/png'));
      const transfer = new DataTransfer();
      transfer.items.add(new File([blob], 'synthetic-english.png', { type: 'image/png' }));
      const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
      input.files = transfer.files; input.dispatchEvent(new Event('change', { bubbles: true }));
      canvas.width = 0; canvas.height = 0;
    });
    // File selection alone must not load the OCR worker, core or language assets.
    expect(await page.evaluate(() => (window as any).realOcr.workers.length)).toBe(0);
    expect(served).toEqual([]);
    const started = Date.now();
    await page.getByRole('button', { name: 'Read text', exact: true }).click();
    await browserExpect(page.locator('pre'), 'Real offline OCR must return the synthetic text').toHaveText('ACCESS FREE TOOLS 12345', { timeout: 60_000 });
    await browserExpect(page.locator('.ai-status')).toHaveText('Done');
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
    expect(blocked).toEqual([]); expect(errors).toEqual([]);
    console.info(JSON.stringify({
      browser: browser.version(), elapsedMs: Date.now() - started, served, blocked, errors, ...evidence,
      scope: 'One synthetic English image, real local cached inference; not multilingual/device/memory acceptance.',
    }));
    await context.close();
  } finally { await browser.close(); }
}, 90_000);
