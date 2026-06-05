import { Link } from 'react-router-dom';
import { CATEGORY_COLORS } from '../data/categories';

export default function NewsCard({ item }) {
  const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Life Insurance'];

  return (
    <Link to={`/post?id=${item.id}`} className="blog-card">
      <span
        className="blog-card-tag"
        style={{ color: colors.text }}
      >
        {item.category}
      </span>
      <h2 className="blog-card-title">{item.title}</h2>
      <p className="blog-card-excerpt">{item.summary}</p>
      <div className="blog-card-footer">
        <div className="blog-card-meta">
          <strong>{item.source || item.author}</strong> &middot; {item.published_date}
        </div>
        <span className="blog-card-more">Read more &rarr;</span>
      </div>
    </Link>
  );
}
