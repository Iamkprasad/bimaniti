import { buildPrompt, BLOG_PROMPT, NEWS_PROMPT, CATEGORIZE_PROMPT } from '../prompts/contentPrompts';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function getApiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!key) throw new Error('VITE_GEMINI_API_KEY not set in .env');
  return key;
}

function getModel(): string {
  return import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = getApiKey();
  const model = getModel();
  const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(err)}`);
  }

  const data: GeminiResponse = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

function extractJSON(text: string): Record<string, unknown> {
  let cleaned = text.trim();
  const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) cleaned = jsonMatch[1].trim();

  const braceStart = cleaned.indexOf('{');
  const braceEnd = cleaned.lastIndexOf('}');
  if (braceStart >= 0 && braceEnd > braceStart) {
    cleaned = cleaned.slice(braceStart, braceEnd + 1);
  }

  return JSON.parse(cleaned);
}

export interface GeneratedContent {
  title: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  read_time: string;
}

export interface GenerateContentInput {
  type: 'blog' | 'news';
  sourceTitle: string;
  sourceDescription: string;
  sourceName: string;
  existingTitles: string[];
}

export async function generateBlogPost(input: GenerateContentInput): Promise<GeneratedContent> {
  const prompt = buildPrompt(BLOG_PROMPT, {
    sourceTitle: input.sourceTitle,
    sourceName: input.sourceName,
    sourceDescription: input.sourceDescription,
    existingTitles: input.existingTitles.slice(0, 20).join('\n- '),
  });

  const response = await callGemini(prompt);
  const parsed = extractJSON(response);

  return {
    title: String(parsed.title || input.sourceTitle),
    category: String(parsed.category || 'General Insurance'),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : [],
    summary: String(parsed.summary || ''),
    content: String(parsed.content || ''),
    read_time: String(parsed.read_time || '3 min read'),
  };
}

export async function generateNewsItem(input: GenerateContentInput): Promise<GeneratedContent> {
  const prompt = buildPrompt(NEWS_PROMPT, {
    sourceTitle: input.sourceTitle,
    sourceName: input.sourceName,
    sourceDescription: input.sourceDescription,
    existingTitles: input.existingTitles.slice(0, 20).join('\n- '),
  });

  const response = await callGemini(prompt);
  const parsed = extractJSON(response);

  return {
    title: String(parsed.title || input.sourceTitle),
    category: String(parsed.category || 'General Insurance'),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : [],
    summary: String(parsed.summary || ''),
    content: String(parsed.content || ''),
    read_time: String(parsed.read_time || '1 min read'),
  };
}

export async function categorizeArticle(title: string, description: string): Promise<string> {
  try {
    const prompt = buildPrompt(CATEGORIZE_PROMPT, {
      title,
      description: description.slice(0, 300),
    });
    const response = await callGemini(prompt);
    const category = response.trim().replace(/['"]/g, '');
    const valid = ['Life Insurance', 'General Insurance', 'Health', 'Motor', 'IRDAI/Regulatory', 'Personal Lines'];
    return valid.includes(category) ? category : 'General Insurance';
  } catch {
    return 'General Insurance';
  }
}

export function isGeminiConfigured(): boolean {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}
