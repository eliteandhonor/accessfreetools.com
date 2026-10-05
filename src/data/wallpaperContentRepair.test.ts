import { describe, expect, it } from 'vitest';

import { calculateWallpaperEstimate } from '../lib/calculator';
import { utilityBlogGuides } from './utilityBlogGuides';
import { utilityTools } from './utilityTools';

const tool = utilityTools.find((candidate) => candidate.slug === 'wallpaper-calculator')!;
const guide = utilityBlogGuides.find((candidate) => candidate.toolSlug === tool.slug)!;
const sectionText = (title: string) => guide.sections.find((section) => section.title === title)?.paragraphs.join(' ') ?? '';
const faqAnswer = (question: string) => tool.faq.find((item) => item.question === question)?.answer ?? '';
const roomInput = {
  roomLengthFeet: 12,
  roomWidthFeet: 10,
  wallHeightFeet: 8,
  doors: 1,
  windows: 2,
  rollCoverageSquareFeet: 56,
  wastePercent: 10,
  pricePerRoll: 42,
};

describe('wallpaper content matches the supported room estimate', () => {
  it('describes the room scope without advertising repeat or one-wall controls', () => {
    expect(tool.description).toContain('rectangular room');
    expect(tool.seoDescription).toContain('rectangular room');
    expect(`${tool.seoTitle} ${tool.seoDescription}`).not.toMatch(/pattern repeat|one-wall/i);
    expect(faqAnswer('What should I double-check before trusting the answer?')).toContain('no single-wall or known-area input');
    expect(faqAnswer('Why can pattern repeat change the roll count?')).toContain('no pattern-repeat input');
    expect(sectionText('Why pattern repeat matters')).toContain('does not determine cuts per roll or exact strip yield');
  });

  it('explains the actual fixed opening deductions and how to keep openings', () => {
    const withOpenings = calculateWallpaperEstimate(roomInput);
    const withoutDeductions = calculateWallpaperEstimate({ ...roomInput, doors: 0, windows: 0 });
    expect(withoutDeductions.wallpaperSquareFeet - withOpenings.wallpaperSquareFeet).toBe(50);
    expect(faqAnswer('What is the Wallpaper Calculator doing with my inputs?')).toContain('20 square feet per door and 15 per window');
    const answer = faqAnswer('Should I subtract doors and windows?');
    expect(answer).toContain('cannot use the actual opening sizes');
    expect(answer).toContain('enter 0');
    expect(guide.quickStart.join(' ')).toContain('Each door subtracts 20 square feet and each window 15');
  });

  it('identifies the prefilled sample and keeps its guide values consistent with the calculator', () => {
    const result = calculateWallpaperEstimate(roomInput);
    expect(result.adjustedSquareFeet).toBeCloseTo(332.2);
    expect(result.rollsNeeded).toBe(6);
    expect(result.estimatedCost).toBe(252);
    const text = sectionText('The prefilled bedroom example');
    expect(text).toContain(`${result.wallSquareFeet} square feet`);
    expect(text).toContain(`${result.wallpaperSquareFeet}`);
    expect(text).toContain(`${result.adjustedSquareFeet.toFixed(1)} square feet`);
    expect(text).toContain(`rounds up to ${result.rollsNeeded}`);
    expect(text).toContain(`$${result.estimatedCost}`);
    expect(text).toContain('Replace the sample values and press Estimate wallpaper');
    expect(faqAnswer('Why is an answer shown before I enter my room?')).toContain('not a measurement of your room');
    expect(tool.examples.find((example) => example.label === 'Bedroom sample')?.expression).toContain('10% waste');
  });

  it('keeps the 12-by-12 guide and FAQ example consistent with whole-roll rounding', () => {
    const result = calculateWallpaperEstimate({ ...roomInput, roomWidthFeet: 12 });
    expect(result.adjustedSquareFeet).toBeCloseTo(367.4);
    expect(result.rollsNeeded).toBe(7);
    expect(result.estimatedCost).toBe(294);
    for (const text of [sectionText('Example: how much wallpaper for a 12x12 room'), faqAnswer('How much wallpaper do I need for a 12 x 12 room?')]) {
      expect(text).toContain(`${result.wallSquareFeet} square feet`);
      expect(text).toContain(`${result.wallpaperSquareFeet}`);
      expect(text).toContain(`${result.adjustedSquareFeet.toFixed(1)} square feet`);
      expect(text).toContain(`${result.rollsNeeded} rolls`);
      expect(text).toContain(`$${result.estimatedCost}`);
    }
  });

  it('marks the accent-wall arithmetic as manual instead of promising an input mode', () => {
    const adjustedArea = 96 * 1.15;
    const rolls = Math.ceil(adjustedArea / 56);
    expect(rolls).toBe(2);
    const text = sectionText('Manual example for one accent wall');
    expect(text).toContain('no single-wall mode');
    expect(text).toContain('manual calculation');
    expect(text).toContain(`${adjustedArea.toFixed(1)} square feet`);
    expect(text).toContain(`${rolls} rolls`);
    expect(text).toContain(`$${rolls * 42}`);
    expect(tool.examples.find((example) => example.label === 'Manual accent-wall example')?.expression).toContain('not a room-mode input');
    const section = guide.sections.find((candidate) => candidate.title === 'Manual example for one accent wall');
    expect(section?.links?.some((link) => link.href === '/tools/square-footage-calculator/')).toBe(true);
  });

  it('keeps coverage and price on the same purchase unit and avoids duplicate losses', () => {
    const text = sectionText('What roll coverage means');
    expect(text).toContain('coverage and price for the same purchased unit');
    expect(text).toContain('Do not also add waste for losses already included');
    expect(faqAnswer('What does roll coverage mean?')).toContain('same loss in both usable coverage and waste percent');
    expect(calculateWallpaperEstimate({ ...roomInput, pricePerRoll: null }).estimatedCost).toBeNull();
    expect(sectionText('How the rough cost works')).toContain('If you leave it blank');
  });
});
