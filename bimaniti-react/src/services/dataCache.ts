const cache = new Map<string, unknown>();

export async function fetchCached<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);

  const data = await res.json();
  cache.set(url, data);
  return data;
}

export function getCachedBlogs() {
  return fetchCached<any[]>('/data/blogs.json');
}

export function getCachedNews() {
  return fetchCached<any[]>('/data/news.json');
}

export function clearCache() {
  cache.clear();
}
