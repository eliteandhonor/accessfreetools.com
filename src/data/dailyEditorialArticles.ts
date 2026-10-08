import { z } from 'zod';
import catalog from './dailyEditorialArticles.json';

// This is the public projection. Full source text, evidence quotes, model
// responses, and review receipts belong in the pipeline's durable research state.
export function isSafeEditorialSourceUrl(value: string): boolean {
  try {
    if (value.includes('\\')) return false;
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === 'https:' && !url.username && !url.password &&
      (!url.port || url.port === '443') && host.includes('.') &&
      !/^[\d.]+$/.test(host) && !host.includes(':') &&
      !/(^|\.)(localhost|local|internal|test|invalid|example)$/.test(host);
  } catch {
    return false;
  }
}

const sourceUrl = z.string().max(2048).refine(isSafeEditorialSourceUrl, 'Expected a public HTTPS source URL');
const timestamp = z.string().refine((value) => {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return false;
  const date = new Date(value);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 19) === value.slice(0, 19);
}, 'Expected a valid UTC ISO timestamp');
const shortText = (max: number) => z.string().trim().min(1).max(max);
const sourceId = z.string().regex(/^[a-z][a-z0-9-]{0,63}$/);

export const dailyEditorialArticleSchema = z.strictObject({
  schemaVersion: z.literal(1),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: shortText(150),
  summary: shortText(400),
  problem: shortText(1000),
  project: z.strictObject({
    fullName: z.string().regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/).max(200),
    url: sourceUrl,
    commit: z.string().regex(/^[a-f0-9]{40}$/),
    license: shortText(100),
    release: z.strictObject({ tag: shortText(100), publishedAt: timestamp }).nullable(),
  }),
  researchedAt: timestamp,
  publishedAt: timestamp,
  sections: z.array(z.strictObject({
    heading: shortText(150),
    paragraphs: z.array(z.strictObject({
      text: shortText(3000),
      sourceIds: z.array(sourceId).max(12),
    })).min(1).max(12),
  })).min(1).max(16),
  sources: z.array(z.strictObject({
    id: sourceId,
    kind: z.enum(['readme', 'license', 'release', 'docs', 'metadata']),
    url: sourceUrl,
    fetchedAt: timestamp,
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  })).min(2).max(25),
}).superRefine((article, context) => {
  const fail = (message: string) => context.addIssue({ code: 'custom', message });
  if (article.project.url !== `https://github.com/${article.project.fullName}`) {
    fail('The project URL must identify the exact GitHub repository');
  }
  const ids = new Set(article.sources.map((source) => source.id));
  if (ids.size !== article.sources.length) fail('Source IDs must be unique');
  for (const kind of ['readme', 'license']) {
    if (!article.sources.some((source) => source.kind === kind)) fail(`Missing primary ${kind} source`);
  }
  for (const paragraph of article.sections.flatMap((section) => section.paragraphs)) {
    if (new Set(paragraph.sourceIds).size !== paragraph.sourceIds.length) fail('Paragraph source IDs must be unique');
    if (paragraph.sourceIds.some((id) => !ids.has(id))) fail('Paragraph references an unknown source');
  }
  if (Date.parse(article.researchedAt) > Date.parse(article.publishedAt)) fail('Research must precede publication');
  if (article.sources.some((source) => Date.parse(source.fetchedAt) > Date.parse(article.researchedAt))) {
    fail('Source fetches must precede the recorded research time');
  }
  if (article.project.release && Date.parse(article.project.release.publishedAt) > Date.parse(article.researchedAt)) {
    fail('The linked release must exist at the research time');
  }
});

export type DailyEditorialArticle = z.infer<typeof dailyEditorialArticleSchema>;

export function parseDailyEditorialArticles(value: unknown): DailyEditorialArticle[] {
  const articles = z.array(dailyEditorialArticleSchema).parse(value);
  if (new Set(articles.map((article) => article.slug)).size !== articles.length) {
    throw new Error('Daily editorial slugs must be unique');
  }
  return articles;
}

export const dailyEditorialArticles = parseDailyEditorialArticles(catalog);

export function getDailyEditorialArticle(slug: string) {
  return dailyEditorialArticles.find((article) => article.slug === slug);
}

export function getDailyEditorialImage(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid daily article image slug');
  return {
    imagePath: `/social/daily-${slug}.png`,
    webpPath: `/social/daily-${slug}.webp`,
    alt: 'Original diagram linking a practical problem, a GitHub project, and a decision to evaluate it.',
    caption: 'Original Access Free Tools conceptual diagram. This is an illustration, not a project screenshot or a test result.',
  };
}
