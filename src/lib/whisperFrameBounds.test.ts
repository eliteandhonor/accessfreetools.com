import { describe, expect, it, vi } from 'vitest';
import { installWhisperFrameBounds } from './whisperFrameBounds';

const VERSION = '4.2.0';

class TensorFake {
  readonly dims: readonly number[];
  readonly data: readonly number[];

  constructor(frames = 8, data?: number[]) {
    this.dims = Object.freeze([1, 80, frames]);
    this.data = Object.freeze(data ?? Array.from({ length: 80 * frames }, (_, i) => i));
  }

  readonly slice = vi.fn((_batch: null, _mels: null, [start, end]: [number, number]) => {
    const frames = this.dims[2];
    const data = Array.from({ length: 80 }, (_, mel) =>
      this.data.slice(mel * frames + start, mel * frames + end)).flat();
    return new TensorFake(end - start, data);
  });
}

function optionsFor(actual = 3, padded = 8) {
  return Object.freeze({
    inputs: Object.freeze(new TensorFake(padded)),
    generation_config: Object.freeze({ num_frames: actual, return_token_timestamps: true }),
    logits_processor: Object.freeze([{ name: 'processor' }]),
    init_tokens: Object.freeze([50258, 50359]),
    kwargs: Object.freeze({ language: 'en' }),
    extra_option: Object.freeze({ keep: true }),
  });
}

type SeekOptions = ReturnType<typeof optionsFor>;

// Exercise runtime validation without depending on the parent's TypeScript input types.
function install(model: unknown, version: unknown) {
  return installWhisperFrameBounds(
    model as Parameters<typeof installWhisperFrameBounds>[0],
    version as Parameters<typeof installWhisperFrameBounds>[1],
  );
}

function setup(result: unknown = { sequences: [11, 12] }) {
  const original = vi.fn(function (this: unknown, options: SeekOptions) {
    void options;
    return result;
  });
  const model = { _generate_with_seek: original };
  install(model, VERSION);
  expect(original).not.toHaveBeenCalled();
  return { model, original, result };
}

