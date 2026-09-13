import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { passingPromotionReview } from '../tests/helpers/promotionReview.mjs';

const repoRoot = process.cwd();
const roots = [];
const now = '2026-09-06T00:00:00.000Z';
const observedAt = '2026-09-05T00:00:00.000Z';
const july = '2026-07-20T00:00:00.000Z';
const rawPath = 'output/search-console-url-inspection.json';
const weeklyPath = 'output/seo-agent-self-evaluation.json';
const origin = 'https://accessfreetools.com';
const excluded = ['/feed.xml', '/pinterest-feed.xml', '/support/', '/sitemap/'];

function writeFixture(root, path, value) {
  const file = join(root, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));
}

function fixture(inspections, generatedAt = observedAt) {
  const root = mkdtempSync(join(tmpdir(), 'aft-indexing-classification-'));
  roots.push(root);
  writeFixture(root, rawPath, { generatedAt, inspections });
  writeFixture(root, 'docs/brand-code.md', 'Synthetic brand guidance.');
  writeFixture(root, 'docs/recommended-agency-agents.md', 'Synthetic specialist guidance.');
  writeFixture(root, 'output/promotion/four-channel-review.json', passingPromotionReview(now));
  return root;
}

function observation(path, coverageState, verdict = 'NEUTRAL') {
  return { inspectionUrl: origin + path, coverageState, verdict };
}

