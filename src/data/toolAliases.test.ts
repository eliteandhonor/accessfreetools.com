import { describe, expect, it } from 'vitest';

import { toolAliases } from './toolAliases';
import { tools } from './tools';

describe('tool aliases', () => {
  it('point to canonical tools without colliding with real tool slugs', () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));

    expect(toolAliases.length).toBeGreaterThan(0);

    for (const alias of toolAliases) {
      expect(toolSlugs.has(alias.targetSlug)).toBe(true);
      expect(toolSlugs.has(alias.slug)).toBe(false);
      expect(alias.searchTerms.length).toBeGreaterThan(0);
    }
  });

  it('add common search wording to the canonical tool records', () => {
    const amortization = tools.find((tool) => tool.slug === 'amortization-calculator');
    const subnet = tools.find((tool) => tool.slug === 'subnet-calculator');
    const hours = tools.find((tool) => tool.slug === 'hours-calculator');
    const gcf = tools.find((tool) => tool.slug === 'greatest-common-factor-calculator');

    expect(amortization?.aliases).toContain('Mortgage Amortization Calculator');
    expect(subnet?.aliases).toContain('IP Subnet Calculator');
    expect(hours?.aliases).toContain('Time Duration Calculator');
    expect(gcf?.aliases).toContain('Common Factor Calculator');
  });
});
