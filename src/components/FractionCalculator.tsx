import { useMemo, useState, type KeyboardEvent } from 'react';
import {
  calculateFraction,
  calculateFractionLeastCommonDenominator,
  compareFractionValues,
  formatCalculatorNumber,
  formatImproperFraction,
  formatMixedFraction,
  fractionToDecimal,
  mixedToFraction,
  parseFractionValue,
  type FractionOperator,
  type FractionValue,
} from '../lib/calculator';

type FractionMode = 'calculate' | 'simplify' | 'compare';

interface FractionInputState {
  whole: string;
  numerator: string;
  denominator: string;
}

interface FractionDisplayResult {
  label: string;
  expression: string;
  answer: string;
  copyText: string;
  metrics: Array<{ label: string; value: string }>;
  steps: string[];
}

interface FractionExample {
  label: string;
  left: FractionInputState;
  operator: FractionOperator;
  right: FractionInputState;
}

interface FractionTextExample {
  label: string;
  first: string;
  second?: string;
}

interface FractionHistoryItem {
  expression: string;
  answer: string;
}

const modeOptions: Array<{ id: FractionMode; symbol: string; label: string }> = [
  { id: 'calculate', symbol: '+ -', label: 'Arithmetic' },
  { id: 'simplify', symbol: 'a/b', label: 'Simplify / convert' },
  { id: 'compare', symbol: '< >', label: 'Compare' },
];

const operatorLabels: Record<FractionOperator, string> = {
  '+': '+',
  '-': '-',
  '*': 'x',
  '/': '/',
};

const defaultLeft: FractionInputState = { whole: '', numerator: '1', denominator: '2' };
const defaultRight: FractionInputState = { whole: '', numerator: '1', denominator: '3' };

