import { useMemo, useState } from 'react';
import { calculateExponent, formatCalculatorNumber, parseExponentInput, type ExponentResult } from '../lib/calculator';

interface ExponentInputs {
  base: string;
  exponent: string;
}

interface ExponentCalculation {
  expression: string;
  result: ExponentResult;
  rawExponent: string;
  steps: string[];
}

interface ExponentExample {
  label: string;
  inputs: ExponentInputs;
}

const defaultInputs: ExponentInputs = {
  base: '2',
  exponent: '8',
};

const examples: ExponentExample[] = [
  {
    label: '2 to the 8th',
    inputs: { base: '2', exponent: '8' },
  },
  {
    label: 'Power of 10',
    inputs: { base: '10', exponent: '6' },
  },
  {
    label: 'Negative exponent',
    inputs: { base: '5', exponent: '-3' },
  },
  {
    label: 'Square root exponent',
    inputs: { base: '81', exponent: '1/2' },
  },
  {
    label: 'Zero exponent',
    inputs: { base: '9', exponent: '0' },
  },
];

function parseNumber(value: string, label: string) {
  const parsed = Number(value.trim());

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function formatScientific(value: number) {
  if (value === 0) {
    return '0';
  }

  return value.toExponential(8).replace(/\.?0+e/, 'e');
}

function formatPowerExpression(base: number, exponentLabel: string) {
  return `${formatCalculatorNumber(base)}^${exponentLabel}`;
}

function getExponentSteps(base: number, exponent: number, rawExponent: string, value: number) {
  const baseText = formatCalculatorNumber(base);
  const exponentText = rawExponent.trim();
  const resultText = formatCalculatorNumber(value);

  if (exponent === 0) {
    return [
      `${baseText}^0 uses the zero exponent rule.`,
      `Any nonzero base raised to 0 equals 1.`,
      `The answer is ${resultText}.`,
    ];
  }

  if (exponent === 1) {
    return [
      `${baseText}^1 uses the first-power rule.`,
      'A base raised to 1 stays the same.',
      `The answer is ${resultText}.`,
    ];
  }

  if (Number.isInteger(exponent) && exponent > 1 && exponent <= 8) {
    return [
      `${baseText}^${exponentText} means multiply ${baseText} by itself ${exponent} times.`,
      Array.from({ length: exponent }, () => baseText).join(' x '),
      `The answer is ${resultText}.`,
    ];
  }

  if (Number.isInteger(exponent) && exponent < 0) {
    return [
      `${baseText}^${exponentText} uses the negative exponent rule.`,
      `Move the power to the denominator: 1 / ${baseText}^${Math.abs(exponent)}.`,
      `The answer is ${resultText}.`,
    ];
  }

  if (!Number.isInteger(exponent)) {
    return [
      `${baseText}^${exponentText} uses a fractional or decimal exponent.`,
      'Fractional exponents can represent roots and powers, such as exponent 1/2 for a square root.',
      `The answer is ${resultText}.`,
    ];
  }

  return [
    `${baseText}^${exponentText} means the base is raised to that power.`,
    'Large powers are calculated directly and shown in standard and scientific notation.',
    `The answer is ${resultText}.`,
  ];
}

function buildCalculation(inputs: ExponentInputs): ExponentCalculation {
  const base = parseNumber(inputs.base, 'Base');
  const exponent = parseExponentInput(inputs.exponent);
  const result = calculateExponent(base, exponent);
  const exponentLabel = inputs.exponent.trim();

  return {
    expression: formatPowerExpression(base, exponentLabel),
    result,
    rawExponent: exponentLabel,
    steps: getExponentSteps(base, exponent, exponentLabel, result.value),
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
    <label className="exponent-field">
      <span>{label}</span>
      <input
        inputMode="decimal"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

export default function ExponentCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<ExponentCalculation>(() => buildCalculation(defaultInputs));
  const [history, setHistory] = useState<ExponentCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const resultText = useMemo(() => formatCalculatorNumber(calculation.result.value), [calculation]);
  const scientificText = useMemo(() => formatScientific(calculation.result.value), [calculation]);

  const updateInput = (key: keyof ExponentInputs, value: string) => {
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
      setError(caughtError instanceof Error ? caughtError.message : 'Check the exponent inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: ExponentExample) => {
    setInputs(example.inputs);
    calculate(example.inputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.expression} = ${resultText}`);
    setCopied(true);
  };

  return (
    <section className="exponent-calculator" aria-label="Exponent calculator">
      <div className="exponent-panel">
        <div className="exponent-fields">
          <NumberField label="Base" value={inputs.base} onChange={(value) => updateInput('base', value)} />
          <NumberField
            label="Exponent"
            value={inputs.exponent}
            onChange={(value) => updateInput('exponent', value)}
          />
        </div>

        <div className="exponent-quick-grid" aria-label="Quick exponent examples">
          {examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="exponent-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate exponent
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="exponent-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : calculation.expression}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{resultText}</strong>
              <dl>
                <div>
                  <dt>Scientific notation</dt>
                  <dd>{scientificText}</dd>
                </div>
                <div>
                  <dt>Base</dt>
                  <dd>{formatCalculatorNumber(calculation.result.base)}</dd>
                </div>
                <div>
                  <dt>Exponent</dt>
                  <dd>{calculation.rawExponent}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="exponent-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <section className="exponent-side-panel" aria-label="Exponent calculator history">
        <section>
          <h2>Recent answers</h2>
          {history.length > 0 ? (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{formatCalculatorNumber(item.result.value)}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent exponent answers will appear here.</p>
          )}
        </section>

        <section className="exponent-note">
          <h2>Input tips</h2>
          <p>Use whole numbers, decimals, or simple fractions like 1/2 in the exponent box.</p>
          <p>Negative bases work with whole-number exponents only in this calculator.</p>
        </section>
      </section>
    </section>
  );
}
