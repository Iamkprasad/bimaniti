import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShareButtons } from '../components/ShareButtons';
import './Post.css';

export const Post = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Post ID not provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch from both blogs and news data
        const [blogsResponse, newsResponse] = await Promise.all([
          fetch('/data/blogs.json'),
          fetch('/data/news.json')
        ]);

        if (!blogsResponse.ok) {
          throw new Error(`Failed to fetch blogs: ${blogsResponse.status}`);
        }
        if (!newsResponse.ok) {
          throw new Error(`Failed to fetch news: ${newsResponse.status}`);
        }

        const blogs = await blogsResponse.json();
        const news = await newsResponse.json();
        const allItems = [...blogs, ...news];

        const foundPost = allItems.find(item => item.id === id);

        if (!foundPost) {
          throw new Error('Post not found');
        }

        setPost(foundPost);

        // Fetch related posts (same category, exclude current)
        const related = allItems
          .filter(item => item.category === foundPost.category && item.id !== id)
          .slice(0, 3);

        setRelatedPosts(related);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  if (!post) return <div className="text-center py-20">Post not found.</div>;

  // Process content to convert basic markdown-like formatting
  const processedContent = post.content
    ? post.content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/__(.*?)__/g, '<u>$1</u>') // Underline
        .replace(/## (.*?)/g, '<h2>$1</h2>') // H2
        .replace(/### (.*?)/g, '<h3>$1</h3>') // H3
        .replace(/\n/g, '<br>') // Newlines
    : '';

  return (
    <>
      <div className="post-hero">
        <div className="post-hero-inner">
          <span className="post-hero-tag">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="post-hero-byline">
            <strong>{post.author || 'BimaNiti'}</strong> · {post.published_date} · {post.read_time || '6 min read'}
          </div>
        </div>
      </div>

      <div className="post-content" dangerouslySetInnerHTML={{ __html: processedContent }} />

      {/* Previous coverage banner */}
      {post.previous_coverage && (
        <div className="prev-coverage-banner">
          Earlier coverage:
          <Link to={`/post/${post.previous_coverage.id}`}>{post.previous_coverage.title}</Link> →
        </div>
      )}

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <div className="related-articles">
          <div className="related-title">Related Coverage</div>
          <div className="related-list">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                to={`/post/${related.id}`}
                className="related-item"
              >
                <span className="related-tag">{related.category}</span>
                <div className="related-title-text">{related.title}</div>
                <div className="related-date">{related.published_date}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Share buttons */}
      <div className="post-share">
        <span>Share this article</span>
        <ShareButtons url={window.location.href} title={post.title} />
      </div>

      {/* Sources section */}
      <div className="post-sources">
        <span>Sources: {post.sources || 'Various financial news outlets and reports'}</span>
      </div>
    </>
  );
};