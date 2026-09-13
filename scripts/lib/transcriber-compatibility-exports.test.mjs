import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { createTranscriptDownloads } from '../../src/lib/browserTranscriber';
import { parseSubtitleCues, summarizeSubtitleProof } from './transcriber-browser-proof.mjs';
import { validateTranscriberExports } from './transcriber-compatibility-exports.mjs';

// Frozen reproduction of the compatibility runner's pre-fix predicate.
function legacyValidExports({ txt, srt, vtt, transcriptValues, duration }) {
  const srtCues = parseSubtitleCues(srt);
  const vttCues = parseSubtitleCues(vtt, 'vtt');
  const unescape = (text) => text.replaceAll('<b></b>', '').replaceAll('<c></c>', '').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
  return [txt, srt, vtt].every((value) => value.length > 0)
    && summarizeSubtitleProof(srt, duration).valid && Boolean(srtCues && vttCues)
    && JSON.stringify(srtCues.map((cue) => ({ ...cue, text: unescape(cue.text) }))) === JSON.stringify(vttCues.map((cue) => ({ ...cue, text: unescape(cue.text) })))
    && JSON.stringify(srtCues.map((cue) => unescape(cue.text))) === JSON.stringify(transcriptValues.filter((text) => text.trim()))
    && txt === `${transcriptValues.join('\n\n')}\n`;
}

function proofFor(texts = ['first', 'second']) {
  const segments = texts.map((text, index) => ({ start: index * 2, end: index * 2 + 1, text }));
  return { ...createTranscriptDownloads(segments), transcriptValues: texts, duration: texts.length * 2 };
}

const readerText = '\n  <b>literal</b> & &lt; <00:00:01.000>\n\n2\n00:00:02.000 --> 00:00:03.000\n\nNOTE\nSTYLE\n\u0645\u0631\u062d\u0628\u0627 \u05e9\u05dc\u05d5\u05dd\n\n';
const ascii = 'x'.repeat(4096);
const wideTexts = [
  '&'.repeat(292),
  ascii,
  '<b>literal</b> &amp; \u0645\u0631\u062d\u0628\u0627 \u662f\u7684\ud83d\ude42 '.repeat(160),
  '\n  ' + ascii + '  \n\n2\n00:00:02.000 --> 00:00:03.000\n\n',
  '<font></font>&lt; <b>'.repeat(220),
];

