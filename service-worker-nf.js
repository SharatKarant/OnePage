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
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, responseToCache));
                return response;
            })
            .catch((e) => {
                return caches.match(event.request)
                    .then(cachedResponse => cachedResponse || caches.match('/offline.html'))
                    .catch(error => console.error('Error fetching from cache:', error));
            })
    );
});


self.addEventListener('message', event => {
    if (event.data && event.data.type === 'trigger-push-notification') {
        const { title, body } = event.data.payload;
        const options = {
            body: body,
            icon: './assets/img/favicon.png',
            dir:"ltr",
            badge:"./assets/img/favicon.png",
            tag: "confirm-notification",
            renotify: true,
            lang: "en-US"
        };
    
        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});
