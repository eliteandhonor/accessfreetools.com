import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { loadPinterestAppCoverage } from './lib/pinterest-app-catalog.mjs';
import {
  buildPinterestBoardFeedRequest,
  collectPinterestPublicProof,
  mergePinterestProof,
  parsePinterestBoardHtml,
  parsePinterestBoardFeedResponse,
  PINTEREST_USER_AGENT,
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
const maxPages = 20;

for (const board of boards) {
  const boardUrl = `https://au.pinterest.com/accessfreetools/${board.boardSlug}/`;

  try {
    const response = await fetch(boardUrl, {
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'cache-control': 'no-cache',
        'user-agent': PINTEREST_USER_AGENT,
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const parsed = parsePinterestBoardHtml({ html, ...board });
    const pins = [...parsed.pins];
    let nextBookmark = parsed.nextBookmark;
    let pagesFetched = 1;
    const seenBookmarks = new Set();

    if (!parsed.resourceOptions || !parsed.appVersion) {
      throw new Error('Pinterest board pagination metadata was missing.');
    }

    while (nextBookmark && nextBookmark !== '-end-' && pagesFetched < maxPages) {
      if (seenBookmarks.has(nextBookmark)) {
        throw new Error('Pinterest returned a repeated board pagination bookmark.');
      }
      seenBookmarks.add(nextBookmark);

      const request = buildPinterestBoardFeedRequest({
        boardPath: parsed.expectedBoardPath,
        resourceOptions: parsed.resourceOptions,
        bookmark: nextBookmark,
        appVersion: parsed.appVersion,
      });
      const pageResponse = await fetch(request.url, {
        headers: request.headers,
        redirect: 'follow',
        signal: AbortSignal.timeout(20_000),
      });

      if (!pageResponse.ok) {
        throw new Error(`Pinterest board pagination returned HTTP ${pageResponse.status}.`);
      }

      const page = parsePinterestBoardFeedResponse({
        json: await pageResponse.json(),
        ...board,
        startIndex: pins.length,
      });
      pins.push(...page.pins);
      nextBookmark = page.nextBookmark;
      pagesFetched += 1;
    }

    if (nextBookmark && nextBookmark !== '-end-') {
      throw new Error(`Pinterest board pagination exceeded ${maxPages} pages.`);
    }

    boardResults.push({
      ...parsed,
      pins,
      nextBookmark,
      boardUrl,
      initialPinCount: parsed.pins.length,
      publicPinCount: pins.length,
      pagesFetched,
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
  scanScope: 'Complete public Pinterest board feed using the live Edge pagination request.',
  published,
  boards: boardResults.map((board) => ({
    boardSlug: board.boardSlug,
    boardTitle: board.boardTitle,
    boardUrl: board.boardUrl,
    initialPinCount: board.initialPinCount,
    publicPinCount: board.publicPinCount,
    pagesFetched: board.pagesFetched,
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
    'The scanner follows public board bookmarks until Pinterest returns -end-.',
    'Rerun after each RSS import wave so newly public Pins are removed from future feeds promptly.',
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
