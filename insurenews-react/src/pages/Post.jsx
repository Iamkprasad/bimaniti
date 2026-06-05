import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getBlogById, getBlogBySlug } from '../services/blogService';
import { getNewsById, getNewsBySlug } from '../services/newsService';
import PostHero from '../components/PostHero';
import PreviousCoverage from '../components/PreviousCoverage';
import RelatedArticles from '../components/RelatedArticles';
import ShareButtons from '../components/ShareButtons';

export default function Post() {
  const [searchParams] = useSearchParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      setLoading(false);
      setError('No post specified.');
      return;
    }

    async function fetchPost() {
      setLoading(true);
      setError(null);
      try {
        let found = null;

        if (id) {
          try { found = await getBlogById(id); } catch {}
          if (!found) try { found = await getNewsById(id); } catch {}
        }

        if (!found && slug) {
          try { found = await getBlogBySlug(slug); } catch {}
          if (!found) try { found = await getNewsBySlug(slug); } catch {}
        }

        if (!found) {
          setError('Post not found.');
          return;
        }

        setPost(found);
        document.title = `${found.title} - Prasad Kulal`;

        if (found.related_ids && found.related_ids.length > 0) {
          const related = [];
          for (const relId of found.related_ids) {
            try {
              const r = await getBlogById(relId);
              if (r) related.push(r);
            } catch {
              try {
                const r = await getNewsById(relId);
                if (r) related.push(r);
              } catch {}
            }
          }
          setRelatedPosts(related);
        }
      } catch (err) {
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading post...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>{error}</h2>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const formatContent = (html) => {
    return { __html: html };
  };

  return (
    <div className="container">
      <PostHero post={post} />
      <div className="post-body-wrapper fade-up-delay">
        <PreviousCoverage previousCoverage={post.previous_coverage} />
        <div
          className="post-content"
          dangerouslySetInnerHTML={formatContent(post.content)}
        />
        <ShareButtons title={post.title} />
        <RelatedArticles articles={relatedPosts} />
      </div>
    </div>
  );
}
