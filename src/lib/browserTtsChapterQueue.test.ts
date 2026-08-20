import { describe, expect, it } from 'vitest';

import {
  BrowserTtsChapterQueue,
  type BrowserTtsChapterQueueState,
} from './browserTtsChapterQueue';
import {
  createBrowserTtsChapters,
  editBrowserTtsChapterText,
  moveBrowserTtsChapter,
  renameBrowserTtsChapter,
} from './browserTtsChapters';

function chapters(...ids: string[]) {
  let index = 0;
  return createBrowserTtsChapters(
    ids.map((id) => ({ name: `Chapter ${id}`, text: `Text ${id}` })),
    () => ids[index++] ?? `unexpected-${index}`,
  );
}

function deferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });
  return { promise, reject, resolve };
}

describe('BrowserTtsChapterQueue', () => {
  it('generates chapters sequentially and reports bounded progress', async () => {
    const callOrder: string[] = [];
    const snapshots: BrowserTtsChapterQueueState<string>[] = [];
    let active = 0;
    let maxActive = 0;
    const queue = new BrowserTtsChapterQueue(
      chapters('a', 'b', 'c'),
      async (chapter, { onProgress }) => {
        active += 1;
        maxActive = Math.max(maxActive, active);
        callOrder.push(chapter.id);
        onProgress(-1);
        onProgress(0.5);
        onProgress(2);
        await Promise.resolve();
        active -= 1;
        return `audio-${chapter.id}`;
      },
      { onStateChange: (state) => snapshots.push(state) },
    );

    const result = await queue.run();

    expect(callOrder).toEqual(['a', 'b', 'c']);
    expect(maxActive).toBe(1);
    expect(result).toMatchObject({
      activeChapterId: null,
      completedCount: 3,
      failedCount: 0,
      progress: 1,
      status: 'completed',
      totalCount: 3,
    });
    expect(result.items.map((item) => item.result)).toEqual(['audio-a', 'audio-b', 'audio-c']);
    expect(snapshots.some((state) => state.activeChapterId === 'a' && state.progress > 0)).toBe(true);
    expect(snapshots.every((state) => state.progress >= 0 && state.progress <= 1)).toBe(true);
  });

  it('passes each chapter voice to the sequential generator', async () => {
    let index = 0;
    const voicedChapters = createBrowserTtsChapters(
      [
        { name: 'Narrator', text: 'Welcome.', voice: 'F1' },
        { name: 'Character', text: 'Hello.', voice: 'M5' },
        { name: 'Closing', text: 'Goodbye.', voice: 'F3' },
      ],
      () => `voice-${index += 1}`,
    );
    const seenVoices: Array<string | undefined> = [];
    let active = 0;
    let peakActive = 0;
    const queue = new BrowserTtsChapterQueue(voicedChapters, async (chapter) => {
      active += 1;
      peakActive = Math.max(peakActive, active);
      seenVoices.push(chapter.voice);
      await Promise.resolve();
      active -= 1;
      return chapter.voice;
    });

    const result = await queue.run();

    expect(seenVoices).toEqual(['F1', 'M5', 'F3']);
    expect(result.items.map((item) => item.result)).toEqual(['F1', 'M5', 'F3']);
    expect(peakActive).toBe(1);
  });

  it('stops on failure, retries only that chapter once, and preserves completed results', async () => {
    const calls: string[] = [];
    const attempts = new Map<string, number>();
    const queue = new BrowserTtsChapterQueue(chapters('a', 'b', 'c'), async (chapter) => {
      calls.push(chapter.id);
      const attempt = (attempts.get(chapter.id) ?? 0) + 1;
      attempts.set(chapter.id, attempt);
      if (chapter.id === 'b' && attempt === 1) throw new Error('unsafe internal detail');
      return { chapterId: chapter.id, bytes: new Uint8Array([attempt]) };
    });

    const failed = await queue.run();
    const firstResult = failed.items[0]?.result;
    expect(calls).toEqual(['a', 'b']);
    expect(failed.status).toBe('failed');
    expect(failed.items).toMatchObject([
      { attempts: 1, chapterId: 'a', status: 'completed' },
      { attempts: 1, chapterId: 'b', error: 'Chapter generation failed.', retryCount: 0, status: 'failed' },
      { attempts: 0, chapterId: 'c', status: 'pending' },
    ]);

    const retried = await queue.retry('b');
    expect(retried.status).toBe('idle');
    expect(retried.items[0]?.result).toBe(firstResult);
    expect(retried.items[1]).toMatchObject({ attempts: 2, retryCount: 1, status: 'completed' });

    const completed = await queue.run();
    expect(calls).toEqual(['a', 'b', 'b', 'c']);
    expect(completed.status).toBe('completed');
    expect(completed.items[0]?.result).toBe(firstResult);
  });

  it('enforces a single retry for one failed chapter', async () => {
    const queue = new BrowserTtsChapterQueue(chapters('a'), async () => {
      throw new Error('failure');
    });

    expect((await queue.run()).status).toBe('failed');
    expect((await queue.retry('a')).items[0]).toMatchObject({ attempts: 2, retryCount: 1, status: 'failed' });
    await expect(queue.retry('a')).rejects.toMatchObject({ code: 'retry-limit' });
    await expect(queue.run()).rejects.toMatchObject({
      code: 'failed-chapter-requires-retry',
    });
  });

  it('cancels through AbortSignal, retains completed audio, and resumes pending work', async () => {
    const startedB = deferred();
    const attempts = new Map<string, number>();
    const queue = new BrowserTtsChapterQueue(chapters('a', 'b', 'c'), async (chapter, { signal }) => {
      const attempt = (attempts.get(chapter.id) ?? 0) + 1;
      attempts.set(chapter.id, attempt);
      if (chapter.id === 'b' && attempt === 1) {
        startedB.resolve();
        await new Promise<void>((_resolve, reject) => {
          const abort = () => reject(Object.assign(new Error('cancelled'), { name: 'AbortError' }));
          if (signal?.aborted) abort();
          else signal?.addEventListener('abort', abort, { once: true });
        });
      }
      return `audio-${chapter.id}-${attempt}`;
    });

    const controller = new AbortController();
    const running = queue.run(controller.signal);
    await startedB.promise;
    controller.abort();
    const cancelled = await running;

    expect(cancelled.status).toBe('cancelled');
    expect(cancelled.items).toMatchObject([
      { chapterId: 'a', result: 'audio-a-1', status: 'completed' },
      { chapterId: 'b', retryCount: 0, status: 'cancelled' },
      { chapterId: 'c', status: 'pending' },
    ]);

    const resumed = await queue.run();
    expect(resumed.status).toBe('completed');
    expect(resumed.items.map((item) => item.result)).toEqual(['audio-a-1', 'audio-b-2', 'audio-c-1']);
    expect(resumed.items[1]?.retryCount).toBe(0);
  });

  it('rejects overlapping runs while the active generator is unsettled', async () => {
    const started = deferred();
    const release = deferred();
    let active = 0;
    let maxActive = 0;
    const queue = new BrowserTtsChapterQueue(chapters('a'), async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      started.resolve();
      await release.promise;
      active -= 1;
      return 'audio-a';
    });

    const firstRun = queue.run();
    await started.promise;
    expect(queue.isRunning()).toBe(true);
    await expect(queue.run()).rejects.toMatchObject({ code: 'queue-running' });
    release.resolve();
    expect((await firstRun).status).toBe('completed');
    expect(maxActive).toBe(1);
  });

  it('reconciles reorder and rename while invalidating only edited chapter audio', async () => {
    const original = chapters('a', 'b');
    const queue = new BrowserTtsChapterQueue(original, async (chapter) => ({ id: chapter.id }));
    const completed = await queue.run();
    const resultA = completed.items[0]?.result;
    const resultB = completed.items[1]?.result;

    const renamed = renameBrowserTtsChapter(original, 'a', 'Renamed A');
    const reordered = moveBrowserTtsChapter(renamed, 'b', 0);
    const preserved = queue.replaceChapters(reordered);
    expect(preserved.items.map((item) => item.chapterId)).toEqual(['b', 'a']);
    expect(preserved.items.map((item) => item.result)).toEqual([resultB, resultA]);
    expect(preserved.status).toBe('completed');

    const edited = editBrowserTtsChapterText(reordered, 'b', 'Changed text');
    const invalidated = queue.replaceChapters(edited);
    expect(invalidated.status).toBe('idle');
    expect(invalidated.items).toMatchObject([
      { chapterId: 'b', contentVersion: 1, status: 'pending' },
      { chapterId: 'a', contentVersion: 0, status: 'completed' },
    ]);
    expect(invalidated.items[0]?.result).toBeUndefined();
    expect(invalidated.items[1]?.result).toBe(resultA);
  });

  it('does not start generation for a pre-aborted signal or an empty queue', async () => {
    let calls = 0;
    const generator = async () => {
      calls += 1;
      return 'audio';
    };
    const controller = new AbortController();
    controller.abort();
    const queue = new BrowserTtsChapterQueue(chapters('a'), generator);

    expect((await queue.run(controller.signal)).status).toBe('cancelled');
    expect(calls).toBe(0);

    const emptyQueue = new BrowserTtsChapterQueue([], generator);
    expect(emptyQueue.getState()).toMatchObject({ progress: 1, status: 'completed', totalCount: 0 });
    expect((await emptyQueue.run()).status).toBe('completed');
    expect(calls).toBe(0);
  });
});
