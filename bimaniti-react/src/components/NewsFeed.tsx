import { Link } from 'react-router-dom';
import './NewsFeed.css';

interface NewsFeedProps {
  news: any[];
}

export const NewsFeed = ({ news }: NewsFeedProps) => {
  if (news.length === 0) {
    return (
      <p className="text-center text-muted py-12">
        No news items match your criteria.
      </p>
    );
  }

  return (
    <div className="news-grid">
      {news.map((item, i) => (
        <Link
          key={item.id}
          to={`/post/${item.id}`}
          className="news-card"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          <div className="news-card-content">
            <span className="news-card-tag">{item.category}</span>
            <h2 className="news-card-title">{item.title}</h2>
            <p className="news-card-excerpt">{item.summary}</p>
          </div>
          <div className="news-card-footer">
            <div className="news-card-meta">
              <strong>{item.source || item.author}</strong> · {item.published_date}
            </div>
            <span className="news-card-read-more">Read →</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
