const ALMACEN = 'caches';
const LISTA_ARCHIVOS_CACHEADOS = [
    'index.html',
    'js/main.js',
    '/'
];

self.addEventListener('install', (e) => {
    console.log("Instalando...");
    e.waitUntil(
        caches.open(ALMACEN).then(cache => {
            return cache.addAll(LISTA_ARCHIVOS_CACHEADOS);
        })
    );
});

self.addEventListener('activate', () => {
    console.log("Soy un service worker. Y me estoy activando");
});

self.addEventListener('fetch', (e) => {
    console.log("Cache dinámica");
    const consulta = e.request;
    
    // Solo manejar solicitudes GET para almacenamiento en caché
    if (consulta.method !== 'GET') {
        return;
    }

    e.respondWith(
        caches.match(consulta).then(respuesta => {
            if (respuesta) {
                // Si hay una respuesta en caché, la devuelve
                return respuesta;
            }
            // Si no está en caché, realiza la solicitud y la almacena en caché
            return fetch(consulta).then(nuevaRespuesta => {
                // Verifica si recibimos una respuesta válida
                if (!nuevaRespuesta || nuevaRespuesta.status !== 200 || nuevaRespuesta.type !== 'basic') {
                    return nuevaRespuesta;
                }
                // Abre el caché y almacena la respuesta clonada
                const respuestaParaCache = nuevaRespuesta.clone();
                caches.open(ALMACEN).then(cache => {
                    cache.put(consulta, respuestaParaCache);
                });
                return nuevaRespuesta;
            });
        })
    );
});



/*///////////////////////////////////////////////////////////////////////////////////////////////*/


/*
// Nombre del caché
const cacheName = 'cachePWA-v1';

// Recursos que queremos precachear
const cacheAssets = [
    'index.html',
    'js/main.js',
    'css/main.css',
    'img/5.svg', // Asegúrate de tener una imagen de marcador de posición
    'error.html', // Asegúrate de tener una página de error
    // Agrega aquí otros recursos que necesites precachear
];

// Instalación del Service Worker y precacheo de recursos
self.addEventListener('install', event => {
    console.log('Service Worker instalado correctamente.');

    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('Precacheando assets');
                return cache.addAll(cacheAssets);
            })
            .catch(error => {
                console.error('Error durante el precacheo:', error);
            })
    );
});

// Activación del Service Worker y limpieza de cachés antiguos
self.addEventListener('activate', event => {
    console.log('Service Worker activado correctamente.');

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                  if (cache !== cacheName) {
                        console.log('Limpiando caché antiguo');
                        return caches.delete(cache);
                    }
                   
                })
            );
        })
    );
});

// Intercepta las peticiones y aplica la estrategia de red primero con respaldo al caché
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                let responseToCache = response.clone();

                caches.open(cacheName)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                return response;
            })
            .catch(() => {
                return caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        }

                        if (event.request.destination === 'image') {
                            return caches.match('img/5.svg');
                        } else {
                            return caches.match('error.html');
                        }
                    });
            })
    );
});

*/