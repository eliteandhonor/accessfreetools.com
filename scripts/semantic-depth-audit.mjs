import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const SITE_ORIGIN = 'https://accessfreetools.com';
const args = process.argv.slice(2);
const option = (name, fallback = undefined) =>
  args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) ?? fallback;

function localDateStamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: process.env.AFT_AUDIT_TIME_ZONE ?? 'Australia/Brisbane',
    year: 'numeric',
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

const outputDir = resolve(option('--output-dir', join('output', 'semantic-depth', localDateStamp())));

const priorityTools = [
  {
    slug: 'mortgage-calculator',
    label: 'Mortgage Calculator',
    requiredTerms: [
      ['principal', 'loan amount'],
      ['interest', 'rate'],
      ['tax', 'insurance'],
      ['pmi', 'hoa'],
      ['not financial advice', 'estimate'],
    ],
  },
  {
    slug: 'loan-calculator',
    label: 'Loan Calculator',
    requiredTerms: [
      ['principal', 'loan amount'],
      ['interest', 'rate'],
      ['term', 'months'],
      ['total interest', 'total cost'],
      ['estimate', 'lender'],
    ],
  },
  {
    slug: 'bmi-calculator',
    label: 'BMI Calculator',
    requiredTerms: [
      ['height'],
      ['weight'],
      ['screening', 'category'],
      ['not medical advice', 'not a diagnosis', 'doctor'],
      ['adult'],
    ],
  },
  {
    slug: 'calorie-calculator',
    label: 'Calorie Calculator',
    requiredTerms: [
      ['age'],
      ['height'],
      ['weight'],
      ['activity'],
      ['estimate', 'not medical advice', 'professional'],
    ],
  },
  {
    slug: 'income-tax-calculator',
    label: 'Income Tax Calculator',
    requiredTerms: [
      ['taxable income'],
      ['filing status'],
      ['deduction'],
      ['credit'],
      ['not tax advice', 'estimate'],
    ],
  },
  {
    slug: 'salary-calculator',
    label: 'Salary Calculator',
    requiredTerms: [
      ['hourly', 'annual'],
      ['pay period'],
      ['gross'],
      ['tax', 'deduction'],
      ['estimate'],
    ],
  },
  {
    slug: 'watts-to-amps-calculator',
    label: 'Watts to Amps Calculator',
    requiredTerms: [
      ['watts'],
      ['volts'],
      ['phase'],
      ['power factor'],
      ['qualified', 'electrician', 'code', 'safety'],
    ],
  },
  {
    slug: 'wallpaper-calculator',
    label: 'Wallpaper Calculator',
    requiredTerms: [
      ['waste percent'],
      ['roll coverage'],
      ['pattern repeat'],
      ['opening', 'door', 'window'],
      ['dye lot', 'batch'],
    ],
  },
  {
    slug: 'image-to-text-ocr-tool',
    label: 'Image to Text OCR Tool',
    requiredTerms: [
      ['browser'],
      ['not upload', 'not uploaded'],
      ['language'],
      ['image quality'],
      ['mistake', 'double-check', 'check'],
    ],
  },
  {
    slug: 'prompt-token-estimator',
    label: 'Prompt Token Estimator',
    requiredTerms: [
      ['token'],
      ['estimate'],
      ['model'],
      ['context'],
      ['cost', 'limit'],
    ],
  },
];

