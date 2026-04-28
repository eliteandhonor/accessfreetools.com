import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarDays,
  Code2,
  Dumbbell,
  Grid3X3,
  HeartPulse,
  Image,
  Percent,
  RefreshCw,
  Search,
  Sparkles,
  Type,
  Wallet,
  Wrench,
} from 'lucide-react';
import type { ToolCategory } from '../data/categories';
import type { ToolDefinition } from '../data/tools';
import { getCalculatorIconMark, type CalculatorIconMark } from '../data/toolIcons';

type CategoryFilter = 'all' | ToolCategory['slug'];

interface Props {
  categories: ToolCategory[];
  tools: ToolDefinition[];
}

const toolIcons = {
  percent: Percent,
  type: Type,
  refresh: RefreshCw,
  calendar: CalendarDays,
  wallet: Wallet,
  code: Code2,
  image: Image,
  health: HeartPulse,
  wrench: Wrench,
} as const;

const categoryIcons = {
  calculators: Calculator,
  converters: RefreshCw,
  'text-tools': Type,
  'date-time': CalendarDays,
  finance: Wallet,
  'health-fitness': Dumbbell,
  'developer-tools': Code2,
  'image-tools': Image,
  'school-study': BookOpen,
  'everyday-tools': Wrench,
} as const;

function getToolIcon(icon: string) {
  return toolIcons[icon as keyof typeof toolIcons] ?? Wrench;
}

