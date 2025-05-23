function simulate() {
  // 1) coleta inputs
  const P0 = parseFloat(document.getElementById('initial').value) || 0;
  const PM = parseFloat(document.getElementById('monthly').value) || 0;
  const rAnual = parseFloat(document.getElementById('rate').value) / 100;
  const anos = parseInt(document.getElementById('years').value) || 0;

  const meses = anos * 12;
  const rMensal = Math.pow(1 + rAnual, 1 / 12) - 1;

  // 2) calcula séries, aportes e rendimentos
  let labels = [], data = [];
  let saldo = P0, totalAportes = P0;

  for (let m = 1; m <= meses; m++) {
    saldo = (saldo + PM) * (1 + rMensal);
    totalAportes += PM;
    labels.push(`${m}m`);
    data.push(parseFloat(saldo.toFixed(2)));
  }

  const valorFuturo = saldo;
  const rendimentos = valorFuturo - totalAportes;

  // 3) exibe KPIs
  document.getElementById('finalValue').textContent =
    valorFuturo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  document.getElementById('totalContributions').textContent =
    totalAportes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  document.getElementById('totalEarnings').textContent =
    rendimentos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  document.getElementById('results').style.display = 'block';

  // 4) gráfico de linha
  const ctx1 = document.getElementById('growthChart').getContext('2d');
  if (window.growthChart) window.growthChart.destroy();
  window.growthChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Saldo Acumulado',
        data,
        borderColor: '#004357',
        backgroundColor: 'rgba(0,67,87,0.2)',
        tension: 0.3,
        fill: true
      }]
    }
  });

  // 5) gráfico de pizza
  const ctx2 = document.getElementById('breakdownChart').getContext('2d');
  if (window.breakdownChart) window.breakdownChart.destroy();
  window.breakdownChart = new Chart(ctx2, {
    type: 'pie',
    data: {
      labels: ['Aportes', 'Rendimentos'],
      datasets: [{
        data: [totalAportes, rendimentos],
        backgroundColor: ['#0ec9ff', '#ffbb00']
      }]
    }
  });
}

// === Corrige sobreposição dos labels ao preencher ===
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.input-group input').forEach(input => {
    const parent = input.parentElement;

    const updateFocus = () => {
      if (input.value.trim() !== "") {
        parent.classList.add("focused");
      } else {
        parent.classList.remove("focused");
      }
    };

    input.addEventListener("input", updateFocus);
    input.addEventListener("blur", updateFocus);
    input.addEventListener("focus", updateFocus);

    // Atualiza já ao carregar
    updateFocus();
  });
});

