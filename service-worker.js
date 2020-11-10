var cacheName = 'servie-worker-PWA-v1';
var appShellFiles = [
  '/index.html',
  '/icon.ico',
  '/manifest.json',
  '/service-worker.js',
  '/jquery.js',
  '/main.js',
  '/vapid.json'
];

self.addEventListener("activate",(activating)=>{
  console.log("Service Worker: All systems online, ready to go!");
});
self.addEventListener("fetch", (fe) => {
  console.log("Service Worker: User threw a ball, I need to fetch it!");
  fe.respondWith(
    caches.match(fe.request.url).then((response)=>{
      console.log("Service Worker: Fetching resource "+fe.request.url);
      return response||fetch(fe.request).then((response)=>{
        console.log("Service Worker: Resource "+fe.request.url+" not available in cache");
        return caches.open(ctc).then((cache)=>{
            console.log("Service Worker: Caching (new) resource "+fe.request.url);
            cache.put(fe.request,response.clone());
          return response;
        });
      }).catch(function(){      
        console.log("Service Worker: Fetching online failed, HAALLPPPP!!!");
        //Do something else with the request (respond with a different cached file)
      })
    })
  );
  console.log("Done fetching");
});

self.addEventListener("push",(pushing)=>{
	if(pushing.data){
    pushdata=JSON.parse(pushing.data.text());		
    console.log("Service Worker: I received this:",pushdata);
    if((pushdata["title"]!="")&&(pushdata["message"]!="")){			
      const options={ body:pushdata["message"] }
      self.registration.showNotification(pushdata["title"],options);
      console.log("Service Worker: I made a notification for the user");
    } else {
      console.log("Service Worker: I didn't make a notification for the user, not all the info was there :(");			
    }
  }
console.log("Done With Push");  
})

self.addEventListener("install",(ctc)=>{
  console.log("Service Worker: I am being installed, hello world!");
  //Put important offline files in cache on installation of the service worker
  ctc.waitUntil(
    caches.open(ctc).then((cache)=>{
      console.log("Service Worker: Caching important offline files");
      return cache.addAll(appShellFiles);
    })
  );
});