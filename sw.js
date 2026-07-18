var CACHE = 'bimaniti-v1';
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
  '/logo.svg'
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
    })
  );
});

self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);
  if (url.pathname.match(/\.(json|jpg|jpeg|png|gif|svg|webp|ico|woff2?)$/)) {
    e.respondWith(
      caches.match(e.request).then(function(r) { return r || fetch(e.request); })
    );
    return;
  }
  e.respondWith(
    fetch(e.request).then(function(r) {
      var clone = r.clone();
      if (r.ok) {
        caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
      }
      return r;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});
