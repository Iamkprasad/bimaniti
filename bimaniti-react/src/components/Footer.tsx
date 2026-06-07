import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="footer-content">
          <div>
            <Link to="/" className="footer-brand-link">
              <span className="footer-brand-text">BimaNiti</span>
            </Link>
            <p className="footer-desc">Independent Insurance Analysis · India</p>
          </div>
          <div className="footer-links">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/blog" className="footer-link">Blog</Link>
            <Link to="/news" className="footer-link">News</Link>
            <Link to="/archives" className="footer-link">Archives</Link>
            <Link to="/about" className="footer-link">About</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </div>
        </div>
        <p className="footer-copyright">
          © {new Date().getFullYear()} BimaNiti
        </p>
        <p className="footer-disclaimer">
          Not investment advice. This site is for informational purposes only.
        </p>
      </div>
    </footer>
  );
};
