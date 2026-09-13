import { EventEmitter } from 'node:events';
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const source = readFileSync(new URL('../run-playwright-smoke.mjs', import.meta.url), 'utf8');
const parsed = ts.createSourceFile('runner.mjs', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
// Replace module loading only; execute the unchanged runner statements with fake external I/O.
const body = parsed.statements.map((statement) => {
  if (!ts.isImportDeclaration(statement)) return statement.getFullText(parsed);
  const clause = statement.importClause;
  const module = `dependencies[${JSON.stringify(statement.moduleSpecifier.text)}]`;
  const declarations = [];
  if (clause.name) declarations.push(`const ${clause.name.text} = ${module};`);
  if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
    const names = clause.namedBindings.elements.map((item) =>
      `${item.propertyName?.text ?? item.name.text}: ${item.name.text}`);
    declarations.push(`const { ${names.join(', ')} } = ${module};`);
  }
  return declarations.join('\n');
}).join('\n');

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function fixture(options = {}) {
  const previewClosed = deferred();
  const previewStarting = deferred();
  const pendingStop = deferred();
  const children = [];
  const kills = [];
  const exits = [];
  const logs = [];
  const process = Object.assign(new EventEmitter(), {
    env: { PLAYWRIGHT_PORT: options.port ?? '4469', HOST: '0.0.0.0' },
    platform: options.platform ?? 'win32',
    execPath: 'fixture-node',
    cwd: () => '/fixture',
    stdout: { write: (text) => logs.push(String(text)) },
    stderr: { write: (text) => logs.push(String(text)) },
    exit(code) { exits.push(code); this.emit('exit', code); },
    kill(pid, signal) {
      kills.push({ pid, signal });
      if (options.killFails) throw new Error('fixture kill failed');
      queueMicrotask(() => finish(pw, null, signal));
    },
  });
  function child(pid) {
    return Object.assign(new EventEmitter(), {
      pid, exitCode: null, signalCode: null,
      stdout: new EventEmitter(), stderr: new EventEmitter(),
      kill: vi.fn(() => { queueMicrotask(() => finish(pw, null, 'SIGTERM')); }),
    });
  }
  const pw = child(52);
  const launcher = child(41);
  function finish(target, code = 0, signal = null) {
    target.exitCode = code;
    target.signalCode = signal;
    target.emit('exit', code, signal);
    target.emit('close', code, signal);
  }
  const spawn = vi.fn((command, args, config) => {
    if (options.spawnThrows) throw new Error('fixture spawn failed');
    children.push({ command, args, config });
    return args[0] === 'node_modules/@playwright/test/cli.js' ? pw : launcher;
  });
  const spawnSync = vi.fn((command, args, config) => {
    kills.push({ command, args, config });
    if (options.killFails) return { status: 1, stderr: 'fixture kill failed' };
    const target = args.includes('52') ? pw : launcher;
    if (!options.killDoesNotClose) queueMicrotask(() => finish(target, null, 'SIGTERM'));
    return { status: 0 };
  });
  const server = {
    host: options.previewHost ?? '127.0.0.1', port: options.previewPort ?? 4469,
    closed: () => previewClosed.promise,
    stop: vi.fn(async () => {
      if (options.stopFails) throw new Error('fixture stop failed');
      if (options.stopHangs) await pendingStop.promise;
      previewClosed.resolve();
    }),
  };
  const preview = vi.fn(async () => {
    if (options.startFails) throw new Error('fixture startup failed');
    if (options.startPending) await previewStarting.promise;
    return server;
  });
  const reservation = Object.assign(new EventEmitter(), {
    listen: vi.fn(function () {
      queueMicrotask(() => options.occupied
        ? this.emit('error', Object.assign(new Error('address occupied'), { code: 'EADDRINUSE' }))
        : this.emit('listening'));
      return this;
    }),
    close: vi.fn(function (callback) { queueMicrotask(() => callback?.()); }),
  });
  const http = { get: vi.fn((url, callback) => {
    queueMicrotask(() => callback({ statusCode: 200, resume() {} }));
    return Object.assign(new EventEmitter(), { destroy() {} });
  }) };
  const dependencies = {
    'node:child_process': { spawn, spawnSync },
    'node:http': http,
    'node:net': { createServer: () => reservation },
    astro: { preview },
  };
  const execution = vm.runInNewContext(`(async () => { ${body}\n })()`, {
    dependencies, process, console: { log: (text) => logs.push(text), error: (text) => logs.push(String(text)) },
    setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, URL, Buffer,
  });
  execution.catch((error) => logs.push(`UNCAUGHT: ${error.message}`));
  const flush = async () => {
    for (let index = 0; index < 30; index++) await Promise.resolve();
    await vi.advanceTimersByTimeAsync(0);
  };
  return { process, pw, server, preview, reservation, children, kills, exits, logs, flush,
    finish: (code, signal) => finish(pw, code, signal),
    ready: () => previewStarting.resolve(), closed: () => previewClosed.resolve(),
    finishStop: () => pendingStop.resolve() };
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

describe('owned Playwright smoke lifecycle', () => {
  it('owns the public Astro preview and propagates the actual Playwright exit', async () => {
    const f = fixture();
    await f.flush();
    f.finish(7);
    await f.flush();
    expect(f.preview).toHaveBeenCalledWith(expect.objectContaining({ server: expect.objectContaining({ host: '127.0.0.1', port: 4469 }) }));
    expect(f.children).toHaveLength(1);
    expect(f.children[0].args).toEqual(['node_modules/@playwright/test/cli.js', 'test']);
    expect(f.children[0].config.env.HOST).toBe('127.0.0.1');
    expect(f.server.stop).toHaveBeenCalledOnce();
    expect(f.exits).toEqual([7]);
  });

  it('does not exit from passed-looking output before a later failing close', async () => {
    const f = fixture();
    await f.flush();
    f.pw.stdout.emit('data', Buffer.from('132 passed (30.5s)\n'));
    await vi.advanceTimersByTimeAsync(6000);
    expect(f.exits).toEqual([]);
    f.finish(3);
    await f.flush();
    expect(f.exits).toEqual([3]);
  });

  it('rejects an occupied port without starting or stopping another listener', async () => {
    const f = fixture({ occupied: true });
    await f.flush();
    expect(f.preview).not.toHaveBeenCalled();
    expect(f.children).toEqual([]);
    expect(f.kills).toEqual([]);
    expect(f.server.stop).not.toHaveBeenCalled();
    expect(f.exits).toEqual([1]);
  });

  it.each(['SIGINT', 'SIGTERM'])('closes only the owned Playwright tree and preview on %s', async (signal) => {
    const f = fixture();
    await f.flush();
    f.process.emit(signal);
    await f.flush();
    expect(f.kills).toHaveLength(1);
    expect(f.kills[0]).toMatchObject({ command: 'taskkill', args: ['/PID', '52', '/T', '/F'] });
    expect(f.kills[0].config.timeout).toBeGreaterThan(0);
    expect(f.server.stop).toHaveBeenCalledOnce();
    expect(f.exits).toEqual([signal === 'SIGINT' ? 130 : 143]);
  });

  it('fails and closes owned resources after output inactivity', async () => {
    const f = fixture();
    await f.flush();
    await vi.advanceTimersByTimeAsync(310_001);
    expect(f.kills).toContainEqual(expect.objectContaining({ args: ['/PID', '52', '/T', '/F'] }));
    expect(f.server.stop).toHaveBeenCalledOnce();
    expect(f.exits).toEqual([1]);
  });

  it('handles a preview startup rejection without spawning Playwright', async () => {
    const f = fixture({ startFails: true });
    await f.flush();
    expect(f.children).toEqual([]);
    expect(f.exits).toEqual([1]);
  });

  it('stops a late preview after interruption during startup', async () => {
    const f = fixture({ startPending: true });
    await f.flush();
    f.process.emit('SIGTERM');
    await f.flush();
    f.ready();
    await f.flush();
    expect(f.children).toEqual([]);
    expect(f.server.stop).toHaveBeenCalledOnce();
    expect(f.exits).toEqual([143]);
  });

  it('bounds a preview startup that never settles', async () => {
    const f = fixture({ startPending: true });
    await f.flush();
    await vi.advanceTimersByTimeAsync(150_000);
    expect(f.children).toEqual([]);
    expect(f.exits).toEqual([1]);
  });

  it.each([{ stopFails: true }, { stopHangs: true }])('makes preview cleanup failure nonzero: %j', async (options) => {
    const f = fixture(options);
    await f.flush();
    f.finish(0);
    await vi.advanceTimersByTimeAsync(30_000);
    expect(f.exits).toEqual([1]);
    expect(f.logs.join('\n')).toMatch(/cleanup/i);
  });

  it('still stops preview if owned child-tree termination fails', async () => {
    const f = fixture({ killFails: true });
    await f.flush();
    f.process.emit('SIGTERM');
    await vi.advanceTimersByTimeAsync(30_000);
    expect(f.server.stop).toHaveBeenCalledOnce();
    expect(f.exits).toEqual([1]);
  });

  it('does not run tests against an unexpected preview port', async () => {
    const f = fixture({ previewPort: 4470 });
    await f.flush();
    expect(f.children).toEqual([]);
    expect(f.server.stop).toHaveBeenCalledOnce();
    expect(f.exits).toEqual([1]);
  });

  it('returns nonzero if interrupted while a successful run is stopping preview', async () => {
    const f = fixture({ stopHangs: true });
    await f.flush();
    f.finish(0);
    await f.flush();
    f.process.emit('SIGTERM');
    f.finishStop();
    await f.flush();
    expect(f.server.stop).toHaveBeenCalledOnce();
    expect(f.exits).toEqual([143]);
  });

  it('uses only its newly detached process group on POSIX interruption', async () => {
    const f = fixture({ platform: 'linux' });
    await f.flush();
    f.process.emit('SIGINT');
    await f.flush();
    expect(f.children[0].config.detached).toBe(true);
    expect(f.kills).toEqual([{ pid: -52, signal: 'SIGKILL' }]);
    expect(f.server.stop).toHaveBeenCalledOnce();
    expect(f.exits).toEqual([130]);
  });

  it('closes preview after a synchronous Playwright spawn failure', async () => {
    const f = fixture({ spawnThrows: true });
    await f.flush();
    expect(f.server.stop).toHaveBeenCalledOnce();
    expect(f.exits).toEqual([1]);
  });

  it('handles an asynchronous Playwright spawn error without an owned PID', async () => {
    const f = fixture();
    await f.flush();
    f.pw.pid = undefined;
    f.pw.emit('error', new Error('fixture ENOENT'));
    await f.flush();
    expect(f.kills).toEqual([]);
    expect(f.server.stop).toHaveBeenCalledOnce();
    expect(f.exits).toEqual([1]);
  });

  it('fails boundedly when taskkill reports success but the child never closes', async () => {
    const f = fixture({ killDoesNotClose: true });
    await f.flush();
    f.process.emit('SIGTERM');
    await vi.advanceTimersByTimeAsync(30_000);
    expect(f.server.stop).toHaveBeenCalledOnce();
    expect(f.exits).toEqual([1]);
    expect(f.logs.join('\n')).toContain('Playwright close timed out');
  });

  it('fails and cleans Playwright when preview closes unexpectedly', async () => {
    const f = fixture();
    await f.flush();
    f.closed();
    await f.flush();
    expect(f.kills).toHaveLength(1);
    expect(f.server.stop).not.toHaveBeenCalled();
    expect(f.exits).toEqual([1]);
  });

  it.each(['0', '-1', '65536', 'NaN'])('rejects invalid port %s before any external startup', async (port) => {
    const f = fixture({ port });
    await f.flush();
    expect(f.preview).not.toHaveBeenCalled();
    expect(f.children).toEqual([]);
    expect(f.exits).toEqual([1]);
  });

  it('allows normal completion and restores the runner environment and signal handlers', async () => {
    const f = fixture();
    await f.flush();
    f.finish(0);
    await f.flush();
    expect(f.exits).toEqual([0]);
    expect(f.kills).toEqual([]);
    expect(f.process.env.HOST).toBe('0.0.0.0');
    expect(f.process.env.ASTRO_TELEMETRY_DISABLED).toBeUndefined();
    expect(f.process.listenerCount('SIGINT')).toBe(0);
    expect(f.process.listenerCount('SIGTERM')).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });
});

it.each([0, 7])('releases a real tiny Astro preview after actual child exit %i', async (code) => {
  vi.useRealTimers();
  const root = await mkdtemp(join(tmpdir(), 'aft-smoke-ownership-'));
  if (!resolve(root).startsWith(`${resolve(tmpdir())}${sep}aft-smoke-ownership-`)) {
    throw new Error('Unexpected fixture directory; refusing recursive cleanup.');
  }
  const admission = createServer();
  let runner;
  let closed;
  let timer;
  let output = '';
  try {
    await new Promise((yes, no) => {
      admission.once('error', no);
      admission.listen({ host: '127.0.0.1', port: 0 }, yes);
    });
    const port = admission.address().port;
    await new Promise((yes, no) => admission.close((error) => error ? no(error) : yes()));
    for (const directory of ['dist', 'src/pages', 'node_modules/astro', 'node_modules/@playwright/test']) {
      await mkdir(join(root, directory), { recursive: true });
    }
    await writeFile(join(root, 'package.json'), JSON.stringify({ type: 'module' }));
    await writeFile(join(root, 'astro.config.mjs'), "export default { output: 'static', telemetry: false };\n");
    await writeFile(join(root, 'dist/index.html'), '<!doctype html><title>owned-preview-fixture</title>');
    await writeFile(join(root, 'runner.mjs'), source);
    await writeFile(join(root, 'node_modules/astro/package.json'), JSON.stringify({ type: 'module', exports: './index.mjs' }));
    await writeFile(join(root, 'node_modules/astro/index.mjs'), `export { preview } from ${JSON.stringify(import.meta.resolve('astro'))};\n`);
    await writeFile(join(root, 'node_modules/@playwright/test/cli.js'), `
      const response = await fetch('http://127.0.0.1:' + process.env.PLAYWRIGHT_PORT);
      if (!response.ok || !(await response.text()).includes('owned-preview-fixture')) process.exit(9);
      console.log('132 passed (fixture only, no browser)');
      setTimeout(() => process.exit(${code}), 50);
    `);
    runner = spawn(process.execPath, ['runner.mjs'], {
      cwd: root, env: { ...process.env, PLAYWRIGHT_PORT: String(port), ASTRO_TELEMETRY_DISABLED: '1' },
      stdio: ['ignore', 'pipe', 'pipe'], shell: false, windowsHide: true,
      detached: process.platform !== 'win32',
    });
    closed = new Promise((yes, no) => {
      runner.once('error', no);
      runner.once('close', (exitCode) => yes(exitCode));
    });
    for (const stream of [runner.stdout, runner.stderr]) stream.on('data', (chunk) => { output += chunk; });
    const exitCode = await Promise.race([closed, new Promise((_, no) => {
      timer = setTimeout(() => no(new Error(`Tiny preview timed out: ${output}`)), 20_000);
    })]);
    expect(exitCode, output).toBe(code);
    expect(output).toContain('132 passed (fixture only, no browser)');
    expect(output).toContain('Smoke cleanup: owned preview stopped.');
    await new Promise((yes, no) => {
      admission.once('error', no);
      admission.listen({ host: '127.0.0.1', port, exclusive: true }, yes);
    });
  } finally {
    clearTimeout(timer);
    if (runner?.pid && runner.exitCode === null && runner.signalCode === null) {
      if (process.platform === 'win32') {
        const result = spawnSync('taskkill', ['/PID', String(runner.pid), '/T', '/F'], { timeout: 10_000, windowsHide: true, stdio: 'pipe' });
        if (result.error || result.status !== 0) throw new Error('Could not terminate owned fixture tree.');
      } else {
        process.kill(-runner.pid, 'SIGKILL');
      }
      try {
        await Promise.race([closed, new Promise((_, no) => {
          timer = setTimeout(() => no(new Error('Owned fixture did not close.')), 10_000);
        })]);
      } finally { clearTimeout(timer); }
    }
    if (admission.listening) await new Promise((yes, no) => admission.close((error) => error ? no(error) : yes()));
    await rm(root, { recursive: true, force: true });
  }
}, 35_000);
