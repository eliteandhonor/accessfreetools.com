/// <reference lib="webworker" />

import { env, pipeline, type AutomaticSpeechRecognitionPipeline } from '@huggingface/transformers';

import { createWhisperGenerationOptions } from '../lib/browserTranscriber';
import { transcribeWhisperWindows } from '../lib/browserTranscriberWindows';
import { installWhisperFrameBounds } from '../lib/whisperFrameBounds';
import type {
  TranscriberAsrWorkerEvent,
  TranscriberAsrWorkerRequest,
  TranscriberBackend,
  TranscriberModelKind,
} from '../lib/browserTranscriberWorkerTypes';

const ENGLISH_MODEL = 'onnx-community/whisper-tiny.en_timestamped';
const ENGLISH_REVISION = 'aeaa13760958b03fac5062f457d317d3319c3168';
const MULTILINGUAL_MODEL = 'onnx-community/whisper-tiny_timestamped';
const MULTILINGUAL_REVISION = '517244293732ee2d58139af5814231b7e6830a0d';

const worker = self as DedicatedWorkerGlobalScope;
let transcriber: AutomaticSpeechRecognitionPipeline | null = null;
let loadedBackend: TranscriberBackend | null = null;
let loadedModel: TranscriberModelKind | null = null;

function send(message: TranscriberAsrWorkerEvent) {
  worker.postMessage(message);
}

function modelConfig(model: TranscriberModelKind) {
  return model === 'english'
    ? { repository: ENGLISH_MODEL, revision: ENGLISH_REVISION }
    : { repository: MULTILINGUAL_MODEL, revision: MULTILINGUAL_REVISION };
}

function reportLoadProgress(progress: unknown, sendReply: typeof send) {
  if (!progress || typeof progress !== 'object') {
    sendReply({ type: 'load-progress', message: 'Loading the speech recognition model' });
    return;
  }
  const item = progress as { file?: unknown; loaded?: unknown; progress?: unknown; total?: unknown };
  const filename = typeof item.file === 'string' ? item.file.split('/').at(-1) : undefined;
  sendReply({
    type: 'load-progress',
    current: typeof item.loaded === 'number' ? item.loaded : undefined,
    message: filename ? `Loading ${filename}` : 'Loading the speech recognition model',
    progress: typeof item.progress === 'number' ? item.progress : undefined,
    total: typeof item.total === 'number' ? item.total : undefined,
  });
}

function safeAsrError(error: unknown, stage: 'load' | 'transcribe') {
  if (!(error instanceof Error)) return `Speech recognition ${stage} failed.`;
  if (/memory|allocation|out of bounds/i.test(error.message)) {
    return 'The browser ran out of memory. Close other tabs or try a shorter recording.';
  }
  if (/fetch|network|download|load/i.test(error.message)) {
    return 'The speech model could not be downloaded. Check the connection and try again.';
  }
  return stage === 'load'
    ? 'The speech model could not start in this browser.'
    : 'Whisper could not transcribe this part of the recording.';
}

async function disposePipeline() {
  if (transcriber) await transcriber.dispose();
  transcriber = null;
  loadedBackend = null;
  loadedModel = null;
}

async function load(model: TranscriberModelKind, backend: TranscriberBackend, sendReply: typeof send) {
  if (transcriber && loadedModel === model && loadedBackend === backend) {
    const config = modelConfig(model);
    sendReply({ type: 'ready', backend, model, revision: config.revision });
    return;
  }
  await disposePipeline();
  const config = modelConfig(model);
  env.allowLocalModels = false;
  env.remoteHost = 'https://huggingface.co/';
  env.remotePathTemplate = `{model}/resolve/${config.revision}/`;
  transcriber = await pipeline('automatic-speech-recognition', config.repository, {
    device: backend,
    dtype: 'q8',
    progress_callback: (progress) => reportLoadProgress(progress, sendReply),
    revision: config.revision,
  });
  try {
    installWhisperFrameBounds(transcriber.model, env.version);
  } catch (error) {
    await disposePipeline();
    throw error;
  }
  loadedBackend = backend;
  loadedModel = model;
  sendReply({ type: 'ready', backend, model, revision: config.revision });
}

async function transcribe(request: Extract<TranscriberAsrWorkerRequest, { type: 'transcribe' }>, sendReply: typeof send) {
  if (!transcriber || loadedModel !== request.model) {
    throw new Error('Load the selected speech model before transcription.');
  }
  const audio = new Float32Array(request.audio);
  const recognize = transcriber;
  const options = createWhisperGenerationOptions(request.model, request.language);
  const source = { ...request.block, end: request.sourceEnd ?? request.block.end };
  const segments = await transcribeWhisperWindows(audio, source, async window => {
    const result = await recognize(window, options);
    if (Array.isArray(result)) throw new Error('Unexpected batched speech result.');
    return result;
  }, progress => sendReply({ type: 'transcription-progress', progress }), request.block.end);
  sendReply({ type: 'transcribed', blockIndex: request.block.index, segments,
    text: segments.map(segment => segment.text).join(' ') });
}

worker.addEventListener('message', async (event: MessageEvent<TranscriberAsrWorkerRequest>) => {
  const request = event.data;
  const sendReply: typeof send = (message) => send(
    request.requestId === undefined ? message : { ...message, requestId: request.requestId },
  );
  try {
    if (request.type === 'load') {
      await load(request.model, request.backend, sendReply);
      return;
    }
    if (request.type === 'transcribe') {
      await transcribe(request, sendReply);
      return;
    }
    await disposePipeline();
    sendReply({ type: 'disposed' });
  } catch (error) {
    const stage = request.type === 'transcribe' ? 'transcribe' : 'load';
    const name = typeof error === 'object' && error !== null && 'name' in error
      && (error.name === 'AbortError' || error.name === 'TimeoutError') ? error.name : undefined;
    sendReply({ type: 'error', stage, message: safeAsrError(error, stage), ...(name ? { name } : {}) });
  }
});
