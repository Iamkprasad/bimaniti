import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import './About.css';

const focusCards = [
  {
    title: 'IRDAI Regulatory Watch',
    description: 'Tracking every circular, exposure draft, and governance reform from the Insurance Regulatory and Development Authority of India.',
  },
  {
    title: 'Insurer Performance',
    description: 'Deep dives into quarterly and annual results of listed and unlisted insurers — PAT, VNB, margins, solvency, and persistency.',
  },
  {
    title: 'Product & Policy Trends',
    description: 'Analysing how products evolve with regulation — from linked to non-linked, indemnity to defined benefit, and everything in between.',
  },
  {
    title: 'Motor & Health Segments',
    description: 'Focused coverage on India\'s largest insurance segments — motor third-party pricing, health insurance growth, and GST impact.',
  },
];

const recentWriting = [
  { id: 'BLG-012', title: "IRDAI's New KMP Governance: Linking Pay to Performance" },
  { id: 'BLG-004', title: 'Motor Insurance in India: A Comprehensive Analysis' },
  { id: 'BLG-017', title: 'Health Insurance Trends in India' },
];

export const About = () => {
  return (
    <>
      <PageHeader
        eyebrow="Insurance Analysis · India"
        title="BimaNiti"
        description="Independent insurance analysis & research"
      />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="about-bio">
          <p>
            BimaNiti provides independent insurance analysis and research focused exclusively on the Indian insurance sector.
            From complex regulatory changes to market dynamics, this platform delivers well-researched
            insights for professionals, investors, and enthusiasts navigating the evolving landscape of
            Indian insurance.
          </p>
          <p>
            Coverage spans life insurance, general insurance, health insurance, motor insurance, and regulatory
            developments from IRDAI. All analysis is data-driven and independent — free from the conflicts
            of interest that often colour mainstream financial commentary.
          </p>
        </div>

        <div className="about-divider"></div>

        <h2 className="about-section-title">Areas of Focus</h2>
        <div className="about-focus-grid">
          {focusCards.map((card) => (
            <div key={card.title} className="about-focus-card">
              <h3 className="about-focus-title">{card.title}</h3>
              <p className="about-focus-desc">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="about-divider"></div>

        <h2 className="about-section-title">Recent Writing</h2>
        <div className="about-recent-list">
          {recentWriting.map((item) => (
            <Link key={item.id} to={`/post/${item.id}`} className="about-recent-item">
              <span className="about-recent-id">{item.id}</span>
              <span className="about-recent-title">{item.title}</span>
              <span className="about-recent-arrow">→</span>
            </Link>
          ))}
        </div>

        <div className="about-divider"></div>

        <div className="about-connect">
          <p>Have questions or feedback?</p>
          <div className="about-connect-actions">
            <Link to="/contact" className="btn-primary">Send a Message</Link>
          </div>
        </div>
      </div>
    </>
  );
};
