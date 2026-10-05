import { describe, expect, it } from 'vitest';

import { healthBlogGuides } from './healthBlogGuides';
import { getTool } from './tools';

describe('tool-specific FAQ selection', () => {
  it('explains the Currency output rather than inheriting loan-result help', () => {
    const tool = getTool('currency-calculator')!;
    const readingFaq = tool.faq.filter((item) => item.question === 'How should I read the Currency Calculator answer?');

    expect(readingFaq).toHaveLength(1);
    const answer = readingFaq[0].answer;
    for (const label of ['Converted amount', 'Before fee', 'Fee amount', 'Rate used']) {
      expect(answer).toContain(label);
    }
    expect(answer).toMatch(/target.currency/i);
    expect(answer).toMatch(/after the percentage.*fee/i);
    expect(answer).toMatch(/manual exchange rate/i);
    expect(answer).not.toMatch(/principal|payment timing|interest|totals paid over time/i);
  });

  it('uses OCR image and language instructions instead of the AI category fallback', () => {
    const tool = getTool('image-to-text-ocr-tool')!;
    const inputFaq = tool.faq.filter((item) => item.question === 'What do the main Image to Text OCR Tool inputs mean?');

    expect(inputFaq).toHaveLength(1);
    const answer = inputFaq[0].answer;
    for (const value of ['Image file', 'PNG', 'JPEG', 'WebP', 'OCR language', 'Read text']) {
      expect(answer).toContain(value);
    }
    for (const language of ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese']) {
      expect(answer).toContain(language);
    }
    expect(answer).not.toMatch(/text or image|paste(?:d)? text|text input/i);
  });
});

describe('BMI metric-only instructions', () => {
  const tool = getTool('bmi-calculator')!;
  const guide = healthBlogGuides.find((candidate) => candidate.toolSlug === tool.slug)!;
  const inputFaq = tool.faq.find((item) => item.question === 'What do the main BMI Calculator inputs mean?')!;
  const inputSection = guide.sections.find((section) => section.title === 'What to enter')!;

  it('requires centimeters and kilograms in the FAQ, quick start, and input section', () => {
    for (const text of [inputFaq.answer, guide.quickStart.join(' '), inputSection.bullets!.join(' ')]) {
      expect(text).toMatch(/centimeters\s*\(cm\)/i);
      expect(text).toMatch(/kilograms\s*\(kg\)/i);
      expect(text).not.toMatch(/same unit system you normally use|your own unit system|unless the tool mode expects/i);
    }
  });

  it('explains imperial conversion before entry without claiming an imperial input mode', () => {
    for (const text of [inputFaq.answer, inputSection.bullets!.join(' ')]) {
      expect(text).toMatch(/(?:multiply feet by|feet\s*[x×])\s*12\b/i);
      expect(text).toMatch(/(?:add (?:the )?(?:remaining )?inches|\+\s*(?:remaining )?inches)/i);
      expect(text).toMatch(/total\s*(?:by|[x×])\s*2\.54\b/i);
      expect(text).toMatch(/pounds\s*(?:[x×]|by)\s*0\.45359237/i);
    }
    const mistakes = guide.sections.find((section) => section.title === 'Common mistakes to avoid')!;
    const warnings = mistakes.bullets!.join(' ');
    expect(warnings).toMatch(/do not enter.*pounds/i);
    expect(warnings).toMatch(/feet.*inches/i);
    expect(warnings).not.toMatch(/unless the tool mode expects/i);
  });

  it('retains adult screening limits and the CDC and NHLBI references', () => {
    const text = JSON.stringify({ faq: tool.faq, guide });
    expect(text).toMatch(/adult.*screen/i);
    expect(text).toMatch(/children.*teens/i);
    expect(text).toMatch(/muscle|body composition/i);
    expect(text).toMatch(/pregnancy/i);
    const links = guide.sections.flatMap((section) => section.links ?? []).map((link) => link.href);
    expect(links).toContain('https://www.cdc.gov/BMI/');
    expect(links).toContain('https://www.nhlbi.nih.gov/health/educational/lose_wt/bmitools');
  });
});
