import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import {
  buildBingEvidenceReport,
  newestBingEvidenceCsv,
  writeBingEvidenceReport,
} from './lib/bing-evidence-import.mjs';

function optionValue(name) {
  const args = process.argv.slice(2);
  const inline = args.find((argument) => argument.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] ?? '' : '';
}

const requestedFile = optionValue('--file');
const discoveredFile = requestedFile || newestBingEvidenceCsv();
const csvFile = discoveredFile ? resolve(discoveredFile) : '';

if (!csvFile || !existsSync(csvFile)) {
  console.error(
    'Bing Webmaster performance CSV not found. Pass --file="C:\\path with spaces\\accessfreetools.com_SearchPerformanceOverview_All_M_D_YYYY.csv".',
  );
  process.exit(1);
}

const report = buildBingEvidenceReport({
  sourceFileName: basename(csvFile),
  sourceText: readFileSync(csvFile, 'utf8'),
});
const paths = writeBingEvidenceReport(report);

console.log(`Imported Bing Webmaster evidence from ${csvFile}`);
console.log(`Saved ${paths.jsonPath}`);
console.log(`Saved ${paths.markdownPath}`);
console.log(`Status: ${report.status}`);
console.log(`Traditional rows: ${report.traditionalSearch.totals.rows}`);
console.log(`Validation issues: ${report.issues.length}`);
