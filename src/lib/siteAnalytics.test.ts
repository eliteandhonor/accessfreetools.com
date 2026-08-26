import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';

import {
  resolveAnalyticsDirectory,
  summarizeAnalyticsRange,
  summarizeSelectedToolAnalytics,
  type StoredAnalyticsEvent,
} from './siteAnalytics';

function event(overrides: Partial<StoredAnalyticsEvent>): StoredAnalyticsEvent {
  return {
    browser: 'Chrome',
    day: '2026-07-20',
    device: 'desktop',
    eventId: 'event-1',
    ipHash: 'ip',
    os: 'Windows',
    pagePath: '/tools/four-in-a-row-game/',
    sessionHash: 'session-1',
    ts: '2026-07-20T00:00:00.000Z',
    type: 'page_view',
    visitorHash: 'visitor-1',
    ...overrides,
  };
}

describe('selected tool analytics summary', () => {
  it('returns aggregate action and audience counts without raw event details', () => {
    const summary = summarizeSelectedToolAnalytics([
      event({}),
      event({ action: 'Start round: computer', eventId: 'event-2', toolSlug: 'four-in-a-row-game', type: 'tool_action' }),
      event({ action: 'Complete round', eventId: 'event-3', toolSlug: 'four-in-a-row-game', type: 'tool_action' }),
      event({
        action: 'Start round: friend',
        eventId: 'event-4',
        sessionHash: 'session-2',
        toolSlug: 'four-in-a-row-game',
        type: 'tool_action',
        visitorHash: 'visitor-2',
      }),
      event({ action: 'Roll dice', eventId: 'event-5', pagePath: '/tools/dice-roller/', toolSlug: 'dice-roller', type: 'tool_action' }),
    ], 'four-in-a-row-game');

    expect(summary.actions).toEqual([
      { action: 'Complete round', count: 1, slug: 'four-in-a-row-game' },
      { action: 'Start round: computer', count: 1, slug: 'four-in-a-row-game' },
      { action: 'Start round: friend', count: 1, slug: 'four-in-a-row-game' },
    ]);
    expect(summary.audience).toEqual({
      pageViews: 1,
      sessions: 2,
      slug: 'four-in-a-row-game',
      visitors: 2,
    });
    expect(JSON.stringify(summary)).not.toContain('ipHash');
    expect(JSON.stringify(summary)).not.toContain('visitorHash');
  });

  it('returns no selected audience when no tool is requested', () => {
    expect(summarizeSelectedToolAnalytics([], '')).toEqual({ actions: [], audience: null });
  });
});

describe('analytics range summary', () => {
  it('returns privacy-safe totals for the requested production window', () => {
    const allEvents = [
      event({ day: '2026-07-18', ts: '2026-07-18T00:00:00.000Z' }),
      event({ eventId: 'event-2', sessionHash: 'session-2', visitorHash: 'visitor-2' }),
      event({
        action: 'Start round: computer',
        eventId: 'event-3',
        toolSlug: 'four-in-a-row-game',
        type: 'tool_action',
      }),
    ];

    const summary = summarizeAnalyticsRange(allEvents.slice(1), allEvents);

    expect(summary).toEqual({
      events: 2,
      pageViews: 1,
      returningVisitors: 1,
      toolActions: 1,
      visitors: 2,
    });
    expect(JSON.stringify(summary)).not.toContain('visitorHash');
    expect(JSON.stringify(summary)).not.toContain('sessionHash');
  });
});

describe('analytics storage directory', () => {
  it('uses an explicit directory when one is configured', () => {
    expect(resolveAnalyticsDirectory({
      configuredDir: 'persistent/analytics',
      cwd: 'C:/site',
      homeConfigExists: true,
      homeDir: 'C:/Users/owner',
    })).toBe(resolve('C:/site', 'persistent/analytics'));
  });

  it('uses durable home storage when the home-level analytics config exists', () => {
    expect(resolveAnalyticsDirectory({
      cwd: 'C:/site',
      homeConfigExists: true,
      homeDir: 'C:/Users/owner',
    })).toBe(resolve('C:/Users/owner', '.local/accessfreetools-analytics'));
  });

  it('preserves the repo-local path for local development without a home config', () => {
    expect(resolveAnalyticsDirectory({
      cwd: 'C:/site',
      homeConfigExists: false,
      homeDir: 'C:/Users/owner',
    })).toBe(resolve('C:/site', '.local/analytics'));
  });
});
