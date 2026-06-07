import { supabase } from './supabase';
import { fetchAllFeeds, isInsuranceRelevant, deduplicateItems, RSSItem } from './rss';
import { generateBlogPost, generateNewsItem, categorizeArticle, GeneratedContent } from './gemini';

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function cleanDescription(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent?.trim().slice(0, 500) || '';
}

// ── Types ──
export interface GeneratedDraft {
  id: string;
  content_type: 'blog' | 'news';
  title: string;
  slug: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  source_url: string | null;
  source_name: string | null;
  source_title: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  reviewed_by: string | null;
  reviewed_at: string | null;
  published_id: string | null;
  ai_model: string | null;
  ai_prompt: string | null;
  created_at: string;
}

export interface GenerationResult {
  feedsChecked: number;
  itemsFound: number;
  itemsFiltered: number;
  itemsDuplicated: number;
  itemsGenerated: number;
  drafts: GeneratedDraft[];
  errors: string[];
  durationMs: number;
}

export interface FeedStatus {
  name: string;
  url: string;
  is_active: boolean;
  last_fetched: string | null;
  last_item_count: number;
}

// ── Fetch RSS feeds and return status ──
export async function getFeedStatuses(): Promise<FeedStatus[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('rss_feeds').select('*').order('name');
  return data || [];
}

export async function toggleFeed(id: string, isActive: boolean): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  await supabase.from('rss_feeds').update({ is_active: isActive }).eq('id', id);
}

// ── Get existing content titles for dedup ──
async function getExistingContent(): Promise<{ titles: string[]; slugs: string[] }> {
  if (!supabase) return { titles: [], slugs: [] };

  const [blogsRes, newsRes] = await Promise.all([
    supabase.from('blogs').select('title, slug'),
    supabase.from('news').select('title, slug'),
  ]);

  const titles = [
    ...(blogsRes.data || []).map(b => b.title),
    ...(newsRes.data || []).map(n => n.title),
  ];
  const slugs = [
    ...(blogsRes.data || []).map(b => b.slug),
    ...(newsRes.data || []).map(n => n.slug),
  ];

  return { titles, slugs };
}

// ── Get pending drafts ──
export async function getDrafts(status?: string): Promise<GeneratedDraft[]> {
  if (!supabase) return [];
  let query = supabase.from('generated_drafts').select('*').order('created_at', { ascending: false });
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(d => ({
    ...d,
    tags: Array.isArray(d.tags) ? d.tags : [],
  }));
}

// ── Update draft status ──
export async function updateDraftStatus(
  id: string,
  status: 'approved' | 'rejected' | 'published',
  publishedId?: string
): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const update: Record<string, unknown> = {
    status,
    reviewed_at: new Date().toISOString(),
  };
  if (publishedId) update.published_id = publishedId;
  const { error } = await supabase.from('generated_drafts').update(update).eq('id', id);
  if (error) throw error;
}

// ── Edit draft ──
export async function updateDraft(id: string, updates: Partial<GeneratedDraft>): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('generated_drafts').update(updates).eq('id', id);
  if (error) throw error;
}

// ── Delete draft ──
export async function deleteDraft(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('generated_drafts').delete().eq('id', id);
  if (error) throw error;
}

// ── Publish draft to blogs/news table ──
export async function publishDraft(id: string): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured');

  const { data: draft, error: fetchError } = await supabase
    .from('generated_drafts')
    .select('*')
    .eq('id', id)
    .single();
  if (fetchError || !draft) throw new Error('Draft not found');

  const table = draft.content_type === 'blog' ? 'blogs' : 'news';
  const prefix = draft.content_type === 'blog' ? 'BLG' : 'NWS';

  const { data: existing } = await supabase.from(table).select('id');
  const nums = (existing || []).map((r: { id: string }) => parseInt(r.id.split('-')[1] || '0', 10));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  const newId = `${prefix}-${String(max + 1).padStart(3, '0')}`;

  const now = new Date().toISOString();
  const record: Record<string, unknown> = {
    id: newId,
    slug: draft.slug,
    title: draft.title,
    category: draft.category,
    tags: draft.tags,
    author: 'BimaNiti',
    source: draft.content_type === 'news' ? draft.source_name : undefined,
    published_date: new Date().toISOString().split('T')[0],
    read_time: draft.read_time,
    summary: draft.summary,
    content: draft.content,
    featured_image: null,
    previous_coverage: null,
    related_ids: [],
    is_published: true,
    created_at: now,
    updated_at: now,
  };

  const { error: insertError } = await supabase.from(table).insert(record);
  if (insertError) throw insertError;

  await updateDraftStatus(id, 'published', newId);
  return newId;
}

