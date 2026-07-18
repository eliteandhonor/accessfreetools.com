import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  buildSearchConsolePerformanceReport,
  extractPerformanceExportZip,
  newestDeindexedFile,
  newestPerformanceExportDirectory,
  newestPerformanceExportZip,
  newestPerformanceOverviewFile,
  sourceDataDate,
  writeSearchConsolePerformanceReport,
} from './lib/search-console-performance-import.mjs';

function option(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

const explicitDirectory = option('--dir');
const explicitZip = option('--zip');
const discoveredDirectory = newestPerformanceExportDirectory();
const discoveredZip = newestPerformanceExportZip();
const useDiscoveredZip =
  !explicitDirectory &&
  !explicitZip &&
  discoveredZip &&
  (!discoveredDirectory || sourceDataDate(discoveredZip) > sourceDataDate(discoveredDirectory));
const zipInput = explicitZip || (useDiscoveredZip ? discoveredZip : '');
const performanceInput = explicitDirectory || (!zipInput ? discoveredDirectory : '');
const performanceDir = zipInput
  ? extractPerformanceExportZip(resolve(zipInput))
  : performanceInput
    ? resolve(performanceInput)
    : '';
const explicitOverview = option('--overview');
const noOverview = process.argv.slice(2).includes('--no-overview');
const overviewFile = noOverview
  ? ''
  : explicitOverview || newestPerformanceOverviewFile(undefined, sourceDataDate(performanceDir));
const deindexedFile = option('--deindexed') || newestDeindexedFile();

if (!performanceDir || !existsSync(performanceDir)) {
  console.error(
    'Search Console Performance export not found. Pass --dir=C:\\path\\to\\Performance-on-Search-export or --zip=C:\\path\\to\\Performance-on-Search.zip.',
  );
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
else if (!noOverview) console.log('No date-matched Bing overview was included.');
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
