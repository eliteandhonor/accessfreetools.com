import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const command = process.execPath;
const args = [
  resolve('node_modules/vitest/vitest.mjs'),
  'run',
  '--configLoader',
  'runner',
  'src/lib/browserTtsFeatureSoak.test.ts',
];
const startedAt = new Date();
const result = spawnSync(command, args, { cwd: process.cwd(), encoding: 'utf8', stdio: 'pipe' });
process.stdout.write(result.stdout ?? '');
process.stderr.write(result.stderr ?? '');
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const completedAt = new Date();
const evidence = {
  completedAt: completedAt.toISOString(),
  durationMs: completedAt.getTime() - startedAt.getTime(),
  limits: { chapters: 100, combinedCharacters: 10_000, queueConcurrency: 1 },
  result: 'pass',
  scope: 'Pure queue and audio-only ZIP soak with bounded mock MP3 bytes; model inference is verified separately.',
  testFile: 'src/lib/browserTtsFeatureSoak.test.ts',
};
const directory = resolve('output/tts-feature-campaign/chapter-soak');
await mkdir(directory, { recursive: true });
await writeFile(resolve(directory, 'latest.json'), `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
await writeFile(
  resolve(directory, 'latest.md'),
  `# Browser TTS Feature Soak\n\n- Result: pass\n- Chapters: 100\n- Combined characters: 10,000\n- Peak queue concurrency: 1\n- ZIP entries: 100 ordered MP3 files\n- Duration: ${evidence.durationMs} ms\n- Scope: ${evidence.scope}\n`,
  'utf8',
);
console.log(`Saved soak evidence to ${directory}`);
