import { describe, expect, it } from 'vitest';
import { analyzeFourInARowPilot, renderFourInARowPilotReport, isGameOwnerExclusionConfirmed } from './four-in-a-row-pilot-report.mjs';

const now = new Date('2026-09-08T12:00:00.000Z');
const actions = (starts = 100, completions = 50, replays = 20) => [
  { action: 'Start round: computer (round-v2)', count: starts },
  { action: 'Complete round (round-v2)', count: completions },
  { action: 'Replay round (round-v2)', count: replays },
];
const aggregate = (extra = {}) => ({
  generatedAt: '2026-09-08T11:00:00.000Z', fetchedAt: '2026-09-08T11:01:00.000Z',
  source: 'https://accessfreetools.com/api/analytics/events?days=90&tool=four-in-a-row-game',
  toolSlug: 'four-in-a-row-game', rangeStart: '2026-06-10T11:00:00.000Z',
  coverage: { status: 'complete', retainedRead: 'complete', reasons: [], comparisonsAllowed: true, deploymentContinuity: 'verified',
    requestedStart: '2026-06-10T11:00:00.000Z', requestedEnd: '2026-09-08T11:00:00.000Z',
    observedStart: '2026-06-10T11:00:00.000Z', observedEnd: '2026-09-08T11:00:00.000Z',
    rangeObservedStart: '2026-06-10T11:00:00.000Z', rangeObservedEnd: '2026-09-08T11:00:00.000Z' },
  actions: actions(), audience: { slug: 'four-in-a-row-game', visitors: 30 }, ...extra,
});
const analyze = (input = aggregate()) => analyzeFourInARowPilot({ now, aggregate: input, ownerExclusionConfigured: true });

