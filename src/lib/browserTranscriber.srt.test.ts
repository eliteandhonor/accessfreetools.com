import { describe, expect, it } from 'vitest';

import { createTranscriptDownloads } from './browserTranscriber';

describe('CR-TR02-02 byte-bounded SRT source lines', () => {
  const ascii = 'x'.repeat(4096);
  const fixtures = [
    ['292 literal ampersands', '&'.repeat(292)],
    ['4096 ASCII characters', ascii],
    ['long UTF-8 markup', '<b>literal</b> &amp; \u0645\u0631\u062d\u0628\u0627 \u662f\u7684\ud83d\ude42 '.repeat(160)],
    ['blank lines and whitespace', '\n  ' + ascii + '  \n\n2\n00:00:02.000 --> 00:00:03.000\n\n'],
    ['literal neutral tags', '<font></font>&lt; <b>'.repeat(220)],
  ];

  for (const [name, text] of fixtures) {
    it(`bounds source bytes without splitting Unicode or literal atoms: ${name}`, () => {
      const { srt } = createTranscriptDownloads([{ start: 1.12, end: 4.87, text }]);
      const body = srt.slice('1\n00:00:01,120 --> 00:00:04,870\n'.length, -1);
      expect(srt.startsWith('1\n00:00:01,120 --> 00:00:04,870\n')).toBe(true);
      expect(body).toContain('<font \n></font>');
      for (const line of srt.split('\n')) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(1000);
      expect(srt).not.toMatch(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u);
      // This checks serialization structure, not independent reader behavior.
      // Native FFmpeg proof separately imports the actual mounted downloads.
      const originalAtoms = text.split('\n').map(line =>
        `<font></font>${line.replace(/[<&]/g, character => `${character}<font></font>`)}${!line || /\s$/.test(line) ? '<b></b>' : ''}`,
      ).join('\n');
      expect(body.split('<font \n></font>').join('')).toBe(originalAtoms);
    });
  }

  it('leaves short SRT, TXT and VTT serialization unchanged', () => {
    const text = '  <b> & literal -->\r\n\r\n\u05e9\u05dc\u05d5\u05dd  ';
    const downloads = createTranscriptDownloads([{ start: 0, end: 1, text }]);
    expect(downloads.txt).toBe(`${text}\n`);
    expect(downloads.vtt).toBe('WEBVTT\n\n00:00:00.000 --> 00:00:01.000\n  &lt;b&gt; &amp; literal --&gt;\n<c></c>\n\u05e9\u05dc\u05d5\u05dd  \n');
    expect(downloads.srt).toBe('1\n00:00:00,000 --> 00:00:01,000\n<font></font>  <<font></font>b> &<font></font> literal -->\n<font></font><b></b>\n<font></font>\u05e9\u05dc\u05d5\u05dd  <b></b>\n');
  });
});