// ── Main generation run ──
export async function runContentGeneration(
  onProgress?: (msg: string) => void
): Promise<GenerationResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  let itemsGenerated = 0;

  onProgress?.('Fetching RSS feeds...');

  const feeds = await getFeedStatuses();
  const rssItems = await fetchAllFeeds(feeds);

  onProgress?.(`Found ${rssItems.length} items from ${feeds.filter(f => f.is_active).length} feeds`);

  const relevantItems = rssItems.filter(isInsuranceRelevant);
  onProgress?.(`${relevantItems.length} insurance-relevant items after filtering`);

  const { titles: existingTitles, slugs: existingSlugs } = await getExistingContent();
  const newItems = deduplicateItems(relevantItems, existingTitles, existingSlugs);
  onProgress?.(`${newItems.length} new items after deduplication (${relevantItems.length - newItems.length} duplicates removed)`);

  const drafts: GeneratedDraft[] = [];

  for (const item of newItems.slice(0, 10)) {
    try {
      onProgress?.(`Generating content for: ${item.title.slice(0, 50)}...`);

      const input = {
        sourceTitle: item.title,
        sourceDescription: cleanDescription(item.description),
        sourceName: item.source,
        existingTitles,
      };

      let generated: GeneratedContent;
      const isNews = item.title.length < 80 && cleanDescription(item.description).length < 300;

      if (isNews) {
        generated = await generateNewsItem(input);
      } else {
        generated = await generateBlogPost(input);
      }

      const slug = generateSlug(generated.title);

      const draftData = {
        content_type: isNews ? 'news' as const : 'blog' as const,
        title: generated.title,
        slug,
        category: generated.category,
        tags: generated.tags,
        summary: generated.summary,
        content: generated.content,
        source_url: item.link,
        source_name: item.source,
        source_title: item.title,
        status: 'pending' as const,
        ai_model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash',
        ai_prompt: '',
      };

      const { data: saved, error: saveError } = await supabase!
        .from('generated_drafts')
        .insert(draftData)
        .select()
        .single();

      if (!saveError && saved) {
        drafts.push({ ...saved, tags: Array.isArray(saved.tags) ? saved.tags : [] });
        itemsGenerated++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      errors.push(`Failed for "${item.title.slice(0, 40)}": ${msg}`);
    }
  }

  // Update feed last_fetched timestamps
  await Promise.all(
    feeds.map(f =>
      supabase!.from('rss_feeds').update({
        last_fetched: new Date().toISOString(),
        last_item_count: rssItems.filter(i => i.source === f.name).length,
      }).eq('name', f.name)
    )
  );

  const durationMs = Date.now() - startTime;

  // Log the generation run
  await supabase!.from('generation_logs').insert({
    feeds_checked: feeds.filter(f => f.is_active).length,
    items_found: rssItems.length,
    items_duplicated: relevantItems.length - newItems.length,
    items_generated: itemsGenerated,
    ai_model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash',
    errors,
    duration_ms: durationMs,
  });

  return {
    feedsChecked: feeds.filter(f => f.is_active).length,
    itemsFound: rssItems.length,
    itemsFiltered: relevantItems.length,
    itemsDuplicated: relevantItems.length - newItems.length,
    itemsGenerated,
    drafts,
    errors,
    durationMs,
  };
}

// ── Get generation logs ──
export async function getGenerationLogs(): Promise<Array<{
  id: string;
  run_at: string;
  feeds_checked: number;
  items_found: number;
  items_duplicated: number;
  items_generated: number;
  ai_model: string;
  errors: string[];
  duration_ms: number;
}>> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('generation_logs')
    .select('*')
    .order('run_at', { ascending: false })
    .limit(20);
  return data || [];
}
