import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { passingPromotionReview } from '../../tests/helpers/promotionReview.mjs';
import { allPromotionChannelsPassed, summarizePinterestProofEvidence, summarizePromotionChannels } from './promotion-channel-evidence.mjs';
import { collectPinterestPublicProof, parsePinterestBoardHtml, parsePinterestBoardFeedResponse } from './pinterest-public-proof.mjs';

const cli = resolve('scripts/marketing-orchestrator-report.mjs');

function runOrchestrator(review) {
  const parent = resolve(tmpdir());
  const root = mkdtempSync(join(parent, 'aft-four-channel-'));
  function write(path, value) {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));
  }
  try {
    write('docs/brand-code.md', '# Fixture brand');
    write('docs/recommended-agency-agents.md', '# Fixture routing');
    const passing = { generatedAt: new Date().toISOString(), totals: { drafts: 1, passed: 1, errors: 0, warnings: 0 } };
    write('output/promotion/medium-quality-report.json', passing);
    write('output/promotion/bluesky/bluesky-quality-report.json', passing);
    if (review) write('output/promotion/four-channel-review.json', review);
    const command = spawnSync(process.execPath, [cli], { cwd: root, encoding: 'utf8', timeout: 30000 });
    expect(command.error).toBeUndefined();
    return { exit: command.status, report: JSON.parse(readFileSync(join(root, 'output/marketing-orchestrator/daily-plan.json'), 'utf8')) };
  } finally {
    if (dirname(root) !== parent || !root.startsWith(join(parent, 'aft-four-channel-'))) throw new Error('Unsafe fixture cleanup');
    rmSync(root, { recursive: true, force: true });
  }
}

function completeReview() {
  return passingPromotionReview();
}

describe('actual marketing orchestrator four-channel evidence', () => {
  it('does not call two passing platforms a complete review', () => {
    const { exit, report } = runOrchestrator(null);
    expect(report.qualityReports).toHaveLength(4);
    expect(report.qualityReports.every((channel) => channel.status === 'missing')).toBe(true);
    expect(report.wins.join(' ')).not.toContain('All available platform quality reports pass');
    expect(report.recommendations.some((item) => /No urgent promotion action/.test(item.title))).toBe(false);
    expect(exit).toBe(1);
  });

  it('exposes a Pinterest failure even when all other channels pass', () => {
    const review = completeReview();
    Object.assign(review.results.at(-1), { status: 1, passed: false });
    const { exit, report } = runOrchestrator(review);
    expect(report.qualityReports.find((item) => item.channelId === 'pinterest')?.status).toBe('failed');
    expect(report.qualityReports.find((item) => item.channelId === 'site-blog')?.status).toBe('passed');
    expect(exit).toBe(1);
  });

  it('passes only with all expected fresh commands', () => {
    const { exit, report } = runOrchestrator(completeReview());
    expect(report.qualityReports).toHaveLength(4);
    expect(report.qualityReports.every((item) => item.status === 'passed')).toBe(true);
    expect(exit).toBe(0);
  });

  it('rejects a successful Pinterest command with missing destination evidence', () => {
    const review = completeReview();
    review.results.find((row) => row.script === 'promotion:pinterest:proof-scan').evidence = {
      status: 'missing', generatedAt: review.generatedAt,
      counts: { publicPinsScanned: 313, missingDestinations: 313 },
    };
    const { exit, report } = runOrchestrator(review);
    expect(report.qualityReports.find((item) => item.channelId === 'pinterest')?.status).toBe('missing');
    expect(report.qualityReports.find((item) => item.channelId === 'medium')?.status).toBe('passed');
    expect(exit).toBe(1);
  });
});

