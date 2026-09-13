import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import type { BlogSearchItem } from '../data/blogSearchIndex';

const INITIAL_VISIBLE_GUIDE_LIMIT = 36;

interface Props {
  posts: BlogSearchItem[];
  searchIndexUrl: string;
  totalPostCount: number;
}

export default function BlogSearch({ posts, searchIndexUrl, totalPostCount }: Props) {
  const [searchPosts, setSearchPosts] = useState<BlogSearchItem[]>(posts);
  const [isSearchIndexLoading, setIsSearchIndexLoading] = useState(false);
  const [searchIndexError, setSearchIndexError] = useState('');
  const [query, setQuery] = useState('');
  const [showAllGuides, setShowAllGuides] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const revealFocus = useRef<{ hrefs: Set<string | null>; trigger: HTMLButtonElement } | null>(null);

  const isFullSearchIndexLoaded = searchPosts.length >= totalPostCount;

  const loadFullSearchIndex = async () => {
    if (isFullSearchIndexLoaded || isSearchIndexLoading) {
      return;
    }

    setIsSearchIndexLoading(true);
    setSearchIndexError('');

    try {
      const response = await fetch(searchIndexUrl);

      if (!response.ok) {
        throw new Error(`Blog search index request failed with ${response.status}`);
      }

      const payload = (await response.json()) as { posts?: BlogSearchItem[] };

      if (!Array.isArray(payload.posts)) {
        throw new Error('Blog search index response did not include posts.');
      }

      setSearchPosts(payload.posts);
    } catch {
      setSearchIndexError('Full guide search is loading slowly. The first guides are still available.');
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

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    setShowAllGuides(false);

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

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return searchPosts;
    }

    return searchPosts.filter((post) => post.searchText.toLowerCase().includes(normalizedQuery));
  }, [query, searchPosts]);

  const shouldLimitInitialResults =
    !showAllGuides &&
    query.trim().length === 0 &&
    totalPostCount > INITIAL_VISIBLE_GUIDE_LIMIT;
  const visiblePosts = shouldLimitInitialResults
    ? filteredPosts.slice(0, INITIAL_VISIBLE_GUIDE_LIMIT)
    : filteredPosts;
  const filteredPostCount = isFullSearchIndexLoaded || query.trim().length > 0 ? filteredPosts.length : totalPostCount;
  const hiddenGuideCount = filteredPostCount - visiblePosts.length;

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
  }, [visiblePosts]);

  return (
    <section className="blog-search-panel" aria-label="Search blog guides">
      <div className="blog-search-heading">
        <h2>Search the guide library</h2>
        <p>Type a tool name, formula, or project word to jump straight to the matching guide.</p>
      </div>
      <div className="blog-search-bar">
        <Search size={20} strokeWidth={2.4} />
        <label htmlFor="blog-guide-search">Search guides</label>
        <input
          id="blog-guide-search"
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="Search mortgage, tax, BMI, probability, statistics..."
          type="search"
          value={query}
        />
      </div>

      <p aria-atomic="true" aria-live="polite" className="blog-search-count" role="status">
        {isSearchIndexLoading
          ? 'Loading the full guide library...'
          : visiblePosts.length === filteredPostCount
            ? `Showing ${filteredPostCount} ${filteredPostCount === 1 ? 'guide' : 'guides'}.`
            : `Showing first ${visiblePosts.length} of ${filteredPostCount} guides. Search or show all to browse every guide.`}
      </p>
      {searchIndexError && <p className="launchpad-status-note">{searchIndexError}</p>}

      <div className="blog-list-grid" ref={resultsRef}>
        {visiblePosts.map((post) => (
          <article className="blog-post-card" key={post.slug}>
            <span>{post.label}</span>
            <h3>
              <a href={`/blog/${post.slug}/`}>{post.title}</a>
            </h3>
            <p>{post.summary}</p>
            <a className="card-link" href={`/blog/${post.slug}/`}>
              Read guide
            </a>
          </article>
        ))}
      </div>

      {hiddenGuideCount > 0 && (
        <button
          className="launchpad-show-more"
          onClick={(event) => {
            revealFocus.current = event.detail === 0 ? {
              hrefs: new Set([...resultsRef.current!.querySelectorAll('a')].map((link) => link.getAttribute('href'))),
              trigger: event.currentTarget,
            } : null;
            setShowAllGuides(true);
            void loadFullSearchIndex();
          }}
          type="button"
        >
          Show all {filteredPostCount} guides
        </button>
      )}

      {filteredPosts.length === 0 && (
        <div className="empty-results">
          <h2>No matching guides</h2>
          <p>Try another tool name or a broader topic.</p>
        </div>
      )}
    </section>
  );
}
