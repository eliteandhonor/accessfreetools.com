import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { providerFailure, savedProviderStatus } from './lib/provider-status.mjs';
import { passingPromotionReview } from '../tests/helpers/promotionReview.mjs';

const repo = process.cwd();
const roots = [];
const now = '2026-09-06T00:00:00.000Z';
const old = '2026-09-02T00:00:00.000Z';
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'aft-provider-status-'));
  roots.push(root);
  return root;
}
function write(root, path, value) {
  const file = join(root, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));
}
function read(root, path) { return JSON.parse(readFileSync(join(root, path), 'utf8')); }
function run(root, script, args = [], mock = '') {
  const preload = `
    const NativeDate = Date;
    globalThis.Date = class extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [${JSON.stringify(now)}])); }
      static now() { return NativeDate.parse(${JSON.stringify(now)}); }
    };
    globalThis.fetch = () => { throw new Error('Network forbidden in provider fixtures'); };
    ${mock}
  `;
  return spawnSync(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(preload)}`,
    resolve(repo, 'scripts', script), ...args], { cwd: root, encoding: 'utf8', timeout: 15_000,
    env: { ...process.env, HOME: root, USERPROFILE: root, DATAFORSEO_USERNAME: 'fixture-login',
      DATAFORSEO_PASSWORD: 'fixture-secret', DATAFORSEO_GET_RETRIES: '0' } });
}
function cli(root, json = true) {
  const result = run(root, 'aft-cli.mjs', ['status', ...(json ? ['--json'] : [])]);
  expect(result.status, result.stderr).toBe(0);
  return json ? JSON.parse(result.stdout) : result.stdout;
}
afterEach(() => {
  for (const root of roots.splice(0)) {
    expect(dirname(root)).toBe(tmpdir());
    rmSync(root, { recursive: true, force: true });
  }
});

describe('provider failure and provenance helper', () => {
  it.each([
    [{ status: 429 }, 'rate-limited'],
    [{ status: 503 }, 'service'],
    [{ status: 401 }, 'authentication'],
    [{ message: 'Access denied. Your IP is not whitelisted' }, 'ip-restricted'],
    [{ status: 403 }, 'access-restricted'],
    [{ details: { statusIssues: [{ code: 40203 }] } }, 'billing'],
    [{ message: 'Invalid account response' }, 'invalid-response'],
    [{ message: 'fetch failed' }, 'network'],
    [{ message: 'unclassified' }, 'unknown'],
  ])('preserves sanitized saved failure category %j as %s', (error, failureKind) => {
    const failure = providerFailure(error);
    expect(failure.failureKind).toBe(failureKind);
    for (const status of ['failed', 'partial']) {
      const result = savedProviderStatus([{ source: 'dataforseo-status.json', report: {
        generatedAt: now, currentAttempt: { status, generatedAt: now, ...failure },
      } }], Date.parse(now));
      expect(result.latestServiceAttempt).toMatchObject({ status, failureKind,
        message: failure.message, needsTopUp: failureKind === 'billing' });
    }
  });
  it.each(['not-ok', 'unhealthy', 'ok-with-unknown-warning', 'success-ish'])('does not treat %s as a successful saved attempt', (status) => {
    const result = savedProviderStatus([{ source: 'dataforseo-account.json', report: {
      generatedAt: now, status, account: { balance: 11 },
    } }], Date.parse(now));
    expect(result.latestAttempt.status).toBe('unknown');
  });
  it.each(['degraded', 'partial', 'ok-with-sandbox-warning'])('retains the known %s saved status as partial', (status) => {
    const result = savedProviderStatus([{ source: 'dataforseo-status.json', report: { generatedAt: now, status } }], Date.parse(now));
    expect(result.latestServiceAttempt.status).toBe('partial');
  });
  it('rejects unknown saved categories and emits only a fixed diagnostic for known ones', () => {
    expect(providerFailure({ failureKind: 'billing-from-untrusted-input', message: 'fixture-secret' }))
      .toMatchObject({ failureKind: 'unknown', needsTopUp: false });
    expect(providerFailure({ failureKind: 'service', message: 'fixture-secret' }))
      .toMatchObject({ failureKind: 'service', message: 'Provider service is unavailable; retry later.' });
  });
  it.each([{ statusIssues: 'invalid' }, { statusIssues: [null, 7, 'invalid'] }])('tolerates malformed status issue details %j without leaking their text', ({ statusIssues }) => {
    expect(providerFailure({ message: 'fixture-secret', details: { statusIssues } }))
      .toMatchObject({ failureKind: 'unknown', needsTopUp: false });
  });
  it.each([
    ['Access denied. Your IP is not whitelisted', 40207, 'ip-restricted'],
    ['Daily API limit exceeded', 40207, 'rate-limited'],
    ['Endpoint needs subscription access', 40204, 'access-restricted'],
    ['Account blocked or restricted', 40210, 'access-restricted'],
    ['Unclassified request failure', 50000, 'unknown'],
  ])('does not turn %s into billing advice', (message, code, failureKind) => {
    expect(providerFailure({ details: { statusIssues: [{ code, message }] } })).toMatchObject({ failureKind, needsTopUp: false });
  });
  it('preserves unknown observation time instead of borrowing the wrapper date', () => {
    const result = savedProviderStatus([{ source: 'weekly.json', report: {
      generatedAt: now, dataForSeo: { accountObservedAt: null, account: { balance: 11 } },
    } }], Date.parse(now));
    expect(result).toMatchObject({ generatedAt: null, freshness: 'undated', ageDays: null });
  });
  it('preserves partial service failure classification', () => {
    const result = savedProviderStatus([{ source: 'dataforseo-status.json', report: {
      generatedAt: now, status: 'partial', message: 'Network request failed',
      currentAttempt: { status: 'partial', generatedAt: now, failureKind: 'network' },
    } }], Date.parse(now));
    expect(result.latestServiceAttempt).toMatchObject({ status: 'partial', failureKind: 'network' });
  });
});

describe('actual marketing CLI provider evidence', () => {
  function marketing(root) {
    write(root, 'docs/brand-code.md', 'Synthetic private report guidance.');
    write(root, 'docs/recommended-agency-agents.md', 'Synthetic specialist guidance.');
    write(root, 'output/promotion/four-channel-review.json', passingPromotionReview(now));
    const result = run(root, 'marketing-orchestrator-report.mjs');
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    return { report: read(root, 'output/marketing-orchestrator/daily-plan.json'), stdout: result.stdout,
      markdown: readFileSync(join(root, 'output/marketing-orchestrator/daily-plan.md'), 'utf8') };
  }
  it.each([
    ['Access denied. Your IP is not whitelisted', 'ip-restricted'],
    ['HTTP 401 Unauthorized', 'authentication'],
    ['fetch failed', 'network'],
  ])('shows cached low balance and newer %s without a current billing claim', (message, failureKind) => {
    const root = fixture();
    write(root, 'output/dataforseo-account.json', { generatedAt: old, status: 'top-up-needed', account: { balance: 1 } });
    write(root, 'output/automation-environment.json', { generatedAt: now, dataForSeo: { status: 'blocked', message } });
    const { report, markdown, stdout } = marketing(root);
    expect(report.balance).toMatchObject({ status: 'cached', balance: 1, generatedAt: old, ageDays: 4,
      source: 'output/dataforseo-account.json', currentAttempt: { status: 'not-run' }, topUp: false,
      stopBroadPaidResearch: true, latestAttempt: { status: 'failed', failureKind, generatedAt: now } });
    expect(report.blockers.join(' ')).not.toMatch(/top.up|insufficient funds|balance is at/i);
    for (const text of [markdown, stdout]) {
      expect(text).toContain('DataForSEO: cached 1.00 USD');
      expect(text).toContain('4 days old');
      expect(text).toContain('source output/dataforseo-account.json');
      expect(text).toContain('current check: not run');
      expect(text).toContain(failureKind);
      expect(text).not.toMatch(/DataForSEO: live|top.up needed|top up now/i);
    }
  });
  it.each([
    [null, 'undated', null],
    ['invalid', 'undated', null],
    ['2026-09-07T00:00:00.000Z', 'future', null],
    ['2026-08-01T00:00:00.000Z', 'stale', 36],
    [now, 'fresh', 0],
  ])('keeps weekly fallback provenance %s across a fresh marketing wrapper', (generatedAt, freshness, ageDays) => {
    const root = fixture();
    write(root, 'output/seo-agent-self-evaluation.json', { generatedAt: now,
      dataForSeo: { accountObservedAt: generatedAt, account: { balance: 20 } } });
    const { report, markdown, stdout } = marketing(root);
    expect(report.balance).toMatchObject({ status: 'cached', generatedAt, freshness, ageDays,
      source: 'output/seo-agent-self-evaluation.json', currentAttempt: { status: 'not-run' }, topUp: false, stopBroadPaidResearch: true });
    for (const text of [markdown, stdout]) {
      expect(text).toContain('DataForSEO: cached 20.00 USD');
      expect(text).toContain('source output/seo-agent-self-evaluation.json');
      expect(text).toContain('current check: not run');
    }
  });
  it('preserves cached last success while keeping service and account attempts independent', () => {
    const root = fixture();
    write(root, 'output/dataforseo-account.json', { generatedAt: old, status: 'error', message: 'fetch failed',
      lastSuccess: { generatedAt: old, source: 'original-account.json', account: { balance: 1 } } });
    write(root, 'output/dataforseo-status.json', { generatedAt: now, status: 'ok' });
    const { report } = marketing(root);
    expect(report.balance).toMatchObject({ status: 'cached', generatedAt: old, ageDays: 4, source: 'original-account.json',
      latestAttempt: { status: 'failed', failureKind: 'network' }, latestServiceAttempt: { status: 'success' } });
  });
  it('reports missing balance and a classified failure without inventing funds', () => {
    const root = fixture();
    write(root, 'output/dataforseo-account.json', { generatedAt: now, status: 'error',
      currentAttempt: { status: 'failed', generatedAt: now, ...providerFailure({ status: 429 }) } });
    const { report, markdown, stdout } = marketing(root);
    expect(report.balance).toMatchObject({ status: 'unavailable', balance: null, topUp: false,
      currentAttempt: { status: 'not-run' }, latestAttempt: { failureKind: 'rate-limited' } });
    expect(markdown).toContain('DataForSEO: unavailable');
    expect(stdout).toContain('rate-limited');
  });
  it.each([[429, 'rate-limited'], [503, 'service']])('round-trips actual account HTTP %s through disk and marketing as %s', (status, failureKind) => {
    const root = fixture();
    const account = run(root, 'dataforseo-account.mjs', [], `globalThis.fetch = async () => new Response(
      JSON.stringify({ status_message: 'fixture-secret' }), { status: ${status} });`);
    expect(account.status).toBe(1);
    const { report, markdown, stdout } = marketing(root);
    expect(report.balance.latestAttempt).toMatchObject({ status: 'failed', failureKind, needsTopUp: false });
    expect(cli(root).dataForSeoBalance.latestAttempt.failureKind).toBe(failureKind);
    expect(`${account.stdout}${account.stderr}${markdown}${stdout}${JSON.stringify(report)}`).not.toContain('fixture-secret');
  });
  it.each(['dataforseo-account.json', 'dataforseo-status.json', 'automation-environment.json'])('does not echo raw parser errors for %s', (file) => {
    const root = fixture();
    write(root, `output/${file}`, 'fixture-secret');
    const { report, markdown, stdout } = marketing(root);
    expect(report.balance).toMatchObject({ status: 'unavailable', balance: null, currentAttempt: { status: 'not-run' } });
    expect(`${markdown}${stdout}${JSON.stringify(report)}`).not.toContain('fixture-secret');
    expect(report.evidence.find((item) => item.path === `output/${file}`)?.parseError)
      .toBe('Invalid JSON; provider evidence unavailable.');
  });
});

describe('actual status CLI provider evidence', () => {
  it('labels disk success cached and keeps a newer IP failure independent', () => {
    const root = fixture();
    write(root, 'output/dataforseo-account.json', { generatedAt: old, status: 'ok', account: { balance: 1, currency: 'USD' } });
    write(root, 'output/automation-environment.json', { generatedAt: now,
      dataForSeo: { status: 'blocked', message: 'Access denied. Your IP is not whitelisted' } });
    const balance = cli(root).dataForSeoBalance;
    expect(balance).toMatchObject({ status: 'cached', ageDays: 4, source: 'output/dataforseo-account.json',
      generatedAt: old, balance: 1, topUp: false, currentAttempt: { status: 'not-run' },
      latestAttempt: { status: 'failed', failureKind: 'ip-restricted', generatedAt: now } });
    const text = cli(root, false);
    expect(text).toContain('cached 1.00 USD');
    expect(text).toContain('4 days');
    expect(text).toContain('output/dataforseo-account.json');
    expect(text).toContain('ip-restricted');
    expect(text).not.toMatch(/top.up needed|top up now|DataForSEO: live/i);
  });
  it.each([undefined, 'invalid', '2026-09-07T00:00:00.000Z'])('does not refresh unknown or future observation age (%s)', (generatedAt) => {
    const root = fixture();
    write(root, 'output/dataforseo-account.json', { generatedAt, account: { balance: 11 } });
    expect(cli(root).dataForSeoBalance).toMatchObject({ status: 'cached', ageDays: null,
      freshness: generatedAt?.startsWith('2026') ? 'future' : 'undated' });
  });
  it('retains older success when a newer account report failed and no weekly fallback exists', () => {
    const root = fixture();
    write(root, 'output/archive/dataforseo-account.json', { generatedAt: old, account: { balance: 11 } });
    write(root, 'output/dataforseo-account.json', { generatedAt: now, status: 'error', message: 'fetch failed' });
    expect(cli(root).dataForSeoBalance).toMatchObject({ status: 'cached', balance: 11, ageDays: 4,
      latestAttempt: { status: 'failed', failureKind: 'network' } });
  });
  it('shows an attempt failure even with no successful balance', () => {
    const root = fixture();
    write(root, 'output/dataforseo-account.json', { generatedAt: now, status: 'error', message: 'HTTP 401: unauthorized' });
    expect(cli(root).dataForSeoBalance).toMatchObject({ status: 'unavailable', balance: null,
      latestAttempt: { status: 'failed', failureKind: 'authentication' } });
    expect(cli(root, false)).toContain('authentication');
  });
  it('does not let a newer service success hide failed account access', () => {
    const root = fixture();
    write(root, 'output/dataforseo-account.json', { generatedAt: old, status: 'error', message: 'HTTP 401 unauthorized' });
    write(root, 'output/dataforseo-status.json', { generatedAt: now, status: 'ok' });
    expect(cli(root).dataForSeoBalance.latestAttempt).toMatchObject({ status: 'failed', failureKind: 'authentication' });
  });
  it('retains original saved observation dates across a freshly generated failure wrapper', () => {
    const root = fixture();
    write(root, 'output/dataforseo-account.json', { generatedAt: now, status: 'error', message: 'fetch failed',
      lastSuccess: { generatedAt: null, source: 'original.json', account: { balance: 1 } } });
    expect(cli(root).dataForSeoBalance).toMatchObject({ status: 'cached', generatedAt: null,
      ageDays: null, freshness: 'undated', source: 'original.json', topUp: false });
  });
});

describe('actual account helper with fetch fixtures', () => {
  it.each([
    ['Access denied. Your IP is not whitelisted', 40207, 'ip-restricted'],
    ['Unauthorized', 40100, 'authentication'],
    ['Insufficient funds', 40203, 'billing'],
  ])('classifies %s and retains dated last success without printing credentials', (message, code, kind) => {
    const root = fixture();
    write(root, 'output/dataforseo-account.json', { generatedAt: old, account: { balance: 11, login: 'fixture-login' } });
    const response = { status_code: 20000, tasks_error: 1,
      tasks: [{ status_code: code, status_message: message }] };
    const result = run(root, 'dataforseo-account.mjs', [], `globalThis.fetch = async () => new Response(${JSON.stringify(JSON.stringify(response))});`);
    expect(result.status).toBe(1);
    const report = read(root, 'output/dataforseo-account.json');
    expect(report).toMatchObject({ currentAttempt: { status: 'failed', failureKind: kind },
      lastSuccess: { status: 'cached', ageDays: 4, source: expect.any(String), generatedAt: old, account: { balance: 11 } }, needsTopUp: kind === 'billing' });
    expect(`${result.stdout}${result.stderr}${JSON.stringify(report)}`).not.toMatch(/fixture-secret|fixture-login/);
  });
  it.each([{}, { money: { balance: ' ' } }])('rejects invalid account balance %j instead of inventing zero', (value) => {
    const root = fixture();
    const result = run(root, 'dataforseo-account.mjs', [], `globalThis.fetch = async () => new Response(JSON.stringify({status_code:20000,tasks:[{status_code:20000,result:[${JSON.stringify(value)}]}]}));`);
    expect(result.status).toBe(1);
    expect(read(root, 'output/dataforseo-account.json')).toMatchObject({ needsTopUp: false,
      currentAttempt: { status: 'failed', failureKind: 'invalid-response' } });
  });
  it('retains success through repeated network failures without an IP lookup or raw error output', () => {
    const root = fixture();
    write(root, 'output/dataforseo-account.json', { generatedAt: old, account: { balance: 11 } });
    const mock = `globalThis.fetch = async (url) => {
      if (!url.endsWith('/appendix/user_data')) throw new Error('Unexpected extra network lookup');
      throw new Error('fetch failed with fixture-secret');
    };`;
    for (let i = 0; i < 2; i++) {
      const result = run(root, 'dataforseo-account.mjs', [], mock);
      expect(result.status).toBe(1);
      expect(result.stderr).not.toContain('fixture-secret');
      expect(read(root, 'output/dataforseo-account.json')).toMatchObject({ needsTopUp: false,
        currentAttempt: { failureKind: 'network' }, lastSuccess: { generatedAt: old, account: { balance: 11 } } });
    }
  });
  it('records an actual successful low-balance check but subsequent disk reads stay cached', () => {
    const root = fixture();
    const result = run(root, 'dataforseo-account.mjs', ['--fail-on-low'], `globalThis.fetch = async () => new Response(JSON.stringify({
      status_code: 20000, tasks: [{ status_code: 20000, result: [{ login: 'fixture-login', money: { balance: 1 } }] }]
    }));`);
    expect(result.status).toBe(2);
    expect(result.stdout).not.toContain('fixture-login');
    expect(read(root, 'output/dataforseo-account.json')).toMatchObject({ needsTopUp: true, currentAttempt: { status: 'success', generatedAt: now } });
    expect(cli(root).dataForSeoBalance).toMatchObject({ status: 'cached', ageDays: 0, topUp: false,
      currentAttempt: { status: 'not-run' }, latestAttempt: { status: 'success' } });
  });
});

describe('actual service status helper failure boundary', () => {
  it('retains partial service evidence and reports a sanitized Labs failure', () => {
    const root = fixture();
    const result = run(root, 'dataforseo-status.mjs', [], `globalThis.fetch = async (url) => {
      if (url.endsWith('/appendix/status')) return new Response(JSON.stringify({ status_code: 20000, tasks: [{ status_code: 20000,
        result: ['appendix', 'dataforseo_labs', 'serp', 'on_page'].map(api => ({ api, status: 'ok' })) }] }));
      throw new Error('network failed with fixture-secret');
    };`);
    expect(result.status).toBe(1);
    expect(`${result.stdout}${result.stderr}`).not.toContain('fixture-secret');
    expect(read(root, 'output/dataforseo-status.json')).toMatchObject({ status: 'partial',
      currentAttempt: { status: 'partial', failureKind: 'network' }, serviceStatus: { services: expect.any(Array) } });
  });
});

describe('actual daily refresh CLI with synthetic child scripts', () => {
  function steps(root, failed = '', partialGsc = false, account = { status: 'ok', account: { balance: 11 } }) {
    for (const [file, report, value] of [
      ['dataforseo-account.mjs', 'dataforseo-account.json', account],
      ['dataforseo-status.mjs', 'dataforseo-status.json', { status: 'ok' }],
      ['search-console.mjs', 'search-console-url-inspection.json', { inspections: [partialGsc ? { inspectionUrl: 'https://example.test/a', error: 'synthetic inspection failure' } : { inspectionUrl: 'https://example.test/a', verdict: 'PASS' }] }],
      ['seo-agent-self-evaluation.mjs', 'seo-agent-self-evaluation.json', { dataForSeo: { skipped: true } }],
      ['indexnow-submit.mjs', null, {}],
    ]) {
      const failure = failed === file;
      write(root, `scripts/${file}`, `
        import { mkdirSync, writeFileSync } from 'node:fs';
        const allowed = ${JSON.stringify(file)} === 'seo-agent-self-evaluation.mjs' ? ['--skip-dataforseo'] :
          ${JSON.stringify(file)} === 'search-console.mjs' ? ['--inspect-key-urls'] :
          ${JSON.stringify(file)} === 'indexnow-submit.mjs' ? ['--verify-key'] : [];
        for (const arg of allowed) if (!process.argv.includes(arg)) throw new Error('Required read-only flag missing');
        mkdirSync('output', { recursive: true });
        ${report ? `const path = ${JSON.stringify(file)} === 'search-console.mjs' ? process.env.GSC_URL_INSPECTION_REPORT_PATH : 'output/${report}';
          mkdirSync((await import('node:path')).dirname(path), { recursive: true });
          writeFileSync(path, JSON.stringify({ generatedAt: ${JSON.stringify(now)}, ...${JSON.stringify(failure ? { status: 'error', message: 'Access denied. Your IP is not whitelisted' } : value)} }));` : ''}
        console.error('fixture-secret should not be forwarded');
        process.exitCode = ${failure ? 1 : 0};
      `);
    }
  }
  it.each([
    [0, 'top-up-needed'], [1, 'top-up-needed'], [2, 'top-up-needed'],
    [5, 'warning'], [10, 'warning'], [11, 'ok'],
  ])('preserves a fresh %s USD account observation and its %s warning in JSON and CLI', (balance, balanceStatus) => {
    const root = fixture();
    steps(root, '', false, { status: balanceStatus, needsTopUp: balance <= 2, account: { balance, currency: 'USD' } });
    const result = run(root, 'seo-daily-refresh.mjs');
    expect(result.status, result.stderr).toBe(0);
    const report = read(root, 'output/seo-daily-refresh.json');
    expect(report.status).toBe('complete');
    expect(Object.values(report.steps).map(step => step.status)).toEqual(Array(5).fill('complete'));
    expect(report.steps.dataForSeoAccount).toMatchObject({
      freshness: 'fresh', source: 'output/dataforseo-account.json', evidenceGeneratedAt: now,
      accountObservation: { balance, currency: 'USD', balanceStatus, needsTopUp: balance <= 2 },
    });
    expect(result.stdout).toContain(`balance ${balance.toFixed(2)} USD`);
    expect(result.stdout).toContain(balanceStatus === 'top-up-needed' ? 'TOP UP NEEDED' : `balance status: ${balanceStatus}`);
    expect(result.stdout + result.stderr).not.toContain('fixture-secret');
    const json = run(root, 'seo-daily-refresh.mjs', ['--json']);
    expect(json.status).toBe(0);
    expect(JSON.parse(json.stdout).steps.dataForSeoAccount.accountObservation).toEqual(report.steps.dataForSeoAccount.accountObservation);
  });
  it('does not promote a low saved balance when the current account request fails', () => {
    const root = fixture();
    steps(root);
    write(root, 'scripts/dataforseo-account.mjs', `
      import { mkdirSync, writeFileSync } from 'node:fs';
      mkdirSync('output', { recursive: true });
      writeFileSync('output/dataforseo-account.json', JSON.stringify({ generatedAt: '${now}', status: 'error',
        message: 'Access denied. Your IP is not whitelisted', account: { balance: 1 },
        lastSuccess: { generatedAt: '${old}', account: { balance: 1 } } }));
      process.exitCode = 1;
    `);
    const result = run(root, 'seo-daily-refresh.mjs');
    expect(result.status).toBe(1);
    const account = read(root, 'output/seo-daily-refresh.json').steps.dataForSeoAccount;
    expect(account).toMatchObject({ status: 'failed', failureKind: 'ip-restricted' });
    expect(account.accountObservation).toBeUndefined();
    expect(account.needsTopUp).toBe(false);
    expect(result.stdout).not.toContain('TOP UP NEEDED');
  });
  it.each(['', 'dataforseo-account.mjs', 'search-console.mjs'])('retains every independent outcome when %s fails', (failed) => {
    const root = fixture();
    steps(root, failed);
    const result = run(root, 'seo-daily-refresh.mjs', ['--json']);
    expect(result.status, result.stderr).toBe(failed ? 1 : 0);
    const report = JSON.parse(result.stdout);
    expect(report).toMatchObject({ generatedAt: now, status: failed ? 'partial' : 'complete', freshness: 'fresh', paidResearch: 'not-run' });
    expect(report.steps.searchConsole.status).toBe(failed === 'search-console.mjs' ? 'failed' : 'complete');
    expect(report.steps.selfEvaluation.status).toBe('complete');
    expect(report.steps.indexNowVerification.status).toBe('complete');
    expect(result.stdout).not.toContain('fixture-secret');
    expect(read(root, 'output/seo-daily-refresh.json').status).toBe(report.status);
    expect(cli(root).seoDailyRefresh).toMatchObject({ status: report.status, freshness: 'fresh', source: 'output/seo-daily-refresh.json' });
    expect(cli(root, false)).toContain(`Daily SEO refresh: ${report.status}`);
  });
  it('marks per-URL GSC errors partial even when its process exits zero', () => {
    const root = fixture();
    steps(root, '', true);
    const result = run(root, 'seo-daily-refresh.mjs');
    expect(result.status).toBe(1);
    expect(result.stdout).toContain('partial');
    expect(read(root, 'output/seo-daily-refresh.json').steps.searchConsole.status).toBe('partial');
  });
  it('rejects stale reports after an apparently successful child and still completes GSC', () => {
    const root = fixture();
    steps(root);
    write(root, 'output/dataforseo-account.json', { generatedAt: old, status: 'top-up-needed', account: { balance: 1 }, needsTopUp: true });
    write(root, 'scripts/dataforseo-account.mjs', '// Synthetic child exits zero without writing evidence.');
    const result = run(root, 'seo-daily-refresh.mjs', ['--json']);
    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout)).toMatchObject({ status: 'partial', steps: {
      dataForSeoAccount: { status: 'failed', failureKind: 'missing-current-evidence' },
      searchConsole: { status: 'complete' }, selfEvaluation: { status: 'complete' },
    } });
    expect(JSON.parse(result.stdout).steps.dataForSeoAccount.accountObservation).toBeUndefined();
    expect(JSON.parse(result.stdout).steps.dataForSeoAccount.needsTopUp).not.toBe(true);
  });
  it('retains a partially refreshed service step even when its helper exits nonzero', () => {
    const root = fixture();
    steps(root);
    write(root, 'scripts/dataforseo-status.mjs', `
      import { writeFileSync } from 'node:fs';
      writeFileSync('output/dataforseo-status.json', JSON.stringify({ generatedAt: '${now}', status: 'partial',
        message: 'Network request failed', serviceStatus: { services: [{ api: 'appendix', status: 'ok' }] } }));
      process.exitCode = 1;
    `);
    const result = run(root, 'seo-daily-refresh.mjs', ['--json']);
    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout).steps.dataForSeoStatus).toMatchObject({ status: 'partial', failureKind: 'network', freshness: 'fresh' });
  });
});
