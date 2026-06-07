export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  guid?: string;
}

function parseRSSXML(xmlText: string, sourceName: string): RSSItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  const items: RSSItem[] = [];

  const itemNodes = doc.querySelectorAll('item');
  itemNodes.forEach(node => {
    const title = node.querySelector('title')?.textContent?.trim() || '';
    const link = node.querySelector('link')?.textContent?.trim() || '';
    const description = node.querySelector('description')?.textContent?.trim() || '';
    const pubDate = node.querySelector('pubDate')?.textContent?.trim() || '';
    const guid = node.querySelector('guid')?.textContent?.trim() || '';

    if (title && link) {
      items.push({ title, link, description, pubDate, source: sourceName, guid });
    }
  });

  return items;
}

function cleanDescription(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent?.trim().slice(0, 500) || '';
}

export async function fetchRSSFeed(url: string, sourceName: string): Promise<RSSItem[]> {
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    return parseRSSXML(text, sourceName);
  } catch {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      return parseRSSXML(text, sourceName);
    } catch {
      return [];
    }
  }
}

export async function fetchAllFeeds(
  feeds: { name: string; url: string; is_active: boolean }[]
): Promise<RSSItem[]> {
  const activeFeeds = feeds.filter(f => f.is_active);
  const results = await Promise.allSettled(
    activeFeeds.map(feed => fetchRSSFeed(feed.url, feed.name))
  );

  const allItems: RSSItem[] = [];
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  });

  return allItems.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime() || 0;
    const dateB = new Date(b.pubDate).getTime() || 0;
    return dateB - dateA;
  });
}

export function isInsuranceRelevant(item: RSSItem): boolean {
  const insuranceKeywords = [
    'insurance', 'insurer', 'irdai', 'premium', 'underwriting',
    'policyholder', 'claim', 'solvency', 'life insurance', 'health insurance',
    'motor insurance', 'general insurance', 'reinsurance', 'annuity',
    'vnb', 'gdpi', 'gwp', 'nbp', 'ind as', 'rbc', 'bima',
    'lic', 'sbi life', 'hdfc life', 'icici prudential', 'bajaj allianz',
    'icici lombard', 'new india', 'sbi general', 'health',
    'motor', 'crop insurance', 'cyber insurance', 'gst',
  ];

  const text = `${item.title} ${cleanDescription(item.description)}`.toLowerCase();
  return insuranceKeywords.some(kw => text.includes(kw));
}

export function deduplicateItems(
  items: RSSItem[],
  existingTitles: string[],
  existingSlugs: string[]
): RSSItem[] {
  const normalizedExisting = new Set([
    ...existingTitles.map(t => t.toLowerCase().trim()),
    ...existingSlugs.map(s => s.toLowerCase().replace(/-/g, ' ')),
  ]);

  return items.filter(item => {
    const normalizedTitle = item.title.toLowerCase().trim();
    const normalizedLink = item.link.toLowerCase();

    for (const existing of normalizedExisting) {
      if (normalizedTitle.includes(existing) || existing.includes(normalizedTitle)) {
        return false;
      }
      const words = existing.split(/\s+/).filter(w => w.length > 3);
      const matchCount = words.filter(w => normalizedTitle.includes(w)).length;
      if (words.length > 0 && matchCount / words.length > 0.7) {
        return false;
      }
    }

    return true;
  });
}
