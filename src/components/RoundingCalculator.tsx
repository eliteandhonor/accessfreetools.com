import { useMemo, useState } from 'react';
import {
  calculateRoundedValue,
  formatCalculatorNumber,
  type RoundingMethod,
  type RoundingMode,
  type RoundingResult,
} from '../lib/calculator';

interface RoundingInputs {
  value: string;
  precision: string;
}

interface RoundingCalculation {
  expression: string;
  result: RoundingResult;
  steps: string[];
}

interface RoundingExample {
  label: string;
  mode: RoundingMode;
  method: RoundingMethod;
  inputs: RoundingInputs;
}

const modeLabels: Record<RoundingMode, string> = {
  'decimal-places': 'Decimal places',
  'significant-figures': 'Significant figures',
  'place-value': 'Place value',
};

const methodLabels: Record<RoundingMethod, string> = {
  nearest: 'Nearest',
  up: 'Round up',
  down: 'Round down',
  truncate: 'Truncate',
};

const defaultInputs: RoundingInputs = {
  value: '12.3456',
  precision: '2',
};

const examples: RoundingExample[] = [
  {
    label: '2 decimal places',
    mode: 'decimal-places',
    method: 'nearest',
    inputs: { value: '12.3456', precision: '2' },
  },
  {
    label: '3 significant figures',
    mode: 'significant-figures',
    method: 'nearest',
    inputs: { value: '98765', precision: '3' },
  },
  {
    label: 'Nearest hundred',
    mode: 'place-value',
    method: 'nearest',
    inputs: { value: '1846', precision: '2' },
  },
];

function parseNumber(value: string, label: string) {
  const parsed = Number(value.trim());

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function parsePrecision(value: string) {
  const parsed = Number(value.trim());

  if (!Number.isInteger(parsed)) {
    throw new Error('Precision must be a whole number');
  }

  return parsed;
}

function getPrecisionText(mode: RoundingMode, precision: number) {
  if (mode === 'decimal-places') {
    return `${precision} decimal ${precision === 1 ? 'place' : 'places'}`;
  }

  if (mode === 'significant-figures') {
    return `${precision} significant ${precision === 1 ? 'figure' : 'figures'}`;
  }

  return `nearest ${formatCalculatorNumber(10 ** precision)}`;
}

function getSteps(calculation: RoundingResult) {
  const value = formatCalculatorNumber(calculation.input);
  const result = formatCalculatorNumber(calculation.result);
  const precisionText = getPrecisionText(calculation.mode, calculation.precision);

  return [
    `Start with ${value}.`,
    `Use ${modeLabels[calculation.mode].toLowerCase()} mode with ${precisionText}.`,
    `Apply ${methodLabels[calculation.method].toLowerCase()} rounding.`,
    `The rounded value is ${result}.`,
  ];
}

function buildCalculation(mode: RoundingMode, method: RoundingMethod, inputs: RoundingInputs): RoundingCalculation {
  const value = parseNumber(inputs.value, 'Value');
  const precision = parsePrecision(inputs.precision);
  const result = calculateRoundedValue(value, mode, precision, method);

  return {
    expression: `${modeLabels[mode]}: ${formatCalculatorNumber(value)} to ${getPrecisionText(mode, precision)}`,
    result,
    steps: getSteps(result),
  };
}

export default function RoundingCalculator() {
  const [mode, setMode] = useState<RoundingMode>('decimal-places');
  const [method, setMethod] = useState<RoundingMethod>('nearest');
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<RoundingCalculation>(() =>
    buildCalculation('decimal-places', 'nearest', defaultInputs),
  );
  const [history, setHistory] = useState<RoundingCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const resultText = useMemo(() => formatCalculatorNumber(calculation.result.result), [calculation]);
  const differenceText = useMemo(() => formatCalculatorNumber(calculation.result.difference), [calculation]);

  const updateInput = (key: keyof RoundingInputs, value: string) => {
    setInputs((current) => ({ ...current, [key]: value }));
    setCopied(false);
  };

  const calculate = (nextMode = mode, nextMethod = method, nextInputs = inputs, saveHistory = true) => {
    try {
      const nextCalculation = buildCalculation(nextMode, nextMethod, nextInputs);
      setCalculation(nextCalculation);
      if (saveHistory) {
        setHistory((items) => [nextCalculation, ...items].slice(0, 6));
      }
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the rounding inputs');
      setCopied(false);
    }
  };

  const changeMode = (nextMode: RoundingMode) => {
    setMode(nextMode);
    calculate(nextMode, method, inputs, false);
  };

  const changeMethod = (nextMethod: RoundingMethod) => {
    setMethod(nextMethod);
    calculate(mode, nextMethod, inputs, false);
  };

  const loadExample = (example: RoundingExample) => {
    setMode(example.mode);
    setMethod(example.method);
    setInputs(example.inputs);
    calculate(example.mode, example.method, example.inputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.expression}: ${resultText}`);
    setCopied(true);
  };

  return (
    <section className="advanced-calculator advanced-calculator-rounding" aria-label="Rounding calculator">
      <div className="advanced-panel">
        <div className="advanced-mode-grid" aria-label="Rounding modes">
          {(Object.keys(modeLabels) as RoundingMode[]).map((item) => (
            <button aria-pressed={mode === item} key={item} onClick={() => changeMode(item)} type="button">
              {modeLabels[item]}
            </button>
          ))}
        </div>

        <div className="advanced-mode-grid" aria-label="Rounding methods">
          {(Object.keys(methodLabels) as RoundingMethod[]).map((item) => (
            <button aria-pressed={method === item} key={item} onClick={() => changeMethod(item)} type="button">
              {methodLabels[item]}
            </button>
          ))}
        </div>

        <div className="advanced-fields">
          <label className="advanced-field">
            <span>Value</span>
            <input inputMode="decimal" onChange={(event) => updateInput('value', event.target.value)} value={inputs.value} />
          </label>
          <label className="advanced-field">
            <span>{mode === 'place-value' ? 'Place exponent' : 'Precision'}</span>
            <input
              inputMode="numeric"
              onChange={(event) => updateInput('precision', event.target.value)}
              value={inputs.precision}
            />
          </label>
        </div>

        <div className="advanced-quick-grid" aria-label="Rounding examples">
          {examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Round value
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{error ? 'Check input' : calculation.expression}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{resultText}</strong>
              <dl>
                <div>
                  <dt>Method</dt>
                  <dd>{methodLabels[calculation.result.method]}</dd>
                </div>
                <div>
                  <dt>Precision</dt>
                  <dd>{getPrecisionText(calculation.result.mode, calculation.result.precision)}</dd>
                </div>
                <div>
                  <dt>Difference</dt>
                  <dd>{differenceText}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="advanced-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <section className="advanced-side-panel" aria-label="Rounding calculator history">
        <section>
          <h2>Recent answers</h2>
          {history.length > 0 ? (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{formatCalculatorNumber(item.result.result)}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent rounded values will appear here.</p>
          )}
        </section>

        <section className="advanced-note">
          <h2>Input tips</h2>
          <p>For place value mode, exponent 2 means nearest 100 and exponent -2 means nearest 0.01.</p>
          <p>Nearest uses standard half-away-from-zero rounding.</p>
        </section>
      </section>
    </section>
  );
}
