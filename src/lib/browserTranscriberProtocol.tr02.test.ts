import { afterEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({
  loadProgress: null as null | ((progress: unknown) => void),
  fail: false,
  calls: 0,
  transcribeError: null as null | 'Error' | 'AbortError' | 'TimeoutError',
}));

vi.mock('@huggingface/transformers', () => ({
  env: { version: '4.2.0' },
  pipeline: async (_task: string, _model: string, options: { progress_callback: (progress: unknown) => void }) => {
    fixture.loadProgress = options.progress_callback;
    options.progress_callback({ file: 'fixture', loaded: 10, total: 100 });
    if (fixture.fail) throw new Error('Synthetic load failure');
    return Object.assign(async () => {
      fixture.calls++;
      if (fixture.transcribeError && fixture.calls === 2) {
        throw new DOMException('Private synthetic error detail', fixture.transcribeError);
      }
      return { text: 'Synthetic', chunks: [{ text: 'Synthetic', timestamp: [0, 1] }] };
    }, {
      dispose: async () => {}, model: Object.assign(() => {}, {
        _generate_with_seek: () => { throw new Error('No real model in request-identity fixture'); },
      }),
    });
  },
}));

vi.mock('mediabunny', () => {
  const track = {
    number: 1, canDecode: async () => true, getNumberOfChannels: async () => 1,
    getCodecParameterString: async () => 'pcm', getLanguageCode: async () => 'en',
    getName: async () => 'Synthetic', getSampleRate: async () => 16000,
  };
  return {
    ALL_FORMATS: [], BlobSource: class {},
    Input: class {
      getFormat = async () => ({ name: 'WAV' });
      getAudioTracks = async () => [track];
      computeDuration = async () => 1;
      dispose() {}
    },
    AudioSampleSink: class {
      async *samples() {
        yield { timestamp: 0, numberOfFrames: 160, sampleRate: 16000, numberOfChannels: 1,
          copyTo: (target: Float32Array) => target.fill(0), close() {} };
      }
    },
  };
});

afterEach(() => {
  vi.unstubAllGlobals(); vi.resetModules(); fixture.fail = false;
  fixture.calls = 0; fixture.transcribeError = null;
});

function captureWorker() {
  const events: { type: string; requestId?: number; stage?: string }[] = [];
  let dispatch: (event: { data: unknown }) => Promise<void>;
  vi.stubGlobal('self', {
    postMessage: (event: typeof events[number]) => events.push(event),
    addEventListener: (type: string, listener: typeof dispatch) => { if (type === 'message') dispatch = listener; },
  });
  return { events, request: (data: unknown) => dispatch!({ data }) };
}

