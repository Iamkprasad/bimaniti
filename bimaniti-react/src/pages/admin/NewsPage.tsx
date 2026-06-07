import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AdminTable, Column } from '../../components/admin/AdminTable';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { getNews, deleteNews, updateNews } from '../../services/admin';
import { NewsItem } from '../../types/admin';
import '../../components/admin/AdminComponents.css';

export const NewsPage = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('published_date');
  const [sortAsc, setSortAsc] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);

  const loadNews = useCallback(async () => {
    try {
      const data = await getNews();
      setNews(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNews(); }, [loadNews]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteNews(deleteTarget.id);
      setNews(prev => prev.filter(n => n.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleTogglePublish = async (item: NewsItem) => {
    try {
      const updated = await updateNews(item.id, { is_published: !item.is_published });
      setNews(prev => prev.map(n => n.id === item.id ? updated : n));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const categories = [...new Set(news.map(n => n.category))].sort();

  const filtered = news
    .filter(n => {
      const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.summary.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || n.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || (statusFilter === 'published' ? n.is_published !== false : n.is_published === false);
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      const aVal = String(a[sortKey as keyof NewsItem] ?? '');
      const bVal = String(b[sortKey as keyof NewsItem] ?? '');
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const columns: Column<NewsItem>[] = [
    { key: 'id', label: 'ID', width: '90px', sortable: true },
    {
      key: 'title', label: 'Title', sortable: true,
      render: (n) => <span style={{ fontWeight: 500 }}>{n.title.length > 60 ? n.title.slice(0, 60) + '...' : n.title}</span>,
    },
    {
      key: 'category', label: 'Category', sortable: true,
      render: (n) => <span className="category-badge">{n.category}</span>,
    },
    {
      key: 'source', label: 'Source',
      render: (n) => <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{n.source || '-'}</span>,
    },
    {
      key: 'is_published', label: 'Status', width: '100px',
      render: (n) => <span className={`status-badge ${n.is_published !== false ? 'published' : 'draft'}`}>{n.is_published !== false ? 'Published' : 'Draft'}</span>,
    },
    {
      key: 'published_date', label: 'Date', sortable: true, width: '110px',
      render: (n) => <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{n.published_date}</span>,
    },
  ];

  if (loading) return <div className="admin-loading">Loading news...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>News</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/news/new')}>
          <Plus size={16} /> New News
        </button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-filters">
        <input className="admin-input" placeholder="Search news..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }} />
        <select className="admin-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="admin-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <AdminTable
        columns={columns}
        data={filtered}
        sortKey={sortKey}
        sortAsc={sortAsc}
        onSort={handleSort}
        onEdit={(n) => navigate(`/admin/news/${n.id}/edit`)}
        onDelete={setDeleteTarget}
        onTogglePublish={handleTogglePublish}
        getId={n => n.id}
        emptyMessage="No news found."
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete News"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
