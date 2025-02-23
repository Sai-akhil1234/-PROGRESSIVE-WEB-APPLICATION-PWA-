// sw.js
// Cache resources
const cacheName = 'e-commerce-cache';
const resourcesToCache = [
    '/',
    '/styles.css',
    '/script.js',
    '/icon.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                return cache.addAll(resourcesToCache);
            })
    );
});

// Handle requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                // Simulate offline mode
                if (event.request.url === '/') {
                    return new Response('Offline mode', {
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                    });
                }

                return fetch(event.request);
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data === 'offline') {
        // Simulate offline mode
        caches.open(cacheName)
            .then((cache) => {
                cache.put('/', new Response('Offline mode', {
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                }));
            });
    }
});

// Handle push notifications
self.addEventListener('push', (event) => {
    if (event.data) {
        console.log('Push notification data:', event
