const repositories = new Map([
  ['whisper-tiny.en_timestamped', 'aeaa13760958b03fac5062f457d317d3319c3168'],
  ['whisper-tiny_timestamped', '517244293732ee2d58139af5814231b7e6830a0d'],
]);
const files = new Set([
  'config.json', 'generation_config.json', 'preprocessor_config.json',
  'tokenizer_config.json', 'tokenizer.json',
  'onnx/encoder_model_quantized.onnx', 'onnx/decoder_model_merged_quantized.onnx',
]);

export function summarizeModelSmoke({ requested, model, transcriptCharacters, downloads, requests }) {
  if (!requested) return {
    status: 'not_run', model: null,
    checks: { modelSmokeCompleted: null, modelRequestsUsePinnedRevision: null },
  };
  const repository = model === 'english' ? 'whisper-tiny.en_timestamped'
    : model === 'multilingual' ? 'whisper-tiny_timestamped' : null;
  const modelRequests = requests.filter((value) => /whisper-tiny/i.test(value));
  const checks = {
    modelSmokeCompleted: Number.isSafeInteger(transcriptCharacters) && transcriptCharacters > 0
      && downloads.length === 3
      && ['txt', 'srt', 'vtt'].every((extension) => downloads.some((download) => (
        download.filename.endsWith(`.${extension}`)
        && Number.isSafeInteger(download.bytes) && download.bytes > 0
      ))),
    modelRequestsUsePinnedRevision: repository !== null && modelRequests.length > 0
      && modelRequests.every((value) => {
        try {
          const url = new URL(value);
          const prefix = `/onnx-community/${repository}/resolve/${repositories.get(repository)}/`;
          return url.origin === 'https://huggingface.co' && !url.username && !url.password
            && !url.search && !url.hash && url.pathname.startsWith(prefix)
            && files.has(url.pathname.slice(prefix.length));
        } catch { return false; }
      }),
  };
  return { status: Object.values(checks).every((value) => value === true) ? 'pass' : 'fail', model, checks };
}

export function validateSyntheticFixtureDuration(name, duration) {
  if (!Number.isFinite(duration) || duration <= 0) return false;
  if (name === 'short') return duration <= 30;
  return (name === 'hour-mp3' || name === 'hour-mp4') && duration === 3600;
}

export function classifyTranscriberRequest(request, { origin, started, sentinels = [], staticPaths = new Set() }) {
  let inspected = `${request.url}\n${request.body ?? ''}\n${JSON.stringify(request.headers ?? {})}`;
  const variants = sentinels.filter(Boolean).flatMap((value) => [value, Buffer.from(value).toString('base64'), Buffer.from(value).toString('base64url')]);
  for (let pass = 0; pass <= 3; pass++) {
    if (variants.some((sentinel) => inspected.includes(sentinel))) return 'blocked-private-data';
    if (pass === 3) break;
    // URLSearchParams tolerates malformed escapes without discarding valid
    // encoded content elsewhere. Preserve literal separators and base64 '+'.
    inspected = new URLSearchParams(`value=${inspected.replaceAll('+', '%2B').replaceAll('&', '%26')}`).get('value');
  }
  if (request.method !== 'GET') return 'blocked-method';
  let url;
  try { url = new URL(request.url); } catch { return 'blocked-url'; }
  if (url.protocol === 'blob:' || url.protocol === 'data:') return 'local';
  if (url.origin === origin) {
    const artworkVersion = /^\/tool-art\/[a-z0-9/-]+\.webp$/.test(url.pathname) && /^\?v=[a-f0-9]{7,64}$/.test(url.search);
    if (url.search && !artworkVersion) return 'blocked-query';
    return staticPaths.has(url.pathname) ? 'local' : 'blocked-path';
  }
  // The installed Windows filter injects this request into branded browsers.
  // Keep blocking it, but do not mislabel it as application model loading.
  if (url.hostname === 'local.adguard.org') return 'blocked-environment';
  if (url.protocol !== 'https:' || url.username || url.password) return 'blocked-url';
  if (url.hostname === 'huggingface.co' && !url.search) {
    for (const [repository, revision] of repositories) {
      const prefix = `/onnx-community/${repository}/resolve/${revision}/`;
      if (url.pathname.startsWith(prefix) && files.has(url.pathname.slice(prefix.length))) return started ? 'model' : 'blocked-before-start';
    }
  }
  if (url.hostname === 'cdn.jsdelivr.net' && !url.search
    && /^\/npm\/onnxruntime-web@1\.27\.0\/dist\/ort-wasm-simd-threaded\.asyncify\.(wasm|mjs)$/.test(url.pathname)) return started ? 'model' : 'blocked-before-start';
  if (request.pinnedRedirect && (url.hostname === 'huggingface.co'
    || url.hostname === 'hf.co' || url.hostname.endsWith('.hf.co'))) return started ? 'model' : 'blocked-before-start';
  return 'blocked-origin';
}

