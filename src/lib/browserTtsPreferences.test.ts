import { describe, expect, it } from 'vitest';

import {
  BROWSER_TTS_PREFERENCES_STORAGE_KEY,
  BROWSER_TTS_PREFERENCES_VERSION,
  createBrowserTtsVoicePreferencesStore,
  MAX_BROWSER_TTS_FAVORITES,
  MAX_BROWSER_TTS_RECENTS,
  normalizeBrowserTtsVoicePreferences,
  type BrowserTtsPreferenceStorage,
} from './browserTtsPreferences';

class MemoryStorage implements BrowserTtsPreferenceStorage {
  readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const voiceIds = Array.from({ length: 32 }, (_, index) => `voice-${index + 1}`);
const knownVoices = new Set(voiceIds);
const isKnownVoiceId = (voiceId: string) => knownVoices.has(voiceId);

describe('browser TTS voice preferences', () => {
  it('loads and persists the exact versioned allowlisted record', () => {
    const storage = new MemoryStorage();
    const store = createBrowserTtsVoicePreferencesStore({ storage, isKnownVoiceId });

    store.setFavorite('voice-2', true);
    store.recordRecent('voice-3');

    expect(storage.values.has(BROWSER_TTS_PREFERENCES_STORAGE_KEY)).toBe(true);
    expect(JSON.parse(storage.values.get(BROWSER_TTS_PREFERENCES_STORAGE_KEY) ?? '')).toEqual({
      version: BROWSER_TTS_PREFERENCES_VERSION,
      favorites: ['voice-2'],
      recents: ['voice-3'],
    });

    expect(createBrowserTtsVoicePreferencesStore({ storage, isKnownVoiceId }).getSnapshot()).toEqual({
      version: BROWSER_TTS_PREFERENCES_VERSION,
      favorites: ['voice-2'],
      recents: ['voice-3'],
    });
  });

  it('deduplicates in stored order, rejects unknown IDs, and enforces both bounds', () => {
    const normalized = normalizeBrowserTtsVoicePreferences({
      version: 1,
      favorites: ['voice-2', 'unknown', 'voice-2', ...voiceIds],
      recents: ['voice-4', 'voice-3', 'voice-4', 'unknown', ...voiceIds],
      text: 'must be discarded',
      filename: 'private.txt',
    }, isKnownVoiceId);

    expect(normalized.favorites).toHaveLength(MAX_BROWSER_TTS_FAVORITES);
    expect(normalized.favorites.slice(0, 3)).toEqual(['voice-2', 'voice-1', 'voice-3']);
    expect(normalized.recents).toHaveLength(MAX_BROWSER_TTS_RECENTS);
    expect(normalized.recents.slice(0, 4)).toEqual(['voice-4', 'voice-3', 'voice-1', 'voice-2']);
    expect(new Set(normalized.favorites).size).toBe(normalized.favorites.length);
    expect(new Set(normalized.recents).size).toBe(normalized.recents.length);
  });

  it('keeps favorites deterministic and recents newest-first', () => {
    const store = createBrowserTtsVoicePreferencesStore({ isKnownVoiceId });

    for (const voiceId of voiceIds.slice(0, MAX_BROWSER_TTS_FAVORITES + 2)) {
      store.setFavorite(voiceId, true);
    }
    expect(store.getSnapshot().favorites).toEqual(
      voiceIds.slice(2, MAX_BROWSER_TTS_FAVORITES + 2).reverse(),
    );

    store.setFavorite('voice-22', true);
    expect(store.getSnapshot().favorites[0]).toBe('voice-22');
    store.toggleFavorite('voice-22');
    expect(store.getSnapshot().favorites).not.toContain('voice-22');

    for (const voiceId of voiceIds.slice(0, MAX_BROWSER_TTS_RECENTS + 2)) {
      store.recordRecent(voiceId);
    }
    expect(store.getSnapshot().recents).toEqual(
      voiceIds.slice(2, MAX_BROWSER_TTS_RECENTS + 2).reverse(),
    );

    store.recordRecent('voice-5');
    expect(store.getSnapshot().recents[0]).toBe('voice-5');
    expect(store.getSnapshot().recents.filter((voiceId) => voiceId === 'voice-5')).toHaveLength(1);
  });

  it('recovers from malformed data, unsupported versions, and validator failures', () => {
    const malformed = new MemoryStorage();
    malformed.values.set(BROWSER_TTS_PREFERENCES_STORAGE_KEY, '{not-json');
    expect(createBrowserTtsVoicePreferencesStore({ storage: malformed, isKnownVoiceId }).getSnapshot()).toEqual({
      version: 1,
      favorites: [],
      recents: [],
    });

    malformed.values.set(BROWSER_TTS_PREFERENCES_STORAGE_KEY, JSON.stringify({
      version: 2,
      favorites: ['voice-1'],
      recents: ['voice-2'],
    }));
    expect(createBrowserTtsVoicePreferencesStore({ storage: malformed, isKnownVoiceId }).getSnapshot()).toMatchObject({
      favorites: [],
      recents: [],
    });

    const throwingValidator = (voiceId: string) => {
      if (voiceId === 'voice-2') throw new Error('registry unavailable');
      return isKnownVoiceId(voiceId);
    };
    const store = createBrowserTtsVoicePreferencesStore({ isKnownVoiceId: throwingValidator });
    expect(store.recordRecent('voice-2').recents).toEqual([]);
    expect(store.recordRecent('voice-1').recents).toEqual(['voice-1']);
  });

  it('falls back to memory when storage is unavailable or its quota is exhausted', () => {
    const unreadable: BrowserTtsPreferenceStorage = {
      getItem() {
        throw new Error('storage blocked');
      },
      setItem() {
        throw new Error('storage blocked');
      },
    };
    const unreadableStore = createBrowserTtsVoicePreferencesStore({ storage: unreadable, isKnownVoiceId });
    expect(unreadableStore.setFavorite('voice-1', true).favorites).toEqual(['voice-1']);
    expect(unreadableStore.recordRecent('voice-2').recents).toEqual(['voice-2']);

    let writeAttempts = 0;
    const quotaLimited: BrowserTtsPreferenceStorage = {
      getItem() {
        return null;
      },
      setItem() {
        writeAttempts += 1;
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      },
    };
    const quotaStore = createBrowserTtsVoicePreferencesStore({ storage: quotaLimited, isKnownVoiceId });
    quotaStore.setFavorite('voice-3', true);
    quotaStore.recordRecent('voice-4');

    expect(quotaStore.getSnapshot()).toMatchObject({
      favorites: ['voice-3'],
      recents: ['voice-4'],
    });
    expect(writeAttempts).toBe(1);
  });

  it('never persists user content or arbitrary fields', () => {
    const storage = new MemoryStorage();
    storage.values.set(BROWSER_TTS_PREFERENCES_STORAGE_KEY, JSON.stringify({
      version: 1,
      favorites: ['voice-1'],
      recents: ['voice-2'],
      text: 'private manuscript',
      filename: 'private-book.md',
      chapter: 'secret chapter',
      language: 'en-us',
      audio: 'blob:private',
      consent: true,
      analytics: { visitor: 'private' },
    }));

    const store = createBrowserTtsVoicePreferencesStore({ storage, isKnownVoiceId });
    store.recordRecent('voice-3');

    const persisted = storage.values.get(BROWSER_TTS_PREFERENCES_STORAGE_KEY) ?? '';
    expect(Object.keys(JSON.parse(persisted))).toEqual(['version', 'favorites', 'recents']);
    expect(persisted).not.toContain('private');
    expect(persisted).not.toContain('chapter');
    expect(persisted).not.toContain('language');
    expect(persisted).not.toContain('audio');
    expect(persisted).not.toContain('consent');
    expect(persisted).not.toContain('analytics');
  });

  it('returns defensive snapshots and ignores unknown mutations', () => {
    const store = createBrowserTtsVoicePreferencesStore({ isKnownVoiceId });
    const first = store.setFavorite('voice-1', true);
    (first.favorites as string[]).push('unknown');

    expect(store.getSnapshot().favorites).toEqual(['voice-1']);
    expect(store.setFavorite('unknown', true).favorites).toEqual(['voice-1']);
    expect(store.recordRecent('unknown').recents).toEqual([]);
    expect(store.clear()).toEqual({ version: 1, favorites: [], recents: [] });
  });
});
