import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { providerFailure } from './lib/provider-status.mjs';

function readReport(cwd, path) {
  try { return JSON.parse(readFileSync(resolve(cwd, path), 'utf8')); } catch { return null; }
}

export function runDailySeoRefresh({ cwd = process.cwd(), run = spawnSync } = {}) {
  const startedAt = new Date().toISOString();
  const minBalance = 2;
  const warnBalance = 10;
  // Inspect this run separately; the canonical GSC report intentionally also retains older URLs.
  const inspectionPath = `output/seo-daily-refresh/${randomUUID()}/search-console-url-inspection.json`;
  const plan = [
    ['dataForSeoAccount', 'dataforseo-account.mjs', [`--min-balance=${minBalance}`, `--warn-balance=${warnBalance}`], 'output/dataforseo-account.json'],
    ['dataForSeoStatus', 'dataforseo-status.mjs', [], 'output/dataforseo-status.json'],
    ['searchConsole', 'search-console.mjs', ['--inspect-key-urls'], inspectionPath],
    ['selfEvaluation', 'seo-agent-self-evaluation.mjs', ['--skip-dataforseo'], 'output/seo-agent-self-evaluation.json'],
    ['indexNowVerification', 'indexnow-submit.mjs', ['--verify-key'], null],
  ];
  const steps = {};
  for (const [key, script, args, source] of plan) {
    const stepStartedAt = new Date().toISOString();
    let result;
    try {
      result = run(process.execPath, [resolve(cwd, 'scripts', script), ...args], {
        cwd, encoding: 'utf8', timeout: 300_000, maxBuffer: 4 * 1024 * 1024,
        env: { ...process.env, ...(key === 'searchConsole' ? { GSC_URL_INSPECTION_REPORT_PATH: resolve(cwd, source) } : {}) },
      });
    } catch (error) {
      result = { status: null, error };
    }
    const completedAt = new Date().toISOString();
    const report = source ? readReport(cwd, source) : null;
    const observedTime = Date.parse(report?.generatedAt);
    const fresh = Number.isFinite(observedTime) && observedTime >= Date.parse(stepStartedAt) && observedTime <= Date.parse(completedAt);
    const step = { status: 'complete', startedAt: stepStartedAt, completedAt, exitCode: result.status ?? null,
      source, evidenceGeneratedAt: report?.generatedAt ?? null, freshness: source ? fresh ? 'fresh' : 'unavailable' : 'not-applicable' };
    if (result.error || result.status !== 0) {
      Object.assign(step, { status: fresh && report?.status === 'partial' ? 'partial' : 'failed', ...providerFailure(result.error ??
        (fresh && report?.message ? report : { message: result.stderr || 'Child process failed' })) });
    } else if (source && !fresh) {
      Object.assign(step, { status: 'failed', failureKind: 'missing-current-evidence', message: 'Step did not produce a dated current-run report.' });
    } else if (report?.status && !['ok', 'warning', 'top-up-needed'].includes(report.status)) {
      Object.assign(step, { status: report.status === 'degraded' || report.status === 'partial' ? 'partial' : 'failed',
        ...providerFailure(report) });
    } else if (key === 'searchConsole') {
      const rows = report.inspections;
      if (!Array.isArray(rows) || rows.length === 0) {
        Object.assign(step, { status: 'failed', failureKind: 'missing-current-evidence', message: 'No current URL inspection observations were returned.' });
      } else {
        const failures = rows.filter((item) => !item || item.error || !item.verdict).length;
        Object.assign(step, { status: failures ? 'partial' : 'complete', inspected: rows.length, failures });
      }
    } else if (key === 'dataForSeoAccount') {
      if (!Number.isFinite(report.account?.balance)) {
        Object.assign(step, { status: 'failed', ...providerFailure(new Error('Invalid account response')) });
      } else {
        const balance = report.account.balance;
        const currency = typeof report.account.currency === 'string' && /^[A-Z]{3}$/.test(report.account.currency)
          ? report.account.currency : 'USD';
        step.accountObservation = { balance, currency, needsTopUp: balance <= minBalance,
          balanceStatus: balance <= minBalance ? 'top-up-needed' : balance <= warnBalance ? 'warning' : 'ok' };
      }
    }
    // A failure never skips a later independent provider or local evaluator.
    steps[key] = step;
  }
  const results = Object.values(steps);
  const report = { generatedAt: new Date().toISOString(), startedAt, freshness: 'fresh',
    status: results.every((step) => step.status === 'complete') ? 'complete' :
      results.some((step) => step.status === 'complete' || step.status === 'partial') ? 'partial' : 'failed',
    paidResearch: 'not-run', submissions: 'not-run',
    scope: 'Account/service checks, key URL inspections, local self-evaluation and IndexNow key verification only; not a performance-data refresh.',
    steps };
  const path = resolve(cwd, 'output/seo-daily-refresh.json');
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const report = runDailySeoRefresh();
  if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`Daily SEO refresh: ${report.status}; fresh attempt ${report.generatedAt}`);
    for (const [name, step] of Object.entries(report.steps)) {
      const account = step.accountObservation;
      const balanceNote = account ? `; balance ${account.balance.toFixed(2)} ${account.currency}; balance status: ${account.needsTopUp ? 'TOP UP NEEDED' : account.balanceStatus}` : '';
      console.log(`- ${name}: ${step.status}${step.failureKind ? ` (${step.failureKind})` : ''}; evidence ${step.freshness}${step.source ? `; source ${step.source}` : ''}${balanceNote}`);
    }
    console.log('Paid research and submissions: not run. Saved output/seo-daily-refresh.json');
  }
  if (report.status !== 'complete') process.exitCode = 1;
}
