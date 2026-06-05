import { CATEGORY_COLORS } from '../data/categories';

export default function PostHero({ post }) {
  const colors = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['Life Insurance'];

  return (
    <div className="post-hero fade-up">
      <span
        className="blog-card-tag"
        style={{ color: colors.text }}
      >
        {post.category}
      </span>
      <h1>{post.title}</h1>
      <div className="post-byline">
        <strong>{post.author}</strong> &middot; {post.published_date}
        {post.read_time && <> &middot; {post.read_time}</>}
        {post.source && <> &middot; {post.source}</>}
      </div>
    </div>
  );
}
