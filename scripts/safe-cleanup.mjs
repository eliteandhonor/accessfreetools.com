import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { formatBytes, runSafeCleanup } from './lib/safe-cleanup.mjs';

function hasFlag(name) {
  return process.argv.includes(name);
}

function cleanupMarkdown(report) {
  const mode = report.apply ? 'apply' : 'dry-run';
  const rows = report.candidates
    .map(
      (candidate) =>
        `| ${candidate.relativePath} | ${formatBytes(candidate.sizeBytes)} | ${candidate.allowed ? 'yes' : 'no'} | ${candidate.reasons.join('; ') || 'none'} |`,
    )
    .join('\n');

  return `# Safe Cleanup ${mode}

Generated: ${report.generatedAt}

- Mode: ${mode}
- Status: ${report.status}
- Candidates: ${report.candidates.length}
- Total candidate size: ${formatBytes(report.totalBytes)}
- Deleted: ${report.deleted.length}

| path | size | allowed | blocked reasons |
| --- | ---: | --- | --- |
${rows || '| none | 0 B | yes | none |'}
`;
}

const apply = hasFlag('--apply');
const rootDir = process.cwd();
const report = {
  generatedAt: new Date().toISOString(),
  kind: 'safe-cleanup',
  rootDir,
  ...runSafeCleanup({ apply, rootDir }),
};

const outputDir = resolve(rootDir, 'output', 'maintenance');
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, 'safe-cleanup-latest.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(resolve(outputDir, 'safe-cleanup-latest.md'), cleanupMarkdown(report));

console.log(`Safe cleanup: ${report.status}`);
console.log(`- Mode: ${apply ? 'apply' : 'dry-run'}`);
console.log(`- Candidates: ${report.candidates.length}`);
console.log(`- Total candidate size: ${formatBytes(report.totalBytes)}`);
console.log(`- Deleted: ${report.deleted.length}`);
console.log(`- Saved report: output/maintenance/safe-cleanup-latest.md`);

if (report.blocked.length) {
  console.log(`- Blocked candidates: ${report.blocked.map((candidate) => candidate.relativePath).join(', ')}`);
  process.exitCode = 1;
}
