(function() {
    var saved = localStorage.getItem('theme') || 'light';
    if (saved === 'dark') {
        document.documentElement.classList.add('dark');
    }
})();

var ITEMS_PER_PAGE = 10;

function loadData(url) {
    return fetch(url, { mode: 'same-origin' }).then(function(r) { if (!r.ok) throw new Error('HTTP '+r.status); return r.json(); }).catch(function() {
        return new Promise(function(resolve, reject) {
            try {
                var x = new XMLHttpRequest();
                x.open('GET', url, true);
                x.onreadystatechange = function() {
                    if (x.readyState === 4) {
                        if (x.status === 0 || x.status === 200) { try { resolve(JSON.parse(x.responseText)); } catch(e) { reject(e); } }
                        else { reject(new Error('XHR '+x.status)); }
                    }
                };
                x.onerror = function() { reject(new Error('Network')); };
                x.send();
            } catch(e) { reject(e); }
        });
    });
}

function handleImgError(img) {
    img.onerror = null;
    var d = document.createElement('div');
    d.style.cssText = 'background:var(--border);border-radius:4px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:13px;font-family:Outfit,sans-serif;';
    d.style.width = img.style.width || '100%';
    d.style.height = img.style.height || '200px';
    d.textContent = 'Image unavailable';
    if (img.parentNode) img.parentNode.replaceChild(d, img);
}

function searchContent(item, query) {
    if (!query) return true;
    var q = query.toLowerCase();
    if (item.title.toLowerCase().indexOf(q) !== -1) return true;
    if (item.summary.toLowerCase().indexOf(q) !== -1) return true;
    if (item.category && item.category.toLowerCase().indexOf(q) !== -1) return true;
    if (item.tags) {
        var tags = typeof item.tags === 'string' ? [item.tags] : item.tags;
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].toLowerCase().indexOf(q) !== -1) return true;
        }
    }
    if (item.source && item.source.toLowerCase().indexOf(q) !== -1) return true;
    if (item.author && item.author.toLowerCase().indexOf(q) !== -1) return true;
    return false;
}

function showSkeleton(container, count) {
    var html = '';
    for (var i = 0; i < count; i++) {
        html += '<div class="skeleton skeleton-card"><div class="skeleton-text"></div><div class="skeleton-text-short"></div></div>';
    }
    container.innerHTML = html;
}

(function() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('open');
            if (menuIcon) menuIcon.classList.toggle('hidden');
            if (closeIcon) closeIcon.classList.toggle('hidden');
        });
    }
})();

