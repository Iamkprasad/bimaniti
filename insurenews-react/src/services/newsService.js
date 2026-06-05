import { supabase } from '../lib/supabase';

export async function getNews({ category, search, limit, offset } = {}) {
  let query = supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_date', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
  }
  if (limit) query = query.limit(limit);
  if (offset) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getNewsById(id) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getNewsBySlug(slug) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}

export async function createNews(news) {
  const { data, error } = await supabase
    .from('news')
    .insert(news)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNews(id, updates) {
  const { data, error } = await supabase
    .from('news')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNews(id) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getAllNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_date', { ascending: false });
  if (error) throw error;
  return data || [];
}
