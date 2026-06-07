import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './FeaturedPosts.css';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  author: string;
  published_date: string;
}

export const FeaturedPosts = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/blogs.json')
      .then(res => res.json())
      .then((data: BlogPost[]) => setBlogs(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || blogs.length === 0) return null;

  return (
    <section className="section-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="divider"></div>
          <h2 className="section-title">Latest from the Blog</h2>
          <p className="section-desc">In-depth analysis of insurance trends, regulatory developments, and market insights.</p>
        </div>
        <div className="grid-3">
          {blogs.map((blog) => (
            <Link key={blog.id} to={`/post/${blog.id}`} className="card-link">
              <article className="card">
                <div className="card-body">
                  <span className="card-label">{blog.category}</span>
                  <h3 className="card-title">{blog.title}</h3>
                  <p className="card-excerpt">{blog.summary}</p>
                  <div className="card-meta">
                    <span>{blog.published_date}</span>
                    <span>·</span>
                    <span>{blog.author}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/blog" className="btn-primary">View All Posts →</Link>
        </div>
      </div>
    </section>
  );
};
