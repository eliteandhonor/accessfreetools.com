import { phonemize as espeakPhonemize } from 'phonemizer';

export type KokoroEnglishDialect = 'en-gb' | 'en-us';

const PUNCTUATION = ';:,.!?¡¿—…"«»“”(){}[]';
const PUNCTUATION_PATTERN = new RegExp(`(\\s*[${escapeRegExp(PUNCTUATION)}]+\\s*)+`, 'g');
export const KOKORO_TEXT_CHUNK_CHARACTERS = 320;
export const KOKORO_STYLE_DIMENSIONS = 256;
export const KOKORO_MAX_MODEL_TOKENS = 509;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function splitKeepingMatches(text: string, regex: RegExp) {
  const result: Array<{ match: boolean; text: string }> = [];
  let previousIndex = 0;
  for (const match of text.matchAll(regex)) {
    const fullMatch = match[0];
    const matchIndex = match.index ?? 0;
    if (previousIndex < matchIndex) result.push({ match: false, text: text.slice(previousIndex, matchIndex) });
    if (fullMatch) result.push({ match: true, text: fullMatch });
    previousIndex = matchIndex + fullMatch.length;
  }
  if (previousIndex < text.length) result.push({ match: false, text: text.slice(previousIndex) });
  return result;
}

function normalizeNumber(match: string) {
  if (match.includes('.')) return match;
  if (match.includes(':')) {
    const [hour, minute] = match.split(':').map(Number);
    if (minute === 0) return `${hour} o'clock`;
    if (minute < 10) return `${hour} oh ${minute}`;
    return `${hour} ${minute}`;
  }
  const year = Number.parseInt(match.slice(0, 4), 10);
  if (year < 1100 || year % 1000 < 10) return match;
  const left = match.slice(0, 2);
  const right = Number.parseInt(match.slice(2, 4), 10);
  const suffix = match.endsWith('s') ? 's' : '';
  if (year % 1000 >= 100 && year % 1000 <= 999) {
    if (right === 0) return `${left} hundred${suffix}`;
    if (right < 10) return `${left} oh ${right}${suffix}`;
  }
  return `${left} ${right}${suffix}`;
}

function normalizeMoney(match: string) {
  const unit = match[0] === '$' ? 'dollar' : 'pound';
  if (Number.isNaN(Number(match.slice(1)))) return `${match.slice(1)} ${unit}s`;
  if (!match.includes('.')) return `${match.slice(1)} ${unit}${match.slice(1) === '1' ? '' : 's'}`;
  const [whole, fraction] = match.slice(1).split('.');
  const coins = Number.parseInt(fraction.padEnd(2, '0'), 10);
  const coinName = match[0] === '$' ? (coins === 1 ? 'cent' : 'cents') : coins === 1 ? 'penny' : 'pence';
  return `${whole} ${unit}${whole === '1' ? '' : 's'} and ${coins} ${coinName}`;
}

