/// <reference lib="webworker" />

import {
  AutoTokenizer,
  StyleTextToSpeech2Model,
  Tensor,
} from '@huggingface/transformers';

import {
  getBrowserTtsModel,
  KOKORO_MODEL_REVISION,
  selectKokoroRuntimePlan,
  type KokoroRuntimePlan,
} from '../lib/browserTtsModels';
import type { BrowserTtsWorkerRequest } from '../lib/browserTtsWorkerTypes';
import {
  KOKORO_MAX_MODEL_TOKENS,
  KOKORO_STYLE_DIMENSIONS,
  phonemizeKokoroText,
  selectKokoroVoiceStyle,
  splitTextForKokoro,
  type KokoroEnglishDialect,
} from '../lib/kokoroBrowserText';
import { encodePcmToMp3, MP3_BITRATE_KBPS } from '../lib/mp3Encoder';

const MODEL_ID = 'kokoro-82m';
const MODEL_REPOSITORY = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const MODEL_SOURCE_REVISION = 'dfb907a02bba8152ca444717ca5d78747ccb4bec';
const VOICE_BASE = `https://huggingface.co/${MODEL_REPOSITORY}/resolve/${KOKORO_MODEL_REVISION}/voices`;
const SAMPLE_RATE = 24_000;
const SILENCE_SECONDS = 0.2;

type GenerateRequest = Extract<BrowserTtsWorkerRequest, { type: 'generate' }>;

interface KokoroModelRuntime {
  (inputs: { input_ids: Tensor; speed: Tensor; style: Tensor }): Promise<{ waveform: Tensor }>;
}

interface KokoroTokenizerRuntime {
  (text: string, options?: { truncation?: boolean }): { input_ids: Tensor };
}

interface PreparedChunk {
  inputIds: Tensor;
  tokenCount: number;
}

const worker = self as DedicatedWorkerGlobalScope;
const modelDefinition = getBrowserTtsModel(MODEL_ID);
const supportedVoices = new Map(modelDefinition.voices.map((voice) => [voice.value, voice]));
let model: KokoroModelRuntime | null = null;
let tokenizer: KokoroTokenizerRuntime | null = null;
let runtimePlan: KokoroRuntimePlan | null = null;
let loadedVoice = '';
let loadedVoiceData: Float32Array | null = null;

function send(message: Record<string, unknown>, transfer: Transferable[] = []) {
  worker.postMessage(message, transfer);
}

function safeError(error: unknown) {
  if (!(error instanceof Error)) return 'Kokoro speech generation failed.';
  if (/out of memory|memory access out of bounds/i.test(error.message)) {
    return 'The browser ran out of memory. Close other tabs or try shorter text.';
  }
  if (/fetch|network|load|download/i.test(error.message)) {
    return 'The Kokoro model could not be downloaded. Check the connection and try again.';
  }
  if (/token|phoneme|voice|language/i.test(error.message)) {
    return 'Kokoro could not prepare this text or voice. Check the English dialect and try shorter text.';
  }
  return 'Kokoro speech generation failed. Reload the model and try shorter text.';
}

function reportLoadProgress(progress: unknown) {
  if (!progress || typeof progress !== 'object') {
    send({ type: 'load-progress', message: 'Loading Kokoro model files' });
    return;
  }
  const item = progress as { file?: unknown; loaded?: unknown; progress?: unknown; total?: unknown };
  const current = typeof item.loaded === 'number'
    ? item.loaded
    : typeof item.progress === 'number' && typeof item.total === 'number'
      ? (item.progress / 100) * item.total
      : undefined;
  const total = typeof item.total === 'number' ? item.total : undefined;
  const filename = typeof item.file === 'string' ? item.file.split('/').at(-1) : undefined;
  send({
    type: 'load-progress',
    current,
    total,
    message: filename ? `Loading ${filename}` : 'Loading Kokoro model files',
  });
}

