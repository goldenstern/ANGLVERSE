// === УСТАНОВКА ===
self.addEventListener("install", function(event) {
  self.skipWaiting(); // ⚡ сразу активируем новый SW
  event.waitUntil(preLoad());
});

function preLoad() {
  console.log("Installing web app");
  return caches.open("offline").then(function(cache) {
    console.log("caching index and important routes");
    return cache.addAll(["/"]);
  });
}

// === АКТИВАЦИЯ ===
self.addEventListener("activate", function(event) {
  // ⚡ новый SW сразу берёт под контроль все вкладки
  event.waitUntil(clients.claim());
});

// === ФЕТЧ (если нужно оффлайн-кэширование) ===
// self.addEventListener("fetch", function(event) {
//   event.respondWith(
//     checkResponse(event.request).catch(function() {
//       return returnFromCache(event.request);
//     })
//   );
//   event.waitUntil(addToCache(event.request));
// });

function checkResponse(request) {
  return new Promise(function(fulfill, reject) {
    fetch(request).then(function(response) {
      if (response.status !== 404) {
        fulfill(response);
      } else {
        reject();
      }
    }, reject);
  });
}

function addToCache(request) {
  return caches.open("offline").then(function (cache) {
    return fetch(request).then(function (response) {
      console.log(response.url + " was cached");
      return cache.put(request, response);
    });
  });
}

function returnFromCache(request) {
  return caches.open("offline").then(function (cache) {
    return cache.match(request).then(function (matching) {
       return matching;
    });
  });
}

// === ДОБАВЛЯЕМ КОМАНДУ НА ОБНОВЛЕНИЕ ===
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
