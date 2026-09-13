import { describe, expect, it, vi } from 'vitest';

import { inspectOcrImage, OCR_IMAGE_LIMITS, prepareOcrImage, validateOcrFile } from './browserOcrInput';

const be32 = (value: number) => [value >>> 24, (value >>> 16) & 255, (value >>> 8) & 255, value & 255];
const le32 = (value: number) => be32(value).reverse();
const ascii = (text: string) => Array.from(Buffer.from(text));
const chunk = (type: string, data: number[]) => [...be32(data.length), ...ascii(type), ...data, 0, 0, 0, 0];
const png = (width = 120, height = 40, extra: number[] = []) => new Uint8Array([
  137, 80, 78, 71, 13, 10, 26, 10,
  ...chunk('IHDR', [...be32(width), ...be32(height), 8, 2, 0, 0, 0]),
  ...extra, ...chunk('IDAT', [1]), ...chunk('IEND', []),
]);
const jpeg = (width = 120, height = 40, marker = 0xc0) => new Uint8Array([
  255, 216, 255, marker, 0, 17, 8, height >>> 8, height & 255, width >>> 8, width & 255,
  3, 1, 0x11, 0, 2, 0x11, 0, 3, 0x11, 0,
  255, 218, 0, 12, 3, 1, 0, 2, 0x11, 3, 0x11, 0, 63, 0,
  42, 255, 0, 42, 255, 208, 42, 255, 217,
]);
const webpChunk = (type: string, data: number[]) => [...ascii(type), ...le32(data.length), ...data, ...(data.length % 2 ? [0] : [])];
const webp = (chunks: number[]) => new Uint8Array([...ascii('RIFF'), ...le32(chunks.length + 4), ...ascii('WEBP'), ...chunks]);
const vp8 = (width = 120, height = 40) => webpChunk('VP8 ', [0x10, 0, 0, 0x9d, 1, 0x2a, width & 255, width >>> 8, height & 255, height >>> 8]);
const vp8l = (width = 120, height = 40) => webpChunk('VP8L', [0x2f, ...le32((width - 1) | ((height - 1) << 14))]);
const vp8x = (width = 120, height = 40, flags = 0) => webpChunk('VP8X', [flags, 0, 0, 0, ...le32(width - 1).slice(0, 3), ...le32(height - 1).slice(0, 3)]);