function run(root, consumer) {
  const preload = `
    const NativeDate = Date;
    globalThis.Date = class extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [${JSON.stringify(now)}])); }
      static now() { return NativeDate.parse(${JSON.stringify(now)}); }
    };
    globalThis.fetch = () => { throw new Error('Network forbidden in indexing classification tests'); };
  `;
  let args;
  if (consumer === 'cli') args = [resolve(repoRoot, 'scripts/aft-cli.mjs'), 'indexing-gaps', '--json'];
  else if (consumer === 'weekly') args = [resolve(repoRoot, 'scripts/seo-agent-self-evaluation.mjs'), '--skip-dataforseo'];
  else if (consumer === 'marketing') args = [resolve(repoRoot, 'scripts/marketing-orchestrator-report.mjs')];
  else {
    const moduleUrl = pathToFileURL(resolve(repoRoot, 'scripts/lib/agent-tools-report.mjs')).href;
    const method = consumer === 'links' ? 'buildLinkHelperReport' : 'buildSeoConsoleReport';
    args = ['--input-type=module', '-e', `import { ${method} } from ${JSON.stringify(moduleUrl)}; console.log(JSON.stringify(${method}()));`];
  }
  const result = spawnSync(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(preload)}`, ...args],
    { cwd: root, encoding: 'utf8', timeout: 15_000 });
  expect(result.status, `${result.stderr}\n${result.stdout}`).toBe(0);
  if (consumer === 'weekly') return JSON.parse(readFileSync(join(root, weeklyPath), 'utf8'));
  return consumer === 'marketing'
    ? JSON.parse(readFileSync(join(root, 'output/marketing-orchestrator/daily-plan.json'), 'utf8'))
    : JSON.parse(result.stdout);
}

function gaps(report, consumer) {
  if (consumer === 'cli') return report.gaps;
  if (consumer === 'marketing') return report.indexingGaps;
  if (consumer === 'links') return report.sources.searchConsole.gaps;
  return report.indexing?.gaps ?? report.actions.filter((item) => /https:\/\/accessfreetools.com/.test(item.task));
}

afterEach(() => {
  while (roots.length) {
    const root = roots.pop();
    expect(dirname(root)).toBe(tmpdir());
    expect(root.startsWith(join(tmpdir(), 'aft-indexing-classification-'))).toBe(true);
    rmSync(root, { recursive: true, force: true });
  }
});

describe.each(['cli', 'marketing', 'links', 'console'])('%s indexing classification entry point', (consumer) => {
  it('never treats PASS coverage variants or undated PASS as recovery', () => {
    const root = fixture([
      observation('/tools/kawaii-emoji-generator/', 'Indexed, not submitted in sitemap', 'PASS'),
      observation('/pass-submitted/', 'Submitted and indexed', 'pass'),
      observation('/pass-crawled/', 'Crawled - currently not indexed', ' PASS '),
      observation('/pass-unknown/', 'URL is unknown to Google', 'PASS'),
      observation('/pass-empty/', '', 'PASS'),
      { ...observation('/pass-undated/', 'Indexed, not submitted in sitemap', 'PASS'), sourceGeneratedAt: null, sourcePath: null },
    ]);
    expect(gaps(run(root, consumer), consumer)).toEqual([]);
  });

  it.each(['Excluded by noindex tag', 'URL is unknown to Google', 'Discovered - currently not indexed'])(
    'excludes source-policy routes with %s even after pilot dates expire', (state) => {
      const root = fixture(excluded.map((path) => ({ ...observation(path, state),
        betaEndsAt: '2026-08-01', expiresAt: '2026-08-01' })));
      expect(gaps(run(root, consumer), consumer)).toEqual([]);
    },
  );

  it('keeps unexpected noindex on indexable pages as a failure', () => {
    const root = fixture([observation('/tools/percentage-calculator/', 'Excluded by noindex tag', 'FAIL')]);
    const result = gaps(run(root, consumer), consumer);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ classification: 'failure' });
  });

  it.each([null, july, '2027-01-01T00:00:00.000Z'])('never activates excluded routes from unavailable/stale/future observation %s', (date) => {
    const root = fixture(excluded.map((path) => ({ ...observation(path.replace(/\/$/, '') + '?watch=1', 'URL is unknown to Google'),
      sourceGeneratedAt: date, sourcePath: null })));
    expect(gaps(run(root, consumer), consumer)).toEqual([]);
  });

  it('reports a noindex indexingState even with neutral coverage wording', () => {
    const root = fixture([{ ...observation('/tools/percentage-calculator/', 'Excluded', 'NEUTRAL'),
      indexingState: 'BLOCKED_BY_META_TAG' }]);
    expect(gaps(run(root, consumer), consumer)).toMatchObject([{ classification: 'failure' }]);
  });

  it.each(['BLOCKED_BY_META_TAG', 'BLOCKED_BY_HTTP_HEADER'])('uses fresh %s without coverage prose', (indexingState) => {
    const root = fixture([{ ...observation('/tools/percentage-calculator/', ''), indexingState }]);
    const report = run(root, consumer);
    expect(gaps(report, consumer)).toMatchObject([{ classification: 'failure', status: 'observed',
      sourceGeneratedAt: observedAt, sourcePath: resolve(root, rawPath) }]);
    if (consumer === 'links') expect(report.suggestions[0]).toMatchObject({ action: 'review-indexability', priority: 'high' });
    if (consumer === 'console') expect(report.actions[0].task).toContain('Review unexpected indexing failure');
    if (consumer === 'marketing') expect(report.recommendations[0].title).toBe('Review unexpected indexing failure');
    expect(JSON.stringify(report)).toContain(indexingState);
  });

  it.each(['BLOCKED_BY_META_TAG', 'BLOCKED_BY_HTTP_HEADER'].flatMap((state) =>
    ['', 'URL is unknown to Google'].map((coverage) => [state, coverage]),
  ))('preserves %s through repeated weekly serialization with coverage=%j', (indexingState, coverageState) => {
    const root = fixture([{ ...observation('/tools/percentage-calculator/', coverageState), indexingState }]);
    const expected = { classification: 'failure', indexingState, status: 'observed',
      sourceGeneratedAt: observedAt, sourcePath: resolve(root, rawPath) };
    for (let round = 0; round < 3; round += 1) {
      const weekly = run(root, 'weekly');
      expect(weekly.indexedSummary[0]).toMatchObject({ indexingState, status: 'observed',
        sourceGeneratedAt: observedAt, sourcePath: resolve(root, rawPath) });
      expect(readFileSync(join(root, 'output/seo-agent-self-evaluation.md'), 'utf8')).toContain(indexingState);
      const report = run(root, consumer);
      expect(gaps(report, consumer)).toMatchObject([expected]);
      if (consumer === 'links') expect(report.suggestions[0].action).toBe('review-indexability');
      if (consumer === 'console') expect(report.actions[0].task).toContain('Review unexpected indexing failure');
      if (consumer === 'marketing') expect(report.recommendations[0].title).toBe('Review unexpected indexing failure');
      // Later rounds have only the serialized observation, not a raw fallback.
      writeFixture(root, rawPath, { generatedAt: now, inspections: [] });
    }
  });

  it.each([
    { sourceGeneratedAt: july }, { sourceGeneratedAt: null }, { sourceGeneratedAt: '2027-01-01T00:00:00.000Z' },
    { sourcePath: null }, { error: 'synthetic fetch failure' },
  ])('does not authorize current repair from an untrusted block (%j)', (overrides) => {
    const root = fixture([{ ...observation('/tools/percentage-calculator/', ''), indexingState: 'BLOCKED_BY_META_TAG', ...overrides }]);
    const report = run(root, consumer);
    expect(gaps(report, consumer)[0].status).not.toBe('observed');
    if (consumer === 'links') expect(report.suggestions[0].action).toBe('monitor');
    if (consumer === 'console') expect(report.actions[0].task).toContain('Refresh exact URL Inspection');
    if (consumer === 'marketing') expect(report.recommendations[0].title).toBe('Refresh Search Console inspection evidence');
  });

  it.each(['PASS', 'NEUTRAL'])('uses the newest %s and preserves original provenance and partial URL sets', (verdict) => {
    const root = fixture([observation('/a/', verdict === 'PASS' ? 'Indexed, not submitted in sitemap'
      : 'Crawled - currently not indexed', verdict)]);
    writeFixture(root, weeklyPath, { generatedAt: now, indexedSummary: [
      { ...observation('/a/', verdict === 'PASS' ? 'URL is unknown to Google' : 'Submitted and indexed',
        verdict === 'PASS' ? 'NEUTRAL' : 'PASS'), url: origin + '/a/', sourceGeneratedAt: july, sourcePath: 'original-july.json' },
      { ...observation('/b/', 'URL is unknown to Google'), url: origin + '/b/', sourceGeneratedAt: july, sourcePath: 'other-july.json' },
    ] });
    const result = gaps(run(root, consumer), consumer);
    expect(result.map((item) => item.url)).toEqual(verdict === 'PASS' ? [origin + '/b/'] : [origin + '/a/', origin + '/b/']);
    expect(result.find((item) => item.url === origin + '/b/')).toMatchObject({ sourceGeneratedAt: july,
      sourcePath: 'other-july.json', sourceFreshness: 'stale', status: 'historical' });
    if (verdict !== 'PASS') expect(result[0]).toMatchObject({ sourceGeneratedAt: observedAt,
      sourcePath: resolve(root, rawPath), sourceFreshness: 'fresh', status: 'observed' });
  });
});

describe('other report inputs cannot override indexation policy', () => {
  it.each(['title', 'reason', 'path'])('checks relative saved marketing routes in %s while retaining real recovery', (field) => {
    const root = fixture([observation('/tools/kawaii-emoji-generator/', 'Submitted and indexed', 'PASS'),
      observation('/real-gap/', 'Crawled - currently not indexed')]);
    const task = (path) => field === 'title' ? { title: `Request indexing for ${path}?fixture=1#result` }
      : { title: 'Request indexing for target', [field]: path };
    writeFixture(root, 'output/marketing-orchestrator/daily-plan.json', { recommendations: [
      task(excluded[0]), task('/tools/kawaii-emoji-generator/'), task('/real-gap/'),
    ] });
    const report = run(root, 'console');
    const retained = report.actions.filter((item) => item.evidence === 'output/marketing-orchestrator/daily-plan.json');
    expect(retained).toHaveLength(1);
    expect(retained[0].task).toBe(field === 'title' ? 'Request indexing for /real-gap/?fixture=1#result' : 'Request indexing for target');
    expect(report.indexing.gaps.map((item) => item.url)).toEqual([origin + '/real-gap/']);
  });

  it('keeps CrawlScout and performance recovery exports for excluded routes monitor-only', () => {
    const root = fixture([]);
    writeFixture(root, 'output/crawlscout/crawlscout-summary.json', {
      pageSample: excluded.map((path) => ({ path, impressions: 100, clicks: 0 })),
    });
    writeFixture(root, 'output/search-console/performance-latest.json', {
      tierARecovery: excluded.map((path) => ({ path, action: 'Recover indexing', evidenceFound: true })),
      opportunities: { highImpressionZeroClickPages: excluded.map((path) => ({ path, impressions: 100, clicks: 0 })) },
    });
    const links = run(root, 'links');
    expect(links.suggestions).toEqual([]);
    expect(links.sources.crawlScout.completed).toHaveLength(excluded.length);
    const consoleReport = run(root, 'console');
    expect(consoleReport.performanceExport.completed).toHaveLength(excluded.length);
    expect(consoleReport.actions.some((item) => excluded.some((path) => item.task.includes(path)))).toBe(false);
    expect(run(root, 'cli').performanceExport.tierARecovery).toEqual([]);
  });

  it('does not revive saved marketing recovery actions for PASS or intentional noindex routes', () => {
    const root = fixture([observation('/tools/kawaii-emoji-generator/', 'Indexed, not submitted in sitemap', 'PASS'),
      observation(excluded[0], 'URL is unknown to Google'), observation('/real-gap/', 'Crawled - currently not indexed')]);
    writeFixture(root, 'output/marketing-orchestrator/daily-plan.json', { recommendations: [
      { title: 'Improve discovery for not-indexed priority pages', reason: origin + excluded[0], priority: 'High' },
      { title: 'Request indexing for https://accessfreetools.com/tools/kawaii-emoji-generator/', priority: 'High' },
    ] });
    const report = run(root, 'console');
    expect(report.actions.filter((item) => item.evidence === 'output/marketing-orchestrator/daily-plan.json')).toEqual([]);
    expect(report.indexing.gaps.map((item) => item.url)).toEqual([origin + '/real-gap/']);
  });
});

