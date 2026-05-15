import { useState, type FormEvent } from 'react';

interface AskResponse {
  answer?: string;
  message?: string;
  ok: boolean;
  route?: {
    confidence: string;
    source: string;
    tool_slug: string;
  };
  run?: {
    assumptions: string[];
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
                <span>Tool used</span>
                <strong>{response.tool?.name}</strong>
              </div>
              <p>{response.answer}</p>
              {response.run?.steps?.length ? (
                <div>
                  <h2>Steps</h2>
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
              <a className="button-secondary" href={response.tool?.tool_url ?? response.run?.tool_url ?? '/tools/'}>
                Open the real tool
              </a>
            </>
          ) : (
            <p>{response.message}</p>
          )}
        </section>
      )}
    </div>
  );
}
