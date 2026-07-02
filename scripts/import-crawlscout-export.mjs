import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildCrawlScoutReport, newestCrawlScoutCsv, writeCrawlScoutReport } from './lib/crawlscout-import.mjs';

function option(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

const csvFile = resolve(option('--file') || newestCrawlScoutCsv());

if (!csvFile || !existsSync(csvFile)) {
  console.error('CrawlScout/deindexed CSV not found. Pass --file=C:\\path\\to\\deindexed.csv.');
  process.exit(1);
}

const report = buildCrawlScoutReport({ csvFile });
const paths = writeCrawlScoutReport(report);

console.log(`Imported CrawlScout/deindexed export from ${csvFile}`);
console.log(`Saved ${paths.jsonPath}`);
console.log(`Saved ${paths.markdownPath}`);
console.log(`Saved ${paths.latestPath}`);
console.log(`Status: ${report.status}`);
console.log(`Non-indexed/deindexed URLs: ${report.totals.nonIndexedRows}`);
console.log(`Zero-click rows with impressions: ${report.totals.zeroClickImpressionRows}`);
