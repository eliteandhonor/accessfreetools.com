import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import proxyaddr from 'proxy-addr';
import sourceMap from 'source-map-js';
import { parse as parseToml, TomlError } from 'smol-toml';
import { describe, expect, it } from 'vitest';

const { SourceMapConsumer, SourceMapGenerator, SourceNode } = sourceMap;
const root = fileURLToPath(new URL('../../', import.meta.url));

describe('proxy address subnet isolation', () => {
  const untrustedAddresses = ['203.0.113.9', '::ffff:203.0.113.9'];
  const rejectedSubnetCases = [
    ['short mapped prefix', '::ffff:10.0.0.0/8'],
    ['zero-leading IPv6 prefix', '::/1'],
  ].flatMap(([name, subnet]) => [
    ['single', [subnet]],
    ['multiple', [subnet, '192.0.2.0/24']],
  ].flatMap(([branch, ranges]) => untrustedAddresses.map(address => [name, branch, address, ranges])));

  it.each(rejectedSubnetCases)('isolates a %s (%s ranges) from %s', (_name, _branch, address, ranges) => {
    expect(proxyaddr.compile(ranges)(address)).toBe(false);
  });

  it.each([
    ['plain IPv4', '10.0.0.0/8'],
    ['correctly mapped IPv6', '::ffff:10.0.0.0/104'],
  ])('preserves %s trust for its own IPv4 block', (_name, subnet) => {
    for (const ranges of [[subnet], [subnet, '192.0.2.0/24']]) {
      const trust = proxyaddr.compile(ranges);
      expect(trust('10.1.2.3')).toBe(true);
      expect(trust('::ffff:10.1.2.3')).toBe(true);
      expect(trust('203.0.113.9')).toBe(false);
      expect(trust('2001:db8::1')).toBe(false);
      if (ranges.length > 1) expect(trust('192.0.2.9')).toBe(true);
    }
  });

  it('preserves native IPv6 trust without treating IPv4 as native IPv6', () => {
    const trust = proxyaddr.compile(['2001:db8::/32', '::/1']);
    expect(trust('2001:db8::1')).toBe(true);
    expect(trust('4000::1')).toBe(true);
    expect(trust('8000::1')).toBe(false);
    expect(trust('203.0.113.9')).toBe(false);
    expect(trust('::ffff:203.0.113.9')).toBe(false);
  });

  it('keeps an untrusted peer as the client despite an offered forwarded address', () => {
    const request = {
      socket: { remoteAddress: '203.0.113.9' },
      headers: { 'x-forwarded-for': '10.1.2.3' },
    };
    const trust = proxyaddr.compile(['::ffff:10.0.0.0/8']);
    expect(proxyaddr(request, trust)).toBe('203.0.113.9');
    expect(proxyaddr.all(request, trust)).toEqual(['203.0.113.9']);
  });
});

function sectionMap(source, code) {
  const map = new SourceMapGenerator();
  map.addMapping({
    generated: { line: 1, column: 0 },
    original: { line: 1, column: 0 },
    source,
  });
  map.setSourceContent(source, code);
  return map.toJSON();
}

