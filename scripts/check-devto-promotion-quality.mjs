import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';

const DEFAULT_TARGET = resolve('output', 'promotion', 'devto', 'drafts');
const DEFAULT_REPORT_PATH = resolve('output', 'promotion', 'devto', 'devto-quality-report.json');
const MIN_SCORE = 88;
const MIN_WORDS = 420;
const MAX_WORDS = 1100;
const ALLOWED_TAGS = new Set([
  'ai',
  'beginners',
  'debugging',
  'javascript',
  'markdown',
  'productivity',
  'tools',
  'webdev',
]);

const bannedPhrases = [
  "in today's digital world",
  'ultimate guide',
  'game changer',
  'revolutionary',
  'unlock the power',
  'seamlessly',
  'delve',
  'leverage',
  'robust',
  'supercharge',
  'guaranteed',
];

const agentFacingPhrases = [
  'agent should',
  'this draft should',
  'what to check before posting',
  'quality gate',
  'reader-facing',
  'promotion agent',
  'seo agent',
  'verify the public dev url',
];

function parseArgs() {
  const positional = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
  const reportArg = process.argv.find((arg) => arg.startsWith('--report='));

  return {
    target: positional ? resolve(positional) : DEFAULT_TARGET,
    reportPath: resolve(reportArg?.slice('--report='.length) ?? DEFAULT_REPORT_PATH),
  };
}

function listMarkdownFiles(target) {
  if (!existsSync(target)) {
    throw new Error(`Target does not exist: ${target}`);
  }

  const stats = statSync(target);
  if (stats.isFile()) return [target];

  return readdirSync(target)
    .filter((file) => extname(file).toLowerCase() === '.md')
    .filter((file) => !file.startsWith('_'))
    .map((file) => join(target, file));
}

function frontmatterValue(content, key) {
  const quoted = content.match(new RegExp(`^${key}:\\s*"([^"\\r\\n]+)"\\s*$`, 'm'));
  if (quoted) return quoted[1].trim();
  const unquoted = content.match(new RegExp(`^${key}:\\s*([^\\r\\n]+)\\s*$`, 'm'));
  return unquoted?.[1]?.trim() ?? '';
}

function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

function plainText(markdown) {
  return markdown
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/^#+\s+/gm, '')
    .replace(/^-\s+/gm, '')
    .replace(/[*_`[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordsFrom(text) {
  return text.match(/[A-Za-z0-9]+(?:'[A-Za-z]+)?/g) ?? [];
}

function accessLinks(content) {
  return [
    ...new Set(
      [...content.matchAll(/https:\/\/accessfreetools\.com\/[^\s)`"<>]+/g)].map((match) =>
        match[0].replace(/[).,;:!?]+$/g, ''),
      ),
    ),
  ].filter((url) => !/\.(?:jpg|jpeg|png|webp|gif|svg)$/i.test(url));
}

function countNumbers(text) {
  return (text.match(/\b\d+(?:[,.]\d+)?(?:\s?percent|%)?\b/gi) ?? []).length;
}

