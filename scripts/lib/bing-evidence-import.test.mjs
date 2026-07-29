import { createHash } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  buildBingEvidenceReport,
  newestBingEvidenceCsv,
  normalizeBingDate,
  parseCsv,
  renderBingEvidenceMarkdown,
  writeBingEvidenceReport,
} from './bing-evidence-import.mjs';

const tempRoots = [];

function makeRoot(name = 'bing evidence fixtures') {
  const root = join(tmpdir(), `${name}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(root, { recursive: true });
  tempRoots.push(root);
  return root;
}

function fixture(root, name, content) {
  const path = join(root, name);
  writeFileSync(path, content, 'utf8');
  return path;
}

afterEach(() => {
  while (tempRoots.length) rmSync(tempRoots.pop(), { force: true, recursive: true });
});

describe('Bing Webmaster evidence import', () => {
  it('parses quoted CSV safely and normalizes supported dates', () => {
    expect(parseCsv('\uFEFF"Date","Clicks","Note"\r\n"7/29/2026 12:00:00 AM","1","a, ""quoted"" note"\r\n')).toEqual([
      { Date: '7/29/2026 12:00:00 AM', Clicks: '1', Note: 'a, "quoted" note' },
    ]);
    expect(normalizeBingDate('7/29/2026 12:00:00 AM')).toBe('2026-07-29');
    expect(normalizeBingDate('2026-07-29T00:00:00Z')).toBe('2026-07-29');
    expect(() => parseCsv('"Date","Clicks"\n"7/29/2026,1')).toThrow(/unterminated/i);
  });

  it('discovers the newest dated export when directories and filenames contain spaces', () => {
    const root = makeRoot();
    fixture(root, 'accessfreetools.com_SearchPerformanceOverview_All_7_9_2026.csv', 'Date,Clicks\n');
    const newest = fixture(
      root,
      'accessfreetools.com_SearchPerformanceOverview_All_7_29_2026.csv',
      'Date,Clicks\n',
    );
    fixture(root, 'accessfreetools.com_SearchPerformanceOverview_All_7_12_2026.csv', 'Date,Clicks\n');

    expect(newestBingEvidenceCsv(root)).toBe(newest);
  });

  it('keeps a missing report period explicit instead of inventing dates', () => {
    const report = buildBingEvidenceReport({
      generatedAt: '2026-07-29T00:00:00.000Z',
      sourceFileName: 'overview without period.csv',
      sourceText: 'Clicks,Impressions,Avg. CTR\n1,10,10\n',
    });

    expect(report.source.dataDate).toBeNull();
    expect(report.source.reportPeriod).toBeNull();
    expect(report.traditionalSearch.totals.clicks).toBe(1);
    expect(report.traditionalSearch.totals.impressions).toBe(10);
  });

  it('flags impossible and invalid rows and excludes them from totals', () => {
    const report = buildBingEvidenceReport({
      sourceFileName: 'accessfreetools.com_SearchPerformanceOverview_All_7_29_2026.csv',
      sourceText: [
        'Date,Clicks,Impressions,Avg. CTR,Position',
        '7/24/2026 12:00:00 AM,1,10,10,4.5',
        '7/25/2026 12:00:00 AM,1,10,101,4.5',
        '7/26/2026 12:00:00 AM,11,10,110,4.5',
        '7/27/2026 12:00:00 AM,1,10,10,not-a-position',
        '7/28/2026 12:00:00 AM,1,10,10,-1',
      ].join('\n'),
    });

    expect(report.status).toBe('attention');
    expect(report.issues.map((item) => item.code)).toEqual(
      expect.arrayContaining(['invalid-ctr', 'clicks-exceed-impressions', 'invalid-position']),
    );
    expect(report.issues.filter((item) => item.code === 'invalid-position')).toHaveLength(2);
    expect(report.traditionalSearch.totals).toMatchObject({
      acceptedRows: 1,
      clicks: 1,
      excludedRows: 4,
      impressions: 10,
      rows: 5,
    });
  });

  it('stores future AI citation rows separately from traditional search rows', () => {
    const report = buildBingEvidenceReport({
      sourceFileName: 'mixed.csv',
      sourceText: [
        'Date,Clicks,Impressions,Avg. CTR,AI Citations',
        '7/28/2026 12:00:00 AM,0,0,0,3',
      ].join('\n'),
    });

    expect(report.traditionalSearch.totals.rows).toBe(0);
    expect(report.aiCitations.totals.rows).toBe(1);
    expect(report.aiCitations.totals.citations).toBe(3);
  });

  it('records provenance without retaining source bodies or absolute paths', () => {
    const root = makeRoot('private bing source');
    const sourceText =
      'Date,Clicks,Impressions,Avg. CTR,Private Note\n7/29/2026 12:00:00 AM,1,10,10,DO-NOT-STORE-THIS-BODY';
    const sourcePath = join(
      root,
      'accessfreetools.com_SearchPerformanceOverview_All_7_29_2026.csv',
    );
    const report = buildBingEvidenceReport({
      sourceFileName: sourcePath,
      sourceText,
    });
    const serialized = JSON.stringify(report);

    expect(report.source.fileName).toBe('accessfreetools.com_SearchPerformanceOverview_All_7_29_2026.csv');
    expect(report.source.sha256).toBe(createHash('sha256').update(sourceText, 'utf8').digest('hex'));
    expect(report.source.dataDate).toBe('2026-07-29');
    expect(report.source.reportPeriod).toEqual({ startDate: '2026-07-29', endDate: '2026-07-29' });
    expect(serialized).not.toContain('DO-NOT-STORE-THIS-BODY');
    expect(serialized).not.toContain(root);
  });

  it('writes bounded latest JSON and Markdown reports', () => {
    const root = makeRoot();
    const outputDir = join(root, 'output with spaces');
    const report = buildBingEvidenceReport({
      sourceFileName: 'accessfreetools.com_SearchPerformanceOverview_All_7_29_2026.csv',
      sourceText: 'Date,Clicks,Impressions,Avg. CTR\n7/29/2026 12:00:00 AM,1,10,10\n',
    });
    const paths = writeBingEvidenceReport(report, outputDir);
    const markdown = renderBingEvidenceMarkdown(report);

    expect(paths.jsonPath).toBe(join(outputDir, 'latest.json'));
    expect(paths.markdownPath).toBe(join(outputDir, 'latest.md'));
    expect(markdown).toContain('Traditional Search');
    expect(markdown).toContain('AI citation evidence is kept separate');
  });
});
