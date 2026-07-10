import { describe, expect, it } from 'vitest';

import { sanitizeAnalyticsPath } from '../../src/lib/siteAnalytics';

describe('analytics path privacy', () => {
  it('keeps page paths while dropping query values and fragments', () => {
    expect(sanitizeAnalyticsPath('/tools/?q=private-search#results')).toBe('/tools/');
    expect(sanitizeAnalyticsPath('https://accessfreetools.com/blog/?email=person@example.com')).toBe('/blog/');
  });

  it('rejects internal and malformed analytics paths', () => {
    expect(sanitizeAnalyticsPath('/api/admin?token=secret')).toBe('');
    expect(sanitizeAnalyticsPath('/admin/analytics/?token=secret')).toBe('');
    expect(sanitizeAnalyticsPath('not-a-path')).toBe('');
  });
});
