import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(repoRoot, 'output', 'tts-audiobook-pilot');
const packageJson = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
const component = readFileSync(join(repoRoot, 'src', 'components', 'TextToSpeechAudiobookGenerator.tsx'), 'utf8');
const inputHelpers = readFileSync(join(repoRoot, 'src', 'lib', 'browserTtsInput.ts'), 'utf8');
const archiveHelpers = readFileSync(join(repoRoot, 'src', 'lib', 'browserTtsArchive.ts'), 'utf8');
const chapterHelpers = readFileSync(join(repoRoot, 'src', 'lib', 'browserTtsChapters.ts'), 'utf8');
const chapterQueue = readFileSync(join(repoRoot, 'src', 'lib', 'browserTtsChapterQueue.ts'), 'utf8');
const estimateHelpers = readFileSync(join(repoRoot, 'src', 'lib', 'browserTtsEstimate.ts'), 'utf8');
const importHelpers = readFileSync(join(repoRoot, 'src', 'lib', 'browserTtsImport.ts'), 'utf8');
const markdownImport = readFileSync(join(repoRoot, 'src', 'lib', 'browserTtsMarkdownImport.ts'), 'utf8');
const epubImport = readFileSync(join(repoRoot, 'src', 'lib', 'browserTtsEpubImport.ts'), 'utf8');
const voicePreferences = readFileSync(join(repoRoot, 'src', 'lib', 'browserTtsPreferences.ts'), 'utf8');
const registry = readFileSync(join(repoRoot, 'src', 'lib', 'browserTtsModels.ts'), 'utf8');
const mp3Encoder = readFileSync(join(repoRoot, 'src', 'lib', 'mp3Encoder.ts'), 'utf8');
const kokoroText = readFileSync(join(repoRoot, 'src', 'lib', 'kokoroBrowserText.ts'), 'utf8');
const supertonicWorker = readFileSync(join(repoRoot, 'src', 'workers', 'supertonic.worker.ts'), 'utf8');
const kokoroWorker = readFileSync(join(repoRoot, 'src', 'workers', 'kokoro.worker.ts'), 'utf8');
const supertonicRevision = '3cadd1ee6394adea1bd021217a0e650ede09a323';
const kokoroRevision = '1939ad2a8e416c0acfeecc08a694d14ef25f2231';
const kokoroEnglishVoices = [
  'af_heart', 'af_alloy', 'af_aoede', 'af_bella', 'af_jessica', 'af_kore', 'af_nicole', 'af_nova', 'af_river', 'af_sarah', 'af_sky',
  'am_adam', 'am_echo', 'am_eric', 'am_fenrir', 'am_liam', 'am_michael', 'am_onyx', 'am_puck', 'am_santa',
  'bf_alice', 'bf_emma', 'bf_isabella', 'bf_lily',
  'bm_daniel', 'bm_fable', 'bm_george', 'bm_lewis',
];
const supertonicVoices = ['F1', 'F2', 'F3', 'F4', 'F5', 'M1', 'M2', 'M3', 'M4', 'M5'];
const voiceSamplePaths = [
  ...supertonicVoices.map((voice) => join(repoRoot, 'public', 'audio', 'tts-voice-samples', 'supertonic-3', `${voice.toLowerCase()}.mp3`)),
  ...kokoroEnglishVoices.map((voice) => join(repoRoot, 'public', 'audio', 'tts-voice-samples', 'kokoro-82m', `${voice}.mp3`)),
];
const forbidden = [
  'tts.accessfreetools.com',
  'turnstile',
  'Join audiobook queue',
  'FastAPI',
  'Redis',
];

