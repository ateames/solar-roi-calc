function calculateROI() {
  // Get form values
  let totalCost = parseFloat(document.getElementById('totalCost').value);
  let kwSize = parseFloat(document.getElementById('kwSize').value);
  let electricityBill = parseFloat(document.getElementById('electricityBill').value);
  let yearsStay = parseFloat(document.getElementById('yearsStay').value);
  let taxCreditPercentage = parseFloat(document.getElementById('taxCredit').value);
  let interestRate = parseFloat(document.getElementById('interestRate').value);
  let loanTerm = parseFloat(document.getElementById('loanTerm').value);

  // Calculate tax credit
  let taxCredit = totalCost * (taxCreditPercentage / 100);
  let costWithTaxCredit = totalCost - taxCredit;
  let costPerWWithoutTaxCredit = (totalCost / (kwSize * 1000)).toFixed(2);
  let costPerWWithTaxCredit = (costWithTaxCredit / (kwSize * 1000)).toFixed(2);

  // Loan Calculations (Monthly payments)
  let monthlyInterestRate = interestRate / 12 / 100;
  let totalMonths = loanTerm * 12;
  
  let monthlyPaymentWithoutTaxCredit = (totalCost * monthlyInterestRate) / 
    (1 - Math.pow((1 + monthlyInterestRate), -totalMonths));

  let monthlyPaymentWithTaxCredit = (costWithTaxCredit * monthlyInterestRate) / 
    (1 - Math.pow((1 + monthlyInterestRate), -totalMonths));

  // Calculate solar payback in years and months
  let paybackWithoutTaxCredit = totalCost / (electricityBill * 12);
  let paybackWithTaxCredit = costWithTaxCredit / (electricityBill * 12);

  // Display results
  let results = `
    <h2>Results:</h2>
    <p>Cost w/ ${taxCreditPercentage}% tax credit: $${costWithTaxCredit.toFixed(2)}</p>
    <p>Cost per W w/o tax credit: $${costPerWWithoutTaxCredit}</p>
    <p>Cost per W w/ tax credit: $${costPerWWithTaxCredit}</p>
    <p>Monthly Payments w/ Tax Credit: $${monthlyPaymentWithTaxCredit.toFixed(2)}</p>
    <p>Monthly Payments w/o Tax Credit: $${monthlyPaymentWithoutTaxCredit.toFixed(2)}</p>
  `;
  
  document.getElementById('results').innerHTML = results;

  // Create the chart for payback with tax credit
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

  // Create the chart for payback without tax credit
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
