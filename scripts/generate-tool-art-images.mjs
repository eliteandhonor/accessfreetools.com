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

function guideSourceForTool(tool) {
  if (!tool) return 'src/data/blogPosts.ts or the matching generated guide data file';
  if (tool.sourceFile === 'src/data/financeTools.ts') return 'src/data/financeBlogGuides.ts';
  if (tool.sourceFile === 'src/data/healthTools.ts') return 'src/data/healthBlogGuides.ts';
  if (tool.sourceFile === 'src/data/aiTools.ts') return 'src/data/aiBlogGuides.ts';
  if (tool.sourceFile === 'src/data/utilityTools.ts') return 'src/data/utilityBlogGuides.ts';
  return 'src/data/blogPosts.ts';
}

function promptBlock(entry, tool) {
  return [
    `Asset: ${entry.toolName} ${entry.kind} image`,
    `Target path after approval: public${entry.imagePath}`,
    `Thumbnail path after approval: public${entry.thumbnailPath}`,
    `Tool page to research: ${entry.pagePath}`,
    `Primary source to read first: ${tool?.sourceFile ?? 'unknown tool source'}`,
    `Matching guide source to read: ${guideSourceForTool(tool)}`,
    '',
    'Research before generating:',
    '- Read the exact tool definition: summary, description, examples, FAQ/formula wording, use cases, related tools, and any input explanations.',
    '- Read the matching guide source and page copy for the tool-specific walkthrough.',
    '- If the tool behavior is still unclear, inspect the relevant runner/calculator logic before writing the image prompt.',
    '- Write a short visual brief: exact inputs, main output, formula/logic, example scenario, and 3-6 props/shapes that represent this exact tool without readable text.',
    '- Reject prompts that could fit a different nearby tool by only swapping the title.',
    '',
    entry.prompt,
    '',
    'Extra quality requirements:',
    '- Match the established Access Free Tools mascot from approved art: translucent pale grey-white smoky chibi girl, wispy hair, dress-like smoke body, heart-shaped chest glow, tiny hands, and lower floating smoke tail.',
    '- Do not redesign the mascot as a purple ghost, blob, generic spirit, animal, robot, or unrelated character.',
    '- Make the exact utility concept clear through props, gestures, inputs, outputs, formula shapes, units, or example objects from the researched tool, but do not include readable text.',
    '- Use category cues only as support. The central scene must represent this exact tool, not a generic calculator, generic health page, generic finance page, or generic construction page.',
    '- Keep it G-rated, soft, memorable, and distinct from the matching tool/guide image.',
    '- Leave enough clean background for a 1200x630 web feature image crop.',
  ].join('\n');
}

const tools = readCanonicalTools();
const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));

const entries = createToolArtEntries(tools)
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
    ...entries.flatMap((entry, index) => [
      `### ${index + 1}. ${entry.toolName} ${entry.kind}`,
      '',
      promptBlock(entry, toolBySlug.get(entry.slug)),
      '',
    ]),
  ].join('\n'),
);

if (!existsSync(jsonPath) || !existsSync(mdPath)) {
  console.error('Failed to write GPT Image tool art queue.');
  process.exit(1);
}

console.log(`Prepared ${entries.length} GPT Image prompt(s).`);
console.log('Wrote output/tool-art-gpt-image-queue.json');
console.log('Wrote output/tool-art-gpt-image-queue.md');
