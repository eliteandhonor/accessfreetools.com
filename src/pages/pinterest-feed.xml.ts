export const prerender = true;
import type { APIRoute } from 'astro';
import { absoluteUrl, escapeXml } from '../data/discovery';
import { pinterestFeedItems, PINTEREST_FEED_UPDATED } from '../data/pinterestFeed';
import { SITE_ORIGIN, toRfc822Date } from '../data/siteDates';

export const GET: APIRoute = () => {
  const items = pinterestFeedItems
    .map((item) => {
      const pageUrl = absoluteUrl(item.path);
      const imageUrl = absoluteUrl(item.imagePath);

      return `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${pageUrl}</link>
  <guid isPermaLink="true">${pageUrl}</guid>
  <description>${escapeXml(item.description)}</description>
  <category>${escapeXml(item.category)}</category>
  <pubDate>${toRfc822Date(item.published)}</pubDate>
  <media:content url="${imageUrl}" medium="image" type="image/png" width="1000" height="1500" />
</item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Access Free Tools Pinterest Pins</title>
  <link>${SITE_ORIGIN}/tools/</link>
  <atom:link href="${SITE_ORIGIN}/pinterest-feed.xml" rel="self" type="application/rss+xml" />
  <description>Pinterest-ready Access Free Tools calculators, browser utilities, and practical guide hubs with dedicated Pin images.</description>
  <language>en</language>
  <lastBuildDate>${toRfc822Date(PINTEREST_FEED_UPDATED)}</lastBuildDate>
  <ttl>1440</ttl>
  ${items}
</channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
