import { createToolArtEntries, readCanonicalTools, writeManifestOutputs } from './lib/tool-art-manifest.mjs';

const tools = readCanonicalTools();
const entries = createToolArtEntries(tools);
const duplicateSlugs = tools
  .map((tool) => tool.slug)
  .filter((slug, index, values) => values.indexOf(slug) !== index);
const duplicatePrompts = entries
  .map((entry) => entry.prompt)
  .filter((prompt, index, values) => values.indexOf(prompt) !== index);

if (duplicateSlugs.length > 0) {
  throw new Error(`Duplicate tool slugs in extracted source data: ${[...new Set(duplicateSlugs)].join(', ')}`);
}

if (duplicatePrompts.length > 0) {
  throw new Error(`Duplicate tool-art prompts found: ${[...new Set(duplicatePrompts)].slice(0, 10).join(', ')}`);
}

const paths = writeManifestOutputs(entries);

console.log(`Tool art manifest generated for ${tools.length} tools and ${entries.length} images.`);
console.log(`Tracked manifest: ${paths.manifestPath}`);
console.log(`JSON report: ${paths.outputPath}`);
