export const BLOG_PROMPT = `You are Prasad Chandra Kulal, an independent Indian insurance analyst writing for "BimaNiti — Insurance & Market Analysis".

Write a blog post based on this source material.

SOURCE TITLE: {sourceTitle}
SOURCE: {sourceName}
SOURCE CONTENT: {sourceDescription}

EXISTING POST TITLES (do NOT duplicate these):
{existingTitles}

RULES:
- Indian insurance sector ONLY (life, general, health, motor, crop, cyber, reinsurance)
- 300-600 words, analytical, data-driven, professional
- Include specific numbers (premium growth %, VNB margins, solvency ratios, PAT figures)
- Cite sources (Economic Times, Business Standard, IRDAI, etc.)
- Not investment advice — informational only
- Use HTML format: <p> for paragraphs, <h2> for sections, <strong> for bold, <em> for italic, <ul>/<li> for lists
- Choose category from: Life Insurance, General Insurance, Health, Motor, IRDAI/Regulatory, Personal Lines
- Generate 3-6 relevant tags
- Write a concise 1-2 sentence summary

OUTPUT FORMAT (strict JSON, no markdown wrapping):
{
  "title": "Blog post title — specific and analytical",
  "category": "Life Insurance",
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "1-2 sentence summary of the post.",
  "content": "<p>Full HTML content here...</p>",
  "read_time": "3 min read"
}`;

export const NEWS_PROMPT = `You are writing a news update for "BimaNiti — Insurance & Market Analysis".

Write a concise news update based on this source material.

SOURCE TITLE: {sourceTitle}
SOURCE: {sourceName}
SOURCE CONTENT: {sourceDescription}

EXISTING NEWS TITLES (do NOT duplicate these):
{existingTitles}

RULES:
- 100-200 words, concise market update
- Include source attribution at the end: <em>Sources: {sourceName}</em>
- Include specific data points and numbers
- HTML format: <p> for paragraphs, <strong> for bold
- Choose category from: Life Insurance, General Insurance, Health, Motor, IRDAI/Regulatory, Personal Lines
- Generate 2-4 relevant tags

OUTPUT FORMAT (strict JSON, no markdown wrapping):
{
  "title": "News headline — concise and factual",
  "category": "General Insurance",
  "tags": ["tag1", "tag2"],
  "summary": "One sentence summary.",
  "content": "<p>News content here...</p>",
  "read_time": "1 min read"
}`;

export const CATEGORIZE_PROMPT = `Categorize this insurance article into exactly ONE category.

TITLE: {title}
DESCRIPTION: {description}

Available categories:
- Life Insurance (LIC, SBI Life, HDFC Life, ICICI Prudential, Bajaj Allianz, Max Life, Kotak Life, VNB, NBP, APE, etc.)
- General Insurance (ICICI Lombard, New India Assurance, SBI General, HDFC ERGO, GDPI, combined ratio, etc.)
- Health (health insurance, standalone health insurers, health premiums, Ayushman, cashless, etc.)
- Motor (motor insurance, third-party, vehicle sales, own damage, etc.)
- IRDAI/Regulatory (IRDAI circulars, RBC framework, Ind AS 117, FDI, GST on insurance, governance, etc.)
- Personal Lines (crop insurance, personal accident, home insurance, travel insurance, etc.)

Reply with ONLY the category name, nothing else.`;

export function buildPrompt(
  template: string,
  vars: Record<string, string>
): string {
  let prompt = template;
  for (const [key, value] of Object.entries(vars)) {
    prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return prompt;
}
