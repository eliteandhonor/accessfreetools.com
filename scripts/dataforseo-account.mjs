import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { getDataForSeoUserData, summarizeDataForSeoUserData } from './lib/dataforseo.mjs';
import { accountObservation, providerFailure, publicAccount } from './lib/provider-status.mjs';

const args = process.argv.slice(2);

function option(name, fallback) {
  const key = `npm_config_${name.replace(/^--/, '').replace(/-/g, '_')}`;
  return args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) ?? process.env[key] ?? fallback;
}

const reportPath = resolve(
  option('--report', 'output/dataforseo-account.json'),
);
const minBalance = Number(option('--min-balance', 2));
const warnBalance = Number(option('--warn-balance', 10));
const failOnLow = args.includes('--fail-on-low') || process.env.npm_config_fail_on_low === 'true';

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

let lastSuccess = null;
try { lastSuccess = accountObservation(JSON.parse(readFileSync(reportPath, 'utf8')), reportPath); } catch { /* No usable saved observation. */ }

try {
  const response = await getDataForSeoUserData();
  const rawBalance = response?.tasks?.[0]?.result?.[0]?.money?.balance;
  if (rawBalance === null || rawBalance === undefined || typeof rawBalance === 'string' && !rawBalance.trim() ||
      !['number', 'string'].includes(typeof rawBalance) || !Number.isFinite(Number(rawBalance))) {
    throw new Error('Invalid account response');
  }
  const account = publicAccount(summarizeDataForSeoUserData(response));
  const needsTopUp = account.balance <= minBalance;
  const shouldWarn = account.balance <= warnBalance;
  const report = {
    generatedAt: new Date().toISOString(),
    status: needsTopUp ? 'top-up-needed' : shouldWarn ? 'warning' : 'ok',
    minBalance,
    warnBalance,
    account,
    needsTopUp,
  };
  report.currentAttempt = { status: 'success', generatedAt: report.generatedAt };
  report.lastSuccess = { generatedAt: report.generatedAt, source: reportPath, account };

  writeJson(reportPath, report);

  console.log('DataForSEO account check');
  console.log(`Balance: ${account.balance.toFixed(2)} ${account.currency}`);
  console.log(`Warning threshold: ${warnBalance.toFixed(2)} ${account.currency}`);
  console.log(`Top-up threshold: ${minBalance.toFixed(2)} ${account.currency}`);
  console.log(`Status: ${needsTopUp ? 'TOP UP NEEDED' : shouldWarn ? 'warning' : 'ok'}`);
  console.log(`Saved report to ${reportPath}`);

  if (needsTopUp && failOnLow) {
    process.exitCode = 2;
  }
} catch (error) {
  const failure = providerFailure(error);
  const report = {
    generatedAt: new Date().toISOString(),
    status: 'error',
    ...failure,
    lastSuccess,
  };
  report.currentAttempt = { status: 'failed', generatedAt: report.generatedAt, ...failure };
  writeJson(reportPath, report);
  console.error(report.message);
  process.exitCode = 1;
}