// Reading progress bar
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('single-post-container')) {
        var bar = document.createElement('div');
        bar.className = 'progress-bar';
        document.body.prepend(bar);
        window.addEventListener('scroll', function() {
            var h = document.documentElement.scrollHeight - window.innerHeight;
            var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
            bar.style.width = pct + '%';
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var cacheBuster = '?t=' + new Date().getTime();
    var yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    var profileData = null;
    loadData('data/profile.json' + cacheBuster)
        .then(function(data) { profileData = data; })
        .catch(function() {});

    // Stacking gallery
    var stackingContainer = document.getElementById('stacking-container');
    if (stackingContainer) {
        loadData('data/stack-images.json' + cacheBuster)
            .then(function(data) {
                stackingContainer.innerHTML = data.slice(0, 3).map(function(img) {
                    var webpSrc = img.image.replace(/\.jpg$/, '.webp');
                    return '<div class="stack-layer"><div class="stack-content"><div class="stack-img-wrapper"><picture><source srcset="' + webpSrc + '" type="image/webp"><img src="' + img.image + '" alt="' + img.title + '" class="stack-img" loading="lazy" width="1200" height="700" onerror="handleImgError(this)"></picture><div class="stack-overlay"></div></div><div class="stack-text"><h2 class="stack-title">' + img.title + '</h2><p class="stack-desc">' + img.desc + '</p></div></div></div>';
                }).join('');
            })
            .catch(function() {});
    }

    // Blog listing
    var blogFeedContainer = document.getElementById('blog-feed-container');
    var blogFilters = document.getElementById('blog-filters');
    if (blogFeedContainer && blogFilters) {
        var allBlogPosts = [];
        var blogFilter = 'all';
        var blogSearch = '';
        var blogPage = 1;

        showSkeleton(blogFeedContainer, 4);

        loadData('data/blogs.json' + cacheBuster)
            .then(function(data) {
                allBlogPosts = data;
                renderBlogPage(data);
            })
            .catch(function() {
                blogFeedContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">Unable to load blog posts.</p>';
            });

        document.querySelectorAll('#blog-filters .filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                blogFilter = this.dataset.filter;
                document.querySelectorAll('#blog-filters .filter-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                blogPage = 1;
                filterBlogPage();
            });
        });

        var blogSearchInput = document.getElementById('blog-search');
        if (blogSearchInput) {
            blogSearchInput.addEventListener('input', function() {
                blogSearch = this.value.toLowerCase();
                blogPage = 1;
                filterBlogPage();
            });
        }

        function filterBlogPage() {
            var filtered = allBlogPosts;
            if (blogFilter !== 'all') {
                filtered = filtered.filter(function(p) { return p.category === blogFilter; });
            }
            if (blogSearch) {
                filtered = filtered.filter(function(p) { return searchContent(p, blogSearch); });
            }
            renderBlogPage(filtered);
        }

        function renderBlogPage(posts) {
            if (posts.length === 0) {
                blogFeedContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">No posts match your criteria.</p>';
                return;
            }
            var totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
            if (blogPage > totalPages) blogPage = totalPages;
            var start = (blogPage - 1) * ITEMS_PER_PAGE;
            var pageItems = posts.slice(start, start + ITEMS_PER_PAGE);

            blogFeedContainer.innerHTML = pageItems.map(function(item) {
                var imgSrc = 'assets/images/blog/' + (item.slug || item.id.toLowerCase()) + '.jpg';
                return '<a href="post/' + item.slug + '.html" class="blog-card" style="display:flex;gap:20px;flex-wrap:wrap"><div style="flex:1;min-width:240px"><span class="blog-card-tag">' + item.category + '</span><h2 class="blog-card-title">' + item.title + '</h2><p class="blog-card-excerpt">' + item.summary + '</p><div class="blog-card-footer"><div class="blog-card-meta"><strong>' + item.author + '</strong> \u00B7 ' + item.published_date + ' \u00B7 ' + item.read_time + '</div><span class="blog-card-more">Read more \u2192</span></div></div><img src="' + imgSrc + '" alt="" loading="lazy" width="180" height="120" style="border-radius:4px;object-fit:cover;flex-shrink:0" onerror="this.style.display=\'none\'"></a>';
            }).join('');

            if (totalPages > 1) {
                var pagHtml = '<div class="pagination">';
                pagHtml += '<button class="pagination-btn" ' + (blogPage <= 1 ? 'disabled' : '') + ' onclick="window.blogPage=' + (blogPage - 1) + ';window.filterBlogPage();">\u2190 Previous</button>';
                pagHtml += '<span class="pagination-info">Page ' + blogPage + ' of ' + totalPages + '</span>';
                pagHtml += '<button class="pagination-btn" ' + (blogPage >= totalPages ? 'disabled' : '') + ' onclick="window.blogPage=' + (blogPage + 1) + ';window.filterBlogPage();">Next \u2192</button>';
                pagHtml += '</div>';
                blogFeedContainer.insertAdjacentHTML('beforeend', pagHtml);
            }
        }

        window.blogPage = 1;
        window.filterBlogPage = filterBlogPage;
    }

    // News listing
    var newsFeedContainer = document.getElementById('news-feed-container');
    var newsFilters = document.getElementById('news-filters');
    if (newsFeedContainer && newsFilters) {
        var allNewsItems = [];
        var newsFilter = 'all';
        var newsSearch = '';
        var newsPage = 1;

        showSkeleton(newsFeedContainer, 4);

        loadData('data/news.json' + cacheBuster)
            .then(function(data) {
                allNewsItems = data;
                renderNewsPage(data);
            })
            .catch(function() {
                newsFeedContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">Unable to load news.</p>';
            });

        document.querySelectorAll('#news-filters .filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                newsFilter = this.dataset.filter;
                document.querySelectorAll('#news-filters .filter-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                newsPage = 1;
                filterNewsPage();
            });
        });

        var newsSearchInput = document.getElementById('news-search');
        if (newsSearchInput) {
            newsSearchInput.addEventListener('input', function() {
                newsSearch = this.value.toLowerCase();
                newsPage = 1;
                filterNewsPage();
            });
        }

        function filterNewsPage() {
            var filtered = allNewsItems;
            if (newsFilter !== 'all') {
                filtered = filtered.filter(function(p) { return p.category === newsFilter; });
            }
            if (newsSearch) {
                filtered = filtered.filter(function(p) { return searchContent(p, newsSearch); });
            }
            renderNewsPage(filtered);
        }

        function renderNewsPage(items) {
            if (items.length === 0) {
                newsFeedContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">No news items match your criteria.</p>';
                return;
            }
            var totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
            if (newsPage > totalPages) newsPage = totalPages;
            var start = (newsPage - 1) * ITEMS_PER_PAGE;
            var pageItems = items.slice(start, start + ITEMS_PER_PAGE);

            newsFeedContainer.innerHTML = pageItems.map(function(item) {
                var imgSrc = 'assets/images/news/' + (item.slug || item.id.toLowerCase()) + '.jpg';
                return '<a href="post/' + item.slug + '.html" class="blog-card" style="display:flex;gap:20px;flex-wrap:wrap"><div style="flex:1;min-width:240px"><span class="blog-card-tag">' + item.category + '</span><h2 class="blog-card-title">' + item.title + '</h2><p class="blog-card-excerpt">' + item.summary + '</p><div class="blog-card-footer"><div class="blog-card-meta"><strong>' + (item.source || item.author) + '</strong> \u00B7 ' + item.published_date + '</div><span class="blog-card-more">Read more \u2192</span></div></div><img src="' + imgSrc + '" alt="" loading="lazy" width="180" height="120" style="border-radius:4px;object-fit:cover;flex-shrink:0" onerror="this.style.display=\'none\'"></a>';
            }).join('');

            if (totalPages > 1) {
                var pagHtml = '<div class="pagination">';
                pagHtml += '<button class="pagination-btn" ' + (newsPage <= 1 ? 'disabled' : '') + ' onclick="window.newsPage=' + (newsPage - 1) + ';window.filterNewsPage();">\u2190 Previous</button>';
                pagHtml += '<span class="pagination-info">Page ' + newsPage + ' of ' + totalPages + '</span>';
                pagHtml += '<button class="pagination-btn" ' + (newsPage >= totalPages ? 'disabled' : '') + ' onclick="window.newsPage=' + (newsPage + 1) + ';window.filterNewsPage();">Next \u2192</button>';
                pagHtml += '</div>';
                newsFeedContainer.insertAdjacentHTML('beforeend', pagHtml);
            }
        }

        window.newsPage = 1;
        window.filterNewsPage = filterNewsPage;
    }

    // Single post view
    var singlePostContainer = document.getElementById('single-post-container');
    if (singlePostContainer) {
        var urlParams = new URLSearchParams(window.location.search);
        var postId = urlParams.get('id') || null;
        var postSlug = urlParams.get('slug') || (window.location.hash ? window.location.hash.substring(1) : null);

        if (!postId && !postSlug) {
            singlePostContainer.innerHTML = '<div class="text-center py-20" style="color: var(--text-muted);">No post specified.</div>';
        } else {
            Promise.all([
                loadData('data/blogs.json' + cacheBuster).catch(function() { return []; }),
                loadData('data/news.json' + cacheBuster).catch(function() { return []; })
            ]).then(function(results) {
                var blogs = results[0], news = results[1];
                var allItems = blogs.concat(news);
                var post;
                if (postId) {
                    post = allItems.find(function(item) { return item.id === postId; });
                } else {
                    post = allItems.find(function(item) { return item.slug === postSlug; });
                }

                if (!post) {
                    singlePostContainer.innerHTML = '<div class="text-center py-20" style="color: var(--text-muted);">Post not found.</div>';
                    return;
                }

                // Dynamic meta tags for SEO
                document.title = post.title + ' | BimaNiti';
                var ogTitle = document.querySelector('meta[property="og:title"]');
                var ogDesc = document.querySelector('meta[property="og:description"]');
                var ogUrl = document.querySelector('meta[property="og:url"]');
                var ogImage = document.querySelector('meta[property="og:image"]');
                var desc = document.querySelector('meta[name="description"]');
                var canonical = document.querySelector('link[rel="canonical"]');
                var postUrl = 'https://bimaniti.in/post.html?id=' + post.id;
                if (desc) desc.setAttribute('content', post.summary);
                if (ogTitle) ogTitle.setAttribute('content', post.title + ' | BimaNiti');
                if (ogDesc) ogDesc.setAttribute('content', post.summary);
                if (ogUrl) ogUrl.setAttribute('content', postUrl);
                if (ogImage && post.image) ogImage.setAttribute('content', 'https://bimaniti.in/' + post.image);
                if (canonical) canonical.setAttribute('href', postUrl);

                // JSON-LD for Article
                var jsonld = document.createElement('script');
                jsonld.type = 'application/ld+json';
                jsonld.textContent = JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": post.title,
                    "description": post.summary,
                    "author": { "@type": "Person", "name": post.author || "BimaNiti" },
                    "datePublished": post.published_date,
                    "url": postUrl,
                    "mainEntityOfPage": { "@type": "WebPage", "@id": postUrl }
                });
                document.head.appendChild(jsonld);

                // Add breadcrumb JSON-LD
                var breadcrumb = document.createElement('script');
                breadcrumb.type = 'application/ld+json';
                breadcrumb.textContent = JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bimaniti.in/" },
                        { "@type": "ListItem", "position": 2, "name": post.category, "item": "https://bimaniti.in/blog.html" },
                        { "@type": "ListItem", "position": 3, "name": post.title }
                    ]
                });
                document.head.appendChild(breadcrumb);

                var formattedContent = (post.content || post.summary || '').replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/_(.*?)_/g, '<em>$1</em>');

                var prevHtml = '';
                if (post.previous_coverage) {
                    prevHtml = '<div class="prev-coverage-banner">📌 Earlier coverage: <a href="post.html?id=' + post.previous_coverage.id + '">' + post.previous_coverage.title + '</a> →</div>';
                }

                var relatedHtml = '';
                if (post.related_ids && post.related_ids.length > 0) {
                    var relatedItems = allItems.filter(function(r) { return post.related_ids.indexOf(r.id) !== -1; });
                    if (relatedItems.length > 0) {
                        relatedHtml = '<div style="max-width:680px;margin:3rem auto 0;border-top:1px solid var(--border);padding-top:2rem;"><div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);margin-bottom:1rem;">Related Coverage</div><div style="display:grid;gap:1rem;">';
                        relatedItems.forEach(function(r) {
                            relatedHtml += '<a href="post.html?id=' + r.id + '" style="display:block;background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;padding:16px;text-decoration:none;transition:border-color 0.15s;"><span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:20px;background:var(--accent);color:#fff;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + r.category + '</span><div style="font-family:var(--font-display);font-size:16px;color:var(--text-primary);margin-bottom:4px;">' + r.title + '</div><div style="font-size:12px;color:var(--text-muted);">' + r.published_date + '</div></a>';
                        });
                        relatedHtml += '</div></div>';
                    }
                }

                // Related by tags fallback
                if (!relatedHtml && post.tags) {
                    var postTags = typeof post.tags === 'string' ? [post.tags] : post.tags;
                    var relatedByTag = allItems.filter(function(r) {
                        if (r.id === post.id) return false;
                        if (!r.tags) return false;
                        var rTags = typeof r.tags === 'string' ? [r.tags] : r.tags;
                        return rTags.some(function(t) { return postTags.indexOf(t) !== -1; });
                    }).slice(0, 3);
                    if (relatedByTag.length > 0) {
                        relatedHtml = '<div style="max-width:680px;margin:3rem auto 0;border-top:1px solid var(--border);padding-top:2rem;"><div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);margin-bottom:1rem;">Related Coverage</div><div style="display:grid;gap:1rem;">';
                        relatedByTag.forEach(function(r) {
                            relatedHtml += '<a href="post.html?id=' + r.id + '" style="display:block;background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;padding:16px;text-decoration:none;transition:border-color 0.15s;"><span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:20px;background:var(--accent);color:#fff;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + r.category + '</span><div style="font-family:var(--font-display);font-size:16px;color:var(--text-primary);margin-bottom:4px;">' + r.title + '</div><div style="font-size:12px;color:var(--text-muted);">' + r.published_date + '</div></a>';
                        });
                        relatedHtml += '</div></div>';
                    }
                }

                var shareUrl = encodeURIComponent(postUrl);
                var shareText = encodeURIComponent(post.title + ' | BimaNiti');

                singlePostContainer.innerHTML = '<div class="post-hero"><div class="post-hero-inner"><span class="post-hero-tag">' + post.category + '</span><h1>' + post.title + '</h1><div class="post-hero-byline"><strong>' + (post.author || 'BimaNiti') + '</strong> \u00B7 ' + post.published_date + ' \u00B7 ' + (post.read_time || '6 min read') + '</div></div></div><div class="post-body-wrapper"><div class="post-content">' + prevHtml + formattedContent + '</div>' + relatedHtml + '<div class="post-sources" style="max-width: 680px; margin: 3rem auto 0; border-top: 1px solid var(--border); padding-top: 1.5rem;"><span style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);margin-bottom:1rem;">Share this article</span><div style="display:flex;gap:0.5rem;flex-wrap:wrap;"><button class="share-btn" onclick="window.open(\'https://twitter.com/intent/tweet?text=\'+encodeURIComponent(document.title)+\' \'+encodeURIComponent(window.location.href),\'\',\'width=600,height=400\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> X</button><button class="share-btn" onclick="window.open(\'https://www.linkedin.com/sharing/share-offsite/?url=\'+encodeURIComponent(window.location.href),\'\',\'width=600,height=400\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> LinkedIn</button><button class="share-btn" onclick="window.open(\'https://api.whatsapp.com/send?text=\'+encodeURIComponent(document.title)+\' \'+encodeURIComponent(window.location.href),\'\',\'width=600,height=400\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> WhatsApp</button><button class="share-btn" onclick="window.location.href=\'mailto:?subject=\'+encodeURIComponent(document.title)+\'&body=\'+encodeURIComponent(window.location.href)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg> Email</button></div></div></div>';
            });
        }
    }

    // Archives page
    var archivesContainer = document.getElementById('archives-container');
    if (archivesContainer) {
        Promise.all([
            loadData('data/blogs.json' + cacheBuster).catch(function() { return []; }),
            loadData('data/news.json' + cacheBuster).catch(function() { return []; })
        ]).then(function(results) {
            var blogs = results[0], news = results[1];
            var allItems = blogs.map(function(b) { b.type = 'Blog'; return b; }).concat(news.map(function(n) { n.type = 'News'; return n; }));
            allItems.sort(function(a, b) {
                if (a.published_date < b.published_date) return 1;
                if (a.published_date > b.published_date) return -1;
                return 0;
            });

            if (allItems.length === 0) {
                archivesContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">No content archived yet.</p>';
                return;
            }

            var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            var grouped = {};
            allItems.forEach(function(item) {
                var parts = item.published_date.split('-');
                var monthKey = parts[0] + '-' + parts[1];
                var label = monthNames[parseInt(parts[1]) - 1] + ' ' + parts[0];
                if (!grouped[monthKey]) grouped[monthKey] = { label: label, items: [] };
                grouped[monthKey].items.push(item);
            });

            var monthKeys = Object.keys(grouped).sort().reverse();
            var html = '';
            monthKeys.forEach(function(key) {
                html += '<div class="archive-section-title">' + grouped[key].label + '</div>';
                grouped[key].items.forEach(function(item) {
                    html += '<a href="post.html?id=' + item.id + '" class="archive-row" style="display: flex; justify-content: space-between; align-items: baseline;"><div class="archive-row-left"><span class="archive-row-tag">' + item.category + '</span><span class="archive-row-tag">' + item.type + '</span><span class="archive-row-title">' + item.title + '</span></div><span class="archive-row-date">' + item.published_date + '</span></a>';
                });
            });

            archivesContainer.innerHTML = html;
        }).catch(function() {
            archivesContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">Unable to load archives.</p>';
        });
    }

    // Featured posts on home
    var featuredContainer = document.getElementById('featured-posts');
    if (featuredContainer) {
        showSkeleton(featuredContainer, 3);
        loadData('data/blogs.json' + cacheBuster)
            .then(function(blogs) {
                var featured = blogs.slice(0, 3);
                featuredContainer.innerHTML = featured.map(function(blog) {
                    return '<a href="post.html?id=' + blog.id + '" class="card-link"><article class="card"><div class="card-body"><span class="card-label">' + blog.category + '</span><h3 class="card-title">' + blog.title + '</h3><p class="card-excerpt">' + blog.summary + '</p><div class="card-meta"><span>' + blog.published_date + '</span><span>\u00B7</span><span>' + blog.author + '</span></div></div></article></a>';
                }).join('');
            })
            .catch(function() { featuredContainer.innerHTML = ''; });
    }

    // Latest news on home
    var latestNews = document.getElementById('latest-news');
    if (latestNews) {
        showSkeleton(latestNews, 3);
        loadData('data/news.json' + cacheBuster)
            .then(function(news) {
                var latest = news.slice(0, 3);
                latestNews.innerHTML = latest.map(function(item) {
                    return '<a href="post.html?id=' + item.id + '" class="post-card"><div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem;"><span class="news-source">' + (item.source || item.author) + '</span><span style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap;">' + item.published_date + '</span></div><h3 style="font-family: var(--font-display); font-size: 1.1rem; color: var(--text-primary); margin: 0.5rem 0;">' + item.title + '</h3><p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">' + item.summary + '</p></a>';
                }).join('');
            })
            .catch(function() { latestNews.innerHTML = ''; });
    }

    // Theme toggle
    document.querySelectorAll('.theme-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var html = document.documentElement;
            var isDark = html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    });

    // Recent writing on About page
    var recentWritingContainer = document.getElementById('recent-writing-container');
    if (recentWritingContainer) {
        loadData('data/blogs.json' + cacheBuster)
            .then(function(blogs) {
                var latest = blogs.slice(0, 3);
                recentWritingContainer.innerHTML = latest.map(function(blog) {
                    return '<a href="post.html?id=' + blog.id + '" class="post-row" style="display: flex; gap: 16px; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid var(--border);"><div class="post-tag">' + blog.category + '</div><div class="post-info"><div class="post-title">' + blog.title + '</div><div class="post-meta">' + blog.published_date + ' \u00B7 ' + blog.read_time + '</div></div></a>';
                }).join('');
            })
            .catch(function() {
                recentWritingContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 14px; font-weight: 300;">Unable to load recent posts.</p>';
            });
    }

    // === Scroll-triggered animations ===
    // Hero animations — immediate on load
    document.querySelectorAll('.hero .fade-in, .hero .fade-in-up').forEach(function(el) {
        el.classList.add('visible');
    });

    function animateOnScroll() {
        var elements = document.querySelectorAll('.fade-in, .fade-in-up, .timeline-item, .stat-card');
        if (!elements.length) return;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        elements.forEach(function(el) { observer.observe(el); });
    }
    animateOnScroll();

    // === Counter animation ===
    function animateCounter(el, target, duration, suffix) {
        var start = 0;
        var startTime = null;
        suffix = suffix || '';
        duration = duration || 1500;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(eased * target * 10) / 10;
            el.textContent = (target % 1 !== 0 ? current.toFixed(1) : Math.round(current)) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // === Insurance Timeline ===
    var timelineContainer = document.getElementById('insurance-timeline');
    if (timelineContainer) {
        loadData('data/timeline.json' + cacheBuster)
            .then(function(events) {
                timelineContainer.innerHTML = events.map(function(ev) {
                    return '<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-year">' + ev.year + '</div><div class="timeline-title">' + ev.title + '</div><div class="timeline-desc">' + ev.desc + '</div></div>';
                }).join('');
                animateOnScroll();
            })
            .catch(function() {
                timelineContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Unable to load timeline.</p>';
            });
    }

    // === Data Charts ===
    var dataChartsContainer = document.getElementById('data-charts');
    if (dataChartsContainer) {
        loadData('data/metrics.json' + cacheBuster)
            .then(function(metrics) {
                var html = '';

                // Stat cards row
                html += '<div class="stat-cards" style="grid-column: 1 / -1;">';
                html += '<div class="stat-card"><div class="stat-value" data-target="3.8" data-suffix="%" data-decimal="true">0%</div><div class="stat-label">Insurance Penetration</div></div>';
                html += '<div class="stat-card"><div class="stat-value" data-target="97" data-suffix="">0</div><div class="stat-label">Density (USD)</div></div>';
                html += '<div class="stat-card"><div class="stat-value" data-target="10.51" data-suffix="L Cr" data-decimal="true">0</div><div class="stat-label">Total Premium FY26</div></div>';
                html += '</div>';

                // Penetration chart
                if (metrics.penetration) {
                    html += '<div class="data-chart-block"><div class="chart-title">' + metrics.penetration.title + '</div>';
                    metrics.penetration.data.forEach(function(d) {
                        var pct = (d.value / metrics.penetration.maxValue * 100).toFixed(1);
                        html += '<div class="bar-row"><div class="bar-label">' + d.label + '</div><div class="bar-track"><div class="bar-fill" style="--bar-width: ' + pct + '%"></div></div><div class="bar-value">' + d.value + '%</div></div>';
                    });
                    html += '</div>';
                }

                // Density chart
                if (metrics.density) {
                    html += '<div class="data-chart-block"><div class="chart-title">' + metrics.density.title + '</div>';
                    metrics.density.data.forEach(function(d) {
                        var pct = (d.value / metrics.density.maxValue * 100).toFixed(1);
                        html += '<div class="bar-row"><div class="bar-label">' + d.label + '</div><div class="bar-track"><div class="bar-fill" style="--bar-width: ' + pct + '%"></div></div><div class="bar-value">$' + d.value + '</div></div>';
                    });
                    html += '</div>';
                }

                // Market share chart
                if (metrics.marketShare) {
                    html += '<div class="data-chart-block" style="grid-column: 1 / -1;"><div class="chart-title">' + metrics.marketShare.title + '</div>';
                    metrics.marketShare.data.forEach(function(d) {
                        var pct = (d.value / metrics.marketShare.maxValue * 100).toFixed(1);
                        html += '<div class="bar-row"><div class="bar-label" style="min-width: 110px;">' + d.label + '</div><div class="bar-track"><div class="bar-fill" style="--bar-width: ' + pct + '%; background: ' + d.color + ';"></div></div><div class="bar-value">' + d.value + '%</div></div>';
                    });
                    html += '</div>';
                }

                dataChartsContainer.innerHTML = html;

                // Animate stat counters
                var statValues = dataChartsContainer.querySelectorAll('.stat-value');
                var statObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            var el = entry.target;
                            var target = parseFloat(el.dataset.target);
                            var suffix = el.dataset.suffix || '';
                            var isDecimal = el.dataset.decimal === 'true';
                            var start = 0;
                            var startTime = null;
                            var duration = 1500;

                            function step(timestamp) {
                                if (!startTime) startTime = timestamp;
                                var progress = Math.min((timestamp - startTime) / duration, 1);
                                var eased = 1 - Math.pow(1 - progress, 3);
                                var current = eased * target;
                                el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
                                if (progress < 1) requestAnimationFrame(step);
                            }
                            requestAnimationFrame(step);
                            el.classList.add('visible');
                            statObserver.unobserve(el);
                        }
                    });
                }, { threshold: 0.3 });

                statValues.forEach(function(el) { statObserver.observe(el); });

                // Animate bar fills
                var barFills = dataChartsContainer.querySelectorAll('.bar-fill');
                var barObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate');
                            barObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.2 });

                barFills.forEach(function(bar) { barObserver.observe(bar); });
            })
            .catch(function() {
                dataChartsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1 / -1;">Unable to load industry data.</p>';
            });
    }
});
