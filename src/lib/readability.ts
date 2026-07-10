export interface ReadabilitySentence {
  text: string;
  wordCount: number;
}

export interface ReadabilityAnalysis {
  gradeLevel: number;
  readingEase: number;
  wordCount: number;
  sentenceCount: number;
  averageSentenceWords: number;
  longWordCount: number;
  longWordPercentage: number;
  sentencesOver20Words: number;
  longestSentence: ReadabilitySentence;
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}

function wordsIn(text: string) {
  return (text.match(/[A-Za-z0-9'-]+/g) ?? []).filter((word) => /[A-Za-z0-9]/.test(word));
}

function splitSentences(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function countEnglishSyllables(word: string) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');

  if (!cleaned) return 0;

  const withoutSilentE = cleaned.length > 3 ? cleaned.replace(/e$/, '') : cleaned;
  const groups = withoutSilentE.match(/[aeiouy]+/g);

  return Math.max(1, groups?.length ?? 1);
}

export function analyzeEnglishReadability(text: string): ReadabilityAnalysis {
  const normalized = text.trim();
  const words = wordsIn(normalized);

  if (!words.some((word) => /[A-Za-z]/.test(word))) {
    throw new Error('Enter English words so the tool can estimate readability.');
  }

  const sentenceTexts = splitSentences(normalized);
  const sentenceDetails = (sentenceTexts.length ? sentenceTexts : [normalized]).map((sentence) => ({
    text: sentence,
    wordCount: wordsIn(sentence).length,
  }));
  const sentenceCount = sentenceDetails.length;
  const syllableCount = words.reduce((total, word) => total + countEnglishSyllables(word), 0);
  const longWordCount = words.filter((word) => word.replace(/[^A-Za-z]/g, '').length >= 7).length;
  const averageSentenceWords = words.length / sentenceCount;
  const syllablesPerWord = syllableCount / words.length;
  const gradeLevel = 0.39 * averageSentenceWords + 11.8 * syllablesPerWord - 15.59;
  const readingEase = 206.835 - 1.015 * averageSentenceWords - 84.6 * syllablesPerWord;
  const longestSentence = sentenceDetails.reduce((longest, sentence) =>
    sentence.wordCount > longest.wordCount ? sentence : longest,
  );

  return {
    gradeLevel: Math.max(1, roundOne(gradeLevel)),
    readingEase: roundOne(readingEase),
    wordCount: words.length,
    sentenceCount,
    averageSentenceWords: roundOne(averageSentenceWords),
    longWordCount,
    longWordPercentage: roundOne((longWordCount / words.length) * 100),
    sentencesOver20Words: sentenceDetails.filter((sentence) => sentence.wordCount > 20).length,
    longestSentence,
  };
}

function sentencePreview(sentence: string) {
  if (sentence.length <= 180) return sentence;
  return `${sentence.slice(0, 177).trimEnd()}...`;
}

export function buildPlainLanguageRevisionClues(analysis: ReadabilityAnalysis) {
  const over20 = analysis.sentencesOver20Words;
  const sentenceHeading = over20 > 0 ? 'First sentence to review' : 'Sentence-length check';
  const sentenceSummary = over20 > 0
    ? `${over20} ${over20 === 1 ? 'sentence is' : 'sentences are'} over 20 words.`
    : 'No sentences are over 20 words. Check jargon, order, and examples next.';

  return [
    sentenceHeading,
    `"${sentencePreview(analysis.longestSentence.text)}"`,
    `Longest sentence: ${analysis.longestSentence.wordCount} words. ${sentenceSummary}`,
    '',
    'Plain-language checklist',
    '- Put the main message first.',
    '- Keep one main idea per sentence.',
    '- Split or shorten sentences over 20 words when the meaning allows.',
    `- Review ${analysis.longWordCount} long ${analysis.longWordCount === 1 ? 'word' : 'words'}; keep needed terms, but explain unfamiliar ones.`,
    '- Recheck the same passage after editing.',
  ].join('\n');
}
