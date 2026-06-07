import { Link } from 'react-router-dom';
import './BlogFeed.css';

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
    <div className="blog-grid">
      {blogs.map((blog, i) => (
        <Link
          key={blog.id}
          to={`/post/${blog.id}`}
          className="blog-card"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          <div className="blog-card-content">
            <span className="blog-card-tag">{blog.category}</span>
            <h2 className="blog-card-title">{blog.title}</h2>
            <p className="blog-card-excerpt">{blog.summary}</p>
          </div>
          <div className="blog-card-footer">
            <div className="blog-card-meta">
              <strong>{blog.author}</strong> · {blog.published_date} · {blog.read_time}
            </div>
            <span className="blog-card-read-more">Read →</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
