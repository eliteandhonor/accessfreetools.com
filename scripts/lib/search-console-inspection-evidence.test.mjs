import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  buildLatestSearchConsoleInspectionEvidence,
  writeLatestSearchConsoleInspectionEvidence,
} from './search-console-inspection-evidence.mjs';

const tempRoots = [];

function makeRoot() {
  const root = join(tmpdir(), `aft-gsc-inspections-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(root, { recursive: true });
  tempRoots.push(root);
  return root;
}

function writeJson(root, relativePath, value) {
  const path = join(root, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
  return path;
}

afterEach(() => {
  while (tempRoots.length) rmSync(tempRoots.pop(), { force: true, recursive: true });
});

describe('Search Console inspection evidence', () => {
  it('chooses the newest successful inspection for each URL', () => {
    const root = makeRoot();
    const url = 'https://accessfreetools.com/tools/example/';
    writeJson(root, 'output/search-console-url-inspection.json', {
      generatedAt: '2026-07-12T00:00:00.000Z',
      inspections: [{ coverageState: 'Crawled - currently not indexed', inspectionUrl: url, verdict: 'NEUTRAL' }],
    });
    writeJson(root, 'output/search-console/url-inspection-july-18.json', {
      generatedAt: '2026-07-18T00:00:00.000Z',
      inspections: [
        { coverageState: 'Submitted and indexed', inspectionUrl: url, lastCrawlTime: '2026-07-17T00:00:00Z', verdict: 'PASS' },
        {
          coverageState: 'Discovered - currently not indexed',
          inspectionUrl: 'https://accessfreetools.com/blog/example/',
          verdict: 'NEUTRAL',
        },
      ],
    });

    const report = buildLatestSearchConsoleInspectionEvidence({ root });

    expect(report.summary).toMatchObject({ sourceReports: 2, uniqueUrls: 2 });
    expect(report.inspections.find((item) => item.inspectionUrl === url)).toMatchObject({
      coverageState: 'Submitted and indexed',
      sourceGeneratedAt: '2026-07-18T00:00:00.000Z',
      verdict: 'PASS',
    });
  });

  it('records a newer collection error without erasing valid evidence', () => {
    const root = makeRoot();
    const url = 'https://accessfreetools.com/tools/example/';
    writeJson(root, 'output/search-console-url-inspection.json', {
      generatedAt: '2026-07-12T00:00:00.000Z',
      inspections: [{ coverageState: 'Submitted and indexed', inspectionUrl: url, verdict: 'PASS' }],
    });
    writeJson(root, 'output/search-console/url-inspection-july-18.json', {
      generatedAt: '2026-07-18T00:00:00.000Z',
      inspections: [{ error: 'temporary API failure', inspectionUrl: url }],
    });

    const report = buildLatestSearchConsoleInspectionEvidence({ root });

    expect(report.inspections[0]).toMatchObject({ coverageState: 'Submitted and indexed', verdict: 'PASS' });
    expect(report.collectionErrors[0]).toMatchObject({ error: 'temporary API failure', inspectionUrl: url });
  });

  it('ignores malformed and out-of-origin reports and writes a stable aggregate', () => {
    const root = makeRoot();
    writeJson(root, 'output/search-console-url-inspection.json', {
      generatedAt: '2026-07-18T00:00:00.000Z',
      inspections: [
        {
          coverageState: 'Submitted and indexed',
          inspectionUrl: 'https://example.com/not-ours/',
          verdict: 'PASS',
        },
      ],
    });
    const invalidPath = join(root, 'output', 'search-console', 'url-inspection-invalid.json');
    mkdirSync(dirname(invalidPath), { recursive: true });
    writeFileSync(invalidPath, '{');

    const { outputPath, report } = writeLatestSearchConsoleInspectionEvidence({ root });

    expect(outputPath).toBe('output/search-console/url-inspection-latest.json');
    expect(report.inspections).toEqual([]);
    expect(report.status).toBe('missing');
  });
});
