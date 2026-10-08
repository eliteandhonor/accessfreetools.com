import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createGitStateStore } from './lib/daily-editorial-state.mjs';
import { privateRepositoryMetadata } from './lib/daily-editorial-storage.mjs';
import { readPilotCodeIdentity } from './lib/daily-editorial-code-admission.mjs';
import { validatePilotPackage } from './lib/daily-editorial-pilot-package.mjs';
import { admitPilot, admitStatePreflight, runHeldPilot, pilotOutcome } from './lib/daily-editorial-pilot.mjs';
import { stateRoundTripPreflight } from './lib/daily-editorial-state-preflight.mjs';
import { loadPilotContextBundle, validatePilotContextBundle, freezePilotContextSpecs, validateFrozenPilotRequests, validateFrozenPilotDiagnostics } from './lib/daily-editorial-pilot-context.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const descriptorPath = resolve(root, 'config/daily-editorial-pilot-inputs.json');
const configPath = resolve(root, 'config/daily-editorial-pilot.json');
const outputPath = resolve(root, 'output/daily-editorial-pilot/latest.json');
const fail = (code) => { throw Object.assign(new Error(code), { code }); };
const descriptor = () => JSON.parse(readFileSync(descriptorPath, 'utf8'));

function contextPreflight(pkg, directory, parentReview) {
  const registry = JSON.parse(pkg.files['context-registry.json']);
  const frozen = freezePilotContextSpecs(registry);
  if (frozen.registrySha256 !== pkg.descriptor.contextRegistrySha256) fail('PILOT_CONTEXT_UNASSESSED');
  const report = validatePilotContextBundle(loadPilotContextBundle(directory), { registry, parentReview });
  pkg.contextReport = report;
  const requestHashes = Object.fromEntries(pkg.descriptor.files.filter((file) => /^requests\/(?:ollama|typesafe)/.test(file.file)).map((file) => [file.file, file.sha256]));
  const factual = validateFrozenPilotRequests(report, pkg.factual.map(({ file }) => ({ id: file, text: pkg.files[file] })), { provider: 'ollama', expectedHashes: requestHashes });
  const typesafe = validateFrozenPilotRequests(report, pkg.typesafe.filter(({ file }) => file !== 'requests/typesafe-8.json').map(({ file }) => ({ id: file, text: pkg.files[file] })), { provider: 'typesafe', expectedHashes: requestHashes });
  const diagnosticFile = 'requests/typesafe-8.json';
  const diagnostics = validateFrozenPilotDiagnostics(report, { id: diagnosticFile, text: pkg.files[diagnosticFile] }, { expectedHash: requestHashes[diagnosticFile] });
  pkg.frozenRequestReview = { passed: factual.passed && typesafe.passed && diagnostics.passed };
  return { report, factual, typesafe, diagnostics };
}

function materialize(files) {
  const directory = mkdtempSync(join(tmpdir(), 'aft-private-pilot-'));
  try {
    for (const [file, text] of Object.entries(files)) {
      const target = resolve(directory, file);
      if (!target.startsWith(directory + '/')) fail('PILOT_INPUT_INVENTORY');
      mkdirSync(dirname(target), { recursive: true, mode: 0o700 });
      writeFileSync(target, text, { mode: 0o600, flag: 'wx' });
    }
    return directory;
  } catch (error) { rmSync(directory, { recursive: true, force: true }); throw error; }
}

function safeWrite(report) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`LocalSend pilot: ${report.status} (${report.reason}).`);
}

async function main(args) {
  let store;
  let directory;
  try {
    if (args.length !== 1) fail('PILOT_ARGUMENT_INVALID');
    if (args[0] === '--offline') {
      const result = spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', '--configLoader', 'runner',
        'scripts/lib/daily-editorial-pilot-package.test.mjs', 'scripts/lib/daily-editorial-pilot-reviews.test.mjs',
        'scripts/lib/daily-editorial-pilot-context.test.mjs', 'scripts/lib/daily-editorial-pilot.test.mjs',
        'scripts/lib/daily-editorial-code-admission.test.mjs',
        'scripts/lib/daily-editorial-state-preflight.test.mjs',
        'scripts/lib/daily-editorial-state.test.mjs', 'scripts/lib/private-state-git-environment.test.mjs'], { cwd: root, stdio: 'inherit' });
      process.exitCode = result.status ?? 1;
      return;
    }
    if (args[0].startsWith('--verify-inputs=')) {
      const supplied = args[0].slice('--verify-inputs='.length);
      if (!supplied.startsWith('/') || supplied.includes('\0')) fail('PILOT_ARGUMENT_INVALID');
      const pinned = descriptor();
      const files = Object.fromEntries(pinned.files.map(({ file }) => [file, readFileSync(resolve(supplied, file), 'utf8')]));
      const pkg = validatePilotPackage(files, pinned);
      const config = JSON.parse(readFileSync(configPath, 'utf8'));
      const context = contextPreflight(pkg, supplied, config.contextReview);
      // This command cannot contact providers or approve the registry.
      console.log(JSON.stringify({ inputIntegrity: true, articleSha256: pinned.articleSha256, manifestSha256: pinned.manifestSha256,
        files: pinned.files.length, completeContextCandidates: context.report.assessed.length + context.report.unassessed.length,
        admittedContexts: context.report.assessed.length, heldContexts: context.report.unassessed.length,
        frozenRequestsAdmitted: pkg.frozenRequestReview.passed, providerCalls: 0, published: false }));
      return;
    }
    if (!['--run', '--state-preflight'].includes(args[0])) fail('PILOT_ARGUMENT_INVALID');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    const { codeCommit, clean } = readPilotCodeIdentity(root);
    if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REPOSITORY !== 'eliteandhonor/accessfreetools.com' ||
        process.env.GITHUB_REF !== 'refs/heads/main' || process.env.GITHUB_EVENT_NAME !== 'workflow_dispatch') fail('PILOT_APPROVAL_REQUIRED');
    const admission = { approval: process.env.AFT_EDITORIAL_PILOT_APPROVED, approvedCode: process.env.AFT_EDITORIAL_PILOT_CODE_SHA, codeCommit, clean };
    if (args[0] === '--state-preflight') {
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
    const stateToken = process.env.AFT_EDITORIAL_STATE_TOKEN;
    store = await createGitStateStore({ root, branch: config.stateBranch, activated: true,
      stateRepository: config.stateRepository, privateStoreApproval: config.privateStoreApproval, stateToken,
      readRepositoryMetadata: (repository) => privateRepositoryMetadata(repository, { token: stateToken }) });
    const pinned = descriptor();
    const paths = pinned.files.map(({ file }) => pinned.bundlePrefix + file);
    const bundle = await store.readInputBundle({ commit: config.inputCommit, files: paths });
    const files = Object.fromEntries(pinned.files.map(({ file }) => [file, bundle.files[pinned.bundlePrefix + file]]));
    const pkg = validatePilotPackage(files, pinned);
    directory = materialize(files);
    contextPreflight(pkg, directory, config.contextReview);
    const state = await store.load();
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
    if (directory) rmSync(directory, { recursive: true, force: true });
    await store?.dispose?.();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main(process.argv.slice(2));
