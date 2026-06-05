import { useState, useEffect, useCallback } from 'react';
import { getNews } from '../services/newsService';

export function useNews({ category = 'all', search = '', limit, autoFetch = true } = {}) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNews({ category, search, limit });
      setNews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, search, limit]);

  useEffect(() => {
    if (autoFetch) fetchNews();
  }, [autoFetch, fetchNews]);

  return { news, loading, error, refetch: fetchNews };
}
