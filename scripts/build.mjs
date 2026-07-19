import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const DATA = p => join(ROOT, 'data', p);
const OUT = p => join(ROOT, p);

const TYPE_BLOG = 'blog';
const TYPE_NEWS = 'news';

function slugify(id, slug) {
  return slug || id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function readJSON(file) {
  return JSON.parse(readFileSync(DATA(file), 'utf-8').replace(/^\uFEFF/, ''));
}

function htmlEscape(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function pageShell(title, desc, ogTitle, ogDesc, ogImage, canonical, jsonld, body, type) {
  const isArticle = type === 'article';
  const breadcrumbJsonLd = jsonld ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bimaniti.in/" },
      { "@type": "ListItem", "position": 2, "name": isArticle ? "Blog" : "Page", "item": canonical },
      { "@type": "ListItem", "position": 3, "name": title }
    ]
  } : null;
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${htmlEscape(title)}</title>
    <meta name="description" content="${htmlEscape(desc)}">
    <meta property="og:title" content="${htmlEscape(ogTitle || title)}">
    <meta property="og:description" content="${htmlEscape(ogDesc || desc)}">
    <meta property="og:type" content="${isArticle ? 'article' : 'website'}">
    <meta property="og:url" content="${htmlEscape(canonical)}">
    <meta property="og:image" content="${htmlEscape(ogImage || 'https://bimaniti.in/logo.svg')}">
    <link rel="canonical" href="${htmlEscape(canonical)}">
    <link rel="alternate" type="application/rss+xml" title="BimaNiti Feed" href="../feed.xml">
    <style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;transition:background-color .25s ease,border-color .2s ease,color .15s ease}
