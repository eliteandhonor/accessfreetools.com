import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';

const SITE_ORIGIN = 'https://accessfreetools.com';
const args = process.argv.slice(2);
const outputDir = resolve(
  args.find((arg) => arg.startsWith('--output-dir='))?.slice('--output-dir='.length) ??
    join('output', 'deep-audit-local'),
);
const srcDir = resolve('src');
const dataDir = join(srcDir, 'data');
const pagesDir = join(srcDir, 'pages');
const docsDir = resolve('docs');
const distDir = resolve('dist');
const publicDistDir = existsSync(join(distDir, 'client')) ? join(distDir, 'client') : distDir;

const highRiskTools = [
  'mortgage-calculator',
  'loan-calculator',
  'auto-loan-calculator',
  'income-tax-calculator',
  'salary-calculator',
  'compound-interest-calculator',
  'bmi-calculator',
  'calorie-calculator',
  'gfr-calculator',
  'pregnancy-calculator',
  'due-date-calculator',
  'bac-calculator',
  'concrete-calculator',
  'wallpaper-calculator',
  'watts-to-amps-calculator',
  'voltage-drop-calculator',
  'ohms-law-calculator',
  'password-generator',
  'subnet-calculator',
  'image-to-text-ocr-tool',
];

const legalSnippets = {
  'src/pages/privacy-policy.astro': [
    'Google AdSense',
    'cookies',
    'affiliate',
    'contact@accessfreetools.com',
    'browser',
  ],
  'src/pages/advertising-disclosure.astro': [
    'fake ad boxes',
    'Affiliate disclosures should appear close',
    'commission',
    'contact@accessfreetools.com',
  ],
  'src/pages/terms.astro': [
    'not professional financial, medical, legal, tax, engineering',
    'planning aids only',
    'contact@accessfreetools.com',
  ],
  'src/pages/contact.astro': ['contact@accessfreetools.com', 'Privacy question', 'disclosure questions'],
};

const genericPhrases = [
  'This calculator is for general informational purposes only.',
  'Use this calculator to estimate',
  'Results are estimates only',
  'Always double-check',
  'A practical guide to using',
  'This tool can help you',
];

