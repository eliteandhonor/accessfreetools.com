interface SeekTensor {
  dims: readonly number[];
  slice(batch: null, channels: null, frames: [number, number]): SeekTensor;
}

interface SeekOptions {
  inputs: SeekTensor;
  generation_config: { num_frames: number };
}

interface SeekModel {
  _generate_with_seek(options: SeekOptions): unknown;
}

export function installWhisperFrameBounds(model: unknown, version: string): void {
  if (version !== '4.2.0' || !model || (typeof model !== 'object' && typeof model !== 'function') ||
      !('_generate_with_seek' in model) || typeof model._generate_with_seek !== 'function') {
    throw new Error('The Whisper frame adapter requires the verified 4.2.0 seek implementation.');
  }
  const instance = model as SeekModel;
  const original = instance._generate_with_seek;
  // Transformers.js 4.2.0 seeks over padded mel frames, ignoring num_frames.
  // Bound the real input here; its original seek method handles encoder padding.
  // Reverify this private instance adapter before changing the runtime version.
  instance._generate_with_seek = function (options) {
    const inputs = options?.inputs;
    const dims = inputs?.dims;
    const actual = options?.generation_config?.num_frames;
    if (!Array.isArray(dims) || dims.length !== 3 || dims[0] !== 1 || dims[1] !== 80 ||
        !Number.isSafeInteger(dims[2]) || dims[2] <= 0 || typeof inputs.slice !== 'function' ||
        !Number.isSafeInteger(actual) || actual <= 0 || actual > dims[2]) {
      throw new Error('Whisper input frames do not match the verified source shape.');
    }
    return original.call(this, actual === dims[2] ? options : {
      ...options, inputs: inputs.slice(null, null, [0, actual]),
    });
  };
}
