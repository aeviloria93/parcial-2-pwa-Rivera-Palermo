// Lista de URLs de imágenes de personajes
const IMAGENES_A_CACHEAR = [
    // Agrega las URLs de las imágenes aquí
];

window.addEventListener('DOMContentLoaded', (e) => {
    console.log('Status', navigator.onLine);

    let status = document.querySelector('#status');
    let checkStatus = () => {
        status.style.color = 'white';
        status.style.fontSize = '16px';
        status.style.padding = '5px';

        if (navigator.onLine) {
            status.style.backgroundColor = 'green';
            status.innerHTML = 'app Online';
        } else {
            status.style.backgroundColor = 'red';
            status.innerHTML = 'app OFFLINE';
        }
    };
    checkStatus();

    window.addEventListener('online', checkStatus);
    window.addEventListener('offline', checkStatus);

    // Registro del Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(register => {
                console.log('El Service Worker se registró correctamente.');
            })
            .catch(error => {
                console.error('Error al registrar el Service Worker:', error);
                
            });
    }

    //fetchEpisodes();
});





      // Escucha el evento beforeinstallprompt
 window.addEventListener('beforeinstallprompt', (e) => {
    // Muestra el botón cuando corresponda
    document.getElementById('installButton').style.display = 'block';

    // Al hacer clic en el botón, invoca el flujo de instalación
    document.getElementById('installButton').addEventListener('click', () => {
        e.prompt(); // Invoca el prompt de instalación
    });
});

// Escucha el evento appinstalled
window.addEventListener('appinstalled', () => {
    // Oculta el botón después de la instalación
    document.getElementById('installButton').style.display = 'none';
});









const api_url = "https://rickandmortyapi.com/api/episode";
const EpiCont = document.getElementById('EpiCont');
let db; // Variable para almacenar la base de datos IndexedDB

// Abre una base de datos llamada "RickAndMortyDB" con la versión 1
const openRequest = indexedDB.open('RickAndMortyDB', 1);

openRequest.onupgradeneeded = (event) => {
    db = event.target.result;

    // Crea un almacén de objetos llamado "episodes"
    const store = db.createObjectStore('episodes', { keyPath: 'id' });

    // Crea un índice para buscar por nombre de episodio
    store.createIndex('byName', 'name', { unique: false });
};

openRequest.onsuccess = (event) => {
    db = event.target.result;

    // Realiza operaciones con la base de datos
    // Por ejemplo, agregar episodios al almacén "episodes"
    // o buscar episodios por nombre utilizando el índice "byName"
    //fetchEpisodes();
};

openRequest.onerror = (event) => {
    console.error('Error al abrir la base de datos:', event.target.error);
};

function fetchEpisodes() {
    fetch(api_url)
        .then(response => response.json())
        .then(data => displayList(data.results))
        .catch(error => {
            console.error('Error:', error);
         // Redirige al usuario a error.html
         window.location.href = 'error.html';
        });
}

function displayList(episodes) {
    const list = document.createElement('ul');
    episodes.forEach(episode => {
        const item = document.createElement('li');
        item.textContent = `Episodio ${episode.id}: ${episode.name}`;
        item.onclick = () => {
            const historial = JSON.parse(localStorage.getItem('EpisodeHistorial')) || [];
            if (!historial.includes(episode.name)) {
                historial.push(episode.name);
                localStorage.setItem('EpisodeHistorial', JSON.stringify(historial));
            }

            // Agrega el episodio al almacén "episodes" en IndexedDB
            addEpisodeToDB(episode);

            displayEpisodeDetails(episode);
        };
        list.appendChild(item);
    });
    EpiCont.appendChild(list);
}

function addEpisodeToDB(episode) {
    const transaction = db.transaction(['episodes'], 'readwrite');
    const store = transaction.objectStore('episodes');
    store.add(episode);
}