html{color-scheme:light}
html.dark{color-scheme:dark}
:root{--font-display:'Lora',Georgia,serif;--font-body:'Outfit',system-ui,sans-serif;--bg-primary:#f5f3ef;--bg-secondary:#ede9e3;--text-primary:#1a1a1a;--text-secondary:#4a4a4a;--text-muted:#6a6a6a;--accent:#4a6741;--accent-hover:#3a5232;--border:#d6d0c8;--card-bg:#ffffff;--nav-bg:#f5f3ef;--alert:#b94040;--max-w:1160px;--article-w:680px;--radius:4px;--transition:200ms ease}
.dark{--bg-primary:#141410;--bg-secondary:#1c1c18;--text-primary:#e8e4dc;--text-secondary:#c0bab0;--text-muted:#8a8a84;--accent:#8aaa7a;--accent-hover:#a0be90;--border:#2e2e28;--card-bg:#1e1e1a;--nav-bg:#141410}
body{background:var(--bg-primary);color:var(--text-secondary);font-family:var(--font-body);font-weight:300;-webkit-font-smoothing:antialiased;line-height:1.6;overflow-x:hidden}
a{text-decoration:none;color:inherit}
h1,h2,h3,h4,h5,h6{font-family:var(--font-display);font-weight:400;line-height:1.2;color:var(--text-primary)}
::selection{background:rgba(92,110,58,.2);color:var(--text-primary)}
img{max-width:100%;height:auto}
.navbar{position:fixed;top:0;left:0;right:0;z-index:100;height:58px;background:var(--bg-primary);border-bottom:1px solid var(--border)}
.nav-container{max-width:var(--max-w);margin:0 auto;padding:0 32px;height:58px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;flex-shrink:0;overflow:visible;line-height:0}
.logo img{height:36px;width:auto;max-width:none;min-width:120px;display:block;flex-shrink:0;background:none}
.site-logo{height:36px;width:auto}
.site-logo.footer-brand{height:32px}
.logo-bima{font-family:'Outfit',system-ui,sans-serif;font-size:34px;font-weight:600;fill:#1a1a1a}
.logo-niti{font-family:'Lora',Georgia,serif;font-size:34px;font-weight:500;fill:#4a6741}
.logo-tag{font-family:'Outfit',system-ui,sans-serif;font-size:8.5px;font-weight:400;fill:#6a6a6a;letter-spacing:2.5px}
html.dark .logo-bima{fill:#e8e4dc}
html.dark .logo-niti{fill:#8aaa7a}
html.dark .logo-tag{fill:#8a8a84}
.desktop-nav{display:none;align-items:center;gap:28px}
@media(min-width:768px){.desktop-nav{display:flex}}
.nav-link{font-family:var(--font-body);font-size:13px;font-weight:400;color:var(--text-muted);transition:color 150ms ease}
.nav-link:hover,.nav-link.active{color:var(--text-primary);font-weight:500}
.theme-toggle{background:0;border:0;cursor:pointer;padding:8px;color:var(--text-secondary);display:flex;align-items:center;justify-content:center;border-radius:50%;line-height:0;transition:background-color .15s ease,color .15s ease}
.theme-toggle:hover{color:var(--text-primary);background:color-mix(in srgb,var(--accent)10%,transparent)}
.theme-toggle svg{display:block}
html.dark .theme-toggle .icon-sun{display:block}
html.dark .theme-toggle .icon-moon{display:none}
.theme-toggle .icon-sun{display:none}
.theme-toggle .icon-moon{display:block}
.mobile-menu-btn{display:block;background:0;border:0;color:var(--text-primary);cursor:pointer;padding:.5rem}
@media(min-width:768px){.mobile-menu-btn{display:none}}
.mobile-nav{position:absolute;top:100%;left:0;right:0;z-index:99;background:var(--bg-primary);border-top:1px solid var(--border);border-bottom:1px solid var(--border);overflow:hidden;transition:max-height .4s ease,opacity .3s ease;max-height:0;opacity:0}
.mobile-nav.open{max-height:500px;opacity:1}
.mobile-nav-content{padding:1.5rem;display:flex;flex-direction:column;gap:1rem}
.mobile-nav-link{font-family:var(--font-body);font-size:15px;color:var(--text-secondary);padding:.25rem 0}
.mobile-nav-link.active{color:var(--accent);font-weight:500}
.mobile-nav-content .theme-toggle{align-self:flex-start;margin-top:.5rem;border:1px solid var(--border);padding:8px 12px;border-radius:4px}
.post-hero{background:var(--bg-primary);text-align:center;padding:calc(48px + 58px) 24px 40px}
.post-hero-inner{max-width:680px;margin:0 auto}
.post-hero-tag{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.13em;color:var(--accent-hover);margin-bottom:14px;display:block}
.post-hero h1{font-family:var(--font-display);font-size:34px;font-weight:500;color:var(--text-primary);line-height:1.2;max-width:640px;margin:0 auto 14px}
@media(min-width:768px){.post-hero h1{font-size:36px}}
.post-hero-byline{font-family:var(--font-body);font-size:13px;font-weight:300;color:var(--text-muted)}
.post-hero-byline strong{font-weight:400;color:var(--text-secondary)}
.post-body-wrapper{background:var(--card-bg);padding:0 24px 64px}
.post-content{max-width:680px;margin:0 auto;font-family:var(--font-body);font-size:16px;font-weight:300;line-height:1.85;color:var(--text-secondary)}
.post-content h2{font-family:var(--font-display);font-size:1.5rem;font-weight:400;color:var(--text-primary);margin-top:2.5rem;margin-bottom:1rem}
.post-content h3{font-family:var(--font-display);font-size:1.25rem;font-weight:400;color:var(--text-primary);margin-top:2rem;margin-bottom:.75rem}
.post-content p{margin-bottom:1.25rem;margin-top:20px}
.post-content p:first-of-type{margin-top:0}
.post-content>p:first-of-type::first-letter{font-family:'Lora',serif;font-size:52px;font-weight:500;color:var(--accent-hover);float:left;line-height:.82;margin:6px 10px 0 0}
@media(max-width:640px){.post-content>p:first-of-type::first-letter{font-size:36px;margin:4px 8px 0 0}}
.post-content ul,.post-content ol{margin-bottom:1.25rem;padding-left:1.5rem}
.post-content li{margin-bottom:.5rem}
.post-content strong{color:var(--text-primary);font-weight:500}
.post-content blockquote{border-left:3px solid var(--accent);padding-left:1.25rem;margin:1.5rem 0;font-family:var(--font-display);font-size:1.375rem;font-style:italic;color:var(--text-primary);line-height:1.4}
.post-sources{max-width:var(--article-w);margin:3rem auto 0;border-top:1px solid var(--border);padding-top:1.5rem}
.prev-coverage-banner{background:#fdf8e8;border-left:3px solid #b8860b;padding:10px 16px;font-size:13px;border-radius:6px;margin-bottom:24px}
.dark .prev-coverage-banner{background:#2a2210;color:#d4a84b}
.prev-coverage-banner a{color:var(--accent);text-decoration:underline}
.progress-bar{position:fixed;top:58px;left:0;height:3px;background:var(--accent);z-index:99;width:0%}
.footer{background:var(--bg-secondary);border-top:1px solid rgba(228,221,212,.08)}
.footer-content{display:flex;flex-direction:column;gap:2rem;margin-bottom:2rem}
@media(min-width:768px){.footer-content{flex-direction:row;justify-content:space-between;align-items:flex-start}}
.footer-brand{height:32px;width:auto;max-width:none;min-width:100px;display:block;flex-shrink:0;margin-bottom:8px}
.footer-desc{font-family:var(--font-body);font-size:.8125rem;color:var(--text-muted);font-weight:300;max-width:20rem;line-height:1.6}
.footer-links{display:flex;flex-wrap:wrap;gap:1.5rem}
.footer-link{font-family:var(--font-body);font-size:.8125rem;color:var(--text-secondary);font-weight:300;transition:color var(--transition)}
.footer-link:hover{color:var(--accent)}
.footer-copyright{font-family:var(--font-body);font-size:.6875rem;color:var(--text-muted);font-weight:300;text-align:center;padding-top:1.5rem;border-top:1px solid rgba(228,221,212,.06)}
.footer-disclaimer{font-family:var(--font-body);font-size:.6875rem;color:var(--text-muted);font-weight:300;text-align:center;margin-top:.75rem}
.btn-primary{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 2rem;background:var(--accent);color:#fff;border:0;border-radius:var(--radius);font-family:var(--font-body);font-size:.8125rem;font-weight:500;cursor:pointer;transition:all var(--transition)}
.btn-primary:hover{background:var(--accent-hover)}
.pagination{display:flex;justify-content:center;align-items:center;gap:12px;margin-top:2rem}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media(max-width:640px){.post-hero h1{font-size:28px}.post-content{font-size:1rem}.post-content blockquote{font-size:1.125rem}}
.breadcrumb{max-width:680px;margin:0 auto 20px;font-family:var(--font-body);font-size:12px;color:var(--text-muted)}
.breadcrumb a{color:var(--accent)}
.breadcrumb a:hover{text-decoration:underline}
.breadcrumb span{margin:0 6px}
.toc{background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;margin-bottom:2rem;max-width:680px;margin-left:auto;margin-right:auto}
.toc-title{font-family:var(--font-body);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);margin-bottom:10px}
.toc-list{list-style:none;padding:0;margin:0}
.toc-list li{margin-bottom:6px}
.toc-list a{font-size:14px;color:var(--text-secondary);transition:color var(--transition)}
.toc-list a:hover{color:var(--accent)}
    </style>
    <link rel="icon" type="image/svg+xml" href="../logo.svg">
    <script defer src="https://analytics.bimaniti.in/script.js" data-website-id="XXXXXXXX"></script>
    <noscript><img src="https://analytics.bimaniti.in/collect.gif" alt="" style="display:none"></noscript>
    ${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
    ${breadcrumbJsonLd ? `<script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>` : ''}
</head>
<body>
    <a href="#main-content" class="skip-link" style="position:absolute;top:-100%;left:16px;z-index:999;padding:.75rem 1.5rem;background:var(--accent);color:#fff;font-weight:500;border-radius:0 0 4px 4px;transition:top .2s ease">Skip to main content</a>
    <nav class="navbar" aria-label="Main navigation">
        <div class="nav-container">
            <a href="../" class="logo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 58" class="site-logo" aria-label="BimaNiti" role="img"><text x="4" y="34" class="logo-bima">Bima</text><text x="83" y="34" class="logo-niti">Niti</text><text x="4" y="50" class="logo-tag">INSURANCE &amp; MARKET ANALYSIS</text></svg></a>
            <div class="desktop-nav">
                <a href="../" class="nav-link">Home</a>
                <a href="../blog.html" class="nav-link">Blog</a>
                <a href="../news.html" class="nav-link">News</a>
                <a href="../archives.html" class="nav-link">Archives</a>
                <a href="../about.html" class="nav-link">About</a>
                <a href="../contact.html" class="nav-link">Contact</a>
                <button class="theme-toggle" aria-label="Toggle dark mode">
                    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                </button>
            </div>
            <button class="mobile-menu-btn" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-nav-panel">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-icon"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon hidden"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        </div>
        <div class="mobile-nav" id="mobile-nav">
            <div class="mobile-nav-content">
                <a href="../" class="mobile-nav-link">Home</a>
                <a href="../blog.html" class="mobile-nav-link">Blog</a>
                <a href="../news.html" class="mobile-nav-link">News</a>
                <a href="../archives.html" class="mobile-nav-link">Archives</a>
                <a href="../about.html" class="mobile-nav-link">About</a>
                <a href="../contact.html" class="mobile-nav-link">Contact</a>
                <button class="theme-toggle" aria-label="Toggle dark mode">
                    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                </button>
            </div>
        </div>
    </nav>
    <div class="progress-bar"></div>
    <main id="main-content">
        ${body}
    </main>
    <footer class="footer py-24 px-6" style="padding:4rem 1.5rem">
        <div class="max-w-5xl mx-auto" style="max-width:var(--max-w);margin-left:auto;margin-right:auto">
            <div class="footer-content">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 58" class="site-logo footer-brand" aria-label="BimaNiti" role="img"><text x="4" y="34" class="logo-bima">Bima</text><text x="83" y="34" class="logo-niti">Niti</text><text x="4" y="50" class="logo-tag">INSURANCE &amp; MARKET ANALYSIS</text></svg>
                    <p class="footer-desc">Independent Insurance Analysis · India</p>
                </div>
                <div class="footer-links">
                    <a href="../" class="footer-link">Home</a>
                    <a href="../blog.html" class="footer-link">Blog</a>
                    <a href="../news.html" class="footer-link">News</a>
                    <a href="../archives.html" class="footer-link">Archives</a>
                    <a href="../about.html" class="footer-link">About</a>
                    <a href="../contact.html" class="footer-link">Contact</a>
                </div>
            </div>
            <div style="margin:2rem 0;padding:1.5rem 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border)">
                <p style="font-family:var(--font-body);font-size:13px;font-weight:500;color:var(--text-primary);margin-bottom:10px;text-align:center">Stay Updated</p>
                <p style="font-family:var(--font-body);font-size:12px;color:var(--text-muted);font-weight:300;text-align:center;margin-bottom:14px">Get the latest analysis delivered to your inbox.</p>
                <form style="display:flex;gap:8px;max-width:400px;margin:0 auto" onsubmit="var e=this.querySelector('input');e.value='Subscribed!';setTimeout(function(){e.value=''},3000);return false">
                    <input type="email" placeholder="Your email address" required style="flex:1;padding:8px 14px;border:1px solid var(--border);border-radius:4px;background:var(--card-bg);color:var(--text-secondary);font-family:var(--font-body);font-size:13px;outline:none">
                    <button type="submit" class="btn-primary" style="padding:8px 18px;font-size:12px">Subscribe</button>
                </form>
            </div>
            <p class="footer-copyright">© 2026 BimaNiti</p>
            <p class="footer-disclaimer">Not investment advice. This site is for informational purposes only.</p>
        </div>
    </footer>
    <script defer>
    (function(){var s=localStorage.getItem('theme')||'light';if(s==='dark')document.documentElement.classList.add('dark')})();
    document.querySelectorAll('.theme-toggle').forEach(function(t){t.addEventListener('click',function(){var h=document.documentElement;var d=h.classList.toggle('dark');localStorage.setItem('theme',d?'dark':'light')})});
    (function(){var b=document.querySelector('.progress-bar');if(b){window.addEventListener('scroll',function(){var h=document.documentElement.scrollHeight-window.innerHeight;b.style.width=(h>0?(window.scrollY/h)*100:0)+'%'})}})();
    (function(){var m=document.querySelector('.mobile-menu-btn'),n=document.querySelector('.mobile-nav'),i=document.querySelector('.menu-icon'),c=document.querySelector('.close-icon');if(m&&n)m.addEventListener('click',function(){var o=n.classList.toggle('open');m.setAttribute('aria-expanded',o);if(i)i.classList.toggle('hidden');if(c)c.classList.toggle('hidden')})})();
    (function(){if('serviceWorker'in navigator)navigator.serviceWorker.register('../sw.js').catch(function(){})})();
    </script>
    <script defer src="../script.js"></script>
</body>
</html>`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function generateTOC(content) {
  const headingRegex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  const items = [];
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    items.push({ text, id });
  }
  if (items.length < 2) return '';
  let html = '<nav class="toc"><div class="toc-title">Table of Contents</div><ul class="toc-list">';
  items.forEach(item => {
    html += `<li><a href="#${item.id}">${item.text}</a></li>`;
  });
  html += '</ul></nav>';
  return html;
}

function addHeadingIDs(content) {
  return content.replace(/<h2[^>]*>(.*?)<\/h2>/gi, (match, text) => {
    const plain = text.replace(/<[^>]+>/g, '');
    const id = plain.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h2 id="${id}">${text}</h2>`;
  });
}

function generateOGImage(slug, title, category) {
  const ogDir = join(ROOT, 'assets', 'og');
  if (!existsSync(ogDir)) mkdirSync(ogDir, { recursive: true });

  // Wrap title into max 3 lines of ~28 chars
  const words = title.split(' ');
  const lines = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length > 28) {
      if (current) lines.push(current.trim());
      current = w;
    } else {
      current = (current + ' ' + w).trim();
    }
  }
  if (current) lines.push(current.trim());
  const titleLines = lines.slice(0, 3);

  const titleSvg = titleLines.map((line, i) => {
    const y = 250 + i * 72;
    return `    <text x="80" y="${y}" font-family="Georgia, serif" font-size="52" font-weight="500" fill="#1a1a1a">${htmlEscape(line)}</text>`;
  }).join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f5f3ef"/>
  <rect x="0" y="0" width="12" height="630" fill="#4a6741"/>
  <text x="80" y="120" font-family="Outfit, system-ui, sans-serif" font-size="20" font-weight="600" letter-spacing="3" fill="#4a6741">${htmlEscape(category || 'BimaNiti')}</text>
  <text x="80" y="160" font-family="Outfit, system-ui, sans-serif" font-size="26" font-weight="300" fill="#6a6a6a">BimaNiti — Insurance &amp; Market Insights</text>
${titleSvg}
  <text x="80" y="560" font-family="Outfit, system-ui, sans-serif" font-size="22" font-weight="400" fill="#4a6741">bimaniti.in</text>
</svg>`;

  writeFileSync(join(ogDir, `${slug}.svg`), svg, 'utf-8');
}

function generatePostPages() {
  const blogs = readJSON('blogs.json');
  const news = readJSON('news.json');
  const allItems = [...blogs, ...news];
  const postDir = join(ROOT, 'post');

  if (!existsSync(postDir)) mkdirSync(postDir, { recursive: true });

  const shareSVGs = {
    twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
  };

  const today = new Date().toISOString().split('T')[0];
  const sitemapUrls = [
    { loc: 'https://bimaniti.in/', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { loc: 'https://bimaniti.in/blog.html', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { loc: 'https://bimaniti.in/news.html', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { loc: 'https://bimaniti.in/archives.html', priority: '0.7', changefreq: 'monthly', lastmod: today },
    { loc: 'https://bimaniti.in/about.html', priority: '0.6', changefreq: 'monthly', lastmod: today },
    { loc: 'https://bimaniti.in/contact.html', priority: '0.5', changefreq: 'monthly', lastmod: today },
  ];

  const rssItems = [];

  allItems.forEach((item, index) => {
    const slug = item.slug || slugify(item.id, item.title);
    const postUrl = `https://bimaniti.in/post/${slug}.html`;
    const ogImagePath = `assets/og/${slug}.svg`;
    const imagePath = ogImagePath;

    let formattedContent = (item.content || item.summary || '')
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>');

    formattedContent = addHeadingIDs(formattedContent);

    let prevHtml = '';
    if (item.previous_coverage) {
      prevHtml = `<div class="prev-coverage-banner">📌 Earlier coverage: <a href="${postUrl}">${item.previous_coverage.title}</a> →</div>`;
    }

    const tocHtml = generateTOC(item.content || '');

    const postBody = `
    <div class="post-hero">
        <div class="post-hero-inner">
            <span class="post-hero-tag">${item.category}</span>
            <h1>${item.title}</h1>
            <div class="post-hero-byline"><strong>${item.author || 'BimaNiti'}</strong> · ${item.published_date} · ${item.read_time || '6 min read'}</div>
        </div>
    </div>
    <div class="post-body-wrapper">
        <div class="post-content" style="margin-top:0">
            <nav class="breadcrumb">
                <a href="../">Home</a><span>›</span>
                <a href="../${item.id.startsWith('BLG') ? 'blog' : 'news'}.html">${item.category}</a><span>›</span>
                ${htmlEscape(item.title)}
            </nav>
            ${prevHtml}
            ${tocHtml}
            ${formattedContent}
        </div>
        <div class="post-sources">
            <span style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);margin-bottom:1rem">Share this article</span>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title + ' | BimaNiti')}&url=${encodeURIComponent(postUrl)}" target="_blank" class="share-btn" style="display:inline-flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border:1px solid var(--border);border-radius:var(--radius);color:var(--text-muted);font-size:.8125rem;font-weight:300;transition:all var(--transition)">${shareSVGs.twitter} X</a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}" target="_blank" class="share-btn" style="display:inline-flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border:1px solid var(--border);border-radius:var(--radius);color:var(--text-muted);font-size:.8125rem;font-weight:300;transition:all var(--transition)">${shareSVGs.linkedin} LinkedIn</a>
                <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(item.title + ' | BimaNiti')} ${encodeURIComponent(postUrl)}" target="_blank" class="share-btn" style="display:inline-flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border:1px solid var(--border);border-radius:var(--radius);color:var(--text-muted);font-size:.8125rem;font-weight:300;transition:all var(--transition)">${shareSVGs.whatsapp} WhatsApp</a>
                <a href="mailto:?subject=${encodeURIComponent(item.title + ' | BimaNiti')}&body=${encodeURIComponent(postUrl)}" class="share-btn" style="display:inline-flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border:1px solid var(--border);border-radius:var(--radius);color:var(--text-muted);font-size:.8125rem;font-weight:300;transition:all var(--transition)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg> Email</a>
            </div>
        </div>
    </div>`;

    const jsonld = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: item.title,
      description: item.summary,
      author: { "@type": "Person", name: item.author || "BimaNiti" },
      datePublished: item.published_date,
      dateModified: item.published_date,
      url: postUrl,
      image: `https://bimaniti.in/${imagePath}`,
      mainEntityOfPage: { "@type": "WebPage", "@id": postUrl }
    };

    const html = pageShell(
      `${item.title} | BimaNiti`,
      item.summary,
      `${item.title} | BimaNiti`,
      item.summary,
      `https://bimaniti.in/${imagePath}`,
      postUrl,
      jsonld,
      postBody,
      'article'
    );

    writeFileSync(join(postDir, `${slug}.html`), html, 'utf-8');
    console.log(`  ✓ Generated post/${slug}.html`);

    generateOGImage(slug, item.title, item.category);

    sitemapUrls.push({
      loc: postUrl,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: item.published_date
    });

    rssItems.push({
      title: item.title,
      link: postUrl,
      guid: postUrl,
      description: item.summary,
      pubDate: item.published_date,
      category: item.category
    });
  });

  // Generate sitemap.xml
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  sitemapUrls.forEach(u => {
    sitemap += `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority><changefreq>${u.changefreq}</changefreq></url>\n`;
  });
  sitemap += '</urlset>';
  writeFileSync(OUT('sitemap.xml'), sitemap, 'utf-8');
  console.log(`  ✓ Generated sitemap.xml (${sitemapUrls.length} URLs)`);

  // Generate RSS feed
  rssItems.sort((a, b) => b.pubDate.localeCompare(a.pubDate));
  const top20 = rssItems.slice(0, 20);
  let rss = '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n';
  rss += '  <title>BimaNiti — Insurance &amp; Market Insights</title>\n';
  rss += '  <link>https://bimaniti.in/</link>\n';
  rss += '  <description>Analysing markets, decoding insurance, and sharing insights that matter.</description>\n';
  rss += '  <language>en</language>\n';
  rss += '  <atom:link href="https://bimaniti.in/feed.xml" rel="self" type="application/rss+xml"/>\n';
  top20.forEach(item => {
    const pubDate = new Date(item.pubDate + 'T00:00:00Z').toUTCString();
    rss += `  <item>\n    <title>${htmlEscape(item.title)}</title>\n    <link>${item.link}</link>\n    <guid>${item.guid}</guid>\n    <description>${htmlEscape(item.description)}</description>\n    <pubDate>${pubDate}</pubDate>\n    <category>${item.category}</category>\n  </item>\n`;
  });
  rss += '</channel>\n</rss>';
   writeFileSync(OUT('feed.xml'), rss, 'utf-8');
   console.log(`  ✓ Generated feed.xml (${top20.length} items)`);

   // Generate redirect map for script.js update
   return { allItems, sitemapUrls };
}

// Update post.html to redirect from ?id=XXX to static URL
function updatePostPage(items) {
  const postPath = OUT('post.html');
  let html = readFileSync(postPath, 'utf-8');

  // Build slug map for JS injection
  const slugMap = {};
  items.forEach(item => {
    slugMap[item.id] = item.slug || slugify(item.id, item.title);
  });

  // Remove any existing redirect script (identified by REDIRECT_MAP marker)
  html = html.replace(/[\s]*<script defer>[\s\S]*?REDIRECT_MAP[\s\S]*?<\/script>/g, '');

  // Inject fresh redirect script
  const redirectScript = `
    <script defer>
    (function() {
      var slugs = ${JSON.stringify(slugMap)}; /* REDIRECT_MAP */
      var id = new URLSearchParams(window.location.search).get('id');
      if (id && slugs[id]) {
        window.location.replace('post/' + slugs[id] + '.html' + window.location.hash);
      }
    })();
    </script>`;

  html = html.replace('</head>', redirectScript.trim() + '\n</head>');
  writeFileSync(postPath, html, 'utf-8');
  console.log('  ✓ Updated post.html with redirect to static URLs');
}

// Update script.js links (literal post.html?id=XXX only)
function updateScriptLinks(items) {
  const scriptPath = OUT('script.js');
  let js = readFileSync(scriptPath, 'utf-8');

  // Replace literal post.html?id=XXX patterns in listing pages
  items.forEach(item => {
    const slug = item.slug || slugify(item.id, item.title);
    js = js.split(`post.html?id=${item.id}`).join(`post/${slug}.html`);
    js = js.split(`https://bimaniti.in/post.html?id=${item.id}`).join(`https://bimaniti.in/post/${slug}.html`);
  });

  writeFileSync(scriptPath, js, 'utf-8');
  console.log('  ✓ Updated script.js literal links to static URLs');
}

// Generate per-track learn pages so each track is a crawlable static URL
function generateLearnPages() {
  const tracksFile = join(ROOT, 'data', 'learn', 'tracks.json');
  if (!existsSync(tracksFile)) {
    console.log('  ⚠ No data/learn/tracks.json — skipping learn pages');
    return;
  }
  const tracks = JSON.parse(readFileSync(tracksFile, 'utf-8').replace(/^\uFEFF/, '')).tracks;
  const learnDir = join(ROOT, 'learn');
  if (!existsSync(learnDir)) mkdirSync(learnDir, { recursive: true });

  const learnShell = (title, desc, body) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${htmlEscape(title)}</title>
    <meta name="description" content="${htmlEscape(desc)}">
    <meta property="og:title" content="${htmlEscape(title)}">
    <meta property="og:description" content="${htmlEscape(desc)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://bimaniti.in/learn.html">
    <meta property="og:image" content="https://bimaniti.in/assets/og/default.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${htmlEscape(title)}">
    <meta name="twitter:description" content="${htmlEscape(desc)}">
    <meta name="twitter:image" content="https://bimaniti.in/assets/og/default.svg">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' https://analytics.bimaniti.in 'unsafe-inline'; connect-src 'self' https://analytics.bimaniti.in; frame-src 'self'; base-uri 'self'; form-action 'self' mailto: https://formspree.io; object-src 'none'; upgrade-insecure-requests">
    <link rel="stylesheet" href="../assets/css/style.min.css">
    <link rel="stylesheet" href="../assets/css/learn.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="icon" type="image/svg+xml" href="../logo.svg">
    <script defer src="https://analytics.bimaniti.in/script.js" data-website-id="XXXXXXXX"></script>
    <noscript><img src="https://analytics.bimaniti.in/collect.gif" alt="" style="display:none"></noscript>
    <link rel="alternate" type="application/rss+xml" title="BimaNiti Feed" href="../feed.xml">
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to content</a>
    <nav class="navbar" aria-label="Main navigation">
        <div class="nav-container">
            <a href="../" class="logo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 58" class="site-logo" aria-label="BimaNiti" role="img"><text x="4" y="34" class="logo-bima">Bima</text><text x="83" y="34" class="logo-niti">Niti</text><text x="4" y="50" class="logo-tag">INSURANCE &amp; MARKET ANALYSIS</text></svg></a>
            <div class="desktop-nav">
                <a href="../" class="nav-link">Home</a>
                <a href="../blog.html" class="nav-link">Blog</a>
                <a href="../news.html" class="nav-link">News</a>
                <a href="../learn.html" class="nav-link active">Learn</a>
                <a href="../archives.html" class="nav-link">Archives</a>
                <a href="../about.html" class="nav-link">About</a>
                <a href="../contact.html" class="nav-link">Contact</a>
                <button class="theme-toggle" aria-label="Toggle dark mode">
                    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                </button>
            </div>
            <button class="mobile-menu-btn" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-nav-panel">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-icon"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon hidden"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        </div>
        <div class="mobile-nav" id="mobile-nav">
            <div class="mobile-nav-content">
                <a href="../" class="mobile-nav-link">Home</a>
                <a href="../blog.html" class="mobile-nav-link">Blog</a>
                <a href="../news.html" class="mobile-nav-link">News</a>
                <a href="../learn.html" class="mobile-nav-link active">Learn</a>
                <a href="../archives.html" class="mobile-nav-link">Archives</a>
                <a href="../about.html" class="mobile-nav-link">About</a>
                <a href="../contact.html" class="mobile-nav-link">Contact</a>
                <button class="theme-toggle" aria-label="Toggle dark mode">
                    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                </button>
            </div>
        </div>
    </nav>
    <main id="main-content">
        <section class="page-header" style="background: var(--bg-primary);">
            <div class="max-w-5xl mx-auto text-center">
                <div class="page-eyebrow">Interactive Learning</div>
                <h1 class="text-3xl" style="margin-bottom: 10px;">${htmlEscape(title)}</h1>
                <p style="color: var(--text-muted); max-width: 40rem; margin: 0 auto; font-size: 15px; font-weight: 300;">${htmlEscape(desc)}</p>
            </div>
        </section>
        <section style="background: var(--bg-primary); padding: 0 1.5rem 5rem;">
            <div class="max-w-5xl mx-auto">
                <div id="learn-root"></div>
                <div id="learn-header" class="hidden"></div>
                <div id="learn-levelnav" class="hidden"></div>
            </div>
        </section>
    </main>
    <footer class="footer py-24 px-6">
        <div class="max-w-5xl mx-auto">
            <div class="footer-content">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 58" class="site-logo footer-brand" aria-label="BimaNiti" role="img"><text x="4" y="34" class="logo-bima">Bima</text><text x="83" y="34" class="logo-niti">Niti</text><text x="4" y="50" class="logo-tag">INSURANCE &amp; MARKET ANALYSIS</text></svg>
                    <p class="footer-desc">Independent Insurance Analysis · India</p>
                </div>
                <div class="footer-links">
                    <a href="../" class="footer-link">Home</a>
                    <a href="../blog.html" class="footer-link">Blog</a>
                    <a href="../news.html" class="footer-link">News</a>
                    <a href="../learn.html" class="footer-link">Learn</a>
                    <a href="../archives.html" class="footer-link">Archives</a>
                    <a href="../about.html" class="footer-link">About</a>
                    <a href="../contact.html" class="footer-link">Contact</a>
                </div>
            </div>
            <p class="footer-copyright">© 2026 BimaNiti</p>
            <p class="footer-disclaimer">Not investment advice. This site is for informational purposes only.</p>
        </div>
    </footer>
    <script defer>
    (function(){var s=localStorage.getItem('theme')||'light';if(s==='dark')document.documentElement.classList.add('dark')})();
    document.querySelectorAll('.theme-toggle').forEach(function(t){t.addEventListener('click',function(){var h=document.documentElement;var d=h.classList.toggle('dark');localStorage.setItem('theme',d?'dark':'light')})});
    (function(){var m=document.querySelector('.mobile-menu-btn'),n=document.querySelector('.mobile-nav'),i=document.querySelector('.menu-icon'),c=document.querySelector('.close-icon');if(m&&n)m.addEventListener('click',function(){var o=n.classList.toggle('open');m.setAttribute('aria-expanded',o);if(i)i.classList.toggle('hidden');if(c)c.classList.toggle('hidden')})})();
    </script>
    <script defer src="../assets/js/script.min.js"></script>
    <script defer src="../assets/js/learn.js"></script>
</body>
</html>`;

  const todayL = new Date().toISOString().split('T')[0];
  const learnSitemap = [];

  tracks.forEach(track => {
    const body = '';
    const html = learnShell(
      `${track.title} — Learn Insurance | BimaNiti`,
      track.tagline,
      body
    );
    writeFileSync(join(learnDir, `${track.id}.html`), html, 'utf-8');
    console.log(`  ✓ Generated learn/${track.id}.html`);

    learnSitemap.push({
      loc: `https://bimaniti.in/learn/${track.id}.html`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: todayL
    });
  });

  // Also add the learn landing URL
  learnSitemap.push({
    loc: 'https://bimaniti.in/learn.html',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: todayL
  });

  return learnSitemap;
}

// Main
console.log('Building static post pages...');
const { allItems, sitemapUrls } = generatePostPages();
console.log('\nUpdating links...');
updateScriptLinks(allItems);
updatePostPage(allItems);
console.log('\nGenerating learn pages...');
const learnSitemap = generateLearnPages();
sitemapUrls.push(...learnSitemap);
let learnSitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
sitemapUrls.forEach(u => {
  learnSitemapXml += `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority><changefreq>${u.changefreq}</changefreq></url>\n`;
});
learnSitemapXml += '</urlset>';
writeFileSync(OUT('sitemap.xml'), learnSitemapXml, 'utf-8');
console.log(`  ✓ Regenerated sitemap.xml (${sitemapUrls.length} URLs incl. learn)`);
console.log('\nBuild complete!');
