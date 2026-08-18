import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  CheckCircle2,
  Cpu,
  Download,
  FileAudio,
  FileText,
  FileUp,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Square,
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
  browserTtsModels,
  getBrowserTtsDownloadNote,
  getBrowserTtsModel,
  getBrowserTtsVoice,
  getBrowserTtsVoiceGroups,
  getBrowserTtsVoiceSampleUrl,
  getBrowserTtsVoices,
  type BrowserTtsModelId,
} from '../lib/browserTtsModels';
import type {
  BrowserTtsBackend,
  BrowserTtsWorkerEvent,
  BrowserTtsWorkerRequest,
} from '../lib/browserTtsWorkerTypes';

type BrowserReadiness = 'checking' | 'compatibility' | 'webgpu';
type RuntimeState = 'complete' | 'error' | 'generating' | 'idle' | 'loading' | 'ready';
type GenerationRequest = Extract<BrowserTtsWorkerRequest, { type: 'generate' }>;

interface GenerationJob {
  request: GenerationRequest;
}

interface AudioResult {
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
}

const MP3_BITRATE_KBPS = 128;
const QUALITY_PASSES = 8;
const DEFAULT_MODEL_ID: BrowserTtsModelId = 'supertonic-3';
const WORKER_STALL_TIMEOUT_MS = 90_000;

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

function createModelWorker(modelId: BrowserTtsModelId) {
  if (modelId === 'kokoro-82m') {
    return new Worker(new URL('../workers/kokoro.worker.ts', import.meta.url), { type: 'module' });
  }
  return new Worker(new URL('../workers/supertonic.worker.ts', import.meta.url), { type: 'module' });
}

