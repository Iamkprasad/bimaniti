import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../../services/admin';
import { Category } from '../../types/admin';
import '../../components/admin/AdminComponents.css';

type SettingsTab = 'categories';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'blog' | 'news'>('blog');
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const cat = await createCategory({
        name: newCatName.trim(),
        type: newCatType,
        display_order: categories.length,
      });
      setCategories(prev => [...prev, cat]);
      setNewCatName('');
      setSuccess('Category added');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      setCategories(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleMoveCategory = async (cat: Category, direction: 'up' | 'down') => {
    const idx = categories.findIndex(c => c.id === cat.id);
    if (idx < 0) return;
    const swap = direction === 'up' ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= categories.length) return;
    const updated = [...categories];
    [updated[idx], updated[swap]] = [updated[swap], updated[idx]];
    setCategories(updated);
    try {
      await updateCategory(cat.id, { display_order: swap });
      await updateCategory(categories[swap].id, { display_order: idx });
    } catch { /* silent */ }
  };

  const blogCategories = categories.filter(c => c.type === 'blog').sort((a, b) => a.display_order - b.display_order);
  const newsCategories = categories.filter(c => c.type === 'news').sort((a, b) => a.display_order - b.display_order);

  if (loading) return <div className="admin-loading">Loading settings...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Settings</h1>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </div>

      {activeTab === 'categories' && (
        <>
          <div className="admin-form-card">
            <h3>Add Category</h3>
            <div className="form-row" style={{ alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="admin-label">Name</label>
                <input
                  className="admin-input"
                  style={{ width: '100%' }}
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder="Category name"
                  onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="admin-label">Type</label>
                <select className="admin-select" style={{ width: '100%' }} value={newCatType} onChange={e => setNewCatType(e.target.value as 'blog' | 'news')}>
                  <option value="blog">Blog</option>
                  <option value="news">News</option>
                </select>
              </div>
              <div className="form-group">
                <button className="admin-btn admin-btn-primary" onClick={handleAddCategory}>
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>
          </div>

          <div className="form-row" style={{ alignItems: 'flex-start' }}>
            <div className="admin-form-card" style={{ flex: 1 }}>
              <h3>Blog Categories</h3>
              {blogCategories.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No categories yet.</p>
              ) : (
                <ul className="category-list">
                  {blogCategories.map((cat, i) => (
                    <li key={cat.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{cat.name}</span>
                      </div>
                      <div className="cat-actions">
                        <button className="admin-btn-icon" title="Move up" onClick={() => handleMoveCategory(cat, 'up')} disabled={i === 0}>
                          <GripVertical size={14} />
                        </button>
                        <button className="admin-btn-icon danger" title="Delete" onClick={() => setDeleteTarget(cat)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="admin-form-card" style={{ flex: 1 }}>
              <h3>News Categories</h3>
              {newsCategories.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No categories yet.</p>
              ) : (
                <ul className="category-list">
                  {newsCategories.map((cat, i) => (
                    <li key={cat.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{cat.name}</span>
                      </div>
                      <div className="cat-actions">
                        <button className="admin-btn-icon" title="Move up" onClick={() => handleMoveCategory(cat, 'up')} disabled={i === 0}>
                          <GripVertical size={14} />
                        </button>
                        <button className="admin-btn-icon danger" title="Delete" onClick={() => setDeleteTarget(cat)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category"
        message={`Delete category "${deleteTarget?.name}"? Existing posts using this category will not be affected.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