function decodeHtml(value = '') {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function stripTags(value = '') {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function builtHtmlPath(route) {
  const clean = route.replace(/^\/|\/$/g, '');
  const candidates = [
    join('dist', 'client', clean, 'index.html'),
    join('dist', clean, 'index.html'),
    join('dist', 'client', `${clean}.html`),
    join('dist', `${clean}.html`),
  ].map((candidate) => resolve(candidate));

  return candidates.find((candidate) => existsSync(candidate)) ?? '';
}

function normalizeHref(href) {
  if (href.startsWith(SITE_ORIGIN)) {
    return href.slice(SITE_ORIGIN.length) || '/';
  }

  if (href.startsWith('/')) {
    return href.split('#')[0].split('?')[0] || '/';
  }

  return href;
}

function anchorsFrom(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
    .map((match) => {
      const href = match[1].match(/\bhref\s*=\s*(["'])([\s\S]*?)\1/i)?.[2] ?? '';
      return {
        href: normalizeHref(decodeHtml(href.trim())),
        text: stripTags(match[2]),
      };
    })
    .filter((anchor) => anchor.href);
}

function wordCount(text) {
  return (text.match(/[A-Za-z0-9]+(?:'[A-Za-z]+)?/g) ?? []).length;
}

function routeText(route) {
  const htmlPath = builtHtmlPath(route);
  if (!htmlPath) return { htmlPath: '', html: '', text: '', anchors: [] };
  const html = readFileSync(htmlPath, 'utf8');
  return {
    htmlPath,
    html,
    text: stripTags(html),
    anchors: anchorsFrom(html),
  };
}

function sourceHasDeepReview(slug) {
  const path = resolve('src', 'data', 'toolDeepAudit.ts');
  if (!existsSync(path)) return false;
  const source = readFileSync(path, 'utf8');
  const slugIndex = source.indexOf(`slug: '${slug}'`);
  if (slugIndex === -1) return false;
  const slice = source.slice(slugIndex, slugIndex + 700);
  return /status:\s*'deep-reviewed'/.test(slice);
}

function hasAny(text, terms) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

function analyzeTool(tool) {
  const toolRoute = `/tools/${tool.slug}/`;
  const guideRoute = `/blog/how-to-use-${tool.slug}/`;
  const toolPage = routeText(toolRoute);
  const guidePage = routeText(guideRoute);
  const combinedText = `${toolPage.text} ${guidePage.text}`;
  const toolWords = wordCount(toolPage.text);
  const guideWords = wordCount(guidePage.text);
  const faqQuestionCount = (toolPage.text.match(/\?/g) ?? []).length;
  const toolInternalLinks = toolPage.anchors.filter((anchor) => anchor.href.startsWith('/'));
  const guideInternalLinks = guidePage.anchors.filter((anchor) => anchor.href.startsWith('/'));
  const missingTermGroups = tool.requiredTerms.filter((terms) => !hasAny(combinedText, terms));
  const toolLinksGuide = toolPage.anchors.some((anchor) => anchor.href === guideRoute);
  const guideLinksTool = guidePage.anchors.some((anchor) => anchor.href === toolRoute);
  const relatedToolLinks = new Set(toolInternalLinks.filter((anchor) => anchor.href.startsWith('/tools/')).map((anchor) => anchor.href));
  const issues = [];
  const warnings = [];

  if (!toolPage.htmlPath) issues.push(`Missing built tool page for ${toolRoute}.`);
  if (!guidePage.htmlPath) issues.push(`Missing built guide page for ${guideRoute}.`);
  if (toolWords < 900) issues.push(`Tool page has only ${toolWords} words; expected at least 900 for priority depth.`);
  if (guideWords < 550) issues.push(`Guide has only ${guideWords} words; expected at least 550 for priority depth.`);
  if (faqQuestionCount < 6) issues.push(`Tool page appears to have ${faqQuestionCount} FAQ-style questions; expected 6 or more.`);
  if (!toolLinksGuide) warnings.push('Tool page does not clearly link to its matching guide in built HTML.');
  if (!guideLinksTool) warnings.push('Guide page does not clearly link back to the tool in built HTML.');
  if (relatedToolLinks.size < 3) warnings.push(`Only ${relatedToolLinks.size} related tool links found in built HTML.`);
  if (missingTermGroups.length) {
    issues.push(`Missing required semantic term group(s): ${missingTermGroups.map((terms) => terms.join(' or ')).join('; ')}`);
  }
  if (!sourceHasDeepReview(tool.slug)) {
    issues.push('No deep-reviewed audit record found in src/data/toolDeepAudit.ts.');
  }

  return {
    slug: tool.slug,
    label: tool.label,
    status: issues.length ? 'failed' : warnings.length ? 'watch' : 'passed',
    toolRoute,
    guideRoute,
    toolHtmlPath: toolPage.htmlPath,
    guideHtmlPath: guidePage.htmlPath,
    toolWords,
    guideWords,
    faqQuestionCount,
    toolInternalLinkCount: toolInternalLinks.length,
    guideInternalLinkCount: guideInternalLinks.length,
    relatedToolLinkCount: relatedToolLinks.size,
    toolLinksGuide,
    guideLinksTool,
    missingTermGroups,
    deepReviewedRecord: sourceHasDeepReview(tool.slug),
    issues,
    warnings,
  };
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function renderMarkdown(report) {
  const lines = [
    '# Priority Semantic Depth Audit',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Checked priority tools: ${report.totals.tools}`,
    `Passed: ${report.totals.passed}`,
    `Watch: ${report.totals.watch}`,
    `Failed: ${report.totals.failed}`,
    '',
    '## Results',
    '',
  ];

  for (const item of report.tools) {
    lines.push(`### ${item.label}`);
    lines.push('');
    lines.push(`- Slug: ${item.slug}`);
    lines.push(`- Status: ${item.status}`);
    lines.push(`- Tool words: ${item.toolWords}; guide words: ${item.guideWords}; FAQ-style questions: ${item.faqQuestionCount}`);
    lines.push(`- Internal links: tool ${item.toolInternalLinkCount}, guide ${item.guideInternalLinkCount}, related tools ${item.relatedToolLinkCount}`);
    lines.push(`- Tool to guide: ${item.toolLinksGuide ? 'yes' : 'no'}; guide to tool: ${item.guideLinksTool ? 'yes' : 'no'}`);
    lines.push(`- Deep-reviewed record: ${item.deepReviewedRecord ? 'yes' : 'no'}`);
    lines.push(`- Issues: ${item.issues.length ? item.issues.join(' | ') : 'none'}`);
    lines.push(`- Warnings: ${item.warnings.length ? item.warnings.join(' | ') : 'none'}`);
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

const tools = priorityTools.map(analyzeTool);
const report = {
  generatedAt: new Date().toISOString(),
  auditMode: 'built HTML plus exact deep-review record check',
  outputDir,
  totals: {
    tools: tools.length,
    passed: tools.filter((tool) => tool.status === 'passed').length,
    watch: tools.filter((tool) => tool.status === 'watch').length,
    failed: tools.filter((tool) => tool.status === 'failed').length,
  },
  tools,
};

writeJson(join(outputDir, 'summary.json'), report);
writeText(join(outputDir, 'summary.md'), renderMarkdown(report));

console.log(`Semantic depth audit: ${report.totals.passed}/${report.totals.tools} passed, ${report.totals.watch} watch, ${report.totals.failed} failed.`);
console.log(`Report: ${join(outputDir, 'summary.md')}`);

if (report.totals.failed > 0) {
  process.exitCode = 1;
}
