import { describe, expect, it } from 'vitest';
import { classifyTranscriberRequest, installResourceProof, matchSyntheticSpeech, summarizeModelSmoke, summarizeSubtitleProof, validateSyntheticFixtureDuration } from './transcriber-browser-proof.mjs';

describe('optional model smoke evidence', () => {
  const modelUrl = 'https://huggingface.co/onnx-community/whisper-tiny.en_timestamped/resolve/aeaa13760958b03fac5062f457d317d3319c3168/config.json';
  const proof = {
    requested: true,
    model: 'english',
    transcriptCharacters: 70,
    downloads: ['txt', 'srt', 'vtt'].map((extension) => ({ filename: `transcript.${extension}`, bytes: 100 })),
    requests: [modelUrl],
  };
  it('does not claim generation, model choice, or revision verification when skipped', () => {
    expect(summarizeModelSmoke({ ...proof, requested: false })).toEqual({
      status: 'not_run', model: null,
      checks: { modelSmokeCompleted: null, modelRequestsUsePinnedRevision: null },
    });
  });
  it('accepts observed short inference, all three downloads, and a selected pinned model request', () => {
    expect(summarizeModelSmoke(proof).status).toBe('pass');
  });
  it.each([0, NaN, -1, undefined])('requires non-empty transcript evidence: %s', (transcriptCharacters) => {
    expect(summarizeModelSmoke({ ...proof, transcriptCharacters }).status).toBe('fail');
  });
  it.each([
    [],
    [{ filename: 'transcript.txt', bytes: 1 }],
    ['txt', 'srt', 'srt'].map((extension) => ({ filename: `transcript.${extension}`, bytes: 100 })),
    ['txt', 'srt', 'vtt'].map((extension) => ({ filename: `transcript.${extension}`, bytes: 0 })),
  ].map((downloads) => ({ downloads })))('requires distinct, non-empty TXT/SRT/VTT exports', ({ downloads }) => {
    expect(summarizeModelSmoke({ ...proof, downloads }).status).toBe('fail');
  });
  it.each([
    [],
    ['http://127.0.0.1/runtime.wasm'],
    [modelUrl.replace('aeaa13760958b03fac5062f457d317d3319c3168', 'main')],
    [modelUrl, modelUrl.replace('aeaa13760958b03fac5062f457d317d3319c3168', 'main')],
  ].map((requests) => ({ requests })))('does not infer pinned downloads from empty or mismatched requests', ({ requests }) => {
    expect(summarizeModelSmoke({ ...proof, requests }).checks.modelRequestsUsePinnedRevision).toBe(false);
  });
  it('does not accept the English pin as evidence for the multilingual model', () => {
    expect(summarizeModelSmoke({ ...proof, model: 'multilingual' }).status).toBe('fail');
  });
  it('accepts the multilingual model only with its own pinned request', () => {
    const requests = [modelUrl.replace('whisper-tiny.en_timestamped', 'whisper-tiny_timestamped')
      .replace('aeaa13760958b03fac5062f457d317d3319c3168', '517244293732ee2d58139af5814231b7e6830a0d')];
    expect(summarizeModelSmoke({ ...proof, model: 'multilingual', requests }).status).toBe('pass');
  });
});

describe('nominal one-hour fixture preflight', () => {
  it.each(['hour-mp3', 'hour-mp4'])('requires exactly one hour of probed duration for %s', (name) => {
    expect(validateSyntheticFixtureDuration(name, 3600)).toBe(true);
    expect(validateSyntheticFixtureDuration(name, 3600.072)).toBe(false);
    expect(validateSyntheticFixtureDuration(name, 3599)).toBe(false);
    expect(validateSyntheticFixtureDuration(name, 900)).toBe(false);
  });
  it.each([NaN, Infinity, -1, 0, '3600', null])('rejects invalid duration %s', (duration) => {
    expect(validateSyntheticFixtureDuration('hour-mp3', duration)).toBe(false);
  });
  it('keeps the small diagnostic separate from an hour acceptance fixture', () => {
    expect(validateSyntheticFixtureDuration('short', 5.544)).toBe(true);
    expect(validateSyntheticFixtureDuration('short', 3600)).toBe(false);
    expect(validateSyntheticFixtureDuration('unknown', 3600)).toBe(false);
  });
});

const origin = 'http://127.0.0.1:4321';
const secret = 'tr03-private-sentinel';
const model = 'https://huggingface.co/onnx-community/whisper-tiny.en_timestamped/resolve/aeaa13760958b03fac5062f457d317d3319c3168/config.json';
const staticPaths = new Set(['/_astro/app.js', '/tool-art/audio-video-transcriber-tool.webp']);
const check = (request, started = true) => classifyTranscriberRequest(request, { origin, started, sentinels: [secret], staticPaths });

