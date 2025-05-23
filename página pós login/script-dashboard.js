document.addEventListener('DOMContentLoaded', () => {
  // Navegação de abas
  document.querySelectorAll('.btn-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-nav').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.getElementById(btn.dataset.section).classList.add('active');
    });
  });

  // Donut - Overview
  new Chart(document.getElementById('overviewDonut'), {
    type: 'doughnut',
    data: {
      labels: ['Renda Fixa','Ações','Tesouro','Fundos','Outros'],
      datasets: [{
        data: [50,20,15,10,5],
        backgroundColor: ['#0ec9ff','#004357','#031E26','#ffbb00','#888888']
      }]
    },
    options: {
      cutout: '60%',
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#031E26' } }
      }
    }
  });

  // Linha - Evolução Mensal
  const months = Array.from({length:12},(_,i) => {
    const d = new Date();
    d.setMonth(d.getMonth()-(11-i));
    return d.toLocaleString('pt-BR',{month:'short','year':'2-digit'});
  });
  new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Patrimônio',
        data: [80,85,90,95,100,110,120,115,118,125,130,135],
        borderColor: '#004357',
        backgroundColor: 'rgba(0,67,87,0.2)',
        tension: 0.3,
        fill: true
      }]
    },
    options: { responsive:true, plugins:{ legend:{ display:false } } }
  });

  // Área - Rentabilidade
  new Chart(document.getElementById('areaChart'), {
    type: 'line',
    data: {
      labels: months,
      datasets:[{
        label:'Rentabilidade (%)',
        data:[2,4,6,5,7,8,9,8,9,10,11,12],
        borderColor: '#0ec9ff',
        backgroundColor: 'rgba(14,201,255,0.3)',
        tension: 0.3,
        fill: 'origin'
      }]
    },
    options:{ responsive:true, plugins:{ legend:{ position:'bottom' } } }
  });

  // Barras - Comparação
  const barCtx = document.getElementById('barChart').getContext('2d');
  const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels:['6m','12m','24m'],
      datasets:[
        { label:'Sem W1', data:[100,120,140], backgroundColor:'#031E26' },
        { label:'Com W1', data:[110,135,160], backgroundColor:'#0ec9ff' }
      ]
    },
    options:{ responsive:true, plugins:{ legend:{ position:'bottom' } }, scales:{ y:{ beginAtZero:true } } }
  });

  // Atualiza comparativo
  document.getElementById('compareRange').addEventListener('change', e=>{
    const idx = {6:0,12:1,24:2}[e.target.value];
    const sem  = [100,120,140][idx];
    const com  = [110,135,160][idx];
    barChart.data.labels = [`${e.target.value}m`];
    barChart.data.datasets[0].data = [sem];
    barChart.data.datasets[1].data = [com];
    barChart.update();
  });
});
// Dados de exemplo (retornos percentuais)
const fullData = {
  1: [2.1],
  6: [1.5, 2.0, -0.5, 3.0, 1.8, 2.2],
  12: [1.2, 1.8, 2.5, -0.4, 3.1, 2.6, 1.9, 2.3, -1.0, 3.5, 2.9, 2.0]
};

// Label dos meses (assumindo últimos 12 meses)
const monthLabels = Array.from({length:12},(_,i)=>{
  const d = new Date();
  d.setMonth(d.getMonth() - (11 - i));
  return d.toLocaleString('pt-BR',{month:'short','year':'2-digit'});
});

// Variável global para o chart
let perfChart;

