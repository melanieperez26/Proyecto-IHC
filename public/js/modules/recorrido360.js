
class Recorrido360 {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.mesh = null;
        this.hotspots = [];
        this.init();
    }

    init() {
        // Configurar la escena
        this.scene = new THREE.Scene();
        
        // Configurar la cámara
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 0);
        
        // Configurar el renderizador
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.getElementById('recorrido-canvas')
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Configurar controles
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.enableZoom = true;
        this.controls.minDistance = 0.1;
        this.controls.maxDistance = 1000;
        this.controls.enableRotate = true;
        this.controls.rotateSpeed = 1.0;
        this.controls.enablePan = false;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI;
        
        // Posicionar la cámara
        this.camera.position.set(0, 0, 0);
        this.controls.update();
        
        // Agregar iluminación
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);
        
        // Agregar el recorrido 360° con imagen local
        this.addRecorrido360('/images/prueba.png');
        
        // Agregar puntos de interés
        this.addHotspots();
        
        // Manejar redimensionamiento
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Iniciar animación
        this.animate();
    }

    addRecorrido360(imageUrl) {
        console.log('Intentando cargar imagen:', imageUrl);
    
        // Crear geometría esférica
        const geometry = new THREE.SphereGeometry(500, 100, 100);
        geometry.scale(-1, 1, 1);
    
        // Cargar textura directamente
        const texture = new THREE.TextureLoader().load(
            imageUrl,
            () => {
                console.log('Textura cargada correctamente');
    
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.BackSide
                });
    
                this.mesh = new THREE.Mesh(geometry, material);
                this.scene.add(this.mesh);
    
                // Ocultar mensaje de carga
                const loading = document.getElementById('loading-message');
                if (loading) {
                    loading.classList.add('hidden');
                    setTimeout(() => loading.style.display = 'none', 300);
                }
            },
            undefined,
            (error) => {
                console.error('Error al cargar la imagen:', error);
                const loading = document.getElementById('loading-message');
                if (loading) {
                    loading.textContent = 'Error al cargar la imagen';
                    loading.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
                }
            }
        );
    }
    

    addHotspots() {
        // Definir puntos de interés
        const hotspots = [
            {
                position: { x: 100, y: 0, z: 0 },
                id: '1',
                color: 0xff0000
            },
            {
                position: { x: -100, y: 0, z: 0 },
                id: '2',
                color: 0x00ff00
            },
            {
                position: { x: 0, y: 100, z: 0 },
                id: '3',
                color: 0x0000ff
            }
        ];

        // Crear geometría para los puntos
        const geometry = new THREE.SphereGeometry(1, 32, 32);

        // Crear cada punto de interés
        hotspots.forEach(hotspot => {
            const material = new THREE.MeshBasicMaterial({ 
                color: hotspot.color,
                transparent: true,
                opacity: 0.8
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(
                hotspot.position.x,
                hotspot.position.y,
                hotspot.position.z
            );
            
            sphere.userData = {
                id: hotspot.id,
                color: hotspot.color
            };
            
            this.scene.add(sphere);
            this.hotspots.push(sphere);
        });

        // Agregar interacción
        this.container.addEventListener('click', (event) => {
            // Convertir coordenadas del mouse a coordenadas normalizadas
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Crear raycaster para detectar intersecciones
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.camera);

            // Encontrar intersecciones con los puntos de interés
            const intersects = raycaster.intersectObjects(this.hotspots);
            if (intersects.length > 0) {
                const intersect = intersects[0];
                const hotspot = intersect.object;
                
                // Mostrar información del punto
                this.showHotspotInfo(hotspot, event);
            }
        });
    }

addHotspots() {
    // Definir puntos de interés
    const hotspots = [
        {
            position: { x: 100, y: 0, z: 0 },
            id: '1',
            color: 0xff0000
        },
        {
            position: { x: -100, y: 0, z: 0 },
            id: '2',
            color: 0x00ff00
        },
        {
            position: { x: 0, y: 100, z: 0 },
            id: '3',
            color: 0x0000ff
        }
    ];

    // Crear geometría para los puntos
    const geometry = new THREE.SphereGeometry(1, 32, 32);
        overlay.appendChild(infoDiv);
        document.body.appendChild(overlay);

        // Agregar estilos para el overlay
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        // Agregar estilos para el contenido de la información
        infoDiv.style.backgroundColor = 'white';
        infoDiv.style.padding = '20px';
        infoDiv.style.borderRadius = '8px';
        infoDiv.style.maxWidth = '80%';
        infoDiv.style.maxHeight = '80%';
        infoDiv.style.overflow = 'auto';
        infoDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        
        // Ajustar el tamaño del canvas
        const canvas = this.renderer.domElement;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Actualizar controles
        this.controls.update();
        
        // Actualizar la posición de la cámara
        this.camera.position.set(0, 0, 0);
        
        // Animar puntos de interés
        if (this.hotspots) {
            this.hotspots.forEach(hotspot => {
                const material = hotspot.material;
                material.opacity = 0.8 + Math.sin(Date.now() / 1000) * 0.2;
            });
        }
        
        // Renderizar la escena
        this.renderer.render(this.scene, this.camera);
        this.mesh.rotation.y += 0.001;
    }
    
    reiniciar() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.mesh = null;
        }
        this.hotspots.forEach(hotspot => {
            this.scene.remove(hotspot);
            hotspot.geometry.dispose();
            hotspot.material.dispose();
            hotspot = null;
        });
        this.hotspots = [];

        this.addRecorrido360();
        this.addHotspots();
    }
        
}

// Exportar la clase para usarla en otros archivos
export default Recorrido360;
