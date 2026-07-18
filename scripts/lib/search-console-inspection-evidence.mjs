import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

export const LATEST_INSPECTION_EVIDENCE_PATH = 'output/search-console/url-inspection-latest.json';

function candidateReportPaths(root) {
  const candidates = [];
  const outputDir = join(root, 'output');
  const searchConsoleDir = join(outputDir, 'search-console');
  const canonicalPath = join(outputDir, 'search-console-url-inspection.json');

  if (process.env.AFT_SEARCH_CONSOLE_INSPECTION_CANONICAL_ONLY === 'true') {
    return existsSync(canonicalPath) ? [canonicalPath] : [];
  }

  if (existsSync(outputDir)) {
    for (const entry of readdirSync(outputDir, { withFileTypes: true })) {
      if (entry.isFile() && /^search-console-url-inspection.*\.json$/i.test(entry.name)) {
        candidates.push(join(outputDir, entry.name));
      }
    }
  }

  if (existsSync(searchConsoleDir)) {
    for (const entry of readdirSync(searchConsoleDir, { withFileTypes: true })) {
      if (
        entry.isFile() &&
        /inspection.*\.json$/i.test(entry.name) &&
        entry.name.toLowerCase() !== 'url-inspection-latest.json'
      ) {
        candidates.push(join(searchConsoleDir, entry.name));
      }
    }
  }

  return [...new Set(candidates)].sort();
}

function parseReport(filePath) {
  try {
    const report = JSON.parse(readFileSync(filePath, 'utf8'));
    if (!Array.isArray(report?.inspections)) return null;
    const generatedAt = new Date(report.generatedAt ?? '');
    const fallbackGeneratedAt = statSync(filePath).mtime.toISOString();
    return {
      generatedAt: Number.isFinite(generatedAt.getTime()) ? generatedAt.toISOString() : fallbackGeneratedAt,
      inspections: report.inspections,
      site: report.site ?? null,
    };
  } catch {
    return null;
  }
}

function normalizeInspectionUrl(value) {
  try {
    const url = new URL(String(value ?? ''));
    if (url.origin !== 'https://accessfreetools.com') return '';
    url.hash = '';
    return url.href;
  } catch {
    return '';
  }
}

function timestamp(value) {
  const date = new Date(value ?? '');
  return Number.isFinite(date.getTime()) ? date.getTime() : 0;
}

export function buildLatestSearchConsoleInspectionEvidence({ root = process.cwd() } = {}) {
  const reportEntries = candidateReportPaths(root)
    .map((filePath) => ({ filePath, report: parseReport(filePath) }))
    .filter((entry) => entry.report);
  const latestByUrl = new Map();
  const collectionErrors = [];

  for (const entry of reportEntries) {
    const sourceReport = relative(root, entry.filePath).replace(/\\/g, '/');
    for (const inspection of entry.report.inspections) {
      const inspectionUrl = normalizeInspectionUrl(inspection?.inspectionUrl);
      if (!inspectionUrl) continue;

      if (inspection.error) {
        collectionErrors.push({
          error: String(inspection.error),
          inspectionUrl,
          sourceGeneratedAt: entry.report.generatedAt,
          sourceReport,
        });
        continue;
      }

      const current = latestByUrl.get(inspectionUrl);
      if (current && timestamp(current.sourceGeneratedAt) > timestamp(entry.report.generatedAt)) continue;
      if (
        current &&
        timestamp(current.sourceGeneratedAt) === timestamp(entry.report.generatedAt) &&
        current.sourceReport.localeCompare(sourceReport) >= 0
      ) {
        continue;
      }

      latestByUrl.set(inspectionUrl, {
        ...inspection,
        inspectionUrl,
        sourceGeneratedAt: entry.report.generatedAt,
        sourceReport,
      });
    }
  }

  const sourceReports = reportEntries
    .map((entry) => ({
      generatedAt: entry.report.generatedAt,
      inspectionCount: entry.report.inspections.length,
      path: relative(root, entry.filePath).replace(/\\/g, '/'),
    }))
    .sort((left, right) => timestamp(right.generatedAt) - timestamp(left.generatedAt));
  const inspections = [...latestByUrl.values()].sort((left, right) =>
    left.inspectionUrl.localeCompare(right.inspectionUrl),
  );
  const generatedAt = sourceReports[0]?.generatedAt ?? '';

  return {
    collectionErrors: collectionErrors.sort(
      (left, right) => timestamp(right.sourceGeneratedAt) - timestamp(left.sourceGeneratedAt),
    ),
    generatedAt,
    inspections,
    kind: 'search-console-url-inspection-aggregate',
    site: reportEntries
      .sort((left, right) => timestamp(right.report.generatedAt) - timestamp(left.report.generatedAt))
      .find((entry) => entry.report.site)?.report.site ?? null,
    sourceReports,
    status: inspections.length ? 'ready' : 'missing',
    summary: {
      collectionErrors: collectionErrors.length,
      sourceReports: sourceReports.length,
      uniqueUrls: inspections.length,
    },
  };
}

export function writeLatestSearchConsoleInspectionEvidence({
  outputPath = LATEST_INSPECTION_EVIDENCE_PATH,
  root = process.cwd(),
} = {}) {
  const report = buildLatestSearchConsoleInspectionEvidence({ root });
  const resolvedOutputPath = resolve(root, outputPath);
  mkdirSync(dirname(resolvedOutputPath), { recursive: true });
  writeFileSync(resolvedOutputPath, `${JSON.stringify(report, null, 2)}\n`);
  return { outputPath: relative(root, resolvedOutputPath).replace(/\\/g, '/'), report };
}

export function loadLatestSearchConsoleInspectionEvidence({ root = process.cwd(), write = false } = {}) {
  return write
    ? writeLatestSearchConsoleInspectionEvidence({ root }).report
    : buildLatestSearchConsoleInspectionEvidence({ root });
}
