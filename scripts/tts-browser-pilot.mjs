import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(repoRoot, 'output', 'tts-audiobook-pilot');
const packageJson = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
const component = readFileSync(join(repoRoot, 'src', 'components', 'TextToSpeechAudiobookGenerator.tsx'), 'utf8');
const worker = readFileSync(join(repoRoot, 'src', 'workers', 'supertonic.worker.ts'), 'utf8');
const modelRevision = '3cadd1ee6394adea1bd021217a0e650ede09a323';
const forbidden = [
  'tts.accessfreetools.com',
  'turnstile',
  'Join audiobook queue',
  'FastAPI',
  'Redis',
];

const checks = {
  browserDependencyPinned: packageJson.dependencies?.['onnxruntime-web'] === '1.27.0',
  clarityMasked: component.includes('data-clarity-mask="true"'),
  explicitModelDownload: component.includes('MODEL_DOWNLOAD_MB = 398'),
  modelRevisionPinned: worker.includes(modelRevision),
  noServerServiceTree: !existsSync(join(repoRoot, 'services', 'tts', 'compose.yaml')),
  noServerTermsInRuntime: forbidden.every((term) => !`${component}\n${worker}`.includes(term)),
  usesDedicatedWorker: component.includes("new Worker(new URL('../workers/supertonic.worker.ts'"),
  usesWebGpuWithFallback: worker.includes("['webgpu', 'wasm']") && worker.includes("['wasm']"),
  wavGeneratedInWorker: worker.includes('writeWavFile'),
};

const report = {
  generatedAt: new Date().toISOString(),
  mode: 'existing-hosting-browser-inference',
  modelRevision,
  status: Object.values(checks).every(Boolean) ? 'pass' : 'fail',
  checks,
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'browser-check.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  join(outputDir, 'browser-check.md'),
  [
    '# Browser TTS Pilot Check',
    '',
    `- Status: **${report.status.toUpperCase()}**`,
    '- Infrastructure: existing Hostinger Astro site only',
    '- Inference: visitor browser worker',
    `- Model revision: \`${modelRevision}\``,
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
