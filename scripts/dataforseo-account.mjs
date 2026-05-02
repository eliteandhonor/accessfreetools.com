import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { getDataForSeoUserData, summarizeDataForSeoUserData } from './lib/dataforseo.mjs';

const args = process.argv.slice(2);
const reportPath = resolve(
  args.find((arg) => arg.startsWith('--report='))?.slice('--report='.length) ?? 'output/dataforseo-account.json',
);
const minBalance = Number(args.find((arg) => arg.startsWith('--min-balance='))?.slice('--min-balance='.length) ?? 2);
const warnBalance = Number(args.find((arg) => arg.startsWith('--warn-balance='))?.slice('--warn-balance='.length) ?? 10);
const failOnLow = args.includes('--fail-on-low');

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

try {
  const response = await getDataForSeoUserData();
  const account = summarizeDataForSeoUserData(response);
  const needsTopUp = account.balance <= minBalance;
  const shouldWarn = account.balance <= warnBalance;
  const report = {
    generatedAt: new Date().toISOString(),
    status: needsTopUp ? 'top-up-needed' : shouldWarn ? 'warning' : 'ok',
    minBalance,
    warnBalance,
    account,
  };

  writeJson(reportPath, report);

  console.log('DataForSEO account check');
  console.log(`Login: ${account.login}`);
  console.log(`Balance: ${account.balance.toFixed(2)} ${account.currency}`);
  console.log(`Warning threshold: ${warnBalance.toFixed(2)} ${account.currency}`);
  console.log(`Top-up threshold: ${minBalance.toFixed(2)} ${account.currency}`);
  console.log(`Status: ${needsTopUp ? 'TOP UP NEEDED' : shouldWarn ? 'warning' : 'ok'}`);
  console.log(`Saved report to ${reportPath}`);

  if (needsTopUp && failOnLow) {
    process.exitCode = 2;
  }
} catch (error) {
  const report = {
    generatedAt: new Date().toISOString(),
    status: 'error',
    message: error instanceof Error ? error.message : String(error),
  };
  writeJson(reportPath, report);
  console.error(report.message);
  process.exitCode = 1;
}
