// Offline: ilova fayllari keshdan, ma’lumot (data/) avval internetdan, bo‘lmasa keshdan.
const V="nazariya-v1";
const SHELL=["./","index.html","style.css","app.js","manifest.webmanifest","icon.svg","data/books.json","data/questions.json"];
self.addEventListener("install",e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
const put=(req,res)=>{if(res&&res.ok){const c=res.clone();caches.open(V).then(x=>x.put(req,c))}return res};
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;
  if(u.pathname.includes("/data/")){
    e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>put(r,res)).catch(()=>caches.match(r)));
  }else{
    e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>put(r,res)).catch(()=>hit);return hit||net}));
  }
});
