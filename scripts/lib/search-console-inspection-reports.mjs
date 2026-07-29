import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const REPORT_NAME = /(?:search-console.*inspection|url-inspection).*\.json$/i;
const MAX_FILES = 2_000;
const MAX_DEPTH = 6;

function timestamp(value) {
  const parsed = new Date(value ?? 0).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeInspectionUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  try {
    const url = new URL(raw);
    url.hash = '';
    return url.toString();
  } catch {
    return raw;
  }
}

export function discoverInspectionReportFiles(root = resolve('output')) {
  if (!root || !existsSync(root)) return [];
  const files = [];

  function visit(directory, depth) {
    if (depth > MAX_DEPTH || files.length >= MAX_FILES) return;

    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (files.length >= MAX_FILES) break;
      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath, depth + 1);
      } else if (entry.isFile() && REPORT_NAME.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  visit(root, 0);
  return files.sort((left, right) => left.localeCompare(right));
}

export function readInspectionReports(files = []) {
  const reports = [];

  for (const file of files) {
    try {
      const report = JSON.parse(readFileSync(file, 'utf8'));
      if (!Array.isArray(report?.inspections)) continue;
      reports.push({ report, sourcePath: file });
    } catch {
      // Invalid or unrelated JSON is excluded from the merged evidence.
    }
  }

  return reports;
}

export function mergeInspectionReports(records = [], generatedAt = new Date().toISOString()) {
  const selected = new Map();
  const sources = [];

  for (const record of records) {
    const report = record?.report ?? record;
    if (!Array.isArray(report?.inspections)) continue;
    const sourcePath = record?.sourcePath ?? report?.sourcePath ?? '';
    const reportGeneratedAt = report.generatedAt ?? '';
    const reportTime = timestamp(reportGeneratedAt);
    sources.push({
      generatedAt: reportGeneratedAt,
      inspectionCount: report.inspections.length,
      path: sourcePath,
    });

    for (const inspection of report.inspections) {
      const inspectionUrl = normalizeInspectionUrl(inspection?.inspectionUrl);
      if (!inspectionUrl) continue;
      const sourceGeneratedAt = inspection.sourceGeneratedAt ?? reportGeneratedAt;
      const sourceTime = timestamp(sourceGeneratedAt) || reportTime;
      const current = selected.get(inspectionUrl);
      if (current && sourceTime < current.sourceTime) continue;

      selected.set(inspectionUrl, {
        inspection: {
          ...inspection,
          inspectionUrl,
          sourceGeneratedAt,
          sourcePath,
        },
        sourceTime,
      });
    }
  }

  const inspections = [...selected.values()]
    .map((value) => value.inspection)
    .sort((left, right) => left.inspectionUrl.localeCompare(right.inspectionUrl));
  const latestSourceGeneratedAt = sources
    .map((source) => source.generatedAt)
    .filter(Boolean)
    .sort((left, right) => timestamp(right) - timestamp(left))[0] ?? '';

  return {
    generatedAt,
    inspections,
    kind: 'search-console-url-inspection-merged',
    latestSourceGeneratedAt,
    sourceCount: sources.length,
    sources: sources.sort((left, right) => timestamp(right.generatedAt) - timestamp(left.generatedAt)),
  };
}

export function loadMergedInspectionReport(root = resolve('output')) {
  return mergeInspectionReports(readInspectionReports(discoverInspectionReportFiles(root)));
}

export function writeMergedInspectionReport(
  report,
  outputPath = resolve('output', 'search-console-url-inspection.json'),
) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  return outputPath;
}
