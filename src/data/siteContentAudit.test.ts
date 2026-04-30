import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

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
const TOOLS_LAUNCHPAD_SOURCE = readFileSync(
  fileURLToPath(new URL('../components/ToolsLaunchpad.tsx', import.meta.url)),
  'utf8',
);
const SITEMAP_SOURCE = readFileSync(
  fileURLToPath(new URL('../pages/sitemap.xml.ts', import.meta.url)),
  'utf8',
);
const FEED_SOURCE = readFileSync(fileURLToPath(new URL('../pages/feed.xml.ts', import.meta.url)), 'utf8');
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

  it('keeps launchpad and structured data scalable as the library grows', () => {
    expect(TOOLS_LAUNCHPAD_SOURCE).toContain('const INITIAL_VISIBLE_TOOL_LIMIT = 96');
    expect(TOOLS_LAUNCHPAD_SOURCE).toContain('Show all');
    expect(TOOLS_INDEX_SOURCE).toContain('maxItems={100}');
    expect(TOOLS_INDEX_SOURCE).toContain('client:load');
    expect(TOOLS_INDEX_SOURCE).not.toContain('client:idle');
  });

  it('keeps sitemap freshness and release commands guarded', () => {
    expect(SITEMAP_SOURCE).toContain('new Date().toISOString().slice(0, 10)');
    expect(SITEMAP_SOURCE).not.toContain("const lastmod = '2026");
    expect(FEED_SOURCE).toContain('const updatedDate = new Date()');
    expect(FEED_SOURCE).not.toContain("new Date('2026");
    expect(SITEMAP_SOURCE).toContain("'/advertising-disclosure/'");
    expect(PACKAGE_JSON.scripts.typecheck).toBe('tsc --noEmit');
    expect(PACKAGE_JSON.scripts['audit:site']).toBe('vitest run src/data/siteContentAudit.test.ts');
    expect(PACKAGE_JSON.scripts['check:links']).toBe('node scripts/check-internal-links.mjs');
    expect(PACKAGE_JSON.scripts['check:structured-data']).toBe('node scripts/check-structured-data.mjs');
    expect(PACKAGE_JSON.scripts['security:audit']).toBe('npm audit --audit-level=moderate');
    expect(PACKAGE_JSON.scripts.check).toBe(
      'npm run typecheck && npm test && npm run build && npm run check:links && npm run check:structured-data && npm run security:audit',
    );
    expect(README_SOURCE).toContain('npm run check');
    expect(DEPLOYMENT_CHECKLIST_SOURCE).toContain('/tools/');
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
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain('Canonical tools: 234');
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain('Public tool URLs: 238');
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
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('The current 234-tool canonical library has completed manual deep-review coverage');
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
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('234 canonical tools and 4 alias URLs');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('LCP: 2.5 seconds');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('INP: 200 ms');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('CLS: 0.1');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('WCAG 2.2 AA');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('Google-certified CMP');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('No resend is needed for the plan itself');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('the current canonical library has full manual review coverage');
    expect(FULL_SITE_IMPROVEMENT_PLAN_SOURCE).toContain('Every new tool must follow the Access Free Tools build order');
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain('Full-library review is complete only when');
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain('All 234 canonical tools are manually checked');
    expect(ALL_TOOLS_REVIEW_REGISTER_SOURCE).toContain('complete manual deep-review coverage for 234 canonical tools');
    expect(QA_AUTOMATION_PLAN_SOURCE).toContain('Playwright Visual Smoke Lane');
    expect(QA_AUTOMATION_PLAN_SOURCE).toContain('Internal link validation');
    expect(QA_AUTOMATION_PLAN_SOURCE).toContain('JSON-LD parse validation');
    expect(QA_AUTOMATION_PLAN_SOURCE).toContain('Dependency vulnerability audit');
  });

  it('keeps Privacy, Terms, Contact, and Disclosure ready for ads and affiliate links', () => {
    expect(PRIVACY_POLICY_SOURCE).toContain('Third-party vendors, including Google');
    expect(PRIVACY_POLICY_SOURCE).toContain("Google's use of advertising cookies");
    expect(PRIVACY_POLICY_SOURCE).toContain('Google-certified Consent Management Platform');
    expect(PRIVACY_POLICY_SOURCE).toContain('Google Ads Settings');
    expect(PRIVACY_POLICY_SOURCE).toContain('aboutads.info');
    expect(PRIVACY_POLICY_SOURCE).toContain('affiliate links');
    expect(PRIVACY_POLICY_SOURCE).toContain('privacy@accessfreetools.com');

    expect(TERMS_SOURCE).toContain('Advertising and affiliate links');
    expect(TERMS_SOURCE).toContain('not professional financial, medical, legal, tax, engineering');
    expect(TERMS_SOURCE).toContain('Third-party products and links');
    expect(TERMS_SOURCE).toContain('contact@accessfreetools.com');

    expect(ADVERTISING_DISCLOSURE_SOURCE).toContain('I may');
    expect(ADVERTISING_DISCLOSURE_SOURCE).toContain('earn a commission');
    expect(ADVERTISING_DISCLOSURE_SOURCE).toContain('Affiliate disclosures should appear close to affiliate links');
    expect(ADVERTISING_DISCLOSURE_SOURCE).toContain('Ads, affiliate links, and product previews do not change calculator formulas');

    expect(CONTACT_SOURCE).toContain('contact@accessfreetools.com');
    expect(CONTACT_SOURCE).toContain('privacy@accessfreetools.com');

    expect(LEGAL_MONETIZATION_READINESS_SOURCE).toContain('Google AdSense Checklist');
    expect(LEGAL_MONETIZATION_READINESS_SOURCE).toContain('Affiliate Checklist');
    expect(DEPLOYMENT_CHECKLIST_SOURCE).toContain('/advertising-disclosure/');
  });
});
