import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { passingPromotionReview } from '../tests/helpers/promotionReview.mjs';

const repoRoot = process.cwd();
const roots = [];
const now = '2026-09-06T00:00:00.000Z';
const observedAt = '2026-09-05T00:00:00.000Z';
const july = '2026-07-20T00:00:00.000Z';
const rawPath = 'output/search-console-url-inspection.json';
const weeklyPath = 'output/seo-agent-self-evaluation.json';
const url = 'https://accessfreetools.com/a/';
const otherUrl = 'https://accessfreetools.com/b/';

function fixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), 'aft-evidence-consumer-'));
  roots.push(root);
  writeFixture(root, 'output/promotion/four-channel-review.json', passingPromotionReview(now));
  return root;
}

function writeFixture(root, path, value) {
  const file = join(root, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));
}

function run(root, script, args = []) {
  const file = resolve(repoRoot, 'scripts', script);
  // Run the actual entry point with only synthetic files, a fixed clock and no fetch access.
  const preload = `
    const NativeDate = Date;
    globalThis.Date = class extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [${JSON.stringify(now)}])); }
      static now() { return NativeDate.parse(${JSON.stringify(now)}); }
    };
    globalThis.fetch = () => { throw new Error('Network forbidden in evidence consumer tests'); };
  `;
  const result = spawnSync(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(preload)}`, file, ...args],
    { cwd: root, encoding: 'utf8', timeout: 10_000 });
  expect(result.status, `${result.stderr}\n${result.stdout}`).toBe(0);
  return result.stdout;
}

function readReport(root, path) {
  return JSON.parse(readFileSync(join(root, path), 'utf8'));
}

function raw(verdict, generatedAt = observedAt) {
  return { generatedAt, inspections: [{ inspectionUrl: url, verdict,
    coverageState: verdict === 'PASS' ? 'Submitted and indexed' : 'Crawled - currently not indexed' }] };
}

function weekly(verdict, sourceGeneratedAt = july) {
  return { generatedAt: now, indexedSummary: [{ url, verdict,
    coverageState: verdict === 'PASS' ? 'Submitted and indexed' : 'Crawled - currently not indexed',
    sourceGeneratedAt, sourcePath: 'original-july.json' }] };
}

afterEach(() => {
  while (roots.length) {
    const root = roots.pop();
    expect(dirname(root)).toBe(tmpdir());
    rmSync(root, { recursive: true, force: true });
  }
});

describe('indexing-gaps actual CLI evidence boundary', () => {
  it('keeps July provenance and asks for a refresh when only a new weekly wrapper exists', () => {
    const root = fixtureRoot();
    writeFixture(root, weeklyPath, weekly('NEUTRAL'));
    const report = JSON.parse(run(root, 'aft-cli.mjs', ['indexing-gaps', '--json']));
    expect(report.gaps[0]).toMatchObject({ sourceGeneratedAt: july, sourcePath: 'original-july.json',
      sourceFreshness: 'stale', sourceAgeDays: 48 });
    expect(report.inspectionEvidence).toMatchObject({ generatedAt: july, label: 'stale' });
    const text = run(root, 'aft-cli.mjs', ['indexing-gaps']);
    expect(text).toContain('original-july.json');
    expect(text).toContain(july);
    expect(text).toMatch(/refresh.*inspection/i);
    expect(text).not.toMatch(/every current gap|improve useful internal links/i);
  });

  it.each([['PASS', true], ['NEUTRAL', true], ['PASS', false], ['NEUTRAL', false]])(
    'selects newest %s with raw newer=%s and retains summary-only URLs', (newVerdict, rawNewer) => {
      const root = fixtureRoot();
      const oldVerdict = newVerdict === 'PASS' ? 'NEUTRAL' : 'PASS';
      const summary = weekly(rawNewer ? oldVerdict : newVerdict, rawNewer ? july : observedAt);
      summary.indexedSummary[0].sourcePath = 'weekly-original.json';
      summary.indexedSummary.push({ url: otherUrl, verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google',
        sourceGeneratedAt: july, sourcePath: 'other-original.json' });
      writeFixture(root, weeklyPath, summary);
      writeFixture(root, rawPath, raw(rawNewer ? newVerdict : oldVerdict, rawNewer ? observedAt : july));
      const report = JSON.parse(run(root, 'aft-cli.mjs', ['indexing-gaps', '--json']));
      expect(report.gaps.map((gap) => gap.url)).toEqual(newVerdict === 'PASS' ? [otherUrl] : [url, otherUrl]);
      expect(report.gaps.find((gap) => gap.url === otherUrl)).toMatchObject({ sourceGeneratedAt: july,
        sourcePath: 'other-original.json', sourceFreshness: 'stale' });
      if (newVerdict === 'NEUTRAL') expect(report.gaps[0]).toMatchObject({ verdict: 'NEUTRAL',
        sourceGeneratedAt: observedAt, sourcePath: rawNewer ? resolve(root, rawPath) : 'weekly-original.json' });
    },
  );

  it.each(['raw', 'weekly'])('keeps explicit null and missing merged origins unavailable in %s evidence', (kind) => {
    const root = fixtureRoot();
    const item = { url, inspectionUrl: url, verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google',
      sourceGeneratedAt: null, sourcePath: null };
    writeFixture(root, kind === 'raw' ? rawPath : weeklyPath, kind === 'raw'
      ? { generatedAt: now, inspections: [item] } : { generatedAt: now, indexedSummary: [item] });
    let report = JSON.parse(run(root, 'aft-cli.mjs', ['indexing-gaps', '--json']));
    expect(report.gaps[0]).toMatchObject({ sourceGeneratedAt: null, sourcePath: null,
      sourceFreshness: 'undated', sourceAgeDays: null });
    expect(report.inspectionEvidence.label).toBe('undated');
    delete item.sourceGeneratedAt;
    delete item.sourcePath;
    writeFixture(root, kind === 'raw' ? rawPath : weeklyPath, kind === 'raw'
      ? { kind: 'search-console-url-inspection-merged', generatedAt: now, inspections: [item] }
      : { generatedAt: now, indexedSummary: [item] });
    report = JSON.parse(run(root, 'aft-cli.mjs', ['indexing-gaps', '--json']));
    expect(report.gaps[0]).toMatchObject({ sourceGeneratedAt: '', sourcePath: '', sourceFreshness: 'undated' });
  });

  it.each([
    ['2026-08-30T00:00:00.000Z', 'fresh'],
    ['2026-08-29T23:59:59.999Z', 'stale'],
    ['2026-09-07T00:00:00.000Z', 'future'],
    ['invalid', 'undated'],
  ])('uses shared freshness for %s (%s)', (generatedAt, sourceFreshness) => {
    const root = fixtureRoot();
    writeFixture(root, rawPath, raw('NEUTRAL', generatedAt));
    const report = JSON.parse(run(root, 'aft-cli.mjs', ['indexing-gaps', '--json']));
    expect(report.gaps[0].sourceFreshness).toBe(sourceFreshness);
    expect(report.inspectionEvidence.recordFreshness[sourceFreshness]).toBe(1);
  });

  it('does not hide a newer inspection error behind an older PASS', () => {
    const root = fixtureRoot();
    writeFixture(root, weeklyPath, weekly('PASS'));
    writeFixture(root, rawPath, { generatedAt: observedAt, inspections: [{ inspectionUrl: url, error: 'Inspection failed' }] });
    const report = JSON.parse(run(root, 'aft-cli.mjs', ['indexing-gaps', '--json']));
    expect(report.gaps[0]).toMatchObject({ url, error: 'Inspection failed', status: 'not enough data',
      sourceGeneratedAt: observedAt, sourcePath: resolve(root, rawPath) });
  });
});

function marketingReport(root) {
  writeFixture(root, 'docs/brand-code.md', 'Synthetic brand guidance.');
  writeFixture(root, 'docs/recommended-agency-agents.md', 'Synthetic specialist guidance.');
  run(root, 'marketing-orchestrator-report.mjs');
  return {
    report: readReport(root, 'output/marketing-orchestrator/daily-plan.json'),
    markdown: readFileSync(join(root, 'output/marketing-orchestrator/daily-plan.md'), 'utf8'),
  };
}

describe('marketing actual report and recommendation boundary', () => {
  it.each([
    [july, 'original-july.json', 'stale', 'historical'],
    [null, null, 'undated', 'not enough data'],
    ['2026-09-07T00:00:00.000Z', 'future-original.json', 'future', 'not enough data'],
    [observedAt, null, 'fresh', 'not enough data'],
  ])('requests evidence refresh for %s / %j and renders original provenance', (sourceGeneratedAt, sourcePath, freshness, status) => {
    const root = fixtureRoot();
    const summary = weekly('NEUTRAL', sourceGeneratedAt);
    summary.indexedSummary[0].sourcePath = sourcePath;
    writeFixture(root, weeklyPath, summary);
    // Valid built-link proof must not turn stale observations into a current page-edit task.
    writeFixture(root, 'output/agent-tools/link-helper/latest.json', { suggestions: [
      { target: '/a/', action: 'add-link', reason: 'Synthetic link opportunity.' },
    ], linkEvidence: { available: true } });
    const { report, markdown } = marketingReport(root);
    expect(report.indexingGaps[0]).toMatchObject({ sourceGeneratedAt, sourcePath, sourceFreshness: freshness, status });
    expect(report.recommendations[0].title).toMatch(/refresh.*inspection/i);
    expect(report.recommendations[0].action).not.toMatch(/add.*links|submit discovery|request indexing/i);
    expect(markdown).not.toContain('is still');
    expect(markdown).toContain(`observed ${sourceGeneratedAt || 'undated'}`);
    expect(markdown).toContain(`source ${sourcePath || 'not enough data'}`);
    expect(markdown).toContain(`evidence ${status} (${freshness})`);
  });

  it('keeps fresh supported gaps actionable and includes date/path/freshness in Markdown', () => {
    const root = fixtureRoot();
    writeFixture(root, rawPath, raw('NEUTRAL'));
    writeFixture(root, 'output/agent-tools/link-helper/latest.json', { suggestions: [
      { target: '/a/', action: 'monitor', reason: 'Request-indexing was submitted; recheck after Google crawls.' },
    ] });
    const { report, markdown } = marketingReport(root);
    expect(report.indexingGaps[0]).toMatchObject({ sourceGeneratedAt: observedAt,
      sourcePath: resolve(root, rawPath), sourceFreshness: 'fresh', status: 'observed' });
    expect(report.recommendations[0].title).toBe('Recheck requested indexing after Google crawls');
    expect(markdown).toContain(`observed ${observedAt}`);
    expect(markdown).toContain(`source ${resolve(root, rawPath)}`);
    expect(markdown).toContain('evidence observed (fresh)');
  });

  it.each(['PASS', 'NEUTRAL'])('actual marketing output selects a newer %s and retains historical summary-only URLs', (verdict) => {
    const root = fixtureRoot();
    const summary = weekly(verdict === 'PASS' ? 'NEUTRAL' : 'PASS');
    summary.indexedSummary.push({ ...summary.indexedSummary[0], url: otherUrl, verdict: 'NEUTRAL',
      coverageState: 'URL is unknown to Google', sourcePath: 'other-july.json' });
    writeFixture(root, weeklyPath, summary);
    writeFixture(root, rawPath, raw(verdict));
    const { report, markdown } = marketingReport(root);
    expect(report.indexingGaps.map((item) => item.url)).toEqual(verdict === 'PASS' ? [otherUrl] : [url, otherUrl]);
    expect(report.indexingGaps.find((item) => item.url === otherUrl)).toMatchObject({ sourceFreshness: 'stale', status: 'historical' });
    expect(markdown).toContain('other-july.json');
    expect(markdown).toContain('evidence historical (stale)');
  });
});

describe('weekly actual JSON and Markdown boundary without providers', () => {
  it.each([['PASS', true], ['NEUTRAL', true], ['PASS', false], ['NEUTRAL', false]])(
    'merges newest %s (raw newer=%s) and retains summary-only provenance across repeated runs', (verdict, rawNewer) => {
      const root = fixtureRoot();
      const oldVerdict = verdict === 'PASS' ? 'NEUTRAL' : 'PASS';
      const summary = weekly(rawNewer ? oldVerdict : verdict, rawNewer ? july : observedAt);
      summary.indexedSummary[0].sourcePath = 'weekly-original.json';
      summary.indexedSummary.push({ url: otherUrl, verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google',
        sourceGeneratedAt: july, sourcePath: 'original-july.json' });
      writeFixture(root, weeklyPath, summary);
      writeFixture(root, rawPath, raw(rawNewer ? verdict : oldVerdict, rawNewer ? observedAt : july));
      for (let repeat = 0; repeat < 2; repeat += 1) {
        run(root, 'seo-agent-self-evaluation.mjs', ['--skip-dataforseo']);
        const report = readReport(root, weeklyPath);
        expect(report.dataForSeo).toEqual({ skipped: true });
        expect(report.indexedSummary).toMatchObject([
          { url, verdict, sourceGeneratedAt: observedAt, sourcePath: rawNewer ? resolve(root, rawPath) : 'weekly-original.json' },
          { url: otherUrl, sourceGeneratedAt: july, sourcePath: 'original-july.json', sourceFreshness: 'stale', status: 'historical' },
        ]);
        const markdown = readFileSync(join(root, 'output/seo-agent-self-evaluation.md'), 'utf8');
        expect(markdown).toContain(`observed ${observedAt}`);
        expect(markdown).toContain(`observed ${july}`);
        expect(markdown).toContain('source original-july.json');
        expect(markdown).toContain('evidence historical (stale)');
        expect(markdown).toMatch(/refresh.*inspection/i);
        expect(markdown).not.toContain('improve useful internal links and page clarity');
      }
    },
  );

  it('retains null and missing origins when a weekly-only report is rewritten', () => {
    const root = fixtureRoot();
    const summary = weekly('NEUTRAL', null);
    summary.indexedSummary[0].sourcePath = null;
    summary.indexedSummary.push({ url: otherUrl, verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google' });
    writeFixture(root, weeklyPath, summary);
    run(root, 'seo-agent-self-evaluation.mjs', ['--skip-dataforseo']);
    expect(readReport(root, weeklyPath).indexedSummary).toMatchObject([
      { url, sourceGeneratedAt: null, sourcePath: null, sourceFreshness: 'undated', status: 'not enough data' },
      { url: otherUrl, sourceGeneratedAt: '', sourcePath: '', sourceFreshness: 'undated', status: 'not enough data' },
    ]);
    const markdown = readFileSync(join(root, 'output/seo-agent-self-evaluation.md'), 'utf8');
    expect(markdown).toContain('observed undated; source not enough data');
    expect(markdown).toContain('evidence not enough data (undated)');
    expect(markdown).not.toContain('source output/seo-agent-self-evaluation.json');
  });
});