function analyze(file) {
  const content = readFileSync(file, 'utf8');
  const article = stripFrontmatter(content);
  const text = plainText(article);
  const lower = text.toLowerCase();
  const words = wordsFrom(text);
  const links = accessLinks(content);
  const title = frontmatterValue(content, 'title');
  const description = frontmatterValue(content, 'description');
  const canonicalUrl = frontmatterValue(content, 'canonical_url');
  const coverImage = frontmatterValue(content, 'cover_image');
  const published = frontmatterValue(content, 'published');
  const tags = frontmatterValue(content, 'tags')
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  const issues = [];
  const warnings = [];
  let score = 100;

  const bannedHits = bannedPhrases.filter((phrase) => lower.includes(phrase));
  const agentHits = agentFacingPhrases.filter((phrase) => lower.includes(phrase));
  const unknownTags = tags.filter((tag) => !ALLOWED_TAGS.has(tag));

  if (title.length < 45 || title.length > 85) {
    issues.push(`title should be 45-85 characters; found ${title.length}`);
    score -= 10;
  }

  if (description.length < 90 || description.length > 170) {
    issues.push(`description should be 90-170 characters; found ${description.length}`);
    score -= 10;
  }

  if (published !== 'false') {
    issues.push('draft frontmatter should keep published: false until the publish command is intentionally used');
    score -= 20;
  }

  if (tags.length < 3 || tags.length > 4) {
    issues.push(`expected 3-4 DEV tags; found ${tags.length}`);
    score -= 10;
  }

  if (unknownTags.length) {
    issues.push(`unsupported or too-broad tag(s): ${unknownTags.join(', ')}`);
    score -= 8;
  }

  if (!canonicalUrl.startsWith('https://accessfreetools.com/blog/')) {
    issues.push('canonical_url should point to the matching Access Free Tools guide');
    score -= 16;
  }

  if (!coverImage.startsWith('https://accessfreetools.com/')) {
    issues.push('cover_image should be a public Access Free Tools image URL');
    score -= 8;
  }

  if (words.length < MIN_WORDS || words.length > MAX_WORDS) {
    issues.push(`article should be ${MIN_WORDS}-${MAX_WORDS} words; found ${words.length}`);
    score -= 14;
  }

  if (links.length < 2) {
    issues.push(`expected at least 2 Access Free Tools links, found ${links.length}`);
    score -= 14;
  }

  if (!/Disclosure: I work on Access Free Tools\./.test(article)) {
    issues.push('missing Access Free Tools ownership disclosure');
    score -= 14;
  }

  if (!/\b(example|suppose|try|say)\b/i.test(article) || countNumbers(text) < 2) {
    issues.push('needs a concrete example with numbers or specific values');
    score -= 12;
  }

  if (!/\b(mistake|fails|broken|risk|cost|privacy|waste|debug)\b/i.test(article)) {
    issues.push('opening needs a real problem, risk, mistake, or tension');
    score -= 10;
  }

  if (bannedHits.length) {
    issues.push(`banned generic/hype phrase(s): ${bannedHits.join(', ')}`);
    score -= bannedHits.length * 10;
  }

  if (agentHits.length) {
    issues.push(`agent-facing phrase(s): ${agentHits.join(', ')}`);
    score -= agentHits.length * 20;
  }

  if (!/\b(canonical|original guide|full guide)\b/i.test(article)) {
    warnings.push('does not explain the original guide/canonical relationship');
    score -= 4;
  }

  return {
    file,
    name: basename(file),
    title,
    wordCount: words.length,
    tags,
    canonicalUrl,
    coverImage,
    accessFreeToolsLinks: links,
    numberCount: countNumbers(text),
    score: Math.max(0, score),
    passed: score >= MIN_SCORE && issues.length === 0,
    issues,
    warnings,
  };
}

function main() {
  const options = parseArgs();
  const files = listMarkdownFiles(options.target);
  const results = files.map(analyze);
  const failed = results.filter((result) => !result.passed);
  const report = {
    generatedAt: new Date().toISOString(),
    target: options.target,
    minScore: MIN_SCORE,
    totals: {
      files: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      warnings: results.reduce((total, result) => total + result.warnings.length, 0),
    },
    results,
  };

  mkdirSync(dirname(options.reportPath), { recursive: true });
  writeFileSync(options.reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Checked ${results.length} DEV Community draft(s).`);
  console.log(`Passed: ${report.totals.passed}`);
  console.log(`Failed: ${report.totals.failed}`);
  console.log(`Report: ${options.reportPath}`);

  if (failed.length) {
    for (const result of failed) {
      console.error(`${result.name}: ${result.issues.join('; ')}`);
    }
    process.exitCode = 1;
  }
}

main();
