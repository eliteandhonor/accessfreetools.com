import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';

import {
  inspectZipCentralDirectory,
  parseEpubBytes,
  parsePastedText,
  parseTxtBytes,
  TTS_INPUT_LIMITS,
} from './ttsInput';

function buildEpub(chapter = '<html><head><script>hidden network text</script></head><body><h1>Chapter</h1><p>Hello <strong>reader</strong>.</p><img src="https://example.com/track.png" /></body></html>') {
  return zipSync({
    mimetype: strToU8('application/epub+zip'),
    'META-INF/container.xml': strToU8(
      '<?xml version="1.0"?><container><rootfiles><rootfile full-path="OEBPS/content.opf" /></rootfiles></container>',
    ),
    'OEBPS/content.opf': strToU8(
      '<?xml version="1.0"?><package><manifest><item id="c1" href="chapter.xhtml" media-type="application/xhtml+xml" /></manifest><spine><itemref idref="c1" /></spine></package>',
    ),
    'OEBPS/chapter.xhtml': strToU8(chapter),
  });
}

describe('TTS browser input parsing', () => {
  it('normalizes pasted text without sending titles or filenames', () => {
    const parsed = parsePastedText(' First line.\r\n\r\n Second line. ');
    expect(parsed).toEqual({
      chapters: [{ index: 1, text: 'First line.\n\nSecond line.' }],
      characterCount: 25,
      sourceKind: 'paste',
    });
  });

  it('decodes UTF-8 TXT input', () => {
    const parsed = parseTxtBytes(new TextEncoder().encode('Hello, 世界.'));
    expect(parsed.chapters[0].text).toBe('Hello, 世界.');
    expect(parsed.sourceKind).toBe('txt');
  });

  it('keeps the per-chapter synthesis limit lower than the local parser limit', () => {
    const parsed = parsePastedText('a'.repeat(TTS_INPUT_LIMITS.maxSynthesisCharacters + 1));
    expect(parsed.characterCount).toBe(TTS_INPUT_LIMITS.maxSynthesisCharacters + 1);
    expect(TTS_INPUT_LIMITS.maxSynthesisCharacters).toBeLessThan(TTS_INPUT_LIMITS.maxCharacters);
  });

  it('extracts EPUB spine text while ignoring scripts and remote resources', () => {
    const parsed = parseEpubBytes(buildEpub());
    expect(parsed.chapters).toEqual([{ index: 1, text: 'Chapter\n\nHello reader.' }]);
    expect(parsed.chapters[0].text).not.toContain('hidden network text');
    expect(parsed.chapters[0].text).not.toContain('example.com');
  });

  it('rejects malformed archives', () => {
    expect(() => inspectZipCentralDirectory(new Uint8Array([1, 2, 3]))).toThrow(/valid ZIP|no larger/);
  });

  it('rejects an archive whose central directory claims unsafe expansion', () => {
    const bytes = new Uint8Array(68);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint32(24, TTS_INPUT_LIMITS.maxUncompressedBytes + 1, true);
    view.setUint16(28, 0, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint32(46, 0x06054b50, true);
    view.setUint16(56, 1, true);
    view.setUint32(58, 46, true);
    view.setUint32(62, 0, true);
    expect(() => inspectZipCentralDirectory(bytes)).toThrow(/25 MB safety limit/);
  });

  it('rejects unsafe parent paths in EPUB entries', () => {
    const archive = zipSync({
      'META-INF/container.xml': strToU8(
        '<container><rootfiles><rootfile full-path="../content.opf" /></rootfiles></container>',
      ),
      '../content.opf': strToU8('<package />'),
    });
    expect(() => parseEpubBytes(archive)).toThrow(/unsafe parent path/);
  });
});