const checks = {
  browserDependencyPinned: packageJson.dependencies?.['onnxruntime-web'] === '1.27.0',
  phonemizerPinned: packageJson.dependencies?.phonemizer === '1.2.1',
  clarityMasked: component.includes('data-clarity-mask="true"'),
  explicitModelDownloads:
    registry.includes('downloadMegabytes: 398')
    && registry.includes('downloadMegabytes: 326')
    && registry.includes('fallbackDownloadMegabytes: 92'),
  modelRevisionsPinned: registry.includes(supertonicRevision) && registry.includes(kokoroRevision),
  noServerServiceTree: !existsSync(join(repoRoot, 'services', 'tts', 'compose.yaml')),
  noServerTermsInRuntime: forbidden.every((term) => !`${component}\n${supertonicWorker}\n${kokoroWorker}`.includes(term)),
  usesModelSpecificWorkers:
    component.includes("new URL('../workers/supertonic.worker.ts'")
    && component.includes("new URL('../workers/kokoro.worker.ts'"),
  loadsOnlySelectedModelAndVoice:
    component.includes('Only the selected model and voice load')
    && component.includes('activeWorkerModelRef')
    && kokoroWorker.includes('if (loadedVoiceData && loadedVoice === voice)')
    && kokoroWorker.includes('fetch(`${VOICE_BASE}/${voice}.bin`)'),
  completeKokoroEnglishVoiceLibrary:
    kokoroEnglishVoices.length === 28
    && kokoroEnglishVoices.every((voice) => registry.includes(`value: '${voice}'`))
    && registry.includes("defaultVoice: 'af_bella'"),
  groupedAccessibleVoiceMenu:
    component.includes('<optgroup key={group.label} label={group.label}>')
    && component.includes('getBrowserTtsVoiceGroups')
    && component.includes('tts-audiobook__voice-summary'),
  staticVoiceSamplesAvailable:
    voiceSamplePaths.length === 38
    && voiceSamplePaths.every((path) => existsSync(path) && readFileSync(path).byteLength > 32_000),
  voiceSamplesAvoidModelStartup:
    component.includes('getBrowserTtsVoiceSampleUrl')
    && component.includes('preload="none"')
    && component.includes("'tts_voice_sample_play'")
    && !component.includes("startGeneration('preview')")
    && !inputHelpers.includes('MAX_TTS_PREVIEW_CHARACTERS')
    && !component.includes('autoPlay'),
  localVoicePreferencesAreBounded:
    component.includes('createBrowserTtsVoicePreferencesStore')
    && component.includes('Only voice IDs are saved in this browser')
    && voicePreferences.includes("BROWSER_TTS_PREFERENCES_STORAGE_KEY = 'aft:tts:voice-preferences:v1'")
    && voicePreferences.includes('MAX_BROWSER_TTS_FAVORITES = 20')
    && voicePreferences.includes('MAX_BROWSER_TTS_RECENTS = 8'),
  estimateRunsBeforeModelDownload:
    component.includes('estimateBrowserTtsAudio(activeSourceText, speed)')
    && component.includes('Before you download the model')
    && estimateHelpers.includes('BROWSER_TTS_MP3_BITRATE_BPS = 128_000')
    && !estimateHelpers.includes('Worker')
    && !estimateHelpers.includes('fetch('),
  supertonicUsesWebGpuWithFallback:
    supertonicWorker.includes("['webgpu', 'wasm']") && supertonicWorker.includes("['wasm']"),
  kokoroUsesWebGpuWithCompatibilityFallback:
    registry.includes('selectKokoroRuntimePlan')
    && kokoroWorker.includes('selectKokoroRuntimePlan(webGpuAvailable, forceWasm)')
    && kokoroWorker.includes('selectKokoroRuntimePlan(false)')
    && kokoroWorker.includes('await gpu?.requestAdapter()'),
  stalledWorkerHasBoundedRecovery:
    component.includes('WORKER_STALL_TIMEOUT_MS = 90_000')
    && component.includes('Retrying Kokoro compatibility mode')
    && component.includes('forceWasm: true'),
  mascotLoadingState:
    component.includes('tts-audiobook__loading-scene')
    && component.includes('/tool-art/text-to-speech-audiobook-generator-tool.webp')
    && component.includes('tts-audiobook__sound-wave'),
  kokoroLongTextIsChunked:
    kokoroText.includes('KOKORO_MAX_MODEL_TOKENS = 509')
    && kokoroWorker.includes('splitTextForKokoro')
    && kokoroWorker.includes('selectKokoroVoiceStyle')
    && kokoroText.includes('KOKORO_TEXT_CHUNK_CHARACTERS = 320'),
  mp3DependencyPinned: packageJson.dependencies?.['wasm-media-encoders'] === '0.7.0',
  mp3GeneratedInBothWorkers:
    [supertonicWorker, kokoroWorker].every((worker) => (
      worker.includes('encodePcmToMp3') && worker.includes("mimeType: 'audio/mpeg'")
    )),
  mp3SupportsBothSourceRates: mp3Encoder.includes('24_000') && mp3Encoder.includes('44_100'),
  mp3DownloadAvailable: component.includes('Download MP3') && component.includes('.mp3'),
  localDocumentInputIsBounded:
    component.includes('.txt,.md,.markdown,.epub')
    && component.includes('await file.arrayBuffer()')
    && inputHelpers.includes('MAX_TTS_TEXT_FILE_BYTES = 64 * 1024')
    && inputHelpers.includes('MAX_TTS_TEXT_CHARACTERS = 10_000')
    && !component.includes('FormData'),
  markdownAndEpubAreStructuredAndLazy:
    component.includes("import('../lib/browserTtsMarkdownImport')")
    && component.includes("import('../lib/browserTtsEpubImport')")
    && packageJson.dependencies?.['mdast-util-from-markdown'] === '2.0.3'
    && packageJson.dependencies?.['@rgrove/parse-xml'] === '4.2.3'
    && packageJson.dependencies?.['@zip.js/zip.js'] === '2.8.52'
    && markdownImport.includes('fromMarkdown(')
    && epubImport.includes('ZipReader')
    && epubImport.includes('parseXml('),
  hostileDocumentControls:
    importHelpers.includes("'zip-bomb'")
    && importHelpers.includes("'drm-or-encryption'")
    && importHelpers.includes("'scripted-content'")
    && importHelpers.includes("'remote-resource'")
    && epubImport.includes('checkOverlappingEntry: true')
    && component.includes('bytes?.fill(0)'),
  chapterQueueUsesOneLoadedWorker:
    component.includes('new BrowserTtsChapterQueue<AudioResult>')
    && component.includes('workerLoadedRef.current')
    && chapterQueue.includes('await this.runOne(next.chapterId, signal)')
    && chapterQueue.includes('retry(chapterId: string')
    && chapterQueue.includes('AbortSignal'),
  chapterDownloadsAndZip:
    chapterHelpers.includes('createBrowserTtsChapterMp3Files')
    && archiveHelpers.includes('createBrowserTtsChapterZip')
    && archiveHelpers.includes("await import('@zip.js/zip.js')")
    && component.includes('Download browser audiobook chapter ZIP')
    && component.includes('does not contain your text or source document'),
  portableMp3Filename:
    component.includes('MP3 filename (optional)')
    && component.includes('sanitizeMp3Filename')
    && inputHelpers.includes('WINDOWS_RESERVED_NAME'),
  browserReadinessIsAnExpectation:
    component.includes('WebGPU adapter detected. Kokoro full precision can be attempted')
    && component.includes('No WebGPU adapter detected. Kokoro will use its smaller q8 compatibility path.'),
  textFreeDiagnostics:
    ['tts_timeout', 'tts_model_download_failure', 'tts_unsupported_browser', 'tts_generation_failure']
      .every((event) => component.includes(`'${event}'`)),
  unsupportedFileFamiliesAbsent:
    ['accept=".pdf', 'accept=".docx'].every((term) => !component.includes(term)),
  noVoiceCloning: !component.toLowerCase().includes('clone a voice') && !component.includes('voice upload'),
};

