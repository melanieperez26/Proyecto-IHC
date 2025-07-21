function resetearFormulario() {
    const form = document.getElementById("ayuda-form");
    if (form) {
      form.reset();
  
      // Limpia bordes y mensajes de error si los hay
      document.getElementById("comentario").style.borderColor = "";
      document.getElementById("email").style.borderColor = "";
  
      const emailError = document.getElementById("email-error");
      if (emailError) emailError.textContent = "";
  
      // Limpia el feedback general
      const feedback = document.getElementById("ayuda-feedback");
      if (feedback) feedback.textContent = "";
    }
    document.querySelector("#ayuda-form button[type='submit']").textContent = "Enviar solicitud";
    document.getElementById("registro-ayuda-id").value = "";
}

// Función para cargar datos al formulario y poner el ID
function cargarDatosParaEditar(datos) {
    document.getElementById("registro-ayuda-id").value = datos.id || "";
    document.getElementById("nombre").value = datos.nombre || "";
    document.getElementById("email").value = datos.email || "";
    document.getElementById("tipo-ayuda").value = datos.tipo || "";
    document.getElementById("dispositivo").value = datos.dispositivo || "";
    document.getElementById("frecuencia").value = datos.frecuencia || "";
    document.getElementById("comentario").value = datos.comentario || "";
  
    // Opcional: puedes cambiar el botón enviar para mostrar "Actualizar" si quieres
    document.querySelector("#ayuda-form button[type='submit']").textContent = "Actualizar";
}
  
  

export default class Ayuda {
    constructor(formId) {
      this.form = document.getElementById(formId);
      this.feedback = document.getElementById("ayuda-feedback");
      this.init();
      this.initAtajosTeclado();
    }

    initValidacionesEnTiempoReal() {
        const comentario = document.getElementById("comentario");
        comentario.addEventListener("input", () => {
          if (comentario.value.trim().length < 10) {
            comentario.style.borderColor = "crimson";
          } else {
            comentario.style.borderColor = "green";
          }
        });
      
        const email = document.getElementById("email");
        email.addEventListener("input", () => {
            const emailError = document.getElementById("email-error");
          if (email.value && !this.validarEmail(email.value)) {
            email.style.borderColor = "crimson";
            emailError.textContent = "Formato de correo inválido";
          } else {
            email.style.borderColor = "green";
            emailError.textContent = "";
          }
        });
      }
      
  
    init() {
      document.querySelector("#ayuda-form button[type='button']").addEventListener("click", resetearFormulario);

      this.initValidacionesEnTiempoReal();
      
      if (!this.form) return;
  
      this.form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id=document.getElementById("registro-ayuda-id").value;
  
        // Obtener valores del formulario
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const tipo = document.getElementById("tipo-ayuda").value;
        const comentario = document.getElementById("comentario").value.trim();
        const dispositivo = document.getElementById("dispositivo").value;
        const frecuencia = document.getElementById("frecuencia").value;
  
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
  
        // (Opcional) Validar formato de correo si está lleno
        if (email && !this.validarEmail(email)) {
          this.mostrarFeedback("⚠️ El correo electrónico no es válido.", true);
          return;
        }
  
        // Preparar datos a enviar
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
      });

      let cambios = false;
      document.getElementById("formulario").addEventListener("input", () => {
        cambios = true;
      });

      window.addEventListener("beforeunload", function (e) {
        if (cambios) {
          e.preventDefault();
          e.returnValue = '';
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
  
    validarEmail(email) {
      // Regex simple para validar email
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email.toLowerCase());
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


