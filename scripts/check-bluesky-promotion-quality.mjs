import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';

const DEFAULT_TARGET = resolve('output', 'promotion', 'bluesky', 'drafts');
const DEFAULT_REPORT_PATH = resolve('output', 'promotion', 'bluesky', 'bluesky-quality-report.json');
const MAX_POST_CHARS = 300;
const MIN_SCORE = 90;

const bannedPhrases = [
  'guaranteed',
  'make money fast',
  'secret hack',
  'viral',
  'best tool on the internet',
  'ultimate guide',
  'game changer',
  'revolutionary',
  'no risk',
];

const agentFacingPhrases = [
  'agent should',
  'this draft should',
  'quality gate',
  'reader-facing',
  'promotion agent',
  'seo agent',
];

const usefulWords = [
  'check',
  'estimate',
  'before',
  'mistake',
  'privacy',
  'planning',
  'formula',
  'example',
  'guide',
  'explains',
  'use',
];

const riskLimits = {
  finance: ['estimate', 'planning', 'not a promise', 'not financial advice'],
  money: ['estimate', 'does not promise', 'not guaranteed', 'not a promise'],
  electrical: ['learning estimate', 'code', 'qualified', 'safety', 'not electrical code'],
  construction: ['estimate', 'not structural', 'building approval', 'not structural approval'],
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

function frontmatterValue(content, key) {
  const match = content.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match?.[1]?.trim() ?? '';
}

function postText(content) {
  const match = content.match(/## Post Text\r?\n\r?\n([\s\S]*?)(?:\r?\n## |\s*$)/);
  return match?.[1]?.trim() ?? '';
}

function analyze(file) {
  const content = readFileSync(file, 'utf8');
  const text = postText(content);
  const lower = text.toLowerCase();
  const risk = frontmatterValue(content, 'risk').toLowerCase();
  const issues = [];
  let score = 100;

  const urls = text.match(/https?:\/\/\S+/g) ?? [];
  const accessUrls = urls.filter((url) => url.includes('accessfreetools.com'));
  const tags = text.match(/#[A-Za-z][A-Za-z0-9]+/g) ?? [];
  const bannedHits = bannedPhrases.filter((phrase) => lower.includes(phrase));
  const agentHits = agentFacingPhrases.filter((phrase) => lower.includes(phrase));
  const usefulHits = usefulWords.filter((word) => lower.includes(word));
  const chars = [...text].length;

  if (!text) {
    issues.push('missing post text');
    score -= 40;
  }

  if (chars > MAX_POST_CHARS) {
    issues.push(`post is too long for Bluesky (${chars}/${MAX_POST_CHARS} characters)`);
    score -= 22;
  }

  if (accessUrls.length !== 1) {
    issues.push(`expected exactly one Access Free Tools link, found ${accessUrls.length}`);
    score -= 18;
  }

  if (urls.length > 1) {
    issues.push(`too many total links (${urls.length})`);
    score -= 12;
  }

  if (tags.length < 1 || tags.length > 3) {
    issues.push(`expected 1-3 focused hashtags, found ${tags.length}`);
    score -= 8;
  }

  if (usefulHits.length < 2) {
    issues.push('post needs a useful reason to read beyond the link');
    score -= 12;
  }

  if (bannedHits.length > 0) {
    issues.push(`banned promotional phrase(s): ${bannedHits.join(', ')}`);
    score -= 18;
  }

  if (agentHits.length > 0) {
    issues.push(`agent-facing phrase(s): ${agentHits.join(', ')}`);
    score -= 24;
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
    characters: chars,
    linkCount: urls.length,
    accessFreeToolsLinkCount: accessUrls.length,
    tagCount: tags.length,
    score: Math.max(0, score),
    passed: score >= MIN_SCORE && issues.length === 0,
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
    maxPostCharacters: MAX_POST_CHARS,
    minScore: MIN_SCORE,
    totals: {
      files: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
    },
    results,
  };

  mkdirSync(dirname(options.reportPath), { recursive: true });
  writeFileSync(options.reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Checked ${results.length} Bluesky promotion draft(s).`);
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
