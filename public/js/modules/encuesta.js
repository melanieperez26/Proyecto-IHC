class Encuesta {
    constructor(formId) {
      this.form = document.getElementById(formId);
      this.commentBox = document.getElementById('comment');
      this.feedback = document.getElementById('feedback-message');
      this.init();
      this.initAtajosTeclado();
    }
  
    init() {
      if (!this.form) return;
  
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const rating = this.form.querySelector('input[name="rating"]:checked')?.value;
        const comentario = this.commentBox.value;
  
        if (!rating) {
          this.feedback.textContent = '⚠️ Por favor selecciona una calificación.';
          return;
        }
  
        try {
          const res = await fetch('http://localhost:3000/api/encuesta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, comentario })
          });
  
          if (!res.ok) throw new Error('Error al enviar encuesta');
  
          this.feedback.textContent = '✅ ¡Gracias por tu opinión!';
          this.form.reset();
        } catch (err) {
          console.error(err);
          this.feedback.textContent = '❌ No se pudo enviar la encuesta. Intenta más tarde.';
        }
      });
    }
  
    initAtajosTeclado() {
      document.addEventListener('keydown', (e) => {
        const isShortcut = e.ctrlKey || e.metaKey; // Ctrl en Windows, Cmd en Mac
        const key = e.key.toLowerCase();
  
        if (!isShortcut) return;
  
        // Seleccionar calificación con Ctrl + 1–5
        if (['1', '2', '3', '4', '5'].includes(key)) {
          const input = document.querySelector(`input[name="rating"][value="${key}"]`);
          if (input) {
            input.checked = true;
            input.focus();
          }
        }
  
        // Enfocar comentario con Ctrl + E
        if (key === 'e') {
          this.commentBox?.focus();
        }
  
        // Enviar formulario con Ctrl + S
        if (key === 's') {
          e.preventDefault(); // Evita el guardado del navegador
          this.form?.requestSubmit();
        }
      });
    }
  }
  
  export default Encuesta;
  