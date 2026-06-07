import './StackingSection.css';

const stacks = [
  {
    id: 'market-analysis',
    title: 'Market Analysis',
    desc: 'Deep dives into insurance market trends, premium growth, and sector performance with data-driven insights.',
    icon: 'M3 20h18M6 20V8l4-4 4 4v12M18 20V6l-4 4'
  },
  {
    id: 'regulatory-updates',
    title: 'Regulatory Insights',
    desc: 'Tracking IRDAI reforms, policy changes, and their impact on the Indian insurance ecosystem.',
    icon: 'M12 3v18M4 7h16M4 12h16M4 17h16'
  },
  {
    id: 'health-insurance',
    title: 'Health Insurance',
    desc: 'Comprehensive analysis of health insurance trends, GST impacts, and coverage expansion in India.',
    icon: 'M12 21s-8-4.5-8-10a6 6 0 0112 0 6 6 0 0112 0c0 5.5-8 10-8 10z'
  },
  {
    id: 'investment',
    title: 'Investment Perspectives',
    desc: 'Evaluating insurance sector stocks, valuations, and long-term growth opportunities for investors.',
    icon: 'M12 2v20M17 7l-5 5-5-5M7 17l5-5 5 5'
  },
  {
    id: 'digital-transformation',
    title: 'Digital Insurance',
    desc: 'Exploring how technology, AI, and insurtech are reshaping the insurance value chain.',
    icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'
  }
];

export const StackingSection = () => {
  return (
    <section className="stacking-section">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="divider"></div>
          <h2 className="section-title">Explore by Topic</h2>
          <p className="section-desc">Curated analysis across key areas of the Indian insurance landscape.</p>
        </div>
        <div className="stacking-grid">
          {stacks.map((stack, index) => (
            <div key={stack.id} className={`stack-card stack-card-${index + 1}`}>
              <div className="stack-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={stack.icon} />
                </svg>
              </div>
              <h3 className="stack-card-title">{stack.title}</h3>
              <p className="stack-card-desc">{stack.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