// Função que atualiza tudo
function updatePerformance() {
  const range = parseInt(document.getElementById('perfRange').value);
  const type  = document.getElementById('perfType').value;
  const data  = fullData[range];
  const labels = monthLabels.slice(12 - range);

  // KPIs
  const max = Math.max(...data), min = Math.min(...data);
  const avg = data.reduce((a,b)=>a+b,0)/data.length;
  document.getElementById('highestMonth').textContent = `${max.toFixed(2)}%`;
  document.getElementById('lowestMonth').textContent  = `${min.toFixed(2)}%`;
  document.getElementById('averageReturn').textContent= `${avg.toFixed(2)}%`;

  // Título
  document.getElementById('perfTitle').textContent = 
    `Evolução Mensal (${range} ${range>1?'meses':'mês'})`;

  // Tabela
  const tbody = document.getElementById('perfTableBody');
  tbody.innerHTML = '';
  data.forEach((ret,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${labels[i]}</td><td>${ret.toFixed(2)}%</td>`;
    tbody.appendChild(tr);
  });

  // Gráfico
  const ctx = document.getElementById('perfChart').getContext('2d');
  if (perfChart) perfChart.destroy();
  perfChart = new Chart(ctx, {
    type,
    data: {
      labels,
      datasets:[{
        label: 'Retorno Mensal (%)',
        data,
        borderColor: '#004357',
        backgroundColor: type==='bar' ? '#0ec9ff' : 'rgba(0,67,87,0.2)',
        tension: 0.3,
        fill: type==='line'
      }]
    },
    options:{
      responsive:true,
      plugins:{ legend:{ display:false } },
      scales:{ y:{ beginAtZero:false } }
    }
  });
}

// Event listeners
document.getElementById('perfRange').addEventListener('change', updatePerformance);
document.getElementById('perfType').addEventListener('change', updatePerformance);

// Inicializa ao carregar
updatePerformance();
// Função para simular valor ao longo do tempo
// taxaSem: array de taxas mensais sem W1; taxaCom: com W1
function simulateGrowth(P0, taxas) {
  return taxas.reduce((result, taxa) => {
    const prev = result[result.length - 1];
    result.push(parseFloat((prev * (1 + taxa)).toFixed(2)));
    return result;
  }, [P0]);
}

// Gera taxas aleatórias
function randomRates(len, minPct, maxPct) {
  // transforma em decimal
  return Array.from({length: len}, () => {
    const p = minPct + Math.random() * (maxPct - minPct);
    return p / 100;
  });
}

// Labels dos últimos 24 meses
const last24 = Array.from({length: 24}, (_,i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - (23 - i));
  return d.toLocaleString('pt-BR',{month:'short','year':'2-digit'});
});

let compareChart;

function updateComparison() {
  const meses = parseInt(document.getElementById('compareRange').value,10);
  const tipo  = document.getElementById('compareType').value;
  
  // simula taxas: Sem W1 (0.2–0.6%), Com W1 (0.5–1.0%)
  const taxasSem = randomRates(meses, 0.2, 0.6);
  const taxasCom = randomRates(meses, 0.5, 1.0);

  // valores começando em 1000
  const valoresSem = simulateGrowth(1000, taxasSem);
  const valoresCom = simulateGrowth(1000, taxasCom);

  // KPIs finais
  const finalSem = valoresSem[valoresSem.length -1];
  const finalCom = valoresCom[valoresCom.length -1];
  const economia = finalCom - finalSem;
  document.getElementById('finalSem').textContent = finalSem.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  document.getElementById('finalCom').textContent = finalCom.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  document.getElementById('economia').textContent = economia.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

  // Labels
  const labels = last24.slice(24 - meses);
  document.getElementById('compTitle').textContent = `Comparação ${meses} meses (R$ 1 000)`;

  // Tabela
  const tbody = document.getElementById('compareTableBody');
  tbody.innerHTML = '';
  for (let i = 0; i <= meses; i++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i===0?'Inicial':labels[i-1]}</td>
      <td>${valoresSem[i].toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
      <td>${valoresCom[i].toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>`;
    tbody.appendChild(tr);
  }

  // Gráfico
  const ctx = document.getElementById('compareChart').getContext('2d');
  if (compareChart) compareChart.destroy();
  compareChart = new Chart(ctx, {
    type: tipo,
    data: {
      labels,
      datasets: [
        {
          label: 'Sem W1',
          data: valoresSem.slice(1),
          backgroundColor: '#031E26',
          borderColor: '#031E26',
          fill: tipo==='line'
        },
        {
          label: 'Com W1',
          data: valoresCom.slice(1),
          backgroundColor: '#0ec9ff',
          borderColor: '#0ec9ff',
          fill: tipo==='line'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position:'bottom' } },
      scales: {
        y: { beginAtZero: false },
        x: { title: { display: true, text: 'Mês' } }
      }
    }
  });
}

// Listeners
document.getElementById('compareRange').addEventListener('change', updateComparison);
document.getElementById('compareType').addEventListener('change', updateComparison);

// inicializa
updateComparison();
async function fetchStockData(ticker, period = '1y', interval = '1mo') {
  try {
    const res = await fetch(`http://localhost:5000/api/stock?ticker=${ticker}&period=${period}&interval=${interval}`);
    const data = await res.json();

    if (data.error) {
      alert("Erro: " + data.error);
      return;
    }

    updatePerformanceChart(data.history);
  } catch (err) {
    console.error('Erro ao buscar dados:', err);
  }
}

function updatePerformanceChart(history) {
  const labels = history.map(item => item.date);
  const values = history.map(item => item.close);

  const ctx = document.getElementById('perfChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Preço de Fechamento',
        data: values,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        fill: true,
      }]
    },
    options: {
      responsive: true,
    }
  });
}

// Exemplo: buscando PETR4 ao carregar a aba de Performance
document.querySelector('[data-section="performance"]').addEventListener('click', () => {
  fetchStockData('PETR4.SA');  // Use .SA para ações brasileiras
});
