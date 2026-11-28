const CACHE='full-body-prod-v3221-20261128-1';
const ASSETS=['./','./index.html','./style.css','./app.mjs','./health-sync.mjs','./feedback.mjs','./history-presentation.mjs','./history-weeks.mjs','./reopen-workout.mjs','./activities.mjs','./activities-ui.mjs','./core.mjs','./native-bridge.mjs','./health-model.mjs','./health-combined.mjs','./heart-chart.mjs','./exercise-time.mjs','./training-ui.mjs','./plans.mjs','./workout-actions.mjs','./health-ui.mjs','./calendar.mjs','./program-weeks.mjs','./tracker.mjs','./accounts.mjs','./history-actions.mjs','./gyms.mjs','./cloud.mjs','./session.mjs','./training-time.mjs','./sync-ui.mjs','./seed.json','./manifest.webmanifest','./logo-full-body.png','./icon-180-v35.png','./icon-192-v35.png','./icon-512-v35.png','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('full-body-prod-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url),sdk=url.origin==='https://www.gstatic.com'&&url.pathname.startsWith('/firebasejs/13.2.0/');
 if(url.origin!==self.location.origin&&!sdk)return;
 e.respondWith(caches.open(CACHE).then(async c=>{const saved=await c.match(e.request);if(saved)return saved;const r=await fetch(e.request);if(sdk&&r.ok)await c.put(e.request,r.clone());return r;}));
});
