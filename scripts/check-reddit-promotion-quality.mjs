import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';

const DEFAULT_TARGET = resolve('output', 'promotion', 'reddit', 'drafts');
const DEFAULT_REPORT_PATH = resolve('output', 'promotion', 'reddit-quality-report.json');
const MIN_OVERALL = 85;

const bannedPhrases = [
  'guaranteed',
  'make money fast',
  'secret hack',
  'upvote',
  'viral',
  'best tool on the internet',
  'ultimate guide',
  'game changer',
  'revolutionary',
  'spam',
];

const riskLimits = {
  finance: ['educational', 'estimate', 'not financial advice', 'lender'],
  money: ['estimate', 'does not promise earnings', 'not financial advice'],
  health: ['educational', 'not medical advice', 'screening'],
  electrical: ['qualified', 'code', 'learning estimate', 'safety'],
  construction: ['estimate', 'not a structural design', 'building approval'],
  'ai/privacy': ['privacy', 'browser', 'sensitive'],
};

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
  if (stats.isFile()) {
    return [target];
  }

  return readdirSync(target)
    .filter((file) => extname(file).toLowerCase() === '.md')
    .filter((file) => !file.startsWith('_'))
    .map((file) => join(target, file));
}

function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

function frontmatterValue(content, key) {
  const match = content.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match?.[1]?.trim() ?? '';
}

function wordCount(text) {
  return (text.match(/[A-Za-z0-9]+(?:'[A-Za-z]+)?/g) ?? []).length;
}

function uniqueParagraphRatio(text) {
  const paragraphs = text
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim().toLowerCase())
    .filter((paragraph) => paragraph.length > 35);

  if (paragraphs.length === 0) return 1;
  return new Set(paragraphs).size / paragraphs.length;
}

function analyze(file) {
  const content = readFileSync(file, 'utf8');
  const article = stripFrontmatter(content);
  const lower = article.toLowerCase();
  const risk = frontmatterValue(content, 'risk').toLowerCase();
  const issues = [];
  let score = 100;

  const urls = article.match(/https?:\/\/\S+/g) ?? [];
  const accessUrls = urls.filter((url) => url.includes('accessfreetools.com'));
  const hasDisclosure = /i work on access free tools|my own project|disclosure:/i.test(article);
  const saysRules = /community rules|read the community rules|rules allow/i.test(article);
  const saysUsefulWithoutLink = /without the link|answer.*before linking|explanation above should still help/i.test(article);
  const words = wordCount(article);
  const repeatedRatio = uniqueParagraphRatio(article);
  const bannedHits = bannedPhrases.filter((phrase) => lower.includes(phrase));

  if (accessUrls.length > 1) {
    issues.push(`too many Access Free Tools links (${accessUrls.length})`);
    score -= 18;
  }

  if (urls.length > 2) {
    issues.push(`too many total links (${urls.length})`);
    score -= 8;
  }

  if (!hasDisclosure) {
    issues.push('missing ownership disclosure');
    score -= 22;
  }

  if (!saysRules) {
    issues.push('missing community-rules reminder');
    score -= 16;
  }

  if (!saysUsefulWithoutLink) {
    issues.push('missing useful-without-the-link reminder');
    score -= 16;
  }

  if (words < 110) {
    issues.push(`too short to be useful (${words} words)`);
    score -= 12;
  }

  if (words > 650) {
    issues.push(`too long for a normal Reddit reply (${words} words)`);
    score -= 8;
  }

  if (repeatedRatio < 0.85) {
    issues.push('paragraphs look repetitive');
    score -= 10;
  }

  if (bannedHits.length > 0) {
    issues.push(`banned promotional phrase(s): ${bannedHits.join(', ')}`);
    score -= 18;
  }

  for (const [riskKey, requiredTerms] of Object.entries(riskLimits)) {
    if (!risk.includes(riskKey)) continue;

    const hasAnyRiskTerm = requiredTerms.some((term) => lower.includes(term));
    if (!hasAnyRiskTerm) {
      issues.push(`missing plain limitation wording for ${riskKey} topic`);
      score -= 18;
    }
  }

  return {
    file,
    name: basename(file),
    risk,
    words,
    linkCount: urls.length,
    accessFreeToolsLinkCount: accessUrls.length,
    score: Math.max(0, score),
    passed: score >= MIN_OVERALL && issues.length === 0,
    issues,
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
    minOverall: MIN_OVERALL,
    totals: {
      files: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
    },
    results,
  };

  mkdirSync(dirname(options.reportPath), { recursive: true });
  writeFileSync(options.reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Checked ${results.length} Reddit promotion draft(s).`);
  console.log(`Passed: ${report.totals.passed}`);
  console.log(`Failed: ${report.totals.failed}`);
  console.log(`Report: ${options.reportPath}`);

  if (failed.length > 0) {
    for (const result of failed) {
      console.error(`${result.name}: ${result.issues.join('; ')}`);
    }
    process.exitCode = 1;
  }
}

main();
