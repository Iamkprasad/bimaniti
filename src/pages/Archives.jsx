import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArchives } from '../services/archiveService';

export default function Archives() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getArchives()
      .then(setGroups)
      .catch(() => setError('Unable to load archives.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="container">
        <div className="page-header">
          <div className="eyebrow">Complete archive</div>
          <h1>Archives</h1>
          <p className="page-header-desc">
            A chronological listing of all blog posts and news items.
          </p>
        </div>

        {error && (
          <div style={{ padding: '2rem', color: 'var(--alert)' }}>{error}</div>
        )}

        {loading ? (
          <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>
            Loading archives...
          </div>
        ) : (
          <div style={{ paddingBottom: '4rem' }}>
            {groups.map(group => (
              <div key={group.label} style={{ marginBottom: '2.5rem' }}>
                <h2 className="archive-section-title">{group.label}</h2>
                {group.items.map(item => (
                  <Link
                    key={item.id}
                    to={`/post?id=${item.id}`}
                    className="archive-row"
                  >
                    <span className="archive-id">{item.id}</span>
                    <span className="archive-type">{item.type}</span>
                    <span className="archive-title">{item.title}</span>
                    <span className="archive-date">{item.published_date}</span>
                  </Link>
                ))}
              </div>
            ))}
            {groups.length === 0 && (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                No archives found.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