export default function TextToSpeechAudiobookGenerator() {
  const initialModel = getBrowserTtsModel(DEFAULT_MODEL_ID);
  const [modelId, setModelId] = useState<BrowserTtsModelId>(DEFAULT_MODEL_ID);
  const [text, setText] = useState('');
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
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [browserReadiness, setBrowserReadiness] = useState<BrowserReadiness>('checking');
  const workerRef = useRef<Worker | null>(null);
  const activeWorkerModelRef = useRef<BrowserTtsModelId | null>(null);
  const pendingJobRef = useRef<GenerationJob | null>(null);
  const activeJobRef = useRef<GenerationJob | null>(null);
  const resultUrlRef = useRef('');
  const fallbackAttemptedRef = useRef(false);
  const operationStartedAtRef = useRef(0);
  const watchdogRef = useRef<number | null>(null);
  const selectedModel = getBrowserTtsModel(modelId);
  const availableVoices = getBrowserTtsVoices(modelId, language);
  const selectedVoice = getBrowserTtsVoice(modelId, voice) ?? availableVoices[0];
  const voiceGroups = getBrowserTtsVoiceGroups(modelId, language);
  const voiceSampleUrl = selectedVoice ? getBrowserTtsVoiceSampleUrl(modelId, selectedVoice.value) : '';

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
    workerRef.current?.terminate();
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
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

  function handleWorkerStall() {
    const activeModelId = activeWorkerModelRef.current;
    const retryJob = pendingJobRef.current ?? activeJobRef.current;
    workerRef.current?.terminate();
    workerRef.current = null;

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
    setStatus('Generating MP3 in this browser');
    armWatchdog();
    workerRef.current.postMessage(job.request);
  }

  function createAudioResult(data: BrowserTtsWorkerEvent, job: GenerationJob, activeModelId: BrowserTtsModelId, url: string): AudioResult {
    const activeModel = getBrowserTtsModel(activeModelId);
    return {
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
      const wasGenerating = Boolean(activeJobRef.current);
      pendingJobRef.current = null;
      activeJobRef.current = null;
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
    const nextWorker = createModelWorker(modelToLoad);
    activeWorkerModelRef.current = modelToLoad;
    nextWorker.onmessage = handleWorkerMessage;
    nextWorker.onerror = () => {
      clearWatchdog();
      pendingJobRef.current = null;
      activeJobRef.current = null;
      setRuntimeState('error');
      setStatus('Browser worker could not start');
      setError('This browser could not start the speech worker. Try a current desktop browser.');
      setBusy(false);
      emitTtsAction('Browser speech unsupported', 'tts_unsupported_browser');
    };
    nextWorker.onmessageerror = () => {
      clearWatchdog();
      pendingJobRef.current = null;
      activeJobRef.current = null;
      setRuntimeState('error');
      setStatus('Browser worker response failed');
      setError('This browser could not read the speech worker response. Reload the page and try again.');
      setBusy(false);
      emitTtsAction('Browser speech response failure', 'tts_generation_failure');
    };
    workerRef.current = nextWorker;
    return nextWorker;
  }

  function startGeneration() {
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
    fallbackAttemptedRef.current = false;
    operationStartedAtRef.current = Date.now();
    setElapsedSeconds(0);

    if (
      workerRef.current
      && activeWorkerModelRef.current === modelId
      && ['ready', 'complete'].includes(runtimeState)
    ) {
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

  function chooseModel(nextModelId: BrowserTtsModelId) {
    if (nextModelId === modelId) return;
    const nextModel = getBrowserTtsModel(nextModelId);
    resetRuntime(`Ready to load ${nextModel.name}`);
    clearResult();
    setModelId(nextModelId);
    setLanguage(nextModel.defaultLanguage);
    setVoice(nextModel.defaultVoice);
    setError('');
    setNotice(`Switched to ${nextModel.name}. No model has been downloaded yet.`);
  }

  function chooseLanguage(nextLanguage: string) {
    const nextVoices = getBrowserTtsVoices(modelId, nextLanguage);
    setLanguage(nextLanguage);
    if (!nextVoices.some((item) => item.value === voice)) setVoice(nextVoices[0]?.value ?? selectedModel.defaultVoice);
    clearResult();
  }

  function chooseVoice(nextVoice: string) {
    setVoice(nextVoice);
    setError('');
    clearResult();
  }

  async function importTxtFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    setError('');
    setNotice('');
    const metadataError = validateLocalTxtFile(file);
    if (metadataError) {
      setError(metadataError);
      return;
    }
    try {
      const prepared = prepareLocalTxtContent(await file.text());
      if (prepared.error || prepared.text === undefined) {
        setError(prepared.error ?? 'The TXT file could not be read.');
        return;
      }
      setText(prepared.text);
      clearResult();
      setNotice('TXT text loaded in this browser. The file was not uploaded.');
      emitTtsAction('Open local TXT text', 'tts_txt_import');
    } catch {
      setError('The TXT file could not be read in this browser.');
    }
  }

  function clearText() {
    setText('');
    setNotice('');
    setError('');
    clearResult();
  }

  function stopRuntime(reason: 'cancel' | 'unload') {
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
          <p>Paste text or open a local TXT file, choose a browser model and voice, then generate and download the MP3. Your text stays in this browser.</p>
        </div>
        <div className="tts-audiobook__limits" role="group" aria-label="Text to speech limits">
          <span><ShieldCheck aria-hidden="true" size={18} /> Text stays in this browser</span>
          <span><FileText aria-hidden="true" size={18} /> Text or TXT, up to 10,000 characters</span>
          <span><FileAudio aria-hidden="true" size={18} /> 128 kbps MP3 download</span>
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
              <h3 id="tts-source-heading">1. Paste or open your text</h3>
              <p>Use text you wrote or have permission to convert</p>
            </div>
          </div>
          <div className="tts-audiobook__source-actions">
            <label className="tts-audiobook__file-button" htmlFor="tts-source-file">
              <FileUp aria-hidden="true" size={18} /> Open TXT file
              <input
                id="tts-source-file"
                data-clarity-mask="true"
                type="file"
                accept=".txt,text/plain"
                disabled={busy}
                onChange={importTxtFile}
              />
            </label>
            <span>Plain text only, 64 KB maximum. Nothing is uploaded.</span>
          </div>
          <label htmlFor="tts-source-text">Text to turn into speech</label>
          <textarea
            id="tts-source-text"
            data-clarity-mask="true"
            dir="auto"
            value={text}
            disabled={busy}
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
            <button type="button" className="icon-button" data-aft-analytics-manual="true" disabled={busy || !text} aria-label="Clear text" title="Clear text" onClick={clearText}>
              <RotateCcw aria-hidden="true" size={18} />
            </button>
          </div>
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
            <label htmlFor="tts-voice">Fixed voice</label>
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
                <strong>{selectedVoice.label}</strong>
                <span>{selectedVoice.description}</span>
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
                onPlay={() => emitTtsAction('Play fixed voice sample', 'tts_voice_sample_play')}
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
          <span>{runtimeBackend ? `${runtimeBackend.toUpperCase()} backend` : selectedModel.backendNote}</span>
          {runtimeDtype && <span>{runtimeDtype === 'fp32' ? 'Full precision' : 'q8 compatibility'}</span>}
          {busy && <span>{elapsedSeconds}s elapsed</span>}
          <span>Revision {selectedModel.modelRevision.slice(0, 8)}</span>
          <span>No text upload</span>
        </div>

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
                <Volume2 aria-hidden="true" size={19} /> {result ? 'Generate another MP3' : 'Generate MP3'}
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
      </section>

      <div className="tts-audiobook__messages" aria-live="polite">
        {error && <p role="alert" className="tts-audiobook__error">{error}</p>}
        {!error && notice && <p className="tts-audiobook__notice">{notice}</p>}
      </div>
    </section>
  );
}
