import { useMemo, useState } from 'react';
import {
  calculateHalfLifeElapsedTime,
  calculateHalfLifeRemaining,
  calculateHalfLifeValue,
  formatCalculatorNumber,
} from '../lib/calculator';

type HalfLifeMode = 'remaining' | 'elapsed-time' | 'half-life';

interface HalfLifeInputs {
  initialAmount: string;
  finalAmount: string;
  halfLife: string;
  elapsedTime: string;
  amountUnit: string;
  timeUnit: string;
}

interface HalfLifeExample {
  label: string;
  mode: HalfLifeMode;
  inputs: HalfLifeInputs;
}

interface HalfLifeCalculation {
  mode: HalfLifeMode;
  label: string;
  answer: string;
  supportingText: string;
  metrics: Array<{ label: string; value: string }>;
  steps: string[];
}

const defaultInputs: HalfLifeInputs = {
  initialAmount: '100',
  finalAmount: '12.5',
  halfLife: '6',
  elapsedTime: '18',
  amountUnit: 'mg',
  timeUnit: 'hours',
};

const examples: HalfLifeExample[] = [
  {
    label: 'Medicine-style decay',
    mode: 'remaining',
    inputs: {
      initialAmount: '100',
      finalAmount: '12.5',
      halfLife: '6',
      elapsedTime: '18',
      amountUnit: 'mg',
      timeUnit: 'hours',
    },
  },
  {
    label: 'Carbon-style decay',
    mode: 'remaining',
    inputs: {
      initialAmount: '100',
      finalAmount: '25',
      halfLife: '5730',
      elapsedTime: '11460',
      amountUnit: '%',
      timeUnit: 'years',
    },
  },
  {
    label: 'Find elapsed time',
    mode: 'elapsed-time',
    inputs: {
      initialAmount: '80',
      finalAmount: '10',
      halfLife: '12',
      elapsedTime: '36',
      amountUnit: 'g',
      timeUnit: 'hours',
    },
  },
  {
    label: 'Find half-life',
    mode: 'half-life',
    inputs: {
      initialAmount: '100',
      finalAmount: '25',
      halfLife: '5',
      elapsedTime: '10',
      amountUnit: 'g',
      timeUnit: 'days',
    },
  },
];

const modeLabels: Record<HalfLifeMode, { title: string; description: string }> = {
  remaining: {
    title: 'Remaining amount',
    description: 'Use initial amount, half-life, and elapsed time.',
  },
  'elapsed-time': {
    title: 'Elapsed time',
    description: 'Use initial amount, final amount, and half-life.',
  },
  'half-life': {
    title: 'Half-life',
    description: 'Use initial amount, final amount, and elapsed time.',
  },
};

