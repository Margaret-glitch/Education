const CACHE_NAME = 'edurise-pwa-v1';
const ASSETS = [
    '/',
    '/pwa.css',
    '/pwa.js',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Do not cache api routes or server actions to prevent stale data
            if (event.request.url.includes('/api/')) {
                return fetch(event.request);
            }
            return cachedResponse || fetch(event.request);
        })
    );
});
