import { build } from 'esbuild';
import { chromium, expect as browserExpect, type Browser, type Page } from 'playwright/test';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { createTranscriptDownloads } from './browserTranscriber';
import { buildWordAlignedSegments } from './browserTranscriberAlignment';

let browser: Browser;
let page: Page;
let componentScript: string;
let asrWorkerScript: string;
const errors: string[] = [];
const coreFixProof = process.env.TRANSCRIBER_CORE_FIX_PROOF;

beforeAll(async () => {
  const bundle = await build({
    stdin: {
      contents: `import React from 'react'; import {createRoot} from 'react-dom/client';
        import App from './src/components/AudioVideoTranscriber';
        const root = createRoot(document.getElementById('root'));
        window.unmount = () => root.unmount(); root.render(React.createElement(App));`,
      resolveDir: process.cwd(), loader: 'tsx',
    },
    bundle: true, write: false, format: 'iife', jsx: 'automatic',
    define: { 'import.meta.url': JSON.stringify('https://fixture.invalid/component.js') },
    plugins: [{ name: 'no-analytics', setup(builder) {
      builder.onResolve({ filter: /aftToolAnalytics$/ }, () => ({ path: 'analytics', namespace: 'fixture' }));
      builder.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: 'export const emitAftToolAction = () => {};' }));
    } }],
  });
  componentScript = bundle.outputFiles[0].text;
  const asrBundle = await build({
    entryPoints: ['src/workers/transcriber-asr.worker.ts'],
    bundle: true, write: false, format: 'iife',
    plugins: [{ name: 'synthetic-model-errors', setup(builder) {
      builder.onResolve({ filter: /^@huggingface\/transformers$/ }, () => ({ path: 'model', namespace: 'fixture' }));
      builder.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: `
        export const env = {version: '4.2.0'};
        export async function pipeline(_task, _model, options) {
          const fail = (stage) => {
            const fixture = self.asrFixture;
            if (options.device === 'webgpu' && fixture.stage === stage) {
              throw new DOMException('Private synthetic error detail', fixture.name);
            }
          };
          fail('load');
          return Object.assign(async () => {
            fail('transcribe');
            return {text: 'Synthetic success', chunks: [{text: 'Synthetic success', timestamp: [0, 1]}]};
          }, {dispose: async () => {}, model: {_generate_with_seek: () => {
            throw new Error('The synthetic error fixture must not perform real inference');
          }}});
        }
      ` }));
    } }],
  });
  asrWorkerScript = asrBundle.outputFiles[0].text;
  browser = await chromium.launch({ headless: true });
  console.log(`TR-02 synthetic browser: Chromium ${browser.version()}; in-memory component bundle; no model/decoder/network.`);
}, 30_000);

beforeEach(async () => {
  page = await browser.newPage();
  errors.length = 0;
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => route.abort());
  await page.setContent('<div id="root"></div>');
  if (coreFixProof) await page.addStyleTag({ content: readFileSync('src/styles/global.css', 'utf8') });
});

afterEach(async () => {
  await page.close();
  expect(errors).toEqual([]);
});
afterAll(async () => { await browser?.close(); });

async function mount(asrFixture?: { stage: 'load' | 'transcribe'; name: 'AbortError' | 'TimeoutError' | 'Error' }) {
  await page.evaluate(({ asrFixture, asrWorkerScript }) => {
    const w = window as any;
    const NativeWorker = Worker;
    w.workers = [];
    Object.defineProperty(navigator, 'gpu', { configurable: true, value: { requestAdapter: async () => ({}) } });
    class FakeWorker extends EventTarget {
      kind: string;
      dead = false;
      requests: any[] = [];
      native?: Worker;
      nativeReplies: any[] = [];
      constructor(url: URL) {
        super();
        this.kind = String(url).includes('media.worker') ? 'media' : 'asr';
        w.workers.push(this);
        if (this.kind === 'asr' && asrFixture) {
          const url = URL.createObjectURL(new Blob([
            `self.asrFixture = ${JSON.stringify(asrFixture)};\n`, asrWorkerScript,
          ], { type: 'text/javascript' }));
          this.native = new NativeWorker(url);
          URL.revokeObjectURL(url);
          this.native.addEventListener('message', (event) => this.nativeReplies.push(event.data));
          this.native.addEventListener('error', () => this.dispatchEvent(new Event('error')));
        }
      }
      postMessage(request: any, transfer: Transferable[] = []) {
        if (this.dead) throw new Error('post after termination');
        this.requests.push(request);
        this.native?.postMessage(request, transfer);
      }
      terminate() { this.dead = true; this.native?.terminate(); }
      reply(data: any, request = this.requests.at(-1)) {
        this.dispatchEvent(new MessageEvent('message', { data: { requestId: request?.requestId, ...data } }));
      }
    }
    w.Worker = FakeWorker;
  }, { asrFixture, asrWorkerScript });
  await page.addScriptTag({ content: componentScript });
  await browserExpect(page.getByRole('heading', { name: 'Choose a recording to inspect' })).toBeVisible();
}

