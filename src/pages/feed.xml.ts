export const prerender = true;
import type { APIRoute } from 'astro';
import { blogPosts } from '../data/blogPosts';
import { editorialBlogPosts } from '../data/editorialBlogPosts';
import { absoluteUrl, escapeXml, maxLastmod } from '../data/discovery';
import { getBlogDates, RSS_ITEM_LIMIT, SITE_ORIGIN, toRfc822Date } from '../data/siteDates';
import { DISCOVERY_CACHE_CONTROL } from '../lib/cacheHeaders';

export const GET: APIRoute = () => {
  const feedPosts = [...editorialBlogPosts, ...blogPosts];
  const items = feedPosts
    .map((post, index) => ({
      ...post,
      index,
      dates: getBlogDates(post.slug),
    }))
    .sort((a, b) => b.dates.modified.localeCompare(a.dates.modified) || b.index - a.index)
    .slice(0, RSS_ITEM_LIMIT)
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}/`);

      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <description>${escapeXml(post.summary)}</description>
  <category>${escapeXml(post.label)}</category>
  <pubDate>${toRfc822Date(post.dates.modified)}</pubDate>
</item>`;
    })
    .join('\n');
  const latestDate = maxLastmod(feedPosts.map((post) => ({ lastmod: getBlogDates(post.slug).modified })));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Access Free Tools Guides and Owner Notes</title>
  <link>${SITE_ORIGIN}/blog/</link>
  <atom:link href="${SITE_ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />
  <description>Practical guides and owner notes for Access Free Tools calculators, browser utilities, and site-building lessons.</description>
  <language>en</language>
  <lastBuildDate>${toRfc822Date(latestDate)}</lastBuildDate>
  <ttl>60</ttl>
  ${items}
</channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Cache-Control': DISCOVERY_CACHE_CONTROL,
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
