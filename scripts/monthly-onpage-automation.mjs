import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const DEFAULT_OUTPUT_DIR = join('output', 'monthly-onpage');
const DEFAULT_MIN_BALANCE = 2;
const DEFAULT_WARN_BALANCE = 10;
const DEFAULT_MAX_CRAWL_PAGES = 1000;

function option(args, name, fallback = undefined) {
  return args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) ?? fallback;
}

function hasFlag(args, name) {
  return args.includes(name);
}

function npmConfig(name) {
  return process.env[`npm_config_${name.replace(/^--/, '').replace(/-/g, '_')}`];
}

function optionFromArgsOrNpm(args, name, fallback = undefined) {
  return option(args, name, npmConfig(name) ?? fallback);
}

function flagFromArgsOrNpm(args, name) {
  const value = npmConfig(name);
  return hasFlag(args, name) || value === 'true' || value === '';
}

function todaySlug() {
  return new Date().toISOString().slice(0, 10);
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function readJson(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function runNode(label, script, args) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  return {
    label,
    script,
    args,
    status: result.status ?? 1,
    signal: result.signal,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error ? String(result.error.message ?? result.error) : '',
  };
}

function markdown(report) {
  const lines = [
    '# Monthly DataForSEO OnPage Automation',
    '',
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    '',
    '## Gate',
    '',
  ];

  if (report.account?.account) {
    const account = report.account.account;
    lines.push(`- Balance: ${Number(account.balance ?? 0).toFixed(2)} ${account.currency ?? 'USD'}`);
  } else if (report.account?.message) {
    lines.push(`- Account check: ${report.account.message}`);
  } else {
    lines.push('- Account check: unavailable');
  }

  if (report.serviceStatus?.status) {
    lines.push(`- API status: ${report.serviceStatus.status}`);
  } else if (report.serviceStatus?.message) {
    lines.push(`- API status: ${report.serviceStatus.message}`);
  } else {
    lines.push('- API status: unavailable');
  }

  lines.push('', '## Crawl', '');

  if (report.onPage?.summary?.counts) {
    for (const [key, value] of Object.entries(report.onPage.summary.counts)) {
      lines.push(`- ${key}: ${value}`);
    }
  } else {
    lines.push(`- ${report.decision}`);
  }

  lines.push('', '## Evidence', '');
  for (const path of report.evidence) {
    lines.push(`- ${path}`);
  }

  lines.push('', '## Next Action', '');
  lines.push(`- ${report.nextAction}`);

  return `${lines.join('\n')}\n`;
}

const args = process.argv.slice(2).filter((arg) => arg !== '--');
const outputDir = resolve(optionFromArgsOrNpm(args, '--output-dir', join(DEFAULT_OUTPUT_DIR, todaySlug())));
const minBalance = Number(optionFromArgsOrNpm(args, '--min-balance', DEFAULT_MIN_BALANCE));
const warnBalance = Number(optionFromArgsOrNpm(args, '--warn-balance', DEFAULT_WARN_BALANCE));
const maxCrawlPages = Number(optionFromArgsOrNpm(args, '--max-crawl-pages', DEFAULT_MAX_CRAWL_PAGES));
const dryRun = flagFromArgsOrNpm(args, '--dry-run');
const noWait = flagFromArgsOrNpm(args, '--no-wait');
const skipWaterfall = flagFromArgsOrNpm(args, '--skip-waterfall');

mkdirSync(outputDir, { recursive: true });

const accountPath = join(outputDir, 'dataforseo-account.json');
const statusPath = join(outputDir, 'dataforseo-status.json');
const onPageDir = join(outputDir, 'onpage');
const summaryPath = join(outputDir, 'automation-summary.json');
const summaryMarkdownPath = join(outputDir, 'automation-summary.md');

const runs = [];
runs.push(
  runNode('DataForSEO account', 'scripts/dataforseo-account.mjs', [
    `--report=${accountPath}`,
    `--min-balance=${minBalance}`,
    `--warn-balance=${warnBalance}`,
  ]),
);

const accountReport = readJson(accountPath);
const account = accountReport?.account ?? null;
const evidence = [accountPath, statusPath, summaryPath, summaryMarkdownPath];

let report = {
  generatedAt: new Date().toISOString(),
  status: 'blocked',
  decision: 'Account and API gates have not completed.',
  nextAction: 'Review the generated reports before running a paid crawl.',
  thresholds: { minBalance, warnBalance, maxCrawlPages },
  account: accountReport,
  serviceStatus: null,
  onPage: null,
  runs,
  evidence,
};

function finish(status, decision, nextAction, exitCode = 0) {
  report = { ...report, status, decision, nextAction };
  writeJson(summaryPath, report);
  writeText(summaryMarkdownPath, markdown(report));
  console.log(`Monthly OnPage automation status: ${status}`);
  console.log(decision);
  console.log(`Saved summary to ${summaryMarkdownPath}`);
  process.exit(exitCode);
}

if (runs.at(-1).status !== 0 || accountReport?.status === 'error' || !account) {
  finish(
    'blocked-api',
    'DataForSEO account check failed before any paid crawl was started.',
    'Fix the DataForSEO credential/network problem in the automation environment, then rerun npm run automation:monthly-onpage.',
    1,
  );
}

if (!Number.isFinite(account.balance) || account.balance <= warnBalance) {
  finish(
    'skipped-low-balance',
    `Balance is ${Number(account.balance ?? 0).toFixed(2)} ${account.currency ?? 'USD'}, at or below the ${warnBalance.toFixed(
      2,
    )} broad-crawl warning threshold.`,
    'Top up DataForSEO before running the monthly paid OnPage crawl.',
    0,
  );
}

runs.push(runNode('DataForSEO status', 'scripts/dataforseo-status.mjs', [`--report=${statusPath}`, '--fail-on-unhealthy']));
const serviceStatus = readJson(statusPath);
report = { ...report, serviceStatus, runs };

if (runs.at(-1).status !== 0 || serviceStatus?.status === 'error') {
  finish(
    'blocked-api',
    'DataForSEO service status failed before any paid crawl was started.',
    'Retry later or check DataForSEO service health before running the monthly paid crawl.',
    1,
  );
}

if (dryRun) {
  finish(
    'ready-dry-run',
    'Account balance and DataForSEO service status passed. Dry run stopped before the paid crawl.',
    'Run npm run automation:monthly-onpage without --dry-run to start the capped paid OnPage crawl.',
    0,
  );
}

const onPageArgs = [
  `--output-dir=${onPageDir}`,
  `--max-crawl-pages=${maxCrawlPages}`,
  `--min-balance=${minBalance}`,
  `--warn-balance=${warnBalance}`,
];
if (noWait) onPageArgs.push('--no-wait');
if (skipWaterfall) onPageArgs.push('--skip-waterfall');

runs.push(runNode('DataForSEO OnPage audit', 'scripts/seo-onpage-audit.mjs', onPageArgs));
const onPageSummaryPath = join(onPageDir, 'summary.json');
const onPageSummary = readJson(onPageSummaryPath);
report = {
  ...report,
  onPage: {
    summaryPath: onPageSummaryPath,
    markdownPath: join(onPageDir, 'summary.md'),
    summary: onPageSummary,
  },
  runs,
  evidence: [...evidence, onPageSummaryPath, join(onPageDir, 'summary.md')],
};

if (runs.at(-1).status !== 0) {
  finish(
    'crawl-failed',
    'The paid crawl started but the OnPage audit command returned a failure.',
    'Open the OnPage raw reports, fix confirmed hard issues first, then rerun or resume the task if needed.',
    runs.at(-1).status,
  );
}

finish(
  'completed',
  `Paid crawl completed with ${onPageSummary?.pagesCrawled ?? 'unknown'} pages crawled.`,
  'Review the monthly OnPage summary and fix confirmed hard issues before lower-priority SEO polish.',
  0,
);
