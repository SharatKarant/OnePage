const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/vendor/aos/aos.css',
    '/assets/vendor/bootstrap/css/bootstrap.min.css',
    '/assets/vendor/bootstrap-icons/bootstrap-icons.css',
    '/assets/vendor/boxicons/css/boxicons.min.css',
    '/assets/vendor/glightbox/css/glightbox.min.css',
    '/assets/vendor/remixicon/remixicon.css',
    '/assets/vendor/swiper/swiper-bundle.min.css',
    '/assets/css/style.css',
    '/assets/img/clients/client-1.png',
    '/assets/img/clients/client-2.png',
    '/assets/img/clients/client-3.png',
    '/assets/img/clients/client-4.png',
    '/assets/img/clients/client-5.png',
    '/assets/vendor/purecounter/purecounter_vanilla.js',
    '/assets/vendor/aos/aos.js',
    '/assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
    '/assets/vendor/glightbox/js/glightbox.min.js',
    '/assets/vendor/isotope-layout/isotope.pkgd.min.js',
    '/assets/vendor/swiper/swiper-bundle.min.js',
    '/assets/vendor/php-email-form/validate.js',
    '/assets/js/main.js',
    '/assets/img/clients/client-6.png',
    '/assets/img/testimonials/testimonials-1.jpg',
    '/assets/img/testimonials/testimonials-2.jpg',
    '/assets/img/testimonials/testimonials-3.jpg',
    '/assets/img/testimonials/testimonials-4.jpg',
    '/assets/img/testimonials/testimonials-5.jpg',
    '/assets/img/portfolio/portfolio-1.jpg',
    '/assets/img/portfolio/portfolio-2.jpg',
    '/assets/img/portfolio/portfolio-3.jpg',
    '/assets/img/portfolio/portfolio-4.jpg',
    'assets/img/portfolio/portfolio-5.jpg',
    'manifest.json',
    'assets/img/portfolio/portfolio-6.jpg',
    'assets/img/portfolio/portfolio-7.jpg',
    'assets/img/portfolio/portfolio-8.jpg',
    'assets/img/portfolio/portfolio-9.jpg',
    'assets/img/team/team-1.jpg',
    'assets/img/team/team-2.jpg',
    'assets/img/team/team-3.jpg',
    'assets/img/team/team-4.jpg',
    'assets/img/hero-bg.jpg',
    'assets/vendor/remixicon/remixicon.woff2?t=1705244689813',
    'assets/vendor/boxicons/fonts/boxicons.woff2',
    'assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff2?dd67030699838ea613ee6dbda90effa6',
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
        caches.match(event.request)
            .then(response => {
                return response || caches.match('/offline.html');
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
