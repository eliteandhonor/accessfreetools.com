import { describe, expect, it } from 'vitest';
import { getIndexationPolicy } from '../../src/data/indexationPolicy';
import { readExplicitIndexationPolicies } from './indexation-policy-source.mjs';
import { createIndexingClassifier, needsIndexingAttention, newerPassForRecovery } from './indexing-classification.mjs';

const classify = createIndexingClassifier();

describe('indexing policy classification', () => {
  it.each([...readExplicitIndexationPolicies().keys()])('matches the source policy for %s and URL forms', (path) => {
    for (const url of [path, path.replace(/\/$/, ''), `https://accessfreetools.com${path}?test=1#fragment`]) {
      expect(getIndexationPolicy(url).index).toBe(false);
      expect(classify({ url, verdict: 'PASS' })).toBe('excluded');
      expect(classify({ url, coverageState: 'Discovered - currently not indexed', expiresAt: '2000-01-01' })).toBe('excluded');
    }
  });

  it.each(['PASS', 'pass', ' Pass '])('success verdict %s is independent of coverage wording and age', (verdict) => {
    for (const coverageState of ['Submitted and indexed', 'Indexed, not submitted in sitemap', 'Crawled - currently not indexed', '', 'Excluded by noindex tag']) {
      expect(classify({ url: '/tools/kawaii-emoji-generator/', verdict, coverageState, status: 'not enough data' })).toBe('indexed');
    }
  });

  it.each(['FAIL', 'NEUTRAL'])('unexpected noindex remains a failure with %s', (verdict) => {
    expect(classify({ path: '/tools/percentage-calculator/', coverageState: 'Excluded by noindex tag', verdict })).toBe('failure');
  });

  it('does not confuse foreign origins or lookalike paths with intentional exclusions', () => {
    for (const url of ['https://example.com/support/', '/supportive/', '/tools/text-to-speech-audiobook-generator-other/']) {
      expect(classify({ url, coverageState: 'Excluded by noindex tag' })).toBe('failure');
    }
  });

  it('distinguishes missing evidence, redirects and actual discovery gaps', () => {
    expect(classify({ url: '/a/', error: 'unavailable' })).toBe('unavailable');
    expect(classify({ url: '/a/', coverageState: 'Page with redirect', verdict: 'NEUTRAL' })).toBe('monitor');
    expect(classify({ url: '/a/', coverageState: 'URL is unknown to Google' })).toBe('recovery');
    for (const decision of ['excluded', 'indexed', 'monitor']) expect(needsIndexingAttention(decision)).toBe(false);
    for (const decision of ['failure', 'recovery', 'unavailable']) expect(needsIndexingAttention(decision)).toBe(true);
  });

  it.each(['BLOCKED_BY_META_TAG', 'BLOCKED_BY_HTTP_HEADER'])('keeps explicit %s independent of coverage prose, but not of evidence trust', (indexingState) => {
    const row = { url: '/tools/percentage-calculator/', coverageState: '', indexingState };
    expect(classify(row)).toBe('failure');
    expect(classify({ ...row, status: 'not enough data' })).toBe('unavailable');
    expect(classify({ ...row, error: 'synthetic failure' })).toBe('unavailable');
    expect(classify({ ...row, verdict: 'PASS' })).toBe('indexed');
    expect(classify({ ...row, url: '/support/' })).toBe('excluded');
  });
});

describe('newer exact PASS versus recovery chronology', () => {
  const path = '/tools/percentage-calculator/';
  const pass = { url: `https://accessfreetools.com${path}`, verdict: ' PASS ', sourceFreshness: 'fresh',
    sourceGeneratedAt: '2026-09-05T00:00:00.000Z', sourcePath: 'original.json' };

  it('preserves original proof for a strictly newer PASS and rejects equal-date guesses', () => {
    expect(newerPassForRecovery({ path }, { generatedAt: '2026-09-04T00:00:00.000Z' }, [pass])).toEqual({
      sourceGeneratedAt: pass.sourceGeneratedAt, sourcePath: pass.sourcePath, recoveryObservedAt: '2026-09-04T00:00:00.000Z',
    });
    expect(newerPassForRecovery({ path }, { generatedAt: pass.sourceGeneratedAt }, [pass])).toBeNull();
  });

  it('does not borrow a report date for an explicitly undated recovery row', () => {
    expect(newerPassForRecovery({ path, sourceGeneratedAt: null }, { generatedAt: '2026-07-01T00:00:00.000Z' }, [pass])).toBeNull();
  });

  it('requires PASS after the entire Brisbane data day, not merely after its start', () => {
    const report = { generatedAt: '2026-09-06T00:00:00.000Z', source: { dataDate: '2026-09-05' } };
    expect(newerPassForRecovery({ path }, report, [pass])).toBeNull();
    expect(newerPassForRecovery({ path }, report, [{ ...pass, sourceGeneratedAt: '2026-09-05T14:00:00.000Z' }]))
      .toMatchObject({ recoveryObservedAt: '2026-09-05T13:59:59.999Z' });
  });
});
