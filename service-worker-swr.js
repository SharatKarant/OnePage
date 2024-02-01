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
            .then(cachedResponse => {
                // Return cached response if found
                if (cachedResponse) {
                    // Fetch in the background to update the cache for future requests
                    fetch(event.request)
                        .then(fetchResponse => {
                            // Check if we received a valid response
                            if (fetchResponse && fetchResponse.status === 200) {
                                // Clone the response and update the cache
                                const responseToCache = fetchResponse.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => cache.put(event.request, responseToCache));
                            }
                        })
                        .catch(() => {
                            // Ignore fetch errors in the background update
                        });

                    return cachedResponse;
                }

                // If not found in cache, fetch from the network and cache the response
                return fetch(event.request)
                    .then(fetchResponse => {
                        // Check if we received a valid response
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }

                        // Clone the response and cache it
                        const responseToCache = fetchResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, responseToCache));

                        return fetchResponse;
                    })
                    .catch(() => {
                        // If fetching fails, return the offline HTML
                        return caches.match('/offline.html') || fetch('/offline.html');
                    });
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