describe('game evidence definition and admission', () => {
  it('admits only fresh, scoped, complete production evidence for corrected event counts', () => {
    const report = analyze();
    expect(report.measurementReady).toBe(true);
    expect(report.usage).toMatchObject({ starts: 100, completions: 50, replays: 20, completionRatePercent: 50 });
    expect(report.eventDefinition).toBe('round-v2');
    expect(report.evidence).toMatchObject({ status: 'fresh', generatedAt: '2026-09-08T11:00:00.000Z',
      requestedStart: '2026-06-10T11:00:00.000Z', requestedEnd: '2026-09-08T11:00:00.000Z' });
  });

  it.each([undefined, '', 'invalid', '2026-09-09T00:00:00.000Z', '2026-09-01T11:59:59.999Z', '2026-07-01T00:00:00.000Z'])(
    'never refreshes original observation %s from fetchedAt or report generation', (generatedAt) => {
      const report = analyze(aggregate({ generatedAt }));
      expect(report.measurementReady).toBe(false);
      expect(report.readinessIssues.join(' ')).toMatch(/observation|evidence|window/i);
    });

  it.each([
    { source: undefined }, { source: 'file:///local/events' }, { source: 'https://example.com/api/analytics/events?tool=four-in-a-row-game' },
    { source: 'https://accessfreetools.com/api/analytics/events?tool=dice-roller' },
    { toolSlug: 'dice-roller' }, { audience: { slug: 'dice-roller', visitors: 30 } },
    { actions: [{ ...actions()[0], slug: 'dice-roller' }] },
  ])('rejects wrong or missing production target provenance %j', (overrides) => {
    const report = analyze(aggregate(overrides));
    expect(report.measurementReady).toBe(false);
    expect(report.readinessIssues.join(' ')).toMatch(/source|target|production/i);
  });

  it.each([
    { rangeStart: '2026-09-09T00:00:00Z' },
    { coverage: { ...aggregate().coverage, requestedEnd: '2026-09-08T11:01:00.000Z' } },
    { coverage: { ...aggregate().coverage, requestedStart: '2026-06-11T11:00:00.000Z' } },
    { coverage: { ...aggregate().coverage, requestedEnd: '2026-07-01T00:00:00.000Z' } },
  ])('rejects contradictory measured windows %j', (overrides) => {
    expect(analyze(aggregate(overrides)).measurementReady).toBe(false);
  });

  it('preserves old definitions as historical counts, never corrected pilot starts', () => {
    const old = [{ action: 'Start round: computer', count: 150 }, { action: 'Complete round', count: 100 }];
    const report = analyze(aggregate({ actions: old }));
    expect(report.usage.starts).toBe(150);
    expect(report.eventDefinition).toBe('legacy');
    expect(report.measurementReady).toBe(false);
    expect(report.readinessIssues.join(' ')).toMatch(/definition|legacy/i);
    const mixed = analyze(aggregate({ actions: [...old, ...actions(99)] }));
    expect(mixed.usage.starts).toBe(99);
    expect(mixed.legacyUsage.starts).toBe(150);
    expect(mixed.measurementReady).toBe(false);
  });

  it.each([-1, 1.5, NaN, Infinity, '100', Number.MAX_SAFE_INTEGER + 1])('invalid count %s cannot become a decision or a misleading rate', (count) => {
    const report = analyze(aggregate({ actions: actions(count) }));
    expect(report.measurementReady).toBe(false);
    expect(report.usage.completionRatePercent).toBeNull();
    expect(report.readinessIssues.join(' ')).toMatch(/count/i);
    expect(renderFourInARowPilotReport(report)).not.toMatch(/NaN|Infinity|150%/);
  });

  it.each([null, undefined])('does not silently turn an explicit missing count %s into zero', (count) => {
    const entries = actions(); entries[1].count = count;
    const report = analyze(aggregate({ actions: entries }));
    expect(report.usage.completions).toBeNull();
    expect(report.readinessIssues.join(' ')).toMatch(/count/i);
  });

  it.each([
    actions(100, 150, 0), actions(100, 0, 1), actions(100, 50, 51),
    [...actions(), { action: 'Start round: computer (round-v2)', count: 100 }],
    [{ action: 'Start round: computer (round-v2)', count: Number.MAX_SAFE_INTEGER },
      { action: 'Start round: friend (round-v2)', count: 1 }],
  ])('blocks impossible or duplicate aggregates %j', (entries) => {
    const report = analyze(aggregate({ actions: entries }));
    expect(report.measurementReady).toBe(false);
    expect(report.readinessIssues.join(' ')).toMatch(/count|rate|duplicate/i);
  });

  it('ignores future event rows and never accepts local event logs as production readiness', () => {
    const event = { ts: '2026-09-08T10:00:00Z', type: 'tool_action', pagePath: '/tools/four-in-a-row-game/',
      toolSlug: 'four-in-a-row-game', action: 'Start round: friend (round-v2)' };
    const report = analyzeFourInARowPilot({ now, ownerExclusionConfigured: true,
      events: [event, { ...event, ts: '2026-09-09T00:00:00Z' }] });
    expect(report.usage.starts).toBe(1);
    expect(report.measurementReady).toBe(false);
  });

  it('accepts production owner configuration or a fresh verified browser opt-out, not stale local assumptions', () => {
    const proof = { host: 'accessfreetools.com', storageKey: 'access-free-tools-analytics-opt-out', value: 'true', verifiedAt: '2026-09-08T11:00:00Z' };
    expect(isGameOwnerExclusionConfirmed({ ownerExclusionConfigured: true }, null, now)).toBe(true);
    expect(isGameOwnerExclusionConfirmed({}, proof, now)).toBe(true);
    for (const change of [{ verifiedAt: '2026-08-01T00:00:00Z' }, { verifiedAt: '2026-09-09T00:00:00Z' },
      { verifiedAt: null }, { value: 'false' }, { host: 'localhost' }]) {
      expect(isGameOwnerExclusionConfirmed({}, { ...proof, ...change }, now)).toBe(false);
    }
    expect(isGameOwnerExclusionConfirmed({ ownerExclusionConfigured: 'true' }, null, now)).toBe(false);
  });
});
