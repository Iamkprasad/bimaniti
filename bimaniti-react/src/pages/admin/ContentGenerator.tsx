import { useState, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCw, Check, X, Trash2, ExternalLink, Clock, AlertCircle, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import {
  runContentGeneration, getDrafts, updateDraftStatus, deleteDraft,
  publishDraft, updateDraft, getFeedStatuses, toggleFeed,
  getGenerationLogs, GeneratedDraft, FeedStatus,
} from '../../services/contentGenerator';
import { isGeminiConfigured } from '../../services/gemini';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import '../../components/admin/AdminComponents.css';
import './ContentGenerator.css';

type DraftTab = 'pending' | 'approved' | 'rejected' | 'published';

export const ContentGenerator = () => {
  const [feeds, setFeeds] = useState<FeedStatus[]>([]);
  const [drafts, setDrafts] = useState<GeneratedDraft[]>([]);
  const [activeTab, setActiveTab] = useState<DraftTab>('pending');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [logs, setLogs] = useState<Array<{
    id: string; run_at: string; feeds_checked: number; items_found: number;
    items_duplicated: number; items_generated: number; duration_ms: number;
  }>>([]);

  const geminiConfigured = isGeminiConfigured();

  const loadData = useCallback(async () => {
    try {
      const [feedData, draftData, logData] = await Promise.all([
        getFeedStatuses(),
        getDrafts(),
        getGenerationLogs(),
      ]);
      setFeeds(feedData);
      setDrafts(draftData);
      setLogs(logData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setProgress('Starting...');

    try {
      const result = await runContentGeneration((msg) => setProgress(msg));
      setDrafts(prev => [...result.drafts, ...prev]);
      setProgress(`Done! Generated ${result.itemsGenerated} drafts in ${(result.durationMs / 1000).toFixed(1)}s`);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (draft: GeneratedDraft) => {
    try {
      await updateDraftStatus(draft.id, 'approved');
      setDrafts(prev => prev.map(d => d.id === draft.id ? { ...d, status: 'approved' } : d));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  };

  const handleReject = async (draft: GeneratedDraft) => {
    try {
      await updateDraftStatus(draft.id, 'rejected');
      setDrafts(prev => prev.map(d => d.id === draft.id ? { ...d, status: 'rejected' } : d));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  };

  const handlePublish = async (draft: GeneratedDraft) => {
    try {
      const newId = await publishDraft(draft.id);
      setDrafts(prev => prev.map(d => d.id === draft.id ? { ...d, status: 'published', published_id: newId } : d));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    }
  };

  const handleDelete = async (draft: GeneratedDraft) => {
    try {
      await deleteDraft(draft.id);
      setDrafts(prev => prev.filter(d => d.id !== draft.id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleSaveEdit = async (draft: GeneratedDraft) => {
    try {
      await updateDraft(draft.id, { content: editContent });
      setDrafts(prev => prev.map(d => d.id === draft.id ? { ...d, content: editContent } : d));
      setEditingId(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleToggleFeed = async (feed: FeedStatus) => {
    try {
      await toggleFeed(feed.id, !feed.is_active);
      setFeeds(prev => prev.map(f => f.id === feed.id ? { ...f, is_active: !f.is_active } : f));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  };

  const filteredDrafts = drafts.filter(d => d.status === activeTab);
  const counts = {
    pending: drafts.filter(d => d.status === 'pending').length,
    approved: drafts.filter(d => d.status === 'approved').length,
    rejected: drafts.filter(d => d.status === 'rejected').length,
    published: drafts.filter(d => d.status === 'published').length,
  };

  if (loading) return <div className="admin-loading">Loading content generator...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1><Sparkles size={24} className="admin-icon-inline" /> Content Generator</h1>
        <button
          className="admin-btn admin-btn-primary"
          onClick={handleGenerate}
          disabled={generating || !geminiConfigured}
        >
          {generating ? <RefreshCw size={16} className="spin" /> : <Sparkles size={16} />}
          {generating ? 'Generating...' : 'Run Now'}
        </button>
      </div>

      {!geminiConfigured && (
        <div className="admin-error">
          <AlertCircle size={16} className="admin-icon-inline" />
          Gemini API key not configured. Add <code>VITE_GEMINI_API_KEY</code> to your <code>.env</code> file.
        </div>
      )}

      {error && <div className="admin-error">{error}</div>}
      {progress && generating && <div className="admin-success">{progress}</div>}
      {progress && !generating && <div className="gen-progress-done">{progress}</div>}

      {/* Stats */}
      <div className="gen-stats">
        <div className="gen-stat">
          <span className="gen-stat-num">{feeds.filter(f => f.is_active).length}</span>
          <span className="gen-stat-label">Active Feeds</span>
        </div>
        <div className="gen-stat">
          <span className="gen-stat-num">{counts.pending}</span>
          <span className="gen-stat-label">Pending</span>
        </div>
        <div className="gen-stat">
          <span className="gen-stat-num">{counts.approved}</span>
          <span className="gen-stat-label">Approved</span>
        </div>
        <div className="gen-stat">
          <span className="gen-stat-num">{counts.published}</span>
          <span className="gen-stat-label">Published</span>
        </div>
      </div>

      {/* Feeds */}
      <div className="admin-form-card">
        <h3>RSS Feeds</h3>
        <div className="gen-feeds-list">
          {feeds.map(feed => (
            <div key={feed.id} className="gen-feed-row">
              <div className="gen-feed-info">
                <span className="gen-feed-name">{feed.name}</span>
                <span className="gen-feed-meta">
                  {feed.last_fetched
                    ? `Last: ${new Date(feed.last_fetched).toLocaleString()}`
                    : 'Never fetched'}
                  {feed.last_item_count > 0 && ` · ${feed.last_item_count} items`}
                </span>
              </div>
              <label className="gen-toggle">
                <input
                  type="checkbox"
                  checked={feed.is_active}
                  onChange={() => handleToggleFeed(feed)}
                />
                <span className="gen-toggle-slider" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Drafts */}
      <div className="admin-form-card">
        <div className="gen-draft-tabs">
          {(['pending', 'approved', 'rejected', 'published'] as DraftTab[]).map(tab => (
            <button
              key={tab}
              className={`gen-draft-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
            </button>
          ))}
        </div>

        <div className="gen-drafts-list">
          {filteredDrafts.length === 0 ? (
            <p className="gen-empty">No {activeTab} drafts.</p>
          ) : (
            filteredDrafts.map(draft => (
              <div key={draft.id} className="gen-draft-card">
                <div className="gen-draft-header">
                  <div className="gen-draft-type-badge" data-type={draft.content_type}>
                    {draft.content_type === 'blog' ? 'BLOG' : 'NEWS'}
                  </div>
                  <div className="gen-draft-title-area">
                    <h4>{draft.title}</h4>
                    <div className="gen-draft-meta">
                      <span className="category-badge">{draft.category}</span>
                      {draft.source_name && <span className="gen-source">{draft.source_name}</span>}
                      <span className="gen-date">{new Date(draft.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    className="gen-expand-btn"
                    onClick={() => setExpandedId(expandedId === draft.id ? null : draft.id)}
                  >
                    {expandedId === draft.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                <p className="gen-draft-summary">{draft.summary}</p>

                {expandedId === draft.id && (
                  <div className="gen-draft-expanded">
                    {editingId === draft.id ? (
                      <div className="gen-edit-area">
                        <RichTextEditor value={editContent} onChange={setEditContent} label="Edit Content" />
                        <div className="gen-edit-actions">
                          <button className="admin-btn admin-btn-primary" onClick={() => handleSaveEdit(draft)}>Save</button>
                          <button className="admin-btn admin-btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="gen-draft-content" dangerouslySetInnerHTML={{ __html: draft.content }} />
                    )}

                    {draft.source_url && (
                      <a href={draft.source_url} target="_blank" rel="noopener noreferrer" className="gen-source-link">
                        <ExternalLink size={14} /> View Source Article
                      </a>
                    )}

                    {draft.tags.length > 0 && (
                      <div className="gen-draft-tags">
                        {draft.tags.map(tag => <span key={tag} className="tag-chip">{tag}</span>)}
                      </div>
                    )}
                  </div>
                )}

                <div className="gen-draft-actions">
                  {draft.status === 'pending' && (
                    <>
                      <button className="admin-btn admin-btn-primary" onClick={() => handleApprove(draft)}>
                        <Check size={14} /> Approve
                      </button>
                      <button className="admin-btn admin-btn-danger" onClick={() => handleReject(draft)}>
                        <X size={14} /> Reject
                      </button>
                    </>
                  )}
                  {draft.status === 'approved' && (
                    <button className="admin-btn admin-btn-primary" onClick={() => handlePublish(draft)}>
                      <Sparkles size={14} /> Publish
                    </button>
                  )}
                  {draft.status === 'published' && (
                    <span className="gen-published-badge">
                      <Check size={14} /> Published as {draft.published_id}
                    </span>
                  )}
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => { setEditingId(draft.id); setEditContent(draft.content); }}
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(draft)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="admin-form-card">
          <h3><Clock size={16} className="admin-icon-inline" /> Generation History</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Feeds</th>
                  <th>Found</th>
                  <th>Dupes</th>
                  <th>Generated</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.run_at).toLocaleString()}</td>
                    <td>{log.feeds_checked}</td>
                    <td>{log.items_found}</td>
                    <td>{log.items_duplicated}</td>
                    <td>{log.items_generated}</td>
                    <td>{(log.duration_ms / 1000).toFixed(1)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
