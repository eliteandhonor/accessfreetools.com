import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { getDataForSeoServiceStatus, getDataForSeoUserData, summarizeDataForSeoServiceStatus, summarizeDataForSeoUserData } from './lib/dataforseo.mjs';
import { listHostingerWebsites, readHostingerLocalEnv, summarizeCollection } from './lib/hostinger-api.mjs';
import { localRuntimePaths } from './lib/automation-environment.mjs';

const outputJsonPath = resolve('output/automation-environment.json');
const outputMarkdownPath = resolve('output/automation-environment.md');
const searchConsoleTokenPath = resolve('.local/search-console-token.json');
const defaultSearchConsoleClientSecretPath = resolve('.local/google-search-console-client-secret.json');

function write(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function safeJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function run(command, args = []) {
  try {
    return {
      ok: true,
      value: execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(),
    };
  } catch (error) {
    return {
      ok: false,
      value: error instanceof Error ? error.message : String(error),
    };
  }
}

function npmVersion() {
  return process.platform === 'win32' ? run('cmd', ['/c', 'npm', '--version']) : run('npm', ['--version']);
}

function tokenStatus() {
  const searchConsoleClientSecretPath = findSearchConsoleClientSecret();
  const token = safeJson(searchConsoleTokenPath);
  if (!token) {
    return {
      status: existsSync(searchConsoleTokenPath) ? 'unreadable' : 'missing',
      tokenPath: searchConsoleTokenPath,
      clientSecretExists: existsSync(searchConsoleClientSecretPath),
    };
  }

  const expiresAt = Number(token.expires_at ?? 0);
  const expiresInMs = expiresAt - Date.now();
  return {
    status: expiresInMs > 60_000 ? 'valid' : token.refresh_token ? 'refreshable' : 'expired',
    tokenPath: searchConsoleTokenPath,
    clientSecretExists: existsSync(searchConsoleClientSecretPath),
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    hasRefreshToken: Boolean(token.refresh_token),
    scopes: String(token.scope ?? '')
      .split(/\s+/)
      .filter(Boolean),
  };
}

function findSearchConsoleClientSecret() {
  if (existsSync(defaultSearchConsoleClientSecretPath)) {
    return defaultSearchConsoleClientSecretPath;
  }

  const localDirectory = resolve('.local');
  if (!existsSync(localDirectory)) {
    return defaultSearchConsoleClientSecretPath;
  }

  const candidates = readdirSync(localDirectory)
    .filter((name) => /^client_secret_.*\.json$/i.test(name))
    .sort();

  return candidates.length === 1 ? resolve(localDirectory, candidates[0]) : defaultSearchConsoleClientSecretPath;
}

function markdown(report) {
  const lines = [
    '# Automation Environment Check',
    '',
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    '',
    '## Local Runtime',
    '',
    `- Working directory: ${report.local.cwd}`,
    `- Primary repo cwd: ${report.local.expectedCwd}`,
    `- Approved repo cwd(s): ${report.local.expectedCwds.join('; ')}`,
    `- CWD approved: ${report.local.cwdMatchesExpected ? 'yes' : 'no'}`,
    `- Git branch: ${report.local.gitBranch || 'unknown'}`,
    `- Git clean: ${report.local.gitClean ? 'yes' : 'no'}`,
    `- Node: ${report.local.nodeVersion}`,
    `- npm: ${report.local.npmVersion}`,
    '',
    '## Connected Services',
    '',
    `- DataForSEO: ${report.dataForSeo.status}`,
  ];

  if (report.dataForSeo.balance) {
    lines.push(
      `- DataForSEO balance: ${report.dataForSeo.balance.amount.toFixed(2)} ${report.dataForSeo.balance.currency}`,
    );
  }
  if (report.dataForSeo.message) {
    lines.push(`- DataForSEO note: ${report.dataForSeo.message}`);
  }

  lines.push(
    `- Search Console token: ${report.searchConsole.status}`,
    `- Search Console client secret: ${report.searchConsole.clientSecretExists ? 'present' : 'missing'}`,
    `- Hostinger API: ${report.hostinger.status}`,
  );
  if (report.hostinger.websites !== null) {
    lines.push(`- Hostinger websites: ${report.hostinger.websites}`);
  }
  if (report.hostinger.message) {
    lines.push(`- Hostinger note: ${report.hostinger.message}`);
  }
  if (report.searchConsole.expiresAt) {
    lines.push(`- Search Console token expires: ${report.searchConsole.expiresAt}`);
  }

  lines.push('', '## Automation Rule', '');
  lines.push(
    '- If this report says DataForSEO is healthy, do not report DataForSEO as broken based on stale memory files.',
    '- If this report says Hostinger is healthy, do not ask the user to re-add the same Hostinger key.',
    '- If this report says Search Console needs OAuth, use the latest saved Search Console output and ask for a manual OAuth refresh only when fresh data is required.',
    '- If this report says the repo is dirty, avoid destructive cleanup and work with the existing changes.',
  );

  return `${lines.join('\n')}\n`;
}

async function main() {
  const cwd = resolve(process.cwd());
  const gitBranch = run('git', ['branch', '--show-current']);
  const gitStatus = run('git', ['status', '--short']);
  const npm = npmVersion();
  const localPaths = localRuntimePaths({ cwd });

  const report = {
    generatedAt: new Date().toISOString(),
    status: 'ok',
    local: {
      ...localPaths,
      gitBranch: gitBranch.ok ? gitBranch.value : '',
      gitClean: gitStatus.ok ? gitStatus.value === '' : false,
      gitStatus: gitStatus.ok ? gitStatus.value : gitStatus.value,
      nodeVersion: process.version,
      npmVersion: npm.ok ? npm.value : 'unknown',
    },
    dataForSeo: {
      status: 'unchecked',
    },
    hostinger: {
      status: 'unchecked',
      websites: null,
      tokenFilePresent: Boolean(readHostingerLocalEnv().HOSTINGER_API_TOKEN),
    },
    searchConsole: tokenStatus(),
  };

  try {
    const account = summarizeDataForSeoUserData(await getDataForSeoUserData());
    const serviceStatus = summarizeDataForSeoServiceStatus(await getDataForSeoServiceStatus());
    const onPageStatus = serviceStatus.services.find((service) => service.api === 'on_page')?.status ?? 'missing';
    const labsStatus = serviceStatus.services.find((service) => service.api === 'dataforseo_labs')?.status ?? 'missing';
    report.dataForSeo = {
      status: onPageStatus === 'ok' && labsStatus === 'ok' ? 'healthy' : 'degraded',
      balance: {
        amount: account.balance,
        currency: account.currency,
        warning: account.balance <= 10,
        topUp: account.balance <= 2,
      },
      serviceStatus: {
        onPage: onPageStatus,
        dataForSeoLabs: labsStatus,
        rateLimit: serviceStatus.rateLimit ?? null,
      },
    };
  } catch (error) {
    report.dataForSeo = {
      status: 'blocked',
      message: error instanceof Error ? error.message : String(error),
    };
  }

  try {
    const websites = summarizeCollection(await listHostingerWebsites());
    report.hostinger = {
      status: 'healthy',
      websites: websites.length,
      tokenFilePresent: Boolean(readHostingerLocalEnv().HOSTINGER_API_TOKEN),
    };
  } catch (error) {
    report.hostinger = {
      status: 'blocked',
      websites: null,
      tokenFilePresent: Boolean(readHostingerLocalEnv().HOSTINGER_API_TOKEN),
      message: error instanceof Error ? error.message : String(error),
    };
  }

  if (!report.local.cwdMatchesExpected || report.dataForSeo.status === 'blocked' || report.hostinger.status === 'blocked') {
    report.status = 'attention';
  }

  write(outputJsonPath, `${JSON.stringify(report, null, 2)}\n`);
  write(outputMarkdownPath, markdown(report));

  console.log(markdown(report));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