function CalculatorGlyph({ mark }: { mark: CalculatorIconMark }) {
  if (mark === 'dice') {
    return (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 36 36">
        <rect className="dice-body" x="7" y="7" width="22" height="22" rx="6" />
        <circle className="dice-pip" cx="13" cy="13" r="2" />
        <circle className="dice-pip" cx="23" cy="13" r="2" />
        <circle className="dice-pip" cx="18" cy="18" r="2" />
        <circle className="dice-pip" cx="13" cy="23" r="2" />
        <circle className="dice-pip" cx="23" cy="23" r="2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 36 36">
      <rect className="calculator-body" x="8" y="5" width="20" height="26" rx="4" />
      <rect className="calculator-screen" x="11" y="9" width="14" height="5" rx="1.4" />
      {mark === 'heart' ? (
        <path
          className="calculator-mark"
          d="M18 25.4l-4.4-4.1c-1.8-1.7-1.8-4.4.1-5.4 1.2-.7 2.8-.3 3.7.9.9-1.2 2.5-1.6 3.7-.9 1.9 1.1 1.9 3.8.1 5.4L18 25.4Z"
        />
      ) : mark === 'fx' ? (
        <text className="calculator-text-mark" x="18" y="25" textAnchor="middle">
          fx
        </text>
      ) : mark === 'percent' ? (
        <text className="calculator-percent-mark" x="18" y="25.5" textAnchor="middle">
          %
        </text>
      ) : mark === 'error' ? (
        <>
          <circle className="calculator-mark" cx="18" cy="21.3" r="5.4" />
          <path className="calculator-mark" d="M18 18.1v3.8" />
          <path className="calculator-mark" d="M18 25h.1" />
        </>
      ) : mark === 'power' ? (
        <text className="calculator-power-mark" x="18" y="24.4" textAnchor="middle">
          x^n
        </text>
      ) : mark === 'half-life' ? (
        <text className="calculator-half-life-mark" x="18" y="24.7" textAnchor="middle">
          t1/2
        </text>
      ) : mark === 'binary' ? (
        <text className="calculator-binary-mark" x="18" y="25" textAnchor="middle">
          01
        </text>
      ) : mark === 'hex' ? (
        <text className="calculator-hex-mark" x="18" y="25" textAnchor="middle">
          0x
        </text>
      ) : mark === 'fraction' ? (
        <>
          <path className="calculator-mark" d="M13.2 21.2h9.6" />
          <text className="calculator-fraction-mark" x="18" y="19" textAnchor="middle">
            1
          </text>
          <text className="calculator-fraction-mark" x="18" y="27.3" textAnchor="middle">
            2
          </text>
        </>
      ) : (
        <>
          <path className="calculator-mark" d="M18 16.8v8.2" />
          <path className="calculator-mark" d="M13.9 20.9h8.2" />
        </>
      )}
    </svg>
  );
}

function ToolGlyph({ tool }: { tool: ToolDefinition }) {
  const calculatorMark = getCalculatorIconMark(tool.icon);

  if (calculatorMark) {
    return (
      <span className={`tool-glyph tool-card-icon-${calculatorMark}`}>
        <CalculatorGlyph mark={calculatorMark} />
      </span>
    );
  }

  const Icon = getToolIcon(tool.icon);

  return (
    <span className="tool-glyph">
      <Icon size={24} strokeWidth={2.3} />
    </span>
  );
}

function getCategoryIcon(slug: ToolCategory['slug']) {
  return categoryIcons[slug] ?? Grid3X3;
}

function ToolsTitleGraphic() {
  return (
    <h1 className="tools-title-art">
      <span className="sr-only">All Free Tools</span>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 690 156" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="toolsTitleText" x1="28" x2="632" y1="18" y2="116">
            <stop stopColor="var(--text)" />
            <stop offset="0.52" stopColor="var(--primary-strong)" />
            <stop offset="1" stopColor="var(--primary)" />
          </linearGradient>
          <linearGradient id="toolsTitleRibbon" x1="34" x2="668" y1="108" y2="108">
            <stop stopColor="var(--accent)" stopOpacity="0.88" />
            <stop offset="0.55" stopColor="var(--primary)" stopOpacity="0.52" />
            <stop offset="1" stopColor="var(--accent-2)" stopOpacity="0.78" />
          </linearGradient>
        </defs>
        <path
          d="M18 104c91-14 174-11 248-2 105 13 184 14 300-16 44-12 89-14 108-10v42c-44-6-91-1-148 15-95 26-177 16-271 6-67-8-140-7-237 9v-44Z"
          fill="url(#toolsTitleRibbon)"
          opacity="0.72"
        />
        <path
          d="M31 111c99-12 176-8 260 4 99 14 186 12 299-13"
          fill="none"
          stroke="var(--surface-solid)"
          strokeLinecap="round"
          strokeOpacity="0.86"
          strokeWidth="7"
        />
        <text className="title-word title-word-shadow" x="18" y="89">
          All Free Tools
        </text>
        <text className="title-word" fill="url(#toolsTitleText)" x="18" y="89">
          All Free Tools
        </text>
      </svg>
    </h1>
  );
}

export default function ToolsLaunchpad({ categories, tools }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  useEffect(() => {
    const queryFromUrl = new URLSearchParams(window.location.search).get('q')?.trim() ?? '';

    if (queryFromUrl) {
      setQuery(queryFromUrl);
    }
  }, []);

  const availableCategories = categories.filter((item) =>
    tools.some((tool) => tool.category === item.slug),
  );

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          tool.name,
          tool.summary,
          tool.description,
          tool.category,
          ...tool.useCases,
          ...tool.examples.flatMap((example) => [example.label, example.expression, example.result]),
          ...tool.faq.flatMap((item) => [item.question, item.answer]),
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = category === 'all' || tool.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [category, query, tools]);

  const selectedCategory = availableCategories.find((item) => item.slug === category);

  return (
    <section className="tools-launchpad">
      <div className="tools-hero">
        <div className="tools-hero-copy">
          <p className="breadcrumb">
            <a href="/">Home</a> / Tools
          </p>
          <ToolsTitleGraphic />
          <p>
            Search simple browser tools for everyday tasks. Open a utility, browse by category,
            and get straight to the answer without signup.
          </p>
        </div>
      </div>

      <div className="tool-command-bar">
        <Search size={20} strokeWidth={2.4} />
        <label htmlFor="tool-library-search">Search tools</label>
        <input
          id="tool-library-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search calculator, half-life, hex..."
          type="search"
          value={query}
        />
        <kbd>Ctrl</kbd>
        <kbd>K</kbd>
      </div>

      <div className="launchpad-filter-row" aria-label="Tool filters">
        <button
          aria-pressed={category === 'all'}
          onClick={() => setCategory('all')}
          type="button"
        >
          <Grid3X3 size={16} strokeWidth={2.4} /> All
        </button>
        {availableCategories.slice(0, 5).map((item) => {
          const Icon = getCategoryIcon(item.slug);

          return (
            <button
              aria-pressed={category === item.slug}
              key={item.slug}
              onClick={() => setCategory(item.slug)}
              type="button"
            >
              <Icon size={16} strokeWidth={2.4} /> {item.name}
            </button>
          );
        })}
      </div>

      <div className="launchpad-grid">
        <aside className="category-rail" aria-label="Tool categories">
          <button
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
            type="button"
          >
            <Grid3X3 size={18} strokeWidth={2.4} />
            <span>All tools</span>
            <small>{tools.length}</small>
          </button>
          {availableCategories.map((item) => {
            const Icon = getCategoryIcon(item.slug);
            const count = tools.filter((tool) => tool.category === item.slug).length;

            return (
              <button
                aria-pressed={category === item.slug}
                key={item.slug}
                onClick={() => setCategory(item.slug)}
                type="button"
              >
                <Icon size={18} strokeWidth={2.4} />
                <span>{item.name}</span>
                {count > 0 && <small>{count}</small>}
              </button>
            );
          })}
        </aside>

        <div className="library-results">
          <div className="results-heading">
            <div>
              <h2>{selectedCategory?.name ?? 'Available Tools'}</h2>
              <p>
                Showing {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}.
              </p>
            </div>
          </div>

          <div className="launchpad-tool-grid">
            {filteredTools.map((tool) => {
              const href = `/tools/${tool.slug}/`;

              return (
                <a className="launchpad-tool-card" href={href} key={tool.slug}>
                  <div className="card-topline">
                    <ToolGlyph tool={tool} />
                  </div>
                  <strong>{tool.name}</strong>
                  <p>{tool.summary}</p>
                  <span className="card-link">
                    Open tool
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </span>
                </a>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <div className="empty-results">
              <Sparkles size={22} strokeWidth={2.4} />
              <h2>No matching tools</h2>
              <p>Try another search term or choose a different category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
