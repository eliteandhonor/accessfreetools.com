import { describe, expect, it } from 'vitest';
import {
  EXCLUDED_GRAPH_PREFIXES,
  REQUIRED_GRAPH_FILES,
  REQUIRED_GRAPH_IMPORTS,
  verifyGraph,
} from './graphify-code-map.mjs';

function makeGraph() {
  const files = [...new Set([
    ...REQUIRED_GRAPH_FILES,
    ...REQUIRED_GRAPH_IMPORTS.flat(),
    'src/pages/index.astro',
  ])];
  const nodes = files.map((sourceFile, index) => ({
    id: `node-${index}`,
    label: sourceFile.split('/').at(-1),
    source_file: sourceFile,
  }));
  const idFor = (sourceFile) => nodes.find((node) => node.source_file === sourceFile).id;
  const links = REQUIRED_GRAPH_IMPORTS.map(([fromFile, toFile], index) => ({
    source: idFor(fromFile),
    target: idFor(toFile),
    relation: 'imports_from',
    source_file: fromFile,
    source_location: `L${index + 1}`,
  }));

  return {
    built_at_commit: 'expected-commit',
    nodes,
    links,
  };
}

const verifyFixture = (graph) => verifyGraph({
  graph,
  trackedAstroFiles: ['src/pages/index.astro', 'src/pages/tools/[slug].astro'],
  expectedCommit: 'expected-commit',
  minimumNodes: 1,
  minimumLinks: 1,
});

describe('Graphify code-map verification', () => {
  it('accepts a graph containing the required project relationships', () => {
    const report = verifyFixture(makeGraph());
    expect(report.ok).toBe(true);
    expect(report.stats.missingRequiredImports).toBe(0);
  });

  it('rejects deployment-model assets', () => {
    const graph = makeGraph();
    graph.nodes.push({
      id: 'vendored-model',
      label: 'worker.min.js',
      source_file: `${EXCLUDED_GRAPH_PREFIXES[0]}worker.min.js`,
    });
    const report = verifyFixture(graph);
    expect(report.ok).toBe(false);
    expect(report.errors.join('\n')).toContain('excluded deployment asset');
  });

  it('rejects a missing required import edge', () => {
    const graph = makeGraph();
    graph.links.shift();
    const report = verifyFixture(graph);
    expect(report.ok).toBe(false);
    expect(report.stats.missingRequiredImports).toBe(1);
  });

  it('rejects links with missing endpoints', () => {
    const graph = makeGraph();
    graph.links.push({
      source: graph.nodes[0].id,
      target: 'missing-node',
      relation: 'calls',
      source_file: graph.nodes[0].source_file,
      source_location: 'L99',
    });
    const report = verifyFixture(graph);
    expect(report.ok).toBe(false);
    expect(report.stats.danglingLinks).toBe(1);
  });
});