async function inspect(duration = 10) {
  await page.getByLabel('Choose audio or video file').setInputFiles({ name: 'synthetic.wav', mimeType: 'audio/wav', buffer: Buffer.from([0]) });
  await reply('media', { type: 'inspected', media: { duration, format: 'WAV', tracks: [{ number: 1, id: 1, canDecode: true, name: 'Synthetic', language: 'eng', codec: 'pcm', channels: 1, sampleRate: 16000 }] } });
  await browserExpect(page.getByRole('heading', { name: 'Recording inspected and ready' })).toBeVisible();
}

async function reply(kind: string, data: object) {
  await page.evaluate(({ kind, data }) => {
    const worker = (window as any).workers.findLast((item: any) => item.kind === kind && !item.dead);
    if (!worker) throw new Error(`No live ${kind} worker`);
    worker.reply(data);
  }, { kind, data });
}

async function waitRequest(kind: string, type: string) {
  await page.waitForFunction(({ kind, type }) => (window as any).workers.some((item: any) => !item.dead && item.kind === kind && item.requests.at(-1)?.type === type), { kind, type });
}

async function deliverNativeAsrReply() {
  while (true) {
    await page.waitForFunction(() => (window as any).workers.some((w: any) => !w.dead && w.nativeReplies.length));
    const event = await page.evaluate(() => {
      const worker = (window as any).workers.findLast((w: any) => !w.dead && w.nativeReplies.length);
      const data = worker.nativeReplies.shift();
      // Deliver progress too; wait for the final serialized response.
      worker.dispatchEvent(new MessageEvent('message', { data }));
      return data;
    });
    if (event.type !== 'transcription-progress') return event;
    expect(event.progress).toBeGreaterThan(0);
    expect(event.progress).toBeLessThanOrEqual(1);
  }
}

async function start(gpu = true, duration = 10) {
  await inspect(duration);
  if (gpu) await page.getByRole('radio', { name: 'WebGPU beta' }).check();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Transcribe recording', exact: true }).click();
  // A retry may create a fresh inspector before loading the model.
  const inspecting = await page.evaluate(() => (window as any).workers.findLast((w: any) => !w.dead && w.kind === 'media')?.requests.at(-1)?.type === 'inspect');
  if (inspecting) await reply('media', { type: 'inspected', media: { duration, tracks: [], format: 'WAV' } });
  await waitRequest('asr', 'load');
}

async function ready() {
  await reply('asr', { type: 'ready', backend: 'webgpu', model: 'english', revision: 'fixture' });
  await waitRequest('media', 'decode');
}

async function decoded(blockIndex = 0) {
  await page.evaluate((blockIndex) => {
    const worker = (window as any).workers.findLast((w: any) => w.kind === 'media' && !w.dead);
    const block = worker.requests.at(-1).block;
    const frames = Math.round(block.end * 16000) - Math.round(block.start * 16000);
    worker.reply({ type: 'decoded', blockIndex, audio: new Float32Array(frames).buffer, sampleRate: 16000 });
  }, blockIndex);
  await waitRequest('asr', 'transcribe');
}

async function snapshot() {
  return page.evaluate(() => ({
    workers: (window as any).workers.length,
    live: (window as any).workers.filter((w: any) => !w.dead).length,
    status: document.querySelector('#transcriber-job-heading')?.textContent,
    backend: (document.querySelector('input[name="transcriber-backend"]:checked') as HTMLInputElement)?.parentElement?.textContent,
    text: [...document.querySelectorAll('textarea')].map((node) => node.value),
  }));
}

