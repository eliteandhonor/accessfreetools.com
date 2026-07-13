import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
  INDEXNOW_KEY_FILE_NAME,
  normalizeIndexNowUrl,
  parseIndexNowArgs,
  runIndexNow,
} from '../indexnow-submit.mjs';

const temporaryDirectories = [];

function projectFixture() {
  const cwd = mkdtempSync(join(tmpdir(), 'aft-indexnow-'));
  temporaryDirectories.push(cwd);
  mkdirSync(join(cwd, 'public'), { recursive: true });
  writeFileSync(join(cwd, 'public', INDEXNOW_KEY_FILE_NAME), `${INDEXNOW_KEY}\n`);
  return cwd;
}

afterEach(() => {
  while (temporaryDirectories.length) {
    rmSync(temporaryDirectories.pop(), { force: true, recursive: true });
  }
  vi.restoreAllMocks();
});

describe('IndexNow submitter safety', () => {
  it('parses explicit URL submissions and rejects ambiguous or unknown options', () => {
    expect(
      parseIndexNowArgs([
        '--url=https://accessfreetools.com/tools/four-in-a-row-game/',
        '--verify-production',
      ]),
    ).toMatchObject({
      all: false,
      urls: ['https://accessfreetools.com/tools/four-in-a-row-game/'],
      verifyProduction: true,
    });
    expect(() => parseIndexNowArgs(['--all', '--url=https://accessfreetools.com/'])).toThrow(/either --all/);
    expect(() => parseIndexNowArgs(['--publish-everything'])).toThrow(/Unknown IndexNow option/);
  });

  it('rejects off-site, credentialed, query, and fragment URL variants', () => {
    expect(() => normalizeIndexNowUrl('https://example.com/tools/')).toThrow(/canonical/);
    expect(() => normalizeIndexNowUrl('https://user:pass@accessfreetools.com/tools/')).toThrow(/canonical/);
    expect(() => normalizeIndexNowUrl('https://accessfreetools.com/tools/?preview=1')).toThrow(/canonical/);
    expect(() => normalizeIndexNowUrl('https://accessfreetools.com/tools/#four-in-a-row')).toThrow(/canonical/);
  });

  it('shows help without reading project files, writing reports, or using the network', async () => {
    const fetchImpl = vi.fn();
    const reportWriter = vi.fn();
    const log = vi.fn();

    const result = await runIndexNow({
      argv: ['--help'],
      cwd: join(tmpdir(), 'missing-indexnow-project'),
      fetchImpl,
      log,
      reportWriter,
    });

    expect(result).toEqual({ action: 'help', networkRequests: 0 });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(reportWriter).not.toHaveBeenCalled();
    expect(log.mock.calls[0][0]).toContain('Routine releases should use explicit --url values.');
  });

  it('refuses a bare command before file, report, or network side effects', async () => {
    const fetchImpl = vi.fn();
    const reportWriter = vi.fn();

    await expect(
      runIndexNow({
        argv: [],
        cwd: join(tmpdir(), 'missing-indexnow-project'),
        fetchImpl,
        reportWriter,
      }),
    ).rejects.toThrow(/explicit --url or --all/);

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(reportWriter).not.toHaveBeenCalled();
  });

  it('keeps dry-run network-free while saving exact canonical URL evidence', async () => {
    const cwd = projectFixture();
    const fetchImpl = vi.fn();
    const reportWriter = vi.fn(() => ({ archive: 'archive.json', latest: 'latest.json' }));

    const result = await runIndexNow({
      argv: [
        '--dry-run',
        '--url=https://accessfreetools.com/tools/four-in-a-row-game/',
        '--url=https://accessfreetools.com/tools/four-in-a-row-game/',
      ],
      cwd,
      fetchImpl,
      log: vi.fn(),
      now: () => new Date('2026-07-13T06:00:00.000Z'),
      reportWriter,
    });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(result.action).toBe('dry-run');
    expect(result.report.urls).toEqual(['https://accessfreetools.com/tools/four-in-a-row-game/']);
    expect(reportWriter).toHaveBeenCalledOnce();
  });

  it('submits only explicit URLs and archives a timestamped report', async () => {
    const cwd = projectFixture();
    const fetchImpl = vi.fn(async (url, options = {}) => {
      if (url === INDEXNOW_ENDPOINT) {
        return { body: null, ok: true, status: 200, statusText: 'OK', text: async () => '' };
      }
      throw new Error(`Unexpected request: ${url} ${options.method ?? 'GET'}`);
    });

    const result = await runIndexNow({
      argv: ['--url=https://accessfreetools.com/tools/four-in-a-row-game/'],
      cwd,
      fetchImpl,
      log: vi.fn(),
      now: () => new Date('2026-07-13T06:00:00.000Z'),
    });

    expect(fetchImpl).toHaveBeenCalledOnce();
    const request = fetchImpl.mock.calls[0];
    const payload = JSON.parse(request[1].body);
    expect(payload.urlList).toEqual(['https://accessfreetools.com/tools/four-in-a-row-game/']);
    expect(result.paths.archive).toContain('submission-2026-07-13T06-00-00-000Z.json');
    expect(JSON.parse(readFileSync(result.paths.latest, 'utf8')).urlCount).toBe(1);
    expect(JSON.parse(readFileSync(result.paths.archive, 'utf8')).mode).toBe('explicit-urls');
  });
});
