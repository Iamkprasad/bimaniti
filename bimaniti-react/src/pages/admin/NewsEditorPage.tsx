import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { TagInput } from '../../components/admin/TagInput';
import { getNews, createNews, updateNews, generateSlug } from '../../services/admin';
import { NewsItem } from '../../types/admin';
import '../../components/admin/AdminComponents.css';

const CATEGORIES = ['Life Insurance', 'General Insurance', 'Health', 'Motor', 'IRDAI/Regulatory', 'Personal Lines'];

export const NewsEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [author, setAuthor] = useState('BimaNiti');
  const [source, setSource] = useState('');
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split('T')[0]);
  const [readTime, setReadTime] = useState('1 min read');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      getNews().then(items => {
        const item = items.find(n => n.id === id);
        if (item) {
          setTitle(item.title);
          setSlug(item.slug);
          setCategory(item.category);
          setTags(item.tags || []);
          setAuthor(item.author);
          setSource(item.source || '');
          setPublishedDate(item.published_date);
          setReadTime(item.read_time);
          setSummary(item.summary);
          setContent(item.content);
          setFeaturedImage(item.featured_image || '');
          setIsPublished(item.is_published !== false);
        } else {
          setError('News not found');
        }
      }).catch(err => setError(err.message)).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugEdited) setSlug(generateSlug(val));
  };

  const handleSave = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    if (!summary.trim()) { setError('Summary is required'); return; }
    setSaving(true);
    setError(null);

    const data: Omit<NewsItem, 'id' | 'slug'> = {
      title: title.trim(),
      category,
      tags,
      author,
      source: source || undefined,
      published_date: publishedDate,
      read_time: readTime,
      summary: summary.trim(),
      content,
      featured_image: featuredImage || null,
      previous_coverage: null,
      related_ids: [],
      is_published: isPublished,
    };

    try {
      if (isEdit && id) {
        await updateNews(id, data);
      } else {
        await createNews(data);
      }
      navigate('/admin/news');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-form">
      <div className="admin-page-header">
        <h1>{isEdit ? 'Edit News' : 'New News'}</h1>
        <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin/news')}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-form-card">
        <h3>Basic Info</h3>
        <div className="form-row">
          <div className="form-group form-group-full">
            <label className="admin-label">Title</label>
            <input className="admin-input" style={{ width: '100%' }} value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="News title" />
          </div>
          <div className="form-group form-group-full">
            <label className="admin-label">Slug</label>
            <input className="admin-input" style={{ width: '100%' }} value={slug} onChange={e => { setSlug(e.target.value); setSlugEdited(true); }} />
          </div>
          <div className="form-group">
            <label className="admin-label">Category</label>
            <select className="admin-select" style={{ width: '100%' }} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="admin-label">Author</label>
            <input className="admin-input" style={{ width: '100%' }} value={author} onChange={e => setAuthor(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="admin-label">Source</label>
            <input className="admin-input" style={{ width: '100%' }} value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. Economic Times" />
          </div>
          <div className="form-group">
            <label className="admin-label">Published Date</label>
            <input className="admin-input" style={{ width: '100%' }} type="date" value={publishedDate} onChange={e => setPublishedDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="admin-label">Read Time</label>
            <input className="admin-input" style={{ width: '100%' }} value={readTime} onChange={e => setReadTime(e.target.value)} placeholder="e.g. 1 min read" />
          </div>
        </div>
        <div className="form-group">
          <TagInput value={tags} onChange={setTags} />
        </div>
      </div>

      <div className="admin-form-card">
        <h3>Summary</h3>
        <textarea className="admin-textarea" value={summary} onChange={e => setSummary(e.target.value)} placeholder="Brief summary..." rows={3} />
      </div>

      <div className="admin-form-card">
        <h3>Content</h3>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="admin-form-card">
        <h3>Featured Image</h3>
        <ImageUpload value={featuredImage} onChange={setFeaturedImage} folder="news" />
      </div>

      <div className="admin-form-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} style={{ width: 16, height: 16 }} />
          Published
        </label>
      </div>

      <div className="form-actions">
        <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin/news')}>Cancel</button>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
};
