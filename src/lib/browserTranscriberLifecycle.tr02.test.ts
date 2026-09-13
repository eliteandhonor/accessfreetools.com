import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isTranscriberControlError, TRANSCRIBER_WAIT_LIMITS, waitForTranscriberReply } from './browserTranscriberLifecycle';

class FakeWorker extends EventTarget {
  postMessage = vi.fn();
  reply(data: object) {
    this.dispatchEvent(new MessageEvent('message', { data: { requestId: this.postMessage.mock.calls.at(-1)?.[0].requestId, ...data } }));
  }
}

beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] }));
afterEach(() => { expect(vi.getTimerCount()).toBe(0); vi.useRealTimers(); });

function setup(type: 'load' | 'transcribe' = 'load') {
  const worker = new FakeWorker();
  const controller = new AbortController();
  const operation = { signal: controller.signal, isCurrent: () => true };
  const progress = vi.fn();
  const request = type === 'load'
    ? { type: 'load' as const, backend: 'webgpu' as const, model: 'english' as const }
    : { type: 'transcribe' as const, audio: new ArrayBuffer(0), block: { index: 1, start: 295, end: 600 }, language: 'english', model: 'english' as const };
  const pending = waitForTranscriberReply(worker as unknown as Worker, request, type === 'load' ? 'ready' : 'transcribed', operation, progress);
  return { worker, controller, operation, progress, pending };
}

