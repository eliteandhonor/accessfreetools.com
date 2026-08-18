import { describe, expect, it } from 'vitest';

import { getIndexationPolicy, normalizeIndexationPath, robotsContentForPath, shouldIncludeInXmlSitemap } from './indexationPolicy';

describe('indexation policy', () => {
  it('normalizes public page paths consistently', () => {
    expect(normalizeIndexationPath('tools')).toBe('/tools/');
    expect(normalizeIndexationPath('/tools/sales-tax-calculator')).toBe('/tools/sales-tax-calculator/');
    expect(normalizeIndexationPath('https://accessfreetools.com/sitemap/')).toBe('/sitemap/');
    expect(normalizeIndexationPath('/sitemap.xml')).toBe('/sitemap.xml');
  });

  it('keeps normal pages indexable and sitemap eligible by default', () => {
    const policy = getIndexationPolicy('/tools/sales-tax-calculator/');

    expect(policy.index).toBe(true);
    expect(policy.follow).toBe(true);
    expect(policy.includeInXmlSitemap).toBe(true);
    expect(policy.priorityTier).toBe('longtail');
    expect(robotsContentForPath('/tools/sales-tax-calculator/')).toBe('');
  });

  it('keeps the HTML sitemap crawlable but out of Google landing pages', () => {
    const policy = getIndexationPolicy('/sitemap/');

    expect(policy.index).toBe(false);
    expect(policy.follow).toBe(true);
    expect(policy.includeInXmlSitemap).toBe(false);
    expect(policy.priorityTier).toBe('noindex');
    expect(shouldIncludeInXmlSitemap('/sitemap/')).toBe(false);
    expect(robotsContentForPath('/sitemap/')).toBe('noindex,follow');
  });

  it('keeps both TTS pilot pages noindexed and outside XML sitemaps before launch', () => {
    for (const path of [
      '/tools/text-to-speech-audiobook-generator/',
      '/blog/how-to-use-text-to-speech-audiobook-generator/',
    ]) {
      const policy = getIndexationPolicy(path);
      expect(policy.index).toBe(false);
      expect(policy.follow).toBe(true);
      expect(policy.includeInXmlSitemap).toBe(false);
      expect(robotsContentForPath(path)).toBe('noindex,follow');
      expect(shouldIncludeInXmlSitemap(path)).toBe(false);
    }
  });

  it('keeps RSS feed resources crawlable but out of Google landing pages', () => {
    for (const path of ['/feed.xml', '/pinterest-feed.xml']) {
      const policy = getIndexationPolicy(path);

      expect(policy.index).toBe(false);
      expect(policy.follow).toBe(true);
      expect(policy.includeInXmlSitemap).toBe(false);
      expect(policy.priorityTier).toBe('noindex');
      expect(shouldIncludeInXmlSitemap(path)).toBe(false);
      expect(robotsContentForPath(path)).toBe('noindex,follow');
    }
  });
});
