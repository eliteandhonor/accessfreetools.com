import { describe, expect, it } from 'vitest';

import { parseWritingQualityArguments } from './writing-quality.mjs';

describe('writing quality CLI arguments', () => {
  it('accepts the documented separate mode flag', () => {
    expect(
      parseWritingQualityArguments(['--mode', 'technical', 'docs/procedure.md']),
    ).toEqual({
      help: false,
      mode: 'technical',
      target: 'docs/procedure.md',
    });
  });

  it('accepts the inline mode flag', () => {
    expect(
      parseWritingQualityArguments([
        '--mode=editorial',
        'src/pages/blog/article.astro',
      ]),
    ).toEqual({
      help: false,
      mode: 'editorial',
      target: 'src/pages/blog/article.astro',
    });
  });

  it('accepts the Windows npm forwarding shape when the mode flag is stripped', () => {
    expect(
      parseWritingQualityArguments([
        'technical',
        'docs/deployment-checklist.md',
      ]),
    ).toEqual({
      help: false,
      mode: 'technical',
      target: 'docs/deployment-checklist.md',
    });
  });
});
