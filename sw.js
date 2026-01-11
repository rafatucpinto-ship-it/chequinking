
const CACHE_NAME = 'checklist-app-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Install SW
self.addEventListener('install', (event) => {
  // Force waiting SW to become active immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache files during install:', error);
      })
  );
});

// Activate the SW
self.addEventListener('activate', (event) => {
  // Claim clients immediately so the user doesn't need to reload twice
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Listen for requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Don't cache external resources (like CDNs) in this simple strategy 
            // to avoid CORS issues, unless we implement specific logic.
            // For now, return the network response directly.
            return response;
          }
        );
      }).catch(() => {
        // Fallback for navigation requests (e.g., if offline and opening the app)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});
