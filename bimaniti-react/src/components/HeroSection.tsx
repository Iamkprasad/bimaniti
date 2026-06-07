import { Link } from 'react-router-dom';
import './HeroSection.css';

export const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-eyebrow fade-in">Insurance &amp; Market Analysis</div>
        <h1 className="hero-title fade-in-up" style={{ animationDelay: '0.2s' }}>
          BimaNiti
        </h1>
        <p className="hero-desc fade-in" style={{ animationDelay: '0.4s' }}>
          Analysing markets, decoding insurance, and sharing insights that matter.
          A curated platform for insurance analysis, market research, and financial perspectives.
        </p>
        <div className="hero-actions fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link to="/blog" className="btn-primary">
            Explore Blog
          </Link>
          <Link to="/about" className="btn-outline">
            About
          </Link>
        </div>
        
      </div>
    </section>
  );
};
