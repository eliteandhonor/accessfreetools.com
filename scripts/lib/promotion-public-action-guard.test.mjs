import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('inactive publisher CLI boundaries', () => {
  it.each([
    ['DEV Community', 'devto-promotion-agent.mjs', ['--publish', '--confirm-public-post']],
    ['Reddit', 'reddit-publish-profile-post.mjs', ['--confirm-public-post', '--headless']],
  ])('blocks %s before credentials, drafts or requests', (label, script, args) => {
    const directory = mkdtempSync(join(tmpdir(), 'aft-publisher-guard-'));
    try {
      mkdirSync(join(directory, '.local', 'devto.env'), { recursive: true });
      const preload = join(directory, 'deny-network.mjs');
      writeFileSync(preload, 'globalThis.fetch = () => { throw new Error("NETWORK_ATTEMPT"); };');
      const env = { ...process.env };
      delete env.DEVTO_API_KEY;
      const result = spawnSync(process.execPath, ['--import', pathToFileURL(preload).href, resolve('scripts', script), ...args], {
        cwd: directory, env, encoding: 'utf8', timeout: 10_000,
      });
      expect(result.error).toBeUndefined();
      expect(result.status).toBe(1);
      expect(`${result.stdout}${result.stderr}`).toContain(`Public actions are disabled for ${label}`);
      expect(`${result.stdout}${result.stderr}`).not.toMatch(/NETWORK_ATTEMPT|EISDIR|Set DEVTO_API_KEY|ENOENT/);
      expect(existsSync(join(directory, 'output', 'promotion', 'devto', 'drafts'))).toBe(false);
      expect(existsSync(join(directory, '.local', 'reddit-browser-profile'))).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
