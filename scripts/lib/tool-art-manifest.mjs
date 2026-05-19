import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const rootDir = resolve(fileURLToPath(new URL('../..', import.meta.url)));

export const toolDataFiles = [
  'src/data/tools.ts',
  'src/data/mathExpansionTools.ts',
  'src/data/financeTools.ts',
  'src/data/healthTools.ts',
  'src/data/utilityTools.ts',
  'src/data/aiTools.ts',
];

export const categoryNames = {
  calculators: 'Calculators',
  converters: 'Converters',
  'text-tools': 'Text Tools',
  'date-time': 'Date & Time',
  finance: 'Finance',
  'health-fitness': 'Health & Fitness',
  'home-projects': 'Home & Projects',
  'developer-tools': 'Developer Tools',
  'image-tools': 'Image Tools',
  'ai-tools': 'AI Tools',
  'school-study': 'School & Study',
  'everyday-tools': 'Everyday Tools',
};

const defaultCategoryByFile = {
  'aiTools.ts': 'ai-tools',
  'financeTools.ts': 'finance',
  'healthTools.ts': 'health-fitness',
  'mathExpansionTools.ts': 'calculators',
};

const categoryVisualCues = {
  calculators: 'calculator buttons, number blocks, and tidy math shapes',
  converters: 'swapping arrows, measuring cups, and unit tiles',
  'text-tools': 'paper sheets, pencil marks, and tidy writing lines',
  'date-time': 'calendar pages, clock circles, and reminder dots',
  finance: 'coins, charts, receipt shapes, and careful budgeting blocks',
  'health-fitness': 'heart shapes, movement arcs, and wellness note cards',
  'home-projects': 'house outlines, rulers, buckets, and project material shapes',
  'developer-tools': 'code brackets, terminal panels, and connected nodes',
  'image-tools': 'picture frames, crop handles, and sparkle shapes',
  'ai-tools': 'soft neural dots, lens shapes, and model-chip blocks',
  'school-study': 'notebook pages, stars, and study cards',
  'everyday-tools': 'checklists, small household objects, and simple task icons',
};

function propertyKeyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return undefined;
}

function collectConstStrings(sourceFile) {
  const values = new Map();

  function visit(node) {
    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          const value = literalText(declaration.initializer, values);
          if (value) values.set(declaration.name.text, value);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return values;
}

function literalText(expression, constStrings = new Map()) {
  if (!expression) return undefined;
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) return expression.text;
  if (ts.isIdentifier(expression)) return constStrings.get(expression.text);
  if (ts.isParenthesizedExpression(expression)) return literalText(expression.expression, constStrings);
  if (ts.isAsExpression(expression) || ts.isTypeAssertionExpression(expression) || ts.isSatisfiesExpression(expression)) {
    return literalText(expression.expression, constStrings);
  }
  if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = literalText(expression.left, constStrings);
    const right = literalText(expression.right, constStrings);
    return left !== undefined && right !== undefined ? `${left}${right}` : undefined;
  }
  return undefined;
}

function objectStringProperty(objectExpression, key, constStrings) {
  for (const property of objectExpression.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    if (propertyKeyName(property.name) !== key) continue;
    return literalText(property.initializer, constStrings);
  }

  return undefined;
}

function inferFileDefaultCategory(filePath) {
  const fileName = filePath.replaceAll('\\', '/').split('/').pop() ?? '';
  return defaultCategoryByFile[fileName];
}

