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
        fetch(event.request)
            .then(fetchResponse => {
                // Check if we received a valid response
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                    return caches.match(event.request)
                        .then(cachedResponse => cachedResponse || caches.match('/offline.html') || fetch('/offline.html'));
                }

                // Clone the response and cache it
                const responseToCache = fetchResponse.clone();
                caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, responseToCache));

                return fetchResponse;
            })
            .catch(() => {
                // If fetching fails, return the cached response or the offline HTML
                return caches.match(event.request)
                    .then(cachedResponse => cachedResponse || caches.match('/offline.html') || fetch('/offline.html'));
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