describe('channel evidence admission', () => {
  it.each([
    ['missing report', () => null, 'missing'],
    ['empty results', (report) => ({ ...report, results: [] }), 'missing'],
    ['dry run', (report) => ({ ...report, dryRun: true }), 'missing'],
    ['parse failure', (report) => ({ ...report, parseError: 'fixture' }), 'missing'],
    ['old report', (report) => ({ ...report, generatedAt: '2001-01-01T00:00:00Z', results: report.results.map((row) => ({ ...row, completedAt: '2001-01-01T00:00:00Z' })) }), 'stale'],
    ['future report', (report) => ({ ...report, generatedAt: '2999-01-01T00:00:00Z' }), 'missing'],
    ['missing command dates', (report) => ({ ...report, results: report.results.map(({ completedAt, ...row }) => row) }), 'missing'],
    ['string exit codes', (report) => ({ ...report, results: report.results.map((row) => ({ ...row, status: '0' })) }), 'missing'],
    ['contradictory pass', (report) => ({ ...report, results: report.results.map((row) => ({ ...row, status: 1 })) }), 'missing'],
    ['duplicate evidence', (report) => ({ ...report, results: [...report.results, ...report.results] }), 'missing'],
  ])('%s cannot create a fresh pass', (_, mutate, state) => {
    const channels = summarizePromotionChannels(mutate(completeReview()));
    expect(channels).toHaveLength(4);
    expect(channels.every((channel) => channel.status === state)).toBe(true);
    expect(allPromotionChannelsPassed(channels)).toBe(false);
  });

  it('keeps stale command dates when a wrapper is regenerated', () => {
    const report = completeReview();
    report.results[0].completedAt = '2001-01-01T00:00:00Z';
    expect(summarizePromotionChannels(report)[0].status).toBe('stale');
  });

  it('retains mixed command states and does not leak command output into health summaries', () => {
    const report = completeReview();
    report.results[0].status = 2;
    report.results[0].passed = false;
    report.results[0].stderr = 'private-synthetic-token';
    report.results[1].completedAt = null;
    const channels = summarizePromotionChannels(report);
    expect(channels[0]).toMatchObject({ status: 'failed', failed: 1, missing: 1 });
    expect(JSON.stringify(channels)).not.toContain('private-synthetic-token');
  });

  it('requires the exact four channels, not empty or duplicate passing rows', () => {
    const channels = summarizePromotionChannels(completeReview());
    expect(allPromotionChannelsPassed(channels)).toBe(true);
    expect(allPromotionChannelsPassed([])).toBe(false);
    expect(allPromotionChannelsPassed([channels[0], channels[0], channels[1], channels[2]])).toBe(false);
  });

  it.each([
    ['absent scan summary', (row) => { delete row.evidence; }, 'missing'],
    ['missing execution start', (row) => { delete row.startedAt; }, 'missing'],
    ['stale scan in a fresh wrapper', (row) => { row.evidence.generatedAt = '2001-01-01T00:00:00Z'; }, 'stale'],
    ['future scan', (row) => { row.evidence.generatedAt = '2999-01-01T00:00:00Z'; }, 'missing'],
    ['prior execution scan', (row) => { row.evidence.generatedAt = new Date(Date.parse(row.startedAt) - 1000).toISOString(); }, 'missing'],
    ['contradictory destination counts', (row) => { row.evidence.counts.missingDestinations = 1; }, 'missing'],
    ['malformed counts', (row) => { row.evidence.counts.publicPinsScanned = '1'; }, 'missing'],
    ['legacy completion summary', (row) => { delete row.evidence.counts.boardsCompleted; }, 'missing'],
    ['incomplete board summary', (row) => { row.evidence.counts.boardsCompleted = 0; }, 'missing'],
    ['unknown scan state', (row) => { row.evidence.status = 'approved'; }, 'missing'],
    ['failed scan content', (row) => { row.evidence.status = 'failed'; }, 'failed'],
  ])('keeps %s out of passed Pinterest evidence', (_, mutate, expected) => {
    const report = completeReview();
    const row = report.results.find((item) => item.script === 'promotion:pinterest:proof-scan');
    mutate(row);
    row.evidence && (row.evidence.reason = 'private-synthetic-token');
    const channels = summarizePromotionChannels(report);
    expect(channels.find((channel) => channel.channelId === 'pinterest').status).toBe(expected);
    expect(JSON.stringify(channels)).not.toContain('private-synthetic-token');
    expect(allPromotionChannelsPassed(channels)).toBe(false);
  });
});

function scanFixture() {
  return {
    generatedAt: new Date().toISOString(), mode: 'dry-run',
    counts: { boardsExpected: 1, boardsFetched: 1, publicPinsScanned: 1, uniqueAppPinsDiscovered: 1, skipped: 0, hardIssues: 0 },
    boards: [{ nextBookmark: '-end-', paginationComplete: true }], alreadyCovered: [{ destination: 'https://accessfreetools.com/tools/basic-calculator/' }],
    importable: [], skipped: [], hardIssues: [],
  };
}

