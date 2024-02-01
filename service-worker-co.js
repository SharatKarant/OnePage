// service-worker.js

const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/manifest.json',
    '/icon.png',
    '/offline.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response;
                }

                // If not found in cache, return the offline HTML
                return caches.match('/offline.html') || fetch('/offline.html');
            })
    );
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'trigger-push-notification') {
        const { title, options } = event.data.payload;

        self.registration.showNotification(title, options);
    }
});

self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: '/icon.png',
    };

    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});
