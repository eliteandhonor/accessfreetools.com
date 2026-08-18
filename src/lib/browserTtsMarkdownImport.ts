import type { Root, RootContent } from 'mdast';
import type { Node } from 'unist';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';
import { frontmatter } from 'micromark-extension-frontmatter';

import {
  BrowserTtsImportError,
  assertLocalDocumentReference,
  asBrowserTtsImportError,
  createBrowserTtsImportResult,
  decodeBrowserTtsUtf8,
  validateBrowserTtsImportFile,
  type BrowserTtsImportFileMetadata,
  type BrowserTtsImportResult,
  type ImportedTtsChapterDraft,
} from './browserTtsImport';

type NodeWithChildren = Node & { children?: Node[] };
type NodeWithUrl = Node & { url?: unknown };
type FrontmatterNode = Node & { type: 'toml' | 'yaml'; value: string };
type MarkdownRootContent = RootContent | FrontmatterNode;

function isFrontmatterNode(node: Node): node is FrontmatterNode {
  return node.type === 'yaml' || node.type === 'toml';
}

function inspectMarkdownNode(node: NodeWithChildren) {
  if (node.type === 'html') {
    throw new BrowserTtsImportError('scripted-content', 'Raw HTML is not supported in imported Markdown.');
  }

  const url = (node as NodeWithUrl).url;
  if (typeof url === 'string') assertLocalDocumentReference(url, `Markdown ${node.type}`);

  for (const child of node.children ?? []) inspectMarkdownNode(child as NodeWithChildren);
}

function parseMarkdown(value: string): Root {
  try {
    return fromMarkdown(value, {
      extensions: [frontmatter(['yaml', 'toml'])],
      mdastExtensions: [frontmatterFromMarkdown(['yaml', 'toml'])],
    });
  } catch {
    throw new BrowserTtsImportError('invalid-document', 'The Markdown file could not be parsed safely.');
  }
}

function nodePlainText(node: MarkdownRootContent) {
  if (isFrontmatterNode(node) || node.type === 'definition' || node.type === 'thematicBreak') return '';
  return toString(node, { includeHtml: false, includeImageAlt: true }).trim();
}

function chooseChapterHeadingDepth(tree: Root) {
  const headings = tree.children.filter((node): node is Extract<RootContent, { type: 'heading' }> => node.type === 'heading');
  const h1Count = headings.filter((heading) => heading.depth === 1).length;
  const h2Count = headings.filter((heading) => heading.depth === 2).length;
  if (h1Count === 1 && h2Count > 0) return 2;
  return headings.reduce((minimum, heading) => Math.min(minimum, heading.depth), 7);
}

function markdownChapters(tree: Root): ImportedTtsChapterDraft[] {
  const headingDepth = chooseChapterHeadingDepth(tree);
  const chapters: ImportedTtsChapterDraft[] = [];
  let current: ImportedTtsChapterDraft & { blocks: string[] } = { blocks: [], text: '', title: 'Introduction' };

  const flush = () => {
    const text = current.blocks.join('\n\n').trim();
    if (text) chapters.push({ text, title: current.title });
  };

  for (const node of tree.children as MarkdownRootContent[]) {
    if (isFrontmatterNode(node)) continue;

    if (node.type === 'heading' && node.depth <= headingDepth) {
      flush();
      current = {
        blocks: [],
        text: '',
        title: toString(node, { includeHtml: false, includeImageAlt: false }).trim(),
      };
      continue;
    }

    const text = nodePlainText(node);
    if (text) current.blocks.push(text);
  }
  flush();

  return chapters;
}

export function importBrowserTtsMarkdown(
  file: BrowserTtsImportFileMetadata,
  bytes: Uint8Array,
): BrowserTtsImportResult {
  try {
    validateBrowserTtsImportFile(file, bytes, 'markdown');
    const value = decodeBrowserTtsUtf8(bytes, 'The Markdown file');
    const tree = parseMarkdown(value);
    inspectMarkdownNode(tree);
    return createBrowserTtsImportResult('markdown', markdownChapters(tree));
  } catch (error) {
    throw asBrowserTtsImportError(error, 'The Markdown file could not be imported safely.');
  }
}
