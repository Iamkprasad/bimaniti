import { useState } from 'react';
import { useBlogs } from '../hooks/useBlogs';
import BlogCard from '../components/BlogCard';
import FilterBar from '../components/FilterBar';
import { BLOG_CATEGORIES } from '../data/categories';

export default function Blog() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { blogs, loading, error } = useBlogs({ category: filter, search });

  return (
    <>
      <div className="container">
        <div className="page-header">
          <div className="eyebrow">Insurance analysis</div>
          <h1>Blog</h1>
          <p className="page-header-desc">
            In-depth analysis of Indian insurance markets, IRDAI regulations,
            and insurer performance.
          </p>
        </div>

        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          activeFilter={filter}
          onFilterChange={setFilter}
          categories={BLOG_CATEGORIES}
          searchPlaceholder="Search blog posts..."
        />

        {error && (
          <div style={{ padding: '2rem', color: 'var(--alert)' }}>
            Unable to load blog posts.
          </div>
        )}

        {loading ? (
          <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>
            Loading blog posts...
          </div>
        ) : (
          <div style={{ paddingBottom: '4rem' }}>
            <div className="grid-2">
              {blogs.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            {blogs.length === 0 && !error && (
              <div style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                No blog posts found.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
