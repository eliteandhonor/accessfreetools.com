import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  buildBingWebmasterReport,
  newestBingWebmasterFiles,
  parseBingKeywordCsv,
  renderBingWebmasterMarkdown,
  writeBingWebmasterReport,
} from './bing-webmaster-import.mjs';

const tempRoots = [];

function makeRoot() {
  const root = join(tmpdir(), `aft-bing-${Date.now()}-${Math.random().toString(16).slice(2)}`);
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

describe('Bing Webmaster evidence import', () => {
  it('normalizes keyword, AI citation, and latest-link exports', () => {
    const root = makeRoot();
    const keywordsFile = writeFixture(
      root,
      'accessfreetools.com_KeywordReport_7_18_2026.csv',
      [
        '"Keyword","Impressions","Clicks","CTR","Avg. Position"',
        '"cute calculator","65","2","3.08%","5.9"',
        '"on center spacing calculator for plants","1","2","200%","4"',
        '"love calculator n","1","0","0%","632"',
      ].join('\n'),
    );
    const aiQueriesFile = writeFixture(
      root,
      'accessfreetools.com_AISearchQueriesReport_7_18_2026.csv',
      [
        '"Grounding Query","Intent","Topic","Citations","Citation Share"',
        '"how to use a tax estimate calculator","Learn and Solve","Taxes","24","21.82%"',
        '"how to use income tax estimator","Learn and Solve","Taxes","13","37.14%"',
      ].join('\n'),
    );
    const latestLinksFile = writeFixture(
      root,
      'accessfreetools.com-Latest links-2026-07-18.csv',
      'Linking page,Last crawled\nhttps://medium.com/@accessfreetools/example,2026-05-13\n',
    );

    const report = buildBingWebmasterReport({
      aiQueriesFile,
      generatedAt: '2026-07-18T00:00:00.000Z',
      keywordsFile,
      latestLinksFile,
    });

    expect(report.status).toBe('attention');
    expect(report.totals.keywords.raw).toMatchObject({ clicks: 4, impressions: 67, rows: 3 });
    expect(report.totals.keywords.validated).toMatchObject({ clicks: 2, impressions: 66, rows: 2 });
    expect(report.totals.keywords.excludedRows).toBe(1);
    expect(report.totals.ai).toMatchObject({ citations: 37, queries: 2 });
    expect(report.totals.latestLinks).toBe(1);
    expect(report.qualityIssues.map((issue) => issue.type)).toEqual(
      expect.arrayContaining(['clicks-exceed-impressions', 'ctr-out-of-range', 'position-outlier']),
    );
    expect(report.source.keywords.dataDate).toBe('2026-07-18');
    expect(report.source.keywords.sha256).toMatch(/^[a-f0-9]{64}$/);
  });

  it('recovers a Bing keyword row containing unescaped quotation marks', () => {
    const rows = parseBingKeywordCsv(
      [
        '"Keyword","Impressions","Clicks","CTR","Avg. Position"',
        '"cb06#TAB#6′ (72")#TAB#4" × 8"#TAB#165 lbs","2","0","0%","4"',
        '"cute calculator","65","2","3.08%","5.9"',
      ].join('\n'),
    );

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      Keyword: 'cb06#TAB#6′ (72")#TAB#4" × 8"#TAB#165 lbs',
      Impressions: '2',
      Clicks: '0',
      CTR: '0%',
      'Avg. Position': '4',
    });
    expect(rows[1].Keyword).toBe('cute calculator');
  });

  it('finds files with spaces and permits an unknown source period', () => {
    const root = makeRoot();
    const links = writeFixture(root, 'accessfreetools.com-Latest links.csv', 'Linking page,Last crawled\n');
    const datedLinks = writeFixture(
      root,
      'accessfreetools.com-Latest links-2026-07-18.csv',
      'Linking page,Last crawled\n',
    );
    writeFixture(root, 'accessfreetools.com_KeywordReport_unknown.csv', 'Keyword,Impressions,Clicks,CTR,Avg. Position\n');

    const files = newestBingWebmasterFiles(root);
    expect(files.latestLinks).toBe(datedLinks);

    const report = buildBingWebmasterReport({ latestLinksFile: links });
    expect(report.source.latestLinks.dataDate).toBe('');
  });

  it('writes bounded reports without exposing absolute source paths', () => {
    const root = makeRoot();
    const keywordsFile = writeFixture(
      root,
      'accessfreetools.com_KeywordReport_7_18_2026.csv',
      'Keyword,Impressions,Clicks,CTR,Avg. Position\ncalculator,10,1,10%,5\n',
    );
    const report = buildBingWebmasterReport({ keywordsFile });
    const outputDir = join(root, 'output with spaces');
    const paths = writeBingWebmasterReport(report, outputDir);
    const serialized = JSON.stringify(report);
    const markdown = renderBingWebmasterMarkdown(report);

    expect(paths.jsonPath.endsWith('latest.json')).toBe(true);
    expect(paths.markdownPath.endsWith('latest.md')).toBe(true);
    expect(serialized).not.toContain(root);
    expect(markdown).not.toContain(root);
  });
});
