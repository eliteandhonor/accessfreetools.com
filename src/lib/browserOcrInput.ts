export const OCR_IMAGE_LIMITS = { maxBytes: 10 * 1024 * 1024, maxPixels: 8_000_000, maxDimension: 8192 } as const;

interface ImageHeader { width: number; height: number; mime: string }
const damaged = () => new Error('This image is damaged or unsupported. Try exporting it as PNG, JPEG, or WebP.');

function checkBytes(size: number) {
  if (!Number.isSafeInteger(size) || size <= 0) throw damaged();
  if (size > OCR_IMAGE_LIMITS.maxBytes) throw new Error('Choose an image of 10 MiB or less.');
}

function dimensions(width: number, height: number, mime: string): ImageHeader {
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0) throw damaged();
  if (width > OCR_IMAGE_LIMITS.maxDimension || height > OCR_IMAGE_LIMITS.maxDimension || width > OCR_IMAGE_LIMITS.maxPixels / height) {
    throw new Error('Resize this image to 8 million pixels or less, with each side no longer than 8192 pixels.');
  }
  return { width, height, mime };
}

export function validateOcrFile(file: File | null): asserts file is File {
  if (!file) throw new Error('Choose an image file before running OCR.');
  checkBytes(file.size);
  if (file.type && !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a PNG, JPEG, or WebP image. Export other formats as PNG first.');
  }
}

// Read encoded headers before any browser decoder, canvas or OCR allocation.
// Walk the containers too: secondary frames must not hide a larger image.
export function inspectOcrImage(bytes: Uint8Array): ImageHeader {
  checkBytes(bytes.byteLength);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const need = (offset: number, length: number) => {
    if (offset < 0 || length < 0 || offset + length > bytes.length) throw damaged();
  };
  const u8 = (offset: number) => { need(offset, 1); return view.getUint8(offset); };
  const u16 = (offset: number, le = false) => { need(offset, 2); return view.getUint16(offset, le); };
  const u32 = (offset: number, le = false) => { need(offset, 4); return view.getUint32(offset, le); };
  const u24 = (offset: number) => u8(offset) + u8(offset + 1) * 256 + u8(offset + 2) * 65536;
  const tag = (offset: number) => String.fromCharCode(u8(offset), u8(offset + 1), u8(offset + 2), u8(offset + 3));
  const animated = () => new Error('Choose a still image. Export one frame of an animated image as PNG first.');

  if ([137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte)) {
    if (u32(8) !== 13 || tag(12) !== 'IHDR') throw damaged();
    const header = dimensions(u32(16), u32(20), 'image/png');
    let sawData = false;
    for (let offset = 8; offset < bytes.length;) {
      const size = u32(offset); const type = tag(offset + 4);
      need(offset, size + 12);
      if (['acTL', 'fcTL', 'fdAT'].includes(type)) throw animated();
      if (type === 'IHDR' && offset !== 8) throw damaged();
      if (type === 'IDAT') sawData = true;
      offset += size + 12;
      if (type === 'IEND') {
        if (size !== 0 || !sawData || offset !== bytes.length) throw damaged();
        return header;
      }
    }
    throw damaged();
  }

  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let header: ImageHeader | undefined;
    let inScan = false; let sawScan = false; let offset = 2;
    while (offset < bytes.length) {
      if (u8(offset++) !== 0xff) { if (inScan) continue; throw damaged(); }
      while (u8(offset) === 0xff) offset++;
      const marker = u8(offset++);
      if (inScan && (marker === 0 || (marker >= 0xd0 && marker <= 0xd7))) continue;
      inScan = false;
      if (marker === 0xd9) {
        if (!header || !sawScan || offset !== bytes.length) throw damaged();
        return header;
      }
      // DNL can redefine image height; additional frames and non-8-bit JPEG are not supported.
      if (marker === 0 || marker === 0xd8 || marker === 0xdc) throw damaged();
      const size = u16(offset); need(offset, size);
      if (size < 2) throw damaged();
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        if (header || ![0xc0, 0xc2].includes(marker) || size < 8 || u8(offset + 2) !== 8) throw damaged();
        header = dimensions(u16(offset + 5), u16(offset + 3), 'image/jpeg');
        if (size !== 8 + 3 * u8(offset + 7)) throw damaged();
      }
      if (marker === 0xda) {
        if (!header || size < 6 || size !== 6 + 2 * u8(offset + 2)) throw damaged();
        inScan = true; sawScan = true;
      }
      offset += size;
    }
    throw damaged();
  }

  if (bytes.length >= 12 && tag(0) === 'RIFF' && tag(8) === 'WEBP') {
    if (u32(4, true) + 8 !== bytes.length) throw damaged();
    let canvas: ImageHeader | undefined; let frame: ImageHeader | undefined;
    for (let offset = 12; offset < bytes.length;) {
      const type = tag(offset); const size = u32(offset + 4, true); const data = offset + 8;
      need(data, size + (size % 2));
      if (type === 'ANIM' || type === 'ANMF') throw animated();
      if (type === 'VP8X') {
        if (canvas || offset !== 12 || size !== 10) throw damaged();
        if (u8(data) & 2) throw animated();
        if ((u8(data) & 0xc1) || u24(data + 1)) throw damaged();
        canvas = dimensions(u24(data + 4) + 1, u24(data + 7) + 1, 'image/webp');
      }
      if (type === 'VP8 ' || type === 'VP8L') {
        if (frame) throw damaged();
        if (type === 'VP8 ') {
          if (size < 10 || (u8(data) & 1) || u24(data + 3) !== 0x2a019d) throw damaged();
          frame = dimensions(u16(data + 6, true) & 0x3fff, u16(data + 8, true) & 0x3fff, 'image/webp');
        } else {
          if (size < 5 || u8(data) !== 0x2f || (u8(data + 4) & 0xe0)) throw damaged();
          const packed = u32(data + 1, true);
          frame = dimensions((packed & 0x3fff) + 1, ((packed >>> 14) & 0x3fff) + 1, 'image/webp');
        }
      }
      offset = data + size + (size % 2);
    }
    if (!frame || (canvas && (canvas.width !== frame.width || canvas.height !== frame.height))) throw damaged();
    return frame;
  }
  throw damaged();
}

