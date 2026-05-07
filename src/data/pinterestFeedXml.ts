import { absoluteUrl, escapeXml } from './discovery';
import type { PinterestBoard, PinterestFeedItem } from './pinterestFeed';
import { PINTEREST_FEED_UPDATED } from './pinterestFeed';
import { SITE_ORIGIN, toRfc822Date } from './siteDates';

interface PinterestRssOptions {
  title: string;
  description: string;
  selfPath: string;
  linkPath: string;
  items: PinterestFeedItem[];
  board?: PinterestBoard;
}

function getImageContentType(imagePath: string) {
  return imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
}

export function renderPinterestRssFeed({
  title,
  description,
  selfPath,
  linkPath,
  items,
  board,
}: PinterestRssOptions) {
  const rssItems = items
    .map((item) => {
      const pageUrl = absoluteUrl(item.path);
      const imageUrl = absoluteUrl(item.imagePath);

      return `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${pageUrl}</link>
  <guid isPermaLink="true">${pageUrl}</guid>
  <description>${escapeXml(item.description)}</description>
  <category>${escapeXml(board?.title ?? item.category)}</category>
  <pubDate>${toRfc822Date(item.published)}</pubDate>
  <media:content url="${imageUrl}" medium="image" type="${getImageContentType(item.imagePath)}" width="1000" height="1500" />
</item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(title)}</title>
  <link>${absoluteUrl(linkPath)}</link>
  <atom:link href="${SITE_ORIGIN}${selfPath}" rel="self" type="application/rss+xml" />
  <description>${escapeXml(description)}</description>
  <language>en</language>
  <lastBuildDate>${toRfc822Date(PINTEREST_FEED_UPDATED)}</lastBuildDate>
  <ttl>1440</ttl>
  ${rssItems}
</channel>
</rss>`;
}