async function loadTokenizer() {
  if (tokenizer) return tokenizer;
  tokenizer = await AutoTokenizer.from_pretrained(MODEL_REPOSITORY, {
    progress_callback: reportLoadProgress,
    revision: KOKORO_MODEL_REVISION,
  }) as unknown as KokoroTokenizerRuntime;
  return tokenizer;
}

async function loadRuntime(forceWasm = false) {
  if (model && tokenizer) {
    send({
      type: 'ready',
      backend: runtimePlan?.backend ?? 'wasm',
      dtype: runtimePlan?.dtype ?? 'q8',
      modelId: MODEL_ID,
      revision: KOKORO_MODEL_REVISION,
    });
    return;
  }

  await loadTokenizer();
  const webGpuAvailable = 'gpu' in worker.navigator;
  const preferredPlan = selectKokoroRuntimePlan(webGpuAvailable, forceWasm);
  const candidates = preferredPlan.backend === 'webgpu'
    ? [preferredPlan, selectKokoroRuntimePlan(false)]
    : [preferredPlan];
  let lastError: unknown;

  for (const candidate of candidates) {
    send({
      type: 'load-progress',
      message: candidate.backend === 'webgpu'
        ? 'Loading full-precision Kokoro with WebGPU'
        : 'Loading Kokoro compatibility mode with WebAssembly',
    });
    try {
      const loadedModel = await StyleTextToSpeech2Model.from_pretrained(MODEL_REPOSITORY, {
        device: candidate.backend,
        dtype: candidate.dtype,
        progress_callback: reportLoadProgress,
        revision: KOKORO_MODEL_REVISION,
      });
      model = loadedModel as unknown as KokoroModelRuntime;
      runtimePlan = candidate;
      send({
        type: 'ready',
        backend: candidate.backend,
        dtype: candidate.dtype,
        modelId: MODEL_ID,
        revision: KOKORO_MODEL_REVISION,
      });
      return;
    } catch (error) {
      lastError = error;
      model = null;
      runtimePlan = null;
      if (candidate.backend === 'webgpu') {
        send({ type: 'load-progress', message: 'WebGPU was unavailable, switching to compatibility mode' });
      }
    }
  }
  throw lastError ?? new Error('No Kokoro browser backend was available.');
}

async function ensureVoice(voice: string, language: KokoroEnglishDialect) {
  const definition = supportedVoices.get(voice);
  if (!definition || definition.language !== language) throw new Error('Unsupported Kokoro voice or language.');
  if (loadedVoiceData && loadedVoice === voice) return loadedVoiceData;

  send({ type: 'voice-progress', message: `Loading the ${definition.label} voice` });
  const response = await fetch(`${VOICE_BASE}/${voice}.bin`);
  if (!response.ok) throw new Error('The Kokoro voice download failed.');
  const data = new Float32Array(await response.arrayBuffer());
  if (data.length < KOKORO_STYLE_DIMENSIONS) throw new Error('The Kokoro voice file is incomplete.');
  loadedVoice = voice;
  loadedVoiceData = data;
  return data;
}

function getInputLength(inputIds: Tensor) {
  return inputIds.dims[inputIds.dims.length - 1] ?? 0;
}

async function prepareChunk(
  text: string,
  language: KokoroEnglishDialect,
  depth = 0,
): Promise<PreparedChunk[]> {
  if (!tokenizer) throw new Error('The Kokoro tokenizer is not ready.');
  const phonemes = await phonemizeKokoroText(text, language);
  const { input_ids: inputIds } = tokenizer(phonemes, { truncation: false });
  const tokenCount = Math.max(getInputLength(inputIds) - 2, 0);
  if (tokenCount > 0 && tokenCount <= KOKORO_MAX_MODEL_TOKENS) return [{ inputIds, tokenCount }];
  inputIds.dispose();
  if (depth >= 8 || text.length < 2) throw new Error('Kokoro could not safely split this text into model-sized sections.');

  let parts = splitTextForKokoro(text, Math.max(40, Math.floor(text.length / 2)));
  if (parts.length < 2) {
    const middle = Math.ceil(text.length / 2);
    parts = [text.slice(0, middle).trim(), text.slice(middle).trim()].filter(Boolean);
  }
  const prepared: PreparedChunk[] = [];
  for (const part of parts) prepared.push(...await prepareChunk(part, language, depth + 1));
  return prepared;
}

