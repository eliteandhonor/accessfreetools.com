import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';
import {
  createToolArtEntries,
  readCanonicalTools,
  rootDir,
  writeManifestOutputs,
} from './lib/tool-art-manifest.mjs';

const args = new Map(
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith('--') && arg.includes('='))
    .map((arg) => {
      const [key, ...value] = arg.slice(2).split('=');
      return [key, value.join('=')];
    }),
);

const slug = args.get('slug');
const kind = args.get('kind');
const source = args.get('source');

if (!slug || !kind || !source) {
  console.error('Usage: node scripts/approve-tool-art.mjs --slug=percentage-calculator --kind=tool --source=C:\\path\\image.png');
  process.exit(1);
}

if (!['tool', 'guide'].includes(kind)) {
  console.error('--kind must be tool or guide.');
  process.exit(1);
}

const sourcePath = resolve(source);
if (!existsSync(sourcePath)) {
  console.error(`Source image is missing: ${sourcePath}`);
  process.exit(1);
}

const entries = createToolArtEntries(readCanonicalTools());
const entry = entries.find((candidate) => candidate.slug === slug && candidate.kind === kind);
if (!entry) {
  console.error(`No tool art manifest entry found for ${slug} ${kind}.`);
  process.exit(1);
}

const imagePath = resolve(rootDir, `public${entry.imagePath}`);
const thumbnailPath = resolve(rootDir, `public${entry.thumbnailPath}`);
mkdirSync(dirname(imagePath), { recursive: true });
mkdirSync(dirname(thumbnailPath), { recursive: true });

await sharp(sourcePath)
  .resize(1200, 630, { fit: 'contain', background: '#0c1119' })
  .webp({ quality: 86 })
  .toFile(imagePath);

await sharp(sourcePath)
  .resize(480, 252, { fit: 'contain', background: '#0c1119' })
  .webp({ quality: 78 })
  .toFile(thumbnailPath);

const approvalsPath = resolve(rootDir, 'src/data/toolArtApprovals.json');
const approvals = existsSync(approvalsPath) ? JSON.parse(readFileSync(approvalsPath, 'utf8')) : [];
const filtered = approvals.filter((approval) => !(approval.slug === slug && approval.kind === kind));
filtered.push({
  slug,
  kind,
  imagePath: entry.imagePath,
  thumbnailPath: entry.thumbnailPath,
  status: 'approved',
  qaStatus: 'approved',
});
filtered.sort((a, b) => `${a.slug}:${a.kind}`.localeCompare(`${b.slug}:${b.kind}`));
writeFileSync(approvalsPath, `${JSON.stringify(filtered, null, 2)}\n`);

writeManifestOutputs(createToolArtEntries(readCanonicalTools()));

console.log(`Approved ${slug} ${kind} artwork.`);
console.log(`Wrote public${entry.imagePath}`);
console.log(`Wrote public${entry.thumbnailPath}`);
