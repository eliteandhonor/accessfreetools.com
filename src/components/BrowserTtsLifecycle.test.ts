import { chromium, expect as browserExpect, type Browser, type Page } from '@playwright/test';
import { TextReader, Uint8ArrayWriter, ZipWriter } from '@zip.js/zip.js';
import { build } from 'esbuild';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { BROWSER_TTS_IMPORT_LIMITS } from '../lib/browserTtsImport';
import { MAX_TTS_TEXT_FILE_BYTES } from '../lib/browserTtsInput';

// Mount the actual component, queue and parsers; control I/O, worker failures and async timing.
const harness = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import Component from './src/components/TextToSpeechAudiobookGenerator';
import { BrowserTtsChapterQueue } from './src/lib/browserTtsChapterQueue';
const state = window.ttsTest = {
  workers: [], watchdogs: new Map(), abortListeners: new Set(),
  reads: 0, revoked: [], created: [], settlements: 0, queue: null, actions: [], readBytes: [],
  retrySettlements: 0, workerFault: null, faults: [], constructorAttempts: 0, postAttempts: [],
  deferEpubParse: false, epubParses: [],
};
document.addEventListener('aft:tool-action', event => state.actions.push(event.detail.clarityEvent));
const run = BrowserTtsChapterQueue.prototype.run;
BrowserTtsChapterQueue.prototype.run = function (...args) {
  state.queue = this;
  return run.apply(this, args).then(result => { state.settlements++; return result; });
};
const retry = BrowserTtsChapterQueue.prototype.retry;
BrowserTtsChapterQueue.prototype.retry = function (...args) {
  return retry.apply(this, args).then(result => { state.retrySettlements++; return result; });
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
let timerId = -1;
const setTimer = window.setTimeout;
const clearTimer = window.clearTimeout;
window.setTimeout = (callback, delay, ...args) => {
  if (delay !== 90000) return setTimer(callback, delay, ...args);
  const id = timerId--;
  state.watchdogs.set(id, callback);
  return id;
};
window.clearTimeout = id => { state.watchdogs.delete(id); clearTimer(id); };
state.stall = () => {
  const entries = [...state.watchdogs.entries()];
  for (const [id, callback] of entries) { state.watchdogs.delete(id); callback(); }
};
window.Worker = class {
  message = null; error = null; messageerror = null;
  messages = []; terminated = false; stale = {};
  get onmessage() { return this.message; }
  set onmessage(value) { this.message = value; if (value) this.stale.message = value; }
  get onerror() { return this.error; }
  set onerror(value) { this.error = value; if (value) this.stale.error = value; }
  get onmessageerror() { return this.messageerror; }
  set onmessageerror(value) { this.messageerror = value; if (value) this.stale.messageerror = value; }
  constructor() {
    state.constructorAttempts++;
    if (state.workerFault === 'constructor') {
      state.workerFault = null;
      state.faults.push('constructor');
      throw new DOMException('Controlled Worker constructor failure', 'SecurityError');
    }
    state.workers.push(this);
  }
  postMessage(message) {
    state.postAttempts.push({ worker: state.workers.indexOf(this), message });
    if (state.workerFault === message.type) {
      state.workerFault = null;
      state.faults.push(message.type);
      throw new DOMException('Controlled Worker postMessage failure', 'DataCloneError');
    }
    this.messages.push(message);
  }
  terminate() {
    this.terminated = true;
  }
};
const createUrl = URL.createObjectURL;
const revokeUrl = URL.revokeObjectURL;
URL.createObjectURL = blob => { const url = createUrl(blob); state.created.push(url); return url; };
URL.revokeObjectURL = url => { state.revoked.push(url); revokeUrl(url); };
const root = createRoot(document.getElementById('root'));
state.unmount = () => root.unmount();
root.render(<Component />);
`;

// Hold only the component-facing parser promise, after the real parser accepts the ZIP.
const deferredEpubParser = `
import { importBrowserTtsEpub as parseEpub } from './src/lib/browserTtsEpubImport';
export async function importBrowserTtsEpub(...args) {
  const state = window.ttsTest;
  const deferred = state.deferEpubParse;
  state.deferEpubParse = false;
  const parse = { result: null, waiting: false, returned: false, release: null };
  state.epubParses.push(parse);
  parse.result = await parseEpub(...args);
  if (deferred) {
    await new Promise(resolve => { parse.waiting = true; parse.release = resolve; });
    parse.waiting = false;
  }
  parse.returned = true;
  return parse.result;
}
`;

let browser: Browser;
let page: Page;
let script: string;
let pageErrors: string[];
const ui = browserExpect.configure({ timeout: 1_500 });

beforeAll(async () => {
  const bundle = await build({
    stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true,
    write: false,
    format: 'iife',
    platform: 'browser',
    jsx: 'automatic',
    define: { 'import.meta.url': JSON.stringify('http://tts.test/component.js') },
    plugins: [{
      name: 'defer-component-epub-result',
      setup(bundle) {
        bundle.onResolve({ filter: /\/browserTtsEpubImport$/ }, args => {
          if (/[\\/]TextToSpeechAudiobookGenerator\.tsx$/.test(args.importer)) {
            return { path: 'deferred-epub', namespace: 'tts-test' };
          }
        });
        bundle.onLoad({ filter: /.*/, namespace: 'tts-test' }, () => ({
          contents: deferredEpubParser, loader: 'js', resolveDir: process.cwd(),
        }));
      },
    }],
  });
  script = bundle.outputFiles[0]!.text;
  browser = await chromium.launch({ headless: true });
  console.info(`TTS component lifecycle: Chromium ${browser.version()}, fake workers, no model downloads.`);
}, 30_000);

beforeEach(async () => {
  page = await browser.newPage();
  page.setDefaultTimeout(1_500);
  pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  // Every request is fulfilled locally. No model, analytics or asset download is possible.
  await page.route('**/*', route => route.fulfill({
    contentType: 'text/html',
    body: route.request().url() === 'http://tts.test/' ? '<div id="root"></div>' : '',
  }));
  await page.goto('http://tts.test/');
  await page.addScriptTag({ content: script });
  await page.locator('#tts-source-text').waitFor();
});

afterEach(async () => {
  await page?.close();
  expect(pageErrors).toEqual([]);
});
afterAll(async () => { await browser?.close(); });

async function inspect() {
  return page.evaluate(() => {
    const state = (window as any).ttsTest;
    return {
      reads: state.reads,
      workers: state.workers.map((worker: any) => ({
        messages: worker.messages, terminated: worker.terminated,
        listeners: Boolean(worker.onmessage || worker.onerror || worker.onmessageerror),
      })),
      watchdogs: state.watchdogs.size,
      abortListeners: state.abortListeners.size,
      running: state.queue?.isRunning(),
      queue: state.queue?.getState(),
      settlements: state.settlements,
      retrySettlements: state.retrySettlements,
      workerFault: state.workerFault,
      faults: state.faults,
      constructorAttempts: state.constructorAttempts,
      postAttempts: state.postAttempts,
      epubParses: state.epubParses.map(({ result, waiting, returned }: any) => ({ result, waiting, returned })),
      created: state.created,
      revoked: state.revoked,
      actions: state.actions,
      readBytesCleared: state.readBytes.every((bytes: Uint8Array) => bytes.every(byte => byte === 0)),
    };
  });
}

async function workerEvent(type: string, index = -1, stale = false) {
  await page.evaluate(({ type, index, stale }) => {
    const worker = (window as any).ttsTest.workers.at(index);
    if (type === 'onerror' || type === 'onmessageerror') {
      const handler = stale ? worker.stale?.[type === 'onerror' ? 'error' : 'messageerror'] : worker[type];
      handler?.(new Event('error'));
    } else {
      const handler = stale ? worker.stale?.message : worker.onmessage;
      handler?.({ data: {
        type, backend: 'wasm', message: type === 'error' ? 'Synthetic model load failure' : undefined,
        ...(type === 'result' ? { audio: new Uint8Array([0x49, 0x44, 0x33, 1]).buffer } : {}),
      } });
    }
  }, { type, index, stale });
}

async function startChapters(count = 1, kokoro = false) {
  if (kokoro) await page.locator('input[value="kokoro-82m"]').check();
  await page.getByRole('button', { name: 'Chapter MP3s', exact: true }).click();
  await page.getByLabel('Chapter text', { exact: true }).fill('First local chapter.');
  for (let index = 1; index < count; index++) {
    await page.getByRole('button', { name: 'Add chapter', exact: true }).click();
    await page.getByLabel('Chapter text', { exact: true }).nth(index).fill(`Local chapter ${index + 1}.`);
  }
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Generate chapter MP3s', exact: true }).click();
}

async function selectFile(options: {
  name: string; type: string; size?: number; bytes?: number[]; deferred?: boolean;
}) {
  await page.evaluate(options => {
    const state = (window as any).ttsTest;
    const bytes = new Uint8Array(options.bytes ?? [65, 66, 67]);
    const file = new File([bytes], options.name, { type: options.type });
    if (options.size !== undefined) Object.defineProperty(file, 'size', { value: options.size });
    file.arrayBuffer = () => {
      state.reads++;
      state.readBytes.push(bytes);
      if (!options.deferred) return Promise.resolve(bytes.buffer);
      return new Promise(resolve => { state.finishRead = () => resolve(bytes.buffer); });
    };
    const transfer = new DataTransfer();
    transfer.items.add(file);
    const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, options);
}

async function selectEpub(title: string, deferred = false) {
  const writer = new ZipWriter(new Uint8ArrayWriter(), { useWebWorkers: false });
  const entries: Array<[string, string]> = [
    ['mimetype', 'application/epub+zip'],
    ['META-INF/container.xml', '<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0"><rootfiles><rootfile full-path="OPS/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'],
    ['OPS/package.opf', '<package xmlns="http://www.idpf.org/2007/opf" version="3.0"><manifest><item id="chapter" href="chapter.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="chapter"/></spine></package>'],
    ['OPS/chapter.xhtml', `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>${title}</title></head><body><h1>${title}</h1><p>${title} local paragraph.</p></body></html>`],
  ];
  for (const [name, content] of entries) {
    await writer.add(name, new TextReader(content), { level: 0 });
  }
  const bytes = Array.from(await writer.close());
  await page.evaluate(deferred => { (window as any).ttsTest.deferEpubParse = deferred; }, deferred);
  await selectFile({ name: `${title}.epub`, type: 'application/epub+zip', bytes });
}

describe('TTS component worker recovery', () => {
  it.each([
    { phase: 'initial load', fault: 'constructor' },
    { phase: 'initial load', fault: 'load' },
    { phase: 'pending fallback load', fault: 'constructor' },
    { phase: 'pending fallback load', fault: 'load' },
    { phase: 'active fallback load', fault: 'constructor' },
    { phase: 'active fallback load', fault: 'load' },
    { phase: 'initial generation', fault: 'generate' },
    { phase: 'pending fallback generation', fault: 'generate' },
    { phase: 'active fallback generation', fault: 'generate' },
    { phase: 'loaded-worker generation', fault: 'generate' },
  ])('settles a controlled $fault throw during $phase and unlocks retry', async ({ phase, fault }) => {
    const fallback = phase.includes('fallback');
    const reused = phase === 'loaded-worker generation';
    const chapterIndex = reused ? 1 : 0;
    if (!fallback && !reused) {
      await page.evaluate(fault => { (window as any).ttsTest.workerFault = fault; }, fault);
    }
    await startChapters(reused ? 2 : 1, fallback);
    let original;
    if (reused) {
      await workerEvent('ready');
      await page.evaluate(fault => { (window as any).ttsTest.workerFault = fault; }, fault);
      await workerEvent('result');
      original = (await inspect()).queue.items[0].result;
    } else if (fallback) {
      if (phase.startsWith('active')) await workerEvent('ready');
      await page.evaluate(fault => { (window as any).ttsTest.workerFault = fault; }, fault);
      await page.evaluate(() => (window as any).ttsTest.stall());
      if (fault === 'generate') await workerEvent('ready');
    } else if (fault === 'generate') {
      await workerEvent('ready');
    }

    await ui(page.getByRole('button', { name: 'Retry', exact: true })).toBeEnabled();
    await ui(page.getByRole('button', {
      name: reused ? 'Generate chapter set again' : 'Generate chapter MP3s', exact: true,
    })).toBeEnabled();
    const failed = await inspect();
    expect(failed).toMatchObject({
      running: false, settlements: 1, retrySettlements: 0, watchdogs: 0, abortListeners: 0,
      faults: [fault], workerFault: null, constructorAttempts: fallback ? 2 : 1,
      queue: { status: 'failed', failedCount: 1, completedCount: chapterIndex, activeChapterId: null },
    });
    expect(failed.queue.items[chapterIndex]).toMatchObject({
      status: 'failed', attempts: 1, retryCount: 0,
      error: fault === 'generate'
        ? 'This browser could not send the speech generation request.'
        : 'This browser could not start the speech worker.',
    });
    expect(failed.workers).toHaveLength(failed.constructorAttempts - (fault === 'constructor' ? 1 : 0));
    for (const worker of failed.workers) expect(worker).toMatchObject({ terminated: true, listeners: false });
    if (fault !== 'constructor') {
      expect(failed.postAttempts.at(-1).message).toMatchObject({ type: fault });
      if (fallback && fault === 'load') expect(failed.postAttempts.at(-1).message.forceWasm).toBe(true);
    }
    if (fallback && fault === 'generate') {
      expect(failed.workers[1].messages).toEqual([{ type: 'load', forceWasm: true }]);
    }
    expect(failed.created).toHaveLength(chapterIndex);
    await ui(page.getByRole('button', { name: 'MP3', exact: true })).toHaveCount(chapterIndex);

    // Disposed handlers are invoked deliberately, including while a new retry is live.
    for (let index = 0; index < failed.workers.length; index++) {
      for (const type of ['ready', 'result', 'error', 'onerror', 'onmessageerror']) {
        await workerEvent(type, index, true);
      }
    }
    await page.evaluate(() => (window as any).ttsTest.stall());
    expect(await inspect()).toEqual(failed);

    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    const retrying = await inspect();
    expect(retrying).toMatchObject({ running: true, settlements: 1, retrySettlements: 0 });
    expect(retrying.workers.at(-1).messages).toEqual([{ type: 'load' }]);
    for (let index = 0; index < failed.workers.length; index++) {
      await workerEvent('ready', index, true);
      await workerEvent('result', index, true);
      await workerEvent('onerror', index, true);
    }
    expect(await inspect()).toEqual(retrying);
    await workerEvent('ready');
    await workerEvent('result');
    await ui(page.getByRole('button', { name: 'MP3', exact: true })).toHaveCount(chapterIndex + 1);
    const completed = await inspect();
    expect(completed).toMatchObject({
      running: false, settlements: 1, retrySettlements: 1, watchdogs: 0, abortListeners: 0,
      constructorAttempts: failed.constructorAttempts + 1, faults: [fault],
      queue: { status: 'completed', failedCount: 0, completedCount: chapterIndex + 1 },
    });
    expect(completed.queue.items[chapterIndex]).toMatchObject({ status: 'completed', attempts: 2, retryCount: 1 });
    expect(completed.actions.filter((action: string) => action === 'tts_chapter_complete')).toHaveLength(1);
    if (reused) {
      expect(completed.queue.items[0]).toMatchObject({ result: original, attempts: 1 });
      expect(completed.revoked).not.toContain(original.url);
    }
    await ui(page.getByRole('button', { name: 'Retry', exact: true })).toHaveCount(0);
    await workerEvent('result');
    expect(await inspect()).toEqual(completed);
  });

  it.each(['error', 'onerror', 'onmessageerror'])('settles a pre-ready %s and allows one successful retry', async type => {
    await startChapters();
    await workerEvent(type);
    await ui(page.getByRole('button', { name: 'Retry', exact: true })).toBeEnabled();
    const failed = await inspect();
    expect(failed).toMatchObject({ running: false, settlements: 1, watchdogs: 0, abortListeners: 0 });
    expect(failed.workers[0]).toMatchObject({ terminated: true, listeners: false });
    expect(failed.queue.items[0]).toMatchObject({ status: 'failed', attempts: 1 });
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await workerEvent('ready');
    await workerEvent('result');
    await browserExpect(page.getByRole('button', { name: 'MP3', exact: true })).toHaveCount(1);
    expect((await inspect()).queue.items[0]).toMatchObject({ status: 'completed', attempts: 2, retryCount: 1 });
    await browserExpect(page.getByRole('button', { name: 'Retry', exact: true })).toHaveCount(0);
  });

  it('preserves an earlier MP3 through active failure and failed retry preload', async () => {
    await startChapters(2);
    await workerEvent('ready');
    await workerEvent('result');
    await browserExpect(page.getByRole('button', { name: 'MP3', exact: true })).toHaveCount(1);
    const original = (await inspect()).queue.items[0].result;
    await workerEvent('error');
    await browserExpect(page.getByRole('button', { name: 'Retry', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await workerEvent('error');
    await browserExpect(page.locator('#tts-job-heading')).toHaveText('One chapter needs attention');
    const failed = await inspect();
    expect(failed.running).toBe(false);
    expect(failed.queue.items[0].result).toEqual(original);
    expect(failed.revoked).not.toContain(original.url);
    await browserExpect(page.getByRole('button', { name: 'Retry', exact: true })).toHaveCount(0);
    await browserExpect(page.getByRole('button', { name: 'MP3', exact: true })).toHaveCount(1);
  });

  it('retries a later chapter successfully without regenerating the completed MP3', async () => {
    await startChapters(2);
    await workerEvent('ready');
    await workerEvent('result');
    await browserExpect(page.getByRole('button', { name: 'MP3', exact: true })).toHaveCount(1);
    const original = (await inspect()).queue.items[0].result;
    await workerEvent('error');
    await browserExpect(page.getByRole('button', { name: 'Retry', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await workerEvent('ready', 0, true);
    await workerEvent('error', 0, true);
    await workerEvent('result', 0, true);
    expect((await inspect()).workers[1].messages).toEqual([{ type: 'load' }]);
    await workerEvent('ready');
    await workerEvent('result');
    await browserExpect(page.getByRole('button', { name: 'MP3', exact: true })).toHaveCount(2);
    const completed = await inspect();
    expect(completed.queue.items[0]).toMatchObject({ result: original, attempts: 1 });
    expect(completed.queue.items[1]).toMatchObject({ attempts: 2, retryCount: 1, status: 'completed' });
    expect(completed.revoked).not.toContain(original.url);
    expect(completed.abortListeners).toBe(0);
    await workerEvent('result');
    expect((await inspect()).created).toHaveLength(2);
  });

  it.each(['pending', 'active'])('settles a %s watchdog timeout without orphaning the queue', async phase => {
    await startChapters();
    if (phase === 'active') await workerEvent('ready');
    await page.evaluate(() => (window as any).ttsTest.stall());
    await browserExpect(page.getByRole('button', { name: 'Retry', exact: true })).toBeEnabled();
    expect(await inspect()).toMatchObject({ running: false, settlements: 1, watchdogs: 0, abortListeners: 0 });
    await workerEvent('error', 0, true);
    await workerEvent('result', 0, true);
    expect((await inspect()).settlements).toBe(1);
  });

  it('ignores an old worker after watchdog fallback and settles fallback preload failure', async () => {
    await startChapters(1, true);
    await page.evaluate(() => (window as any).ttsTest.stall());
    const loading = await inspect();
    expect(loading.workers).toHaveLength(2);
    expect(loading.workers[1].messages).toEqual([{ type: 'load', forceWasm: true }]);
    await workerEvent('error', 0, true);
    expect((await inspect()).workers[1].terminated).toBe(false);
    await workerEvent('error');
    await browserExpect(page.getByRole('button', { name: 'Retry', exact: true })).toBeEnabled();
    expect(await inspect()).toMatchObject({ running: false, settlements: 1, watchdogs: 0, abortListeners: 0 });
  });

  it.each(['result', 'timeout'])('settles a Kokoro fallback %s without another automatic retry', async outcome => {
    await startChapters(1, true);
    await workerEvent('ready');
    await page.evaluate(() => (window as any).ttsTest.stall());
    if (outcome === 'result') {
      await workerEvent('ready');
      await workerEvent('result');
      await browserExpect(page.getByRole('button', { name: 'MP3', exact: true })).toHaveCount(1);
    } else {
      await page.evaluate(() => (window as any).ttsTest.stall());
      await browserExpect(page.getByRole('button', { name: 'Retry', exact: true })).toBeEnabled();
    }
    const state = await inspect();
    expect(state).toMatchObject({ running: false, settlements: 1, watchdogs: 0, abortListeners: 0 });
    expect(state.workers).toHaveLength(2);
  });

  it.each(['pending', 'active'])('cancels %s generation exactly once and ignores late events', async phase => {
    await startChapters();
    if (phase === 'active') await workerEvent('ready');
    await page.getByRole('button', { name: 'Stop', exact: true }).click();
    await browserExpect(page.getByRole('button', { name: 'Generate chapter MP3s', exact: true })).toBeEnabled();
    await workerEvent('ready', 0, true);
    await workerEvent('result', 0, true);
    await workerEvent('onerror', 0, true);
    expect(await inspect()).toMatchObject({
      running: false, settlements: 1, watchdogs: 0, abortListeners: 0, created: [],
      queue: { status: 'cancelled' },
    });
    await browserExpect(page.locator('#tts-job-heading')).toHaveText('Chapter generation stopped');
  });

  it('unmounts during preload and discards late worker events', async () => {
    await startChapters();
    await page.evaluate(() => (window as any).ttsTest.unmount());
    await workerEvent('ready', 0, true);
    await workerEvent('result', 0, true);
    expect(await inspect()).toMatchObject({ running: false, settlements: 1, watchdogs: 0, abortListeners: 0, created: [] });
  });

  it('keeps completed chapter MP3s when the loaded model is unloaded', async () => {
    await startChapters();
    await workerEvent('ready');
    await workerEvent('result');
    await browserExpect(page.getByRole('button', { name: 'Unload model', exact: true })).toBeVisible();
    const original = (await inspect()).queue.items[0].result;
    await page.getByRole('button', { name: 'Unload model', exact: true }).click();
    await browserExpect(page.getByRole('button', { name: 'MP3', exact: true })).toHaveCount(1);
    expect((await inspect()).queue.items[0].result).toEqual(original);
    expect((await inspect()).revoked).not.toContain(original.url);
  });

  it('preserves earlier MP3s when stopping the next chapter', async () => {
    await startChapters(2);
    await workerEvent('ready');
    await workerEvent('result');
    await browserExpect(page.getByRole('button', { name: 'MP3', exact: true })).toHaveCount(1);
    const original = (await inspect()).queue.items[0].result;
    await page.getByRole('button', { name: 'Stop', exact: true }).click();
    await browserExpect(page.locator('#tts-job-heading')).toHaveText('Chapter generation stopped');
    const state = await inspect();
    expect(state.queue.items[0].result).toEqual(original);
    expect(state.revoked).not.toContain(original.url);
    expect(state).toMatchObject({ running: false, settlements: 1, watchdogs: 0, abortListeners: 0 });
  });
});

describe('TTS component file preflight', () => {
  it('publishes a valid EPUB only after its awaited parser result is released', async () => {
    await selectEpub('Accepted', true);
    await expect.poll(async () => (await inspect()).epubParses[0]?.waiting).toBe(true);
    const pending = await inspect();
    expect(pending.epubParses[0]).toMatchObject({
      returned: false, result: { format: 'epub', chapters: [{ title: 'Accepted', text: 'Accepted local paragraph.' }] },
    });
    expect(pending.reads).toBe(1);
    expect(pending.readBytesCleared).toBe(false);
    expect(pending.actions).not.toContain('tts_document_import');
    await ui(page.getByLabel('Chapter text', { exact: true })).toHaveCount(0);
    await page.evaluate(() => (window as any).ttsTest.epubParses[0].release());
    await ui(page.getByLabel('Chapter text', { exact: true })).toHaveValue('Accepted local paragraph.');
    await ui(page.getByLabel('Chapter name', { exact: true })).toHaveValue('Accepted');
    const complete = await inspect();
    expect(complete.epubParses[0]).toMatchObject({ waiting: false, returned: true });
    expect(complete.readBytesCleared).toBe(true);
    expect(complete.actions.filter((action: string) => action === 'tts_document_import')).toHaveLength(1);
    expect(complete.workers).toHaveLength(0);
  });

  it.each(['cancel', 'replacement', 'unmount'])('does not publish an awaited EPUB parser result after %s', async action => {
    await page.getByRole('button', { name: 'Chapter MP3s', exact: true }).click();
    await page.getByLabel('Chapter text', { exact: true }).fill('Existing local chapter.');
    await selectEpub('Stale', true);
    await expect.poll(async () => (await inspect()).epubParses[0]?.waiting).toBe(true);
    const pending = await inspect();
    expect(pending.epubParses[0]).toMatchObject({
      returned: false, result: { format: 'epub', chapters: [{ title: 'Stale', text: 'Stale local paragraph.' }] },
    });
    expect(pending.reads).toBe(1);
    expect(pending.readBytesCleared).toBe(false);
    await ui(page.getByLabel('Chapter text', { exact: true })).toHaveValue('Existing local chapter.');
    if (action === 'cancel') await page.getByRole('button', { name: 'Cancel import', exact: true }).click();
    if (action === 'replacement') {
      await selectEpub('Replacement');
      await ui(page.getByLabel('Chapter text', { exact: true })).toHaveValue('Replacement local paragraph.');
    }
    if (action === 'unmount') await page.evaluate(() => (window as any).ttsTest.unmount());
    const actionsBeforeRelease = (await inspect()).actions;
    await page.evaluate(() => (window as any).ttsTest.epubParses[0].release());
    // Byte clearing happens in the component's finally, after its post-parser operation guard.
    await expect.poll(async () => (await inspect()).readBytesCleared).toBe(true);
    const completed = await inspect();
    expect(completed.epubParses[0]).toMatchObject({ waiting: false, returned: true });
    expect(completed.actions).toEqual(actionsBeforeRelease);
    expect(completed.actions.filter((value: string) => value === 'tts_document_import')).toHaveLength(action === 'replacement' ? 1 : 0);
    expect(completed.workers).toHaveLength(0);
    expect(completed.reads).toBe(action === 'replacement' ? 2 : 1);
    if (action === 'unmount') {
      await ui(page.locator('#root')).toBeEmpty();
    } else {
      await ui(page.getByLabel('Chapter text', { exact: true })).toHaveCount(1);
      await ui(page.getByLabel('Chapter text', { exact: true })).toHaveValue(action === 'replacement'
        ? 'Replacement local paragraph.' : 'Existing local chapter.');
      await ui(page.getByLabel('Chapter name', { exact: true })).toHaveValue(action === 'replacement' ? 'Replacement' : 'Chapter 1');
      await ui(page.getByRole('button', { name: 'Cancel import', exact: true })).toHaveCount(0);
      await ui(page.getByRole('alert')).toHaveCount(0);
    }
  });

  it.each([
    { name: 'large.txt', type: 'text/plain', size: MAX_TTS_TEXT_FILE_BYTES + 1 },
    { name: 'large.md', type: 'text/markdown', size: BROWSER_TTS_IMPORT_LIMITS.markdownFileBytes + 1 },
    { name: 'large.epub', type: 'application/epub+zip', size: BROWSER_TTS_IMPORT_LIMITS.archiveFileBytes + 1 },
    { name: 'wrong.pdf', type: 'application/pdf', size: 3 },
    { name: 'wrong.txt', type: 'text/plain-not-really', size: 3 },
    { name: 'wrong.md', type: 'text/html', size: 3 },
    { name: 'wrong.epub', type: 'text/plain', size: 3 },
    { name: 'empty.txt', type: 'text/plain', size: 0 },
    { name: 'negative.txt', type: 'text/plain', size: -1 },
    { name: 'fraction.md', type: 'text/markdown', size: 1.5 },
    { name: 'nan.epub', type: 'application/epub+zip', size: NaN },
  ])('rejects $name before reading bytes', async fixture => {
    await selectFile(fixture);
    await browserExpect(page.getByRole('alert')).toBeVisible();
    expect((await inspect()).reads).toBe(0);
    await browserExpect(page.locator('#tts-source-text')).toHaveValue('');
  });

  it.each([
    { name: 'bad.txt', type: 'text/plain', bytes: [0xff, 0xfe] },
    { name: 'binary.txt', type: 'text/plain', bytes: [65, 0, 66] },
    { name: 'mismatch.txt', type: 'text/plain', size: 2, bytes: [65, 66, 67] },
    { name: 'bad.md', type: 'text/markdown', bytes: [0xff, 0xfe] },
    { name: 'bad.epub', type: 'application/epub+zip', bytes: [65, 66, 67] },
  ])('rejects malformed bytes in $name after one read', async fixture => {
    await selectFile(fixture);
    await browserExpect(page.getByRole('alert')).toBeVisible();
    expect((await inspect()).reads).toBe(1);
    await browserExpect(page.locator('#tts-source-text')).toHaveValue('');
  });

  it.each(['cancel', 'replacement', 'unmount'])('does not publish a delayed import after %s', async action => {
    await selectFile({ name: 'old.txt', type: 'text/plain', deferred: true });
    if (action === 'cancel') await page.getByRole('button', { name: 'Cancel import', exact: true }).click();
    if (action === 'replacement') await selectFile({ name: 'new.txt', type: 'text/plain', bytes: [78, 69, 87] });
    if (action === 'unmount') await page.evaluate(() => (window as any).ttsTest.unmount());
    await page.evaluate(() => (window as any).ttsTest.finishRead());
    if (action !== 'unmount') {
      await browserExpect(page.locator('#tts-source-text')).toHaveValue(action === 'replacement' ? 'NEW' : '');
    }
    const state = await inspect();
    expect(state.workers).toHaveLength(0);
    expect(state.actions.filter((value: string) => value === 'tts_document_import')).toHaveLength(action === 'replacement' ? 1 : 0);
    expect(state.readBytesCleared).toBe(true);
  });

  it('accepts exact 64 KiB Markdown bytes with bounded extracted text and blank MIME', async () => {
    const content = '---\n' + 'x'.repeat(65_536 - 24) + '\n---\n# Opening\nRead.';
    const bytes = Array.from(new TextEncoder().encode(content));
    expect(bytes).toHaveLength(65_536);
    await selectFile({ name: 'boundary.MARKDOWN', type: '', bytes });
    await browserExpect(page.getByLabel('Chapter text', { exact: true })).toContainText('Read.');
    expect(await inspect()).toMatchObject({ reads: 1, readBytesCleared: true });
    expect((await inspect()).workers).toHaveLength(0);
  });
});
