import { describe, expect, it } from 'vitest';
import { gzipSync } from 'node:zlib';
import { createRecorderProof, transportText, sha256 } from './clarity-recorder-proof.mjs';

describe('SEC-02 recorder evidence fails closed', () => {
  it('decodes gzip/plain JSON and keeps only counts, booleans and hashes', () => {
    const privateMarker = 'SyntheticPrivateAlphabetic';
    const controlMarker = 'SyntheticPublicAlphabetic';
    const raw = JSON.stringify({ e: ['0.8.68'], a: [], p: [] });
    expect(transportText(gzipSync(raw))).toBe(raw);
    expect(transportText(Buffer.from(raw))).toBe(raw);
    expect(() => transportText(Buffer.from([0x1f, 0x8b, 0]))).toThrow('transport');
    expect(() => transportText(Buffer.alloc(2 * 1024 * 1024 + 1))).toThrow('limit');
    expect(() => transportText(gzipSync('a'.repeat(8 * 1024 * 1024 + 1)))).toThrow();
    const proof = createRecorderProof({
      version: '0.8.68', privateMarkers: [privateMarker], controlMarkers: [controlMarker],
      decode: () => ({ envelope: { version: '0.8.68' }, dom: [
        { event: 5, data: [{ id: 1, tag: 'DIV', attributes: { id: 'workspace' } }] },
        { event: 6, data: [
          { id: 2, parent: 1, tag: 'DIV', attributes: { class: 'actual-result' } },
          { id: 3, parent: 2, tag: '*T', value: '\u2022\u2022\u2022' },
          { id: 4, parent: null, tag: '*T', value: controlMarker },
        ] },
      ] }),
    });
    proof.capture(gzipSync(raw));
    expect(proof.maskedTextCount('actual-result')).toBe(1);
    expect(proof.maskedTextCount('actual-result', 'OL')).toBe(0);
    expect(proof.controlSeen(controlMarker)).toBe(true);
    expect(proof.verdict({ hydrated: true, rerendered: true })).toBe(true);
    const summary = proof.summary();
    expect(summary.payloads).toBe(1);
    expect(summary.gzipPayloads).toBe(1);
    expect(summary.privateHits).toBe(0);
    expect(summary.controlHits).toBe(1);
    expect(summary.payloadSha256).toEqual([sha256(gzipSync(raw))]);
    expect(JSON.stringify(summary)).not.toContain(privateMarker);
    expect(JSON.stringify(summary)).not.toContain(controlMarker);
    expect(JSON.stringify(summary)).not.toContain('actual-result');
  });

  it('rejects no recorder, no controls, decode errors, wrong versions and real leakage', () => {
    const secret = 'SyntheticPrivateAlphabetic';
    const control = 'SyntheticPublicAlphabetic';
    const packet = (text = '') => Buffer.from(JSON.stringify({ e: ['0.8.68'], a: [], p: [], text }));
    const decoded = (text) => ({ envelope: { version: '0.8.68' }, dom: [
      { event: 5, data: [{ id: 1, tag: 'DIV', attributes: { id: 'workspace' } }] },
      { event: 6, data: [{ id: 2, parent: 1, tag: '*T', value: text }] },
    ] });
    const make = (decode) => createRecorderProof({ version: '0.8.68',
      privateMarkers: [secret], controlMarkers: [control], decode });
    const empty = make(() => decoded(control));
    expect(empty.verdict({ hydrated: true, rerendered: true })).toBe(false);
    const noControl = make(() => decoded('\u2022\u2022'));
    noControl.capture(packet());
    expect(noControl.verdict({ hydrated: true, rerendered: true })).toBe(false);
    const leaking = make(() => decoded(`${secret.toUpperCase()} ${control}`));
    leaking.capture(packet(secret));
    expect(leaking.verdict({ hydrated: true, rerendered: true })).toBe(false);
    expect(leaking.verdict({ hydrated: true, rerendered: true, negativeControl: true })).toBe(true);
    expect(leaking.verdict({ hydrated: false, rerendered: true, negativeControl: true })).toBe(false);
    expect(leaking.summary().privateHits).toBe(1);
    for (const decode of [() => { throw new Error(secret); },
      () => ({ envelope: { version: 'wrong' } }), () => null]) {
      const invalid = make(decode);
      invalid.capture(packet());
      expect(invalid.summary().decodeFailures).toBe(1);
      expect(invalid.verdict({ hydrated: true, rerendered: true })).toBe(false);
      expect(JSON.stringify(invalid.summary())).not.toContain(secret);
    }
    const malformed = make(() => decoded(control));
    malformed.capture(Buffer.from('not json'));
    expect(malformed.summary().decodeFailures).toBe(1);
  });
});