describe('TR-02 actual React worker lifecycle, synthetic workers', () => {
  it.each([false, true, undefined])('explains undecodable audio when native decoder availability is %s', async nativeAudioDecoderAvailable => {
    await mount();
    await page.getByLabel('Choose audio or video file').setInputFiles({ name: 'synthetic.mp3', mimeType: 'audio/mpeg', buffer: Buffer.from([0]) });
    await reply('media', { type: 'inspected', media: {
      duration: 10, format: 'MP3', nativeAudioDecoderAvailable,
      tracks: [{ number: 1, id: 1, canDecode: false, name: 'Synthetic', language: 'eng', codec: 'mp3', channels: 1, sampleRate: 16000 }],
    } });
    const missingDecoder = nativeAudioDecoderAvailable === false;
    await browserExpect(page.getByRole('heading', { name: missingDecoder ? 'Audio decoding unavailable' : 'Audio codec not supported', exact: true })).toBeVisible({ timeout: 2000 });
    await browserExpect(page.getByText(missingDecoder
      ? 'This browser is missing the audio-decoding support this file needs. Try a current desktop version of Chrome or Edge.'
      : 'This browser cannot decode any audio track in the file. Convert it to MP3 or WAV and try again.', { exact: true })).toBeVisible();
    if (missingDecoder) await browserExpect(page.getByText('Convert it to MP3 or WAV', { exact: false })).toHaveCount(0);
    await browserExpect(page.getByRole('button', { name: 'Transcribe recording', exact: true })).toBeDisabled();
    expect(await page.evaluate(() => (window as any).workers.map((worker: any) => ({ kind: worker.kind, dead: worker.dead })))).toEqual([{ kind: 'media', dead: true }]);
  });

  it('allows decodable audio even without the native decoder API', async () => {
    await mount();
    await page.getByLabel('Choose audio or video file').setInputFiles({ name: 'synthetic.wav', mimeType: 'audio/wav', buffer: Buffer.from([0]) });
    await reply('media', { type: 'inspected', media: {
      duration: 10, format: 'WAV', nativeAudioDecoderAvailable: false,
      tracks: [{ number: 1, id: 1, canDecode: true, name: 'Synthetic', language: 'eng', codec: 'pcm', channels: 1, sampleRate: 16000 }],
    } });
    await browserExpect(page.getByRole('heading', { name: 'Recording inspected and ready', exact: true })).toBeVisible();
    await page.getByRole('checkbox').check();
    await browserExpect(page.getByRole('button', { name: 'Transcribe recording', exact: true })).toBeEnabled();
    expect(await page.evaluate(() => (window as any).workers.map((worker: any) => ({ kind: worker.kind, dead: worker.dead })))).toEqual([{ kind: 'media', dead: true }]);
  });

  for (const stage of ['download', 'decode', 'inference', 'fallback'] as const) {
    for (const action of ['stop', 'reset', 'replace', 'unmount'] as const) {
      it(`${action} during ${stage} leaves no old workers, fallback or stale updates`, async () => {
        await mount();
        await start();
        if (stage === 'decode' || stage === 'inference') await ready();
        if (stage === 'inference') await decoded();
        if (stage === 'fallback') {
          await reply('asr', { type: 'error', stage: 'load', message: 'Synthetic GPU failure' });
          await page.waitForFunction(() => (window as any).workers.filter((w: any) => w.kind === 'asr').length === 2);
        }
        const count = (await snapshot()).workers;
        if (action === 'stop') await page.getByRole('button', { name: 'Stop and keep partial text' }).click();
        if (action === 'reset') await page.getByRole('button', { name: 'Reset', exact: true }).click();
        if (action === 'unmount') await page.evaluate(() => (window as any).unmount());
        if (action === 'replace') await page.getByLabel('Choose audio or video file').setInputFiles({ name: 'replacement.wav', mimeType: 'audio/wav', buffer: Buffer.from([0]) });
        const stopped = await snapshot();
        expect(stopped.workers).toBe(count + (action === 'replace' ? 1 : 0));
        expect(stopped.live).toBe(action === 'replace' ? 1 : 0);
        await page.evaluate((oldCount) => {
          for (const worker of (window as any).workers.slice(0, oldCount)) {
            worker.reply({ type: 'load-progress', progress: 99, message: 'STALE' });
            worker.reply({ type: 'error', stage: 'load', message: 'STALE' });
            worker.reply({ type: 'transcribed', blockIndex: 0, segments: [{ start: 0, end: 1, text: 'STALE' }] });
          }
        }, count);
        expect(await snapshot()).toEqual(stopped);
      });
    }
  }

  it('a resolved inference followed by reset in the same turn cannot publish a stale transcript', async () => {
    await mount(); await start(); await ready(); await decoded();
    await page.evaluate(() => {
      (window as any).workers.findLast((w: any) => w.kind === 'asr').reply({ type: 'transcribed', blockIndex: 0, segments: [{ start: 0, end: 1, text: 'STALE' }] });
      [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Reset')!.click();
    });
    await browserExpect(page.getByRole('heading', { name: 'Choose a recording to inspect' })).toBeVisible();
    expect((await snapshot()).text).toEqual([]);
    expect((await snapshot()).live).toBe(0);
  });

  it('invalid replacement also cancels the active operation', async () => {
    await mount(); await start();
    await page.getByLabel('Choose audio or video file').setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from([0]) });
    expect((await snapshot()).live).toBe(0);
  });

  it('resolved inspection followed by reset cannot create a speech worker or restore media', async () => {
    await mount();
    await page.getByLabel('Choose audio or video file').setInputFiles({ name: 'synthetic.wav', mimeType: 'audio/wav', buffer: Buffer.from([0]) });
    await page.evaluate(() => {
      (window as any).workers[0].reply({ type: 'inspected', media: { duration: 10, format: 'WAV', tracks: [{ number: 1, canDecode: true }] } });
      [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Reset')!.click();
    });
    await browserExpect(page.getByRole('heading', { name: 'Choose a recording to inspect' })).toBeVisible();
    expect((await snapshot()).workers).toBe(1);
    expect((await snapshot()).live).toBe(0);
    await browserExpect(page.getByRole('button', { name: 'Transcribe recording', exact: true })).toBeDisabled();
  });

  it('model no-progress timeout unloads workers without falling back and offers retry', async () => {
    await page.clock.install();
    await mount(); await start();
    const count = (await snapshot()).workers;
    await page.clock.fastForward(120_000);
    await browserExpect(page.getByRole('alert')).toContainText('no new progress');
    await browserExpect(page.getByRole('alert')).toContainText('Check your connection and retry. Shortening the recording does not reduce the model download.');
    await browserExpect(page.getByRole('alert')).not.toContainText('use a shorter recording');
    expect((await snapshot()).workers).toBe(count);
    expect((await snapshot()).live).toBe(0);
    await browserExpect(page.getByRole('button', { name: 'Retry remaining sections' })).toBeEnabled();
  });

  it('inference no-progress timeout also cannot spawn a WASM fallback', async () => {
    await page.clock.install();
    await mount(); await start(); await ready(); await decoded();
    const count = (await snapshot()).workers;
    await page.clock.fastForward(300_000);
    await browserExpect(page.getByRole('alert')).toContainText('no new progress');
    expect((await snapshot()).workers).toBe(count);
    expect((await snapshot()).live).toBe(0);
  });

  it('a GPU error followed by Stop in the same event turn never creates the fallback worker', async () => {
    await mount(); await start();
    const count = (await snapshot()).workers;
    await page.evaluate(() => {
      (window as any).workers.findLast((w: any) => w.kind === 'asr').reply({ type: 'error', stage: 'load', message: 'Synthetic GPU failure' });
      [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Stop and keep partial text')!.click();
    });
    await browserExpect(page.getByRole('heading', { name: 'Transcription stopped', exact: true })).toBeVisible();
    expect((await snapshot()).workers).toBe(count);
    expect((await snapshot()).live).toBe(0);
  });

  it('replacement during a busy phase resets the elapsed clock as well as the operation', async () => {
    await page.clock.install();
    await mount(); await start();
    await page.clock.fastForward(30_000);
    await page.getByLabel('Choose audio or video file').setInputFiles({ name: 'replacement.wav', mimeType: 'audio/wav', buffer: Buffer.from([0]) });
    await page.clock.fastForward(1000);
    await browserExpect(page.locator('.browser-transcriber__job-meta')).toContainText('0:01 elapsed');
  });

  it('inference timeout retains edited completed blocks and retry starts only at the failed block', async () => {
    await page.clock.install();
    await mount(); await start(false, 590); await ready(); await decoded();
    await reply('asr', { type: 'transcribed', blockIndex: 0, segments: [{ start: 0, end: 2, text: 'Completed synthetic section' }] });
    await page.waitForFunction(() => (window as any).workers.findLast((w: any) => w.kind === 'media' && !w.dead)?.requests.at(-1)?.block?.index === 1);
    await decoded(1);
    await page.clock.fastForward(300_000);
    await browserExpect(page.getByRole('heading', { name: 'Transcription stopped with a partial result' })).toBeVisible();
    expect((await snapshot()).live).toBe(0);
    const edited = '\n  Edited completed section\n\n';
    await page.getByLabel('Caption 1', { exact: true }).fill(edited);
    await page.getByRole('button', { name: 'Retry remaining sections' }).click();
    await waitRequest('media', 'inspect');
    expect((await snapshot()).text).toEqual([edited]);
    await reply('media', { type: 'inspected', media: { duration: 590, tracks: [], format: 'WAV' } });
    await waitRequest('asr', 'load'); await ready();
    expect(await page.evaluate(() => (window as any).workers.findLast((w: any) => w.kind === 'media').requests.at(-1).block.index)).toBe(1);
    await decoded(1);
    await reply('asr', { type: 'transcribed', blockIndex: 1, segments: [{ start: 300, end: 302, text: 'Retried synthetic section' }] });
    await browserExpect(page.getByRole('heading', { name: 'Transcript ready for review' })).toBeVisible();
    expect((await snapshot()).text).toEqual([edited, 'Retried synthetic section']);
    expect((await snapshot()).live).toBe(0);
  });

  it('a non-abort GPU inference error retries this block exactly once with WASM', async () => {
    await mount(); await start(); await ready(); await decoded();
    await reply('asr', { type: 'error', stage: 'transcribe', message: 'Synthetic GPU failure' });
    await page.waitForFunction(() => (window as any).workers.filter((w: any) => w.kind === 'asr').length === 2);
    await ready(); await decoded();
    await reply('asr', { type: 'error', stage: 'transcribe', message: 'Synthetic WASM failure' });
    await browserExpect(page.getByRole('alert')).toHaveText('Synthetic WASM failure');
    expect(await page.evaluate(() => (window as any).workers.filter((w: any) => w.kind === 'asr').map((w: any) => w.requests[0].backend))).toEqual(['webgpu', 'wasm']);
    expect((await snapshot()).live).toBe(0);
  });

  for (const interruption of ['failure', 'Stop'] as const) {
    for (const edited of ['\n  We approved fifteen.\n\n', '']) {
      it(`IJ-TR-01 ${interruption} recovery preserves ${edited ? 'corrected' : 'deleted'} overlap and later repeated speech`, async () => {
        await mount(); await start(false, 590); await ready(); await decoded();
        const overlap = { start: 295, end: 300, text: 'We approved fifty.' };
        await reply('asr', { type: 'transcribed', blockIndex: 0, segments: [overlap] });
        await page.waitForFunction(() => (window as any).workers.findLast((w: any) => w.kind === 'media' && !w.dead)?.requests.at(-1)?.block?.index === 1);
        await decoded(1);
        if (interruption === 'failure') {
          await reply('asr', { type: 'error', stage: 'transcribe', message: 'Synthetic failure' });
          await browserExpect(page.getByRole('alert')).toHaveText('Synthetic failure');
        } else {
          await page.getByRole('button', { name: 'Stop and keep partial text' }).click();
        }
        expect((await snapshot()).live).toBe(0);
        await page.getByLabel('Caption 1', { exact: true }).fill(edited);
        await page.getByRole('button', { name: 'Retry remaining sections' }).click();
        await waitRequest('media', 'inspect');
        expect((await snapshot()).text).toEqual([edited]);
        await reply('media', { type: 'inspected', media: { duration: 590, tracks: [], format: 'WAV' } });
        await waitRequest('asr', 'load'); await ready();
        expect(await page.evaluate(() => (window as any).workers.findLast((w: any) => w.kind === 'media').requests.at(-1).block.index)).toBe(1);
        await decoded(1);
        await reply('asr', { type: 'transcribed', blockIndex: 1, segments: [
          overlap, { start: 300, end: 305, text: 'Continue here.' },
          { start: 310, end: 315, text: overlap.text },
        ] });
        await browserExpect(page.getByRole('heading', { name: 'Transcript ready for review' })).toBeVisible();
        expect((await snapshot()).text).toEqual([edited, 'Continue here.', overlap.text]);
        expect((await snapshot()).live).toBe(0);
      });
    }
  }

  for (const stage of ['load', 'transcribe'] as const) {
    for (const name of ['AbortError', 'TimeoutError'] as const) {
      it(`IJ-TR-02 actual worker ${name} during ${stage} settles without GPU fallback`, async () => {
        await mount({ stage, name }); await start();
        if (stage === 'transcribe') {
          await deliverNativeAsrReply(); await waitRequest('media', 'decode'); await decoded();
        }
        const count = (await snapshot()).workers;
        const event = await deliverNativeAsrReply();
        expect((await snapshot()).workers).toBe(count);
        expect(event).toMatchObject({ type: 'error', stage, name });
        await browserExpect(page.locator('.browser-transcriber__phase')).toHaveText(name === 'AbortError' ? 'cancelled' : 'error');
        expect(JSON.stringify(event)).not.toContain('Private synthetic error detail');
        expect((await snapshot()).live).toBe(0);
        expect((await snapshot()).backend).toContain('WebGPU beta');
        await browserExpect(page.getByRole('button', { name: 'Retry remaining sections' })).toBeEnabled();
      });
    }

    it(`IJ-TR-02 actual worker ordinary GPU ${stage} error retries exactly once and completes`, async () => {
      await mount({ stage, name: 'Error' }); await start();
      if (stage === 'transcribe') {
        await deliverNativeAsrReply(); await waitRequest('media', 'decode'); await decoded();
      }
      await deliverNativeAsrReply();
      await page.waitForFunction(() => (window as any).workers.filter((w: any) => w.kind === 'asr').length === 2);
      await deliverNativeAsrReply(); await waitRequest('media', 'decode'); await decoded();
      await deliverNativeAsrReply();
      await browserExpect(page.getByRole('heading', { name: 'Transcript ready for review' })).toBeVisible();
      expect(await page.evaluate(() => (window as any).workers.filter((w: any) => w.kind === 'asr').map((w: any) => w.requests[0].backend))).toEqual(['webgpu', 'wasm']);
      expect((await snapshot()).text).toEqual(['Synthetic success']);
      expect((await snapshot()).live).toBe(0);
    });
  }
});

describe('word-aligned component checkpoints', () => {
  it('orders conflicting captions visually and on download while edits retain their source identity', async () => {
    const asCaption = (text: string, start: number, end: number) => ({ start, end, text, words: [{ text, start, end }] });
    await mount(); await start(false, 595); await ready(); await decoded();
    await reply('asr', { type: 'transcribed', blockIndex: 0, segments: [asCaption('Yes.', 298.58, 299.98)] });
    await waitRequest('media', 'decode'); await decoded(1);
    await reply('asr', { type: 'transcribed', blockIndex: 1, segments: [asCaption('Yeah.', 298.46, 301.26)] });
    await browserExpect(page.getByRole('heading', { name: 'Transcript ready for review' })).toBeVisible();
    expect((await snapshot()).text).toEqual(['Yeah.', 'Yes.']);
    await browserExpect(page.getByText('Overlap needs review.', { exact: false })).toBeVisible();
    await page.getByLabel('Caption 1', { exact: true }).fill('Earlier correction.');
    await page.getByLabel('Caption 2', { exact: true }).fill('Later correction.');
    expect((await snapshot()).text).toEqual(['Earlier correction.', 'Later correction.']);
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
      configurable: true, value: { writeText: async (text: string) => { (window as any).copiedText = text; } },
    }));
    await page.getByRole('button', { name: 'Copy text', exact: true }).click();
    expect(await page.evaluate(() => (window as any).copiedText)).toBe('Earlier correction.\n\nLater correction.');
    const downloading = page.waitForEvent('download');
    await page.getByRole('button', { name: 'WebVTT', exact: true }).click();
    const stream = await (await downloading).createReadStream();
    if (!stream) throw new Error('Missing actual VTT download');
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    const vtt = Buffer.concat(chunks).toString('utf8');
    expect(vtt).toContain('00:04:58.460 --> 00:05:01.260\nEarlier correction.');
    expect(vtt).toContain('00:04:58.580 --> 00:04:59.980\nLater correction.');
    expect(vtt.indexOf('Earlier correction.')).toBeLessThan(vtt.indexOf('Later correction.'));
    expect((await snapshot()).live).toBe(0);
    if (coreFixProof) {
      mkdirSync(coreFixProof, { recursive: true });
      await page.locator('.browser-transcriber__results').screenshot({ path: resolve(coreFixProof, 'aligned-conflict-order.png') });
    }
  });
  for (const interruption of ['none', 'failure', 'stop'] as const) for (const edited of ['Corrected first answer.', '']) {
    it(`keeps three aligned source utterances through ${interruption} without restoring an edited caption: ${edited || 'deleted'}`, async () => {
      // Captured from the pinned English decoder on synthetic two-Yes windows.
      // The CJK and coarse-ambiguity cases below remain separate synthetic proof.
      const chunks = [{ text: ' Yes.', timestamp: [3.46, 6.26] }, { text: ' Yes.', timestamp: [8.58, 9.98] }];
      const first = buildWordAlignedSegments(chunks, { start: 290, end: 300 }, ' Yes. Yes.');
      const second = buildWordAlignedSegments(chunks, { start: 295, end: 305 }, ' Yes. Yes.');
      await mount(); await start(false, 595); await ready(); await decoded();
      await reply('asr', { type: 'transcribed', blockIndex: 0, segments: first });
      await waitRequest('media', 'decode'); await decoded(1);
      if (interruption !== 'none') {
        if (interruption === 'failure') await reply('asr', { type: 'error', stage: 'transcribe', message: 'Synthetic checkpoint failure' });
        else await page.getByRole('button', { name: 'Stop and keep partial text' }).click();
        await browserExpect(page.getByRole('button', { name: 'Retry remaining sections' })).toBeEnabled();
        await page.getByLabel('Caption 1', { exact: true }).fill(edited);
        await page.getByRole('button', { name: 'Retry remaining sections' }).click();
        await waitRequest('media', 'inspect');
        await reply('media', { type: 'inspected', media: { duration: 595, tracks: [], format: 'WAV' } });
        await waitRequest('asr', 'load'); await ready(); await decoded(1);
      }
      await reply('asr', { type: 'transcribed', blockIndex: 1, segments: second });
      await browserExpect(page.getByRole('heading', { name: 'Transcript ready for review' })).toBeVisible();
      const expected = [interruption === 'none' ? 'Yes.' : edited, 'Yes.', 'Yes.'];
      expect((await snapshot()).text).toEqual(expected);
      await browserExpect(page.getByText('Overlap needs review.', { exact: false })).toHaveCount(0);
      expect((await snapshot()).live).toBe(0);
      const downloading = page.waitForEvent('download');
      await page.getByRole('button', { name: 'TXT', exact: true }).click();
      const stream = await (await downloading).createReadStream();
      if (!stream) throw new Error('Missing actual TXT download');
      const bytes: Buffer[] = [];
      for await (const chunk of stream) bytes.push(Buffer.from(chunk));
      expect(Buffer.concat(bytes).toString('utf8')).toBe(`${expected.join('\n\n')}\n`);
    });
  }
});

