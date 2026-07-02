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

describe('aft CLI indexing gaps', () => {
  it('uses request-indexing proof before recommending repeat SEO actions', () => {
    const root = makeRoot();
    const url = 'https://accessfreetools.com/tools/percentage-calculator/';

    writeFixture(
      root,
      'output/search-console-url-inspection.json',
      JSON.stringify(
        {
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
});
