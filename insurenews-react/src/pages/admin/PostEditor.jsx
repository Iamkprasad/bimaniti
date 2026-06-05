import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../../services/blogService';
import { createNews } from '../../services/newsService';
import { BLOG_CATEGORIES, NEWS_CATEGORIES } from '../../data/categories';

export default function PostEditor() {
  const navigate = useNavigate();
  const [type, setType] = useState('blog');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Life Insurance');
  const [tags, setTags] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [readTime, setReadTime] = useState('');
  const [saving, setSaving] = useState(false);

  const categories = type === 'blog' ? BLOG_CATEGORIES : NEWS_CATEGORIES;

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async () => {
    if (!title || !summary || !content) return;
    setSaving(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const postData = {
        title,
        slug: slug || generateSlug(title),
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        author: 'Prasad Chandra Kulal',
        published_date: today,
        summary,
        content,
        status: 'published',
        previous_coverage: null,
        related_ids: [],
      };

      if (type === 'blog') {
        postData.read_time = readTime || '2 min read';
        await createBlog(postData);
      } else {
        postData.source = source || '';
        await createNews(postData);
      }

      navigate('/admin');
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Post Editor</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={() => navigate('/admin')} className="admin-sidebar-link">Dashboard</button>
          <button onClick={() => navigate('/admin/content')} className="admin-sidebar-link">Content Manager</button>
        </div>
      </aside>

      <div className="admin-main" style={{ maxWidth: '720px' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Create New Post</h1>

        <div className="form-group">
          <label>Type</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`filter-btn${type === 'blog' ? ' active' : ''}`}
              onClick={() => { setType('blog'); setCategory('Life Insurance'); }}
            >
              Blog
            </button>
            <button
              className={`filter-btn${type === 'news' ? ' active' : ''}`}
              onClick={() => { setType('news'); setCategory('Life Insurance'); }}
            >
              News
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={e => handleTitleChange(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Slug</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              width: '100%', padding: '0.625rem 1rem', border: '1px solid var(--border)',
              borderRadius: '4px', background: 'var(--card-bg)', color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)', fontSize: '14px',
            }}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="LIC, FY26, Q4" />
        </div>

        <div className="form-group">
          <label>Summary</label>
          <textarea
            value={summary}
            onChange={e => setSummary(e.target.value)}
            rows={3}
          />
        </div>

        {type === 'blog' && (
          <div className="form-group">
            <label>Read Time</label>
            <input value={readTime} onChange={e => setReadTime(e.target.value)} placeholder="2 min read" />
          </div>
        )}

        {type === 'news' && (
          <div className="form-group">
            <label>Source</label>
            <input value={source} onChange={e => setSource(e.target.value)} placeholder="Economic Times" />
          </div>
        )}

        <div className="form-group">
          <label>Content (HTML)</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={15}
            style={{ fontFamily: 'monospace' }}
          />
        </div>

        <button
          onClick={handleSave}
          className="btn-primary"
          disabled={saving}
          style={{ marginTop: '1rem' }}
        >
          {saving ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
