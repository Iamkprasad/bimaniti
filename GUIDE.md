# BimaNiti — Content Publishing Guide

> How to add news articles and blog posts — the easy way.

## Your workflow in 3 steps

### Step 1: Open the right file

| For this content | Edit this file |
|---|---|
| News articles | `data/news.json` |
| Blog posts | `data/blogs.json` |

### Step 2: Add your entry

Copy an existing entry (everything from `{` to `}`) and paste it right after the opening `[`.

Then change these fields:

| Field | What to write | Example |
|-------|---------------|---------|
| `"id"` | Next number in sequence | `"NWS-041"` (check the last ID) |
| `"slug"` | Title as lowercase with hyphens | `"new-insurance-regulation-2026"` |
| `"title"` | Article headline | `"New Insurance Regulation 2026"` |
| `"category"` | One of the allowed categories (see below) | `"IRDAI/Regulatory"` |
| `"tags"` | Keywords in an array | `["IRDAI", "Regulation", "Life Insurance"]` |
| `"author"` | Writer name | `"BimaNiti"` |
| `"source"` | **(news only)** Source of information | `"Economic Times"` |
| `"published_date"` | Date in YYYY-MM-DD format | `"2026-07-18"` |
| `"read_time"` | Estimated reading time | `"2 min read"` |
| `"summary"` | 1-2 sentence description | `"A new regulation was announced..."` |
| `"content"` | Full article in HTML format | `"<p>First paragraph</p><p>Second paragraph</p>"` |
| `"previous_coverage"` | Leave as `null` | `null` |
| `"related_ids"` | IDs of related articles or empty | `["NWS-040", "BLG-028"]` or `[]` |

#### Allowed categories

`Life Insurance`, `Health`, `General Insurance`, `Motor`, `IRDAI/Regulatory`, `Personal Lines`, `Reinsurance`

#### Content HTML tips

- Paragraphs: `<p>Your text here.</p>`
- Headings: `<h2>Section title</h2>`
- Bold: `<strong>important</strong>`
- Italic: `<em>emphasis</em>`
- Lists: `<ul><li>Item</li><li>Item</li></ul>`

#### News entry template

```json
{
    "id": "NWS-041",
    "slug": "your-article-slug",
    "title": "Your Article Title",
    "category": "Life Insurance",
    "tags": ["Tag1", "Tag2"],
    "author": "BimaNiti",
    "source": "Source Name",
    "published_date": "2026-07-18",
    "read_time": "1 min read",
    "summary": "A brief one-line summary of the article.",
    "content": "<p>First paragraph of the article here.</p><p>Second paragraph with more details.</p>",
    "previous_coverage": null,
    "related_ids": []
}
```

#### Blog post template

```json
{
    "id": "BLG-032",
    "slug": "your-blog-post-slug",
    "title": "Your Blog Post Title",
    "category": "General Insurance",
    "tags": ["Tag1", "Tag2"],
    "author": "BimaNiti",
    "published_date": "2026-07-18",
    "read_time": "5 min read",
    "summary": "A brief summary of what this analysis covers.",
    "content": "<p>Opening paragraph of the analysis.</p><h2>Key Findings</h2><p>Detailed findings here.</p><p>Concluding paragraph.</p>",
    "previous_coverage": null,
    "related_ids": []
}
```

### Step 3: Deploy

Open a terminal in the project folder and run:

```bash
git add -A
git commit -m "Add article: Your Title"
git push
```

Wait **1-2 minutes**. The site updates automatically — new article appears on the homepage, listing pages, archive, RSS feed, and sitemap.

---

## What NOT to do

- ❌ Don't edit files in the `post/` folder (they're generated automatically)
- ❌ Don't run `node scripts/build.mjs` (GitHub runs it for you)
- ❌ Don't edit `sitemap.xml` or `feed.xml` (also auto-generated)

Only edit `data/news.json` and `data/blogs.json` — nothing else.

---

## Frequently Asked Questions

**Q: How do I know the next ID number?**
A: Look at the last entry in the file. If it ends with `NWS-040`, your new entry should be `NWS-041`. Same pattern for blogs: `BLG-031` → `BLG-032`.

**Q: What if my article has multiple sources?**
A: Write them all in the `"source"` field, separated by a slash: `"Economic Times / Business Standard"`.

**Q: What if I make a typo?**
A: Fix it in the JSON file, save, then `git add -A && git commit -m "Fix typo" && git push`.

**Q: How do I link to another article on the site?**
A: Find its ID (e.g. `NWS-040`) and add it to the `"related_ids"` array: `["NWS-040"]`.

**Q: Can I write in plain text instead of HTML?**
A: No, the `"content"` field needs HTML tags. Use `<p>` for paragraphs and `<h2>` for section headings.

**Q: The site hasn't updated after 5 minutes. What do I do?**
A: Go to your GitHub repository → Actions tab. You should see a workflow running. If it failed, click into it to see the error message.
