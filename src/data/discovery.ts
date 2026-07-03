import { blogPosts } from './blogPosts';
import { categories } from './categories';
import { toolArtCategorySummaries, toolArtEntries } from './toolArt';
import { topicalHubs } from './hubs';
import { tools } from './tools';
import { shouldIncludeInXmlSitemap } from './indexationPolicy';
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

const XML_SITEMAP_EXCLUDED_PATHS = new Set(['/sitemap/']);
const XML_SITEMAP_EXCLUDED_PREFIXES = ['/admin/', '/api/'];

export const staticSitemapEntries: SitemapEntry[] = [
  '/',
  '/tools/',
  '/ask/',
  '/sitemap/',
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
]
  .filter(shouldIncludeInXmlSitemap)
  .map((path) => ({
    path,
    lastmod: getStaticPageLastmod(path),
  }));

export const toolSitemapEntries: SitemapEntry[] = tools.map((tool) => ({
  path: `/tools/${tool.slug}/`,
  lastmod: getToolLastmod(tool.slug),
})).filter((entry) => shouldIncludeInXmlSitemap(entry.path));

export const blogSitemapEntries: SitemapEntry[] = blogPosts.map((post) => ({
  path: `/blog/${post.slug}/`,
  lastmod: getBlogDates(post.slug).modified,
})).filter((entry) => shouldIncludeInXmlSitemap(entry.path));

export const categorySitemapEntries: SitemapEntry[] = categories
  .filter((category) => tools.some((tool) => tool.category === category.slug))
  .map((category) => ({
    path: `/categories/${category.slug}/`,
    lastmod: getCategoryLastmod(category.slug),
  }))
  .filter((entry) => shouldIncludeInXmlSitemap(entry.path));

export const hubSitemapEntries: SitemapEntry[] = topicalHubs.map((hub) => ({
  path: `/hubs/${hub.slug}/`,
  lastmod: getStaticPageLastmod(`/hubs/${hub.slug}/`),
})).filter((entry) => shouldIncludeInXmlSitemap(entry.path));

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
        .filter((entry) => shouldIncludeInXmlSitemap(entry.path))
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

export function assertXmlSitemapEntries(entries: SitemapEntry[]) {
  for (const entry of entries) {
    if (!entry.path.startsWith('/') || !entry.path.endsWith('/')) {
      throw new Error(`XML sitemap entry must be a root-relative trailing-slash path: ${entry.path}`);
    }

    if (entry.path.includes('?') || entry.path.includes('#')) {
      throw new Error(`XML sitemap entry must not include query strings or hashes: ${entry.path}`);
    }

    if (
      XML_SITEMAP_EXCLUDED_PATHS.has(entry.path) ||
      XML_SITEMAP_EXCLUDED_PREFIXES.some((prefix) => entry.path.startsWith(prefix))
    ) {
      throw new Error(`Non-indexable or internal path cannot appear in XML sitemap: ${entry.path}`);
    }
  }
}

export function renderUrlSet(entries: SitemapEntry[]) {
  assertXmlSitemapEntries(entries);

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
