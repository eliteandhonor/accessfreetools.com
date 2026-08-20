import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Download,
  FileAudio,
  Files,
  FileText,
  FileUp,
  LoaderCircle,
  Plus,
  RotateCcw,
  ShieldCheck,
  Square,
  Star,
  Timer,
  Trash2,
  Volume2,
} from 'lucide-react';

import { emitAftToolAction } from '../lib/aftToolAnalytics';
import {
  MAX_TTS_TEXT_CHARACTERS,
  prepareLocalTxtContent,
  sanitizeMp3Filename,
  validateLocalTxtFile,
} from '../lib/browserTtsInput';
import {
  appendBrowserTtsChapter,
  createBrowserTtsChapterMp3Files,
  createBrowserTtsChapters,
  deleteBrowserTtsChapter,
  editBrowserTtsChapterText,
  getBrowserTtsChapterTotals,
  moveBrowserTtsChapter,
  setAllBrowserTtsChapterVoices,
  setBrowserTtsChapterVoice,
  type BrowserTtsChapter,
} from '../lib/browserTtsChapters';
import {
  BrowserTtsChapterQueue,
  type BrowserTtsChapterQueueState,
  type BrowserTtsChapterGenerationContext,
} from '../lib/browserTtsChapterQueue';
import {
  estimateBrowserTtsAudio,
  type BrowserTtsEstimate,
} from '../lib/browserTtsEstimate';
import {
  browserTtsModels,
  getAllBrowserTtsVoiceGroups,
  getBrowserTtsDownloadNote,
  getBrowserTtsModel,
  getBrowserTtsVoice,
  getBrowserTtsVoiceGroups,
  getBrowserTtsVoiceSampleUrl,
  getBrowserTtsVoices,
  type BrowserTtsModelId,
} from '../lib/browserTtsModels';
import {
  createBrowserTtsVoicePreferencesStore,
  type BrowserTtsVoicePreferences,
  type BrowserTtsVoicePreferencesStore,
} from '../lib/browserTtsPreferences';
import type {
  BrowserTtsBackend,
  BrowserTtsWorkerEvent,
  BrowserTtsWorkerRequest,
} from '../lib/browserTtsWorkerTypes';

type BrowserReadiness = 'checking' | 'compatibility' | 'webgpu';
type RuntimeState = 'complete' | 'error' | 'generating' | 'idle' | 'loading' | 'ready';
type SourceMode = 'chapters' | 'single';
type GenerationRequest = Extract<BrowserTtsWorkerRequest, { type: 'generate' }>;

interface GenerationJob {
  chapterId?: string;
  chapterName?: string;
  onProgress?: (progress: number) => void;
  reject?: (error: Error) => void;
  request: GenerationRequest;
  resolve?: (result: AudioResult) => void;
}

interface AudioResult {
  audio: ArrayBuffer;
  backend: BrowserTtsBackend;
  bitrateKbps: number;
  byteLength: number;
  durationSeconds: number;
  dtype?: 'fp32' | 'q8';
  generationSeconds: number;
  modelId: BrowserTtsModelId;
  revision: string;
  sampleRate: number;
  url: string;
  voice: string;
  chapterId?: string;
  chapterName?: string;
}

const MP3_BITRATE_KBPS = 128;
const QUALITY_PASSES = 8;
const DEFAULT_MODEL_ID: BrowserTtsModelId = 'supertonic-3';
const WORKER_STALL_TIMEOUT_MS = 90_000;
const EMPTY_CHAPTER_QUEUE_STATE: BrowserTtsChapterQueueState<AudioResult> = {
  activeChapterId: null,
  completedCount: 0,
  failedCount: 0,
  items: [],
  progress: 0,
  status: 'idle',
  totalCount: 0,
};
const EMPTY_VOICE_PREFERENCES: BrowserTtsVoicePreferences = {
  favorites: [],
  recents: [],
  version: 1,
};

interface VoicePreferenceChoice {
  id: string;
  label: string;
  language: string;
  modelId: BrowserTtsModelId;
  modelName: string;
  voice: string;
}

const voicePreferenceChoices: readonly VoicePreferenceChoice[] = Object.values(browserTtsModels).flatMap((model) => (
  model.voices.map((item) => ({
    id: `${model.id}:${item.value}`,
    label: item.label,
    language: item.language ?? model.defaultLanguage,
    modelId: model.id,
    modelName: model.name,
    voice: item.value,
  }))
));
const voicePreferenceChoiceById = new Map(voicePreferenceChoices.map((item) => [item.id, item]));

function emitTtsAction(action: string, clarityEvent: string) {
  emitAftToolAction({
    action,
    category: 'ai-tools',
    clarityEvent,
    toolName: 'Text to Speech MP3 Generator',
    toolSlug: 'text-to-speech-audiobook-generator',
  });
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en').format(value);
}

function formatBytes(value: number) {
  if (value < 1_024) return `${value} bytes`;
  if (value < 1_048_576) return `${(value / 1_024).toFixed(1)} KB`;
  return `${(value / 1_048_576).toFixed(1)} MB`;
}

function formatSeconds(value: number) {
  if (value < 60) return `${value.toFixed(1)} seconds`;
  const minutes = Math.floor(value / 60);
  return `${minutes} min ${Math.round(value % 60)} sec`;
}

function formatEstimateRange(range: BrowserTtsEstimate['durationSeconds']) {
  if (!range) return '';
  return range.min === range.max
    ? formatSeconds(range.min)
    : `${formatSeconds(range.min)} to ${formatSeconds(range.max)}`;
}

function formatByteRange(range: BrowserTtsEstimate['mp3Bytes']) {
  if (!range) return '';
  return range.min === range.max
    ? formatBytes(range.min)
    : `${formatBytes(range.min)} to ${formatBytes(range.max)}`;
}

function createModelWorker(modelId: BrowserTtsModelId) {
  if (modelId === 'kokoro-82m') {
    return new Worker(new URL('../workers/kokoro.worker.ts', import.meta.url), { type: 'module' });
  }
  return new Worker(new URL('../workers/supertonic.worker.ts', import.meta.url), { type: 'module' });
}

