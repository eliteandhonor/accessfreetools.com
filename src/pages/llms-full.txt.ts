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
  const toolLines = tools
    .map((tool) => formatLink(tool.name, `/tools/${tool.slug}/`, tool.seoDescription))
    .join('\n');
  const guideLines = blogPosts
    .map((post) => formatLink(post.title, `/blog/${post.slug}/`, post.summary))
    .join('\n');

  const body = `# Access Free Tools Full Index

> Full LLM-readable index for Access Free Tools, covering public tool categories, browser tools, calculators, converters, AI helpers, and practical guides.

Canonical site: ${SITE}/
Short LLM index: ${SITE}/llms.txt
XML sitemap: ${SITE}/sitemap.xml

## Categories

${categoryLines}

## Tools

${toolLines}

## Guides

${guideLines}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
