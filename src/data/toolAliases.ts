export interface ToolAlias {
  slug: string;
  name: string;
  targetSlug: string;
  description: string;
  searchTerms: string[];
}

export const toolAliases: ToolAlias[] = [
  {
    slug: 'mortgage-amortization-calculator',
    name: 'Mortgage Amortization Calculator',
    targetSlug: 'amortization-calculator',
    description:
      'Mortgage amortization is handled by the Amortization Calculator, which estimates scheduled payments, payoff time, total interest, and extra-payment savings.',
    searchTerms: ['mortgage amortization', 'mortgage amortization schedule', 'loan amortization schedule'],
  },
  {
    slug: 'common-factor-calculator',
    name: 'Common Factor Calculator',
    targetSlug: 'greatest-common-factor-calculator',
    description:
      'Common factor searches are handled by the Greatest Common Factor Calculator, which finds the largest shared factor for two or more whole numbers.',
    searchTerms: ['common factor', 'common factors', 'highest common factor', 'HCF calculator'],
  },
  {
    slug: 'ip-subnet-calculator',
    name: 'IP Subnet Calculator',
    targetSlug: 'subnet-calculator',
    description:
      'IP subnet searches are handled by the Subnet Calculator, which converts IPv4 CIDR notation into network, broadcast, mask, wildcard, and usable host range.',
    searchTerms: ['ip subnet', 'ipv4 subnet', 'CIDR subnet', 'network mask calculator'],
  },
  {
    slug: 'time-duration-calculator',
    name: 'Time Duration Calculator',
    targetSlug: 'hours-calculator',
    description:
      'Time duration searches are handled by the Hours Calculator, which finds elapsed time, decimal hours, overnight shifts, breaks, and optional gross pay.',
    searchTerms: ['time duration', 'duration calculator', 'elapsed time', 'time difference calculator'],
  },
];

export function getToolAlias(slug: string) {
  return toolAliases.find((alias) => alias.slug === slug);
}
