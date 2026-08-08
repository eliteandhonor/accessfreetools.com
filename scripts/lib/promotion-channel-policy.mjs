const definitions = [
  {
    id: 'site-blog',
    label: 'Access Free Tools blog',
    status: 'active',
    aliases: ['access free tools blog', 'site blog', 'editorial', 'website blog'],
    reviewScripts: ['build', 'check:editorial-quality'],
  },
  {
    id: 'medium',
    label: 'Medium',
    status: 'active',
    aliases: ['medium', 'medium.com'],
    reviewScripts: ['promotion:medium:quality'],
  },
  {
    id: 'bluesky',
    label: 'Bluesky',
    status: 'active',
    aliases: ['bluesky', 'blue sky'],
    reviewScripts: ['promotion:bluesky:quality'],
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    status: 'active',
    aliases: ['pinterest'],
    reviewScripts: [
      'promotion:pinterest-assets',
      'promotion:pinterest:coverage',
      'promotion:pinterest:rss-report',
      'promotion:pinterest:proof-scan',
    ],
  },
  {
    id: 'quora',
    label: 'Quora',
    status: 'retired-by-owner',
    aliases: ['quora', 'quora space'],
    reviewScripts: [],
  },
  {
    id: 'reddit',
    label: 'Reddit',
    status: 'blocked',
    aliases: ['reddit'],
    reviewScripts: [],
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    status: 'not-in-use',
    aliases: ['linkedin', 'linkedin company page', 'linkedin articles'],
    reviewScripts: [],
  },
  {
    id: 'flipboard',
    label: 'Flipboard',
    status: 'unverified-inactive',
    aliases: ['flipboard'],
    reviewScripts: [],
  },
  {
    id: 'devto',
    label: 'DEV Community',
    status: 'inactive',
    aliases: ['dev community', 'dev.to', 'devto'],
    reviewScripts: [],
  },
];

export const promotionChannels = Object.freeze(
  definitions.map((channel) => Object.freeze({ ...channel, aliases: Object.freeze([...channel.aliases]), reviewScripts: Object.freeze([...channel.reviewScripts]) })),
);

export const activePromotionChannels = Object.freeze(
  promotionChannels.filter((channel) => channel.status === 'active'),
);

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, ' ')
    .trim();
}

export function promotionChannelFor(value) {
  const normalized = normalize(value);
  if (!normalized) return null;

  return (
    promotionChannels.find((channel) => {
      if (normalized === normalize(channel.id) || normalized === normalize(channel.label)) return true;
      return channel.aliases.some((alias) => normalized.includes(normalize(alias)));
    }) ?? null
  );
}

export function isActivePromotionChannel(value) {
  return promotionChannelFor(value)?.status === 'active';
}

export function filterActivePromotionRows(rows) {
  return rows.filter((row) => isActivePromotionChannel(row.channel));
}

export function activePromotionReviewSteps() {
  return activePromotionChannels.flatMap((channel) =>
    channel.reviewScripts.map((script) => ({
      channelId: channel.id,
      channel: channel.label,
      script,
    })),
  );
}
