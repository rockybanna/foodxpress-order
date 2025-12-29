const CACHE_NAME = "foodxpress-v3";

/* Cache ONLY static files */
const STATIC_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./company-logo.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_FILES))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

/* VERY IMPORTANT:
   Do NOT intercept Google Apps Script API calls */
self.addEventListener("fetch", event => {
  const url = event.request.url;

  /* Always go to network for Apps Script */
  if (url.includes("script.google.com")) {
    return;
  }

  /* Cache-first for static files only */
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