describe('CJ-TR01-01 actual two-block result and checkpoint flow', () => {
  for (const [name, word, separator] of [
    ['english', 'Yes.', ' '], ['spaced-cjk', '\u662f\u7684\u3002', ' '], ['unspaced-cjk', '\u662f\u7684\u3002', ''],
  ]) for (const retry of [false, true]) for (const suffix of ['', ' Continue.']) {
    it(`keeps uncertain grouped ${name} ${suffix ? 'prefix' : 'exact'} through ${retry ? 'checkpoint retry' : 'two blocks'}`, async () => {
      await page.setViewportSize({ width: name === 'english' ? 1280 : 390, height: 960 });
      await mount(); await start(false, 595); await ready(); await decoded();
      const first = `${word}${separator}${word}`;
      await reply('asr', { type: 'transcribed', blockIndex: 0, segments: [{ start: 293, end: 299, text: first }] });
      await waitRequest('media', 'decode'); await decoded(1);
      let edited = first;
      if (retry) {
        await reply('asr', { type: 'error', stage: 'transcribe', message: 'Synthetic checkpoint failure' });
        await browserExpect(page.getByRole('heading', { name: 'Transcription stopped with a partial result' })).toBeVisible();
        expect((await snapshot()).live).toBe(0);
        edited = `${first} [edited]`;
        await page.getByLabel('Caption 1', { exact: true }).fill(edited);
        await page.getByRole('button', { name: 'Retry remaining sections' }).click();
        await waitRequest('media', 'inspect');
        await reply('media', { type: 'inspected', media: { duration: 595, tracks: [], format: 'WAV' } });
        await waitRequest('asr', 'load'); await ready();
        expect(await page.evaluate(() => (window as any).workers.findLast((w: any) => w.kind === 'media').requests.at(-1).block.index)).toBe(1);
        await decoded(1);
      }
      await reply('asr', { type: 'transcribed', blockIndex: 1, segments: [{ start: 298, end: suffix ? 306 : 304, text: `${first}${suffix}` }] });
      await browserExpect(page.getByRole('heading', { name: 'Transcript ready for review' })).toBeVisible();
      expect((await snapshot()).text).toEqual([edited, `${first}${suffix}`]);
      expect((await snapshot()).text.join(' ').split(word).length - 1).toBe(4);
      await browserExpect(page.getByText('Overlap needs review. Text was kept because the timing is uncertain.', { exact: true })).toBeVisible();
      expect(await page.getByLabel('Caption 2', { exact: true }).getAttribute('aria-describedby')).toBe('transcript-overlap-1');
      await browserExpect(page.getByRole('button', { name: 'Play from 4:58', exact: true })).toBeVisible();
      expect((await snapshot()).live).toBe(0);
      if (coreFixProof) {
        mkdirSync(coreFixProof, { recursive: true });
        const id = `${name}-${retry ? 'retry' : 'direct'}-${suffix ? 'prefix' : 'exact'}`;
        writeFileSync(resolve(coreFixProof, `${id}.json`), JSON.stringify({ fixture: { first: { start: 293, end: 299, text: first },
          incoming: { start: 298, end: suffix ? 306 : 304, text: `${first}${suffix}` } }, result: await snapshot(),
          expectedSourceUtterances: 3, retainedOccurrences: 4, exactAlignmentClaimed: false }, null, 2));
        await page.locator('.browser-transcriber__results').screenshot({ path: resolve(coreFixProof, `${id}.png`) });
      }
    });
  }

  for (const word of ['Yes.', '\u662f\u7684\u3002']) for (const retry of [false, true]) {
    it(`keeps exactly three occurrences when shared ${word} has its own timed cue, retry=${retry}`, async () => {
      await mount(); await start(false, 595); await ready(); await decoded();
      const first = { start: 293, end: 294, text: word };
      const shared = { start: 298, end: 299, text: word };
      await reply('asr', { type: 'transcribed', blockIndex: 0, segments: [first, shared] });
      await waitRequest('media', 'decode'); await decoded(1);
      if (retry) {
        await page.getByRole('button', { name: 'Stop and keep partial text' }).click();
        expect((await snapshot()).live).toBe(0);
        await page.getByRole('button', { name: 'Retry remaining sections' }).click();
        await waitRequest('media', 'inspect');
        await reply('media', { type: 'inspected', media: { duration: 595, tracks: [], format: 'WAV' } });
        await waitRequest('asr', 'load'); await ready(); await decoded(1);
      }
      await reply('asr', { type: 'transcribed', blockIndex: 1, segments: [shared, { start: 303, end: 304, text: word }] });
      await browserExpect(page.getByRole('heading', { name: 'Transcript ready for review' })).toBeVisible();
      expect((await snapshot()).text).toEqual([word, word, word]);
      await browserExpect(page.getByText('Overlap needs review.', { exact: false })).toHaveCount(0);
      expect((await snapshot()).live).toBe(0);
      if (coreFixProof) writeFileSync(resolve(coreFixProof, `timed-${word === 'Yes.' ? 'english' : 'cjk'}-${retry}.json`),
        JSON.stringify({ result: await snapshot(), expectedSourceUtterances: 3, retainedOccurrences: 3, sharedCue: shared }, null, 2));
    });
  }
});

