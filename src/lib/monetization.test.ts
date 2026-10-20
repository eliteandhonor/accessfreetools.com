import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  HILLTOPADS_BANNER_SCRIPT_URL,
  HILLTOPADS_IN_PAGE_PUSH_SCRIPT_URL,
  HILLTOPADS_VERIFICATION_TOKEN,
  isConsentRegionTimeZone,
  isEligiblePublicAdPath,
  parsePublicFlag,
  sanitizeKoFiUrl,
  shouldServeHilltopAds,
} from './monetization';

describe('public advertising route policy', () => {
  it('allows ads on ordinary public pages', () => {
    expect(isEligiblePublicAdPath('/')).toBe(true);
    expect(isEligiblePublicAdPath('/tools/percentage-calculator/')).toBe(true);
    expect(isEligiblePublicAdPath('/blog/remove-ai-writing-tells-before-publishing/')).toBe(true);
    expect(isEligiblePublicAdPath('/developers/mcp/')).toBe(true);
    expect(isEligiblePublicAdPath('/privacy-policy/')).toBe(true);
  });

  it('keeps advertising off private and non-HTML routes', () => {
    expect(isEligiblePublicAdPath('/admin/')).toBe(false);
    expect(isEligiblePublicAdPath('/admin/analytics/')).toBe(false);
    expect(isEligiblePublicAdPath('/private-analytics/')).toBe(false);
    expect(isEligiblePublicAdPath('/api/v1/tools')).toBe(false);
    expect(isEligiblePublicAdPath('/mcp')).toBe(false);
    expect(isEligiblePublicAdPath('/feed.xml')).toBe(false);
    expect(isEligiblePublicAdPath('/404/')).toBe(false);
  });

  it('normalizes full URLs and query strings before applying policy', () => {
    expect(isEligiblePublicAdPath('https://accessfreetools.com/blog/?page=2')).toBe(true);
    expect(isEligiblePublicAdPath('https://accessfreetools.com/admin/?token=hidden')).toBe(false);
  });
});

describe('HilltopAds configuration', () => {
  it('serves HilltopAds on every public page unless switched off', () => {
    expect(shouldServeHilltopAds('/', true)).toBe(true);
    expect(shouldServeHilltopAds('/tools/date-calculator/', true)).toBe(true);
    expect(shouldServeHilltopAds('/admin/', true)).toBe(false);
    expect(shouldServeHilltopAds('/', false)).toBe(false);
  });

  it('pins the dashboard-supplied zone scripts and verification token', () => {
    expect(HILLTOPADS_BANNER_SCRIPT_URL).toMatch(/^https:\/\/unfoldedtrade\.com\//);
    expect(HILLTOPADS_IN_PAGE_PUSH_SCRIPT_URL).toMatch(/^https:\/\/unfoldedtrade\.com\//);
    expect(HILLTOPADS_BANNER_SCRIPT_URL).not.toBe(HILLTOPADS_IN_PAGE_PUSH_SCRIPT_URL);
    expect(HILLTOPADS_VERIFICATION_TOKEN).toMatch(/^[0-9a-f]{40}$/);
  });

  it('asks EEA, UK and Swiss time zones for consent before ads load', () => {
    for (const zone of ['Europe/London', 'Europe/Berlin', 'Europe/Zurich', 'Europe/Dublin',
      'Atlantic/Canary', 'Atlantic/Reykjavik', 'Asia/Nicosia', 'Indian/Reunion']) {
      expect(isConsentRegionTimeZone(zone)).toBe(true);
    }
    expect(isConsentRegionTimeZone('')).toBe(true);
    expect(isConsentRegionTimeZone(undefined)).toBe(true);
    for (const zone of ['America/New_York', 'Australia/Sydney', 'Asia/Tokyo', 'America/Sao_Paulo']) {
      expect(isConsentRegionTimeZone(zone)).toBe(false);
    }
  });

  it('no longer publishes the retired AdSense ads.txt seller line', () => {
    expect(existsSync(new URL('../../public/ads.txt', import.meta.url))).toBe(false);
  });

  it('parses explicit public feature flags without treating arbitrary text as enabled', () => {
    expect(parsePublicFlag(undefined, true)).toBe(true);
    expect(parsePublicFlag('false', true)).toBe(false);
    expect(parsePublicFlag('1', false)).toBe(true);
    expect(parsePublicFlag('yes', false)).toBe(true);
    expect(parsePublicFlag('maybe', false)).toBe(false);
  });

  it('accepts only HTTPS Ko-fi profile or page URLs', () => {
    expect(sanitizeKoFiUrl('https://ko-fi.com/accessfreetools')).toBe('https://ko-fi.com/accessfreetools');
    expect(sanitizeKoFiUrl('https://www.ko-fi.com/accessfreetools/')).toBe('https://www.ko-fi.com/accessfreetools/');
    expect(sanitizeKoFiUrl('http://ko-fi.com/accessfreetools')).toBe('');
    expect(sanitizeKoFiUrl('https://example.com/accessfreetools')).toBe('');
  });
});
