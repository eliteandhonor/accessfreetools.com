import { useMemo, useState } from 'react';
import {
  calculateFactors,
  calculateGreatestCommonFactor,
  calculateLeastCommonMultiple,
  formatBigInteger,
  parseBigIntegerList,
  type FactorizationResult,
} from '../lib/calculator';

type NumberTheoryVariant = 'lcm' | 'gcf' | 'factor';

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

function buildCalculation(variant: NumberTheoryVariant, input: string): NumberTheoryCalculation {
  if (variant === 'factor') {
    const value = parseSafeInteger(input, 'Value');
    const factorResult = calculateFactors(value);
    const factorsText = factorResult.factors.join(', ');
    const primeText = formatPrimePowers(factorResult);

    return {
      expression: `Factors of ${value}`,
      answer: factorsText,
      label: factorResult.isPrime ? 'Prime number' : `${factorResult.factors.length} factors`,
      metrics: [
        { label: 'Factor count', value: `${factorResult.factors.length}` },
        { label: 'Factor pairs', value: `${factorResult.factorPairs.length}` },
        { label: 'Prime factors', value: primeText },
      ],
      steps: [
        `Test whole-number divisors from 1 through the square root of ${value}.`,
        'When a divisor works, pair it with the matching quotient.',
        `Sort the factors from least to greatest: ${factorsText}.`,
        `Prime factorization: ${primeText}.`,
      ],
      factorResult,
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
          <input inputMode="numeric" onChange={(event) => setInput(event.target.value)} value={input} />
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
