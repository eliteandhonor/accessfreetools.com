import { afterEach, describe, expect, it } from 'vitest';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makePilotPackageFixture, resealPilotPackageFixture } from '../fixtures/daily-editorial/pilot-fixture.mjs';
import { digest, validatePilotPackage } from './daily-editorial-pilot-package.mjs';
import { loadPilotContextBundleFromFiles, resolvePilotContextReview, validatePilotContextBundle, validatePilotContextReviewPin } from './daily-editorial-pilot-context.mjs';

// Every body, source, pin and approval below is invented synthetic test data.
// No real private bundle, provider receipt, credential or remote is read.
const NOW = new Date('2026-10-09T02:00:00.000Z');
const COMMIT = 'd'.repeat(40);
const REVIEW_FILE = 'context-independent-review.json';
const temporary = [];
afterEach(() => { for (const directory of temporary.splice(0)) rmSync(directory, { recursive: true, force: true }); });
function fixture(changeReview) {
  const value = makePilotPackageFixture();
  const review = JSON.parse(value.files['parent-context-review.json']);
  if (changeReview) changeReview(review);
  value.files[REVIEW_FILE] = JSON.stringify(review);
  delete value.files['parent-context-review.json'];
  value.descriptor.bundlePrefix = 'inputs/localsend-held-pilot/v3/';
  resealPilotPackageFixture(value);
  const pkg = validatePilotPackage(value.files, value.descriptor);
  const entry = value.descriptor.files.find(({ file }) => file === REVIEW_FILE);
  const pin = { decision: 'context-units-approved', ref: 'synthetic-fixture-review', file: REVIEW_FILE,
    bytes: entry.bytes, sha256: entry.sha256, inputCommit: COMMIT };
  return { ...value, pkg, pin, review };
}
const resolve = (value, extra = {}) => resolvePilotContextReview(value.pin, value.pkg, { inputCommit: COMMIT, now: NOW, ...extra });

function localCliFixture(value, pin) {
  const root = mkdtempSync(join(tmpdir(), 'aft-private-review-cli-')); temporary.push(root);
  const scripts = join(root, 'scripts'); mkdirSync(scripts);
  copyFileSync(fileURLToPath(new URL('../daily-editorial-pilot.mjs', import.meta.url)), join(scripts, 'daily-editorial-pilot.mjs'));
  symlinkSync(fileURLToPath(new URL('.', import.meta.url)), join(scripts, 'lib'), 'dir');
  mkdirSync(join(root, 'config'));
  const config = { enabled: false, publicationEnabled: false, inputCommit: COMMIT, contextReview: pin };
  writeFileSync(join(root, 'config/daily-editorial-pilot.json'), JSON.stringify(config));
  const bundle = join(root, 'bundle'); mkdirSync(bundle);
  for (const [file, text] of Object.entries(value.files)) {
    const target = join(bundle, file); mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, text);
  }
  const descriptor = join(root, 'descriptor.json'); writeFileSync(descriptor, JSON.stringify(value.descriptor));
  const run = (extra = []) => JSON.parse(execFileSync(process.execPath, [join(scripts, 'daily-editorial-pilot.mjs'),
    `--verify-inputs=${bundle}`, `--descriptor=${descriptor}`, ...extra], { cwd: root, env: {}, encoding: 'utf8', timeout: 10000 }).trim());
  return { root, config, run };
}

