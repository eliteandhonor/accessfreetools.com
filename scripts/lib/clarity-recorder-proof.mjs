import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';

export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export function transportText(body) {
  if (!Buffer.isBuffer(body) || body.length > 2 * 1024 * 1024) throw new Error('transport limit');
  try {
    const bytes = body[0] === 0x1f && body[1] === 0x8b
      ? gunzipSync(body, { maxOutputLength: 8 * 1024 * 1024 }) : body;
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch { throw new Error('transport decode failed'); }
}

// The official decoder is injected, never replaced by a DOM-attribute approximation.
// Raw wire/decoded values are transient memory only; summary() is the persistence boundary.
export function createRecorderProof({ decode, version, privateMarkers, controlMarkers }) {
  const markers = [...privateMarkers, ...controlMarkers];
  if (!privateMarkers.length || !controlMarkers.length || markers.some((s) => !/^[a-z]+$/i.test(s))) {
    throw new Error('alphabetic marker contract');
  }
  const privateSeen = new Set();
  const controlSeen = new Set();
  const nodes = new Map();
  const state = { payloads: 0, gzipPayloads: 0, plainPayloads: 0, bytes: 0,
    decodeFailures: 0, discoverEvents: 0, mutationEvents: 0, inputEvents: 0,
    decodedTextNodes: 0, maskedTextNodes: 0, payloadSha256: [] };
  function capture(body) {
    try {
      if (state.payloads >= 64 || state.bytes + body.length > 16 * 1024 * 1024) {
        throw new Error('capture limit');
      }
      const text = transportText(body);
      const wire = JSON.parse(text);
      if (wire?.e?.[0] !== version || !Array.isArray(wire.a) || (wire.p && !Array.isArray(wire.p))) {
        throw new Error('wire schema/version');
      }
      const decoded = decode(text);
      if (decoded?.envelope?.version !== version) throw new Error('decoded version');
      const searchable = `${text}\n${JSON.stringify(decoded)}`.toLowerCase();
      privateMarkers.forEach((s) => { if (searchable.includes(s.toLowerCase())) privateSeen.add(s); });
      // Controls must occur in decoded DOM text, not merely a URL, custom event or input echo.
      for (const event of decoded.dom ?? []) {
        if (event.event === 5) state.discoverEvents += 1;
        if (event.event === 6) state.mutationEvents += 1;
        if (![5, 6, 37].includes(event.event) || !Array.isArray(event.data)) continue;
        for (const node of event.data) {
          const isText = node.tag === '*T' && typeof node.value === 'string';
          const masked = isText && /^[\s\u2022\u25aa\u25ab]+$/.test(node.value) && /[\u2022\u25aa\u25ab]/.test(node.value);
          nodes.set(node.id, { parent: node.parent, tag: node.tag, attributes: node.attributes, masked });
          if (nodes.size > 50000) throw new Error('node limit');
          if (isText) {
            state.decodedTextNodes += 1;
            if (masked) state.maskedTextNodes += 1;
            controlMarkers.forEach((s) => {
              if (node.value.toLowerCase().includes(s.toLowerCase())) controlSeen.add(s);
            });
          }
        }
      }
      state.inputEvents += decoded.input?.length ?? 0;
      state.payloads += 1;
      state.bytes += body.length;
      state[body[0] === 0x1f && body[1] === 0x8b ? 'gzipPayloads' : 'plainPayloads'] += 1;
      state.payloadSha256.push(sha256(body));
    } catch { state.decodeFailures += 1; }
  }
  function maskedTextCount(className, ancestorTag = null) {
    let count = 0;
    for (const node of nodes.values()) {
      if (!node.masked) continue;
      let parent = node;
      let target = false;
      let workspace = false;
      let tag = ancestorTag === null;
      const visited = new Set();
      while (parent && !visited.has(parent)) {
        visited.add(parent);
        if ((parent.attributes?.class ?? '').split(/\s+/).includes(className)) target = true;
        if (parent.attributes?.id === 'workspace') workspace = true;
        if (parent.tag === ancestorTag) tag = true;
        parent = nodes.get(parent.parent);
      }
      if (target && workspace && tag) count += 1;
    }
    return count;
  }
  return {
    capture, maskedTextCount,
    controlSeen: (marker) => controlSeen.has(marker),
    summary: () => ({ ...state, payloadSha256: [...state.payloadSha256],
      privateHits: privateSeen.size, controlHits: controlSeen.size,
      privateMarkerSha256: privateMarkers.map(sha256), controlMarkerSha256: controlMarkers.map(sha256) }),
    verdict: ({ hydrated, rerendered, negativeControl = false }) => Boolean(
      hydrated && rerendered && state.payloads > 0 && state.decodeFailures === 0 &&
      state.discoverEvents > 0 && state.mutationEvents > 0 && controlSeen.size === controlMarkers.length &&
      (negativeControl ? privateSeen.size === privateMarkers.length : privateSeen.size === 0 && state.maskedTextNodes > 0)),
  };
}
