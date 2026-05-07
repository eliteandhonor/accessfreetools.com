import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
const option = (name, fallback = undefined) =>
  args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) ?? fallback;

function localDateStamp(date = new Date()) {
  const timeZone = process.env.AFT_AUDIT_TIME_ZONE ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value ?? '';

  return `${value('year')}-${value('month')}-${value('day')}`;
}

const today = localDateStamp();
const outputDir = resolve(option('--output-dir', join('output', 'deep-audit', today)));
const screenshotDir = join(outputDir, 'screenshots');
const skipPaid = args.includes('--skip-paid');
const skipSmoke = args.includes('--skip-smoke');
const skipCheck = args.includes('--skip-check');
const skipSearchConsole = args.includes('--skip-search-console');
const maxCrawlPages = Number(option('--max-crawl-pages', '1000'));
const npmCommand = 'npm';
const cmdCommand = process.env.ComSpec ?? 'cmd.exe';
const nodeCommand = process.execPath;

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function safeLabel(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function run(command, commandArgs, options = {}) {
  const startedAt = new Date();
  const logPath = join(outputDir, 'logs', `${safeLabel(options.label ?? command)}.log`);

  return new Promise((resolveRun) => {
    mkdirSync(dirname(logPath), { recursive: true });
    const child = spawn(command, commandArgs, {
      cwd: process.cwd(),
      shell: false,
      env: {
        ...process.env,
        ...(options.env ?? {}),
      },
    });
    let output = '';
    let settled = false;

    const append = (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stdout.write(text);
    };

    child.stdout.on('data', append);
    child.stderr.on('data', append);
    child.on('error', (error) => {
      if (settled) {
        return;
      }

      settled = true;
      const text = error instanceof Error ? error.message : String(error);
      output += `${text}\n`;
      writeText(logPath, output);
      resolveRun({
        label: options.label ?? command,
        command: [command, ...commandArgs].join(' '),
        startedAt: startedAt.toISOString(),
        finishedAt: new Date().toISOString(),
        code: 1,
        hard: Boolean(options.hard),
        logPath,
      });
    });
    child.on('close', (code) => {
      if (settled) {
        return;
      }

      settled = true;
      writeText(logPath, output);
      resolveRun({
        label: options.label ?? command,
        command: [command, ...commandArgs].join(' '),
        startedAt: startedAt.toISOString(),
        finishedAt: new Date().toISOString(),
        code,
        hard: Boolean(options.hard),
        logPath,
      });
    });
  });
}

async function copyIfExists(from, to) {
  const source = resolve(from);

  if (!existsSync(source)) {
    return false;
  }

  await mkdir(dirname(to), { recursive: true });
  await copyFile(source, to);
  return true;
}

async function main() {
  mkdirSync(outputDir, { recursive: true });
  mkdirSync(screenshotDir, { recursive: true });
  console.log(`Deep audit evidence directory: ${outputDir}`);

  const steps = [];
  const runNpm = (label, scriptArgs, options = {}) => {
    const commandParts = [npmCommand, 'run', ...scriptArgs];

    return process.platform === 'win32'
      ? run(cmdCommand, ['/d', '/s', '/c', commandParts.join(' ')], { label, hard: options.hard, env: options.env })
      : run(npmCommand, ['run', ...scriptArgs], { label, hard: options.hard, env: options.env });
  };
  const runNodeScript = (label, script, scriptArgs = [], options = {}) =>
    run(nodeCommand, [script, ...scriptArgs], { label, hard: options.hard, env: options.env });

  steps.push(
    await runNodeScript('dataforseo-account', 'scripts/dataforseo-account.mjs', [
      '--min-balance=2',
      '--warn-balance=10',
      `--report=${join(outputDir, 'dataforseo-account.json')}`,
    ], { hard: true }),
  );
  steps.push(
    await runNodeScript('dataforseo-status', 'scripts/dataforseo-status.mjs', [
      '--fail-on-unhealthy',
      `--report=${join(outputDir, 'dataforseo-status.json')}`,
    ], { hard: true }),
  );
  steps.push(
    await runNodeScript('dataforseo-status-sandbox', 'scripts/dataforseo-status.mjs', [
      '--sandbox',
      `--report=${join(outputDir, 'dataforseo-status-sandbox.json')}`,
    ], { hard: false }),
  );

  if (!skipCheck) {
    steps.push(await runNpm('check', ['check'], { hard: true }));
  }

  steps.push(await runNpm('external-links', ['check:external-links'], { hard: true }));
  await copyIfExists('output/external-link-audit.json', join(outputDir, 'external-link-audit.json'));

  if (!skipPaid) {
    steps.push(
      await runNodeScript('dataforseo-onpage-audit', 'scripts/seo-onpage-audit.mjs', [
        `--output-dir=${join(outputDir, 'dataforseo-onpage')}`,
        `--max-crawl-pages=${maxCrawlPages}`,
      ], { hard: true }),
    );
  }

  if (!skipSearchConsole) {
    steps.push(await runNodeScript('search-console-inspect-key-urls', 'scripts/search-console.mjs', ['--inspect-key-urls'], { hard: false }));
    await copyIfExists('output/search-console-url-inspection.json', join(outputDir, 'search-console-url-inspection.json'));
    steps.push(await runNodeScript('search-console-performance', 'scripts/search-console.mjs', [], { hard: false }));
    await copyIfExists('output/search-console-performance.json', join(outputDir, 'search-console-performance.json'));
  }

  steps.push(
    await runNodeScript('seo-self-evaluate', 'scripts/seo-agent-self-evaluation.mjs', [
      `--report=${join(outputDir, 'seo-self-evaluation.md')}`,
      `--json=${join(outputDir, 'seo-self-evaluation.json')}`,
    ], { hard: false }),
  );
  steps.push(await runNpm('indexnow-verify-key', ['indexnow:verify-key'], { hard: true }));

  if (!skipSmoke) {
    steps.push(
      await runNpm('playwright-smoke', ['test:smoke'], {
        hard: true,
        env: { DEEP_AUDIT_SCREENSHOT_DIR: screenshotDir },
      }),
    );
  }

  steps.push(
    await runNodeScript('local-deep-audit', 'scripts/deep-audit-local.mjs', [`--output-dir=${join(outputDir, 'local')}`], {
      hard: true,
    }),
  );

  const reports = {
    account: readJsonIfExists(join(outputDir, 'dataforseo-account.json')),
    onPage: readJsonIfExists(join(outputDir, 'dataforseo-onpage', 'summary.json')),
    local: readJsonIfExists(join(outputDir, 'local', 'local-audit.json')),
    searchConsole: readJsonIfExists(join(outputDir, 'search-console-url-inspection.json')),
  };
  const failedHard = steps.filter((step) => step.hard && step.code !== 0);
  const failedSoft = steps.filter((step) => !step.hard && step.code !== 0);
  const summary = {
    generatedAt: new Date().toISOString(),
    outputDir,
    maxCrawlPages,
    steps,
    failedHard,
    failedSoft,
    reports,
  };
  const summaryMd = renderMarkdown(summary);

  writeJson(join(outputDir, 'summary.json'), summary);
  writeText(join(outputDir, 'summary.md'), summaryMd);
  console.log(`Saved deep audit summary to ${join(outputDir, 'summary.md')}`);

  if (failedHard.length > 0) {
    process.exitCode = 1;
  }
}

function readJsonIfExists(path) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
  } catch (error) {
    return {
      parseError: error instanceof Error ? error.message : String(error),
      path,
    };
  }
}

