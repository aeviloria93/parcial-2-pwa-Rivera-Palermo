const ALMACEN = 'caches';
const LISTA_ARCHIVOS_CACHEADOS = [
    'index.html',
    'js/main.js',
    'error.html',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css',
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
    if (consulta.method === 'GET') {
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
    }
});
