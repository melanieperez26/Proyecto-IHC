export default class Contacto {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`Contenedor con id "${containerId}" no encontrado.`);
        return;
      }
  
      this.form = this.container.querySelector('#form-contacto');
      if (!this.form) {
        console.error('Formulario #form-contacto no encontrado dentro del contenedor.');
        return;
      }
  
      this.feedback = this.container.querySelector('#contacto-feedback');
      if (!this.feedback) {
        this.feedback = document.createElement('div');
        this.feedback.id = 'contacto-feedback';
        this.feedback.setAttribute('role', 'alert');
        this.feedback.setAttribute('aria-live', 'polite');
        this.container.appendChild(this.feedback);
      }
  
      this.resumen = this.container.querySelector('#resumen-contacto');
      if (!this.resumen) {
        this.resumen = document.createElement('div');
        this.resumen.id = 'resumen-contacto';
        this.resumen.style.display = 'none';
        this.container.appendChild(this.resumen);
      }
  
      this._timeoutId = null;
      this._hayCambios = false;
      this.editando = false;
  
      // Botón submit
      this.btnSubmit = this.form.querySelector('button[type="submit"]');
  
      this.init();
      this.initValidacionesEnTiempoReal();
      this.initCancelar();
      this.initAtajosTeclado();
    }
  
    mostrarFormulario() {
      if (this.form && this.resumen) {
        this.form.classList.remove('hidden');
        this.resumen.style.display = 'none';
        this.feedback.textContent = '';
      }
    }
  
    init() {
      if (!this.form) return;
  
      // Detectar cambios para confirmar salida sin guardar
      this.form.addEventListener("input", () => {
        this._hayCambios = true;
      });
  
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        this.limpiarErrores();
        this.mostrarFeedback("", false);
  
        const nombre = this.form.nombre.value.trim();
        const email = this.form.email.value.trim();
        const asunto = this.form.asunto.value.trim();
        const mensaje = this.form.mensaje.value.trim();
  
        let errores = 0;
  
        if (!nombre) {
          this.setError('nombre', 'El nombre es obligatorio.');
          errores++;
        }
  
        if (!email) {
          this.setError('email', 'El correo es obligatorio.');
          errores++;
        } else if (!this.validarEmail(email)) {
          this.setError('email', 'El correo no es válido.');
          errores++;
        }
  
        if (!asunto) {
          this.setError('asunto', 'El asunto es obligatorio.');
          errores++;
        }
  
        if (!mensaje) {
          this.setError('mensaje', 'El mensaje es obligatorio.');
          errores++;
        } else if (mensaje.length < 10) {
          this.setError('mensaje', 'El mensaje debe tener al menos 10 caracteres.');
          errores++;
        }
  
        if (errores > 0) return;
  
        try {
            const response = await fetch('/api/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, asunto, mensaje }),
            });
              
            const data = await response.json(); // ✅ Ahora sí existe "response                           

          if (!response.ok) {
            this.mostrarFeedback(data.error || 'Error al enviar el formulario', true);
            return;
          }
  
          // Mostrar resumen con datos enviados o actualizados
          this.form.classList.add('hidden');
          this.resumen.style.display = 'block';
  
          this.container.querySelector('#res-nombre').textContent = nombre;
          this.container.querySelector('#res-correo').textContent = email;
          this.container.querySelector('#res-asunto').textContent = asunto;
          this.container.querySelector('#res-mensaje').textContent = mensaje;
  
          this.container.querySelector('#btn-editar-contacto').classList.remove('hidden');
          this.container.querySelector('#btn-volver-contacto').classList.remove('hidden');
  
          this.resumen.classList.remove('hidden');
  
          // Cambiar texto del botón a "Enviar" para la próxima vez
          this.editando = false;
          this.btnSubmit.textContent = "Enviar";
  
          this.mostrarFeedback("✅ ¡Mensaje enviado con éxito. Gracias!", false);
  
          this.form.reset();
          this._hayCambios = false;
  
        } catch (error) {
          console.error('Error enviando datos:', error);
          this.mostrarFeedback('Error de red o del servidor, intenta más tarde.', true);
        }
      });
  
      // Botón para editar el contacto (volver al formulario con datos)
      const btnEditar = this.container.querySelector("#btn-editar-contacto");
      if (btnEditar) {
        btnEditar.addEventListener("click", () => {
          const nombre = this.container.querySelector("#res-nombre").textContent;
          const correo = this.container.querySelector("#res-correo").textContent;
          const asunto = this.container.querySelector("#res-asunto").textContent;
          const mensaje = this.container.querySelector("#res-mensaje").textContent;
  
          this.form.nombre.value = nombre;
          this.form.email.value = correo;
          this.form.asunto.value = asunto;
          this.form.mensaje.value = mensaje;
  
          this.form.classList.remove("hidden");
          this.resumen.style.display = "none";
  
          btnEditar.classList.add("hidden");
          const btnVolver = this.container.querySelector("#btn-volver-contacto");
          if (btnVolver) btnVolver.classList.add("hidden");
  
          // Cambiar texto del botón a "Actualizar"
          this.editando = true;
          this.btnSubmit.textContent = "Actualizar";
  
          this._hayCambios = true;
        });
      }
  
      // Botón para limpiar y volver a formulario vacío
      const btnVolver = this.container.querySelector("#btn-volver-contacto");
      if (btnVolver) {
        btnVolver.addEventListener("click", () => {
          this.resetFormulario();
        });
      }
    }
  
    initCancelar() {
      const btnCancelar = this.container.querySelector("#btn-cancelar-contacto");
      const modal = this.container.querySelector("#confirm-modal");
      const btnYes = this.container.querySelector("#confirm-yes-contacto");
      const btnNo = this.container.querySelector("#confirm-no-contacto");
  
      if (!btnCancelar || !modal || !btnYes || !btnNo) return;
  
      btnCancelar.addEventListener("click", () => {
        if (this._hayCambios) {
          modal.classList.remove("hidden");
        } else {
          this.resetFormulario();
        }
      });
  
      btnYes.addEventListener("click", () => {
        modal.classList.add("hidden");
        this.resetFormulario();
        this._hayCambios = false;
      });
  
      btnNo.addEventListener("click", () => {
        modal.classList.add("hidden");
      });
    }
  
    initValidacionesEnTiempoReal() {
      const nombre = this.form.nombre;
      const email = this.form.email;
      const asunto = this.form.asunto;
      const mensaje = this.form.mensaje;
  
      nombre.addEventListener("input", () => {
        if (nombre.value.trim()) {
          this.limpiarErrorCampo('nombre');
          nombre.style.borderColor = "green";
        } else {
          nombre.style.borderColor = "crimson";
        }
      });
  
      email.addEventListener("input", () => {
        if (!email.value) {
          this.setError('email', 'El correo es obligatorio.');
        } else if (!this.validarEmail(email.value)) {
          this.setError('email', 'El correo no es válido.');
        } else {
          this.limpiarErrorCampo('email');
          email.style.borderColor = "green";
        }
      });
  
      asunto.addEventListener("input", () => {
        if (asunto.value.trim()) {
          this.limpiarErrorCampo('asunto');
          asunto.style.borderColor = "green";
        } else {
          asunto.style.borderColor = "crimson";
        }
      });
  
      mensaje.addEventListener("input", () => {
        if (mensaje.value.trim().length >= 10) {
          this.limpiarErrorCampo('mensaje');
          mensaje.style.borderColor = "green";
        } else {
          mensaje.style.borderColor = "crimson";
        }
      });
    }
  
    setError(campo, mensaje) {
      const input = this.form[campo];
      const divError = this.container.querySelector(`#error-${campo}`);
      if (input) input.style.borderColor = "crimson";
      if (divError) divError.textContent = mensaje;
    }
  
    limpiarErrorCampo(campo) {
      const input = this.form[campo];
      const divError = this.container.querySelector(`#error-${campo}`);
      if (input) input.style.borderColor = "";
      if (divError) divError.textContent = "";
    }
  
    limpiarErrores() {
      this.container.querySelectorAll(".error").forEach(div => div.textContent = "");
      this.form.querySelectorAll("input, textarea, select").forEach(el => el.style.borderColor = "");
    }
  
    mostrarFeedback(mensaje, esError) {
      if (!this.feedback) return;
      this.feedback.textContent = mensaje;
      this.feedback.style.color = esError ? "crimson" : "green";
  
      clearTimeout(this._timeoutId);
      this._timeoutId = setTimeout(() => {
        this.feedback.textContent = "";
      }, 4000);
    }
  
    validarEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
    }
  
    resetFormulario() {
      this.form.reset();
      this.form.querySelectorAll("input, textarea, select").forEach(el => el.style.borderColor = "");
      this.container.querySelectorAll(".error").forEach(div => div.textContent = "");
      this.mostrarFeedback("", false);
      this.mostrarFormulario();
      this._hayCambios = false;
      this.editando = false;
      this.btnSubmit.textContent = "Enviar";  // Reset botón a Enviar
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
  