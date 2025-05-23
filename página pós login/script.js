document.addEventListener('DOMContentLoaded', () => {
  const stepDetails = {
    1: {
      title: 'Organização de Documentos',
      html: `
        <p>Nesta etapa, você deve:</p>
        <ul>
          <li>Reunir comprovantes de residência e identidade</li>
          <li>Digitalizar RG, CPF e certidões em PDF</li>
          <li>Enviar ao nosso portal de forma segura</li>
        </ul>`
    },
    2: {
      title: 'Estruturação Jurídica',
      html: `
        <p>Seu consultor realizará:</p>
        <ol>
          <li>Desenho da estrutura societária</li>
          <li>Redação do contrato social</li>
          <li>Envio para aprovação jurídica</li>
        </ol>`
    },
    3: {
      title: 'Execução e Registro',
      html: `
        <p>No fechamento:</p>
        <ul>
          <li>Assinatura eletrônica dos documentos</li>
          <li>Protocolo junto ao cartório</li>
          <li>Recebimento do registro definitivo</li>
        </ul>`
    }
  };

  const total = 3;
  let current = 2;
  const fill = document.getElementById('progressFill');
  const text = document.getElementById('progressText');
  const stage = document.getElementById('stageText');
  const pct = (current / total) * 100;
  fill.style.width = pct + '%';
  text.textContent = `${Math.round(pct)}%`;
  stage.textContent = `Etapa atual: ${stepDetails[current].title}`;

  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');
  const close = document.querySelector('.modal-close');

  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.closest('.step').dataset.step;
      const info = stepDetails[step];
      body.innerHTML = `<h2>${info.title}</h2>${info.html}`;
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
    });
  });

  function closeModal() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  close.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
});
