class MapaHistorico {
    constructor(containerId) {
        this.containerId = containerId;
        this.init();
    }

    init() {
        // Crear el mapa
        const map = L.map(this.containerId).setView([-0.9478, -80.7214], 13); // Coordenadas aproximadas de Manta

        // Agregar mapa base (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Lugares turísticos
        const lugares = [
            { nombre: 'Playa Murciélago', coords: [-0.9464, -80.7287], descripcion: 'Una de las playas más conocidas de Manta.' },
            { nombre: 'Museo Centro Cultural Manta', coords: [-0.9601, -80.7114], descripcion: 'Museo con exposiciones culturales.' },
            { nombre: 'Malecón Escénico', coords: [-0.9460, -80.7250], descripcion: 'Lugar turístico frente al mar.' }
        ];

        // Agregar marcadores
        lugares.forEach(lugar => {
            const marker = L.marker(lugar.coords).addTo(map);
            marker.bindPopup(`<b>${lugar.nombre}</b><br>${lugar.descripcion}`);
        });

        setTimeout(() => {
        map.invalidateSize();
    }, 300);
    }
}

// Exportar como módulo
export default MapaHistorico;
