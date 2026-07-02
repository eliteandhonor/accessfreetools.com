import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  buildSearchConsolePerformanceReport,
  newestDeindexedFile,
  newestPerformanceExportDirectory,
  newestPerformanceOverviewFile,
  writeSearchConsolePerformanceReport,
} from './lib/search-console-performance-import.mjs';

function option(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

const performanceDir = resolve(option('--dir') || newestPerformanceExportDirectory());
const overviewFile = option('--overview') || newestPerformanceOverviewFile();
const deindexedFile = option('--deindexed') || newestDeindexedFile();

if (!performanceDir || !existsSync(performanceDir)) {
  console.error('Search Console Performance export directory not found. Pass --dir=C:\\path\\to\\Performance-on-Search-export.');
  process.exit(1);
}

const report = buildSearchConsolePerformanceReport({
  deindexedFile: deindexedFile && existsSync(deindexedFile) ? deindexedFile : '',
  overviewFile: overviewFile && existsSync(overviewFile) ? overviewFile : '',
  performanceDir,
});
const paths = writeSearchConsolePerformanceReport(report);

console.log(`Imported Search Console Performance export from ${performanceDir}`);
if (report.source.overviewFile) console.log(`Included overview file ${report.source.overviewFile}`);
if (report.source.deindexedFile) console.log(`Included deindexed file ${report.source.deindexedFile}`);
console.log(`Saved ${paths.jsonPath}`);
console.log(`Saved ${paths.markdownPath}`);
console.log(`Saved ${paths.tierAPath}`);
console.log(`Status: ${report.status}`);
console.log(`Deindexed URLs: ${report.totals.deindexedRows}`);
console.log(`High-impression zero-click pages: ${report.opportunities.highImpressionZeroClickPages.length}`);
