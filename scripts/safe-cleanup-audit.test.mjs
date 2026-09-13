import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const repoRoot = process.cwd();
const tempRoots = [];
const reportPaths = [
  resolve(repoRoot, 'output/maintenance/safe-cleanup-audit-latest.json'),
  resolve(repoRoot, 'output/maintenance/safe-cleanup-audit-latest.md'),
];
const preservedReports = new Map();

function makeTempRoot() {
  const root = join(tmpdir(), `aft-maintenance-audit-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(root, { recursive: true });
  tempRoots.push(root);
  return root;
}

function preserveReport(path) {
  if (preservedReports.has(path)) return;
  preservedReports.set(path, {
    content: existsSync(path) ? readFileSync(path, 'utf8') : '',
    existed: existsSync(path),
  });
}

afterEach(() => {
  for (const path of reportPaths) {
    const original = preservedReports.get(path);
    if (!original) continue;

    if (original.existed) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, original.content);
    } else {
      rmSync(path, { force: true });
    }
  }
  preservedReports.clear();

  while (tempRoots.length) rmSync(tempRoots.pop(), { force: true, recursive: true });
});

describe('safe cleanup audit', () => {
  it('captures current SEO queue and proof output without npm wrapper loss', () => {
    for (const path of reportPaths) preserveReport(path);
    const codexHome = makeTempRoot();
    mkdirSync(join(codexHome, 'sessions'), { recursive: true });

    const result = spawnSync(process.execPath, ['scripts/safe-cleanup-audit.mjs'], {
      cwd: repoRoot,
      encoding: 'utf8',
      env: { ...process.env, AFT_MAINTENANCE_AUDIT_FAST: '1', CODEX_HOME: codexHome },
    });

    expect(result.status).toBe(0);
    const report = JSON.parse(readFileSync(reportPaths[0], 'utf8'));
    const queue = report.commands.find((command) => command.label === 'SEO tool queue');
    const proof = report.commands.find((command) => command.label === 'Current proof check');

    expect(queue).toMatchObject({
      command: 'node scripts/aft-cli.mjs seo-tool-queue',
      exitCode: 0,
    });
    const directQueue = spawnSync(process.execPath, ['scripts/aft-cli.mjs', 'seo-tool-queue'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    expect(directQueue.status).toBe(0);
    expect(queue.stdout.trim()).toBe(directQueue.stdout.trim());
    expect(queue.stdout).toMatch(/Remaining page review units: \d+/);
    expect(proof).toMatchObject({
      command: 'node scripts/aft-cli.mjs proof-check',
      exitCode: 0,
    });
    const directProof = spawnSync(process.execPath, ['scripts/aft-cli.mjs', 'proof-check'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    expect(directProof.status).toBe(0);
    expect(proof.stdout.trim()).toBe(directProof.stdout.trim());
    expect(proof.stdout).toMatch(/Missing proof on claimed rows: (?:none|\d+)/);
    expect(proof.stdout).toMatch(/Rows still needing public proof: (?:none|\d+)/);
  }, 20000);
});
