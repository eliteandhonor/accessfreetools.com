import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  buildSearchConsolePerformanceReport,
  dataDateFromName,
  newestDeindexedFile,
  newestPerformanceExportZip,
  newestPerformanceOverviewFile,
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

function createStoredZip(entries) {
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;

  for (const [name, value] of Object.entries(entries)) {
    const nameBuffer = Buffer.from(name);
    const content = Buffer.from(value);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt32LE(0, 14);
    localHeader.writeUInt32LE(content.length, 18);
    localHeader.writeUInt32LE(content.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localParts.push(localHeader, nameBuffer, content);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt32LE(0, 16);
    centralHeader.writeUInt32LE(content.length, 20);
    centralHeader.writeUInt32LE(content.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(localOffset, 42);
    centralParts.push(centralHeader, nameBuffer);
    localOffset += localHeader.length + nameBuffer.length + content.length;
  }

  const central = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(entries).length, 8);
  end.writeUInt16LE(Object.keys(entries).length, 10);
  end.writeUInt32LE(central.length, 12);
  end.writeUInt32LE(localOffset, 16);
  return Buffer.concat([...localParts, central, end]);
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
    const overviewFile = writeFixture(
      root,
      'accessfreetools.com_SearchPerformanceOverview_All_7_2_2026.csv',
      'Date,Clicks,Impressions,CTR\n7/1/2026 12:00:00 AM,2,100,2%\n7/2/2026 12:00:00 AM,1,50,2%\n',
    );
    const deindexedFile = writeFixture(
      root,
      'deindexed.csv',
      '"URL","Status","Impressions","Clicks","CTR","Position","Last updated","De-indexed at"\n"https://accessfreetools.com/sitemap/","Not Indexed","188","0","0%","7.1","2 Jul 2026","26 Jun 2026"\n"https://accessfreetools.com/blog/how-to-use-va-mortgage-calculator/","Not Indexed","63","0","0%","36.7","2 Jul 2026","23 Jun 2026"\n',
    );

    const report = buildSearchConsolePerformanceReport({
      deindexedFile,
      generatedAt: '2026-07-02T00:00:00.000Z',
      overviewFile,
      performanceDir,
    });

    expect(report.status).toBe('attention');
    expect(report.totals.pageRows).toBe(2);
    expect(report.totals.pageImpressions).toBe(1154);
    expect(report.totals.deindexedRows).toBe(2);
    expect(report.totals.deindexedOverlapWithPerformance).toBe(1);
    expect(report.source.dataDate).toBe('2026-07-02');
    expect(report.source.overviewKind).toBe('bing-webmaster-performance-overview');
    expect(report.totals.bingOverviewRows).toBe(2);
    expect(report.totals.bingOverviewImpressions).toBe(150);
    expect(report.totals.bingOverviewClicks).toBe(3);
    expect(report.totals.bingOverviewCtrPercent).toBe(2);
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

  it('imports ZIP exports, preserves source hashes, and matches evidence by date', () => {
    const root = makeRoot();
    const zipFile = join(root, 'folder with spaces', 'https___accessfreetools.com_-Performance-on-Search-2026-07-29.zip');
    mkdirSync(join(zipFile, '..'), { recursive: true });
    writeFileSync(
      zipFile,
      createStoredZip({
        'Chart.csv': 'Date,Clicks,Impressions,CTR,Position\n2026-07-28,1,100,1%,10\n2026-07-29,2,200,1%,9\n',
        'Pages.csv': 'Top pages,Clicks,Impressions,CTR,Position\nhttps://accessfreetools.com/tools/,3,300,1%,9\n',
        'Queries.csv': 'Top queries,Clicks,Impressions,CTR,Position\nfree tools,1,20,5%,10\n',
        'Countries.csv': 'Country,Clicks,Impressions,CTR,Position\nAustralia,1,20,5%,10\n',
        'Devices.csv': 'Device,Clicks,Impressions,CTR,Position\nMobile,1,20,5%,10\n',
        'Filters.csv': 'Filter,Value\nSearch type,Web\n',
        'Search appearance.csv': 'Search Appearance,Clicks,Impressions,CTR,Position\n',
      }),
    );
    const matchingOverview = writeFixture(
      root,
      'accessfreetools.com_SearchPerformanceOverview_All_7_29_2026.csv',
      'Date,Clicks,Impressions,CTR\n7/29/2026 12:00:00 AM,4,100,4%\n',
    );
    writeFixture(
      root,
      'accessfreetools.com_SearchPerformanceOverview_All_7_18_2026.csv',
      'Date,Clicks,Impressions,CTR\n7/18/2026 12:00:00 AM,99,100,99%\n',
    );

    const report = buildSearchConsolePerformanceReport({
      overviewFile: matchingOverview,
      performanceZip: zipFile,
    });

    expect(report.source.performanceKind).toBe('zip');
    expect(report.source.dataDate).toBe('2026-07-29');
    expect(report.source.period).toEqual({ start: '2026-07-28', end: '2026-07-29' });
    expect(report.source.hashes.performanceZip).toMatch(/^[a-f0-9]{64}$/);
    expect(report.totals.chartClicks).toBe(3);
    expect(report.totals.chartImpressions).toBe(300);
    expect(report.searchAppearance).toEqual([]);
    expect(newestPerformanceExportZip(join(root, 'folder with spaces'))).toBe(zipFile);
    expect(newestPerformanceOverviewFile(root, '2026-07-29')).toBe(matchingOverview);
    expect(dataDateFromName(matchingOverview)).toBe('2026-07-29');
  });

  it('rejects a stale Bing overview attached to a newer Google export', () => {
    const root = makeRoot();
    const performanceDir = join(root, 'https___accessfreetools.com_-Performance-on-Search-2026-07-29');
    mkdirSync(performanceDir, { recursive: true });
    writeFixture(performanceDir, 'Chart.csv', 'Date,Clicks,Impressions,CTR,Position\n2026-07-29,1,10,10%,1\n');
    const staleOverview = writeFixture(
      root,
      'accessfreetools.com_SearchPerformanceOverview_All_7_18_2026.csv',
      'Date,Clicks,Impressions,CTR\n7/18/2026 12:00:00 AM,1,10,10%\n',
    );

    expect(() =>
      buildSearchConsolePerformanceReport({
        overviewFile: staleOverview,
        performanceDir,
      }),
    ).toThrow(/does not match/);
  });
});
