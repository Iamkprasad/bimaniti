import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
      <div className="eyebrow">Page not found</div>
      <h1 style={{ marginBottom: '1rem' }}>404</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
