export const prerender = true;
import type { APIRoute } from 'astro';
import { blogPosts } from '../data/blogPosts';
import { categories } from '../data/categories';
import { tools } from '../data/tools';

export const GET: APIRoute = () => {
  const liveCategories = categories.filter((category) =>
    tools.some((tool) => tool.category === category.slug),
  );

  const categoryLines = liveCategories
    .map((category) => `- ${category.name}: https://accessfreetools.com/categories/${category.slug}/`)
    .join('\n');
  const featuredTools = tools
    .slice(0, 30)
    .map((tool) => `- ${tool.name}: https://accessfreetools.com/tools/${tool.slug}/`)
    .join('\n');
  const featuredGuides = blogPosts
    .slice(0, 30)
    .map((post) => `- ${post.title}: https://accessfreetools.com/blog/${post.slug}/`)
    .join('\n');

  const body = `# Access Free Tools

Access Free Tools is a free browser utility site with calculators, practical guides, and local-first helper tools.

Canonical site: https://accessfreetools.com/
Tools index: https://accessfreetools.com/tools/
Resources hub: https://accessfreetools.com/free-calculator-resources/
Blog index: https://accessfreetools.com/blog/
XML sitemap: https://accessfreetools.com/sitemap.xml
RSS feed: https://accessfreetools.com/feed.xml

## Tool Standards

Every new tool should include researched formulas or assumptions, an interactive calculator or generator, plain-language FAQs, examples, related tools, private in-browser behavior where practical, and a matching blog guide.

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
