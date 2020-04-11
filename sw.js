const version = 1;
const cacheName = `precache-v${version}`;
const img404 = "/images/404.png";
const urlsToCache = [
    "/",
    "/index.html",
    "/page-1.html",
    "/js/main.js",
    "/css/main.css",
    img404
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches
            .keys()
            .then(items => items.filter(item => item !== cacheName))
            .then(items => Promise.all(items.map(item => caches.delete(item))))
            .then(() => clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const { request } = event;
    if (request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches
                .match(request)
                .then(cacheResponse => cacheResponse || caches.match(img404))
        );
    }
});
