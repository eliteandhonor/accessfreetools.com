import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { sanitizeAnalyticsPath } from '../../src/lib/siteAnalytics';

const layout = readFileSync(new URL('../../src/components/BaseLayout.astro', import.meta.url), 'utf8');
const tracker = [...layout.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .find((match) => match[1].includes('const analyticsHosts'))![1];
const privatePaths = ['/admin', '/admin/', '/admin/analytics/?token=synthetic#x', '/api', '/api/v1/run/',
  '/mcp', '/mcp/', '/private-analytics', '/private-analytics/?token=synthetic#x',
  '/%61dmin/analytics/', '/tools/../admin/', '/ADMIN/', '/api%2Fv1/run/', '/%2561dmin/',
  '//admin/analytics/', '///private-analytics/', '/\\api/v1/run/', '//%61dmin/', '//tools/../api/'];

function clientEvents(path: string) {
  const events: string[] = [];
  const storage = { getItem: () => null, setItem: () => {} };
  runInNewContext(tracker, {
    URL, Blob, location: { hostname: 'accessfreetools.com', pathname: path },
    window: { localStorage: storage, sessionStorage: storage },
    navigator: { language: 'en', sendBeacon: (_url: string, body: Blob) => { events.push(String(body.size)); return true; } },
    document: { title: 'Fixture', referrer: '', addEventListener: () => {} },
  });
  return events;
}

describe('first-party private path boundary', () => {
  it('preserves explicit public URL forms without dropping the requested path', () => {
    for (const url of ['https://accessfreetools.com/tools/', '//accessfreetools.com/tools/', '//example.com/tools/']) {
      expect(sanitizeAnalyticsPath(url)).toBe('/tools/');
    }
  });
  it.each(privatePaths)('excludes %s client-side with no stored owner preference', (path) => {
    expect(clientEvents(path)).toEqual([]);
  });
  it.each(privatePaths.flatMap((path) => [path, `https://accessfreetools.com${path}`, `//accessfreetools.com${path}`]))('excludes normalized server payload %s', (path) => {
    expect(sanitizeAnalyticsPath(path)).toBe('');
  });
  it.each(['/tools/', '/apiary/', '/administrator/', '/mcp-guide/', '/private-analytics-guide/'])('preserves public path %s', (path) => {
    expect(sanitizeAnalyticsPath(`${path}?q=secret#x`)).toBe(path);
    expect(clientEvents(path)).toHaveLength(1);
  });
});
