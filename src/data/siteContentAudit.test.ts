import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { blogPosts } from './blogPosts';
import { categories } from './categories';
import { financeBlogGuides } from './financeBlogGuides';
import { healthBlogGuides } from './healthBlogGuides';
import { toolAliases } from './toolAliases';
import { getCalculatorIconMark } from './toolIcons';
import { tools } from './tools';
import { utilityBlogGuides } from './utilityBlogGuides';

const PAGE_TITLE_MAX = 70;
const META_DESCRIPTION_MAX = 170;
const SITE_SUFFIX = ' | Access Free Tools';
const GENERIC_OR_PLACEHOLDER_PATTERNS = [
  /lorem ipsum/i,
  /fake data/i,
  /coming soon/i,
  /todo/i,
  /placeholder/i,
  /calculator\.net/i,
];
const TOOLS_ROUTE_SOURCE = readFileSync(
  fileURLToPath(new URL('../pages/tools/[slug].astro', import.meta.url)),
  'utf8',
);

function findDuplicates(values: string[]) {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

describe('site content audit guardrails', () => {
  it('keeps tool SEO titles and descriptions unique and concise', () => {
    const duplicateToolSlugs = findDuplicates(tools.map((tool) => tool.slug));
    const duplicateSeoTitles = findDuplicates(tools.map((tool) => tool.seoTitle));
    const longSeoTitles = tools
      .map((tool) => ({ slug: tool.slug, title: tool.seoTitle, length: tool.seoTitle.length }))
      .filter((item) => item.length > PAGE_TITLE_MAX);
    const longSeoDescriptions = tools
      .map((tool) => ({ slug: tool.slug, description: tool.seoDescription, length: tool.seoDescription.length }))
      .filter((item) => item.length > META_DESCRIPTION_MAX);

    expect(duplicateToolSlugs).toEqual([]);
    expect(duplicateSeoTitles).toEqual([]);
    expect(longSeoTitles).toEqual([]);
    expect(longSeoDescriptions).toEqual([]);
  });

  it('keeps blog guide titles concise for search result title links', () => {
    const duplicateBlogSlugs = findDuplicates(blogPosts.map((post) => post.slug));
    const duplicateBlogTitles = findDuplicates(blogPosts.map((post) => post.title));
    const longBlogPageTitles = blogPosts
      .map((post) => ({
        slug: post.slug,
        title: `${post.title}${SITE_SUFFIX}`,
        length: `${post.title}${SITE_SUFFIX}`.length,
      }))
      .filter((item) => item.length > PAGE_TITLE_MAX);

    expect(duplicateBlogSlugs).toEqual([]);
    expect(duplicateBlogTitles).toEqual([]);
    expect(longBlogPageTitles).toEqual([]);
  });

  it('keeps every canonical tool connected to a useful guide and valid related tools', () => {
    const blogSlugs = new Set(blogPosts.map((post) => post.slug));
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    const issues: string[] = [];

    for (const tool of tools) {
      if (!blogSlugs.has(`how-to-use-${tool.slug}`)) {
        issues.push(`${tool.slug} is missing its how-to-use blog guide`);
      }

      if (tool.useCases.length < 3) {
        issues.push(`${tool.slug} needs at least 3 use cases`);
      }

      if (tool.examples.length < 3) {
        issues.push(`${tool.slug} needs at least 3 examples`);
      }

      if (tool.faq.length < 3) {
        issues.push(`${tool.slug} needs at least 3 FAQs`);
      }

      for (const relatedSlug of tool.relatedSlugs) {
        if (!toolSlugs.has(relatedSlug)) {
          issues.push(`${tool.slug} points to missing related tool ${relatedSlug}`);
        }
      }
    }

    expect(issues).toEqual([]);
  });

  it('keeps every tool connected to valid discovery metadata', () => {
    const categorySlugs = new Set(categories.map((category) => category.slug));
    const issues: string[] = [];

    for (const tool of tools) {
      if (!categorySlugs.has(tool.category)) {
        issues.push(`${tool.slug} points to missing category ${tool.category}`);
      }

      if (!getCalculatorIconMark(tool.icon)) {
        issues.push(`${tool.slug} uses unmapped icon ${tool.icon}`);
      }

      if (!tool.seoTitle.includes(tool.name)) {
        issues.push(`${tool.slug} SEO title does not include the tool name`);
      }

      if (tool.summary.length < 45) {
        issues.push(`${tool.slug} summary is too thin for tool cards`);
      }

      if (tool.description.length < 90) {
        issues.push(`${tool.slug} description is too thin for the tool page intro`);
      }
    }

    expect(issues).toEqual([]);
  });

  it('keeps related tools useful, unique, and non-self-referential', () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    const issues: string[] = [];

    for (const tool of tools) {
      const uniqueRelatedSlugs = new Set(tool.relatedSlugs);

      if (tool.relatedSlugs.length < 3) {
        issues.push(`${tool.slug} needs at least 3 explicit related tools`);
      }

      if (uniqueRelatedSlugs.size !== tool.relatedSlugs.length) {
        issues.push(`${tool.slug} has duplicate related tools`);
      }

      if (uniqueRelatedSlugs.has(tool.slug)) {
        issues.push(`${tool.slug} relates to itself`);
      }

      for (const relatedSlug of uniqueRelatedSlugs) {
        if (!toolSlugs.has(relatedSlug)) {
          issues.push(`${tool.slug} points to missing related tool ${relatedSlug}`);
        }
      }
    }

    expect(issues).toEqual([]);
  });

  it('keeps examples, FAQs, and summaries specific instead of placeholder-like', () => {
    const issues: string[] = [];

    for (const tool of tools) {
      const searchableContent = [
        tool.name,
        tool.summary,
        tool.description,
        tool.seoTitle,
        tool.seoDescription,
        ...tool.useCases,
        ...tool.examples.flatMap((example) => [example.label, example.expression, example.result]),
        ...tool.faq.flatMap((faq) => [faq.question, faq.answer]),
      ];

      for (const pattern of GENERIC_OR_PLACEHOLDER_PATTERNS) {
        if (searchableContent.some((value) => pattern.test(value))) {
          issues.push(`${tool.slug} contains placeholder or competitor wording matching ${pattern}`);
        }
      }

      const duplicateFaqQuestions = findDuplicates(tool.faq.map((faq) => faq.question.toLowerCase()));
      if (duplicateFaqQuestions.length > 0) {
        issues.push(`${tool.slug} has duplicate FAQ questions: ${duplicateFaqQuestions.join(', ')}`);
      }

      for (const [index, faq] of tool.faq.entries()) {
        if (faq.question.length < 12) {
          issues.push(`${tool.slug} FAQ ${index + 1} question is too short`);
        }

        if (faq.answer.length < 55) {
          issues.push(`${tool.slug} FAQ ${index + 1} answer is too thin`);
        }
      }

      for (const [index, example] of tool.examples.entries()) {
        if (!example.label.trim() || !example.expression.trim() || !example.result.trim()) {
          issues.push(`${tool.slug} example ${index + 1} has an empty label, expression, or result`);
        }
      }
    }

    expect(issues).toEqual([]);
  });

  it('keeps generated blog cards aligned with canonical tools and aliases', () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    const aliasSlugs = new Set(toolAliases.map((alias) => alias.slug));
    const issues: string[] = [];

    for (const post of blogPosts) {
      if (!post.slug.startsWith('how-to-use-')) {
        issues.push(`${post.slug} does not use the how-to-use guide pattern`);
        continue;
      }

      const targetSlug = post.slug.replace(/^how-to-use-/, '');
      if (!toolSlugs.has(targetSlug) && !aliasSlugs.has(targetSlug)) {
        issues.push(`${post.slug} does not map to a canonical tool or alias`);
      }

      if (post.summary.length < 55) {
        issues.push(`${post.slug} summary is too thin for blog discovery`);
      }
    }

    expect(issues).toEqual([]);
  });

  it('keeps every tool wired into the interactive tool page renderer', () => {
    const issues = tools
      .map((tool) => tool.slug)
      .filter((slug) => !TOOLS_ROUTE_SOURCE.includes(`'${slug}'`) && !TOOLS_ROUTE_SOURCE.includes(`tool.slug === '${slug}'`))
      .map((slug) => `${slug} is not referenced by src/pages/tools/[slug].astro`);

    expect(issues).toEqual([]);
  });

  it('keeps generated guide articles substantial enough to support the tools', () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    const generatedGuides = [...financeBlogGuides, ...healthBlogGuides, ...utilityBlogGuides];
    const issues: string[] = [];

    for (const guide of generatedGuides) {
      if (!toolSlugs.has(guide.toolSlug)) {
        issues.push(`${guide.slug} points to missing tool ${guide.toolSlug}`);
      }

      if (guide.quickStart.length < 3) {
        issues.push(`${guide.slug} needs at least 3 quick-start steps`);
      }

      if (guide.sections.length < 3) {
        issues.push(`${guide.slug} needs at least 3 guide sections`);
      }

      if (guide.sidecarText.length < 100) {
        issues.push(`${guide.slug} sidecar text is too thin`);
      }

      const totalSectionTextLength = guide.sections
        .flatMap((section) => [
          section.title,
          ...section.paragraphs,
          ...(section.bullets ?? []),
          ...(section.links ?? []).map((link) => link.label),
        ])
        .join(' ').length;

      if (totalSectionTextLength < 700) {
        issues.push(`${guide.slug} generated section content is too thin`);
      }

      for (const [index, section] of guide.sections.entries()) {
        if (section.title.length < 8) {
          issues.push(`${guide.slug} section ${index + 1} heading is too short`);
        }

        if (section.paragraphs.length === 0 && !section.bullets?.length && !section.links?.length) {
          issues.push(`${guide.slug} section ${index + 1} has no readable content`);
        }
      }
    }

    expect(issues).toEqual([]);
  });
});
