var CACHE = 'bimaniti-v7';

function getBasePath() {
  var scope = self.registration.scope;
  var url = new URL(scope);
  return url.pathname.replace(/\/$/, '');
}

function getPrecacheList() {
  var base = getBasePath();
  var files = [
    '',
    'index.html',
    'blog.html',
    'news.html',
    'archives.html',
    'about.html',
    'contact.html',
    'post.html',
    '404.html',
    'learn.html',
    'insurance-guide.html',
    'privacy.html',
    'terms.html',
    'disclaimer.html',
    'editorial.html',
    'learn/foundations.html',
    'learn/motor.html',
    'learn/health.html',
    'learn/life.html',
    'learn/home.html',
    'learn/travel.html',
    'learn/cyber.html',
    'assets/css/style.min.css',
    'assets/css/learn.css',
    'assets/css/guide.css',
    'assets/js/script.min.js',
    'assets/js/learn.js',
    'assets/js/guide.js',
    'logo.svg',
    'data/blogs.json',
    'data/news.json',
    'data/timeline.json',
    'data/metrics.json',
    'data/insurance-knowledge.json'
  ];
  return files.map(function(f) { return base + '/' + f; });
}

var PRECACHE = getPrecacheList();

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(PRECACHE);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  // Static assets: cache-first
  if (url.pathname.match(/\.(json|jpg|jpeg|png|gif|svg|webp|ico|woff2?)$/)) {
    e.respondWith(
      caches.match(e.request).then(function(r) {
        return r || fetch(e.request).then(function(response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML pages: network-first with offline fallback
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    e.respondWith(
      fetch(e.request).then(function(r) {
        var clone = r.clone();
        if (r.ok) {
          caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        }
        return r;
      }).catch(function() {
        return caches.match(e.request).then(function(cached) {
          return cached || caches.match(getBasePath() + '/404.html');
        });
      })
    );
    return;
  }

  // Other requests: stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      var fetchPromise = fetch(e.request).then(function(r) {
        if (r.ok) {
          var clone = r.clone();
          caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        }
        return r;
      }).catch(function() { return cached; });
      return cached || fetchPromise;
    })
  );
});
