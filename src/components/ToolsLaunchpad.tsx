import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarDays,
  Code2,
  Dumbbell,
  Grid3X3,
  Hammer,
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
import { getCalculatorIconMark, getCalculatorIconTextLabel, type CalculatorIconMark } from '../data/toolIcons';
import type { ToolSearchItem } from '../data/toolSearchIndex';

type CategoryFilter = 'all' | ToolCategory['slug'];

const INITIAL_VISIBLE_TOOL_LIMIT = 72;

interface Props {
  categoryCounts: Partial<Record<ToolCategory['slug'], number>>;
  categories: ToolCategory[];
  searchIndexUrl: string;
  tools: ToolSearchItem[];
  totalToolCount: number;
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
  game: Grid3X3,
} as const;

const categoryIcons = {
  calculators: Calculator,
  converters: RefreshCw,
  'text-tools': Type,
  'date-time': CalendarDays,
  finance: Wallet,
  'health-fitness': Dumbbell,
  'home-projects': Hammer,
  'developer-tools': Code2,
  'image-tools': Image,
  'ai-tools': Sparkles,
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
      ) : mark === 'log' ? (
        <text className="calculator-log-mark" x="18" y="24.8" textAnchor="middle">
          log
        </text>
      ) : mark === 'root' ? (
        <text className="calculator-root-mark" x="18" y="24.8" textAnchor="middle">
          rt
        </text>
      ) : mark === 'ratio' ? (
        <text className="calculator-ratio-mark" x="18" y="24.7" textAnchor="middle">
          a:b
        </text>
      ) : mark === 'quadratic' ? (
        <text className="calculator-quadratic-mark" x="18" y="24.5" textAnchor="middle">
          x^2
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
      ) : mark === 'lcm' ? (
        <text className="calculator-lcm-mark" x="18" y="24.8" textAnchor="middle">
          lcm
        </text>
      ) : mark === 'gcf' ? (
        <text className="calculator-gcf-mark" x="18" y="24.8" textAnchor="middle">
          gcf
        </text>
      ) : mark === 'factor' ? (
        <text className="calculator-factor-mark" x="18" y="24.8" textAnchor="middle">
          fac
        </text>
      ) : mark === 'round' ? (
        <text className="calculator-round-mark" x="18" y="24.8" textAnchor="middle">
          rnd
        </text>
      ) : mark === 'matrix' ? (
        <text className="calculator-matrix-mark" x="18" y="24.8" textAnchor="middle">
          mat
        </text>
      ) : mark === 'sci-notation' ? (
        <text className="calculator-sci-notation-mark" x="18" y="24.8" textAnchor="middle">
          sci
        </text>
      ) : mark === 'big-number' ? (
        <text className="calculator-big-number-mark" x="18" y="24.8" textAnchor="middle">
          big
        </text>
      ) : mark === 'stddev' ? (
        <text className="calculator-stddev-mark" x="18" y="24.8" textAnchor="middle">
          sd
        </text>
      ) : mark === 'sequence' ? (
        <text className="calculator-sequence-mark" x="18" y="24.8" textAnchor="middle">
          seq
        </text>
      ) : mark === 'sample-size' ? (
        <text className="calculator-sample-size-mark" x="18" y="24.8" textAnchor="middle">
          n
        </text>
      ) : mark === 'probability' ? (
        <text className="calculator-probability-mark" x="18" y="24.8" textAnchor="middle">
          p
        </text>
      ) : mark === 'stats' ? (
        <text className="calculator-stats-mark" x="18" y="24.8" textAnchor="middle">
          stat
        </text>
      ) : mark === 'mean' ? (
        <text className="calculator-mean-mark" x="18" y="24.8" textAnchor="middle">
          xbar
        </text>
      ) : mark === 'permutation' ? (
        <text className="calculator-permutation-mark" x="18" y="24.8" textAnchor="middle">
          ncr
        </text>
      ) : mark === 'z-score' ? (
        <text className="calculator-z-score-mark" x="18" y="24.8" textAnchor="middle">
          z
        </text>
      ) : mark === 'confidence' ? (
        <text className="calculator-confidence-mark" x="18" y="24.8" textAnchor="middle">
          ci
        </text>
      ) : mark === 'triangle' ? (
        <>
          <path className="calculator-mark" d="M18 16l-6 10h12L18 16Z" />
          <path className="calculator-mark" d="M14.7 26h3.1" />
        </>
      ) : mark === 'volume' ? (
        <text className="calculator-volume-mark" x="18" y="24.8" textAnchor="middle">
          vol
        </text>
      ) : mark === 'slope' ? (
        <>
          <path className="calculator-mark" d="M12 25h12" />
          <path className="calculator-mark" d="M13 24l10-8" />
          <text className="calculator-slope-mark" x="18" y="28.4" textAnchor="middle">
            m
          </text>
        </>
      ) : mark === 'area' ? (
        <text className="calculator-area-mark" x="18" y="24.8" textAnchor="middle">
          area
        </text>
      ) : mark === 'distance' ? (
        <>
          <path className="calculator-mark" d="M12 25l12-8" />
          <circle className="calculator-dot-mark" cx="12" cy="25" r="1.8" />
          <circle className="calculator-dot-mark" cx="24" cy="17" r="1.8" />
        </>
      ) : mark === 'circle' ? (
        <>
          <circle className="calculator-mark" cx="18" cy="21.5" r="6" />
          <path className="calculator-mark" d="M18 21.5h6" />
        </>
      ) : mark === 'surface-area' ? (
        <text className="calculator-surface-area-mark" x="18" y="24.8" textAnchor="middle">
          sa
        </text>
      ) : mark === 'pythagorean' ? (
        <text className="calculator-pythagorean-mark" x="18" y="24.8" textAnchor="middle">
          a2
        </text>
      ) : mark === 'right-triangle' ? (
        <>
          <path className="calculator-mark" d="M12 26h13L12 15v11Z" />
          <path className="calculator-mark" d="M12 22h4v4" />
        </>
      ) : getCalculatorIconTextLabel(mark) ? (
        <text className="calculator-dynamic-mark" x="18" y="24.8" textAnchor="middle">
          {getCalculatorIconTextLabel(mark)}
        </text>
      ) : (
        <>
          <path className="calculator-mark" d="M18 16.8v8.2" />
          <path className="calculator-mark" d="M13.9 20.9h8.2" />
        </>
      )}
    </svg>
  );
}

