import { describe, expect, it } from 'vitest';

import { markdownTableWorkedExamples } from '../data/markdownTableContentRepairs';
import { generateMarkdownTable, type MarkdownTableAlignment } from './calculator';

describe('Markdown table generation', () => {
  it.each(markdownTableWorkedExamples)('produces the documented $label output', (example) => {
    expect(generateMarkdownTable(example.headers, example.rows, example.alignment).output).toBe(example.output);
  });

  it('preserves the existing comma-separated tool preset', () => {
    expect(generateMarkdownTable(
      'Tool, Use, Status',
      'UTM Builder, Campaign links, Live\nJSON Formatter, Read data, Live',
      'left',
    )).toEqual({
      output: '| Tool | Use | Status |\n| --- | --- | --- |\n| UTM Builder | Campaign links | Live |\n| JSON Formatter | Read data | Live |',
      columnCount: 3, rowCount: 2, alignment: 'left',
    });
  });

  it('preserves the existing pipe-separated center preset', () => {
    expect(generateMarkdownTable(
      'Feature | Free | Notes',
      'Private browser use | Yes | Runs locally\nCopy output | Yes | Check before sharing',
      'center',
    ).output).toBe('| Feature | Free | Notes |\n| :---: | :---: | :---: |\n| Private browser use | Yes | Runs locally |\n| Copy output | Yes | Check before sharing |');
  });

  it('preserves the existing right-aligned report preset', () => {
    expect(generateMarkdownTable('Metric, Value', 'Tools, 5\nGuides, 5', 'right').output)
      .toBe('| Metric | Value |\n| ---: | ---: |\n| Tools | 5 |\n| Guides | 5 |');
  });

  it('chooses comma separators from headers even when a body cell contains pipes', () => {
    expect(generateMarkdownTable('Name, Note', 'Alice, A | B', 'left').output)
      .toBe('| Name | Note |\n| --- | --- |\n| Alice | A \\| B |');
  });

  it('chooses pipe separators from headers even when a body cell contains commas', () => {
    expect(generateMarkdownTable('Name | Role', 'Doe, Jane | Engineer', 'left').output)
      .toBe('| Name | Role |\n| --- | --- |\n| Doe, Jane | Engineer |');
  });

  it('parses quoted CSV commas and doubled quotes without dropping cells', () => {
    expect(generateMarkdownTable('Name, Note', '"Doe, Jane","Says ""hello"""', 'left').output)
      .toBe('| Name | Note |\n| --- | --- |\n| Doe, Jane | Says "hello" |');
  });

  it('ignores a pipe inside a quoted header when choosing comma separators', () => {
    expect(generateMarkdownTable('"Name | Label", Note', 'Alice, ready', 'left').output)
      .toBe('| Name \\| Label | Note |\n| --- | --- |\n| Alice | ready |');
  });

  it('supports spaces around quoted comma cells', () => {
    expect(generateMarkdownTable('Name, Role', '  "Doe, Jane" , "Engineer"  ', 'left').output)
      .toBe('| Name | Role |\n| --- | --- |\n| Doe, Jane | Engineer |');
  });

  it('preserves escaped literal pipes in pipe cells and quoted CSV cells', () => {
    const expected = '| Name | Note |\n| --- | --- |\n| Alice | A \\| B |';
    expect(generateMarkdownTable('Name | Note', 'Alice | A \\| B', 'left').output).toBe(expected);
    expect(generateMarkdownTable('Name, Note', 'Alice,"A \\| B"', 'left').output).toBe(expected);
  });

  it('adds one pipe escape after an even run of backslashes in comma cells', () => {
    const slashes = '\\'.repeat(2);
    expect(generateMarkdownTable('Name, Note', `Alice, ${slashes}|`, 'left').output)
      .toBe(`| Name | Note |\n| --- | --- |\n| Alice | ${slashes}\\| |`);
  });

  it('preserves odd backslash runs before literal pipes without adding escapes', () => {
    const slashes = '\\'.repeat(3);
    const expected = `| Name | Note |\n| --- | --- |\n| Alice | C:\\path ${slashes}| ready |`;
    expect(generateMarkdownTable('Name | Note', `Alice | C:\\path ${slashes}| ready`, 'left').output).toBe(expected);
    expect(generateMarkdownTable('Name, Note', `Alice, C:\\path ${slashes}| ready`, 'left').output).toBe(expected);
  });

  it('keeps a pipe after an even backslash run as a pipe separator', () => {
    const slashes = '\\'.repeat(2);
    expect(generateMarkdownTable('Name | Note', `Alice ${slashes}| ready`, 'left').output)
      .toBe(`| Name | Note |\n| --- | --- |\n| Alice ${slashes} | ready |`);
  });

  it('protects pipes in paired inline code and escapes them for GFM output', () => {
    expect(generateMarkdownTable('Command | Purpose', '`a | b` | Pipe example', 'left').output)
      .toBe('| Command | Purpose |\n| --- | --- |\n| `a \\| b` | Pipe example |');
    expect(generateMarkdownTable('Command | Purpose', '`a \\| b` | Pipe example', 'left').output)
      .toBe('| Command | Purpose |\n| --- | --- |\n| `a \\| b` | Pipe example |');
  });

  it('supports code spans with multiple backticks and a literal backtick inside', () => {
    expect(generateMarkdownTable('Command | Purpose', '``a` | b`` | Example', 'left').output)
      .toBe('| Command | Purpose |\n| --- | --- |\n| ``a` \\| b`` | Example |');
  });

  it('does not hide extra cells behind an unmatched backtick', () => {
    expect(() => generateMarkdownTable('Name | Note', '`Alice | ready | extra', 'left'))
      .toThrow('Row 1 has 3 cells but the headers define 2 columns');
    expect(() => generateMarkdownTable('Name | Note', '``Alice | ready` | extra', 'left'))
      .toThrow('Row 1 has 3 cells but the headers define 2 columns');
  });

  it('ignores a pipe inside matched header code when choosing comma separators', () => {
    expect(generateMarkdownTable('`A | B`, Note', 'choice, ready', 'left').output)
      .toBe('| `A \\| B` | Note |\n| --- | --- |\n| choice | ready |');
  });

  it('does not treat an escaped header pipe as the table separator', () => {
    expect(generateMarkdownTable('A \\| B, Note', 'choice, ready', 'left').output)
      .toBe('| A \\| B | Note |\n| --- | --- |\n| choice | ready |');
  });

  it('accepts paired outer pipes without shifting or losing cells', () => {
    expect(generateMarkdownTable('| Name | Note |', '| Alice | ready |\nBob | done', 'left').output)
      .toBe('| Name | Note |\n| --- | --- |\n| Alice | ready |\n| Bob | done |');
  });

  it('preserves empty leading, middle and trailing body cells', () => {
    expect(generateMarkdownTable('A | B | C', '|first|\nx||z\n||last\n| | | |', 'left').output)
      .toBe('| A | B | C |\n| --- | --- | --- |\n| first |  |  |\n| x |  | z |\n|  |  | last |\n|  |  |  |');
    expect(generateMarkdownTable('A,B,C', ',middle,\n"",,last', 'left').output)
      .toBe('| A | B | C |\n| --- | --- | --- |\n|  | middle |  |\n|  |  | last |');
  });

  it('pads short rows and ignores blank physical lines across newline styles', () => {
    expect(generateMarkdownTable('A,B', '\r\nx\r\n\r\ny,z\rw,v\n', 'left'))
      .toEqual({ output: '| A | B |\n| --- | --- |\n| x |  |\n| y | z |\n| w | v |', columnCount: 2, rowCount: 3, alignment: 'left' });
  });

  it('rejects overflow with the physical row number instead of discarding text', () => {
    expect(() => generateMarkdownTable('A,B', 'x,y\n\nz,w,extra', 'left'))
      .toThrow('Row 3 has 3 cells but the headers define 2 columns');
    expect(() => generateMarkdownTable('A|B', 'x|y|extra', 'left'))
      .toThrow('Row 1 has 3 cells but the headers define 2 columns');
  });

  it.each(['A,,C', 'A,', 'A | | C', '| A | | C |', 'A,""'])('rejects an empty header in %s', (headers) => {
    expect(() => generateMarkdownTable(headers, 'x,y', 'left')).toThrow(/Header \d+ is empty/);
  });

  it.each(['A', '', '   ', '||'])('requires at least two headers for %s', (headers) => {
    expect(() => generateMarkdownTable(headers, 'x', 'left')).toThrow('Enter at least two table headers');
  });

  it('rejects multiline headers and requires a nonblank data row', () => {
    expect(() => generateMarkdownTable('A,B\nC,D', 'x,y', 'left')).toThrow('Enter headers on one line');
    expect(() => generateMarkdownTable('A,B', '\r\n \n\t', 'left')).toThrow('Enter at least one table row');
  });

  it.each(['"Doe, Jane,Engineer', 'Alice,"ready"extra', 'Al"ice,ready'])('rejects malformed quoted CSV in %s', (row) => {
    expect(() => generateMarkdownTable('Name, Note', row, 'left')).toThrow(/Row 1:/);
  });

  it('rejects multiline quoted CSV with a clear single-line limit', () => {
    expect(() => generateMarkdownTable('Name, Note', 'Alice,"first\nsecond"', 'left'))
      .toThrow('Row 1: close the quoted CSV cell on the same line');
  });

  it('rejects pasted complete Markdown tables rather than treating separators as data', () => {
    expect(() => generateMarkdownTable('Name | Note', '| Name | Note |\n| :--- | ---: |\n| Alice | ready |', 'left'))
      .toThrow('Row 2 looks like a Markdown separator row. Enter data rows only');
  });

  it.each(['A | B', 'A,B'])('rejects valid one-hyphen GFM delimiter rows with headers %s', (headers) => {
    expect(() => generateMarkdownTable(headers, '| - | :-: |', 'left'))
      .toThrow('Row 1 looks like a Markdown separator row. Enter data rows only');
  });

  it.each(['```', '```markdown', '~~~', '~~~md', '```{.markdown}', '~~~ markdown title'])('rejects standalone Markdown code fence %s', (fence) => {
    expect(() => generateMarkdownTable('Name, Note', `${fence}\nAlice,ready`, 'left'))
      .toThrow('Row 1: enter data rows without Markdown code fences');
  });

  it('preserves a complete triple-backtick inline code span as cell content', () => {
    expect(generateMarkdownTable('Command | Note', '```a | b``` | ready', 'left').output)
      .toBe('| Command | Note |\n| --- | --- |\n| ```a \\| b``` | ready |');
  });

  it('rejects unsupported alignment values rather than generating undefined delimiters', () => {
    expect(() => generateMarkdownTable('A,B', 'x,y', 'justify' as MarkdownTableAlignment))
      .toThrow('Choose left, center, or right column alignment');
  });

  it('keeps HTML-looking content as table text without changing the returned type', () => {
    const result = generateMarkdownTable('Markup, Note', '<img src=x onerror=alert(1)>,<script>alert(1)</script>', 'left');
    expect(typeof result.output).toBe('string');
    expect(result.output).toBe('| Markup | Note |\n| --- | --- |\n| <img src=x onerror=alert(1)> | <script>alert(1)</script> |');
  });
});
