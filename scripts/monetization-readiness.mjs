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
  adsTxtExists: existsSync(join(process.cwd(), 'public', 'ads.txt')),
  analyticsSource: source('src/lib/siteAnalytics.ts'),
  legalSources: {
    disclosure: source('src/pages/advertising-disclosure.astro'),
    privacy: source('src/pages/privacy-policy.astro'),
    terms: source('src/pages/terms.astro'),
  },
  pages,
});

let loader = { reachable: false, status: null, contentType: null };
try {
  const response = await fetch('https://resources.infolinks.com/js/infolinks_main.js', {
    method: 'HEAD',
    signal: AbortSignal.timeout(10000),
  });
  loader = {
    reachable: response.ok,
    status: response.status,
    contentType: response.headers.get('content-type'),
  };
  if (!response.ok) assessment.issues.push(`Infolinks loader returned HTTP ${response.status}.`);
} catch (error) {
  assessment.warnings.push(`Live Infolinks loader check was unavailable: ${error instanceof Error ? error.message : String(error)}`);
}

if (assessment.issues.length > 0) assessment.status = 'blocked';

const report = {
  generatedAt: new Date().toISOString(),
  integration: {
    enabledByDefault: true,
    infolinksPid: 3447500,
    infolinksWsid: 0,
    scope: 'all eligible public HTML pages',
  },
  loader,
  pagePaths,
  pages,
  ...assessment,
};
const markdown = [
  '# Monetization Readiness',
  '',
  `Generated: ${report.generatedAt}`,
  `Status: ${report.status}`,
  `Infolinks loader: ${loader.reachable ? `reachable (${loader.status})` : 'not proven reachable'}`,
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
