import { useState } from 'react';
import {
  calculateDescriptiveStatistics,
  calculateMeanConfidenceInterval,
  calculateNormalPValue,
  calculateNumberSequence,
  calculatePermutationCombination,
  calculateProbability,
  calculateProportionConfidenceInterval,
  calculateSampleSize,
  calculateStandardDeviation,
  calculateZScore,
  formatBigInteger,
  formatCalculatorNumber,
  parseNumberList,
  probabilityPercentToDecimal,
  type ConfidenceIntervalMode,
  type ConfidenceLevel,
  type PValueTail,
  type SequenceKind,
} from '../lib/calculator';

export type StatsToolVariant =
  | 'standard-deviation'
  | 'number-sequence'
  | 'sample-size'
  | 'probability'
  | 'statistics'
  | 'mean-median-mode-range'
  | 'average'
  | 'permutation-combination'
  | 'z-score'
  | 'p-value'
  | 'confidence-interval';

interface Props {
  variant: StatsToolVariant;
}

interface HistoryItem {
  expression: string;
  answer: string;
}

const confidenceLevels: ConfidenceLevel[] = [80, 85, 90, 95, 98, 99];

function numberText(value: number | null | undefined) {
  if (value === null || value === undefined) return 'n/a';
  return formatCalculatorNumber(value);
}

function percentText(value: number) {
  return `${formatCalculatorNumber(value * 100)}%`;
}

function listText(values: number[]) {
  return values.map((value) => formatCalculatorNumber(value)).join(', ');
}

function modesText(modes: number[]) {
  return modes.length === 0 ? 'No mode' : listText(modes);
}

function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addHistory = (item: HistoryItem) => {
    setHistory((items) => [item, ...items].slice(0, 6));
  };

  return [history, addHistory] as const;
}

function HistoryPanel({
  history,
  title = 'Recent answers',
  emptyText = 'Recent answers will appear here.',
  note,
}: {
  history: HistoryItem[];
  title?: string;
  emptyText?: string;
  note: string[];
}) {
  return (
    <aside className="advanced-side-panel" aria-label={title}>
      <section>
        <h2>{title}</h2>
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
          <p>{emptyText}</p>
        )}
      </section>

      <section className="advanced-note">
        <h2>Input tips</h2>
        {note.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </section>
    </aside>
  );
}

function StandardDeviationTool() {
  const [input, setInput] = useState('2, 4, 4, 4, 5, 5, 7, 9');
  const [useSample, setUseSample] = useState(true);
  const [calculation, setCalculation] = useState(() =>
    calculateStandardDeviation(parseNumberList('2, 4, 4, 4, 5, 5, 7, 9'), true),
  );
  const [history, addHistory] = useHistory();
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = (nextInput = input, nextUseSample = useSample) => {
    try {
      const result = calculateStandardDeviation(parseNumberList(nextInput), nextUseSample);
      const answer = numberText(result.standardDeviation);
      setCalculation(result);
      addHistory({ expression: nextUseSample ? 'Sample standard deviation' : 'Population standard deviation', answer });
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the data set');
      setCopied(false);
    }
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`Standard deviation: ${numberText(calculation.standardDeviation)}`);
    setCopied(true);
  };

  return (
    <section className="advanced-calculator advanced-calculator-statistics" aria-label="Standard deviation calculator">
      <div className="advanced-panel">
        <label className="advanced-field">
          <span>Data values</span>
          <textarea onChange={(event) => setInput(event.target.value)} value={input} />
        </label>

        <div className="advanced-mode-grid" aria-label="Standard deviation type">
          <button
            aria-pressed={useSample}
            onClick={() => {
              setUseSample(true);
              calculate(input, true);
            }}
            type="button"
          >
            Sample
          </button>
          <button
            aria-pressed={!useSample}
            onClick={() => {
              setUseSample(false);
              calculate(input, false);
            }}
            type="button"
          >
            Population
          </button>
        </div>

        <div className="advanced-quick-grid">
          {['2, 4, 4, 4, 5, 5, 7, 9', '12, 15, 19, 21, 22, 26', '88, 92, 94, 94, 99'].map((example) => (
            <button
              key={example}
              onClick={() => {
                setInput(example);
                calculate(example, useSample);
              }}
              type="button"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate standard deviation
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{error ? 'Check input' : useSample ? 'Sample standard deviation' : 'Population standard deviation'}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{numberText(calculation.standardDeviation)}</strong>
              <dl>
                <div>
                  <dt>Mean</dt>
                  <dd>{numberText(calculation.statistics.mean)}</dd>
                </div>
                <div>
                  <dt>Variance</dt>
                  <dd>{numberText(calculation.variance)}</dd>
                </div>
                <div>
                  <dt>Count</dt>
                  <dd>{calculation.statistics.count}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="advanced-steps">
            <h2>Steps</h2>
            <ol>
              <li>Find the mean: {numberText(calculation.statistics.mean)}.</li>
              <li>Find each distance from the mean and square it.</li>
              <li>{useSample ? 'Divide by n - 1 for sample variance.' : 'Divide by n for population variance.'}</li>
              <li>Take the square root of the variance.</li>
            </ol>
          </div>
        )}
      </div>

      <HistoryPanel
        history={history}
        note={[
          'Separate values with commas, spaces, or new lines.',
          'Use sample standard deviation when your data estimates a larger population.',
        ]}
      />
    </section>
  );
}

