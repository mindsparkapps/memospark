const CACHE_NAME = 'memospark-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css?v=1',
  './app.js?v=1',
  './sync.js?v=1',
  './srs.js?v=1',
  './mazo-md.js?v=1',
  './formato.js?v=1',
  './config.js?v=1',
  './zenban-plugin-sdk.js?v=1',
  './manifest.json',
  './ejemplos/capitales-de-europa.md',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith('memospark-') && k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Primero la red (para recibir siempre la última versión) y la caché si no hay conexión.
// Google (inicio de sesión y Drive), las fuentes y las imágenes de otros sitios nunca pasan por la caché.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req).then((response) => {
      if (response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
      }
      return response;
    }).catch(() =>
      caches.match(req, { ignoreSearch: true }).then((cached) => cached || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
    )
  );
});
