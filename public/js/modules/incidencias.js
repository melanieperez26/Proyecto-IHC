export default class Incidencia {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.form = this.container.querySelector('#form-incidencias-form');
    this.feedback = this.container.querySelector('#feedback-incidencia'); // Agrega este div si aún no lo tienes
    this.resumen = this.container.querySelector('#resumen');
    this.btnEditar = this.container.querySelector('#btn-editar');
    this.btnVolver = this.container.querySelector('#btn-volver-incidencia');
    this._timeoutId = null;
    this.init();
    this.initValidacionesEnTiempoReal();
    this.initAtajosTeclado();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log("Formulario enviado");


      const nombre = this.form.nombre.value.trim();
      const correo = this.form.correo.value.trim();
      const tipo = this.form.tipo.value;
      const descripcion = this.form.descripcion.value.trim();
      const fecha = this.form.fecha.value;

      // Limpia errores
      this.container.querySelectorAll(".error").forEach(div => div.textContent = "");

      let errores = 0;

      if (!nombre) {
        this.container.querySelector("#errorNombre").textContent = "Este campo es obligatorio.";
        errores++;
      }

      if (!correo) {
        this.container.querySelector("#errorCorreo").textContent = "Este campo es obligatorio.";
        this.form.correo.style.borderColor = "crimson";
        errores++;
      } else if (!this.validarEmail(correo)) {
        this.container.querySelector("#errorCorreo").textContent = "Correo inválido.";
        this.form.correo.style.borderColor = "crimson";
        errores++;
      } else {
        this.form.correo.style.borderColor = "green";
      }           

      if (!tipo) {
        this.container.querySelector("#errorTipo").textContent = "Seleccione un tipo.";
        errores++;
      }

      if (!descripcion || descripcion.length < 10) {
        this.container.querySelector("#errorDescripcion").textContent = "Mínimo 10 caracteres.";
        errores++;
      }

      if (!fecha) {
        this.container.querySelector("#errorFecha").textContent = "Seleccione una fecha.";
        errores++;
      }

      if (errores > 0) return;

      const datos = { nombre, correo, tipo, descripcion, fecha };

      try {
        const res = await fetch('/api/incidencias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
        });

        if (!res.ok) throw new Error('Error al enviar');

        const resultado = await res.json();
        const data = resultado.data;

        // Mostrar resumen
        this.resumen.querySelector('#res-nombre').textContent = data.nombre || "(no proporcionado)";
        this.resumen.querySelector('#res-correo').textContent = data.correo || "(no proporcionado)";
        this.resumen.querySelector('#res-tipo').textContent = data.tipo;
        this.resumen.querySelector('#res-descripcion').textContent = data.descripcion;
        this.resumen.querySelector('#res-fecha').textContent = data.fecha;

        this.form.classList.add('hidden');
        this.resumen.classList.remove('hidden');
        this.btnVolver.classList.remove('hidden');

        this.mostrarFeedback("✅ ¡Incidencia enviada correctamente!", false);

      } catch (err) {
        console.error(err);
        this.mostrarFeedback("❌ Error al enviar la incidencia.", true);
      }
    });

    // Botón cancelar
    const btnCancelar = this.container.querySelector("#btn-cancelar-incidencia");
    if (btnCancelar) {
      btnCancelar.addEventListener("click", () => {
        this.form.reset();

        // Borra errores visuales
        this.container.querySelectorAll(".error").forEach(div => div.textContent = "");

        // Opcional: resetea colores de borde si implementas validaciones visuales
        this.form.querySelectorAll("input, select, textarea").forEach(el => {
          el.style.borderColor = "";
        });

        // Borra feedback general
        const feedback = this.container.querySelector("#feedback-incidencia");
        if (feedback) feedback.textContent = "";
      });
    }

    // Botón editar
    if (this.btnEditar) {
      this.btnEditar.addEventListener("click", () => {
        this.form.classList.remove("hidden");
        this.resumen.classList.add("hidden");
        this.btnVolver.classList.add("hidden");
    
        // Cambiar texto del botón a "Actualizar"
        const submitBtn = this.form.querySelector("#btn-enviar-incidencia");
        if (submitBtn) submitBtn.textContent = "Actualizar";
    
        // También podrías guardar el ID para saber si es edición (opcional)
        this.form.dataset.editando = "true";
      });
    }    

    // Botón volver limpio
    if (this.btnVolver) {
      this.btnVolver.addEventListener("click", () => {
        this.resetFormulario();
        this.form.classList.remove("hidden");
        this.resumen.classList.add("hidden");
        this.btnVolver.classList.add("hidden");
      });
    }
  }

  initValidacionesEnTiempoReal() {
    const nombre = this.form.nombre;
    const correo = this.form.correo;
    const tipo = this.form.tipo;
    const descripcion = this.form.descripcion;
    const fecha = this.form.fecha;
  
    nombre.addEventListener("input", () => {
      if (nombre.value.trim()) {
        this.container.querySelector("#errorNombre").textContent = "";
        nombre.style.borderColor = "green";
      } else {
        nombre.style.borderColor = "crimson";
      }
    });
  
    correo.addEventListener("input", () => {
      const errorCorreo = this.container.querySelector("#errorCorreo");
      if (!correo.value) {
        correo.style.borderColor = "crimson";
        errorCorreo.textContent = "Este campo es obligatorio.";
      } else if (!this.validarEmail(correo.value)) {
        correo.style.borderColor = "crimson";
        errorCorreo.textContent = "Correo inválido.";
      } else {
        correo.style.borderColor = "green";
        errorCorreo.textContent = "";
      }
    });
  
    tipo.addEventListener("change", () => {
      if (tipo.value) {
        this.container.querySelector("#errorTipo").textContent = "";
        tipo.style.borderColor = "green";
      } else {
        tipo.style.borderColor = "crimson";
      }
    });
  
    descripcion.addEventListener("input", () => {
      if (descripcion.value.trim().length >= 10) {
        descripcion.style.borderColor = "green";
        this.container.querySelector("#errorDescripcion").textContent = "";
      } else {
        descripcion.style.borderColor = "crimson";
      }
    });
  
    fecha.addEventListener("input", () => {
      if (fecha.value) {
        this.container.querySelector("#errorFecha").textContent = "";
        fecha.style.borderColor = "green";
      } else {
        fecha.style.borderColor = "crimson";
      }
    });
  }
  

  mostrarFeedback(mensaje, esError) {
    this.feedback.textContent = mensaje;
    this.feedback.style.color = esError ? "crimson" : "green";

    clearTimeout(this._timeoutId);
    this._timeoutId = setTimeout(() => {
      this.feedback.textContent = "";
    }, 4000);
  }

  validarEmail(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.toLowerCase());
  }

  resetFormulario() {
    this.form.reset();
    this.form.querySelectorAll("input, textarea, select").forEach(el => el.style.borderColor = "");
    this.container.querySelectorAll(".error").forEach(div => div.textContent = "");
    this.mostrarFeedback("", false);
  }

  initAtajosTeclado() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        this.form.requestSubmit();
      }
    });
  }
}
