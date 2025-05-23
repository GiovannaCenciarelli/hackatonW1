document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // coleta valores
  const name    = this.name.value.trim();
  const email   = this.email.value.trim();
  const phone   = this.phone.value.trim();
  const method  = this.method.value;
  const message = this.message.value.trim();

  // validações simples
  if (!name || !email || !phone || !method || !message) {
    showFeedback('Por favor, preencha todos os campos.', 'error');
    return;
  }
  // regex simples de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFeedback('Informe um e-mail válido.', 'error');
    return;
  }

  // simula envio — aqui você integraria com seu backend/API
  setTimeout(() => {
    showFeedback('Mensagem enviada com sucesso! Em breve seu consultor entrará em contato.', 'success');
    this.reset();
  }, 800);
});

function showFeedback(text, type) {
  const fb = document.getElementById('formFeedback');
  fb.textContent = text;
  fb.style.color = type === 'error' ? 'crimson' : 'green';
}
