/// <reference lib="webworker" />

import {
  loadTextToSpeech,
  loadVoiceStyle,
} from '../lib/supertonicWebHelper.js';
import { SUPERTONIC_MODEL_REVISION } from '../lib/browserTtsModels';
import type { BrowserTtsWorkerRequest } from '../lib/browserTtsWorkerTypes';
import { encodePcmToMp3, MP3_BITRATE_KBPS } from '../lib/mp3Encoder';

const MODEL_ID = 'supertonic-3';
const MODEL_BASE = `https://huggingface.co/Supertone/supertonic-3/resolve/${SUPERTONIC_MODEL_REVISION}`;
const ONNX_BASE = `${MODEL_BASE}/onnx`;

type GenerateRequest = Extract<BrowserTtsWorkerRequest, { type: 'generate' }>;

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
    return 'The browser ran out of memory. Close other tabs or try shorter text.';
  }
  if (/fetch|network|load/i.test(error.message)) {
    return 'The speech model could not be downloaded. Check the connection and try again.';
  }
  return 'Browser speech generation failed. Reload the model and try shorter text.';
}

async function loadRuntime() {
  if (runtime) {
    send({ type: 'ready', backend, modelId: MODEL_ID, revision: SUPERTONIC_MODEL_REVISION });
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
        {
          executionProviders: [provider],
          graphOptimizationLevel: 'all',
          logSeverityLevel: 3,
        },
        (modelName: string, current: number, total: number) => {
          send({ type: 'load-progress', current, total, message: `Loading ${modelName}` });
        },
      );
      runtime = result.textToSpeech;
      backend = provider;
      send({ type: 'ready', backend, modelId: MODEL_ID, revision: SUPERTONIC_MODEL_REVISION });
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
  if (!runtime) await loadRuntime();
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
    (step, total) => send({
      type: 'generation-progress',
      message: `Generating speech pass ${step} of ${total}`,
      step,
      total,
    }),
  );
  const audioLength = Math.floor(runtime.sampleRate * duration[0]);
  const buffer = await encodePcmToMp3(Float32Array.from(wav.slice(0, audioLength)), runtime.sampleRate);
  send(
    {
      type: 'result',
      audio: buffer,
      backend,
      bitrateKbps: MP3_BITRATE_KBPS,
      durationSeconds: duration[0],
      generationSeconds: (performance.now() - startedAt) / 1_000,
      mimeType: 'audio/mpeg',
      modelId: MODEL_ID,
      revision: SUPERTONIC_MODEL_REVISION,
      sampleRate: runtime.sampleRate,
    },
    [buffer],
  );
}

worker.onmessage = (event: MessageEvent<BrowserTtsWorkerRequest>) => {
  void (async () => {
    try {
      if (event.data.type === 'load') await loadRuntime();
      if (event.data.type === 'generate') await generate(event.data);
    } catch (error) {
      send({ type: 'error', message: safeError(error) });
    }
  })();
};
