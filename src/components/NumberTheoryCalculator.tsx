import { useMemo, useState } from 'react';
import {
  calculateFactors,
  calculateGreatestCommonFactor,
  calculateLeastCommonMultiple,
  calculateLongDivision,
  formatBigInteger,
  formatCalculatorNumber,
  parseBigIntegerList,
  type FactorizationResult,
  type LongDivisionResult,
} from '../lib/calculator';

type NumberTheoryVariant = 'lcm' | 'gcf' | 'factor' | 'prime-factorization' | 'long-division';

interface Props {
  variant: NumberTheoryVariant;
}

interface NumberTheoryCalculation {
  expression: string;
  answer: string;
  label: string;
  metrics: Array<{ label: string; value: string }>;
  steps: string[];
  factorResult?: FactorizationResult;
  longDivisionResult?: LongDivisionResult;
}

interface NumberTheoryExample {
  label: string;
  value: string;
}

const variantConfig: Record<
  NumberTheoryVariant,
  {
    title: string;
    inputLabel: string;
    defaultValue: string;
    buttonLabel: string;
    emptyHistory: string;
    examples: NumberTheoryExample[];
  }
> = {
  lcm: {
    title: 'Least Common Multiple',
    inputLabel: 'Numbers',
    defaultValue: '12, 18, 30',
    buttonLabel: 'Calculate LCM',
    emptyHistory: 'Recent LCM answers will appear here.',
    examples: [
      { label: '12, 18, 30', value: '12, 18, 30' },
      { label: '8, 14, 20', value: '8, 14, 20' },
      { label: '6, 15, 25', value: '6, 15, 25' },
    ],
  },
  gcf: {
    title: 'Greatest Common Factor',
    inputLabel: 'Numbers',
    defaultValue: '24, 36, 60',
    buttonLabel: 'Calculate GCF',
    emptyHistory: 'Recent GCF answers will appear here.',
    examples: [
      { label: '24, 36, 60', value: '24, 36, 60' },
      { label: '48, 180', value: '48, 180' },
      { label: '81, 153, 225', value: '81, 153, 225' },
    ],
  },
  factor: {
    title: 'Factor',
    inputLabel: 'Value',
    defaultValue: '84',
    buttonLabel: 'Find factors',
    emptyHistory: 'Recent factor answers will appear here.',
    examples: [
      { label: '84', value: '84' },
      { label: '97', value: '97' },
      { label: '360', value: '360' },
    ],
  },
  'prime-factorization': {
    title: 'Prime Factorization',
    inputLabel: 'Whole number',
    defaultValue: '360',
    buttonLabel: 'Factor into primes',
    emptyHistory: 'Recent prime factorizations will appear here.',
    examples: [
      { label: '360', value: '360' },
      { label: '9973', value: '9973' },
      { label: '5040', value: '5040' },
    ],
  },
  'long-division': {
    title: 'Long Division',
    inputLabel: 'Dividend / divisor',
    defaultValue: '9876 / 24',
    buttonLabel: 'Divide',
    emptyHistory: 'Recent long division answers will appear here.',
    examples: [
      { label: '9876 / 24', value: '9876 / 24' },
      { label: '1250 / 8', value: '1250 / 8' },
      { label: '1001 / 7', value: '1001 / 7' },
    ],
  },
};

