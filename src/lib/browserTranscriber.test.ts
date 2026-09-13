import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  MAX_TRANSCRIBER_BYTES,
  MAX_TRANSCRIBER_DURATION_SECONDS,
  buildTranscriptionBlocks,
  createWhisperGenerationOptions,
  createTranscriptDownloads,
  downmixToMono,
  mergeTranscriptSegments,
  resampleLinear,
  sanitizeTranscriptFilename,
  validateMediaCandidate,
  type TranscriptSegment,
} from './browserTranscriber';

describe('browser transcriber planning', () => {
  it('creates overlapping five-minute blocks without passing the recording end', () => {
    expect(buildTranscriptionBlocks(612)).toEqual([
      { index: 0, start: 0, end: 300 },
      { index: 1, start: 295, end: 595 },
      { index: 2, start: 590, end: 612 },
    ]);
  });

  it('returns no blocks for an empty duration', () => {
    expect(buildTranscriptionBlocks(0)).toEqual([]);
  });

  it('omits multilingual-only options for the English model', () => {
    const options = createWhisperGenerationOptions('english', 'en');
    expect(options).not.toHaveProperty('language');
    expect(options).not.toHaveProperty('task');
    expect(options).toMatchObject({ return_timestamps: 'word', chunk_length_s: 30, stride_length_s: 5, force_full_sequences: false });
  });

  it('adds only supported multilingual options', () => {
    expect(createWhisperGenerationOptions('multilingual', 'auto')).toMatchObject({ task: 'transcribe' });
    expect(createWhisperGenerationOptions('multilingual', 'es')).toMatchObject({
      language: 'es',
      task: 'transcribe',
    });
  });
});

describe('browser transcriber audio preparation', () => {
  it('downmixes interleaved stereo samples to mono', () => {
    const stereo = new Float32Array([1, -1, 0.5, 0.25]);
    expect(Array.from(downmixToMono(stereo, 2))).toEqual([0, 0.375]);
  });

  it('resamples linearly while preserving the endpoints', () => {
    const output = resampleLinear(new Float32Array([0, 1, 0, -1]), 4, 2);
    expect(Array.from(output)).toEqual([0, 0]);
  });

  it('rejects an invalid channel count', () => {
    expect(() => downmixToMono(new Float32Array([1, 2]), 0)).toThrow(/channel/i);
  });
});