function renderMarkdown(summary) {
  const lines = [
    '# Complete Project Deep Audit',
    '',
    `Generated: ${summary.generatedAt}`,
    `Evidence directory: ${summary.outputDir}`,
    '',
    '## Command Results',
    '',
  ];

  for (const step of summary.steps) {
    const status = step.code === 0 ? 'passed' : step.hard ? 'failed' : 'warning';
    lines.push(`- ${status}: ${step.label} (exit ${step.code})`);
  }

  lines.push('', '## DataForSEO', '');

  if (summary.reports.account?.account) {
    const account = summary.reports.account.account;
    lines.push(`- Balance: ${Number(account.balance ?? 0).toFixed(2)} ${account.currency ?? 'USD'}`);
  } else {
    lines.push('- Account report was not available.');
  }

  if (summary.reports.onPage) {
    lines.push(`- OnPage task: ${summary.reports.onPage.taskId}`);
    lines.push(`- Pages crawled: ${summary.reports.onPage.pagesCrawled}`);
    lines.push(`- Broken pages: ${summary.reports.onPage.counts?.brokenPages ?? 'unknown'}`);
    lines.push(`- Broken links: ${summary.reports.onPage.counts?.brokenLinks ?? 'unknown'}`);
    lines.push(`- Large resources: ${summary.reports.onPage.counts?.largeResources ?? 'unknown'}`);
  } else {
    lines.push('- OnPage report was skipped or unavailable.');
  }

  lines.push('', '## Local Project Audit', '');

  if (summary.reports.local) {
    lines.push(`- Canonical tools: ${summary.reports.local.toolCoverage?.canonicalToolCount ?? 'unknown'}`);
    lines.push(
      `- Missing deep-review records: ${summary.reports.local.toolCoverage?.missingDeepReviewRecords?.length ?? 'unknown'}`,
    );
    lines.push(`- Security headers missing: ${summary.reports.local.security?.missingHeaders?.length ?? 'unknown'}`);
    lines.push(
      `- Promotion items needing approval: ${summary.reports.local.promotion?.needsApproval?.length ?? 'unknown'}`,
    );

    if (summary.reports.local.rankedRecommendations?.length) {
      lines.push('', '### Ranked Local Recommendations', '');
      for (const item of summary.reports.local.rankedRecommendations) {
        lines.push(`- ${item.priority} ${item.area}: ${item.recommendation}`);
      }
    }
  } else {
    lines.push('- Local audit report was not available.');
  }

  lines.push('', '## Search Console', '');

  if (summary.reports.searchConsole?.inspections?.length) {
    for (const item of summary.reports.searchConsole.inspections) {
      lines.push(`- ${item.inspectionUrl}: ${item.verdict ?? 'unknown'} / ${item.coverageState ?? item.error ?? 'unknown'}`);
    }
  } else {
    lines.push('- URL inspection report was unavailable or empty.');
  }

  lines.push('', '## Result', '');

  if (summary.failedHard.length === 0) {
    lines.push('- No hard audit step failed.');
  } else {
    lines.push(`- ${summary.failedHard.length} hard audit step(s) failed. Review logs before deploying.`);
  }

  if (summary.failedSoft.length > 0) {
    lines.push(`- ${summary.failedSoft.length} soft external/optional step(s) need review.`);
  }

  return `${lines.join('\n')}\n`;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