function ToolGlyph({ tool }: { tool: ToolSearchItem }) {
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

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName);
}

function ToolsTitleGraphic() {
  return (
    <h1 className="tools-title-art">
      <span className="tools-title-text">All Free Tools</span>
      <svg
        aria-hidden="true"
        className="tools-title-ribbon"
        focusable="false"
        viewBox="0 0 690 156"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
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
      </svg>
    </h1>
  );
}

export default function ToolsLaunchpad({
  categories,
  categoryCounts,
  searchIndexUrl,
  tools,
  totalToolCount,
}: Props) {
  const [searchTools, setSearchTools] = useState<ToolSearchItem[]>(tools);
  const [isSearchIndexLoading, setIsSearchIndexLoading] = useState(false);
  const [searchIndexError, setSearchIndexError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [showAllTools, setShowAllTools] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const revealFocus = useRef<{ hrefs: Set<string | null>; trigger: HTMLButtonElement } | null>(null);

  const isFullSearchIndexLoaded = searchTools.length >= totalToolCount;

  const loadFullSearchIndex = async () => {
    if (isFullSearchIndexLoaded || isSearchIndexLoading) {
      return;
    }

    setIsSearchIndexLoading(true);
    setSearchIndexError('');

    try {
      const response = await fetch(searchIndexUrl);

      if (!response.ok) {
        throw new Error(`Search index request failed with ${response.status}`);
      }

      const payload = (await response.json()) as { tools?: ToolSearchItem[] };

      if (!Array.isArray(payload.tools)) {
        throw new Error('Search index response did not include tools.');
      }

      setSearchTools(payload.tools);
    } catch {
      setSearchIndexError('Full search is loading slowly. The first tools are still available.');
    } finally {
      setIsSearchIndexLoading(false);
    }
  };

  useEffect(() => {
    const queryFromUrl = new URLSearchParams(window.location.search).get('q')?.trim() ?? '';

    if (queryFromUrl) {
      setQuery(queryFromUrl);
      void loadFullSearchIndex();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== 'k' ||
        !event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.shiftKey ||
        isEditableTarget(event.target)
      ) {
        return;
      }

      const searchInput = document.getElementById('tool-library-search');
      if (!(searchInput instanceof HTMLInputElement)) return;

      event.preventDefault();
      searchInput.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    setShowAllTools(false);

    const url = new URL(window.location.href);
    const trimmedQuery = nextQuery.trim();

    if (trimmedQuery) {
      url.searchParams.set('q', trimmedQuery);
    } else {
      url.searchParams.delete('q');
    }

    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);

    if (trimmedQuery) {
      void loadFullSearchIndex();
    }
  };

  const availableCategories = categories.filter((item) => (categoryCounts[item.slug] ?? 0) > 0);

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return searchTools.filter((tool) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        tool.searchText.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === 'all' || tool.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [category, query, searchTools]);

  const selectedCategory = availableCategories.find((item) => item.slug === category);
  const shouldLimitInitialResults =
    !showAllTools &&
    query.trim().length === 0 &&
    category === 'all' &&
    totalToolCount > INITIAL_VISIBLE_TOOL_LIMIT;
  const visibleTools = shouldLimitInitialResults
    ? filteredTools.slice(0, INITIAL_VISIBLE_TOOL_LIMIT)
    : filteredTools;
  const filteredToolCount = isFullSearchIndexLoaded
    ? filteredTools.length
    : category === 'all' && query.trim().length === 0
      ? totalToolCount
      : category !== 'all' && query.trim().length === 0
        ? categoryCounts[category] ?? filteredTools.length
        : filteredTools.length;
  const hiddenToolCount = filteredToolCount - visibleTools.length;

  useEffect(() => {
    const pending = revealFocus.current;
    if (!pending) return;
    if (document.activeElement !== pending.trigger && document.activeElement !== document.body) {
      revealFocus.current = null;
      return;
    }
    const firstNewLink = [...(resultsRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])]
      .find((link) => !pending.hrefs.has(link.getAttribute('href')));
    if (firstNewLink) {
      revealFocus.current = null;
      firstNewLink.focus();
    }
  }, [visibleTools]);

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
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="Search mortgage, loan, tax, BMI, ratio..."
          type="search"
          value={query}
        />
        <kbd>Ctrl</kbd>
        <kbd>K</kbd>
      </div>

      <div className="launchpad-filter-row" aria-label="Tool filters">
        <button
          aria-pressed={category === 'all'}
          onClick={() => {
            setCategory('all');
            setShowAllTools(false);
          }}
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
              onClick={() => {
                setCategory(item.slug);
                setShowAllTools(false);
                void loadFullSearchIndex();
              }}
              type="button"
            >
              <Icon size={16} strokeWidth={2.4} /> {item.name}
            </button>
          );
        })}
      </div>

      <div className="launchpad-grid">
        <div className="launchpad-category-select">
          <label htmlFor="tool-category">Tool category</label>
          <select
            id="tool-category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value as CategoryFilter);
              setShowAllTools(false);
              void loadFullSearchIndex();
            }}
          >
            <option value="all">All tools ({totalToolCount})</option>
            {availableCategories.map((item) => (
              <option key={item.slug} value={item.slug}>{item.name} ({categoryCounts[item.slug] ?? 0})</option>
            ))}
          </select>
        </div>
        <aside className="category-rail" aria-label="Tool categories">
          <button
            aria-pressed={category === 'all'}
            onClick={() => {
              setCategory('all');
              setShowAllTools(false);
            }}
            type="button"
          >
            <Grid3X3 size={18} strokeWidth={2.4} />
            <span>All tools</span>
            <small>{totalToolCount}</small>
          </button>
          {availableCategories.map((item) => {
            const Icon = getCategoryIcon(item.slug);
            const count = categoryCounts[item.slug] ?? 0;

            return (
              <button
                aria-pressed={category === item.slug}
                key={item.slug}
                onClick={() => {
                  setCategory(item.slug);
                  setShowAllTools(false);
                  void loadFullSearchIndex();
                }}
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
              <p aria-atomic="true" aria-live="polite" role="status">
                {isSearchIndexLoading
                  ? 'Loading the full searchable library...'
                  : visibleTools.length === filteredToolCount
                    ? `Showing ${filteredToolCount} ${filteredToolCount === 1 ? 'tool' : 'tools'}.`
                    : `Showing first ${visibleTools.length} of ${filteredToolCount} tools. Search, filter, or show all to browse the full library.`}
              </p>
            </div>
          </div>
          {searchIndexError && <p className="launchpad-status-note">{searchIndexError}</p>}

          <div className="launchpad-tool-grid" ref={resultsRef}>
            {visibleTools.map((tool) => {
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

          {hiddenToolCount > 0 && (
            <button
              className="launchpad-show-more"
              onClick={(event) => {
                revealFocus.current = event.detail === 0 ? {
                  hrefs: new Set([...resultsRef.current!.querySelectorAll('a')].map((link) => link.getAttribute('href'))),
                  trigger: event.currentTarget,
                } : null;
                setShowAllTools(true);
                void loadFullSearchIndex();
              }}
              type="button"
            >
              Show all {filteredToolCount} tools
            </button>
          )}

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
