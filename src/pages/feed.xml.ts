import type { APIRoute } from 'astro';
import { blogPosts } from '../data/blogPosts';

const site = 'https://accessfreetools.com';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = () => {
  const updatedDate = new Date();
  const items = blogPosts
    .map((post) => {
      const url = `${site}/blog/${post.slug}/`;

      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <description>${escapeXml(post.summary)}</description>
  <category>${escapeXml(post.label)}</category>
  <pubDate>${updatedDate.toUTCString()}</pubDate>
</item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Access Free Tools Guides</title>
  <link>${site}/blog/</link>
  <description>Practical guides for Access Free Tools calculators and browser utilities.</description>
  <language>en</language>
  <lastBuildDate>${updatedDate.toUTCString()}</lastBuildDate>
  ${items}
</channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
