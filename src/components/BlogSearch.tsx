import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { BlogPostDefinition } from '../data/blogPosts';

interface Props {
  posts: BlogPostDefinition[];
}

export default function BlogSearch({ posts }: Props) {
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return posts;
    }

    return posts.filter((post) =>
      [post.title, post.label, post.summary].join(' ').toLowerCase().includes(normalizedQuery),
    );
  }, [posts, query]);

  return (
    <section className="blog-search-panel" aria-label="Search blog guides">
      <div className="blog-search-bar">
        <Search size={20} strokeWidth={2.4} />
        <label htmlFor="blog-guide-search">Search guides</label>
        <input
          id="blog-guide-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search calculator, probability, statistics..."
          type="search"
          value={query}
        />
      </div>

      <p className="blog-search-count">
        Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'guide' : 'guides'}.
      </p>

      <div className="blog-list-grid">
        {filteredPosts.map((post) => (
          <article className="blog-post-card" key={post.slug}>
            <span>{post.label}</span>
            <h2>
              <a href={`/blog/${post.slug}/`}>{post.title}</a>
            </h2>
            <p>{post.summary}</p>
            <a className="card-link" href={`/blog/${post.slug}/`}>
              Read guide
            </a>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="empty-results">
          <h2>No matching guides</h2>
          <p>Try another tool name or a broader topic.</p>
        </div>
      )}
    </section>
  );
}
