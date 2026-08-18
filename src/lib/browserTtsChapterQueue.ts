import {
  assertBrowserTtsChapterCollection,
  type BrowserTtsChapter,
  type BrowserTtsChapterLimits,
} from './browserTtsChapters';

export type BrowserTtsChapterQueueItemStatus = 'cancelled' | 'completed' | 'failed' | 'pending' | 'running';
export type BrowserTtsChapterQueueStatus = 'cancelled' | 'completed' | 'failed' | 'idle' | 'running';

export interface BrowserTtsChapterQueueItem<TResult> {
  attempts: number;
  chapterId: string;
  contentVersion: number;
  error?: string;
  progress: number;
  result?: TResult;
  retryCount: number;
  status: BrowserTtsChapterQueueItemStatus;
}

export interface BrowserTtsChapterQueueState<TResult> {
  activeChapterId: string | null;
  completedCount: number;
  failedCount: number;
  items: readonly BrowserTtsChapterQueueItem<TResult>[];
  progress: number;
  status: BrowserTtsChapterQueueStatus;
  totalCount: number;
}

export interface BrowserTtsChapterGenerationContext {
  onProgress: (progress: number) => void;
  signal?: AbortSignal;
}

export type BrowserTtsChapterGenerator<TResult> = (
  chapter: BrowserTtsChapter,
  context: BrowserTtsChapterGenerationContext,
) => Promise<TResult>;

export interface BrowserTtsChapterQueueOptions<TResult> {
  chapterLimits?: Partial<BrowserTtsChapterLimits>;
  onStateChange?: (state: BrowserTtsChapterQueueState<TResult>) => void;
  toErrorMessage?: (error: unknown, chapter: BrowserTtsChapter) => string;
}

export type BrowserTtsChapterQueueErrorCode =
  | 'failed-chapter-requires-retry'
  | 'invalid-state'
  | 'missing-chapter'
  | 'queue-running'
  | 'retry-limit'
  | 'retry-requires-failure';

export class BrowserTtsChapterQueueError extends Error {
  readonly code: BrowserTtsChapterQueueErrorCode;

  constructor(code: BrowserTtsChapterQueueErrorCode, message: string) {
    super(message);
    this.name = 'BrowserTtsChapterQueueError';
    this.code = code;
  }
}

function clampProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function isAbortError(error: unknown) {
  return typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError';
}

function createPendingItem<TResult>(chapter: BrowserTtsChapter): BrowserTtsChapterQueueItem<TResult> {
  return {
    attempts: 0,
    chapterId: chapter.id,
    contentVersion: chapter.contentVersion,
    progress: 0,
    retryCount: 0,
    status: 'pending',
  };
}

function summarizeState<TResult>(
  status: BrowserTtsChapterQueueStatus,
  items: readonly BrowserTtsChapterQueueItem<TResult>[],
  activeChapterId: string | null,
): BrowserTtsChapterQueueState<TResult> {
  const completedCount = items.filter((item) => item.status === 'completed').length;
  const failedCount = items.filter((item) => item.status === 'failed').length;
  const progressUnits = items.reduce((total, item) => {
    if (item.status === 'completed') return total + 1;
    if (item.status === 'running') return total + clampProgress(item.progress);
    return total;
  }, 0);

  return {
    activeChapterId,
    completedCount,
    failedCount,
    items,
    progress: items.length === 0 ? 1 : progressUnits / items.length,
    status,
    totalCount: items.length,
  };
}

function cloneState<TResult>(state: BrowserTtsChapterQueueState<TResult>): BrowserTtsChapterQueueState<TResult> {
  return {
    ...state,
    items: state.items.map((item) => ({ ...item })),
  };
}

/**
 * Coordinates chapter generation without depending on a Worker or UI. The
 * injected generator owns the actual model call and must settle when its
 * AbortSignal is aborted. The queue remains locked until that promise settles,
 * preventing a cancelled call from overlapping a later chapter.
 */
