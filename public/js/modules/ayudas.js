export default class Ayuda {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.feedback = document.getElementById("ayuda-feedback");

    this.resumenSection = document.getElementById("resumen-ayuda");
    this.resumenCampos = {
      nombre: document.getElementById("res-nombre"),
      email: document.getElementById("res-email"),
      tipo: document.getElementById("res-tipo-ayuda"),
      dispositivo: document.getElementById("res-dispositivo"),
      frecuencia: document.getElementById("res-frecuencia"),
      comentario: document.getElementById("res-comentario"),
    };

    this.btnEditar = document.getElementById("btn-editar");
    this.btnVolverLimpio = document.getElementById("btn-volver-limpio");

    this.estadoInicial = this.obtenerEstadoFormulario();

    this.init();
    this.initAtajosTeclado();
    this.initValidacionesEnTiempoReal();
  }

  obtenerEstadoFormulario() {
    return {
      nombre: this.form.nombre.value.trim(),
      email: this.form.email.value.trim(),
      tipo: this.form["tipo-ayuda"].value,
      dispositivo: this.form.dispositivo.value,
      frecuencia: this.form.frecuencia.value,
      comentario: this.form.comentario.value.trim(),
    };
  }

  estaModificado() {
    if (!this.estadoInicial) return false;
    const actual = this.obtenerEstadoFormulario();
    const inicial = this.estadoInicial;
    return (
      actual.nombre !== inicial.nombre ||
      actual.email !== inicial.email ||
      actual.tipo !== inicial.tipo ||
      actual.dispositivo !== inicial.dispositivo ||
      actual.frecuencia !== inicial.frecuencia ||
      actual.comentario !== inicial.comentario
    );
  }

  mostrarConfirmacion() {
    return new Promise((resolve) => {
      const modal = document.getElementById("confirm-modal-ayuda");
      const btnYes = document.getElementById("confirm-yes-ayuda");
      const btnNo = document.getElementById("confirm-no-ayuda");

      modal.classList.remove("hidden");

      const limpiar = () => {
        btnYes.removeEventListener("click", onYes);
        btnNo.removeEventListener("click", onNo);
        modal.classList.add("hidden");
      };

      const onYes = () => {
        limpiar();
        resolve(true);
      };

      const onNo = () => {
        limpiar();
        resolve(false);
      };

      btnYes.addEventListener("click", onYes);
      btnNo.addEventListener("click", onNo);
    });
  }

  init() {
    if (!this.form) return;

    // Cancelar botón: confirmación antes de resetear
    document.querySelector("#ayuda-form button[type='button']").addEventListener("click", async () => {
      if (this.estaModificado()) {
        const confirmado = await this.mostrarConfirmacion();
        if (!confirmado) return;
      }
      this.resetearFormulario();
    });

    // Botón volver limpio con confirmación
    if (this.btnVolverLimpio) {
      this.btnVolverLimpio.addEventListener("click", async () => {
        if (this.estaModificado()) {
          const confirmado = await this.mostrarConfirmacion();
          if (!confirmado) return;
        }
        this.form.reset();
        document.getElementById("registro-ayuda-id").value = "";
        this.feedback.textContent = "";

        this.form.classList.remove("hidden");
        this.resumenSection.classList.add("hidden");
        this.btnVolverLimpio.classList.add("hidden");

        const submitBtn = this.form.querySelector("button[type='submit']");
        if (submitBtn) submitBtn.textContent = "Enviar solicitud";

        this.estadoInicial = this.obtenerEstadoFormulario();
      });
    }

    // Editar botón: muestra el formulario con datos para editar
    if (this.btnEditar) {
      this.btnEditar.addEventListener("click", () => {
        this.resumenSection.classList.add("hidden");
        this.form.classList.remove("hidden");

        const datos = {
          id: document.getElementById("registro-ayuda-id").value,
          nombre: this.resumenCampos.nombre.textContent === "(no proporcionado)" ? "" : this.resumenCampos.nombre.textContent,
          email: this.resumenCampos.email.textContent === "(no proporcionado)" ? "" : this.resumenCampos.email.textContent,
          tipo: this.resumenCampos.tipo.textContent,
          dispositivo: this.resumenCampos.dispositivo.textContent,
          frecuencia: this.resumenCampos.frecuencia.textContent,
          comentario: this.resumenCampos.comentario.textContent,
        };

        this.cargarDatosParaEditar(datos);

        const submitBtn = this.form.querySelector("button[type='submit']");
        if (submitBtn) submitBtn.textContent = "Actualizar";

        this.estadoInicial = this.obtenerEstadoFormulario();
      });
    }

    // Envío formulario
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = document.getElementById("registro-ayuda-id").value;
      const nombre = this.form.nombre.value.trim();
      const email = this.form.email.value.trim();
      const tipo = this.form["tipo-ayuda"].value;
      const dispositivo = this.form.dispositivo.value;
      const frecuencia = this.form.frecuencia.value;
      const comentario = this.form.comentario.value.trim();

      // Validaciones
      if (!tipo) {
        this.mostrarFeedback("⚠️ Por favor selecciona el tipo de ayuda.", true);
        return;
      }
      if (!dispositivo) {
        this.mostrarFeedback("⚠️ Por favor selecciona el dispositivo.", true);
        return;
      }
      if (!frecuencia) {
        this.mostrarFeedback("⚠️ Por favor selecciona la frecuencia.", true);
        return;
      }
      if (comentario.length < 10) {
        this.mostrarFeedback("⚠️ El comentario debe tener al menos 10 caracteres.", true);
        return;
      }
      if (email && !this.validarEmail(email)) {
        this.mostrarFeedback("⚠️ El correo electrónico no es válido.", true);
        return;
      }

      const datos = { nombre, email, tipo, comentario, dispositivo, frecuencia };

      try {
        let url = "http://localhost:3000/api/ayuda";
        let metodo = "POST";

        if (id) {
          url += `/${id}`;
          metodo = "PUT";
        }

        const res = await fetch(url, {
          method: metodo,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });

        if (!res.ok) throw new Error("Error al enviar");

        this.mostrarFeedback("✅ ¡Gracias por tu solicitud!", false);
        this.form.reset();
      } catch (err) {
        console.error(err);
        this.mostrarFeedback("❌ Error al enviar la solicitud. Intenta más tarde.", true);
      }

      // Mostrar resumen
      this.resumenCampos.nombre.textContent = nombre || "(no proporcionado)";
      this.resumenCampos.email.textContent = email || "(no proporcionado)";
      this.resumenCampos.tipo.textContent = tipo;
      this.resumenCampos.dispositivo.textContent = dispositivo;
      this.resumenCampos.frecuencia.textContent = frecuencia;
      this.resumenCampos.comentario.textContent = comentario;

      this.form.classList.add("hidden");
      this.resumenSection.classList.remove("hidden");
      if (this.btnVolverLimpio) this.btnVolverLimpio.classList.remove("hidden");

      this.estadoInicial = this.obtenerEstadoFormulario();
    });
  }

  resetearFormulario() {
    this.form.reset();
    this.feedback.textContent = "";
    this.estadoInicial = this.obtenerEstadoFormulario();
  }

  cargarDatosParaEditar(datos) {
    document.getElementById("registro-ayuda-id").value = datos.id || "";
    this.form.nombre.value = datos.nombre || "";
    this.form.email.value = datos.email || "";
    this.form["tipo-ayuda"].value = datos.tipo || "";
    this.form.dispositivo.value = datos.dispositivo || "";
    this.form.frecuencia.value = datos.frecuencia || "";
    this.form.comentario.value = datos.comentario || "";
  }

  mostrarFeedback(mensaje, esError) {
    this.feedback.textContent = mensaje;
    this.feedback.style.color = esError ? "crimson" : "green";

    clearTimeout(this._timeoutId);
    this._timeoutId = setTimeout(() => {
      this.feedback.textContent = "";
    }, 4000);
  }

  validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }

  initValidacionesEnTiempoReal() {
    this.form.comentario.addEventListener("input", () => {
      if (this.form.comentario.value.trim().length < 10) {
        this.form.comentario.style.borderColor = "crimson";
      } else {
        this.form.comentario.style.borderColor = "green";
      }
    });

    this.form.email.addEventListener("input", () => {
      const emailError = document.getElementById("email-error");
      if (this.form.email.value && !this.validarEmail(this.form.email.value)) {
        this.form.email.style.borderColor = "crimson";
        emailError.textContent = "Formato de correo inválido";
      } else {
        this.form.email.style.borderColor = "green";
        emailError.textContent = "";
      }
    });
  }

  initAtajosTeclado() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        if (this.form) this.form.requestSubmit();
      }
    });
  }
}
