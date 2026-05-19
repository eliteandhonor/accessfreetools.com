export const prerender = true;
import type { APIRoute } from 'astro';
import { toolArtEntries } from '../data/toolArt';
import { absoluteUrl, escapeXml } from '../data/discovery';
import { getBlogDates, getToolLastmod } from '../data/siteDates';

function lastmodForEntry(entry: (typeof toolArtEntries)[number]) {
  if (entry.kind === 'tool') return getToolLastmod(entry.slug);
  return getBlogDates(`how-to-use-${entry.slug}`).modified;
}

function renderImageSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${toolArtEntries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(absoluteUrl(entry.pagePath))}</loc>
    <lastmod>${lastmodForEntry(entry)}</lastmod>
    <image:image>
      <image:loc>${escapeXml(absoluteUrl(entry.imagePath))}</image:loc>
      <image:title>${escapeXml(entry.toolName)}</image:title>
      <image:caption>${escapeXml(entry.caption)}</image:caption>
    </image:image>
  </url>`,
  )
  .join('\n')}
</urlset>`;
}

export const GET: APIRoute = () => {
  const body = renderImageSitemap();

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
