// Service Worker for Coba Web App PWA (GitHub Pages Compatible)
const CACHE_NAME = 'coba-web-app-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Base path for GitHub Pages
const BASE_PATH = '/coba-web-app';

// Files to cache for offline functionality
const STATIC_FILES = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/style.css`,
    `${BASE_PATH}/app.js`,
    `${BASE_PATH}/manifest.json`
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Service Worker: Static files cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker: Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activated');
                return self.clients.claim();
            })
            .catch(error => {
                console.error('❌ Service Worker: Error during activation:', error);
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests and non-http(s) requests
    if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests
    if (STATIC_FILES.includes(url.pathname) || url.pathname === BASE_PATH || url.pathname === `${BASE_PATH}/`) {
        // Static files - Cache First strategy
        event.respondWith(cacheFirst(request));
    } else if (url.pathname.startsWith(`${BASE_PATH}/api/`)) {
        // API requests - Network First strategy
        event.respondWith(networkFirst(request));
    } else {
        // Other requests - Stale While Revalidate strategy
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Cache First Strategy - for static files
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📱 Service Worker: Serving from cache:', request.url);
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ Service Worker: Cache first error:', error);
        
        // Return fallback page for navigation requests
        if (request.destination === 'document') {
            return caches.match(`${BASE_PATH}/index.html`);
        }
        
        throw error;
    }
}

// Network First Strategy - for API requests
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('🌐 Service Worker: Network failed, trying cache:', request.url);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline response for API requests
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'Coba Web App sedang offline'
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}

// Stale While Revalidate Strategy - for other resources
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(error => {
        console.log('🌐 Service Worker: Network error:', error);
        return cachedResponse;
    });
    
    return cachedResponse || fetchPromise;
}

// Background Sync
self.addEventListener('sync', event => {
    console.log('🔄 Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        console.log('🔄 Service Worker: Performing background sync');
        
        // Implement your background sync logic here
        // For example: sync offline data, send pending requests, etc.
        
        // Example: Send pending analytics
        await syncPendingAnalytics();
        
        console.log('✅ Service Worker: Background sync completed');
    } catch (error) {
        console.error('❌ Service Worker: Background sync failed:', error);
    }
}

async function syncPendingAnalytics() {
    // Example implementation for syncing analytics
    const pendingAnalytics = await getStoredAnalytics();
    
    if (pendingAnalytics.length > 0) {
        try {
            // Send analytics to server
            for (const event of pendingAnalytics) {
                await fetch(`${BASE_PATH}/api/analytics`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(event)
                });
            }
            
            // Clear stored analytics after successful sync
            await clearStoredAnalytics();
            console.log('📊 Service Worker: Analytics synced');
        } catch (error) {
            console.log('📊 Service Worker: Analytics sync failed, will retry later');
        }
    }
}

// Push Notifications
self.addEventListener('push', event => {
    console.log('🔔 Service Worker: Push received');
    
    const options = {
        body: 'Ada update baru di Coba Web App!',
        icon: `${BASE_PATH}/icon-192x192.png`,
        badge: `${BASE_PATH}/badge-72x72.png`,
        tag: 'app-notification',
        requireInteraction: false,
        actions: [
            {
                action: 'open',
                title: 'Buka App'
            },
            {
                action: 'dismiss',
                title: 'Tutup'
            }
        ]
    };
    
    if (event.data) {
        try {
            const data = event.data.json();
            options.body = data.body || options.body;
            options.title = data.title || 'Coba Web App';
        } catch (error) {
            console.error('❌ Service Worker: Error parsing push data:', error);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification('Coba Web App', options)
    );
});

// Notification Click
self.addEventListener('notificationclick', event => {
    console.log('🔔 Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(`${BASE_PATH}/`)
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        console.log('🔔 Service Worker: Notification dismissed');
    } else {
        // Default action - open app
        event.waitUntil(
            clients.matchAll().then(clientList => {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return clients.openWindow(`${BASE_PATH}/`);
            })
        );
    }
});

// Message handling
self.addEventListener('message', event => {
    console.log('💬 Service Worker: Message received:', event.data);
    
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({
                version: CACHE_NAME
            });
            break;
            
        case 'CLEAR_CACHE':
            event.waitUntil(clearAllCaches());
            break;
            
        case 'FORCE_UPDATE':
            event.waitUntil(forceUpdate());
            break;
            
        default:
            console.log('🤷 Service Worker: Unknown message type:', type);
    }
});

// Utility functions
async function getStoredAnalytics() {
    // Implement based on your storage solution
    // This is just an example
    return [];
}

async function clearStoredAnalytics() {
    // Implement based on your storage solution
    console.log('🗑️ Service Worker: Analytics cleared');
}

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🗑️ Service Worker: All caches cleared');
}

async function forceUpdate() {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(STATIC_FILES);
    console.log('🔄 Service Worker: Force update completed');
}

// Error handling
self.addEventListener('error', event => {
    console.error('❌ Service Worker: Global error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('❌ Service Worker: Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Periodic Background Sync (if supported)
self.addEventListener('periodicsync', event => {
    console.log('⏰ Service Worker: Periodic sync triggered:', event.tag);
    
    if (event.tag === 'content-sync') {
        event.waitUntil(syncContent());
    }
});

async function syncContent() {
    try {
        console.log('⏰ Service Worker: Syncing content...');
        
        // Implement periodic content sync here
        // For example: update cache with latest content
        
        const response = await fetch(`${BASE_PATH}/api/content/latest`);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(`${BASE_PATH}/api/content/latest`, response.clone());
        }
        
        console.log('✅ Service Worker: Content sync completed');
    } catch (error) {
        console.error('❌ Service Worker: Content sync failed:', error);
    }
}

console.log('🚀 Service Worker: Script loaded');
