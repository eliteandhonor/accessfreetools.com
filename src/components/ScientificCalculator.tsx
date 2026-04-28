import { useMemo, useState } from 'react';
import { calculateScientificExpression, formatCalculatorNumber } from '../lib/calculator';

interface ScientificHistoryItem {
  expression: string;
  result: string;
  angleMode: 'deg' | 'rad';
}

type ScientificKey =
  | { label: string; action: 'insert'; value: string; className?: string }
  | { label: string; action: 'calculate' | 'clear' | 'backspace'; className?: string };

const scientificKeys: ScientificKey[] = [
  { label: 'sin', action: 'insert', value: 'sin(' },
  { label: 'cos', action: 'insert', value: 'cos(' },
  { label: 'tan', action: 'insert', value: 'tan(' },
  { label: 'sin^-1', action: 'insert', value: 'asin(' },
  { label: 'cos^-1', action: 'insert', value: 'acos(' },
  { label: 'tan^-1', action: 'insert', value: 'atan(' },
  { label: 'log', action: 'insert', value: 'log(' },
  { label: 'ln', action: 'insert', value: 'ln(' },
  { label: 'sqrt', action: 'insert', value: 'sqrt(' },
  { label: 'cbrt', action: 'insert', value: 'cbrt(' },
  { label: 'abs', action: 'insert', value: 'abs(' },
  { label: 'x^y', action: 'insert', value: '^' },
  { label: '(', action: 'insert', value: '(' },
  { label: ')', action: 'insert', value: ')' },
  { label: 'pi', action: 'insert', value: 'pi' },
  { label: 'e', action: 'insert', value: 'e' },
  { label: '7', action: 'insert', value: '7' },
  { label: '8', action: 'insert', value: '8' },
  { label: '9', action: 'insert', value: '9' },
  { label: '/', action: 'insert', value: '/', className: 'scientific-key-operator' },
  { label: 'DEL', action: 'backspace', className: 'scientific-key-soft' },
  { label: '4', action: 'insert', value: '4' },
  { label: '5', action: 'insert', value: '5' },
  { label: '6', action: 'insert', value: '6' },
  { label: 'x', action: 'insert', value: '*', className: 'scientific-key-operator' },
  { label: 'AC', action: 'clear', className: 'scientific-key-clear' },
  { label: '1', action: 'insert', value: '1' },
  { label: '2', action: 'insert', value: '2' },
  { label: '3', action: 'insert', value: '3' },
  { label: '-', action: 'insert', value: '-', className: 'scientific-key-operator' },
  { label: '%', action: 'insert', value: '/100', className: 'scientific-key-soft' },
  { label: '0', action: 'insert', value: '0' },
  { label: '.', action: 'insert', value: '.' },
  { label: 'EXP', action: 'insert', value: 'e' },
  { label: '+', action: 'insert', value: '+', className: 'scientific-key-operator' },
  { label: '=', action: 'calculate', className: 'scientific-key-equals' },
];

export default function ScientificCalculator() {
  const [expression, setExpression] = useState('sin(30)+cos(60)');
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [result, setResult] = useState('1');
  const [history, setHistory] = useState<ScientificHistoryItem[]>([]);
  const [copied, setCopied] = useState(false);

  const statusLabel = useMemo(() => {
    if (result === 'Error') return 'Check expression';
    return `${angleMode.toUpperCase()} mode`;
  }, [angleMode, result]);

  const calculate = () => {
    try {
      const value = calculateScientificExpression(expression, angleMode);
      const formatted = formatCalculatorNumber(value);
      setResult(formatted);
      setCopied(false);
      setHistory((items) => [{ expression, result: formatted, angleMode }, ...items].slice(0, 8));
    } catch {
      setResult('Error');
      setCopied(false);
    }
  };

  const handleKey = (key: ScientificKey) => {
    if (key.action === 'insert') {
      setExpression((current) => `${current}${key.value}`);
      setCopied(false);
      return;
    }

    if (key.action === 'clear') {
      setExpression('');
      setResult('0');
      setCopied(false);
      return;
    }

    if (key.action === 'backspace') {
      setExpression((current) => current.slice(0, -1));
      setCopied(false);
      return;
    }

    calculate();
  };

  const copyResult = async () => {
    if (!navigator.clipboard || result === 'Error') return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
  };

  return (
    <section className="scientific-calculator" aria-label="Scientific calculator">
      <div className="scientific-panel">
        <div className="scientific-toolbar">
          <div className="angle-toggle" aria-label="Angle mode">
            <button
              type="button"
              aria-pressed={angleMode === 'deg'}
              onClick={() => setAngleMode('deg')}
            >
              DEG
            </button>
            <button
              type="button"
              aria-pressed={angleMode === 'rad'}
              onClick={() => setAngleMode('rad')}
            >
              RAD
            </button>
          </div>
          <button type="button" onClick={copyResult} disabled={result === 'Error'}>
            {copied ? 'Copied' : 'Copy result'}
          </button>
        </div>

        <label className="scientific-expression">
          <span>Expression</span>
          <input
            value={expression}
            onChange={(event) => {
              setExpression(event.target.value);
              setCopied(false);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                calculate();
              }
            }}
            spellCheck={false}
            inputMode="text"
            aria-describedby="scientific-result"
          />
        </label>

        <div className="scientific-result" id="scientific-result" aria-live="polite">
          <span>{statusLabel}</span>
          <output>{result}</output>
        </div>

        <div className="scientific-keypad" aria-label="Scientific calculator keypad">
          {scientificKeys.map((key) => (
            <button
              key={`${key.label}-${key.action}`}
              type="button"
              className={['scientific-key', key.className].filter(Boolean).join(' ')}
              onClick={() => handleKey(key)}
            >
              {key.label}
            </button>
          ))}
        </div>
      </div>

      <aside className="scientific-history" aria-label="Scientific calculation history">
        <div>
          <h2>History</h2>
          <p>Recent expressions stay in this page while you work.</p>
        </div>

        {history.length > 0 ? (
          <ol>
            {history.map((item, index) => (
              <li key={`${item.expression}-${index}`}>
                <button
                  type="button"
                  onClick={() => {
                    setExpression(item.expression);
                    setResult(item.result);
                    setAngleMode(item.angleMode);
                  }}
                >
                  <span>{item.expression}</span>
                  <strong>{item.result}</strong>
                  <em>{item.angleMode.toUpperCase()}</em>
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty-history">Your recent expressions will appear here.</p>
        )}
      </aside>
    </section>
  );
}
