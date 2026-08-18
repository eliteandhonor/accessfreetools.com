export const BROWSER_TTS_PREFERENCES_STORAGE_KEY = 'aft:tts:voice-preferences:v1';
export const BROWSER_TTS_PREFERENCES_VERSION = 1 as const;
export const MAX_BROWSER_TTS_FAVORITES = 20;
export const MAX_BROWSER_TTS_RECENTS = 8;

export interface BrowserTtsPreferenceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface BrowserTtsVoicePreferences {
  readonly favorites: readonly string[];
  readonly recents: readonly string[];
  readonly version: typeof BROWSER_TTS_PREFERENCES_VERSION;
}

export interface BrowserTtsVoicePreferencesStore {
  clear(): BrowserTtsVoicePreferences;
  getSnapshot(): BrowserTtsVoicePreferences;
  recordRecent(voiceId: string): BrowserTtsVoicePreferences;
  setFavorite(voiceId: string, favorite: boolean): BrowserTtsVoicePreferences;
  toggleFavorite(voiceId: string): BrowserTtsVoicePreferences;
}

export interface CreateBrowserTtsVoicePreferencesStoreOptions {
  isKnownVoiceId: (voiceId: string) => boolean;
  storage?: BrowserTtsPreferenceStorage | null;
}

interface MutableBrowserTtsVoicePreferences {
  favorites: string[];
  recents: string[];
  version: typeof BROWSER_TTS_PREFERENCES_VERSION;
}

function emptyPreferences(): MutableBrowserTtsVoicePreferences {
  return {
    version: BROWSER_TTS_PREFERENCES_VERSION,
    favorites: [],
    recents: [],
  };
}

function snapshot(preferences: MutableBrowserTtsVoicePreferences): BrowserTtsVoicePreferences {
  return {
    version: BROWSER_TTS_PREFERENCES_VERSION,
    favorites: [...preferences.favorites],
    recents: [...preferences.recents],
  };
}

function isKnownVoiceIdSafely(
  voiceId: string,
  isKnownVoiceId: (voiceId: string) => boolean,
): boolean {
  try {
    return isKnownVoiceId(voiceId);
  } catch {
    return false;
  }
}

function normalizeVoiceIds(
  value: unknown,
  limit: number,
  isKnownVoiceId: (voiceId: string) => boolean,
): string[] {
  if (!Array.isArray(value)) return [];

  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const candidate of value) {
    if (typeof candidate !== 'string' || seen.has(candidate)) continue;
    if (!isKnownVoiceIdSafely(candidate, isKnownVoiceId)) continue;

    normalized.push(candidate);
    seen.add(candidate);
    if (normalized.length === limit) break;
  }

  return normalized;
}

export function normalizeBrowserTtsVoicePreferences(
  value: unknown,
  isKnownVoiceId: (voiceId: string) => boolean,
): BrowserTtsVoicePreferences {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return snapshot(emptyPreferences());
  }

  const record = value as Record<string, unknown>;
  if (record.version !== BROWSER_TTS_PREFERENCES_VERSION) {
    return snapshot(emptyPreferences());
  }

  return {
    version: BROWSER_TTS_PREFERENCES_VERSION,
    favorites: normalizeVoiceIds(record.favorites, MAX_BROWSER_TTS_FAVORITES, isKnownVoiceId),
    recents: normalizeVoiceIds(record.recents, MAX_BROWSER_TTS_RECENTS, isKnownVoiceId),
  };
}

function mutableCopy(preferences: BrowserTtsVoicePreferences): MutableBrowserTtsVoicePreferences {
  return {
    version: BROWSER_TTS_PREFERENCES_VERSION,
    favorites: [...preferences.favorites],
    recents: [...preferences.recents],
  };
}

function serializePreferences(preferences: MutableBrowserTtsVoicePreferences): string {
  return JSON.stringify({
    version: BROWSER_TTS_PREFERENCES_VERSION,
    favorites: preferences.favorites,
    recents: preferences.recents,
  });
}

function loadPreferences(
  storage: BrowserTtsPreferenceStorage | null | undefined,
  isKnownVoiceId: (voiceId: string) => boolean,
): { preferences: MutableBrowserTtsVoicePreferences; storageReadable: boolean } {
  if (!storage) {
    return { preferences: emptyPreferences(), storageReadable: false };
  }

  let raw: string | null;
  try {
    raw = storage.getItem(BROWSER_TTS_PREFERENCES_STORAGE_KEY);
  } catch {
    return { preferences: emptyPreferences(), storageReadable: false };
  }

  if (raw === null) {
    return { preferences: emptyPreferences(), storageReadable: true };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    parsed = null;
  }

  return {
    preferences: mutableCopy(normalizeBrowserTtsVoicePreferences(parsed, isKnownVoiceId)),
    storageReadable: true,
  };
}

export function createBrowserTtsVoicePreferencesStore(
  options: CreateBrowserTtsVoicePreferencesStoreOptions,
): BrowserTtsVoicePreferencesStore {
  const { isKnownVoiceId, storage } = options;
  const loaded = loadPreferences(storage, isKnownVoiceId);
  let preferences = loaded.preferences;
  let storageWritable = loaded.storageReadable;

  const persist = (next: MutableBrowserTtsVoicePreferences): BrowserTtsVoicePreferences => {
    preferences = next;

    if (storage && storageWritable) {
      try {
        storage.setItem(BROWSER_TTS_PREFERENCES_STORAGE_KEY, serializePreferences(preferences));
      } catch {
        // Keep the current tab useful when storage is blocked or its quota is exhausted.
        storageWritable = false;
      }
    }

    return snapshot(preferences);
  };

  const accepts = (voiceId: string) => (
    typeof voiceId === 'string'
    && voiceId.length > 0
    && isKnownVoiceIdSafely(voiceId, isKnownVoiceId)
  );

  const setFavorite = (voiceId: string, favorite: boolean): BrowserTtsVoicePreferences => {
    if (!accepts(voiceId)) return snapshot(preferences);

    const alreadyFavorite = preferences.favorites.includes(voiceId);
    if (favorite === alreadyFavorite) return snapshot(preferences);

    const favorites = favorite
      ? [voiceId, ...preferences.favorites].slice(0, MAX_BROWSER_TTS_FAVORITES)
      : preferences.favorites.filter((candidate) => candidate !== voiceId);

    return persist({ ...preferences, favorites });
  };

  return {
    getSnapshot() {
      return snapshot(preferences);
    },

    setFavorite,

    toggleFavorite(voiceId) {
      if (!accepts(voiceId)) return snapshot(preferences);
      return setFavorite(voiceId, !preferences.favorites.includes(voiceId));
    },

    recordRecent(voiceId) {
      if (!accepts(voiceId)) return snapshot(preferences);

      const recents = [
        voiceId,
        ...preferences.recents.filter((candidate) => candidate !== voiceId),
      ].slice(0, MAX_BROWSER_TTS_RECENTS);

      if (
        recents.length === preferences.recents.length
        && recents.every((candidate, index) => candidate === preferences.recents[index])
      ) {
        return snapshot(preferences);
      }

      return persist({ ...preferences, recents });
    },

    clear() {
      return persist(emptyPreferences());
    },
  };
}
