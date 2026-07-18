var CACHE = 'bimaniti-v2';
var PRECACHE = [
  '/',
  '/index.html',
  '/blog.html',
  '/news.html',
  '/archives.html',
  '/about.html',
  '/contact.html',
  '/post.html',
  '/404.html',
  '/style.css',
  '/script.js',
  '/logo.svg',
  '/data/home-featured.json',
  '/data/stack-images.json',
  '/data/timeline.json',
  '/data/metrics.json'
];

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
          return cached || caches.match('/404.html');
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
