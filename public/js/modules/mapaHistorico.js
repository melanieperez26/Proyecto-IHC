class MapaHistorico {
    constructor(containerId, sidebarId) {
        this.containerId = containerId;
        this.sidebarId = sidebarId;
        this.init();
    }
    // Lugares turísticos
    lugares = [
        { nombre: 'Playa Murciélago',
          tipo: 'turistico',
          coords: [-0.93937, -80.73057], 
          descripcion: 'La popular playa Murciélago se encuentra en el extremo noroeste de la ciudad. Bares y restaurantes se agrupan a lo largo del paseo costero Malecón Escénico y las calles cercanas. La tranquila playa de Tarqui tiene un mercado de pescado junto al mar.',
          imagen: 'images/playa murcielago.jpg',
        },
        { nombre: 'Museo Centro Cultural Manta', 
          tipo: 'museo',
          coords: [-0.94191, -80.73041], 
          descripcion: 'Museo con exposiciones e historia cultural de manta, que contiene reliquias precolombinas de tribus indígenas',
          imagen: 'images/museo de manta.jpg',
        },
        { nombre: 'Malecón Escénico', 
          tipo: 'turistico',
          coords: [-0.94045, -80.73111], 
          descripcion: 'Malecón Escénico es un paseo costero que se extiende por la costa central de la ciudad de Manta, Ecuador.',
          imagen: 'images/malecon escenico.jpg',
        },
        { nombre: 'Mall del Pacifico', 
          tipo: 'comercial',
          coords: [-0.94260, -80.73234], 
          descripcion: 'Centro comercial cosmopolita cerrado con bares animados y restaurantes informales junto a diversas tiendas.',
          imagen: 'images/mall del pacifico.jpg',
        },
        { nombre: 'Museo Cancebí', 
          tipo: 'museo',
          coords: [-0.94758, -80.72167], 
          descripcion: 'El Museo Cancebí cuenta con una variedad de exhibiciones y colecciones que reflejan la historia y la cultura de la región, incluyendo artefactos arqueológicos, objetos históricos y obras de arte.',
          imagen: 'images/museo cancebi.jpg',
        },
        { nombre: 'Monumento del Atun', 
          tipo: 'monumento',
          coords: [-0.94136, -80.72772], 
          descripcion: 'Pintoresco monumento que hace alusión a una de las principales actividades comerciales en el Puerto de Manta. Ubicado cerca al malecón por el sector de aduana, hace marco para las fotos muy bonito en el atardecer. ',
          imagen: 'images/momumento atun.jpg',
        },
        { nombre: 'Parque Arqueológico Cerro Jaboncillo', 
          tipo: 'parque',
          coords: [-1.05635, -80.56386], 
          descripcion: 'El Parque Arqueológico Cerro Jaboncillo es un sitio arqueológico que se encuentra en la ciudad de Manta-Portoviejo. En donde se pueden apreciar los restos de la cultura Manteña con senderos y miradores históricos.',
          imagen: 'images/parque arqueologico.jpg',
        }
    ];

    init() {
        const map = L.map(this.containerId).setView([-0.9478, -80.7214], 13);
      
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
      
        const sidebar = document.getElementById(this.sidebarId);

        const marcadorGrupo = L.layerGroup().addTo(map); // Para limpiar marcadores

        const renderizarLugares = (filtro = "todos") => {
          marcadorGrupo.clearLayers();
          sidebar.innerHTML = "";

          this.lugares
            .filter(lugar => filtro === "todos" || lugar.tipo === filtro)
            .forEach(lugar => {
              const popupContent = `
                <div class="popup-custom">
                  <img src="${lugar.imagen}" alt="${lugar.nombre}" style="width: 100px; height: auto; border-radius: 8px;" />
                  <h3>${lugar.nombre}</h3>
                  <p>${lugar.descripcion}</p>
                </div>
              `;

              const marker = L.marker(lugar.coords).bindPopup(popupContent);
              marcadorGrupo.addLayer(marker);

              const item = document.createElement('div');
              item.className = 'marker-item';
              item.setAttribute('tabindex', '0');
              item.setAttribute('role', 'button');
              item.setAttribute('aria-label', lugar.nombre);
              item.innerText = lugar.nombre;

              item.addEventListener('click', () => {
                map.setView(lugar.coords, 16);
                marker.openPopup();
              });

              item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  map.setView(lugar.coords, 16);
                  marker.openPopup();
                }
              });

              sidebar.appendChild(item);
            });
        };

        renderizarLugares();

        // Filtro por tipo
        const filtro = document.getElementById('filtro-tipo');
        filtro.addEventListener('change', () => {
          renderizarLugares(filtro.value);
        });
      
        setTimeout(() => {
          map.invalidateSize();
        }, 300);
    }
      
}

// Exportar como módulo
export default MapaHistorico;
