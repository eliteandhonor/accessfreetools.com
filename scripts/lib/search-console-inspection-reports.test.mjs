import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  discoverInspectionReportFiles,
  mergeInspectionReports,
  readInspectionReports,
} from './search-console-inspection-reports.mjs';

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
