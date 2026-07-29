import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  discoverInspectionReportFiles,
  mergeInspectionReports,
  readInspectionReports,
  writeMergedInspectionReport,
} from './lib/search-console-inspection-reports.mjs';

function option(name) {
  const prefix = `${name}=`;
  return process.argv.slice(2).find((arg) => arg.startsWith(prefix))?.slice(prefix.length) ?? '';
}

const inputRoot = resolve(option('--input-root') || 'output');
const outputPath = resolve(option('--output') || 'output/search-console-url-inspection.json');

if (!existsSync(inputRoot)) {
  console.error(`Search Console inspection input root not found: ${inputRoot}`);
  process.exit(1);
}

const files = discoverInspectionReportFiles(inputRoot).filter(
  (file) => resolve(file).toLowerCase() !== outputPath.toLowerCase(),
);
const report = mergeInspectionReports(readInspectionReports(files));
writeMergedInspectionReport(report, outputPath);

console.log(`Merged ${report.inspections.length} latest URL inspections from ${report.sourceCount} report(s).`);
console.log(`Saved ${outputPath}`);
