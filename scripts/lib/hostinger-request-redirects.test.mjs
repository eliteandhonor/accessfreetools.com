import { describe, expect, it } from 'vitest';
import { redirectLocationForRequest } from './hostinger-request-redirects.mjs';

describe('Hostinger entry redirects', () => {
  it('redirects the love alias and preserves its query string', () => {
    expect(redirectLocationForRequest('/tools/love/?source=legacy', 'GET')).toBe(
      '/tools/love-calculator/?source=legacy',
    );
  });

  it('collapses repeated public-page slashes and preserves query parameters', () => {
    expect(redirectLocationForRequest('/tools/kawaii-calculator//?utm_test=1', 'HEAD')).toBe(
      '/tools/kawaii-calculator/?utm_test=1',
    );
    expect(redirectLocationForRequest('/tools//love///?source=legacy', 'GET')).toBe(
      '/tools/love-calculator/?source=legacy',
    );
  });

  it.each([
    ['/api//v1/tools', 'GET'],
    ['/mcp//request', 'GET'],
    ['/admin//analytics/', 'GET'],
    ['/.analytics//events', 'GET'],
    ['/_astro//entry.js', 'GET'],
    ['/images//tool.webp', 'GET'],
    ['/tools//kawaii-calculator/', 'POST'],
  ])('does not redirect protected request %s', (url, method) => {
    expect(redirectLocationForRequest(url, method)).toBeNull();
  });
});
