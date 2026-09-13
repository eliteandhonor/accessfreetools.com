import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { assessMonetizationReadiness, inspectRenderedMonetizationPage } from './lib/monetization-readiness.mjs';

const distRoot = existsSync(join(process.cwd(), 'dist', 'client'))
  ? join(process.cwd(), 'dist', 'client')
  : join(process.cwd(), 'dist');
const outputDirectory = join(process.cwd(), 'output', 'monetization');

function readBuilt(path) {
  const file = path === '/' ? join(distRoot, 'index.html') : join(distRoot, path.slice(1), 'index.html');
  if (!existsSync(file)) throw new Error(`Built page is missing: ${file}`);
  return readFileSync(file, 'utf8');
}

function source(path) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

const pagePaths = {
  admin: '/admin/',
  ask: '/ask/',
  blog: '/blog/remove-ai-writing-tells-before-publishing/',
  contact: '/contact/',
  home: '/',
  support: '/support/',
  tool: '/tools/percentage-calculator/',
};
const pages = Object.fromEntries(
  Object.entries(pagePaths).map(([name, path]) => [name, inspectRenderedMonetizationPage(readBuilt(path))]),
);
const assessment = assessMonetizationReadiness({
  adsTxt: existsSync(join(process.cwd(), 'public', 'ads.txt')) ? source('public/ads.txt') : '',
  builtAdsTxt: existsSync(join(distRoot, 'ads.txt')) ? readFileSync(join(distRoot, 'ads.txt'), 'utf8') : '',
  analyticsSource: source('src/lib/siteAnalytics.ts'),
  legalSources: {
    disclosure: source('src/pages/advertising-disclosure.astro'),
    privacy: source('src/pages/privacy-policy.astro'),
    terms: source('src/pages/terms.astro'),
  },
  pages,
});

const report = {
  generatedAt: new Date().toISOString(),
  integration: {
    enabledByDefault: false,
    infolinksPid: 3447500,
    infolinksWsid: 0,
    scope: 'advertising disabled; verification meta tag and ads.txt only',
  },
  pagePaths,
  pages,
  ...assessment,
};
const markdown = [
  '# Monetization Readiness',
  '',
  `Generated: ${report.generatedAt}`,
  `Status: ${report.status}`,
  `Technical checks: ${report.technicalStatus}`,
  'Advertising loaders: disabled; no network reachability probe needed.',
  '',
  '## Issues',
  ...(report.issues.length > 0 ? report.issues.map((issue) => `- ${issue}`) : ['- None.']),
  '',
  '## Manual Checks',
  ...report.warnings.map((warning) => `- ${warning}`),
  '',
].join('\n');

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(join(outputDirectory, 'latest.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(join(outputDirectory, 'latest.md'), markdown);
console.log(markdown);

if (report.issues.length > 0) process.exitCode = 1;
