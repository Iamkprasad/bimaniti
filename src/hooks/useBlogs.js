import { useState, useEffect, useCallback } from 'react';
import { getBlogs } from '../services/blogService';

export function useBlogs({ category = 'all', search = '', limit, autoFetch = true } = {}) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBlogs({ category, search, limit });
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, search, limit]);

  useEffect(() => {
    if (autoFetch) fetchBlogs();
  }, [autoFetch, fetchBlogs]);

  return { blogs, loading, error, refetch: fetchBlogs };
}
