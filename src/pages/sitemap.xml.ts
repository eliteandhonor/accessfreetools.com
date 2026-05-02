export const prerender = true;
import type { APIRoute } from 'astro';
import {
  blogSitemapEntries,
  categorySitemapEntries,
  maxLastmod,
  renderSitemapIndex,
  staticSitemapEntries,
  toolSitemapEntries,
} from '../data/discovery';

export const GET: APIRoute = () => {
  const body = renderSitemapIndex([
    { path: '/sitemap-pages.xml', lastmod: maxLastmod(staticSitemapEntries) },
    { path: '/sitemap-tools.xml', lastmod: maxLastmod(toolSitemapEntries) },
    { path: '/sitemap-blog.xml', lastmod: maxLastmod(blogSitemapEntries) },
    { path: '/sitemap-categories.xml', lastmod: maxLastmod(categorySitemapEntries) },
  ]);

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