function SummaryTool({ mode }: { mode: 'statistics' | 'mean-median-mode-range' | 'average' }) {
  const focused = mode !== 'statistics';
  const averageMode = mode === 'average';
  const [input, setInput] = useState('10, 12, 12, 15, 18, 21, 21, 21, 25');
  const [statistics, setStatistics] = useState(() =>
    calculateDescriptiveStatistics(parseNumberList('10, 12, 12, 15, 18, 21, 21, 21, 25')),
  );
  const [history, addHistory] = useHistory();
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = (nextInput = input) => {
    try {
      const result = calculateDescriptiveStatistics(parseNumberList(nextInput));
      setStatistics(result);
      addHistory({
        expression: `${result.count} values`,
        answer: averageMode
          ? `Average ${numberText(result.mean)}`
          : focused
            ? `Mean ${numberText(result.mean)}, range ${numberText(result.range)}`
            : `Mean ${numberText(result.mean)}`,
      });
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the data set');
      setCopied(false);
    }
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(
      averageMode
        ? `Average ${numberText(statistics.mean)} from ${statistics.count} values`
        : `Mean ${numberText(statistics.mean)}, median ${numberText(statistics.median)}, mode ${modesText(statistics.modes)}, range ${numberText(statistics.range)}`,
    );
    setCopied(true);
  };

  return (
    <section
      className="advanced-calculator advanced-calculator-statistics"
      aria-label={averageMode ? 'Average calculator' : focused ? 'Mean median mode range calculator' : 'Statistics calculator'}
    >
      <div className="advanced-panel">
        <label className="advanced-field">
          <span>Data values</span>
          <textarea onChange={(event) => setInput(event.target.value)} value={input} />
        </label>

        <div className="advanced-quick-grid">
          {['10, 12, 12, 15, 18, 21, 21, 21, 25', '4, 8, 15, 16, 23, 42', '72, 84, 84, 90, 93'].map((example) => (
            <button
              key={example}
              onClick={() => {
                setInput(example);
                calculate(example);
              }}
              type="button"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            {averageMode ? 'Calculate average' : focused ? 'Calculate summary' : 'Calculate statistics'}
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{error ? 'Check input' : averageMode ? 'Average' : focused ? 'Mean, median, mode, range' : 'Statistics summary'}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{averageMode ? numberText(statistics.mean) : focused ? `Mean ${numberText(statistics.mean)}` : `${statistics.count} values`}</strong>
              <dl>
                <div>
                  <dt>Mean</dt>
                  <dd>{numberText(statistics.mean)}</dd>
                </div>
                <div>
                  <dt>Median</dt>
                  <dd>{numberText(statistics.median)}</dd>
                </div>
                <div>
                  <dt>Mode</dt>
                  <dd>{modesText(statistics.modes)}</dd>
                </div>
                <div>
                  <dt>Range</dt>
                  <dd>{numberText(statistics.range)}</dd>
                </div>
                {!focused && (
                  <>
                    <div>
                      <dt>Sample SD</dt>
                      <dd>{numberText(statistics.sampleStandardDeviation)}</dd>
                    </div>
                    <div>
                      <dt>IQR</dt>
                      <dd>{numberText(statistics.iqr)}</dd>
                    </div>
                  </>
                )}
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="advanced-steps">
            <h2>Steps</h2>
            <ol>
              <li>Sort the data: {listText(statistics.sortedValues)}.</li>
              <li>Add all values for sum {numberText(statistics.sum)} and divide by {statistics.count} to get the average.</li>
              <li>Use the middle value for the median and most frequent value for the mode.</li>
              <li>Subtract min {numberText(statistics.min)} from max {numberText(statistics.max)} for the range.</li>
            </ol>
          </div>
        )}
      </div>

      <HistoryPanel
        history={history}
        note={[
          'Separate values with commas, spaces, or new lines.',
          averageMode
            ? 'Average usually means the arithmetic mean: sum divided by count.'
            : focused
              ? 'This version focuses on the four headline descriptive statistics.'
              : 'The full summary includes spread, quartiles, and standard deviation.',
        ]}
      />
    </section>
  );
}

function SequenceTool() {
  const [kind, setKind] = useState<SequenceKind>('arithmetic');
  const [first, setFirst] = useState('3');
  const [second, setSecond] = useState('4');
  const [length, setLength] = useState('8');
  const [calculation, setCalculation] = useState(() => calculateNumberSequence('arithmetic', 3, 4, 8));
  const [history, addHistory] = useHistory();
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = (nextKind = kind, nextFirst = first, nextSecond = second, nextLength = length) => {
    try {
      const result = calculateNumberSequence(nextKind, Number(nextFirst), Number(nextSecond), Number(nextLength));
      setCalculation(result);
      addHistory({ expression: nextKind, answer: listText(result.terms) });
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the sequence inputs');
      setCopied(false);
    }
  };

  const setExample = (nextKind: SequenceKind, nextFirst: string, nextSecond: string, nextLength: string) => {
    setKind(nextKind);
    setFirst(nextFirst);
    setSecond(nextSecond);
    setLength(nextLength);
    calculate(nextKind, nextFirst, nextSecond, nextLength);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.kind} sequence: ${listText(calculation.terms)}`);
    setCopied(true);
  };

  return (
    <section className="advanced-calculator advanced-calculator-statistics" aria-label="Number sequence calculator">
      <div className="advanced-panel">
        <div className="advanced-mode-grid">
          {(['arithmetic', 'geometric', 'fibonacci'] as SequenceKind[]).map((item) => (
            <button
              aria-pressed={kind === item}
              key={item}
              onClick={() => {
                setKind(item);
                calculate(item);
              }}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="advanced-fields">
          <label className="advanced-field">
            <span>First term</span>
            <input inputMode="decimal" onChange={(event) => setFirst(event.target.value)} value={first} />
          </label>
          <label className="advanced-field">
            <span>{kind === 'arithmetic' ? 'Common difference' : kind === 'geometric' ? 'Common ratio' : 'Second term'}</span>
            <input inputMode="decimal" onChange={(event) => setSecond(event.target.value)} value={second} />
          </label>
          <label className="advanced-field">
            <span>Terms to show</span>
            <input inputMode="numeric" onChange={(event) => setLength(event.target.value)} value={length} />
          </label>
        </div>

        <div className="advanced-quick-grid">
          <button onClick={() => setExample('arithmetic', '3', '4', '8')} type="button">Arithmetic</button>
          <button onClick={() => setExample('geometric', '2', '3', '8')} type="button">Geometric</button>
          <button onClick={() => setExample('fibonacci', '1', '1', '10')} type="button">Fibonacci</button>
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">Generate sequence</button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy sequence'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{error ? 'Check input' : calculation.formula}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{listText(calculation.terms)}</strong>
              <dl>
                <div>
                  <dt>Type</dt>
                  <dd>{calculation.kind}</dd>
                </div>
                <div>
                  <dt>Next terms</dt>
                  <dd>{listText(calculation.nextTerms)}</dd>
                </div>
                <div>
                  <dt>Terms</dt>
                  <dd>{calculation.terms.length}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="advanced-steps">
            <h2>Steps</h2>
            <ol>{calculation.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          </div>
        )}
      </div>

      <HistoryPanel history={history} note={['Arithmetic sequences add a constant difference.', 'Geometric sequences multiply by a constant ratio.']} />
    </section>
  );
}

function SampleSizeTool() {
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>(95);
  const [margin, setMargin] = useState('5');
  const [proportion, setProportion] = useState('50');
  const [population, setPopulation] = useState('');
  const [calculation, setCalculation] = useState(() => calculateSampleSize(95, 5, 50));
  const [history, addHistory] = useHistory();
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    try {
      const result = calculateSampleSize(
        confidenceLevel,
        Number(margin),
        Number(proportion),
        population.trim() ? Number(population) : null,
      );
      setCalculation(result);
      addHistory({ expression: `${confidenceLevel}% confidence`, answer: `${result.requiredSampleSize}` });
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the sample size inputs');
      setCopied(false);
    }
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`Required sample size: ${calculation.requiredSampleSize}`);
    setCopied(true);
  };

  return (
    <section className="advanced-calculator advanced-calculator-statistics" aria-label="Sample size calculator">
      <div className="advanced-panel">
        <div className="advanced-mode-grid">
          {confidenceLevels.map((level) => (
            <button
              aria-pressed={confidenceLevel === level}
              key={level}
              onClick={() => setConfidenceLevel(level)}
              type="button"
            >
              {level}%
            </button>
          ))}
        </div>

        <div className="advanced-fields">
          <label className="advanced-field">
            <span>Margin of error (%)</span>
            <input inputMode="decimal" onChange={(event) => setMargin(event.target.value)} value={margin} />
          </label>
          <label className="advanced-field">
            <span>Population proportion (%)</span>
            <input inputMode="decimal" onChange={(event) => setProportion(event.target.value)} value={proportion} />
          </label>
          <label className="advanced-field">
            <span>Population size (optional)</span>
            <input inputMode="numeric" onChange={(event) => setPopulation(event.target.value)} value={population} />
          </label>
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={calculate} type="button">Calculate sample size</button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{error ? 'Check input' : 'Required sample size'}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{calculation.requiredSampleSize}</strong>
              <dl>
                <div>
                  <dt>Z-score</dt>
                  <dd>{numberText(calculation.zScore)}</dd>
                </div>
                <div>
                  <dt>Raw n</dt>
                  <dd>{numberText(calculation.rawSampleSize)}</dd>
                </div>
                <div>
                  <dt>Adjusted n</dt>
                  <dd>{numberText(calculation.adjustedSampleSize)}</dd>
                </div>
              </dl>
            </>
          )}
        </div>
      </div>

      <HistoryPanel history={history} note={['Use 50% proportion when you are unsure; it gives the most conservative survey sample size.', 'Optional population size applies finite population correction.']} />
    </section>
  );
}

function ProbabilityTool() {
  const [probA, setProbA] = useState('40');
  const [probB, setProbB] = useState('25');
  const [intersection, setIntersection] = useState('');
  const [calculation, setCalculation] = useState(() => calculateProbability(0.4, 0.25));
  const [history, addHistory] = useHistory();
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    try {
      const result = calculateProbability(
        probabilityPercentToDecimal(Number(probA), 'Probability A'),
        probabilityPercentToDecimal(Number(probB), 'Probability B'),
        intersection.trim() ? probabilityPercentToDecimal(Number(intersection), 'Intersection probability') : null,
      );
      setCalculation(result);
      addHistory({ expression: 'P(A or B)', answer: percentText(result.union) });
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the probability inputs');
      setCopied(false);
    }
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`P(A or B) = ${percentText(calculation.union)}`);
    setCopied(true);
  };

  return (
    <section className="advanced-calculator advanced-calculator-statistics" aria-label="Probability calculator">
      <div className="advanced-panel">
        <div className="advanced-fields">
          <label className="advanced-field">
            <span>P(A) percent</span>
            <input inputMode="decimal" onChange={(event) => setProbA(event.target.value)} value={probA} />
          </label>
          <label className="advanced-field">
            <span>P(B) percent</span>
            <input inputMode="decimal" onChange={(event) => setProbB(event.target.value)} value={probB} />
          </label>
          <label className="advanced-field">
            <span>P(A and B) optional</span>
            <input inputMode="decimal" onChange={(event) => setIntersection(event.target.value)} value={intersection} />
          </label>
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={calculate} type="button">Calculate probability</button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{error ? 'Check input' : calculation.independentIntersection ? 'Assuming independent events' : 'Using entered intersection'}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>P(A or B) = {percentText(calculation.union)}</strong>
              <dl>
                <div>
                  <dt>P(A and B)</dt>
                  <dd>{percentText(calculation.intersection)}</dd>
                </div>
                <div>
                  <dt>Not A</dt>
                  <dd>{percentText(calculation.complementA)}</dd>
                </div>
                <div>
                  <dt>Not B</dt>
                  <dd>{percentText(calculation.complementB)}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="advanced-steps">
            <h2>Steps</h2>
            <ol>
              <li>Convert entered percentages to decimals.</li>
              <li>{calculation.independentIntersection ? 'Use P(A and B) = P(A) x P(B).' : 'Use the entered P(A and B).'}</li>
              <li>Use P(A or B) = P(A) + P(B) - P(A and B).</li>
            </ol>
          </div>
        )}
      </div>

      <HistoryPanel history={history} note={['Leave P(A and B) blank for independent events.', 'Enter the intersection when the events overlap in a known way.']} />
    </section>
  );
}

function PermutationCombinationTool() {
  const [n, setN] = useState('10');
  const [r, setR] = useState('3');
  const [calculation, setCalculation] = useState(() => calculatePermutationCombination(10, 3));
  const [history, addHistory] = useHistory();
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    try {
      const result = calculatePermutationCombination(Number(n), Number(r));
      setCalculation(result);
      addHistory({ expression: `n=${result.n}, r=${result.r}`, answer: `${formatBigInteger(result.combinations)} combinations` });
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check n and r');
      setCopied(false);
    }
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(
      `nPr = ${formatBigInteger(calculation.permutations)}, nCr = ${formatBigInteger(calculation.combinations)}`,
    );
    setCopied(true);
  };

  return (
    <section className="advanced-calculator advanced-calculator-statistics" aria-label="Permutation and combination calculator">
      <div className="advanced-panel">
        <div className="advanced-fields">
          <label className="advanced-field">
            <span>n items</span>
            <input inputMode="numeric" onChange={(event) => setN(event.target.value)} value={n} />
          </label>
          <label className="advanced-field">
            <span>r selected</span>
            <input inputMode="numeric" onChange={(event) => setR(event.target.value)} value={r} />
          </label>
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={calculate} type="button">Calculate nPr and nCr</button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{error ? 'Check input' : `n=${calculation.n}, r=${calculation.r}`}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{formatBigInteger(calculation.combinations)} combinations</strong>
              <dl>
                <div>
                  <dt>nPr</dt>
                  <dd>{formatBigInteger(calculation.permutations)}</dd>
                </div>
                <div>
                  <dt>nCr</dt>
                  <dd>{formatBigInteger(calculation.combinations)}</dd>
                </div>
                <div>
                  <dt>Order matters</dt>
                  <dd>Permutation</dd>
                </div>
              </dl>
            </>
          )}
        </div>
      </div>

      <HistoryPanel history={history} note={['Use permutations when order matters.', 'Use combinations when order does not matter.']} />
    </section>
  );
}

function ZScoreTool() {
  const [value, setValue] = useState('85');
  const [mean, setMean] = useState('70');
  const [standardDeviation, setStandardDeviation] = useState('10');
  const [calculation, setCalculation] = useState(() => calculateZScore(85, 70, 10));
  const [history, addHistory] = useHistory();
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    try {
      const result = calculateZScore(Number(value), Number(mean), Number(standardDeviation));
      setCalculation(result);
      addHistory({ expression: `x=${numberText(result.value)}`, answer: `z=${numberText(result.zScore)}` });
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the z-score inputs');
      setCopied(false);
    }
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`z-score = ${numberText(calculation.zScore)}`);
    setCopied(true);
  };

  return (
    <section className="advanced-calculator advanced-calculator-statistics" aria-label="Z-score calculator">
      <div className="advanced-panel">
        <div className="advanced-fields">
          <label className="advanced-field">
            <span>Value x</span>
            <input inputMode="decimal" onChange={(event) => setValue(event.target.value)} value={value} />
          </label>
          <label className="advanced-field">
            <span>Mean</span>
            <input inputMode="decimal" onChange={(event) => setMean(event.target.value)} value={mean} />
          </label>
          <label className="advanced-field">
            <span>Standard deviation</span>
            <input inputMode="decimal" onChange={(event) => setStandardDeviation(event.target.value)} value={standardDeviation} />
          </label>
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={calculate} type="button">Calculate z-score</button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{error ? 'Check input' : 'Z-score'}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{numberText(calculation.zScore)}</strong>
              <dl>
                <div>
                  <dt>Percentile</dt>
                  <dd>{percentText(calculation.percentile)}</dd>
                </div>
                <div>
                  <dt>Distance</dt>
                  <dd>{calculation.zScore >= 0 ? 'Above mean' : 'Below mean'}</dd>
                </div>
                <div>
                  <dt>Mean</dt>
                  <dd>{numberText(calculation.mean)}</dd>
                </div>
              </dl>
            </>
          )}
        </div>
      </div>

      <HistoryPanel history={history} note={['z = (x - mean) / standard deviation.', 'Percentile uses the standard normal curve approximation.']} />
    </section>
  );
}

const pValueTailOptions: Array<{ value: PValueTail; label: string; note: string }> = [
  { value: 'two', label: 'Two-tailed', note: 'Tests difference in either direction.' },
  { value: 'right', label: 'Right-tailed', note: 'Tests unusually high values.' },
  { value: 'left', label: 'Left-tailed', note: 'Tests unusually low values.' },
];

function PValueTool() {
  const [zScore, setZScore] = useState('1.96');
  const [tail, setTail] = useState<PValueTail>('two');
  const [calculation, setCalculation] = useState(() => calculateNormalPValue(1.96, 'two'));
  const [history, addHistory] = useHistory();
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = (nextZScore = zScore, nextTail = tail) => {
    try {
      const result = calculateNormalPValue(Number(nextZScore), nextTail);
      setCalculation(result);
      addHistory({ expression: `z=${numberText(result.zScore)}, ${result.tail}`, answer: `p=${numberText(result.pValue)}` });
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the z-score');
      setCopied(false);
    }
  };

  const setExample = (nextZScore: string, nextTail: PValueTail) => {
    setZScore(nextZScore);
    setTail(nextTail);
    calculate(nextZScore, nextTail);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`P-value = ${numberText(calculation.pValue)} for z=${numberText(calculation.zScore)}`);
    setCopied(true);
  };

  const tailLabel = pValueTailOptions.find((option) => option.value === calculation.tail)?.label ?? 'P-value';

  return (
    <section className="advanced-calculator advanced-calculator-statistics" aria-label="P-value calculator">
      <div className="advanced-panel">
        <div className="advanced-mode-grid">
          {pValueTailOptions.map((option) => (
            <button
              aria-pressed={tail === option.value}
              key={option.value}
              onClick={() => {
                setTail(option.value);
                calculate(zScore, option.value);
              }}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="advanced-field">
          <span>Z-score</span>
          <input inputMode="decimal" onChange={(event) => setZScore(event.target.value)} value={zScore} />
        </label>

        <div className="advanced-quick-grid">
          <button onClick={() => setExample('1.96', 'two')} type="button">z 1.96, two-tailed</button>
          <button onClick={() => setExample('1.645', 'right')} type="button">z 1.645, right</button>
          <button onClick={() => setExample('-1.28', 'left')} type="button">z -1.28, left</button>
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">Calculate p-value</button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{error ? 'Check input' : tailLabel}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>p = {numberText(calculation.pValue)}</strong>
              <dl>
                <div>
                  <dt>Left tail</dt>
                  <dd>{numberText(calculation.leftTail)}</dd>
                </div>
                <div>
                  <dt>Right tail</dt>
                  <dd>{numberText(calculation.rightTail)}</dd>
                </div>
                <div>
                  <dt>Z-score</dt>
                  <dd>{numberText(calculation.zScore)}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="advanced-steps">
            <h2>Steps</h2>
            <ol>
              <li>Use the standard normal curve where mean is 0 and standard deviation is 1.</li>
              <li>Find the left-tail area for z = {numberText(calculation.zScore)}.</li>
              <li>{calculation.tail === 'two' ? 'Double the smaller tail area for a two-tailed p-value.' : `Use the ${calculation.tail}-tail area as the p-value.`}</li>
              <li>The p-value is {numberText(calculation.pValue)}.</li>
            </ol>
          </div>
        )}
      </div>

      <HistoryPanel
        history={history}
        note={pValueTailOptions.map((option) => `${option.label}: ${option.note}`)}
      />
    </section>
  );
}

function ConfidenceIntervalTool() {
  const [mode, setMode] = useState<ConfidenceIntervalMode>('mean');
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>(95);
  const [sampleMean, setSampleMean] = useState('68');
  const [standardDeviation, setStandardDeviation] = useState('3');
  const [sampleSize, setSampleSize] = useState('36');
  const [successes, setSuccesses] = useState('52');
  const [proportionSize, setProportionSize] = useState('100');
  const [calculation, setCalculation] = useState(() => calculateMeanConfidenceInterval(68, 3, 36, 95));
  const [history, addHistory] = useHistory();
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = (nextMode = mode) => {
    try {
      const result =
        nextMode === 'mean'
          ? calculateMeanConfidenceInterval(Number(sampleMean), Number(standardDeviation), Number(sampleSize), confidenceLevel)
          : calculateProportionConfidenceInterval(Number(successes), Number(proportionSize), confidenceLevel);
      setCalculation(result);
      addHistory({ expression: `${confidenceLevel}% ${nextMode}`, answer: `${numberText(result.lowerBound)} to ${numberText(result.upperBound)}` });
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the confidence interval inputs');
      setCopied(false);
    }
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(
      `${confidenceLevel}% confidence interval: ${numberText(calculation.lowerBound)} to ${numberText(calculation.upperBound)}`,
    );
    setCopied(true);
  };

  const intervalAnswer = calculation.mode === 'proportion'
    ? `${percentText(calculation.lowerBound)} to ${percentText(calculation.upperBound)}`
    : `${numberText(calculation.lowerBound)} to ${numberText(calculation.upperBound)}`;

  return (
    <section className="advanced-calculator advanced-calculator-statistics" aria-label="Confidence interval calculator">
      <div className="advanced-panel">
        <div className="advanced-mode-grid">
          <button
            aria-pressed={mode === 'mean'}
            onClick={() => {
              setMode('mean');
              calculate('mean');
            }}
            type="button"
          >
            Mean
          </button>
          <button
            aria-pressed={mode === 'proportion'}
            onClick={() => {
              setMode('proportion');
              calculate('proportion');
            }}
            type="button"
          >
            Proportion
          </button>
        </div>

        <div className="advanced-mode-grid">
          {confidenceLevels.map((level) => (
            <button
              aria-pressed={confidenceLevel === level}
              key={level}
              onClick={() => setConfidenceLevel(level)}
              type="button"
            >
              {level}%
            </button>
          ))}
        </div>

        {mode === 'mean' ? (
          <div className="advanced-fields">
            <label className="advanced-field">
              <span>Sample mean</span>
              <input inputMode="decimal" onChange={(event) => setSampleMean(event.target.value)} value={sampleMean} />
            </label>
            <label className="advanced-field">
              <span>Standard deviation</span>
              <input inputMode="decimal" onChange={(event) => setStandardDeviation(event.target.value)} value={standardDeviation} />
            </label>
            <label className="advanced-field">
              <span>Sample size</span>
              <input inputMode="numeric" onChange={(event) => setSampleSize(event.target.value)} value={sampleSize} />
            </label>
          </div>
        ) : (
          <div className="advanced-fields">
            <label className="advanced-field">
              <span>Successes</span>
              <input inputMode="numeric" onChange={(event) => setSuccesses(event.target.value)} value={successes} />
            </label>
            <label className="advanced-field">
              <span>Sample size</span>
              <input inputMode="numeric" onChange={(event) => setProportionSize(event.target.value)} value={proportionSize} />
            </label>
          </div>
        )}

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">Calculate interval</button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{error ? 'Check input' : `${confidenceLevel}% confidence interval`}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{intervalAnswer}</strong>
              <dl>
                <div>
                  <dt>Margin</dt>
                  <dd>{calculation.mode === 'proportion' ? percentText(calculation.marginOfError) : numberText(calculation.marginOfError)}</dd>
                </div>
                <div>
                  <dt>Z-score</dt>
                  <dd>{numberText(calculation.zScore)}</dd>
                </div>
                <div>
                  <dt>Point estimate</dt>
                  <dd>{calculation.mode === 'proportion' ? percentText(calculation.pointEstimate) : numberText(calculation.pointEstimate)}</dd>
                </div>
              </dl>
            </>
          )}
        </div>
      </div>

      <HistoryPanel history={history} note={['Mean mode uses a z interval with a known or estimated standard deviation.', 'Proportion mode uses successes divided by sample size as the point estimate.']} />
    </section>
  );
}

export default function StatsCalculator({ variant }: Props) {
  if (variant === 'standard-deviation') return <StandardDeviationTool />;
  if (variant === 'number-sequence') return <SequenceTool />;
  if (variant === 'sample-size') return <SampleSizeTool />;
  if (variant === 'probability') return <ProbabilityTool />;
  if (variant === 'statistics') return <SummaryTool mode="statistics" />;
  if (variant === 'mean-median-mode-range') return <SummaryTool mode="mean-median-mode-range" />;
  if (variant === 'average') return <SummaryTool mode="average" />;
  if (variant === 'permutation-combination') return <PermutationCombinationTool />;
  if (variant === 'z-score') return <ZScoreTool />;
  if (variant === 'p-value') return <PValueTool />;

  return <ConfidenceIntervalTool />;
}
