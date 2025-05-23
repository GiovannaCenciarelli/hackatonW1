// script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('holdingForm');
  const resultSection = document.querySelector('.result-section');
  const savingsResult = document.getElementById('savingsResult');
  const ctx = document.getElementById('taxChart').getContext('2d');
  let chart = null;

  // Configuração de taxas e alíquotas
  const taxConfig = {
    itcmd: {
      'SP': 0.04,
      'RJ': 0.05,
      'MG': 0.03,
      'OUTROS': 0.04
    },
    irpf: [
      { min: 0, max: 22847.76, rate: 0 },
      { min: 22847.77, max: 33919.80, rate: 0.075 },
      { min: 33919.81, max: 45012.60, rate: 0.15 },
      { min: 45012.61, max: 55976.16, rate: 0.225 },
      { min: 55976.17, rate: 0.275 }
    ],
    holding: {
      itcmd: 0.015,
      irpj: 0.15,
      csll: 0.09,
      dividendos: 0.00
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const formData = getFormData();
      validateInputs(formData);
      
      const { totalIndividual, totalHolding } = calculateTaxes(formData);
      
      updateResults(totalIndividual, totalHolding);
      updateChart(totalIndividual, totalHolding);
      
      resultSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      showError(error.message);
    }
  });

  function getFormData() {
    return {
      patrimonio: parseFloat(document.getElementById('patrimonio').value),
      imoveis: parseFloat(document.getElementById('imoveis').value),
      sociedades: parseFloat(document.getElementById('sociedades').value),
      faturamento: parseFloat(document.getElementById('faturamento').value),
      estado: document.getElementById('estado').value
    };
  }

  function validateInputs({ imoveis, sociedades }) {
    if (imoveis + sociedades > 100) {
      throw new Error('A soma dos percentuais de imóveis e sociedades não pode ultrapassar 100%');
    }
  }

  function calculateIRPF(baseCalculo) {
    const faixa = taxConfig.irpf.find(f => 
      baseCalculo >= f.min && (!f.max || baseCalculo <= f.max)
    );
    return baseCalculo * faixa.rate;
  }

  function calculateTaxes({ patrimonio, imoveis, sociedades, faturamento, estado }) {
    // Cálculo para pessoa física
    const itcmdIndividual = patrimonio * taxConfig.itcmd[estado];
    const irpfIndividual = calculateIRPF(faturamento);

    // Cálculo para holding
    const itcmdHolding = patrimonio * taxConfig.holding.itcmd;
    const irpjHolding = faturamento * taxConfig.holding.irpj;
    const csllHolding = faturamento * taxConfig.holding.csll;

    return {
      totalIndividual: itcmdIndividual + irpfIndividual,
      totalHolding: itcmdHolding + irpjHolding + csllHolding
    };
  }

  function updateResults(individual, holding) {
    const economia = individual - holding;
    savingsResult.textContent = economia.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function updateChart(individual, holding) {
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pessoa Física', 'Holding'],
        datasets: [{
          label: 'Impostos Totais',
          data: [individual, holding],
          backgroundColor: ['#FF6B35', '#00565A'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => 
                context.raw.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                })
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => 
                value.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                })
            }
          }
        }
      }
    });
  }

  function showError(message) {
    alert(`Erro: ${message}`);
  }
});