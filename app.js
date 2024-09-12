function calculateROI() {
  // Gather user inputs
  let totalCost = parseFloat(document.getElementById('totalCost').value);
  let kwSize = parseFloat(document.getElementById('kwSize').value);
  let electricityBill = parseFloat(document.getElementById('electricityBill').value);
  let yearsStay = parseFloat(document.getElementById('yearsStay').value);
  let taxCreditPercentage = parseFloat(document.getElementById('taxCredit').value);
  let rateIncrease = parseFloat(document.getElementById('rateIncrease').value);
  let interestRate = parseFloat(document.getElementById('interestRate').value);
  let loanTerm = parseFloat(document.getElementById('loanTerm').value);

  // Calculations
  let taxCredit = totalCost * (taxCreditPercentage / 100);
  let costWithTaxCredit = totalCost - taxCredit;
  let costPerWWithoutTaxCredit = (totalCost / (kwSize * 1000)).toFixed(2);
  let costPerWWithTaxCredit = (costWithTaxCredit / (kwSize * 1000)).toFixed(2);

  // Adjusting electricity bill with yearly rate increase
  let adjustedElectricityBill = electricityBill;
  let totalSavingsWithoutTaxCredit = 0;
  let totalSavingsWithTaxCredit = 0;

  for (let year = 1; year <= yearsStay; year++) {
    totalSavingsWithoutTaxCredit += adjustedElectricityBill * 12;
    totalSavingsWithTaxCredit += adjustedElectricityBill * 12;
    
    // Increase the electricity bill by the rate increase for the next year
    adjustedElectricityBill += adjustedElectricityBill * (rateIncrease / 100);
  }

  // Payback calculation with and without tax credit over lifetime
  let paybackWithoutTaxCredit = totalCost / totalSavingsWithoutTaxCredit;
  let paybackWithTaxCredit = costWithTaxCredit / totalSavingsWithTaxCredit;

  // Monthly loan payments calculations
  let monthlyInterestRate = interestRate / 12 / 100;
  let totalMonths = loanTerm * 12;
  let monthlyPaymentWithoutTaxCredit = (totalCost * monthlyInterestRate) / (1 - Math.pow((1 + monthlyInterestRate), -totalMonths));
  let monthlyPaymentWithTaxCredit = (costWithTaxCredit * monthlyInterestRate) / (1 - Math.pow((1 + monthlyInterestRate), -totalMonths));

  // Display results
  let results = `
    <h2>Results:</h2>
    <p>Cost w/ ${taxCreditPercentage}% tax credit: $${costWithTaxCredit.toFixed(2)}</p>
    <p>Cost per W w/o tax credit: $${costPerWWithoutTaxCredit}</p>
    <p>Cost per W w/ tax credit: $${costPerWWithTaxCredit}</p>
    <p>Monthly Payments w/ Tax Credit: $${monthlyPaymentWithTaxCredit.toFixed(2)}</p>
    <p>Monthly Payments w/o Tax Credit: $${monthlyPaymentWithoutTaxCredit.toFixed(2)}</p>
    <p>Payback w/o tax credit: ${paybackWithoutTaxCredit.toFixed(2)} years</p>
    <p>Payback w/ tax credit: ${paybackWithTaxCredit.toFixed(2)} years</p>
  `;

  document.getElementById('results').innerHTML = results;

  // Generate the charts to visualize payback periods
  generatePaybackCharts(paybackWithTaxCredit, paybackWithoutTaxCredit);
}

function generatePaybackCharts(paybackWithTaxCredit, paybackWithoutTaxCredit) {
  const paybackChartWithTaxCredit = new Chart(document.getElementById('paybackChartWithTaxCredit'), {
    type: 'bar',
    data: {
      labels: ['Payback (Years)', 'Payback (Months)'],
      datasets: [{
        label: 'Solar Payback w/ Tax Credit',
        data: [Math.floor(paybackWithTaxCredit), (paybackWithTaxCredit % 1 * 12).toFixed(0)],
        backgroundColor: ['#28a745', '#28a745']
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  const paybackChartWithoutTaxCredit = new Chart(document.getElementById('paybackChartWithoutTaxCredit'), {
    type: 'bar',
    data: {
      labels: ['Payback (Years)', 'Payback (Months)'],
      datasets: [{
        label: 'Solar Payback w/o Tax Credit',
        data: [Math.floor(paybackWithoutTaxCredit), (paybackWithoutTaxCredit % 1 * 12).toFixed(0)],
        backgroundColor: ['#dc3545', '#dc3545']
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