describe('browser transcriber transcript merging', () => {
  const earlier: TranscriptSegment[] = [
    { start: 0, end: 3, text: 'The project began with a small test.' },
    { start: 3, end: 6, text: 'Then I checked the result carefully.' },
  ];

  it('removes repeated words at an overlapping block boundary', () => {
    const next = [
      { start: 5.5, end: 9, text: 'checked the result carefully. The next section was clearer.' },
    ];
    expect(mergeTranscriptSegments(earlier, next)).toEqual([
      ...earlier,
      { start: 6, end: 9, text: 'The next section was clearer.' },
    ]);
  });

  it('keeps completed segments when the next block is empty', () => {
    expect(mergeTranscriptSegments(earlier, [])).toEqual(earlier);
  });

  it('drops exact duplicate overlap segments', () => {
    expect(
      mergeTranscriptSegments(earlier, [
        { start: 2.9, end: 6.1, text: 'Then I checked the result carefully.' },
      ]),
    ).toEqual(earlier);
  });

  it('preserves separated repeated answers and a later repeated prefix', () => {
    const first = [{ start: 0, end: 1, text: 'Yes.' }];
    const next = [
      { start: 10, end: 11, text: 'Yes.' },
      { start: 12, end: 13, text: 'Yes, proceed.' },
    ];
    expect(mergeTranscriptSegments(first, next)).toEqual([...first, ...next]);
  });

  it('does not deduplicate touching or overlapping ASR segments within the incoming block', () => {
    const next = [
      { start: 10, end: 11, text: 'Yes.' },
      { start: 10.9, end: 12, text: 'Yes.' },
      { start: 12, end: 13, text: 'Yes, proceed.' },
    ];
    expect(mergeTranscriptSegments([], next).map(({ text }) => text)).toEqual(next.map(({ text }) => text));
    expect(mergeTranscriptSegments(next.slice(0, 1), [{ start: 11, end: 12, text: 'Yes.' }])).toHaveLength(2);
  });

  it('aligns normalized tokens to source offsets despite standalone punctuation', () => {
    expect(mergeTranscriptSegments(
      [{ start: 294, end: 300, text: 'We checked the result.' }],
      [{ start: 298, end: 304, text: '... the , result ! Now proceed.' }],
    ).map(({ text }) => text)).toEqual(['We checked the result.', 'Now proceed.']);
  });

  it.each([
    ['\u8bf7\u68c0\u67e5\u7ed3\u679c\u3002', '\u7ed3\u679c\uff0c\u7136\u540e\u7ee7\u7eed\u3002', '\u7136\u540e\u7ee7\u7eed\u3002'],
    ['\u7d50\u679c\u3092\u78ba\u8a8d\u3057\u307e\u3059\u3002', '\u78ba\u8a8d\u3057\u307e\u3059\u3002\u6b21\u306b\u9032\u307f\u307e\u3059\u3002', '\u6b21\u306b\u9032\u307f\u307e\u3059\u3002'],
  ])('aligns unspaced CJK at a real source boundary: %s', (previous, next, remainder) => {
    expect(mergeTranscriptSegments(
      [{ start: 294, end: 300, text: previous }],
      [{ start: 298, end: 304, text: next }],
    ).map(({ text }) => text)).toEqual([previous, remainder]);
    expect(mergeTranscriptSegments(
      [{ start: 0, end: 1, text: previous }],
      [{ start: 10, end: 11, text: previous }],
    )).toHaveLength(2);
  });

  it('matches a 295-300 second boundary split across completed segments', () => {
    const completed = [
      { start: 292, end: 297, text: 'We will check the' },
      { start: 297, end: 300, text: 'result carefully.' },
    ];
    expect(mergeTranscriptSegments(completed, [
      { start: 295, end: 304, text: 'check the result carefully. Then continue.' },
    ])).toEqual([...completed, { start: 300, end: 304, text: 'Then continue.' }]);
  });

  it('matches overlap when the incoming block segments the same sentence differently', () => {
    const completed = [{ start: 294, end: 300, text: 'We check the result carefully.' }];
    expect(mergeTranscriptSegments(completed, [
      { start: 295, end: 297, text: 'check the' },
      { start: 297, end: 304, text: 'result carefully. Then continue.' },
    ])).toEqual([...completed, { start: 300, end: 304, text: 'Then continue.' }]);
  });

  it('aligns CJK tokens next to Latin text without requiring whitespace', () => {
    expect(mergeTranscriptSegments(
      [{ start: 294, end: 300, text: 'Check\u7ed3\u679c\u3002' }],
      [{ start: 298, end: 304, text: '\u7ed3\u679c\uff0cOK.' }],
    ).map(({ text }) => text)).toEqual(['Check\u7ed3\u679c\u3002', 'OK.']);
  });

  it('does not treat punctuation-only text as a matching spoken token', () => {
    expect(mergeTranscriptSegments(
      [{ start: 0, end: 3, text: '...' }],
      [{ start: 2, end: 4, text: '!' }],
    ).map(({ text }) => text)).toEqual(['...', '!']);
  });
});

const asrFixture = vi.hoisted(() => ({
  result: { text: '', chunks: [] as { text: string; timestamp: [unknown, unknown] }[] },
}));
vi.mock('@huggingface/transformers', () => ({
  env: { version: '4.2.0' },
  pipeline: async () => Object.assign(async () => asrFixture.result, {
    dispose: async () => {}, model: { _generate_with_seek: () => { throw new Error('No real model in this fixture'); } },
  }),
}));