export class BrowserTtsChapterQueue<TResult> {
  private activeOperation: Promise<BrowserTtsChapterQueueState<TResult>> | null = null;
  private chapters: readonly BrowserTtsChapter[];
  private readonly generator: BrowserTtsChapterGenerator<TResult>;
  private readonly options: BrowserTtsChapterQueueOptions<TResult>;
  private state: BrowserTtsChapterQueueState<TResult>;

  constructor(
    chapters: readonly BrowserTtsChapter[],
    generator: BrowserTtsChapterGenerator<TResult>,
    options: BrowserTtsChapterQueueOptions<TResult> = {},
  ) {
    assertBrowserTtsChapterCollection(chapters, options.chapterLimits);
    this.chapters = chapters.slice();
    this.generator = generator;
    this.options = options;
    const items = chapters.map((chapter) => createPendingItem<TResult>(chapter));
    this.state = summarizeState(items.length === 0 ? 'completed' : 'idle', items, null);
  }

  getState() {
    return cloneState(this.state);
  }

  isRunning() {
    return this.activeOperation !== null;
  }

  replaceChapters(chapters: readonly BrowserTtsChapter[]) {
    this.assertNotRunning();
    assertBrowserTtsChapterCollection(chapters, this.options.chapterLimits);
    const priorItems = new Map(this.state.items.map((item) => [item.chapterId, item]));
    const items = chapters.map((chapter) => {
      const prior = priorItems.get(chapter.id);
      if (!prior || prior.contentVersion !== chapter.contentVersion) return createPendingItem<TResult>(chapter);
      return { ...prior };
    });

    this.chapters = chapters.slice();
    let status: BrowserTtsChapterQueueStatus = 'idle';
    if (items.length === 0 || items.every((item) => item.status === 'completed')) status = 'completed';
    else if (items.some((item) => item.status === 'failed')) status = 'failed';
    else if (items.some((item) => item.status === 'cancelled')) status = 'cancelled';
    this.setState(status, items, null);
    return this.getState();
  }

  async run(signal?: AbortSignal) {
    this.assertNotRunning();
    const operation = this.runPending(signal);
    this.activeOperation = operation;
    try {
      return await operation;
    } finally {
      this.activeOperation = null;
    }
  }

  async retry(chapterId: string, signal?: AbortSignal) {
    this.assertNotRunning();
    const item = this.state.items.find((candidate) => candidate.chapterId === chapterId);
    if (!item) throw new BrowserTtsChapterQueueError('missing-chapter', `Chapter ${chapterId} was not found.`);
    if (item.status !== 'failed') {
      throw new BrowserTtsChapterQueueError('retry-requires-failure', 'Only a failed chapter can be retried.');
    }
    if (item.retryCount >= 1) {
      throw new BrowserTtsChapterQueueError('retry-limit', 'This chapter has already used its one retry.');
    }
    if (signal?.aborted) {
      this.setState('cancelled', this.state.items, null);
      return this.getState();
    }

    const preparedItems = this.state.items.map((candidate) =>
      candidate.chapterId === chapterId
        ? {
            ...candidate,
            error: undefined,
            progress: 0,
            retryCount: candidate.retryCount + 1,
            status: 'pending' as const,
          }
        : { ...candidate },
    );
    this.setState('idle', preparedItems, null);

    const operation = this.runOne(chapterId, signal);
    this.activeOperation = operation;
    try {
      const state = await operation;
      if (state.status === 'running') {
        const nextStatus = state.items.every((candidate) => candidate.status === 'completed') ? 'completed' : 'idle';
        this.setState(nextStatus, state.items, null);
      }
      return this.getState();
    } finally {
      this.activeOperation = null;
    }
  }

  private assertNotRunning() {
    if (this.activeOperation) {
      throw new BrowserTtsChapterQueueError('queue-running', 'Chapter generation is already running.');
    }
  }

