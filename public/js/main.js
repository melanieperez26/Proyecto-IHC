// Importar módulos
import Recorrido360 from './modules/recorrido360.js';
import MapaHistorico from './modules/mapaHistorico.js';
import Encuesta from './modules/encuesta.js';

//guia multilingue
const guias = [
    {
        titulo: { es: "Recorridos 360°", en: "360° Tours" },
        descripcion: {
            es: "Explora lugares en realidad virtual",
            en: "Explore places in virtual reality"
        }
    },
    {
        titulo: { es: "Mapa Histórico", en: "Historical Map" },
        descripcion: {
            es: "Ubica puntos turísticos e históricos de Manta",
            en: "Locate historical and tourist spots in Manta"
        }
    },
    {
        titulo: { es: "Encuesta", en: "Survey" },
        descripcion: {
            es: "Deja tu opinión sobre tu experiencia",
            en: "Share your experience with us"
        }
    }
];


// Inicialización del portal
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchMessage = document.getElementById('search-message');

     // Controlador para el toggle de búsqueda
     document.getElementById('search-toggle').addEventListener('click', function(e) {
        e.stopPropagation();
        const expanded = document.getElementById('search-expanded');
        expanded.classList.toggle('hidden');
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-toggle-container') && !e.target.closest('.search-expanded')) {
            document.getElementById('search-expanded').classList.add('hidden');
        }
    });
    
    //para normalizar la busqueda
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")                 
            .replace(/[\u0300-\u036f]/g, "") 
            .trim();
    }

    const secciones={
        'inicio': {
            id:'hero',
            keywords:['inicio', 'home', 'principal']
        },
        'guia': {
            id:'guia',
            keywords:['guia', 'multilingue', 'multilanguage', 'guia', 'guide', 'tourist guide']
        },
        'recorridos': {
            id:'recorridos',
            keywords:['recorridos', 'tours', '360', 'tour', '360°', 'recorrido']
        },
        'mapa': {
            id:'mapa',
            keywords:['mapa', 'historico', 'historical', 'map', 'historical map', 'historical map of manta']
        },
        'encuesta': {
            id:'encuesta',
            keywords:['encuesta', 'survey', 'encuesta', 'survey', 'opinion', 'formulario']
        }
    };

    //para la ayudar a la busqueda
    const suggestionBox = document.getElementById('search-suggestions');

    function mostrarSugerencias(texto) {
        const query = normalizarTexto(texto);
        suggestionBox.innerHTML = '';

        if (!query) {
            suggestionBox.classList.add('hidden');
            return;
        }

        const sugerencias = [];

        for (const seccion of Object.values(secciones)) {
            for (const palabra of seccion.keywords) {
                if (normalizarTexto(palabra).includes(query)) {
                    sugerencias.push({
                        id: seccion.id,
                        label: palabra
                    });
                }
            }
        }

        if (sugerencias.length > 0) {
            suggestionBox.classList.remove('hidden');
            for (const sugerencia of sugerencias.slice(0, 5)) {
                const li = document.createElement('li');
                li.textContent = sugerencia.label;
                li.addEventListener('click', () => {
                    mostrarSection(sugerencia.id);
                    suggestionBox.classList.add('hidden');
                    searchInput.value = sugerencia.label;
                });
                suggestionBox.appendChild(li);
            }
        } else {
            suggestionBox.classList.add('hidden');
        }
    }


    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = normalizarTexto(searchInput.value);
        
        if (!query) {
            searchMessage.textContent = languageService.translation.search?.emptyQuery || 'Por favor, ingresa un término de búsqueda';
            searchInput.focus();
            return;
        }

        let encontrado = false;
        for (const seccion of Object.values(secciones)){
            if (seccion.keywords.some(keyword => query.includes(keyword))){
                mostrarSection(seccion.id);
                encontrado = true;
                break;
            }
        }
        if (!encontrado){
            searchMessage.textContent = 'No se encontró ninguna sección con el término de búsqueda';
        }

        suggestionBox.classList.add('hidden');
    });

    searchInput.addEventListener('input', () => {
        searchMessage.textContent = '';
    });

    searchInput.addEventListener('input', () => {
        const valor = searchInput.value;
        mostrarSugerencias(valor);
    });
    
    

    let recorridoInstance = null;
    let mapaInstance = null;
    let guiaInstance = null;

    function mostrarSection(id) {
        console.log('Mostrando sección:', id);

        // Ocultar todas las secciones
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
        });

        // Mostrar la sección seleccionada
        const section = document.getElementById(id);
        if (section) {
            section.classList.remove('hidden');
        }

        // Actualizar menú activo
        actualizarMenuActivo(id);

        // Inicializar o reiniciar módulos según sección
        if (id === 'recorridos') {
            if (!recorridoInstance) {
                recorridoInstance = new Recorrido360('recorrido-container');
            } else {
                recorridoInstance.reiniciar();
            }
        }

        if (id === 'mapa') {
            if (!mapaInstance) {
                mapaInstance = new MapaHistorico('mapa-container', 'mapa-sidebar');
            }
        }

        if (id === 'guia') {
            if (!guiaInstance) {
                guiaInstance = new GuiaMultilingue('guia-container');
            }
        }
        guiaInstance.init();
    }

    function actualizarMenuActivo(idSection) {
        // Mapeo id sección -> id link menú
        const mapaSeccionALink = {
            'hero': 'home-link',
            'guia': 'guia-link',
            'recorridos': 'tours-link',
            'mapa': 'mapa-link',
            'encuesta': 'encuesta-link'
        };

        // Quitar clase active de todos los enlaces
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });

        // Poner clase active al enlace correspondiente
        const idLink = mapaSeccionALink[idSection];
        if (idLink) {
            const linkActivo = document.getElementById(idLink);
            if (linkActivo) {
                linkActivo.classList.add('active');
            }
        }
    }

    // Listeners para menú
    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSection('hero');
    });
    
    document.getElementById('guia-link').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSection('guia');
    });

    document.getElementById('tours-link').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSection('recorridos');
    });

    document.getElementById('mapa-link').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSection('mapa');
    });

    document.getElementById('encuesta-link').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSection('encuesta');
    });

    // Inicializar otras clases (guía multilingüe, RA, educación)
    class GuiaMultilingue {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.idiomas = ['es', 'en'];
            this.init();
        }
    
        init() {
            const idioma = document.documentElement.lang || 'es';
            this.container.innerHTML = ''; // Limpiar contenido anterior
    
            guias.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('guia-card');
    
                card.innerHTML = `
                    <h3>${item.titulo[idioma]}</h3>
                    <p>${item.descripcion[idioma]}</p>
                `;
    
                this.container.appendChild(card);
            });
        }
    }
    

    class RealidadAumentada {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.init();
        }
        init() {
            console.log('Inicializando realidad aumentada');
        }
    }

    class SeccionEducativa {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.init();
        }
        init() {
            console.log('Inicializando sección educativa');
        }
    }

    const ra = new RealidadAumentada('ra-container');
    const encuesta = new Encuesta('encuesta-form');

    // Configuración de idiomas
    const idiomas = ['es', 'en'];
    const idiomaActual = localStorage.getItem('idioma') || 'es';
    document.documentElement.lang = idiomaActual;

    // Event listener para cambio de idioma
    document.querySelectorAll('[data-idioma]').forEach(button => {
        button.addEventListener('click', () => {
            const nuevoIdioma = button.dataset.idioma;
            localStorage.setItem('idioma', nuevoIdioma);
            document.documentElement.lang = nuevoIdioma;
    
            languageService.setLanguage(nuevoIdioma);
    
            const elementsToUpdate = {
                'welcome-text': languageService.translations.common.welcome,
                'description-text': languageService.translations.common.description,
                'tours-title': languageService.translations.recorridos.title,
                'loading-message': languageService.translations.recorridos.loading
            };
    
            for (const [id, text] of Object.entries(elementsToUpdate)) {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = text;
                }
            }
    
            // 👇 Aquí actualizamos la guía
            if (guiaInstance) {
                guiaInstance.init();
            }
    
        });
    });
    

    // Mostrar inicio por defecto
    mostrarSection('hero');
});
