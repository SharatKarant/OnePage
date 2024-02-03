const CACHE_NAME = 'pwa-cache-v1';
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
    const request = event.request;

    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(request).then(cachedResponse => {
                const fetchPromise = fetch(request).then(networkResponse => {
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                }).catch(() => {
                    return caches.match('/offline.html');
                });

                return cachedResponse || fetchPromise;
            });
        })
    );
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'trigger-push-notification') {
        const { title, body } = event.data.payload;
        const options = {
            body: body,
            icon: './assets/img/favicon.png',
            dir: "ltr",
            badge: "./assets/img/favicon.png",
            tag: "confirm-notification",
            renotify: true,
            lang: "en-US"
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});
