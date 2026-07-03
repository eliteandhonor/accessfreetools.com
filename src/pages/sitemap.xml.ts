export const prerender = true;
import type { APIRoute } from 'astro';
import { DISCOVERY_CACHE_CONTROL } from '../lib/cacheHeaders';
import {
  blogSitemapEntries,
  categorySitemapEntries,
  gallerySitemapEntries,
  hubSitemapEntries,
  maxLastmod,
  renderSitemapIndex,
  staticSitemapEntries,
  toolSitemapEntries,
} from '../data/discovery';

export const GET: APIRoute = () => {
  const body = renderSitemapIndex([
    { path: '/sitemap-pages.xml', lastmod: maxLastmod([...staticSitemapEntries, ...hubSitemapEntries]) },
    { path: '/sitemap-tools.xml', lastmod: maxLastmod(toolSitemapEntries) },
    { path: '/sitemap-blog.xml', lastmod: maxLastmod(blogSitemapEntries) },
    { path: '/sitemap-categories.xml', lastmod: maxLastmod(categorySitemapEntries) },
    ...(gallerySitemapEntries.length > 0
      ? [
          { path: '/sitemap-gallery.xml', lastmod: maxLastmod(gallerySitemapEntries) },
          { path: '/sitemap-images.xml', lastmod: maxLastmod(gallerySitemapEntries) },
        ]
      : []),
  ]);

  return new Response(body, {
    headers: {
      'Cache-Control': DISCOVERY_CACHE_CONTROL,
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
