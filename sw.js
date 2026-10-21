/* YOLO Life Clock service worker: caches the app's static files so it can be added to the home screen
   and open offline. Network-first (so updates show right away), cache as fallback.
   Only the files below are handled; every other request (e.g. the original index.html) passes through. */
const CACHE='yolo-life-clock-v3';
const ASSETS=['clock.html','jar.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('yolo-life-clock-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
 const base=new URL('./',self.registration.scope).pathname;const name=u.pathname.startsWith(base)?u.pathname.slice(base.length):'';
 if(!ASSETS.includes(name))return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(name,cp))}return r}).catch(()=>caches.match(name)))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(cs=>{const c=cs.find(x=>x.url.includes('clock.html'));return c?c.focus():self.clients.openWindow('clock.html')}))});
