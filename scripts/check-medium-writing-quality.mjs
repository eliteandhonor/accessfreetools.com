import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { analyzeWritingText, findSharedSlopHits } from './lib/writing-quality-rules.mjs';

const DEFAULT_TARGET = resolve('output', 'promotion', 'medium');
const DEFAULT_REPORT_PATH = resolve('output', 'promotion', 'medium-quality-report.json');
const HERO_ASSET_REPORT_PATH = resolve('output', 'promotion', 'medium-hero-assets.json');

const minScores = {
  seo: 80,
  originality: 75,
  humanInterest: 75,
  readerDesire: 82,
  overall: 82,
};

const weakReaderPhrases = [
  'this medium post should',
  'this post should',
  'this article should',
  'this companion piece should',
  'this topic is important',
  'this can be useful',
  'it can be useful',
  'it is useful because',
  'realistic example',
  'plain-language notes',
  'better questions',
];

const hardSelfReferencePhrases = [
  'this medium post',
  'medium post',
  'this post',
  'this article',
  'this companion piece',
  'medium article',
  'this medium post should',
  'this post should',
  'this article should',
  'this companion piece should',
];

const readerProblemWords = [
  'mistake',
  'wrong',
  'confusion',
  'risk',
  'guess',
  'waste',
  'tight',
  'short',
  'overpay',
  'danger',
  'surprise',
  'annoying',
  'scary',
  'approval',
  'before',
  'privacy',
  'upload',
  'pay',
  'cost',
  'expensive',
];

const readerSceneWords = [
  'store',
  'checkout',
  'shopping',
  'home',
  'house',
  'room',
  'wall',
  'wire',
  'circuit',
  'lender',
  'budget',
  'class',
  'teacher',
  'readme',
  'screenshot',
  'browser tab',
  'calculator page',
  'sale',
  'discount',
  'price',
  'listing',
  'doctor',
  'health',
  'file upload',
  'server',
  'pageviews',
  'traffic',
  'repository',
  'readme',
  'terminal',
  'install command',
  'project folder',
];

const powerWordGroups = {
  curiosity: [
    'secret',
    'surprising',
    'hidden',
    'unknown',
    'unexpected',
    'strange',
    'shocking',
    'mystery',
    'revealed',
    'overlooked',
    'little-known',
  ],
  useful: [
    'how',
    'guide',
    'tips',
    'steps',
    'ways',
    'methods',
    'strategies',
    'checklist',
    'formula',
    'solution',
    'explained',
  ],
  urgency: ['now', 'today', 'before', 'urgent', 'important', "don't miss", 'warning', 'must-know', 'last chance'],
  emotional: [
    'powerful',
    'inspiring',
    'heartbreaking',
    'exciting',
    'frustrating',
    'fearless',
    'honest',
    'life-changing',
    'unforgettable',
  ],
  problem: ['mistakes', 'problems', 'risks', 'struggles', 'failure', 'danger', 'confusion', 'myths', 'traps'],
};