describe('browser transcriber network proof', () => {
  it('allows local static reads, but no remote model before action', () => {
    expect(check({ url: `${origin}/_astro/app.js`, method: 'GET' }, false)).toBe('local');
    expect(check({ url: model, method: 'GET' }, false)).toBe('blocked-before-start');
    expect(check({ url: model, method: 'GET' })).toBe('model');
  });
  it('allows only the site artwork cache-busting parameter', () => {
    expect(check({ url: `${origin}/tool-art/audio-video-transcriber-tool.webp?v=d9b368c`, method: 'GET' })).toBe('local');
    expect(check({ url: `${origin}/tool-art/audio-video-transcriber-tool.webp?v=unknown-user-data`, method: 'GET' })).toBe('blocked-query');
  });
  it('distinguishes a blocked machine-filter request from a model download', () => {
    expect(check({ url: 'https://local.adguard.org/injected.js', method: 'GET' }, false)).toBe('blocked-environment');
    expect(check({ url: 'https://example.com/injected.js', method: 'GET' }, false)).toBe('blocked-origin');
    expect(check({ url: 'http://local.adguard.org/injected.js', method: 'GET' }, false)).toBe('blocked-environment');
  });
  it('requires HTTPS and no embedded credentials on model hosts', () => {
    expect(check({ url: model.replace('https:', 'http:'), method: 'GET' })).toBe('blocked-url');
    expect(check({ url: model.replace('https://', 'https://user:password@'), method: 'GET' })).toBe('blocked-url');
  });
  it.each([
    { url: `${origin}/collect?value=${secret}`, method: 'GET' },
    { url: `${origin}/collect?value=${encodeURIComponent(secret)}`, method: 'GET' },
    { url: `${origin}/collect`, method: 'POST', body: secret },
    { url: model, method: 'GET', body: secret },
    { url: model, method: 'GET', headers: { 'x-private': secret } },
    { url: `${origin}/collect/${Buffer.from(secret).toString('base64url')}`, method: 'GET' },
  ])('detects private content without returning it', (request) => {
    expect(check(request)).toBe('blocked-private-data');
  });
  it.each(['POST', 'PUT', 'DELETE', 'PATCH'])('blocks %s even when content is not recognized', (method) => {
    expect(check({ url: origin, method, body: 'unknown-user-audio' })).toBe('blocked-method');
  });
  it.each([
    model.replace('aeaa13760958b03fac5062f457d317d3319c3168', 'main'),
    model.replace('config.json', 'unreviewed-file.bin'),
    `${model}?text=unknown`,
    'https://example.com/collect',
    'https://cdn.jsdelivr.net/npm/unpinned@latest/main.js',
    `${origin}/collect?text=unknown`,
    `${origin}/collect/unknown`,
  ])('blocks unapproved fetches', (url) => {
    expect(check({ url, method: 'GET' })).toMatch(/^blocked-/);
  });
  it('permits CDN delivery only with a proven pinned model redirect', () => {
    const url = 'https://cas-bridge.xethub.hf.co/xet-bridge-us/model?signature=synthetic';
    expect(check({ url, method: 'GET' })).toBe('blocked-origin');
    expect(check({ url, method: 'GET', pinnedRedirect: true })).toBe('model');
  });
  it.each(['%broken', '%FF', '%E2%82'])('detects encoded private headers despite malformed escape %s', (malformed) => {
    const encoded = [...secret].map((character) => `%${character.charCodeAt(0).toString(16)}`).join('');
    expect(check({ url: model, method: 'GET', headers: {
      'x-noise': malformed,
      'x-private': encoded,
    } })).toBe('blocked-private-data');
    expect(check({ url: model, method: 'GET', headers: {
      'x-private': `${malformed} ${encoded}`,
    } })).toBe('blocked-private-data');
  });
  it('checks the third decoded representation instead of discarding it', () => {
    const once = [...secret].map((character) => `%${character.charCodeAt(0).toString(16)}`).join('');
    const threeLayers = encodeURIComponent(encodeURIComponent(once));
    expect(check({ url: model, method: 'GET', headers: { 'x-private': threeLayers } })).toBe('blocked-private-data');
  });
  it('allows only the installed ORT artifact version', () => {
    expect(check({ url: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/ort-wasm-simd-threaded.asyncify.wasm', method: 'GET' })).toBe('model');
    expect(check({ url: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@9.0.0/dist/ort-wasm-simd-threaded.asyncify.wasm', method: 'GET' })).toBe('blocked-origin');
  });
});

describe('subtitle validation', () => {
  it('reports counts and monotonic, bounded timing, not transcript text', () => {
    const result = summarizeSubtitleProof('1\n00:00:00,000 --> 00:00:02,500\nprivate text\n\n2\n00:00:03,000 --> 00:00:05,000\nmore text\n', 5.5);
    expect(result).toEqual({ cues: 2, firstStart: 0, lastEnd: 5, valid: true, timingIssues: [], timingIssueCount: 0 });
    expect(JSON.stringify(result)).not.toContain('private');
  });
  it('reports only bounded numeric timing diagnostics for overlapping captions', () => {
    const srt = Array.from({ length: 60 }, (_, index) => `${index + 1}\n00:00:01,000 --> 00:00:03,000\nprivate words`).join('\n\n');
    const result = summarizeSubtitleProof(srt, 2);
    expect(result.valid).toBe(false);
    expect(result.timingIssueCount).toBe(60);
    expect(result.timingIssues).toHaveLength(50);
    expect(result.timingIssues[1]).toEqual({ index: 1, start: 1, end: 3, previousEnd: 3,
      reasons: ['past-duration', 'overlap'] });
    expect(JSON.stringify(result)).not.toContain('private');
  });
  it.each([
    '1\n00:00:03,000 --> 00:00:02,000\ntext',
    '1\n00:00:00,000 --> 00:00:20,000\ntext',
    '1\n00:00:02,000 --> 00:00:04,000\ntext\n\n2\n00:00:01,000 --> 00:00:03,000\ntext',
    '',
    '00:00:00,000 --> 00:00:01,000',
    '1\n00:00:00,000 --> 00:00:01,000\nvalid\n\n2\nbroken\ntext',
    '1\n-00:00:00,000 --> 00:00:01,000\ntext',
    '1\n00:00:00,000 --> 00:00:01,000\n',
  ])('rejects broken or empty timestamps', (srt) => {
    expect(summarizeSubtitleProof(srt, 5.5).valid).toBe(false);
  });
});

it('counts distinct worker termination instead of duplicate calls', () => {
  const target = { Worker: class { terminate() {} }, URL: { createObjectURL: () => 'blob:synthetic', revokeObjectURL() {} } };
  installResourceProof(target);
  const first = new target.Worker();
  const second = new target.Worker();
  first.terminate();
  first.terminate();
  expect(target.__transcriberProof.workersCreated).toBe(2);
  expect(target.__transcriberProof.workersTerminated).toBe(1);
  expect(target.__transcriberProof.liveWorkers.size).toBe(1);
  second.terminate();
  expect(target.__transcriberProof.liveWorkers.size).toBe(0);
});

it('records bounded public model download counts without worker content', () => {
  class FakeWorker {
    listeners = [];
    addEventListener(name, listener) { if (name === 'message') this.listeners.push(listener); }
    emit(data) { for (const listener of this.listeners) listener({ data }); }
    terminate() {}
  }
  const target = { Worker: FakeWorker, URL: { createObjectURL: () => 'blob:synthetic', revokeObjectURL() {} } };
  installResourceProof(target);
  const worker = new target.Worker();
  worker.emit({ type: 'load-progress', message: 'Loading encoder_model_quantized.onnx', current: 120, total: 200, text: secret });
  worker.emit({ type: 'load-progress', message: 'Loading encoder_model_quantized.onnx', current: 20, total: 200 });
  worker.emit({ type: 'load-progress', message: secret, current: 100, total: 200 });
  worker.emit({ type: 'transcribed', message: 'Loading decoder_model_merged_quantized.onnx', current: 100, text: secret });
  expect(target.__transcriberProof.modelDownloads).toEqual({
    'encoder_model_quantized.onnx': { current: 20, max: 120, total: 200 },
  });
  expect(JSON.stringify(target.__transcriberProof.modelDownloads)).not.toContain(secret);
});

it('ignores nonnumeric or out-of-bound download counters', () => {
  class FakeWorker {
    addEventListener(name, listener) { if (name === 'message') this.message = listener; }
    terminate() {}
  }
  const target = { Worker: FakeWorker, URL: { createObjectURL() {}, revokeObjectURL() {} } };
  installResourceProof(target);
  const worker = new target.Worker();
  for (const current of [-1, NaN, Infinity, 2 ** 40, secret]) {
    worker.message({ data: { type: 'load-progress', message: 'Loading encoder_model_quantized.onnx', current, total: 200 } });
  }
  expect(target.__transcriberProof.modelDownloads).toEqual({});
});

it('does not let one broad subtitle prove many separate speech bursts', () => {
  expect(matchSyntheticSpeech([{ start: 0, end: 3600, text: 'synthetic voice' }], 120)).toBe(0);
  const cues = Array.from({ length: 120 }, (_, i) => ({ start: i * 30, end: i * 30 + 5, text: 'Bella voice' }));
  expect(matchSyntheticSpeech(cues, 120)).toBe(120);
  expect(matchSyntheticSpeech(cues.slice(0, 5), 120)).toBe(5);
});