describe('private inventoried context review resolver', () => {
  it('resolves exact pinned bytes in memory and preserves context-only admission', () => {
    const value = fixture();
    const before = JSON.stringify(value);
    const parentReview = resolve(value);
    expect(parentReview).toEqual(value.review);
    expect(Object.isFrozen(parentReview)).toBe(true);
    expect(Object.isFrozen(parentReview.sourceHashes)).toBe(true);
    expect(Object.isFrozen(parentReview.unitIds)).toBe(true);
    expect(JSON.stringify(value)).toBe(before);
    const report = validatePilotContextBundle(loadPilotContextBundleFromFiles(value.pkg.files), {
      registry: JSON.parse(value.pkg.files['context-registry.json']), parentReview, now: NOW,
    });
    expect(report).toMatchObject({ passed: true, scope: 'context-admission-only', factualClaimsApproved: false, publicationApproved: false });
    expect(report.assessed).toHaveLength(34);
    expect(value.pkg.manifest.dispatchAllowed).toBe(false);
    expect(value.pkg.manifest.approvedGrant).toBe(false);
    expect(value.pkg.contract.publicationAllowed).toBe(false);
  });

  it('does not adopt an available report when configuration has no pin', () => {
    expect(resolvePilotContextReview(null, fixture().pkg, { inputCommit: COMMIT, now: NOW })).toBeNull();
    expect(resolvePilotContextReview(undefined, undefined)).toBeNull();
  });

  it.each([
    ['inline report', (value) => { value.pin = value.review; }],
    ['extra field', (value) => { value.pin.runtimeApproved = true; }],
    ['wrong file', (value) => { value.pin.file = '../context-independent-review.json'; }],
    ['mutable commit', (value) => { value.pin.inputCommit = 'main'; }],
    ['different commit', (value) => { value.pin.inputCommit = 'e'.repeat(40); }],
    ['array commit', (value) => { value.pin.inputCommit = [COMMIT]; }],
    ['unapproved decision', (value) => { value.pin.decision = 'pending'; }],
    ['invalid ref', (value) => { value.pin.ref = 'untrusted?ref'; }],
    ['array ref', (value) => { value.pin.ref = [value.pin.ref]; }],
    ['missing hash', (value) => { delete value.pin.sha256; }],
    ['array hash', (value) => { value.pin.sha256 = [value.pin.sha256]; }],
    ['wrong byte size', (value) => { value.pin.bytes += 1; }],
    ['unbounded size', (value) => { value.pin.bytes = 256 * 1024 + 1; }],
    ['missing descriptor', (value) => { value.pkg.descriptor = undefined; }],
    ['wrong inventory type', (value) => { value.pkg.descriptor.files = {}; }],
    ['unlisted review', (value) => { value.pkg.descriptor.files = value.pkg.descriptor.files.filter(({ file }) => file !== REVIEW_FILE); }],
    ['duplicate review', (value) => { value.pkg.descriptor.files.push({ ...value.pkg.descriptor.files.find(({ file }) => file === REVIEW_FILE) }); }],
    ['inventory hash mismatch', (value) => { value.pkg.descriptor.files.find(({ file }) => file === REVIEW_FILE).sha256 = '0'.repeat(64); }],
  ])('rejects %s metadata with a fixed code before any body is resolved', (_, change) => {
    const value = fixture(); change(value);
    expect(() => resolve(value)).toThrow('PILOT_CONTEXT_UNASSESSED');
  });

  it.each([
    ['missing body', (value) => { delete value.pkg.files[REVIEW_FILE]; }],
    ['mutated body of the same size', (value) => { value.pkg.files[REVIEW_FILE] = value.pkg.files[REVIEW_FILE].replace('synthetic-independent-reviewer', 'synthetic-independent-reviewez'); }],
    ['mismatched final newline', (value) => { value.pkg.files[REVIEW_FILE] += '\n'; }],
  ])('rejects %s after inventory validation without trusting cached package status', (_, change) => {
    const value = fixture(); change(value);
    expect(() => resolve(value)).toThrow('PILOT_CONTEXT_UNASSESSED');
  });

  it('rejects malformed JSON even when the synthetic metadata hashes it exactly', () => {
    const value = fixture(); const text = '{synthetic-invalid';
    value.pkg.files[REVIEW_FILE] = text;
    value.pin.bytes = Buffer.byteLength(text); value.pin.sha256 = digest(text);
    Object.assign(value.pkg.descriptor.files.find(({ file }) => file === REVIEW_FILE), { bytes: value.pin.bytes, sha256: value.pin.sha256 });
    expect(() => resolve(value)).toThrow('PILOT_CONTEXT_UNASSESSED');
  });

  it.each([
    ['extra report field', (review) => { review.runtimeApproved = true; }],
    ['wrong decision', (review) => { review.decision = 'pending'; }],
    ['different ref', (review) => { review.ref = 'synthetic-different-review'; }],
    ['missing reviewer', (review) => { delete review.reviewer; }],
    ['same preparer/reviewer', (review) => { review.reviewer = 'synthetic-fixture-author'; }],
    ['future review', (review) => { review.reviewedAt = '2099-01-01T00:00:00Z'; }],
    ['invalid timestamp', (review) => { review.reviewedAt = 'invalid'; }],
    ['wrong article', (review) => { review.articleSha256 = '0'.repeat(64); }],
    ['wrong registry', (review) => { review.registrySha256 = '0'.repeat(64); }],
    ['missing source', (review) => { delete review.sourceHashes['main-readme']; }],
    ['extra source', (review) => { review.sourceHashes.extra = '0'.repeat(64); }],
    ['wrong source hash', (review) => { review.sourceHashes['release-readme'] = '0'.repeat(64); }],
    ['wrong source type', (review) => { review.sourceHashes['release-readme'] = [review.sourceHashes['release-readme']]; }],
    ['missing unit', (review) => { review.unitIds.pop(); }],
    ['duplicate unit', (review) => { review.unitIds.push(review.unitIds[0]); }],
    ['extra unit', (review) => { review.unitIds.push('unreviewed-extra'); }],
    ['wrong unit type', (review) => { review.unitIds[0] = { id: review.unitIds[0] }; }],
  ])('rejects %s review scope even when synthetic byte/hash pins are rebound', (_, change) => {
    expect(() => resolve(fixture(change))).toThrow('PILOT_CONTEXT_UNASSESSED');
  });

  it('rejects an invalid validation clock and snapshot-scope registry substitution', () => {
    const value = fixture();
    expect(() => resolve(value, { now: new Date('invalid') })).toThrow('PILOT_CONTEXT_UNASSESSED');
    value.pkg.files['context-registry.json'] = value.pkg.files['context-registry.json'].replace('synthetic-fixture-author', 'different-fixture-author');
    expect(() => resolve(value)).toThrow('PILOT_CONTEXT_UNASSESSED');
  });

  it('validates only the exact metadata inventory before body access', () => {
    const value = fixture();
    Object.defineProperty(value.pkg.files, REVIEW_FILE, { get() { throw new Error('Body was read too early'); } });
    expect(validatePilotContextReviewPin(value.pin, { inputCommit: COMMIT, descriptor: value.pkg.descriptor })).toEqual(value.pin);
  });
});

