import { readFileSync, writeFileSync, mkdirSync, lstatSync, realpathSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname, isAbsolute, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGitStateStore } from './lib/daily-editorial-state.mjs';
import { privateRepositoryMetadata } from './lib/daily-editorial-storage.mjs';
import { readPilotCodeIdentity } from './lib/daily-editorial-code-admission.mjs';
import { validatePilotPackage } from './lib/daily-editorial-pilot-package.mjs';
import { admitPilot, admitStatePreflight, loadPilotLedger, runHeldPilot, pilotOutcome } from './lib/daily-editorial-pilot.mjs';
import { stateRoundTripPreflight } from './lib/daily-editorial-state-preflight.mjs';
import { loadPilotContextBundleFromFiles, validatePilotContextBundle, freezePilotContextSpecs, validateFrozenPilotRequests, validateFrozenPilotDiagnostics, validatePilotContextReviewPin, resolvePilotContextReview } from './lib/daily-editorial-pilot-context.mjs';
import { MAX_PRIVATE_INPUT_FILES, MAX_PRIVATE_INPUT_FILE_BYTES, MAX_PRIVATE_INPUT_BYTES } from './lib/daily-editorial-private-input.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const descriptorPath = resolve(root, 'config/daily-editorial-pilot-inputs.json');
const configPath = resolve(root, 'config/daily-editorial-pilot.json');
const outputPath = resolve(root, 'output/daily-editorial-pilot/latest.json');
const fail = (code) => { throw Object.assign(new Error(code), { code }); };
const descriptor = () => JSON.parse(readFileSync(descriptorPath, 'utf8'));

/** Local verification overrides never reach a live/state mode or adopt approval. */
export function parsePilotArguments(args) {
  if (!Array.isArray(args) || args.some((arg) => typeof arg !== 'string')) fail('PILOT_ARGUMENT_INVALID');
  if (args[0]?.startsWith('--verify-inputs=')) {
    const paths = {};
    for (const arg of args) {
      const match = /^--(verify-inputs|descriptor|context-review)=(.+)$/u.exec(arg);
      if (!match || Object.hasOwn(paths, match[1]) || !isAbsolute(match[2]) || match[2].includes('\0')) fail('PILOT_ARGUMENT_INVALID');
      paths[match[1]] = match[2];
    }
    return { mode: 'verify-inputs', directory: paths['verify-inputs'], descriptorFile: paths.descriptor, contextReviewFile: paths['context-review'] };
  }
  if (args.length !== 1 || !['--offline', '--run', '--state-preflight'].includes(args[0])) fail('PILOT_ARGUMENT_INVALID');
  return { mode: args[0] };
}

/** Reject unsafe descriptor paths before reading any bundle body. */
export function loadLocalPilotFiles(directory, pinned) {
  if (!Array.isArray(pinned?.files) || pinned.files.length < 1 || pinned.files.length > MAX_PRIVATE_INPUT_FILES ||
      new Set(pinned.files.map((entry) => entry?.file)).size !== pinned.files.length) fail('PILOT_DESCRIPTOR_INVALID');
  let total = 0;
  for (const entry of pinned.files) {
    if (!/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+){0,3}$/u.test(entry?.file ?? '') || entry.file.split('/').some((part) => ['.', '..'].includes(part)) ||
        !Number.isSafeInteger(entry.bytes) || entry.bytes < 1 || entry.bytes > MAX_PRIVATE_INPUT_FILE_BYTES || !/^[a-f0-9]{64}$/u.test(entry.sha256 ?? '')) fail('PILOT_DESCRIPTOR_INVALID');
    total += entry.bytes;
  }
  if (total > MAX_PRIVATE_INPUT_BYTES) fail('PILOT_INPUT_SIZE');
  const localRoot = realpathSync(directory);
  return Object.fromEntries(pinned.files.map(({ file, bytes }) => {
    const target = resolve(localRoot, file);
    const location = relative(localRoot, realpathSync(target));
    const stat = lstatSync(target);
    if (!location || location.startsWith('..') || isAbsolute(location) || !stat.isFile() || stat.isSymbolicLink() ||
        stat.size !== bytes || stat.size > MAX_PRIVATE_INPUT_FILE_BYTES) fail('PILOT_INPUT_INVENTORY');
    return [file, new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(readFileSync(target))];
  }));
}

function contextPreflight(pkg, parentReview) {
  const registry = JSON.parse(pkg.files['context-registry.json']);
  const frozen = freezePilotContextSpecs(registry);
  if (frozen.registrySha256 !== pkg.descriptor.contextRegistrySha256) fail('PILOT_CONTEXT_UNASSESSED');
  const report = validatePilotContextBundle(loadPilotContextBundleFromFiles(pkg.files), { registry, parentReview });
  pkg.contextReport = report;
  const requestHashes = Object.fromEntries(pkg.descriptor.files.filter((file) => /^requests\/(?:ollama|typesafe)/.test(file.file)).map((file) => [file.file, file.sha256]));
  const factual = validateFrozenPilotRequests(report, pkg.factual.map(({ file }) => ({ id: file, text: pkg.files[file] })), { provider: 'ollama', expectedHashes: requestHashes });
  const typesafe = validateFrozenPilotRequests(report, pkg.typesafe.filter(({ file }) => file !== 'requests/typesafe-8.json').map(({ file }) => ({ id: file, text: pkg.files[file] })), { provider: 'typesafe', expectedHashes: requestHashes });
  const diagnosticFile = 'requests/typesafe-8.json';
  const diagnostics = validateFrozenPilotDiagnostics(report, { id: diagnosticFile, text: pkg.files[diagnosticFile] }, { expectedHash: requestHashes[diagnosticFile] });
  pkg.frozenRequestReview = { passed: factual.passed && typesafe.passed && diagnostics.passed };
  return { report, factual, typesafe, diagnostics };
}

