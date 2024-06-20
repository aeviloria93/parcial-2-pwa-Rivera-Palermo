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

const api_url = "https://rickandmortyapi.com/api/episode";
let EpiCont = document.getElementById('EpiCont');

async function fetchEpisodes() {
    try {
        const response = await fetch(api_url);
        const data = await response.json();
        displayList(data.results);
    } catch (error) {
        console.error('Error:', error);
        // Considera mostrar un mensaje al usuario aquí
    }
}

function displayList(episodes) {
    const list = document.createElement('ul');
    episodes.forEach(episode => {
        const item = document.createElement('li');
        item.textContent = `Episodio ${episode.id}: ${episode.name}`;
        item.onclick = () => displayEpisodeDetails(episode);
        list.appendChild(item);
    });
    EpiCont.appendChild(list);
}

async function displayEpisodeDetails(episode) {
    // Limpiar cualquier tarjeta existente
    const existingCard = document.querySelector('.episode-card');
    if (existingCard) {
        existingCard.remove();
    }

    // Crear y mostrar la tarjeta con los detalles del episodio
    const card = document.createElement('div');
    card.className = 'episode-card';

    const title = document.createElement('h2');
    title.textContent = `Episodio ${episode.id}: ${episode.name}`;

    const airDate = document.createElement('p');
    airDate.textContent = `Fecha de emisión: ${episode.air_date}`;

    card.appendChild(title);
    card.appendChild(airDate);

    // Obtener y mostrar las imágenes de todos los personajes
    const charactersContainer = document.createElement('div');
    charactersContainer.setAttribute('class', 'characters-container');

    // Asumiendo que episode.characters es un array de URLs completas
    for (const characterUrl of episode.characters) {
        try {
            const characterResponse = await fetch(characterUrl);
            const characterData = await characterResponse.json();
            const spriteCont = document.createElement('div');
            spriteCont.setAttribute('class', 'p-1');
            const Sprite = document.createElement('img');
            Sprite.setAttribute('class', 'sprite');
            Sprite.src = characterData.image;

            spriteCont.appendChild(Sprite);
            charactersContainer.appendChild(spriteCont);
        } catch (error) {
            console.error('Error:', error);
            // Considera mostrar un mensaje al usuario aquí
        }
    }

  
  closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.setAttribute('class', 'btn closeButton bg-danger text-center border border-0');

  card.appendChild(closeButton);

  closeButton.addEventListener('click', () => {
      if (card) {
          card.remove();
      }
  })
personajes = document.createElement('p');
personajes.textContent = 'Personajes en este episodio:'
card.appendChild(personajes);


  card.appendChild(charactersContainer);

EpiCont.appendChild(card);
}

fetchEpisodes();
