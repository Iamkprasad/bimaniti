import { Link } from 'react-router-dom';
import './FeedCards.css';

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
    <div className="feed-grid">
      {news.map((item, i) => (
        <Link
          key={item.id}
          to={`/post/${item.id}`}
          className="feed-card"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          <div className="feed-card-content">
            <span className="feed-card-tag">{item.category}</span>
            <h2 className="feed-card-title">{item.title}</h2>
            <p className="feed-card-excerpt">{item.summary}</p>
          </div>
          <div className="feed-card-footer">
            <div className="feed-card-meta">
              <strong>{item.source || item.author}</strong> · {item.published_date}
            </div>
            <span className="feed-card-read-more">Read →</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