describe('browser transcriber ASR worker timestamps (fake inference, actual worker)', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

  it.each([null, undefined, NaN, -1, Infinity, '9'])('retains all text with uncertain rather than fabricated word timing for end %s', async (end) => {
    const events: { type: string; segments?: TranscriptSegment[] }[] = [];
    let dispatch: (event: { data: unknown }) => Promise<void>;
    vi.stubGlobal('self', {
      postMessage: (event: typeof events[number]) => events.push(event),
      addEventListener: (_: string, listener: typeof dispatch) => { dispatch = listener; },
    });
    asrFixture.result = { text: 'First Second', chunks: [
      { text: 'First', timestamp: [2, end] },
      { text: ' Second', timestamp: [5, end] },
    ] };
    await import('../workers/transcriber-asr.worker');
    await dispatch!({ data: { type: 'load', model: 'english', backend: 'wasm' } });
    await dispatch!({ data: {
      type: 'transcribe', model: 'english', language: 'en', audio: new Float32Array(160_000).buffer,
      block: { index: 1, start: 295, end: 305 },
    } });
    expect(events.at(-1)).toMatchObject({ type: 'transcribed', segments: [
      { start: 295, end: 305, text: 'First Second', overlapNeedsReview: true },
    ] });
    expect(events.at(-1)!.segments!.every(segment => segment.words === undefined)).toBe(true);
  });

  it('retains unknown and out-of-range text without claiming precise alignment', async () => {
    const events: { type: string; segments?: TranscriptSegment[] }[] = [];
    let dispatch: (event: { data: unknown }) => Promise<void>;
    vi.stubGlobal('self', {
      postMessage: (event: typeof events[number]) => events.push(event),
      addEventListener: (_: string, listener: typeof dispatch) => { dispatch = listener; },
    });
    asrFixture.result = { text: 'Valid Clipped At boundary Outside', chunks: [
      { text: 'Valid', timestamp: [1, 3] },
      { text: ' Clipped', timestamp: [5, 99] },
      { text: ' At boundary', timestamp: [10, null] },
      { text: ' Outside', timestamp: [30, null] },
    ] };
    await import('../workers/transcriber-asr.worker');
    await dispatch!({ data: { type: 'load', model: 'english', backend: 'wasm' } });
    await dispatch!({ data: {
      type: 'transcribe', model: 'english', language: 'en', audio: new Float32Array(160_000).buffer,
      block: { index: 1, start: 295, end: 305 },
    } });
    expect(events.at(-1)).toMatchObject({ type: 'transcribed', segments: [
      { start: 295, end: 305, text: asrFixture.result.text, overlapNeedsReview: true },
    ] });
    expect(events.at(-1)!.segments!.every(segment => segment.words === undefined)).toBe(true);
  });
});

describe('browser transcriber exports', () => {
  const segments: TranscriptSegment[] = [
    { start: 1.234, end: 3.5, text: 'First line' },
    { start: 65, end: 67.25, text: 'Second line --> checked' },
  ];

  it('builds TXT, SRT, and WebVTT documents with valid timestamps', () => {
    const downloads = createTranscriptDownloads(segments);
    expect(downloads.txt).toBe('First line\n\nSecond line --> checked\n');
    expect(downloads.srt).toContain('00:00:01,234 --> 00:00:03,500');
    expect(downloads.srt).toContain('Second line --> checked');
    expect(downloads.vtt.startsWith('WEBVTT\n\n')).toBe(true);
    expect(downloads.vtt).toContain('00:01:05.000 --> 00:01:07.250');
    expect(downloads.vtt).toContain('Second line --&gt; checked');
  });

  it('sanitizes a cross-platform filename and keeps one extension', () => {
    expect(sanitizeTranscriptFilename('  Client: call?  ', 'srt')).toBe('Client call.srt');
    expect(sanitizeTranscriptFilename('notes.txt', 'txt')).toBe('notes.txt');
    expect(sanitizeTranscriptFilename('CON', 'vtt')).toBe('transcript.vtt');
  });
});

describe('browser transcriber input limits', () => {
  it('accepts a supported media filename below the size limit', () => {
    expect(
      validateMediaCandidate({ name: 'meeting.webm', size: 5_000, type: 'video/webm' }),
    ).toEqual({ ok: true });
  });

  it('rejects unsupported extensions and oversized files', () => {
    expect(validateMediaCandidate({ name: 'notes.txt', size: 20, type: 'text/plain' })).toMatchObject({
      ok: false,
      code: 'unsupported_file',
    });
    expect(
      validateMediaCandidate({ name: 'recording.mp3', size: MAX_TRANSCRIBER_BYTES + 1, type: 'audio/mpeg' }),
    ).toMatchObject({ ok: false, code: 'file_too_large' });
  });

  it('publishes the one-hour duration limit as a stable constant', () => {
    expect(MAX_TRANSCRIBER_DURATION_SECONDS).toBe(60 * 60);
  });
});
