import { supabase } from './supabase';
import { BlogPost, NewsItem, ContactSubmission, Category, AdminContent, ContentType } from '../types/admin';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function nextId(type: ContentType, items: { id: string }[]): string {
  const prefix = type === 'blog' ? 'BLG' : 'NWS';
  const nums = items.map(i => parseInt(i.id.split('-')[1] || '0', 10));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

function normalizeTags(tags: string[] | string | null): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try { return JSON.parse(tags); } catch { return [tags]; }
  }
  return [];
}

function normalizeRelatedIds(ids: string[] | string | null): string[] {
  if (!ids) return [];
  if (Array.isArray(ids)) return ids;
  if (typeof ids === 'string') {
    try { return JSON.parse(ids); } catch { return ids ? [ids] : []; }
  }
  return [];
}

// ── Blogs ──
export async function getBlogs(): Promise<BlogPost[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('published_date', { ascending: false });
  if (error) throw error;
  return (data || []).map(row => ({
    ...row,
    tags: normalizeTags(row.tags),
    related_ids: normalizeRelatedIds(row.related_ids),
  }));
}

export async function createBlog(data: Omit<BlogPost, 'id' | 'slug'>): Promise<BlogPost> {
  if (!supabase) throw new Error('Supabase not configured');
  const existing = await getBlogs();
  const id = nextId('blog', existing);
  const slug = generateSlug(data.title);
  const now = new Date().toISOString();
  const { data: created, error } = await supabase
    .from('blogs')
    .insert({ ...data, id, slug, is_published: true, created_at: now, updated_at: now })
    .select()
    .single();
  if (error) throw error;
  return { ...created, tags: normalizeTags(created.tags), related_ids: normalizeRelatedIds(created.related_ids) };
}

export async function updateBlog(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
  if (!supabase) throw new Error('Supabase not configured');
  const update: Record<string, unknown> = { ...data, updated_at: new Date().toISOString() };
  if (data.title && !data.slug) update.slug = generateSlug(data.title);
  const { data: updated, error } = await supabase
    .from('blogs')
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return { ...updated, tags: normalizeTags(updated.tags), related_ids: normalizeRelatedIds(updated.related_ids) };
}

export async function deleteBlog(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw error;
}

// ── News ──
export async function getNews(): Promise<NewsItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_date', { ascending: false });
  if (error) throw error;
  return (data || []).map(row => ({
    ...row,
    tags: normalizeTags(row.tags),
    related_ids: normalizeRelatedIds(row.related_ids),
  }));
}

export async function createNews(data: Omit<NewsItem, 'id' | 'slug'>): Promise<NewsItem> {
  if (!supabase) throw new Error('Supabase not configured');
  const existing = await getNews();
  const id = nextId('news', existing);
  const slug = generateSlug(data.title);
  const now = new Date().toISOString();
  const { data: created, error } = await supabase
    .from('news')
    .insert({ ...data, id, slug, is_published: true, created_at: now, updated_at: now })
    .select()
    .single();
  if (error) throw error;
  return { ...created, tags: normalizeTags(created.tags), related_ids: normalizeRelatedIds(created.related_ids) };
}

export async function updateNews(id: string, data: Partial<NewsItem>): Promise<NewsItem> {
  if (!supabase) throw new Error('Supabase not configured');
  const update: Record<string, unknown> = { ...data, updated_at: new Date().toISOString() };
  if (data.title && !data.slug) update.slug = generateSlug(data.title);
  const { data: updated, error } = await supabase
    .from('news')
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return { ...updated, tags: normalizeTags(updated.tags), related_ids: normalizeRelatedIds(updated.related_ids) };
}

export async function deleteNews(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) throw error;
}

// ── Contacts ──
export async function getContacts(): Promise<ContactSubmission[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateContactStatus(id: string, status: ContactSubmission['status']): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('contacts').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteContact(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw error;
}

// ── Categories ──
export async function getCategories(): Promise<Category[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<Category> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data: created, error } = await supabase
    .from('categories')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return created;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data: updated, error } = await supabase
    .from('categories')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return updated;
}

export async function deleteCategory(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ── Images ──
export async function uploadImage(file: File, folder: 'blogs' | 'news'): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured');
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('content-images').upload(path, file);
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('content-images').getPublicUrl(path);
  return urlData.publicUrl;
}

export { generateSlug };
