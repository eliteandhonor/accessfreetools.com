import { describe, expect, it } from 'vitest';

import { renderPinterestRssFeed, toPinterestRfc822Date } from './pinterestFeedXml';

describe('Pinterest RSS dates', () => {
  it('uses midnight UTC for date-only publication values', () => {
    expect(toPinterestRfc822Date('2026-07-17')).toBe('Fri, 17 Jul 2026 00:00:00 GMT');
  });

  it('does not publish date-only feed items hours into the future', () => {
    const feed = renderPinterestRssFeed({
      title: 'Pinterest test feed',
      description: 'Test feed',
      selfPath: '/pinterest/test.xml',
      linkPath: '/tools/',
      items: [
        {
          title: 'Test Calculator',
          description: 'A test calculator Pin.',
          path: '/tools/test-calculator/',
          imagePath: '/pinterest/apps/test-calculator.jpg',
          category: 'Free Online Calculators',
          boardSlug: 'free-online-calculators',
          status: 'rss-ready',
          rssEligible: true,
          published: '2026-07-17',
        },
      ],
    });

    expect(feed).toContain('<lastBuildDate>Fri, 17 Jul 2026 00:00:00 GMT</lastBuildDate>');
    expect(feed).toContain('<pubDate>Fri, 17 Jul 2026 00:00:00 GMT</pubDate>');
    expect(feed).not.toContain('12:00:00 GMT');
  });
});
