import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Blog' },
  { to: '/news', label: 'News' },
  { to: '/archives', label: 'Archives' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="footer py-24 px-6">
      <div className="footer-content">
        <div>
          <div className="footer-brand">
            Prasad<span className="logo-accent"> Kulal</span>
          </div>
          <div className="footer-desc">Independent Insurance Analysis . India</div>
        </div>
        <div className="footer-links">
          {FOOTER_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="footer-link">{label}</Link>
          ))}
          <a
            href="https://www.linkedin.com/in/prasadkulal/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
          >
            LinkedIn
          </a>
        </div>
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Prasad Chandra Kulal
      </div>
      <div className="footer-disclaimer">
        Not investment advice. This site is for informational purposes only.
      </div>
    </footer>
  );
}
