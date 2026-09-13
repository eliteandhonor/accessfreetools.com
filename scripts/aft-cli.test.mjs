import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const tempRoots = [];
const repoRoot = process.cwd();
const aftCli = join(repoRoot, 'scripts', 'aft-cli.mjs');

function makeRoot() {
  const root = join(tmpdir(), `aft-cli-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(root, { recursive: true });
  tempRoots.push(root);
  return root;
}

function writeFixture(root, relativePath, content) {
  const file = join(root, relativePath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

afterEach(() => {
  while (tempRoots.length) rmSync(tempRoots.pop(), { force: true, recursive: true });
});

describe('aft CLI promotion authorization', () => {
  it('separates approval-required rows and excludes inactive or mixed channels', () => {
    const root = makeRoot();
    writeFixture(root, 'docs/promotion-queue.md', [
      '| Priority | Page | Angle | Channel | Status | Next Action |',
      '| --- | --- | --- | --- | --- | --- |',
      '| High | /allowed/ | ready | Medium | approved | verify |',
      '| High | /release-ready/ | ready | Pinterest organic | release-ready | verify |',
      '| High | /pending/ | draft | Bluesky | needs approval | ask owner |',
      '| High | /blocked/ | old | DEV Community | approved | never |',
      '| High | /mixed/ | mixed | Medium, Quora | approved | never |',
      '| High | /mixed-unicode/ | mixed | Medium, \u672a\u77e5 | approved | never |',
      '| High | /mixed-punctuation/ | mixed | Medium / ??? | release-ready | never |',
    ].join('\n'));
    const result = spawnSync(process.execPath, [aftCli, 'promote-next', '--json'], { cwd: root, encoding: 'utf8' });
    expect(result.status).toBe(0);
    const report = JSON.parse(result.stdout);
    expect(report.candidates.map((row) => row.page)).toEqual(['/allowed/', '/release-ready/']);
    expect(report.approvalRequired.map((row) => row.page)).toEqual(['/pending/']);
    expect(report.qualityReports.map((row) => row.label).join(' ')).not.toMatch(/DEV Community|Quora|Reddit/);
  });
});

describe('aft CLI indexing gaps', () => {
  it('labels exact URL inspection freshness separately from aggregate evidence', () => {
    const root = makeRoot();
    const generatedAt = new Date().toISOString();

    writeFixture(
      root,
      'output/search-console-url-inspection.json',
      JSON.stringify({
        generatedAt,
        inspections: [
          {
            coverageState: 'Discovered - currently not indexed',
            inspectionUrl: 'https://accessfreetools.com/tools/json-to-csv-converter/',
            verdict: 'NEUTRAL',
          },
        ],
      }),
    );
    writeFixture(
      root,
      'output/search-console/performance-latest.json',
      JSON.stringify({
        generatedAt: '2026-01-01T00:00:00.000Z',
        totals: { deindexedRows: 118, pageClicks: 12, pageImpressions: 9276 },
      }),
    );

    const result = spawnSync(process.execPath, [aftCli, 'indexing-gaps'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Exact URL inspection gaps: 1');
    expect(result.stdout).toContain('Exact URL inspection evidence: fresh');
    expect(result.stdout).toContain('Gap record freshness: fresh 1, stale 0, undated 0');
    expect(result.stdout).toContain('Performance/deindex aggregate (stale');
  });

  it('labels old exact inspections as stale instead of presenting them as current', () => {
    const root = makeRoot();

    writeFixture(
      root,
      'output/search-console-url-inspection.json',
      JSON.stringify({
        generatedAt: '2026-01-01T00:00:00.000Z',
        inspections: [
          {
            coverageState: 'Crawled - currently not indexed',
            inspectionUrl: 'https://accessfreetools.com/tools/percentage-calculator/',
            verdict: 'NEUTRAL',
          },
        ],
      }),
    );

    const result = spawnSync(process.execPath, [aftCli, 'indexing-gaps'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Exact URL inspection evidence: stale');
    expect(result.stdout).toContain('Gap record freshness: fresh 0, stale 1, undated 0');
  });

  it('does not let one fresh merged source make older URL records look current', () => {
    const root = makeRoot();
    const freshDate = new Date().toISOString();

    writeFixture(
      root,
      'output/search-console-url-inspection.json',
      JSON.stringify({
        generatedAt: freshDate,
        latestSourceGeneratedAt: freshDate,
        inspections: [
          {
            coverageState: 'Discovered - currently not indexed',
            inspectionUrl: 'https://accessfreetools.com/tools/new-tool/',
            sourceGeneratedAt: freshDate,
            verdict: 'NEUTRAL',
          },
          {
            coverageState: 'Crawled - currently not indexed',
            inspectionUrl: 'https://accessfreetools.com/tools/old-tool/',
            sourceGeneratedAt: '2026-01-01T00:00:00.000Z',
            verdict: 'NEUTRAL',
          },
        ],
      }),
    );

    const result = spawnSync(process.execPath, [aftCli, 'indexing-gaps'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Exact URL inspection evidence: fresh');
    expect(result.stdout).toContain('Gap record freshness: fresh 1, stale 1, undated 0');
    expect(result.stdout).toContain('A fresh merged snapshot does not make every saved URL inspection current.');
  });

  it('keeps deferred exact gaps as a request-only batch instead of recommending rewrites', () => {
    const root = makeRoot();
    const url = 'https://accessfreetools.com/tools/json-to-csv-converter/';

    writeFixture(
      root,
      'output/search-console-url-inspection.json',
      JSON.stringify({
        generatedAt: new Date().toISOString(),
        inspections: [{ coverageState: 'Discovered - currently not indexed', inspectionUrl: url, verdict: 'NEUTRAL' }],
      }),
    );
    writeFixture(
      root,
      'docs/search-console-indexing-requests.json',
      JSON.stringify({
        deferred: [{ attemptedAt: null, reason: 'Next exact request batch.', url }],
        requests: [],
      }),
    );

    const result = spawnSync(process.execPath, [aftCli, 'indexing-gaps'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('already queued in the local request registry');
    expect(result.stdout).toContain('do not rewrite the pages first');
    expect(result.stdout).not.toContain('improve contextual internal links');
  });

  it('uses request-indexing proof before recommending repeat SEO actions', () => {
    const root = makeRoot();
    const url = 'https://accessfreetools.com/tools/percentage-calculator/';

    writeFixture(
      root,
      'output/search-console-url-inspection.json',
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          inspections: [
            {
              coverageState: 'Crawled - currently not indexed',
              inspectionUrl: url,
              lastCrawlTime: '2026-07-01T00:00:00Z',
              verdict: 'NEUTRAL',
            },
          ],
        },
        null,
        2,
      ),
    );
    writeFixture(
      root,
      'docs/search-console-indexing-requests.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-03T01:21:00+10:00',
          requests: [
            {
              requestedAt: '2026-07-03T01:20:00+10:00',
              result: 'indexing-requested',
              url,
            },
          ],
        },
        null,
        2,
      ),
    );

    const result = spawnSync(process.execPath, [aftCli, 'indexing-gaps'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('request-indexing submitted 3 July 2026, 1:20 am');
    expect(result.stdout).toContain('request-indexing is already submitted for every current gap');
    expect(result.stdout).not.toContain('improve contextual internal links, submit discovery');
  });

  it('keeps the generic recommendation when no request proof exists', () => {
    const root = makeRoot();

    writeFixture(
      root,
      'output/search-console-url-inspection.json',
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          inspections: [
            {
              coverageState: 'Crawled - currently not indexed',
              inspectionUrl: 'https://accessfreetools.com/tools/percentage-calculator/',
              verdict: 'NEUTRAL',
            },
          ],
        },
        null,
        2,
      ),
    );

    const result = spawnSync(process.execPath, [aftCli, 'indexing-gaps'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('improve contextual internal links, submit discovery');
  });

  it('uses feed sitemap cleanup proof before repeating coverage drilldown confirmation work', () => {
    const root = makeRoot();

    writeFixture(
      root,
      'output/search-console-coverage-drilldown.json',
      JSON.stringify(
        {
          actions: [
            {
              priority: 'high',
              task: 'Confirm /sitemap/ and /feed.xml return noindex,follow and are absent from XML sitemaps; then deploy and wait for Google to recrawl before restarting validation.',
            },
            {
              priority: 'medium',
              task: 'Review newest affected tool/blog URLs with the SEO workbench.',
            },
          ],
          generatedAt: '2026-07-04T10:16:58.934Z',
          metadata: {
            Issue: 'Crawled - currently not indexed',
          },
          totals: {
            rowCount: 338,
            rowsByType: {
              blog: 188,
              feed: 1,
              'html-sitemap': 1,
              tool: 146,
            },
          },
        },
        null,
        2,
      ),
    );
    writeFixture(
      root,
      'output/search-console-discovery.json',
      JSON.stringify(
        {
          pruned: ['https://accessfreetools.com/feed.xml'],
          submissions: ['https://accessfreetools.com/sitemap.xml'],
        },
        null,
        2,
      ),
    );
    writeFixture(
      root,
      'output/production-sitemap-check.json',
      JSON.stringify(
        {
          hardFailures: 0,
        },
        null,
        2,
      ),
    );
    writeFixture(
      root,
      'output/indexing-protection/2026-07-04/summary.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-04T09:43:07.369Z',
          totals: {
            highIssues: 0,
          },
        },
        null,
        2,
      ),
    );

    const result = spawnSync(process.execPath, [aftCli, 'indexing-gaps'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Coverage drilldown action: watch: Feed/html sitemap cleanup has current local proof');
    expect(result.stdout).toContain('Wait for Google recrawl');
    expect(result.stdout).not.toContain('Confirm /sitemap/ and /feed.xml');
  });
});

describe('aft CLI site sitemap', () => {
  it('counts final sitemap URL entries without counting child sitemap index locs', () => {
    const root = makeRoot();

    writeFixture(
      root,
      'dist/client/sitemap.xml',
      `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://accessfreetools.com/sitemap-tools.xml</loc></sitemap>
  <sitemap><loc>https://accessfreetools.com/sitemap-blog.xml</loc></sitemap>
</sitemapindex>`,
    );
    writeFixture(
      root,
      'dist/client/sitemap-tools.xml',
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://accessfreetools.com/tools/percentage-calculator/</loc></url>
</urlset>`,
    );
    writeFixture(
      root,
      'dist/client/sitemap-blog.xml',
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://accessfreetools.com/blog/how-to-use-percentage-calculator/</loc></url>
</urlset>`,
    );

    const result = spawnSync(process.execPath, [aftCli, 'site-sitemap'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Built sitemap URLs: 2');
    expect(result.stdout).toContain('Tools: 1; guides: 1; categories: 0');
    expect(result.stdout).not.toContain('Built sitemap URLs: 4');
  });
});
