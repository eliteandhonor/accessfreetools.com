/// <reference lib="webworker" />

import {
  loadTextToSpeech,
  loadVoiceStyle,
  writeWavFile,
} from '../lib/supertonicWebHelper.js';

const MODEL_REVISION = '3cadd1ee6394adea1bd021217a0e650ede09a323';
const MODEL_BASE = `https://huggingface.co/Supertone/supertonic-3/resolve/${MODEL_REVISION}`;
const ONNX_BASE = `${MODEL_BASE}/onnx`;

type LoadRequest = { type: 'load' };
type GenerateRequest = {
  type: 'generate';
  language: string;
  speed: number;
  steps: number;
  text: string;
  voice: string;
};
type WorkerRequest = GenerateRequest | LoadRequest;

interface TextToSpeechRuntime {
  call: (
    text: string,
    language: string,
    style: unknown,
    steps: number,
    speed: number,
    silenceDuration: number,
    progress: (step: number, total: number) => void,
  ) => Promise<{ wav: number[]; duration: number[] }>;
  sampleRate: number;
}

type LoadTextToSpeechRuntime = (
  onnxDirectory: string,
  sessionOptions: Record<string, unknown>,
  progress: (modelName: string, current: number, total: number) => void,
) => Promise<{ textToSpeech: TextToSpeechRuntime }>;

type LoadVoiceStyleRuntime = (voiceStylePaths: string[]) => Promise<unknown>;

const loadBrowserTextToSpeech = loadTextToSpeech as unknown as LoadTextToSpeechRuntime;
const loadBrowserVoiceStyle = loadVoiceStyle as unknown as LoadVoiceStyleRuntime;

const worker = self as DedicatedWorkerGlobalScope;
let runtime: TextToSpeechRuntime | null = null;
let backend: 'wasm' | 'webgpu' = 'wasm';
let voiceStyle: unknown = null;
let loadedVoice = '';

function send(message: Record<string, unknown>, transfer: Transferable[] = []) {
  worker.postMessage(message, transfer);
}

function safeError(error: unknown) {
  if (!(error instanceof Error)) return 'Browser speech generation failed.';
  if (/out of memory|memory access out of bounds/i.test(error.message)) {
    return 'The browser ran out of memory. Close other tabs or try a shorter chapter.';
  }
  if (/fetch|network|load/i.test(error.message)) {
    return 'The speech model could not be downloaded. Check the connection and try again.';
  }
  return 'Browser speech generation failed. Reload the model and try a shorter chapter.';
}

async function loadRuntime() {
  if (runtime) {
    send({ type: 'ready', backend, revision: MODEL_REVISION });
    return;
  }

  const hasWebGpu = Boolean((navigator as Navigator & { gpu?: unknown }).gpu);
  const providers: Array<'wasm' | 'webgpu'> = hasWebGpu ? ['webgpu', 'wasm'] : ['wasm'];
  let lastError: unknown;

  for (const provider of providers) {
    try {
      send({
        type: 'load-progress',
        message: provider === 'webgpu' ? 'Starting the WebGPU model loader' : 'Starting the WebAssembly fallback',
      });
      const result = await loadBrowserTextToSpeech(
        ONNX_BASE,
        { executionProviders: [provider], graphOptimizationLevel: 'all' },
        (modelName: string, current: number, total: number) => {
          send({ type: 'load-progress', current, total, message: `Loading ${modelName}` });
        },
      );
      runtime = result.textToSpeech;
      backend = provider;
      send({ type: 'ready', backend, revision: MODEL_REVISION });
      return;
    } catch (error) {
      lastError = error;
      runtime = null;
      if (provider === 'webgpu') {
        send({ type: 'load-progress', message: 'WebGPU was unavailable, trying WebAssembly' });
      }
    }
  }
  throw lastError ?? new Error('No browser inference backend is available.');
}

async function ensureVoice(voice: string) {
  if (voiceStyle && loadedVoice === voice) return;
  send({ type: 'voice-progress', message: `Loading preset ${voice}` });
  voiceStyle = await loadBrowserVoiceStyle([`${MODEL_BASE}/voice_styles/${voice}.json`]);
  loadedVoice = voice;
}

async function generate(request: GenerateRequest) {
  await loadRuntime();
  await ensureVoice(request.voice);
  if (!runtime || !voiceStyle) throw new Error('The browser model is not ready.');

  const startedAt = performance.now();
  const { wav, duration } = await runtime.call(
    request.text,
    request.language,
    voiceStyle,
    request.steps,
    request.speed,
    0.3,
    (step, total) => send({ type: 'generation-progress', step, total }),
  );
  const audioLength = Math.floor(runtime.sampleRate * duration[0]);
  const buffer = writeWavFile(wav.slice(0, audioLength), runtime.sampleRate) as ArrayBuffer;
  send(
    {
      type: 'result',
      audio: buffer,
      backend,
      durationSeconds: duration[0],
      generationSeconds: (performance.now() - startedAt) / 1_000,
      revision: MODEL_REVISION,
      sampleRate: runtime.sampleRate,
    },
    [buffer],
  );
}

worker.onmessage = (event: MessageEvent<WorkerRequest>) => {
  void (async () => {
    try {
      if (event.data.type === 'load') await loadRuntime();
      if (event.data.type === 'generate') await generate(event.data);
    } catch (error) {
      send({ type: 'error', message: safeError(error) });
    }
  })();
};