function displayEpisodeDetails(episode) {
    // Limpiar cualquier tarjeta existente
    const existingCard = document.querySelector('.episode-card');
    if (existingCard) {
        existingCard.remove();
    }

    // Crear y mostrar la tarjeta con los detalles del episodio
    const card = document.createElement('div');
    card.className = 'episode-card p-4 m-auto  col-md-8 col-sm-10  ';
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.setAttribute('class', 'btn closeButton bg-danger text-center border border-0 float-end');
    card.appendChild(closeButton);

    const title = document.createElement('h2');
    title.textContent = `Episodio ${episode.id}: ${episode.name}`;
    card.appendChild(title);

    const airDate = document.createElement('p');
    airDate.textContent = `Fecha de emisión: ${episode.air_date}`;
    card.appendChild(airDate);

    // Obtener y mostrar las imágenes de todos los personajes
    const charactersContainer = document.createElement('div');
    charactersContainer.setAttribute('class', 'characters-container');


    const personajes = document.createElement('p');
    personajes.textContent = 'Personajes en este episodio:';
    card.appendChild(personajes);
    card.appendChild(charactersContainer);
const DivContEpi = document.createElement('div');
DivContEpi.setAttribute('class', 'DivContEpi');



    // Asumiendo que episode.characters es un array de URLs completas
    Promise.all(episode.characters.map(characterUrl => fetch(characterUrl)
        .then(response => response.json())
        .then(characterData => {
            const spriteCont = document.createElement('div');
            spriteCont.setAttribute('class', 'p-1');
            const Sprite = document.createElement('img');
            Sprite.setAttribute('class', 'sprite');
            Sprite.src = characterData.image;
            spriteCont.appendChild(Sprite);
            charactersContainer.appendChild(spriteCont);
        })
        .catch(error => {
            console.error('Error:', error);
         // Redirige al usuario a error.html
         window.location.href = 'error.html';
        })
    )).then(() => {
        closeButton.addEventListener('click', () => {
            if (DivContEpi) {
                DivContEpi.remove();
            }
        });


DivContEpi.appendChild(card);
        //EpiCont.appendChild(card);
        EpiCont.appendChild(DivContEpi);
    });
}

fetchEpisodes();






const verHistorialButton = document.getElementById('verHistorial');
verHistorialButton.addEventListener('click', mostrarHistorial);

const historyDiv = document.getElementById('history');

historyDiv.setAttribute('class', 'bg-warning text-dark  rounded m-auto text-center');



// mostrar el historial
function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem('EpisodeHistorial')) || [];
    const ulH = document.createElement('ul');
    ulH.setAttribute('class', 'ulH p-5 col-md-6 m-auto'); 

    const  historyContainer = document.createElement('div');

    historyContainer.setAttribute ('class', 'listH text-end')

//historial con datos
    function okH() {

        historial.forEach(EpisodeHistorial => {

            const liH = document.createElement('li');
            liH.textContent = (EpisodeHistorial);
            liH.setAttribute('class', 'rounded bg-secondary  m-2 p-2 text-center');

            ulH.appendChild(liH);
        });

      closeButton = document.createElement('button');
      closeButton.textContent = 'X';
      closeButton.setAttribute('class', 'btn closeButton bg-danger border border-0 m-4');
      closeButton.setAttribute('id', 'close');
  
      historyContainer.appendChild(closeButton);
   

        const total = document.createElement('p');
        total.textContent = `Episodios vistos: ${historial.length}`;
        total.setAttribute('class',' bg-dark p-4 rounded text-success text-center');

historyContainer.appendChild(total);
historyContainer.appendChild(ulH);

       
        closeButton.addEventListener('click', () => {
    
            if (historyDiv) {
                historyDiv.innerHTML = '';
            }
        })
     
historyDiv.appendChild(historyContainer);

    }



    if (historial.length > 0) {
okH(mostrarHistorial);

    } else {
        closeButton = document.createElement('button');

        closeButton.textContent = 'X';
        closeButton.setAttribute('class', 'btn closeButton bg-danger text-center border border-0 m-3');
        closeButton.setAttribute('id', 'close');
    
    
        historyContainer.appendChild(closeButton);
 
       const ulH = document.createElement('ul');
       ulH.setAttribute('class', 'list-unstyled');
       const liH = document.createElement('li');
        liH.innerHTML = ('No viste ningún episodio');
        liH.setAttribute('class', ' bg-dark text-danger fs-3 text-center border border-danger p-4 rounded col-md-6 m-auto ');
        ulH.appendChild(liH);

        historyContainer.appendChild(ulH);

    
       
        closeButton.addEventListener('click', () => {
    
            if (historyDiv) {
                historyDiv.innerHTML = '';
            }
        })
        historyDiv.appendChild(historyContainer);
      
    }


 
  
}

/*
let eventoInstalacion = null;

window.addEventListener("beforeinstallprompt", (e) => {

    //console.log("beforeinstallprompt", e)

    eventoInstalacion = e;

});

const installButon = document.getElementById("instalar");
installButon.addEventListener("click", () => {

    console.log("eventoInstalacion", eventoInstalacion);

    if(eventoInstalacion){
        eventoInstalacion.prompt()
        .then( (resultado) => {
            const eleccion = resultado.outcome;
            if(eleccion == "dissmissed") {
                console.log('instalacion cancelada')

            }else if(eleccion == "accepted"){
                console.log('instalacion apetada')
                ocultarBoton()

            }

        })
        .catch((error) => console.log('error al instalar'))
    }

})


const ocultarBoton = () =>{
    installButon.style.display = "none";
}
 
if(eventoInstalacion !== null) {

    installButon.style.display = "none";

} 
}*/