import { describe, expect, it } from 'vitest';

import {
  getTtsPreviewText,
  MAX_TTS_TEXT_FILE_BYTES,
  prepareLocalTxtContent,
  sanitizeMp3Filename,
  validateLocalTxtFile,
} from './browserTtsInput';

describe('browser TTS input helpers', () => {
  it('uses the first complete sentence for a voice preview', () => {
    expect(getTtsPreviewText('  First sentence. Second sentence follows.  ')).toBe('First sentence.');
    expect(getTtsPreviewText('No punctuation here', 8)).toBe('No punct');
    expect(getTtsPreviewText('')).toBe('');
  });

  it('bounds voice preview text without cutting a normal word', () => {
    const preview = getTtsPreviewText(`${'useful '.repeat(50)}ending.`, 80);
    expect(preview.length).toBeLessThanOrEqual(80);
    expect(preview.endsWith(' ')).toBe(false);
    expect(preview.split(' ').every(Boolean)).toBe(true);
  });

  it('accepts only bounded plain TXT files', () => {
    expect(validateLocalTxtFile({ name: 'notes.txt', size: 120, type: 'text/plain' })).toBe('');
    expect(validateLocalTxtFile({ name: 'notes.txt', size: 120, type: '' })).toBe('');
    expect(validateLocalTxtFile({ name: 'notes.pdf', size: 120, type: 'application/pdf' })).toBe('Choose a plain .txt file.');
    expect(validateLocalTxtFile({ name: 'notes.txt', size: 120, type: 'application/octet-stream' })).toContain('plain text');
    expect(validateLocalTxtFile({ name: 'notes.txt', size: MAX_TTS_TEXT_FILE_BYTES + 1, type: 'text/plain' })).toContain('64 KB');
  });

  it('normalizes local TXT content without truncating it', () => {
    expect(prepareLocalTxtContent('\uFEFFLine one\r\nLine two')).toEqual({ text: 'Line one\nLine two' });
    expect(prepareLocalTxtContent('   ')).toEqual({ error: 'The TXT file is empty.' });
    expect(prepareLocalTxtContent('a\0b')).toEqual({ error: 'This file does not look like plain text.' });
    expect(prepareLocalTxtContent('123456', 5).error).toContain('more than 5 characters');
  });

  it('creates portable MP3 filenames', () => {
    expect(sanitizeMp3Filename('My: narration?.mp3')).toBe('My-narration.mp3');
    expect(sanitizeMp3Filename('My: Voice* Test?.wav')).toBe('My-Voice-Test.mp3');
    expect(sanitizeMp3Filename('  ', 'text-to-speech-kokoro-bella')).toBe('text-to-speech-kokoro-bella.mp3');
    expect(sanitizeMp3Filename('CON')).toBe('audio-CON.mp3');
    expect(sanitizeMp3Filename('chapter/one')).toBe('chapter-one.mp3');
  });
});
