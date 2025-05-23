const investmentConfig = {
  "Renda Fixa": { color: "#00bfa5", fixedReturn: 0.1089 },
  "Ações": { color: "#2979ff", simulatedReturn: 0.12 },
  "FIIs": { color: "#ff9100", simulatedReturn: 0.10 },
  "ETFs": { color: "#e53935", simulatedReturn: 0.11 },
  "Previdência": { color: "#8e24aa", fixedReturn: 0.085 },
  "Cripto": { color: "#fdd835", simulatedReturn: 0.35 },
  "Internacional": { color: "#43a047", simulatedReturn: 0.14 },
  "Commodities": { color: "#ff6d00", simulatedReturn: 0.09 },
  "Hedge": { color: "#6d4c41", fixedReturn: 0.04 }  // Proteção, como ouro ou dólar
};

const daysMap = { "1D": 1, "1W": 7, "1M": 30, "1Y": 365, "5Y": 1825 };

function periodFactor(period) {
  return (daysMap[period] ?? 365) / 365;  // fallback para 1 ano se período inválido
}

function getReturnRate(config) {
  return config.fixedReturn ?? config.simulatedReturn ?? 0;
}

function simulate() {
  const timeframe = document.getElementById("timeframe").value;
  let totalInvested = 0;
  let totalCurrentValue = 0;
  const labels = [];
  const data = [];
  const colors = [];

  const factor = periodFactor(timeframe);

  Object.entries(investmentConfig).forEach(([name, config]) => {
    const inputElement = document.getElementById(name);
    const investedValue = inputElement ? parseFloat(inputElement.value) || 0 : 0;
    if (investedValue <= 0) return;

    totalInvested += investedValue;

    const rate = getReturnRate(config);
    const adjustedValue = investedValue * (1 + rate * factor);
    totalCurrentValue += adjustedValue;

    labels.push(name);
    data.push(adjustedValue);
    colors.push(config.color);
  });

  const variation = totalInvested > 0 
    ? ((totalCurrentValue - totalInvested) / totalInvested * 100).toFixed(2) 
    : "0.00";

  document.getElementById('invested').innerText = `Total Investido: R$ ${totalInvested.toFixed(2)}`;
  document.getElementById('current').innerText = `Valor Atual: R$ ${totalCurrentValue.toFixed(2)}`;
  document.getElementById('variation').innerText = `Variação: ${variation}%`;

  renderPieChart(labels, data, colors);
  renderBarChart(labels, data, colors);
  renderLineChart(totalInvested, totalCurrentValue, timeframe);
}

let pieChart, barChart, lineChart;

function createChartContext(id) {
  const canvas = document.getElementById(id);
  return canvas ? canvas.getContext('2d') : null;
}

function renderPieChart(labels, data, colors) {
  const ctx = createChartContext('pieChart');
  if (!ctx) return;

  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors }] },
    options: {
      plugins: { legend: { labels: { color: 'white' } } },
      cutout: '60%'
    }
  });
}

function renderBarChart(labels, data, colors) {
  const ctx = createChartContext('barChart');
  if (!ctx) return;

  if (barChart) barChart.destroy();
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Distribuição por Ativo',
        data,
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: {
      scales: {
        x: { ticks: { color: 'white' }, grid: { display: false } },
        y: { ticks: { color: 'white' }, grid: { color: '#444' } }
      },
      plugins: {
        legend: { labels: { color: 'white' } },
        tooltip: { enabled: true }
      }
    }
  });
}

function renderLineChart(invested, current, timeframe) {
  const ctx = createChartContext('lineChart');
  if (!ctx) return;

  if (lineChart) lineChart.destroy();

  const factor = periodFactor(timeframe);
  const steps = Math.max(Math.ceil(factor * 12), 2); // pelo menos 2 pontos

  const labels = Array.from({ length: steps }, (_, i) => {
    if (factor < 1) return `Mês ${i}`;
    else if (factor <= 5) return `Ano ${i}`;
    else return `Ano ${i * 5}`;
  });

  const data = labels.map((_, i) => 
    invested + (current - invested) * (i / (steps - 1))
  );

  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Evolução Patrimonial',
        data,
        borderColor: '#0EC9FF',
        backgroundColor: 'rgba(14,201,255,0.27)',
        tension: 0.3,
        fill: true,
        pointRadius: 4
      }]
    },
    options: {
      scales: {
        x: { ticks: { color: 'white' }, grid: { color: '#444' } },
        y: { ticks: { color: 'white' }, grid: { color: '#444' } }
      },
      plugins: { legend: { labels: { color: 'white' } } }
    }
  });
}
