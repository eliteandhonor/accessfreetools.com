import { afterEach, describe, expect, it, vi } from 'vitest';

import { KOKORO_MODEL_REVISION } from '../lib/browserTtsModels';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('Kokoro worker revision boundary', () => {
  it('pins the real tokenizer existence probe and content requests before loading weights', async () => {
    vi.resetModules();
    const { env, StyleTextToSpeech2Model } = await import('@huggingface/transformers');
    const original = {
      fetch: env.fetch,
      allowLocalModels: env.allowLocalModels,
      useBrowserCache: env.useBrowserCache,
      useFSCache: env.useFSCache,
      remotePathTemplate: env.remotePathTemplate,
    };
    const requests: string[] = [];
    const tokenizer = {
      version: '1.0', truncation: null, padding: null, added_tokens: [], normalizer: null,
      pre_tokenizer: { type: 'Whitespace' }, post_processor: null, decoder: null,
      model: { type: 'WordLevel', vocab: { '[UNK]': 0, hello: 1 }, unk_token: '[UNK]' },
    };
    env.allowLocalModels = false;
    env.useBrowserCache = false;
    env.useFSCache = false;
    env.fetch = vi.fn(async (input) => {
      const url = String(input);
      requests.push(url);
      const data = url.endsWith('/tokenizer_config.json')
        ? { tokenizer_class: 'PreTrainedTokenizer', model_max_length: 512 }
        : tokenizer;
      return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
    });
    const loadWeights = vi.spyOn(StyleTextToSpeech2Model, 'from_pretrained').mockRejectedValue(new Error('Test stops before model weights'));
    const messages: unknown[] = [];
    const worker = { navigator: {}, postMessage: (message: unknown) => messages.push(message), onmessage: null as null | ((event: { data: { type: 'load'; forceWasm: true } }) => void) };
    vi.stubGlobal('self', worker);
    try {
      await import('./kokoro.worker');
      worker.onmessage?.({ data: { type: 'load', forceWasm: true } });
      await vi.waitFor(() => expect(loadWeights).toHaveBeenCalledOnce());
      expect(requests.length).toBeGreaterThanOrEqual(3);
      expect(requests.every(url => url.startsWith(`https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/${KOKORO_MODEL_REVISION}/`))).toBe(true);
      expect(requests.some(url => url.includes('/resolve/main/'))).toBe(false);
      expect(loadWeights).toHaveBeenCalledWith('onnx-community/Kokoro-82M-v1.0-ONNX', expect.objectContaining({ revision: KOKORO_MODEL_REVISION, device: 'wasm', dtype: 'q8' }));
      await vi.waitFor(() => expect(messages).toContainEqual(expect.objectContaining({ type: 'error' })));
    } finally {
      Object.assign(env, original);
    }
  });
});
