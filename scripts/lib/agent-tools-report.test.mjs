import { describe, expect, it } from 'vitest';
import {
  askAuditCases,
  buildApiReadyReport,
  buildContentQualityReport,
  extractToolRecords,
} from './agent-tools-report.mjs';

describe('agent tools reports', () => {
  it('keeps Ask audit fixtures focused on deterministic tool-runner parity', () => {
    expect(askAuditCases.map((testCase) => testCase.slug)).toEqual([
      'percentage-calculator',
      'download-time-calculator',
      'watts-to-amps-calculator',
      'concrete-calculator',
    ]);
    expect(askAuditCases.find((testCase) => testCase.slug === 'percentage-calculator')?.expected).toContain('43.2');
    expect(askAuditCases.find((testCase) => testCase.slug === 'download-time-calculator')?.expected).toContain('9m 16s');
  });

  it('extracts source tool records for registry expansion scoring', () => {
    const tools = extractToolRecords();
    const percentage = tools.find((tool) => tool.slug === 'percentage-calculator');

    expect(tools.length).toBeGreaterThan(250);
    expect(percentage?.exampleCount).toBeGreaterThanOrEqual(3);
    expect(percentage?.faqCount).toBeGreaterThanOrEqual(6);
  });

  it('ranks API candidates without removing existing API-ready tools', () => {
    const report = buildApiReadyReport();

    expect(report.currentApiTools).toContain('percentage-calculator');
    expect(report.currentApiTools).toContain('download-time-calculator');
    expect(report.recommendedNext.length).toBeGreaterThan(0);
    expect(report.recommendedNext.every((tool) => tool.slug !== 'percentage-calculator')).toBe(true);
  });

  it('flags generic, agent-facing, and link-poor content', () => {
    const report = buildContentQualityReport(
      [
        '# Ultimate guide',
        '',
        'This Medium post should seamlessly unlock the power of calculators for everyone.',
        '',
        'Use a calculator for better results.',
      ].join('\n'),
      { file: 'output/promotion/medium/bad-draft.md' },
    );

    expect(report.status).toBe('fail');
    expect(report.issues.join(' ')).toMatch(/Generic filler/i);
    expect(report.issues.join(' ')).toMatch(/Agent-facing text/i);
    expect(report.issues.join(' ')).toMatch(/Missing useful internal links/i);
    expect(report.issues.join(' ')).toMatch(/No concrete example/i);
  });

  it('passes useful disclosed promotion copy with concrete examples and internal links', () => {
    const report = buildContentQualityReport(
      [
        '# How to check a discount before you buy',
        '',
        'A discount can look good until the final price is still higher than your budget. Here is a quick way to check the number before you buy.',
        '',
        '## Example',
        '',
        'If a $240 item is 18% off, the discount is $43.20 and the new price is $196.80.',
        '',
        'Use the calculator here: https://accessfreetools.com/tools/percentage-calculator/',
        '',
        'The full guide is here: https://accessfreetools.com/blog/how-to-use-percentage-calculator/',
        '',
        'Disclosure: I work on Access Free Tools.',
      ].join('\n'),
      { file: 'output/promotion/medium/good-draft.md' },
    );

    expect(report.issues).toEqual([]);
    expect(report.accessLinks).toHaveLength(2);
  });
});