function extractToolsFromFile(filePath) {
  const absolutePath = resolve(rootDir, filePath);
  const source = readFileSync(absolutePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);
  const constStrings = collectConstStrings(sourceFile);
  const defaultCategory = inferFileDefaultCategory(filePath);
  const tools = [];

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const slug = objectStringProperty(node, 'slug', constStrings);
      const name = objectStringProperty(node, 'name', constStrings);
      const summary = objectStringProperty(node, 'summary', constStrings);
      const description = objectStringProperty(node, 'description', constStrings);
      const category = objectStringProperty(node, 'category', constStrings) ?? defaultCategory;

      if (slug && name && category && (summary || description)) {
        tools.push({
          slug,
          name,
          category,
          summary: summary ?? description,
          description: description ?? summary ?? '',
          sourceFile: filePath,
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return tools;
}

export function readCanonicalTools() {
  const bySlug = new Map();

  for (const filePath of toolDataFiles) {
    for (const tool of extractToolsFromFile(filePath)) {
      if (!bySlug.has(tool.slug)) bySlug.set(tool.slug, tool);
    }
  }

  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function safeSummary(summary) {
  const text = normalizeWhitespace(summary);
  return text.length > 140 ? `${text.slice(0, 137).trim()}...` : text;
}

function slugWords(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b(calculator|tool|converter|generator|checker|formatter|parser|encoder|decoder)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildAlt(tool, kind) {
  const topic = slugWords(tool.slug) || tool.name;
  const categoryName = categoryNames[tool.category] ?? tool.category;
  if (kind === 'tool') {
    return `Smoke-style kawaii mascot using visual cues for ${tool.name} in the ${categoryName} category.`;
  }

  return `Smoke-style kawaii mascot explaining ${tool.name} with ${topic} shapes and guide notes.`;
}

function buildCaption(tool, kind) {
  if (kind === 'tool') {
    return `A smoke-kawaii visual for the ${tool.name} tool page.`;
  }

  return `A companion smoke-kawaii visual for the ${tool.name} guide.`;
}

function buildPrompt(tool, kind) {
  const categoryName = categoryNames[tool.category] ?? tool.category;
  const visualCues = categoryVisualCues[tool.category] ?? 'friendly utility shapes and organized helper objects';
  const action =
    kind === 'tool'
      ? `The mascot is actively presenting the ${tool.name} as a usable browser utility.`
      : `The mascot is explaining the ${tool.name} concept like a simple visual guide.`;

  return normalizeWhitespace(
    [
      'Create one unique G-rated chibi/kawaii mascot made from soft translucent smoke, like a cute smoke spirit character.',
      action,
      'The character should have a clear face, expressive eyes, wispy hair, smoky arms, and a floating smoke-body silhouette inspired by a cute mascot illustration.',
      'Show the full body character inside the frame, including all hair, smoky wisps, hands, props, and the lower floating smoke tail, with generous padding so nothing is cropped off.',
      'Use no readable text, no logos, no brand names, no watermark, no sexualized styling, and no generic abstract fog-only composition.',
      `Use visual hints for ${categoryName}: ${visualCues}.`,
      `Specific page concept: ${safeSummary(tool.summary)}.`,
      `Composition must be distinct for ${kind === 'tool' ? 'the tool page' : 'the guide/blog page'} and usable as a 1200 by 630 web image.`,
      'The result must look like an intentional character illustration, not a blurry background texture.',
    ].join(' '),
  );
}

export function createQueuedToolArtEntries(tools = readCanonicalTools()) {
  return tools.flatMap((tool) =>
    ['tool', 'guide'].map((kind) => ({
      slug: tool.slug,
      kind,
      toolName: tool.name,
      category: tool.category,
      categoryName: categoryNames[tool.category] ?? tool.category,
      imagePath: `/tool-art/${tool.slug}-${kind}.webp`,
      thumbnailPath: `/tool-art/thumbs/${tool.slug}-${kind}.webp`,
      pagePath: kind === 'tool' ? `/tools/${tool.slug}/` : `/blog/how-to-use-${tool.slug}/`,
      galleryPath: `/gallery/${tool.category}/#${tool.slug}-${kind}`,
      alt: buildAlt(tool, kind),
      caption: buildCaption(tool, kind),
      prompt: buildPrompt(tool, kind),
      status: 'queued',
      qaStatus: 'not-started',
    })),
  );
}

export function readToolArtApprovals() {
  const path = resolve(rootDir, 'src/data/toolArtApprovals.json');
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function createToolArtEntries(tools = readCanonicalTools()) {
  const approvals = readToolArtApprovals();
  const approvalMap = new Map(approvals.map((approval) => [`${approval.slug}:${approval.kind}`, approval]));

  return createQueuedToolArtEntries(tools).map((entry) => ({
    ...entry,
    ...(approvalMap.get(`${entry.slug}:${entry.kind}`) ?? {}),
  }));
}

export function writeJsonReport(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function manifestTsSource(entries) {
  const generated = new Date().toISOString().slice(0, 10);
  return `// Generated by scripts/generate-tool-art-manifest.mjs. Do not edit by hand.
// Last regenerated: ${generated}

export type ToolArtKind = 'tool' | 'guide';

export interface ToolArtManifestEntry {
  slug: string;
  kind: ToolArtKind;
  toolName: string;
  category: string;
  categoryName: string;
  imagePath: string;
  thumbnailPath: string;
  pagePath: string;
  galleryPath: string;
  alt: string;
  caption: string;
  prompt: string;
  status: 'queued' | 'draft' | 'approved' | 'rejected';
  qaStatus: 'not-started' | 'needs-review' | 'approved' | 'rejected';
}

export const toolArtManifest = ${JSON.stringify(entries, null, 2)} as const satisfies readonly ToolArtManifestEntry[];
`;
}

export function writeManifestOutputs(entries) {
  const manifestPath = resolve(rootDir, 'src/data/toolArtManifest.ts');
  const outputPath = resolve(rootDir, 'output/tool-art-manifest.json');
  const summaryPath = resolve(rootDir, 'output/tool-art-manifest.md');

  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, manifestTsSource(entries));
  writeJsonReport(outputPath, {
    generatedAt: new Date().toISOString(),
    tools: entries.length / 2,
    entries: entries.length,
    categories: [...new Set(entries.map((entry) => entry.category))].sort(),
    manifestPath: 'src/data/toolArtManifest.ts',
    entries,
  });
  writeFileSync(
    summaryPath,
    [
      '# Tool Art Manifest',
      '',
      `Generated entries: ${entries.length}`,
      `Canonical tools covered: ${entries.length / 2}`,
      `Categories covered: ${[...new Set(entries.map((entry) => entry.category))].sort().join(', ')}`,
      '',
      'Each canonical tool has one tool-page image and one guide-page image.',
      '',
    ].join('\n'),
  );

  return { manifestPath, outputPath, summaryPath };
}

export function readTrackedManifestSource() {
  const path = resolve(rootDir, 'src/data/toolArtManifest.ts');
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}
