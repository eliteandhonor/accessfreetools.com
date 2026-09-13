import { describe, expect, it } from 'vitest';
import {
  convertJsonToCsv,
  getUtf8ByteLength,
  type JsonToCsvOptions,
} from './jsonToCsv';

const defaultOptions: JsonToCsvOptions = {
  delimiter: ',',
  escapeSpreadsheetFormulas: true,
  includeBom: false,
};

describe('JSON to CSV conversion', () => {
  it('converts one object into a header and one row', () => {
    const result = convertJsonToCsv(
      '{"name":"Ada","active":true,"score":42}',
      defaultOptions,
    );

    expect(result.sourceType).toBe('object');
    expect(result.headers).toEqual(['name', 'active', 'score']);
    expect(result.cells).toEqual([['Ada', 'true', '42']]);
    expect(result.csv).toBe('name,active,score\r\nAda,true,42');
  });

  it('flattens nested objects and serializes arrays as JSON cells', () => {
    const result = convertJsonToCsv(
      '[{"id":1,"profile":{"city":"Brisbane"},"tags":["free","tools"]}]',
      defaultOptions,
    );

    expect(result.headers).toEqual(['id', 'profile.city', 'tags']);
    expect(result.cells).toEqual([
      ['1', 'Brisbane', '["free","tools"]'],
    ]);
    expect(result.csv).toContain('"[""free"",""tools""]"');
  });

  it('preserves first-seen header order across irregular rows', () => {
    const result = convertJsonToCsv(
      '[{"name":"Ada","team":"Data"},{"team":"Platform","country":"US"}]',
      defaultOptions,
    );

    expect(result.headers).toEqual(['name', 'team', 'country']);
    expect(result.cells[1]).toEqual(['', 'Platform', 'US']);
  });

  it('quotes delimiters, quotes, and newlines using CSV rules', () => {
    const result = convertJsonToCsv(
      '{"note":"one, two","quote":"She said \\"yes\\"","lines":"a\\nb"}',
      defaultOptions,
    );

    expect(result.csv).toBe(
      'note,quote,lines\r\n"one, two","She said ""yes""","a\nb"',
    );
  });

  it('supports semicolon and tab delimiters', () => {
    const semicolon = convertJsonToCsv('{"a":"x;y","b":2}', {
      ...defaultOptions,
      delimiter: ';',
    });
    const tab = convertJsonToCsv('{"a":"x\\ty","b":2}', {
      ...defaultOptions,
      delimiter: '\t',
    });

    expect(semicolon.csv).toBe('a;b\r\n"x;y";2');
    expect(tab.csv).toBe('a\tb\r\n"x\ty"\t2');
  });

  it('escapes spreadsheet formula starters by default', () => {
    const result = convertJsonToCsv(
      '{"formula":"=2+2","plus":"+1","minus":"-10","at":" @cmd","newline":"\\n=cmd","safe":"text"}',
      defaultOptions,
    );

    expect(result.cells[0]).toEqual([
      "'=2+2",
      "'+1",
      "'-10",
      "' @cmd",
      "'\n=cmd",
      'text',
    ]);
    expect(result.escapedFormulaCells).toBe(5);
  });

  it('can leave formula-like cells unchanged when explicitly disabled', () => {
    const result = convertJsonToCsv('{"formula":"=2+2"}', {
      ...defaultOptions,
      escapeSpreadsheetFormulas: false,
    });

    expect(result.cells[0]).toEqual(['=2+2']);
    expect(result.escapedFormulaCells).toBe(0);
  });

  it('adds an optional UTF-8 byte-order mark', () => {
    const result = convertJsonToCsv('{"city":"München"}', {
      ...defaultOptions,
      includeBom: true,
    });

    expect(result.csv.charCodeAt(0)).toBe(0xfeff);
    expect(result.csv.slice(1)).toBe('city\r\nMünchen');
  });

  it.each([
    ['malformed JSON', '{"name":}', 'JSON could not be parsed'],
    ['primitive root', '"hello"', 'top-level JSON value'],
    ['empty array', '[]', 'JSON array is empty'],
    ['mixed array', '[{"name":"Ada"}, 2]', 'Array item 2 is not an object'],
    ['empty object', '{}', 'no fields to convert'],
  ])('rejects %s with an actionable error', (_label, input, message) => {
    expect(() => convertJsonToCsv(input, defaultOptions)).toThrow(message);
  });

  it('rejects ambiguous dot-notation columns', () => {
    expect(() =>
      convertJsonToCsv('{"profile":{"city":"Brisbane"},"profile.city":"Perth"}', defaultOptions),
    ).toThrow('flatten to the same column');
  });

  it('enforces a UTF-8 byte limit', () => {
    expect(getUtf8ByteLength('München')).toBe(8);
    expect(() =>
      convertJsonToCsv('{"city":"München"}', {
        ...defaultOptions,
        maxInputBytes: 8,
      }),
    ).toThrow('browser limit');
  });

  it('rejects a sparse column explosion before creating a dense table', () => {
    const input = JSON.stringify(Array.from({ length: 500 }, (_, i) => ({ [`key${i}`]: i })));
    expect(getUtf8ByteLength(input)).toBeLessThan(10_000);
    expect(() => convertJsonToCsv(input, defaultOptions)).toThrow('256 columns');
  });

  it('bounds the dense cell count including the header row', () => {
    const first = Object.fromEntries(Array.from({ length: 250 }, (_, i) => [`k${i}`, i]));
    const input = JSON.stringify([first, ...Array.from({ length: 1_000 }, () => ({}))]);
    expect(() => convertJsonToCsv(input, defaultOptions)).toThrow('250,000 cells');
    const allowed = convertJsonToCsv(JSON.stringify([first, ...Array.from({ length: 998 }, () => ({}))]), defaultOptions);
    expect(allowed.rowCount).toBe(999);
    expect(allowed.columnCount).toBe(250);
  });

  it('bounds rows even when they do not contain fields', () => {
    const input = JSON.stringify(Array.from({ length: 50_001 }, () => ({})));
    expect(() => convertJsonToCsv(input, defaultOptions)).toThrow('50,000 rows');
  });

  it.each(['object', 'array'])('bounds nesting inside a %s before flattening or serialization', (shape) => {
    let value: unknown = 'end';
    for (let i = 0; i < 40; i += 1) value = shape === 'object' ? { next: value } : [value];
    expect(() => convertJsonToCsv(JSON.stringify({ value }), defaultOptions)).toThrow('32 levels');
  });

  it('bounds repeated dot-notation header bytes before building output', () => {
    const leaves = Object.fromEntries(Array.from({ length: 200 }, (_, i) => [`key${i}`, i]));
    const input = JSON.stringify({ ['p'.repeat(90_000)]: leaves });
    expect(getUtf8ByteLength(input)).toBeLessThan(100_000);
    expect(() => convertJsonToCsv(input, defaultOptions)).toThrow('16 MB output limit');
  });
});
