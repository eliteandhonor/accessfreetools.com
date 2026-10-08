/** The public Actions artifact contains only intentional operational metadata. */
export function publicOutcome(result) {
  const status = ['held', 'started', 'checked', 'skipped', 'published'].includes(result?.status) ? result.status : 'held';
  const reason = result?.reason === undefined ? null : (/^[A-Z][A-Z0-9_]{0,99}$/.test(result.reason) ? result.reason : 'PIPELINE_HELD');
  let publication = null;
  const input = result?.publication;
  if (input && /^[a-f0-9]{40}$/.test(input.commit ?? '') && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug ?? '')) {
    publication = { slug: input.slug, commit: input.commit, liveVerified: input.liveVerified === true,
      url: `https://accessfreetools.com/blog/${input.slug}/` };
    for (const key of ['base', 'imageSha256']) if (/^[a-f0-9]{40,64}$/.test(input[key] ?? '')) publication[key] = input[key];
    if (typeof input.publishedAt === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(input.publishedAt)) publication.publishedAt = input.publishedAt;
    const verification = input.liveVerification;
    if (verification) publication.liveVerification = { verified: verification.verified === true,
      issues: Array.isArray(verification.issues) ? verification.issues.filter((code) => typeof code === 'string' && /^[A-Z][A-Z0-9_]{0,99}$/.test(code)).slice(0, 100) : [],
      checks: Object.fromEntries(Object.entries(verification.checks ?? {}).filter(([key, value]) => /^[A-Za-z][A-Za-z0-9_]{0,99}$/.test(key) && typeof value === 'boolean')) };
  }
  const providers = {};
  for (const provider of ['jina', 'ollama', 'typesafe']) {
    const value = result?.budget?.providers?.[provider];
    if (value && Number.isFinite(value.units) && value.units >= 0 && Number.isSafeInteger(value.calls) && value.calls >= 0) providers[provider] = { units: value.units, calls: value.calls };
  }
  const billingFailure = Object.values(result?.calls ?? {}).some((call) => call.receipt?.status === 402);
  return { status: status === 'published' ? (publication?.liveVerified ? 'live-verified' : 'committed-pending-live-verification') : status,
    reason, publication, budget: { providers },
    fundingNotice: billingFailure ? 'A provider reported a billing failure. Notify the owner to check funding; no purchase was attempted.' : null };
}
