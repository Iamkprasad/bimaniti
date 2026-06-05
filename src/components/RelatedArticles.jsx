import PostCard from './PostCard';

export default function RelatedArticles({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="related-articles">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Related Coverage</h2>
      <div className="grid-2">
        {articles.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
