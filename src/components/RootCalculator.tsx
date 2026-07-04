import { useMemo, useState } from 'react';
import { calculateNthRoot, formatCalculatorNumber, type RootResult } from '../lib/calculator';

interface RootInputs {
  radicand: string;
  index: string;
}

interface RootExample {
  label: string;
  inputs: RootInputs;
}

interface RootCalculation {
  expression: string;
  result: RootResult;
  steps: string[];
}

const defaultInputs: RootInputs = {
  radicand: '144',
  index: '2',
};

const examples: RootExample[] = [
  {
    label: 'Square root',
    inputs: { radicand: '144', index: '2' },
  },
  {
    label: 'Cube root',
    inputs: { radicand: '-125', index: '3' },
  },
  {
    label: 'Fourth root',
    inputs: { radicand: '81', index: '4' },
  },
  {
    label: 'Decimal root',
    inputs: { radicand: '0.008', index: '3' },
  },
];

function parseNumber(value: string, label: string) {
  const parsed = Number(value.trim());

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function getRootName(index: number) {
  if (index === 2) return 'square root';
  if (index === 3) return 'cube root';
  return `${formatCalculatorNumber(index)}th root`;
}

function getRootSteps(result: RootResult) {
  const radicandText = formatCalculatorNumber(result.radicand);
  const indexText = formatCalculatorNumber(result.index);
  const answerText = formatCalculatorNumber(result.value);
  const exponentText = formatCalculatorNumber(result.exponent);

  return [
    `Start with the ${getRootName(result.index)} of ${radicandText}.`,
    `Rewrite the root as a rational exponent: ${radicandText}^(1/${indexText}).`,
    `That exponent is ${exponentText}.`,
    `The answer is ${answerText}, because ${answerText}^${indexText} returns ${radicandText}.`,
  ];
}

function buildCalculation(inputs: RootInputs): RootCalculation {
  const radicand = parseNumber(inputs.radicand, 'Radicand');
  const index = parseNumber(inputs.index, 'Root index');
  const result = calculateNthRoot(radicand, index);

  return {
    expression: `root_${formatCalculatorNumber(index)}(${formatCalculatorNumber(radicand)})`,
    result,
    steps: getRootSteps(result),
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
    <label className="root-field">
      <span>{label}</span>
      <input inputMode="decimal" onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

export default function RootCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<RootCalculation>(() => buildCalculation(defaultInputs));
  const [history, setHistory] = useState<RootCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const resultText = useMemo(() => formatCalculatorNumber(calculation.result.value), [calculation]);
  const powerCheck = useMemo(
    () => formatCalculatorNumber(calculation.result.value ** calculation.result.index),
    [calculation],
  );

  const updateInput = (key: keyof RootInputs, value: string) => {
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
      setError(caughtError instanceof Error ? caughtError.message : 'Check the root inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: RootExample) => {
    setInputs(example.inputs);
    calculate(example.inputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.expression} = ${resultText}`);
    setCopied(true);
  };

  return (
    <section className="root-calculator" aria-label="Root calculator">
      <div className="root-panel">
        <div className="root-fields">
          <NumberField
            label="Radicand"
            value={inputs.radicand}
            onChange={(value) => updateInput('radicand', value)}
          />
          <NumberField label="Root index" value={inputs.index} onChange={(value) => updateInput('index', value)} />
        </div>

        <div className="root-quick-grid" aria-label="Quick root examples">
          {examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="root-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate root
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="root-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : calculation.expression}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{resultText}</strong>
              <dl>
                <div>
                  <dt>Exponent form</dt>
                  <dd>1/{formatCalculatorNumber(calculation.result.index)}</dd>
                </div>
                <div>
                  <dt>Power check</dt>
                  <dd>{powerCheck}</dd>
                </div>
                <div>
                  <dt>Root type</dt>
                  <dd>{getRootName(calculation.result.index)}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="root-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <section className="root-side-panel" aria-label="Root calculator history">
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
            <p>Recent root answers will appear here.</p>
          )}
        </section>

        <section className="root-note">
          <h2>Input tips</h2>
          <p>Use index 2 for square roots and index 3 for cube roots.</p>
          <p>Negative radicands need an odd whole-number root index for real-number answers.</p>
        </section>
      </section>
    </section>
  );
}
