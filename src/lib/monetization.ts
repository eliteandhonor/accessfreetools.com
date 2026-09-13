export const DEFAULT_INFOLINKS_PID = 3447500;
export const DEFAULT_INFOLINKS_WSID = 0;
export const INFOLINKS_SCRIPT_URL = 'https://resources.infolinks.com/js/infolinks_main.js';
export const ADSENSE_VERIFICATION_ACCOUNT = 'ca-pub-4461993577253590';
// September 13: neither publisher account is approved. Recheck before changing.
export const INFOLINKS_ACCOUNT_APPROVED = false;
export const ADSENSE_ACCOUNT_APPROVED = false;
export const AD_CONSENT_STORAGE_KEY = 'access-free-tools-ad-consent';
export const AD_OWNER_SUPPRESSION_KEY = 'access-free-tools-owner-ads-disabled';

export const ADSENSE_TOOL_PATHS = [
  '/tools/date-calculator/',
  '/tools/gas-mileage-calculator/',
  '/tools/mileage-calculator/',
  '/tools/hex-calculator/',
  '/tools/percentage-calculator/',
] as const;

const PRIVATE_PATHS = new Set(['/404/', '/mcp/', '/private-analytics/']);
const PRIVATE_PREFIXES = ['/admin/', '/api/'];
const TRUE_VALUES = new Set(['1', 'on', 'true', 'yes']);
const FALSE_VALUES = new Set(['0', 'off', 'false', 'no']);

export type AdMode = 'adsense' | 'infolinks' | 'none';

export interface AdModeOptions {
  adsenseClient: string;
  adsenseCmpReady: boolean;
  adsenseEnabled: boolean;
  adsenseSlot: string;
  infolinksEnabled: boolean;
}

export function normalizePublicPath(value: string) {
  try {
    const url = new URL(value || '/', 'https://accessfreetools.com');
    const collapsed = url.pathname.replace(/\/{2,}/g, '/');
    if (collapsed === '/') return collapsed;
    return collapsed.endsWith('/') ? collapsed : `${collapsed}/`;
  } catch {
    return '/';
  }
}

export function isEligiblePublicAdPath(value: string) {
  const path = normalizePublicPath(value);

  if (PRIVATE_PATHS.has(path)) return false;
  if (PRIVATE_PREFIXES.some((prefix) => path.startsWith(prefix))) return false;
  if (/\.[a-z0-9]{1,8}\/$/i.test(path)) return false;
  return true;
}

export function parsePublicFlag(value: string | undefined, fallback = false) {
  if (typeof value !== 'string' || !value.trim()) return fallback;

  const normalized = value.trim().toLowerCase();
  if (TRUE_VALUES.has(normalized)) return true;
  if (FALSE_VALUES.has(normalized)) return false;
  return false;
}

export function hasValidAdSenseConfiguration(options: AdModeOptions) {
  return (
    ADSENSE_ACCOUNT_APPROVED &&
    options.adsenseEnabled &&
    options.adsenseCmpReady &&
    /^ca-pub-\d{16}$/.test(options.adsenseClient.trim()) &&
    /^\d{10}$/.test(options.adsenseSlot.trim())
  );
}

export function resolveAdMode(path: string, options: AdModeOptions): AdMode {
  const normalizedPath = normalizePublicPath(path);
  if (!isEligiblePublicAdPath(normalizedPath)) return 'none';

  if (
    ADSENSE_TOOL_PATHS.includes(normalizedPath as (typeof ADSENSE_TOOL_PATHS)[number]) &&
    hasValidAdSenseConfiguration(options)
  ) {
    return 'adsense';
  }

  return INFOLINKS_ACCOUNT_APPROVED && options.infolinksEnabled ? 'infolinks' : 'none';
}

export function sanitizeKoFiUrl(value: string | undefined) {
  if (!value?.trim()) return '';

  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');

    if (url.protocol !== 'https:' || hostname !== 'ko-fi.com' || url.username || url.password) {
      return '';
    }

    return url.toString();
  } catch {
    return '';
  }
}
