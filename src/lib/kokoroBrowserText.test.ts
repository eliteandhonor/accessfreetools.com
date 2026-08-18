import { describe, expect, it } from 'vitest';

import {
  KOKORO_MAX_MODEL_TOKENS,
  KOKORO_STYLE_DIMENSIONS,
  normalizeKokoroText,
  selectKokoroVoiceStyle,
  splitTextForKokoro,
} from './kokoroBrowserText';

describe('Kokoro browser text preparation', () => {
  it('normalizes common English numbers and punctuation without dropping the sentence', () => {
    expect(normalizeKokoroText('Dr. Smith paid $12.50 at 9:05.')).toBe(
      'Doctor Smith paid 12 dollars and 50 cents at 9 oh 5.',
    );
  });

  it('splits long text in order without silent truncation', () => {
    const input = Array.from({ length: 120 }, (_, index) => `Sentence ${index + 1} stays in order.`).join(' ');
    const chunks = splitTextForKokoro(input, 120);

    expect(chunks.length).toBeGreaterThan(20);
    expect(chunks.every((chunk) => chunk.length <= 120)).toBe(true);
    expect(chunks.join(' ')).toBe(input);
  });

  it('bounds a single long token and rejects unsafe chunk limits', () => {
    const chunks = splitTextForKokoro('a'.repeat(701), 100);
    expect(chunks).toHaveLength(8);
    expect(chunks.join('')).toBe('a'.repeat(701));
    expect(() => splitTextForKokoro('text', 20)).toThrow('at least 40');
  });

  it('selects the same token-indexed voice row as the pinned browser source', () => {
    const voiceData = new Float32Array((KOKORO_MAX_MODEL_TOKENS + 1) * KOKORO_STYLE_DIMENSIONS);
    for (let row = 0; row <= KOKORO_MAX_MODEL_TOKENS; row += 1) {
      voiceData.fill(row, row * KOKORO_STYLE_DIMENSIONS, (row + 1) * KOKORO_STYLE_DIMENSIONS);
    }

    expect(selectKokoroVoiceStyle(voiceData, 1)[0]).toBe(1);
    expect(selectKokoroVoiceStyle(voiceData, KOKORO_MAX_MODEL_TOKENS)[0]).toBe(KOKORO_MAX_MODEL_TOKENS);
  });

  it('rejects invalid token counts and incomplete voice packs', () => {
    expect(() => selectKokoroVoiceStyle(new Float32Array(512), 0)).toThrow(/1 to 509/);
    expect(() => selectKokoroVoiceStyle(new Float32Array(512), 2)).toThrow(/incomplete/);
  });
});
