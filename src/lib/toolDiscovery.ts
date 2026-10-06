export const TOOL_PAGE_SIZE = 12;

export interface DiscoveryItem {
  name: string;
  searchText: string;
  aliases?: readonly string[];
}

const imageDiscoverySlugs = new Set(['image-to-text-ocr-tool', 'image-classifier']);

/** Task discovery can share a tool across categories without changing its primary category or URL. */
export function toolMatchesDiscoveryCategory(tool: { slug: string; category: string }, category: string): boolean {
  return category === 'all' || tool.category === category
    || category === 'image-tools' && imageDiscoverySlugs.has(tool.slug);
}

const ignoredWords = new Set(['a', 'an', 'and', 'for', 'i', 'in', 'is', 'me', 'my', 'of', 'please', 'the', 'to', 'with']);
const equivalentWords: Record<string, string> = {
  percentage: 'percent', percentages: 'percent',
  lb: 'pound', lbs: 'pound', pounds: 'pound',
  kg: 'kilogram', kgs: 'kilogram', kilograms: 'kilogram', kilo: 'kilogram', kilos: 'kilogram',
  converter: 'convert', converters: 'convert', conversion: 'convert', conversions: 'convert', converting: 'convert',
  comparison: 'compare', comparisons: 'compare', comparing: 'compare',
};

export function getDiscoveryTokens(value: string): string[] {
  return [...new Set(value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .split(/[^a-z0-9]+/).filter(Boolean).filter(word => !ignoredWords.has(word))
    .map(word => equivalentWords[word] ?? (word.length > 4 && word.endsWith('s') && !word.endsWith('ss') ? word.slice(0, -1) : word)))];
}

function matchesToken(words: readonly string[], token: string) {
  return words.some(word => word === token || (token.length >= 3 && word.startsWith(token)));
}

/** Match every meaningful query word, then prefer tool names over incidental prose. */
export function rankDiscoveryItems<T extends DiscoveryItem>(items: readonly T[], query: string): T[] {
  const tokens = getDiscoveryTokens(query);
  if (tokens.length === 0) return [...items];
  return items.map((item, position) => {
    const name = getDiscoveryTokens(item.name);
    const aliases = (item.aliases ?? []).flatMap(getDiscoveryTokens);
    const searchable = getDiscoveryTokens(`${item.name} ${item.searchText} ${(item.aliases ?? []).join(' ')}`);
    if (!tokens.every(token => matchesToken(searchable, token))) return undefined;
    const exactName = name.join(' ') === tokens.join(' ');
    const score = (exactName ? 200 : 0) + tokens.reduce((total, token) =>
      total + (matchesToken(name, token) ? 24 : matchesToken(aliases, token) ? 18 : 3), 0);
    return { item, position, score };
  }).filter((entry): entry is { item: T; position: number; score: number } => Boolean(entry))
    .sort((a, b) => b.score - a.score || a.position - b.position).map(entry => entry.item);
}

export interface ToolDiscoveryState {
  query: string;
  category: string;
  limit: number;
}

export function readToolDiscoveryState(search: string, categories: readonly string[], total: number): ToolDiscoveryState {
  const params = new URLSearchParams(search);
  const category = params.get('category') ?? 'all';
  const rawLimit = params.get('limit') ?? '';
  const limit = /^\d+$/.test(rawLimit) ? Number(rawLimit) : TOOL_PAGE_SIZE;
  return {
    query: params.get('q') ?? '',
    category: categories.includes(category) ? category : 'all',
    limit: Number.isSafeInteger(limit) ? Math.min(Math.max(TOOL_PAGE_SIZE, limit), Math.max(total, TOOL_PAGE_SIZE)) : TOOL_PAGE_SIZE,
  };
}

/** Preserve unrelated query parameters, the hash, and the caller's history.state. */
export function toolDiscoveryUrl(url: URL, state: ToolDiscoveryState): string {
  const next = new URL(url.href);
  const query = state.query.trim();
  if (query) next.searchParams.set('q', query); else next.searchParams.delete('q');
  if (state.category !== 'all') next.searchParams.set('category', state.category); else next.searchParams.delete('category');
  if (state.limit > TOOL_PAGE_SIZE) next.searchParams.set('limit', String(state.limit)); else next.searchParams.delete('limit');
  return `${next.pathname}${next.search}${next.hash}`;
}
