import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { afterEach, describe, expect, it } from 'vitest';
import {
  discoverInspectionReportFiles,
  mergeInspectionReports,
  readInspectionReports,
  writeMergedInspectionReport,
} from './search-console-inspection-reports.mjs';
import * as inspectionReports from './search-console-inspection-reports.mjs';
import { createIndexingClassifier, hasBlockedIndexingState, needsIndexingAttention } from './indexing-classification.mjs';

const roots = [];

function root() {
  const path = join(tmpdir(), `aft-inspections-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(path, { recursive: true });
  roots.push(path);
  return path;
}

afterEach(() => {
  while (roots.length) rmSync(roots.pop(), { force: true, recursive: true });
});

describe('Search Console inspection report merging', () => {
  it.each(['BLOCKED_BY_META_TAG', 'BLOCKED_BY_HTTP_HEADER'])('prefers intact %s over an identical lossy weekly observation in either order', (indexingState) => {
    const item = { inspectionUrl: 'https://accessfreetools.com/tools/percentage-calculator/',
      verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google',
      sourceGeneratedAt: '2026-09-05T00:00:00Z', sourcePath: 'original.json' };
    const weekly = { generatedAt: '2026-09-06T00:00:00Z', indexedSummary: [{ ...item, url: item.inspectionUrl }] };
    const raw = { generatedAt: '2026-09-05T00:00:00Z', inspections: [{ ...item, indexingState }] };
    for (const records of [[weekly, raw], [raw, weekly]]) {
      const merged = mergeInspectionReports(records);
      expect(merged.inspections).toMatchObject([{ ...item, indexingState }]);
      expect(mergeInspectionReports([merged, weekly]).inspections).toEqual(merged.inspections);
    }
  });

  it('does not enrich a newer or errored observation from a different older block', () => {
    const url = 'https://accessfreetools.com/tools/percentage-calculator/';
    const original = { generatedAt: '2026-09-04T00:00:00Z', sourcePath: 'original.json',
      inspections: [{ inspectionUrl: url, verdict: 'NEUTRAL', indexingState: 'BLOCKED_BY_META_TAG' }] };
    const current = { generatedAt: '2026-09-05T00:00:00Z', sourcePath: 'current.json',
      inspections: [{ inspectionUrl: url, verdict: 'PASS', coverageState: 'Submitted and indexed' }] };
    expect(mergeInspectionReports([original, current]).inspections[0]).not.toHaveProperty('indexingState');
    const failed = { ...current, inspections: [{ inspectionUrl: url, error: 'synthetic failure' }] };
    expect(mergeInspectionReports([original, failed]).inspections[0]).toMatchObject({ error: 'synthetic failure' });
    expect(mergeInspectionReports([original, failed]).inspections[0]).not.toHaveProperty('indexingState');
  });

  it('merges weekly summaries per URL without borrowing their wrapper provenance', () => {
    const records = [
      { sourcePath: 'weekly-wrapper.json', report: {
        generatedAt: '2026-09-06T00:00:00.000Z', indexedSummary: [
          { url: 'https://accessfreetools.com/a/', verdict: 'NEUTRAL',
            sourceGeneratedAt: '2026-09-02T00:00:00.000Z', sourcePath: 'original.json' },
          { url: 'https://accessfreetools.com/b/', verdict: 'PASS', sourceGeneratedAt: null, sourcePath: null },
          { url: 'https://accessfreetools.com/c/', verdict: 'NEUTRAL' },
        ],
      } },
      { sourcePath: 'raw.json', report: { generatedAt: '2026-09-01T00:00:00.000Z', inspections: [
        { inspectionUrl: 'https://accessfreetools.com/a/', verdict: 'PASS' },
      ] } },
    ];
    for (const order of [records, [...records].reverse()]) {
      const merged = mergeInspectionReports(order);
      expect(merged.inspections).toMatchObject([
        { verdict: 'NEUTRAL', sourceGeneratedAt: '2026-09-02T00:00:00.000Z', sourcePath: 'original.json' },
        { verdict: 'PASS', sourceGeneratedAt: null, sourcePath: null },
        { verdict: 'NEUTRAL', sourceGeneratedAt: '', sourcePath: '' },
      ]);
      expect(merged.latestSourceGeneratedAt).toBe('2026-09-02T00:00:00.000Z');
      expect(mergeInspectionReports([merged]).inspections).toEqual(merged.inspections);
    }
  });

  it('preserves explicitly null raw report provenance through nested merges', () => {
    const merged = mergeInspectionReports([{ generatedAt: null, sourcePath: null, inspections: [
      { inspectionUrl: 'https://accessfreetools.com/a/', verdict: 'PASS' },
    ] }]);
    expect(merged.inspections[0]).toMatchObject({ sourceGeneratedAt: null, sourcePath: null });
    expect(mergeInspectionReports([merged]).inspections).toEqual(merged.inspections);
  });

  it.each([' ', null, 42, {}, ['bad.json'], 'bad\u0000.json'].map((value) => [value]))('prefers a usable equal-date origin over %j', (sourcePath) => {
    const good = { kind: 'search-console-url-inspection-merged', inspections: [
      { inspectionUrl: 'https://accessfreetools.com/a/', sourceGeneratedAt: '2026-09-02T00:00:00.000Z', sourcePath: 'original.json' },
    ] };
    const incomplete = { ...good, inspections: [{ ...good.inspections[0], sourcePath }] };
    for (const records of [[good, incomplete], [incomplete, good]]) {
      expect(mergeInspectionReports(records).inspections[0].sourcePath).toBe('original.json');
    }
  });

  it.each([false, true])('retains canonical-only URLs when the merge CLI receives a partial report (separate input: %s)', (separateInput) => {
    const directory = root();
    const inputRoot = separateInput ? join(directory, 'worktree-b') : directory;
    mkdirSync(inputRoot, { recursive: true });
    const outputPath = join(directory, 'search-console-url-inspection.json');
    writeMergedInspectionReport(mergeInspectionReports([{
      sourcePath: 'worktree-a/original.json',
      report: { generatedAt: '2026-07-20T00:00:00.000Z', inspections: [
        { inspectionUrl: 'https://accessfreetools.com/a/', verdict: 'PASS' },
        { inspectionUrl: 'https://accessfreetools.com/b/', verdict: 'PASS' },
      ] },
    }], '2026-09-06T00:00:00.000Z'), outputPath);
    writeFileSync(join(inputRoot, 'url-inspection-new.json'), JSON.stringify({
      generatedAt: '2026-09-02T00:00:00.000Z',
      inspections: [{ inspectionUrl: 'https://accessfreetools.com/b/', verdict: 'NEUTRAL' }],
    }));
    const cli = fileURLToPath(new URL('../merge-search-console-inspection-reports.mjs', import.meta.url));
    for (let run = 0; run < 2; run += 1) {
      const result = spawnSync(process.execPath, [cli, `--input-root=${inputRoot}`, `--output=${outputPath}`], {
        cwd: directory, encoding: 'utf8', timeout: 10_000,
      });
      expect(result.status, result.stderr).toBe(0);
      const merged = JSON.parse(readFileSync(outputPath, 'utf8'));
      expect(merged.inspections).toMatchObject([
        { verdict: 'PASS', sourcePath: 'worktree-a/original.json', sourceGeneratedAt: '2026-07-20T00:00:00.000Z' },
        { verdict: 'NEUTRAL', sourceGeneratedAt: '2026-09-02T00:00:00.000Z' },
      ]);
      expect(merged.latestSourceGeneratedAt).toBe('2026-09-02T00:00:00.000Z');
    }
  });

  it('does not erase known origin paths when the same observation has an incomplete wrapper', () => {
    const report = { generatedAt: '2026-09-02T00:00:00.000Z', inspections: [
      { inspectionUrl: 'https://accessfreetools.com/a/', verdict: 'PASS' },
    ] };
    const records = [
      { report, sourcePath: 'original.json' },
      { kind: 'search-console-url-inspection-merged', generatedAt: '2026-09-06T00:00:00.000Z',
        inspections: [{ ...report.inspections[0], sourceGeneratedAt: report.generatedAt }] },
    ];
    for (const ordered of [records, [...records].reverse()]) {
      expect(mergeInspectionReports(ordered).inspections[0].sourcePath).toBe('original.json');
    }
  });

  it('preserves original observation dates and paths through repeated file merges', () => {
    const directory = root();
    const originalPath = join(directory, 'worktree-a', 'url-inspection-original.json');
    const originalDate = '2026-07-20T00:00:00.000Z';
    const original = mergeInspectionReports([{
      sourcePath: originalPath,
      report: {
        generatedAt: originalDate,
        inspections: [{ inspectionUrl: 'https://accessfreetools.com/a/', verdict: 'NEUTRAL' }],
      },
    }], '2026-09-06T00:00:00.000Z');
    const wrapperPath = join(directory, 'worktree-b', 'url-inspection-merged.json');
    writeMergedInspectionReport(original, wrapperPath);

    const merged = mergeInspectionReports(readInspectionReports([wrapperPath]), '2026-09-07T00:00:00.000Z');
    const repeated = mergeInspectionReports([{ report: merged, sourcePath: 'third-wrapper.json' }]);

    expect(merged.inspections).toEqual(original.inspections);
    expect(repeated.inspections).toEqual(original.inspections);
    expect(merged.latestSourceGeneratedAt).toBe(originalDate);
    expect(repeated.latestSourceGeneratedAt).toBe(originalDate);
    expect(merged.sources[0].path).toBe(wrapperPath);
  });

  it.each(['PASS', 'NEUTRAL'])('keeps partial URL sets and newest actual %s despite later wrappers', (newVerdict) => {
    const oldVerdict = newVerdict === 'PASS' ? 'NEUTRAL' : 'PASS';
    const older = mergeInspectionReports([{
      sourcePath: 'worktree-a/original.json',
      report: { generatedAt: '2026-07-20T00:00:00.000Z', inspections: [
        { inspectionUrl: 'https://accessfreetools.com/a/', verdict: oldVerdict },
        { inspectionUrl: 'https://accessfreetools.com/b/', verdict: 'PASS' },
      ] },
    }], '2026-09-06T00:00:00.000Z');
    const records = [
      { report: older, sourcePath: 'worktree-a/wrapper.json' },
      { sourcePath: 'worktree-b/original.json', report: {
        generatedAt: '2026-09-02T00:00:00.000Z',
        inspections: [{ inspectionUrl: 'https://accessfreetools.com/a/#result', verdict: newVerdict }],
      } },
    ];

    const merged = mergeInspectionReports(records);
    expect(merged.inspections).toEqual(mergeInspectionReports([...records].reverse()).inspections);
    expect(merged.inspections).toMatchObject([
      { verdict: newVerdict, sourcePath: 'worktree-b/original.json', sourceGeneratedAt: '2026-09-02T00:00:00.000Z' },
      { verdict: 'PASS', sourcePath: 'worktree-a/original.json', sourceGeneratedAt: '2026-07-20T00:00:00.000Z' },
    ]);
    expect(merged.latestSourceGeneratedAt).toBe('2026-09-02T00:00:00.000Z');
  });

  it.each(['', null, 'invalid'])('does not replace an explicit invalid origin date %j with a wrapper date', (sourceGeneratedAt) => {
    const dated = { generatedAt: '2026-09-02T00:00:00.000Z', inspections: [
      { inspectionUrl: 'https://accessfreetools.com/a/', verdict: 'PASS' },
    ] };
    const invalid = { generatedAt: '2026-09-06T00:00:00.000Z', inspections: [
      { inspectionUrl: 'https://accessfreetools.com/a/', verdict: 'NEUTRAL', sourceGeneratedAt },
    ] };
    expect(mergeInspectionReports([dated, invalid]).inspections[0].verdict).toBe('PASS');
    const unavailable = mergeInspectionReports([invalid]);
    expect(unavailable.inspections[0].sourceGeneratedAt).toBe(sourceGeneratedAt);
    expect(unavailable.latestSourceGeneratedAt).toBe('');
  });

  it('does not infer missing origin dates or paths from merged containers or empty reports', () => {
    const merged = mergeInspectionReports([{ sourcePath: 'wrapper.json', report: {
      kind: 'search-console-url-inspection-merged',
      generatedAt: '2026-09-06T00:00:00.000Z',
      inspections: [{ inspectionUrl: 'https://accessfreetools.com/a/', verdict: 'PASS' }],
    } }, { generatedAt: '2026-09-07T00:00:00.000Z', inspections: [] }]);
    expect(merged.inspections[0]).toMatchObject({ sourceGeneratedAt: '', sourcePath: '' });
    expect(merged.latestSourceGeneratedAt).toBe('');
  });

  it('selects the newest inspection independently for each URL', () => {
    const older = {
      generatedAt: '2026-07-18T00:00:00.000Z',
      inspections: [
        { inspectionUrl: 'https://accessfreetools.com/a/', coverageState: 'Crawled - currently not indexed' },
        { inspectionUrl: 'https://accessfreetools.com/b/', coverageState: 'Submitted and indexed', verdict: 'PASS' },
      ],
    };
    const newer = {
      generatedAt: '2026-07-29T00:00:00.000Z',
      inspections: [
        { inspectionUrl: 'https://accessfreetools.com/a/', coverageState: 'Submitted and indexed', verdict: 'PASS' },
      ],
    };

    const report = mergeInspectionReports([
      { report: older, sourcePath: 'older.json' },
      { report: newer, sourcePath: 'newer.json' },
    ], '2026-07-29T01:00:00.000Z');

    expect(report.inspections).toHaveLength(2);
    expect(report.inspections.find((item) => item.inspectionUrl.endsWith('/a/'))?.coverageState).toBe('Submitted and indexed');
    expect(report.inspections.find((item) => item.inspectionUrl.endsWith('/b/'))?.coverageState).toBe('Submitted and indexed');
    expect(report.latestSourceGeneratedAt).toBe('2026-07-29T00:00:00.000Z');
  });

  it('discovers only inspection reports and ignores malformed JSON', () => {
    const directory = root();
    const nested = join(directory, 'nested folder');
    mkdirSync(nested, { recursive: true });
    writeFileSync(
      join(nested, 'search-console-url-inspection-release.json'),
      JSON.stringify({ generatedAt: '2026-07-29T00:00:00.000Z', inspections: [] }),
    );
    writeFileSync(join(nested, 'url-inspection-broken.json'), '{');
    writeFileSync(join(nested, 'unrelated.json'), JSON.stringify({ inspections: [] }));

    const files = discoverInspectionReportFiles(directory);
    const reports = readInspectionReports(files);

    expect(files).toHaveLength(2);
    expect(reports).toHaveLength(1);
  });
});

// Extract only pure selection functions: importing either CLI would run report writers/provider calls.
function selectionFunction(file, name, bindings = {}) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const declaration = ast.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === name);
  if (!declaration) throw new Error(`Missing selection function ${name}`);
  return runInNewContext(`(${declaration.getText(ast)})`, { ...inspectionReports, hasBlockedIndexingState, resolve, ...bindings });
}

describe('inspection selection consumers', () => {
  const url = 'https://accessfreetools.com/a/';
  const otherUrl = 'https://accessfreetools.com/b/';
  const observedAt = '2026-09-02T00:00:00.000Z';
  const now = new Date('2026-09-06T00:00:00.000Z');
  const select = () => {
    const classifyItems = selectionFunction('marketing-orchestrator-report.mjs', 'classifiedIndexingItems', {
      createIndexingClassifier,
      hasBlockedIndexingState,
      evidencePaths: { seoEvaluation: 'weekly.json', searchConsoleInspection: 'raw.json' },
    });
    return (...args) => classifyItems(...args).filter((item) => needsIndexingAttention(item.classification));
  };

  it.each(['PASS', 'NEUTRAL'])('marketing selects newest actual %s and preserves summary-only URLs', (verdict) => {
    const oldState = verdict === 'PASS' ? 'URL is unknown to Google' : 'Submitted and indexed';
    const weekly = {
      generatedAt: '2026-09-06T00:00:00.000Z',
      indexedSummary: [
        { url, verdict: verdict === 'PASS' ? 'NEUTRAL' : 'PASS', coverageState: oldState,
          sourceGeneratedAt: '2026-09-01T00:00:00.000Z', sourcePath: 'original-weekly.json' },
        { url: otherUrl, verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google',
          sourceGeneratedAt: observedAt, sourcePath: 'other-original.json' },
      ],
    };
    const raw = { generatedAt: observedAt, inspections: [{ inspectionUrl: url, verdict,
      coverageState: verdict === 'PASS' ? 'Submitted and indexed' : 'Crawled - currently not indexed' }] };
    const result = select()(weekly, raw, now);
    expect(result.map((item) => item.url)).toEqual(verdict === 'PASS' ? [otherUrl] : [url, otherUrl]);
    expect(result.find((item) => item.url === otherUrl)).toMatchObject({
      sourceGeneratedAt: observedAt, sourcePath: 'other-original.json', sourceFreshness: 'fresh',
    });
    if (verdict !== 'PASS') expect(result[0]).toMatchObject({ sourceGeneratedAt: observedAt, sourcePath: resolve('raw.json') });
  });

  it('marketing keeps dated historical fallback labeled and does not freshen undated weekly rows', () => {
    const result = select()({ generatedAt: now.toISOString(), indexedSummary: [
      { url, verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google' },
      { url: otherUrl, verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google',
        sourceGeneratedAt: '2026-07-20T00:00:00.000Z', sourcePath: 'july.json' },
    ] }, null, now);
    expect(result.find((item) => item.url === url)).toMatchObject({
      sourceGeneratedAt: '', sourcePath: '', sourceFreshness: 'undated', state: 'not enough data',
    });
    expect(result.find((item) => item.url === otherUrl)).toMatchObject({ sourceFreshness: 'stale', sourcePath: 'july.json' });
  });

  it('weekly summary keeps original provenance and does not use its wrapper time', () => {
    const summarize = selectionFunction('seo-agent-self-evaluation.mjs', 'summarizeInspection');
    const summary = summarize({ kind: 'search-console-url-inspection-merged', generatedAt: now.toISOString(), inspections: [
      { inspectionUrl: url, coverageState: 'Submitted and indexed', verdict: 'PASS',
        sourceGeneratedAt: observedAt, sourcePath: 'original.json' },
    ] }, now);
    expect(summary[0]).toMatchObject({ url, verdict: 'PASS', sourceGeneratedAt: observedAt, sourcePath: 'original.json' });
  });

  it('binds raw weekly summary provenance to its original worktree before moving the summary', () => {
    const summarize = selectionFunction('seo-agent-self-evaluation.mjs', 'summarizeInspection');
    const summary = summarize({ generatedAt: observedAt, inspections: [
      { inspectionUrl: url, verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google' },
    ] }, now);
    expect(summary[0].sourcePath).toBe(resolve('output/search-console-url-inspection.json'));
    const moved = select()({ generatedAt: now.toISOString(), indexedSummary: summary }, null, now);
    expect(moved[0].sourcePath).toBe(summary[0].sourcePath);
  });

  it('marketing uses a newer dated summary over an older raw report and exposes future evidence as unavailable', () => {
    const raw = { generatedAt: '2026-09-01T00:00:00.000Z', inspections: [
      { inspectionUrl: url, verdict: 'PASS', coverageState: 'Submitted and indexed' },
    ] };
    const weekly = { generatedAt: now.toISOString(), indexedSummary: [
      { url, verdict: 'NEUTRAL', coverageState: 'URL is unknown to Google', sourcePath: 'actual.json', sourceGeneratedAt: observedAt },
    ] };
    expect(select()(weekly, raw, now)[0]).toMatchObject({ verdict: 'NEUTRAL', sourcePath: 'actual.json', sourceGeneratedAt: observedAt });
    weekly.indexedSummary[0].sourceGeneratedAt = '2026-09-07T00:00:00.000Z';
    expect(select()(weekly, raw, now)[0]).toMatchObject({ state: 'not enough data', sourceFreshness: 'future' });
  });
});