function safeWrite(report) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`LocalSend pilot: ${report.status} (${report.reason}).`);
}

async function main(args) {
  let store;
  try {
    const options = parsePilotArguments(args);
    if (options.mode === '--offline') {
      const result = spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', '--configLoader', 'runner',
        'scripts/lib/daily-editorial-pilot-package.test.mjs', 'scripts/lib/daily-editorial-pilot-reviews.test.mjs',
        'scripts/lib/daily-editorial-pilot-context.test.mjs', 'scripts/lib/daily-editorial-pilot.test.mjs',
        'scripts/lib/daily-editorial-pilot-context-review.test.mjs',
        'scripts/lib/daily-editorial-projection.test.mjs',
        'scripts/lib/daily-editorial-code-admission.test.mjs',
        'scripts/lib/daily-editorial-local-input.test.mjs',
        'scripts/lib/daily-editorial-state-preflight.test.mjs',
        'scripts/lib/daily-editorial-state.test.mjs', 'scripts/lib/private-state-git-environment.test.mjs'], { cwd: root, stdio: 'inherit' });
      process.exitCode = result.status ?? 1;
      return;
    }
    if (options.mode === 'verify-inputs') {
      const supplied = options.directory;
      const pinned = options.descriptorFile ? JSON.parse(readFileSync(options.descriptorFile, 'utf8')) : descriptor();
      const files = loadLocalPilotFiles(supplied, pinned);
      const pkg = validatePilotPackage(files, pinned);
      const config = JSON.parse(readFileSync(configPath, 'utf8'));
      const localReview = options.contextReviewFile ? JSON.parse(readFileSync(options.contextReviewFile, 'utf8')) :
        resolvePilotContextReview(config.contextReview, pkg, { inputCommit: config.inputCommit });
      const context = contextPreflight(pkg, localReview);
      // This command cannot contact providers or approve the registry.
      console.log(JSON.stringify({ inputIntegrity: true, articleSha256: pinned.articleSha256, manifestSha256: pinned.manifestSha256,
        files: pinned.files.length, completeContextCandidates: context.report.assessed.length + context.report.unassessed.length,
        admittedContexts: context.report.assessed.length, heldContexts: context.report.unassessed.length,
        frozenRequestsAdmitted: pkg.frozenRequestReview.passed, localVerificationOnly: true, runtimeApprovalAdopted: false,
        providerCalls: 0, published: false }));
      return;
    }
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    const { codeCommit, clean } = readPilotCodeIdentity(root);
    if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REPOSITORY !== 'eliteandhonor/accessfreetools.com' ||
        process.env.GITHUB_REF !== 'refs/heads/main' || process.env.GITHUB_EVENT_NAME !== 'workflow_dispatch') fail('PILOT_APPROVAL_REQUIRED');
    const admission = { approval: process.env.AFT_EDITORIAL_PILOT_APPROVED, approvedCode: process.env.AFT_EDITORIAL_PILOT_CODE_SHA, codeCommit, clean };
    if (options.mode === '--state-preflight') {
      admitStatePreflight(config, admission);
      const stateToken = process.env.AFT_EDITORIAL_STATE_TOKEN;
      const proof = await stateRoundTripPreflight({ allowEmptyBaseline: config.statePreflightAllowEmptyBaseline === true,
        createStore: () => createGitStateStore({ root, branch: config.stateBranch,
        activated: true, stateRepository: config.stateRepository, privateStoreApproval: config.privateStoreApproval, stateToken,
        readRepositoryMetadata: (repository) => privateRepositoryMetadata(repository, { token: stateToken }) }) });
      const target = resolve(root, 'output/daily-editorial-pilot/state-preflight.json');
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, `${JSON.stringify(proof, null, 2)}\n`);
      console.log(`Private editorial state: ${proof.passed ? 'verified' : 'held'} (${proof.code}).`);
      if (!proof.passed) process.exitCode = 1;
      return;
    }
    admitPilot(config, admission);
    const pinned = descriptor();
    const contextPin = validatePilotContextReviewPin(config.contextReview, { inputCommit: config.inputCommit, descriptor: pinned });
    const stateToken = process.env.AFT_EDITORIAL_STATE_TOKEN;
    store = await createGitStateStore({ root, branch: config.stateBranch, activated: true,
      stateRepository: config.stateRepository, privateStoreApproval: config.privateStoreApproval, stateToken,
      readRepositoryMetadata: (repository) => privateRepositoryMetadata(repository, { token: stateToken }) });
    const paths = pinned.files.map(({ file }) => pinned.bundlePrefix + file);
    const bundle = await store.readInputBundle({ commit: config.inputCommit, files: paths });
    const files = Object.fromEntries(pinned.files.map(({ file }) => [file, bundle.files[pinned.bundlePrefix + file]]));
    const pkg = validatePilotPackage(files, pinned);
    contextPreflight(pkg, resolvePilotContextReview(contextPin, pkg, { inputCommit: config.inputCommit }));
    const state = await loadPilotLedger(store);
    const record = await runHeldPilot({ config, state, store, pkg, ...admission, keys: {
      jina: process.env.JINA_API_KEY, ollama: process.env.OLLAMA_API_KEY, typesafe: process.env.TYPESAFE_API_KEY,
    } });
    const report = pilotOutcome(record);
    safeWrite(report);
    if (report.status !== 'reviewed-unpublished') process.exitCode = 1;
  } catch (error) {
    safeWrite(pilotOutcome(undefined, error?.code));
    process.exitCode = 1;
  } finally {
    await store?.dispose?.();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main(process.argv.slice(2));
