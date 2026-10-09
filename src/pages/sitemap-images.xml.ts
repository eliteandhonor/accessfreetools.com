export const prerender = true;
import type { APIRoute } from 'astro';
import { editorialArticleImages } from '../data/editorialArticleImages';
import { toolArtEntries } from '../data/toolArt';
import { absoluteUrl, escapeXml } from '../data/discovery';
import { shouldIncludeInXmlSitemap } from '../data/indexationPolicy';
import { getBlogDates, getToolLastmod } from '../data/siteDates';
import { DISCOVERY_CACHE_CONTROL } from '../lib/cacheHeaders';

function lastmodForEntry(entry: (typeof toolArtEntries)[number]) {
  if (entry.kind === 'tool') return getToolLastmod(entry.slug);
  return getBlogDates(`how-to-use-${entry.slug}`).modified;
}

function renderImageSitemap() {
  const toolEntries = toolArtEntries
    .filter((entry) => shouldIncludeInXmlSitemap(entry.pagePath))
    .map((entry) => ({
      pagePath: entry.pagePath,
      imagePath: entry.imagePath,
      lastmod: lastmodForEntry(entry),
    }));
  const editorialEntries = editorialArticleImages
    .filter((entry) => shouldIncludeInXmlSitemap(entry.pagePath))
    .map((entry) => ({
      pagePath: entry.pagePath,
      imagePath: entry.imagePath,
      lastmod: getBlogDates(entry.slug).modified,
    }));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...toolEntries, ...editorialEntries]
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(absoluteUrl(entry.pagePath))}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <image:image>
      <image:loc>${escapeXml(absoluteUrl(entry.imagePath))}</image:loc>
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
      'Cache-Control': DISCOVERY_CACHE_CONTROL,
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