describe('TR-02 actual worker request identity, fake model and decoder', () => {
  it.each([false, true])('reports native decoder availability %s without rejecting decodable PCM', async available => {
    vi.stubGlobal('AudioDecoder', available ? class AudioDecoder {} : undefined);
    const worker = captureWorker();
    await import('../workers/transcriber-media.worker');
    await worker.request({ requestId: 60, type: 'inspect', file: {} });
    expect(worker.events.at(-1)).toMatchObject({
      requestId: 60, type: 'inspected',
      media: { nativeAudioDecoderAvailable: available, tracks: [{ number: 1, canDecode: true }] },
    });
  });

  it('uses real lookahead bounds but returns only whole owned captions with the logical block identity', async () => {
    const worker = captureWorker();
    await import('../workers/transcriber-asr.worker');
    await worker.request({ requestId: 81, type: 'load', model: 'english', backend: 'wasm' });
    await worker.request({ requestId: 82, type: 'transcribe', model: 'english', language: 'en',
      audio: new Float32Array(35 * 16000).buffer, block: { index: 7, start: 100, end: 110 }, sourceEnd: 135 });
    expect(fixture.calls).toBe(2);
    expect(worker.events.at(-1)).toMatchObject({ requestId: 82, type: 'transcribed', blockIndex: 7,
      segments: [{ start: 100, end: 101, text: 'Synthetic' }] });
  });
  it.each([109, 135.01, NaN, Infinity])('rejects unsupported lookahead end %s before model execution', async sourceEnd => {
    const worker = captureWorker();
    await import('../workers/transcriber-asr.worker');
    await worker.request({ requestId: 83, type: 'load', model: 'english', backend: 'wasm' });
    await worker.request({ requestId: 84, type: 'transcribe', model: 'english', language: 'en',
      audio: new Float32Array(35 * 16000).buffer, block: { index: 7, start: 100, end: 110 }, sourceEnd });
    expect(fixture.calls).toBe(0);
    expect(worker.events.at(-1)).toMatchObject({ requestId: 84, type: 'error', stage: 'transcribe' });
  });
  it('ASR replies and late load callbacks retain their originating request ID', async () => {
    const worker = captureWorker();
    await import('../workers/transcriber-asr.worker');
    await worker.request({ requestId: 41, type: 'load', model: 'english', backend: 'wasm' });
    expect(worker.events.map(({ requestId }) => requestId)).toEqual([41, 41]);
    expect(worker.events.at(-1)).toMatchObject({ requestId: 41, type: 'ready' });
    await worker.request({ requestId: 42, type: 'transcribe', model: 'english', language: 'en', audio: new Float32Array(16000).buffer, block: { index: 0, start: 0, end: 1 } });
    expect(worker.events.at(-2)).toMatchObject({ requestId: 42, type: 'transcription-progress', progress: 1 });
    expect(worker.events.at(-1)).toMatchObject({ requestId: 42, type: 'transcribed' });
    fixture.loadProgress!({ file: 'fixture', loaded: 99 });
    expect(worker.events.at(-1)).toMatchObject({ requestId: 41, type: 'load-progress' });
  });

  it('ASR errors carry the failed request ID', async () => {
    const worker = captureWorker();
    fixture.fail = true;
    await import('../workers/transcriber-asr.worker');
    await worker.request({ requestId: 51, type: 'load', model: 'english', backend: 'webgpu' });
    expect(worker.events.at(-1)).toMatchObject({ requestId: 51, type: 'error', stage: 'load' });
  });

  it.each(['Error', 'AbortError', 'TimeoutError'] as const)('second-window %s stops without a false completed block', async name => {
    const worker = captureWorker();
    fixture.transcribeError = name;
    await import('../workers/transcriber-asr.worker');
    await worker.request({ requestId: 70, type: 'load', model: 'english', backend: 'wasm' });
    await worker.request({ requestId: 71, type: 'transcribe', model: 'english', language: 'en',
      audio: new Float32Array(70 * 16000).buffer, block: { index: 2, start: 100, end: 170 } });
    expect(fixture.calls).toBe(2);
    expect(worker.events.filter(event => event.requestId === 71)).toEqual([
      { requestId: 71, type: 'transcription-progress', progress: 0.3 },
      expect.objectContaining({ requestId: 71, type: 'error', stage: 'transcribe',
        ...(name === 'Error' ? {} : { name }) }),
    ]);
    expect(worker.events.some(event => event.type === 'transcribed')).toBe(false);
    expect(JSON.stringify(worker.events)).not.toContain('Private synthetic error detail');
  });

  it('media inspect, decode progress/result and errors echo request IDs without changing PCM', async () => {
    const worker = captureWorker();
    await import('../workers/transcriber-media.worker');
    await worker.request({ requestId: 61, type: 'inspect', file: {} });
    expect(worker.events.at(-1)).toMatchObject({ requestId: 61, type: 'inspected' });
    await worker.request({ requestId: 62, type: 'decode', trackNumber: 1, block: { index: 0, start: 0, end: 0.01 } });
    expect(worker.events.slice(1).map(({ type, requestId }) => ({ type, requestId }))).toEqual([
      { type: 'decode-progress', requestId: 62 }, { type: 'decoded', requestId: 62 },
    ]);
    const decoded = worker.events.at(-1) as unknown as { audio: ArrayBuffer };
    expect(new Float32Array(decoded.audio)).toEqual(new Float32Array(160));
    await worker.request({ requestId: 63, type: 'decode', trackNumber: 99, block: { index: 1, start: 0, end: 0.01 } });
    expect(worker.events.at(-1)).toMatchObject({ requestId: 63, type: 'error', stage: 'decode' });
  });
});
