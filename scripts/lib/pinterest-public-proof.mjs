const INITIAL_PROPS_PATTERN = /<script[^>]+id=["']__PWS_INITIAL_PROPS__["'][^>]*>([\s\S]*?)<\/script>/i;
const PIN_ID_PATTERN = /^\d+$/;
const TOOL_PATH_PATTERN = /^\/tools\/([^/]+)\/$/;
const ALLOWED_DESTINATION_HOSTS = new Set(['accessfreetools.com', 'www.accessfreetools.com']);

function normalizeBoardPath(pathname) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

function destinationFromPin(pin) {
  for (const value of [pin?.link, pin?.utm_link]) {
    if (typeof value !== 'string' || !value.trim()) continue;

    try {
      const url = new URL(value);
      if (!ALLOWED_DESTINATION_HOSTS.has(url.hostname.toLowerCase())) {
        return { kind: 'external', value };
      }

      const match = url.pathname.match(TOOL_PATH_PATTERN);
      if (!match) {
        return { kind: 'non-tool', value };
      }

      return {
        kind: 'tool',
        slug: match[1],
        destination: `https://accessfreetools.com${url.pathname}`,
        originalDestination: value,
      };
    } catch {
      return { kind: 'invalid', value };
    }
  }

  return { kind: 'missing', value: '' };
}

export function extractPinterestInitialState(html) {
  const match = html.match(INITIAL_PROPS_PATTERN);
  if (!match) {
    throw new Error('Pinterest page did not include __PWS_INITIAL_PROPS__.');
  }

  const props = JSON.parse(match[1]);
  if (!props?.initialReduxState || typeof props.initialReduxState !== 'object') {
    throw new Error('Pinterest initial state was missing or invalid.');
  }

  return props.initialReduxState;
}

export function parsePinterestBoardHtml({ html, boardSlug, boardTitle, accountName = 'accessfreetools' }) {
  const state = extractPinterestInitialState(html);
  const resources = state.resources?.BoardFeedResource;
  if (!resources || typeof resources !== 'object') {
    throw new Error(`Pinterest board ${boardSlug} did not include BoardFeedResource data.`);
  }

  const expectedBoardPath = `/${accountName}/${boardSlug}/`;
  const entries = Object.values(resources);
  const pins = [];
  let nextBookmark = '-end-';
  let feedIndex = 0;

  for (const entry of entries) {
    if (!entry || !Array.isArray(entry.data)) continue;
    nextBookmark = entry.nextBookmark || nextBookmark;

    for (const pin of entry.data) {
      if (pin?.type !== 'pin') continue;

      pins.push({
        id: String(pin.id ?? ''),
        boardPath: normalizeBoardPath(pin.board?.url ?? ''),
        boardTitle: pin.board?.name ?? '',
        ownerUsername: pin.board?.owner?.username ?? pin.pinner?.username ?? '',
        title: pin.grid_title ?? pin.story_pin_data?.metadata?.pin_title ?? '',
        description: pin.unified_user_note ?? pin.description ?? '',
        altText: pin.seo_alt_text ?? pin.alt_text ?? '',
        destination: destinationFromPin(pin),
        feedIndex,
      });
      feedIndex += 1;
    }
  }

  return {
    boardSlug,
    boardTitle,
    expectedBoardPath,
    nextBookmark,
    pins,
  };
}

function chooseNewestCandidate(candidates) {
  return [...candidates].sort((left, right) => {
    if (left.feedIndex !== right.feedIndex) return left.feedIndex - right.feedIndex;
    return Number(right.pinId) - Number(left.pinId);
  })[0];
}

export function collectPinterestPublicProof({ boardResults, apps }) {
  const appBySlug = new Map(apps.map((app) => [app.slug, app]));
  const candidatesBySlug = new Map();
  const pinIdToSlug = new Map();
  const hardIssues = [];
  const skipped = [];

  for (const board of boardResults) {
    for (const pin of board.pins) {
      if (!PIN_ID_PATTERN.test(pin.id)) {
        hardIssues.push(`${board.boardSlug} returned an invalid Pin id: ${pin.id || '(empty)'}.`);
        continue;
      }

      if (pin.ownerUsername && pin.ownerUsername.toLowerCase() !== 'accessfreetools') {
        skipped.push({ boardSlug: board.boardSlug, pinId: pin.id, reason: 'different-owner' });
        continue;
      }

      if (pin.boardPath !== board.expectedBoardPath) {
        hardIssues.push(
          `Pin ${pin.id} appeared on ${pin.boardPath || '(missing board)'} while scanning ${board.expectedBoardPath}.`,
        );
        continue;
      }

      if (pin.destination.kind !== 'tool') {
        skipped.push({
          boardSlug: board.boardSlug,
          pinId: pin.id,
          reason: pin.destination.kind,
          destination: pin.destination.value,
        });
        continue;
      }

      const app = appBySlug.get(pin.destination.slug);
      if (!app) {
        hardIssues.push(`Pin ${pin.id} targets unknown app slug ${pin.destination.slug}.`);
        continue;
      }

      if (app.boardSlug !== board.boardSlug) {
        hardIssues.push(
          `Pin ${pin.id} targets ${app.slug} on ${board.boardSlug}; expected board ${app.boardSlug}.`,
        );
        continue;
      }

      const priorSlug = pinIdToSlug.get(pin.id);
      if (priorSlug && priorSlug !== app.slug) {
        hardIssues.push(`Pin ${pin.id} was mapped to both ${priorSlug} and ${app.slug}.`);
        continue;
      }
      pinIdToSlug.set(pin.id, app.slug);

      const candidate = {
        slug: app.slug,
        pinId: pin.id,
        pinUrl: `https://au.pinterest.com/pin/${pin.id}/`,
        destination: pin.destination.destination,
        originalDestination: pin.destination.originalDestination,
        boardSlug: board.boardSlug,
        boardTitle: board.boardTitle,
        title: pin.title,
        altText: pin.altText,
        feedIndex: pin.feedIndex,
      };

      const matches = candidatesBySlug.get(app.slug) ?? [];
      matches.push(candidate);
      candidatesBySlug.set(app.slug, matches);
    }
  }

  const discovered = [...candidatesBySlug.entries()]
    .map(([slug, candidates]) => ({
      ...chooseNewestCandidate(candidates),
      duplicatePinUrls: candidates.slice(1).map((candidate) => candidate.pinUrl),
    }))
    .sort((left, right) => left.slug.localeCompare(right.slug));

  const alreadyCovered = discovered.filter((candidate) => appBySlug.get(candidate.slug)?.status === 'posted');
  const importable = discovered.filter((candidate) => appBySlug.get(candidate.slug)?.status !== 'posted');

  return {
    discovered,
    alreadyCovered,
    importable,
    skipped,
    hardIssues,
  };
}

export function mergePinterestProof({ currentProof, candidates, published }) {
  const merged = { ...currentProof };
  const added = [];

  for (const candidate of candidates) {
    if (merged[candidate.slug]) continue;
    merged[candidate.slug] = {
      publicPinUrl: candidate.pinUrl,
      published,
    };
    added.push(candidate.slug);
  }

  return {
    proof: Object.fromEntries(Object.entries(merged).sort(([left], [right]) => left.localeCompare(right))),
    added,
  };
}

export { ALLOWED_DESTINATION_HOSTS, PIN_ID_PATTERN, TOOL_PATH_PATTERN };
