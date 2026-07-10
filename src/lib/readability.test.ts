import { describe, expect, it } from 'vitest';

import {
  analyzeEnglishReadability,
  buildPlainLanguageRevisionClues,
  countEnglishSyllables,
} from './readability';

describe('reading level analysis', () => {
  it('preserves the documented simple help-text result', () => {
    const result = analyzeEnglishReadability('Enter your numbers, press calculate, and read the answer.');

    expect(result).toMatchObject({
      gradeLevel: 6.3,
      readingEase: 66.1,
      wordCount: 9,
      sentenceCount: 1,
      averageSentenceWords: 9,
      longWordCount: 2,
      sentencesOver20Words: 0,
    });
    expect(result.longestSentence.wordCount).toBe(9);
  });

  it('finds the longest sentence and turns it into revision clues', () => {
    const result = analyzeEnglishReadability(
      'This short line is easy. The implementation reconciles client-side hydration boundaries with static prerendered metadata and conditional runtime inference dependencies across several deployment environments without a clear explanation for new readers.',
    );
    const clues = buildPlainLanguageRevisionClues(result);

    expect(result.sentenceCount).toBe(2);
    expect(result.sentencesOver20Words).toBe(1);
    expect(result.longestSentence.text).toContain('implementation reconciles');
    expect(clues).toContain('First sentence to review');
    expect(clues).toContain('1 sentence is over 20 words');
    expect(clues).toContain('Keep one main idea per sentence');
  });

  it('labels a short sample without pretending a sentence must be fixed', () => {
    const result = analyzeEnglishReadability('Open the tool. Enter the values. Check the result before you use it.');
    const clues = buildPlainLanguageRevisionClues(result);

    expect(clues).toContain('Sentence-length check');
    expect(clues).toContain('No sentences are over 20 words');
  });

  it('keeps the syllable heuristic and invalid-input boundary explicit', () => {
    expect(countEnglishSyllables('calculate')).toBe(3);
    expect(countEnglishSyllables('2026')).toBe(0);
    expect(() => analyzeEnglishReadability('--- 1234 ---')).toThrow('Enter English words');
    expect(() => analyzeEnglishReadability('--- ---')).toThrow('Enter English words');
  });
});
