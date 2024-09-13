function calculateROI() {
  // Gather user inputs
  let totalCost = parseFloat(document.getElementById('totalCost').value);
  let kwSize = parseFloat(document.getElementById('kwSize').value);
  let electricityBill = parseFloat(document.getElementById('electricityBill').value);
  let taxCreditPercentage = parseFloat(document.getElementById('taxCredit').value);
  let rateIncrease = parseFloat(document.getElementById('rateIncrease').value);
  let interestRate = parseFloat(document.getElementById('interestRate').value);
  let loanTerm = parseFloat(document.getElementById('loanTerm').value);

  // Calculate the tax credit
  let taxCredit = totalCost * (taxCreditPercentage / 100);
  let costWithTaxCredit = totalCost - taxCredit;
  
  // Accumulated savings for each year
  let adjustedElectricityBill = electricityBill;
  let totalSavingsWithoutTaxCredit = 0;
  let totalSavingsWithTaxCredit = 0;

  let paybackWithoutTaxCreditYears = 0;
  let paybackWithoutTaxCreditMonths = 0;
  let paybackWithTaxCreditYears = 0;
  let paybackWithTaxCreditMonths = 0;

  // Loop to calculate cumulative savings year by year
  let year = 0;
  while (totalSavingsWithoutTaxCredit < totalCost || totalSavingsWithTaxCredit < costWithTaxCredit) {
    year++;
    // Calculate annual savings
    let annualSavings = adjustedElectricityBill * 12;

    // Accumulate savings for payback without tax credit
    if (totalSavingsWithoutTaxCredit < totalCost) {
      totalSavingsWithoutTaxCredit += annualSavings;
      if (totalSavingsWithoutTaxCredit >= totalCost) {
        // When payback is reached, calculate the exact year and month
        let overSavings = totalSavingsWithoutTaxCredit - totalCost;
        paybackWithoutTaxCreditYears = year;
        paybackWithoutTaxCreditMonths = Math.round((overSavings / annualSavings) * 12);
      }
    }

    // Accumulate savings for payback with tax credit
    if (totalSavingsWithTaxCredit < costWithTaxCredit) {
      totalSavingsWithTaxCredit += annualSavings;
      if (totalSavingsWithTaxCredit >= costWithTaxCredit) {
        // When payback is reached, calculate the exact year and month
        let overSavings = totalSavingsWithTaxCredit - costWithTaxCredit;
        paybackWithTaxCreditYears = year;
        paybackWithTaxCreditMonths = Math.round((overSavings / annualSavings) * 12);
      }
    }

    // Increase the electricity bill for the next year based on the rate increase
    adjustedElectricityBill += adjustedElectricityBill * (rateIncrease / 100);
  }

  // Monthly loan payments calculations
  let monthlyInterestRate = interestRate / 12 / 100;
  let totalMonths = loanTerm * 12;
  let monthlyPaymentWithoutTaxCredit = (totalCost * monthlyInterestRate) / (1 - Math.pow((1 + monthlyInterestRate), -totalMonths));
  let monthlyPaymentWithTaxCredit = (costWithTaxCredit * monthlyInterestRate) / (1 - Math.pow((1 + monthlyInterestRate), -totalMonths));

  // Display the results
  let results = `
    <h2>Results:</h2>
    <p>Cost w/ ${taxCreditPercentage}% tax credit: $${costWithTaxCredit.toFixed(2)}</p>
    <p>Cost per W w/o tax credit: ${(totalCost / (kwSize * 1000)).toFixed(2)}</p>
    <p>Cost per W w/ tax credit: ${(costWithTaxCredit / (kwSize * 1000)).toFixed(2)}</p>
    <p>Monthly Payments w/ Tax Credit: $${monthlyPaymentWithTaxCredit.toFixed(2)}</p>
    <p>Monthly Payments w/o Tax Credit: $${monthlyPaymentWithoutTaxCredit.toFixed(2)}</p>
    <p>Payback w/o tax credit: ${paybackWithoutTaxCreditYears} Years and ${paybackWithoutTaxCreditMonths} Months</p>
    <p>Payback w/ tax credit: ${paybackWithTaxCreditYears} Years and ${paybackWithTaxCreditMonths} Months</p>
  `;
  
  document.getElementById('results').innerHTML = results;

  // Generate the charts to visualize payback periods
  generatePaybackCharts(paybackWithTaxCreditYears, paybackWithTaxCreditMonths, paybackWithoutTaxCreditYears, paybackWithoutTaxCreditMonths);
}

function generatePaybackCharts(paybackWithTaxCreditYears, paybackWithTaxCreditMonths, paybackWithoutTaxCreditYears, paybackWithoutTaxCreditMonths) {
  const paybackChartWithTaxCredit = new Chart(document.getElementById('paybackChartWithTaxCredit'), {
    type: 'bar',
    data: {
      labels: ['Payback (Years)', 'Payback (Months)'],
      datasets: [{
        label: 'Solar Payback w/ Tax Credit',
        data: [paybackWithTaxCreditYears, paybackWithTaxCreditMonths],
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
        data: [paybackWithoutTaxCreditYears, paybackWithoutTaxCreditMonths],
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
