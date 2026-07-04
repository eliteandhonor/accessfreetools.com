import { useMemo, useState } from 'react';
import { calculateLogarithm, formatCalculatorNumber, type LogarithmResult } from '../lib/calculator';

interface LogInputs {
  value: string;
  base: string;
}

interface LogExample {
  label: string;
  inputs: LogInputs;
}

interface LogCalculation {
  expression: string;
  result: LogarithmResult;
  steps: string[];
}

const defaultInputs: LogInputs = {
  value: '8',
  base: '2',
};

const examples: LogExample[] = [
  {
    label: 'Base 2',
    inputs: { value: '8', base: '2' },
  },
  {
    label: 'Common log',
    inputs: { value: '1000', base: '10' },
  },
  {
    label: 'Natural log',
    inputs: { value: '20.0855369232', base: 'e' },
  },
  {
    label: 'Base 5',
    inputs: { value: '625', base: '5' },
  },
];

function parseNumber(value: string, label: string) {
  const trimmed = value.trim();
  const parsed = trimmed.toLowerCase() === 'e' ? Math.E : Number(trimmed);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function formatBase(base: number) {
  return Math.abs(base - Math.E) < 1e-10 ? 'e' : formatCalculatorNumber(base);
}

function getLogSteps(result: LogarithmResult) {
  const valueText = formatCalculatorNumber(result.value);
  const baseText = formatBase(result.base);
  const answerText = formatCalculatorNumber(result.result);
  const lnValue = formatCalculatorNumber(result.naturalLog);
  const lnBase = formatCalculatorNumber(Math.log(result.base));

  return [
    `Start with log base ${baseText} of ${valueText}.`,
    'Use the change-of-base formula: log_b(x) = ln(x) / ln(b).',
    `Substitute the values: ln(${valueText}) / ln(${baseText}) = ${lnValue} / ${lnBase}.`,
    `The answer is ${answerText}.`,
  ];
}

function buildCalculation(inputs: LogInputs): LogCalculation {
  const value = parseNumber(inputs.value, 'Log value');
  const base = parseNumber(inputs.base, 'Log base');
  const result = calculateLogarithm(value, base);
  const expression = `log_${formatBase(base)}(${formatCalculatorNumber(value)})`;

  return {
    expression,
    result,
    steps: getLogSteps(result),
  };
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="log-field">
      <span>{label}</span>
      <input inputMode="decimal" onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

export default function LogCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<LogCalculation>(() => buildCalculation(defaultInputs));
  const [history, setHistory] = useState<LogCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const resultText = useMemo(() => formatCalculatorNumber(calculation.result.result), [calculation]);
  const exponentCheck = useMemo(
    () => formatCalculatorNumber(calculation.result.base ** calculation.result.result),
    [calculation],
  );

  const updateInput = (key: keyof LogInputs, value: string) => {
    setInputs((current) => ({ ...current, [key]: value }));
    setCopied(false);
  };

  const calculate = (nextInputs = inputs) => {
    try {
      const nextCalculation = buildCalculation(nextInputs);
      setCalculation(nextCalculation);
      setHistory((items) => [nextCalculation, ...items].slice(0, 6));
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the logarithm inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: LogExample) => {
    setInputs(example.inputs);
    calculate(example.inputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.expression} = ${resultText}`);
    setCopied(true);
  };

  return (
    <section className="log-calculator" aria-label="Log calculator">
      <div className="log-panel">
        <div className="log-fields">
          <NumberField label="Value" value={inputs.value} onChange={(value) => updateInput('value', value)} />
          <NumberField label="Base" value={inputs.base} onChange={(value) => updateInput('base', value)} />
        </div>

        <div className="log-quick-grid" aria-label="Quick logarithm examples">
          {examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="log-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate log
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="log-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : calculation.expression}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{resultText}</strong>
              <dl>
                <div>
                  <dt>ln(value)</dt>
                  <dd>{formatCalculatorNumber(calculation.result.naturalLog)}</dd>
                </div>
                <div>
                  <dt>log10(value)</dt>
                  <dd>{formatCalculatorNumber(calculation.result.commonLog)}</dd>
                </div>
                <div>
                  <dt>Power check</dt>
                  <dd>{exponentCheck}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="log-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <section className="log-side-panel" aria-label="Log calculator history">
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
            <p>Recent log answers will appear here.</p>
          )}
        </section>

        <section className="log-note">
          <h2>Input tips</h2>
          <p>The value must be greater than zero.</p>
          <p>The base must be greater than zero and cannot equal 1. Enter e for a natural log base.</p>
        </section>
      </section>
    </section>
  );
}
