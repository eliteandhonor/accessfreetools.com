import { useState, type FormEvent } from 'react';

interface AskResponse {
  answer?: string;
  message?: string;
  model?: string;
  ok: boolean;
  route?: {
    confidence: string;
    source: string;
    tool_slug: string;
  };
  run?: {
    answer: string;
    assumptions: string[];
    guide_url: string;
    inputs?: Record<string, unknown>;
    result?: Record<string, unknown>;
    steps: string[];
    tool_url: string;
    warnings: string[];
  };
  tool?: {
    name: string;
    tool_url: string;
  };
}

const examples = [
  'What is 18% of 240?',
  'How much concrete for a 10 by 12 slab 4 inches thick?',
  'How long will a 5GB file take to download at 80 Mbps?',
  'Convert 600 watts to amps at 120 volts.',
];

function labelForKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function valueForDisplay(value: unknown) {
  if (value === null || value === undefined) return 'Not set';
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : Number(value.toFixed(6)).toString();
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function entriesForDisplay(value?: Record<string, unknown>, limit = 8) {
  if (!value || typeof value !== 'object') return [];

  return Object.entries(value)
    .filter(([, entryValue]) => entryValue !== undefined)
    .slice(0, limit);
}

export default function AskToolChat() {
  const [message, setMessage] = useState(examples[0]);
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const result = await fetch('/api/v1/ask', {
        body: JSON.stringify({ message }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      });
      setResponse((await result.json()) as AskResponse);
    } catch {
      setResponse({ ok: false, message: 'Ask Access Free Tools could not connect. Try again in a moment.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="ask-shell">
      <form className="ask-form" onSubmit={submitQuestion}>
        <label htmlFor="ask-message">Ask a calculator or utility question</label>
        <textarea
          id="ask-message"
          maxLength={1200}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          value={message}
        />
        <div className="ask-actions">
          <button className="button-primary" disabled={isLoading || message.trim().length < 3} type="submit">
            {isLoading ? 'Running tool...' : 'Ask Access Free Tools'}
          </button>
          <span>{message.length}/1200</span>
        </div>
      </form>

      <div className="ask-example-row" aria-label="Example questions">
        {examples.map((example) => (
          <button key={example} onClick={() => setMessage(example)} type="button">
            {example}
          </button>
        ))}
      </div>

      {response && (
        <section className={`ask-result ${response.ok ? '' : 'ask-result-error'}`} aria-live="polite">
          {response.ok ? (
            <>
              <div className="ask-result-topline">
                <span>Real tool used</span>
                <strong>{response.tool?.name}</strong>
              </div>
              <div className="ask-run-badge">Ask only chose the tool. The number below comes from the tool runner.</div>
              <div className="ask-tool-answer">
                <span>Tool result</span>
                <strong>{response.run?.answer ?? response.answer}</strong>
              </div>
              <div className="ask-proof-grid">
                {entriesForDisplay(response.run?.inputs).length ? (
                  <div className="ask-proof-card">
                    <h2>Inputs used by the tool</h2>
                    <dl>
                      {entriesForDisplay(response.run?.inputs).map(([key, value]) => (
                        <div key={key}>
                          <dt>{labelForKey(key)}</dt>
                          <dd>{valueForDisplay(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : null}
                {entriesForDisplay(response.run?.result).length ? (
                  <div className="ask-proof-card">
                    <h2>Calculated output</h2>
                    <dl>
                      {entriesForDisplay(response.run?.result).map(([key, value]) => (
                        <div key={key}>
                          <dt>{labelForKey(key)}</dt>
                          <dd>{valueForDisplay(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : null}
              </div>
              {response.run?.assumptions?.length ? (
                <div className="ask-assumptions">
                  <h2>Assumptions</h2>
                  <ul>
                    {response.run.assumptions.map((assumption) => (
                      <li key={assumption}>{assumption}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {response.run?.steps?.length ? (
                <div>
                  <h2>Formula steps from the tool</h2>
                  <ol>
                    {response.run.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              ) : null}
              {response.run?.warnings?.length ? (
                <div className="ask-warning">
                  <strong>Important limit</strong>
                  <p>{response.run.warnings.join(' ')}</p>
                </div>
              ) : null}
              <div className="ask-link-row">
                <a className="button-secondary" href={response.tool?.tool_url ?? response.run?.tool_url ?? '/tools/'}>
                  Open this tool
                </a>
                {response.run?.guide_url ? (
                  <a className="button-secondary" href={response.run.guide_url}>
                    Read the guide
                  </a>
                ) : null}
              </div>
            </>
          ) : (
            <p>{response.message}</p>
          )}
        </section>
      )}
    </div>
  );
}
