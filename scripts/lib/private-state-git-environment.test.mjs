import { afterEach, describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { beginDay, createGitStateStore } from './daily-editorial-state.mjs';
import { PRIVATE_STATE_GIT_ARGUMENTS, privateStateGitEnvironment } from './private-state-git-environment.mjs';

const run = promisify(execFile);
const directories = [];
afterEach(async () => { for (const path of directories.splice(0)) await rm(path, { recursive: true, force: true }); });

async function fixture() {
  const path = await mkdtemp(join(tmpdir(), 'aft-git-isolation-'));
  directories.push(path);
  const root = join(path, 'checkout');
  const remote = join(path, 'approved.git');
  const alternate = join(path, 'unapproved.git');
  const safe = privateStateGitEnvironment({ localFixture: true });
  for (const target of [remote, alternate]) await run('git', ['init', '--bare', '--template=', target], { env: safe });
  await run('git', ['init', '--template=', root], { env: safe });
  await run('git', ['-C', root, 'remote', 'add', 'origin', remote], { env: safe });
  return { path, root, remote, alternate, safe };
}

describe('isolated private Git configuration', () => {
  it('drops inherited configuration, redirects, tracing, SSH and credential helper overrides', () => {
    const environment = privateStateGitEnvironment({ source: {
      PATH: '/fixture/bin', GIT_CONFIG_GLOBAL: '/malicious/config', GIT_CONFIG_SYSTEM: '/malicious/system',
      GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'url.file:///public.git.insteadOf', GIT_CONFIG_VALUE_0: 'https://github.com/',
      GIT_CONFIG_PARAMETERS: "'http.followRedirects=true'", GIT_ALLOW_PROTOCOL: 'file:ext:ssh',
      GIT_TRACE: '/public/raw-log', GIT_TRACE_CURL: '/public/headers', GIT_SSH_COMMAND: 'untrusted-command',
      GIT_TEMPLATE_DIR: '/malicious/templates', SSH_ASKPASS: 'untrusted-command', GCM_INTERACTIVE: 'Always',
    } });
    expect(environment).toMatchObject({ PATH: '/fixture/bin', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null',
      GIT_CONFIG_SYSTEM: '/dev/null', GIT_CONFIG_COUNT: '0', GIT_ALLOW_PROTOCOL: 'https', GIT_TERMINAL_PROMPT: '0' });
    for (const name of ['GIT_CONFIG_KEY_0', 'GIT_CONFIG_VALUE_0', 'GIT_CONFIG_PARAMETERS', 'GIT_TRACE', 'GIT_TRACE_CURL', 'GIT_SSH_COMMAND', 'GIT_TEMPLATE_DIR', 'SSH_ASKPASS']) {
      expect(environment[name]).toBeUndefined();
    }
    expect(PRIVATE_STATE_GIT_ARGUMENTS).toContain('http.followRedirects=false');
    expect(PRIVATE_STATE_GIT_ARGUMENTS).toContain('core.hooksPath=/dev/null');
  });

  it('restores only the exact private URL runtime header and rejects arbitrary ephemeral overrides', () => {
    const tokenConfiguration = { GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'http.https://github.com/owner/private-state.git.extraheader',
      GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${Buffer.from('x-access-token:offline-fixture').toString('base64')}` };
    expect(privateStateGitEnvironment({ source: { GIT_CONFIG_VALUE_0: 'inherited' }, tokenConfiguration })).toMatchObject(tokenConfiguration);
    expect(() => privateStateGitEnvironment({ tokenConfiguration: { ...tokenConfiguration, GIT_CONFIG_KEY_0: 'url.file:///public.git.insteadOf' } })).toThrow('explicitly scoped');
    expect(() => privateStateGitEnvironment({ tokenConfiguration: { ...tokenConfiguration, GIT_TRACE: '/public/log' } })).toThrow('explicitly scoped');
  });

  it.each(['insteadOf', 'pushInsteadOf'])('ignores malicious global/system url.%s during durable writes', async (rewrite) => {
    const test = await fixture();
    const globalConfig = join(test.path, 'malicious-global');
    const systemConfig = join(test.path, 'malicious-system');
    const malicious = `[url "${test.alternate}"]\n\t${rewrite} = ${test.remote}\n[http]\n\tfollowRedirects = true\n[protocol "file"]\n\tallow = always\n`;
    await writeFile(globalConfig, malicious);
    await writeFile(systemConfig, malicious);
    const previous = { GIT_CONFIG_GLOBAL: process.env.GIT_CONFIG_GLOBAL, GIT_CONFIG_SYSTEM: process.env.GIT_CONFIG_SYSTEM };
    process.env.GIT_CONFIG_GLOBAL = globalConfig;
    process.env.GIT_CONFIG_SYSTEM = systemConfig;
    try {
      const store = await createGitStateStore({ root: test.root, fixtureRemote: test.remote });
      const state = await store.load();
      beginDay(state, '2026-10-08').article = { body: 'private-raw-draft-sentinel-must-stay-approved' };
      const receipt = await store.checkpoint(state);
      const approved = await run('git', ['--git-dir', test.remote, 'show', `${receipt.commit}:state.json`], { env: test.safe });
      expect(approved.stdout).toContain('private-raw-draft-sentinel-must-stay-approved');
      const alternate = await run('git', ['--git-dir', test.alternate, 'show-ref'], { env: test.safe }).catch((error) => error);
      expect(alternate.code).toBe(1);
      expect((await run('git', ['--git-dir', test.alternate, 'count-objects', '-v'], { env: test.safe })).stdout).toContain('count: 0');
      expect(await readFile(join(test.root, '.git', 'config'), 'utf8')).not.toContain('insteadOf');
    } finally {
      for (const [name, value] of Object.entries(previous)) { if (value === undefined) delete process.env[name]; else process.env[name] = value; }
    }
  });

  it('rejects file transport in production even when inherited protocol/config settings allow it', async () => {
    const test = await fixture();
    const environment = privateStateGitEnvironment({ source: { ...test.safe, GIT_ALLOW_PROTOCOL: 'file', GIT_CONFIG_PARAMETERS: "'protocol.file.allow=always'" } });
    await expect(run('git', [...PRIVATE_STATE_GIT_ARGUMENTS, 'ls-remote', test.remote], { env: environment })).rejects.toMatchObject({ stderr: expect.stringContaining("transport 'file' not allowed") });
    expect((await run('git', ['--git-dir', test.alternate, 'count-objects', '-v'], { env: test.safe })).stdout).toContain('count: 0');
  });
});