const arithmeticExamples: FractionExample[] = [
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

const simplifyExamples: FractionTextExample[] = [
  { label: 'Simplify 18/24', first: '18/24' },
  { label: 'Convert 2 1/4', first: '2 1/4' },
  { label: 'Convert 0.125', first: '0.125' },
  { label: 'Convert -7/3', first: '-7/3' },
];

const compareExamples: FractionTextExample[] = [
  { label: '2/3 vs 3/5', first: '2/3', second: '3/5' },
  { label: '3/4 vs 6/8', first: '3/4', second: '6/8' },
  { label: '1 1/2 vs 1.4', first: '1 1/2', second: '1.4' },
  { label: '-2/3 vs -3/4', first: '-2/3', second: '-3/4' },
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

  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${label} must be a safe whole number`);
  }

  return parsed;
}

function parseStructuredFraction(input: FractionInputState) {
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

function formatPercent(value: FractionValue) {
  return `${formatCalculatorNumber((value.numerator / value.denominator) * 100)}%`;
}

function fractionMetrics(value: FractionValue, extra?: { label: string; value: string }) {
  return [
    { label: 'Improper fraction', value: formatImproperFraction(value) },
    { label: 'Decimal', value: fractionToDecimal(value) },
    { label: 'Percent', value: formatPercent(value) },
    ...(extra ? [extra] : []),
  ];
}

function buildArithmeticResult(
  leftInput: FractionInputState,
  operator: FractionOperator,
  rightInput: FractionInputState,
): FractionDisplayResult {
  const left = parseStructuredFraction(leftInput);
  const right = parseStructuredFraction(rightInput);
  const result = calculateFraction(left, operator, right);
  const leftText = formatMixedFraction(left);
  const rightText = formatMixedFraction(right);
  const expression = `${leftText} ${operatorLabels[operator]} ${rightText}`;
  const answer = formatMixedFraction(result);
  const steps: string[] = [];
  let extraMetric: { label: string; value: string };

  if (operator === '+' || operator === '-') {
    const leastCommonDenominator = calculateFractionLeastCommonDenominator(left.denominator, right.denominator);
    const leftMultiplier = leastCommonDenominator / left.denominator;
    const rightMultiplier = leastCommonDenominator / right.denominator;
    const leftScaled = left.numerator * leftMultiplier;
    const rightScaled = right.numerator * rightMultiplier;
    const combined = operator === '+' ? leftScaled + rightScaled : leftScaled - rightScaled;
    const action = operator === '+' ? 'Add' : 'Subtract';

    steps.push(
      `Find the least common denominator of ${left.denominator} and ${right.denominator}: ${leastCommonDenominator}.`,
      `Rewrite the fractions: ${left.numerator}/${left.denominator} becomes ${leftScaled}/${leastCommonDenominator}, and ${right.numerator}/${right.denominator} becomes ${rightScaled}/${leastCommonDenominator}.`,
      `${action} the numerators: ${leftScaled} ${operator} ${rightScaled} = ${combined}.`,
      `Simplify ${combined}/${leastCommonDenominator} to ${formatResultSummary(result)}.`,
    );
    extraMetric = { label: 'Least common denominator', value: `${leastCommonDenominator}` };
  } else if (operator === '*') {
    const rawNumerator = left.numerator * right.numerator;
    const rawDenominator = left.denominator * right.denominator;
    steps.push(
      `Multiply the numerators: ${left.numerator} x ${right.numerator} = ${rawNumerator}.`,
      `Multiply the denominators: ${left.denominator} x ${right.denominator} = ${rawDenominator}.`,
      `Simplify ${rawNumerator}/${rawDenominator} to ${formatResultSummary(result)}.`,
    );
    extraMetric = { label: 'Unsimplified result', value: `${rawNumerator}/${rawDenominator}` };
  } else {
    if (right.numerator === 0) {
      throw new Error('Cannot divide by zero');
    }

    const rawNumerator = left.numerator * right.denominator;
    const rawDenominator = left.denominator * right.numerator;
    steps.push(
      `Flip the second fraction: ${formatImproperFraction(right)} becomes ${right.denominator}/${right.numerator}.`,
      `Multiply ${formatImproperFraction(left)} x ${right.denominator}/${right.numerator}.`,
      `Simplify ${rawNumerator}/${rawDenominator} to ${formatResultSummary(result)}.`,
    );
    extraMetric = { label: 'Reciprocal used', value: `${right.denominator}/${right.numerator}` };
  }

  return {
    label: 'Calculated fraction',
    expression,
    answer,
    copyText: `${expression} = ${answer} (${formatImproperFraction(result)}; ${fractionToDecimal(result)})`,
    metrics: fractionMetrics(result, extraMetric),
    steps,
  };
}

function buildSimplifyResult(input: string): FractionDisplayResult {
  const parsed = parseFractionValue(input);
  const result = parsed.value;
  const answer = formatMixedFraction(result);
  const improper = formatImproperFraction(result);
  const reductionDivisor =
    result.numerator === 0
      ? Math.abs(parsed.rawDenominator)
      : Math.abs(parsed.rawNumerator / result.numerator);
  const equivalentFractions = [2, 3, 4]
    .map((multiplier) => `${result.numerator * multiplier}/${result.denominator * multiplier}`)
    .join(', ');
  const kindLabels = {
    fraction: 'fraction',
    'mixed-number': 'mixed number',
    'whole-number': 'whole number',
    decimal: 'terminating decimal',
  } as const;
  const steps = [`Read ${parsed.input} as a ${kindLabels[parsed.inputKind]}.`];

  if (parsed.inputKind === 'mixed-number') {
    steps.push(`Convert the mixed number to ${parsed.rawNumerator}/${parsed.rawDenominator}.`);
  } else if (parsed.inputKind === 'decimal') {
    steps.push(`Write the decimal as ${parsed.rawNumerator}/${parsed.rawDenominator}.`);
  } else if (parsed.inputKind === 'whole-number') {
    steps.push(`Write the whole number as ${parsed.rawNumerator}/1.`);
  }

  if (reductionDivisor > 1) {
    steps.push(
      `Divide the numerator and denominator by their greatest common factor, ${formatCalculatorNumber(reductionDivisor)}.`,
    );
  } else {
    steps.push('The fraction is already in lowest terms.');
  }

  steps.push(`Read the result as ${answer}, ${fractionToDecimal(result)} in decimal form, or ${formatPercent(result)}.`);

  return {
    label: 'Simplified and converted value',
    expression: `${parsed.input} -> ${improper}`,
    answer,
    copyText: `${parsed.input} = ${answer} (${improper}; ${fractionToDecimal(result)}; ${formatPercent(result)})`,
    metrics: fractionMetrics(result, { label: 'Equivalent fractions', value: equivalentFractions }),
    steps,
  };
}

function buildCompareResult(leftInput: string, rightInput: string): FractionDisplayResult {
  const left = parseFractionValue(leftInput);
  const right = parseFractionValue(rightInput);
  const comparison = compareFractionValues(left.value, right.value);
  const symbol = comparison.comparison === 0 ? '=' : comparison.comparison > 0 ? '>' : '<';
  const leftText = formatMixedFraction(left.value);
  const rightText = formatMixedFraction(right.value);
  const answer = `${leftText} ${symbol} ${rightText}`;
  const differenceText = formatMixedFraction(comparison.difference);

  return {
    label: 'Fraction comparison',
    expression: `${left.input} compared with ${right.input}`,
    answer,
    copyText: `${left.input} ${symbol} ${right.input}; first minus second = ${differenceText}`,
    metrics: [
      { label: 'First decimal', value: fractionToDecimal(left.value) },
      { label: 'Second decimal', value: fractionToDecimal(right.value) },
      { label: 'First minus second', value: differenceText },
      {
        label: 'Cross products',
        value: `${comparison.leftCrossProduct} ${symbol} ${comparison.rightCrossProduct}`,
      },
    ],
    steps: [
      `Write the values as ${formatImproperFraction(left.value)} and ${formatImproperFraction(right.value)}.`,
      `Cross-multiply: ${left.value.numerator} x ${right.value.denominator} = ${comparison.leftCrossProduct}, and ${right.value.numerator} x ${left.value.denominator} = ${comparison.rightCrossProduct}.`,
      `Compare the cross products: ${comparison.leftCrossProduct} ${symbol} ${comparison.rightCrossProduct}.`,
      `The exact difference, first minus second, is ${differenceText}.`,
    ],
  };
}

function FractionFields({
  label,
  value,
  onChange,
  onEnter,
}: {
  label: string;
  value: FractionInputState;
  onChange: (value: FractionInputState) => void;
  onEnter: (event: KeyboardEvent<HTMLInputElement>) => void;
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
          onKeyDown={onEnter}
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
          onKeyDown={onEnter}
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
          onKeyDown={onEnter}
          placeholder="2"
          value={value.denominator}
        />
      </label>
    </fieldset>
  );
}

export default function FractionCalculator() {
  const [mode, setMode] = useState<FractionMode>('calculate');
  const [left, setLeft] = useState(defaultLeft);
  const [right, setRight] = useState(defaultRight);
  const [operator, setOperator] = useState<FractionOperator>('+');
  const [singleInput, setSingleInput] = useState('18/24');
  const [compareLeft, setCompareLeft] = useState('2/3');
  const [compareRight, setCompareRight] = useState('3/5');
  const [result, setResult] = useState<FractionDisplayResult>(() =>
    buildArithmeticResult(defaultLeft, '+', defaultRight),
  );
  const [history, setHistory] = useState<FractionHistoryItem[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const activeExamples = useMemo(
    () => (mode === 'calculate' ? arithmeticExamples : mode === 'simplify' ? simplifyExamples : compareExamples),
    [mode],
  );
  const primaryLabel =
    mode === 'calculate' ? 'Calculate fraction' : mode === 'simplify' ? 'Simplify and convert' : 'Compare fractions';

  const buildCurrentResult = (selectedMode = mode) => {
    if (selectedMode === 'calculate') return buildArithmeticResult(left, operator, right);
    if (selectedMode === 'simplify') return buildSimplifyResult(singleInput);
    return buildCompareResult(compareLeft, compareRight);
  };

  const applyResult = (nextResult: FractionDisplayResult) => {
    setResult(nextResult);
    setHistory((items) => [
      { expression: nextResult.expression, answer: nextResult.answer },
      ...items,
    ].slice(0, 6));
    setError('');
    setCopied(false);
  };

  const calculate = (selectedMode = mode) => {
    try {
      applyResult(buildCurrentResult(selectedMode));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the fraction inputs');
      setCopied(false);
    }
  };

  const changeMode = (nextMode: FractionMode) => {
    setMode(nextMode);
    setError('');
    setCopied(false);

    try {
      setResult(buildCurrentResult(nextMode));
    } catch {
      // Keep the last valid result until the user runs the new mode.
    }
  };

  const loadExample = (example: FractionExample | FractionTextExample) => {
    try {
      if ('left' in example) {
        setLeft(example.left);
        setRight(example.right);
        setOperator(example.operator);
        applyResult(buildArithmeticResult(example.left, example.operator, example.right));
      } else if (mode === 'simplify') {
        setSingleInput(example.first);
        applyResult(buildSimplifyResult(example.first));
      } else {
        const second = example.second ?? '0';
        setCompareLeft(example.first);
        setCompareRight(second);
        applyResult(buildCompareResult(example.first, second));
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the fraction example');
    }
  };

  const clearCalculator = () => {
    if (mode === 'calculate') {
      setLeft({ whole: '', numerator: '', denominator: '' });
      setRight({ whole: '', numerator: '', denominator: '' });
      setOperator('+');
    } else if (mode === 'simplify') {
      setSingleInput('');
    } else {
      setCompareLeft('');
      setCompareRight('');
    }

    setError('');
    setCopied(false);
  };

  const swapFractions = () => {
    if (mode === 'calculate') {
      setLeft(right);
      setRight(left);
    } else if (mode === 'compare') {
      setCompareLeft(compareRight);
      setCompareRight(compareLeft);
    }

    setCopied(false);
  };

  const copyResult = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(result.copyText);
    setCopied(true);
  };

  const runOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      calculate();
    }
  };

  return (
    <section className="fraction-calculator" aria-label="Fraction calculator">
      <div className="fraction-panel">
        <div className="fraction-mode-grid" aria-label="Fraction calculator modes">
          {modeOptions.map((option) => (
            <button
              aria-pressed={mode === option.id}
              key={option.id}
              onClick={() => changeMode(option.id)}
              type="button"
            >
              <strong>{option.symbol}</strong>
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        {mode === 'calculate' && (
          <div className="fraction-input-grid">
            <FractionFields label="First fraction" value={left} onChange={setLeft} onEnter={runOnEnter} />

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

            <FractionFields label="Second fraction" value={right} onChange={setRight} onEnter={runOnEnter} />
          </div>
        )}

        {mode === 'simplify' && (
          <div className="fraction-text-grid">
            <label className="fraction-text-field">
              <span>Fraction, mixed number, whole number, or decimal</span>
              <input
                aria-describedby="fraction-simplify-help"
                inputMode="decimal"
                onChange={(event) => setSingleInput(event.target.value)}
                onKeyDown={runOnEnter}
                placeholder="18/24 or 0.125"
                value={singleInput}
              />
            </label>
            <small id="fraction-simplify-help">Use forms such as 3/4, -2 1/4, 7, or 0.125.</small>
          </div>
        )}

        {mode === 'compare' && (
          <div className="fraction-text-grid fraction-compare-grid">
            <label className="fraction-text-field">
              <span>First value</span>
              <input
                inputMode="decimal"
                onChange={(event) => setCompareLeft(event.target.value)}
                onKeyDown={runOnEnter}
                placeholder="2/3"
                value={compareLeft}
              />
            </label>
            <label className="fraction-text-field">
              <span>Second value</span>
              <input
                inputMode="decimal"
                onChange={(event) => setCompareRight(event.target.value)}
                onKeyDown={runOnEnter}
                placeholder="3/5"
                value={compareRight}
              />
            </label>
            <small>Compare fractions, mixed numbers, whole numbers, or terminating decimals exactly.</small>
          </div>
        )}

        <div className={`fraction-actions${mode === 'simplify' ? ' fraction-actions-two' : ''}`}>
          <button className="button-primary" onClick={() => calculate()} type="button">
            {primaryLabel}
          </button>
          {mode !== 'simplify' && (
            <button className="button-secondary" onClick={swapFractions} type="button">
              Swap
            </button>
          )}
          <button className="button-secondary" onClick={clearCalculator} type="button">
            Clear
          </button>
        </div>

        <div className="fraction-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : result.label}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{result.answer}</strong>
              <p>{result.expression}</p>
              <dl>
                {result.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt>{metric.label}</dt>
                    <dd>{metric.value}</dd>
                  </div>
                ))}
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
              {result.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <section className="fraction-side-panel" aria-label="Fraction calculator examples and history">
        <section>
          <h2>Examples for this mode</h2>
          <div className="fraction-example-list">
            {activeExamples.map((example) => (
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
                  <strong>{item.answer}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent fraction answers will appear here.</p>
          )}
        </section>

        <p className="fraction-privacy-note">
          Values and recent answers stay in this browser tab. They are not sent to a server.
        </p>
      </section>
    </section>
  );
}
