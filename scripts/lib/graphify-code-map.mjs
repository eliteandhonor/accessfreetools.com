const normalizeFile = (value) => String(value ?? '')
  .replaceAll('\\', '/')
  .replace(/^\.\//, '');

export const GRAPHIFY_PINNED_VERSION = '0.9.53';

export const REQUIRED_GRAPH_FILES = [
  'src/components/BaseLayout.astro',
  'src/components/JsonToCsvConverter.tsx',
  'src/components/TextToSpeechAudiobookGenerator.tsx',
  'src/data/tools.ts',
  'src/data/utilityTools.ts',
  'src/lib/aftMcpServer.ts',
  'src/lib/apiToolRegistry.ts',
  'src/lib/askToolRouter.ts',
  'src/lib/browserTtsModels.ts',
  'src/pages/api/v1/ask.ts',
  'src/pages/mcp.ts',
  'src/pages/tools/[slug].astro',
  'src/workers/kokoro.worker.ts',
];

export const REQUIRED_GRAPH_IMPORTS = [
  ['src/pages/tools/[slug].astro', 'src/components/JsonToCsvConverter.tsx'],
  ['src/pages/tools/[slug].astro', 'src/components/TextToSpeechAudiobookGenerator.tsx'],
  ['src/pages/tools/[slug].astro', 'src/data/tools.ts'],
  ['src/data/tools.ts', 'src/data/utilityTools.ts'],
  ['src/pages/api/v1/ask.ts', 'src/lib/askToolRouter.ts'],
  ['src/lib/askToolRouter.ts', 'src/lib/apiToolRegistry.ts'],
  ['src/pages/mcp.ts', 'src/lib/aftMcpServer.ts'],
  ['src/lib/aftMcpServer.ts', 'src/lib/apiToolRegistry.ts'],
  ['src/components/TextToSpeechAudiobookGenerator.tsx', 'src/lib/browserTtsModels.ts'],
  ['src/workers/kokoro.worker.ts', 'src/lib/browserTtsModels.ts'],
  ['src/components/BaseLayout.astro', 'src/components/SiteHeader.astro'],
  ['src/components/BaseLayout.astro', 'src/components/SiteFooter.astro'],
];

export const EXCLUDED_GRAPH_PREFIXES = ['public/ai-models/'];

export function verifyGraph({
  graph,
  trackedAstroFiles = [],
  expectedCommit,
  minimumNodes = 3_000,
  minimumLinks = 6_000,
  requiredFiles = REQUIRED_GRAPH_FILES,
  requiredImports = REQUIRED_GRAPH_IMPORTS,
  excludedPrefixes = EXCLUDED_GRAPH_PREFIXES,
} = {}) {
  const errors = [];
  const warnings = [];
  const nodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
  const links = Array.isArray(graph?.links) ? graph.links : [];

  if (!Array.isArray(graph?.nodes)) errors.push('graph.nodes is missing or invalid');
  if (!Array.isArray(graph?.links)) errors.push('graph.links is missing or invalid');
  if (nodes.length < minimumNodes) errors.push(`node count ${nodes.length} is below ${minimumNodes}`);
  if (links.length < minimumLinks) errors.push(`link count ${links.length} is below ${minimumLinks}`);

  if (expectedCommit && graph?.built_at_commit !== expectedCommit) {
    errors.push(`graph commit ${graph?.built_at_commit ?? 'missing'} does not match ${expectedCommit}`);
  }

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const sourceFiles = new Set(nodes.map((node) => normalizeFile(node.source_file)).filter(Boolean));
  const danglingLinks = links.filter((link) => !nodesById.has(link.source) || !nodesById.has(link.target));
  if (danglingLinks.length > 0) errors.push(`${danglingLinks.length} link(s) have missing endpoints`);

  const duplicateKeys = new Set();
  let duplicateLinks = 0;
  for (const link of links) {
    const key = [link.source, link.target, link.relation, link.source_file, link.source_location].join('\u0000');
    if (duplicateKeys.has(key)) duplicateLinks += 1;
    duplicateKeys.add(key);
  }
  if (duplicateLinks > 0) errors.push(`${duplicateLinks} exact duplicate link(s) found`);

  const excludedFiles = [...sourceFiles].filter((file) => excludedPrefixes.some((prefix) => file.startsWith(prefix)));
  if (excludedFiles.length > 0) {
    errors.push(`${excludedFiles.length} excluded deployment asset(s) entered the graph`);
  }

  const missingRequiredFiles = requiredFiles.filter((file) => !sourceFiles.has(normalizeFile(file)));
  if (missingRequiredFiles.length > 0) {
    errors.push(`required files missing from graph: ${missingRequiredFiles.join(', ')}`);
  }

  const missingAstroFiles = trackedAstroFiles
    .map(normalizeFile)
    .filter((file) => file && !sourceFiles.has(file));
  if (missingAstroFiles.length > 0) {
    errors.push(`tracked Astro files missing from graph: ${missingAstroFiles.join(', ')}`);
  }

  const hasImport = (fromFile, toFile) => links.some((link) => {
    if (!String(link.relation ?? '').startsWith('import')) return false;
    const sourceNode = nodesById.get(link.source);
    const targetNode = nodesById.get(link.target);
    return normalizeFile(sourceNode?.source_file) === normalizeFile(fromFile)
      && normalizeFile(targetNode?.source_file) === normalizeFile(toFile);
  });

  const missingImports = requiredImports.filter(([fromFile, toFile]) => !hasImport(fromFile, toFile));
  if (missingImports.length > 0) {
    errors.push(`required import edges missing: ${missingImports.map((pair) => pair.join(' -> ')).join(', ')}`);
  }

  const astroFiles = trackedAstroFiles.map(normalizeFile).filter(Boolean);
  const astroFilesWithSymbols = astroFiles.filter((file) => (
    nodes.filter((node) => normalizeFile(node.source_file) === file).length > 1
  )).length;
  if (astroFiles.length > 0 && astroFilesWithSymbols < astroFiles.length) {
    warnings.push(
      `${astroFiles.length - astroFilesWithSymbols} Astro file(s) expose imports but no additional symbols`,
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: {
      nodes: nodes.length,
      links: links.length,
      uniqueSourceFiles: sourceFiles.size,
      trackedAstroFiles: astroFiles.length,
      representedAstroFiles: astroFiles.length - missingAstroFiles.length,
      astroFilesWithSymbols,
      danglingLinks: danglingLinks.length,
      duplicateLinks,
      excludedFiles: excludedFiles.length,
      requiredImports: requiredImports.length,
      missingRequiredImports: missingImports.length,
    },
  };
}
