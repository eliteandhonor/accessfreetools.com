import type { APIRoute } from 'astro';
import { blogPosts } from '../data/blogPosts';
import { categories } from '../data/categories';
import { tools } from '../data/tools';

const site = 'https://accessfreetools.com';
const lastmod = new Date().toISOString().slice(0, 10);

const staticPaths = [
  '/',
  '/tools/',
  '/categories/',
  '/blog/',
  '/about/',
  '/contact/',
  '/privacy-policy/',
  '/terms/',
];

export const GET: APIRoute = () => {
  const liveCategories = categories.filter((category) =>
    tools.some((tool) => tool.category === category.slug),
  );
  const urls = [
    ...staticPaths,
    ...blogPosts.map((post) => `/blog/${post.slug}/`),
    ...tools.map((tool) => `/tools/${tool.slug}/`),
    ...liveCategories.map((category) => `/categories/${category.slug}/`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${site}${path}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
