import { toolAliases } from './toolAliases';
import { tools } from './tools';
import type { ToolCategory } from './categories';

export interface ToolSearchItem {
  slug: string;
  name: string;
  category: ToolCategory['slug'];
  summary: string;
  icon: string;
  searchText: string;
}

export function getToolSearchIndex(): ToolSearchItem[] {
  const canonicalSearchTools = tools.map((tool) => ({
    slug: tool.slug,
    name: tool.name,
    category: tool.category,
    summary: tool.summary,
    icon: tool.icon,
    searchText: [
      tool.name,
      tool.summary,
      tool.description,
      tool.category,
      ...(tool.aliases ?? []),
      ...toolAliases
        .filter((alias) => alias.targetSlug === tool.slug)
        .flatMap((alias) => [alias.name, alias.description, ...alias.searchTerms]),
      ...tool.useCases,
      ...tool.examples.map((example) => example.label),
    ].join(' '),
  }));

  const aliasSearchTools = toolAliases
    .map((alias) => {
      const targetTool = tools.find((tool) => tool.slug === alias.targetSlug);

      return targetTool
        ? {
            slug: alias.slug,
            name: alias.name,
            category: targetTool.category,
            summary: alias.description,
            icon: targetTool.icon,
            searchText: [
              alias.name,
              alias.description,
              alias.targetSlug,
              targetTool.name,
              targetTool.summary,
              targetTool.category,
              ...alias.searchTerms,
            ].join(' '),
          }
        : undefined;
    })
    .filter((tool): tool is ToolSearchItem => Boolean(tool));

  return [...canonicalSearchTools, ...aliasSearchTools];
}
