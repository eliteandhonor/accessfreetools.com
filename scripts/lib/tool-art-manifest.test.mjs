import { describe, expect, it } from 'vitest';
import { normalizeTextLineEndings } from './tool-art-manifest.mjs';

describe('normalizeTextLineEndings', () => {
  it('treats LF, CRLF, and legacy CR content as the same text', () => {
    expect(normalizeTextLineEndings('first\r\nsecond\rthird\n')).toBe('first\nsecond\nthird\n');
  });

  it('handles missing values without changing comparison semantics', () => {
    expect(normalizeTextLineEndings()).toBe('');
  });
});
