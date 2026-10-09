import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve, relative } from 'node:path';
import sharp from 'sharp';
import { EditorialHold } from './daily-editorial-pipeline.mjs';
import { approvedDailyEditorialArtwork, artworkJsonHash, dailyArtworkPaths, generationEvidenceFor, visualEvidenceFor } from './daily-editorial-artwork.mjs';

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const held = () => new EditorialHold('ARTWORK_APPROVAL_HELD');

// Fixed paths stay within the checkout. Every component must be a real
// directory/file; a review cannot approve symlinks to different external bytes.
async function checkedPath(root, path, { file = true } = {}) {
  const base = resolve(root), destination = resolve(base, path);
  const parts = relative(base, destination).split(/[\\/]/u);
  if (!parts.length || parts.some((part) => !part || part === '..' || part === '.')) throw held();
  const rootInfo = await lstat(base);
  if (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()) throw held();
  let current = base;
  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    const info = await lstat(current);
    if (info.isSymbolicLink() || (index === parts.length - 1 && file ? !info.isFile() : !info.isDirectory())) throw held();
  }
  return destination;
}

async function boundedFile(root, path, maximum) {
  const absolute = await checkedPath(root, path);
  const info = await lstat(absolute);
  if (info.size < 1 || info.size > maximum) throw held();
  const bytes = await readFile(absolute);
  if (bytes.length !== info.size || bytes.length > maximum) throw held();
  return { absolute, bytes };
}

export async function verifyDailyEditorialArtwork(article, { root, articleSha256, location = 'prepared' } = {}) {
  try {
    if (typeof root !== 'string' || !root.trim() || !['prepared', 'public'].includes(location)) throw held();
    const manifest = await boundedFile(root, 'src/data/dailyEditorialArtApprovals.json', 1024 * 1024);
    const bound = { ...article, artwork: { articleSha256: articleSha256 ?? article.artwork?.articleSha256 } };
    const approval = approvedDailyEditorialArtwork(bound, JSON.parse(manifest.bytes.toString('utf8')));
    if (!approval) throw held();
    const paths = dailyArtworkPaths(article.slug);
    for (const [type, expected] of [['provenance', generationEvidenceFor(approval)], ['visualReview', visualEvidenceFor(approval)]]) {
      const evidence = approval[type];
      const { bytes } = await boundedFile(root, evidence.evidencePath, 32 * 1024);
      if (hash(bytes) !== evidence.evidenceSha256 || artworkJsonHash(JSON.parse(bytes.toString('utf8'))) !== artworkJsonHash(expected)) throw held();
    }
    const files = [];
    for (const format of ['png', 'webp']) {
      const path = location === 'prepared' ? paths[`${format}Input`] : `public${format === 'png' ? paths.imagePath : paths.webpPath}`;
      const { absolute, bytes } = await boundedFile(root, path, 5 * 1024 * 1024);
      if (bytes.length !== approval.assets[format].bytes || hash(bytes) !== approval.assets[format].sha256) throw held();
      const hasHeader = format === 'png' ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
      if (!hasHeader) throw held();
      const metadata = await sharp(bytes, { limitInputPixels: 1200 * 630, failOn: 'warning' }).metadata();
      if (metadata.format !== format || metadata.width !== approval.width || metadata.height !== approval.height ||
          (metadata.pages ?? 1) !== 1 || (metadata.orientation ?? 1) !== 1) throw held();
      // Header metadata alone can describe a truncated/corrupt image. Fully
      // decode bounded pixels before any reviewed bytes are publicly copied.
      await sharp(bytes, { limitInputPixels: 1200 * 630, failOn: 'warning' }).raw().toBuffer();
      files.push({ name: `daily-${article.slug}.${format}`, path: absolute, sha256: approval.assets[format].sha256, bytes });
    }
    return { imagePath: approval.imagePath, webpPath: approval.webpPath, alt: approval.alt, caption: approval.caption,
      width: approval.width, height: approval.height, approval, files };
  } catch { throw held(); }
}

// Publication copies only reviewed prepared bytes. It never generates artwork
// or turns automated format/crop checks into visual approval.
export async function createDailyEditorialAssets(article, options = {}) {
  const approved = await verifyDailyEditorialArtwork(article, options);
  const root = resolve(options.root), directory = join(root, 'public/social');
  // Validate existing ancestors and targets before any mkdir/write.
  for (const path of ['public', 'public/social', ...approved.files.map((file) => `public/social/${file.name}`)]) {
    try { await checkedPath(root, path, { file: path.endsWith('.png') || path.endsWith('.webp') }); }
    catch (error) {
      if (error.code !== 'ENOENT') throw held();
      const parts = path.split('/');
      for (let length = 1; length < parts.length; length++) {
        try { await checkedPath(root, parts.slice(0, length).join('/'), { file: false }); }
        catch (ancestorError) { if (ancestorError.code !== 'ENOENT') throw held(); }
      }
    }
  }
  await mkdir(directory, { recursive: true });
  const files = [];
  for (const file of approved.files) {
    const path = join(directory, file.name);
    await writeFile(path, file.bytes);
    files.push({ name: file.name, path, sha256: file.sha256 });
  }
  return { imagePath: approved.imagePath, webpPath: approved.webpPath, alt: approved.alt, caption: approved.caption,
    width: approved.width, height: approved.height, approval: approved.approval, files };
}

export async function auditDailyEditorialPublicAssets(root, articles) {
  const issues = [];
  for (const article of articles) {
    try { await verifyDailyEditorialArtwork(article, { root, location: 'public' }); }
    catch { issues.push(`${article.slug}: artwork approval or exact reviewed bytes missing/mismatched`); }
  }
  const expected = new Set(articles.flatMap((article) => ['png', 'webp'].map((format) => `daily-${article.slug}.${format}`)));
  try {
    const directory = await checkedPath(root, 'public/social', { file: false });
    for (const name of await readdir(directory)) if (name.startsWith('daily-') && !expected.has(name)) issues.push(`Orphan or unsupported daily artwork: ${name}`);
  } catch (error) { if (error.code !== 'ENOENT') issues.push('Daily artwork public directory is unsafe'); }
  return issues;
}
