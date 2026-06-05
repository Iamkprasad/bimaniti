import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBlogs, deleteBlog } from '../../services/blogService';
import { getAllNews, deleteNews } from '../../services/newsService';

export default function ContentManager() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadContent = async () => {
    setLoading(true);
    try {
      const [blogs, news] = await Promise.all([
        getAllBlogs().catch(() => []),
        getAllNews().catch(() => []),
      ]);
      const all = [
        ...blogs.map(b => ({ ...b, type: 'Blog' })),
        ...news.map(n => ({ ...n, type: 'News' })),
      ];
      all.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
      setItems(all);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadContent(); }, []);

  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'Blog') await deleteBlog(id);
      else await deleteNews(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Content Manager</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={() => navigate('/admin')} className="admin-sidebar-link">Dashboard</button>
          <button onClick={() => navigate('/admin/editor')} className="admin-sidebar-link">Create New Post</button>
        </div>
      </aside>

      <div className="admin-main">
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>All Content</h1>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)' }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)' }}>Category</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{item.id}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="blog-card-tag">{item.type}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{item.title}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{item.published_date}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: item.status === 'published' ? '#EAF5EA' : '#FFF3E0',
                        color: item.status === 'published' ? '#1A4A2A' : '#7A4000',
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(item.id, item.type)}
                        style={{
                          background: 'none', border: '1px solid var(--alert)',
                          color: 'var(--alert)', borderRadius: '4px', padding: '4px 12px',
                          fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
