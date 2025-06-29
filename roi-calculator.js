
function calculateMonthlyPayment(P, r, n) {
  const monthlyRate = r / 100 / 12;
  return monthlyRate === 0 ? P / n : P * monthlyRate / (1 - Math.pow(1 + monthlyRate, -n));
}

function calculateROI() {
  const loanAmount = parseFloat(document.getElementById('loanAmount').value);
  const apr = parseFloat(document.getElementById('apr').value);
  const term = parseFloat(document.getElementById('term').value);
  const life = parseFloat(document.getElementById('life').value);
  const costOfFunds = parseFloat(document.getElementById('costOfFunds').value);
  const lossPercent = parseFloat(document.getElementById('lossPercent').value);
  const ucFee = parseFloat(document.getElementById('ucFee').value);
  const conversionRate = parseFloat(document.getElementById('conversionRate').value);

  const alertBox = document.getElementById('alert');
  if ([loanAmount, apr, term, life, costOfFunds, lossPercent, ucFee, conversionRate].some(val => isNaN(val) || val <= 0)) {
    alertBox.style.display = 'block';
    document.getElementById('results').style.display = 'none';
    return;
  } else {
    alertBox.style.display = 'none';
  }

  const payment = calculateMonthlyPayment(loanAmount, apr, term);
  const totalPayments = payment * life;
  const principalPaid = loanAmount * (life / term);
  const totalInterest = totalPayments - principalPaid;
  const cost = loanAmount * (costOfFunds / 100) * (life / 12);
  const losses = loanAmount * (lossPercent / 100);
  const effectiveUcFee = ucFee / (conversionRate / 100);
  const net = totalInterest - cost - losses - effectiveUcFee;
  const roi = (net / loanAmount) * 100;

  const resultsDiv = document.getElementById('results');
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = `
    <p><strong>Conversion Rate:</strong> ${conversionRate.toFixed(2)}%</p>
    <p><strong>Monthly Payment:</strong> $${payment.toFixed(2)}</p>
    <p><strong>Total Interest Income:</strong> $${totalInterest.toFixed(2)}</p>
    <p><strong>Cost of Funds:</strong> $${cost.toFixed(2)}</p>
    <p><strong>Loss Provision:</strong> $${losses.toFixed(2)}</p>
    <p><strong>Union Credit Fee (adjusted for conversion rate):</strong> $${effectiveUcFee.toFixed(2)}</p>
    <p><strong>Net Income:</strong> $${net.toFixed(2)}</p>
    <p><strong>ROA:</strong> ${roi.toFixed(2)}%</p>
  `;

  const ctx = document.getElementById('roiChart').getContext('2d');
  if (window.roiChart) {
    window.roiChart.destroy();
  }
  window.roiChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Interest', 'Cost of Funds', 'Loss Provision', 'UC Fee', 'Net Income'],
      datasets: [{
        label: 'Dollars ($)',
        data: [totalInterest, cost, losses, effectiveUcFee, net],
        backgroundColor: ['#4caf50', '#f44336', '#ff9800', '#2196f3', '#9c27b0']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("calculateButton");
  if (btn) {
    btn.addEventListener("click", calculateROI);
  }
});