describe.each(['cli', 'console'])('%s performance recovery chronology', (consumer) => {
  const path = '/tools/kawaii-emoji-generator/';
  const recoveryRows = (report) => consumer === 'cli' ? report.performanceExport.tierARecovery
    : report.actions.filter((item) => item.task.startsWith('Recover indexing'));
  function performance(root, overrides = {}) {
    writeFixture(root, 'output/search-console/performance-latest.json', { generatedAt: july,
      tierARecovery: [{ path, action: 'Recover indexing', evidenceFound: true }],
      opportunities: { highImpressionZeroClickPages: [{ path, impressions: 100, clicks: 0 }] }, ...overrides });
  }

  it('suppresses older recovery after newer PASS while preserving CTR work and original proof', () => {
    const root = fixture([observation(path, 'Indexed, not submitted in sitemap', 'PASS')]);
    performance(root);
    const report = run(root, consumer);
    expect(recoveryRows(report)).toEqual([]);
    const proof = consumer === 'cli' ? report.performanceExport.supersededRecovery : report.performanceExport.completed;
    expect(proof).toContainEqual(expect.objectContaining({ path, sourcePath: resolve(root, rawPath), sourceGeneratedAt: observedAt }));
    if (consumer === 'cli') expect(report.performanceExport.highImpressionZeroClickPages).toHaveLength(1);
    else expect(report.actions.some((item) => item.task.startsWith('Review title/meta'))).toBe(true);
  });

  it.each([
    { sourceGeneratedAt: '2026-09-03T00:00:00.000Z' }, { sourceGeneratedAt: july },
    { sourceGeneratedAt: null }, { sourceGeneratedAt: '2027-01-01T00:00:00.000Z' },
    { sourcePath: null }, { error: 'synthetic failure' },
  ])('does not let old or untrusted PASS suppress newer recovery (%j)', (overrides) => {
    const root = fixture([{ ...observation(path, 'Submitted and indexed', 'PASS'), ...overrides }]);
    performance(root, { generatedAt: '2026-09-04T00:00:00.000Z' });
    expect(recoveryRows(run(root, consumer))).toHaveLength(1);
  });

  it('retains recovery for a newer failure selected over an older PASS', () => {
    const root = fixture([observation(path, 'Excluded by noindex tag', 'FAIL')]);
    writeFixture(root, weeklyPath, { generatedAt: now, indexedSummary: [
      { url: origin + path, verdict: 'PASS', coverageState: 'Submitted and indexed', sourceGeneratedAt: july, sourcePath: 'old.json' },
    ] });
    performance(root);
    const report = run(root, consumer);
    expect(gaps(report, consumer)[0].classification).toBe('failure');
    expect(recoveryRows(report)).toHaveLength(1);
  });

  it('uses the performance observation day rather than a later import wrapper', () => {
    const root = fixture([observation(path, 'Submitted and indexed', 'PASS')]);
    performance(root, { generatedAt: now, source: { dataDate: '2026-07-20' } });
    expect(recoveryRows(run(root, consumer))).toEqual([]);
  });

  it('does not invent chronology when the performance observation is undated', () => {
    const root = fixture([observation(path, 'Submitted and indexed', 'PASS')]);
    performance(root, { generatedAt: null });
    expect(recoveryRows(run(root, consumer))).toHaveLength(1);
  });
});
