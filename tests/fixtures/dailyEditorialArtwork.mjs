// Isolated regression fixtures only. Solid-color images and GPT-shaped
// approval metadata simulate records; no real GPT Image generation, visual
// inspection, human approval or publishable artwork is claimed.
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { articleHash } from '../../scripts/lib/daily-editorial-checks.mjs';
import { publicContentHash } from '../../scripts/lib/daily-editorial-artwork.mjs';

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

export async function syntheticDailyArtworkPair() {
  const image = { create: { width: 1200, height: 630, channels: 3, background: '#263946' } };
  const [png, webp] = await Promise.all([
    sharp(image).png({ compressionLevel: 9 }).toBuffer(),
    sharp(image).webp({ quality: 88 }).toBuffer(),
  ]);
  return { png, webp };
}

export function syntheticDailyArtworkEvidence(approval) {
  const { evidencePath: _generationPath, evidenceSha256: _generationHash, ...generation } = approval.provenance;
  const { evidencePath: _reviewPath, evidenceSha256: _reviewHash, ...review } = approval.visualReview;
  const identity = { schemaVersion: 1, slug: approval.slug, articleSha256: approval.articleSha256,
    publicContentSha256: approval.publicContentSha256 };
  return {
    generation: { ...identity, ...generation, pngSha256: approval.assets.png.sha256, webpSha256: approval.assets.webp.sha256 },
    visualReview: { ...identity, ...review },
  };
}

export async function syntheticDailyArtworkApproval(article, { png, webp, articleSha256 } = {}) {
  const pair = png && webp ? { png, webp } : { ...await syntheticDailyArtworkPair(), ...(png ? { png } : {}), ...(webp ? { webp } : {}) };
  const pngSha256 = hash(pair.png), webpSha256 = hash(pair.webp);
  const timestamp = new Date(article.researchedAt ?? '2026-10-08T09:00:00.000Z').toISOString();
  const approval = {
    schemaVersion: 1, slug: article.slug, projectFullName: article.project.fullName,
    articleSha256: articleSha256 ?? article.artwork?.articleSha256 ?? articleHash(article),
    publicContentSha256: publicContentHash(article), status: 'approved', qaStatus: 'approved',
    imagePath: `/social/daily-${article.slug}.png`, webpPath: `/social/daily-${article.slug}.webp`, width: 1200, height: 630,
    alt: 'Synthetic solid-color illustration used only by isolated artwork regression tests.',
    caption: 'Synthetic regression fixture. No real GPT Image generation, visual inspection or human approval occurred.',
    assets: { png: { sha256: pngSha256, bytes: pair.png.length }, webp: { sha256: webpSha256, bytes: pair.webp.length } },
    provenance: { generator: 'gpt-image', generationRef: 'synthetic-test-only-no-real-gpt-image-generation', generatedAt: timestamp,
      promptSha256: hash('Synthetic offline fixture; no image generation request was sent.'), originalAssetSha256: pngSha256,
      evidencePath: `docs/daily-editorial-art-evidence/${article.slug}/generation.json`, evidenceSha256: '' },
    visualReview: { reviewer: { kind: 'ai', ref: 'synthetic-test-only-no-actual-visual-inspection' }, reviewedAt: timestamp,
      evidencePath: `docs/daily-editorial-art-evidence/${article.slug}/visual-review.json`, evidenceSha256: '', pngSha256, webpSha256,
      checks: { fullBodyUncropped: true, houseStyle: true, conceptSpecific: true, noReadableText: true,
        noLogosOrWatermarks: true, gRated: true, naturalAlt: true } },
  };
  const evidence = syntheticDailyArtworkEvidence(approval);
  approval.provenance.evidenceSha256 = hash(json(evidence.generation));
  approval.visualReview.evidenceSha256 = hash(json(evidence.visualReview));
  return approval;
}

export async function prepareSyntheticDailyArtwork(root, article, fullArticleHash) {
  const pair = await syntheticDailyArtworkPair();
  const approval = await syntheticDailyArtworkApproval(article, { ...pair, articleSha256: fullArticleHash });
  const evidence = syntheticDailyArtworkEvidence(approval);
  const files = [
    [`src/assets/daily-editorial/${article.slug}.png`, pair.png],
    [`src/assets/daily-editorial/${article.slug}.webp`, pair.webp],
    [approval.provenance.evidencePath, json(evidence.generation)],
    [approval.visualReview.evidencePath, json(evidence.visualReview)],
    ['src/data/dailyEditorialArtApprovals.json', json([approval])],
  ];
  for (const [path, bytes] of files) {
    const target = join(root, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, bytes);
  }
  return approval;
}
