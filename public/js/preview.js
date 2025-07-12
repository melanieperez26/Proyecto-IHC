window.addEventListener('load', () => {
    const previewImage = document.getElementById('preview-image');
    const previewContainer = document.getElementById('preview-container');
    const loadingMessage = document.getElementById('loading-message');
    const recorridoContainer = document.getElementById('recorrido-container');

    // Ajustar el tamaño del contenedor de la vista previa
    if (recorridoContainer) {
        previewContainer.style.width = recorridoContainer.clientWidth + 'px';
        previewContainer.style.height = recorridoContainer.clientHeight + 'px';
    }

    // Intentar cargar la imagen
    const img = new Image();
    img.src = '/images/prueba.png';
    
    img.onload = () => {
        console.log('Imagen precargada correctamente');
        previewImage.src = img.src;
        previewContainer.style.display = 'block';
        previewImage.classList.add('loaded');
        
        // Ajustar el tamaño de la imagen
        previewImage.style.width = '100%';
        previewImage.style.height = '100%';
        
        if (loadingMessage) {
            loadingMessage.textContent = 'Cargando...';
            loadingMessage.classList.add('hidden');
            
            // Crear un temporizador para ocultar el contenedor
            setTimeout(() => {
                loadingMessage.style.display = 'none';
            }, 300);
        }
    };

    img.onerror = () => {
        console.error('Error al precargar la imagen');
        if (loadingMessage) {
            loadingMessage.textContent = 'Error al cargar la imagen';
            loadingMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
        }
    };
});
