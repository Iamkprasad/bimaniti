import { useEffect, useState } from 'react';
import { NewsFilters } from '../components/NewsFilters';
import { NewsFeed } from '../components/NewsFeed';
import { PageHeader } from '../components/PageHeader';
import { getCachedNews } from '../services/dataCache';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  author: string;
  source?: string;
  published_date: string;
  read_time: string;
}

export const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getCachedNews();
        setNews(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12" style={{ color: '#b94040' }}>Error: {error}</div>;

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.summary.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <PageHeader
        eyebrow="Market updates"
        title="News"
        description="Stay informed with the latest developments in the Indian insurance and financial markets."
      />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <NewsFilters
          news={news}
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={setFilter}
        />
        <NewsFeed news={filteredNews} />
      </div>
    </>
  );
};
