// incidencias.js
export default class Incidencia {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.form = this.container.querySelector('#form-incidencias-form');
      this.resumenDiv = this.container.querySelector('#resumen');
  
      this.editar = this.editar.bind(this);
      this.reiniciar = this.reiniciar.bind(this);
    }
  
    init() {
      this.form.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const nombre = this.form.nombre.value.trim();
        const correo = this.form.correo.value.trim();
        const tipo = this.form.tipo.value;
        const descripcion = this.form.descripcion.value.trim();
        const fecha = this.form.fecha.value;
  
        let errores = 0;
  
        // Limpia errores
        this.container.querySelectorAll(".error").forEach(div => div.textContent = "");
  
        // Validaciones
        if (!nombre) {
          this.container.querySelector("#errorNombre").textContent = "Este campo es obligatorio.";
          errores++;
        }
  
        if (!correo || !correo.includes("@")) {
          this.container.querySelector("#errorCorreo").textContent = "Ingrese un correo válido.";
          errores++;
        }
  
        if (!tipo) {
          this.container.querySelector("#errorTipo").textContent = "Seleccione un tipo de incidencia.";
          errores++;
        }
  
        if (!descripcion) {
          this.container.querySelector("#errorDescripcion").textContent = "Describa brevemente la incidencia.";
          errores++;
        }
  
        if (!fecha) {
          this.container.querySelector("#errorFecha").textContent = "Seleccione la fecha del incidente.";
          errores++;
        }
  
        if (errores === 0) {
          const datosIncidencia = { nombre, correo, tipo, descripcion, fecha };
  
          try {
            const respuesta = await fetch('/api/incidencias', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(datosIncidencia)
            });
  
            if (!respuesta.ok) throw new Error('Error al enviar la incidencia');
  
            const resultado = await respuesta.json();
  
            // Mostrar resumen con datos devueltos del servidor
            this.resumenDiv.style.display = "block";
            this.resumenDiv.innerHTML = `
              <h2>✅ Incidencia Enviada</h2>
              <p><strong>Nombre:</strong> ${resultado.nombre}</p>
              <p><strong>Correo:</strong> ${resultado.correo}</p>
              <p><strong>Tipo:</strong> ${resultado.tipo}</p>
              <p><strong>Descripción:</strong> ${resultado.descripcion}</p>
              <p><strong>Fecha:</strong> ${resultado.fecha}</p>
              <button type="button" id="btn-editar">Editar</button>
              <button type="button" id="btn-reiniciar">Enviar otra incidencia</button>
            `;
            this.form.style.display = "none";
  
            // Asignar listeners a botones del resumen
            this.resumenDiv.querySelector('#btn-editar').addEventListener('click', this.editar);
            this.resumenDiv.querySelector('#btn-reiniciar').addEventListener('click', this.reiniciar);
  
          } catch (error) {
            alert(error.message);
          }
        }
      });
    }
  
    editar() {
      this.form.style.display = "block";
      this.resumenDiv.style.display = "none";
    }
  
    reiniciar() {
      this.form.reset();
      this.resumenDiv.style.display = "none";
      this.form.style.display = "block";
    }
  }
  