function parseNumber(value: string, label: string) {
  const parsed = Number(value.trim());

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function unitSuffix(unit: string) {
  return unit.trim() ? ` ${unit.trim()}` : '';
}

function formatAmount(value: number, unit: string) {
  const suffix = unit.trim() === '%' ? '%' : unitSuffix(unit);

  return `${formatCalculatorNumber(value)}${suffix}`;
}

function formatTime(value: number, unit: string) {
  return `${formatCalculatorNumber(value)}${unitSuffix(unit)}`;
}

function formatPercent(value: number) {
  return `${formatCalculatorNumber(value)}%`;
}

function buildCalculation(mode: HalfLifeMode, inputs: HalfLifeInputs): HalfLifeCalculation {
  const initialAmount = parseNumber(inputs.initialAmount, 'Initial amount');
  const finalAmount = parseNumber(inputs.finalAmount, 'Final amount');
  const halfLife = parseNumber(inputs.halfLife, 'Half-life');
  const elapsedTime = parseNumber(inputs.elapsedTime, 'Elapsed time');
  const amountUnit = inputs.amountUnit.trim();
  const timeUnit = inputs.timeUnit.trim();

  if (mode === 'remaining') {
    const result = calculateHalfLifeRemaining(initialAmount, halfLife, elapsedTime);
    const halfLivesText = formatCalculatorNumber(result.halfLives);
    const remainingText = formatAmount(result.remainingAmount, amountUnit);

    return {
      mode,
      label: `${formatAmount(initialAmount, amountUnit)} for ${formatTime(elapsedTime, timeUnit)}`,
      answer: `${remainingText} remaining`,
      supportingText: `${formatPercent(result.percentRemaining)} remains and ${formatPercent(result.percentDecayed)} has decayed.`,
      metrics: [
        { label: 'Half-lives passed', value: halfLivesText },
        { label: 'Decayed amount', value: formatAmount(result.decayedAmount, amountUnit) },
        { label: 'Percent remaining', value: formatPercent(result.percentRemaining) },
      ],
      steps: [
        'Use the decay formula: remaining amount = initial amount x (1/2)^(elapsed time / half-life).',
        `${formatTime(elapsedTime, timeUnit)} / ${formatTime(halfLife, timeUnit)} = ${halfLivesText} half-lives.`,
        `${formatAmount(initialAmount, amountUnit)} x (1/2)^${halfLivesText} = ${remainingText}.`,
      ],
    };
  }

  if (mode === 'elapsed-time') {
    const elapsedTimeAnswer = calculateHalfLifeElapsedTime(initialAmount, finalAmount, halfLife);
    const halfLives = elapsedTimeAnswer / halfLife;
    const percentRemaining = (finalAmount / initialAmount) * 100;

    return {
      mode,
      label: `${formatAmount(initialAmount, amountUnit)} to ${formatAmount(finalAmount, amountUnit)}`,
      answer: formatTime(elapsedTimeAnswer, timeUnit),
      supportingText: `${formatPercent(percentRemaining)} remains after ${formatCalculatorNumber(halfLives)} half-lives.`,
      metrics: [
        { label: 'Half-lives passed', value: formatCalculatorNumber(halfLives) },
        { label: 'Percent remaining', value: formatPercent(percentRemaining) },
        { label: 'Half-life used', value: formatTime(halfLife, timeUnit) },
      ],
      steps: [
        'Use the rearranged formula: elapsed time = half-life x log(final / initial) / log(1/2).',
        `${formatAmount(finalAmount, amountUnit)} / ${formatAmount(initialAmount, amountUnit)} = ${formatCalculatorNumber(finalAmount / initialAmount)}.`,
        `${formatTime(halfLife, timeUnit)} x log(${formatCalculatorNumber(finalAmount / initialAmount)}) / log(1/2) = ${formatTime(elapsedTimeAnswer, timeUnit)}.`,
      ],
    };
  }

  const halfLifeAnswer = calculateHalfLifeValue(initialAmount, finalAmount, elapsedTime);
  const halfLives = elapsedTime / halfLifeAnswer;
  const percentRemaining = (finalAmount / initialAmount) * 100;

  return {
    mode,
    label: `${formatAmount(initialAmount, amountUnit)} to ${formatAmount(finalAmount, amountUnit)} in ${formatTime(elapsedTime, timeUnit)}`,
    answer: formatTime(halfLifeAnswer, timeUnit),
    supportingText: `${formatPercent(percentRemaining)} remains, which is ${formatCalculatorNumber(halfLives)} half-lives.`,
    metrics: [
      { label: 'Half-lives passed', value: formatCalculatorNumber(halfLives) },
      { label: 'Percent remaining', value: formatPercent(percentRemaining) },
      { label: 'Elapsed time', value: formatTime(elapsedTime, timeUnit) },
    ],
    steps: [
      'Use the rearranged formula: half-life = elapsed time x log(1/2) / log(final / initial).',
      `${formatAmount(finalAmount, amountUnit)} / ${formatAmount(initialAmount, amountUnit)} = ${formatCalculatorNumber(finalAmount / initialAmount)}.`,
      `${formatTime(elapsedTime, timeUnit)} x log(1/2) / log(${formatCalculatorNumber(finalAmount / initialAmount)}) = ${formatTime(halfLifeAnswer, timeUnit)}.`,
    ],
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
    <label className="half-life-field">
      <span>{label}</span>
      <input inputMode="decimal" onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

export default function HalfLifeCalculator() {
  const [mode, setMode] = useState<HalfLifeMode>('remaining');
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<HalfLifeCalculation>(() =>
    buildCalculation('remaining', defaultInputs),
  );
  const [history, setHistory] = useState<HalfLifeCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const visibleFields = useMemo(
    () => ({
      initialAmount: true,
      finalAmount: mode !== 'remaining',
      halfLife: mode !== 'half-life',
      elapsedTime: mode !== 'elapsed-time',
    }),
    [mode],
  );

  const updateInput = (key: keyof HalfLifeInputs, value: string) => {
    setInputs((current) => ({ ...current, [key]: value }));
    setCopied(false);
  };

  const calculate = (nextMode = mode, nextInputs = inputs) => {
    try {
      const nextCalculation = buildCalculation(nextMode, nextInputs);
      setCalculation(nextCalculation);
      setHistory((items) => [nextCalculation, ...items].slice(0, 6));
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the half-life inputs');
      setCopied(false);
    }
  };

  const changeMode = (nextMode: HalfLifeMode) => {
    setMode(nextMode);
    setCopied(false);
    calculate(nextMode, inputs);
  };

  const loadExample = (example: HalfLifeExample) => {
    setMode(example.mode);
    setInputs(example.inputs);
    calculate(example.mode, example.inputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.label}: ${calculation.answer}`);
    setCopied(true);
  };

  return (
    <section className="half-life-calculator" aria-label="Half-life calculator">
      <div className="half-life-panel">
        <div className="half-life-mode-grid" aria-label="Half-life calculation type">
          {(Object.keys(modeLabels) as HalfLifeMode[]).map((item) => (
            <button aria-pressed={mode === item} key={item} onClick={() => changeMode(item)} type="button">
              <strong>{modeLabels[item].title}</strong>
              <span>{modeLabels[item].description}</span>
            </button>
          ))}
        </div>

        <div className="half-life-fields">
          {visibleFields.initialAmount && (
            <NumberField
              label="Initial amount"
              value={inputs.initialAmount}
              onChange={(value) => updateInput('initialAmount', value)}
            />
          )}
          {visibleFields.finalAmount && (
            <NumberField
              label="Final amount"
              value={inputs.finalAmount}
              onChange={(value) => updateInput('finalAmount', value)}
            />
          )}
          {visibleFields.halfLife && (
            <NumberField
              label="Half-life"
              value={inputs.halfLife}
              onChange={(value) => updateInput('halfLife', value)}
            />
          )}
          {visibleFields.elapsedTime && (
            <NumberField
              label="Elapsed time"
              value={inputs.elapsedTime}
              onChange={(value) => updateInput('elapsedTime', value)}
            />
          )}
          <label className="half-life-field">
            <span>Amount unit</span>
            <input
              onChange={(event) => updateInput('amountUnit', event.target.value)}
              placeholder="Optional"
              value={inputs.amountUnit}
            />
          </label>
          <label className="half-life-field">
            <span>Time unit</span>
            <input
              onChange={(event) => updateInput('timeUnit', event.target.value)}
              placeholder="Optional"
              value={inputs.timeUnit}
            />
          </label>
        </div>

        <div className="half-life-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate half-life
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="half-life-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : calculation.label}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{calculation.answer}</strong>
              <p>{calculation.supportingText}</p>
              <dl>
                {calculation.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt>{metric.label}</dt>
                    <dd>{metric.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="half-life-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <aside className="half-life-side-panel" aria-label="Half-life examples and history">
        <section>
          <h2>Examples</h2>
          <div className="half-life-example-list">
            {examples.map((example) => (
              <button key={example.label} onClick={() => loadExample(example)} type="button">
                {example.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Recent answers</h2>
          {history.length > 0 ? (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                  <span>{modeLabels[item.mode].title}</span>
                  <strong>{item.answer}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent half-life answers will appear here.</p>
          )}
        </section>

        <section className="half-life-note">
          <h2>Input tips</h2>
          <p>Use matching time units for elapsed time and half-life, such as hours with hours.</p>
          <p>This is a math helper for study and planning examples, not medical or radiation safety advice.</p>
        </section>
      </aside>
    </section>
  );
}
