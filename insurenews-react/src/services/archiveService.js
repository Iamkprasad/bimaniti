import { getBlogs } from './blogService';
import { getNews } from './newsService';

export async function getArchives() {
  const [blogs, news] = await Promise.all([
    getBlogs().catch(() => []),
    getNews().catch(() => []),
  ]);

  const allItems = [
    ...blogs.map(b => ({ ...b, type: 'Blog' })),
    ...news.map(n => ({ ...n, type: 'News' })),
  ];

  allItems.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));

  const grouped = {};
  allItems.forEach(item => {
    const date = new Date(item.published_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!grouped[key]) grouped[key] = { label, items: [] };
    grouped[key].items.push(item);
  });

  return Object.values(grouped);
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