describe('offline CLI private review resolution is distinct from runtime adoption', () => {
  it('uses a configured metadata pin by default without an external report or runtime grant', () => {
    const value = fixture(); const local = localCliFixture(value, value.pin);
    const report = local.run();
    expect(report).toMatchObject({ inputIntegrity: true, admittedContexts: 34, heldContexts: 0, frozenRequestsAdmitted: true,
      localVerificationOnly: true, runtimeApprovalAdopted: false, providerCalls: 0, published: false });
    expect(JSON.parse(readFileSync(join(local.root, 'config/daily-editorial-pilot.json'), 'utf8'))).toEqual(local.config);
  });

  it('keeps null configuration held and preserves explicit local-review verification only', () => {
    const value = fixture(); const local = localCliFixture(value, null);
    expect(local.run()).toMatchObject({ inputIntegrity: true, admittedContexts: 0, heldContexts: 34, frozenRequestsAdmitted: false,
      localVerificationOnly: true, runtimeApprovalAdopted: false, providerCalls: 0, published: false });
    const reviewFile = join(local.root, 'synthetic-local-review.json'); writeFileSync(reviewFile, JSON.stringify(value.review));
    expect(local.run([`--context-review=${reviewFile}`])).toMatchObject({ admittedContexts: 34, heldContexts: 0,
      localVerificationOnly: true, runtimeApprovalAdopted: false, providerCalls: 0, published: false });
  });
});
