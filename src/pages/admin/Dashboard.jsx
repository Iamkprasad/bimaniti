import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, signOut } from '../../services/authService';
import { getAllBlogs } from '../../services/blogService';
import { getAllNews } from '../../services/newsService';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ blogs: 0, news: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser().then(setUser);
    Promise.all([
      getAllBlogs().then(b => b.length).catch(() => 0),
      getAllNews().then(n => n.length).catch(() => 0),
    ]).then(([blogs, news]) => setStats({ blogs, news }));
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Admin</div>
        <Link to="/admin" className="admin-sidebar-link active">Dashboard</Link>
        <Link to="/admin/editor" className="admin-sidebar-link">New Post</Link>
        <Link to="/admin/content" className="admin-sidebar-link">Manage Content</Link>
        <button
          onClick={handleSignOut}
          className="admin-sidebar-link"
          style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
        >
          Sign Out
        </button>
      </aside>

      <main className="admin-main">
        <h1 style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Welcome back, {user?.email || 'Admin'}
        </p>

        <div className="grid-2" style={{ maxWidth: '600px' }}>
          <div className="card">
            <div className="card-body">
              <div className="eyebrow">Blog Posts</div>
              <h2>{stats.blogs}</h2>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="eyebrow">News Items</div>
              <h2>{stats.news}</h2>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <Link to="/admin/editor" className="btn-primary">Create New Post</Link>
          <Link to="/admin/content" className="btn-outline">Manage Content</Link>
          <button onClick={handleSignOut} className="btn-outline">Sign Out</button>
        </div>
      </main>
    </div>
  );
}