describe('current transcriber export compatibility', () => {
  it('reproduces the stale predicate rejecting a valid current plain SRT download', () => {
    const proof = proofFor(['plain']);
    expect(parseSubtitleCues(proof.srt)[0].text).toBe('<font></font>plain');
    expect(legacyValidExports(proof)).toBe(false);
    expect(validateTranscriberExports(proof)).toBe(true);
  });

  it.each([
    ['literal tags and named/numeric entities', '<font></font> <b></b> <c></c> <i>x</i> &lt; &gt; &amp; &amp;lt; &#60; &#x202e; &rlm;'],
    ['literal continuation marker', '<font \n></font>'],
    ['literal cue headers, blank lines and RTL', readerText],
    ['whitespace-only lines', '\n \t \n\n  first\t \nlast \t\n\n'],
    ['CRLF and CR normalization in subtitles only', '  <b> & literal -->\r\n\r\n\u05e9\u05dc\u05d5\u05dd  \rnext\r'],
    ['Unicode and bidi controls', '\u200f\u05e9\u05dc\u05d5\u05dd \u0645\u0631\u062d\u0628\u0627 \u2067RTL\u2069 \u662f\u7684 \ud83d\ude42'],
    ['292 literal ampersands', wideTexts[0]],
    ['4096 ASCII characters', wideTexts[1]],
    ['long UTF-8 markup', wideTexts[2]],
    ['long blank/whitespace/cue-like lines', wideTexts[3]],
    ['long literal neutral tags', wideTexts[4]],
  ])('preserves %s through actual serialization', (_name, text) => {
    expect(validateTranscriberExports(proofFor([text]))).toBe(true);
  });

  it('does not lose final VTT trailing spaces to the existing parser trim', () => {
    const proof = proofFor(['first', '  last  \n \t']);
    expect(parseSubtitleCues(proof.vtt, 'vtt').at(-1).text).toBe('  last  \n<c></c>');
    expect(validateTranscriberExports(proof)).toBe(true);
  });

  it('retains empty edited segments in TXT but excludes them from subtitle cues', () => {
    const proof = proofFor(['', 'first', ' \r\n\t', 'second', '']);
    expect(parseSubtitleCues(proof.srt)).toHaveLength(2);
    expect(validateTranscriberExports(proof)).toBe(true);
    expect(validateTranscriberExports({ ...proof, txt: 'first\n\nsecond\n' })).toBe(false);
  });

  it('handles CRLF transport without normalizing TXT or user whitespace', () => {
    const proof = proofFor(['first\r\n\r\nlast  ']);
    expect(validateTranscriberExports({ ...proof, srt: proof.srt.replaceAll('\n', '\r\n'), vtt: proof.vtt.replaceAll('\n', '\r\n') })).toBe(true);
    expect(validateTranscriberExports({ ...proof, txt: proof.txt.replaceAll('\r\n', '\n') })).toBe(false);
  });

  it('requires exact cue times between formats, including milliseconds', () => {
    const proof = proofFor();
    expect(validateTranscriberExports({ ...proof, vtt: proof.vtt.replace('00:00:02.000', '00:00:02.001') })).toBe(false);
  });

  it.each([
    ['zero duration cue', '00:00:01', '00:00:00'],
    ['reversed cue', '00:00:03', '00:00:01'],
    ['overlap', '00:00:02', '00:00:00'],
    ['past duration', '00:00:03', '00:00:05'],
    ['invalid minute', '00:00:02', '00:60:02'],
    ['negative time', '00:00:00', '-00:00:00'],
  ])('rejects matching but invalid timestamps: %s', (_name, from, to) => {
    const proof = proofFor();
    expect(validateTranscriberExports({ ...proof, srt: proof.srt.replace(from, to), vtt: proof.vtt.replace(from, to) })).toBe(false);
  });

  it('retains the existing duration tolerance, without extending it', () => {
    const proof = proofFor(['one']);
    expect(validateTranscriberExports({ ...proof, duration: 0.9 })).toBe(true);
    expect(validateTranscriberExports({ ...proof, duration: 0.899 })).toBe(false);
  });

  it.each(['txt', 'srt', 'vtt'])('rejects changed content in %s', (format) => {
    const proof = proofFor();
    expect(validateTranscriberExports({ ...proof, [format]: proof[format].replace('first', 'different') })).toBe(false);
  });

  it('rejects reordered, missing and extra cues even if formats agree', () => {
    const proof = proofFor();
    for (const texts of [['second', 'first'], ['first'], ['first', 'second', 'third']]) {
      const changed = proofFor(texts);
      expect(validateTranscriberExports({ ...proof, srt: changed.srt, vtt: changed.vtt })).toBe(false);
    }
  });

  it.each(['srt', 'vtt'])('rejects stripped literal guards in %s', (format) => {
    const proof = proofFor(['<b>literal</b> &lt;']);
    const changed = format === 'srt' ? proof.srt.replaceAll('<font></font>', '')
      : proof.vtt.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
    expect(validateTranscriberExports({ ...proof, [format]: changed })).toBe(false);
  });

  it('does not strip user entities from SRT or decode VTT entities twice', () => {
    const proof = proofFor(['&amp;lt; &lt; <b></b> <c></c>']);
    expect(validateTranscriberExports(proof)).toBe(true);
    expect(validateTranscriberExports({ ...proof, srt: proof.srt.replace('&<font></font>amp;lt;', '&<font></font>lt;') })).toBe(false);
    expect(validateTranscriberExports({ ...proof, vtt: proof.vtt.replace('&amp;amp;lt;', '&amp;lt;') })).toBe(false);
  });

  it('requires SRT whitespace guards and intact literal atoms', () => {
    const proof = proofFor(['<b>literal</b>  ']);
    expect(validateTranscriberExports({ ...proof, srt: proof.srt.replace('<b></b>', '') })).toBe(false);
    expect(validateTranscriberExports({ ...proof, srt: proof.srt.replace('<<font></font>', '<<font \n></font><font></font>') })).toBe(false);
  });

  it('rejects removed SRT continuations that exceed the existing source-line byte bound', () => {
    const proof = proofFor(wideTexts);
    expect(validateTranscriberExports(proof)).toBe(true);
    expect(validateTranscriberExports({ ...proof, srt: proof.srt.replaceAll('<font \n></font>', '') })).toBe(false);
  });

  it.each(['txt', 'srt', 'vtt'])('rejects missing, empty or non-string %s', (format) => {
    for (const value of [undefined, null, '', 42, {}]) {
      expect(validateTranscriberExports({ ...proofFor(), [format]: value })).toBe(false);
    }
  });

  it.each([NaN, Infinity, -1, 0, '4', null, undefined])('rejects invalid duration %s', (duration) => {
    expect(validateTranscriberExports({ ...proofFor(), duration })).toBe(false);
  });

  it.each([null, undefined, 'first', [], [''], [' \r\n\t'], [null], [12], new Array(1)].map((transcriptValues) => ({ transcriptValues })))('rejects absent, malformed or wholly empty transcript values: $transcriptValues', ({ transcriptValues }) => {
    expect(validateTranscriberExports({ ...proofFor(), transcriptValues })).toBe(false);
  });

  it('rejects empty actual downloads and incomplete argument objects', () => {
    expect(validateTranscriberExports(proofFor([]))).toBe(false);
    expect(validateTranscriberExports(proofFor(['', ' ']))).toBe(false);
    expect(validateTranscriberExports({})).toBe(false);
  });

  it.each([
    ['srt', (value) => value.replace('1\n', '2\n')],
    ['srt', (value) => value.replace(' --> ', ' -> ')],
    ['vtt', (value) => value.replace('WEBVTT', 'SRT')],
    ['vtt', (value) => value.replace('00:00:00.000', '00:00:00,000')],
    ['srt', (value) => value + '\nextra'],
    ['vtt', (value) => value + '\nextra'],
    ['srt', (value) => value.slice(0, -1)],
    ['vtt', (value) => value.slice(0, -1)],
  ])('rejects malformed/truncated %s framing', (format, mutate) => {
    const proof = proofFor();
    expect(validateTranscriberExports({ ...proof, [format]: mutate(proof[format]) })).toBe(false);
  });

  it('does not mutate the caller data', () => {
    const proof = Object.freeze({ ...proofFor(), transcriptValues: Object.freeze(['first', 'second']) });
    expect(validateTranscriberExports(proof)).toBe(true);
  });
});

