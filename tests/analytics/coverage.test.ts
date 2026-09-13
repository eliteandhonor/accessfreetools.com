import { mkdtemp, readFile, readdir, rename, rm, stat, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({ directory: '', beforeOpen: null as null | (() => Promise<void>),
  afterOpen: null as null | (() => Promise<void>), shortRead: false }));

// Config lookup must never inspect owner files; event I/O must stay in this test's directory.
vi.mock('node:fs', async (original) => ({ ...await original<object>(), existsSync: () => false }));
vi.mock('node:fs/promises', async (original) => {
  const fs = await original<typeof import('node:fs/promises')>();
  return {
    ...fs,
    open: async (path: string, flags: string) => {
      if (!fixture.directory || !resolve(path).startsWith(`${resolve(fixture.directory)}${sep}`)) {
        throw new Error('Non-fixture analytics read refused');
      }
      const hook = fixture.beforeOpen;
      fixture.beforeOpen = null;
      await hook?.();
      const handle = await fs.open(path, flags);
      const afterOpen = fixture.afterOpen;
      fixture.afterOpen = null;
      await afterOpen?.();
      if (fixture.shortRead) {
        const read = handle.read.bind(handle);
        handle.read = ((buffer: Buffer, offset: number, length: number, position: number) =>
          read(buffer, offset, Math.floor(length / 2), position)) as typeof handle.read;
      }
      return handle;
    },
  };
});

const now = new Date('2026-09-06T12:00:00.000Z');
const mib = 1024 * 1024;
const old = { ts: '2026-09-04T00:00:00.000Z', day: '2026-09-04', type: 'page_view', pagePath: '/', visitorHash: 'v' };
const recent = { ...old, ts: '2026-09-06T01:00:00.000Z', day: '2026-09-06' };
const line = (event: object) => `${JSON.stringify(event)}\n`;

async function sizedLog(name: string, bytes: number) {
  const first = line(old);
  const last = line(recent);
  const content = Buffer.alloc(bytes, '\n');
  content.write(first);
  content.write(last, bytes - Buffer.byteLength(last));
  await writeFile(join(fixture.directory, name), content);
}

beforeEach(async () => {
  fixture.directory = await mkdtemp(join(tmpdir(), 'aft-analytics-coverage-'));
  fixture.beforeOpen = null;
  fixture.afterOpen = null;
  fixture.shortRead = false;
  vi.stubEnv('AFT_ANALYTICS_DIR', fixture.directory);
  vi.stubEnv('AFT_ANALYTICS_ENABLED', 'true');
  vi.stubEnv('AFT_ANALYTICS_EXCLUDE_IPS', '');
  vi.stubEnv('AFT_ANALYTICS_TIME_ZONE', 'Australia/Brisbane');
  vi.stubEnv('AFT_ANALYTICS_SALT', 'synthetic-fixture-only');
  vi.resetModules();
});

afterEach(async () => {
  const directory = resolve(fixture.directory);
  if (!directory.startsWith(`${resolve(tmpdir())}${sep}aft-analytics-coverage-`)) throw new Error('Unsafe fixture cleanup');
  await rm(directory, { recursive: true, force: true });
  vi.unstubAllEnvs();
});

