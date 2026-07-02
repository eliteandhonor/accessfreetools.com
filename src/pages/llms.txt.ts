export const prerender = true;
import type { APIRoute } from 'astro';
import { blogPosts } from '../data/blogPosts';
import { categories } from '../data/categories';
import { tools } from '../data/tools';

const SITE = 'https://accessfreetools.com';

function cleanDescription(value: string) {
  return value.replace(/\s+/g, ' ').replace(/\]/g, ')').trim();
}

function formatLink(title: string, path: string, description: string) {
  return `- [${title.replace(/\]/g, ')')}](${SITE}${path}): ${cleanDescription(description)}`;
}

export const GET: APIRoute = () => {
  const liveCategories = categories.filter((category) =>
    tools.some((tool) => tool.category === category.slug),
  );

  const categoryLines = liveCategories
    .map((category) => formatLink(category.name, `/categories/${category.slug}/`, category.summary))
    .join('\n');
  const featuredTools = tools
    .slice(0, 30)
    .map((tool) => formatLink(tool.name, `/tools/${tool.slug}/`, tool.seoDescription))
    .join('\n');
  const featuredGuides = blogPosts
    .slice(0, 30)
    .map((post) => formatLink(post.title, `/blog/${post.slug}/`, post.summary))
    .join('\n');
  const coreLinks = [
    formatLink('Tools index', '/tools/', 'Browse every free calculator, converter, AI helper, and browser utility.'),
    formatLink(
      'Free calculator resources',
      '/free-calculator-resources/',
      'Use the main resource hub for calculator guides, category paths, and tool discovery.',
    ),
    formatLink('Blog index', '/blog/', 'Read practical guides that explain how to use Access Free Tools pages.'),
    formatLink('XML sitemap', '/sitemap.xml', 'Machine-readable XML sitemap for indexable public pages.'),
    formatLink('RSS feed', '/feed.xml', 'Latest public guides and site updates in RSS format.'),
  ]
    .join('\n');

  const body = `# Access Free Tools

> Access Free Tools is a free browser utility site with calculators, converters, AI helpers, practical guides, and local-first tools for everyday tasks.

Canonical site: https://accessfreetools.com/
Tools index: https://accessfreetools.com/tools/
Resources hub: https://accessfreetools.com/free-calculator-resources/
Blog index: https://accessfreetools.com/blog/
XML sitemap: https://accessfreetools.com/sitemap.xml
RSS feed: https://accessfreetools.com/feed.xml
Pinterest promotion RSS feed: https://accessfreetools.com/pinterest-feed.xml

## Tool Standards

Every new tool should include researched formulas or assumptions, an interactive calculator or generator, plain-language FAQs, examples, related tools, private in-browser behavior where practical, and a matching blog guide.

## Core Links

${coreLinks}

## Categories

${categoryLines}

## Featured Tools

${featuredTools}

## Featured Guides

${featuredGuides}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