export async function prepareOcrImage(file: File | null, signal: AbortSignal): Promise<Uint8Array<ArrayBuffer>> {
  signal.throwIfAborted();
  validateOcrFile(file);
  const buffer = await file.arrayBuffer();
  signal.throwIfAborted();
  const header = inspectOcrImage(new Uint8Array(buffer));
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([buffer], { type: header.mime }));
  } catch {
    signal.throwIfAborted();
    throw damaged();
  }
  let canvas: HTMLCanvasElement | undefined;
  try {
    signal.throwIfAborted();
    dimensions(bitmap.width, bitmap.height, header.mime);
    // EXIF orientation can swap width and height but cannot change the pixel count.
    if (!((bitmap.width === header.width && bitmap.height === header.height)
      || (bitmap.width === header.height && bitmap.height === header.width))) throw damaged();
    canvas = document.createElement('canvas');
    canvas.width = bitmap.width; canvas.height = bitmap.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Image reading is not available in this browser. Try another browser.');
    context.drawImage(bitmap, 0, 0);
    // Give Tesseract a bounded, browser-encoded still PNG, not the untrusted container.
    const png = await new Promise<Blob | null>(resolve => canvas!.toBlob(resolve, 'image/png'));
    signal.throwIfAborted();
    if (!png || png.size > OCR_IMAGE_LIMITS.maxPixels * 4 + 65536) throw damaged();
    const image = new Uint8Array(await png.arrayBuffer());
    signal.throwIfAborted();
    return image;
  } finally {
    bitmap.close();
    if (canvas) { canvas.width = 0; canvas.height = 0; }
  }
}
