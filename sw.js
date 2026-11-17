const CACHE='full-body-v3-20261117-9';
const ASSETS=['./','./index.html','./style.css','./app.mjs','./core.mjs','./tracker.mjs','./accounts.mjs','./history-actions.mjs','./gyms.mjs','./cloud.mjs','./session.mjs','./training-time.mjs','./sync-ui.mjs','./seed.json','./manifest.webmanifest','./logo-full-body.png','./icon-180-v35.png','./icon-192-v35.png','./icon-512-v35.png','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('full-body-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url),sdk=url.origin==='https://www.gstatic.com'&&url.pathname.startsWith('/firebasejs/13.2.0/');
 if(url.origin!==self.location.origin&&!sdk)return;
 e.respondWith(caches.open(CACHE).then(async c=>{const saved=await c.match(e.request);if(saved)return saved;const r=await fetch(e.request);if(sdk&&r.ok)await c.put(e.request,r.clone());return r;}));
});
