import type {
  TranscriberAsrWorkerEvent, TranscriberAsrWorkerRequest,
  TranscriberMediaWorkerEvent, TranscriberMediaWorkerRequest,
} from './browserTranscriberWorkerTypes';

type Request = TranscriberAsrWorkerRequest | TranscriberMediaWorkerRequest;
type Reply = TranscriberAsrWorkerEvent | TranscriberMediaWorkerEvent;
export type TranscriberOperation = { signal: AbortSignal; isCurrent: () => boolean };

// Defensive beta limits, not measured device throughput. Inference currently has
// no progress callback; silence therefore remains indeterminate until this cap.
export const TRANSCRIBER_WAIT_LIMITS = {
  inspect: { idleMs: 30_000, deadlineMs: 120_000 },
  decode: { idleMs: 60_000, deadlineMs: 300_000 },
  load: { idleMs: 120_000, deadlineMs: 600_000 },
  transcribe: { idleMs: 300_000, deadlineMs: 1_200_000 },
} as const;

let nextRequestId = 0;

export function assertTranscriberOperation(operation: TranscriberOperation) {
  if (operation.signal.aborted || !operation.isCurrent()) {
    throw new DOMException('The browser operation was cancelled.', 'AbortError');
  }
}

export function isTranscriberControlError(error: unknown) {
  return typeof error === 'object' && error !== null && 'name' in error
    && (error.name === 'AbortError' || error.name === 'TimeoutError');
}

export function waitForTranscriberReply<T extends Reply['type']>(
  worker: Worker,
  request: Exclude<Request, { type: 'dispose' | 'reset' }>,
  successType: T,
  operation: TranscriberOperation,
  onProgress?: (event: Reply) => void,
  transfer: Transferable[] = [],
): Promise<Extract<Reply, { type: T }>> {
  return new Promise((resolve, reject) => {
    assertTranscriberOperation(operation);
    const requestId = ++nextRequestId;
    const limits = TRANSCRIBER_WAIT_LIMITS[request.type];
    const started = performance.now();
    let lastProgress = started;
    let settled = false;
    let timer: ReturnType<typeof setTimeout>;
    const highWater = new Map<string, number>();
    const cleanup = () => {
      settled = true;
      clearTimeout(timer);
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleWorkerError);
      worker.removeEventListener('messageerror', handleWorkerError);
      operation.signal.removeEventListener('abort', handleAbort);
    };
    const fail = (error: unknown) => {
      if (settled) return;
      cleanup();
      reject(error);
    };
    const check = () => {
      if (settled) return false;
      try { assertTranscriberOperation(operation); } catch (error) { fail(error); return false; }
      const now = performance.now();
      const deadline = now - started >= limits.deadlineMs;
      if (deadline || now - lastProgress >= limits.idleMs) {
        const recovery = request.type === 'load'
          ? 'Check your connection and retry. Shortening the recording does not reduce the model download.'
          : 'Retry the remaining sections or use a shorter recording.';
        fail(new DOMException(
          `${request.type === 'load' ? 'Model loading' : request.type === 'transcribe' ? 'Speech recognition' : 'Media preparation'} stopped after ${Math.round((now - started) / 1000)} seconds: ${deadline ? 'the time limit was reached' : 'no new progress was reported'}. Completed sections are kept. ${recovery}`,
          'TimeoutError',
        ));
        return false;
      }
      return true;
    };
    const schedule = () => {
      clearTimeout(timer);
      const now = performance.now();
      timer = setTimeout(() => { if (check()) schedule(); }, Math.max(1, Math.min(started + limits.deadlineMs - now, lastProgress + limits.idleMs - now)));
    };
    const handleAbort = () => fail(new DOMException('The browser operation was cancelled.', 'AbortError'));
    const handleWorkerError = () => fail(new Error('The browser worker stopped unexpectedly. Retry the remaining sections.'));
    const handleMessage = (event: MessageEvent<Reply>) => {
      if (!check()) return;
      const data = event.data;
      if (data.requestId !== requestId) return;
      if ('blockIndex' in data && 'block' in request && data.blockIndex !== request.block.index) return;
      if (data.type === 'error') {
        if (data.stage === request.type) {
          fail('name' in data && isTranscriberControlError(data)
            ? new DOMException(data.message, data.name)
            : new Error(data.message));
        }
        return;
      }
      if (data.type === successType) {
        cleanup();
        resolve(data as Extract<Reply, { type: T }>);
        return;
      }
      const isProgress = (request.type === 'load' && data.type === 'load-progress')
        || (request.type === 'decode' && data.type === 'decode-progress')
        || (request.type === 'transcribe' && data.type === 'transcription-progress');
      if (!isProgress || (data.type !== 'load-progress' && data.type !== 'decode-progress' && data.type !== 'transcription-progress')) return;
      const value = data.type === 'load-progress' ? (data.current ?? data.progress) : data.progress;
      const key = data.type === 'load-progress' ? data.message : data.type;
      if (typeof value === 'number' && Number.isFinite(value) && value > (highWater.get(key) ?? 0)) {
        highWater.set(key, value);
        lastProgress = performance.now();
        schedule();
      }
      onProgress?.(data);
    };
    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleWorkerError);
    worker.addEventListener('messageerror', handleWorkerError);
    operation.signal.addEventListener('abort', handleAbort, { once: true });
    schedule();
    try {
      assertTranscriberOperation(operation);
      worker.postMessage({ ...request, requestId }, transfer);
    } catch (error) { fail(error); }
  });
}
