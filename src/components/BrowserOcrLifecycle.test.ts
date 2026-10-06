import { chromium, expect as browserExpect, type Browser, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

// The real component and input parser run in Chromium; only the native OCR worker is controlled.
const harness = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import Component from './src/components/AiBrowserTool';
import { createWorker } from 'tesseract.js';
const state = window.ocrTest = {
  workers: [], reads: 0, decodes: 0, closed: 0, hold: 'recognize',
  watchdogs: new Map(), abortListeners: new Set(), fault: null, decodedSize: null,
};
state.referencePackets = async () => {
  state.hold = 'none';
  const worker = await createWorker('eng', undefined, {
    workerPath: '/ai-models/tesseract/worker.min.js', corePath: '/ai-models/tesseract/core/',
    langPath: '/ai-models/tesseract/lang/', workerBlobURL: false, gzip: true, logging: false,
  });
  await worker.recognize(new Uint8Array([1, 2, 3]));
  await worker.terminate();
};
const read = Blob.prototype.arrayBuffer;
Blob.prototype.arrayBuffer = function() { state.reads++; return read.call(this); };
const decode = window.createImageBitmap;
window.createImageBitmap = async (...args) => {
  state.decodes++;
  const bitmap = await decode(...args);
  if (state.decodedSize) {
    Object.defineProperty(bitmap, 'width', { value: state.decodedSize[0] });
    Object.defineProperty(bitmap, 'height', { value: state.decodedSize[1] });
  }
  const close = bitmap.close.bind(bitmap);
  bitmap.close = () => { state.closed++; close(); };
  if (state.hold === 'decode') await new Promise(resolve => { state.finishDecode = resolve; });
  return bitmap;
};
const add = AbortSignal.prototype.addEventListener;
const remove = AbortSignal.prototype.removeEventListener;
AbortSignal.prototype.addEventListener = function(type, listener, options) {
  if (type === 'abort') state.abortListeners.add(listener);
  return add.call(this, type, listener, options);
};
AbortSignal.prototype.removeEventListener = function(type, listener, options) {
  if (type === 'abort') state.abortListeners.delete(listener);
  return remove.call(this, type, listener, options);
};
const setTimer = window.setTimeout;
const clearTimer = window.clearTimeout;
let nextTimer = -1;
window.setTimeout = (callback, delay, ...args) => {
  if (delay !== 90000) return setTimer(callback, delay, ...args);
  const id = nextTimer--;
  state.watchdogs.set(id, callback);
  return id;
};
window.clearTimeout = id => { state.watchdogs.delete(id); clearTimer(id); };
state.stall = () => { for (const callback of [...state.watchdogs.values()]) callback(); };
window.Worker = class {
  messages = []; terminations = 0; savedMessage = null;
  constructor(url) {
    if (state.fault === 'constructor') { state.fault = null; throw new Error('Controlled constructor failure'); }
    this.url = String(url);
    state.workers.push(this);
  }
  postMessage(packet) {
    if (state.fault === 'post') { state.fault = null; throw new Error('Controlled post failure'); }
    this.messages.push(packet);
    this.savedMessage = this.onmessage;
    if (packet.action !== state.hold) queueMicrotask(() => this.reply(packet));
  }
  reply(packet = this.messages.at(-1), status = 'resolve', data = {}) {
    (this.onmessage || this.savedMessage)?.({ data: { ...packet, status, data } });
  }
  terminate() { this.terminations++; }
};
const root = createRoot(document.getElementById('root'));
state.unmount = () => root.unmount();
root.render(<Component variant="ocr" />);
`;

let browser: Browser;
let page: Page;
let script: string;
let errors: string[];
const ui = browserExpect.configure({ timeout: 3_000 });

beforeAll(async () => {
  const bundle = await build({
    stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic',
  });
  script = bundle.outputFiles[0]!.text;
  browser = await chromium.launch({ headless: true });
  console.info(`OCR mounted component: Chromium ${browser.version()}, real image decoding, controlled workers, no model downloads.`);
}, 30_000);

beforeEach(async () => {
  page = await browser.newPage();
  page.setDefaultTimeout(1_500);
  errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.fulfill({ contentType: 'text/html', body: '<div id="root"></div>' }));
  await page.goto('http://ocr.test/');
  await page.addScriptTag({ content: script });
  await page.getByRole('button', { name: 'Read text', exact: true }).waitFor();
});
afterEach(async () => { await page?.close(); expect(errors).toEqual([]); });
afterAll(async () => { await browser?.close(); });

async function selectImage(options: { name?: string; type?: string; size?: number; bytes?: number[]; holdRead?: boolean; corrupt?: boolean } = {}) {
  await page.evaluate(async options => {
    const state = (window as any).ocrTest;
    const canvas = document.createElement('canvas');
    canvas.width = 120; canvas.height = 40;
    canvas.getContext('2d')!.fillText('Local OCR fixture', 2, 20);
    const blob = await new Promise<Blob>(resolve => canvas.toBlob(value => resolve(value!), options.type ?? 'image/png'));
    let content: Blob | Uint8Array<ArrayBuffer> = options.bytes ? new Uint8Array(options.bytes) : blob;
    if (options.corrupt) {
      content = new Uint8Array(await blob.arrayBuffer());
      const view = new DataView(content.buffer);
      for (let offset = 8; offset < content.length;) {
        const size = view.getUint32(offset);
        if (String.fromCharCode(...content.slice(offset + 4, offset + 8)) === 'IDAT') content.fill(0, offset + 8, offset + 8 + size);
        offset += size + 12;
      }
    }
    const file = new File([content], options.name ?? 'imageA.png', { type: options.type ?? 'image/png' });
    if (options.size !== undefined) Object.defineProperty(file, 'size', { value: options.size });
    if (options.holdRead) file.arrayBuffer = () => {
      state.reads++;
      return new Promise(resolve => { state.finishRead = async () => resolve(await blob.arrayBuffer()); });
    };
    const transfer = new DataTransfer(); transfer.items.add(file);
    const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    state.reads = 0; state.decodes = 0;
  }, options);
}

async function inspect() {
  return page.evaluate(() => {
    const s = (window as any).ocrTest;
    return {
      reads: s.reads, decodes: s.decodes, closed: s.closed,
      timers: s.watchdogs.size, listeners: s.abortListeners.size,
      workers: s.workers.map((w: any) => ({
        terminations: w.terminations, actions: w.messages.map((m: any) => m.action),
        language: w.messages.find((m: any) => m.action === 'loadLanguage')?.payload.langs,
        listeners: Boolean(w.onmessage || w.onerror || w.onmessageerror),
      })) as Array<{ terminations: number; actions: string[]; language?: string; listeners: boolean }>,
    };
  });
}

async function start(hold = 'recognize') {
  const count = (await inspect()).workers.length;
  await page.evaluate(hold => { (window as any).ocrTest.hold = hold; }, hold);
  await page.getByRole('button', { name: 'Read text', exact: true }).click();
  await ui.poll(async () => {
    const s = await inspect();
    return s.workers[count]?.actions.at(-1) ?? await page.getByRole('alert').textContent({ timeout: 50 }).catch(() => null);
  }, { intervals: [20, 50, 100] }).toBe(hold);
}

async function reply(text = 'Image B current text', index = -1, status = 'resolve') {
  await page.evaluate(({ text, index, status }) => {
    const worker = (window as any).ocrTest.workers.at(index);
    worker.reply(worker.messages.at(-1), status, status === 'resolve' ? { text, confidence: 92 } : 'Controlled OCR failure');
  }, { text, index, status });
}

describe('mounted OCR operation identity', () => {
  it('uses outer progress job identity, not the nested v7 load-job ID', async () => {
    await selectImage(); await start();
    await page.evaluate(() => {
      const w = (window as any).ocrTest.workers[0];
      w.reply(w.messages.at(-1), 'progress', { status: 'recognizing text', progress: 0.5, jobId: w.messages[0].jobId });
    });
    await ui(page.locator('.ai-status')).toHaveText('recognizing text 50%');
    await reply('Progress fixture');
    await ui(page.locator('pre')).toHaveText('Progress fixture');
  });

  it('ignores foreign, duplicate and malformed worker replies without changing history', async () => {
    await selectImage(); await start();
    await page.evaluate(() => {
      const w = (window as any).ocrTest.workers[0]; const packet = w.messages.at(-1);
      for (const changed of [{ workerId: 'foreign' }, { jobId: 'old' }, { action: 'initialize' }]) {
        w.onmessage({ data: { ...packet, ...changed, status: 'resolve', data: { text: 'Wrong result' } } });
      }
      w.onmessage({ data: null });
      w.reply(w.messages[0]);
    });
    await ui(page.locator('pre')).toHaveCount(0);
    await ui(page.getByRole('button', { name: 'Working...', exact: true })).toBeDisabled();
    await reply('Current result'); await reply('Duplicate result');
    await ui(page.locator('pre')).toHaveText('Current result');
    await ui(page.locator('.ai-side-panel ol li')).toHaveCount(1);
    expect((await inspect()).workers[0]!.terminations).toBe(1);
  });

  it('matches installed Tesseract v7 initialization and recognition packets', async () => {
    await selectImage(); await start();
    await page.evaluate(() => (window as any).ocrTest.referencePackets());
    const packets = await page.evaluate(() => (window as any).ocrTest.workers.map((w: any) => w.messages.map((m: any) => {
      const payload = { ...m.payload };
      if (m.action === 'recognize') delete payload.image;
      return { action: m.action, payload };
    })));
    expect(packets[0]).toEqual(packets[1]);
    await reply('Adapter text', 0);
    await ui(page.locator('pre')).toHaveText('Adapter text');
  });

  it.each(['constructor', 'post'])('handles native Worker %s failure and retries', async fault => {
    await selectImage();
    await page.evaluate(fault => { (window as any).ocrTest.fault = fault; }, fault);
    await page.getByRole('button', { name: 'Read text', exact: true }).click();
    await ui(page.getByRole('alert')).toBeVisible();
    const s = await inspect();
    expect(s.listeners).toBe(0); expect(s.timers).toBe(0);
    expect(s.workers.every(w => w.terminations === 1)).toBe(true);
    await start(); await reply('Recovered from worker failure');
    await ui(page.locator('pre')).toHaveText('Recovered from worker failure');
  });

  it.each(['image', 'language', 'both'])('ignores delayed A after changing %s, including stale progress and finalization', async change => {
    await selectImage(); await start();
    if (change !== 'language') await selectImage({ name: 'imageB.png' });
    if (change !== 'image') await page.getByLabel('OCR language', { exact: false }).selectOption('spa');
    await reply('Image A stale text', 0);
    await ui(page.getByText('Image A stale text', { exact: true })).toHaveCount(0);
    expect((await inspect()).workers[0]!.terminations).toBe(1);
    await start();
    await reply('Image A stale success', 0);
    await reply('Image A stale failure', 0, 'reject');
    await page.evaluate(() => {
      const worker = (window as any).ocrTest.workers[0];
      worker.reply(worker.messages.at(-1), 'progress', { status: 'Stale A progress', progress: 0.5 });
    });
    await ui(page.getByRole('button', { name: 'Working...', exact: true })).toBeDisabled();
    await ui(page.getByText('Stale A progress', { exact: false })).toHaveCount(0);
    await reply();
    await ui(page.locator('pre')).toHaveText('Image B current text');
    await ui(page.locator('.ai-status')).toHaveText('Done');
    await reply('Image A after B completed', 0);
    await ui(page.locator('pre')).toHaveText('Image B current text');
    await ui(page.locator('.ai-side-panel ol li')).toHaveCount(1);
    expect((await inspect()).workers.every(w => w.terminations === 1)).toBe(true);
  });

  it.each(['load', 'loadLanguage', 'initialize', 'recognize'])('cancels during %s and retries', async stage => {
    await selectImage(); await start(stage);
    await page.getByRole('button', { name: 'Cancel OCR', exact: true }).click();
    expect((await inspect()).workers[0]!.terminations).toBe(1);
    await reply('Late cancelled text', 0);
    await ui(page.locator('pre')).toHaveCount(0);
    await start(); await reply('Retry text');
    await ui(page.locator('pre')).toHaveText('Retry text');
    const s = await inspect();
    expect(s.timers).toBe(0); expect(s.listeners).toBe(0);
    expect(s.workers.every(w => w.terminations === 1 && !w.listeners)).toBe(true);
  });

  it.each(['load', 'loadLanguage', 'initialize', 'recognize'])('unmount terminates during %s without late work', async stage => {
    await selectImage(); await start(stage);
    await page.evaluate(() => (window as any).ocrTest.unmount());
    expect((await inspect()).workers[0]!.terminations).toBe(1);
    await reply('Unmounted text');
    const s = await inspect();
    expect(s.workers[0]!.actions.at(-1)).toBe(stage);
    expect(s.timers).toBe(0); expect(s.listeners).toBe(0);
    expect(s.workers[0]!.listeners).toBe(false);
  });

  it.each(['eng', 'spa', 'fra', 'deu', 'ita', 'por'])('preserves %s selection and result language (controlled inference)', async language => {
    await selectImage();
    await page.getByLabel('OCR language', { exact: false }).selectOption(language);
    await start(); await reply(`Fixture ${language}`);
    await ui(page.locator('pre')).toHaveText(`Fixture ${language}`);
    await ui(page.locator('dd').first()).toHaveText(language);
    expect((await inspect()).workers[0]!.language).toBe(language);
  });

  it.each(['onerror', 'onmessageerror', 'reject', 'watchdog'])('settles %s once and permits retry', async fault => {
    await selectImage(); await start('loadLanguage');
    await page.evaluate(fault => {
      const s = (window as any).ocrTest; const w = s.workers[0];
      if (fault === 'watchdog') s.stall();
      else if (fault === 'reject') w.reply(w.messages.at(-1), 'reject', 'Controlled model failure');
      else w[fault]?.(new Event('error'));
    }, fault);
    await ui(page.getByRole('alert')).toBeVisible();
    expect((await inspect()).workers[0]!.terminations).toBe(1);
    await start(); await reply('Recovered');
    await ui(page.locator('pre')).toHaveText('Recovered');
  });
});

describe('mounted OCR input preflight', () => {
  it.each([[9000, 1], [121, 40]])('rejects unexpected decoded dimensions %s x %s before canvas/worker use', async (width, height) => {
    await selectImage();
    await page.evaluate(size => { (window as any).ocrTest.decodedSize = size; }, [width, height]);
    await page.getByRole('button', { name: 'Read text', exact: true }).click();
    await ui(page.getByRole('alert')).toBeVisible();
    const s = await inspect(); expect(s.closed).toBe(1); expect(s.workers).toEqual([]);
  });

  it.each(['image/jpeg', 'image/webp'])('decodes and normalizes real %s pixels before OCR', async type => {
    await selectImage({ type }); await start();
    const image = await page.evaluate(() => Array.from((window as any).ocrTest.workers[0].messages.at(-1).payload.image.slice(0, 8)));
    expect(image).toEqual([137,80,78,71,13,10,26,10]);
    expect((await inspect()).closed).toBe(1);
    await reply('Format fixture');
    await ui(page.locator('pre')).toHaveText('Format fixture');
  });

  it('rejects bounded headers with corrupt compressed pixels before worker startup', async () => {
    await selectImage({ corrupt: true });
    await page.getByRole('button', { name: 'Read text', exact: true }).click();
    await ui(page.getByRole('alert')).toContainText('damaged');
    const s = await inspect(); expect(s.decodes).toBe(1); expect(s.workers).toEqual([]);
  });

  it.each([
    { name: 'byte limit', size: 10 * 1024 * 1024 + 1, reads: 0 },
    { name: 'empty bytes', bytes: [], reads: 0 },
    { name: 'corrupt bytes', bytes: [1, 2, 3, 4], reads: 1 },
    { name: 'unsupported SVG', bytes: Array.from(Buffer.from('<svg width="999999" height="999999"></svg>')), type: 'image/svg+xml', reads: 0 },
    { name: 'huge PNG dimensions', bytes: [137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,127,255,255,255,127,255,255,255,8,2,0,0,0,0,0,0,0], reads: 1 },
    { name: 'huge JPEG dimensions', bytes: [255,216,255,192,0,17,8,255,255,255,255,3,1,17,0,2,17,0,3,17,0,255,217], type: 'image/jpeg', reads: 1 },
    { name: 'huge WebP dimensions', bytes: [82,73,70,70,22,0,0,0,87,69,66,80,86,80,56,32,10,0,0,0,16,0,0,157,1,42,255,63,255,63], type: 'image/webp', reads: 1 },
  ])('rejects $name before decode/worker allocation', async fixture => {
    await selectImage(fixture);
    await page.getByRole('button', { name: 'Read text', exact: true }).click();
    await ui(page.getByRole('alert')).toBeVisible();
    const s = await inspect();
    expect(s.reads).toBe(fixture.reads); expect(s.decodes).toBe(0); expect(s.workers).toEqual([]);
    await selectImage(); await start(); await reply('Valid retry');
    await ui(page.locator('pre')).toHaveText('Valid retry');
  });

  it('does not start decoding or workers when a cancelled header read finishes', async () => {
    await selectImage({ holdRead: true });
    await page.getByRole('button', { name: 'Read text', exact: true }).click();
    await ui.poll(async () => (await inspect()).reads).toBe(1);
    await page.getByRole('button', { name: 'Cancel OCR', exact: true }).click();
    await page.evaluate(() => (window as any).ocrTest.finishRead());
    expect((await inspect()).decodes).toBe(0); expect((await inspect()).workers).toEqual([]);
  });

  it('closes a decoded bitmap arriving after unmount without creating a worker', async () => {
    await selectImage();
    await page.evaluate(() => { (window as any).ocrTest.hold = 'decode'; });
    await page.getByRole('button', { name: 'Read text', exact: true }).click();
    await ui.poll(async () => page.evaluate(() => Boolean((window as any).ocrTest.finishDecode))).toBe(true);
    await page.evaluate(() => { const s = (window as any).ocrTest; s.unmount(); s.finishDecode(); });
    await ui.poll(async () => (await inspect()).closed).toBe(1);
    expect((await inspect()).workers).toEqual([]);
  });
});

async function configureClipboard(mode: 'missing' | 'reject' | 'resolve' | 'pending') {
  await page.evaluate(mode => {
    const state = (window as any).ocrTest;
    state.clipboardCalls ??= [];
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: mode === 'missing' ? undefined : {
      writeText: (text: string) => {
        state.clipboardCalls.push(text);
        if (mode === 'reject') return Promise.reject(new Error('Controlled permission denial'));
        if (mode === 'pending') return new Promise<void>((resolve, reject) => {
          const finish = (success: boolean) => success ? resolve() : reject(new Error('Delayed denial'));
          state.finishCopy = finish;(state.finishCopies ??= []).push(finish);
        });
        return Promise.resolve();
      },
    } });
  }, mode);
}

describe('OCR keyboard recovery and clipboard permission', () => {
  it('focuses the committed result when animation callbacks run before React commits', async () => {
    await selectImage();await start();
    await page.evaluate(() => {
      // Reproduce the live ordering: the animation callback sees no mounted result.
      const state = (window as any).ocrTest;
      state.earlyFrames = [];
      window.requestAnimationFrame = callback => {
        queueMicrotask(() => {
          state.earlyFrames.push(Boolean(document.querySelector('.ai-result-card pre')));
          callback(performance.now());
        });
        return 0;
      };
    });
    await reply('Committed OCR result');
    await ui(page.locator('pre')).toHaveText('Committed OCR result');
    await ui(page.locator('pre')).toBeFocused();
    expect(await page.evaluate(() => (window as any).ocrTest.earlyFrames)).not.toContain(true);
  });

  it('keeps focus on copy controls when only copy feedback changes', async () => {
    await selectImage();await start();await reply('Copy focus fixture');
    await ui(page.locator('pre')).toBeFocused();await configureClipboard('resolve');
    await page.getByRole('button', { name: 'Copy result', exact: true }).click();
    await ui(page.getByRole('button', { name: 'Copied', exact: true })).toBeFocused();
    await ui(page.locator('pre')).not.toBeFocused();
  });

  it('keeps a missing-file keyboard submission out of loading and focuses the described invalid field', async () => {
    const read = page.getByRole('button', { name: 'Read text', exact: true });
    await read.focus();await page.keyboard.press('Enter');
    const file = page.locator('input[type=file]');
    await ui(file).toBeFocused();await ui(file).toHaveAttribute('aria-invalid', 'true');
    await ui(file).toHaveAttribute('aria-describedby', await page.getByRole('alert').getAttribute('id') ?? 'missing');
    await ui(file).toHaveAccessibleDescription('Choose an image file before running OCR.');
    await ui(read).toBeEnabled();expect((await inspect()).workers).toHaveLength(0);
    await selectImage();await ui(file).not.toHaveAttribute('aria-invalid', 'true');await start();await reply('Checked OCR result');
    await ui(page.locator('pre')).toBeFocused();await ui(page.locator('pre')).toHaveText('Checked OCR result');
  });

  it('associates an unsupported-file error and restores keyboard access after replacement', async () => {
    await selectImage({ type: 'image/gif' });await page.getByRole('button', { name: 'Read text', exact: true }).click();
    const file = page.locator('input[type=file]');await ui(file).toBeFocused();await ui(file).toHaveAttribute('aria-invalid', 'true');await ui(file).toHaveAccessibleDescription('Choose a PNG, JPEG, or WebP image. Export other formats as PNG first.');
    await selectImage();await start();await reply('Replacement text');await ui(page.locator('pre')).toBeFocused();
    await ui(page.getByRole('alert')).toHaveCount(0);await ui(file).not.toHaveAttribute('aria-describedby', /.+/);
  });

  it.each(['missing', 'reject'] as const)('%s clipboard provides selection and retry without hiding recognized text', async mode => {
    await selectImage();await start();await reply('Receipt total $42.50');await configureClipboard(mode);
    await page.getByRole('button', { name: 'Copy result', exact: true }).click();
    await ui(page.getByRole('status')).toContainText(mode === 'missing' ? 'not available' : 'blocked');await ui(page.getByRole('alert')).toHaveCount(0);await ui(page.locator('pre')).toHaveText('Receipt total $42.50');
    await page.getByRole('button', { name: 'Copy result', exact: true }).focus();await page.keyboard.press('Tab');await ui(page.locator('pre')).toBeFocused();
    const select = page.getByRole('button', { name: 'Select text', exact: true });await select.focus();await page.keyboard.press('Enter');
    expect(await page.evaluate(() => getSelection()?.toString())).toBe('Receipt total $42.50');await ui(page.locator('pre')).toBeFocused();
    await configureClipboard('resolve');await page.getByRole('button', { name: 'Copy result', exact: true }).click();
    await ui(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();await ui(page.getByRole('status')).toHaveText('Text copied.');await ui(select).toHaveCount(0);
  });

  it.each([true, false])('ignores delayed clipboard completion (%s) after a language change', async success => {
    await selectImage();await start();await reply('Earlier text');await configureClipboard('pending');await page.getByRole('button', { name: 'Copy result', exact: true }).click();
    await page.getByLabel('OCR language', { exact: false }).selectOption('spa');
    await page.evaluate(success => (window as any).ocrTest.finishCopy(success), success);
    await ui(page.getByRole('button', { name: 'Copy result', exact: true })).toBeDisabled();await ui(page.getByRole('button', { name: 'Copied', exact: true })).toHaveCount(0);await ui(page.getByRole('status')).toBeEmpty();await ui(page.getByRole('button', { name: 'Select text', exact: true })).toHaveCount(0);
    await start();await reply('Current language text');await ui(page.locator('pre')).toHaveText('Current language text');
  });

  it.each([true, false])('keeps the latest overlapping copy feedback (latest succeeds: %s)', async succeeds => {
    await selectImage();await start();await reply('Receipt total $42.50');await configureClipboard('pending');
    const copy = page.getByRole('button', { name: /^(Copy result|Copied)$/ });
    await copy.click();await copy.click();expect(await page.evaluate(() => (window as any).ocrTest.clipboardCalls.length)).toBe(2);
    await page.evaluate(ok => (window as any).ocrTest.finishCopies[1](ok), succeeds);
    await ui(page.getByRole('status')).toContainText(succeeds ? 'Text copied.' : 'Copy was blocked.');
    await page.evaluate(async ok => {
      (window as any).ocrTest.finishCopies[0](ok);
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    }, !succeeds);
    await ui(copy).toHaveText(succeeds ? 'Copied' : 'Copy result');
    await ui(page.getByRole('status')).toContainText(succeeds ? 'Text copied.' : 'Copy was blocked.');
    await ui(page.getByRole('button', { name: 'Select text', exact: true })).toHaveCount(succeeds ? 0 : 1);
    await ui(page.getByRole('alert')).toHaveCount(0);await ui(page.locator('pre')).toHaveText('Receipt total $42.50');
  });

  it('copies the displayed help message for empty recognition', async () => {
    await selectImage();await start();await reply(' \n ');await configureClipboard('resolve');
    await ui(page.locator('.ai-result-card strong')).toHaveText('No clear text found');
    const message = await page.locator('pre').innerText();expect(message).toContain('No readable text was found.');
    await page.getByRole('button', { name: 'Copy result', exact: true }).click();
    expect(await page.evaluate(() => (window as any).ocrTest.clipboardCalls)).toEqual([message]);
    await ui(page.getByRole('status')).toHaveText('Text copied.');
    await ui(page.locator('.ai-result-card dl > div').filter({ has: page.getByText('Characters', { exact: true }) }).locator('dd')).toHaveText('0');
  });
});