// Independent test-side SRT importer: cue boundaries/times are parsed without
// calling any production formatter or decoder; HTML entities use the browser.
function importSrt(source: string) {
  const blocks = source.replace(/\r\n?/g, '\n').trimEnd().split(/\n\n/);
  const time = (value: string) => {
    const m = /^(\d+):(\d{2}):(\d{2}),(\d{3})$/.exec(value);
    if (!m) throw new Error('Invalid SRT time');
    return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / 1000;
  };
  return blocks.map((block, index) => {
    const [id, timing, ...lines] = block.split('\n');
    if (id !== String(index + 1)) throw new Error('Invalid SRT cue boundary');
    const parts = timing.split(' --> ');
    if (parts.length !== 2) throw new Error('Invalid SRT timing');
    return { start: time(parts[0]), end: time(parts[1]), markup: lines.join('\n') };
  });
}

describe('TR-02 independent subtitle imports', () => {
  const text = '\n  <b>literal</b> & &lt; <00:00:01.000>\n\n2\n00:00:02.000 --> 00:00:03.000\n\nNOTE\nSTYLE\n\u0645\u0631\u062d\u0628\u0627 \u05e9\u05dc\u05d5\u05dd\n\n';
  const segments = [{ start: 1.125, end: 4.875, text }, { start: 5, end: 6, text: 'next > last' }];

  it('CR-TR02-02 actual edited multi-cue downloads retain wide literal text and bounded SRT lines', async () => {
    const ascii = 'x'.repeat(4096);
    const texts = [
      '&'.repeat(292), ascii,
      '<b>literal</b> &amp; \u0645\u0631\u062d\u0628\u0627 \u662f\u7684\ud83d\ude42 '.repeat(160),
      '\n  ' + ascii + '  \n\n2\n00:00:02.000 --> 00:00:03.000\n\n',
      '<font></font>&lt; <b>'.repeat(220),
    ];
    const expected = texts.map((text, index) => ({ start: index * 2, end: index * 2 + 1, text }));
    await mount(); await start(false, 10); await ready(); await decoded();
    await reply('asr', { type: 'transcribed', blockIndex: 0,
      segments: expected.map(segment => ({ ...segment, text: 'Synthetic caption' })) });
    await browserExpect(page.getByRole('heading', { name: 'Transcript ready for review' })).toBeVisible();
    for (const [index, text] of texts.entries()) await page.getByLabel(`Caption ${index + 1}`, { exact: true }).fill(text);
    expect((await snapshot()).text).toEqual(texts);
    expect((await snapshot()).live).toBe(0);
    const downloads: Record<string, string> = {};
    for (const format of ['srt', 'vtt', 'txt']) {
      const downloading = page.waitForEvent('download');
      await page.getByRole('button', { name: format === 'vtt' ? 'WebVTT' : format.toUpperCase(), exact: true }).click();
      const download = await downloading;
      const stream = await download.createReadStream();
      if (!stream) throw new Error('Missing actual download stream');
      const chunks: Buffer[] = [];
      for await (const chunk of stream) chunks.push(Buffer.from(chunk));
      downloads[format] = Buffer.concat(chunks).toString('utf8');
    }
    const proof = process.env.TRANSCRIBER_SRT_PROOF;
    if (proof) {
      mkdirSync(proof, { recursive: true });
      for (const [format, source] of Object.entries(downloads)) writeFileSync(resolve(proof, `mounted-wide.${format}`), source);
      writeFileSync(resolve(proof, 'mounted-wide.json'), JSON.stringify({ segments: expected, result: await snapshot(),
        source: 'Actual mounted component download events after editing five captions' }, null, 2));
      await page.screenshot({ path: resolve(proof, 'mounted-wide.png'), fullPage: true });
    }
    for (const line of downloads.srt.split('\n')) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(1000);
    const imported = await page.evaluate(cues => cues.map(({ markup, ...times }) => ({
      ...times, text: new DOMParser().parseFromString(markup, 'text/html').body.textContent,
    })), importSrt(downloads.srt));
    expect(imported).toEqual(expected);
    expect(downloads.txt).toBe(`${texts.join('\n\n')}\n`);
    expect(downloads.vtt).toBe(createTranscriptDownloads(expected).vtt);
  });

  it('TXT preserves original editable text, including CRLF and whitespace', () => {
    const original = '  <b>& literal\r\n\r\ntext --> \n';
    expect(createTranscriptDownloads([{ start: 0, end: 1, text: original }]).txt).toBe(`${original}\n`);
  });

  it('SRT imports literal tags/entities, blank lines, timestamps and RTL without extra cues', async () => {
    const cues = importSrt(createTranscriptDownloads(segments).srt);
    const imported = await page.evaluate((cues) => cues.map(({ markup, ...times }) => ({ ...times, text: new DOMParser().parseFromString(markup, 'text/html').body.textContent })), cues);
    expect(imported).toEqual(segments);
  });

  it('native WebVTT text track imports synthetic captions with exact literal text and times', async () => {
    const imported = await page.evaluate(async (source) => {
      const video = document.createElement('video');
      const track = document.createElement('track');
      const url = URL.createObjectURL(new Blob([source], { type: 'text/vtt' }));
      document.body.append(video);
      video.append(track);
      track.track.mode = 'hidden';
      try {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('Native VTT import timed out')), 3000);
          track.onload = () => { clearTimeout(timer); resolve(); };
          track.onerror = () => { clearTimeout(timer); reject(new Error('Native VTT import failed')); };
          track.src = url;
        });
        return Array.from(track.track.cues ?? []).map((item) => {
          const cue = item as VTTCue;
          return { start: cue.startTime, end: cue.endTime, text: cue.getCueAsHTML().textContent };
        });
      } finally { video.remove(); URL.revokeObjectURL(url); }
    }, createTranscriptDownloads(segments).vtt);
    expect(imported).toEqual(segments);
  });
});
