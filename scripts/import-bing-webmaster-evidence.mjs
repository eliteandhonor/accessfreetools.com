import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  buildBingWebmasterReport,
  newestBingWebmasterFiles,
  writeBingWebmasterReport,
} from './lib/bing-webmaster-import.mjs';

const args = process.argv.slice(2);

function option(name) {
  const prefix = `${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

function explicitOrNewest(name, newest) {
  const explicit = option(name);
  if (!explicit) return newest;
  const resolved = resolve(explicit);
  if (!existsSync(resolved)) throw new Error(`${name} file was not found: ${resolved}`);
  return resolved;
}

const newest = newestBingWebmasterFiles();
const keywordsFile = explicitOrNewest('--keywords', newest.keywords);
const aiQueriesFile = explicitOrNewest('--ai', newest.aiQueries);
const latestLinksFile = explicitOrNewest('--links', newest.latestLinks);
const report = buildBingWebmasterReport({ aiQueriesFile, keywordsFile, latestLinksFile });
const paths = writeBingWebmasterReport(report);

console.log('Imported Bing Webmaster evidence.');
console.log(`Status: ${report.status}`);
console.log(`Keyword rows: ${report.totals.keywords.raw.rows}`);
console.log(`Validated keyword rows: ${report.totals.keywords.validated.rows}`);
console.log(`AI citations: ${report.totals.ai.citations}`);
console.log(`Latest links: ${report.totals.latestLinks}`);
console.log(`Saved ${paths.jsonPath}`);
console.log(`Saved ${paths.markdownPath}`);
