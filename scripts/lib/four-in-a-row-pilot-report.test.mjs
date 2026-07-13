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

  it('requires the review date, sample, and owner exclusion before a decision', () => {
    const events = Array.from({ length: 100 }, (_, index) => event('Start round: computer', `session-${index}`));
    const report = analyzeFourInARowPilot({
      events,
      now: new Date('2026-09-08T00:00:00.000Z'),
      ownerExclusionConfigured: true,
    });

    expect(report.measurementReady).toBe(true);
    expect(report.status).toBe('ready-for-pilot-decision');
    expect(renderFourInARowPilotReport(report)).toContain('Do not add another game');
  });
});
