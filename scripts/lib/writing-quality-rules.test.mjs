import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';

import {
  analyzeWritingText,
  buildWritingQualityReport,
  renderWritingQualityMarkdown,
} from './writing-quality-rules.mjs';

function findingIds(result) {
  return result.findings.map((finding) => finding.id);
}

describe('writing quality rules', () => {
  it('passes clear, specific prose', () => {
    const result = analyzeWritingText(
      'Enter the room width in metres. The calculator multiplies it by the room length. Check the result before you buy material.',
      { mode: 'editorial' },
    );

    expect(result.status).toBe('pass');
    expect(result.metrics.hardErrors).toBe(0);
    expect(result.metrics.warnings).toBe(0);
  });

  it('preserves contractions in editorial mode', () => {
    const result = analyzeWritingText(
      "You don't need an account. The tool keeps your text in the browser.",
      { mode: 'editorial' },
    );

    expect(findingIds(result)).not.toContain('clarity.technical-contraction');
    expect(result.metrics.hardErrors).toBe(0);
  });

  it('warns about long editorial sentences without failing', () => {
    const sentence = `${Array.from({ length: 36 }, (_, index) => `word${index + 1}`).join(' ')}.`;
    const result = analyzeWritingText(sentence, { mode: 'editorial' });

    expect(findingIds(result)).toContain('clarity.long-sentence');
    expect(result.status).toBe('pass-with-warnings');
    expect(result.metrics.hardErrors).toBe(0);
  });

  it('warns about passive wording', () => {
    const result = analyzeWritingText(
      'The report was carefully reviewed by the editor.',
      { mode: 'editorial' },
    );

    expect(findingIds(result)).toContain('clarity.passive-wording');
    expect(result.metrics.hardErrors).toBe(0);
  });

  it('warns about semicolons', () => {
    const result = analyzeWritingText(
      'Check the total; compare it with the invoice.',
      { mode: 'editorial' },
    );

    expect(findingIds(result)).toContain('clarity.semicolon');
    expect(result.metrics.hardErrors).toBe(0);
  });

  it('warns about nominalizations and unclear long paragraphs', () => {
    const paragraph = [
      'The implementation needs a clear owner.',
      Array.from({ length: 121 }, () => 'detail').join(' '),
    ].join(' ');
    const result = analyzeWritingText(paragraph, { mode: 'editorial' });

    expect(findingIds(result)).toContain('clarity.nominalization');
    expect(findingIds(result)).toContain('clarity.long-paragraph');
    expect(result.metrics.hardErrors).toBe(0);
  });

  it('treats em dashes as hard errors', () => {
    const result = analyzeWritingText(
      'Check the estimate — then compare the supplier quote.',
      { mode: 'editorial' },
    );

    expect(findingIds(result)).toContain('stop-slop.em-dash');
    expect(result.status).toBe('fail');
    expect(result.metrics.hardErrors).toBe(1);
  });

  it('treats agent-facing public text as a hard error', () => {
    const result = analyzeWritingText(
      'This article should tell the reader which calculator to open.',
      { mode: 'editorial' },
    );

    expect(findingIds(result)).toContain('reader-first.agent-facing-text');
    expect(result.status).toBe('fail');
  });

  it('treats hype and false certainty as hard errors', () => {
    const result = analyzeWritingText(
      'This game-changing tool gives 100% accurate results.',
      { mode: 'editorial' },
    );

    expect(findingIds(result)).toContain('brand.hype');
    expect(findingIds(result)).toContain('factual.false-certainty');
    expect(result.metrics.hardErrors).toBe(2);
  });

  it('applies stricter sentence and contraction diagnostics in technical mode', () => {
    const sentence = `${Array.from({ length: 24 }, (_, index) => `step${index + 1}`).join(' ')}.`;
    const editorial = analyzeWritingText(
      `You don't need to restart. ${sentence}`,
      { mode: 'editorial' },
    );
    const technical = analyzeWritingText(
      `You don't need to restart. ${sentence}`,
      { mode: 'technical' },
    );

    expect(findingIds(editorial)).not.toContain('clarity.long-sentence');
    expect(findingIds(editorial)).not.toContain('clarity.technical-contraction');
    expect(findingIds(technical)).toContain('clarity.long-sentence');
    expect(findingIds(technical)).toContain('clarity.technical-contraction');
    expect(technical.metrics.hardErrors).toBe(0);
  });

  it('renders a report with source attribution and warning-only pass status', () => {
    const report = buildWritingQualityReport({
      generatedAt: '2026-07-29T00:00:00.000Z',
      mode: 'editorial',
      rootDir: process.cwd(),
      targetPath: fileURLToPath(
        new URL('./writing-quality-rules.test.mjs', import.meta.url),
      ),
    });
    const markdown = renderWritingQualityMarkdown(report);

    expect(report.upstreamReference.commit).toBe(
      'b912d5fa59f368253683af2ebfac64ad6d08312d',
    );
    expect(markdown).toContain('Conceptual reference:');
    expect(markdown).toContain('not an official or certified ASD-STE100 checker');
  });
});
