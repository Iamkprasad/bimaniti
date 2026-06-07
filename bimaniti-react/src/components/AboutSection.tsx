import { Link } from 'react-router-dom';
import './AboutSection.css';

export const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="max-w-4xl mx-auto text-center">
        <div className="about-eyebrow">Independent Analysis</div>
        <p className="about-desc">
          Well-researched insights on the Indian insurance sector,
          regulatory developments, and financial market trends — free from conflicts of interest.
        </p>
        <div className="about-actions">
          <Link to="/about" className="btn-outline">More About BimaNiti</Link>
        </div>
      </div>
    </section>
  );
};
