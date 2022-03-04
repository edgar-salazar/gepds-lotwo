var filesToCache = [
  "/",
  "/index.html",
  "/scripts/app.js",
  "/scripts/localforage-1.4.0.js",
  "/styles/ud811.css",
  "/images/clear.png",
  "/images/cloudy-scattered-showers.png",
  "/images/cloudy.png",
  "/images/fog.png",
  "/images/ic_add_white_24px.svg",
  "/images/ic_refresh_white_24px.svg",
  "/images/partly-cloudy.png",
  "/images/rain.png",
  "/images/scattered-showers.png",
  "/images/sleet.png",
  "/images/snow.png",
  "/images/thunderstorm.png",
  "/images/wind.png",
];

//Instala el service worker, crea un log y espera a que se termine
self.addEventListener("install", function (e) {
  console.log("[ServiceWorker] Install");
  //Se espera a que el archivo se termine de hacer y se guarda para funcionar offline
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(filesToCache);
    })
  );
});

//Listo para revisar si hay cambios y sustituirlos por los mas actuales
self.addEventListener("activate", function (e) {
  console.log("[ServiceWorker] Activate");
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          //si no es igual a la cache que se tenia se elimina
          if (key !== cacheName) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

//Se conecta a internet por medio de una solicitud buscando el registro, comparando y regresa una respuesta
self.addEventListener('fetch', function(e){
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response){
      return response || fetch(e.request);
    })
  );
});

