const EXPECTED_NODE_VERSION = 24;
const EXPECTED_ENTRY_FILE = 'app.js';
const EXPECTED_OUTPUT_DIRECTORY = 'dist';
const SUCCESS_STATES = new Set(['completed', 'finished', 'success', 'succeeded']);

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

export function summarizeHostingerNodeRuntime(builds, options = {}) {
  const latest = Array.isArray(builds) ? builds[0] : null;

  if (!latest) {
    return {
      ok: false,
      endpoint: options.endpoint ?? null,
      count: 0,
      message: 'not enough data: no Node.js build history was returned',
      latest: null,
    };
  }

  const state = normalize(latest.state ?? latest.status) || 'unknown';
  const nodeVersion = Number(latest.options?.node_version);
  const entryFile = latest.options?.entry_file ?? null;
  const outputDirectory = latest.options?.output_directory ?? null;
  const sourceType = latest.options?.source_type ?? null;
  const configMatches =
    nodeVersion === EXPECTED_NODE_VERSION &&
    entryFile === EXPECTED_ENTRY_FILE &&
    outputDirectory === EXPECTED_OUTPUT_DIRECTORY;
  const completed = SUCCESS_STATES.has(state);

  const latestSummary = {
    uuid: latest.uuid ?? null,
    state,
    nodeVersion: Number.isFinite(nodeVersion) ? nodeVersion : null,
    entryFile,
    outputDirectory,
    sourceType,
    createdAt: latest.created_at ?? null,
    updatedAt: latest.updated_at ?? null,
  };

  if (!completed) {
    return {
      ok: false,
      endpoint: options.endpoint ?? null,
      count: builds.length,
      message: `latest Node.js build is ${state}, not completed`,
      latest: latestSummary,
    };
  }

  if (!configMatches) {
    return {
      ok: false,
      endpoint: options.endpoint ?? null,
      count: builds.length,
      message: `latest build uses Node ${latestSummary.nodeVersion ?? 'unknown'}, entry ${entryFile ?? 'null'}, output ${outputDirectory ?? 'null'}`,
      latest: latestSummary,
    };
  }

  return {
    ok: true,
    endpoint: options.endpoint ?? null,
    count: builds.length,
    description: `Node ${EXPECTED_NODE_VERSION}, ${EXPECTED_ENTRY_FILE}, ${EXPECTED_OUTPUT_DIRECTORY}, ${state}`,
    latest: latestSummary,
  };
}
