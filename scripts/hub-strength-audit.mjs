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

const outputDir = resolve(option('--output-dir', join('output', 'hub-strength', localDateStamp())));
const allowedShortAnchorText = new Set(['ai', 'apr', 'bac', 'bmi', 'gcf', 'gpa', 'lcm', 'rss']);

const hubChecks = [
  {
    route: '/tools/',
    label: 'Tools index',
    minInternalLinks: 35,
    requiredLinks: [
      '/categories/calculators/',
      '/categories/finance/',
      '/categories/health-fitness/',
      '/categories/home-projects/',
      '/categories/ai-tools/',
      '/categories/developer-tools/',
      '/tools/mortgage-calculator/',
      '/tools/loan-calculator/',
      '/tools/bmi-calculator/',
      '/tools/calorie-calculator/',
      '/tools/watts-to-amps-calculator/',
      '/tools/wallpaper-calculator/',
      '/tools/image-to-text-ocr-tool/',
      '/tools/prompt-token-estimator/',
    ],
  },
  {
    route: '/hubs/electrical-calculators/',
    label: 'Electrical calculator hub',
    minInternalLinks: 30,
    requiredLinks: [
      '/tools/watts-to-amps-calculator/',
      '/tools/amps-to-watts-calculator/',
      '/tools/kilowatts-to-amps-calculator/',
      '/tools/kva-to-amps-calculator/',
      '/tools/ohms-law-calculator/',
      '/tools/electricity-calculator/',
      '/tools/voltage-drop-calculator/',
      '/tools/wire-size-calculator/',
      '/tools/wire-resistance-calculator/',
      '/tools/resistor-calculator/',
      '/tools/amp-hours-to-watt-hours-calculator/',
      '/tools/watt-hours-to-amp-hours-calculator/',
      '/blog/how-to-use-watts-to-amps-calculator/',
      '/blog/how-to-use-ohms-law-calculator/',
      '/blog/how-to-use-voltage-drop-calculator/',
    ],
  },
  {
    route: '/categories/calculators/',
    label: 'Calculators hub',
    minInternalLinks: 40,
    requiredLinks: [
      '/tools/basic-calculator/',
      '/tools/percentage-calculator/',
      '/tools/scientific-calculator/',
      '/tools/fraction-calculator/',
      '/tools/watts-to-amps-calculator/',
      '/tools/mortgage-calculator/',
      '/categories/finance/',
      '/categories/health-fitness/',
    ],
  },
  {
    route: '/categories/finance/',
    label: 'Finance hub',
    minInternalLinks: 30,
    requiredLinks: [
      '/tools/mortgage-calculator/',
      '/tools/loan-calculator/',
      '/tools/salary-calculator/',
      '/tools/income-tax-calculator/',
      '/tools/compound-interest-calculator/',
      '/blog/how-to-use-mortgage-calculator/',
      '/blog/how-to-use-income-tax-calculator/',
    ],
  },
  {
    route: '/categories/health-fitness/',
    label: 'Health and fitness hub',
    minInternalLinks: 25,
    requiredLinks: [
      '/tools/bmi-calculator/',
      '/tools/calorie-calculator/',
      '/tools/due-date-calculator/',
      '/tools/gfr-calculator/',
      '/blog/how-to-use-bmi-calculator/',
      '/blog/how-to-use-calorie-calculator/',
    ],
  },
  {
    route: '/categories/home-projects/',
    label: 'Home projects hub',
    minInternalLinks: 25,
    requiredLinks: [
      '/tools/concrete-calculator/',
      '/tools/paint-calculator/',
      '/tools/wallpaper-calculator/',
      '/tools/flooring-calculator/',
      '/blog/how-to-use-wallpaper-calculator/',
    ],
  },
  {
    route: '/categories/ai-tools/',
    label: 'AI tools hub',
    minInternalLinks: 18,
    requiredLinks: [
      '/tools/image-to-text-ocr-tool/',
      '/tools/text-summarizer/',
      '/tools/language-detector/',
      '/tools/reading-level-checker/',
      '/tools/prompt-token-estimator/',
      '/blog/how-to-use-image-to-text-ocr-tool/',
      '/blog/how-to-use-prompt-token-estimator/',
    ],
  },
  {
    route: '/categories/developer-tools/',
    label: 'Developer tools hub',
    minInternalLinks: 18,
    requiredLinks: [
      '/tools/subnet-calculator/',
      '/tools/password-generator/',
      '/tools/json-formatter/',
      '/tools/url-encode-decode/',
      '/tools/utm-builder/',
    ],
  },
  {
    route: '/categories/converters/',
    label: 'Converters hub',
    minInternalLinks: 16,
    requiredLinks: [
      '/tools/conversion-calculator/',
      '/tools/cooking-measurement-converter/',
      '/tools/oven-temperature-converter/',
      '/tools/butter-converter/',
    ],
  },
  {
    route: '/categories/text-tools/',
    label: 'Text tools hub',
    minInternalLinks: 16,
    requiredLinks: [
      '/tools/word-counter/',
      '/tools/text-case-converter/',
      '/tools/slug-generator/',
      '/tools/markdown-table-generator/',
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

function anchorSignature(anchor) {
  return `${anchor.href}|${anchor.text.toLowerCase()}`;
}

function analyzeHub(check) {
  const htmlPath = builtHtmlPath(check.route);
  if (!htmlPath) {
    return {
      ...check,
      htmlPath: '',
      status: 'failed',
      internalLinkCount: 0,
      uniqueAnchorCount: 0,
      missingRequiredLinks: check.requiredLinks,
      weakAnchors: [],
      issues: ['Built HTML not found. Run npm run build before this audit.'],
    };
  }

  const html = readFileSync(htmlPath, 'utf8');
  const anchors = anchorsFrom(html);
  const internalAnchors = anchors.filter((anchor) => anchor.href.startsWith('/'));
  const uniqueAnchorCount = new Set(internalAnchors.map(anchorSignature)).size;
  const hrefs = new Set(internalAnchors.map((anchor) => anchor.href));
  const missingRequiredLinks = check.requiredLinks.filter((link) => !hrefs.has(link));
  const weakAnchors = internalAnchors
    .filter((anchor) => {
      const normalizedText = anchor.text.toLowerCase().replace(/\s+/g, ' ').trim();
      if (allowedShortAnchorText.has(normalizedText)) return false;
      return normalizedText.length < 4 || /^(read|open|learn more|read guide|open tool)$/.test(normalizedText);
    })
    .slice(0, 10);
  const issues = [];

  if (internalAnchors.length < check.minInternalLinks) {
    issues.push(`Expected at least ${check.minInternalLinks} internal links, found ${internalAnchors.length}.`);
  }

  if (missingRequiredLinks.length) {
    issues.push(`Missing priority links: ${missingRequiredLinks.join(', ')}`);
  }

  if (uniqueAnchorCount < Math.min(internalAnchors.length, check.minInternalLinks) * 0.45) {
    issues.push('Anchor text looks too repetitive for a hub page.');
  }

  return {
    ...check,
    htmlPath,
    status: issues.length ? 'failed' : weakAnchors.length ? 'watch' : 'passed',
    internalLinkCount: internalAnchors.length,
    uniqueAnchorCount,
    missingRequiredLinks,
    weakAnchors,
    issues,
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
    '# Hub Strength Audit',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Checked hubs: ${report.totals.hubs}`,
    `Passed: ${report.totals.passed}`,
    `Watch: ${report.totals.watch}`,
    `Failed: ${report.totals.failed}`,
    '',
    '## Hub Results',
    '',
  ];

  for (const hub of report.hubs) {
    lines.push(`### ${hub.label}`);
    lines.push('');
    lines.push(`- Route: ${hub.route}`);
    lines.push(`- Status: ${hub.status}`);
    lines.push(`- Internal links: ${hub.internalLinkCount}`);
    lines.push(`- Unique anchor pairs: ${hub.uniqueAnchorCount}`);
    lines.push(`- Missing priority links: ${hub.missingRequiredLinks.length ? hub.missingRequiredLinks.join(', ') : 'none'}`);
    lines.push(`- Issues: ${hub.issues.length ? hub.issues.join(' | ') : 'none'}`);
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

const hubs = hubChecks.map(analyzeHub);
const report = {
  generatedAt: new Date().toISOString(),
  outputDir,
  totals: {
    hubs: hubs.length,
    passed: hubs.filter((hub) => hub.status === 'passed').length,
    watch: hubs.filter((hub) => hub.status === 'watch').length,
    failed: hubs.filter((hub) => hub.status === 'failed').length,
  },
  hubs,
};

writeJson(join(outputDir, 'summary.json'), report);
writeText(join(outputDir, 'summary.md'), renderMarkdown(report));

console.log(`Hub strength audit: ${report.totals.passed}/${report.totals.hubs} passed, ${report.totals.watch} watch, ${report.totals.failed} failed.`);
console.log(`Report: ${join(outputDir, 'summary.md')}`);

if (report.totals.failed > 0) {
  process.exitCode = 1;
}
