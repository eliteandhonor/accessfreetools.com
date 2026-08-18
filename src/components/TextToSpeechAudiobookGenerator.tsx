import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Cpu,
  Download,
  FileAudio,
  FileText,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Square,
  Upload,
  Volume2,
} from 'lucide-react';
import { emitAftToolAction } from '../lib/aftToolAnalytics';
import {
  parsePastedText,
  parseTtsFile,
  TTS_INPUT_LIMITS,
  type ParsedTtsInput,
} from '../lib/ttsInput';

type RuntimeState = 'complete' | 'error' | 'generating' | 'idle' | 'loading' | 'ready';

interface AudioResult {
  backend: 'wasm' | 'webgpu';
  durationSeconds: number;
  generationSeconds: number;
  revision: string;
  sampleRate: number;
  url: string;
}

interface WorkerEvent {
  audio?: ArrayBuffer;
  backend?: 'wasm' | 'webgpu';
  current?: number;
  durationSeconds?: number;
  generationSeconds?: number;
  message?: string;
  revision?: string;
  sampleRate?: number;
  step?: number;
  total?: number;
  type: 'error' | 'generation-progress' | 'load-progress' | 'ready' | 'result' | 'voice-progress';
}

const MODEL_DOWNLOAD_MB = 398;
const MODEL_REVISION = '3cadd1ee6394adea1bd021217a0e650ede09a323';
const languages = [
  ['na', 'Language not specified, best effort'],
  ['ar', 'Arabic'], ['bg', 'Bulgarian'], ['hr', 'Croatian'], ['cs', 'Czech'], ['da', 'Danish'],
  ['nl', 'Dutch'], ['en', 'English'], ['et', 'Estonian'], ['fi', 'Finnish'], ['fr', 'French'],
  ['de', 'German'], ['el', 'Greek'], ['hi', 'Hindi'], ['hu', 'Hungarian'], ['id', 'Indonesian'],
  ['it', 'Italian'], ['ja', 'Japanese'], ['ko', 'Korean'], ['lv', 'Latvian'], ['lt', 'Lithuanian'],
  ['pl', 'Polish'], ['pt', 'Portuguese'], ['ro', 'Romanian'], ['ru', 'Russian'], ['sk', 'Slovak'],
  ['sl', 'Slovenian'], ['es', 'Spanish'], ['sv', 'Swedish'], ['tr', 'Turkish'], ['uk', 'Ukrainian'],
  ['vi', 'Vietnamese'],
] as const;
const voices = ['F1', 'F2', 'F3', 'F4', 'F5', 'M1', 'M2', 'M3', 'M4', 'M5'] as const;

