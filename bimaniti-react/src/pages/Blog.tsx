import { useEffect, useState } from 'react';
import { BlogFilters } from '../components/BlogFilters';
import { BlogFeed } from '../components/BlogFeed';
import { PageHeader } from '../components/PageHeader';
import { getCachedBlogs } from '../services/dataCache';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  author: string;
  published_date: string;
  read_time: string;
}

export const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getCachedBlogs();
        setBlogs(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12" style={{ color: '#b94040' }}>Error: {error}</div>;

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
                          blog.summary.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || blog.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <PageHeader
        eyebrow="Insurance analysis"
        title="Blog"
        description="In-depth analysis on insurance trends, regulatory developments, and market insights."
      />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <BlogFilters
          blogs={blogs}
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={setFilter}
        />
        <BlogFeed blogs={filteredBlogs} />
      </div>
    </>
  );
};