describe('OCR encoded image headers (synthetic structure, not decoder fixtures)', () => {
  it.each([
    ['PNG', png(), 'image/png'], ['baseline JPEG', jpeg(), 'image/jpeg'],
    ['progressive JPEG', jpeg(120, 40, 0xc2), 'image/jpeg'],
    ['lossy WebP', webp(vp8()), 'image/webp'], ['lossless WebP', webp(vp8l()), 'image/webp'],
    ['extended WebP', webp([...vp8x(), ...vp8()]), 'image/webp'],
  ])('reads bounded %s dimensions from bytes, not filenames', (_name, bytes, mime) => {
    expect(inspectOcrImage(bytes as Uint8Array)).toEqual({ width: 120, height: 40, mime });
  });

  it.each([
    ['PNG pixels', png(4000, 2001)], ['PNG edge', png(8193, 1)], ['PNG zero', png(0, 1)],
    ['PNG uint32 dimensions', png(0xffffffff, 0xffffffff)],
    ['JPEG pixels', jpeg(4000, 2001)], ['JPEG edge', jpeg(8193, 1)], ['JPEG zero', jpeg(0, 1)],
    ['WebP pixels', webp(vp8(4000, 2001))], ['WebP edge', webp(vp8l(8193, 1))],
    ['extended WebP pixels', webp([...vp8x(0xffffff, 0xffffff), ...vp8()])],
  ])('rejects %s without decoding', (_name, bytes) => {
    expect(() => inspectOcrImage(bytes as Uint8Array)).toThrow(/8 million|8192|damaged/i);
  });

  it('allows exact pixel and edge bounds', () => {
    expect(inspectOcrImage(png(4000, 2000)).width).toBe(4000);
    expect(inspectOcrImage(png(8192, 1)).width).toBe(8192);
  });

  it.each([
    ['truncated PNG', png().slice(0, 24)], ['missing PNG image', png().slice(0, 33)],
    ['duplicate PNG header', png(120, 40, chunk('IHDR', [...be32(120), ...be32(40), 8, 2, 0, 0, 0]))],
    ['animated PNG', png(120, 40, chunk('acTL', [...be32(2), ...be32(0)]))],
    ['PNG chunk length overflow', new Uint8Array([...png().slice(0, 33), ...be32(0xffffffff), ...ascii('IDAT')])],
    ['truncated JPEG', jpeg().slice(0, -2)], ['JPEG segment overflow', new Uint8Array([255,216,255,224,255,255,1])],
    ['duplicate JPEG frame', new Uint8Array([...jpeg().slice(0, -2), ...jpeg().slice(2)])],
    ['JPEG deferred height', new Uint8Array([...jpeg().slice(0, -2), 255,220,0,4,0,40,255,217])],
    ['truncated WebP', webp(vp8()).slice(0, -1)],
    ['WebP duplicate bitstream', webp([...vp8(), ...vp8l()])],
    ['WebP mismatched canvas', webp([...vp8x(1, 1), ...vp8()])],
    ['WebP animation flag', webp([...vp8x(120, 40, 2), ...vp8()])],
    ['WebP animation chunk', webp([...vp8x(), ...webpChunk('ANIM', [0,0,0,0,0,0]), ...vp8()])],
    ['WebP oversized chunk', webp([...ascii('VP8 '), ...le32(0xffffffff), 0])],
    ['unknown bytes', new Uint8Array([1,2,3,4])],
  ])('rejects %s safely', (_name, bytes) => {
    expect(() => inspectOcrImage(bytes as Uint8Array)).toThrow(/damaged|PNG|animated/i);
  });

  it('rejects truncated prefixes of every supported header without leaking RangeError', () => {
    for (const bytes of [png(), jpeg(), webp(vp8()), webp(vp8l()), webp([...vp8x(), ...vp8()])]) {
      for (let size = 0; size < bytes.length; size++) {
        expect(() => inspectOcrImage(bytes.slice(0, size))).toThrow(Error);
        try { inspectOcrImage(bytes.slice(0, size)); } catch (error) { expect(error).not.toBeInstanceOf(RangeError); }
      }
    }
  });
});

describe('OCR byte preflight', () => {
  it.each([
    ['oversized', { size: OCR_IMAGE_LIMITS.maxBytes + 1, type: 'image/png' }],
    ['empty', { size: 0, type: 'image/png' }],
    ['unsupported', { size: 10, type: 'image/svg+xml' }],
    ['missing file', null],
  ])('rejects %s before reading bytes', async (_name, metadata) => {
    const arrayBuffer = vi.fn();
    const file = metadata ? { ...metadata, arrayBuffer } as unknown as File : null;
    await expect(prepareOcrImage(file, new AbortController().signal)).rejects.toThrow();
    expect(arrayBuffer).not.toHaveBeenCalled();
  });

  it('accepts unknown MIME for header sniffing and the exact byte limit', () => {
    expect(() => validateOcrFile({ size: OCR_IMAGE_LIMITS.maxBytes, type: '' } as File)).not.toThrow();
  });

  it('checks actual byte length and does not trust file metadata alone', async () => {
    const file = { size: 10, type: 'image/png', arrayBuffer: vi.fn(async () => new ArrayBuffer(OCR_IMAGE_LIMITS.maxBytes + 1)) } as unknown as File;
    await expect(prepareOcrImage(file, new AbortController().signal)).rejects.toThrow(/10 MB/);
  });

  it('does not read an already cancelled input', async () => {
    const controller = new AbortController(); controller.abort();
    const arrayBuffer = vi.fn();
    await expect(prepareOcrImage({ size: 10, type: 'image/png', arrayBuffer } as unknown as File, controller.signal)).rejects.toThrow();
    expect(arrayBuffer).not.toHaveBeenCalled();
  });
});
