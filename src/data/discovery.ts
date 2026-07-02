import { blogPosts } from './blogPosts';
import { categories } from './categories';
import { toolArtCategorySummaries, toolArtEntries } from './toolArt';
import { topicalHubs } from './hubs';
import { tools } from './tools';
import {
  getBlogDates,
  getCategoryLastmod,
  getStaticPageLastmod,
  getToolLastmod,
  SITE_ORIGIN,
} from './siteDates';

export interface SitemapEntry {
  path: string;
  lastmod: string;
}

export interface SitemapIndexEntry {
  path: string;
  lastmod: string;
}

export const staticSitemapEntries: SitemapEntry[] = [
  '/',
  '/tools/',
  '/ask/',
  '/hubs/',
  '/categories/',
  '/blog/',
  '/free-calculator-resources/',
  '/developers/mcp/',
  '/about/',
  '/why-access-free-tools/',
  '/contact/',
  '/advertising-disclosure/',
  '/privacy-policy/',
  '/terms/',
].map((path) => ({
  path,
  lastmod: getStaticPageLastmod(path),
}));

export const toolSitemapEntries: SitemapEntry[] = tools.map((tool) => ({
  path: `/tools/${tool.slug}/`,
  lastmod: getToolLastmod(tool.slug),
}));

export const blogSitemapEntries: SitemapEntry[] = blogPosts.map((post) => ({
  path: `/blog/${post.slug}/`,
  lastmod: getBlogDates(post.slug).modified,
}));

export const categorySitemapEntries: SitemapEntry[] = categories
  .filter((category) => tools.some((tool) => tool.category === category.slug))
  .map((category) => ({
    path: `/categories/${category.slug}/`,
    lastmod: getCategoryLastmod(category.slug),
  }));

export const hubSitemapEntries: SitemapEntry[] = topicalHubs.map((hub) => ({
  path: `/hubs/${hub.slug}/`,
  lastmod: getStaticPageLastmod(`/hubs/${hub.slug}/`),
}));

export const gallerySitemapEntries: SitemapEntry[] =
  toolArtEntries.length > 0
    ? [
        {
          path: '/gallery/',
          lastmod: getStaticPageLastmod('/gallery/'),
        },
        ...toolArtCategorySummaries
          .filter((category) => category.entries.length > 0)
          .map((category) => ({
            path: `/gallery/${category.slug}/`,
            lastmod: getCategoryLastmod(category.slug),
          })),
      ]
    : [];

export function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function maxLastmod(entries: Array<{ lastmod: string }>) {
  return entries.reduce((latest, entry) => (entry.lastmod > latest ? entry.lastmod : latest), '2026-04-28');
}

export function absoluteUrl(path: string) {
  return `${SITE_ORIGIN}${path}`;
}

export function renderUrlSet(entries: SitemapEntry[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(absoluteUrl(entry.path))}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>`;
}

export function renderSitemapIndex(entries: SitemapIndexEntry[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <sitemap>
    <loc>${escapeXml(absoluteUrl(entry.path))}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </sitemap>`,
  )
  .join('\n')}
</sitemapindex>`;
}
