import { useState, useEffect, useCallback } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { getContacts, updateContactStatus, deleteContact } from '../../services/admin';
import { ContactSubmission } from '../../types/admin';
import '../../components/admin/AdminComponents.css';

export const ContactsPage = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState<ContactSubmission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);

  const loadContacts = useCallback(async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  const handleView = async (contact: ContactSubmission) => {
    setViewing(contact);
    if (contact.status === 'new') {
      try {
        await updateContactStatus(contact.id, 'read');
        setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status: 'read' as const } : c));
      } catch { /* silent */ }
    }
  };

  const handleArchive = async (contact: ContactSubmission) => {
    try {
      await updateContactStatus(contact.id, 'archived');
      setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status: 'archived' as const } : c));
      setViewing(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to archive');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteContact(deleteTarget.id);
      setContacts(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const filtered = contacts.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.subject?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const newCount = contacts.filter(c => c.status === 'new').length;

  if (loading) return <div className="admin-loading">Loading contacts...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Contact Submissions {newCount > 0 && <span className="status-badge new" style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>{newCount} new</span>}</h1>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-filters">
        <input className="admin-input" placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }} />
        <select className="admin-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="empty-row">No contact submissions found.</td></tr>
            ) : (
              filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td><a href={`mailto:${c.email}`} style={{ color: 'var(--accent)' }}>{c.email}</a></td>
                  <td>{c.subject || '-'}</td>
                  <td><span className={`status-badge ${c.status}`}>{c.status}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="admin-btn-icon" title="View" onClick={() => handleView(c)}>
                      <Eye size={16} />
                    </button>
                    <button className="admin-btn-icon danger" title="Delete" onClick={() => setDeleteTarget(c)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <div className="contact-modal-overlay" onClick={() => setViewing(null)}>
          <div className="contact-modal" onClick={e => e.stopPropagation()}>
            <h3>{viewing.subject || 'Contact Submission'}</h3>
            <div className="meta">
              From: <strong>{viewing.name}</strong> ({viewing.email})<br />
              Date: {new Date(viewing.created_at).toLocaleString()}<br />
              Status: <span className={`status-badge ${viewing.status}`}>{viewing.status}</span>
            </div>
            <div className="message-body">{viewing.message}</div>
            <div className="modal-actions">
              {viewing.status !== 'archived' && (
                <button className="admin-btn admin-btn-secondary" onClick={() => handleArchive(viewing)}>Archive</button>
              )}
              <button className="admin-btn admin-btn-secondary" onClick={() => setViewing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Contact"
        message={`Delete submission from "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
