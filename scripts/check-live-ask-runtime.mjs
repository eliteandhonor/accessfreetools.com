const site = (process.env.AFT_SITE_URL || 'https://accessfreetools.com').replace(/\/$/, '');

async function readJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function checkTools() {
  const response = await fetch(`${site}/api/v1/tools`, { headers: { accept: 'application/json' } });
  const body = await readJson(response);
  if (!response.ok || !body.ok || !Array.isArray(body.tools) || body.tools.length < 10) {
    throw new Error(`/api/v1/tools did not return the real tool registry. Status ${response.status}.`);
  }
  return { count: body.tools.length };
}

async function checkAsk() {
  const response = await fetch(`${site}/api/v1/ask`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ message: 'What is 18% of 240?' }),
  });
  const body = await readJson(response);
  if (!response.ok || !body.ok) {
    throw new Error(`/api/v1/ask failed. Status ${response.status}. ${body.message ?? ''}`);
  }
  const source = body.route?.source ?? 'unknown';
  if (source === 'php-router') {
    throw new Error('/api/v1/ask is still using the removed PHP fallback route.');
  }
  if (!['ollama', 'parser'].includes(source)) {
    throw new Error(`/api/v1/ask returned ${source}; expected live Ask routing through the parser or Ollama.`);
  }
  if (body.route?.tool_slug !== 'percentage-calculator') {
    throw new Error(`/api/v1/ask picked ${body.route?.tool_slug ?? 'unknown'}; expected percentage-calculator.`);
  }
  const answerText = `${body.answer ?? ''} ${body.run?.answer ?? ''}`;
  if (!answerText.includes('43.2') || answerText.includes('18% of 0')) {
    throw new Error('/api/v1/ask did not return the correct deterministic result for 18% of 240.');
  }
  if (body.run?.inputs?.percent !== 18 || body.run?.inputs?.value !== 240) {
    throw new Error('/api/v1/ask did not expose the parsed inputs used by the real tool runner.');
  }
  return { answer: body.run?.answer ?? null, model: body.model ?? null, source, tool: body.route?.tool_slug ?? null };
}

async function checkMcp() {
  const response = await fetch(`${site}/mcp`, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/event-stream',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }),
  });
  const body = await readJson(response);
  if (!response.ok || !body.result?.tools?.length) {
    throw new Error(`/mcp tools/list failed. Status ${response.status}.`);
  }
  return { tools: body.result.tools.map((tool) => tool.name) };
}

try {
  const tools = await checkTools();
  const ask = await checkAsk();
  const mcp = await checkMcp();
  console.log(
    JSON.stringify(
      {
        ok: true,
        site,
        tools,
        ask,
        mcp,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
