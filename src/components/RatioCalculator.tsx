import { useMemo, useState } from 'react';
import {
  calculateEquivalentRatio,
  calculateRatioShare,
  formatCalculatorNumber,
  simplifyRatioValues,
} from '../lib/calculator';

type RatioMode = 'simplify' | 'equivalent' | 'share';

interface RatioInputs {
  first: string;
  second: string;
  third: string;
  knownLeft: string;
  knownRight: string;
  newLeft: string;
  total: string;
}

interface RatioExample {
  label: string;
  mode: RatioMode;
  inputs: Partial<RatioInputs>;
}

interface RatioCalculation {
  mode: RatioMode;
  expression: string;
  answer: string;
  metrics: Array<{ label: string; value: string }>;
  steps: string[];
}

const defaultInputs: RatioInputs = {
  first: '12',
  second: '18',
  third: '',
  knownLeft: '4',
  knownRight: '7',
  newLeft: '20',
  total: '100',
};

const modes: Array<{ value: RatioMode; label: string }> = [
  { value: 'simplify', label: 'Simplify' },
  { value: 'equivalent', label: 'Equivalent' },
  { value: 'share', label: 'Split total' },
];

const examples: RatioExample[] = [
  {
    label: 'Simplify 12:18',
    mode: 'simplify',
    inputs: { first: '12', second: '18', third: '' },
  },
  {
    label: 'Three-part ratio',
    mode: 'simplify',
    inputs: { first: '6', second: '9', third: '15' },
  },
  {
    label: 'Find matching side',
    mode: 'equivalent',
    inputs: { knownLeft: '4', knownRight: '7', newLeft: '20' },
  },
  {
    label: 'Split 100',
    mode: 'share',
    inputs: { first: '2', second: '3', third: '', total: '100' },
  },
];