  private async runPending(signal?: AbortSignal) {
    if (this.state.items.some((item) => item.status === 'failed')) {
      throw new BrowserTtsChapterQueueError(
        'failed-chapter-requires-retry',
        'Retry the failed chapter before continuing the queue.',
      );
    }
    if (signal?.aborted) {
      this.setState('cancelled', this.state.items, null);
      return this.getState();
    }

    const resumableItems = this.state.items.map((item) =>
      item.status === 'cancelled' ? { ...item, error: undefined, progress: 0, status: 'pending' as const } : { ...item },
    );
    this.setState(resumableItems.length === 0 ? 'completed' : 'running', resumableItems, null);

    while (true) {
      if (signal?.aborted) {
        this.setState('cancelled', this.state.items, null);
        return this.getState();
      }
      const next = this.state.items.find((item) => item.status === 'pending');
      if (!next) {
        this.setState('completed', this.state.items, null);
        return this.getState();
      }

      const result = await this.runOne(next.chapterId, signal);
      if (result.status === 'failed' || result.status === 'cancelled') return result;
    }
  }

  private async runOne(chapterId: string, signal?: AbortSignal) {
    const chapter = this.chapters.find((candidate) => candidate.id === chapterId);
    const item = this.state.items.find((candidate) => candidate.chapterId === chapterId);
    if (!chapter || !item) throw new BrowserTtsChapterQueueError('missing-chapter', `Chapter ${chapterId} was not found.`);
    if (item.status !== 'pending') {
      throw new BrowserTtsChapterQueueError('invalid-state', `Chapter ${chapterId} is not ready to generate.`);
    }

    const runningItems = this.state.items.map((candidate) =>
      candidate.chapterId === chapterId
        ? {
            ...candidate,
            attempts: candidate.attempts + 1,
            error: undefined,
            progress: 0,
            status: 'running' as const,
          }
        : { ...candidate },
    );
    this.setState('running', runningItems, chapterId);

    const handleAbort = () => {
      const current = this.state.items.find((candidate) => candidate.chapterId === chapterId);
      if (current?.status !== 'running') return;
      const cancelledItems = this.state.items.map((candidate) =>
        candidate.chapterId === chapterId
          ? { ...candidate, status: 'cancelled' as const }
          : { ...candidate },
      );
      this.setState('cancelled', cancelledItems, null);
    };
    signal?.addEventListener('abort', handleAbort, { once: true });

    try {
      const result = await this.generator(chapter, {
        signal,
        onProgress: (progress) => {
          if (signal?.aborted) return;
          const current = this.state.items.find((candidate) => candidate.chapterId === chapterId);
          if (current?.status !== 'running') return;
          const progressItems = this.state.items.map((candidate) =>
            candidate.chapterId === chapterId
              ? { ...candidate, progress: clampProgress(progress) }
              : { ...candidate },
          );
          this.setState('running', progressItems, chapterId);
        },
      });

      if (signal?.aborted) {
        handleAbort();
        return this.getState();
      }
      const completedItems = this.state.items.map((candidate) =>
        candidate.chapterId === chapterId
          ? { ...candidate, progress: 1, result, status: 'completed' as const }
          : { ...candidate },
      );
      this.setState('running', completedItems, null);
      return this.getState();
    } catch (error) {
      if (signal?.aborted || isAbortError(error)) {
        handleAbort();
        return this.getState();
      }
      const message = this.safeErrorMessage(error, chapter);
      const failedItems = this.state.items.map((candidate) =>
        candidate.chapterId === chapterId
          ? { ...candidate, error: message, status: 'failed' as const }
          : { ...candidate },
      );
      this.setState('failed', failedItems, null);
      return this.getState();
    } finally {
      signal?.removeEventListener('abort', handleAbort);
    }
  }

  private safeErrorMessage(error: unknown, chapter: BrowserTtsChapter) {
    const candidate = this.options.toErrorMessage?.(error, chapter)?.replace(/\s+/g, ' ').trim();
    return candidate ? candidate.slice(0, 240) : 'Chapter generation failed.';
  }

  private setState(
    status: BrowserTtsChapterQueueStatus,
    items: readonly BrowserTtsChapterQueueItem<TResult>[],
    activeChapterId: string | null,
  ) {
    this.state = summarizeState(status, items.map((item) => ({ ...item })), activeChapterId);
    this.options.onStateChange?.(this.getState());
  }
}