const headlineStarters = [
  'why ',
  'how to ',
  'the truth about ',
  'what no one tells you about ',
  'things you should know before ',
  'the biggest mistake ',
  'simple ways to ',
  'the real reason ',
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
  'voltage-drop-wire-length': {
    primaryPhrase: 'voltage drop',
    minNumbers: 4,
    requiredIdeas: ['wire length', 'current', 'safety'],
  },
  'markdown-table-cleanup': {
    primaryPhrase: 'markdown table',
    minNumbers: 3,
    requiredIdeas: ['header', 'row', 'copy'],
  },
  'github-stars-security-review': {
    primaryPhrase: 'github stars',
    minNumbers: 3,
    maxWords: 1300,
    allowAiMentions: true,
    requiredIdeas: ['license', 'dependencies', 'limits'],
    trustHeading: 'Green flags and stop signs',
    ctaHeading: 'Keep the checklist beside the install command',
  },
  'kawaii-calculator-serious-math': {
    primaryPhrase: 'kawaii calculator',
    minNumbers: 6,
    maxWords: 1300,
    allowAiMentions: true,
    requiredIdeas: ['percent', 'history', 'limits'],
    trustHeading: 'What the cute design does not change',
    ctaHeading: 'Try the Kawaii Calculator',
  },
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

function extractFrontmatterValue(content, key) {
  const match = content.match(new RegExp(`^${key}:\\s*"?([^"\\r\\n]+)"?\\s*$`, 'm'));
  return match?.[1]?.trim() ?? '';
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

function extractHeroImage(article) {
  const match = article.match(/!\[([^\]]+)\]\((https:\/\/accessfreetools\.com\/medium\/[a-z0-9-]+\.jpg)\)/);
  return match
    ? {
        alt: match[1].trim(),
        url: match[2].trim(),
      }
    : null;
}

function loadHeroAssetReport() {
  if (!existsSync(HERO_ASSET_REPORT_PATH)) {
    return {
      generatedAt: null,
      layoutChecks: [],
      missing: true,
    };
  }

  return JSON.parse(readFileSync(HERO_ASSET_REPORT_PATH, 'utf8'));
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
    .filter((paragraph) => !paragraph.startsWith('Tool:'))
    .filter((paragraph) => !paragraph.startsWith('Full guide:'))
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

function countPhrase(text, phrase) {
  const pattern = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
  return (text.match(pattern) ?? []).length;
}

function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreRange(value, idealMin, idealMax, hardMin, hardMax) {
  if (value >= idealMin && value <= idealMax) return 100;
  if (value < hardMin || value > hardMax) return 0;

  if (value < idealMin) {
    return ((value - hardMin) / (idealMin - hardMin)) * 100;
  }

  return ((hardMax - value) / (hardMax - idealMax)) * 100;
}

function uniqueRatio(words) {
  const normalized = words
    .map((word) => word.toLowerCase())
    .filter((word) => word.length > 3)
    .filter((word) => !/^\d+$/.test(word));

  if (normalized.length === 0) return 0;

  return new Set(normalized).size / normalized.length;
}

function repeatedSentenceCount(text) {
  const sentences = text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim().toLowerCase())
    .filter((sentence) => sentence.length > 30);
  const seen = new Set();
  let duplicates = 0;

  for (const sentence of sentences) {
    if (seen.has(sentence)) {
      duplicates += 1;
    }
    seen.add(sentence);
  }

  return duplicates;
}

function collectPowerWords(text) {
  const lower = text.toLowerCase();

  return Object.fromEntries(
    Object.entries(powerWordGroups).map(([group, words]) => [
      group,
      words.filter((word) => countPhrase(lower, word) > 0),
    ]),
  );
}

function publicParagraphs(article) {
  return article
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .filter((paragraph) => !paragraph.startsWith('#'))
    .filter((paragraph) => !paragraph.startsWith('!['))
    .filter((paragraph) => !paragraph.startsWith('- '))
    .filter((paragraph) => !paragraph.startsWith('Tool:'))
    .filter((paragraph) => !paragraph.startsWith('Full guide:'))
    .filter((paragraph) => !paragraph.startsWith('Tool or guide:'))
    .filter((paragraph) => !paragraph.startsWith('Disclosure:'));
}

function extractAccessFreeToolsLinks(article) {
  return [
    ...article.matchAll(/https:\/\/accessfreetools\.com\/[^\s)]+/g),
  ]
    .map((match) => match[0].replace(/[.,;:]+$/, ''))
    .filter((url) => !url.includes('/medium/'));
}

function uniqueItems(items) {
  return [...new Set(items)];
}

function hasAccessFreeToolsDisclosure(article) {
  return /^Disclosure:[^\n]*Access Free Tools[^\n]*$/m.test(article);
}