export default function TextToSpeechAudiobookGenerator() {
  const initialModel = getBrowserTtsModel(DEFAULT_MODEL_ID);
  const [modelId, setModelId] = useState<BrowserTtsModelId>(DEFAULT_MODEL_ID);
  const [sourceMode, setSourceMode] = useState<SourceMode>('single');
  const [text, setText] = useState('');
  const [chapters, setChapters] = useState<BrowserTtsChapter[]>([]);
  const [chapterQueueState, setChapterQueueState] = useState<BrowserTtsChapterQueueState<AudioResult>>(EMPTY_CHAPTER_QUEUE_STATE);
  const [zipFilename, setZipFilename] = useState('');
  const [zipBusy, setZipBusy] = useState(false);
  const [language, setLanguage] = useState(initialModel.defaultLanguage);
  const [voice, setVoice] = useState(initialModel.defaultVoice);
  const [speed, setSpeed] = useState(1.05);
  const [consent, setConsent] = useState(false);
  const [runtimeState, setRuntimeState] = useState<RuntimeState>('idle');
  const [runtimeBackend, setRuntimeBackend] = useState<BrowserTtsBackend | ''>('');
  const [runtimeDtype, setRuntimeDtype] = useState<'fp32' | 'q8' | ''>('');
  const [status, setStatus] = useState('Ready for text');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AudioResult | null>(null);
  const [outputFilename, setOutputFilename] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [importing, setImporting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [browserReadiness, setBrowserReadiness] = useState<BrowserReadiness>('checking');
  const [voicePreferences, setVoicePreferences] = useState<BrowserTtsVoicePreferences>(EMPTY_VOICE_PREFERENCES);
  const workerRef = useRef<Worker | null>(null);
  const activeWorkerModelRef = useRef<BrowserTtsModelId | null>(null);
  const pendingJobRef = useRef<GenerationJob | null>(null);
  const activeJobRef = useRef<GenerationJob | null>(null);
  const resultUrlRef = useRef('');
  const chapterResultUrlsRef = useRef(new Set<string>());
  const fallbackAttemptedRef = useRef(false);
  const operationStartedAtRef = useRef(0);
  const watchdogRef = useRef<number | null>(null);
  const workerLoadedRef = useRef(false);
  const chapterIdRef = useRef(0);
  const chapterQueueRef = useRef<BrowserTtsChapterQueue<AudioResult> | null>(null);
  const chapterAbortRef = useRef<AbortController | null>(null);
  const importOperationRef = useRef(0);
  const voicePreferenceStoreRef = useRef<BrowserTtsVoicePreferencesStore | null>(null);
  const selectedModel = getBrowserTtsModel(modelId);
  const availableVoices = getBrowserTtsVoices(modelId, language);
  const selectedVoice = getBrowserTtsVoice(modelId, voice) ?? availableVoices[0];
  const voiceGroups = getBrowserTtsVoiceGroups(modelId, language);
  const chapterVoiceGroups = getAllBrowserTtsVoiceGroups(modelId);
  const voiceSampleUrl = selectedVoice ? getBrowserTtsVoiceSampleUrl(modelId, selectedVoice.value) : '';
  const selectedVoicePreferenceId = `${modelId}:${voice}`;
  const selectedVoiceIsFavorite = voicePreferences.favorites.includes(selectedVoicePreferenceId);
  const favoriteVoiceChoices = voicePreferences.favorites
    .map((id) => voicePreferenceChoiceById.get(id))
    .filter((item): item is VoicePreferenceChoice => Boolean(item));
  const recentVoiceChoices = voicePreferences.recents
    .filter((id) => !voicePreferences.favorites.includes(id))
    .map((id) => voicePreferenceChoiceById.get(id))
    .filter((item): item is VoicePreferenceChoice => Boolean(item));
  const chapterSourceText = chapters.map((chapter) => chapter.text).join('\n');
  const chapterVoiceCount = new Set(chapters.map((chapter) => chapter.voice ?? voice)).size;
  const activeSourceText = sourceMode === 'single' ? text : chapterSourceText;
  const audioEstimate = estimateBrowserTtsAudio(activeSourceText, speed);
  const chapterFileNames = new Map(
    createBrowserTtsChapterMp3Files(chapters).map((item) => [item.chapterId, item.filename]),
  );
  const sourceLocked = busy || importing;

  useEffect(() => {
    let storage: Storage | null = null;
    try {
      storage = window.localStorage;
    } catch {
      storage = null;
    }
    const store = createBrowserTtsVoicePreferencesStore({
      isKnownVoiceId: (id) => voicePreferenceChoiceById.has(id),
      storage,
    });
    voicePreferenceStoreRef.current = store;
    setVoicePreferences(store.getSnapshot());
  }, []);

  useEffect(() => {
    let cancelled = false;
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu;
    if (!gpu) {
      setBrowserReadiness('compatibility');
      return undefined;
    }
    void gpu.requestAdapter()
      .then((adapter) => {
        if (!cancelled) setBrowserReadiness(adapter ? 'webgpu' : 'compatibility');
      })
      .catch(() => {
        if (!cancelled) setBrowserReadiness('compatibility');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!busy || operationStartedAtRef.current === 0) return undefined;
    const updateElapsed = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - operationStartedAtRef.current) / 1_000)));
    };
    updateElapsed();
    const interval = window.setInterval(updateElapsed, 1_000);
    return () => window.clearInterval(interval);
  }, [busy]);

  useEffect(() => () => {
    clearWatchdog();
    chapterAbortRef.current?.abort();
    workerRef.current?.terminate();
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    for (const url of chapterResultUrlsRef.current) URL.revokeObjectURL(url);
    chapterResultUrlsRef.current.clear();
  }, []);

  function clearWatchdog() {
    if (watchdogRef.current !== null) window.clearTimeout(watchdogRef.current);
    watchdogRef.current = null;
  }

  function clearResult() {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = '';
    setResult(null);
  }

  function clearChapterResults() {
    for (const url of chapterResultUrlsRef.current) URL.revokeObjectURL(url);
    chapterResultUrlsRef.current.clear();
    chapterQueueRef.current = null;
    chapterAbortRef.current = null;
    setChapterQueueState(EMPTY_CHAPTER_QUEUE_STATE);
  }

  function nextChapterId() {
    chapterIdRef.current += 1;
    return `chapter-${chapterIdRef.current}`;
  }

  function handleWorkerStall() {
    const activeModelId = activeWorkerModelRef.current;
    const retryJob = pendingJobRef.current ?? activeJobRef.current;
    workerRef.current?.terminate();
    workerRef.current = null;
    workerLoadedRef.current = false;

    if (activeModelId === 'kokoro-82m' && retryJob && !fallbackAttemptedRef.current) {
      fallbackAttemptedRef.current = true;
      pendingJobRef.current = retryJob;
      activeJobRef.current = null;
      setRuntimeBackend('');
      setRuntimeDtype('');
      setRuntimeState('loading');
      setProgress(0);
      setStatus('High-quality mode paused. Retrying Kokoro compatibility mode');
      setNotice('The browser stopped reporting progress, so the smaller WebAssembly model is loading automatically.');
      operationStartedAtRef.current = Date.now();
      setElapsedSeconds(0);
      const retryWorker = createWorker('kokoro-82m');
      armWatchdog();
      retryWorker.postMessage({ forceWasm: true, type: 'load' } satisfies BrowserTtsWorkerRequest);
      return;
    }

    pendingJobRef.current = null;
    activeJobRef.current = null;
    activeWorkerModelRef.current = null;
    retryJob?.reject?.(Object.assign(new Error('Browser generation timed out.'), { name: 'TimeoutError' }));
    setRuntimeState('error');
    setStatus('Browser generation timed out');
    setError('The browser stopped reporting progress for 90 seconds. The model was unloaded. Try shorter text or generate again.');
    setBusy(false);
    emitTtsAction('Browser speech timeout', 'tts_timeout');
  }

  function armWatchdog() {
    clearWatchdog();
    watchdogRef.current = window.setTimeout(handleWorkerStall, WORKER_STALL_TIMEOUT_MS);
  }

  function resetRuntime(message = 'Ready for text') {
    clearWatchdog();
    workerRef.current?.terminate();
    workerRef.current = null;
    workerLoadedRef.current = false;
    activeWorkerModelRef.current = null;
    pendingJobRef.current = null;
    activeJobRef.current = null;
    setRuntimeState('idle');
    setRuntimeBackend('');
    setRuntimeDtype('');
    setProgress(0);
    setStatus(message);
    setBusy(false);
    operationStartedAtRef.current = 0;
    setElapsedSeconds(0);
  }

  function postGeneration(job: GenerationJob) {
    if (!workerRef.current) {
      setError('The browser speech worker could not start. Reload the page and try again.');
      setBusy(false);
      emitTtsAction('Browser speech unsupported', 'tts_unsupported_browser');
      return;
    }
    activeJobRef.current = job;
    setBusy(true);
    setProgress(0);
    setRuntimeState('generating');
    setStatus(job.chapterName ? `Generating ${job.chapterName}` : 'Generating MP3 in this browser');
    armWatchdog();
    workerRef.current.postMessage(job.request);
  }

  function createAudioResult(data: BrowserTtsWorkerEvent, job: GenerationJob, activeModelId: BrowserTtsModelId, url: string): AudioResult {
    const activeModel = getBrowserTtsModel(activeModelId);
    return {
      audio: data.audio ?? new ArrayBuffer(0),
      backend: data.backend ?? 'wasm',
      bitrateKbps: data.bitrateKbps ?? MP3_BITRATE_KBPS,
      byteLength: data.audio?.byteLength ?? 0,
      durationSeconds: data.durationSeconds ?? 0,
      dtype: data.dtype,
      generationSeconds: data.generationSeconds ?? 0,
      modelId: activeModelId,
      revision: data.revision ?? activeModel.modelRevision,
      sampleRate: data.sampleRate ?? 44_100,
      url,
      voice: job.request.voice,
      chapterId: job.chapterId,
      chapterName: job.chapterName,
    };
  }

  function handleWorkerMessage(event: MessageEvent<BrowserTtsWorkerEvent>) {
    const data = event.data;
    if (data.modelId && activeWorkerModelRef.current && data.modelId !== activeWorkerModelRef.current) return;
    const activeModelId = activeWorkerModelRef.current ?? modelId;
    const activeModel = getBrowserTtsModel(activeModelId);

    if (data.type === 'load-progress' || data.type === 'voice-progress') {
      armWatchdog();
      setStatus(data.message ?? 'Loading browser speech model');
      if (typeof data.current === 'number' && typeof data.total === 'number' && data.total > 0) {
        setProgress(Math.round((data.current / data.total) * 100));
      }
      return;
    }
    if (data.type === 'ready') {
      workerLoadedRef.current = true;
      setRuntimeBackend(data.backend ?? 'wasm');
      setRuntimeDtype(data.dtype ?? '');
      setProgress(100);
      emitTtsAction('Load browser TTS model', 'tts_model_ready');
      const pendingJob = pendingJobRef.current;
      pendingJobRef.current = null;
      if (pendingJob) {
        postGeneration(pendingJob);
        return;
      }
      clearWatchdog();
      setRuntimeState('ready');
      setStatus(`${activeModel.name} ready using ${(data.backend ?? 'wasm').toUpperCase()}`);
      setBusy(false);
      setNotice('The selected model is ready. Your text has not been uploaded or sent to the model host.');
      return;
    }
    if (data.type === 'generation-progress') {
      armWatchdog();
      const value = typeof data.step === 'number' && typeof data.total === 'number' && data.total > 0
        ? Math.round((data.step / data.total) * 100)
        : 0;
      setProgress(value);
      activeJobRef.current?.onProgress?.(value / 100);
      setStatus(data.message ?? `Generating MP3, stage ${data.step ?? 0} of ${data.total ?? QUALITY_PASSES}`);
      return;
    }
    if (data.type === 'result' && data.audio) {
      clearWatchdog();
      const job = activeJobRef.current;
      activeJobRef.current = null;
      if (!job) {
        setRuntimeState('error');
        setStatus('Speech result could not be matched');
        setError('The browser returned audio for an expired request. Generate it again.');
        setBusy(false);
        emitTtsAction('Browser speech response failure', 'tts_generation_failure');
        return;
      }
      const url = URL.createObjectURL(new Blob([data.audio], { type: 'audio/mpeg' }));
      const audioResult = createAudioResult(data, job, activeModelId, url);
      if (job.resolve) {
        chapterResultUrlsRef.current.add(url);
        workerLoadedRef.current = true;
        setRuntimeBackend(data.backend ?? 'wasm');
        setRuntimeDtype(data.dtype ?? '');
        setRuntimeState('ready');
        setProgress(100);
        job.onProgress?.(1);
        job.resolve(audioResult);
        return;
      }
      clearResult();
      resultUrlRef.current = url;
      setResult(audioResult);
      setStatus('Your MP3 is ready');
      setNotice('Listen to or download the MP3 before closing or refreshing this tab.');
      emitTtsAction('Complete browser text to speech MP3', 'tts_complete');
      setRuntimeState('complete');
      setRuntimeBackend(data.backend ?? 'wasm');
      setProgress(100);
      setBusy(false);
      return;
    }
    if (data.type === 'error') {
      clearWatchdog();
      const activeJob = activeJobRef.current;
      const wasGenerating = Boolean(activeJob);
      pendingJobRef.current = null;
      activeJobRef.current = null;
      workerRef.current?.terminate();
      workerRef.current = null;
      activeWorkerModelRef.current = null;
      workerLoadedRef.current = false;
      if (activeJob?.reject) {
        activeJob.reject(new Error(data.message ?? 'Browser speech generation failed.'));
        return;
      }
      setRuntimeState('error');
      setStatus('Speech generation stopped');
      setError(data.message ?? 'Browser speech generation failed.');
      setBusy(false);
      emitTtsAction(
        wasGenerating ? 'Browser speech generation failure' : 'Browser speech model download failure',
        wasGenerating ? 'tts_generation_failure' : 'tts_model_download_failure',
      );
    }
  }

  function createWorker(modelToLoad: BrowserTtsModelId) {
    workerRef.current?.terminate();
    workerLoadedRef.current = false;
    const nextWorker = createModelWorker(modelToLoad);
    activeWorkerModelRef.current = modelToLoad;
    nextWorker.onmessage = handleWorkerMessage;
    nextWorker.onerror = () => {
      clearWatchdog();
      const activeJob = activeJobRef.current ?? pendingJobRef.current;
      pendingJobRef.current = null;
      activeJobRef.current = null;
      workerLoadedRef.current = false;
      if (activeJob?.reject) {
        activeJob.reject(new Error('This browser could not start the speech worker.'));
        return;
      }
      setRuntimeState('error');
      setStatus('Browser worker could not start');
      setError('This browser could not start the speech worker. Try a current desktop browser.');
      setBusy(false);
      emitTtsAction('Browser speech unsupported', 'tts_unsupported_browser');
    };
    nextWorker.onmessageerror = () => {
      clearWatchdog();
      const activeJob = activeJobRef.current ?? pendingJobRef.current;
      pendingJobRef.current = null;
      activeJobRef.current = null;
      workerLoadedRef.current = false;
      if (activeJob?.reject) {
        activeJob.reject(new Error('This browser could not read the speech worker response.'));
        return;
      }
      setRuntimeState('error');
      setStatus('Browser worker response failed');
      setError('This browser could not read the speech worker response. Reload the page and try again.');
      setBusy(false);
      emitTtsAction('Browser speech response failure', 'tts_generation_failure');
    };
    workerRef.current = nextWorker;
    return nextWorker;
  }

  function ensureWorkerForJob(job: GenerationJob) {
    fallbackAttemptedRef.current = false;
    operationStartedAtRef.current = Date.now();
    setElapsedSeconds(0);
    if (workerRef.current && activeWorkerModelRef.current === modelId && workerLoadedRef.current) {
      postGeneration(job);
      return;
    }

    pendingJobRef.current = job;
    setBusy(true);
    setProgress(0);
    setRuntimeState('loading');
    setStatus(`Loading ${selectedModel.name}, ${getBrowserTtsDownloadNote(modelId)}`);
    armWatchdog();
    createWorker(modelId).postMessage({ type: 'load' } satisfies BrowserTtsWorkerRequest);
  }

  function generateChapterAudio(
    chapter: BrowserTtsChapter,
    context: BrowserTtsChapterGenerationContext,
  ) {
    return new Promise<AudioResult>((resolve, reject) => {
      if (context.signal?.aborted) {
        reject(Object.assign(new Error('Chapter generation was cancelled.'), { name: 'AbortError' }));
        return;
      }

      const finish = (callback: () => void) => {
        context.signal?.removeEventListener('abort', handleAbort);
        callback();
      };
      const handleAbort = () => {
        clearWatchdog();
        workerRef.current?.terminate();
        workerRef.current = null;
        workerLoadedRef.current = false;
        activeWorkerModelRef.current = null;
        if (activeJobRef.current?.chapterId === chapter.id) activeJobRef.current = null;
        if (pendingJobRef.current?.chapterId === chapter.id) pendingJobRef.current = null;
        finish(() => reject(Object.assign(new Error('Chapter generation was cancelled.'), { name: 'AbortError' })));
      };
      context.signal?.addEventListener('abort', handleAbort, { once: true });

      const chapterVoice = getBrowserTtsVoice(modelId, chapter.voice ?? voice) ?? selectedVoice;
      if (!chapterVoice) {
        finish(() => reject(new Error('Choose a valid fixed voice for this chapter.')));
        return;
      }

      const job: GenerationJob = {
        chapterId: chapter.id,
        chapterName: chapter.name,
        onProgress: context.onProgress,
        reject: (jobError) => finish(() => reject(jobError)),
        request: {
          type: 'generate',
          language: chapterVoice.language ?? language,
          speed,
          steps: QUALITY_PASSES,
          text: chapter.text.trim(),
          voice: chapterVoice.value,
        },
        resolve: (audioResult) => finish(() => resolve(audioResult)),
      };
      ensureWorkerForJob(job);
    });
  }

  function updateChapterQueueState(nextState: BrowserTtsChapterQueueState<AudioResult>) {
    setChapterQueueState(nextState);
    setProgress(Math.round(nextState.progress * 100));
    if (nextState.activeChapterId) {
      const activeChapter = chapters.find((chapter) => chapter.id === nextState.activeChapterId);
      setStatus(`Generating ${activeChapter?.name ?? 'chapter'} (${nextState.completedCount + 1} of ${nextState.totalCount})`);
    }
  }

  async function finishChapterQueueRun(operation: Promise<BrowserTtsChapterQueueState<AudioResult>>) {
    try {
      const finalState = await operation;
      setChapterQueueState(finalState);
      setProgress(Math.round(finalState.progress * 100));
      if (finalState.status === 'completed') {
        setRuntimeState('complete');
        setStatus(`${finalState.completedCount} chapter MP3${finalState.completedCount === 1 ? '' : 's'} ready`);
        setNotice('Download each chapter or the ZIP before closing or refreshing this tab.');
        emitTtsAction('Complete browser audiobook chapter MP3s', 'tts_chapter_complete');
      } else if (finalState.status === 'failed') {
        setRuntimeState('error');
        setStatus('One chapter needs attention');
        setError('A chapter failed. Completed MP3s are still available, and the failed chapter can be retried once.');
      } else if (finalState.status === 'cancelled') {
        setRuntimeState('idle');
        setStatus('Chapter generation stopped');
        setNotice('Completed chapter MP3s remain available in this tab.');
      }
    } catch (queueError) {
      setRuntimeState('error');
      setStatus('Chapter generation could not continue');
      setError(queueError instanceof Error ? queueError.message : 'The chapter queue could not continue.');
    } finally {
      chapterAbortRef.current = null;
      setBusy(false);
      operationStartedAtRef.current = 0;
      setElapsedSeconds(0);
    }
  }

  function startChapterGeneration() {
    setError('');
    setNotice('');
    if (chapters.length === 0) {
      setError('Add at least one chapter before generating speech.');
      return;
    }
    const emptyChapter = chapters.find((chapter) => !chapter.text.trim());
    if (emptyChapter) {
      setError(`${emptyChapter.name || 'A chapter'} has no text.`);
      return;
    }
    const unnamedChapter = chapters.find((chapter) => !chapter.name.trim());
    if (unnamedChapter) {
      setError('Give every chapter a short name before generating speech.');
      return;
    }
    try {
      getBrowserTtsChapterTotals(chapters);
    } catch (chapterError) {
      setError(chapterError instanceof Error ? chapterError.message : 'The chapter list is not valid.');
      return;
    }
    if (!consent) {
      setError('Confirm that you have permission to use this text and accept the selected model terms.');
      return;
    }

    clearResult();
    clearChapterResults();
    setBusy(true);
    setRuntimeState('loading');
    emitTtsAction('Generate browser audiobook chapter MP3s', 'tts_chapter_generate');
    const queue = new BrowserTtsChapterQueue<AudioResult>(chapters, generateChapterAudio, {
      onStateChange: updateChapterQueueState,
      toErrorMessage: (queueError) => queueError instanceof Error ? queueError.message : 'Chapter generation failed.',
    });
    const controller = new AbortController();
    chapterQueueRef.current = queue;
    chapterAbortRef.current = controller;
    void finishChapterQueueRun(queue.run(controller.signal));
  }

  function retryChapter(chapterId: string) {
    const queue = chapterQueueRef.current;
    if (!queue || busy) return;
    setError('');
    setNotice('Retrying only the failed chapter. Completed MP3s will not be regenerated.');
    setBusy(true);
    setRuntimeState('loading');
    const controller = new AbortController();
    chapterAbortRef.current = controller;
    void finishChapterQueueRun((async () => {
      const retried = await queue.retry(chapterId, controller.signal);
      return retried.status === 'idle' ? queue.run(controller.signal) : retried;
    })());
  }

  function startGeneration() {
    if (sourceMode === 'chapters') {
      startChapterGeneration();
      return;
    }
    const cleanText = text.trim();
    setError('');
    setNotice('');
    if (!cleanText) {
      setError('Paste text or open a TXT file before generating speech.');
      return;
    }
    if (cleanText.length > MAX_TTS_TEXT_CHARACTERS) {
      setError(`Use no more than ${formatCount(MAX_TTS_TEXT_CHARACTERS)} characters at a time.`);
      return;
    }
    if (!consent) {
      setError('Confirm that you have permission to use this text and accept the selected model terms.');
      return;
    }

    clearResult();

    const job: GenerationJob = {
      request: {
        type: 'generate',
        language,
        speed,
        steps: QUALITY_PASSES,
        text: cleanText,
        voice,
      },
    };
    emitTtsAction('Generate browser text to speech MP3', 'tts_generate');
    ensureWorkerForJob(job);
  }

  function chooseModel(nextModelId: BrowserTtsModelId) {
    if (nextModelId === modelId) return;
    const nextModel = getBrowserTtsModel(nextModelId);
    resetRuntime(`Ready to load ${nextModel.name}`);
    clearResult();
    clearChapterResults();
    setModelId(nextModelId);
    setLanguage(nextModel.defaultLanguage);
    setVoice(nextModel.defaultVoice);
    if (chapters.length > 0) setChapters(setAllBrowserTtsChapterVoices(chapters, nextModel.defaultVoice));
    setError('');
    setNotice(`Switched to ${nextModel.name}. Existing chapters now use its default voice.`);
  }

  function chooseLanguage(nextLanguage: string) {
    const nextVoices = getBrowserTtsVoices(modelId, nextLanguage);
    setLanguage(nextLanguage);
    if (!nextVoices.some((item) => item.value === voice)) setVoice(nextVoices[0]?.value ?? selectedModel.defaultVoice);
    clearResult();
    clearChapterResults();
  }

  function chooseVoice(nextVoice: string) {
    setVoice(nextVoice);
    const nextPreferences = voicePreferenceStoreRef.current?.recordRecent(`${modelId}:${nextVoice}`);
    if (nextPreferences) setVoicePreferences(nextPreferences);
    setError('');
    clearResult();
    if (sourceMode === 'chapters') {
      setNotice('Default voice changed. Existing chapter voice choices stay unchanged until you apply it to all.');
    }
  }

  function chooseRememberedVoice(preferenceId: string) {
    const choice = voicePreferenceChoiceById.get(preferenceId);
    if (!choice) return;
    if (choice.modelId !== modelId) {
      resetRuntime(`Ready to load ${choice.modelName}`);
      clearResult();
      clearChapterResults();
      setModelId(choice.modelId);
      if (chapters.length > 0) setChapters(setAllBrowserTtsChapterVoices(chapters, choice.voice));
    }
    setLanguage(choice.language);
    setVoice(choice.voice);
    setError('');
    setNotice(choice.modelId === modelId
      ? `${choice.label} selected as the default voice.`
      : `${choice.label} selected, and existing chapters now use that model-compatible voice.`);
    const nextPreferences = voicePreferenceStoreRef.current?.recordRecent(choice.id);
    if (nextPreferences) setVoicePreferences(nextPreferences);
  }

  function toggleSelectedVoiceFavorite() {
    const nextPreferences = voicePreferenceStoreRef.current?.toggleFavorite(selectedVoicePreferenceId);
    if (!nextPreferences) return;
    setVoicePreferences(nextPreferences);
    setNotice(nextPreferences.favorites.includes(selectedVoicePreferenceId)
      ? 'Voice saved to favorites in this browser.'
      : 'Voice removed from favorites in this browser.');
  }

  function replaceChapters(nextChapters: BrowserTtsChapter[], message = '') {
    setChapters(nextChapters);
    clearChapterResults();
    setError('');
    setNotice(message);
  }

  function chooseSourceMode(nextMode: SourceMode) {
    if (nextMode === sourceMode || busy) return;
    if (nextMode === 'chapters' && chapters.length === 0) {
      const initialChapters = createBrowserTtsChapters(
        [{ name: 'Chapter 1', text, voice }],
        nextChapterId,
      );
      setChapters(initialChapters);
    }
    setSourceMode(nextMode);
    setError('');
    setNotice(nextMode === 'chapters'
      ? 'Chapter mode keeps each section as a separate MP3 and can package them in one ZIP.'
      : 'Single text mode creates one MP3. Your chapter draft remains available if you switch back.');
  }

  function addChapter() {
    try {
      replaceChapters(
        appendBrowserTtsChapter(chapters, { name: `Chapter ${chapters.length + 1}`, text: '', voice }, nextChapterId),
        'Chapter added. The combined chapter text can contain up to 10,000 characters.',
      );
    } catch (chapterError) {
      setError(chapterError instanceof Error ? chapterError.message : 'Another chapter could not be added.');
    }
  }

  function renameChapter(chapterId: string, name: string) {
    replaceChapters(chapters.map((chapter) => chapter.id === chapterId ? { ...chapter, name } : chapter));
  }

  function updateChapterText(chapterId: string, nextText: string) {
    try {
      replaceChapters(editBrowserTtsChapterText(chapters, chapterId, nextText));
    } catch (chapterError) {
      setError(chapterError instanceof Error ? chapterError.message : 'The chapter text could not be changed.');
    }
  }

  function chooseChapterVoice(chapterId: string, nextVoice: string) {
    if (!getBrowserTtsVoice(modelId, nextVoice)) {
      setError('Choose a voice that belongs to the selected browser model.');
      return;
    }
    try {
      replaceChapters(
        setBrowserTtsChapterVoice(chapters, chapterId, nextVoice),
        'Chapter voice updated. Regenerate the chapter set to hear the change.',
      );
      const nextPreferences = voicePreferenceStoreRef.current?.recordRecent(`${modelId}:${nextVoice}`);
      if (nextPreferences) setVoicePreferences(nextPreferences);
    } catch (chapterError) {
      setError(chapterError instanceof Error ? chapterError.message : 'The chapter voice could not be changed.');
    }
  }

  function applyDefaultVoiceToAllChapters() {
    if (chapters.length === 0 || !selectedVoice) return;
    replaceChapters(
      setAllBrowserTtsChapterVoices(chapters, selectedVoice.value),
      `${selectedVoice.label} now applies to every chapter. You can still change individual chapters below.`,
    );
    const nextPreferences = voicePreferenceStoreRef.current?.recordRecent(selectedVoicePreferenceId);
    if (nextPreferences) setVoicePreferences(nextPreferences);
  }

  function removeChapter(chapterId: string) {
    if (chapters.length <= 1) return;
    try {
      replaceChapters(deleteBrowserTtsChapter(chapters, chapterId), 'Chapter removed.');
    } catch (chapterError) {
      setError(chapterError instanceof Error ? chapterError.message : 'The chapter could not be removed.');
    }
  }

  function moveChapter(chapterId: string, toIndex: number) {
    try {
      replaceChapters(moveBrowserTtsChapter(chapters, chapterId, toIndex), 'Chapter order updated.');
    } catch (chapterError) {
      setError(chapterError instanceof Error ? chapterError.message : 'The chapter could not be moved.');
    }
  }

  async function importLocalDocument(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const operationId = importOperationRef.current + 1;
    importOperationRef.current = operationId;
    setError('');
    setNotice('Reading the document in this browser. Nothing is being uploaded.');
    setImporting(true);
    let bytes: Uint8Array | null = null;
    try {
      const lowerName = file.name.toLowerCase();
      bytes = new Uint8Array(await file.arrayBuffer());
      if (importOperationRef.current !== operationId) return;

      if (lowerName.endsWith('.txt')) {
        const metadataError = validateLocalTxtFile(file);
        if (metadataError) throw new Error(metadataError);
        const prepared = prepareLocalTxtContent(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
        if (prepared.error || prepared.text === undefined) throw new Error(prepared.error ?? 'The TXT file could not be read.');
        if (sourceMode === 'chapters') {
          replaceChapters(createBrowserTtsChapters([{ name: 'Chapter 1', text: prepared.text, voice }], nextChapterId));
        } else {
          setText(prepared.text);
          clearResult();
        }
        setNotice('TXT text loaded locally. The file and its name were not uploaded or saved.');
      } else if (lowerName.endsWith('.md') || lowerName.endsWith('.markdown')) {
        const { importBrowserTtsMarkdown } = await import('../lib/browserTtsMarkdownImport');
        if (importOperationRef.current !== operationId) return;
        const imported = importBrowserTtsMarkdown(file, bytes);
        const nextChapters = createBrowserTtsChapters(
          imported.chapters.map((chapter) => ({ name: chapter.title, text: chapter.text, voice })),
          nextChapterId,
        );
        setSourceMode('chapters');
        replaceChapters(nextChapters, `${nextChapters.length} Markdown chapter${nextChapters.length === 1 ? '' : 's'} loaded locally. Review the text before generating.`);
      } else if (lowerName.endsWith('.epub')) {
        const { importBrowserTtsEpub } = await import('../lib/browserTtsEpubImport');
        if (importOperationRef.current !== operationId) return;
        const imported = await importBrowserTtsEpub(file, bytes);
        if (importOperationRef.current !== operationId) return;
        const nextChapters = createBrowserTtsChapters(
          imported.chapters.map((chapter) => ({ name: chapter.title, text: chapter.text, voice })),
          nextChapterId,
        );
        setSourceMode('chapters');
        replaceChapters(nextChapters, `${nextChapters.length} EPUB chapter${nextChapters.length === 1 ? '' : 's'} loaded locally. Review the text before generating.`);
      } else {
        throw new Error('Choose a TXT, Markdown, or EPUB file.');
      }
      if (importOperationRef.current !== operationId) return;
      emitTtsAction('Open local document text', 'tts_document_import');
    } catch (importError) {
      if (importOperationRef.current !== operationId) return;
      if (importError instanceof TypeError && /encoded data/i.test(importError.message)) {
        setError('This text document is not valid UTF-8. Save it as UTF-8 and try again.');
        return;
      }
      setError(importError instanceof Error ? importError.message : 'The document could not be read safely in this browser.');
    } finally {
      bytes?.fill(0);
      if (importOperationRef.current === operationId) setImporting(false);
    }
  }

  function cancelLocalImport() {
    importOperationRef.current += 1;
    setImporting(false);
    setNotice('Document import cancelled. No text was added.');
  }

  function clearText() {
    setText('');
    setNotice('');
    setError('');
    clearResult();
  }

  function stopRuntime(reason: 'cancel' | 'unload') {
    chapterAbortRef.current?.abort();
    chapterAbortRef.current = null;
    resetRuntime();
    setNotice(
      reason === 'cancel'
        ? 'Generation stopped and the in-memory model was unloaded.'
        : 'The model was unloaded. Generated audio stays available until you replace it or leave the page.',
    );
    emitTtsAction(
      reason === 'cancel' ? 'Cancel browser text to speech MP3' : 'Unload browser TTS model',
      reason === 'cancel' ? 'tts_cancel' : 'tts_model_unload',
    );
  }

  function downloadResult() {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = sanitizeMp3Filename(outputFilename, `text-to-speech-${result.modelId}-${result.voice.toLowerCase()}`);
    link.click();
    emitTtsAction('Download browser text to speech MP3', 'tts_download');
  }

  function downloadChapterResult(chapterId: string) {
    const item = chapterQueueState.items.find((candidate) => candidate.chapterId === chapterId);
    if (!item?.result) return;
    const link = document.createElement('a');
    link.href = item.result.url;
    link.download = chapterFileNames.get(chapterId) ?? 'chapter.mp3';
    link.click();
    emitTtsAction('Download browser audiobook chapter MP3', 'tts_chapter_download');
  }

  async function downloadChapterZip() {
    const completedFiles = chapterQueueState.items.flatMap((item) => {
      if (!item.result) return [];
      return [{
        audio: item.result.audio,
        filename: chapterFileNames.get(item.chapterId) ?? 'chapter.mp3',
      }];
    });
    if (completedFiles.length === 0 || zipBusy) return;
    setZipBusy(true);
    setError('');
    try {
      const { createBrowserTtsChapterZip, sanitizeBrowserTtsZipFilename } = await import('../lib/browserTtsArchive');
      const blob = await createBrowserTtsChapterZip(completedFiles);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = sanitizeBrowserTtsZipFilename(zipFilename);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
      emitTtsAction('Download browser audiobook chapter ZIP', 'tts_chapter_zip_download');
    } catch (zipError) {
      setError(zipError instanceof Error ? zipError.message : 'The chapter ZIP could not be created in this browser.');
    } finally {
      setZipBusy(false);
    }
  }

  const readinessMessage = browserReadiness === 'checking'
    ? 'Checking whether this browser has a WebGPU adapter.'
    : browserReadiness === 'webgpu'
      ? 'WebGPU adapter detected. Kokoro full precision can be attempted, with compatibility fallback available.'
      : 'No WebGPU adapter detected. Kokoro will use its smaller q8 compatibility path.';

  return (
    <section className="tts-audiobook" aria-labelledby="tts-audiobook-heading">
      <header className="tts-audiobook__header">
        <div>
          <p className="tts-audiobook__eyebrow">Runs on your device through this website</p>
          <h2 id="tts-audiobook-heading">Turn text into a downloadable MP3</h2>
          <p>Paste text or build named chapters, choose a browser model and voice, then download one MP3 or an ordered chapter set. Your text stays in this browser.</p>
        </div>
        <div className="tts-audiobook__limits" role="group" aria-label="Text to speech limits">
          <span><ShieldCheck aria-hidden="true" size={18} /> Text stays in this browser</span>
          <span><FileText aria-hidden="true" size={18} /> Text or chapters, 10,000 characters combined</span>
          <span><FileAudio aria-hidden="true" size={18} /> MP3 or chapter ZIP</span>
        </div>
      </header>

      <div className="tts-audiobook__canary" role="note">
        <strong>No paid server or upload queue</strong>
        <p>
          The first generation downloads {getBrowserTtsDownloadNote(modelId)} for {selectedModel.name} from Hugging Face.
          {' '}{selectedModel.backendNote}. Only the selected model and voice load.
        </p>
      </div>

      <div className="tts-audiobook__grid">
        <section className="tts-audiobook__panel" aria-labelledby="tts-source-heading">
          <div className="tts-audiobook__panel-heading">
            <span><FileText aria-hidden="true" size={20} /></span>
            <div>
              <h3 id="tts-source-heading">1. Add your text</h3>
              <p>Create one MP3 or an ordered set of chapter MP3s</p>
            </div>
          </div>
          <div className="tts-audiobook__source-mode" role="group" aria-label="Audio output structure">
            <button type="button" aria-pressed={sourceMode === 'single'} disabled={sourceLocked} onClick={() => chooseSourceMode('single')}>
              <FileAudio aria-hidden="true" size={17} /> Single MP3
            </button>
            <button type="button" aria-pressed={sourceMode === 'chapters'} disabled={sourceLocked} onClick={() => chooseSourceMode('chapters')}>
              <Files aria-hidden="true" size={17} /> Chapter MP3s
            </button>
          </div>

          <div className="tts-audiobook__source-actions">
            <label className="tts-audiobook__file-button" htmlFor="tts-source-file">
              <FileUp aria-hidden="true" size={18} /> Open local document
              <input
                id="tts-source-file"
                data-clarity-mask="true"
                type="file"
                accept=".txt,.md,.markdown,.epub,text/plain,text/markdown,text/x-markdown,application/epub+zip"
                disabled={sourceLocked}
                onChange={importLocalDocument}
              />
            </label>
            {importing && (
              <button type="button" className="tts-audiobook__cancel" data-aft-analytics-manual="true" onClick={cancelLocalImport}>
                <Square aria-hidden="true" size={15} /> Cancel import
              </button>
            )}
            <span>TXT or Markdown up to 64 KB, or EPUB up to 8 MB. Parsing stays in this tab.</span>
          </div>

          {sourceMode === 'single' ? (
            <>
              <label htmlFor="tts-source-text">Text to turn into speech</label>
              <textarea
                id="tts-source-text"
                data-clarity-mask="true"
                dir="auto"
                value={text}
                disabled={sourceLocked}
                maxLength={MAX_TTS_TEXT_CHARACTERS}
                placeholder="Paste the text you want to hear."
                onChange={(event) => {
                  setText(event.target.value);
                  setError('');
                  clearResult();
                }}
              />
              <div className="tts-audiobook__source-meta">
                <span>{formatCount(text.length)} / {formatCount(MAX_TTS_TEXT_CHARACTERS)} characters</span>
                <button type="button" className="icon-button" data-aft-analytics-manual="true" disabled={sourceLocked || !text} aria-label="Clear text" title="Clear text" onClick={clearText}>
                  <RotateCcw aria-hidden="true" size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="tts-audiobook__chapters" data-clarity-mask="true">
              <div className="tts-audiobook__chapters-heading">
                <div>
                  <strong>{chapters.length} chapter{chapters.length === 1 ? '' : 's'}</strong>
                  <span>{formatCount(chapters.reduce((total, chapter) => total + chapter.text.length, 0))} / {formatCount(MAX_TTS_TEXT_CHARACTERS)} characters combined</span>
                  <span>{chapterVoiceCount} voice{chapterVoiceCount === 1 ? '' : 's'} assigned</span>
                </div>
                <button type="button" data-aft-analytics-manual="true" disabled={sourceLocked} onClick={addChapter}>
                  <Plus aria-hidden="true" size={17} /> Add chapter
                </button>
              </div>
              <ol className="tts-audiobook__chapter-list">
                {chapters.map((chapter, index) => {
                  const assignedVoice = getBrowserTtsVoice(modelId, chapter.voice ?? voice) ?? selectedVoice;
                  return (
                  <li key={chapter.id} className="tts-audiobook__chapter">
                    <div className="tts-audiobook__chapter-toolbar">
                      <strong>Chapter {index + 1}</strong>
                      <div>
                        <button type="button" className="icon-button" disabled={sourceLocked || index === 0} aria-label={`Move ${chapter.name || `chapter ${index + 1}`} up`} title="Move up" onClick={() => moveChapter(chapter.id, index - 1)}>
                          <ChevronUp aria-hidden="true" size={18} />
                        </button>
                        <button type="button" className="icon-button" disabled={sourceLocked || index === chapters.length - 1} aria-label={`Move ${chapter.name || `chapter ${index + 1}`} down`} title="Move down" onClick={() => moveChapter(chapter.id, index + 1)}>
                          <ChevronDown aria-hidden="true" size={18} />
                        </button>
                        <button type="button" className="icon-button is-danger" disabled={sourceLocked || chapters.length === 1} aria-label={`Delete ${chapter.name || `chapter ${index + 1}`}`} title="Delete chapter" onClick={() => removeChapter(chapter.id)}>
                          <Trash2 aria-hidden="true" size={17} />
                        </button>
                      </div>
                    </div>
                    <label htmlFor={`tts-chapter-name-${chapter.id}`}>Chapter name</label>
                    <input
                      id={`tts-chapter-name-${chapter.id}`}
                      data-clarity-mask="true"
                      type="text"
                      value={chapter.name}
                      maxLength={120}
                      disabled={sourceLocked}
                      onChange={(event) => renameChapter(chapter.id, event.target.value)}
                    />
                    <div className="tts-audiobook__chapter-voice">
                      <label htmlFor={`tts-chapter-voice-${chapter.id}`}>Voice for this chapter</label>
                      <select
                        id={`tts-chapter-voice-${chapter.id}`}
                        value={assignedVoice?.value ?? voice}
                        disabled={sourceLocked}
                        onChange={(event) => chooseChapterVoice(chapter.id, event.target.value)}
                      >
                        {chapterVoiceGroups.map((group) => (
                          <optgroup key={group.label} label={group.label}>
                            {group.voices.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                          </optgroup>
                        ))}
                      </select>
                      <span>
                        {assignedVoice?.description ?? 'Fixed voice from the selected browser model.'}
                        {assignedVoice?.language ? ` Its ${assignedVoice.language === 'en-gb' ? 'UK' : 'US'} English dialect is used for this chapter.` : ''}
                      </span>
                    </div>
                    <label htmlFor={`tts-chapter-text-${chapter.id}`}>Chapter text</label>
                    <textarea
                      id={`tts-chapter-text-${chapter.id}`}
                      data-clarity-mask="true"
                      dir="auto"
                      value={chapter.text}
                      maxLength={MAX_TTS_TEXT_CHARACTERS}
                      disabled={sourceLocked}
                      placeholder="Paste this chapter's text."
                      onChange={(event) => updateChapterText(chapter.id, event.target.value)}
                    />
                    <span>{formatCount(chapter.text.length)} characters</span>
                  </li>
                  );
                })}
              </ol>
            </div>
          )}
        </section>

        <section className="tts-audiobook__panel" aria-labelledby="tts-voice-heading">
          <div className="tts-audiobook__panel-heading">
            <span><Volume2 aria-hidden="true" size={20} /></span>
            <div>
              <h3 id="tts-voice-heading">2. Choose model and voice</h3>
              <p>Pick multilingual coverage or higher-quality English speech</p>
            </div>
          </div>

          <fieldset className="tts-audiobook__models" disabled={busy}>
            <legend>Browser speech model</legend>
            <div>
              {Object.values(browserTtsModels).map((model) => (
                <label key={model.id} className={modelId === model.id ? 'is-selected' : ''}>
                  <input
                    type="radio"
                    name="tts-model"
                    value={model.id}
                    checked={modelId === model.id}
                    onChange={() => chooseModel(model.id)}
                  />
                  <strong>{model.name}</strong>
                  <span>{model.recommendation}</span>
                  <small>{model.description} First use: {getBrowserTtsDownloadNote(model.id)}.</small>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={`tts-audiobook__readiness is-${browserReadiness}`} role="status">
            <Cpu aria-hidden="true" size={19} />
            <div>
              <strong>Browser readiness</strong>
              <span>{readinessMessage}</span>
            </div>
          </div>

          <label htmlFor="tts-language">Text language</label>
          <select id="tts-language" value={language} disabled={busy} onChange={(event) => chooseLanguage(event.target.value)}>
            {selectedModel.languages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <p className="tts-audiobook__help">
            {modelId === 'supertonic-3'
              ? 'Choose the language when you know it. Best effort is not language detection.'
              : 'The official Kokoro browser path currently supports US and UK English only.'}
          </p>

          <div className="tts-audiobook__voice-picker">
            <div className="tts-audiobook__voice-label-row">
              <label htmlFor="tts-voice">{sourceMode === 'chapters' ? 'Default chapter voice' : 'Fixed voice'}</label>
              <button
                type="button"
                className="icon-button tts-audiobook__favorite-voice"
                data-aft-analytics-manual="true"
                disabled={busy || !selectedVoice}
                aria-label={selectedVoiceIsFavorite ? 'Remove selected voice from favorites' : 'Add selected voice to favorites'}
                aria-pressed={selectedVoiceIsFavorite}
                title={selectedVoiceIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
                onClick={toggleSelectedVoiceFavorite}
              >
                <Star aria-hidden="true" fill={selectedVoiceIsFavorite ? 'currentColor' : 'none'} size={18} />
              </button>
            </div>
            <select
              id="tts-voice"
              value={voice}
              disabled={busy}
              aria-describedby="tts-selected-voice"
              onChange={(event) => chooseVoice(event.target.value)}
            >
              {voiceGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.voices.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </optgroup>
              ))}
            </select>
            {selectedVoice && (
              <div id="tts-selected-voice" className="tts-audiobook__voice-summary" aria-live="polite">
                <div>
                  <strong>{selectedVoice.label}</strong>
                  <span>{selectedVoice.description}</span>
                </div>
                {sourceMode === 'chapters' && chapters.length > 0 && (
                  <button
                    type="button"
                    data-aft-analytics-manual="true"
                    disabled={sourceLocked}
                    onClick={applyDefaultVoiceToAllChapters}
                  >
                    Apply to all chapters
                  </button>
                )}
              </div>
            )}
            {sourceMode === 'chapters' && (
              <p className="tts-audiobook__help">
                This default is used for new chapters. Use the chapter selectors to cast different voices without loading another model.
              </p>
            )}
            {(favoriteVoiceChoices.length > 0 || recentVoiceChoices.length > 0) && (
              <div className="tts-audiobook__remembered-voices">
                <label htmlFor="tts-remembered-voice">Favorites and recent voices</label>
                <select
                  id="tts-remembered-voice"
                  value=""
                  disabled={busy}
                  onChange={(event) => chooseRememberedVoice(event.target.value)}
                >
                  <option value="">Choose a saved or recent voice</option>
                  {favoriteVoiceChoices.length > 0 && (
                    <optgroup label="Favorites">
                      {favoriteVoiceChoices.map((item) => (
                        <option key={item.id} value={item.id}>{item.label} - {item.modelName}</option>
                      ))}
                    </optgroup>
                  )}
                  {recentVoiceChoices.length > 0 && (
                    <optgroup label="Recently used">
                      {recentVoiceChoices.map((item) => (
                        <option key={item.id} value={item.id}>{item.label} - {item.modelName}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <span>Only voice IDs are saved in this browser. Your text is never stored here.</span>
              </div>
            )}
          </div>

          <label htmlFor="tts-speed">Reading speed: {speed.toFixed(2)}x</label>
          <input
            id="tts-speed"
            type="range"
            min="0.9"
            max="1.5"
            step="0.05"
            value={speed}
            disabled={busy}
            onChange={(event) => {
              setSpeed(Number(event.target.value));
              clearResult();
              clearChapterResults();
            }}
          />

          {selectedVoice && voiceSampleUrl && (
            <div className="tts-audiobook__voice-sample" data-clarity-mask="true">
              <div>
                <strong>Hear {selectedVoice.label}</strong>
                <span>Pre-recorded at 1.0x. Playing this sample does not load the speech model or use your text.</span>
              </div>
              <audio
                key={`${modelId}-${selectedVoice.value}`}
                controls
                preload="none"
                src={voiceSampleUrl}
                aria-label={`${selectedVoice.label} voice sample`}
                onPlay={() => {
                  const nextPreferences = voicePreferenceStoreRef.current?.recordRecent(selectedVoicePreferenceId);
                  if (nextPreferences) setVoicePreferences(nextPreferences);
                  emitTtsAction('Play fixed voice sample', 'tts_voice_sample_play');
                }}
              />
            </div>
          )}
        </section>
      </div>

      <section className="tts-audiobook__job" data-clarity-mask="true" aria-labelledby="tts-job-heading">
        <div className="tts-audiobook__job-heading">
          <span>{runtimeState === 'complete' ? <CheckCircle2 aria-hidden="true" /> : runtimeState === 'idle' ? <Cpu aria-hidden="true" /> : <LoaderCircle className={busy ? 'spin' : ''} aria-hidden="true" />}</span>
          <div aria-live="polite" aria-atomic="true">
            <p className="tts-audiobook__eyebrow">Browser speech</p>
            <h3 id="tts-job-heading">{status}</h3>
          </div>
        </div>

        {busy && (
          <div className="tts-audiobook__loading-scene" aria-hidden="true">
            <div className="tts-audiobook__loading-art">
              <img src="/tool-art/text-to-speech-audiobook-generator-tool.webp" alt="" width="1200" height="630" />
            </div>
            <div className="tts-audiobook__loading-copy">
              <div className="tts-audiobook__sound-wave"><span /><span /><span /><span /><span /></div>
              <strong>
                {runtimeState === 'loading'
                  ? 'Warming up the voice studio'
                  : 'Turning your text into sound'}
              </strong>
              <span>{elapsedSeconds} seconds elapsed. Keep this tab open while the browser works.</span>
            </div>
          </div>
        )}

        {runtimeState !== 'idle' && (
          <div
            className={`tts-audiobook__progress${busy && progress === 0 ? ' is-indeterminate' : ''}`}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={busy && progress === 0 ? undefined : progress}
            aria-valuetext={busy && progress === 0 ? status : `${progress}%`}
            aria-label="Text to speech progress"
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        )}
        <div className="tts-audiobook__job-stats" aria-live="polite">
          <span>{selectedModel.name}</span>
          {sourceMode === 'chapters' && chapters.length > 0 && <span>{chapterVoiceCount} chapter voice{chapterVoiceCount === 1 ? '' : 's'}</span>}
          <span>{runtimeBackend ? `${runtimeBackend.toUpperCase()} backend` : selectedModel.backendNote}</span>
          {runtimeDtype && <span>{runtimeDtype === 'fp32' ? 'Full precision' : 'q8 compatibility'}</span>}
          {busy && <span>{elapsedSeconds}s elapsed</span>}
          <span>Revision {selectedModel.modelRevision.slice(0, 8)}</span>
          <span>No text upload</span>
        </div>

        {audioEstimate.status === 'ready' && (
          <div className="tts-audiobook__estimate" role="note" aria-label="Estimated audio length and MP3 size">
            <Timer aria-hidden="true" size={20} />
            <div>
              <strong>Before you download the model</strong>
              <span>
                Estimated audio: {formatEstimateRange(audioEstimate.durationSeconds)}. Estimated 128 kbps MP3: {formatByteRange(audioEstimate.mp3Bytes)}.
              </span>
              <small>Speech, punctuation, language, and voice affect the final result, so this is a range rather than a promise.</small>
            </div>
          </div>
        )}

        <label className="tts-audiobook__consent">
          <input type="checkbox" checked={consent} disabled={busy} onChange={(event) => setConsent(event.target.checked)} />
          <span>I have permission to use this text and accept the selected model terms.</span>
        </label>
        <p className="tts-audiobook__terms">
          <a href={selectedModel.licenseUrl} rel="noreferrer" target="_blank">Read {selectedModel.licenseLabel}</a>
        </p>

        <div className="tts-audiobook__runtime-actions">
          {!['loading', 'generating'].includes(runtimeState) && (
            <>
              <button type="button" className="tts-audiobook__generate" data-aft-analytics-manual="true" disabled={busy} onClick={startGeneration}>
                <Volume2 aria-hidden="true" size={19} /> {sourceMode === 'chapters'
                  ? (chapterQueueState.completedCount > 0 ? 'Generate chapter set again' : 'Generate chapter MP3s')
                  : (result ? 'Generate another MP3' : 'Generate MP3')}
              </button>
              {workerRef.current && (
                <button type="button" className="tts-audiobook__cancel" data-aft-analytics-manual="true" onClick={() => stopRuntime('unload')}>
                  <Square aria-hidden="true" size={16} /> Unload model
                </button>
              )}
            </>
          )}
          {['loading', 'generating'].includes(runtimeState) && (
            <button type="button" className="tts-audiobook__cancel" data-aft-analytics-manual="true" onClick={() => stopRuntime('cancel')}>
              <Square aria-hidden="true" size={16} /> Stop
            </button>
          )}
        </div>

        {result && (
          <div className="tts-audiobook__downloads">
            <audio controls preload="metadata" src={result.url} aria-label="Generated MP3 playback" />
            <div className="tts-audiobook__result-meta">
              <span>{getBrowserTtsModel(result.modelId).name}</span>
              {result.dtype && <span>{result.dtype === 'fp32' ? 'Full precision' : 'q8 compatibility'}</span>}
              <span>{formatSeconds(result.durationSeconds)} audio</span>
              <span>{formatSeconds(result.generationSeconds)} generation</span>
              <span>{result.bitrateKbps} kbps MP3</span>
              <span>{formatBytes(result.byteLength)}</span>
              <span>{result.sampleRate / 1_000} kHz source</span>
            </div>
            <div className="tts-audiobook__filename">
              <label htmlFor="tts-output-filename">MP3 filename (optional)</label>
              <input
                id="tts-output-filename"
                data-clarity-mask="true"
                type="text"
                value={outputFilename}
                maxLength={90}
                placeholder={`text-to-speech-${result.modelId}-${result.voice.toLowerCase()}.mp3`}
                onChange={(event) => setOutputFilename(event.target.value)}
              />
              <span>Unsafe filename characters are replaced. The download always ends in .mp3.</span>
            </div>
            <button type="button" data-aft-analytics-manual="true" onClick={downloadResult}>
              <Download aria-hidden="true" size={18} /> Download MP3
            </button>
            <p>The MP3 exists only in this tab until you download it.</p>
          </div>
        )}

        {sourceMode === 'chapters' && chapterQueueState.items.length > 0 && (
          <div className="tts-audiobook__chapter-results" aria-label="Chapter MP3 results">
            <div className="tts-audiobook__chapter-results-heading">
              <div>
                <strong>Chapter downloads</strong>
                <span>{chapterQueueState.completedCount} of {chapterQueueState.totalCount} ready</span>
              </div>
            </div>
            <ol>
              {chapterQueueState.items.map((item, index) => {
                const chapter = chapters.find((candidate) => candidate.id === item.chapterId);
                return (
                  <li key={item.chapterId} className={`is-${item.status}`}>
                    <div>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <strong>{chapter?.name ?? `Chapter ${index + 1}`}</strong>
                        <small>
                          {item.status === 'completed' && item.result
                            ? `${getBrowserTtsVoice(item.result.modelId, item.result.voice)?.label ?? item.result.voice} voice, ${formatSeconds(item.result.durationSeconds)} MP3, ${formatBytes(item.result.byteLength)}`
                            : item.status === 'failed'
                              ? (item.error ?? 'Generation failed.')
                              : item.status === 'running'
                                ? `${Math.round(item.progress * 100)}% generated`
                                : item.status === 'cancelled'
                                  ? 'Stopped before completion'
                                  : 'Waiting'}
                        </small>
                      </div>
                    </div>
                    {item.status === 'completed' && item.result && (
                      <button type="button" data-aft-analytics-manual="true" onClick={() => downloadChapterResult(item.chapterId)}>
                        <Download aria-hidden="true" size={17} /> MP3
                      </button>
                    )}
                    {item.status === 'failed' && item.retryCount < 1 && (
                      <button type="button" data-aft-analytics-manual="true" disabled={busy} onClick={() => retryChapter(item.chapterId)}>
                        <RotateCcw aria-hidden="true" size={17} /> Retry
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
            {chapterQueueState.completedCount > 0 && (
              <div className="tts-audiobook__zip-download" data-clarity-mask="true">
                <label htmlFor="tts-zip-filename">ZIP filename (optional)</label>
                <div>
                  <input
                    id="tts-zip-filename"
                    type="text"
                    value={zipFilename}
                    maxLength={90}
                    placeholder="audiobook-chapters.zip"
                    disabled={zipBusy}
                    onChange={(event) => setZipFilename(event.target.value)}
                  />
                  <button type="button" data-aft-analytics-manual="true" disabled={zipBusy} onClick={() => void downloadChapterZip()}>
                    <Download aria-hidden="true" size={17} /> {zipBusy ? 'Creating ZIP' : `Download ${chapterQueueState.completedCount === chapterQueueState.totalCount ? 'all' : 'completed'} as ZIP`}
                  </button>
                </div>
                <span>The ZIP contains only the separate MP3 files, in chapter order. It does not contain your text or source document.</span>
              </div>
            )}
            <p>Each result stays in this tab only. A stopped or failed chapter does not erase completed MP3s.</p>
          </div>
        )}
      </section>

      <div className="tts-audiobook__messages" aria-live="polite">
        {error && <p role="alert" className="tts-audiobook__error">{error}</p>}
        {!error && notice && <p className="tts-audiobook__notice">{notice}</p>}
      </div>
    </section>
  );
}
