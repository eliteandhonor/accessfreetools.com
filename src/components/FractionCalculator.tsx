import { useMemo, useState } from 'react';
import {
  calculateFraction,
  formatImproperFraction,
  formatMixedFraction,
  fractionToDecimal,
  mixedToFraction,
  type FractionOperator,
  type FractionValue,
} from '../lib/calculator';

interface FractionInputState {
  whole: string;
  numerator: string;
  denominator: string;
}

interface FractionCalculation {
  expression: string;
  result: FractionValue;
  left: FractionValue;
  right: FractionValue;
  steps: string[];
}

interface FractionExample {
  label: string;
  left: FractionInputState;
  operator: FractionOperator;
  right: FractionInputState;
}

const operatorLabels: Record<FractionOperator, string> = {
  '+': '+',
  '-': '-',
  '*': 'x',
  '/': '/',
};

const defaultLeft: FractionInputState = { whole: '', numerator: '1', denominator: '2' };
const defaultRight: FractionInputState = { whole: '', numerator: '1', denominator: '3' };

const examples: FractionExample[] = [
  {
    label: '1/2 + 1/3',
    left: { whole: '', numerator: '1', denominator: '2' },
    operator: '+',
    right: { whole: '', numerator: '1', denominator: '3' },
  },
  {
    label: '2 1/4 - 3/8',
    left: { whole: '2', numerator: '1', denominator: '4' },
    operator: '-',
    right: { whole: '', numerator: '3', denominator: '8' },
  },
  {
    label: '3/4 x 2/5',
    left: { whole: '', numerator: '3', denominator: '4' },
    operator: '*',
    right: { whole: '', numerator: '2', denominator: '5' },
  },
  {
    label: '5/6 / 2/3',
    left: { whole: '', numerator: '5', denominator: '6' },
    operator: '/',
    right: { whole: '', numerator: '2', denominator: '3' },
  },
];

function parseIntegerField(value: string, label: string, fallback: number, required = false) {
  const trimmed = value.trim();

  if (!trimmed) {
    if (required) {
      throw new Error(`${label} is required`);
    }

    return fallback;
  }

  const parsed = Number(trimmed);

  if (!Number.isInteger(parsed)) {
    throw new Error(`${label} must be a whole number`);
  }

  return parsed;
}

function parseFractionInput(input: FractionInputState) {
  return mixedToFraction({
    whole: parseIntegerField(input.whole, 'Whole number', 0),
    numerator: parseIntegerField(input.numerator, 'Numerator', 0),
    denominator: parseIntegerField(input.denominator, 'Denominator', 1, true),
  });
}

function formatResultSummary(value: FractionValue) {
  const improper = formatImproperFraction(value);
  const mixed = formatMixedFraction(value);

  return improper === mixed ? improper : `${mixed} (${improper})`;
}

function getFractionSteps(
  left: FractionValue,
  operator: FractionOperator,
  right: FractionValue,
  result: FractionValue,
) {
  const leftText = formatImproperFraction(left);
  const rightText = formatImproperFraction(right);
  const denominatorProduct = left.denominator * right.denominator;

  if (operator === '+' || operator === '-') {
    const leftScaled = left.numerator * right.denominator;
    const rightScaled = right.numerator * left.denominator;
    const combined = operator === '+' ? leftScaled + rightScaled : leftScaled - rightScaled;
    const word = operator === '+' ? 'Add' : 'Subtract';

    return [
      `Use a common denominator: ${left.denominator} x ${right.denominator} = ${denominatorProduct}.`,
      `Convert the numerators: ${left.numerator} x ${right.denominator} = ${leftScaled}, and ${right.numerator} x ${left.denominator} = ${rightScaled}.`,
      `${word} the converted numerators: ${leftScaled} ${operator} ${rightScaled} = ${combined}.`,
      `Simplify ${combined}/${denominatorProduct} to ${formatResultSummary(result)}.`,
    ];
  }

  if (operator === '*') {
    return [
      `Multiply the numerators: ${left.numerator} x ${right.numerator} = ${left.numerator * right.numerator}.`,
      `Multiply the denominators: ${left.denominator} x ${right.denominator} = ${denominatorProduct}.`,
      `Simplify ${left.numerator * right.numerator}/${denominatorProduct} to ${formatResultSummary(result)}.`,
    ];
  }

  return [
    `Flip the second fraction: ${rightText} becomes ${right.denominator}/${right.numerator}.`,
    `Multiply ${leftText} x ${right.denominator}/${right.numerator}.`,
    `Simplify the answer to ${formatResultSummary(result)}.`,
  ];
}