export function parseSubtitleCues(value, format = 'srt') {
  let content = value.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();
  if (format === 'vtt') {
    if (!content.startsWith('WEBVTT\n\n')) return null;
    content = content.slice(8).trim();
  }
  if (!content) return null;
  const cues = [];
  const separator = format === 'srt' ? ',' : '\\.';
  const pattern = new RegExp(`^(\\d{2,}):(\\d{2}):(\\d{2})${separator}(\\d{3}) --> (\\d{2,}):(\\d{2}):(\\d{2})${separator}(\\d{3})$`);
  for (const group of content.split(/\n\n+/)) {
    const lines = group.split('\n');
    if (format === 'srt' && lines.shift() !== String(cues.length + 1)) return null;
    const match = lines.shift()?.match(pattern);
    if (!match || !lines.length || !lines.join('').trim() || ![2, 3, 6, 7].every((index) => Number(match[index]) < 60)) return null;
    const time = (offset) => Number(match[offset]) * 3600 + Number(match[offset + 1]) * 60
      + Number(match[offset + 2]) + Number(match[offset + 3]) / 1000;
    cues.push({ start: time(1), end: time(5), text: lines.join('\n') });
  }
  return cues;
}

export function summarizeSubtitleProof(srt, duration) {
  const cues = parseSubtitleCues(srt) ?? [];
  const issues = cues.flatMap((cue, index) => {
    const reasons = [];
    if (cue.start < 0 || cue.end <= cue.start) reasons.push('invalid-duration');
    if (cue.end > duration + 0.1) reasons.push('past-duration');
    if (index && cue.start < cues[index - 1].end) reasons.push('overlap');
    return reasons.length ? [{ index, start: cue.start, end: cue.end,
      previousEnd: cues[index - 1]?.end ?? null, reasons }] : [];
  });
  return {
    cues: cues.length,
    firstStart: cues[0]?.start ?? null,
    lastEnd: cues.at(-1)?.end ?? null,
    valid: cues.length > 0 && Number.isFinite(duration) && cues.every((cue, index) => cue.start >= 0 && cue.end > cue.start && cue.end <= duration + 0.1
      && (index === 0 || cue.start >= cues[index - 1].end)),
    timingIssues: issues.slice(0, 50), timingIssueCount: issues.length,
  };
}

export function installResourceProof(target = globalThis) {
  const proof = { workersCreated: 0, workersTerminated: 0, liveWorkers: new Set(), urls: new Set(), modelDownloads: {} };
  target.__transcriberProof = proof;
  const NativeWorker = target.Worker;
  target.Worker = class extends NativeWorker {
    constructor(...args) {
      super(...args); proof.workersCreated++; proof.liveWorkers.add(this);
      this.addEventListener?.('message', ({ data }) => {
        if (data?.type !== 'load-progress') return;
        const match = /^Loading (encoder_model_quantized\.onnx|decoder_model_merged_quantized\.onnx)$/.exec(data.message);
        const bounded = (value) => Number.isSafeInteger(value) && value >= 0 && value <= 1024 ** 3;
        if (!match || !bounded(data.current) || !bounded(data.total)) return;
        const key = match[1];
        proof.modelDownloads[key] = { current: data.current,
          max: Math.max(data.current, proof.modelDownloads[key]?.max ?? 0), total: data.total };
      });
    }
    terminate() {
      if (proof.liveWorkers.delete(this)) proof.workersTerminated++;
      return super.terminate();
    }
  };
  const create = target.URL.createObjectURL.bind(target.URL);
  const revoke = target.URL.revokeObjectURL.bind(target.URL);
  target.URL.createObjectURL = (blob) => { const url = create(blob); proof.urls.add(url); return url; };
  target.URL.revokeObjectURL = (url) => { proof.urls.delete(url); return revoke(url); };
}

export function matchSyntheticSpeech(cues, intervals) {
  const used = new Set();
  let matched = 0;
  for (let interval = 0; interval < intervals; interval++) {
    const start = interval * 30;
    const index = cues.findIndex((cue, index) => !used.has(index) && /voice/i.test(cue.text)
      && cue.end > cue.start && cue.end - cue.start <= 15
      && Math.abs(cue.start - start) <= 8 && cue.end >= start + 0.5);
    if (index >= 0) { used.add(index); matched++; }
  }
  return matched;
}
