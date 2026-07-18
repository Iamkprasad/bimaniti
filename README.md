# BimaNiti — Insurance & Market Insights

Static content platform for Indian insurance industry analysis, market research, and regulatory insights. Built with vanilla HTML/CSS/JS, deployed via GitHub Pages.

## How to add content

You only need to edit **one JSON file**, then push to GitHub. Everything else happens automatically.

### Add a News article

1. Open `data/news.json`
2. Copy one of the existing entries (everything between `{` and `}`)
3. Paste it at the top of the array (after the opening `[`)
4. Change these fields:

| Field | What to put |
|-------|-------------|
| `"id"` | Next ID — e.g. `"NWS-041"` (check last ID in file and increment) |
| `"slug"` | URL-friendly version of title — lowercase, hyphens instead of spaces, e.g. `"new-article-title"` |
| `"title"` | Article headline |
| `"category"` | One of: `"Life Insurance"`, `"Health"`, `"General Insurance"`, `"Motor"`, `"IRDAI/Regulatory"`, `"Personal Lines"`, `"Reinsurance"` |
| `"tags"` | Array of keywords, e.g. `["LIC", "Q1 FY27", "Life Insurance"]` |
| `"author"` | Usually `"BimaNiti"` |
| `"source"` | Where you got the info — e.g. `"Economic Times"` |
| `"published_date"` | Date in `YYYY-MM-DD` format, e.g. `"2026-07-18"` |
| `"read_time"` | e.g. `"1 min read"` |
| `"summary"` | 1-2 sentence description (shows on listing pages) |
| `"content"` | Full article in **HTML format** — use `<p>...</p>` for paragraphs, `<h2>...</h2>` for headings |
| `"previous_coverage"` | Set to `null` (unless this is a follow-up) |
| `"related_ids"` | Array of IDs of related articles, e.g. `["NWS-040", "BLG-028"]` |

### Add a Blog post

Same process, but edit `data/blogs.json` instead. Blog entries have the same fields except no `"source"`.

### Example entry to use as template

```json
{
    "id": "NWS-041",
    "slug": "your-article-slug",
    "title": "Your Article Title Here",
    "category": "Life Insurance",
    "tags": ["Tag1", "Tag2"],
    "author": "BimaNiti",
    "source": "Source Name",
    "published_date": "2026-07-18",
    "read_time": "2 min read",
    "summary": "A brief summary of what this article covers.",
    "content": "<p>First paragraph here.</p><p>Second paragraph.</p>",
    "previous_coverage": null,
    "related_ids": []
}
```

### Commit and deploy

```bash
git add -A
git commit -m "Add article: Your Title"
git push
```

That's it. GitHub Actions will build the static pages, generate the sitemap and RSS feed, and deploy to GitHub Pages. Wait ~1-2 minutes for the changes to go live.

## Local development

To view the site locally, just open any `.html` file in a browser.

To regenerate static pages locally (not needed — GitHub does this automatically):
```bash
node scripts/build.mjs
```

## Project structure

```
├── index.html              # Homepage
├── blog.html               # Blog listing
├── news.html               # News listing
├── archives.html           # All content archive
├── about.html              # About page
├── contact.html            # Contact page
├── post.html               # Single article viewer (dynamic)
├── style.css               # All styles
├── script.js               # All client-side logic
├── sw.js                   # Service worker (offline caching)
├── data/
│   ├── blogs.json          # Blog content (you edit this)
│   └── news.json           # News content (you edit this)
└── scripts/
    └── build.mjs           # Build script (runs automatically in CI)
```

## Tech

- Vanilla HTML5 / CSS3 / JavaScript — zero dependencies
- Node.js build script for static page generation
- GitHub Actions for CI/CD
- GitHub Pages for hosting