function emitTtsAction(action: string, clarityEvent: string) {
  emitAftToolAction({
    action,
    category: 'ai-tools',
    clarityEvent,
    toolName: 'Text to Speech Audiobook Generator',
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

export default function TextToSpeechAudiobookGenerator() {
  const [text, setText] = useState('');
  const [parsedFile, setParsedFile] = useState<ParsedTtsInput | null>(null);
  const [sourceLabel, setSourceLabel] = useState('Pasted text');
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [language, setLanguage] = useState('en');
  const [voice, setVoice] = useState('F1');
  const [speed, setSpeed] = useState(1.05);
  const [steps, setSteps] = useState(8);
  const [consent, setConsent] = useState(false);
  const [runtimeState, setRuntimeState] = useState<RuntimeState>('idle');
  const [runtimeBackend, setRuntimeBackend] = useState<'wasm' | 'webgpu' | ''>('');
  const [status, setStatus] = useState('Model not loaded');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AudioResult | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const resultUrlRef = useRef('');

  const parsed = parsedFile ?? (text.trim() ? (() => {
    try {
      return parsePastedText(text);
    } catch {
      return null;
    }
  })() : null);
  const chapter = parsed?.chapters[selectedChapter] ?? parsed?.chapters[0] ?? null;
  const chapterWithinLimit = Boolean(
    chapter && chapter.text.length <= TTS_INPUT_LIMITS.maxSynthesisCharacters,
  );

  useEffect(() => () => {
    workerRef.current?.terminate();
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
  }, []);

  function clearResult() {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = '';
    setResult(null);
  }

  function handleWorkerMessage(event: MessageEvent<WorkerEvent>) {
    const data = event.data;
    if (data.type === 'load-progress' || data.type === 'voice-progress') {
      setStatus(data.message ?? 'Loading browser speech model');
      if (data.current && data.total) setProgress(Math.round((data.current / data.total) * 100));
      return;
    }
    if (data.type === 'ready') {
      setRuntimeState('ready');
      setRuntimeBackend(data.backend ?? 'wasm');
      setStatus(`Model ready using ${(data.backend ?? 'wasm').toUpperCase()}`);
      setProgress(100);
      setBusy(false);
      setNotice('The model is ready. Your text has not been uploaded or sent to the model host.');
      emitTtsAction('Load browser TTS model', 'tts_model_ready');
      return;
    }
    if (data.type === 'generation-progress') {
      const value = data.step && data.total ? Math.round((data.step / data.total) * 100) : 0;
      setProgress(value);
      setStatus(`Generating audio, denoising pass ${data.step ?? 0} of ${data.total ?? steps}`);
      return;
    }
    if (data.type === 'result' && data.audio) {
      clearResult();
      const url = URL.createObjectURL(new Blob([data.audio], { type: 'audio/wav' }));
      resultUrlRef.current = url;
      setResult({
        backend: data.backend ?? 'wasm',
        durationSeconds: data.durationSeconds ?? 0,
        generationSeconds: data.generationSeconds ?? 0,
        revision: data.revision ?? MODEL_REVISION,
        sampleRate: data.sampleRate ?? 44_100,
        url,
      });
      setRuntimeState('complete');
      setRuntimeBackend(data.backend ?? 'wasm');
      setStatus('Chapter audio is ready');
      setProgress(100);
      setBusy(false);
      setNotice('The WAV file exists only in this browser tab. Download it before closing or refreshing the page.');
      emitTtsAction('Complete browser audiobook chapter', 'tts_complete');
      return;
    }
    if (data.type === 'error') {
      setRuntimeState('error');
      setStatus('Browser speech generation stopped');
      setError(data.message ?? 'Browser speech generation failed.');
      setBusy(false);
    }
  }

  function createWorker() {
    workerRef.current?.terminate();
    const nextWorker = new Worker(new URL('../workers/supertonic.worker.ts', import.meta.url), { type: 'module' });
    nextWorker.onmessage = handleWorkerMessage;
    nextWorker.onerror = () => {
      setRuntimeState('error');
      setStatus('Browser worker could not start');
      setError('This browser could not start the local speech worker. Try current Chrome or Edge on a desktop device.');
      setBusy(false);
    };
    workerRef.current = nextWorker;
    return nextWorker;
  }

  function loadModel() {
    setError('');
    setNotice('');
    clearResult();
    setBusy(true);
    setProgress(0);
    setRuntimeState('loading');
    setStatus(`Downloading about ${MODEL_DOWNLOAD_MB} MB of pinned model files`);
    createWorker().postMessage({ type: 'load' });
  }

  async function loadFile(file?: File) {
    if (!file) return;
    setBusy(true);
    setError('');
    setNotice('');
    clearResult();
    try {
      const parsedSource = await parseTtsFile(file);
      setParsedFile(parsedSource);
      setText('');
      setSelectedChapter(0);
      setSourceLabel(parsedSource.sourceKind === 'epub' ? 'EPUB chapters' : 'TXT file');
      setNotice(`Prepared ${formatCount(parsedSource.characterCount)} characters across ${parsedSource.chapters.length} ${parsedSource.chapters.length === 1 ? 'chapter' : 'chapters'} inside this browser.`);
      emitTtsAction('Prepare browser TTS source', 'tts_prepare_file');
    } catch (fileError) {
      setParsedFile(null);
      setSelectedChapter(0);
      setSourceLabel('Pasted text');
      setError(fileError instanceof Error ? fileError.message : 'The browser could not read that file.');
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  function clearSource() {
    setText('');
    setParsedFile(null);
    setSelectedChapter(0);
    setSourceLabel('Pasted text');
    setNotice('');
    setError('');
    clearResult();
  }

  function generateChapter() {
    setError('');
    setNotice('');
    clearResult();
    if (!chapter) {
      setError('Add text or choose a TXT or EPUB file first.');
      return;
    }
    if (!chapterWithinLimit) {
      setError(`Generate one chapter of at most ${formatCount(TTS_INPUT_LIMITS.maxSynthesisCharacters)} characters at a time. Split this chapter before continuing.`);
      return;
    }
    if (!consent) {
      setError('Confirm that you have permission to convert this text and accept the model use limits.');
      return;
    }
    if (!workerRef.current || !['ready', 'complete'].includes(runtimeState)) {
      setError('Load the browser model before generating audio.');
      return;
    }

    setBusy(true);
    setProgress(0);
    setRuntimeState('generating');
    setStatus('Preparing the selected chapter inside the browser worker');
    workerRef.current.postMessage({
      type: 'generate',
      language,
      speed,
      steps,
      text: chapter.text,
      voice,
    });
    emitTtsAction('Generate browser audiobook chapter', 'tts_generate');
  }

  function stopRuntime(reason: 'cancel' | 'unload') {
    workerRef.current?.terminate();
    workerRef.current = null;
    setRuntimeState('idle');
    setRuntimeBackend('');
    setProgress(0);
    setStatus('Model unloaded');
    setBusy(false);
    setNotice(
      reason === 'cancel'
        ? 'Generation stopped and the in-memory model was unloaded. Previously downloaded model files may remain in the browser cache.'
        : 'The in-memory model was unloaded. Any completed WAV remains available in this tab until you replace it or leave the page.',
    );
    emitTtsAction(
      reason === 'cancel' ? 'Cancel browser audiobook chapter' : 'Unload browser TTS model',
      reason === 'cancel' ? 'tts_cancel' : 'tts_model_unload',
    );
  }

  function downloadResult() {
    if (!result) return;
    const chapterNumber = (chapter?.index ?? selectedChapter + 1).toString().padStart(2, '0');
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `audiobook-chapter-${chapterNumber}-${voice.toLowerCase()}.wav`;
    link.click();
    emitTtsAction('Download browser audiobook WAV', 'tts_download');
  }

  return (
    <section className="tts-audiobook" aria-labelledby="tts-audiobook-heading">
      <header className="tts-audiobook__header">
        <div>
          <p className="tts-audiobook__eyebrow">Runs on your device through this website</p>
          <h2 id="tts-audiobook-heading">Turn permitted text into a downloadable WAV chapter</h2>
          <p>The Access Free Tools page loads an open model into your browser. Your pasted text and EPUB chapters never upload to our server.</p>
        </div>
        <div className="tts-audiobook__limits" role="group" aria-label="Browser pilot limits">
          <span><ShieldCheck aria-hidden="true" size={18} /> Text stays in this browser</span>
          <span><BookOpen aria-hidden="true" size={18} /> One 10,000-character chapter at a time</span>
          <span><FileAudio aria-hidden="true" size={18} /> 44.1 kHz WAV download</span>
        </div>
      </header>

      <div className="tts-audiobook__canary" role="note">
        <strong>No paid server or queue</strong>
        <p>The first model load downloads about {MODEL_DOWNLOAD_MB} MB from the pinned Supertonic model on Hugging Face. It may be cached by your browser. WebGPU is fastest; WebAssembly is the slower fallback.</p>
      </div>

      <div className="tts-audiobook__grid">
        <section className="tts-audiobook__panel" aria-labelledby="tts-source-heading">
          <div className="tts-audiobook__panel-heading">
            <span><FileText aria-hidden="true" size={20} /></span>
            <div>
              <h3 id="tts-source-heading">1. Prepare the text</h3>
              <p>{sourceLabel}</p>
            </div>
          </div>
          <label htmlFor="tts-source-text">Paste text</label>
          <textarea
            id="tts-source-text"
            data-clarity-mask="true"
            dir="auto"
            value={text}
            disabled={Boolean(parsedFile) || busy}
            maxLength={TTS_INPUT_LIMITS.maxCharacters}
            placeholder="Paste a chapter you wrote, public-domain text, or text you have permission to convert."
            onChange={(event) => {
              setText(event.target.value);
              setParsedFile(null);
              setSelectedChapter(0);
              setSourceLabel('Pasted text');
              setError('');
              clearResult();
            }}
          />
          <div className="tts-audiobook__source-meta">
            <span>{formatCount(chapter?.text.length ?? text.length)} / {formatCount(TTS_INPUT_LIMITS.maxSynthesisCharacters)} chapter characters</span>
            <span>{parsed?.chapters.length ?? 1} {(parsed?.chapters.length ?? 1) === 1 ? 'chapter' : 'chapters'} prepared</span>
          </div>

          {parsed && parsed.chapters.length > 1 && (
            <>
              <label htmlFor="tts-chapter">Chapter to generate</label>
              <select id="tts-chapter" value={selectedChapter} disabled={busy} onChange={(event) => {
                setSelectedChapter(Number(event.target.value));
                setError('');
                clearResult();
              }}>
                {parsed.chapters.map((item, index) => (
                  <option key={item.index} value={index}>Chapter {item.index} ({formatCount(item.text.length)} characters)</option>
                ))}
              </select>
            </>
          )}

          <div className="tts-audiobook__actions">
            <label className="tts-audiobook__file-button">
              <Upload aria-hidden="true" size={18} />
              Choose TXT or EPUB
              <input
                ref={fileInput}
                data-clarity-mask="true"
                type="file"
                accept=".txt,.epub,text/plain,application/epub+zip"
                disabled={busy}
                onChange={(event) => void loadFile(event.target.files?.[0])}
              />
            </label>
            <button type="button" className="icon-button" data-aft-analytics-manual="true" disabled={busy} aria-label="Clear source text" title="Clear source text" onClick={clearSource}>
              <RotateCcw aria-hidden="true" size={18} />
            </button>
          </div>
          <p className="tts-audiobook__help">TXT and EPUB parsing happens locally. Scripts, remote EPUB resources, unsafe paths, and oversized archives are rejected before extraction.</p>
        </section>

        <section className="tts-audiobook__panel" aria-labelledby="tts-voice-heading">
          <div className="tts-audiobook__panel-heading">
            <span><Volume2 aria-hidden="true" size={20} /></span>
            <div>
              <h3 id="tts-voice-heading">2. Choose the reading setup</h3>
              <p>31 languages and 10 fixed model voices</p>
            </div>
          </div>
          <label htmlFor="tts-language">Text language</label>
          <select id="tts-language" value={language} disabled={busy} onChange={(event) => setLanguage(event.target.value)}>
            {languages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <p className="tts-audiobook__help">Best effort is not language detection. Choose the language yourself when you know it.</p>

          <fieldset className="tts-audiobook__voices" disabled={busy}>
            <legend>Fixed preset voice</legend>
            <div>
              {voices.map((item) => (
                <label key={item} className={voice === item ? 'is-selected' : ''}>
                  <input type="radio" name="tts-voice" value={item} checked={voice === item} onChange={() => setVoice(item)} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label htmlFor="tts-speed">Reading speed: {speed.toFixed(2)}x</label>
          <input id="tts-speed" type="range" min="0.9" max="1.5" step="0.05" value={speed} disabled={busy} onChange={(event) => setSpeed(Number(event.target.value))} />

          <label htmlFor="tts-steps">Quality passes: {steps}</label>
          <input id="tts-steps" type="range" min="4" max="12" step="1" value={steps} disabled={busy} onChange={(event) => setSteps(Number(event.target.value))} />
          <p className="tts-audiobook__help">More passes may improve quality, but take longer and use more device power.</p>

          <label className="tts-audiobook__consent">
            <input type="checkbox" checked={consent} disabled={busy} onChange={(event) => setConsent(event.target.checked)} />
            <span>I have permission to convert this text and accept the model's prohibited-use and license terms.</span>
          </label>
        </section>
      </div>

      <section className="tts-audiobook__job" data-clarity-mask="true" aria-labelledby="tts-job-heading">
        <div className="tts-audiobook__job-heading">
          <span>{runtimeState === 'complete' ? <CheckCircle2 aria-hidden="true" /> : runtimeState === 'idle' ? <Cpu aria-hidden="true" /> : <LoaderCircle className={busy ? 'spin' : ''} aria-hidden="true" />}</span>
          <div>
            <p className="tts-audiobook__eyebrow">Browser model</p>
            <h3 id="tts-job-heading">{status}</h3>
          </div>
        </div>

        {runtimeState !== 'idle' && (
          <div className="tts-audiobook__progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Browser speech model progress">
            <span style={{ width: `${progress}%` }} />
          </div>
        )}
        <div className="tts-audiobook__job-stats" aria-live="polite">
          <span>{runtimeBackend ? `${runtimeBackend.toUpperCase()} backend` : 'Backend selected after loading'}</span>
          <span>Model revision {MODEL_REVISION.slice(0, 8)}</span>
          <span>No text upload</span>
        </div>

        <div className="tts-audiobook__runtime-actions">
          {['idle', 'error'].includes(runtimeState) && (
            <button type="button" className="tts-audiobook__generate" data-aft-analytics-manual="true" disabled={busy} onClick={loadModel}>
              <Cpu aria-hidden="true" size={19} /> Load browser model ({MODEL_DOWNLOAD_MB} MB)
            </button>
          )}
          {['ready', 'complete'].includes(runtimeState) && (
            <>
              <button type="button" className="tts-audiobook__generate" data-aft-analytics-manual="true" disabled={busy || !chapter || !chapterWithinLimit || !consent} onClick={generateChapter}>
                <Volume2 aria-hidden="true" size={19} /> Generate selected chapter
              </button>
              <button type="button" className="tts-audiobook__cancel" data-aft-analytics-manual="true" onClick={() => stopRuntime('unload')}>
                <Square aria-hidden="true" size={16} /> Unload model
              </button>
            </>
          )}
          {['loading', 'generating'].includes(runtimeState) && (
            <button type="button" className="tts-audiobook__cancel" data-aft-analytics-manual="true" onClick={() => stopRuntime('cancel')}>
              <Square aria-hidden="true" size={16} /> Stop and unload model
            </button>
          )}
        </div>

        {result && (
          <div className="tts-audiobook__downloads">
            <audio controls preload="metadata" src={result.url} aria-label="Generated audiobook chapter preview" />
            <div className="tts-audiobook__result-meta">
              <span>{formatSeconds(result.durationSeconds)} audio</span>
              <span>{formatSeconds(result.generationSeconds)} generation</span>
              <span>{formatCount(result.sampleRate)} Hz mono WAV</span>
            </div>
            <button type="button" data-aft-analytics-manual="true" onClick={downloadResult}>
              <Download aria-hidden="true" size={18} /> Download chapter WAV
            </button>
            <p>The audio is held only in this tab and is not uploaded or stored by Access Free Tools.</p>
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
