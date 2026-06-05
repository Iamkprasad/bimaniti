import { supabase } from '../lib/supabase';

export async function getBlogs({ category, search, limit, offset } = {}) {
  let query = supabase
    .from('blogs')
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

export async function getBlogById(id) {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getBlogBySlug(slug) {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}

export async function createBlog(blog) {
  const { data, error } = await supabase
    .from('blogs')
    .insert(blog)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBlog(id, updates) {
  const { data, error } = await supabase
    .from('blogs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBlog(id) {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getAllBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('published_date', { ascending: false });
  if (error) throw error;
  return data || [];
}
