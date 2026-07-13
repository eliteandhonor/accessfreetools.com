import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const blogDir = resolve(root, 'dist', 'blog');
const outputDir = resolve(root, 'output', 'editorial-quality');
const minimumStopSlopScore = 40;
const slopPatterns = [
  /in today(?:'|’)s (?:fast-paced|digital) world/gi,
  /game[- ]chang(?:er|ing)/gi,
  /unlock (?:the|your|new)/gi,
  /delve into/gi,
  /it(?:'|’)s important to note/gi,
  /whether you(?:'|’)re/gi,
  /not just .{0,80} but also/gi,
  /revolutionary/gi,
  /transformative/gi,
  /the ultimate/gi,
  /a testament to/gi,
  /navigate the (?:complexities|landscape)/gi,
  /seamlessly/gi,
  /leverage/gi,
];

function stripHtml(html = '') {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(value) {
  return String(value).match(/\b[\w'-]+\b/g)?.length ?? 0;
}

function countMatches(value, pattern) {
  return [...String(value).matchAll(pattern)].length;
}

function articleFiles() {
  if (!existsSync(blogDir)) throw new Error('Missing dist/blog. Run `npm run build` first.');

  return readdirSync(blogDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      slug: entry.name,
      path: join(blogDir, entry.name, 'index.html'),
    }))
    .filter((entry) => existsSync(entry.path))
    .filter((entry) => readFileSync(entry.path, 'utf8').includes('data-editorial-slug'));
}

function scoreArticle({ slug, path }) {
  const html = readFileSync(path, 'utf8');
  const mainHtml = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  const articleHtml = mainHtml.match(/<article\b[^>]*data-editorial-slug[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? mainHtml;
  const visibleText = stripHtml(articleHtml);
  const paragraphs = [...articleHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);
  const sentences = visibleText.split(/(?<=[.!?])\s+/).filter((sentence) => wordCount(sentence) >= 3);
  const longSentences = sentences.filter((sentence) => wordCount(sentence) > 34);
  const headings = [...articleHtml.matchAll(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map((match) => stripHtml(match[1]));
  const internalLinks = [...articleHtml.matchAll(/<a\s+[^>]*href=["'](\/[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ href: match[1], text: stripHtml(match[2]) }));
  const externalLinks = [...articleHtml.matchAll(/<a\s+[^>]*href=["'](https?:\/\/[^"']*)["'][^>]*>/gi)].map((match) => match[1]);
  const slopHits = slopPatterns.flatMap((pattern) => [...visibleText.matchAll(pattern)].map((match) => match[0]));
  const emDashHits = countMatches(visibleText, /—/g);
  const firstPersonHits = countMatches(visibleText, /\b(?:I|my|me)\b/g);
  const accessFreeToolsHits = countMatches(visibleText, /Access Free Tools/g);
  const numberHits = countMatches(visibleText, /\b\d+(?:\.\d+)?\b/g);
  const opening = paragraphs.slice(0, 3).join(' ');

  const directness = Math.max(0, 10 - Math.min(8, slopHits.length * 2) - Math.min(2, emDashHits));
  const longSentenceRatio = sentences.length ? longSentences.length / sentences.length : 1;
  const rhythm = Math.max(0, 10 - (longSentenceRatio > 0.18 ? 3 : 0) - (paragraphs.some((paragraph) => wordCount(paragraph) > 95) ? 3 : 0));
  const trust = Math.min(10,
    (externalLinks.length >= 3 ? 4 : externalLinks.length) +
    (/How this article was made/i.test(visibleText) ? 3 : 0) +
    (/limit|cannot|does not|risk|check/i.test(visibleText) ? 3 : 0));
  const authenticity = Math.min(10,
    (firstPersonHits >= 6 ? 4 : Math.min(4, firstPersonHits)) +
    (accessFreeToolsHits >= 3 ? 3 : accessFreeToolsHits) +
    (/Brendan Chambers/i.test(visibleText) ? 3 : 0));
  const density = Math.min(10,
    (wordCount(visibleText) >= 900 ? 4 : wordCount(visibleText) >= 700 ? 3 : 1) +
    (headings.length >= 6 ? 3 : Math.min(3, Math.floor(headings.length / 2))) +
    (numberHits >= 3 ? 2 : Math.min(2, numberHits)) +
    (internalLinks.length >= 3 ? 1 : 0));
  const stopSlopScore = directness + rhythm + trust + authenticity + density;

  const checks = {
    concreteOpening: /\bI\b/.test(opening) && /Access Free Tools|browser|repository|tool|page|site/i.test(opening),
    quickAnswer: headings.some((heading) => /quick answer|short answer|what I check first/i.test(heading)),
    realisticExample: numberHits >= 3 && /example|for Access Free Tools|in this repo|on this site/i.test(visibleText),
    commonMistakesOrRisks: /mistake|risk|warning|red flag|limit/i.test(visibleText),
    usefulInternalLinks: internalLinks.length >= 3,
    primarySources: externalLinks.length >= 3,
    ownerDisclosure: /I own Access Free Tools/i.test(visibleText),
    processDisclosure: /AI helped with research organization and draft checks/i.test(visibleText),
    noSlopFloorFailure: stopSlopScore >= minimumStopSlopScore,
    noEmDashes: emDashHits === 0,
  };
  const failures = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
  const status = failures.length ? 'fail' : 'pass';

  return {
    slug,
    status,
    file: path.replace(`${root}\\`, '').replaceAll('\\', '/'),
    metrics: {
      words: wordCount(visibleText),
      paragraphs: paragraphs.length,
      headings: headings.length,
      internalLinks: internalLinks.length,
      externalLinks: externalLinks.length,
      numberHits,
      longSentenceRatio: Number(longSentenceRatio.toFixed(3)),
      slopHits,
      emDashHits,
    },
    stopSlop: {
      score: stopSlopScore,
      minimum: minimumStopSlopScore,
      directness,
      rhythm,
      trust,
      authenticity,
      density,
    },
    readerFirst: checks,
    failures,
  };
}

mkdirSync(outputDir, { recursive: true });
const reports = articleFiles().map(scoreArticle);

for (const report of reports) {
  writeFileSync(join(outputDir, `${report.slug}.json`), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(join(outputDir, `${report.slug}.md`), [
    `# Editorial quality: ${report.slug}`,
    '',
    `Status: ${report.status}`,
    `Stop Slop: ${report.stopSlop.score}/50 (minimum ${report.stopSlop.minimum})`,
    `Words: ${report.metrics.words}`,
    `Internal links: ${report.metrics.internalLinks}`,
    `External sources: ${report.metrics.externalLinks}`,
    '',
    '## Reader-first checks',
    '',
    ...Object.entries(report.readerFirst).map(([name, passed]) => `- ${passed ? 'pass' : 'fail'}: ${name}`),
    '',
    '## Failures',
    '',
    ...(report.failures.length ? report.failures.map((failure) => `- ${failure}`) : ['- none']),
  ].join('\n'));
}

const summary = {
  generatedAt: new Date().toISOString(),
  status: reports.every((report) => report.status === 'pass') ? 'pass' : 'fail',
  minimumStopSlopScore,
  articles: reports.map((report) => ({
    slug: report.slug,
    status: report.status,
    score: report.stopSlop.score,
    failures: report.failures,
  })),
};
writeFileSync(join(outputDir, 'latest.json'), `${JSON.stringify(summary, null, 2)}\n`);

console.log(`Editorial article quality: ${summary.status}`);
for (const report of reports) {
  console.log(`- ${report.slug}: ${report.status}; Stop Slop ${report.stopSlop.score}/50; ${report.metrics.words} words`);
}
console.log(`Saved reports to ${outputDir}`);

if (summary.status !== 'pass') process.exitCode = 1;
