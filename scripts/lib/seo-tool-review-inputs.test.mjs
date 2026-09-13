import { beforeEach, expect, it, vi } from 'vitest';

const evidence = vi.hoisted(() => ({ reports: new Map(), readJson: vi.fn() }));

vi.mock('./agent-tools-report.mjs', async (original) => ({
  ...await original(),
  readJson: evidence.readJson,
  extractToolRecords: () => ['wallpaper-calculator', 'sample-two', 'sample-three'].map((slug) => ({
    slug, name: slug, category: 'Other', file: 'src/data/tools.ts',
    faqCount: 6, exampleCount: 3, seoDescription: 'A source description.',
  })),
}));

import { buildSeoToolQueueReport } from './seo-tool-review.mjs';

const sources = [
  'output/search-console-url-inspection.json',
  'output/search-console-coverage-export.json',
  'output/seo-agent-self-evaluation.json',
  'output/agent-tools/usage-summary/latest.json',
  'output/usage-data-asset-report.json',
];

beforeEach(() => {
  evidence.reports.clear();
  evidence.readJson.mockReset().mockImplementation((path) => evidence.reports.get(path) ?? null);
});

it('reads each priority evidence source once per report without changing queue scores', () => {
  evidence.reports.set(sources[0], { slug: 'sample-two' });
  evidence.reports.set(sources[3], { slug: 'sample-two' });
  const report = buildSeoToolQueueReport({ trackerText: '', write: false });

  expect(report.entries.map(({ slug, page, priorityScore }) => [slug, page, priorityScore])).toEqual([
    ['wallpaper-calculator', 'tool', 100], ['wallpaper-calculator', 'blog', 100],
    ['sample-two', 'tool', 70], ['sample-two', 'blog', 70],
    ['sample-three', 'tool', 0], ['sample-three', 'blog', 0],
  ]);
  expect(evidence.readJson.mock.calls.map(([path]) => path).sort()).toEqual([...sources].sort());
});

it('refreshes the evidence snapshot on each invocation, including newly missing files', () => {
  evidence.reports.set(sources[0], { slug: 'sample-two' });
  const before = buildSeoToolQueueReport({ trackerText: '', write: false });
  evidence.reports.clear();
  evidence.reports.set(sources[4], { slug: 'sample-three' });
  const after = buildSeoToolQueueReport({ trackerText: '', write: false });
  const score = (report, slug) => report.entries.find((row) => row.slug === slug).priorityScore;

  expect(score(before, 'sample-two')).toBe(45);
  expect(score(after, 'sample-two')).toBe(0);
  expect(score(after, 'sample-three')).toBe(25);
  expect(evidence.readJson).toHaveBeenCalledTimes(sources.length * 2);
});
