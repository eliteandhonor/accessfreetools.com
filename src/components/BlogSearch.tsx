import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import type { BlogSearchItem } from '../data/blogSearchIndex';
import { TOOL_PAGE_SIZE, rankDiscoveryItems, readToolDiscoveryState, toolDiscoveryUrl } from '../lib/toolDiscovery';
import '../styles/home-blog-discovery.css';

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
  const [limit, setLimit] = useState(TOOL_PAGE_SIZE);
  const loadedCount = useRef(posts.length);
  const loading = useRef(false);
  const typingSession = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const revealFocus = useRef<{ hrefs: Set<string | null>; trigger: HTMLButtonElement } | null>(null);

  const isFullSearchIndexLoaded = searchPosts.length >= totalPostCount;

  const loadFullSearchIndex = useCallback(async () => {
    if (loadedCount.current >= totalPostCount || loading.current) return;
    loading.current = true;
    setIsSearchIndexLoading(true);
    setSearchIndexError('');
    try {
      const response = await fetch(searchIndexUrl);
      if (!response.ok) throw new Error('Blog search index request failed.');
      const payload = (await response.json()) as { posts?: BlogSearchItem[] };
      if (!Array.isArray(payload.posts) || payload.posts.length < totalPostCount) {
        throw new Error('Blog search index response was incomplete.');
      }
      loadedCount.current = payload.posts.length;
      setSearchPosts(payload.posts);
    } catch {
      revealFocus.current = null;
      setSearchIndexError('The full library could not load. Available posts are shown below; retry to search every post.');
    } finally {
      loading.current = false;
      setIsSearchIndexLoading(false);
    }
  }, [searchIndexUrl, totalPostCount]);

  useEffect(() => {
    const restoreFromUrl = () => {
      const state = readToolDiscoveryState(window.location.search, [], totalPostCount);
      typingSession.current = false;
      revealFocus.current = null;
      setQuery(state.query);
      setLimit(state.limit);
      if (state.query.trim() || state.limit > loadedCount.current) void loadFullSearchIndex();
    };
    restoreFromUrl();
    window.addEventListener('popstate', restoreFromUrl);
    window.addEventListener('pageshow', restoreFromUrl);
    return () => {
      window.removeEventListener('popstate', restoreFromUrl);
      window.removeEventListener('pageshow', restoreFromUrl);
    };
  }, [loadFullSearchIndex, totalPostCount]);

  const writeState = (nextQuery: string, nextLimit: number, method: 'pushState' | 'replaceState') => {
    const nextUrl = toolDiscoveryUrl(new URL(window.location.href), { query: nextQuery, category: 'all', limit: nextLimit });
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const changed = currentUrl !== nextUrl;
    if (changed) window.history[method](window.history.state, '', nextUrl);
    setQuery(nextQuery);
    setLimit(nextLimit);
    return changed;
  };

  const updateQuery = (nextQuery: string) => {
    revealFocus.current = null;
    const active = typingSession.current;
    const hasQuery = Boolean(nextQuery.trim());
    // Clearing preserves the preceding search; URL no-ops do not begin a session.
    const changed = writeState(nextQuery, TOOL_PAGE_SIZE, active && hasQuery ? 'replaceState' : 'pushState');
    typingSession.current = hasQuery && (active || changed);
    if (nextQuery.trim()) void loadFullSearchIndex();
  };

  const filteredPosts = useMemo(() => rankDiscoveryItems(
    searchPosts.map(post => ({ ...post, name: post.title })), query,
  ), [query, searchPosts]);
  const visiblePosts = filteredPosts.slice(0, limit);
  const hasQuery = Boolean(query.trim());
  const filteredPostCount = !hasQuery && !isFullSearchIndexLoaded ? totalPostCount : filteredPosts.length;
  const hiddenPostCount = Math.max(0, filteredPostCount - visiblePosts.length);
  const searchIsComplete = !hasQuery || isFullSearchIndexLoaded;

  useEffect(() => {
    const pending = revealFocus.current;
    if (!pending) return;
    if (document.activeElement !== pending.trigger && document.activeElement !== document.body) {
      revealFocus.current = null;
      return;
    }
    const firstNewLink = [...(resultsRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])]
      .find(link => !pending.hrefs.has(link.getAttribute('href')));
    if (firstNewLink) {
      revealFocus.current = null;
      firstNewLink.focus();
    }
  }, [visiblePosts]);

  return (
    <section className="blog-search-panel task-first-blog-search" aria-labelledby="blog-search-heading">
      <div className="blog-search-heading">
        <h2 id="blog-search-heading">Find a guide or article</h2>
        <p>Find an example, formula, tool walkthrough, or project note.</p>
      </div>
      <form action="/blog/" method="get" role="search" onSubmit={event => {
        event.preventDefault();
        typingSession.current = false;
        void loadFullSearchIndex();
      }}>
        <label htmlFor="blog-guide-search">Search guides</label>
        <div className="blog-search-bar">
          <Search size={20} strokeWidth={2.4} aria-hidden="true" />
          <input id="blog-guide-search" name="q" type="search" value={query}
            onBlur={() => { typingSession.current = false; }}
            onChange={event => updateQuery(event.target.value)}
            placeholder="Try percentage discount or browser OCR" />
          <button className="button-primary" type="submit">Search</button>
        </div>
      </form>
      <div className="blog-search-feedback">
        <p aria-atomic="true" aria-live="polite" className="blog-search-count" role="status">
          {isSearchIndexLoading ? 'Loading the full library...'
            : !searchIsComplete ? `Showing ${visiblePosts.length} matches from available posts. Full search is incomplete.`
              : `Showing ${visiblePosts.length} of ${filteredPostCount} ${filteredPostCount === 1 ? 'post' : 'posts'}.`}
        </p>
        {(hasQuery || limit > TOOL_PAGE_SIZE) && <button className="blog-search-reset" type="button" onClick={() => {
          typingSession.current = false;
          revealFocus.current = null;
          writeState('', TOOL_PAGE_SIZE, 'pushState');
        }}>Reset search</button>}
      </div>
      {searchIndexError && <div className="blog-search-retry">
        <p>{searchIndexError}</p>
        <button className="button-secondary" type="button" onClick={() => { void loadFullSearchIndex(); }}>Retry full search</button>
      </div>}
      <div className="blog-list-grid" ref={resultsRef}>
        {visiblePosts.map(post => (
          <article className="blog-post-card" key={post.slug}>
            <span>{post.label}</span>
            <h3><a href={`/blog/${post.slug}/`}>{post.title}</a></h3>
            <p>{post.summary}</p>
            <a className="card-link" href={`/blog/${post.slug}/`}>{post.kind === 'editorial' ? 'Read article' : 'Read guide'}</a>
          </article>
        ))}
      </div>
      {hiddenPostCount > 0 && <button className="launchpad-show-more" type="button" onClick={event => {
        typingSession.current = false;
        revealFocus.current = event.detail === 0 ? {
          hrefs: new Set([...(resultsRef.current?.querySelectorAll('a') ?? [])].map(link => link.getAttribute('href'))),
          trigger: event.currentTarget,
        } : null;
        const nextLimit = Math.min(limit + TOOL_PAGE_SIZE, filteredPostCount);
        writeState(query, nextLimit, 'pushState');
        if (nextLimit > loadedCount.current) void loadFullSearchIndex();
      }}>Show {Math.min(TOOL_PAGE_SIZE, hiddenPostCount)} more posts</button>}
      {isFullSearchIndexLoaded && filteredPosts.length === 0 && <div className="empty-results">
        <h3>No matching guides</h3>
        <p>Try a shorter task or tool name, such as percentage or OCR.</p>
      </div>}
    </section>
  );
}
