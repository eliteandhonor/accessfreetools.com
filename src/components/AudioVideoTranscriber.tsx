import {
  Captions,
  CheckCircle2,
  CircleStop,
  Clock3,
  Copy,
  Download,
  FileAudio2,
  FileVideo2,
  Gauge,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react';

import { emitAftToolAction } from '../lib/aftToolAnalytics';
import {
  buildTranscriptionBlocks,
  compareTranscriptTimes,
  createTranscriptDownloads,
  mergeTranscriptSegments,
  sanitizeTranscriptFilename,
  validateMediaCandidate,
  WHISPER_CHUNK_SECONDS,
  WHISPER_STRIDE_SECONDS,
  type TranscriptSegment,
  type TranscriptionBlock,
} from '../lib/browserTranscriber';
import { whisperLanguages, type WhisperLanguage } from '../lib/browserTranscriberLanguages';
import {
  assertTranscriberOperation,
  isTranscriberControlError,
  waitForTranscriberReply,
  type TranscriberOperation,
} from '../lib/browserTranscriberLifecycle';
import type {
  InspectedMedia,
  TranscriberAsrWorkerEvent,
  TranscriberBackend,
  TranscriberMediaWorkerEvent,
  TranscriberModelKind,
} from '../lib/browserTranscriberWorkerTypes';

type Phase =
  | 'cancelled'
  | 'complete'
  | 'decoding'
  | 'error'
  | 'idle'
  | 'inspecting'
  | 'loading'
  | 'ready'
  | 'transcribing';

const TOOL_NAME = 'Audio and Video Transcriber';
const TOOL_SLUG = 'audio-video-transcriber';

function emitTranscriberAction(action: string, clarityEvent: string) {
  emitAftToolAction({
    action,
    category: 'ai-tools',
    clarityEvent,
    toolName: TOOL_NAME,
    toolSlug: TOOL_SLUG,
  });
}

function createMediaWorker() {
  return new Worker(new URL('../workers/transcriber-media.worker.ts', import.meta.url), { type: 'module' });
}

function createAsrWorker() {
  return new Worker(new URL('../workers/transcriber-asr.worker.ts', import.meta.url), { type: 'module' });
}

function formatBytes(value: number) {
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds: number) {
  const safe = Math.max(0, Math.round(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const remainder = safe % 60;
  if (hours) return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function formatTimestamp(seconds: number) {
  const minutes = Math.floor(Math.max(0, seconds) / 60);
  const remainder = Math.floor(Math.max(0, seconds) % 60);
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function mediaKind(file: File | null): 'audio' | 'video' {
  if (!file) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  return /\.(?:mkv|mov|mp4|webm)$/i.test(file.name) ? 'video' : 'audio';
}

function saveTextFile(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function AudioVideoTranscriber() {
  const [file, setFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [media, setMedia] = useState<InspectedMedia | null>(null);
  const [trackNumber, setTrackNumber] = useState(1);
  const [language, setLanguage] = useState<WhisperLanguage>('english');
  const [backend, setBackend] = useState<TranscriberBackend>('wasm');
  const [webGpuAvailable, setWebGpuAvailable] = useState(false);
  const [consent, setConsent] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [status, setStatus] = useState('Choose a recording to inspect');
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [filename, setFilename] = useState('transcript');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [dragging, setDragging] = useState(false);
  const mediaWorkerRef = useRef<Worker | null>(null);
  const asrWorkerRef = useRef<Worker | null>(null);
  const mediaUrlRef = useRef('');
  const operationRef = useRef(0);
  const startedAtRef = useRef(0);
  const requestAbortRef = useRef<AbortController | null>(null);
  const checkpointRef = useRef<{
    file: File; trackNumber: number; language: string; nextBlock: number; sourceSegments: TranscriptSegment[];
  } | null>(null);
  const playerRef = useRef<HTMLMediaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const busy = ['inspecting', 'decoding', 'loading', 'transcribing'].includes(phase);
  const canResume = (phase === 'error' || phase === 'cancelled')
    && checkpointRef.current?.file === file
    && checkpointRef.current?.trackNumber === trackNumber
    && checkpointRef.current?.language === language;

  const selectedTrack = media?.tracks.find((track) => track.number === trackNumber) ?? null;
  const modelKind: TranscriberModelKind = language === 'english' ? 'english' : 'multilingual';
  const transcriptText = useMemo(
    () => [...segments].sort(compareTranscriptTimes).map((segment) => segment.text).join('\n\n'),
    [segments],
  );

  useEffect(() => {
    let active = true;
    async function checkWebGpu() {
      if (!('gpu' in navigator)) return;
      try {
        const gpu = (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown | null> } }).gpu;
        const adapter = await gpu?.requestAdapter();
        if (active) setWebGpuAvailable(Boolean(adapter));
      } catch {
        if (active) setWebGpuAvailable(false);
      }
    }
    void checkWebGpu();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!busy) return;
    const timer = window.setInterval(() => {
      if (requestAbortRef.current && !requestAbortRef.current.signal.aborted) {
        setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [busy]);

  useEffect(() => () => {
    operationRef.current += 1;
    stopWorkers();
    checkpointRef.current = null;
    if (mediaUrlRef.current) URL.revokeObjectURL(mediaUrlRef.current);
  }, []);

  function stopWorkers() {
    requestAbortRef.current?.abort();
    requestAbortRef.current = null;
    mediaWorkerRef.current?.terminate();
    mediaWorkerRef.current = null;
    asrWorkerRef.current?.terminate();
    asrWorkerRef.current = null;
  }

  function beginOperation() {
    operationRef.current += 1;
    stopWorkers();
    startedAtRef.current = Date.now();
    const id = operationRef.current;
    const controller = new AbortController();
    requestAbortRef.current = controller;
    return {
      signal: controller.signal,
      isCurrent: () => operationRef.current === id && requestAbortRef.current === controller,
    };
  }

  async function inspectFile(nextFile: File) {
    const operation = beginOperation();
    checkpointRef.current = null;
    setMedia(null);
    const validation = validateMediaCandidate(nextFile);
    if (!validation.ok) {
      setError(validation.message);
      setPhase('error');
      setStatus('File inspection failed');
      stopWorkers();
      return;
    }

    if (mediaUrlRef.current) URL.revokeObjectURL(mediaUrlRef.current);
    const nextUrl = URL.createObjectURL(nextFile);
    mediaUrlRef.current = nextUrl;
    setFile(nextFile);
    setMediaUrl(nextUrl);
    setSegments([]);
    setFilename(nextFile.name.replace(/\.[^.]+$/, '') || 'transcript');
    setError('');
    setNotice('');
    setProgress(0);
    setElapsedSeconds(0);
    setPhase('inspecting');
    setStatus('Checking the container and audio tracks');

    try {
      const result = await getInspectedWorker(nextFile, operation);
      assertTranscriberOperation(operation);
      const firstDecodable = result.media.tracks.find((track) => track.canDecode);
      setMedia(result.media);
      setTrackNumber(firstDecodable?.number ?? result.media.tracks[0]?.number ?? 1);
      if (!firstDecodable) {
        const missingDecoder = result.media.nativeAudioDecoderAvailable === false;
        setError(missingDecoder
          ? 'This browser is missing the audio-decoding support this file needs. Try a current desktop version of Chrome or Edge.'
          : 'This browser cannot decode any audio track in the file. Convert it to MP3 or WAV and try again.');
        setPhase('error');
        setStatus(missingDecoder ? 'Audio decoding unavailable' : 'Audio codec not supported');
        return;
      }
      setPhase('ready');
      setStatus('Recording inspected and ready');
      setNotice(
        result.media.duration > 15 * 60
          ? 'Desktop is recommended for recordings longer than 15 minutes. Keep this tab open while it works.'
          : 'No speech model has downloaded yet. The selected model starts only when you press Transcribe.',
      );
    } catch (caught) {
      if (!operation.isCurrent() || operation.signal.aborted) return;
      setError(caught instanceof Error ? caught.message : 'The browser could not inspect this file.');
      setPhase('error');
      setStatus('File inspection failed');
    } finally {
      if (operation.isCurrent()) stopWorkers();
    }
  }

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    if (nextFile) void inspectFile(nextFile);
    event.target.value = '';
  }

  function dropFile(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const nextFile = event.dataTransfer.files?.[0];
    if (nextFile) void inspectFile(nextFile);
  }

  function updateAsrProgress(event: TranscriberAsrWorkerEvent | TranscriberMediaWorkerEvent, block: TranscriptionBlock, blocks: number) {
    if (event.type === 'load-progress') setStatus(event.message);
    if (event.type === 'transcription-progress') {
      setProgress((block.index + 0.25 + event.progress * 0.75) / blocks);
    }
  }

  async function getInspectedWorker(currentFile: File, operation: TranscriberOperation) {
    assertTranscriberOperation(operation);
    const worker = createMediaWorker();
    mediaWorkerRef.current = worker;
    const result = await waitForTranscriberReply(worker, { type: 'inspect', file: currentFile }, 'inspected', operation);
    assertTranscriberOperation(operation);
    return { worker, media: result.media };
  }

  async function loadSpeechWorker(
    model: TranscriberModelKind,
    selectedBackend: TranscriberBackend,
    operation: TranscriberOperation,
  ) {
    assertTranscriberOperation(operation);
    asrWorkerRef.current?.terminate();
    asrWorkerRef.current = null;
    assertTranscriberOperation(operation);
    const worker = createAsrWorker();
    asrWorkerRef.current = worker;
    await waitForTranscriberReply(
      worker, { type: 'load', backend: selectedBackend, model }, 'ready', operation,
      (event) => updateAsrProgress(event, { index: 0, start: 0, end: 0 }, 1),
    );
    assertTranscriberOperation(operation);
    return worker;
  }

  async function transcribeAll() {
    if (!file || !media || !selectedTrack) {
      setError('Choose a supported audio or video file first.');
      return;
    }
    if (!selectedTrack.canDecode) {
      setError('This browser cannot decode the selected audio track.');
      return;
    }
    if (!consent) {
      setError('Confirm that you have permission to transcribe this recording.');
      return;
    }

    const resumeAt = canResume ? checkpointRef.current!.nextBlock : 0;
    let completed: TranscriptSegment[] = canResume ? segments : [];
    let sourceSegments = canResume ? checkpointRef.current!.sourceSegments : [];
    const operation = beginOperation();
    checkpointRef.current = { file, trackNumber, language, nextBlock: resumeAt, sourceSegments };
    const blocks = buildTranscriptionBlocks(media.duration);
    let selectedBackend: TranscriberBackend = backend === 'webgpu' && webGpuAvailable ? 'webgpu' : 'wasm';
    setSegments(completed);
    setError('');
    setNotice('Keep this tab open. Completed sections remain available if a later section fails.');
    setElapsedSeconds(0);
    setProgress(resumeAt / blocks.length);
    setPhase('loading');
    setStatus(`Loading the ${modelKind === 'english' ? 'English' : 'multilingual'} Whisper Tiny model`);
    emitTranscriberAction('transcriber_start', 'transcriber_start');

    function fallback(caught: unknown) {
      assertTranscriberOperation(operation);
      if (isTranscriberControlError(caught) || selectedBackend !== 'webgpu') throw caught;
      selectedBackend = 'wasm';
      setBackend('wasm');
      setNotice('WebGPU stopped, so the tool switched to WebAssembly and will retry this section.');
    }

    async function loadWithFallback() {
      try {
        return await loadSpeechWorker(modelKind, selectedBackend, operation);
      } catch (caught) {
        fallback(caught);
        return await loadSpeechWorker(modelKind, 'wasm', operation);
      }
    }

    try {
      const { worker: mediaWorker } = await getInspectedWorker(file, operation);
      assertTranscriberOperation(operation);
      let speechWorker = await loadWithFallback();
      assertTranscriberOperation(operation);

      for (const block of blocks.slice(resumeAt)) {
        assertTranscriberOperation(operation);
        const sourceEnd = Math.min(media.duration, block.end + WHISPER_CHUNK_SECONDS - WHISPER_STRIDE_SECONDS);
        const sourceBlock = { ...block, end: sourceEnd };
        setPhase('decoding');
        setStatus(`Preparing audio section ${block.index + 1} of ${blocks.length}`);
        const decoded = await waitForTranscriberReply(
          mediaWorker, { type: 'decode', block: sourceBlock, trackNumber }, 'decoded', operation,
          (event) => {
            if (event.type === 'decode-progress') {
              setProgress((block.index + event.progress * 0.22) / blocks.length);
            }
          },
        );
        assertTranscriberOperation(operation);

        setPhase('transcribing');
        setStatus(`Transcribing section ${block.index + 1} of ${blocks.length}`);
        setProgress((block.index + 0.25) / blocks.length);
        let transcribed;
        try {
          transcribed = await waitForTranscriberReply(
            speechWorker, { type: 'transcribe', audio: decoded.audio, block, sourceEnd, language, model: modelKind },
            'transcribed', operation, (event) => updateAsrProgress(event, block, blocks.length), [decoded.audio],
          );
        } catch (caught) {
          fallback(caught);
          setPhase('loading');
          speechWorker = await loadSpeechWorker(modelKind, 'wasm', operation);
          assertTranscriberOperation(operation);
          setPhase('decoding');
          const decodedAgain = await waitForTranscriberReply(
            mediaWorker, { type: 'decode', block: sourceBlock, trackNumber }, 'decoded', operation,
          );
          assertTranscriberOperation(operation);
          setPhase('transcribing');
          setStatus(`Transcribing section ${block.index + 1} of ${blocks.length}`);
          transcribed = await waitForTranscriberReply(
            speechWorker, { type: 'transcribe', audio: decodedAgain.audio, block, sourceEnd, language, model: modelKind },
            'transcribed', operation, (event) => updateAsrProgress(event, block, blocks.length), [decodedAgain.audio],
          );
        }
        assertTranscriberOperation(operation);
        // Match source overlap against recognition text, never against user edits.
        const merged = mergeTranscriptSegments(sourceSegments, transcribed.segments);
        completed = [...completed, ...merged.slice(sourceSegments.length)];
        sourceSegments = merged;
        checkpointRef.current.sourceSegments = sourceSegments;
        checkpointRef.current.nextBlock = block.index + 1;
        setSegments(completed);
        setProgress((block.index + 1) / blocks.length);

        if (selectedBackend === 'webgpu' && block.index < blocks.length - 1) {
          setPhase('loading');
          setStatus('Recycling WebGPU memory before the next section');
          speechWorker = await loadWithFallback();
          assertTranscriberOperation(operation);
        }
      }

      assertTranscriberOperation(operation);
      checkpointRef.current = null;
      setPhase('complete');
      setStatus('Transcript ready for review');
      setNotice('Whisper can mishear names, numbers, accents, and unclear speech. Check the transcript against the recording before using it.');
      emitTranscriberAction('transcriber_complete', 'transcriber_complete');
    } catch (caught) {
      if (!operation.isCurrent() || operation.signal.aborted) return;
      if (caught instanceof Error && caught.name === 'AbortError') {
        setPhase('cancelled');
        setStatus(completed.length ? 'Stopped with a partial transcript' : 'Transcription stopped');
        return;
      }
      setError(caught instanceof Error ? caught.message : 'Transcription stopped unexpectedly.');
      setPhase('error');
      setStatus(completed.length ? 'Transcription stopped with a partial result' : 'Transcription failed');
      emitTranscriberAction('transcriber_failure', 'transcriber_failure');
    } finally {
      if (operation.isCurrent()) stopWorkers();
    }
  }

  function cancel() {
    operationRef.current += 1;
    stopWorkers();
    setPhase('cancelled');
    setStatus(segments.length ? 'Stopped with a partial transcript' : 'Transcription stopped');
    setNotice(segments.length ? 'You can edit or download the completed sections below.' : 'The model and media workers were unloaded.');
    setProgress(segments.length ? progress : 0);
    emitTranscriberAction('transcriber_cancel', 'transcriber_cancel');
  }

  function unloadModel() {
    asrWorkerRef.current?.terminate();
    asrWorkerRef.current = null;
    setNotice('The speech model was unloaded. Your local media and transcript remain in this tab.');
  }

  function reset() {
    operationRef.current += 1;
    stopWorkers();
    checkpointRef.current = null;
    if (mediaUrlRef.current) URL.revokeObjectURL(mediaUrlRef.current);
    mediaUrlRef.current = '';
    setFile(null);
    setMediaUrl('');
    setMedia(null);
    setSegments([]);
    setConsent(false);
    setError('');
    setNotice('');
    setProgress(0);
    setElapsedSeconds(0);
    setPhase('idle');
    setStatus('Choose a recording to inspect');
  }

  function seek(seconds: number) {
    if (!playerRef.current) return;
    playerRef.current.currentTime = seconds;
    void playerRef.current.play();
  }

  function editSegment(index: number, text: string) {
    setSegments((current) => current.map((segment, itemIndex) => (
      itemIndex === index ? { ...segment, text } : segment
    )));
  }

  async function copyTranscript() {
    const operation = operationRef.current;
    await navigator.clipboard.writeText(transcriptText);
    if (operationRef.current !== operation) return;
    setNotice('Transcript copied.');
    emitTranscriberAction('transcriber_export_copy', 'transcriber_export');
  }

  function download(kind: 'srt' | 'txt' | 'vtt') {
    const files = createTranscriptDownloads(segments);
    const mime = kind === 'txt' ? 'text/plain;charset=utf-8' : kind === 'vtt' ? 'text/vtt;charset=utf-8' : 'application/x-subrip;charset=utf-8';
    saveTextFile(files[kind], sanitizeTranscriptFilename(filename, kind), mime);
    emitTranscriberAction(`transcriber_export_${kind}`, 'transcriber_export');
  }

  return (
    <section className="browser-transcriber" aria-labelledby="browser-transcriber-heading">
      <header className="browser-transcriber__header">
        <div>
          <p className="browser-transcriber__eyebrow">Private browser transcription</p>
          <h2 id="browser-transcriber-heading">Turn local audio or video into editable captions</h2>
          <p>The recording stays on this device. Only the pinned speech model downloads after you start.</p>
        </div>
        <div className="browser-transcriber__limits" aria-label="File limits">
          <span><Clock3 size={17} aria-hidden="true" /> Up to 60 minutes</span>
          <span><Gauge size={17} aria-hidden="true" /> Up to 250 MB</span>
        </div>
      </header>

      <div className="browser-transcriber__privacy" role="note">
        <ShieldCheck size={22} aria-hidden="true" />
        <p><strong>No media upload.</strong> Decoding, speech recognition, editing, and exports happen in this tab. The model files come from Hugging Face.</p>
      </div>

      <div className="browser-transcriber__setup">
        <section className="browser-transcriber__source" aria-labelledby="transcriber-source-heading" data-clarity-mask="true">
          <div className="browser-transcriber__section-heading">
            <span><Upload size={19} aria-hidden="true" /></span>
            <div><p>Step 1</p><h3 id="transcriber-source-heading">Choose a recording</h3></div>
          </div>
          <div
            className={`browser-transcriber__dropzone${dragging ? ' is-dragging' : ''}`}
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={dropFile}
          >
            {mediaKind(file) === 'video' ? <FileVideo2 size={30} aria-hidden="true" /> : <FileAudio2 size={30} aria-hidden="true" />}
            <strong>{file ? file.name : 'Drop one audio or video file here'}</strong>
            <span>{file ? `${formatBytes(file.size)} selected` : 'MP3, WAV, M4A, FLAC, OGG, MP4, MOV, WebM, or MKV'}</span>
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={busy}>Choose file</button>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              aria-label="Choose audio or video file"
              accept="audio/*,video/*,.mkv,.mov,.m4a,.flac,.opus"
              onChange={chooseFile}
              tabIndex={-1}
            />
          </div>

          {mediaUrl && (
            <div className="browser-transcriber__player">
              {mediaKind(file) === 'video' ? (
                <video ref={(element) => { playerRef.current = element; }} src={mediaUrl} controls preload="metadata" />
              ) : (
                <audio ref={(element) => { playerRef.current = element; }} src={mediaUrl} controls preload="metadata" />
              )}
            </div>
          )}

          {media && (
            <dl className="browser-transcriber__media-facts">
              <div><dt>Container</dt><dd>{media.format}</dd></div>
              <div><dt>Duration</dt><dd>{formatDuration(media.duration)}</dd></div>
              <div><dt>Audio tracks</dt><dd>{media.tracks.length}</dd></div>
            </dl>
          )}
        </section>

        <section className="browser-transcriber__options" aria-labelledby="transcriber-options-heading" data-clarity-mask="true">
          <div className="browser-transcriber__section-heading">
            <span><Sparkles size={19} aria-hidden="true" /></span>
            <div><p>Step 2</p><h3 id="transcriber-options-heading">Choose speech settings</h3></div>
          </div>

          {media && media.tracks.length > 1 && (
            <label>Audio track
              <select value={trackNumber} disabled={busy} onChange={(event) => setTrackNumber(Number(event.target.value))}>
                {media.tracks.map((track) => (
                  <option key={track.id} value={track.number} disabled={!track.canDecode}>
                    {track.name} ({track.language === 'und' ? 'language unknown' : track.language}, {track.codec}){track.canDecode ? '' : ' - unsupported'}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label>Spoken language
            <select value={language} disabled={busy} onChange={(event) => setLanguage(event.target.value as WhisperLanguage)}>
              {whisperLanguages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <p className="browser-transcriber__help">
            English uses the smaller English-only model. Auto and every other choice use the multilingual model. Auto is a model guess, so choose the language when you know it.
          </p>

          <fieldset className="browser-transcriber__backend" disabled={busy}>
            <legend>Processing mode</legend>
            <label><input type="radio" name="transcriber-backend" checked={backend === 'wasm'} onChange={() => setBackend('wasm')} /> Compatibility (WebAssembly)</label>
            <label className={!webGpuAvailable ? 'is-unavailable' : ''}>
              <input type="radio" name="transcriber-backend" checked={backend === 'webgpu'} disabled={!webGpuAvailable} onChange={() => setBackend('webgpu')} /> WebGPU beta
            </label>
          </fieldset>
          <p className="browser-transcriber__readiness">
            {webGpuAvailable
              ? 'A WebGPU adapter was detected. Compatibility mode remains the safer default for long files.'
              : 'No WebGPU adapter was detected. The tool will use its q8 WebAssembly compatibility path.'}
          </p>

          <label className="browser-transcriber__consent">
            <input type="checkbox" checked={consent} disabled={busy} onChange={(event) => setConsent(event.target.checked)} />
            <span>I have permission to transcribe this recording and understand that names, numbers, and unclear speech need manual review.</span>
          </label>
        </section>
      </div>

      <section className="browser-transcriber__job" aria-labelledby="transcriber-job-heading" data-clarity-mask="true">
        <div className="browser-transcriber__job-heading">
          <div>
            <p className="browser-transcriber__eyebrow">Local job</p>
            <h3 id="transcriber-job-heading">{status}</h3>
          </div>
          <span className={`browser-transcriber__phase is-${phase}`}>{phase.replace('-', ' ')}</span>
        </div>

        {busy && (
          <div className="browser-transcriber__loading" aria-hidden="true">
            <div className="browser-transcriber__mascot">
              <img src="/tool-art/audio-video-transcriber-tool.webp" alt="" />
              <span className="browser-transcriber__caption-line line-one" />
              <span className="browser-transcriber__caption-line line-two" />
              <span className="browser-transcriber__caption-line line-three" />
            </div>
            <div className="browser-transcriber__sound-wave"><span /><span /><span /><span /><span /><span /></div>
          </div>
        )}

        <div className="browser-transcriber__progress" role="progressbar" aria-label="Transcription progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={phase === 'loading' || phase === 'transcribing' || phase === 'inspecting' ? undefined : Math.round(progress * 100)}>
          <span style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }} />
        </div>
        <div className="browser-transcriber__job-meta" aria-live="polite">
          <span>{phase === 'loading' ? 'Loading model' : phase === 'transcribing' ? 'Recognizing speech' : phase === 'inspecting' ? 'Inspecting recording' : `${Math.round(progress * 100)}% complete`}</span>
          <span>{formatDuration(elapsedSeconds)} elapsed</span>
          <span>{segments.length} caption segments</span>
        </div>

        <div className="browser-transcriber__actions">
          {!busy ? (
            <button type="button" className="browser-transcriber__primary" disabled={!media || !selectedTrack?.canDecode} onClick={() => void transcribeAll()}>
              <Captions size={19} aria-hidden="true" /> {canResume ? 'Retry remaining sections' : 'Transcribe recording'}
            </button>
          ) : (
            <button type="button" className="browser-transcriber__stop" onClick={cancel}>
              <CircleStop size={19} aria-hidden="true" /> Stop and keep partial text
            </button>
          )}
          <button type="button" onClick={unloadModel} disabled={!asrWorkerRef.current || busy}><Trash2 size={18} aria-hidden="true" /> Unload model</button>
          <button type="button" onClick={reset}><RotateCcw size={18} aria-hidden="true" /> Reset</button>
        </div>

        <div className="browser-transcriber__messages" aria-live="polite">
          {error && <p className="browser-transcriber__error" role="alert">{error}</p>}
          {!error && notice && <p className="browser-transcriber__notice">{notice}</p>}
        </div>
      </section>

      {segments.length > 0 && (
        <section className="browser-transcriber__results" aria-labelledby="transcriber-results-heading" data-clarity-mask="true">
          <div className="browser-transcriber__results-heading">
            <div>
              <p className="browser-transcriber__eyebrow">{phase === 'complete' ? 'Completed transcript' : 'Partial transcript'}</p>
              <h3 id="transcriber-results-heading">Review every name, number, and timestamp</h3>
            </div>
            <CheckCircle2 size={24} aria-hidden="true" />
          </div>

          <ol className="browser-transcriber__segments">
            {segments.map((segment, index) => ({ segment, index }))
              .sort((a, b) => compareTranscriptTimes(a.segment, b.segment))
              .map(({ segment, index }, position) => (
              <li key={`${segment.start}-${index}`}>
                <button type="button" className="browser-transcriber__timestamp" onClick={() => seek(segment.start)} aria-label={`Play from ${formatTimestamp(segment.start)}`}>
                  {formatTimestamp(segment.start)}
                </button>
                <label htmlFor={`transcript-segment-${index}`}>Caption {position + 1}</label>
                <textarea
                  id={`transcript-segment-${index}`}
                  rows={Math.max(2, Math.ceil(segment.text.length / 85))}
                  value={segment.text}
                  disabled={busy}
                  aria-describedby={segment.overlapNeedsReview ? `transcript-overlap-${index}` : undefined}
                  onChange={(event) => editSegment(index, event.target.value)}
                />
                {segment.overlapNeedsReview && (
                  <p id={`transcript-overlap-${index}`} className="browser-transcriber__notice" style={{ gridColumn: '1 / -1' }}>
                    Overlap needs review. Text was kept because the timing is uncertain.
                  </p>
                )}
              </li>
            ))}
          </ol>

          <div className="browser-transcriber__export">
            {phase !== 'complete' && <p><strong>Download partial transcript:</strong> completed sections are ready now.</p>}
            <label>Download filename
              <input type="text" value={filename} maxLength={120} onChange={(event) => setFilename(event.target.value)} />
            </label>
            <div className="browser-transcriber__export-actions">
              <button type="button" onClick={() => void copyTranscript()}><Copy size={18} aria-hidden="true" /> Copy text</button>
              <button type="button" onClick={() => download('txt')}><Download size={18} aria-hidden="true" /> TXT</button>
              <button type="button" onClick={() => download('srt')}><Download size={18} aria-hidden="true" /> SRT</button>
              <button type="button" onClick={() => download('vtt')}><Download size={18} aria-hidden="true" /> WebVTT</button>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