const report = {
  generatedAt: new Date().toISOString(),
  mode: 'existing-hosting-browser-inference',
  modelRevisions: {
    kokoro: kokoroRevision,
    supertonic: supertonicRevision,
  },
  status: Object.values(checks).every(Boolean) ? 'pass' : 'fail',
  checks,
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'browser-check.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  join(outputDir, 'browser-check.md'),
  [
    '# Browser Text-to-MP3 Pilot Check',
    '',
    `- Status: **${report.status.toUpperCase()}**`,
    '- Infrastructure: existing Hostinger Astro site only',
    '- Inference and MP3 encoding: visitor browser worker',
    `- Supertonic revision: \`${supertonicRevision}\``,
    `- Kokoro revision: \`${kokoroRevision}\``,
    '- Model loading: one model-specific worker at a time',
    '- Voice loading: one selected fixed voice file at a time',
    '- Kokoro library: 28 pinned English voices in four groups',
    '- Voice samples: 38 pre-generated local MP3s; no model load before generation',
    '- Purchases, VPS, DNS, Docker, Redis, and server queue: not used',
    '',
    '## Checks',
    '',
    ...Object.entries(checks).map(([name, passed]) => `- ${passed ? 'PASS' : 'FAIL'}: ${name}`),
    '',
  ].join('\n'),
);

console.log(`Browser TTS pilot check: ${report.status.toUpperCase()}`);
if (report.status !== 'pass') process.exitCode = 1;
