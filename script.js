// script.js
// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('Service worker registered:', registration);
            })
            .catch((error) => {
                console.error('Service worker registration failed:', error);
            });
    });
}

// Handle offline button click
document.getElementById('offline-button').addEventListener('click', () => {
    // Simulate offline mode
    navigator.serviceWorker.controller.postMessage('offline');
});

// Handle push button click
document.getElementById('push-button').addEventListener('click', () => {
    // Request permission for push notifications
    Notification.requestPermission((permission) => {
        if (permission === 'granted') {
            // Create a new notification
            navigator.serviceWorker.getRegistration().then((registration) => {
                registration.showNotification('E-commerce PWA', {
                    body: 'You have a new order!',
                    icon: 'icon.png',
                });
            });
        }
    });
});


Service Worker

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
