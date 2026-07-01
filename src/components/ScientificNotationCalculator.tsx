import { useMemo, useState } from 'react';
import {
  formatCalculatorNumber,
  fromScientificNotation,
  toScientificNotation,
  type ScientificNotationResult,
} from '../lib/calculator';

type ScientificNotationMode = 'to-scientific' | 'to-standard';

interface ScientificNotationInputs {
  value: string;
  coefficient: string;
  exponent: string;
}

interface ScientificNotationCalculation {
  mode: ScientificNotationMode;
  expression: string;
  result: ScientificNotationResult;
  steps: string[];
}

interface ScientificNotationExample {
  label: string;
  mode: ScientificNotationMode;
  inputs: Partial<ScientificNotationInputs>;
}

const defaultInputs: ScientificNotationInputs = {
  value: '4500000',
  coefficient: '6.02',
  exponent: '23',
};

const examples: ScientificNotationExample[] = [
  {
    label: '4,500,000',
    mode: 'to-scientific',
    inputs: { value: '4500000' },
  },
  {
    label: '0.00042',
    mode: 'to-scientific',
    inputs: { value: '0.00042' },
  },
  {
    label: '-320,000',
    mode: 'to-scientific',
    inputs: { value: '-320000' },
  },
  {
    label: '1.2e-7',
    mode: 'to-scientific',
    inputs: { value: '1.2e-7' },
  },
  {
    label: '6.02 x 10^23',
    mode: 'to-standard',
    inputs: { coefficient: '6.02', exponent: '23' },
  },
  {
    label: '7.5 x 10^-3',
    mode: 'to-standard',
    inputs: { coefficient: '7.5', exponent: '-3' },
  },
];

function parseNumber(value: string, label: string) {
  const parsed = Number(value.trim().replace(/,/g, ''));

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function parseExponent(value: string) {
  const parsed = Number(value.trim());

  if (!Number.isInteger(parsed)) {
    throw new Error('Exponent must be a whole number');
  }

  return parsed;
}

function getSteps(mode: ScientificNotationMode, result: ScientificNotationResult) {
  if (mode === 'to-standard') {
    return [
      `Start with ${result.notation}.`,
      'Move the decimal point based on the power of 10.',
      `The standard-form value is ${result.standard}.`,
    ];
  }

  return [
    `Start with ${result.standard}.`,
    'Move the decimal point until one nonzero digit is left of the decimal.',
    `Count the moves to get the exponent ${result.exponent}.`,
    `The scientific notation is ${result.notation}.`,
  ];
}

function buildCalculation(mode: ScientificNotationMode, inputs: ScientificNotationInputs): ScientificNotationCalculation {
  const result =
    mode === 'to-standard'
      ? fromScientificNotation(parseNumber(inputs.coefficient, 'Coefficient'), parseExponent(inputs.exponent))
      : toScientificNotation(parseNumber(inputs.value, 'Value'));

  return {
    mode,
    expression: mode === 'to-standard' ? `${inputs.coefficient} x 10^${inputs.exponent}` : inputs.value,
    result,
    steps: getSteps(mode, result),
  };
}

export default function ScientificNotationCalculator() {
  const [mode, setMode] = useState<ScientificNotationMode>('to-scientific');
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<ScientificNotationCalculation>(() =>
    buildCalculation('to-scientific', defaultInputs),
  );
  const [history, setHistory] = useState<ScientificNotationCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const standardText = useMemo(() => calculation.result.standard, [calculation]);
  const notationText = useMemo(() => calculation.result.notation, [calculation]);

  const updateInput = (key: keyof ScientificNotationInputs, value: string) => {
    setInputs((current) => ({ ...current, [key]: value }));
    setCopied(false);
  };

  const calculate = (nextMode = mode, nextInputs = inputs, saveHistory = true) => {
    try {
      const nextCalculation = buildCalculation(nextMode, nextInputs);
      setCalculation(nextCalculation);
      if (saveHistory) {
        setHistory((items) => [nextCalculation, ...items].slice(0, 6));
      }
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the scientific notation inputs');
      setCopied(false);
    }
  };

  const changeMode = (nextMode: ScientificNotationMode) => {
    setMode(nextMode);
    calculate(nextMode, inputs, false);
  };

  const loadExample = (example: ScientificNotationExample) => {
    const nextInputs = { ...inputs, ...example.inputs };
    setMode(example.mode);
    setInputs(nextInputs);
    calculate(example.mode, nextInputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.expression}: ${notationText}; standard ${standardText}`);
    setCopied(true);
  };

  return (
    <section className="advanced-calculator advanced-calculator-scientific-notation" aria-label="Scientific notation calculator">
      <div className="advanced-panel">
        <div className="advanced-mode-grid" aria-label="Scientific notation modes">
          <button aria-pressed={mode === 'to-scientific'} onClick={() => changeMode('to-scientific')} type="button">
            To scientific
          </button>
          <button aria-pressed={mode === 'to-standard'} onClick={() => changeMode('to-standard')} type="button">
            To standard
          </button>
        </div>

        {mode === 'to-scientific' ? (
          <label className="advanced-field">
            <span>Standard number</span>
            <input inputMode="decimal" onChange={(event) => updateInput('value', event.target.value)} value={inputs.value} />
          </label>
        ) : (
          <div className="advanced-fields">
            <label className="advanced-field">
              <span>Coefficient</span>
              <input
                inputMode="decimal"
                onChange={(event) => updateInput('coefficient', event.target.value)}
                value={inputs.coefficient}
              />
            </label>
            <label className="advanced-field">
              <span>Exponent</span>
              <input inputMode="numeric" onChange={(event) => updateInput('exponent', event.target.value)} value={inputs.exponent} />
            </label>
          </div>
        )}

        <div className="advanced-quick-grid" aria-label="Scientific notation examples">
          {examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Convert notation
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{error ? 'Check input' : 'Scientific notation'}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{notationText}</strong>
              <dl>
                <div>
                  <dt>Standard form</dt>
                  <dd>{standardText}</dd>
                </div>
                <div>
                  <dt>Coefficient</dt>
                  <dd>{formatCalculatorNumber(calculation.result.coefficient)}</dd>
                </div>
                <div>
                  <dt>Exponent</dt>
                  <dd>{calculation.result.exponent}</dd>
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

      <aside className="advanced-side-panel" aria-label="Scientific notation calculator history">
        <section>
          <h2>Recent answers</h2>
          {history.length > 0 ? (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{item.result.notation}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent notation conversions will appear here.</p>
          )}
        </section>

        <section className="advanced-note">
          <h2>Input tips</h2>
          <p>Scientific notation uses a coefficient times a power of 10.</p>
          <p>The coefficient should usually be at least 1 and less than 10 in normalized form.</p>
          <p>Positive exponents move the decimal right. Negative exponents move it left.</p>
          <p>For exact huge-integer arithmetic, use the Big Number Calculator instead.</p>
        </section>
      </aside>
    </section>
  );
}