function parseNumber(value: string, label: string) {
  const parsed = Number(value.trim());

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function formatRatio(values: number[]) {
  return values.map((value) => formatCalculatorNumber(value)).join(':');
}

function getRatioValues(inputs: RatioInputs) {
  const values = [
    parseNumber(inputs.first, 'First ratio value'),
    parseNumber(inputs.second, 'Second ratio value'),
  ];

  if (inputs.third.trim()) {
    values.push(parseNumber(inputs.third, 'Third ratio value'));
  }

  return values;
}

function buildCalculation(mode: RatioMode, inputs: RatioInputs): RatioCalculation {
  if (mode === 'equivalent') {
    const knownLeft = parseNumber(inputs.knownLeft, 'Known left value');
    const knownRight = parseNumber(inputs.knownRight, 'Known right value');
    const newLeft = parseNumber(inputs.newLeft, 'New left value');
    const result = calculateEquivalentRatio(knownLeft, knownRight, newLeft);
    const answer = `${formatCalculatorNumber(result.newLeft)}:${formatCalculatorNumber(result.newRight)}`;
    const scaleFactor = result.newLeft / result.knownLeft;

    return {
      mode,
      expression: `${formatCalculatorNumber(knownLeft)}:${formatCalculatorNumber(knownRight)} = ${formatCalculatorNumber(newLeft)}:?`,
      answer,
      metrics: [
        { label: 'Scale factor', value: formatCalculatorNumber(scaleFactor) },
        { label: 'Missing value', value: formatCalculatorNumber(result.newRight) },
        { label: 'Equivalent ratio', value: answer },
      ],
      steps: [
        `Start with ${formatCalculatorNumber(knownLeft)}:${formatCalculatorNumber(knownRight)}.`,
        `Find the scale factor by dividing ${formatCalculatorNumber(newLeft)} by ${formatCalculatorNumber(knownLeft)}.`,
        `Scale the other side: ${formatCalculatorNumber(knownRight)} x ${formatCalculatorNumber(scaleFactor)} = ${formatCalculatorNumber(result.newRight)}.`,
        `The equivalent ratio is ${answer}.`,
      ],
    };
  }

  if (mode === 'share') {
    const values = getRatioValues(inputs);
    const total = parseNumber(inputs.total, 'Total');
    const result = calculateRatioShare(total, values);
    const ratioTotal = values.reduce((sum, value) => sum + value, 0);
    const answer = result.shares.map((share) => formatCalculatorNumber(share)).join(', ');

    return {
      mode,
      expression: `${formatCalculatorNumber(total)} split by ${formatRatio(values)}`,
      answer,
      metrics: [
        { label: 'Ratio total', value: formatCalculatorNumber(ratioTotal) },
        { label: 'One part', value: formatCalculatorNumber(total / ratioTotal) },
        { label: 'Shares', value: answer },
      ],
      steps: [
        `Add the ratio parts: ${formatRatio(values)} gives ${formatCalculatorNumber(ratioTotal)} total parts.`,
        `Find one part: ${formatCalculatorNumber(total)} / ${formatCalculatorNumber(ratioTotal)} = ${formatCalculatorNumber(total / ratioTotal)}.`,
        `Multiply each ratio part by one part.`,
        `The shares are ${answer}.`,
      ],
    };
  }

  const values = getRatioValues(inputs);
  const result = simplifyRatioValues(values);
  const simplified = formatRatio(result.simplifiedValues);

  return {
    mode,
    expression: `${formatRatio(values)} = ${simplified}`,
    answer: simplified,
    metrics: [
      { label: 'Original ratio', value: formatRatio(values) },
      { label: 'Scaled whole values', value: formatRatio(result.scaledValues) },
      { label: 'Greatest divisor', value: formatCalculatorNumber(result.divisor) },
    ],
    steps: [
      `Start with the ratio ${formatRatio(values)}.`,
      `Clear decimals if needed, giving ${formatRatio(result.scaledValues)}.`,
      `Divide each part by the greatest common divisor, ${formatCalculatorNumber(result.divisor)}.`,
      `The simplified ratio is ${simplified}.`,
    ],
  };
}

function NumberField({
  label,
  value,
  onChange,
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
}) {
  return (
    <label className="ratio-field">
      <span>
        {label}
        {optional && <small> optional</small>}
      </span>
      <input inputMode="decimal" onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

export default function RatioCalculator() {
  const [mode, setMode] = useState<RatioMode>('simplify');
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<RatioCalculation>(() =>
    buildCalculation('simplify', defaultInputs),
  );
  const [history, setHistory] = useState<RatioCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const activeModeLabel = useMemo(
    () => modes.find((item) => item.value === calculation.mode)?.label ?? 'Ratio',
    [calculation],
  );

  const updateInput = (key: keyof RatioInputs, value: string) => {
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
      setError(caughtError instanceof Error ? caughtError.message : 'Check the ratio inputs');
      setCopied(false);
    }
  };

  const changeMode = (nextMode: RatioMode) => {
    setMode(nextMode);
    calculate(nextMode, inputs, false);
  };

  const loadExample = (example: RatioExample) => {
    const nextInputs = { ...inputs, ...example.inputs };
    setMode(example.mode);
    setInputs(nextInputs);
    calculate(example.mode, nextInputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.expression}; ${calculation.answer}`);
    setCopied(true);
  };

  return (
    <section className="ratio-calculator" aria-label="Ratio calculator">
      <div className="ratio-panel">
        <div className="ratio-mode-grid" aria-label="Ratio modes">
          {modes.map((item) => (
            <button
              aria-pressed={mode === item.value}
              key={item.value}
              onClick={() => changeMode(item.value)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        {mode === 'equivalent' ? (
          <div className="ratio-fields">
            <NumberField
              label="Known left"
              value={inputs.knownLeft}
              onChange={(value) => updateInput('knownLeft', value)}
            />
            <NumberField
              label="Known right"
              value={inputs.knownRight}
              onChange={(value) => updateInput('knownRight', value)}
            />
            <NumberField
              label="New left"
              value={inputs.newLeft}
              onChange={(value) => updateInput('newLeft', value)}
            />
          </div>
        ) : (
          <div className="ratio-fields">
            <NumberField label="First part" value={inputs.first} onChange={(value) => updateInput('first', value)} />
            <NumberField
              label="Second part"
              value={inputs.second}
              onChange={(value) => updateInput('second', value)}
            />
            <NumberField
              label="Third part"
              optional
              value={inputs.third}
              onChange={(value) => updateInput('third', value)}
            />
            {mode === 'share' && (
              <NumberField label="Total" value={inputs.total} onChange={(value) => updateInput('total', value)} />
            )}
          </div>
        )}

        <div className="ratio-quick-grid" aria-label="Quick ratio examples">
          {examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="ratio-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate ratio
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="ratio-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : activeModeLabel}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{calculation.answer}</strong>
              <dl>
                {calculation.metrics.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="ratio-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <aside className="ratio-side-panel" aria-label="Ratio calculator history">
        <section>
          <h2>Recent answers</h2>
          {history.length > 0 ? (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{item.answer}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent ratio answers will appear here.</p>
          )}
        </section>

        <section className="ratio-note">
          <h2>Input tips</h2>
          <p>Simplify mode accepts two-part or three-part ratios.</p>
          <p>Use Split total when a total amount needs to be divided by ratio parts.</p>
        </section>
      </aside>
    </section>
  );
}