function concatenateAudio(chunks: Float32Array[]) {
  const silenceLength = Math.round(SAMPLE_RATE * SILENCE_SECONDS);
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
    + Math.max(chunks.length - 1, 0) * silenceLength;
  const output = new Float32Array(totalLength);
  let offset = 0;
  for (const [index, chunk] of chunks.entries()) {
    output.set(chunk, offset);
    offset += chunk.length;
    if (index < chunks.length - 1) offset += silenceLength;
  }
  return output;
}

async function generate(request: GenerateRequest) {
  if (request.language !== 'en-us' && request.language !== 'en-gb') {
    throw new Error('Kokoro browser support is limited to US and UK English.');
  }
  if (!model || !tokenizer) await loadRuntime();
  const voiceData = await ensureVoice(request.voice, request.language);
  if (!model) throw new Error('The Kokoro model is not ready.');

  const sourceChunks = splitTextForKokoro(request.text);
  const preparedChunks: PreparedChunk[] = [];
  for (const sourceChunk of sourceChunks) {
    preparedChunks.push(...await prepareChunk(sourceChunk, request.language));
  }
  if (preparedChunks.length < 1) throw new Error('Kokoro needs non-empty text.');

  const startedAt = performance.now();
  const audioChunks: Float32Array[] = [];
  for (const [index, chunk] of preparedChunks.entries()) {
    const style = selectKokoroVoiceStyle(voiceData, chunk.tokenCount);
    send({
      type: 'generation-progress',
      message: `Generating section ${index + 1} of ${preparedChunks.length}`,
      step: index,
      total: preparedChunks.length,
    });
    const styleTensor = new Tensor('float32', style, [1, KOKORO_STYLE_DIMENSIONS]);
    const speedTensor = new Tensor('float32', [request.speed], [1]);
    try {
      const { waveform } = await model({
        input_ids: chunk.inputIds,
        style: styleTensor,
        speed: speedTensor,
      });
      try {
        audioChunks.push(Float32Array.from(waveform.data as ArrayLike<number>));
      } finally {
        waveform.dispose();
      }
    } finally {
      chunk.inputIds.dispose();
      speedTensor.dispose();
      styleTensor.dispose();
    }
  }

  const pcm = concatenateAudio(audioChunks);
  send({
    type: 'generation-progress',
    message: 'Encoding the MP3 in this browser',
    step: preparedChunks.length,
    total: preparedChunks.length,
  });
  const buffer = await encodePcmToMp3(pcm, SAMPLE_RATE);
  send(
    {
      type: 'result',
      audio: buffer,
      backend: runtimePlan?.backend ?? 'wasm',
      bitrateKbps: MP3_BITRATE_KBPS,
      durationSeconds: pcm.length / SAMPLE_RATE,
      dtype: runtimePlan?.dtype ?? 'q8',
      generationSeconds: (performance.now() - startedAt) / 1_000,
      mimeType: 'audio/mpeg',
      modelId: MODEL_ID,
      modelSourceRevision: MODEL_SOURCE_REVISION,
      revision: KOKORO_MODEL_REVISION,
      sampleRate: SAMPLE_RATE,
    },
    [buffer],
  );
}

worker.onmessage = (event: MessageEvent<BrowserTtsWorkerRequest>) => {
  void (async () => {
    try {
      if (event.data.type === 'load') await loadRuntime(event.data.forceWasm);
      if (event.data.type === 'generate') await generate(event.data);
    } catch (error) {
      send({ type: 'error', message: safeError(error), modelId: MODEL_ID });
    }
  })();
};
