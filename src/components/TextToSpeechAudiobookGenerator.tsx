import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Cpu,
  Download,
  FileAudio,
  FileText,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Square,
  Volume2,
} from 'lucide-react';

import { emitAftToolAction } from '../lib/aftToolAnalytics';
import {
  browserTtsModels,
  getBrowserTtsDownloadNote,
  getBrowserTtsModel,
  getBrowserTtsVoices,
  type BrowserTtsModelId,
} from '../lib/browserTtsModels';
import type {
  BrowserTtsBackend,
  BrowserTtsWorkerEvent,
  BrowserTtsWorkerRequest,
} from '../lib/browserTtsWorkerTypes';

type RuntimeState = 'complete' | 'error' | 'generating' | 'idle' | 'loading' | 'ready';
type GenerationRequest = Extract<BrowserTtsWorkerRequest, { type: 'generate' }>;

interface AudioResult {
  backend: BrowserTtsBackend;
  bitrateKbps: number;
  durationSeconds: number;
  dtype?: 'fp32' | 'q8';
  generationSeconds: number;
  modelId: BrowserTtsModelId;
  revision: string;
  sampleRate: number;
  url: string;
  voice: string;
}

const MAX_TEXT_CHARACTERS = 10_000;
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
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const activeWorkerModelRef = useRef<BrowserTtsModelId | null>(null);
  const pendingRequestRef = useRef<GenerationRequest | null>(null);
  const lastRequestRef = useRef<GenerationRequest | null>(null);
  const resultUrlRef = useRef('');
  const fallbackAttemptedRef = useRef(false);
  const operationStartedAtRef = useRef(0);
  const watchdogRef = useRef<number | null>(null);
  const selectedModel = getBrowserTtsModel(modelId);
  const availableVoices = getBrowserTtsVoices(modelId, language);

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

  function handleWorkerStall() {
    const activeModelId = activeWorkerModelRef.current;
    const retryRequest = pendingRequestRef.current ?? lastRequestRef.current;
    workerRef.current?.terminate();
    workerRef.current = null;

    if (activeModelId === 'kokoro-82m' && retryRequest && !fallbackAttemptedRef.current) {
      fallbackAttemptedRef.current = true;
      pendingRequestRef.current = retryRequest;
      lastRequestRef.current = null;
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

    pendingRequestRef.current = null;
    lastRequestRef.current = null;
    activeWorkerModelRef.current = null;
    setRuntimeState('error');
    setStatus('Browser generation timed out');
    setError('The browser stopped reporting progress for 90 seconds. The model was unloaded. Try shorter text or generate again.');
    setBusy(false);
  }

  function armWatchdog() {
    clearWatchdog();
    watchdogRef.current = window.setTimeout(handleWorkerStall, WORKER_STALL_TIMEOUT_MS);
  }

  function clearResult() {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = '';
    setResult(null);
  }

  function resetRuntime(message = 'Ready for text') {
    clearWatchdog();
    workerRef.current?.terminate();
    workerRef.current = null;
    activeWorkerModelRef.current = null;
    pendingRequestRef.current = null;
    lastRequestRef.current = null;
    setRuntimeState('idle');
    setRuntimeBackend('');
    setRuntimeDtype('');
    setProgress(0);
    setStatus(message);
    setBusy(false);
    operationStartedAtRef.current = 0;
    setElapsedSeconds(0);
  }

  function postGeneration(request: GenerationRequest) {
    if (!workerRef.current) {
      setError('The browser speech worker could not start. Reload the page and try again.');
      setBusy(false);
      return;
    }
    lastRequestRef.current = request;
    setBusy(true);
    setProgress(0);
    setRuntimeState('generating');
    setStatus('Generating MP3 in this browser');
    armWatchdog();
    workerRef.current.postMessage(request);
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
      const pendingRequest = pendingRequestRef.current;
      pendingRequestRef.current = null;
      if (pendingRequest) {
        postGeneration(pendingRequest);
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
      const lastRequest = lastRequestRef.current;
      clearResult();
      const url = URL.createObjectURL(new Blob([data.audio], { type: 'audio/mpeg' }));
      resultUrlRef.current = url;
      setResult({
        backend: data.backend ?? 'wasm',
        bitrateKbps: data.bitrateKbps ?? MP3_BITRATE_KBPS,
        durationSeconds: data.durationSeconds ?? 0,
        dtype: data.dtype,
        generationSeconds: data.generationSeconds ?? 0,
        modelId: activeModelId,
        revision: data.revision ?? activeModel.modelRevision,
        sampleRate: data.sampleRate ?? 44_100,
        url,
        voice: lastRequest?.voice ?? activeModel.defaultVoice,
      });
      setRuntimeState('complete');
      setRuntimeBackend(data.backend ?? 'wasm');
      setStatus('Your MP3 is ready');
      setProgress(100);
      setBusy(false);
      setNotice('Preview or download the MP3 before closing or refreshing this tab.');
      emitTtsAction('Complete browser text to speech MP3', 'tts_complete');
      return;
    }
    if (data.type === 'error') {
      clearWatchdog();
      pendingRequestRef.current = null;
      setRuntimeState('error');
      setStatus('Speech generation stopped');
      setError(data.message ?? 'Browser speech generation failed.');
      setBusy(false);
    }
  }

  function createWorker(modelToLoad: BrowserTtsModelId) {
    workerRef.current?.terminate();
    const nextWorker = createModelWorker(modelToLoad);
    activeWorkerModelRef.current = modelToLoad;
    nextWorker.onmessage = handleWorkerMessage;
    nextWorker.onerror = () => {
      clearWatchdog();
      pendingRequestRef.current = null;
      setRuntimeState('error');
      setStatus('Browser worker could not start');
      setError('This browser could not start the speech worker. Try current Chrome or Edge on a desktop device.');
      setBusy(false);
    };
    nextWorker.onmessageerror = () => {
      clearWatchdog();
      pendingRequestRef.current = null;
      setRuntimeState('error');
      setStatus('Browser worker response failed');
      setError('This browser could not read the speech worker response. Reload the page and try again.');
      setBusy(false);
    };
    workerRef.current = nextWorker;
    return nextWorker;
  }

  function generateMp3() {
    const cleanText = text.trim();
    setError('');
    setNotice('');
    clearResult();
    if (!cleanText) {
      setError('Paste the text you want to turn into speech.');
      return;
    }
    if (cleanText.length > MAX_TEXT_CHARACTERS) {
      setError(`Use no more than ${formatCount(MAX_TEXT_CHARACTERS)} characters at a time.`);
      return;
    }
    if (!consent) {
      setError('Confirm that you have permission to use this text and accept the selected model terms.');
      return;
    }

    const request: GenerationRequest = {
      type: 'generate',
      language,
      speed,
      steps: QUALITY_PASSES,
      text: cleanText,
      voice,
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
      postGeneration(request);
      return;
    }

    pendingRequestRef.current = request;
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
        : 'The model was unloaded. A completed MP3 stays available until you replace it or leave the page.',
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
    link.download = `text-to-speech-${result.modelId}-${result.voice.toLowerCase()}.mp3`;
    link.click();
    emitTtsAction('Download browser text to speech MP3', 'tts_download');
  }

  return (
    <section className="tts-audiobook" aria-labelledby="tts-audiobook-heading">
      <header className="tts-audiobook__header">
        <div>
          <p className="tts-audiobook__eyebrow">Runs on your device through this website</p>
          <h2 id="tts-audiobook-heading">Turn text into a downloadable MP3</h2>
          <p>Paste your text, choose a browser model and voice, generate the audio, and download the MP3. Your text stays in this browser.</p>
        </div>
        <div className="tts-audiobook__limits" role="group" aria-label="Text to speech limits">
          <span><ShieldCheck aria-hidden="true" size={18} /> Text stays in this browser</span>
          <span><FileText aria-hidden="true" size={18} /> Up to 10,000 characters</span>
          <span><FileAudio aria-hidden="true" size={18} /> 128 kbps MP3 download</span>
        </div>
      </header>

      <div className="tts-audiobook__canary" role="note">
        <strong>No paid server or upload queue</strong>
        <p>
          The first generation downloads {getBrowserTtsDownloadNote(modelId)} for {selectedModel.name} from Hugging Face.
          {' '}{selectedModel.backendNote}. Only the selected model loads.
        </p>
      </div>

      <div className="tts-audiobook__grid">
        <section className="tts-audiobook__panel" aria-labelledby="tts-source-heading">
          <div className="tts-audiobook__panel-heading">
            <span><FileText aria-hidden="true" size={20} /></span>
            <div>
              <h3 id="tts-source-heading">1. Paste your text</h3>
              <p>Use text you wrote or have permission to convert</p>
            </div>
          </div>
          <label htmlFor="tts-source-text">Text to turn into speech</label>
          <textarea
            id="tts-source-text"
            data-clarity-mask="true"
            dir="auto"
            value={text}
            disabled={busy}
            maxLength={MAX_TEXT_CHARACTERS}
            placeholder="Paste the text you want to hear."
            onChange={(event) => {
              setText(event.target.value);
              setError('');
              clearResult();
            }}
          />
          <div className="tts-audiobook__source-meta">
            <span>{formatCount(text.length)} / {formatCount(MAX_TEXT_CHARACTERS)} characters</span>
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
              <p>Pick multilingual speed or higher-quality English speech</p>
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

          <label htmlFor="tts-language">Text language</label>
          <select id="tts-language" value={language} disabled={busy} onChange={(event) => chooseLanguage(event.target.value)}>
            {selectedModel.languages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <p className="tts-audiobook__help">
            {modelId === 'supertonic-3'
              ? 'Choose the language when you know it. Best effort is not language detection.'
              : 'The official Kokoro browser path currently supports US and UK English only.'}
          </p>

          <fieldset className="tts-audiobook__voices" disabled={busy}>
            <legend>Fixed voice</legend>
            <div>
              {availableVoices.map((item) => (
                <label key={item.value} className={voice === item.value ? 'is-selected' : ''}>
                  <input
                    type="radio"
                    name="tts-voice"
                    value={item.value}
                    checked={voice === item.value}
                    onChange={() => {
                      setVoice(item.value);
                      clearResult();
                    }}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

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
              <img
                src="/tool-art/text-to-speech-audiobook-generator-tool.webp"
                alt=""
                width="1200"
                height="630"
              />
            </div>
            <div className="tts-audiobook__loading-copy">
              <div className="tts-audiobook__sound-wave">
                <span /><span /><span /><span /><span />
              </div>
              <strong>{runtimeState === 'loading' ? 'Warming up the voice studio' : 'Turning your text into sound'}</strong>
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
              <button type="button" className="tts-audiobook__generate" data-aft-analytics-manual="true" disabled={busy} onClick={generateMp3}>
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
            <audio controls preload="metadata" src={result.url} aria-label="Generated MP3 preview" />
            <div className="tts-audiobook__result-meta">
              <span>{getBrowserTtsModel(result.modelId).name}</span>
              {result.dtype && <span>{result.dtype === 'fp32' ? 'Full precision' : 'q8 compatibility'}</span>}
              <span>{formatSeconds(result.durationSeconds)} audio</span>
              <span>{formatSeconds(result.generationSeconds)} generation</span>
              <span>{result.bitrateKbps} kbps MP3</span>
              <span>{result.sampleRate / 1_000} kHz source</span>
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
