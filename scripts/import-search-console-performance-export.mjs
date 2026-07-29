import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  buildSearchConsolePerformanceReport,
  dataDateFromName,
  newestDeindexedFile,
  newestPerformanceExportDirectory,
  newestPerformanceExportZip,
  newestPerformanceOverviewFile,
  writeSearchConsolePerformanceReport,
} from './lib/search-console-performance-import.mjs';

function option(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

function hasFlag(name) {
  return process.argv.slice(2).includes(name);
}

const requestedDir = option('--dir');
const requestedZip = option('--zip');
const automaticZip = !requestedDir && !requestedZip ? newestPerformanceExportZip() : '';
const automaticDir = !requestedDir && !requestedZip && !automaticZip ? newestPerformanceExportDirectory() : '';
const performanceDir = requestedDir ? resolve(requestedDir) : automaticDir;
const performanceZip = requestedZip ? resolve(requestedZip) : automaticZip;
const performanceSource = performanceZip || performanceDir;

if (!performanceSource || !existsSync(performanceSource)) {
  console.error(
    'Search Console Performance export not found. Pass --zip=C:\\path\\to\\Performance-on-Search.zip or --dir=C:\\path\\to\\Performance-on-Search-export.',
  );
  process.exit(1);
}

const dataDate = dataDateFromName(performanceSource);
const explicitOverview = option('--overview');
const overviewFile = hasFlag('--no-overview')
  ? ''
  : explicitOverview
    ? resolve(explicitOverview)
    : newestPerformanceOverviewFile(undefined, dataDate);
const explicitDeindexed = option('--deindexed');
const deindexedFile = explicitDeindexed
  ? resolve(explicitDeindexed)
  : newestDeindexedFile(undefined, dataDate);

const report = buildSearchConsolePerformanceReport({
  deindexedFile: deindexedFile && existsSync(deindexedFile) ? deindexedFile : '',
  overviewFile: overviewFile && existsSync(overviewFile) ? overviewFile : '',
  performanceDir,
  performanceZip,
});
const paths = writeSearchConsolePerformanceReport(report);

console.log(`Imported Search Console Performance export from ${performanceSource}`);
if (report.source.overviewFile) console.log(`Included overview file ${report.source.overviewFile}`);
if (report.source.deindexedFile) console.log(`Included deindexed file ${report.source.deindexedFile}`);
console.log(`Saved ${paths.jsonPath}`);
console.log(`Saved ${paths.markdownPath}`);
console.log(`Saved ${paths.tierAPath}`);
console.log(`Status: ${report.status}`);
console.log(`Deindexed URLs: ${report.totals.deindexedRows}`);
if (report.source.overviewFile) {
  console.log(
    `Bing overview: ${report.totals.bingOverviewImpressions} impressions, ${report.totals.bingOverviewClicks} clicks, ${report.totals.bingOverviewCtrPercent}% CTR`,
  );
}
console.log(`High-impression zero-click pages: ${report.opportunities.highImpressionZeroClickPages.length}`);
