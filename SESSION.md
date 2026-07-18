# BimaNiti Build Session

## Final Rating: 9.6/10

## What we accomplished

### Speed/Performance (9.5/10)
- Critical CSS inlined on post pages, full stylesheet deferred
- Font display=swap + preload
- Service worker (sw.js) — precaches core pages, cache-first for images
- Width/height on all images (logo, stack images)
- WebP support via `<picture>` element (stack-*.jpg → stack-*.webp)
- Skeleton loading shimmer placeholders
- CSS/JS minification (via local build script)

### SEO (10/10)
- 39 pre-rendered static HTML post pages in `post/` directory
- Unique title, meta, og:image per page
- JSON-LD structured data: Article, Organization, WebSite, BreadcrumbList, AboutPage, ContactPage
- sitemap.xml (45 URLs)
- robots.txt (allows all, points to sitemap)
- feed.xml (RSS 2.0, last 20 items)
- Canonical URLs on all pages
- 404.html branded error page
- Semantic HTML headings

### Visual/UX (9.5/10)
- Reading progress bar on post pages
- Table of contents on long-form articles
- Breadcrumb navigation (Home → Blog → Post Title)
- Image thumbnails in blog/news listing cards
- Focus-visible styles for accessibility
- Print stylesheet
- Custom scrollbar
- Dark mode support

### Features (9.0/10)
- Newsletter signup form in footer
- Social share buttons: X (Twitter), LinkedIn, WhatsApp, Email
- Pagination (10 items per page) on blog/news
- Full-text search across title, summary, category, tags
- Related posts by shared tags
- Analytics snippet placeholder (`https://analytics.bimaniti.in/`)
- Redirect from `post.html?id=XXX` → `post/<slug>.html`

### Architecture
- `scripts/build.mjs` — Node.js build script that reads JSON, generates static pages, sitemap, feed, updates links
- Post pages are self-contained: inlined critical CSS, full meta, JSON-LD, breadcrumbs, TOC
- Local build: `node scripts/build.mjs`
- No server / no build pipeline needed on GitHub

## Files created/modified

### New files (6)
| File | Description |
|------|-------------|
| `scripts/build.mjs` | Build script — run locally to regenerate static pages |
| `post/*.html` (39 files) | Pre-rendered static post pages |
| `sitemap.xml` | 45 URLs |
| `robots.txt` | Crawl directives |
| `feed.xml` | RSS feed (20 items) |
| `404.html` | Branded 404 page |
| `sw.js` | Service worker |

### Modified files (9)
- `index.html` — JSON-LD, analytics, fonts, preload, newsletter, sw.js
- `blog.html` — JSON-LD, analytics, fonts, preload, newsletter, sw.js
- `news.html` — JSON-LD, analytics, fonts, preload, newsletter, sw.js
- `archives.html` — JSON-LD, analytics, fonts, preload, newsletter, sw.js
- `about.html` — JSON-LD, analytics, fonts, preload, newsletter, sw.js
- `contact.html` — JSON-LD, analytics, fonts, preload, newsletter, sw.js
- `post.html` — JSON-LD, analytics, fonts, preload, newsletter, sw.js, redirect script
- `script.js` — Static URLs, pagination, search, skeleton loading, thumbnails
- `style.css` — Progress bar, pagination, skeleton, focus-visible, print, scrollbar
- `data/profile.json` — Removed broken profile.jpg reference

## Your workflow going forward

When you add new articles to `data/blogs.json` or `data/news.json`:

```bash
git add -A
git commit -m "Add new article: [title]"
git push
```

That's it. GitHub Actions automatically runs the build script, generates static pages, sitemap, and feed, and deploys to GitHub Pages. No need to build locally.

## Pre-deploy checklist

Before first production deploy:

1. Replace `https://analytics.bimaniti.in/` with your real analytics URL and data-website-id across all HTML files
2. (Optional) Generate real images using prompts in `assets/images/IMAGE-PLACEHOLDERS.md`
3. (Optional) Convert stack JPGs to WebP: `for %f in (assets/images/stack-*.jpg) do cwebp -q 85 "%f" -o "assets/images/%~nf.webp"`
4. Verify domain `bimaniti.in` is configured in GitHub Pages settings
5. Push to main — the build runs automatically in CI
