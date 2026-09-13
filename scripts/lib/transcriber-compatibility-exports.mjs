import { parseSubtitleCues, summarizeSubtitleProof } from './transcriber-browser-proof.mjs';

function losslessCues(value, format) {
  const source = value.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const cues = parseSubtitleCues(source, format);
  if (!cues || !source.endsWith('\n') || (format === 'vtt' && !source.startsWith('WEBVTT\n\n'))) return null;
  const body = source.slice(format === 'vtt' ? 8 : 0, -1);
  const groups = body.split('\n\n');
  if (groups.length !== cues.length) return null;
  // Keep the existing parser's framing/times, but not its whole-file trim of
  // the last VTT cue's whitespace. Only the export's final LF is a terminator.
  return cues.map((cue, index) => ({
    ...cue, text: groups[index].split('\n').slice(format === 'srt' ? 2 : 1).join('\n'),
  }));
}

function matchesSrtText(actual, expected) {
  const neutral = '<font></font>';
  const continuation = '<font \n></font>';
  let offset = 0;
  const consume = (atom, canContinue = false) => {
    if (canContinue && actual.startsWith(continuation, offset)) offset += continuation.length;
    if (!actual.startsWith(atom, offset)) return false;
    offset += atom.length;
    return true;
  };
  // Consume only complete serializer atoms. Removing tags first would also
  // accept broken guards or continuations inside a literal character's guard.
  for (const [index, line] of expected.split('\n').entries()) {
    if (index > 0 && !consume('\n')) return false;
    if (!consume(neutral)) return false;
    for (const character of line) {
      if (!consume(/[<&]/.test(character) ? character + neutral : character, true)) return false;
    }
    if ((!line || /\s$/.test(line)) && !consume('<b></b>', true)) return false;
  }
  return offset === actual.length;
}

function matchesVttText(actual, expected) {
  const encoded = expected.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .split('\n').map((line) => line.trim() ? line : `<c></c>${line}`).join('\n');
  return actual === encoded;
}

/**
 * Pure, fail-closed proof of current TXT/SRT/VTT exports, not a general reader.
 * transcriptValues must be strings in displayed/export order, including blanks.
 * Checks exact TXT, literal cue content/order, cross-format times and the existing
 * non-overlap/duration (+0.1s) contract. Only subtitle CR/CRLF is normalized.
 * Original segment times are not supplied: identical wrong times in both formats
 * cannot be detected. This is structural proof, not independent reader approval.
 */
export function validateTranscriberExports({ txt, srt, vtt, transcriptValues, duration } = {}) {
  if (![txt, srt, vtt].every((value) => typeof value === 'string' && value.length > 0)
    || !Number.isFinite(duration) || duration <= 0 || !Array.isArray(transcriptValues)) return false;
  for (const value of transcriptValues) if (typeof value !== 'string') return false;
  if (txt !== `${transcriptValues.join('\n\n')}\n`) return false;
  const expected = transcriptValues.filter((text) => text.trim()).map((text) => text.replace(/\r\n?/g, '\n'));
  if (!expected.length || !summarizeSubtitleProof(srt, duration).valid) return false;

  const srtCues = losslessCues(srt, 'srt');
  const vttCues = losslessCues(vtt, 'vtt');
  if (srtCues?.length !== expected.length || vttCues?.length !== expected.length) return false;
  const encoder = new TextEncoder();
  if (srt.replace(/\r\n?/g, '\n').split('\n').some((line) => encoder.encode(line).length > 1000)) return false;
  return expected.every((text, index) => {
    const srtCue = srtCues[index];
    const vttCue = vttCues[index];
    return srtCue.start === vttCue.start && srtCue.end === vttCue.end
      && matchesSrtText(srtCue.text, text) && matchesVttText(vttCue.text, text);
  });
}
