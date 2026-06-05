import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import NewsCard from '../components/NewsCard';
import FilterBar from '../components/FilterBar';
import { NEWS_CATEGORIES } from '../data/categories';

export default function News() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { news, loading, error } = useNews({ category: filter, search });

  return (
    <>
      <div className="container">
        <div className="page-header">
          <div className="eyebrow">Market updates</div>
          <h1>News</h1>
          <p className="page-header-desc">
            Latest developments in the Indian insurance market from leading
            business media outlets.
          </p>
        </div>

        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          activeFilter={filter}
          onFilterChange={setFilter}
          categories={NEWS_CATEGORIES}
          searchPlaceholder="Search news..."
        />

        {error && (
          <div style={{ padding: '2rem', color: 'var(--alert)' }}>
            Unable to load news.
          </div>
        )}

        {loading ? (
          <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>
            Loading news...
          </div>
        ) : (
          <div style={{ paddingBottom: '4rem' }}>
            <div className="grid-2">
              {news.map(item => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
            {news.length === 0 && !error && (
              <div style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                No news items found.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
