import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { getCachedBlogs, getCachedNews } from '../services/dataCache';
import './Archives.css';

interface ArchiveItem {
  id: string;
  title: string;
  published_date: string;
  type: string;
  category: string;
}

interface MonthGroup {
  label: string;
  items: ArchiveItem[];
}

export const Archives = () => {
  const [archives, setArchives] = useState<MonthGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const [blogs, news] = await Promise.all([
          getCachedBlogs(),
          getCachedNews(),
        ]);

        const allItems = [
          ...blogs.map((item: ArchiveItem) => ({ ...item, type: 'Blog' })),
          ...news.map((item: ArchiveItem) => ({ ...item, type: 'News' }))
        ].sort((a: ArchiveItem, b: ArchiveItem) => {
          if (a.published_date < b.published_date) return 1;
          if (a.published_date > b.published_date) return -1;
          return 0;
        });

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const grouped: Record<string, MonthGroup> = {};

        allItems.forEach((item: ArchiveItem) => {
          const parts = item.published_date.split('-');
          const monthKey = parts[0] + '-' + parts[1];
          const label = monthNames[parseInt(parts[1]) - 1] + ' ' + parts[0];

          if (!grouped[monthKey]) {
            grouped[monthKey] = { label, items: [] };
          }
          grouped[monthKey].items.push(item);
        });

        const monthKeys = Object.keys(grouped).sort().reverse();
        const sortedArchives = monthKeys.map(key => grouped[key]);

        setArchives(sortedArchives);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load archives');
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12" style={{ color: '#b94040' }}>Error: {error}</div>;
  if (archives.length === 0) return <div className="text-center py-12">No content archived yet.</div>;

  return (
    <>
      <PageHeader
        eyebrow="Complete archive"
        title="Archives"
        description="Browse content by month and year."
      />
      <div className="max-w-4xl mx-auto py-8 px-4">
        {archives.map((month) => (
          <div key={month.label}>
            <div className="archive-section-title">
              {month.label}
            </div>
            <div className="space-y-2">
              {month.items.map(item => (
                <Link
                  key={item.id}
                  to={`/post/${item.id}`}
                  className="archive-row"
                >
                  <div className="archive-row-left">
                    <span className="archive-row-tag">{item.category}</span>
                    <span className="archive-row-tag">{item.type}</span>
                    <span className="archive-row-title">{item.title}</span>
                  </div>
                  <span className="archive-row-date">{item.published_date}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
