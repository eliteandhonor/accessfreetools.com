import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const revision = '1939ad2a8e416c0acfeecc08a694d14ef25f2231';
const repository = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const voices = [
  'af_heart', 'af_alloy', 'af_aoede', 'af_bella', 'af_jessica', 'af_kore', 'af_nicole', 'af_nova', 'af_river', 'af_sarah', 'af_sky',
  'am_adam', 'am_echo', 'am_eric', 'am_fenrir', 'am_liam', 'am_michael', 'am_onyx', 'am_puck', 'am_santa',
  'bf_alice', 'bf_emma', 'bf_isabella', 'bf_lily',
  'bm_daniel', 'bm_fable', 'bm_george', 'bm_lewis',
];
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(repoRoot, 'output', 'tts-audiobook-pilot');

async function inspectVoice(voice) {
  const url = `https://huggingface.co/${repository}/resolve/${revision}/voices/${voice}.bin`;
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    const bytes = Number(response.headers.get('content-length') ?? response.headers.get('x-linked-size') ?? 0);
    return { bytes, ok: response.ok && bytes > 500_000, status: response.status, url, voice };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Request failed', ok: false, url, voice };
  }
}

const results = [];
for (let index = 0; index < voices.length; index += 4) {
  results.push(...await Promise.all(voices.slice(index, index + 4).map(inspectVoice)));
}

const report = {
  generatedAt: new Date().toISOString(),
  repository,
  revision,
  status: results.every((result) => result.ok) ? 'pass' : 'fail',
  voiceCount: voices.length,
  results,
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'voice-check.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  join(outputDir, 'voice-check.md'),
  [
    '# Kokoro Pinned Voice Check',
    '',
    `- Status: **${report.status.toUpperCase()}**`,
    `- Revision: \`${revision}\``,
    `- Voices checked: ${results.length}`,
    '',
    ...results.map((result) => `- ${result.ok ? 'PASS' : 'FAIL'}: ${result.voice} (${result.status ?? 'network error'}, ${result.bytes ?? 0} bytes)`),
    '',
  ].join('\n'),
);

console.log(`Kokoro voice check: ${report.status.toUpperCase()} (${results.filter((result) => result.ok).length}/${results.length})`);
if (report.status !== 'pass') process.exitCode = 1;
