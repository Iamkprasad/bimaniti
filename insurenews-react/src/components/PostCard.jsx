import { Link } from 'react-router-dom';
import { CATEGORY_COLORS } from '../data/categories';

export default function PostCard({ post, type = 'blog' }) {
  const colors = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['Life Insurance'];

  return (
    <Link to={`/post?id=${post.id}`} className="post-card">
      <span
        className="blog-card-tag"
        style={{ color: colors.text }}
      >
        {post.category}
      </span>
      <h3 style={{ fontSize: '18px', marginBottom: '0.5rem' }}>{post.title}</h3>
      <p className="blog-card-excerpt">{post.summary}</p>
      <div className="blog-card-meta" style={{ marginTop: '0.75rem' }}>
        <strong>{post.author}</strong> &middot; {post.published_date}
      </div>
    </Link>
  );
}
