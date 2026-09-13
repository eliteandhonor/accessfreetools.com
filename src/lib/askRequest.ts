export const ASK_PROVIDER_TIMEOUT_MS = 30_000;
export const ASK_CLIENT_TIMEOUT_MS = 35_000;

export async function withRequestDeadline<T>(
  work: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number,
  parent?: AbortSignal,
): Promise<T> {
  const cancelled = () => new DOMException('The request was cancelled.', 'AbortError');
  if (parent?.aborted) throw cancelled();

  const controller = new AbortController();
  const cancel = () => controller.abort(cancelled());
  let rejectInterrupted!: (reason: unknown) => void;
  const interrupted = new Promise<never>((_, reject) => { rejectInterrupted = reject; });
  const onAbort = () => rejectInterrupted(controller.signal.reason);
  controller.signal.addEventListener('abort', onAbort, { once: true });
  parent?.addEventListener('abort', cancel, { once: true });
  const timer = setTimeout(() => controller.abort(new DOMException('The request took too long.', 'TimeoutError')), timeoutMs);

  try {
    // Race the entire request and body read, even if an adapter ignores abort.
    return await Promise.race([
      Promise.resolve().then(() => {
        controller.signal.throwIfAborted();
        return work(controller.signal);
      }),
      interrupted,
    ]);
  } catch (error) {
    // Early failures can still own an unread response body.
    controller.abort();
    throw error;
  } finally {
    clearTimeout(timer);
    parent?.removeEventListener('abort', cancel);
    controller.signal.removeEventListener('abort', onAbort);
  }
}
