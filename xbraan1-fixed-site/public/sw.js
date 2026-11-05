// Kill-switch service worker.
// Earlier releases shipped a cache-first service worker that could keep serving an old copy of the
// site. This file replaces it: it deletes every cache, unregisters itself and reloads open tabs, so
// returning visitors receive the current site. It is safe to leave in place permanently.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});
