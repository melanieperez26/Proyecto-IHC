class LanguageService {
    constructor() {
        this.currentLanguage = 'es'; // Idioma por defecto
        this.languages = {
            'es': '/js/lang/es.json',
            'en': '/js/lang/en.json'
        };
        this.translations = {};
        this.loadTranslations();
    }

    async loadTranslations() {
        try {
            const response = await fetch(this.languages[this.currentLanguage]);
            if (!response.ok) throw new Error('Error loading translations');
            this.translations = await response.json();
            this.updateDocumentLanguage();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    updateDocumentLanguage() {
        document.documentElement.lang = this.currentLanguage;
        
        // Actualizar títulos y textos del documento
        document.title = this.translations.common.title;
        
        // Actualizar elementos con IDs específicos
        const elementsToUpdate = {
            'logo-text': this.translations.common.logo,
            'home-link': this.translations.common.home,
            'tours-link': this.translations.common.tours,
            'guia-link': this.translations.common.guia,
            'mapa-link': this.translations.common.mapa,
            'encuesta-link': this.translations.common.encuesta,
            'welcome-text': this.translations.common.welcome,
            'description-text': this.translations.common.description,
            'loading-message': this.translations.recorridos.loading,

            'tours-title': this.translations.recorridos.title,
            'guia-title': this.translations.common.guiaTitle,
            'mapa-title': this.translations.common.mapaTitle,
            'encuesta-title': this.translations.common.encuestaTitle
        };

        for (const [id, text] of Object.entries(elementsToUpdate)) {
            const element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'A') {
                    element.textContent = text;
                } else {
                    element.innerHTML = text;
                }
            }
        }

        // Actualizar títulos de los puntos de interés
        this.updateHotspotTitles();
    }

    updateHotspotTitles() {
        const hotspots = document.querySelectorAll('.hotspot-info');
        hotspots.forEach(hotspot => {
            const id = hotspot.getAttribute('data-id');
            if (id && this.translations.recorridos.hotspots[id]) {
                const hotspotData = this.translations.recorridos.hotspots[id];
                hotspot.querySelector('h3').textContent = hotspotData.title;
                hotspot.querySelector('p').textContent = hotspotData.description;
            }
        });
    }

    setLanguage(lang) {
        if (this.languages[lang]) {
            this.currentLanguage = lang;
            this.loadTranslations();
            
            // Guardar en localStorage
            localStorage.setItem('language', lang);
            
            // Actualizar UI
            this.updateUI();
        }
    }

    getLanguage() {
        return this.currentLanguage;
    }

    updateUI() {
        // Actualizar botones de cambio de idioma
        const languageButtons = document.querySelectorAll('.language-button');
        languageButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.lang === this.currentLanguage);
        });
    }

    getTranslation(key) {
        return this.translations[key] || key;
    }
}

// Crear instancia global
window.languageService = new LanguageService();
