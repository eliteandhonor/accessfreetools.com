import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  buildSearchConsolePerformanceReport,
  newestDeindexedFile,
  parseCsv,
  writeSearchConsolePerformanceReport,
} from './search-console-performance-import.mjs';

const tempRoots = [];

function makeRoot() {
  const root = join(tmpdir(), `aft-gsc-performance-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(root, { recursive: true });
  tempRoots.push(root);
  return root;
}

function writeFixture(root, relativePath, content) {
  const path = join(root, relativePath);
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, content);
  return path;
}

afterEach(() => {
  while (tempRoots.length) rmSync(tempRoots.pop(), { force: true, recursive: true });
});

describe('Search Console performance import', () => {
  it('parses quoted CSV values and blank data files', () => {
    expect(parseCsv('"URL","Status"\n"https://accessfreetools.com/a/","Not Indexed"\n')).toEqual([
      { URL: 'https://accessfreetools.com/a/', Status: 'Not Indexed' },
    ]);
    expect(parseCsv('Search Appearance,Clicks,Impressions,CTR,Position')).toEqual([]);
  });

  it('normalizes performance, zero-row search appearance, and deindexed exports', () => {
    const root = makeRoot();
    const performanceDir = join(root, 'https___accessfreetools.com_-Performance-on-Search-2026-07-02');
    mkdirSync(performanceDir, { recursive: true });
    writeFixture(performanceDir, 'Chart.csv', 'Date,Clicks,Impressions,CTR,Position\n2026-07-01,1,100,1%,10\n');
    writeFixture(
      performanceDir,
      'Pages.csv',
      'Top pages,Clicks,Impressions,CTR,Position\nhttps://accessfreetools.com/tools/sales-tax-calculator/,0,966,0%,26.9\nhttps://accessfreetools.com/sitemap/,0,188,0%,7.1\n',
    );
    writeFixture(
      performanceDir,
      'Queries.csv',
      'Top queries,Clicks,Impressions,CTR,Position\n"90 days from 30/04/2026",0,29,0%,7.14\n',
    );
    writeFixture(performanceDir, 'Countries.csv', 'Country,Clicks,Impressions,CTR,Position\nUnited States,0,10,0%,20\n');
    writeFixture(performanceDir, 'Devices.csv', 'Device,Clicks,Impressions,CTR,Position\nDesktop,0,10,0%,20\n');
    writeFixture(performanceDir, 'Filters.csv', 'Filter,Value\nSearch type,Web\n');
    writeFixture(performanceDir, 'Search appearance.csv', 'Search Appearance,Clicks,Impressions,CTR,Position');
    const deindexedFile = writeFixture(
      root,
      'deindexed.csv',
      '"URL","Status","Impressions","Clicks","CTR","Position","Last updated","De-indexed at"\n"https://accessfreetools.com/sitemap/","Not Indexed","188","0","0%","7.1","2 Jul 2026","26 Jun 2026"\n"https://accessfreetools.com/blog/how-to-use-va-mortgage-calculator/","Not Indexed","63","0","0%","36.7","2 Jul 2026","23 Jun 2026"\n',
    );

    const report = buildSearchConsolePerformanceReport({
      deindexedFile,
      generatedAt: '2026-07-02T00:00:00.000Z',
      performanceDir,
    });

    expect(report.status).toBe('attention');
    expect(report.totals.pageRows).toBe(2);
    expect(report.totals.pageImpressions).toBe(1154);
    expect(report.totals.deindexedRows).toBe(2);
    expect(report.totals.deindexedOverlapWithPerformance).toBe(1);
    expect(report.source.dataDate).toBe('2026-07-02');
    expect(report.searchAppearance).toEqual([]);
    expect(report.deindexedByKind.blog.count).toBe(1);
    expect(report.deindexedByKind['html-sitemap'].impressions).toBe(188);
    expect(report.opportunities.queryQuickWins[0].query).toBe('90 days from 30/04/2026');
    expect(report.tierARecovery.find((item) => item.path === '/blog/how-to-use-va-mortgage-calculator/')?.evidenceFound).toBe(true);
    expect(report.tierARecovery.find((item) => item.path === '/blog/how-to-use-va-mortgage-calculator/')?.action).toBe(
      'differentiate',
    );
  });

  it('writes JSON, Markdown, and Tier A recovery outputs', () => {
    const root = makeRoot();
    const performanceDir = join(root, 'perf');
    const outputDir = join(root, 'out');
    mkdirSync(performanceDir, { recursive: true });
    writeFixture(performanceDir, 'Chart.csv', 'Date,Clicks,Impressions,CTR,Position\n2026-07-01,0,0,0%,0\n');
    writeFixture(performanceDir, 'Pages.csv', 'Top pages,Clicks,Impressions,CTR,Position\nhttps://accessfreetools.com/tools/,1,10,10%,5\n');
    writeFixture(performanceDir, 'Queries.csv', 'Top queries,Clicks,Impressions,CTR,Position\ncalculator,1,10,10%,5\n');

    const report = buildSearchConsolePerformanceReport({
      generatedAt: '2026-07-02T00:00:00.000Z',
      performanceDir,
    });
    const paths = writeSearchConsolePerformanceReport(report, outputDir);

    expect(paths.jsonPath.endsWith('performance-latest.json')).toBe(true);
    expect(paths.markdownPath.endsWith('performance-latest.md')).toBe(true);
    expect(paths.tierAPath.endsWith('tier-a-recovery-list.txt')).toBe(true);
  });

  it('finds duplicate-suffixed deindexed CSV exports', () => {
    const root = makeRoot();
    const deindexedFile = writeFixture(root, 'kifx0p91f5-deindexed-2026-07-02 (1).csv', 'URL,Status\n');

    expect(newestDeindexedFile(root)).toBe(deindexedFile);
  });
});
