import { francAll } from 'franc-min';
import { describe, expect, it } from 'vitest';

import { calculateCurrencyConversion, calculateSubnet } from '../lib/calculator';
import { aiBlogGuides } from './aiBlogGuides';
import { financeBlogGuides } from './financeBlogGuides';
import { financeTools } from './financeTools';
import { utilityBlogGuides } from './utilityBlogGuides';

const subnetGuide = utilityBlogGuides.find((guide) => guide.toolSlug === 'subnet-calculator')!;
const languageGuide = aiBlogGuides.find((guide) => guide.toolSlug === 'language-detector')!;
const guideText = (guide: typeof subnetGuide | typeof languageGuide) => JSON.stringify(guide);

describe('subnet page and guide corrections', () => {
  it('checks the guide worked example against the calculator', () => {
    const result = calculateSubnet('10.0.5.17', 28);
    const text = guideText(subnetGuide);
    expect(text).toContain('10.0.5.17');
    expect(text).toContain('28');
    for (const value of [result.networkAddress, result.subnetMask, result.wildcardMask,
      result.broadcastAddress, result.firstUsableAddress, result.lastUsableAddress]) {
      expect(text).toContain(value);
    }
    expect(result.usableAddresses).toBe(14);
    expect(text).toContain('14 usable addresses');
  });

  it('explains the /31 and /32 host-count exceptions without claiming live validation', () => {
    expect(calculateSubnet('172.16.0.8', 31).usableAddresses).toBe(2);
    expect(calculateSubnet('172.16.0.8', 32).usableAddresses).toBe(1);
    expect(guideText(subnetGuide)).toMatch(/\/31[\s\S]*two/);
    expect(guideText(subnetGuide)).toMatch(/\/32[\s\S]*one/);
    expect(guideText(subnetGuide)).toMatch(/reserved|provider/);
    expect(subnetGuide.faqItems?.length).toBeGreaterThanOrEqual(6);
  });
});

describe('language detector page and guide corrections', () => {
  it('uses an example whose displayed language code matches the installed detector', () => {
    const sample = 'Esta herramienta funciona en el navegador.';
    const guesses = francAll(sample, { minLength: 20 }).slice(0, 3);
    expect(guesses[0][0]).toBe('spa');
    expect(guesses).toHaveLength(3);
    expect(guideText(languageGuide)).toContain(sample);
    expect(guideText(languageGuide)).toContain('spa');
    expect(guideText(languageGuide)).toContain('Spanish');
  });

  it('explains the real limits instead of promising image or server-model behavior', () => {
    const text = guideText(languageGuide);
    expect(text).toContain('20');
    expect(text).toMatch(/not[\s\S]*confidence percentage/);
    expect(text).toContain('franc-min');
    expect(text).toMatch(/supported languages/);
    expect(text).toMatch(/mixed-language|romanized/);
    expect(text).not.toMatch(/OCR files|starter text classifier|heavier experimental model|receive the image/);
  });
});

describe('currency guide and fee clarification', () => {
  it('keeps the existing guide example consistent with target-currency output', () => {
    const guide = financeBlogGuides.find((candidate) => candidate.toolSlug === 'currency-calculator')!;
    const result = calculateCurrencyConversion(500, 0.92, 2.5);
    expect(result.grossConverted).toBe(460);
    expect(result.feeAmount).toBe(11.5);
    expect(result.convertedAmount).toBe(448.5);
    expect(JSON.stringify(guide)).toMatch(/500[\s\S]*0\.92[\s\S]*460/);
    expect(JSON.stringify(guide)).toContain('448.5');
  });

  it('distinguishes fixed fees taken in source currency, target currency, or charged separately', () => {
    const tool = financeTools.find((candidate) => candidate.slug === 'currency-calculator')!;
    const answer = tool.faq.find((item) => item.question === 'Where should I enter a fixed transfer fee?')!.answer;
    expect(answer).toContain('target currency');
    expect(answer).toContain('source amount before conversion');
    expect(answer).toContain('charged separately');
    expect(answer).toContain('provider');
  });
});
