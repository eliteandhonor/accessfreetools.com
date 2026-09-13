import { describe, expect, it } from 'vitest';

import {
  activePromotionChannels,
  activePromotionReviewSteps,
  filterActivePromotionRows,
  isActivePromotionChannel,
  promotionChannelFor,
  assertPublicPromotionChannel,
} from './promotion-channel-policy.mjs';

describe('four-channel promotion policy', () => {
  it('keeps exactly the owner-approved active channels', () => {
    expect(activePromotionChannels.map((channel) => channel.id)).toEqual([
      'site-blog',
      'medium',
      'bluesky',
      'pinterest',
    ]);
  });

  it('blocks retired, blocked, unverified, and unknown channels', () => {
    expect(isActivePromotionChannel('Quora')).toBe(false);
    expect(isActivePromotionChannel('Reddit')).toBe(false);
    expect(isActivePromotionChannel('LinkedIn Articles')).toBe(false);
    expect(isActivePromotionChannel('Flipboard')).toBe(false);
    expect(isActivePromotionChannel('DEV Community')).toBe(false);
    expect(isActivePromotionChannel('Unknown Network')).toBe(false);
  });

  it('recognizes the four active channel labels and aliases', () => {
    expect(promotionChannelFor('Access Free Tools blog')?.id).toBe('site-blog');
    expect(promotionChannelFor('Medium companion')?.id).toBe('medium');
    expect(promotionChannelFor('Blue Sky')?.id).toBe('bluesky');
    expect(promotionChannelFor('Pinterest organic')?.id).toBe('pinterest');
  });

  it('filters inactive queue rows before recommendations', () => {
    const rows = [
      { channel: 'Medium', page: '/one/' },
      { channel: 'Quora', page: '/two/' },
      { channel: 'Pinterest', page: '/three/' },
      { channel: 'Reddit', page: '/four/' },
    ];
    expect(filterActivePromotionRows(rows).map((row) => row.page)).toEqual(['/one/', '/three/']);
  });

  it.each(['Medium, Quora', 'Pinterest, Medium', 'Medium/Reddit', 'Unknown Medium Network', 'notmedium'])('rejects ambiguous or unknown label %s', (channel) => {
    expect(promotionChannelFor(channel)).toBeNull();
    expect(isActivePromotionChannel(channel)).toBe(false);
    expect(() => assertPublicPromotionChannel(channel)).toThrow('Public actions are disabled');
  });

  it('runs quality checks only for active channels', () => {
    const steps = activePromotionReviewSteps();
    expect(new Set(steps.map((step) => step.channelId))).toEqual(
      new Set(['site-blog', 'medium', 'bluesky', 'pinterest']),
    );
    expect(steps.map((step) => step.script).join(' ')).not.toMatch(/reddit|quora|devto|linkedin|flipboard/i);
  });

  it.each(['Medium, \u672a\u77e5', 'Medium / ???', ['Medium', null], null, undefined, {}, 42].map((channel) => ({ channel })))('rejects non-string and lossy mixed values $channel', ({ channel }) => {
    expect(promotionChannelFor(channel)).toBeNull();
    expect(filterActivePromotionRows([{ channel, status: 'approved' }])).toEqual([]);
    expect(() => assertPublicPromotionChannel(channel)).toThrow('Public actions are disabled');
  });

  it.each([' Medium ', 'MEDIUM.COM', '  Medium   companion  ', 'site-blog', 'Blue\tSky'])('keeps deliberate case and whitespace aliases %s', (channel) => {
    expect(isActivePromotionChannel(channel)).toBe(true);
  });
});
