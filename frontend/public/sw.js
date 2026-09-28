/* Offline mode disabled — this worker only clears caches and unregisters itself */
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => self.registration.unregister())
  );
});
self.addEventListener('fetch', (e) => {
  // Network only — no offline fallback
  e.respondWith(fetch(e.request));
});
