import { describe, expect, it, vi } from 'vitest';

import { AFT_TOOL_ACTION_EVENT, emitAftToolAction } from './aftToolAnalytics';

describe('tool analytics event bridge', () => {
  it('dispatches aggregate tool milestones without move-level data', () => {
    const dispatchedEvents: Event[] = [];
    const dispatchEvent = vi.fn((event: Event) => {
      dispatchedEvents.push(event);
      return true;
    });
    const detail = {
      action: 'Complete round',
      category: 'everyday-tools',
      clarityEvent: 'four_in_a_row_complete',
      toolName: 'Four in a Row Game',
      toolSlug: 'four-in-a-row-game',
    };

    expect(emitAftToolAction(detail, { dispatchEvent })).toBe(true);
    const event = dispatchedEvents[0] as CustomEvent;
    expect(event.type).toBe(AFT_TOOL_ACTION_EVENT);
    expect(event.detail).toEqual(detail);
    expect(Object.keys(event.detail).sort()).toEqual([
      'action',
      'category',
      'clarityEvent',
      'toolName',
      'toolSlug',
    ]);
  });

  it('does nothing when rendered without a browser document', () => {
    expect(emitAftToolAction({
      action: 'Start round: computer',
      category: 'everyday-tools',
      toolName: 'Four in a Row Game',
      toolSlug: 'four-in-a-row-game',
    }, null)).toBe(false);
  });
});