function parseSafeInteger(value: string, label: string) {
  const parsed = Number(value.trim().replace(/,/g, ''));

  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${label} must be a safe whole number`);
  }

  return parsed;
}

function formatBigList(values: bigint[]) {
  return values.map((value) => formatBigInteger(value)).join(', ');
}

function formatPrimePowers(result: FactorizationResult) {
  if (result.value === 1) {
    return '1 has no prime factorization';
  }

  return result.primeFactorPowers
    .map((item) => (item.exponent === 1 ? `${item.prime}` : `${item.prime}^${item.exponent}`))
    .join(' x ');
}

function parseLongDivisionInput(input: string) {
  const normalized = input.trim().replace(/,/g, '');
  const parts = normalized.includes('/') ? normalized.split('/') : normalized.split(/[\s;]+/);

  if (parts.length !== 2 || parts.some((part) => part.trim().length === 0)) {
    throw new Error('Enter long division as dividend / divisor');
  }

  return {
    dividend: parseSafeInteger(parts[0], 'Dividend'),
    divisor: parseSafeInteger(parts[1], 'Divisor'),
  };
}

function buildCalculation(variant: NumberTheoryVariant, input: string): NumberTheoryCalculation {
  if (variant === 'factor' || variant === 'prime-factorization') {
    const value = parseSafeInteger(input, 'Value');
    const factorResult = calculateFactors(value);
    const factorsText = factorResult.factors.join(', ');
    const primeText = formatPrimePowers(factorResult);
    const primeMode = variant === 'prime-factorization';

    return {
      expression: primeMode ? `Prime factorization of ${value}` : `Factors of ${value}`,
      answer: primeMode ? primeText : factorsText,
      label: factorResult.isPrime ? 'Prime number' : primeMode ? `${factorResult.primeFactors.length} prime factors` : `${factorResult.factors.length} factors`,
      metrics: [
        { label: 'Factor count', value: `${factorResult.factors.length}` },
        { label: 'Factor pairs', value: `${factorResult.factorPairs.length}` },
        { label: 'Prime factors', value: primeText },
      ],
      steps: primeMode
        ? [
            `Start with ${value} and try the smallest prime factor first.`,
            'Divide by that prime until it no longer divides evenly, then move to the next prime.',
            `Group repeated primes as powers: ${primeText}.`,
            factorResult.isPrime ? `${value} is prime because its only positive factors are 1 and itself.` : `As a check, multiply the prime factors back to get ${value}.`,
          ]
        : [
            `Test whole-number divisors from 1 through the square root of ${value}.`,
            'When a divisor works, pair it with the matching quotient.',
            `Sort the factors from least to greatest: ${factorsText}.`,
            `Prime factorization: ${primeText}.`,
          ],
      factorResult,
    };
  }

  if (variant === 'long-division') {
    const { dividend, divisor } = parseLongDivisionInput(input);
    const longDivisionResult = calculateLongDivision(dividend, divisor);
    const answer = `${formatCalculatorNumber(longDivisionResult.quotient)} R ${formatCalculatorNumber(longDivisionResult.remainder)}`;

    return {
      expression: `${formatCalculatorNumber(dividend)} divided by ${formatCalculatorNumber(divisor)}`,
      answer,
      label: longDivisionResult.remainder === 0 ? 'Divides evenly' : 'Quotient with remainder',
      metrics: [
        { label: 'Quotient', value: formatCalculatorNumber(longDivisionResult.quotient) },
        { label: 'Remainder', value: formatCalculatorNumber(longDivisionResult.remainder) },
        { label: 'Decimal', value: formatCalculatorNumber(longDivisionResult.decimal) },
      ],
      steps: [
        `Divide ${formatCalculatorNumber(dividend)} by ${formatCalculatorNumber(divisor)}.`,
        `The whole-number quotient is ${formatCalculatorNumber(longDivisionResult.quotient)}.`,
        `Multiply ${formatCalculatorNumber(longDivisionResult.quotient)} x ${formatCalculatorNumber(divisor)} = ${formatCalculatorNumber(longDivisionResult.quotient * divisor)}.`,
        `Subtract from the dividend to get remainder ${formatCalculatorNumber(longDivisionResult.remainder)}.`,
      ],
      longDivisionResult,
    };
  }

  const values = parseBigIntegerList(input);
  const answerValue =
    variant === 'lcm' ? calculateLeastCommonMultiple(values) : calculateGreatestCommonFactor(values);
  const label = variant === 'lcm' ? 'Least common multiple' : 'Greatest common factor';
  const expression = `${variant.toUpperCase()} of ${formatBigList(values)}`;

  return {
    expression,
    answer: formatBigInteger(answerValue),
    label,
    metrics: [
      { label: 'Numbers checked', value: `${values.length}` },
      { label: 'Smallest input', value: formatBigInteger(values.reduce((min, value) => (value < min ? value : min))) },
      { label: 'Largest input', value: formatBigInteger(values.reduce((max, value) => (value > max ? value : max))) },
    ],
    steps:
      variant === 'lcm'
        ? [
            `Start with ${formatBigList(values)}.`,
            'Use each pair GCF to combine numbers without losing exact integer precision.',
            'For two numbers, LCM(a,b) = a x b / GCF(a,b).',
            `The least common multiple is ${formatBigInteger(answerValue)}.`,
          ]
        : [
            `Start with ${formatBigList(values)}.`,
            'Use the Euclidean algorithm to find the shared factor between each pair.',
            'Keep reducing the list until one common factor remains.',
            `The greatest common factor is ${formatBigInteger(answerValue)}.`,
          ],
  };
}

export default function NumberTheoryCalculator({ variant }: Props) {
  const config = variantConfig[variant];
  const [input, setInput] = useState(config.defaultValue);
  const [calculation, setCalculation] = useState<NumberTheoryCalculation>(() =>
    buildCalculation(variant, config.defaultValue),
  );
  const [history, setHistory] = useState<NumberTheoryCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const resultLabel = useMemo(() => (error ? 'Check input' : calculation.label), [calculation, error]);

  const calculate = (nextInput = input) => {
    try {
      const nextCalculation = buildCalculation(variant, nextInput);
      setCalculation(nextCalculation);
      setHistory((items) => [nextCalculation, ...items].slice(0, 6));
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the input');
      setCopied(false);
    }
  };

  const loadExample = (example: NumberTheoryExample) => {
    setInput(example.value);
    calculate(example.value);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.expression}: ${calculation.answer}`);
    setCopied(true);
  };

  return (
    <section className={`advanced-calculator advanced-calculator-${variant}`} aria-label={`${config.title} calculator`}>
      <div className="advanced-panel">
        <label className="advanced-field">
          <span>{config.inputLabel}</span>
          <input
            inputMode={variant === 'long-division' ? 'text' : 'numeric'}
            onChange={(event) => setInput(event.target.value)}
            value={input}
          />
        </label>

        <div className="advanced-quick-grid" aria-label={`${config.title} examples`}>
          {config.examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            {config.buttonLabel}
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{resultLabel}</span>
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

      <aside className="advanced-side-panel" aria-label={`${config.title} history`}>
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
            <p>{config.emptyHistory}</p>
          )}
        </section>

        <section className="advanced-note">
          <h2>Input tips</h2>
          {variant === 'factor' ? (
            <>
              <p>Enter one positive whole number up to 1,000,000,000,000.</p>
              <p>The tool lists factors, factor pairs, and prime factorization.</p>
            </>
          ) : variant === 'prime-factorization' ? (
            <>
              <p>Enter one positive whole number up to 1,000,000,000,000.</p>
              <p>The tool rewrites it as prime numbers multiplied together.</p>
            </>
          ) : variant === 'long-division' ? (
            <>
              <p>Enter the problem as dividend / divisor, such as 9876 / 24.</p>
              <p>The divisor must be a positive whole number. The result shows quotient, remainder, and decimal form.</p>
            </>
          ) : (
            <>
              <p>Enter at least two positive whole numbers separated by commas, spaces, or semicolons.</p>
              <p>Large whole numbers stay exact because the calculation uses BigInt integer math.</p>
            </>
          )}
        </section>
      </aside>
    </section>
  );
}
