// Simple service worker for MeowGPT PWA
const CACHE_NAME = 'meowgpt-v1';

self.addEventListener('install', event => {
  console.log('Service worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Let the browser handle all fetch events
  // This is minimal - just enables PWA installation
});