function buildCalculation(
  leftInput: FractionInputState,
  operator: FractionOperator,
  rightInput: FractionInputState,
): FractionCalculation {
  const left = parseFractionInput(leftInput);
  const right = parseFractionInput(rightInput);
  const result = calculateFraction(left, operator, right);
  const expression = `${formatMixedFraction(left)} ${operatorLabels[operator]} ${formatMixedFraction(right)}`;

  return {
    expression,
    result,
    left,
    right,
    steps: getFractionSteps(left, operator, right, result),
  };
}

function FractionFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: FractionInputState;
  onChange: (value: FractionInputState) => void;
}) {
  return (
    <fieldset className="fraction-fieldset">
      <legend>{label}</legend>
      <label>
        <span>Whole</span>
        <input
          aria-label={`${label} whole number`}
          inputMode="numeric"
          onChange={(event) => onChange({ ...value, whole: event.target.value })}
          placeholder="0"
          value={value.whole}
        />
      </label>
      <label>
        <span>Numerator</span>
        <input
          aria-label={`${label} numerator`}
          inputMode="numeric"
          onChange={(event) => onChange({ ...value, numerator: event.target.value })}
          placeholder="1"
          value={value.numerator}
        />
      </label>
      <label>
        <span>Denominator</span>
        <input
          aria-label={`${label} denominator`}
          inputMode="numeric"
          onChange={(event) => onChange({ ...value, denominator: event.target.value })}
          placeholder="2"
          value={value.denominator}
        />
      </label>
    </fieldset>
  );
}

export default function FractionCalculator() {
  const [left, setLeft] = useState(defaultLeft);
  const [right, setRight] = useState(defaultRight);
  const [operator, setOperator] = useState<FractionOperator>('+');
  const [calculation, setCalculation] = useState<FractionCalculation>(() =>
    buildCalculation(defaultLeft, '+', defaultRight),
  );
  const [history, setHistory] = useState<FractionCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const resultText = useMemo(() => formatMixedFraction(calculation.result), [calculation.result]);
  const improperText = useMemo(() => formatImproperFraction(calculation.result), [calculation.result]);
  const decimalText = useMemo(() => fractionToDecimal(calculation.result), [calculation.result]);

  const calculate = () => {
    try {
      const nextCalculation = buildCalculation(left, operator, right);
      setCalculation(nextCalculation);
      setHistory((items) => [nextCalculation, ...items].slice(0, 6));
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the fraction inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: FractionExample) => {
    setLeft(example.left);
    setRight(example.right);
    setOperator(example.operator);

    const nextCalculation = buildCalculation(example.left, example.operator, example.right);
    setCalculation(nextCalculation);
    setHistory((items) => [nextCalculation, ...items].slice(0, 6));
    setError('');
    setCopied(false);
  };

  const clearCalculator = () => {
    setLeft({ whole: '', numerator: '', denominator: '' });
    setRight({ whole: '', numerator: '', denominator: '' });
    setOperator('+');
    setError('');
    setCopied(false);
  };

  const swapFractions = () => {
    setLeft(right);
    setRight(left);
    setCopied(false);
  };

  const copyResult = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(resultText);
    setCopied(true);
  };

  return (
    <section className="fraction-calculator" aria-label="Fraction calculator">
      <div className="fraction-panel">
        <div className="fraction-input-grid">
          <FractionFields label="First fraction" value={left} onChange={setLeft} />

          <div className="fraction-operator-picker" aria-label="Choose operation">
            {(Object.keys(operatorLabels) as FractionOperator[]).map((item) => (
              <button
                aria-pressed={operator === item}
                key={item}
                onClick={() => {
                  setOperator(item);
                  setCopied(false);
                }}
                type="button"
              >
                {operatorLabels[item]}
              </button>
            ))}
          </div>

          <FractionFields label="Second fraction" value={right} onChange={setRight} />
        </div>

        <div className="fraction-actions">
          <button className="button-primary" onClick={calculate} type="button">
            Calculate fraction
          </button>
          <button className="button-secondary" onClick={swapFractions} type="button">
            Swap
          </button>
          <button className="button-secondary" onClick={clearCalculator} type="button">
            Clear
          </button>
        </div>

        <div className="fraction-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : calculation.expression}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{resultText}</strong>
              <dl>
                <div>
                  <dt>Improper</dt>
                  <dd>{improperText}</dd>
                </div>
                <div>
                  <dt>Decimal</dt>
                  <dd>{decimalText}</dd>
                </div>
              </dl>
              <button onClick={copyResult} type="button">
                {copied ? 'Copied' : 'Copy answer'}
              </button>
            </>
          )}
        </div>

        {!error && (
          <div className="fraction-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <aside className="fraction-side-panel" aria-label="Fraction calculator examples and history">
        <section>
          <h2>Examples</h2>
          <div className="fraction-example-list">
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
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{formatMixedFraction(item.result)}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent fraction answers will appear here.</p>
          )}
        </section>
      </aside>
    </section>
  );
}
