import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from '@astrojs/compiler-rs';

export const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

export function attribute(node, name) {
  return node.openingElement?.attributes.find((item) => {
    const key = item.name?.type === 'JSXNamespacedName'
      ? `${item.name.namespace.name}:${item.name.name.name}`
      : item.name?.name;
    return key === name;
  });
}

export function isMasked(node) {
  return attribute(node, 'data-clarity-mask')?.value?.value === 'true';
}

export function readPage(relativePath) {
  const source = readFileSync(new URL(`../../${relativePath}`, import.meta.url), 'utf8');
  const elements = [];
  function visit(node, ancestors = []) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'JSXElement') {
      elements.push({ node, ancestors, name: node.openingElement.name.name });
      ancestors = [...ancestors, node];
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach((child) => visit(child, ancestors));
      else if (value && typeof value === 'object') visit(value, ancestors);
    }
  }
  visit(parse(source).ast.body);
  return { source, elements };
}

export function workspaceFor(page, component) {
  const island = page.elements.find((item) => item.name === component);
  if (!island) throw new Error(`Missing ${component} island`);
  const workspace = island.ancestors.findLast(isMasked);
  if (!workspace) throw new Error(`Missing explicit privacy boundary for ${component}`);
  return workspace;
}
