import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { delimiter, dirname, join, resolve } from 'node:path';

import {
  analyzeNewToolGrowthPilot,
  JSON_TO_CSV_PILOT_URLS,
  renderNewToolGrowthPilotReport,
} from './lib/new-tool-growth-pilot-report.mjs';

const JSON_PATH = resolve('output/new-tool-growth-pilot/latest.json');
const MARKDOWN_PATH = resolve('output/new-tool-growth-pilot/latest.md');

function parseArgs(argv) {
  const roots = [
    resolve('.'),
    ...String(process.env.AFT_PILOT_EVIDENCE_ROOTS ?? '')
      .split(delimiter)
      .map((path) => path.trim())
      .filter(Boolean)
      .map((path) => resolve(path)),
  ];

  for (const arg of argv) {
    if (arg.startsWith('--evidence-root=')) {
      roots.push(resolve(arg.slice('--evidence-root='.length)));
    } else if (arg === '--help') {
      console.log(`New Tool Growth Pilot status

Usage:
  npm run pilot:new-tool-growth
  $env:AFT_PILOT_EVIDENCE_ROOTS="C:\\path\\to\\another\\workspace"; npm run pilot:new-tool-growth
  node scripts/new-tool-growth-pilot-report.mjs --evidence-root="C:\\path\\to\\another\\workspace"

The command is read-only except for ignored reports under output/new-tool-growth-pilot/.`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return [...new Set(roots)];
}

function readJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function generatedTime(report) {
  const value = new Date(report?.generatedAt ?? 0).getTime();
  return Number.isFinite(value) ? value : 0;
}

function newestReport(candidates) {
  return candidates
    .map((path) => ({ path, report: readJson(path) }))
    .filter((entry) => entry.report)
    .sort((left, right) => generatedTime(right.report) - generatedTime(left.report))[0] ?? null;
}

function filesIn(path) {
  if (!existsSync(path) || !statSync(path).isDirectory()) return [];
  return readdirSync(path)
    .filter((name) => name.endsWith('.json'))
    .map((name) => join(path, name));
}

function collectInspectionReports(roots) {
  const reports = [];

  for (const root of roots) {
    for (const path of filesIn(join(root, 'output', 'search-console'))) {
      const report = readJson(path);
      if (!Array.isArray(report?.inspections)) continue;
      if (!report.inspections.some((inspection) => JSON_TO_CSV_PILOT_URLS.includes(inspection?.inspectionUrl))) {
        continue;
      }
      reports.push({ ...report, source: path });
    }

    const legacyPath = join(root, 'output', 'search-console-url-inspection.json');
    const legacy = readJson(legacyPath);
    if (Array.isArray(legacy?.inspections)) {
      reports.push({ ...legacy, source: legacyPath });
    }
  }

  return reports;
}

function reportPaths(roots, relativePath) {
  return roots.map((root) => join(root, relativePath));
}

const evidenceRoots = parseArgs(process.argv.slice(2));
const sitemapEntry = newestReport(reportPaths(evidenceRoots, 'output/production-sitemap-check.json'));
const crawlScoutEntry = newestReport(reportPaths(evidenceRoots, 'output/crawlscout/crawlscout-summary.json'));
const performanceEntry = newestReport(reportPaths(evidenceRoots, 'output/search-console/performance-latest.json'));
const analyticsEntry = newestReport([
  ...reportPaths(evidenceRoots, 'output/analytics/production-json-to-csv-converter-latest.json'),
  ...reportPaths(evidenceRoots, 'output/analytics/production-latest.json'),
]);

const report = analyzeNewToolGrowthPilot({
  analytics: analyticsEntry?.report,
  crawlScout: crawlScoutEntry?.report,
  inspectionReports: collectInspectionReports(evidenceRoots),
  performance: performanceEntry?.report,
  productionSitemap: sitemapEntry?.report,
});
report.evidence = {
  analytics: analyticsEntry?.path ?? '',
  crawlScout: crawlScoutEntry?.path ?? '',
  roots: evidenceRoots,
  searchPerformance: performanceEntry?.path ?? '',
  productionSitemap: sitemapEntry?.path ?? '',
};

mkdirSync(dirname(JSON_PATH), { recursive: true });
writeFileSync(JSON_PATH, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(MARKDOWN_PATH, renderNewToolGrowthPilotReport(report));

console.log(renderNewToolGrowthPilotReport(report));
console.log(`Saved JSON: ${JSON_PATH}`);
console.log(`Saved Markdown: ${MARKDOWN_PATH}`);
