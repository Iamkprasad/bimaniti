import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LatestNews.css';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  author: string;
  source?: string;
  published_date: string;
}

export const LatestNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/news.json')
      .then(res => res.json())
      .then((data: NewsItem[]) => setNews(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || news.length === 0) return null;

  return (
    <section className="latest-news-section py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="divider"></div>
          <h2 className="section-title">Market News & Updates</h2>
          <p className="section-desc">Stay informed with the latest developments in the Indian insurance and financial markets.</p>
        </div>
        <div className="space-y-4">
          {news.map((item) => (
            <Link key={item.id} to={`/post/${item.id}`} className="post-card">
              <div className="post-card-top">
                <span className="news-source">{item.source || item.author}</span>
                <span className="post-card-date">{item.published_date}</span>
              </div>
              <h3 className="post-card-title">{item.title}</h3>
              <p className="post-card-desc">{item.summary}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/news" className="btn-primary">View All News →</Link>
        </div>
      </div>
    </section>
  );
};
