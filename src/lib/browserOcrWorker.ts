interface OcrData { text: string; confidence?: number }
interface OcrPaths { workerPath: string; corePath: string; langPath: string }
export const OCR_WORKER_TIMEOUT_MS = 90_000;
let nextWorkerId = 0;

// Tesseract.js v7 createWorker returns only after initialization. Own its native
// worker directly so even a stalled language/core load can be terminated.
// These four packets mirror tesseract.js/src/createWorker.js; no OCR logic lives here.
export function recognizeOcrImage(image: Uint8Array<ArrayBuffer>, language: string, paths: OcrPaths,
  signal: AbortSignal, onProgress: (message: string) => void): Promise<OcrData> {
  return new Promise((resolve, reject) => {
    let worker: Worker | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let finished = false;
    let step = 0;
    const workerId = `ocr-${++nextWorkerId}`;
    const jobs = [
      { action: 'load', payload: { options: { lstmOnly: true, corePath: new URL(paths.corePath, location.href).href, logging: false } } },
      { action: 'loadLanguage', payload: { langs: language, options: {
        langPath: new URL(paths.langPath, location.href).href, gzip: true, lstmOnly: true,
      } } },
      { action: 'initialize', payload: { langs: language, oem: 1, config: {} } },
      { action: 'recognize', payload: { image, options: {}, output: { text: true } } },
    ];
    function finish(error?: Error, data?: OcrData) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
      if (worker) {
        worker.onmessage = null; worker.onerror = null; worker.onmessageerror = null;
        worker.terminate();
      }
      if (error) reject(error); else resolve(data!);
    }
    function abort() { finish(new DOMException('OCR cancelled.', 'AbortError')); }
    function failed() { finish(new Error('OCR could not finish. Check your connection for the language files, then try again.')); }
    function send() {
      if (finished) return;
      try {
        const job = jobs[step]!;
        worker!.postMessage({ ...job, workerId, jobId: `${workerId}-${step}` });
      } catch { failed(); }
    }
    if (signal.aborted) { abort(); return; }
    signal.addEventListener('abort', abort, { once: true });
    try {
      worker = new Worker(paths.workerPath);
      timer = setTimeout(() => finish(new Error('OCR took too long. Try a smaller image, then run it again.')), OCR_WORKER_TIMEOUT_MS);
      worker.onerror = failed;
      worker.onmessageerror = failed;
      worker.onmessage = ({ data: packet }) => {
        if (finished || packet?.workerId !== workerId || packet.jobId !== `${workerId}-${step}` || packet.action !== jobs[step]!.action) return;
        if (packet.status === 'progress') {
          const message = packet.data;
          if (typeof message?.status === 'string') {
            const progress = typeof message.progress === 'number' && Number.isFinite(message.progress)
              ? Math.round(Math.max(0, Math.min(1, message.progress)) * 100) : 0;
            onProgress(`${message.status}${progress ? ` ${progress}%` : ''}`);
          }
        } else if (packet.status === 'reject') {
          failed();
        } else if (packet.status === 'resolve') {
          if (step < jobs.length - 1) { step++; send(); }
          else if (typeof packet.data?.text !== 'string') failed();
          else finish(undefined, packet.data);
        }
      };
      send();
    } catch { failed(); }
  });
}
