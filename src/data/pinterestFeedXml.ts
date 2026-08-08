import { statSync } from 'node:fs';
import { resolve, sep } from 'node:path';

import { absoluteUrl, escapeXml } from './discovery';
import type { PinterestBoard, PinterestFeedItem } from './pinterestFeed';
import { PINTEREST_FEED_UPDATED } from './pinterestFeed';
import { SITE_ORIGIN } from './siteDates';

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

const publicAssetRoot = resolve('public');

function getImageByteLength(imagePath: string) {
  const relativePath = imagePath.replace(/^\/+/, '');
  const assetPath = resolve(publicAssetRoot, relativePath);

  if (!assetPath.startsWith(`${publicAssetRoot}${sep}`)) {
    throw new Error(`Pinterest feed image must stay inside public/: ${imagePath}`);
  }

  return statSync(assetPath).size;
}

export function toPinterestRfc822Date(date: string) {
  return new Date(`${date}T00:00:00.000Z`).toUTCString();
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
      const imageContentType = getImageContentType(item.imagePath);
      const imageByteLength = getImageByteLength(item.imagePath);

      return `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${pageUrl}</link>
  <guid isPermaLink="true">${pageUrl}</guid>
  <description>${escapeXml(item.description)}</description>
  <category>${escapeXml(board?.title ?? item.category)}</category>
  <pubDate>${toPinterestRfc822Date(item.published)}</pubDate>
  <enclosure url="${imageUrl}" length="${imageByteLength}" type="${imageContentType}" />
  <media:content url="${imageUrl}" medium="image" type="${imageContentType}" fileSize="${imageByteLength}" width="1000" height="1500" />
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
  <lastBuildDate>${toPinterestRfc822Date(PINTEREST_FEED_UPDATED)}</lastBuildDate>
  <ttl>1440</ttl>
  ${rssItems}
</channel>
</rss>`;
}