describe('bounded analytics coverage', () => {
  it('counts a complete 16 MiB retained file without claiming deployment or lifetime coverage', async () => {
    await sizedLog('events.ndjson', 16 * mib);
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now, days: 30 });
    expect(summary.range.events).toBe(2);
    expect(summary.range.returningVisitors).toBe(1);
    expect(summary.coverage).toMatchObject({
      status: 'unknown', retainedRead: 'complete', deploymentContinuity: 'unknown', comparisonsAllowed: false,
      requestedStart: '2026-08-07T12:00:00.000Z', requestedEnd: now.toISOString(),
      observedStart: old.ts, observedEnd: recent.ts, rangeObservedStart: old.ts, rangeObservedEnd: recent.ts,
      allTimeScope: 'retained-events-only', visitorClassification: 'observed-history-only',
      bytesRead: 16 * mib,
    });
    expect(summary.coverage.reasons).toContain('deployment-continuity-unverified');
  });

  it.each([16 * mib + 1, 25 * mib])('marks an active %i-byte tail as partial', async (bytes) => {
    await sizedLog('events.ndjson', bytes);
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now });
    expect(summary.range.events).toBe(1);
    expect(summary.coverage).toMatchObject({ status: 'partial', retainedRead: 'partial', bytesRead: 16 * mib,
      observedStart: recent.ts, observedEnd: recent.ts, comparisonsAllowed: false });
    expect(summary.coverage.reasons).toContain('file-tail-limit');
  });

  it('marks 25 MiB archive omissions and returning-visitor history as incomplete', async () => {
    await sizedLog('events-archive.ndjson', 25 * mib);
    await writeFile(join(fixture.directory, 'events.ndjson'), line({ ...recent, ts: '2026-09-06T02:00:00.000Z' }));
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now });
    expect(summary.range.events).toBe(2);
    expect(summary.range.returningVisitors).toBe(0);
    expect(summary.coverage.status).toBe('partial');
    expect(summary.coverage.visitorClassification).toBe('observed-history-only');
    expect(summary.coverage.filesRead).toBe(2);
  });

  it('recognizes returning visitors across fully read archives', async () => {
    await writeFile(join(fixture.directory, 'events-before.ndjson'), line(old));
    await writeFile(join(fixture.directory, 'events.ndjson'), line(recent));
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now, days: 1 });
    expect(summary.range).toMatchObject({ events: 1, returningVisitors: 1 });
    expect(summary.coverage).toMatchObject({ retainedRead: 'complete', rangeObservedStart: recent.ts, observedStart: old.ts });
  });

  it.each([120000, 120001])('bounds a %i-event file and reports any event-cap omission', async (count) => {
    const compact = line({ ...recent, ts: '2026-09-06' });
    expect(Buffer.byteLength(compact) * count).toBeLessThan(16 * mib);
    await writeFile(join(fixture.directory, 'events.ndjson'), compact.repeat(count));
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now });
    expect(summary.range.events).toBe(120000);
    expect(summary.coverage.retainedRead).toBe(count === 120000 ? 'complete' : 'partial');
    if (count > 120000) expect(summary.coverage.reasons).toContain('event-limit');
  });

  it('reports unread archive history when the active log reaches the event limit', async () => {
    await writeFile(join(fixture.directory, 'events-before.ndjson'), line(old));
    await utimes(join(fixture.directory, 'events-before.ndjson'), new Date(), new Date(Date.now() - 60000));
    await writeFile(join(fixture.directory, 'events.ndjson'), line({ ...recent, ts: '2026-09-06' }).repeat(120000));
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now });
    expect(summary.coverage).toMatchObject({ retainedRead: 'partial', filesRead: 1, filesAvailable: 2 });
    expect(summary.coverage.reasons).toContain('event-limit');
  });

  it('does not call a read complete when rotation replaces the listed active log', async () => {
    await writeFile(join(fixture.directory, 'events.ndjson'), line(old));
    fixture.beforeOpen = async () => {
      await rename(join(fixture.directory, 'events.ndjson'), join(fixture.directory, 'events-rotated.ndjson'));
      await writeFile(join(fixture.directory, 'events.ndjson'), line(recent));
    };
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now });
    expect(summary.coverage.status).toBe('partial');
    expect(summary.coverage.reasons).toContain('files-changed-during-read');
    expect(summary.coverage.comparisonsAllowed).toBe(false);
  });

  it('rotates at 25 MiB, preserves old active events, and expires only old archive mtimes', async () => {
    const { recordAnalyticsEvent, summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const request = new Request('https://accessfreetools.com/api/analytics/events', { headers: { 'user-agent': 'Mozilla/5.0 Chrome/140' } });
    await writeFile(join(fixture.directory, 'events.ndjson'), line({ ...old, ts: '2025-01-01', day: '2025-01-01' }));
    await recordAnalyticsEvent({ pagePath: '/' }, request, '192.0.2.1');
    expect(await readFile(join(fixture.directory, 'events.ndjson'), 'utf8')).toContain('2025-01-01');
    await writeFile(join(fixture.directory, 'events-expired.ndjson'), line(old));
    const expired = new Date(Date.now() - 91 * 86400000);
    await utimes(join(fixture.directory, 'events-expired.ndjson'), expired, expired);
    await sizedLog('events.ndjson', 25 * mib);
    await recordAnalyticsEvent({ pagePath: '/tools/' }, request, '192.0.2.1');
    const files = await readdir(fixture.directory);
    expect(files).not.toContain('events-expired.ndjson');
    const archive = files.find((name) => name !== 'events.ndjson')!;
    expect((await stat(join(fixture.directory, archive))).size).toBe(25 * mib);
    expect((await summarizeAnalytics({ now: new Date() })).coverage.status).toBe('partial');
  });

  it('flags rotation after opening a real descriptor without duplicating its events', async () => {
    await writeFile(join(fixture.directory, 'events.ndjson'), line(old));
    fixture.afterOpen = async () => {
      await rename(join(fixture.directory, 'events.ndjson'), join(fixture.directory, 'events-rotated.ndjson'));
      await writeFile(join(fixture.directory, 'events.ndjson'), line(recent));
    };
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now });
    expect(summary.allTime.events).toBe(1);
    expect(summary.coverage.reasons).toContain('files-changed-during-read');
  });

  it('reports a short OS read instead of counting unread buffer bytes as coverage', async () => {
    await writeFile(join(fixture.directory, 'events.ndjson'), line(recent).repeat(2));
    fixture.shortRead = true;
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now });
    expect(summary.allTime.events).toBe(1);
    expect(summary.coverage.bytesRead).toBe(Buffer.byteLength(line(recent)));
    expect(summary.coverage.reasons).toContain('short-read');
  });

  it('returns unknown dates for an empty retained history instead of proving a 30-day zero', async () => {
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now });
    expect(summary.coverage).toMatchObject({ status: 'unknown', observedStart: null, observedEnd: null,
      rangeObservedStart: null, rangeObservedEnd: null, comparisonsAllowed: false });
  });

  it('caps files as well as bytes/events and identifies unread history', async () => {
    for (let index = 0; index < 33; index += 1) {
      await writeFile(join(fixture.directory, `events-${index}.ndjson`), line(recent));
    }
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now });
    expect(summary.range.events).toBe(32);
    expect(summary.coverage).toMatchObject({ status: 'partial', filesRead: 32, filesAvailable: 33,
      limits: { tailBytesPerFile: 16 * mib, events: 120000, files: 32 } });
    expect(summary.coverage.reasons).toContain('file-count-limit');
  });

  it('reports damaged records instead of silently certifying a complete read', async () => {
    await writeFile(join(fixture.directory, 'events.ndjson'), line(old) + '{broken\n' + line({ ...recent, ts: 'invalid' }) + line(recent));
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now });
    expect(summary.range.events).toBe(2);
    expect(summary.coverage.status).toBe('partial');
    expect(summary.coverage.reasons).toContain('invalid-event-records');
  });

  it('fails closed on an unreadable file without exposing its filesystem path', async () => {
    await writeFile(join(fixture.directory, 'events.ndjson'), line(recent));
    fixture.beforeOpen = async () => { throw new Error('synthetic I/O failure'); };
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now });
    expect(summary.coverage).toMatchObject({ status: 'partial', observedStart: null, observedEnd: null });
    expect(summary.coverage.reasons).toContain('file-read-failed');
    expect(JSON.stringify(summary)).not.toContain(fixture.directory);
  });

  it('never includes future records in the requested or observed interval', async () => {
    await writeFile(join(fixture.directory, 'events.ndjson'), line(recent) + line({ ...recent, ts: '2027-01-01T00:00:00.000Z' }));
    const { summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const summary = await summarizeAnalytics({ now });
    expect(summary.range.events).toBe(1);
    expect(summary.allTime.events).toBe(1);
    expect(summary.coverage.observedEnd).toBe(recent.ts);
  });

  it('excludes normalized private events on ingestion and in old logs, without owner configuration', async () => {
    const { recordAnalyticsEvent, summarizeAnalytics } = await import('../../src/lib/siteAnalytics');
    const request = new Request('https://accessfreetools.com/api/analytics/events', { headers: { 'user-agent': 'Mozilla/5.0 Chrome/140' } });
    for (const path of ['/admin', '/api?secret=1', '/mcp#x', '/private-analytics/', 'https://accessfreetools.com/private-analytics/?token=synthetic']) {
      expect(await recordAnalyticsEvent({ pagePath: path }, request, '192.0.2.1')).toMatchObject({ ignored: true, reason: 'bad-path' });
    }
    expect(await readdir(fixture.directory)).toEqual([]);
    expect(await recordAnalyticsEvent({ pagePath: '/tools/?q=synthetic#x' }, request, '192.0.2.1')).toMatchObject({ ignored: false });
    await writeFile(join(fixture.directory, 'events-legacy.ndjson'), line({ ...recent, pagePath: 'https://accessfreetools.com/admin/?token=synthetic' }));
    const summary = await summarizeAnalytics({ now: new Date() });
    expect(summary.ownerExclusionConfigured).toBe(false);
    expect(summary.allTime.events).toBe(1);
    expect(summary.topPages[0].path).toBe('/tools/');
    expect(JSON.stringify(summary)).not.toContain('synthetic');
  });
});