describe('installWhisperFrameBounds: bounded Whisper 4.2.0 seek inputs', () => {
  it('supports the actual Transformers Callable model shape without changing its call behavior', async () => {
    const original = vi.fn(function (this: unknown, options: SeekOptions) { return options; });
    const call = vi.fn(() => 'forward result');
    const model = Object.assign(call, { _generate_with_seek: original });
    install(model, VERSION);
    expect(model()).toBe('forward result');
    const result = await model._generate_with_seek(optionsFor());
    expect(result.inputs.dims).toEqual([1, 80, 3]);
    expect(original.mock.contexts[0]).toBe(model);
  });
  it('no-op global snapshot control is stable after observation warmup', () => {
    Object.getOwnPropertyDescriptors(globalThis);
    const before = Object.getOwnPropertyDescriptors(globalThis);
    expect(Object.getOwnPropertyDescriptors(globalThis)).toEqual(before);
  });

  it('warmed global snapshot control still detects a newly added symbol', () => {
    Object.getOwnPropertyDescriptors(globalThis);
    const before = Object.getOwnPropertyDescriptors(globalThis);
    const marker = Symbol('whisper-frame-bounds-test-mutation');
    try {
      Object.defineProperty(globalThis, marker, { value: true, configurable: true });
      expect(Object.getOwnPropertyDescriptors(globalThis)).not.toEqual(before);
    } finally {
      Reflect.deleteProperty(globalThis, marker);
    }
    expect(Object.getOwnPropertyDescriptors(globalThis)).toEqual(before);
  });

  it.each([1, 3, 7])('crops only the frame axis to %i and preserves caller state', async (actual) => {
    const { model, original, result } = setup();
    const options = optionsFor(actual);
    const before = { ...options };
    const dataBefore = [...options.inputs.data];

    expect(await model._generate_with_seek(options)).toBe(result);

    expect(options.inputs.slice).toHaveBeenCalledExactlyOnceWith(null, null, [0, actual]);
    expect(options.inputs.slice.mock.contexts[0]).toBe(options.inputs);
    const cropped = options.inputs.slice.mock.results[0].value as TensorFake;
    expect(original).toHaveBeenCalledExactlyOnceWith({ ...options, inputs: cropped });
    expect(original.mock.contexts[0]).toBe(model);
    const delegated = original.mock.calls[0][0];
    expect(delegated).not.toBe(options);
    expect(delegated.inputs).toBe(cropped);
    expect(cropped.dims).toEqual([1, 80, actual]);
    for (let mel = 0; mel < 80; mel += 1) {
      expect(cropped.data.slice(mel * actual, (mel + 1) * actual))
        .toEqual(dataBefore.slice(mel * 8, mel * 8 + actual));
    }
    for (const key of ['logits_processor', 'init_tokens', 'kwargs', 'extra_option'] as const) {
      expect(delegated[key]).toBe(options[key]);
    }
    expect(options).toEqual(before);
    expect(options.inputs).toBe(before.inputs);
    expect(options.generation_config).toBe(before.generation_config);
    expect(options.generation_config.num_frames).toBe(actual);
    expect(delegated.generation_config).toEqual(options.generation_config);
    expect(options.inputs.dims).toEqual([1, 80, 8]);
    expect(options.inputs.data).toEqual(dataBefore);
  });

  it.each([1, 8])('does not slice or copy a full-length %i-frame input', async (frames) => {
    const { model, original, result } = setup();
    const options = optionsFor(frames, frames);

    expect(await model._generate_with_seek(options)).toBe(result);

    expect(options.inputs.slice).not.toHaveBeenCalled();
    expect(original).toHaveBeenCalledExactlyOnceWith(options);
    expect(original.mock.calls[0][0].inputs).toBe(options.inputs);
    expect(original.mock.contexts[0]).toBe(model);
  });

  it('uses each call\'s actual frame count without leaking a previous crop', async () => {
    const { model, original } = setup();
    const inputs = Object.freeze(new TensorFake());
    for (const actual of [2, 8, 5]) {
      await model._generate_with_seek({ ...optionsFor(actual), inputs });
    }
    expect(original.mock.calls.map(([options]) => options.inputs.dims[2])).toEqual([2, 8, 5]);
    expect(original.mock.calls[1][0].inputs).toBe(inputs);
    expect(inputs.slice.mock.calls).toEqual([[null, null, [0, 2]], [null, null, [0, 5]]]);
    expect(inputs.dims).toEqual([1, 80, 8]);
  });

  it('preserves an asynchronously resolved result by identity', async () => {
    const result = { sequences: [42], token_timestamps: { marker: true } };
    const { model, original } = setup(Promise.resolve(result));
    expect(await model._generate_with_seek(optionsFor())).toBe(result);
    expect(original).toHaveBeenCalledTimes(1);
  });

  it.each(['throw', 'reject'] as const)('preserves the original error identity on %s', async (mode) => {
    const { model, original } = setup();
    const failure = new Error('original seek failure');
    original.mockImplementation(() => {
      if (mode === 'throw') throw failure;
      return Promise.reject(failure);
    });
    await expect(Promise.resolve().then(() => model._generate_with_seek(optionsFor())))
      .rejects.toBe(failure);
    expect(original).toHaveBeenCalledTimes(1);
    expect(original.mock.contexts[0]).toBe(model);
  });

  it('does not call the original if slicing fails', async () => {
    const { model, original } = setup();
    const options = optionsFor();
    const failure = new Error('slice failure');
    options.inputs.slice.mockImplementation(() => { throw failure; });
    await expect(Promise.resolve().then(() => model._generate_with_seek(options))).rejects.toBe(failure);
    expect(original).not.toHaveBeenCalled();
    expect(options.inputs.dims).toEqual([1, 80, 8]);
  });

  it('patches only the selected instance, leaving prototypes, globals and peers unchanged', async () => {
    const original = vi.fn(function (this: unknown, options: SeekOptions) { return options; });
    class ModelFake {
      _generate_with_seek(options: SeekOptions) { return original.call(this, options); }
    }
    const model = new ModelFake();
    const peer = new ModelFake();
    const method = peer._generate_with_seek;
    const surfaces = [globalThis, Object.prototype, Function.prototype, TensorFake.prototype, ModelFake.prototype];
    // Node's first descriptor read initializes lazy Undici globals; observe before the baseline.
    Object.getOwnPropertyDescriptors(globalThis);
    const before = surfaces.map(surface => Object.getOwnPropertyDescriptors(surface));

    install(model, VERSION);

    surfaces.forEach((surface, i) => expect(Object.getOwnPropertyDescriptors(surface)).toEqual(before[i]));
    const options = optionsFor();
    await model._generate_with_seek(options);
    expect(original.mock.contexts[0]).toBe(model);
    expect(original.mock.calls[0][0].inputs.dims).toEqual([1, 80, 3]);
    expect(peer._generate_with_seek).toBe(method);
    expect(new ModelFake()._generate_with_seek).toBe(method);
    expect(await peer._generate_with_seek(options)).toBe(options);
    expect(original.mock.contexts[1]).toBe(peer);
    expect(original.mock.calls[1][0].inputs).toBe(options.inputs);
    expect(options.inputs.slice).toHaveBeenCalledTimes(1);
    surfaces.forEach((surface, i) => expect(Object.getOwnPropertyDescriptors(surface)).toEqual(before[i]));
  });

  it.each([
    '3.8.1', '4.1.0', '4.2.1', '4.3.0', 'v4.2.0', '^4.2.0', '4.2.0-beta.1', '', undefined, null, 4.2,
  ])('rejects unsupported runtime version %j before patching or calling the original', async (version) => {
    const original = vi.fn();
    const model = { _generate_with_seek: original };
    await expect(Promise.resolve().then(() => install(model, version))).rejects.toThrow();
    expect(model._generate_with_seek).toBe(original);
    expect(original).not.toHaveBeenCalled();
  });

  it.each([
    null, undefined, 1, 'model', {}, { _generate_with_seek: null },
    { _generate_with_seek: 7 }, { _generate_with_seek: 'not callable' },
  ])('rejects a missing or non-callable private method on %j', async (model) => {
    await expect(Promise.resolve().then(() => install(model, VERSION))).rejects.toThrow();
  });

  it.each([
    ['missing inputs', undefined], ['null inputs', null], ['missing dims', {}],
    ['null dims', { dims: null }], ['rank two', { dims: [1, 80] }],
    ['rank four', { dims: [1, 80, 8, 1] }], ['batch two', { dims: [2, 80, 8] }],
    ['wrong mel count', { dims: [1, 128, 8] }], ['zero padding', { dims: [1, 80, 0] }],
    ['negative padding', { dims: [1, 80, -8] }], ['fractional padding', { dims: [1, 80, 8.5] }],
    ['NaN padding', { dims: [1, 80, NaN] }], ['infinite padding', { dims: [1, 80, Infinity] }],
    ['string padding', { dims: [1, 80, '8'] }],
  ])('rejects invalid tensor shape: %s', async (_label, shape) => {
    const { model, original } = setup();
    const slice = vi.fn();
    const inputs = shape == null ? shape : { ...shape as object, slice };
    const options = { ...optionsFor(), inputs } as unknown as SeekOptions;
    await expect(Promise.resolve().then(() => model._generate_with_seek(options))).rejects.toThrow();
    expect(original).not.toHaveBeenCalled();
    expect(slice).not.toHaveBeenCalled();
  });

  it.each([undefined, null, 7])('rejects non-callable tensor slice %j', async (slice) => {
    const { model, original } = setup();
    const options = { ...optionsFor(), inputs: { dims: [1, 80, 8], slice } } as unknown as SeekOptions;
    await expect(Promise.resolve().then(() => model._generate_with_seek(options))).rejects.toThrow();
    expect(original).not.toHaveBeenCalled();
  });

  it.each([undefined, null, 0, -1, 1.5, 9, NaN, Infinity, -Infinity, '3', true, [3]].map(actual => ({ actual })))(
    'rejects invalid actual frame count $actual without slicing or delegation', async ({ actual }) => {
      const { model, original } = setup();
      const options = {
        ...optionsFor(), generation_config: Object.freeze({ num_frames: actual }),
      } as unknown as SeekOptions;
      await expect(Promise.resolve().then(() => model._generate_with_seek(options))).rejects.toThrow();
      expect(options.inputs.slice).not.toHaveBeenCalled();
      expect(original).not.toHaveBeenCalled();
    },
  );

  it.each([undefined, null, {}, { inputs: new TensorFake() }, {
    inputs: new TensorFake(), generation_config: null,
  }])('rejects missing options or generation config %j before delegation', async (options) => {
    const { model, original } = setup();
    await expect(Promise.resolve().then(() => model._generate_with_seek(options as unknown as SeekOptions))).rejects.toThrow();
    expect(original).not.toHaveBeenCalled();
  });
});
