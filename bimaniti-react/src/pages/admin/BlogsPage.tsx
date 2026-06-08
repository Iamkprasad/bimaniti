import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AdminTable, Column } from '../../components/admin/AdminTable';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { getBlogs, deleteBlog, updateBlog } from '../../services/admin';
import { BlogPost } from '../../types/admin';
import '../../components/admin/AdminComponents.css';

export const BlogsPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('published_date');
  const [sortAsc, setSortAsc] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const loadBlogs = useCallback(async () => {
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBlogs(); }, [loadBlogs]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBlog(deleteTarget.id);
      setBlogs(prev => prev.filter(b => b.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleTogglePublish = async (blog: BlogPost) => {
    try {
      const updated = await updateBlog(blog.id, { is_published: !blog.is_published });
      setBlogs(prev => prev.map(b => b.id === blog.id ? updated : b));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const categories = [...new Set(blogs.map(b => b.category))].sort();

  const filtered = blogs
    .filter(b => {
      const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.summary.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || b.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || (statusFilter === 'published' ? b.is_published !== false : b.is_published === false);
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      const aVal = String(a[sortKey as keyof BlogPost] ?? '');
      const bVal = String(b[sortKey as keyof BlogPost] ?? '');
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const columns: Column<BlogPost>[] = [
    { key: 'id', label: 'ID', width: '90px', sortable: true },
    {
      key: 'title', label: 'Title', sortable: true,
      render: (b) => <span className="admin-text-bold">{b.title.length > 60 ? b.title.slice(0, 60) + '...' : b.title}</span>,
    },
    {
      key: 'category', label: 'Category', sortable: true,
      render: (b) => <span className="category-badge">{b.category}</span>,
    },
    {
      key: 'is_published', label: 'Status', width: '100px',
      render: (b) => <span className={`status-badge ${b.is_published !== false ? 'published' : 'draft'}`}>{b.is_published !== false ? 'Published' : 'Draft'}</span>,
    },
    {
      key: 'published_date', label: 'Date', sortable: true, width: '110px',
      render: (b) => <span className="admin-text-muted-sm">{b.published_date}</span>,
    },
  ];

  if (loading) return <div className="admin-loading">Loading blogs...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Blogs</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/blogs/new')}>
          <Plus size={16} /> New Blog
        </button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-filters">
        <input
          className="admin-input admin-w-search"
          placeholder="Search blogs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
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
        onEdit={(b) => navigate(`/admin/blogs/${b.id}/edit`)}
        onDelete={setDeleteTarget}
        onTogglePublish={handleTogglePublish}
        getId={b => b.id}
        emptyMessage="No blogs found."
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
