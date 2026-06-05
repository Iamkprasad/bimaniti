import { Link } from 'react-router-dom';
import StackingGallery from '../components/StackingGallery';
import PostCard from '../components/PostCard';
import NewsCard from '../components/NewsCard';
import { useBlogs } from '../hooks/useBlogs';
import { useNews } from '../hooks/useNews';

export default function Home() {
  const { blogs } = useBlogs({ limit: 3 });
  const { news } = useNews({ limit: 3 });

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">Insurance & Market Analysis</div>
          <h1>Prasad Chandra Kulal</h1>
          <p className="hero-desc">
            Independent insurance analyst and researcher focused exclusively
            on the Indian insurance sector. In-depth analysis of IRDAI regulations,
            insurer performance, and market trends.
          </p>
          <div className="hero-buttons">
            <Link to="/blog" className="btn-primary">Explore Blog</Link>
            <Link to="/about" className="btn-outline">About Me</Link>
            <a
              href="https://www.linkedin.com/in/prasadkulal/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <StackingGallery />

      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">Latest from the Blog</h2>
          <Link to="/blog" className="btn-outline">View All Posts</Link>
        </div>
        <div className="grid-3">
          {blogs.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">Market News & Updates</h2>
          <Link to="/news" className="btn-outline">View All News</Link>
        </div>
        <div className="grid-3">
          {news.map(item => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="section container" style={{ paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <div className="eyebrow">About the Author</div>
          <h2 style={{ marginBottom: '1rem' }}>Prasad Chandra Kulal</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Independent insurance analyst and researcher covering India&apos;s insurance
            sector. Focused on IRDAI regulatory developments, insurer financial performance,
            and product trends across life, general, health, and motor segments.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/about" className="btn-primary">More About Me</Link>
            <a
              href="https://www.linkedin.com/in/prasadkulal/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
