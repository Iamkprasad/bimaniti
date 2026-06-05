import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <div className="container">
        <div className="page-header">
          <div className="eyebrow">Insurance Analysis . India</div>
          <h1>Prasad Chandra Kulal</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--accent)', marginBottom: '1.5rem' }}>
            Independent insurance analyst &amp; researcher
          </p>
          <p style={{ marginBottom: '1rem' }}>
            I am an independent insurance analyst focused exclusively on the Indian insurance
            sector. My work covers IRDAI regulatory developments, insurer financial performance
            analysis, product trends, and market dynamics across life, general, health, and motor
            insurance segments.
          </p>
          <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />
          <p>
            With a data-driven approach, I provide in-depth analysis of quarterly and annual
            results, premium growth trajectories, VNB margins, solvency ratios, and the
            evolving regulatory framework that shapes India&apos;s insurance landscape.
          </p>
        </div>

        <div className="about-content">
          <h2 style={{ marginBottom: '1.5rem' }}>Focus Areas</h2>
          <div className="focus-grid">
            <div className="focus-card">
              <h3>IRDAI Regulatory Watch</h3>
              <p>Tracking circulars, exposure drafts, governance changes, RBC framework updates, and Ind AS 117 implementation.</p>
            </div>
            <div className="focus-card">
              <h3>Insurer Performance</h3>
              <p>Quarterly and annual results analysis for LIC, SBI Life, HDFC Life, ICICI Prudential, ICICI Lombard, and other major insurers.</p>
            </div>
            <div className="focus-card">
              <h3>Product &amp; Policy Trends</h3>
              <p>Analysis of new product launches, pricing trends, distribution shifts, and market structure changes.</p>
            </div>
            <div className="focus-card">
              <h3>Motor &amp; Health Segments</h3>
              <p>Deep dives into motor insurance pricing, third-party premiums, health insurance growth, and standalone health insurer performance.</p>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

          <h2 style={{ marginBottom: '1.5rem' }}>Recent Writing</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/post?id=BLG-012" className="blog-card" style={{ padding: '1rem 1.25rem' }}>
              <h3 style={{ fontSize: '16px' }}>IRDAI&apos;s New KMP Governance</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>BLG-012</p>
            </Link>
            <Link to="/post?id=BLG-004" className="blog-card" style={{ padding: '1rem 1.25rem' }}>
              <h3 style={{ fontSize: '16px' }}>Motor Insurance in India</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>BLG-004</p>
            </Link>
            <Link to="/post?id=BLG-017" className="blog-card" style={{ padding: '1rem 1.25rem' }}>
              <h3 style={{ fontSize: '16px' }}>Health Insurance Trends</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>BLG-017</p>
            </Link>
          </div>

          <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Connect</h2>
            <a
              href="https://www.linkedin.com/in/prasadkulal/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