// Opt-in local reader proof; no browser, model, temporary files or network.
// The executable and ASS comparator match the retained SRT independent judgment.
const ffmpeg = process.env.TRANSCRIBER_EXPORT_FFMPEG;
describe.skipIf(!ffmpeg)('unchanged independent FFmpeg 7.1 import semantics', () => {
  function readCues(content, format) {
    const run = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-nostdin', '-threads', '1',
      '-protocol_whitelist', 'file,pipe', '-f', format === 'vtt' ? 'webvtt' : 'srt', '-i', 'pipe:0',
      '-map', '0:s:0', '-c:s', 'ass', '-f', 'ass', 'pipe:1'],
    { input: content, encoding: 'utf8', timeout: 10000, windowsHide: true, maxBuffer: 2 * 1024 * 1024 });
    expect(run.error).toBeUndefined();
    expect(run.status, run.stderr).toBe(0);
    return run.stdout.split(/\r?\n/).filter((line) => line.startsWith('Dialogue: ')).map((line) => {
      const fields = line.slice(10).split(',');
      return { start: fields[1], end: fields[2], text: fields.slice(9).join(',').replace(/\{[^}]*\}/g, '').replace(/\\N/g, '\n').replace(/\\h/g, ' ') };
    });
  }

  it.each(['srt', 'vtt'])('preserves the original independent literal/blank/RTL contract in %s', (format) => {
    const segments = [{ start: 1.12, end: 4.87, text: readerText }, { start: 5, end: 6, text: 'next > last' }];
    const downloads = createTranscriptDownloads(segments);
    expect(readCues(downloads[format], format)).toEqual([
      { start: '0:00:01.12', end: '0:00:04.87', text: readerText },
      { start: '0:00:05.00', end: '0:00:06.00', text: 'next > last' },
    ]);
    expect(downloads.txt).toBe(`${segments.map((segment) => segment.text).join('\n\n')}\n`);
    expect(legacyValidExports({ ...downloads, transcriptValues: segments.map((segment) => segment.text), duration: 6 })).toBe(false);
  });

  it.each(['srt', 'vtt'])('retains the five-cue long-line reader contract in %s', (format) => {
    const proof = proofFor(wideTexts);
    expect(readCues(proof[format], format)).toEqual(wideTexts.map((text, index) => ({
      start: `0:00:0${index * 2}.00`, end: `0:00:0${index * 2 + 1}.00`, text,
    })));
  });
});