describe('Pinterest pagination parser to orchestrator proof', () => {
  const board = { boardSlug: 'fixture', boardTitle: 'Fixture Board' };
  const apps = [{ slug: 'basic-calculator', boardSlug: 'fixture', status: 'rss-ready' }];
  const pins = [{ type: 'pin', id: '123', link: 'https://accessfreetools.com/tools/basic-calculator/' }];
  const markers = [
    ['absent', undefined, false], ['null', null, false], ['empty', '', false],
    ['whitespace', ' ', false], ['object', {}, false], ['array', ['-end-'], false],
    ['boolean', true, false], ['number', 1, false], ['continuation', 'next-page', false],
    ['terminal', '-end-', true],
  ];
  for (const shape of ['initial HTML', 'paginated JSON']) {
    it.each(markers)(`${shape} %s cannot invent completion`, (_, marker, complete) => {
      const page = shape === 'initial HTML'
        ? parsePinterestBoardHtml({ ...board, html: `<script id="__PWS_INITIAL_PROPS__">${JSON.stringify({
          initialReduxState: { resources: { BoardFeedResource: {
            '[ ["board_id", "123"] ]': { data: pins, nextBookmark: marker },
          } } },
        })}</script>` })
        : parsePinterestBoardFeedResponse({ ...board, json: { resource_response: { status: 'success', data: pins, bookmark: marker } } });
      const proof = collectPinterestPublicProof({ boardResults: [page], apps });
      const scan = { ...scanFixture(), ...proof, boards: [page] };
      scan.alreadyCovered = proof.alreadyCovered;
      scan.importable = proof.importable;
      const review = passingPromotionReview(scan.generatedAt);
      review.results.find((row) => row.script === 'promotion:pinterest:proof-scan').evidence = summarizePinterestProofEvidence(scan);
      const { exit, report } = runOrchestrator(review);
      expect(report.qualityReports.find((row) => row.channelId === 'pinterest').status).toBe(complete ? 'passed' : 'missing');
      expect(exit).toBe(complete ? 0 : 1);
      expect(page.paginationComplete).toBe(complete);
    });
  }
});

describe('Pinterest report contents, not command exit alone', () => {
  it('recognizes a populated, completed read-only scan without exposing Pin details', () => {
    const scan = scanFixture();
    scan.alreadyCovered[0].pinId = 'private-synthetic-token';
    const result = summarizePinterestProofEvidence(scan);
    expect(result.status).toBe('passed');
    expect(result.counts.missingDestinations).toBe(0);
    expect(JSON.stringify(result)).not.toContain('private-synthetic-token');
    expect(JSON.stringify(result)).not.toContain('https://');
  });

  it('marks the observed 313 missing destination pattern as missing, not successful or broken Pins', () => {
    const scan = scanFixture();
    Object.assign(scan.counts, { publicPinsScanned: 313, uniqueAppPinsDiscovered: 0, skipped: 313 });
    scan.alreadyCovered = [];
    scan.skipped = Array.from({ length: 313 }, () => ({ reason: 'missing', destination: '' }));
    expect(summarizePinterestProofEvidence(scan)).toMatchObject({ status: 'missing', counts: { missingDestinations: 313 } });
  });

  it('does not confuse intentional skips with missing fields', () => {
    const scan = scanFixture();
    scan.skipped = [{ reason: 'different-owner' }, { reason: 'non-tool', destination: 'https://accessfreetools.com/blog/' }];
    Object.assign(scan.counts, { skipped: 2, publicPinsScanned: 3 });
    expect(summarizePinterestProofEvidence(scan).status).toBe('passed');
  });

  it.each([
    ['missing report', () => null, 'missing'],
    ['truncated pagination', (scan) => { scan.boards[0].nextBookmark = 'opaque-bookmark'; return scan; }, 'missing'],
    ['legacy inferred completion', (scan) => { delete scan.boards[0].paginationComplete; return scan; }, 'missing'],
    ['unproven completion', (scan) => { scan.boards[0].paginationComplete = false; return scan; }, 'missing'],
    ['no scanned pins', (scan) => { scan.counts.publicPinsScanned = 0; scan.counts.uniqueAppPinsDiscovered = 0; scan.alreadyCovered = []; return scan; }, 'missing'],
    ['missing board', (scan) => { scan.counts.boardsExpected = 2; return scan; }, 'missing'],
    ['count mismatch', (scan) => { scan.counts.skipped = 3; return scan; }, 'missing'],
    ['missing arrays', (scan) => { delete scan.skipped; return scan; }, 'missing'],
    ['invalid date', (scan) => { scan.generatedAt = 'not-a-date'; return scan; }, 'missing'],
    ['write-mode report', (scan) => { scan.mode = 'apply'; return scan; }, 'missing'],
    ['fetch failure', (scan) => { scan.hardIssues = ['private-synthetic-token']; scan.counts.hardIssues = 1; return scan; }, 'failed'],
    ['invalid destination', (scan) => { scan.skipped = [{ reason: 'invalid' }]; scan.counts.skipped = 1; scan.counts.publicPinsScanned = 2; return scan; }, 'failed'],
  ])('handles %s conservatively', (_, mutate, status) => {
    const summary = summarizePinterestProofEvidence(mutate(scanFixture()));
    expect(summary.status).toBe(status);
    expect(JSON.stringify(summary)).not.toContain('private-synthetic-token');
  });
});
