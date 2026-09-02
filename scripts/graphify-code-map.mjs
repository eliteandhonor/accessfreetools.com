#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  GRAPHIFY_PINNED_VERSION,
  verifyGraph,
} from './lib/graphify-code-map.mjs';

const projectRoot = process.cwd();
const outputRoot = path.resolve(
  process.env.GRAPHIFY_OUTPUT_DIR || path.join(projectRoot, 'output', 'graphify'),
);
const graphPath = path.join(outputRoot, 'graphify-out', 'graph.json');
const reportPath = path.join(outputRoot, 'verification.json');
const fingerprintPath = path.join(outputRoot, 'source-fingerprint.json');
const graphifyCommand = process.platform === 'win32' ? 'graphify.exe' : 'graphify';
const GRAPH_SOURCE_EXTENSIONS = new Set([
  '.astro', '.cjs', '.cts', '.js', '.json', '.jsx', '.mjs', '.mts', '.ps1', '.svelte', '.ts', '.tsx', '.vue',
]);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }
  return result;
}

function assertPinnedGraphify() {
  const result = run(graphifyCommand, ['--version']);
  const versionText = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  if (!versionText.includes(`graphify ${GRAPHIFY_PINNED_VERSION}`)) {
    throw new Error(
      `Expected graphify ${GRAPHIFY_PINNED_VERSION}. Install it with: uv tool install graphifyy==${GRAPHIFY_PINNED_VERSION} --force`,
    );
  }
}

function currentCommit() {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: projectRoot, encoding: 'utf8' }).trim();
}

function trackedAstroFiles() {
  return execFileSync('git', ['ls-files', '--', '*.astro'], { cwd: projectRoot, encoding: 'utf8' })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
}

function sourceFingerprint() {
  const trackedFiles = execFileSync('git', ['ls-files'], { cwd: projectRoot, encoding: 'utf8' })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((file) => GRAPH_SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase()));
  const hash = createHash('sha256');
  for (const file of trackedFiles.sort()) {
    hash.update(file.replaceAll('\\', '/'));
    hash.update('\u0000');
    hash.update(fs.readFileSync(path.join(projectRoot, file)));
    hash.update('\u0000');
  }
  hash.update('.graphifyignore\u0000');
  hash.update(fs.readFileSync(path.join(projectRoot, '.graphifyignore')));
  return {
    algorithm: 'sha256',
    fileCount: trackedFiles.length,
    value: hash.digest('hex'),
  };
}

function verifyCurrentGraph(extra = {}) {
  if (!fs.existsSync(graphPath)) {
    throw new Error(`Graph not found at ${graphPath}. Run npm run graphify:build first.`);
  }
  const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
  const verification = verifyGraph({
    graph,
    trackedAstroFiles: trackedAstroFiles(),
    expectedCommit: currentCommit(),
  });
  const currentFingerprint = sourceFingerprint();
  const storedFingerprint = fs.existsSync(fingerprintPath)
    ? JSON.parse(fs.readFileSync(fingerprintPath, 'utf8'))
    : null;
  const freshnessErrors = [];
  if (!storedFingerprint) {
    freshnessErrors.push('source fingerprint is missing; rebuild the graph');
  } else if (storedFingerprint.value !== currentFingerprint.value) {
    freshnessErrors.push('source files changed after the graph was built; rebuild the graph');
  }
  const report = {
    generatedAt: new Date().toISOString(),
    graphifyVersion: GRAPHIFY_PINNED_VERSION,
    graphPath,
    ...extra,
    ...verification,
    ok: verification.ok && freshnessErrors.length === 0,
    errors: [...freshnessErrors, ...verification.errors],
    sourceFingerprint: currentFingerprint,
  };
  fs.mkdirSync(outputRoot, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) {
    throw new Error(`Graphify verification failed. See ${reportPath}`);
  }
  return report;
}

function build() {
  assertPinnedGraphify();
  fs.mkdirSync(outputRoot, { recursive: true });
  const extraction = run(graphifyCommand, [
    'extract',
    projectRoot,
    '--code-only',
    '--force',
    '--out',
    outputRoot,
  ]);
  run(graphifyCommand, ['cluster-only', outputRoot, '--no-viz', '--no-label']);
  const extractionText = `${extraction.stdout ?? ''}\n${extraction.stderr ?? ''}`;
  const syntaxWarningFiles = Number(
    extractionText.match(/warning: (\d+) file\(s\) had syntax errors/)?.[1] ?? 0,
  );
  const fingerprint = sourceFingerprint();
  fs.writeFileSync(fingerprintPath, `${JSON.stringify(fingerprint, null, 2)}\n`, 'utf8');
  verifyCurrentGraph({ syntaxWarningFiles });
}

function query(questionParts) {
  assertPinnedGraphify();
  verifyCurrentGraph();
  const question = questionParts.join(' ').trim();
  if (!question) {
    throw new Error('Provide a question, for example: npm run graphify:query -- "How does the MCP route reach the tool registry?"');
  }
  run(graphifyCommand, ['query', question, '--graph', graphPath, '--budget', '2000']);
}

function pathBetween(nodeParts) {
  assertPinnedGraphify();
  verifyCurrentGraph();
  if (nodeParts.length !== 2 || nodeParts.some((part) => !part.trim())) {
    throw new Error('Provide two node names, for example: npm run graphify:path -- "mcp.ts" "apiToolRegistry.ts"');
  }
  run(graphifyCommand, ['path', ...nodeParts, '--graph', graphPath, '--undirected']);
}

function explain(nodeParts) {
  assertPinnedGraphify();
  verifyCurrentGraph();
  const nodeName = nodeParts.join(' ').trim();
  if (!nodeName) {
    throw new Error('Provide a node name, for example: npm run graphify:explain -- "TextToSpeechAudiobookGenerator"');
  }
  run(graphifyCommand, ['explain', nodeName, '--graph', graphPath]);
}

const [command = 'verify', ...rest] = process.argv.slice(2);

try {
  if (command === 'build') build();
  else if (command === 'verify') {
    assertPinnedGraphify();
    verifyCurrentGraph();
  } else if (command === 'query') query(rest);
  else if (command === 'path') pathBetween(rest);
  else if (command === 'explain') explain(rest);
  else throw new Error(`Unknown command: ${command}. Use build, verify, query, path, or explain.`);
} catch (error) {
  console.error(`[graphify-code-map] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
