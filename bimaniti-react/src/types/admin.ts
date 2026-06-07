export type ContentType = 'blog' | 'news';

export interface BaseContent {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  author: string;
  published_date: string;
  read_time: string;
  summary: string;
  content: string;
  previous_coverage: string | null;
  related_ids: string[];
  featured_image?: string | null;
  is_published?: boolean;
  updated_at?: string;
}

export interface BlogPost extends BaseContent {
  source?: never;
}

export interface NewsItem extends BaseContent {
  source?: string;
}

export type AdminContent = BlogPost | NewsItem;

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'blog' | 'news';
  description?: string | null;
  color?: string | null;
  display_order: number;
}