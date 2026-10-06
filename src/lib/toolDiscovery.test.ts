import { describe, expect, it } from 'vitest';
import { categories } from '../data/categories';
import { getToolSearchIndex } from '../data/toolSearchIndex';
import { getDiscoveryTokens, rankDiscoveryItems, readToolDiscoveryState, TOOL_PAGE_SIZE, toolDiscoveryUrl, toolMatchesDiscoveryCategory } from './toolDiscovery';

const index = getToolSearchIndex();
const categorySlugs = categories.map(category => category.slug);

describe('task discovery using the public inventory', () => {
  it.each([
    ['percentage discount', 'percentage-calculator'],
    ['fraction compare', 'fraction-calculator'],
    ['mortgage monthly payment', 'mortgage-calculator'],
    ['convert pounds to kg', 'conversion-calculator'],
    ['convert lbs to kilograms', 'conversion-calculator'],
    ['word count', 'word-counter'],
    ['image text OCR', 'image-to-text-ocr-tool'],
    ['paint area', 'paint-calculator'],
    ['date difference', 'date-calculator'],
  ])('finds the existing %s workflow', (query, slug) => {
    const results = rankDiscoveryItems(index, query);
    expect(results.some(tool => tool.slug === slug)).toBe(true);
    expect(results.slice(0, 3).some(tool => tool.slug === slug)).toBe(true);
  });

  it('matches multiword queries independently of phrase order', () => {
    expect(rankDiscoveryItems(index, 'compare fractions').map(tool => tool.slug))
      .toEqual(rankDiscoveryItems(index, 'fraction compare').map(tool => tool.slug));
  });

  it('prefers names and preserves alias URLs without inventing a tool', () => {
    const results = rankDiscoveryItems(index, 'ip subnet');
    expect(results[0].slug).toBe('ip-subnet-calculator');
    expect(results.some(tool => tool.slug === 'subnet-calculator')).toBe(true);
    expect(new Set(rankDiscoveryItems(index, '').map(tool => tool.slug)).size).toBe(index.length);
  });

  it('does not treat incidental description matches as name matches', () => {
    const items = [
      { name: 'Other helper', searchText: 'compare fraction using math' },
      { name: 'Fraction Calculator', searchText: 'compare exact values' },
    ];
    expect(rankDiscoveryItems(items, 'fraction compare')[0].name).toBe('Fraction Calculator');
    expect(rankDiscoveryItems(items, 'fraction compare unavailable')).toEqual([]);
  });

  it('supports optional alias names for the shared ranking helper', () => {
    const items = [
      { name: 'Other', searchText: 'weight converter' },
      { name: 'Unit helper', searchText: '', aliases: ['Weight Converter'] },
    ];
    expect(rankDiscoveryItems(items, 'weight converter')[0].name).toBe('Unit helper');
    expect(getDiscoveryTokens('Please convert pounds to KG')).toEqual(['convert', 'pound', 'kilogram']);
  });

  it('can filter a category without dropping its alternate-name pages', () => {
    const filtered = index.filter(tool => toolMatchesDiscoveryCategory(tool, 'date-time'));
    expect(rankDiscoveryItems(filtered, 'time duration').some(tool => tool.slug === 'time-duration-calculator')).toBe(true);
  });
});

describe('shared task-category membership', () => {
  const imageTools = index.filter(tool => toolMatchesDiscoveryCategory(tool, 'image-tools'));

  it('includes exactly the three primary Image tools and two existing AI image workflows', () => {
    expect(new Set(imageTools.map(tool => tool.slug))).toEqual(new Set([
      'color-contrast-checker', 'aspect-ratio-calculator', 'monitor-ppi-calculator',
      'image-to-text-ocr-tool', 'image-classifier',
    ]));
    expect(imageTools).toHaveLength(5);
  });

  it.each([
    ['OCR', 'image-to-text-ocr-tool'],
    ['image classifier', 'image-classifier'],
  ])('keeps %s searchable inside Images', (query, slug) => {
    expect(rankDiscoveryItems(imageTools, query)[0]?.slug).toBe(slug);
  });

  it('retains both tools in AI and leaves primary categories unchanged', () => {
    for (const slug of ['image-to-text-ocr-tool', 'image-classifier']) {
      const tool = index.find(item => item.slug === slug)!;
      expect(tool.category).toBe('ai-tools');
      expect(toolMatchesDiscoveryCategory(tool, 'ai-tools')).toBe(true);
    }
    expect(index.filter(tool => toolMatchesDiscoveryCategory(tool, 'ai-tools'))).toHaveLength(12);
  });

  it('does not add unrelated AI tools or guessed alternate image URLs', () => {
    expect(toolMatchesDiscoveryCategory({ slug: 'text-summarizer', category: 'ai-tools' }, 'image-tools')).toBe(false);
    expect(toolMatchesDiscoveryCategory({ slug: 'image-to-text-ocr-tool-copy', category: 'ai-tools' }, 'image-tools')).toBe(false);
  });

  it('preserves the complete inventory and all existing primary memberships', () => {
    const complete = index.filter(tool => toolMatchesDiscoveryCategory(tool, 'all'));
    expect(complete).toEqual(index);
    expect(new Set(complete.map(tool => tool.slug)).size).toBe(index.length);
    for (const tool of index) expect(toolMatchesDiscoveryCategory(tool, tool.category)).toBe(true);
  });
});

describe('directory URL state', () => {
  it('restores query, category and reveal count together', () => {
    expect(readToolDiscoveryState('?q=fraction+compare&category=calculators&limit=36', categorySlugs, index.length))
      .toEqual({ query: 'fraction compare', category: 'calculators', limit: 36 });
  });

  it.each(['', 'bad', '-12', '12.5', 'Infinity', '999999999999999999999999999'])('safely handles the limit %s', limit => {
    expect(readToolDiscoveryState(`?category=missing&limit=${limit}`, categorySlugs, index.length))
      .toEqual({ query: '', category: 'all', limit: TOOL_PAGE_SIZE });
  });

  it('caps oversized valid limits at the inventory size', () => {
    expect(readToolDiscoveryState('?limit=99999', categorySlugs, index.length).limit).toBe(index.length);
  });

  it('preserves unrelated parameters and hash while canonicalizing defaults', () => {
    const url = new URL('https://accessfreetools.com/tools/?utm_source=test&q=old&category=finance&limit=48#tools-az-heading');
    expect(toolDiscoveryUrl(url, { query: '  fraction compare  ', category: 'calculators', limit: 24 }))
      .toBe('/tools/?utm_source=test&q=fraction+compare&category=calculators&limit=24#tools-az-heading');
    expect(toolDiscoveryUrl(url, { query: '', category: 'all', limit: 12 }))
      .toBe('/tools/?utm_source=test#tools-az-heading');
    expect(url.searchParams.get('q')).toBe('old');
  });
});