function walk(directory, predicate = () => true, files = []) {
  if (!existsSync(directory)) {
    return files;
  }

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, predicate, files);
    } else if (entry.isFile() && predicate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function read(path) {
  return readFileSync(path, 'utf8');
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function bytesToKb(bytes) {
  return Number((bytes / 1024).toFixed(1));
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function getToolSlugs() {
  const files = [
    join(dataDir, 'tools.ts'),
    join(dataDir, 'aiTools.ts'),
    join(dataDir, 'financeTools.ts'),
    join(dataDir, 'healthTools.ts'),
    join(dataDir, 'mathExpansionTools.ts'),
    join(dataDir, 'utilityTools.ts'),
  ];
  const slugs = new Set();

  for (const file of files) {
    if (!existsSync(file)) {
      continue;
    }

    for (const match of read(file).matchAll(/\bslug:\s*'([^']+)'/g)) {
      slugs.add(match[1]);
    }
  }

  return [...slugs].sort();
}

function auditRecordSummary() {
  const file = join(dataDir, 'toolDeepAudit.ts');
  const source = read(file);
  const records = [...source.matchAll(/\bslug:\s*'([^']+)'[\s\S]*?\bstatus:\s*'([^']+)'/g)].map((match) => ({
    slug: match[1],
    status: match[2],
  }));
  const statusCounts = records.reduce((counts, record) => {
    counts[record.status] = (counts[record.status] ?? 0) + 1;
    return counts;
  }, {});

  return {
    records,
    statusCounts,
    deepReviewed: statusCounts['deep-reviewed'] ?? 0,
    baselineReviewed: statusCounts['baseline-reviewed'] ?? 0,
    aliasReviewed: statusCounts['alias-reviewed'] ?? 0,
  };
}

function checkDataModuleSizes() {
  return walk(dataDir, (file) => file.endsWith('.ts'))
    .map((file) => ({
      file: relative(process.cwd(), file).replace(/\\/g, '/'),
      kb: bytesToKb(statSync(file).size),
    }))
    .filter((item) => item.kb >= 100)
    .sort((a, b) => b.kb - a.kb)
    .map((item) => ({
      ...item,
      severity: item.kb >= 450 ? 'high' : item.kb >= 250 ? 'medium' : 'watch',
      recommendation:
        item.kb >= 450
          ? 'Split this source into category-specific modules before the 500+ tool stage.'
          : 'Keep watching this module as future tool batches are added.',
    }));
}

function checkFormulaTests() {
  const testSources = [
    existsSync(join(srcDir, 'lib', 'calculator.test.ts')) ? read(join(srcDir, 'lib', 'calculator.test.ts')) : '',
    ...walk(resolve('tests'), (file) => file.endsWith('.ts')).map((file) => read(file)),
  ].join('\n');
  const normalizedTestSource = testSources.toLowerCase().replace(/[^a-z0-9]/g, '');
  const explicitCoverageTerms = {
    'password-generator': ['generatepassword', 'estimatedentropy', 'passwordgenerator'],
    'image-to-text-ocr-tool': ['imagetotextocrtool', 'aimodelfiles', 'traineddatagz'],
  };

  return highRiskTools.map((slug) => {
    const compactSlug = slug.replace(/-calculator$/, '').replace(/-/g, '');
    const hasSlugMention = testSources.toLowerCase().includes(slug);
    const hasNameMention = normalizedTestSource.includes(compactSlug);
    const hasExplicitTerm = (explicitCoverageTerms[slug] ?? []).some((term) => normalizedTestSource.includes(term));

    if (hasSlugMention || hasNameMention || hasExplicitTerm) {
      return {
        slug,
        status: 'covered-or-mentioned',
        recommendation: 'Tests appear to mention this tool, its calculation helper, or its browser/runtime behavior.',
      };
    }

    return {
      slug,
      status: 'needs-formula-test-review',
      recommendation: 'Add or confirm formula/runtime tests for this high-risk tool before relying on content-only review.',
    };
  });
}

function checkGenericContent() {
  const files = [
    ...walk(dataDir, (file) => /BlogGuides\.ts$/.test(file) || /Tools\.ts$/.test(file) || /tools\.ts$/.test(file)),
    ...walk(join(pagesDir, 'blog'), (file) => file.endsWith('.astro')),
  ];
  const phraseCounts = [];

  for (const phrase of genericPhrases) {
    const hits = [];

    for (const file of files) {
      const source = read(file);
      const count = countMatches(source, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'));

      if (count > 0) {
        hits.push({
          file: relative(process.cwd(), file).replace(/\\/g, '/'),
          count,
        });
      }
    }

    const total = hits.reduce((sum, hit) => sum + hit.count, 0);
    if (total > 10) {
      phraseCounts.push({
        phrase,
        total,
        sampleFiles: hits.slice(0, 8),
        recommendation: 'Review repeated phrasing during content refreshes so guides feel specific instead of template-like.',
      });
    }
  }

  return phraseCounts.sort((a, b) => b.total - a.total);
}

function checkLegalTrust() {
  const results = [];

  for (const [file, snippets] of Object.entries(legalSnippets)) {
    const fullPath = resolve(file);
    const source = existsSync(fullPath) ? read(fullPath) : '';
    const missing = snippets.filter((snippet) => !source.includes(snippet));

    results.push({
      file,
      status: source && missing.length === 0 ? 'ok' : 'needs-review',
      missing,
    });
  }

  return results;
}

function checkSecurityHeaders() {
  const htaccessPath = resolve('public', '.htaccess');
  const htaccess = existsSync(htaccessPath) ? read(htaccessPath) : '';
  const expected = [
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    'X-Frame-Options',
  ];

  return {
    file: 'public/.htaccess',
    missingHeaders: expected.filter((header) => !htaccess.includes(header)),
    recommendation:
      'Keep static security headers in .htaccess and avoid a strict CSP until every inline script, model asset, and third-party endpoint is mapped.',
  };
}

function checkDiscoveryFiles() {
  const expected = [
    'robots.txt',
    'sitemap.xml',
    'sitemap-tools.xml',
    'sitemap-blog.xml',
    'feed.xml',
    'pinterest-feed.xml',
    'pinterest/free-online-calculators.xml',
    'pinterest/home-project-calculators.xml',
    'pinterest/finance-calculators.xml',
    'pinterest/school-and-study-tools.xml',
  ];
  const files = expected.map((name) => {
    const fullPath = join(publicDistDir, name);
    return {
      file: name,
      exists: existsSync(fullPath),
      kb: existsSync(fullPath) ? bytesToKb(statSync(fullPath).size) : 0,
    };
  });
  const robotsPath = join(publicDistDir, 'robots.txt');
  const robots = existsSync(robotsPath) ? read(robotsPath) : '';

  return {
    files,
    robotsHasSitemap: robots.includes(`${SITE_ORIGIN}/sitemap.xml`),
    robotsHasIndexNowKey: robots.includes('IndexNow'),
  };
}

function checkPromotionQueue() {
  const file = join(docsDir, 'promotion-queue.md');
  const source = existsSync(file) ? read(file) : '';
  const rows = source
    .split('\n')
    .filter((line) => line.startsWith('|') && !line.includes('---') && !line.includes('Priority | Page'))
    .map((line) => line.split('|').map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 7)
    .map((cells) => ({
      priority: cells[1],
      page: cells[2],
      channel: cells[4],
      status: cells[5],
      nextAction: cells[6],
    }));

  return {
    totalRows: rows.length,
    byStatus: rows.reduce((counts, row) => {
      counts[row.status] = (counts[row.status] ?? 0) + 1;
      return counts;
    }, {}),
    needsApproval: rows.filter((row) => row.status === 'needs approval'),
    waiting: rows.filter((row) => row.status === 'waiting'),
  };
}

function checkBuildArtifacts() {
  if (!existsSync(publicDistDir)) {
    return { status: 'missing-build', recommendation: 'Run npm run build before full local artifact audit.' };
  }

  const files = walk(publicDistDir);
  const htmlCount = files.filter((file) => file.endsWith('.html')).length;
  const byExt = files.reduce((counts, file) => {
    const ext = extname(file).toLowerCase() || '(none)';
    counts[ext] = (counts[ext] ?? 0) + 1;
    return counts;
  }, {});

  return {
    status: 'ok',
    htmlCount,
    totalFiles: files.length,
    byExt,
  };
}

const toolSlugs = getToolSlugs();
const auditSummary = auditRecordSummary();
const missingAuditRecords = toolSlugs.filter(
  (slug) => !auditSummary.records.some((record) => record.slug === slug && record.status === 'deep-reviewed'),
);
const report = {
  generatedAt: new Date().toISOString(),
  toolCoverage: {
    canonicalToolCount: toolSlugs.length,
    auditStatusCounts: auditSummary.statusCounts,
    missingDeepReviewRecords: missingAuditRecords,
  },
  buildArtifacts: checkBuildArtifacts(),
  maintainability: {
    oversizedDataModules: checkDataModuleSizes(),
    highRiskFormulaTestReview: checkFormulaTests(),
  },
  contentQuality: {
    repeatedGenericPhrases: checkGenericContent(),
  },
  legalTrust: checkLegalTrust(),
  security: checkSecurityHeaders(),
  discovery: checkDiscoveryFiles(),
  promotion: checkPromotionQueue(),
};

const rankedRecommendations = [];

if (report.toolCoverage.missingDeepReviewRecords.length > 0) {
  rankedRecommendations.push({
    priority: 'P1',
    area: 'Manual review truthfulness',
    recommendation: `${report.toolCoverage.missingDeepReviewRecords.length} tools are missing deep-review records. Review exact pages before marking complete.`,
  });
}

if (report.security.missingHeaders.length > 0) {
  rankedRecommendations.push({
    priority: 'P1',
    area: 'Security headers',
    recommendation: `Add or verify static security headers: ${report.security.missingHeaders.join(', ')}.`,
  });
}

for (const item of report.legalTrust.filter((entry) => entry.status !== 'ok')) {
  rankedRecommendations.push({
    priority: 'P1',
    area: 'Legal/trust',
    recommendation: `${item.file} is missing expected wording: ${item.missing.join(', ')}.`,
  });
}

for (const item of report.maintainability.oversizedDataModules.filter((entry) => entry.severity !== 'watch').slice(0, 5)) {
  rankedRecommendations.push({
    priority: item.severity === 'high' ? 'P2' : 'P3',
    area: 'Maintainability',
    recommendation: `${item.file} is ${item.kb} KB. ${item.recommendation}`,
  });
}

const missingFormulaReview = report.maintainability.highRiskFormulaTestReview.filter(
  (item) => item.status === 'needs-formula-test-review',
);
if (missingFormulaReview.length > 0) {
  rankedRecommendations.push({
    priority: 'P2',
    area: 'Formula tests',
    recommendation: `Review formula test coverage for: ${missingFormulaReview.map((item) => item.slug).slice(0, 12).join(', ')}.`,
  });
}

if (report.promotion.needsApproval.length > 0) {
  rankedRecommendations.push({
    priority: 'P3',
    area: 'Promotion',
    recommendation: `${report.promotion.needsApproval.length} promotion queue items need exact approval before posting.`,
  });
}

report.rankedRecommendations = rankedRecommendations;

const markdown = [
  '# Local Deep Audit',
  '',
  `Generated: ${report.generatedAt}`,
  '',
  '## Coverage',
  '',
  `- Canonical tools detected: ${report.toolCoverage.canonicalToolCount}`,
  `- Audit status counts: ${JSON.stringify(report.toolCoverage.auditStatusCounts)}`,
  `- Missing deep-review records: ${report.toolCoverage.missingDeepReviewRecords.length}`,
  `- Built HTML pages: ${report.buildArtifacts.htmlCount ?? 'build not available'}`,
  '',
  '## Ranked Recommendations',
  '',
  ...(rankedRecommendations.length
    ? rankedRecommendations.map((item) => `- ${item.priority} ${item.area}: ${item.recommendation}`)
    : ['- No local P1/P2/P3 recommendations were found by this pass.']),
  '',
  '## Watch Items',
  '',
  `- Oversized data modules: ${report.maintainability.oversizedDataModules.length}`,
  `- Repeated generic phrase clusters: ${report.contentQuality.repeatedGenericPhrases.length}`,
  `- Promotion items needing approval: ${report.promotion.needsApproval.length}`,
  `- Security headers missing: ${report.security.missingHeaders.length}`,
  '',
].join('\n');

writeJson(join(outputDir, 'local-audit.json'), report);
writeText(join(outputDir, 'local-audit.md'), markdown);

console.log(`Saved local deep audit to ${join(outputDir, 'local-audit.md')}`);

if (rankedRecommendations.some((item) => item.priority === 'P1')) {
  process.exitCode = 2;
}
