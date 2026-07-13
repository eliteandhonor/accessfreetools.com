import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { createUsageDataAssetReport, renderUsageDataAssetDraft } from './lib/usage-data-asset-report.mjs';

const args = process.argv.slice(2);
const option = (name, fallback = undefined) =>
  args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) ?? fallback;

function localDateStamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: process.env.AFT_ANALYTICS_TIME_ZONE ?? 'Australia/Brisbane',
    year: 'numeric',
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

function readJson(path) {
  if (!existsSync(path)) return null;

  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

const days = Number(option('--days', '30'));
if (!Number.isInteger(days) || days < 1 || days > 365) {
  throw new Error('--days must be an integer from 1 to 365.');
}
const outputDir = resolve(option('--output-dir', join('output', 'original-data-assets', localDateStamp())));
const analyticsReportPath = resolve(
  option(
    '--analytics-report',
    process.env.AFT_PRODUCTION_ANALYTICS_REPORT_PATH ?? join('output', 'analytics', 'production-latest.json'),
  ),
);
const report = createUsageDataAssetReport({
  productionReport: readJson(analyticsReportPath),
  productionReportPath: analyticsReportPath,
  requestedDays: days,
});
const draft = renderUsageDataAssetDraft(report);

writeJson(join(outputDir, 'summary.json'), report);
writeText(join(outputDir, 'usage-notes-draft.md'), draft);
writeJson(resolve('output', 'original-data-assets', 'latest.json'), report);
writeText(resolve('output', 'original-data-assets', 'latest-usage-notes-draft.md'), draft);

console.log(`Usage data asset report: ${report.status}`);
console.log(`Report: ${join(outputDir, 'summary.json')}`);
console.log(`Draft: ${join(outputDir, 'usage-notes-draft.md')}`);
