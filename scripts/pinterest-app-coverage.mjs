import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { loadPinterestAppCoverage } from './lib/pinterest-app-catalog.mjs';

const report = loadPinterestAppCoverage();
const jsonPath = resolve('output', 'promotion', 'pinterest-app-coverage.json');
const markdownPath = resolve('output', 'promotion', 'pinterest-app-coverage.md');
const pendingByBoard = Object.entries(
  Object.groupBy(
    report.apps.filter((app) => app.status === 'rss-ready'),
    (app) => app.boardTitle || 'Unmapped',
  ),
)
  .map(([board, apps]) => ({ board, count: apps.length }))
  .sort((a, b) => b.count - a.count || a.board.localeCompare(b.board));

const markdown = [
  '# Pinterest App Coverage',
  '',
  `Generated: ${report.generatedAt}`,
  '',
  '## Completion State',
  '',
  `- Public apps: ${report.counts.totalApps}`,
  `- Apps with verified public Pins: ${report.counts.postedApps}`,
  `- Apps still waiting for Pinterest publication proof: ${report.counts.rssReadyApps}`,
  `- Apps missing from the promotion catalog: ${report.counts.missingApps}`,
  `- Apps with ready Pinterest assets: ${report.counts.assetReadyApps}`,
  '',
  '## Pending By Board',
  '',
  ...(pendingByBoard.length ? pendingByBoard.map((entry) => `- ${entry.board}: ${entry.count}`) : ['- None.']),
  '',
  '## Issues',
  '',
  ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ['- None.']),
  '',
].join('\n');

mkdirSync(dirname(jsonPath), { recursive: true });
writeFileSync(jsonPath, `${JSON.stringify({ ...report, pendingByBoard }, null, 2)}\n`);
writeFileSync(markdownPath, markdown);
console.log(`Saved Pinterest app coverage report to ${markdownPath}`);
console.log(
  `Pinterest app coverage: ${report.counts.postedApps}/${report.counts.totalApps} public, ${report.counts.rssReadyApps} waiting for proof, ${report.counts.assetReadyApps} assets ready.`,
);

if (report.issues.length > 0) {
  console.error(report.issues.join('\n'));
  process.exit(1);
}
