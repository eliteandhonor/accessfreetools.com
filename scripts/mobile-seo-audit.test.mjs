import { describe, expect, it } from 'vitest';
import { analyzeHtmlPage } from './mobile-seo-audit.mjs';

const validHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="canonical" href="https://accessfreetools.com/tools/percentage-calculator/" />
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage"}</script>
  </head>
  <body><h1>Percentage Calculator</h1></body>
</html>`;

describe('mobile SEO audit page analysis', () => {
  it('accepts a responsive canonical page with structured data', () => {
    const result = analyzeHtmlPage({
      html: validHtml,
      routePath: '/tools/percentage-calculator/',
      sitemapUrls: new Set(['https://accessfreetools.com/tools/percentage-calculator/']),
    });

    expect(result.issues).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.jsonLdCount).toBe(1);
  });

  it('refuses missing mobile viewport metadata', () => {
    const result = analyzeHtmlPage({
      html: validHtml.replace(/<meta name="viewport"[^>]+>\n\s*/i, ''),
      routePath: '/tools/percentage-calculator/',
      sitemapUrls: new Set(['https://accessfreetools.com/tools/percentage-calculator/']),
    });

    expect(result.issues.map((issue) => issue.code)).toContain('missing_viewport');
  });

  it('refuses AMP relationships and AMP HTML attributes', () => {
    const html = validHtml
      .replace('<html lang="en">', '<html amp lang="en">')
      .replace(
        '</head>',
        '<link rel="amphtml" href="https://accessfreetools.com/tools/percentage-calculator/amp/" /></head>',
      );

    const result = analyzeHtmlPage({
      html,
      routePath: '/tools/percentage-calculator/',
      sitemapUrls: new Set(['https://accessfreetools.com/tools/percentage-calculator/']),
    });

    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['amp_html_attribute', 'amphtml_link', 'amp_like_link']),
    );
  });

  it('does not confuse amperage calculator slugs with AMP pages', () => {
    const html = validHtml.replaceAll(
      'https://accessfreetools.com/tools/percentage-calculator/',
      'https://accessfreetools.com/tools/amp-hours-to-watt-hours-calculator/',
    );

    const result = analyzeHtmlPage({
      html,
      routePath: '/tools/amp-hours-to-watt-hours-calculator/',
      sitemapUrls: new Set(['https://accessfreetools.com/tools/amp-hours-to-watt-hours-calculator/']),
    });

    expect(result.issues).toEqual([]);
  });

  it('refuses m-dot and mobile media alternates', () => {
    const html = validHtml.replace(
      '</head>',
      '<link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.accessfreetools.com/tools/percentage-calculator/" /></head>',
    );

    const result = analyzeHtmlPage({
      html,
      routePath: '/tools/percentage-calculator/',
      sitemapUrls: new Set(['https://accessfreetools.com/tools/percentage-calculator/']),
    });

    expect(result.issues.map((issue) => issue.code)).toContain('mobile_alternate_link');
  });

  it('refuses noindex route URLs inside XML sitemaps', () => {
    const html = validHtml.replace(
      'https://accessfreetools.com/tools/percentage-calculator/',
      'https://accessfreetools.com/sitemap/',
    ).replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1" />',
      '<meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex,follow" />',
    );

    const result = analyzeHtmlPage({
      html,
      routePath: '/sitemap/',
      sitemapUrls: new Set(['https://accessfreetools.com/sitemap/']),
    });

    expect(result.issues.map((issue) => issue.code)).toContain('noindex_in_sitemap');
  });

  it('allows noindex shortcut pages to canonicalize to an indexable sitemap URL', () => {
    const html = validHtml.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1" />',
      '<meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex,follow" />',
    );

    const result = analyzeHtmlPage({
      html,
      routePath: '/resources/',
      sitemapUrls: new Set(['https://accessfreetools.com/tools/percentage-calculator/']),
    });

    expect(result.issues).toEqual([]);
  });

  it('requires JSON-LD structured data basics', () => {
    const result = analyzeHtmlPage({
      html: validHtml.replace(/<script type="application\/ld\+json">.*?<\/script>/, ''),
      routePath: '/tools/percentage-calculator/',
      sitemapUrls: new Set(['https://accessfreetools.com/tools/percentage-calculator/']),
    });

    expect(result.issues.map((issue) => issue.code)).toContain('missing_json_ld');
  });
});
