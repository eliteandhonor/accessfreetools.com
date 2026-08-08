import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildWritingQualityReport,
  normalizeWritingMode,
  renderWritingQualityMarkdown,
} from './lib/writing-quality-rules.mjs';

const HELP = `Usage:
  node scripts/writing-quality.mjs --mode=editorial <file-or-directory>
  node scripts/writing-quality.mjs --mode=technical <file-or-directory>

Modes:
  editorial  Preserve a natural public voice and report clarity warnings.
  technical  Apply stricter sentence, paragraph, and contraction diagnostics.

Exit behavior:
  0  No hard writing errors. Warnings may still be present.
  1  One or more hard writing errors, or the audit could not run.
`;

export function parseWritingQualityArguments(argv) {
  const positional = [];
  let mode = 'editorial';
  let explicitMode = false;
  let help = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') {
      help = true;
      continue;
    }
    if (argument.startsWith('--mode=')) {
      mode = argument.slice('--mode='.length);
      explicitMode = true;
      continue;
    }
    if (argument === '--mode') {
      index += 1;
      if (index >= argv.length) throw new Error('Missing value after --mode.');
      mode = argv[index];
      explicitMode = true;
      continue;
    }
    if (argument.startsWith('-')) {
      throw new Error(`Unknown option: ${argument}`);
    }
    positional.push(argument);
  }

  if (help) return { help: true, mode: 'editorial', target: null };
  if (
    !explicitMode &&
    positional.length === 2 &&
    ['editorial', 'technical'].includes(String(positional[0]).toLowerCase())
  ) {
    mode = positional.shift();
  }
  if (positional.length !== 1) {
    throw new Error('Provide exactly one file or directory to review.');
  }

  return {
    help: false,
    mode: normalizeWritingMode(mode),
    target: positional[0],
  };
}

function writeReportFile(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

export function runWritingQualityCli({
  argv = process.argv.slice(2),
  cwd = process.cwd(),
  log = console.log,
} = {}) {
  const options = parseWritingQualityArguments(argv);
  if (options.help) {
    log(HELP);
    return { exitCode: 0, report: null };
  }

  const outputDirectory = resolve(cwd, 'output', 'writing-quality');
  const report = buildWritingQualityReport({
    mode: options.mode,
    rootDir: cwd,
    targetPath: resolve(cwd, options.target),
  });
  const jsonPath = resolve(outputDirectory, 'latest.json');
  const markdownPath = resolve(outputDirectory, 'latest.md');

  writeReportFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  writeReportFile(markdownPath, renderWritingQualityMarkdown(report));

  log(
    `Writing quality: ${report.status}; ` +
      `${report.summary.hardErrors} hard errors; ${report.summary.warnings} warnings.`,
  );
  log(`Saved ${jsonPath}`);
  log(`Saved ${markdownPath}`);

  return {
    exitCode: report.summary.hardErrors > 0 ? 1 : 0,
    report,
  };
}

const isDirectRun =
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  try {
    const result = runWritingQualityCli();
    process.exitCode = result.exitCode;
  } catch (error) {
    console.error(`Writing quality audit failed: ${error.message}`);
    process.exitCode = 1;
  }
}
