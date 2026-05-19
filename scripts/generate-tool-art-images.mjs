import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createToolArtEntries, readCanonicalTools, rootDir, writeJsonReport } from './lib/tool-art-manifest.mjs';

const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : 24;
const categoryArg = process.argv.find((arg) => arg.startsWith('--category='));
const category = categoryArg ? categoryArg.split('=')[1] : null;
const slugArg = process.argv.find((arg) => arg.startsWith('--slug='));
const slug = slugArg ? slugArg.split('=')[1] : null;

function ensureDir(path) {
  mkdirSync(dirname(path), { recursive: true });
}

function promptBlock(entry) {
  return [
    `Asset: ${entry.toolName} ${entry.kind} image`,
    `Target path after approval: public${entry.imagePath}`,
    `Thumbnail path after approval: public${entry.thumbnailPath}`,
    '',
    entry.prompt,
    '',
    'Extra quality requirements:',
    '- Match the user-approved reference direction: a visible cute smoke mascot character, not just fog.',
    '- Make the utility concept clear through props or gestures, but do not include readable text.',
    '- Keep it G-rated, soft, memorable, and distinct from the matching tool/guide image.',
    '- Leave enough clean background for a 1200x630 web feature image crop.',
  ].join('\n');
}

const entries = createToolArtEntries(readCanonicalTools())
  .filter((entry) => !category || entry.category === category)
  .filter((entry) => !slug || entry.slug === slug)
  .filter((entry) => entry.status !== 'approved' || entry.qaStatus !== 'approved')
  .slice(0, Number.isFinite(limit) ? limit : 24);

const queue = {
  generatedAt: new Date().toISOString(),
  note: 'This command prepares GPT Image prompts only. It does not create placeholder art or approve public images.',
  nextStep:
    'Generate these prompts with GPT Image, save reviewed assets to public/tool-art/, create thumbnails, then mark exact entries approved after visual QA.',
  entries,
};

const jsonPath = resolve(rootDir, 'output/tool-art-gpt-image-queue.json');
const mdPath = resolve(rootDir, 'output/tool-art-gpt-image-queue.md');
ensureDir(jsonPath);
writeJsonReport(jsonPath, queue);
writeFileSync(
  mdPath,
  [
    '# GPT Image Tool Art Queue',
    '',
    queue.note,
    '',
    `Entries included: ${entries.length}`,
    category ? `Category filter: ${category}` : 'Category filter: none',
    slug ? `Slug filter: ${slug}` : 'Slug filter: none',
    '',
    '## Prompts',
    '',
    ...entries.flatMap((entry, index) => [`### ${index + 1}. ${entry.toolName} ${entry.kind}`, '', promptBlock(entry), '']),
  ].join('\n'),
);

if (!existsSync(jsonPath) || !existsSync(mdPath)) {
  console.error('Failed to write GPT Image tool art queue.');
  process.exit(1);
}

console.log(`Prepared ${entries.length} GPT Image prompt(s).`);
console.log('Wrote output/tool-art-gpt-image-queue.json');
console.log('Wrote output/tool-art-gpt-image-queue.md');
