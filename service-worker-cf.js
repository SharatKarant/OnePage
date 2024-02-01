// service-worker.js

const CACHE_NAME = 'pwa-cache-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/img/favicon.png',
    '/index.js',
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
    const requestURL = new URL(event.request.url);

    // Exclude contact.html from caching when offline
    if ((requestURL.pathname.includes('/contact.html') ||  requestURL.pathname.includes('/about.html') ) && !navigator.onLine) {
        event.respondWith(caches.match('/offline.html') || fetch('/offline.html'));
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then(fetchResponse => {
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }

                        const responseToCache = fetchResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, responseToCache));

                        return fetchResponse;
                    })
                    .catch(() => {
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
