import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { aiBlogGuides } from './aiBlogGuides';
import { aiTools } from './aiTools';
import { blogPosts } from './blogPosts';
import { categories } from './categories';
import { financeBlogGuides } from './financeBlogGuides';
import { healthBlogGuides } from './healthBlogGuides';
import { toolAliases } from './toolAliases';
import {
  BASELINE_AUDIT_SCOPE,
  DEEP_AUDIT_REQUIRED_SCOPE,
  manualDeepReviewProgress,
  toolDeepAuditRecords,
} from './toolDeepAudit';
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
const TOOLS_INDEX_SOURCE = readFileSync(
  fileURLToPath(new URL('../pages/tools/index.astro', import.meta.url)),
  'utf8',
);
const SITE_HEADER_SOURCE = readFileSync(
  fileURLToPath(new URL('../components/SiteHeader.astro', import.meta.url)),
  'utf8',
);
const MIDDLEWARE_SOURCE = readFileSync(fileURLToPath(new URL('../middleware.ts', import.meta.url)), 'utf8');
const ASTRO_CONFIG_SOURCE = readFileSync(fileURLToPath(new URL('../../astro.config.mjs', import.meta.url)), 'utf8');
const HTACCESS_SOURCE = readFileSync(fileURLToPath(new URL('../../public/.htaccess', import.meta.url)), 'utf8');
const PACKAGE_JSON_SOURCE = readFileSync(fileURLToPath(new URL('../../package.json', import.meta.url)), 'utf8');
const TOOLS_LAUNCHPAD_SOURCE = readFileSync(
  fileURLToPath(new URL('../components/ToolsLaunchpad.tsx', import.meta.url)),
  'utf8',
);
const AI_BROWSER_TOOL_SOURCE = readFileSync(
  fileURLToPath(new URL('../components/AiBrowserTool.tsx', import.meta.url)),
  'utf8',
);
const PUBLIC_AI_MODELS_DIR = fileURLToPath(new URL('../../public/ai-models/', import.meta.url));
const SITEMAP_SOURCE = readFileSync(
  fileURLToPath(new URL('../pages/sitemap.xml.ts', import.meta.url)),
  'utf8',
);
const FEED_SOURCE = readFileSync(fileURLToPath(new URL('../pages/feed.xml.ts', import.meta.url)), 'utf8');
const PINTEREST_FEED_SOURCE = readFileSync(
  fileURLToPath(new URL('../pages/pinterest-feed.xml.ts', import.meta.url)),
  'utf8',
);
const PINTEREST_BOARD_FEED_SOURCE = readFileSync(
  fileURLToPath(new URL('../pages/pinterest/[board].xml.ts', import.meta.url)),
  'utf8',
);
const PINTEREST_FEED_XML_SOURCE = readFileSync(
  fileURLToPath(new URL('../data/pinterestFeedXml.ts', import.meta.url)),
  'utf8',
);
const PINTEREST_FEED_DATA_SOURCE = readFileSync(
  fileURLToPath(new URL('../data/pinterestFeed.ts', import.meta.url)),
  'utf8',
);
const REDDIT_PROMOTION_AGENT_SOURCE = readFileSync(
  fileURLToPath(new URL('../../scripts/reddit-promotion-agent.mjs', import.meta.url)),
  'utf8',
);
const REDDIT_QUALITY_SOURCE = readFileSync(
  fileURLToPath(new URL('../../scripts/check-reddit-promotion-quality.mjs', import.meta.url)),
  'utf8',
);
const REDDIT_EXTERNAL_SETUP_SOURCE = readFileSync(
  fileURLToPath(new URL('../../scripts/reddit-external-setup.mjs', import.meta.url)),
  'utf8',
);
const REDDIT_PROFILE_PUBLISH_SOURCE = readFileSync(
  fileURLToPath(new URL('../../scripts/reddit-publish-profile-post.mjs', import.meta.url)),
  'utf8',
);
const REDDIT_PROFILE_VERIFY_SOURCE = readFileSync(
  fileURLToPath(new URL('../../scripts/reddit-verify-profile-post.mjs', import.meta.url)),
  'utf8',
);
const LLMS_SOURCE = readFileSync(fileURLToPath(new URL('../pages/llms.txt.ts', import.meta.url)), 'utf8');
const CALCULATOR_GUIDE_ARTICLE_SOURCE = readFileSync(
  fileURLToPath(new URL('../components/CalculatorGuideArticle.astro', import.meta.url)),
  'utf8',
);
const HALF_LIFE_GUIDE_SOURCE = readFileSync(
  fileURLToPath(new URL('../pages/blog/how-to-use-half-life-calculator.astro', import.meta.url)),
  'utf8',
);
const PRIVACY_POLICY_SOURCE = readFileSync(
  fileURLToPath(new URL('../pages/privacy-policy.astro', import.meta.url)),
  'utf8',
);
const TERMS_SOURCE = readFileSync(fileURLToPath(new URL('../pages/terms.astro', import.meta.url)), 'utf8');
const ADVERTISING_DISCLOSURE_SOURCE = readFileSync(
  fileURLToPath(new URL('../pages/advertising-disclosure.astro', import.meta.url)),
  'utf8',
);
const CONTACT_SOURCE = readFileSync(fileURLToPath(new URL('../pages/contact.astro', import.meta.url)), 'utf8');
const CONTACT_API_SOURCE = readFileSync(fileURLToPath(new URL('../pages/api/contact.ts', import.meta.url)), 'utf8');
const CONTACT_PHP_SOURCE = readFileSync(fileURLToPath(new URL('../../public/api/contact.php', import.meta.url)), 'utf8');
const MIRROR_STATIC_OUTPUT_SOURCE = readFileSync(
  fileURLToPath(new URL('../../scripts/mirror-static-output.mjs', import.meta.url)),
  'utf8',
);
const DATAFORSEO_LIB_SOURCE = readFileSync(
  fileURLToPath(new URL('../../scripts/lib/dataforseo.mjs', import.meta.url)),
  'utf8',
);
const DATAFORSEO_STATUS_SOURCE = readFileSync(
  fileURLToPath(new URL('../../scripts/dataforseo-status.mjs', import.meta.url)),
  'utf8',
);
const PRODUCTION_SITEMAP_CHECK_SOURCE = readFileSync(
  fileURLToPath(new URL('../../scripts/check-production-sitemap.mjs', import.meta.url)),
  'utf8',
);
const SEO_SELF_EVALUATION_SOURCE = readFileSync(
  fileURLToPath(new URL('../../scripts/seo-agent-self-evaluation.mjs', import.meta.url)),
  'utf8',
);
const GOOGLE_SEARCH_CENTRAL_NOTES_SOURCE = readFileSync(
  fileURLToPath(new URL('../../docs/google-search-central-notes.md', import.meta.url)),
  'utf8',
);
const RETIRED_PRIVACY_INBOX = ['privacy', 'accessfreetools.com'].join('@');
const README_SOURCE = readFileSync(fileURLToPath(new URL('../../README.md', import.meta.url)), 'utf8');
const ROADMAP_SOURCE = readFileSync(
  fileURLToPath(new URL('../../docs/calculator-net-roadmap.md', import.meta.url)),
  'utf8',
);
const DEPLOYMENT_CHECKLIST_SOURCE = readFileSync(
  fileURLToPath(new URL('../../docs/deployment-checklist.md', import.meta.url)),
  'utf8',
);
const MANUAL_DEEP_REVIEW_PLAN_SOURCE = readFileSync(
  fileURLToPath(new URL('../../docs/manual-deep-review-plan.md', import.meta.url)),
  'utf8',
);
const LEGAL_MONETIZATION_READINESS_SOURCE = readFileSync(
  fileURLToPath(new URL('../../docs/legal-monetization-readiness.md', import.meta.url)),
  'utf8',
);
const FULL_SITE_IMPROVEMENT_PLAN_SOURCE = readFileSync(
  fileURLToPath(new URL('../../docs/full-site-improvement-plan.md', import.meta.url)),
  'utf8',
);
const ALL_TOOLS_REVIEW_REGISTER_SOURCE = readFileSync(
  fileURLToPath(new URL('../../docs/all-tools-review-register.md', import.meta.url)),
  'utf8',
);
const QA_AUTOMATION_PLAN_SOURCE = readFileSync(
  fileURLToPath(new URL('../../docs/qa-automation-plan.md', import.meta.url)),
  'utf8',
);
const REDDIT_PROMOTION_DOC_SOURCE = readFileSync(
  fileURLToPath(new URL('../../docs/reddit-promotion-agent.md', import.meta.url)),
  'utf8',
);
const PROMOTION_QUEUE_SOURCE = readFileSync(
  fileURLToPath(new URL('../../docs/promotion-queue.md', import.meta.url)),
  'utf8',
);
const INDEXNOW_SUBMIT_SOURCE = readFileSync(
  fileURLToPath(new URL('../../scripts/indexnow-submit.mjs', import.meta.url)),
  'utf8',
);
const PACKAGE_JSON = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../package.json', import.meta.url)), 'utf8'),
) as { scripts: Record<string, string> };

