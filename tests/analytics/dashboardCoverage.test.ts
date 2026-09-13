import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

const dashboard = readFileSync(new URL('../../src/pages/admin/analytics.astro', import.meta.url), 'utf8');
const script = dashboard.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)![1];
const partial = { status: 'partial', reasons: ['file-tail-limit', 'deployment-continuity-unverified'],
  requestedStart: '2026-08-07T12:00:00.000Z', requestedEnd: '2026-09-06T12:00:00.000Z',
  observedStart: '2026-09-04T00:00:00.000Z', observedEnd: '2026-09-06T01:00:00.000Z',
  rangeObservedStart: '2026-09-04T00:00:00.000Z', rangeObservedEnd: '2026-09-06T01:00:00.000Z' };

describe('actual dashboard coverage renderer', () => {
  it.each([partial, { ...partial, status: 'unknown', reasons: ['deployment-continuity-unverified'] }, undefined])('shows partial/unknown coverage and dates, including legacy responses (%j)', async (coverage) => {
    const handlers = new Map<string, (event: { preventDefault: () => void }) => void>();
    const input = { value: 'synthetic-token' };
    const elements = new Map<string, { textContent: string; innerHTML: string; hidden: boolean;
      querySelector: () => typeof input; addEventListener: (type: string, handler: (event: { preventDefault: () => void }) => void) => void }>();
    const element = (selector: string) => {
      if (!elements.has(selector)) elements.set(selector, { textContent: '', innerHTML: '', hidden: false,
        querySelector: () => input, addEventListener: (type, handler) => { handlers.set(`${selector}:${type}`, handler); } });
      return elements.get(selector)!;
    };
    runInNewContext(script, {
      optOutKey: 'fixture',
      document: { querySelector: element, querySelectorAll: () => [] },
      AbortController,
      window: { addEventListener: () => {}, sessionStorage: { removeItem: () => {} },
        localStorage: { getItem: () => null, removeItem: () => {} } },
      fetch: async () => ({ ok: true, json: async () => ({ summary: { days: 30, coverage, generatedAt: '2026-09-06T12:00:00.000Z', today: { visitors: 2 } } }) }),
    });
    input.value = 'synthetic-token';
    handlers.get('[data-analytics-token-form]:submit')!({ preventDefault: () => {} });
    await vi.waitFor(() => expect(element('[data-generated-at]').textContent).toContain('Generated'));
    expect(element('[data-analytics-coverage]').textContent).toContain(coverage?.status === 'partial' ? 'Partial coverage' : 'Unknown coverage');
    expect(element('[data-analytics-coverage]').textContent).toContain('Comparisons are blocked');
    expect(element('[data-analytics-coverage-dates]').textContent).toContain('Requested');
    expect(element('[data-analytics-coverage-dates]').textContent).toContain(coverage ? '2026-09-04' : 'unknown');
    expect(element('[data-analytics-coverage-reasons]').textContent).toContain(coverage ? 'deployment-continuity-unverified' : 'coverage-metadata-missing');
    expect(element('[data-metric="todayVisitors"]').textContent).toBe('2');
    expect(dashboard).toContain('first seen in this read');
  });
});
