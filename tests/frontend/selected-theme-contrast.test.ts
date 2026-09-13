import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { chromium, type Browser } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

let browser: Browser;
const css = readFileSync(new URL('../../src/styles/global.css', import.meta.url), 'utf8');
beforeAll(async () => { browser = await chromium.launch(); });
afterAll(async () => { await browser?.close(); });

it.each(['fresh', 'coral', 'violet', 'lagoon', 'bloom', 'sunrise', 'forest', 'slate', 'orchid', 'mono'])
  ('keeps selected discovery controls readable in %s', async (theme) => {
    const context = await browser.newContext({ viewport: { width: 1365, height: 900 } });
    const page = await context.newPage();
    try {
      await page.route('**/*', route => route.abort());
      await page.setContent(`<html lang="en" data-theme="${theme}"><head><title>Owned contrast fixture</title><style>${css}</style></head><body><main>
        <div class="launchpad-filter-row"><button aria-pressed="true">All tools</button></div>
        <aside class="category-rail" aria-label="Tool categories"><button aria-pressed="true"><span>All tools</span><small>308</small></button></aside>
        <section class="gallery-hero"><nav class="hero-actions" aria-label="Gallery sections"><a class="button-primary" href="#tool-artwork">Tool artwork (50)</a></nav></section>
      </main></body></html>`);
      const results = await new AxeBuilder({ page }).withRules(['color-contrast'])
        .include('.launchpad-filter-row').include('.category-rail').include('.gallery-hero .hero-actions').analyze();
      expect(results.violations.map(rule => ({ id: rule.id, nodes: rule.nodes.map(node => node.failureSummary) }))).toEqual([]);
      expect(results.incomplete).toEqual([]);
    } finally { await context.close(); }
  });
