const MAX_ARCHIVE_FILES = 100;
const MAX_ARCHIVE_AUDIO_BYTES = 64 * 1024 * 1024;

export interface BrowserTtsArchiveFile {
  audio: ArrayBuffer;
  filename: string;
}

function assertPortableMp3Name(value: string) {
  if (!value.toLowerCase().endsWith('.mp3')) throw new Error('Every chapter archive entry must be an MP3.');
  if (!value || value.length > 120 || /[<>:"/\\|?*\u0000-\u001f]/.test(value) || value.includes('..')) {
    throw new Error('A chapter MP3 has an unsafe archive filename.');
  }
}

export function sanitizeBrowserTtsZipFilename(value: string) {
  const base = value
    .normalize('NFKC')
    .trim()
    .replace(/\.zip$/i, '')
    .replace(/[<>:"/\\|?*\u0000-\u001f]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[. -]+|[. -]+$/g, '')
    .slice(0, 80)
    .trim()
    .replace(/[. -]+$/g, '');
  return `${base || 'audiobook-chapters'}.zip`;
}

export async function createBrowserTtsChapterZip(files: readonly BrowserTtsArchiveFile[]) {
  if (files.length === 0) throw new Error('Generate at least one chapter MP3 before creating a ZIP.');
  if (files.length > MAX_ARCHIVE_FILES) throw new Error(`A ZIP can contain no more than ${MAX_ARCHIVE_FILES} chapter MP3s.`);

  const seen = new Set<string>();
  let totalBytes = 0;
  for (const file of files) {
    assertPortableMp3Name(file.filename);
    const folded = file.filename.toLocaleLowerCase('en-US');
    if (seen.has(folded)) throw new Error('Chapter MP3 filenames must be unique.');
    seen.add(folded);
    totalBytes += file.audio.byteLength;
    if (totalBytes > MAX_ARCHIVE_AUDIO_BYTES) throw new Error('The chapter MP3 set is too large to package safely in this browser.');
  }

  const { BlobWriter, Uint8ArrayReader, ZipWriter } = await import('@zip.js/zip.js');
  const writer = new ZipWriter(new BlobWriter('application/zip'), {
    bufferedWrite: true,
    useWebWorkers: false,
  });
  try {
    for (const file of files) {
      await writer.add(file.filename, new Uint8ArrayReader(new Uint8Array(file.audio)), {
        level: 0,
        useWebWorkers: false,
      });
    }
    return await writer.close();
  } catch (error) {
    await writer.close().catch(() => undefined);
    throw error;
  }
}
