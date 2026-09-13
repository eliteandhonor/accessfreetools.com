import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  ADSENSE_VERIFICATION_ACCOUNT,
  ADSENSE_TOOL_PATHS,
  DEFAULT_INFOLINKS_PID,
  DEFAULT_INFOLINKS_WSID,
  INFOLINKS_SCRIPT_URL,
  isEligiblePublicAdPath,
  parsePublicFlag,
  resolveAdMode,
  sanitizeKoFiUrl,
} from './monetization';

describe('public advertising route policy', () => {
  it('allows Infolinks on ordinary public pages', () => {
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

describe('monetization configuration', () => {
  it('keeps supplied identifiers separate from publisher approval', () => {
    expect(DEFAULT_INFOLINKS_PID).toBe(3447500);
    expect(DEFAULT_INFOLINKS_WSID).toBe(0);
    expect(INFOLINKS_SCRIPT_URL).toBe('https://resources.infolinks.com/js/infolinks_main.js');
    expect(ADSENSE_VERIFICATION_ACCOUNT).toBe('ca-pub-4461993577253590');
  });

  it('parses explicit public feature flags without treating arbitrary text as enabled', () => {
    expect(parsePublicFlag(undefined, true)).toBe(true);
    expect(parsePublicFlag('false', true)).toBe(false);
    expect(parsePublicFlag('1', false)).toBe(true);
    expect(parsePublicFlag('yes', false)).toBe(true);
    expect(parsePublicFlag('maybe', false)).toBe(false);
  });

  it('blocks the unapproved Infolinks account even with an old enabled flag', () => {
    expect(resolveAdMode('/tools/date-calculator/', {
      adsenseClient: '',
      adsenseCmpReady: false,
      adsenseEnabled: false,
      adsenseSlot: '',
      infolinksEnabled: true,
    })).toBe('none');

    expect(resolveAdMode('/tools/date-calculator/', {
      adsenseClient: 'ca-pub-1234567890123456',
      adsenseCmpReady: true,
      adsenseEnabled: true,
      adsenseSlot: '1234567890',
      infolinksEnabled: true,
    })).toBe('none');

    expect(resolveAdMode('/blog/', {
      adsenseClient: 'ca-pub-1234567890123456',
      adsenseCmpReady: true,
      adsenseEnabled: true,
      adsenseSlot: '1234567890',
      infolinksEnabled: true,
    })).toBe('none');
  });

  it('publishes only the exact AdSense dashboard-supplied seller line', () => {
    const text = readFileSync(new URL('../../public/ads.txt', import.meta.url), 'utf8');
    expect(text.replace(/\r\n/g, '\n')).toBe('google.com, pub-4461993577253590, DIRECT, f08c47fec0942fa0\n');
    expect(text).not.toContain('3447500');
  });

  it('requires a complete approved AdSense configuration', () => {
    expect(ADSENSE_TOOL_PATHS).toContain('/tools/percentage-calculator/');
    expect(resolveAdMode('/tools/percentage-calculator/', {
      adsenseClient: 'ca-pub-1234567890123456',
      adsenseCmpReady: false,
      adsenseEnabled: true,
      adsenseSlot: '1234567890',
      infolinksEnabled: false,
    })).toBe('none');
  });

  it('accepts only HTTPS Ko-fi profile or page URLs', () => {
    expect(sanitizeKoFiUrl('https://ko-fi.com/accessfreetools')).toBe('https://ko-fi.com/accessfreetools');
    expect(sanitizeKoFiUrl('https://www.ko-fi.com/accessfreetools/')).toBe('https://www.ko-fi.com/accessfreetools/');
    expect(sanitizeKoFiUrl('http://ko-fi.com/accessfreetools')).toBe('');
    expect(sanitizeKoFiUrl('https://example.com/accessfreetools')).toBe('');
  });
});