function hasAccessFreeToolsCta(article, ctaHeading = 'Try the original tool') {
  if (/(?:Tool|Full guide|Tool or guide):\s+https:\/\/accessfreetools\.com\//.test(article)) return true;
  const cta = article.split(`\n## ${ctaHeading}`)[1] ?? '';
  return /https:\/\/accessfreetools\.com\//.test(cta);
}

function firstWords(text, count) {
  return wordsFrom(text).slice(0, count).join(' ');
}

function hasAnyPhrase(text, phrases) {
  const lower = text.toLowerCase();
  return phrases.some((phrase) => lower.includes(phrase));
}

function headlineStarter(title) {
  const lower = title.toLowerCase();
  return headlineStarters.find((starter) => lower.startsWith(starter)) ?? null;
}

function totalPowerWords(groups) {
  return Object.values(groups).reduce((total, words) => total + words.length, 0);
}

function scoreSeo({ title, headings, text, words, rules, article, numberCount }) {
  const lower = text.toLowerCase();
  const primary = rules.primaryPhrase.toLowerCase();
  const maxWords = rules.maxWords ?? 1200;
  const trustHeading = rules.trustHeading ?? 'What to check before trusting the result';
  const primaryCount = countPhrase(lower, primary);
  const density = words.length > 0 ? (primaryCount * primary.split(/\s+/).length) / words.length : 0;
  let score = 0;

  if (primaryCount > 0) score += 18;
  if (title.toLowerCase().includes(primary)) score += 16;
  if (headings.some((heading) => heading.toLowerCase().includes(primary))) score += 8;
  if (headings.length >= 6) score += 10;
  if (words.length >= 520 && words.length <= maxWords) score += 12;
  if (numberCount >= rules.minNumbers) score += 8;
  if (hasAccessFreeToolsCta(article, rules.ctaHeading)) score += 10;
  if (hasAccessFreeToolsDisclosure(article)) score += 6;
  if (headings.includes(trustHeading)) score += 6;
  if (density > 0 && density < 0.035) score += 6;

  return {
    score: clampScore(score),
    primaryCount,
    density: Number((density * 100).toFixed(2)),
  };
}

function scoreOriginality({ words, text, article, title, numberCount }) {
  const ratio = uniqueRatio(words);
  const duplicates = repeatedSentenceCount(text);
  const genericHits = [...new Set(findSharedSlopHits(text).map((hit) => hit.toLowerCase()))];
  const titleIsSpecific = /\b(before|without|what|why|how|mistake|calculator|privacy|payment|waste|amps|bmi|revenue)\b/i.test(title);
  const exampleSpecific = numberCount >= 3 && /\b(example|say|suppose|if)\b/i.test(article);
  let score = 35;

  score += scoreRange(ratio, 0.55, 0.78, 0.35, 0.9) * 0.22;
  score += exampleSpecific ? 18 : 0;
  score += titleIsSpecific ? 12 : 0;
  score += duplicates === 0 ? 10 : Math.max(0, 10 - duplicates * 5);
  score += genericHits.length === 0 ? 18 : Math.max(0, 18 - genericHits.length * 8);

  return {
    score: clampScore(score),
    uniqueRatio: Number(ratio.toFixed(2)),
    repeatedSentences: duplicates,
    genericHits,
  };
}

function scoreHumanInterest({ title, text, article, headings, grade, secondPersonCount, numberCount }) {
  const powerWords = collectPowerWords(`${title} ${headings.join(' ')} ${text}`);
  const headlineStart = headlineStarter(title);
  const powerCount = totalPowerWords(powerWords);
  const hasProblemFrame = /\b(mistake|problem|risk|confusion|wrong|waste|danger|trust|before)\b/i.test(article);
  const hasConcreteExample = numberCount >= 3 && /\b(example|say|suppose|if)\b/i.test(article);
  const directVoice = secondPersonCount >= 4;
  let score = 0;

  if (headlineStart) score += 12;
  score += Math.min(22, powerCount * 4);
  if (powerWords.problem.length > 0) score += 12;
  if (powerWords.useful.length > 0) score += 10;
  if (hasProblemFrame) score += 14;
  if (hasConcreteExample) score += 14;
  if (directVoice) score += 10;
  if (grade >= 6 && grade <= 9.5) score += 12;
  else if (grade <= 10.5) score += 6;

  return {
    score: clampScore(score),
    headlineStarter: headlineStart?.trim() ?? null,
    powerWords,
    powerWordCount: powerCount,
  };
}

function scoreReaderDesire({ title, text, article, headings, secondPersonCount, numberCount, rules }) {
  const paragraphs = publicParagraphs(article);
  const opening = firstWords(plainText(paragraphs.slice(0, 4).join(' ')), 180).toLowerCase();
  const readerFacingText = paragraphs.join(' ').toLowerCase();
  const weakHits = weakReaderPhrases.filter((phrase) => readerFacingText.includes(phrase));
  const hardSelfReferences = hardSelfReferencePhrases.filter((phrase) => readerFacingText.includes(phrase));
  const hasProblemOpening = hasAnyPhrase(opening, readerProblemWords);
  const hasSceneOpening = hasAnyPhrase(opening, readerSceneWords);
  const hasSpecificExample =
    numberCount >= rules.minNumbers &&
    /\b(for example|say|suppose|if|try)\b/i.test(article) &&
    /(?:\$|%|\bpercent\b|=|\babout\b|\broughly\b|\bresult\b|\bmonthly\b|\bfinal\b)/i.test(article);
  const hasPayoff =
    /\b(so you can|that means|this matters because|the next step|before you|helps you|shows whether|keeps you|catch that)\b/i.test(
      article,
    );
  const hasDecisionLanguage = /\b(check|choose|compare|ask|try|use|avoid|do not|watch|trust|rely)\b/i.test(article);
  const hasContrast = /\b(not .* but|instead|rather than|only|does not|cannot|before|after)\b/i.test(article);
  const titleHasReason =
    headlineStarter(title) ||
    /\b(before|without|mistake|why|how|truth|what|risk|limits|matters)\b/i.test(title);
  const genericHeadingCount = headings.filter((heading) =>
    /^(quick answer|why this matters|best quick use case|start with the big pieces)$/i.test(heading),
  ).length;

  let score = 8;
  if (titleHasReason) score += 10;
  if (hasProblemOpening) score += 16;
  if (hasSceneOpening) score += 14;
  if (hasSpecificExample) score += 20;
  if (hasPayoff) score += 12;
  if (secondPersonCount >= 8) score += 10;
  else if (secondPersonCount >= 5) score += 6;
  if (hasDecisionLanguage) score += 10;
  if (hasContrast) score += 8;
  if (paragraphs.length >= 10) score += 6;

  score -= weakHits.length * 7;
  score -= hardSelfReferences.length * 28;
  if (genericHeadingCount >= 4) score -= 6;

  return {
    score: clampScore(score),
    openingHasProblem: hasProblemOpening,
    openingHasScene: hasSceneOpening,
    hasSpecificExample,
    hasPayoff,
    hasDecisionLanguage,
    hasContrast,
    weakHits,
    hardSelfReferences,
  };
}

function lintArticle(file, heroAssetReport) {
  const slug = basename(file, '.md');
  const rules = qualityRules[slug] ?? {
    primaryPhrase: slug.split('-').slice(0, 3).join(' '),
    minNumbers: 1,
    requiredIdeas: ['example', 'result', 'limit'],
  };
  const maxWords = rules.maxWords ?? 1200;
  const trustHeading = rules.trustHeading ?? 'What to check before trusting the result';
  const ctaHeading = rules.ctaHeading ?? 'Try the original tool';
  const content = readFileSync(file, 'utf8');
  const article = getPublicArticle(content);
  const text = plainText(article);
  const lower = text.toLowerCase();
  const title = extractTitle(article);
  const heroImage = extractHeroImage(article);
  const canonicalUrl = extractFrontmatterValue(content, 'canonical_url_to_set');
  const sourceUrl = extractFrontmatterValue(content, 'source_url');
  const originalMediumArticle = extractFrontmatterValue(content, 'original_medium_article') === 'true';
  const heroImageUrl = extractFrontmatterValue(content, 'hero_image_url');
  const heroImagePath = extractFrontmatterValue(content, 'hero_image_path');
  const heroAlt = extractFrontmatterValue(content, 'hero_alt');
  const tags = extractFrontmatterValue(content, 'tags')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  const headings = extractHeadings(article);
  const words = wordsFrom(text);
  const grade = fleschKincaidGrade(text);
  const paragraphCounts = paragraphWordCounts(article);
  const numberCount = countNumbers(article);
  const secondPersonCount = countSecondPerson(text);
  const seo = scoreSeo({ title, headings, text, words, rules, article, numberCount });
  const originality = scoreOriginality({ words, text, article, title, numberCount });
  const humanInterest = scoreHumanInterest({
    title,
    text,
    article,
    headings,
    grade,
    secondPersonCount,
    numberCount,
  });
  const readerDesire = scoreReaderDesire({
    title,
    text,
    article,
    headings,
    secondPersonCount,
    numberCount,
    rules,
  });
  const overallScore = clampScore(
    seo.score * 0.32 + originality.score * 0.2 + humanInterest.score * 0.23 + readerDesire.score * 0.25,
  );
  const errors = [];
  const warnings = [];
  const sharedWritingReview = analyzeWritingText(text, { mode: 'editorial', sourcePath: file });
  const heroLayoutCheck = heroAssetReport.layoutChecks?.find((check) => check.slug === slug);
  const accessLinks = extractAccessFreeToolsLinks(article);
  const uniqueAccessLinks = uniqueItems(accessLinks);
  const beforeCtaArticle = article.split(`\n## ${ctaHeading}`)[0] ?? article;
  const contextualLinks = uniqueItems(extractAccessFreeToolsLinks(beforeCtaArticle));

  if (title.length < 35 || title.length > 85) {
    errors.push(`Title should be 35-85 characters; found ${title.length}.`);
  }

  if (!lower.includes(rules.primaryPhrase.toLowerCase())) {
    errors.push(`Primary phrase missing from public article: "${rules.primaryPhrase}".`);
  }

  if (!originalMediumArticle && !canonicalUrl.startsWith('https://accessfreetools.com/')) {
    errors.push('Missing canonical_url_to_set frontmatter for the matching Access Free Tools source.');
  }

  if (!sourceUrl.startsWith('https://accessfreetools.com/')) {
    errors.push('Missing source_url frontmatter for the matching Access Free Tools source.');
  }

  if (tags.length < 3 || tags.length > 5) {
    errors.push(`Medium tags should include 3-5 focused tags; found ${tags.length}.`);
  }

  if (!heroImage) {
    errors.push('Missing public hero image Markdown at the top of the Medium article.');
  } else if (heroImage.url !== `https://accessfreetools.com/medium/${slug}.jpg`) {
    errors.push(`Hero image URL should be https://accessfreetools.com/medium/${slug}.jpg.`);
  }

  if (heroAssetReport.missing) {
    errors.push('Missing Medium hero asset QA report. Run npm run promotion:medium:images before publishing.');
  } else if (!heroLayoutCheck) {
    errors.push(`Missing hero image layout QA for ${slug}.`);
  } else if (heroLayoutCheck.status !== 'passed') {
    errors.push(`Hero image layout QA failed for ${slug}: ${(heroLayoutCheck.errors ?? []).join(' ')}`);
  }

  const resolvedHeroImagePath = heroImagePath ? resolve(heroImagePath) : '';
  if (!resolvedHeroImagePath || !existsSync(resolvedHeroImagePath)) {
    errors.push(`Hero image file is missing locally: ${heroImagePath || '(empty)'}.`);
  }

  if (heroImageUrl !== `https://accessfreetools.com/medium/${slug}.jpg`) {
    errors.push(`hero_image_url frontmatter should be https://accessfreetools.com/medium/${slug}.jpg.`);
  }

  if (heroImagePath !== `public/medium/${slug}.jpg`) {
    errors.push(`hero_image_path frontmatter should be public/medium/${slug}.jpg.`);
  }

  const effectiveAlt = heroAlt || heroImage?.alt || '';
  if (effectiveAlt.length < 45 || effectiveAlt.length > 180) {
    errors.push(`Hero image alt text should be 45-180 characters; found ${effectiveAlt.length}.`);
  }

  if (heroImage && heroAlt && heroImage.alt !== heroAlt) {
    errors.push('Hero image alt text in Markdown must match hero_alt frontmatter.');
  }

  if (words.length < 520 || words.length > maxWords) {
    errors.push(`Public article should be 520-${maxWords} words; found ${words.length}.`);
  }

  if (headings.length < 6) {
    errors.push(`Use at least 6 clear H2 sections; found ${headings.length}.`);
  }

  if (!headings.some((heading) => /example/i.test(heading)) && !/\bexample\b/i.test(text)) {
    errors.push('Article needs a realistic example section.');
  }

  if (!hasAccessFreeToolsDisclosure(article)) {
    errors.push('Missing Access Free Tools disclosure line.');
  }

  if (!hasAccessFreeToolsCta(article, ctaHeading)) {
    errors.push('Missing source tool or guide URL.');
  }

  if (sourceUrl && !article.includes(sourceUrl)) {
    errors.push(`Missing reader-facing source tool link: ${sourceUrl}.`);
  }

  if (!originalMediumArticle && canonicalUrl && canonicalUrl !== sourceUrl && !article.includes(canonicalUrl)) {
    errors.push(`Missing reader-facing guide/canonical link: ${canonicalUrl}.`);
  }

  const requiredUniqueLinks = !originalMediumArticle && canonicalUrl && canonicalUrl !== sourceUrl ? 2 : 1;
  if (uniqueAccessLinks.length < requiredUniqueLinks) {
    errors.push(
      `Needs ${requiredUniqueLinks}+ unique Access Free Tools reader-facing link(s); found ${uniqueAccessLinks.length}.`,
    );
  }

  if (contextualLinks.length < 1) {
    errors.push('Needs at least one contextual Access Free Tools link before the final CTA section.');
  }

  if (!headings.includes(trustHeading)) {
    errors.push('Missing the result-trust limits section.');
  }

  if (!headings.includes(ctaHeading)) {
    errors.push('Missing the original-tool CTA section.');
  }

  const missingIdeas = containsAllIdeas(text, rules.requiredIdeas);
  if (missingIdeas.length > 0) {
    errors.push(`Missing required topic idea(s): ${missingIdeas.join(', ')}.`);
  }

  if (numberCount < rules.minNumbers) {
    errors.push(`Needs more concrete numbers/examples; found ${numberCount}, expected ${rules.minNumbers}.`);
  }

  if (secondPersonCount < 4) {
    errors.push(`Needs a more direct reader voice; found ${secondPersonCount} second-person words.`);
  }

  const longParagraph = Math.max(0, ...paragraphCounts);
  if (longParagraph > 95) {
    errors.push(`Paragraphs are too dense; longest paragraph is ${longParagraph} words.`);
  }

  for (const phrase of originality.genericHits) {
    errors.push(`Banned generic/hype phrase found: "${phrase}".`);
  }

  for (const finding of sharedWritingReview.findings.filter(
    (item) => item.severity === 'error' && item.id !== 'brand.hype',
  )) {
    errors.push(`Shared writing hard error ${finding.id}: ${finding.message}`);
  }

  for (const phrase of readerDesire.hardSelfReferences) {
    errors.push(`Reader-desire fail: draft talks about itself instead of the reader: "${phrase}".`);
  }

  if (!readerDesire.openingHasProblem) {
    errors.push('Reader-desire fail: opening needs a real problem, risk, mistake, or tension.');
  }

  if (!readerDesire.openingHasScene) {
    errors.push('Reader-desire fail: opening needs a concrete reader scene or use case.');
  }

  if (!readerDesire.hasSpecificExample) {
    errors.push('Reader-desire fail: article needs a concrete example with numbers and a result/payoff.');
  }

  if (!readerDesire.hasPayoff) {
    errors.push('Reader-desire fail: article needs a clear "so what" payoff for the reader.');
  }

  if (!rules.allowAiMentions && /\bAI\b|browser-only ai/i.test(article)) {
    errors.push('Non-AI Medium posts should not drift into AI language.');
  }

  if (grade > 10.5) {
    errors.push(`Reading grade is too high for the target voice: ${grade.toFixed(1)}.`);
  } else if (grade > 9.5) {
    warnings.push(`Reading grade is close to the limit: ${grade.toFixed(1)}.`);
  }

  if (seo.score < minScores.seo) {
    errors.push(`SEO reviewer score too low: ${seo.score}/100, expected ${minScores.seo}+.`);
  }

  if (originality.score < minScores.originality) {
    errors.push(`Originality reviewer score too low: ${originality.score}/100, expected ${minScores.originality}+.`);
  }

  if (humanInterest.score < minScores.humanInterest) {
    errors.push(`Human-interest reviewer score too low: ${humanInterest.score}/100, expected ${minScores.humanInterest}+.`);
  }

  if (readerDesire.score < minScores.readerDesire) {
    errors.push(`Reader-desire reviewer score too low: ${readerDesire.score}/100, expected ${minScores.readerDesire}+.`);
  }

  if (overallScore < minScores.overall) {
    errors.push(`Overall reviewer score too low: ${overallScore}/100, expected ${minScores.overall}+.`);
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
    scores: {
      seo: seo.score,
      originality: originality.score,
      humanInterest: humanInterest.score,
      readerDesire: readerDesire.score,
      overall: overallScore,
    },
    reviewerSignals: {
      primaryPhrase: rules.primaryPhrase,
      canonicalUrl,
      sourceUrl,
      heroImageUrl,
      heroImagePath,
      heroAlt: effectiveAlt,
      heroLayoutStatus: heroLayoutCheck?.status ?? 'missing',
      tags,
      primaryPhraseCount: seo.primaryCount,
      primaryPhraseDensityPercent: seo.density,
      uniqueRatio: originality.uniqueRatio,
      repeatedSentences: originality.repeatedSentences,
      genericHits: originality.genericHits,
      headlineStarter: humanInterest.headlineStarter,
      powerWords: humanInterest.powerWords,
      powerWordCount: humanInterest.powerWordCount,
      internalLinks: uniqueAccessLinks,
      contextualLinks,
      readerDesire: {
        openingHasProblem: readerDesire.openingHasProblem,
        openingHasScene: readerDesire.openingHasScene,
        hasSpecificExample: readerDesire.hasSpecificExample,
        hasPayoff: readerDesire.hasPayoff,
        hasDecisionLanguage: readerDesire.hasDecisionLanguage,
        hasContrast: readerDesire.hasContrast,
        weakHits: readerDesire.weakHits,
      },
    },
    errors,
    warnings,
  };
}

function main() {
  const { target, reportPath } = parseArgs();
  const files = listMarkdownFiles(target);
  const heroAssetReport = loadHeroAssetReport();
  const results = files.map((file) => lintArticle(file, heroAssetReport));
  let errorCount = 0;
  let warningCount = 0;

  for (const result of results) {
    errorCount += result.errors.length;
    warningCount += result.warnings.length;
    console.log(
      `${result.slug}: ${result.wordCount} words, ${result.headingCount} H2s, grade ${result.readingGrade}, ${result.numberCount} numbers, scores SEO ${result.scores.seo}/100, originality ${result.scores.originality}/100, interest ${result.scores.humanInterest}/100, reader ${result.scores.readerDesire}/100, overall ${result.scores.overall}/100`,
    );

    const foundPowerWords = Object.entries(result.reviewerSignals.powerWords)
      .filter(([, words]) => words.length > 0)
      .map(([group, words]) => `${group}: ${words.join(', ')}`)
      .join('; ');

    if (foundPowerWords) {
      console.log(`  hooks: ${foundPowerWords}`);
    }

    if (result.reviewerSignals.headlineStarter) {
      console.log(`  headline starter: ${result.reviewerSignals.headlineStarter}`);
    }

    for (const warning of result.warnings) {
      console.log(`  warn: ${warning}`);
    }

    for (const error of result.errors) {
      console.log(`  error: ${error}`);
    }
  }

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(
    reportPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        target,
        minScores,
        totals: {
          drafts: results.length,
          errors: errorCount,
          warnings: warningCount,
        },
        results,
      },
      null,
      2,
    )}\n`,
  );

  if (errorCount > 0) {
    console.error(`Medium writing quality failed: ${errorCount} error(s), ${warningCount} warning(s).`);
    console.error(`Saved reviewer report to ${reportPath}`);
    process.exit(1);
  }

  console.log(`Medium writing quality passed: ${results.length} draft(s), ${warningCount} warning(s).`);
  console.log(`Saved reviewer report to ${reportPath}`);
}

main();
