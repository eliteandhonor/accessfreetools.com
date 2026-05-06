import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';

const DEFAULT_TARGET = resolve('output', 'promotion', 'medium');

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
  'cutting-edge',
  'transform the way',
];

const qualityRules = {
  'right-free-online-calculator': {
    primaryPhrase: 'free online calculator',
    minNumbers: 4,
    requiredIdeas: ['question', 'input', 'result', 'example'],
  },
  'percentage-calculator-discounts': {
    primaryPhrase: 'percentage',
    minNumbers: 4,
    requiredIdeas: ['discount', 'percent change', 'original'],
  },
  'wallpaper-waste-percent': {
    primaryPhrase: 'waste percent',
    minNumbers: 3,
    requiredIdeas: ['waste', 'roll', 'pattern'],
  },
  'browser-only-ai-tools-privacy': {
    primaryPhrase: 'browser-only ai',
    minNumbers: 1,
    allowAiMentions: true,
    requiredIdeas: ['privacy', 'download', 'limits'],
  },
  'mortgage-payment-before-shopping': {
    primaryPhrase: 'mortgage',
    minNumbers: 3,
    requiredIdeas: ['payment', 'down payment', 'lender'],
  },
  'bmi-result-limits': {
    primaryPhrase: 'bmi',
    minNumbers: 2,
    requiredIdeas: ['screening', 'height', 'weight'],
  },
  'watts-to-amps-safety': {
    primaryPhrase: 'watts to amps',
    minNumbers: 4,
    requiredIdeas: ['voltage', 'amps', 'safety'],
  },
  'ad-revenue-calculator-creator': {
    primaryPhrase: 'ad revenue',
    minNumbers: 4,
    requiredIdeas: ['rpm', 'impressions', 'estimate'],
  },
};