function findDuplicates(values: string[]) {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

function getPublicAiModelFile(relativePath: string) {
  return fileURLToPath(new URL(`../../public/ai-models/${relativePath}`, import.meta.url));
}

function getFilesRecursive(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;

    return entry.isDirectory() ? getFilesRecursive(path) : [path];
  });
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

  it('keeps per-tool deep audit records traceable and source backed', () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    const aliasSlugs = new Set(toolAliases.map((alias) => alias.slug));
    const publicToolSlugs = new Set([...toolSlugs, ...aliasSlugs]);
    const duplicateAuditSlugs = findDuplicates(toolDeepAuditRecords.map((record) => record.slug));
    const issues = duplicateAuditSlugs.map((slug) => `${slug} has duplicate deep-audit records`);
    const auditSlugs = new Set(toolDeepAuditRecords.map((record) => record.slug));

    if (toolDeepAuditRecords.length !== publicToolSlugs.size) {
      issues.push(
        `deep-audit coverage mismatch: ${toolDeepAuditRecords.length} records for ${publicToolSlugs.size} public tool URLs`,
      );
    }

    for (const slug of publicToolSlugs) {
      if (!auditSlugs.has(slug)) {
        issues.push(`${slug} is missing a deep-audit record`);
      }
    }

    for (const record of toolDeepAuditRecords) {
      if (!publicToolSlugs.has(record.slug)) {
        issues.push(`${record.slug} deep-audit record does not map to a tool or alias page`);
      }

      const requiredScope =
        record.status === 'baseline-reviewed' ? BASELINE_AUDIT_SCOPE : DEEP_AUDIT_REQUIRED_SCOPE;

      for (const scope of requiredScope) {
        if (!record.scope.includes(scope)) {
          issues.push(`${record.slug} deep-audit record is missing ${scope} scope`);
        }
      }

      if (
        record.status === 'baseline-reviewed' &&
        record.scope.some((scope) => !BASELINE_AUDIT_SCOPE.includes(scope))
      ) {
        issues.push(`${record.slug} baseline review should not claim manual-only scopes`);
      }

      if (record.sources.length < 2) {
        issues.push(`${record.slug} needs at least 2 source links in its deep-audit record`);
      }

      if (record.findings.length < 3) {
        issues.push(`${record.slug} needs at least 3 review findings`);
      }

      if (record.improvements.length < 1) {
        issues.push(`${record.slug} needs at least 1 recorded improvement`);
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(record.reviewedOn)) {
        issues.push(`${record.slug} reviewedOn must be an ISO date`);
      }
    }

    expect(issues).toEqual([]);
  });

  it('keeps every tool FAQ detailed enough to explain inputs, answers, and common mistakes', () => {
    const issues: string[] = [];

    for (const tool of tools) {
      const faqQuestions = tool.faq.map((faq) => faq.question).join(' ');

      if (tool.faq.length < 6) {
        issues.push(`${tool.slug} needs at least 6 FAQs for a full tool page`);
      }

      if (!/main .*inputs/i.test(faqQuestions)) {
        issues.push(`${tool.slug} needs a main-input explanation FAQ`);
      }

      if (!/how should i read|read the .*answer|read the .*result/i.test(faqQuestions)) {
        issues.push(`${tool.slug} needs an answer-reading FAQ`);
      }

      if (!/double-check|before trusting|before copying|common mistake/i.test(faqQuestions)) {
        issues.push(`${tool.slug} needs a double-check or mistake-prevention FAQ`);
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

  it('explains key project-estimate inputs in FAQs', () => {
    const projectToolsNeedingInputFaq = [
      'concrete-calculator',
      'roofing-calculator',
      'tile-calculator',
      'mulch-calculator',
      'gravel-calculator',
      'paint-calculator',
      'drywall-calculator',
      'carpet-calculator',
      'flooring-calculator',
      'wallpaper-calculator',
      'fence-calculator',
      'deck-cost-calculator',
      'paver-calculator',
      'siding-calculator',
      'brick-calculator',
      'concrete-block-calculator',
      'rebar-calculator',
      'board-foot-calculator',
      'cubic-yard-calculator',
      'pool-volume-calculator',
      'sand-calculator',
      'soil-calculator',
      'asphalt-calculator',
    ];
    const issues: string[] = [];

    for (const slug of projectToolsNeedingInputFaq) {
      const tool = tools.find((candidate) => candidate.slug === slug);
      const inputFaq = tool?.faq.find((faq) => faq.question.includes('main') && faq.question.includes('inputs'));

      if (!inputFaq) {
        issues.push(`${slug} needs a main-input explanation FAQ`);
      }
    }

    const wallpaper = tools.find((tool) => tool.slug === 'wallpaper-calculator');
    const wallpaperFaqText = wallpaper?.faq.flatMap((faq) => [faq.question, faq.answer]).join(' ') ?? '';

    if (!/Waste percent/i.test(wallpaperFaqText) || !/Roll coverage/i.test(wallpaperFaqText)) {
      issues.push('wallpaper-calculator FAQ must explain waste percent and roll coverage');
    }

    if (!wallpaper?.faq.some((faq) => faq.question === 'What is waste percent in the Wallpaper Calculator?')) {
      issues.push('wallpaper-calculator needs a dedicated waste percent FAQ');
    }

    if (!/pattern repeat/i.test(wallpaperFaqText) || !/lot|batch/i.test(wallpaperFaqText)) {
      issues.push('wallpaper-calculator FAQ must explain pattern repeat and lot/batch risk');
    }

    expect(issues).toEqual([]);
  });

  it('keeps the Wallpaper Calculator guide detailed enough for confusing buying terms', () => {
    const guide = utilityBlogGuides.find((candidate) => candidate.toolSlug === 'wallpaper-calculator');
    const guideText =
      guide?.sections
        .flatMap((section) => [section.title, ...section.paragraphs, ...(section.bullets ?? [])])
        .join(' ') ?? '';

    expect(guide).toBeDefined();
    expect(guideText).toContain('What waste percent means');
    expect(guideText).toContain('What roll coverage means');
    expect(guideText).toContain('Why pattern repeat matters');
    expect(guideText).toContain('A quick example');
    expect(guideText).toMatch(/300 square feet|302 square feet/);
  });

  it('keeps the Half-Life Calculator detailed enough for confusing decay terms', () => {
    const halfLife = tools.find((tool) => tool.slug === 'half-life-calculator');
    const faqText = halfLife?.faq.flatMap((faq) => [faq.question, faq.answer]).join(' ') ?? '';

    expect(halfLife).toBeDefined();
    expect(faqText).toContain('What do the main Half-Life Calculator inputs mean?');
    expect(faqText).toContain('What does half-lives passed mean?');
    expect(faqText).toContain('physical, biological, and effective half-life');
    expect(HALF_LIFE_GUIDE_SOURCE).toContain('What half-life means');
    expect(HALF_LIFE_GUIDE_SOURCE).toContain('How to read the answer');
    expect(HALF_LIFE_GUIDE_SOURCE).toContain('Physical, biological, and effective half-life');
    expect(HALF_LIFE_GUIDE_SOURCE).toContain('Research and references');
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
    const generatedGuides = [...financeBlogGuides, ...healthBlogGuides, ...utilityBlogGuides, ...aiBlogGuides];
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

  it('keeps launchpad and structured data scalable as the library grows', () => {
    expect(TOOLS_LAUNCHPAD_SOURCE).toContain('const INITIAL_VISIBLE_TOOL_LIMIT = 96');
    expect(TOOLS_LAUNCHPAD_SOURCE).toContain('Show all');
    expect(TOOLS_INDEX_SOURCE).toContain('maxItems={100}');
    expect(TOOLS_INDEX_SOURCE).toContain('client:load');
    expect(TOOLS_INDEX_SOURCE).not.toContain('client:idle');
  });

  it('keeps browser AI tools private, lazy loaded, and fully documented', () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    const blogSlugs = new Set(blogPosts.map((post) => post.slug));
    const aiCategories = new Set(aiTools.map((tool) => tool.category));
    const issues: string[] = [];

    expect(aiTools.length).toBe(8);
    expect(aiCategories).toEqual(new Set(['ai-tools']));
    expect(AI_BROWSER_TOOL_SOURCE).toContain("await import('@huggingface/transformers')");
    expect(AI_BROWSER_TOOL_SOURCE).toContain("await import('tesseract.js')");
    expect(AI_BROWSER_TOOL_SOURCE).toContain("await import('franc-min')");
    expect(AI_BROWSER_TOOL_SOURCE).toContain("const LOCAL_TRANSFORMERS_MODEL_PATH = `${AI_ASSET_BASE}/transformers/`");
    expect(AI_BROWSER_TOOL_SOURCE).toContain("SELF_HOSTED_TEXT_MODEL = 'Xenova/mobilebert-uncased-mnli'");
    expect(AI_BROWSER_TOOL_SOURCE).toContain('transformers.env.localModelPath = LOCAL_TRANSFORMERS_MODEL_PATH');
    expect(AI_BROWSER_TOOL_SOURCE).toContain('local_files_only: true');
    expect(AI_BROWSER_TOOL_SOURCE).toContain('TESSERACT_LOCAL_OPTIONS');
    expect(AI_BROWSER_TOOL_SOURCE).toContain("workerPath: `${AI_ASSET_BASE}/tesseract/worker.min.js`");
    expect(AI_BROWSER_TOOL_SOURCE).toContain("corePath: `${AI_ASSET_BASE}/tesseract/core/`");
    expect(AI_BROWSER_TOOL_SOURCE).toContain("langPath: `${AI_ASSET_BASE}/tesseract/lang/`");
    expect(AI_BROWSER_TOOL_SOURCE).not.toMatch(/^import .*@huggingface\/transformers/m);
    expect(AI_BROWSER_TOOL_SOURCE).not.toMatch(/^import .*tesseract\.js/m);
    expect(AI_BROWSER_TOOL_SOURCE).not.toMatch(/^import .*franc-min/m);
    expect(AI_BROWSER_TOOL_SOURCE).toContain('not uploaded to Access Free Tools');

    for (const tool of aiTools) {
      if (!toolSlugs.has(tool.slug)) {
        issues.push(`${tool.slug} is missing from the canonical tools registry`);
      }

      if (!blogSlugs.has(`how-to-use-${tool.slug}`)) {
        issues.push(`${tool.slug} is missing its AI blog guide`);
      }

      if (tool.examples.length < 3) {
        issues.push(`${tool.slug} needs at least 3 examples`);
      }

      if (tool.faq.length < 6) {
        issues.push(`${tool.slug} needs at least 6 FAQs`);
      }

      const faqText = tool.faq.flatMap((faq) => [faq.question, faq.answer]).join(' ');

      for (const requiredPhrase of ['browser tab', 'model', 'uploaded', 'double-check']) {
        if (!faqText.toLowerCase().includes(requiredPhrase)) {
          issues.push(`${tool.slug} FAQ should mention ${requiredPhrase}`);
        }
      }
    }

    expect(issues).toEqual([]);
  });

  it('keeps self-hosted AI model assets present and within GitHub-friendly file sizes', () => {
    const requiredFiles = [
      'README.md',
      'tesseract/worker.min.js',
      'tesseract/core/tesseract-core.wasm.js',
      'tesseract/core/tesseract-core-simd.wasm.js',
      'tesseract/core/tesseract-core-lstm.wasm.js',
      'tesseract/core/tesseract-core-simd-lstm.wasm.js',
      'tesseract/lang/eng.traineddata.gz',
      'tesseract/lang/spa.traineddata.gz',
      'tesseract/lang/fra.traineddata.gz',
      'tesseract/lang/deu.traineddata.gz',
      'tesseract/lang/ita.traineddata.gz',
      'tesseract/lang/por.traineddata.gz',
      'transformers/Xenova/mobilebert-uncased-mnli/config.json',
      'transformers/Xenova/mobilebert-uncased-mnli/special_tokens_map.json',
      'transformers/Xenova/mobilebert-uncased-mnli/tokenizer.json',
      'transformers/Xenova/mobilebert-uncased-mnli/tokenizer_config.json',
      'transformers/Xenova/mobilebert-uncased-mnli/vocab.txt',
      'transformers/Xenova/mobilebert-uncased-mnli/onnx/model_quantized.onnx',
    ];
    const issues: string[] = [];

    expect(existsSync(PUBLIC_AI_MODELS_DIR)).toBe(true);

    for (const relativePath of requiredFiles) {
      const fullPath = getPublicAiModelFile(relativePath);

      if (!existsSync(fullPath)) {
        issues.push(`${relativePath} is missing`);
        continue;
      }

      const size = statSync(fullPath).size;

      if (size === 0) {
        issues.push(`${relativePath} is empty`);
      }

      if (size > 95 * 1024 * 1024) {
        issues.push(`${relativePath} is too close to GitHub's normal Git file limit`);
      }
    }

    const allAssetFiles = getFilesRecursive(PUBLIC_AI_MODELS_DIR);
    const totalBytes = allAssetFiles.reduce((sum, file) => {
      const size = statSync(file).size;

      if (size > 95 * 1024 * 1024) {
        issues.push(`${file} is too close to GitHub's normal Git file limit`);
      }

      return sum + size;
    }, 0);

    if (totalBytes > 140 * 1024 * 1024) {
      issues.push(`self-hosted AI assets are too large for the phase 1 budget: ${totalBytes} bytes`);
    }

    expect(issues).toEqual([]);
  });

  it('keeps sitemap freshness and release commands guarded', () => {
    expect(SITEMAP_SOURCE).toContain('renderSitemapIndex');
    expect(SITEMAP_SOURCE).toContain('/sitemap-tools.xml');
    expect(SITEMAP_SOURCE).not.toContain('new Date().toISOString().slice(0, 10)');
    expect(FEED_SOURCE).toContain('getBlogDates');
    expect(FEED_SOURCE).toContain('RSS_ITEM_LIMIT');
    expect(FEED_SOURCE).not.toContain('const updatedDate = new Date()');
    expect(PINTEREST_FEED_XML_SOURCE).toContain('rss version="2.0"');
    expect(PINTEREST_FEED_XML_SOURCE).toContain('xmlns:media="http://search.yahoo.com/mrss/"');
    expect(PINTEREST_FEED_XML_SOURCE).toContain('media:content');
    expect(PINTEREST_FEED_XML_SOURCE).toContain('image/jpeg');
    expect(PINTEREST_FEED_SOURCE).toContain('getPinterestFeedItems()');
    expect(PINTEREST_FEED_SOURCE).toContain('Already-posted manual pins stay out of this feed');
    expect(PINTEREST_FEED_SOURCE).toContain('/pinterest-feed.xml');
    expect(PINTEREST_BOARD_FEED_SOURCE).toContain('getStaticPaths');
    expect(PINTEREST_BOARD_FEED_SOURCE).toContain('pinterestBoards.map');
    expect(PINTEREST_BOARD_FEED_SOURCE).toContain('getPinterestFeedItems(board.slug)');
    expect(PINTEREST_FEED_DATA_SOURCE).toContain('/pinterest/');
    expect(PINTEREST_FEED_DATA_SOURCE).toContain("rssEligible: true");
    expect(PINTEREST_FEED_DATA_SOURCE).toContain("rssEligible: false");
    expect(PINTEREST_FEED_DATA_SOURCE).toContain("status: 'posted'");
    expect(PINTEREST_FEED_DATA_SOURCE).toContain("status: 'rss-ready'");
    expect(PINTEREST_FEED_DATA_SOURCE).toContain("boardSlug: 'free-online-calculators'");
    expect(PINTEREST_FEED_DATA_SOURCE).toContain('/pinterest/free-online-calculators.xml');
    expect(PINTEREST_FEED_DATA_SOURCE).toContain('/tools/watts-to-amps-calculator/');
    expect(PINTEREST_FEED_DATA_SOURCE).toContain('/tools/percentage-calculator/');
    expect(PINTEREST_FEED_DATA_SOURCE).not.toContain('/blog/');
    expect(PACKAGE_JSON.scripts['promotion:pinterest:rss-report']).toBe('node scripts/pinterest-rss-report.mjs');
    expect(PACKAGE_JSON.scripts['promotion:reddit']).toBe('node scripts/reddit-promotion-agent.mjs --all');
    expect(PACKAGE_JSON.scripts['promotion:reddit:quality']).toContain('check-reddit-promotion-quality.mjs');
    expect(PACKAGE_JSON.scripts['promotion:reddit:setup-browser']).toContain('reddit-external-setup.mjs');
    expect(PACKAGE_JSON.scripts['promotion:reddit:publish-profile']).toContain('--confirm-public-post');
    expect(PACKAGE_JSON.scripts['promotion:reddit:verify-profile']).toContain('reddit-verify-profile-post.mjs');
    expect(PACKAGE_JSON.scripts['promotion:weekly-review']).toContain('promotion:pinterest:rss-report');
    expect(PACKAGE_JSON.scripts['promotion:weekly-review']).toContain('promotion:reddit:quality');
    expect(REDDIT_PROMOTION_AGENT_SOURCE).toContain("username: 'accessfreetools'");
    expect(REDDIT_PROMOTION_AGENT_SOURCE).toContain('readCommunityRulesFirst');
    expect(REDDIT_PROMOTION_AGENT_SOURCE).toContain('noCredentialStorage');
    expect(REDDIT_PROMOTION_AGENT_SOURCE).toContain('Disclosure: this is my own project');
    expect(REDDIT_QUALITY_SOURCE).toContain('missing ownership disclosure');
    expect(REDDIT_QUALITY_SOURCE).toContain('too many Access Free Tools links');
    expect(REDDIT_QUALITY_SOURCE).toContain('community-rules reminder');
    expect(REDDIT_EXTERNAL_SETUP_SOURCE).toContain("channel: 'msedge'");
    expect(REDDIT_EXTERNAL_SETUP_SOURCE).toContain('passwordStored: false');
    expect(REDDIT_PROFILE_PUBLISH_SOURCE).toContain('Refusing to publish without --confirm-public-post');
    expect(REDDIT_PROFILE_PUBLISH_SOURCE).toContain('PROFILE_SUBMIT_URL');
    expect(REDDIT_PROFILE_PUBLISH_SOURCE).toContain('passwordStored: false');
    expect(REDDIT_PROFILE_PUBLISH_SOURCE).toContain('Disclosure: this is my own project');
    expect(REDDIT_PROFILE_PUBLISH_SOURCE).toContain('verifyMatchingProfilePostInBrowser');
    expect(REDDIT_PROFILE_PUBLISH_SOURCE).toContain('duplicateSkipped');
    expect(REDDIT_PROFILE_PUBLISH_SOURCE).toContain('shreddit-composer');
    expect(REDDIT_PROFILE_PUBLISH_SOURCE).toContain('verifiedInBrowser');
    expect(REDDIT_PROFILE_PUBLISH_SOURCE).toContain('needsVerification');
    expect(REDDIT_PROFILE_VERIFY_SOURCE).toContain('Matching Reddit profile post is not visible');
    expect(REDDIT_PROFILE_VERIFY_SOURCE).toContain('passwordStored: false');
    expect(REDDIT_PROMOTION_DOC_SOURCE).toContain('Status: active draft-first channel');
    expect(REDDIT_PROMOTION_DOC_SOURCE).toContain('First profile post attempt');
    expect(REDDIT_PROMOTION_DOC_SOURCE).toContain('store the Reddit password');
    expect(REDDIT_PROMOTION_DOC_SOURCE).toContain('https://support.reddithelp.com');
    expect(PROMOTION_QUEUE_SOURCE).toContain('created by the user on 2026-05-07 as `u/accessfreetools`');
    expect(PROMOTION_QUEUE_SOURCE).toContain('Do not treat a Reddit post as posted');
    expect(PROMOTION_QUEUE_SOURCE).toContain('npm run promotion:reddit:quality');
    expect(PACKAGE_JSON.scripts.typecheck).toBe('tsc --noEmit');
    expect(PACKAGE_JSON.scripts['audit:site']).toBe('vitest run src/data/siteContentAudit.test.ts');
    expect(PACKAGE_JSON.scripts['check:links']).toBe('node scripts/check-internal-links.mjs');
    expect(PACKAGE_JSON.scripts['check:site']).toBe('node scripts/check-built-site.mjs');
    expect(PACKAGE_JSON.scripts['check:structured-data']).toBe('node scripts/check-structured-data.mjs');
    expect(PACKAGE_JSON.scripts['check:performance']).toBe('node scripts/check-performance-budget.mjs');
    expect(PACKAGE_JSON.scripts['check:ai-assets']).toBe('node scripts/check-ai-lazy-assets.mjs');
    expect(PACKAGE_JSON.scripts['check:external-links']).toBe('node scripts/check-external-links.mjs');
    expect(PACKAGE_JSON.scripts['check:production-sitemap']).toBe('node scripts/check-production-sitemap.mjs');
    expect(PRODUCTION_SITEMAP_CHECK_SOURCE).toContain('output/search-console-performance.json');
    expect(PRODUCTION_SITEMAP_CHECK_SOURCE).toContain('LEGACY_URLS');
    expect(PRODUCTION_SITEMAP_CHECK_SOURCE).toContain('Hard failures');
    expect(PACKAGE_JSON.scripts['dataforseo:status']).toBe('node scripts/dataforseo-status.mjs');
    expect(PACKAGE_JSON.scripts['dataforseo:status:sandbox']).toBe('node scripts/dataforseo-status.mjs --sandbox');
    expect(PACKAGE_JSON.scripts['test:smoke']).toBe('npm run build && playwright test');
    expect(PACKAGE_JSON.scripts['security:audit']).toBe('npm audit --audit-level=moderate');
    expect(PACKAGE_JSON.scripts.check).toBe(
      'npm run typecheck && npm test && npm run build && npm run check:links && npm run check:site && npm run check:structured-data && npm run check:performance && npm run check:ai-assets && npm run security:audit',
    );
    expect(README_SOURCE).toContain('npm run check');
    expect(DEPLOYMENT_CHECKLIST_SOURCE).toContain('/tools/');
    expect(DEPLOYMENT_CHECKLIST_SOURCE).toContain('/free-calculator-resources/');
    expect(SITE_HEADER_SOURCE).toContain('/free-calculator-resources/');
    expect(LLMS_SOURCE).toContain('Resources hub: https://accessfreetools.com/free-calculator-resources/');
    expect(INDEXNOW_SUBMIT_SOURCE).toContain('/free-calculator-resources/');
  });

  it('keeps DataForSEO automation guarded by status, sandbox, and budget checks', () => {
    expect(DATAFORSEO_LIB_SOURCE).toContain("const SANDBOX_BASE_URL = 'https://sandbox.dataforseo.com/v3'");
    expect(DATAFORSEO_LIB_SOURCE).toContain('KNOWN_STATUS_HINTS');
    expect(DATAFORSEO_LIB_SOURCE).toContain('40204');
    expect(DATAFORSEO_LIB_SOURCE).toContain('x-ratelimit-remaining');
    expect(DATAFORSEO_LIB_SOURCE).toContain('tasks_error');
    expect(DATAFORSEO_STATUS_SOURCE).toContain("getDataForSeoServiceStatus");
    expect(DATAFORSEO_STATUS_SOURCE).toContain("getDataForSeoLabsStatus");
    expect(DATAFORSEO_STATUS_SOURCE).toContain("'dataforseo_labs'");
    expect(SEO_SELF_EVALUATION_SOURCE).toContain('warnBalance');
    expect(SEO_SELF_EVALUATION_SOURCE).toContain('broadResearchStop');
    expect(SEO_SELF_EVALUATION_SOURCE).toContain('LEGACY_REDIRECTS');
    expect(SEO_SELF_EVALUATION_SOURCE).toContain('/categories/calculators/');
    expect(GOOGLE_SEARCH_CENTRAL_NOTES_SOURCE).toContain('https://developers.google.com/search/docs?hl=en');
    expect(GOOGLE_SEARCH_CENTRAL_NOTES_SOURCE).toContain('Server error (5xx)');
    expect(GOOGLE_SEARCH_CENTRAL_NOTES_SOURCE).toContain('/advanced-age-calculator');
    expect(MIDDLEWARE_SOURCE).toContain('LEGACY_REDIRECTS');
    expect(MIDDLEWARE_SOURCE).toContain('/advanced-age-calculator');
    expect(MIDDLEWARE_SOURCE).toContain('/tools/age-calculator/');
    expect(MIDDLEWARE_SOURCE).toContain('/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025');
    expect(MIDDLEWARE_SOURCE).toContain('/tools/ad-revenue-calculator/');
    expect(HTACCESS_SOURCE).toContain('RewriteRule ^advanced-age-calculator/?$ /tools/age-calculator/');
    expect(HTACCESS_SOURCE).toContain(
      'RewriteRule ^maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025/?$ /tools/ad-revenue-calculator/',
    );
    expect(HTACCESS_SOURCE).toContain('RewriteRule ^calculators/?$ /categories/calculators/');
    expect(HTACCESS_SOURCE).toContain('RewriteRule ^deep-research/?$ /categories/ai-tools/');
    expect(SEO_SELF_EVALUATION_SOURCE).toContain('/dataforseo_labs/google/serp_competitors/live');
    expect(SEO_SELF_EVALUATION_SOURCE).toContain('/dataforseo_labs/google/related_keywords/live');
    expect(SEO_SELF_EVALUATION_SOURCE).toContain('Paid keyword research skipped');
    expect(QA_AUTOMATION_PLAN_SOURCE).toContain('Backlinks API is not automated until the account has confirmed access');
    expect(README_SOURCE).toContain('stop broad paid research at `$5`');
  });

  it('keeps roadmap counts aligned with the current public library', () => {
    const publicToolUrlCount = tools.length + toolAliases.length;

    expect(ROADMAP_SOURCE).toContain(`Canonical tool pages: ${tools.length}`);
    expect(ROADMAP_SOURCE).toContain(`Matching guide pages: ${tools.length}`);
    expect(ROADMAP_SOURCE).toContain(`Public tool URLs: ${publicToolUrlCount}`);
    expect(ROADMAP_SOURCE).toContain(`Aliases already covered: ${toolAliases.length}`);
  });

  it('keeps review wording honest between manual, baseline, and alias audits', () => {
    const statusCounts = toolDeepAuditRecords.reduce<Record<string, number>>((counts, record) => {
      counts[record.status] = (counts[record.status] ?? 0) + 1;
      return counts;
    }, {});

    expect(statusCounts['deep-reviewed']).toBe(tools.length);
    expect(statusCounts['baseline-reviewed'] ?? 0).toBe(0);
    expect(statusCounts['alias-reviewed']).toBe(toolAliases.length);
    expect(CALCULATOR_GUIDE_ARTICLE_SOURCE).toContain("auditRecord?.status === 'deep-reviewed'");
    expect(CALCULATOR_GUIDE_ARTICLE_SOURCE).toContain('Reference sources');
  });

  it('tracks the top 25 manual deep-review queue without overclaiming unfinished reviews', () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    const auditStatusBySlug = new Map(toolDeepAuditRecords.map((record) => [record.slug, record.status]));
    const rows = MANUAL_DEEP_REVIEW_PLAN_SOURCE.split('\n').filter((line) => /^\|\s*\d+\s*\|/.test(line));
    const plannedSlugs = rows.map((line) => line.match(/`([^`]+)`/)?.[1]).filter((slug): slug is string => Boolean(slug));
    const duplicatePlanSlugs = findDuplicates(plannedSlugs);
    const issues: string[] = [];

    if (plannedSlugs.length !== 25) {
      issues.push(`manual deep-review plan should track 25 tools, found ${plannedSlugs.length}`);
    }

    if (duplicatePlanSlugs.length > 0) {
      issues.push(`manual deep-review plan has duplicate slugs: ${duplicatePlanSlugs.join(', ')}`);
    }

    for (const slug of plannedSlugs) {
      if (!toolSlugs.has(slug)) {
        issues.push(`${slug} is in the manual deep-review plan but not the tool registry`);
      }
    }

    for (const row of rows) {
      const slug = row.match(/`([^`]+)`/)?.[1];
      const status = row.split('|').map((cell) => cell.trim())[4];

      if (slug && status === 'deep-reviewed' && auditStatusBySlug.get(slug) !== 'deep-reviewed') {
        issues.push(`${slug} is marked deep-reviewed in the plan but not in the audit records`);
      }

      if (slug && status === 'queued' && auditStatusBySlug.get(slug) === 'deep-reviewed') {
        issues.push(`${slug} is queued in the plan but already marked deep-reviewed in audit records`);
      }
    }

    expect(issues).toEqual([]);
  });

  it('states that manual deep review applies to the full tool library, not only the top 25', () => {
    expect(MANUAL_DEEP_REVIEW_PLAN_SOURCE).toContain('Every canonical tool and every alias must eventually receive manual review');
    expect(MANUAL_DEEP_REVIEW_PLAN_SOURCE).toContain('The top 25 list is the first priority batch, not the whole job');
    expect(MANUAL_DEEP_REVIEW_PLAN_SOURCE).toContain('The manual review program does not stop at the top 25');
    expect(MANUAL_DEEP_REVIEW_PLAN_SOURCE).toContain('Finance, tax, credit, loan, and investment calculators');
    expect(MANUAL_DEEP_REVIEW_PLAN_SOURCE).toContain('Health, pregnancy, nutrition, BAC, and body measurement calculators');
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain(`Canonical tools: ${tools.length}`);
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain(`Public tool URLs: ${tools.length + toolAliases.length}`);
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain('Do not change a generated or baseline record to `deep-reviewed` in bulk');
  });

  it('keeps full manual review truthfully complete only after every canonical tool is individually checked', () => {
    expect(manualDeepReviewProgress.canonicalTools).toBe(tools.length);
    expect(manualDeepReviewProgress.aliasUrls).toBe(toolAliases.length);
    expect(manualDeepReviewProgress.publicToolUrls).toBe(tools.length + toolAliases.length);
    expect(manualDeepReviewProgress.deepReviewedCanonicalTools).toBe(tools.length);
    expect(manualDeepReviewProgress.baselineReviewedCanonicalTools).toBe(0);
    expect(manualDeepReviewProgress.aliasReviewedUrls).toBe(toolAliases.length);
    expect(manualDeepReviewProgress.isComplete).toBe(true);
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain('Manual review completion status: complete for the current canonical library');
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain('Do not mark a future full-library manual review complete while any canonical tool remains `baseline-reviewed`');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain(
      `The current ${tools.length}-tool canonical library has completed manual deep-review coverage`,
    );
  });

  it('keeps the complete improvement plan aligned to every requested quality area', () => {
    const requiredPlanSections = [
      'Completion Truth',
      'Priority Order',
      'Manual Deep Review',
      'SEO',
      'Content Quality',
      'Structured Data',
      'Performance',
      'Accessibility',
      'Trust, Legal, And Monetization',
      'Security And Privacy',
      'UX And Visual Design',
      'QA System',
      'Deployment And Production',
      'Analytics And Measurement',
      'Future Tool Creation Standard',
      'Complete Definition Of Done',
    ];

    for (const section of requiredPlanSections) {
      expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain(section);
    }

    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('every Access Free Tools page, not just the top 25 tools');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain(
      `${tools.length} canonical tools and ${toolAliases.length} alias URLs`,
    );
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('LCP: 2.5 seconds');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('INP: 200 ms');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('CLS: 0.1');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('WCAG 2.2 AA');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('Google-certified CMP');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('No resend is needed for the plan itself');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('the current canonical library has full manual review coverage');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('Every new tool must follow the Access Free Tools build order');
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain('Full-library review is complete only when');
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain(`All ${tools.length} canonical tools are manually checked`);
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain(
      `complete manual deep-review coverage for ${tools.length} canonical tools`,
    );
    expect(QA_AUTOMATION_PLAN_SOURCE).toContain('Playwright Visual Smoke Lane');
    expect(QA_AUTOMATION_PLAN_SOURCE).toContain('Internal link validation');
    expect(QA_AUTOMATION_PLAN_SOURCE).toContain('Semantic JSON-LD validation');
    expect(QA_AUTOMATION_PLAN_SOURCE).toContain('Performance budget');
    expect(QA_AUTOMATION_PLAN_SOURCE).toContain('AI lazy-asset validation');
    expect(QA_AUTOMATION_PLAN_SOURCE).toContain('Dependency vulnerability audit');
  });

  it('keeps Privacy, Terms, Contact, and Disclosure ready for ads and affiliate links', () => {
    expect(PRIVACY_POLICY_SOURCE).toContain('Third-party vendors, including Google');
    expect(PRIVACY_POLICY_SOURCE).toContain("Google's use of advertising cookies");
    expect(PRIVACY_POLICY_SOURCE).toContain('Google-certified Consent Management Platform');
    expect(PRIVACY_POLICY_SOURCE).toContain('Google Ads Settings');
    expect(PRIVACY_POLICY_SOURCE).toContain('aboutads.info');
    expect(PRIVACY_POLICY_SOURCE).toContain('affiliate links');
    expect(PRIVACY_POLICY_SOURCE).toContain('If you use the contact form');
    expect(PRIVACY_POLICY_SOURCE).toContain('contact@accessfreetools.com');
    expect(PRIVACY_POLICY_SOURCE).not.toContain(RETIRED_PRIVACY_INBOX);

    expect(TERMS_SOURCE).toContain('Advertising and affiliate links');
    expect(TERMS_SOURCE).toContain('not professional financial, medical, legal, tax, engineering');
    expect(TERMS_SOURCE).toContain('Third-party products and links');
    expect(TERMS_SOURCE).toContain('contact@accessfreetools.com');

    expect(ADVERTISING_DISCLOSURE_SOURCE).toContain('I may');
    expect(ADVERTISING_DISCLOSURE_SOURCE).toContain('earn a commission');
    expect(ADVERTISING_DISCLOSURE_SOURCE).toContain('Affiliate disclosures should appear close to affiliate links');
    expect(ADVERTISING_DISCLOSURE_SOURCE).toContain('Ads, affiliate links, and product previews do not change calculator formulas');

    expect(CONTACT_SOURCE).toContain('contact@accessfreetools.com');
    expect(CONTACT_SOURCE).toContain('action="/api/contact.php"');
    expect(CONTACT_SOURCE).toContain('data-contact-form');
    expect(CONTACT_SOURCE).toContain('mailto:contact@accessfreetools.com');
    expect(CONTACT_SOURCE).not.toContain(RETIRED_PRIVACY_INBOX);
    expect(CONTACT_API_SOURCE).toContain('smtp.hostinger.com');
    expect(CONTACT_API_SOURCE).toContain('SMTP_PASS');
    expect(CONTACT_API_SOURCE).toContain('nodemailer.createTransport');
    expect(CONTACT_PHP_SOURCE).toContain("CONTACT_TO = 'contact@accessfreetools.com'");
    expect(CONTACT_PHP_SOURCE).toContain('FILTER_VALIDATE_EMAIL');
    expect(CONTACT_PHP_SOURCE).toContain('check_rate_limit');
    expect(ASTRO_CONFIG_SOURCE).toContain("output: 'server'");
    expect(ASTRO_CONFIG_SOURCE).toContain("mode: 'standalone'");
    expect(PACKAGE_JSON_SOURCE).toContain('"start": "node ./app.js"');
    expect(MIRROR_STATIC_OUTPUT_SOURCE).toContain("join(distDir, 'app.js')");
    expect(MIRROR_STATIC_OUTPUT_SOURCE).toContain("import './server/entry.mjs'");

    expect(LEGAL_MONETIZATION_READINESS_SOURCE).toContain('Google AdSense Checklist');
    expect(LEGAL_MONETIZATION_READINESS_SOURCE).toContain('Affiliate Checklist');
    expect(DEPLOYMENT_CHECKLIST_SOURCE).toContain('/advertising-disclosure/');
  });
});
