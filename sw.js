// Plant Fleet - offline + auto update
// Online ho to hamesha naya version leta hai, offline ho to saved copy chalata hai.
const CACHE='plant-app-cache';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);if(u.origin!==location.origin)return;   // Firebase wagaira ko haath nahi lagate
 e.respondWith((async()=>{
  try{
   const net=await Promise.race([fetch(u.href,{cache:'no-store'}),new Promise((_,j)=>setTimeout(()=>j(new Error('timeout')),6000))]);
   if(net&&net.ok){const c=await caches.open(CACHE);c.put(r,net.clone())}
   return net;
  }catch(err){
   const c=await caches.match(r,{ignoreSearch:true});if(c)return c;
   if(r.mode==='navigate'){const i=await caches.match('index.html')||await caches.match('./');if(i)return i}
   throw err;
  }
 })());
});