function parseArgs() {
  const target = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_TARGET;
  return { target };
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

function getPublicArticle(content) {
  const withoutFrontmatter = stripFrontmatter(content);
  const start = withoutFrontmatter.indexOf('# ');
  const end = withoutFrontmatter.indexOf('\n## Publisher checklist');

  if (start === -1) {
    return withoutFrontmatter.trim();
  }

  if (end === -1 || end <= start) {
    return withoutFrontmatter.slice(start).trim();
  }

  return withoutFrontmatter.slice(start, end).trim();
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

function sentenceCount(text) {
  return Math.max(1, (text.match(/[.!?](?:\s|$)/g) ?? []).length);
}

function countSyllables(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  if (clean.length <= 3) return 1;

  const withoutSilentE = clean.replace(/(?:[^l]e|ed|es)$/, '');
  const groups = withoutSilentE.match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

function fleschKincaidGrade(text) {
  const words = wordsFrom(text).filter((word) => /[A-Za-z]/.test(word));
  const sentences = sentenceCount(text);
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);

  if (words.length === 0) return 0;

  return 0.39 * (words.length / sentences) + 11.8 * (syllables / words.length) - 15.59;
}

function extractTitle(article) {
  return article.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '';
}

function extractHeadings(article) {
  return [...article.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
}

function paragraphWordCounts(article) {
  return article
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .filter((paragraph) => !paragraph.startsWith('#'))
    .filter((paragraph) => !paragraph.startsWith('- '))
    .filter((paragraph) => !paragraph.startsWith('Tool or guide:'))
    .map((paragraph) => wordsFrom(plainText(paragraph)).length);
}

function countNumbers(article) {
  return (article.replace(/https?:\/\/\S+/g, ' ').match(/\b\d+(?:[,.]\d+)?(?:\s?percent|%)?\b/gi) ?? []).length;
}

function countSecondPerson(text) {
  return (text.match(/\b(you|your|you're|you'll|you've)\b/gi) ?? []).length;
}

function containsAllIdeas(text, ideas) {
  const lower = text.toLowerCase();
  return ideas.filter((idea) => !lower.includes(idea.toLowerCase()));
}

function lintArticle(file) {
  const slug = basename(file, '.md');
  const rules = qualityRules[slug] ?? {
    primaryPhrase: slug.split('-').slice(0, 3).join(' '),
    minNumbers: 1,
    requiredIdeas: ['example', 'result', 'limit'],
  };
  const content = readFileSync(file, 'utf8');
  const article = getPublicArticle(content);
  const text = plainText(article);
  const lower = text.toLowerCase();
  const title = extractTitle(article);
  const headings = extractHeadings(article);
  const words = wordsFrom(text);
  const grade = fleschKincaidGrade(text);
  const paragraphCounts = paragraphWordCounts(article);
  const errors = [];
  const warnings = [];

  if (title.length < 35 || title.length > 85) {
    errors.push(`Title should be 35-85 characters; found ${title.length}.`);
  }

  if (!lower.includes(rules.primaryPhrase.toLowerCase())) {
    errors.push(`Primary phrase missing from public article: "${rules.primaryPhrase}".`);
  }

  if (words.length < 520 || words.length > 1200) {
    errors.push(`Public article should be 520-1200 words; found ${words.length}.`);
  }

  if (headings.length < 6) {
    errors.push(`Use at least 6 clear H2 sections; found ${headings.length}.`);
  }

  if (!headings.some((heading) => /example/i.test(heading)) && !/\bexample\b/i.test(text)) {
    errors.push('Article needs a realistic example section.');
  }

  if (!/Disclosure: This companion post is from Access Free Tools\./.test(article)) {
    errors.push('Missing Access Free Tools disclosure line.');
  }

  if (!/Tool or guide:\s+https:\/\/accessfreetools\.com\//.test(article)) {
    errors.push('Missing source tool or guide URL.');
  }

  if (!headings.includes('What to check before trusting the result')) {
    errors.push('Missing the result-trust limits section.');
  }

  if (!headings.includes('Try the original tool')) {
    errors.push('Missing the original-tool CTA section.');
  }

  const missingIdeas = containsAllIdeas(text, rules.requiredIdeas);
  if (missingIdeas.length > 0) {
    errors.push(`Missing required topic idea(s): ${missingIdeas.join(', ')}.`);
  }

  const numberCount = countNumbers(article);
  if (numberCount < rules.minNumbers) {
    errors.push(`Needs more concrete numbers/examples; found ${numberCount}, expected ${rules.minNumbers}.`);
  }

  const secondPersonCount = countSecondPerson(text);
  if (secondPersonCount < 4) {
    errors.push(`Needs a more direct reader voice; found ${secondPersonCount} second-person words.`);
  }

  const longParagraph = Math.max(0, ...paragraphCounts);
  if (longParagraph > 95) {
    errors.push(`Paragraphs are too dense; longest paragraph is ${longParagraph} words.`);
  }

  for (const phrase of bannedPhrases) {
    if (lower.includes(phrase)) {
      errors.push(`Banned generic/hype phrase found: "${phrase}".`);
    }
  }

  if (!rules.allowAiMentions && /\bAI\b|browser-only ai/i.test(article)) {
    errors.push('Non-AI Medium posts should not drift into AI language.');
  }

  if (grade > 10.5) {
    errors.push(`Reading grade is too high for the target voice: ${grade.toFixed(1)}.`);
  } else if (grade > 9.5) {
    warnings.push(`Reading grade is close to the limit: ${grade.toFixed(1)}.`);
  }

  return {
    file,
    slug,
    title,
    wordCount: words.length,
    headingCount: headings.length,
    numberCount,
    secondPersonCount,
    readingGrade: Number(grade.toFixed(1)),
    errors,
    warnings,
  };
}

function main() {
  const { target } = parseArgs();
  const files = listMarkdownFiles(target);
  const results = files.map(lintArticle);
  let errorCount = 0;
  let warningCount = 0;

  for (const result of results) {
    errorCount += result.errors.length;
    warningCount += result.warnings.length;
    console.log(
      `${result.slug}: ${result.wordCount} words, ${result.headingCount} H2s, grade ${result.readingGrade}, ${result.numberCount} numbers`,
    );

    for (const warning of result.warnings) {
      console.log(`  warn: ${warning}`);
    }

    for (const error of result.errors) {
      console.log(`  error: ${error}`);
    }
  }

  if (errorCount > 0) {
    console.error(`Medium writing quality failed: ${errorCount} error(s), ${warningCount} warning(s).`);
    process.exit(1);
  }

  console.log(`Medium writing quality passed: ${results.length} draft(s), ${warningCount} warning(s).`);
}

main();