describe('indexed source map input bounds', () => {
  it('stops adding fragments when an indexed offset exceeds the generated code', () => {
    // The offset and input are bounded. A child deadline also contains regressions.
    const child = spawnSync(process.execPath, ['--input-type=module', '--eval', `
      import sourceMap from 'source-map-js';
      const { SourceMapConsumer, SourceMapGenerator, SourceNode } = sourceMap;
      const code = 'const answer = 42;\\n';
      const generator = new SourceMapGenerator();
      generator.addMapping({ generated: { line: 1, column: 0 }, original: { line: 1, column: 0 }, source: 'fixture.js' });
      generator.setSourceContent('fixture.js', code);
      const consumer = new SourceMapConsumer({ version: 3, sections: [
        { offset: { line: 10000, column: 0 }, map: generator.toJSON() },
      ] });
      const originalAdd = SourceNode.prototype.add;
      let addCalls = 0;
      SourceNode.prototype.add = function (...args) {
        addCalls++;
        return originalAdd.apply(this, args);
      };
      let output;
      try {
        output = SourceNode.fromStringWithSourceMap(code, consumer).toString();
      } finally {
        SourceNode.prototype.add = originalAdd;
      }
      process.stdout.write(JSON.stringify({ addCalls, preservesCode: output === code, length: output.length }));
    `], {
      cwd: root,
      encoding: 'utf8',
      timeout: 3000,
      killSignal: 'SIGKILL',
      maxBuffer: 4096,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    expect(child.error).toBeUndefined();
    expect(child.signal).toBeNull();
    expect(child.status).toBe(0);
    const observed = JSON.parse(child.stdout);
    expect(observed.addCalls).toBeLessThanOrEqual(8);
    expect(observed.preservesCode).toBe(true);
    expect(observed.length).toBe('const answer = 42;\n'.length);
  });

  it('round-trips normal indexed mappings and their source contents', () => {
    const first = 'const first = 1;\n';
    const second = 'const second = 2;\n';
    const consumer = new SourceMapConsumer({ version: 3, sections: [
      { offset: { line: 0, column: 0 }, map: sectionMap('first.js', first) },
      { offset: { line: 1, column: 0 }, map: sectionMap('second.js', second) },
    ] });
    const node = SourceNode.fromStringWithSourceMap(first + second, consumer);
    const generated = node.toStringWithSourceMap({ file: 'generated.js' });
    expect(generated.code).toBe(first + second);

    const roundTrip = new SourceMapConsumer(generated.map.toJSON());
    expect(roundTrip.originalPositionFor({ line: 1, column: 0 })).toMatchObject({ source: 'first.js', line: 1, column: 0 });
    expect(roundTrip.originalPositionFor({ line: 2, column: 0 })).toMatchObject({ source: 'second.js', line: 1, column: 0 });
    expect(roundTrip.sourceContentFor('first.js')).toBe(first);
    expect(roundTrip.sourceContentFor('second.js')).toBe(second);
  });

  const invalidOffsetCases = [
    ['negative', -1],
    ['fraction', 0.5],
    ['NaN', NaN],
    ['infinite', Infinity],
    ['unsafe integer', Number.MAX_SAFE_INTEGER + 1],
    ['string', '1'],
    ['null', null],
  ].flatMap(([name, value]) => ['line', 'column'].map(field => [name, field, value]));

  it.each(invalidOffsetCases)('rejects a %s section %s before consuming generated code', (_name, field, value) => {
    const offset = { line: 0, column: 0, [field]: value };
    expect(() => new SourceMapConsumer({ version: 3, sections: [
      { offset, map: sectionMap('fixture.js', 'const answer = 42;\n') },
    ] })).toThrow(Error);
  });
});

describe('TOML parser compatibility', () => {
  it('parses a bounded flat document with dot-free keys', () => {
    const entries = Array.from({ length: 512 }, (_, index) => [`key${index}`, index]);
    const document = entries.map(([key, value]) => `${key} = ${value}`).join('\n');
    expect(parseToml(document)).toEqual(Object.fromEntries(entries));
  });

  it('preserves dotted and quoted keys, tables, and arrays', () => {
    expect(parseToml(`
      title = "Owned fixture"
      dotted.answer = 42
      "literal.dot" = "kept"
      'quoted key' = true
      items = [1, 2, 3]
      inline = { enabled = true, name = "fixture" }
      [settings]
      enabled = true
      [[records]]
      name = "first"
      [[records]]
      name = "second"
    `)).toEqual({
      title: 'Owned fixture',
      dotted: { answer: 42 },
      'literal.dot': 'kept',
      'quoted key': true,
      items: [1, 2, 3],
      inline: { enabled: true, name: 'fixture' },
      settings: { enabled: true },
      records: [{ name: 'first' }, { name: 'second' }],
    });
  });

  it.each([
    ['duplicate key', 'answer = 1\nanswer = 2'],
    ['unfinished array', 'items = [1, 2'],
    ['missing value', 'answer ='],
  ])('reports a located TOML error for a %s', (_name, document) => {
    let error;
    try { parseToml(document); } catch (caught) { error = caught; }
    expect(error).toBeInstanceOf(TomlError);
    expect(error.line).toBeGreaterThan(0);
    expect(error.column).toBeGreaterThan(0);
    expect(error.codeblock).toBeTypeOf('string');
    expect(error.message).toBeTruthy();
  });
});
