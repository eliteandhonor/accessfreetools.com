import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(repoRoot, 'output', 'tts-audiobook-pilot');
const packageJson = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
const component = readFileSync(join(repoRoot, 'src', 'components', 'TextToSpeechAudiobookGenerator.tsx'), 'utf8');
const registry = readFileSync(join(repoRoot, 'src', 'lib', 'browserTtsModels.ts'), 'utf8');
const mp3Encoder = readFileSync(join(repoRoot, 'src', 'lib', 'mp3Encoder.ts'), 'utf8');
const kokoroText = readFileSync(join(repoRoot, 'src', 'lib', 'kokoroBrowserText.ts'), 'utf8');
const supertonicWorker = readFileSync(join(repoRoot, 'src', 'workers', 'supertonic.worker.ts'), 'utf8');
const kokoroWorker = readFileSync(join(repoRoot, 'src', 'workers', 'kokoro.worker.ts'), 'utf8');
const supertonicRevision = '3cadd1ee6394adea1bd021217a0e650ede09a323';
const kokoroRevision = '1939ad2a8e416c0acfeecc08a694d14ef25f2231';
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
  explicitModelDownloads: registry.includes('downloadMegabytes: 398') && registry.includes('downloadMegabytes: 90'),
  modelRevisionsPinned: registry.includes(supertonicRevision) && registry.includes(kokoroRevision),
  noServerServiceTree: !existsSync(join(repoRoot, 'services', 'tts', 'compose.yaml')),
  noServerTermsInRuntime: forbidden.every((term) => !`${component}\n${supertonicWorker}\n${kokoroWorker}`.includes(term)),
  usesModelSpecificWorkers:
    component.includes("new URL('../workers/supertonic.worker.ts'")
    && component.includes("new URL('../workers/kokoro.worker.ts'"),
  loadsOnlySelectedModel: component.includes('Only the selected model loads') && component.includes('activeWorkerModelRef'),
  supertonicUsesWebGpuWithFallback:
    supertonicWorker.includes("['webgpu', 'wasm']") && supertonicWorker.includes("['wasm']"),
  kokoroUsesSmallWasmModel: kokoroWorker.includes("dtype: 'q8'") && kokoroWorker.includes("device: 'wasm'"),
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
  pasteOnlyInput: !component.includes('Choose TXT or EPUB') && !component.includes('type="file"'),
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
