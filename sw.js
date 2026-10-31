const CACHE = 'oibase-beveiliging-v3';
const BESTANDEN = ['/', '/diensten', '/objectbeveiliging', '/evenementenbeveiliging', '/zorgbeveiliging', '/horeca-facilitair', '/crisisondersteuning', '/bhv', '/servicemedewerkers', '/werkwijze', '/over-ons', '/werken-bij', '/contact', '/privacy', '/voorwaarden', '/style.css?v=3', '/site.js', '/logo.png', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BESTANDEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Pagina's: eerst netwerk (altijd actuele tekst), offline uit cache
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      const kopie = res.clone(); caches.open(CACHE).then(c => c.put(req, kopie)); return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('/'))));
    return;
  }
  // Afbeeldingen, iconen, lettertypes: eerst cache
  if (url.origin === location.origin || url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com') || url.hostname === 'images.unsplash.com') {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const kopie = res.clone(); caches.open(CACHE).then(c => c.put(req, kopie)); }
      return res;
    })));
  }
});
