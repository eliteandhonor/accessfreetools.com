import { describe, expect, it } from 'vitest';

import {
  analyzeFourInARowPilot,
  renderFourInARowPilotReport,
} from './four-in-a-row-pilot-report.mjs';

function event(action, sessionHash = 'session-1') {
  return {
    action,
    pagePath: '/tools/four-in-a-row-game/',
    sessionHash,
    toolSlug: 'four-in-a-row-game',
    ts: '2026-07-20T00:00:00.000Z',
    type: 'tool_action',
    visitorHash: 'visitor-1',
  };
}

describe('Four in a Row pilot report', () => {
  it.each([
    { date: '2026-09-08T00:00:00Z', starts: 100, owner: true, ready: true },
    { date: '2026-09-06T00:00:00Z', starts: 100, owner: true, ready: false },
    { date: '2026-09-08T00:00:00Z', starts: 99, owner: true, ready: false },
    { date: '2026-09-08T00:00:00Z', starts: 100, owner: false, ready: false },
  ])('retains date/sample/owner gates with a coherent supplied contract: %j', ({ date, starts, owner, ready }) => {
    // Synthetic admission contract only; the real producer never asserts verified continuity.
    const coverage = { status: 'complete', retainedRead: 'complete', reasons: [],
      deploymentContinuity: 'verified', comparisonsAllowed: true,
      requestedStart: '2026-07-13T00:00:00Z', requestedEnd: '2026-09-05T00:00:00Z',
      observedStart: '2026-07-13T00:00:00Z', observedEnd: '2026-09-05T00:00:00Z',
      rangeObservedStart: '2026-07-13T00:00:00Z', rangeObservedEnd: '2026-09-05T00:00:00Z' };
    const report = analyzeFourInARowPilot({ now: new Date(date), ownerExclusionConfigured: owner,
      aggregate: { coverage, actions: [{ action: 'Start round: computer (round-v2)', count: starts }],
        generatedAt: '2026-09-05T00:00:00Z', rangeStart: coverage.requestedStart,
        source: 'https://accessfreetools.com/api/analytics/events?days=90&tool=four-in-a-row-game',
        toolSlug: 'four-in-a-row-game' } });
    expect(report.measurementReady).toBe(ready);
  });

  it('counts only aggregate post-launch game milestones', () => {
    const report = analyzeFourInARowPilot({
      events: [
        event('Start round: computer'),
        event('Complete round'),
        event('Replay round'),
        event('Drop in column 2'),
        { ...event('Start round: friend'), ts: '2026-07-01T00:00:00.000Z' },
        { ...event('Start round: friend'), toolSlug: 'dice-roller', pagePath: '/tools/dice-roller/' },
      ],
      now: new Date('2026-07-21T00:00:00.000Z'),
      ownerExclusionConfigured: true,
    });

    expect(report.usage).toMatchObject({
      completions: 1,
      completionRatePercent: 100,
      computerStarts: 1,
      friendStarts: 0,
      replays: 1,
      starts: 1,
    });
    expect(report.status).toBe('collecting');
  });

  it('does not treat event counts, the review date and owner exclusion as interval coverage', () => {
    const events = Array.from({ length: 100 }, (_, index) => event('Start round: computer', `session-${index}`));
    const report = analyzeFourInARowPilot({
      events,
      now: new Date('2026-09-08T00:00:00.000Z'),
      ownerExclusionConfigured: true,
    });

    expect(report.measurementReady).toBe(false);
    expect(report.status).toBe('needs-more-evidence');
    expect(report.usage.starts).toBe(100);
    expect(report.coverage.status).toBe('unknown');
    expect(renderFourInARowPilotReport(report)).toContain('Do not add another game');
  });

  it.each([undefined, { status: 'unknown', reasons: [], comparisonsAllowed: false, deploymentContinuity: 'unknown' },
    { status: 'partial', retainedRead: 'partial', reasons: ['file-tail-limit'], comparisonsAllowed: false,
      deploymentContinuity: 'unknown', requestedStart: '2026-07-13T00:00:00Z', requestedEnd: '2026-09-08T00:00:00Z',
      observedStart: '2026-09-01T00:00:00Z', observedEnd: '2026-09-08T00:00:00Z' },
    { status: 'complete', retainedRead: 'partial', reasons: ['file-tail-limit'], comparisonsAllowed: true, deploymentContinuity: 'verified' },
  ])('blocks incomplete aggregate coverage despite enough starts: %j', (coverage) => {
    const report = analyzeFourInARowPilot({ now: new Date('2026-09-08T00:00:00Z'), ownerExclusionConfigured: true,
      aggregate: { coverage, actions: [{ action: 'Start round: computer', count: 100 }], audience: { visitors: 30 } } });
    expect(report.measurementReady).toBe(false);
    expect(report.usage.starts).toBe(100);
    expect(report.readinessIssues.join(' ')).toMatch(/coverage/i);
    const rendered = renderFourInARowPilotReport(report);
    expect(rendered).toContain('Retained observations');
    if (coverage?.observedStart) {
      expect(report.coverage.observedStart).toBe(coverage.observedStart);
      expect(rendered).toContain(coverage.observedStart);
      expect(rendered).toContain(coverage.requestedStart);
      expect(rendered).toContain('file-tail-limit');
    }
  });
});
