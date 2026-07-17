import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { loadPinterestAppCoverage } from './lib/pinterest-app-catalog.mjs';
import {
  collectPinterestPublicProof,
  mergePinterestProof,
  parsePinterestBoardHtml,
} from './lib/pinterest-public-proof.mjs';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const publishedArg = args.find((arg) => arg.startsWith('--published='))?.split('=')[1];
const published = publishedArg || new Date().toISOString().slice(0, 10);

if (!/^\d{4}-\d{2}-\d{2}$/.test(published)) {
  throw new Error(`Invalid --published date: ${published}`);
}

const coverage = loadPinterestAppCoverage();
const boards = [...new Map(coverage.apps.map((app) => [app.boardSlug, {
  boardSlug: app.boardSlug,
  boardTitle: app.boardTitle,
}])).values()].sort((left, right) => left.boardSlug.localeCompare(right.boardSlug));
const boardResults = [];
const fetchFailures = [];

for (const board of boards) {
  const boardUrl = `https://au.pinterest.com/accessfreetools/${board.boardSlug}/`;

  try {
    const response = await fetch(boardUrl, {
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'cache-control': 'no-cache',
        'user-agent': 'Mozilla/5.0 (compatible; AccessFreeToolsPinterestProof/1.0)',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const parsed = parsePinterestBoardHtml({ html, ...board });
    boardResults.push({
      ...parsed,
      boardUrl,
      initialPinCount: parsed.pins.length,
    });
  } catch (error) {
    fetchFailures.push(`${board.boardSlug}: ${error.message}`);
  }
}

const proofScan = collectPinterestPublicProof({ boardResults, apps: coverage.apps });
const hardIssues = [...fetchFailures, ...proofScan.hardIssues];
const proofPath = resolve('src', 'data', 'pinterestAppProof.json');
const currentProof = JSON.parse(readFileSync(proofPath, 'utf8'));
const mergeResult = mergePinterestProof({
  currentProof,
  candidates: proofScan.importable,
  published,
});

if (apply && hardIssues.length > 0) {
  throw new Error(`Refusing Pinterest proof import:\n${hardIssues.join('\n')}`);
}

if (apply && mergeResult.added.length > 0) {
  writeFileSync(proofPath, `${JSON.stringify(mergeResult.proof, null, 2)}\n`);
}

const generatedAt = new Date().toISOString();
const report = {
  generatedAt,
  mode: apply ? 'apply' : 'dry-run',
  scanScope: 'Public Pinterest board initial state; up to 15 current feed items per board.',
  published,
  boards: boardResults.map((board) => ({
    boardSlug: board.boardSlug,
    boardTitle: board.boardTitle,
    boardUrl: board.boardUrl,
    initialPinCount: board.initialPinCount,
    nextBookmark: board.nextBookmark,
  })),
  counts: {
    boardsExpected: boards.length,
    boardsFetched: boardResults.length,
    publicPinsScanned: boardResults.reduce((sum, board) => sum + board.pins.length, 0),
    uniqueAppPinsDiscovered: proofScan.discovered.length,
    alreadyCovered: proofScan.alreadyCovered.length,
    importable: proofScan.importable.length,
    imported: apply ? mergeResult.added.length : 0,
    skipped: proofScan.skipped.length,
    hardIssues: hardIssues.length,
  },
  importedSlugs: apply ? mergeResult.added : [],
  importable: proofScan.importable,
  alreadyCovered: proofScan.alreadyCovered,
  skipped: proofScan.skipped,
  hardIssues,
  notices: [
    'The scanner is read-only unless --apply is provided.',
    'Existing saved or manual public proof is preserved.',
    'Current public board HTML exposes the newest feed page; rerun after RSS import waves to capture later Pins.',
  ],
};

const jsonPath = resolve('output', 'promotion', 'pinterest-public-proof-scan.json');
const markdownPath = resolve('output', 'promotion', 'pinterest-public-proof-scan.md');
const markdown = [
  '# Pinterest Public Proof Scan',
  '',
  `Generated: ${generatedAt}`,
  `Mode: ${report.mode}`,
  '',
  '## Counts',
  '',
  `- Boards fetched: ${report.counts.boardsFetched}/${report.counts.boardsExpected}`,
  `- Public Pins scanned: ${report.counts.publicPinsScanned}`,
  `- Unique app Pins discovered: ${report.counts.uniqueAppPinsDiscovered}`,
  `- Already covered: ${report.counts.alreadyCovered}`,
  `- New proof candidates: ${report.counts.importable}`,
  `- Proof rows imported: ${report.counts.imported}`,
  `- Hard issues: ${report.counts.hardIssues}`,
  '',
  '## New Proof Candidates',
  '',
  ...(report.importable.length
    ? report.importable.map((candidate) => `- ${candidate.slug}: ${candidate.pinUrl} (${candidate.boardTitle})`)
    : ['- None.']),
  '',
  '## Hard Issues',
  '',
  ...(hardIssues.length ? hardIssues.map((issue) => `- ${issue}`) : ['- None.']),
  '',
  '## Notices',
  '',
  ...report.notices.map((notice) => `- ${notice}`),
  '',
].join('\n');

mkdirSync(dirname(jsonPath), { recursive: true });
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(markdownPath, markdown);

console.log(`Saved Pinterest public proof scan to ${markdownPath}`);
console.log(
  `Pinterest public proof: ${report.counts.importable} new candidates, ${report.counts.imported} imported, ${report.counts.hardIssues} hard issues.`,
);

if (hardIssues.length > 0) {
  process.exitCode = 1;
}
