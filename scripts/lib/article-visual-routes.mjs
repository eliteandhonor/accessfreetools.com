import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';

function dailyMarkers(html) {
  if (!html.includes('data-daily-editorial')) return [];
  const markers = [];
  function visit(node) {
    if (node.tagName === 'article') {
      const marker = node.attrs.find((attribute) => attribute.name === 'data-daily-editorial');
      if (marker) markers.push(marker.value);
    }
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(parse(html));
  return markers;
}

// Daily pages retain their own marker. Including them here must not manufacture
// an owner-approval marker or alter the existing legacy article classification.
export function editorialArticlePaths({ root, catalogPath }) {
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  if (!Array.isArray(catalog) || catalog.some((article) =>
    !article || typeof article.slug !== 'string' || article.slug.length < 3 || article.slug.length > 100 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug),
  )) throw new Error('Daily editorial visual catalog has invalid article slugs.');
  const expected = new Set(catalog.map((article) => article.slug));
  if (expected.size !== catalog.length) throw new Error('Daily editorial visual catalog has duplicate slugs.');

  const blogDir = path.join(root, 'blog');
  const entries = !existsSync(blogDir) ? [] : readdirSync(blogDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ slug: entry.name, route: `/blog/${entry.name}/`, htmlPath: path.join(blogDir, entry.name, 'index.html') }))
    .filter((entry) => existsSync(entry.htmlPath))
    .map((entry) => ({ ...entry, html: readFileSync(entry.htmlPath, 'utf8') }));
  const legacy = entries.filter((entry) => entry.html.includes('data-editorial-slug'));
  const daily = [];
  for (const entry of entries) {
    const markers = dailyMarkers(entry.html);
    if (!markers.length) continue;
    if (markers.length !== 1 || markers[0] !== entry.slug || !expected.has(entry.slug)) {
      throw new Error(`Built daily article does not match its catalog route: ${entry.route}`);
    }
    daily.push(entry);
  }
  for (const slug of expected) {
    if (!daily.some((entry) => entry.slug === slug)) {
      throw new Error(`Daily article is missing its built route or marker: /blog/${slug}/`);
    }
  }
  return [...legacy, ...daily.filter((entry) => !legacy.some((item) => item.slug === entry.slug))]
    .map(({ html, ...entry }) => entry);
}
