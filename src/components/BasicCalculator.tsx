import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  calculateBinary,
  formatCalculatorNumber,
  parseDisplayValue,
  percentDisplayValue,
  toggleDisplaySign,
  type CalculatorOperator,
} from '../lib/calculator';

interface HistoryItem {
  expression: string;
  result: string;
}

interface Props {
  variant?: 'standard' | 'kawaii';
}

const operatorLabels: Record<CalculatorOperator, string> = {
  '+': '+',
  '-': '-',
  '*': '\u00d7',
  '/': '\u00f7',
};

const keypadRows: string[][] = [
  ['C', 'Back', '%', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['+/-', '0', '.', '='],
];

function isOperator(value: string): value is CalculatorOperator {
  return value === '+' || value === '-' || value === '*' || value === '/';
}

function formatHistoryExpression(left: number, currentOperator: CalculatorOperator, right: string) {
  return `${formatCalculatorNumber(left)} ${operatorLabels[currentOperator]} ${right}`;
}

function getKeyLabel(key: string) {
  const labels: Record<string, string> = {
    Back: 'DEL',
    C: 'AC',
    '*': '\u00d7',
    '/': '\u00f7',
    '+/-': '\u00b1',
  };

  return labels[key] ?? key;
}

function getKeyAriaLabel(key: string) {
  const labels: Record<string, string> = {
    Back: 'Backspace',
    C: 'Clear calculator',
    '*': 'Multiply',
    '/': 'Divide',
    '+': 'Add',
    '-': 'Subtract',
    '+/-': 'Toggle positive or negative',
    '%': 'Percent',
    '=': 'Equals',
    '.': 'Decimal point',
  };

  return labels[key] ?? key;
}

export default function BasicCalculator({ variant = 'standard' }: Props) {
  const isKawaii = variant === 'kawaii';
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<CalculatorOperator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const hasError = display === 'Error' || display === 'Cannot divide by zero';

  const pendingExpression = useMemo(() => {
    if (storedValue === null || operator === null) {
      return 'Ready';
    }

    return `${formatCalculatorNumber(storedValue)} ${operatorLabels[operator]}`;
  }, [operator, storedValue]);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }, []);

  const inputDigit = useCallback(
    (digit: string) => {
      setCopied(false);
      setDisplay((current) => {
        if (waitingForOperand || current === 'Error') {
          setWaitingForOperand(false);
          return digit;
        }

        if (current === '0') {
          return digit;
        }

        return current.length >= 16 ? current : `${current}${digit}`;
      });
    },
    [waitingForOperand],
  );

  const inputDecimal = useCallback(() => {
    setCopied(false);
    setDisplay((current) => {
      if (waitingForOperand || current === 'Error') {
        setWaitingForOperand(false);
        return '0.';
      }

      return current.includes('.') ? current : `${current}.`;
    });
  }, [waitingForOperand]);

  const applyOperator = useCallback(
    (nextOperator: CalculatorOperator) => {
      setCopied(false);
      const inputValue = parseDisplayValue(display);

      if (storedValue === null) {
        setStoredValue(inputValue);
      } else if (operator && !waitingForOperand) {
        try {
          const result = calculateBinary(storedValue, operator, inputValue);
          const formatted = formatCalculatorNumber(result);
          setHistory((items) => [
            { expression: formatHistoryExpression(storedValue, operator, display), result: formatted },
            ...items,
          ].slice(0, 8));
          setDisplay(formatted);
          setStoredValue(result);
        } catch (error) {
          setDisplay(error instanceof Error ? error.message : 'Error');
          setStoredValue(null);
          setOperator(null);
          setWaitingForOperand(true);
          return;
        }
      }

      setOperator(nextOperator);
      setWaitingForOperand(true);
    },
    [display, operator, storedValue, waitingForOperand],
  );

  const performEquals = useCallback(() => {
    setCopied(false);

    if (storedValue === null || operator === null) {
      return;
    }

    const inputValue = parseDisplayValue(display);

    try {
      const result = calculateBinary(storedValue, operator, inputValue);
      const formatted = formatCalculatorNumber(result);
      setHistory((items) => [
        { expression: formatHistoryExpression(storedValue, operator, display), result: formatted },
        ...items,
      ].slice(0, 8));
      setDisplay(formatted);
      setStoredValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    } catch (error) {
      setDisplay(error instanceof Error ? error.message : 'Error');
      setStoredValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  }, [display, operator, storedValue]);

  const backspace = useCallback(() => {
    setCopied(false);
    setDisplay((current) => {
      if (waitingForOperand || current === 'Error' || current.length <= 1) {
        return '0';
      }

      if (current.length === 2 && current.startsWith('-')) {
        return '0';
      }

      return current.slice(0, -1);
    });
  }, [waitingForOperand]);

  const handleKey = useCallback(
    (key: string) => {
      if (/^\d$/.test(key)) {
        inputDigit(key);
        return;
      }

      if (isOperator(key)) {
        applyOperator(key);
        return;
      }

      if (key === 'x' || key === 'X') {
        applyOperator('*');
        return;
      }

      if (key === 'Enter' || key === '=') {
        performEquals();
        return;
      }

      if (key === 'Escape' || key === 'Delete') {
        clearAll();
        return;
      }

      if (key === 'Backspace') {
        backspace();
        return;
      }

      if (key === '.') {
        inputDecimal();
        return;
      }

      if (key === '%') {
        setCopied(false);
        setDisplay((current) => percentDisplayValue(current, storedValue, operator));
      }
    },
    [applyOperator, backspace, clearAll, inputDecimal, inputDigit, operator, performEquals, storedValue],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const allowedKeys = '0123456789+-*/=.%';
      if (
        allowedKeys.includes(event.key) ||
        ['Enter', 'Escape', 'Backspace', 'Delete', 'x', 'X'].includes(event.key)
      ) {
        event.preventDefault();
        handleKey(event.key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  const handleButton = (value: string) => {
    if (/^\d$/.test(value)) {
      inputDigit(value);
      return;
    }

    if (isOperator(value)) {
      applyOperator(value);
      return;
    }

    if (value === '=') {
      performEquals();
      return;
    }

    if (value === 'C') {
      clearAll();
      return;
    }

    if (value === 'Back') {
      backspace();
      return;
    }

    if (value === '.') {
      inputDecimal();
      return;
    }

    if (value === '+/-') {
      setCopied(false);
      setDisplay((current) => toggleDisplaySign(current));
      return;
    }

    if (value === '%') {
      setCopied(false);
      setDisplay((current) => percentDisplayValue(current, storedValue, operator));
    }
  };

  const copyResult = async () => {
    if (!navigator.clipboard || hasError) {
      return;
    }

    await navigator.clipboard.writeText(display);
    setCopied(true);
  };

  return (
    <section
      className={`calculator-tool${isKawaii ? ' calculator-tool-kawaii' : ''}`}
      aria-label={isKawaii ? 'Kawaii calculator' : 'Basic calculator'}
    >
      <div className="calculator-panel">
        {isKawaii && (
          <div className="kawaii-device-trim" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}

        <div className="calculator-display" aria-live="polite">
          {isKawaii && (
            <div className="kawaii-display-face" aria-hidden="true">
              <span className="kawaii-eye" />
              <span className="kawaii-eye" />
              <span className="kawaii-blush" />
              <span className="kawaii-blush" />
              <span className="kawaii-mouth" />
            </div>
          )}
          <div className="display-readout">
            <span>{pendingExpression}</span>
            <output>{display}</output>
          </div>
        </div>

        <div className="calculator-actions">
          <button type="button" onClick={copyResult} disabled={hasError}>
            {copied ? 'Copied' : 'Copy result'}
          </button>
          <button type="button" onClick={() => setHistory([])} disabled={history.length === 0}>
            Clear history
          </button>
        </div>

        <div className="keypad" aria-label="Calculator keypad">
          {keypadRows.flat().map((key) => (
            <button
              className={[
                'calc-key',
                isOperator(key) || key === '=' ? 'calc-key-operator' : '',
                key === 'C' ? 'calc-key-clear' : '',
                key === '=' ? 'calc-key-equals' : '',
                key === 'Back' ? 'calc-key-backspace' : '',
                key === '%' ? 'calc-key-percent' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={key}
              type="button"
              aria-label={getKeyAriaLabel(key)}
              onClick={() => handleButton(key)}
            >
              {getKeyLabel(key)}
            </button>
          ))}
        </div>
      </div>

      <aside className="history-panel" aria-label="Calculation history">
        <div>
          <h2>Calculation History</h2>
          <p>Keep recent totals while you compare numbers.</p>
        </div>

        {history.length > 0 ? (
          <ol>
            {history.map((item, index) => (
              <li key={`${item.expression}-${index}`}>
                <span>{item.expression}</span>
                <strong>{item.result}</strong>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty-history">Your recent calculations will appear here.</p>
        )}
      </aside>
    </section>
  );
}
