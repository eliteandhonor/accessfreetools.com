import { describe, expect, it } from 'vitest';
import { statSync } from 'node:fs';

import { renderPinterestRssFeed, toPinterestRfc822Date } from './pinterestFeedXml';

describe('Pinterest RSS dates', () => {
  it('uses midnight UTC for date-only publication values', () => {
    expect(toPinterestRfc822Date('2026-07-17')).toBe('Fri, 17 Jul 2026 00:00:00 GMT');
  });

  it('does not publish date-only feed items hours into the future', () => {
    const imagePath = '/pinterest/apps/json-to-csv-converter.jpg';
    const imageBytes = statSync(new URL(`../../public${imagePath}`, import.meta.url)).size;
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
          imagePath,
          category: 'Free Online Calculators',
          boardSlug: 'free-online-calculators',
          status: 'rss-ready',
          rssEligible: true,
          published: '2026-07-17',
        },
      ],
    });

    expect(feed).toContain('<lastBuildDate>Sat, 08 Aug 2026 00:00:00 GMT</lastBuildDate>');
    expect(feed).toContain('<pubDate>Fri, 17 Jul 2026 00:00:00 GMT</pubDate>');
    expect(feed).not.toContain('12:00:00 GMT');
    expect(feed).toContain(
      `<enclosure url="https://accessfreetools.com${imagePath}" length="${imageBytes}" type="image/jpeg" />`,
    );
    expect(feed).toContain(
      `<media:content url="https://accessfreetools.com${imagePath}" medium="image" type="image/jpeg" fileSize="${imageBytes}" width="1000" height="1500" />`,
    );
  });
});
