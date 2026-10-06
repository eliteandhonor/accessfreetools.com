import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../styles/tool-discovery.css';
import { TOOL_PAGE_SIZE, rankDiscoveryItems, readToolDiscoveryState, toolDiscoveryUrl, toolMatchesDiscoveryCategory, type ToolDiscoveryState } from '../lib/toolDiscovery';
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

const taskExamples = [
  { label: 'Percentages and discounts', query: 'percentage discount', category: 'calculators' },
  { label: 'Compare fractions', query: 'fraction compare', category: 'calculators' },
  { label: 'Monthly mortgage payment', query: 'mortgage monthly payment', category: 'finance' },
  { label: 'Convert pounds to kg', query: 'convert pounds to kg', category: 'converters' },
  { label: 'Count words', query: 'word count', category: 'text-tools' },
  { label: 'Read text from an image', query: 'image text OCR', category: 'ai-tools' },
  { label: 'Estimate paint', query: 'paint area', category: 'home-projects' },
  { label: 'Days between dates', query: 'date difference', category: 'date-time' },
] as const;

export default function ToolsLaunchpad({ categories, categoryCounts, searchIndexUrl, tools, totalToolCount }: Props) {
  const [searchTools, setSearchTools] = useState<ToolSearchItem[]>(tools);
  const [isSearchIndexLoading, setIsSearchIndexLoading] = useState(false);
  const [searchIndexError, setSearchIndexError] = useState('');
  const [state, setState] = useState<ToolDiscoveryState>({ query: '', category: 'all', limit: TOOL_PAGE_SIZE });
  const stateRef = useRef(state);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categorySelectRef = useRef<HTMLSelectElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const typingSession = useRef(false);
  const fullIndexLoaded = useRef(tools.length >= totalToolCount);
  const indexRequest = useRef<Promise<void> | null>(null);
  const indexController = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const revealFocus = useRef<{ hrefs: Set<string | null>; trigger: HTMLButtonElement } | null>(null);
  const availableCategories = categories.filter(item => (categoryCounts[item.slug] ?? 0) > 0);
  const isFullSearchIndexLoaded = searchTools.length >= totalToolCount;

  const loadFullSearchIndex = useCallback(() => {
    if (fullIndexLoaded.current) return Promise.resolve();
    if (indexRequest.current) return indexRequest.current;
    const controller = new AbortController();
    indexController.current = controller;
    setIsSearchIndexLoading(true);
    setSearchIndexError('');
    const request = (async () => {
      try {
        const response = await fetch(searchIndexUrl, { signal: controller.signal });
        if (!response.ok) throw new Error('Search index unavailable');
        const payload = await response.json() as { tools?: ToolSearchItem[] };
        if (!Array.isArray(payload.tools) || payload.tools.length < totalToolCount || payload.tools.some(tool =>
          !tool || typeof tool.slug !== 'string' || typeof tool.name !== 'string' || typeof tool.searchText !== 'string')) {
          throw new Error('Incomplete search index');
        }
        if (mounted.current && !controller.signal.aborted) {
          fullIndexLoaded.current = true;
          setSearchTools(payload.tools);
        }
      } catch {
        if (mounted.current && !controller.signal.aborted) {
          setSearchIndexError('The full search could not load. Retry, or browse every tool in the A–Z index below.');
        }
      } finally {
        if (indexController.current === controller) {
          indexRequest.current = null;
          if (mounted.current) setIsSearchIndexLoading(false);
        }
      }
    })();
    indexRequest.current = request;
    return request;
  }, [searchIndexUrl, totalToolCount]);

  const applyState = (next: ToolDiscoveryState, historyMode: 'push' | 'replace' = 'push', keepReveal = false) => {
    if (!keepReveal) revealFocus.current = null;
    stateRef.current = next;
    setState(next);
    if (searchInputRef.current) searchInputRef.current.value = next.query;
    if (categorySelectRef.current) categorySelectRef.current.value = next.category;
    const url = toolDiscoveryUrl(new URL(window.location.href), next);
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (url !== current) window.history[historyMode === 'push' ? 'pushState' : 'replaceState'](window.history.state, '', url);
    if (next.query.trim() || next.category !== 'all' || next.limit > TOOL_PAGE_SIZE) void loadFullSearchIndex();
  };

  useEffect(() => {
    mounted.current = true;
    const restore = (allowNativeRestoration = false) => {
      const next = readToolDiscoveryState(window.location.search, categories.map(item => item.slug), totalToolCount);
      // Uncontrolled fields preserve text entered or restored before the island hydrates.
      // Explicit URL state wins; popstate/pageshow always restore the URL exactly.
      const params = new URLSearchParams(window.location.search);
      if (allowNativeRestoration && !params.has('q') && searchInputRef.current?.value) next.query = searchInputRef.current.value;
      if (allowNativeRestoration && !params.has('category') && categorySelectRef.current?.value !== 'all') {
        const restoredCategory = categorySelectRef.current?.value;
        if (restoredCategory && categories.some(item => item.slug === restoredCategory)) next.category = restoredCategory;
      }
      typingSession.current = false;
      applyState(next, 'replace');
    };
    restore(true);
    const restoreFromHistory = () => restore();
    window.addEventListener('popstate', restoreFromHistory);
    window.addEventListener('pageshow', restoreFromHistory);
    return () => {
      mounted.current = false;
      indexController.current?.abort();
      indexController.current = null;
      indexRequest.current = null;
      window.removeEventListener('popstate', restoreFromHistory);
      window.removeEventListener('pageshow', restoreFromHistory);
    };
  }, [categories, totalToolCount, loadFullSearchIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !event.ctrlKey || event.altKey || event.metaKey || event.shiftKey || isEditableTarget(event.target)) return;
      event.preventDefault();
      searchInputRef.current?.focus();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTools = useMemo(() => rankDiscoveryItems(
    searchTools.filter(tool => toolMatchesDiscoveryCategory(tool, state.category)), state.query,
  ), [searchTools, state.category, state.query]);
  const visibleTools = filteredTools.slice(0, state.limit);
  const countIsComplete = isFullSearchIndexLoaded || !state.query.trim();
  const filteredToolCount = isFullSearchIndexLoaded ? filteredTools.length
    : state.query.trim() ? filteredTools.length
    : state.category === 'all' ? totalToolCount : categoryCounts[state.category as ToolCategory['slug']] ?? filteredTools.length;
  const selectedCategory = categories.find(item => item.slug === state.category);
  const hasMoreTools = filteredToolCount > visibleTools.length || !isFullSearchIndexLoaded && Boolean(state.query.trim()) && !searchIndexError;

  useEffect(() => {
    const pending = revealFocus.current;
    // Wait for final ordering so a delayed index does not move focus twice.
    if (!pending || isSearchIndexLoading) return;
    if (document.activeElement !== pending.trigger && document.activeElement !== document.body) {
      revealFocus.current = null;
      return;
    }
    if (searchIndexError) {
      // A disabled loading button can release focus. Restore its keyboard retry
      // target once it is enabled, unless the visitor has moved elsewhere.
      pending.trigger.focus();
      revealFocus.current = null;
      return;
    }
    if (!isFullSearchIndexLoaded) return;
    const firstNewLink = [...(resultsRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])]
      .find(link => !pending.hrefs.has(link.getAttribute('href')));
    revealFocus.current = null;
    firstNewLink?.focus();
  }, [visibleTools, isSearchIndexLoading, isFullSearchIndexLoaded, searchIndexError]);

  const updateQuery = (query: string) => {
    applyState({ ...stateRef.current, query, limit: TOOL_PAGE_SIZE }, typingSession.current ? 'replace' : 'push');
    typingSession.current = true;
  };
  const chooseCategory = (category: string) => {
    typingSession.current = false;
    applyState({ ...stateRef.current, category, limit: TOOL_PAGE_SIZE });
  };

  return (
    <section className="tools-launchpad task-first-directory">
      <div className="tools-hero"><div className="tools-hero-copy">
        <p className="breadcrumb"><a href="/">Home</a> / Tools</p>
        <ToolsTitleGraphic />
        <p>Find a calculator, converter, or browser helper for the job in front of you.</p>
      </div></div>

      <form className="tool-discovery-form" action="/tools/" method="get" onSubmit={event => {
        event.preventDefault();
        typingSession.current = false;
        applyState({ ...stateRef.current, query: searchInputRef.current?.value ?? '', category: categorySelectRef.current?.value ?? 'all', limit: TOOL_PAGE_SIZE });
      }}>
        <div className="tool-command-bar">
          <Search size={20} strokeWidth={2.4} aria-hidden="true" />
          <label htmlFor="tool-library-search">Search tools</label>
          <input id="tool-library-search" name="q" type="search" ref={searchInputRef} defaultValue=""
            onChange={event => updateQuery(event.target.value)} onBlur={() => { typingSession.current = false; }}
            placeholder="Try fraction compare or pounds to kg" />
          <kbd>Ctrl</kbd><kbd>K</kbd>
        </div>
        <div className="tool-discovery-controls">
          <div className="launchpad-category-select">
            <label htmlFor="tool-category">Tool category</label>
            <select id="tool-category" name="category" ref={categorySelectRef} defaultValue="all" onChange={event => chooseCategory(event.target.value)}>
              <option value="all">All categories ({totalToolCount} tool names)</option>
              {availableCategories.map(item => <option key={item.slug} value={item.slug}>{item.name} ({categoryCounts[item.slug] ?? 0})</option>)}
            </select>
          </div>
          <button className="tool-discovery-submit" type="submit">Search</button>
          {(state.query || state.category !== 'all' || state.limit > TOOL_PAGE_SIZE) && <button className="tool-discovery-reset" type="button" onClick={() => {
            typingSession.current = false;
            applyState({ query: '', category: 'all', limit: TOOL_PAGE_SIZE });
            searchInputRef.current?.focus();
          }}>Clear search and category</button>}
        </div>
      </form>

      {!state.query.trim() && state.category === 'all' && <section className="tool-task-chooser" aria-labelledby="tool-task-heading">
        <h2 id="tool-task-heading">What do you want to do?</h2>
        <div className="tool-task-grid">
          {taskExamples.map(task => {
            const Icon = getCategoryIcon(task.category);
            return <button key={task.query} type="button" onClick={() => {
              typingSession.current = false;
              applyState({ query: task.query, category: 'all', limit: TOOL_PAGE_SIZE });
              searchInputRef.current?.focus();
            }}><Icon size={19} aria-hidden="true" /><span>{task.label}</span><ArrowRight size={16} aria-hidden="true" /></button>;
          })}
        </div>
      </section>}

      <div className="library-results">
        <div className="results-heading"><div>
          <h2>{state.query.trim() ? 'Matching tools' : selectedCategory?.name ?? 'Browse tools'}</h2>
          <p aria-atomic="true" aria-live="polite" role="status">
            {isSearchIndexLoading ? 'Loading the full searchable library…'
              : !countIsComplete ? 'These are matches from the loaded tools. Full search is not available yet.'
              : `Showing ${visibleTools.length} of ${filteredToolCount} ${filteredToolCount === 1 ? 'tool name' : 'tool names'}${selectedCategory ? ` in ${selectedCategory.name}` : ''}.`}
          </p>
        </div>{selectedCategory && <a href={`/categories/${selectedCategory.slug}/`}>Read category guides</a>}</div>
        {searchIndexError && <div className="launchpad-status-note"><p>{searchIndexError}</p><button type="button" onClick={() => { void loadFullSearchIndex(); }}>Retry full search</button> <a href="#tools-az-heading">Browse the A–Z index</a></div>}
        <div className="launchpad-tool-grid" ref={resultsRef}>
          {visibleTools.map(tool => <a className="launchpad-tool-card" href={`/tools/${tool.slug}/`} key={tool.slug}>
            <div className="card-topline"><ToolGlyph tool={tool} /></div><strong>{tool.name}</strong><p>{tool.summary}</p>
            <span className="card-link">Open tool<ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" /></span>
          </a>)}
        </div>
        {hasMoreTools && <button className="launchpad-show-more" type="button" disabled={isSearchIndexLoading} onClick={event => {
          revealFocus.current = event.detail === 0 ? { hrefs: new Set([...resultsRef.current!.querySelectorAll('a')].map(link => link.getAttribute('href'))), trigger: event.currentTarget } : null;
          typingSession.current = false;
          applyState({ ...stateRef.current, limit: Math.min(stateRef.current.limit + TOOL_PAGE_SIZE, totalToolCount) }, 'push', true);
          void loadFullSearchIndex();
        }}>{isSearchIndexLoading ? 'Loading tools…' : 'Show 12 more tools'}</button>}
        {isFullSearchIndexLoaded && filteredTools.length === 0 && <div className="empty-results">
          <h3>No matching tools</h3><p>Try a tool name or fewer words.</p>
          {state.category !== 'all' && <button type="button" onClick={() => chooseCategory('all')}>Search all categories</button>}
          <button type="button" onClick={() => { typingSession.current = false; applyState({ query: '', category: 'all', limit: TOOL_PAGE_SIZE }); searchInputRef.current?.focus(); }}>Clear search</button>
          <a href="#tools-az-heading">Browse every tool by name</a>
        </div>}
      </div>
      <noscript><p>Browse the complete A–Z index below. Search and category filtering need JavaScript.</p></noscript>
    </section>
  );
}
