import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, describe, expect, it } from 'vitest';

import { buildCrawlScoutReport, newestCrawlScoutCsv, writeCrawlScoutReport } from './crawlscout-import.mjs';

const tempRoots = [];

function makeRoot() {
  const root = join(tmpdir(), `aft-crawlscout-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(root, { recursive: true });
  tempRoots.push(root);
  return root;
}

function writeFixture(root, relativePath, content) {
  const path = join(root, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  return path;
}

afterEach(() => {
  while (tempRoots.length) rmSync(tempRoots.pop(), { force: true, recursive: true });
});

describe('CrawlScout import', () => {
  it('normalizes deindexed URL CSV rows into the CrawlScout summary shape', () => {
    const root = makeRoot();
    const csvFile = writeFixture(
      root,
      'kifx0p91f5-deindexed-2026-07-02 (1).csv',
      [
        '"URL","Status","Impressions","Clicks","CTR","Position","Last updated","De-indexed at"',
        '"https://accessfreetools.com/blog/how-to-use-html-entity-encoder-decoder/","Not Indexed","2","0","0%","3.5","2 Jul 2026","29 Jun 2026"',
        '"https://accessfreetools.com/tools/sales-tax-calculator/","Indexed","10","1","10%","4.2","2 Jul 2026",""',
      ].join('\n'),
    );

    const report = buildCrawlScoutReport({ csvFile, generatedAt: '2026-07-03T00:00:00.000Z' });

    expect(report.status).toBe('attention');
    expect(report.overview.rows).toBe(2);
    expect(report.overview.notIndexed).toBe(1);
    expect(report.overview.indexed).toBe(1);
    expect(report.pageSample).toHaveLength(1);
    expect(report.pageSample[0]).toMatchObject({
      path: '/blog/how-to-use-html-entity-encoder-decoder/',
      status: 'Not Indexed',
      impressions: 2,
      clicks: 0,
    });
    expect(report.urlsByKind.blog.count).toBe(1);
    expect(report.urlsByKind.tool.count).toBe(1);
  });

  it('finds duplicate-suffixed deindexed CSV exports in Downloads-style folders', () => {
    const root = makeRoot();
    const csvFile = writeFixture(root, 'kifx0p91f5-deindexed-2026-07-02 (1).csv', 'URL,Status\n');

    expect(newestCrawlScoutCsv(root)).toBe(csvFile);
  });

  it('writes summary, latest, and markdown outputs', () => {
    const root = makeRoot();
    const csvFile = writeFixture(
      root,
      'kifx0p91f5-deindexed-2026-07-02.csv',
      'URL,Status,Impressions,Clicks,CTR,Position\nhttps://accessfreetools.com/sitemap/,Not Indexed,188,0,0%,7.1\n',
    );
    const report = buildCrawlScoutReport({ csvFile });
    const paths = writeCrawlScoutReport(report, join(root, 'out'));

    expect(existsSync(paths.jsonPath)).toBe(true);
    expect(existsSync(paths.latestPath)).toBe(true);
    expect(readFileSync(paths.markdownPath, 'utf8')).toContain('/sitemap/');
  });
});
