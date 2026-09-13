import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const REPORT_NAME = /(?:search-console.*inspection|url-inspection).*\.json$/i;
const MAX_FILES = 2_000;
const MAX_DEPTH = 6;
const DAY_MS = 24 * 60 * 60 * 1000;
export const INSPECTION_EVIDENCE_FRESH_DAYS = 7;

function timestamp(value) {
  const parsed = typeof value === 'string' && value.trim() ? Date.parse(value) : NaN;
  return Number.isFinite(parsed) ? parsed : -Infinity;
}

export function inspectionEvidenceFreshness(value, {
  now = new Date(),
  notBefore = '',
  maxAgeDays = INSPECTION_EVIDENCE_FRESH_DAYS,
} = {}) {
  const observedTime = timestamp(value);
  const currentTime = now.getTime();
  if (!Number.isFinite(observedTime) || !Number.isFinite(currentTime)) {
    return { status: 'undated', ageDays: null };
  }
  const ageDays = (currentTime - observedTime) / DAY_MS;
  const status = observedTime > currentTime ? 'future'
    : observedTime < timestamp(notBefore) ? 'prelaunch'
      : ageDays > maxAgeDays ? 'stale' : 'fresh';
  return { status, ageDays };
}

export function hasInspectionSourcePath(value) {
  return typeof value === 'string' && Boolean(value.trim()) && !/[\u0000-\u001f\u007f]/.test(value);
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
    const isSummary = !Array.isArray(report?.inspections) && Array.isArray(report?.indexedSummary);
    const reportInspections = isSummary
      ? report.indexedSummary.map((item) => ({ ...item, inspectionUrl: item.url })) : report?.inspections;
    if (!Array.isArray(reportInspections)) continue;
    const sourcePath = Object.hasOwn(record, 'sourcePath') ? record.sourcePath
      : Object.hasOwn(report, 'sourcePath') ? report.sourcePath
        : Object.hasOwn(report, 'source') ? report.source : '';
    const reportGeneratedAt = Object.hasOwn(report, 'generatedAt') ? report.generatedAt : '';
    const isMerged = isSummary || report.kind === 'search-console-url-inspection-merged' ||
      Array.isArray(report.sources) || Object.hasOwn(report, 'latestSourceGeneratedAt');
    sources.push({
      generatedAt: reportGeneratedAt,
      inspectionCount: reportInspections.length,
      path: sourcePath,
    });

    for (const inspection of reportInspections) {
      const inspectionUrl = normalizeInspectionUrl(inspection?.inspectionUrl);
      if (!inspectionUrl) continue;
      // Only a raw run can supply a missing observation date or origin path.
      const sourceGeneratedAt = Object.hasOwn(inspection, 'sourceGeneratedAt')
        ? inspection.sourceGeneratedAt : isMerged ? '' : reportGeneratedAt;
      const originPath = Object.hasOwn(inspection, 'sourcePath')
        ? inspection.sourcePath : isMerged ? '' : sourcePath;
      const sourceTime = timestamp(sourceGeneratedAt);
      const current = selected.get(inspectionUrl);
      if (current && sourceTime < current.sourceTime) continue;
      // Older weekly serializers dropped indexingState. Prefer the intact copy of the same observation.
      const moreCompleteDuplicate = current && Number.isFinite(sourceTime) && sourceTime === current.sourceTime &&
        hasInspectionSourcePath(originPath) && originPath === current.inspection.sourcePath &&
        inspection.verdict === current.inspection.verdict && !inspection.error && !current.inspection.error &&
        !(typeof current.inspection.indexingState === 'string' && current.inspection.indexingState.trim()) &&
        typeof inspection.indexingState === 'string' && Boolean(inspection.indexingState.trim());
      if (current && sourceTime === current.sourceTime && hasInspectionSourcePath(current.inspection.sourcePath) &&
        (!hasInspectionSourcePath(originPath) || current.inspection.sourcePath <= originPath) && !moreCompleteDuplicate) continue;

      selected.set(inspectionUrl, {
        inspection: {
          ...inspection,
          inspectionUrl,
          sourceGeneratedAt,
          sourcePath: originPath,
        },
        sourceTime,
      });
    }
  }

  const inspections = [...selected.values()]
    .map((value) => value.inspection)
    .sort((left, right) => left.inspectionUrl.localeCompare(right.inspectionUrl));
  const latestSourceGeneratedAt = inspections
    .map((inspection) => inspection.sourceGeneratedAt)
    .filter((value) => Number.isFinite(timestamp(value)))
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
