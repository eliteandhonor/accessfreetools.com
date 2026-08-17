import { describe, expect, it } from 'vitest';
import { collapseRepeatedPublicPageSlashes } from './canonicalPathRedirects';

describe('public page path normalization', () => {
  it('collapses repeated slashes on public GET and HEAD paths', () => {
    expect(collapseRepeatedPublicPageSlashes('/tools/kawaii-calculator//', 'GET')).toBe(
      '/tools/kawaii-calculator/',
    );
    expect(collapseRepeatedPublicPageSlashes('/tools//kawaii-calculator///', 'HEAD')).toBe(
      '/tools/kawaii-calculator/',
    );
  });

  it('leaves canonical paths and mutating requests unchanged', () => {
    expect(collapseRepeatedPublicPageSlashes('/tools/kawaii-calculator/', 'GET')).toBeNull();
    expect(collapseRepeatedPublicPageSlashes('/tools//kawaii-calculator/', 'POST')).toBeNull();
  });

  it.each([
    '/api//v1/tools',
    '/mcp//request',
    '/admin//analytics/',
    '/.analytics//events',
    '/_astro//entry.js',
    '/images//tool.webp',
    '/pinterest//feed.xml',
  ])('does not normalize protected or asset path %s', (pathname) => {
    expect(collapseRepeatedPublicPageSlashes(pathname, 'GET')).toBeNull();
  });
});
