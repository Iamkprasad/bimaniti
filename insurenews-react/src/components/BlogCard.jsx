import { Link } from 'react-router-dom';
import { CATEGORY_COLORS } from '../data/categories';

export default function BlogCard({ post }) {
  const colors = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['Life Insurance'];

  return (
    <Link to={`/post?id=${post.id}`} className="blog-card">
      <span
        className="blog-card-tag"
        style={{ color: colors.text }}
      >
        {post.category}
      </span>
      <h2 className="blog-card-title">{post.title}</h2>
      <p className="blog-card-excerpt">{post.summary}</p>
      <div className="blog-card-footer">
        <div className="blog-card-meta">
          <strong>{post.author}</strong> &middot; {post.published_date} &middot; {post.read_time}
        </div>
        <span className="blog-card-more">Read more &rarr;</span>
      </div>
    </Link>
  );
}
