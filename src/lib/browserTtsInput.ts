export const MAX_TTS_PREVIEW_CHARACTERS = 220;
export const MAX_TTS_TEXT_CHARACTERS = 10_000;
export const MAX_TTS_TEXT_FILE_BYTES = 64 * 1024;

export interface TextFileMetadata {
  name: string;
  size: number;
  type: string;
}

export interface PreparedTextImport {
  error?: string;
  text?: string;
}

function truncateAtWord(value: string, maxCharacters: number) {
  if (value.length <= maxCharacters) return value;
  const shortened = value.slice(0, maxCharacters + 1);
  const lastSpace = shortened.lastIndexOf(' ');
  return shortened.slice(0, lastSpace > maxCharacters * 0.6 ? lastSpace : maxCharacters).trimEnd();
}

export function getTtsPreviewText(value: string, maxCharacters = MAX_TTS_PREVIEW_CHARACTERS) {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized) return '';
  const firstSentence = normalized.match(/^.*?[.!?](?:["')\]]?)(?=\s|$)/)?.[0] ?? normalized;
  return truncateAtWord(firstSentence, maxCharacters);
}

export function validateLocalTxtFile(file: TextFileMetadata) {
  if (!file.name.toLowerCase().endsWith('.txt')) return 'Choose a plain .txt file.';
  if (file.type && !file.type.toLowerCase().startsWith('text/plain')) return 'Choose a plain text file, not another file type.';
  if (file.size > MAX_TTS_TEXT_FILE_BYTES) return 'Choose a TXT file no larger than 64 KB.';
  return '';
}

export function prepareLocalTxtContent(value: string, maxCharacters = MAX_TTS_TEXT_CHARACTERS): PreparedTextImport {
  const normalized = value.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  if (normalized.includes('\0')) return { error: 'This file does not look like plain text.' };
  if (!normalized.trim()) return { error: 'The TXT file is empty.' };
  if (normalized.length > maxCharacters) {
    return { error: `This TXT file contains more than ${new Intl.NumberFormat('en').format(maxCharacters)} characters.` };
  }
  return { text: normalized };
}

const WINDOWS_RESERVED_NAME = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i;

function sanitizeFilenameBase(value: string) {
  let base = value
    .normalize('NFKC')
    .replace(/\.(?:mp3|wav|m4a|aac|ogg|flac)$/i, '')
    .replace(/[<>:"/\\|?*\u0000-\u001f]+/g, '-')
    .replace(/\s*-\s*/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[. -]+|[. -]+$/g, '')
    .slice(0, 80)
    .trim()
    .replace(/[. -]+$/g, '');
  if (WINDOWS_RESERVED_NAME.test(base)) base = `audio-${base}`;
  return base;
}

export function sanitizeMp3Filename(value: string, fallbackBase = 'text-to-speech') {
  const fallback = sanitizeFilenameBase(fallbackBase) || 'text-to-speech';
  const base = sanitizeFilenameBase(value) || fallback;
  return `${base}.mp3`;
}
