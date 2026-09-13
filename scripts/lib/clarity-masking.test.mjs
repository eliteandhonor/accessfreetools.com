import { describe, expect, it } from 'vitest';
import { attribute, isMasked, readPage, workspaceFor } from './clarity-masking-fixture.mjs';

const tools = readPage('src/pages/tools/[slug].astro');
const ask = readPage('src/pages/ask.astro');

describe('SEC-02 explicit page privacy boundaries', () => {
  it('masks the entire tool workspace, not just input fields or advertising scans', () => {
    const workspace = workspaceFor(tools, 'AiBrowserTool');
    expect(attribute(workspace, 'class')?.value?.value).toBe('tool-interaction-surface');
    expect(isMasked(workspace)).toBe(true);
  });

  it('keeps every hydrated tool renderer inside an explicit mask', () => {
    const islands = tools.elements.filter(({ node }) => attribute(node, 'client:load'));
    expect(islands.map(({ name }) => name)).toEqual(expect.arrayContaining([
      'AiBrowserTool', 'UtilityCalculator', 'JsonToCsvConverter', 'TextToSpeechAudiobookGenerator',
    ]));
    for (const { name, ancestors } of islands) {
      expect(ancestors.some(isMasked), `${name} can render private results/errors/history`).toBe(true);
    }
  });

  it('masks the complete Ask island, including answers, proof values and failures', () => {
    expect(isMasked(workspaceFor(ask, 'AskToolChat'))).toBe(true);
  });

  it.each([['tool', tools], ['Ask', ask]])('leaves intentional %s public prose outside masks', (_, page) => {
    const prose = page.elements.filter(({ node, name }) => name === 'h1' ||
      /(?:content-section|trust-note|page-intro|ask-tool-panel|section-heading|ai-privacy-note)/.test(
        attribute(node, 'class')?.value?.value ?? '',
      ));
    expect(prose.length).toBeGreaterThan(3);
    for (const { node, ancestors } of prose) {
      expect([node, ...ancestors].some(isMasked)).toBe(false);
    }
  });

  it('preserves the analytics surface and public tool metadata', () => {
    const workspace = workspaceFor(tools, 'AiBrowserTool');
    expect(attribute(workspace, 'data-aft-tool-usage-surface')).toBeDefined();
    for (const key of ['category', 'name', 'slug']) {
      const expression = attribute(workspace, `data-tool-${key}`)?.value?.expression;
      expect(expression?.object?.name).toBe('tool');
      expect(expression?.property?.name).toBe(key);
    }
  });

  it.each([['tool', tools, 'AiBrowserTool'], ['Ask', ask, 'AskToolChat']])(
    'preserves separate %s Infolinks exclusions around the workspace', (_, page, component) => {
      const island = page.elements.find(({ name }) => name === component).node;
      const adBoundary = (value) => page.elements.find(({ node }) =>
        attribute(node, 'set:html')?.value?.value === value)?.node;
      expect(adBoundary('<!--INFOLINKS_OFF-->')?.end).toBeLessThan(island.start);
      expect(adBoundary('<!--INFOLINKS_ON-->')?.start).toBeGreaterThan(island.end);
    },
  );

  it.each([['tool', tools], ['Ask', ask]])('does not add a %s unmask override', (_, page) => {
    expect(page.elements.filter(({ node }) => attribute(node, 'data-clarity-unmask'))).toHaveLength(0);
  });
});
