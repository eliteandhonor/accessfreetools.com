import { afterEach, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readPilotCodeIdentity } from './daily-editorial-code-admission.mjs';
import { privateStateGitEnvironment } from './private-state-git-environment.mjs';

const directories = [];
afterEach(() => { for (const path of directories.splice(0)) rmSync(path, { recursive: true, force: true }); });

function fixture() {
  const path = mkdtempSync(join(tmpdir(), 'aft-code-admission-'));
  directories.push(path);
  const root = join(path, 'checkout');
  const environment = privateStateGitEnvironment({ source: { PATH: '/usr/bin:/bin', LANG: 'C' } });
  const git = (args) => execFileSync('/usr/bin/git', ['-C', root, ...args], { env: environment, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  execFileSync('/usr/bin/git', ['init', '--template=', root], { env: environment, stdio: 'ignore' });
  writeFileSync(join(root, 'approved.txt'), 'Synthetic approved code fixture.\n');
  git(['add', 'approved.txt']);
  git(['-c', 'user.name=Offline fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'Synthetic reviewed code']);
  return { path, root, git, environment, commit: git(['rev-parse', 'HEAD']) };
}

describe('local pilot code admission isolation', () => {
  it('reads exact committed identity and detects dirty files', () => {
    const test = fixture();
    expect(readPilotCodeIdentity(test.root)).toEqual({ codeCommit: test.commit, clean: true });
    writeFileSync(join(test.root, 'approved.txt'), 'Changed synthetic code.\n');
    expect(readPilotCodeIdentity(test.root)).toEqual({ codeCommit: test.commit, clean: false });
    expect(() => readPilotCodeIdentity(join(test.root, 'missing'))).toThrow('could not be verified');
  });

  it.each(['global', 'local'])('does not execute a malicious %s fsmonitor while reading identity', (scope) => {
    const test = fixture();
    const marker = join(test.path, 'fsmonitor-marker');
    const hook = join(test.path, 'fsmonitor');
    writeFileSync(hook, `#!/bin/sh\nprintf 'unapproved-helper-invoked' > '${marker}'\nprintf 'token\\0'\n`, { mode: 0o700 });
    const source = { PATH: '/usr/bin:/bin' };
    if (scope === 'local') test.git(['config', 'core.fsmonitor', hook]);
    else {
      const config = join(test.path, 'global');
      execFileSync('/usr/bin/git', ['config', '--file', config, 'core.fsmonitor', hook], { env: test.environment });
      source.GIT_CONFIG_GLOBAL = config;
      source.GIT_CONFIG_SYSTEM = config;
    }
    expect(readPilotCodeIdentity(test.root, { source })).toEqual({ codeCommit: test.commit, clean: true });
    expect(existsSync(marker)).toBe(false);
  });

  it('ignores inherited filesystem/config/tracing redirects and PATH fake Git executables', () => {
    const test = fixture();
    const fakeBin = join(test.path, 'fake-bin');
    const marker = join(test.path, 'fake-git-marker');
    const trace = join(test.path, 'trace');
    mkdirSync(fakeBin);
    writeFileSync(join(fakeBin, 'git'), `#!/bin/sh\nprintf 'forged-git-invoked' > '${marker}'\nprintf '${'f'.repeat(40)}\\n'\n`, { mode: 0o700 });
    const source = { PATH: fakeBin, GIT_TRACE: trace, GIT_TRACE_CURL: trace, GIT_WORK_TREE: '/unapproved',
      GIT_DIR: '/unapproved', GIT_INDEX_FILE: '/unapproved/index', GIT_CONFIG_PARAMETERS: "'core.fsmonitor=unapproved-command'" };
    expect(readPilotCodeIdentity(test.root, { source })).toEqual({ codeCommit: test.commit, clean: true });
    expect(existsSync(marker)).toBe(false);
    expect(existsSync(trace)).toBe(false);
  });

  it('never reads secret properties when constructing any Git child environment', () => {
    const test = fixture();
    const source = { PATH: '/usr/bin:/bin', LANG: 'C', TZ: 'UTC' };
    for (const name of ['AFT_EDITORIAL_STATE_TOKEN', 'GITHUB_TOKEN', 'JINA_API_KEY', 'OLLAMA_API_KEY', 'TYPESAFE_API_KEY']) {
      Object.defineProperty(source, name, { enumerable: true, get() { throw new Error('Secret property must never be accessed.'); } });
    }
    expect(readPilotCodeIdentity(test.root, { source })).toEqual({ codeCommit: test.commit, clean: true });
  });

  it.each(['--assume-unchanged', '--skip-worktree'])('detects changed bytes hidden by %s index flags', (flag) => {
    const test = fixture();
    test.git(['update-index', flag, 'approved.txt']);
    writeFileSync(join(test.root, 'approved.txt'), 'Unapproved executable source fixture.\n');
    expect(test.git(['status', '--porcelain'])).toBe('');
    expect(readPilotCodeIdentity(test.root)).toEqual({ codeCommit: test.commit, clean: false });
  });

  it('rejects changed bytes normalized by a local clean filter', () => {
    const test = fixture();
    const filter = join(test.path, 'normalize-to-approved');
    writeFileSync(filter, "#!/bin/sh\n/bin/cat >/dev/null\nprintf 'Synthetic approved code fixture.\\n'\n", { mode: 0o700 });
    writeFileSync(join(test.root, '.gitattributes'), 'approved.txt filter=normalize-fixture\n');
    test.git(['config', 'filter.normalize-fixture.clean', filter]);
    test.git(['add', '.gitattributes']);
    test.git(['-c', 'user.name=Offline fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'Synthetic normalization fixture']);
    const codeCommit = test.git(['rev-parse', 'HEAD']);
    writeFileSync(join(test.root, 'approved.txt'), 'Changed bytes hidden by clean filter.\n');
    expect(test.git(['hash-object', '--path=approved.txt', 'approved.txt'])).toBe(test.git(['rev-parse', 'HEAD:approved.txt']));
    expect(readPilotCodeIdentity(test.root)).toEqual({ codeCommit, clean: false });
  });

  it('never executes a clean filter that could modify tracked bytes after admission', () => {
    const test = fixture();
    const marker = join(test.path, 'post-audit-filter');
    const filter = join(test.path, 'mutate-worktree');
    writeFileSync(filter, `#!/bin/sh\n/bin/cat >/dev/null\nprintf 'unapproved bytes after audit' > '${join(test.root, 'approved.txt')}'\nprintf 'executed' > '${marker}'\nprintf 'Synthetic approved code fixture.\\n'\n`, { mode: 0o700 });
    writeFileSync(join(test.root, '.gitattributes'), 'approved.txt filter=mutation-fixture\n');
    test.git(['add', '.gitattributes']);
    test.git(['-c', 'user.name=Offline fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'Synthetic malicious local filter']);
    test.git(['config', 'filter.mutation-fixture.clean', filter]);
    const codeCommit = test.git(['rev-parse', 'HEAD']);
    utimesSync(join(test.root, 'approved.txt'), new Date(), new Date(Date.now() + 10000));
    expect(readPilotCodeIdentity(test.root)).toEqual({ codeCommit, clean: true });
    expect(existsSync(marker)).toBe(false);
  });

  it('ignores replacement refs that otherwise substitute an unapproved tree under the approved HEAD', () => {
    const test = fixture();
    writeFileSync(join(test.root, 'approved.txt'), 'Unapproved replacement tree.\n');
    test.git(['add', 'approved.txt']);
    test.git(['-c', 'user.name=Offline fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'Synthetic unapproved replacement']);
    const replacement = test.git(['rev-parse', 'HEAD']);
    test.git(['replace', test.commit, replacement]);
    test.git(['reset', '--hard', test.commit]);
    expect(test.git(['rev-parse', 'HEAD'])).toBe(test.commit);
    expect(test.git(['status', '--porcelain'])).toBe('');
    expect(readPilotCodeIdentity(test.root)).toEqual({ codeCommit: test.commit, clean: false });
  });

  it('holds staged changes and untracked files despite matching tracked worktree bytes', () => {
    const test = fixture();
    writeFileSync(join(test.root, 'approved.txt'), 'Unapproved staged bytes.\n');
    test.git(['add', 'approved.txt']);
    writeFileSync(join(test.root, 'approved.txt'), 'Synthetic approved code fixture.\n');
    expect(readPilotCodeIdentity(test.root).clean).toBe(false);
    test.git(['reset', '--hard', 'HEAD']);
    writeFileSync(join(test.root, 'untracked.mjs'), 'Synthetic untracked code.\n');
    expect(readPilotCodeIdentity(test.root).clean).toBe(false);
  });
});