describe('TR-02 request settlement and watchdogs', () => {
  it('recognizes control errors by name across realms, not only DOMException identity', () => {
    expect(isTranscriberControlError({ name: 'AbortError' })).toBe(true);
    expect(isTranscriberControlError(new DOMException('limit', 'TimeoutError'))).toBe(true);
    expect(isTranscriberControlError(new Error('GPU failure'))).toBe(false);
  });
  it('rejects pre-aborted requests before posting or registering timers', async () => {
    const worker = new FakeWorker();
    const controller = new AbortController(); controller.abort();
    await expect(waitForTranscriberReply(worker as unknown as Worker, { type: 'inspect', file: {} as File }, 'inspected', { signal: controller.signal, isCurrent: () => true })).rejects.toMatchObject({ name: 'AbortError' });
    expect(worker.postMessage).not.toHaveBeenCalled();
  });

  it('ignores stale request IDs, wrong stages, wrong blocks and messages after settlement', async () => {
    const run = setup('transcribe');
    run.worker.reply({ type: 'error', stage: 'transcribe', message: 'old', requestId: -1 });
    run.worker.reply({ type: 'error', stage: 'load', message: 'late load' });
    run.worker.reply({ type: 'transcribed', blockIndex: 0, segments: [] });
    expect(run.progress).not.toHaveBeenCalled();
    run.worker.reply({ type: 'transcribed', blockIndex: 1, segments: [] });
    await expect(run.pending).resolves.toMatchObject({ type: 'transcribed' });
    run.worker.reply({ type: 'transcription-progress', progress: 1 });
    expect(run.progress).not.toHaveBeenCalled();
  });

  for (const phase of ['load', 'transcribe'] as const) {
    it(`${phase} no-progress has a bounded measured timeout, not an AbortError`, async () => {
      const run = setup(phase);
      const result = expect(run.pending).rejects.toMatchObject({
        name: 'TimeoutError',
        message: expect.stringContaining(phase === 'load'
          ? 'Shortening the recording does not reduce the model download.'
          : 'Retry the remaining sections or use a shorter recording.'),
      });
      await vi.advanceTimersByTimeAsync(TRANSCRIBER_WAIT_LIMITS[phase].idleMs - 1);
      expect(vi.getTimerCount()).toBeGreaterThan(0);
      await vi.advanceTimersByTimeAsync(1);
      await result;
      expect(performance.now()).toBe(TRANSCRIBER_WAIT_LIMITS[phase].idleMs);
    });
  }

  it('duplicate/undefined load progress cannot postpone the idle limit', async () => {
    const run = setup();
    const result = expect(run.pending).rejects.toMatchObject({ name: 'TimeoutError' });
    run.worker.reply({ type: 'load-progress', message: 'model', current: 10 });
    for (let i = 0; i < 4; i++) {
      await vi.advanceTimersByTimeAsync(TRANSCRIBER_WAIT_LIMITS.load.idleMs / 4);
      run.worker.reply({ type: 'load-progress', message: 'model', current: 10 });
    }
    await result;
  });

  it('advancing downloads refresh idle but cannot extend the absolute deadline', async () => {
    const run = setup();
    const result = expect(run.pending).rejects.toMatchObject({
      name: 'TimeoutError',
      message: expect.stringContaining('Shortening the recording does not reduce the model download.'),
    });
    let settledAt = -1;
    void run.pending.catch(() => { settledAt = performance.now(); });
    const step = TRANSCRIBER_WAIT_LIMITS.load.idleMs / 2;
    for (let elapsed = step; elapsed <= TRANSCRIBER_WAIT_LIMITS.load.deadlineMs; elapsed += step) {
      await vi.advanceTimersByTimeAsync(step);
      run.worker.reply({ type: 'load-progress', message: 'model', current: elapsed });
    }
    await result;
    expect(settledAt).toBe(TRANSCRIBER_WAIT_LIMITS.load.deadlineMs);
  });

  it('abort and operation replacement settle once and remove listeners', async () => {
    const run = setup();
    const result = expect(run.pending).rejects.toMatchObject({ name: 'AbortError' });
    run.operation.isCurrent = () => false;
    run.worker.reply({ type: 'load-progress', progress: 1, message: 'stale' });
    run.controller.abort();
    await result;
    expect(run.progress).not.toHaveBeenCalled();
  });

  it('generation progress cannot extend its absolute deadline', async () => {
    const run = setup('transcribe');
    const result = expect(run.pending).rejects.toMatchObject({ name: 'TimeoutError' });
    let settledAt = -1;
    void run.pending.catch(() => { settledAt = performance.now(); });
    const step = TRANSCRIBER_WAIT_LIMITS.transcribe.idleMs / 2;
    for (let elapsed = step; elapsed <= TRANSCRIBER_WAIT_LIMITS.transcribe.deadlineMs; elapsed += step) {
      await vi.advanceTimersByTimeAsync(step);
      run.worker.reply({ type: 'transcription-progress', progress: elapsed / TRANSCRIBER_WAIT_LIMITS.transcribe.deadlineMs });
    }
    await result;
    expect(settledAt).toBe(TRANSCRIBER_WAIT_LIMITS.transcribe.deadlineMs);
  });

  it.each(['error', 'messageerror'])('settles and cleans up on native worker %s', async (type) => {
    const run = setup();
    const result = expect(run.pending).rejects.toThrow('worker stopped');
    run.worker.dispatchEvent(new Event(type));
    await result;
    run.worker.reply({ type: 'load-progress', message: 'late', progress: 5 });
    expect(run.progress).not.toHaveBeenCalled();
  });

  it('synchronous post failure cleans every pending timer', async () => {
    const worker = new FakeWorker();
    worker.postMessage.mockImplementation(() => { throw new Error('clone failure'); });
    await expect(waitForTranscriberReply(worker as unknown as Worker, { type: 'inspect', file: {} as File }, 'inspected', { signal: new AbortController().signal, isCurrent: () => true })).rejects.toThrow('clone failure');
  });

  it.each(['AbortError', 'TimeoutError'])('IJ-TR-02 restores worker %s and cleans the pending wait', async (name) => {
    const run = setup();
    const result = expect(run.pending).rejects.toMatchObject({ name, message: 'Sanitized failure' });
    run.worker.reply({ type: 'error', stage: 'load', name, message: 'Sanitized failure' });
    await result;
    run.worker.reply({ type: 'load-progress', message: 'late', progress: 50 });
    expect(run.progress).not.toHaveBeenCalled();
  });

  it('IJ-TR-02 unrecognized worker error names remain ordinary failures', async () => {
    const run = setup();
    const result = expect(run.pending).rejects.toMatchObject({ name: 'Error', message: 'Sanitized failure' });
    run.worker.reply({ type: 'error', stage: 'load', name: 'Private model detail', message: 'Sanitized failure' });
    await result;
  });
});
