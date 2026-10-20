// HilltopAds is the only ad network. Site 925379, verified October 20 2026.
// Zone scripts come from the HilltopAds dashboard; ads load on every public page.
export const HILLTOPADS_VERIFICATION_TOKEN = 'afc0abb760e5deb790430f9ff0b43d0da529a373';
// Zone 7534937: MultiTag banner 300x250, rendered in the slot above the footer.
export const HILLTOPADS_BANNER_SCRIPT_URL =
  'https://unfoldedtrade.com/brXOV.sZdaGYlX0eYNW-cv/reUm/9lulZ/U/lMkhPUT/c-1mM/zqQV5jMRz/cytyN/ziULzcN/DzkZ0UMMQv';
// Zone 7534953: MultiTag In-Page Push. No popunder zone by design.
export const HILLTOPADS_IN_PAGE_PUSH_SCRIPT_URL =
  'https://unfoldedtrade.com/bzX_Vzs.dFG/lu0YYWWncR/IeVm/9xuLZ/U/lHkpPYTdcg1kMBzAQ/5/NeTDMzt-NxzVUxzjNkDzki1ON/wX';

export const AD_CONSENT_STORAGE_KEY = 'aft-hilltopads-consent';
// GDPR/UK GDPR visitors must opt in before ads load. Detected from the device
// time zone: every Europe/* zone, plus EEA islands and EU outermost regions.
export const CONSENT_REGION_EXTRA_TIME_ZONES = [
  'Arctic/Longyearbyen',
  'Asia/Famagusta',
  'Asia/Nicosia',
  'Atlantic/Azores',
  'Atlantic/Canary',
  'Atlantic/Faroe',
  'Atlantic/Madeira',
  'Atlantic/Reykjavik',
  'America/Cayenne',
  'America/Guadeloupe',
  'America/Martinique',
  'America/Marigot',
  'Indian/Mayotte',
  'Indian/Reunion',
] as const;

export function isConsentRegionTimeZone(timeZone: string | undefined) {
  // An unknown zone is treated as needing consent.
  if (!timeZone) return true;
  return timeZone.startsWith('Europe/') ||
    (CONSENT_REGION_EXTRA_TIME_ZONES as readonly string[]).includes(timeZone);
}

const PRIVATE_PATHS = new Set(['/404/', '/mcp/', '/private-analytics/']);
const PRIVATE_PREFIXES = ['/admin/', '/api/'];
const TRUE_VALUES = new Set(['1', 'on', 'true', 'yes']);
const FALSE_VALUES = new Set(['0', 'off', 'false', 'no']);

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

export function shouldServeHilltopAds(path: string, enabled: boolean) {
  return enabled && isEligiblePublicAdPath(path);
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
