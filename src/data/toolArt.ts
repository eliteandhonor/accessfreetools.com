import { categories } from './categories';
import toolArtApprovals from './toolArtApprovals.json';
import { toolArtManifest, type ToolArtKind, type ToolArtManifestEntry } from './toolArtManifest';

export type { ToolArtKind, ToolArtManifestEntry };

const approvals = toolArtApprovals as Partial<ToolArtManifestEntry>[];
const approvalMap = new Map(
  approvals.map((approval) => [`${approval.slug}:${approval.kind}`, approval] as const),
);

export const allToolArtEntries = toolArtManifest.map((entry) => ({
  ...entry,
  ...(approvalMap.get(`${entry.slug}:${entry.kind}`) ?? {}),
})) as ToolArtManifestEntry[];
export const toolArtEntries = allToolArtEntries.filter((entry) => entry.status === 'approved');

export const toolArtCategorySummaries = categories.map((category) => {
  const entries = toolArtEntries.filter((entry) => entry.category === category.slug);

  return {
    ...category,
    entries,
    toolCount: entries.filter((entry) => entry.kind === 'tool').length,
    guideCount: entries.filter((entry) => entry.kind === 'guide').length,
  };
});

export function getToolArt(slug: string, kind: ToolArtKind) {
  return toolArtEntries.find((entry) => entry.slug === slug && entry.kind === kind);
}

export function getToolArtByCategory(category: string) {
  return toolArtEntries.filter((entry) => entry.category === category);
}
