import { describe, expect, it } from 'vitest';
import { summarizeRouteResources } from './route-cost-report.mjs';

describe('route-cost resource accounting', () => {
  const origin = 'http://127.0.0.1:1234';
  it('separates transferred, encoded and decoded bytes, including zero-transfer cached assets', () => {
    const report = summarizeRouteResources([
      { name: `${origin}/tools/`, initiatorType: 'navigation', transferSize: 1300, encodedBodySize: 1000, decodedBodySize: 4000 },
      { name: `${origin}/_astro/style.css?private=never-retain`, initiatorType: 'link', transferSize: 0, encodedBodySize: 500, decodedBodySize: 2000 },
    ], origin);
    expect(report).toMatchObject({ completedEntries: 2, transferBytes: 1300, encodedBodyBytes: 1500, decodedBodyBytes: 6000,
      zeroTransferBodyEntries: 1, invalidEntries: 0 });
    expect(report.resources.map(row => row.path)).toEqual(['/tools/', '/_astro/style.css']);
    expect(JSON.stringify(report)).not.toContain('private=');
  });
  it('does not turn incomplete or invalid timing data into proof of zero cost', () => {
    const report = summarizeRouteResources([
      { name: `${origin}/missing.js`, transferSize: null, encodedBodySize: 20, decodedBodySize: 20 },
      { name: `${origin}/invalid.js`, transferSize: -1, encodedBodySize: 20, decodedBodySize: 20 },
    ], origin);
    expect(report.invalidEntries).toBe(2);
    expect(report.transferBytes).toBeNull();
  });
  it('redacts off-origin locations and never calls a zero-sized blocked request cached', () => {
    const report = summarizeRouteResources([{ name: 'https://secret.invalid/path?token=private',
      transferSize: 0, encodedBodySize: 0, decodedBodySize: 0 }], origin);
    expect(report.zeroTransferBodyEntries).toBe(0);
    expect(report.externalEntries).toBe(1);
    expect(JSON.stringify(report)).not.toMatch(/secret|token|private/);
  });
});
