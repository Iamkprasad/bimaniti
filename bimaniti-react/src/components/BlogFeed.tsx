import { Link } from 'react-router-dom';
import './FeedCards.css';

interface BlogFeedProps {
  blogs: any[];
}

export const BlogFeed = ({ blogs }: BlogFeedProps) => {
  if (blogs.length === 0) {
    return (
      <p className="text-center text-muted py-12">
        No posts match your criteria.
      </p>
    );
  }

  return (
    <div className="feed-grid">
      {blogs.map((blog, i) => (
        <Link
          key={blog.id}
          to={`/post/${blog.id}`}
          className="feed-card"
          style={{ '--i': i } as React.CSSProperties}
        >
          <div className="feed-card-content">
            <span className="feed-card-tag">{blog.category}</span>
            <h2 className="feed-card-title">{blog.title}</h2>
            <p className="feed-card-excerpt">{blog.summary}</p>
          </div>
          <div className="feed-card-footer">
            <div className="feed-card-meta">
              <strong>{blog.author}</strong> · {blog.published_date} · {blog.read_time}
            </div>
            <span className="feed-card-read-more">Read →</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