export function normalizeKokoroText(text: string) {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/«/g, '“')
    .replace(/»/g, '”')
    .replace(/[“”]/g, '"')
    .replace(/\(/g, '«')
    .replace(/\)/g, '»')
    .replace(/、/g, ', ')
    .replace(/。/g, '. ')
    .replace(/！/g, '! ')
    .replace(/，/g, ', ')
    .replace(/：/g, ': ')
    .replace(/；/g, '; ')
    .replace(/？/g, '? ')
    .replace(/[^\S \n]/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replace(/(?<=\n) +(?=\n)/g, '')
    .replace(/\bD[Rr]\.(?= [A-Z])/g, 'Doctor')
    .replace(/\b(?:Mr\.|MR\.(?= [A-Z]))/g, 'Mister')
    .replace(/\b(?:Ms\.|MS\.(?= [A-Z]))/g, 'Miss')
    .replace(/\b(?:Mrs\.|MRS\.(?= [A-Z]))/g, 'Mrs')
    .replace(/\betc\.(?! [A-Z])/gi, 'etc')
    .replace(/\b(y)eah?\b/gi, "$1e'a")
    .replace(/\d*\.\d+|\b\d{4}s?\b|(?<!:)\b(?:[1-9]|1[0-2]):[0-5]\d\b(?!:)/g, normalizeNumber)
    .replace(/(?<=\d),(?=\d)/g, '')
    .replace(/[$£]\d+(?:\.\d+)?(?: hundred| thousand| (?:[bm]|tr)illion)*\b|[$£]\d+\.\d\d?\b/gi, normalizeMoney)
    .replace(/\d*\.(\d+)/g, (match) => {
      const [whole, fraction] = match.split('.');
      return `${whole} point ${fraction.split('').join(' ')}`;
    })
    .replace(/(?<=\d)-(?=\d)/g, ' to ')
    .replace(/(?<=\d)S/g, ' S')
    .replace(/(?<=[BCDFGHJ-NP-TV-Z])'?s\b/g, "'S")
    .replace(/(?<=X')S\b/g, 's')
    .replace(/(?:[A-Za-z]\.){2,} [a-z]/g, (match) => match.replace(/\./g, '-'))
    .replace(/(?<=[A-Z])\.(?=[A-Z])/gi, '-')
    .trim();
}

export function splitTextForKokoro(text: string, maxCharacters = KOKORO_TEXT_CHUNK_CHARACTERS) {
  if (!Number.isInteger(maxCharacters) || maxCharacters < 40) {
    throw new Error('Kokoro text chunks must allow at least 40 characters.');
  }
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let remaining = normalized;
  while (remaining.length > maxCharacters) {
    const window = remaining.slice(0, maxCharacters + 1);
    const minimumBreak = Math.floor(maxCharacters * 0.55);
    let breakAt = -1;
    for (const marker of ['. ', '! ', '? ', '; ', ': ', ', ']) {
      breakAt = Math.max(breakAt, window.lastIndexOf(marker) + (window.lastIndexOf(marker) >= 0 ? marker.length - 1 : 0));
    }
    if (breakAt < minimumBreak) breakAt = window.lastIndexOf(' ');
    if (breakAt < minimumBreak) breakAt = maxCharacters;
    const chunk = remaining.slice(0, breakAt).trim();
    if (chunk) chunks.push(chunk);
    remaining = remaining.slice(breakAt).trimStart();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

// Matches the pinned official browser implementation: style row N is selected for N input tokens.
export function selectKokoroVoiceStyle(voiceData: Float32Array, tokenCount: number) {
  if (!Number.isInteger(tokenCount) || tokenCount < 1 || tokenCount > KOKORO_MAX_MODEL_TOKENS) {
    throw new Error(`Kokoro voice styles require 1 to ${KOKORO_MAX_MODEL_TOKENS} input tokens.`);
  }
  const offset = tokenCount * KOKORO_STYLE_DIMENSIONS;
  const style = voiceData.slice(offset, offset + KOKORO_STYLE_DIMENSIONS);
  if (style.length !== KOKORO_STYLE_DIMENSIONS) throw new Error('The Kokoro voice style is incomplete.');
  return style;
}

// Adapted from hexgrad/kokoro kokoro.js at dfb907a02bba8152ca444717ca5d78747ccb4bec (Apache-2.0).
export async function phonemizeKokoroText(text: string, dialect: KokoroEnglishDialect) {
  const normalized = normalizeKokoroText(text);
  const sections = splitKeepingMatches(normalized, PUNCTUATION_PATTERN);
  const espeakLanguage = dialect === 'en-us' ? 'en-us' : 'en';
  const phonemes = (
    await Promise.all(
      sections.map(async (section) => (
        section.match ? section.text : (await espeakPhonemize(section.text, espeakLanguage)).join(' ')
      )),
    )
  ).join('');

  let processed = phonemes
    .replace(/kəkˈoːɹoʊ/g, 'kˈoʊkəɹoʊ')
    .replace(/kəkˈɔːɹəʊ/g, 'kˈəʊkəɹəʊ')
    .replace(/ʲ/g, 'j')
    .replace(/r/g, 'ɹ')
    .replace(/x/g, 'k')
    .replace(/ɬ/g, 'l')
    .replace(/(?<=[a-zɹː])(?=hˈʌndɹɪd)/g, ' ')
    .replace(/ z(?=[;:,.!?¡¿—…"«»“” ]|$)/g, 'z');
  if (dialect === 'en-us') processed = processed.replace(/(?<=nˈaɪn)ti(?!ː)/g, 'di');
  return processed.trim();
}
