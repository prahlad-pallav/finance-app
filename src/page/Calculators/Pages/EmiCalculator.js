import React, { useState, useEffect, useCallback } from 'react';
import './EmiCalculator.css';

const EmiCalculator = ({ onBack }) => {
  const [formData, setFormData] = useState({
    loanAmount: 500000,
    interestRate: 8.5,
    loanTerm: 20,
    loanType: 'home-loan',
    paymentFrequency: 'monthly',
    processingFee: 0
  });

  const [results, setResults] = useState({
    monthlyEMI: 0,
    totalAmount: 0,
    totalInterest: 0,
    yearlyBreakdown: []
  });

  const calculateEMI = useCallback(() => {
    const { loanAmount, interestRate, loanTerm, paymentFrequency } = formData;
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const time = parseFloat(loanTerm);
    
    if (principal && rate && time) {
      let monthlyRate, totalMonths;
      
      // Adjust for payment frequency
      switch (paymentFrequency) {
        case 'monthly':
          monthlyRate = rate / 12;
          totalMonths = time * 12;
          break;
        case 'quarterly':
          monthlyRate = rate / 4;
          totalMonths = time * 4;
          break;
        case 'yearly':
          monthlyRate = rate;
          totalMonths = time;
          break;
        default:
          monthlyRate = rate / 12;
          totalMonths = time * 12;
      }
      
      const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      const totalAmount = emi * totalMonths;
      const totalInterest = totalAmount - principal;

      // Calculate yearly breakdown
      const yearlyBreakdown = [];
      for (let year = 1; year <= loanTerm; year++) {
        const yearMonths = paymentFrequency === 'monthly' ? year * 12 : 
                          paymentFrequency === 'quarterly' ? year * 4 : year;
        const yearEMI = principal * monthlyRate * Math.pow(1 + monthlyRate, yearMonths) / (Math.pow(1 + monthlyRate, yearMonths) - 1);
        const yearTotal = yearEMI * (paymentFrequency === 'monthly' ? 12 : 
                                   paymentFrequency === 'quarterly' ? 4 : 1);
        const yearInterest = yearTotal - (principal / loanTerm);
        
        yearlyBreakdown.push({
          year,
          emi: yearEMI,
          total: yearTotal,
          interest: yearInterest,
          principal: principal / loanTerm
        });
      }

      setResults({
        monthlyEMI: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        yearlyBreakdown
      });
    }
  }, [formData]);

  useEffect(() => {
    calculateEMI();
  }, [calculateEMI]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getLoanTypeInfo = (loanType) => {
    switch (loanType) {
      case 'home-loan':
        return { name: 'Home Loan', icon: '🏠', color: '#28a745' };
      case 'personal-loan':
        return { name: 'Personal Loan', icon: '💳', color: '#007bff' };
      case 'car-loan':
        return { name: 'Car Loan', icon: '🚗', color: '#ffc107' };
      case 'education-loan':
        return { name: 'Education Loan', icon: '🎓', color: '#17a2b8' };
      case 'business-loan':
        return { name: 'Business Loan', icon: '💼', color: '#6f42c1' };
      default:
        return { name: 'Loan', icon: '💰', color: '#6c757d' };
    }
  };

  const loanTypeInfo = getLoanTypeInfo(formData.loanType);

  return (
    <div className="EmiCalculator">
      <div className="EmiCalculator__Container">
        <div className="EmiCalculator__Header">
          <button className="EmiCalculator__BackButton" onClick={onBack}>← Back</button>
          <h1 className="EmiCalculator__Title">EMI Calculator</h1>
          <p className="EmiCalculator__Subtitle">Calculate Equated Monthly Installments and plan your loan repayment</p>
        </div>

        <div className="EmiCalculator__Content">
          {/* Input Section */}
          <div className="EmiCalculator__InputSection">
            <h2 className="EmiCalculator__SectionTitle">Loan Details</h2>
            <div className="EmiCalculator__InputGrid">
              <div className="EmiCalculator__InputGroup">
                <label htmlFor="loanType" className="EmiCalculator__Label">Loan Type</label>
                <select
                  id="loanType"
                  name="loanType"
                  value={formData.loanType}
                  onChange={(e) => setFormData(prev => ({ ...prev, loanType: e.target.value }))}
                  className="EmiCalculator__Select"
                >
                  <option value="home-loan">Home Loan</option>
                  <option value="personal-loan">Personal Loan</option>
                  <option value="car-loan">Car Loan</option>
                  <option value="education-loan">Education Loan</option>
                  <option value="business-loan">Business Loan</option>
                </select>
                <div className="EmiCalculator__LoanTypeIndicator">
                  <span className="EmiCalculator__LoanTypeIcon" style={{ color: loanTypeInfo.color }}>
                    {loanTypeInfo.icon}
                  </span>
                  <span className="EmiCalculator__LoanTypeName">{loanTypeInfo.name}</span>
                </div>
              </div>

              <div className="EmiCalculator__InputGroup">
                <label htmlFor="loanAmount" className="EmiCalculator__Label">Loan Amount (₹)</label>
                <input
                  type="number"
                  id="loanAmount"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  min="10000"
                  step="10000"
                  className="EmiCalculator__Input"
                />
                <div className="EmiCalculator__Slider">
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="100000"
                    value={formData.loanAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, loanAmount: parseInt(e.target.value) }))}
                    className="EmiCalculator__RangeInput"
                  />
                  <div className="EmiCalculator__SliderLabels">
                    <span>₹1,00,000</span>
                    <span>₹1,00,00,000</span>
                  </div>
                </div>
              </div>

              <div className="EmiCalculator__InputGroup">
                <label htmlFor="interestRate" className="EmiCalculator__Label">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  min="1"
                  max="25"
                  step="0.1"
                  className="EmiCalculator__Input"
                />
                <div className="EmiCalculator__Slider">
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.1"
                    value={formData.interestRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, interestRate: parseFloat(e.target.value) }))}
                    className="EmiCalculator__RangeInput"
                  />
                  <div className="EmiCalculator__SliderLabels">
                    <span>5%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>

              <div className="EmiCalculator__InputGroup">
                <label htmlFor="loanTerm" className="EmiCalculator__Label">Loan Term (Years)</label>
                <input
                  type="number"
                  id="loanTerm"
                  name="loanTerm"
                  value={formData.loanTerm}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  className="EmiCalculator__Input"
                />
                <div className="EmiCalculator__Slider">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={formData.loanTerm}
                    onChange={(e) => setFormData(prev => ({ ...prev, loanTerm: parseInt(e.target.value) }))}
                    className="EmiCalculator__RangeInput"
                  />
                  <div className="EmiCalculator__SliderLabels">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>

              <div className="EmiCalculator__InputGroup">
                <label htmlFor="paymentFrequency" className="EmiCalculator__Label">Payment Frequency</label>
                <select
                  id="paymentFrequency"
                  name="paymentFrequency"
                  value={formData.paymentFrequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentFrequency: e.target.value }))}
                  className="EmiCalculator__Select"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="EmiCalculator__InputGroup">
                <label htmlFor="processingFee" className="EmiCalculator__Label">Processing Fee (₹)</label>
                <input
                  type="number"
                  id="processingFee"
                  name="processingFee"
                  value={formData.processingFee}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  className="EmiCalculator__Input"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="EmiCalculator__ResultsSection">
            <h2 className="EmiCalculator__SectionTitle">EMI Summary</h2>
            <div className="EmiCalculator__ResultsGrid">
              <div className="EmiCalculator__ResultCard">
                <div className="EmiCalculator__ResultIcon">💳</div>
                <h3 className="EmiCalculator__ResultTitle">
                  {formData.paymentFrequency === 'monthly' ? 'Monthly' : 
                   formData.paymentFrequency === 'quarterly' ? 'Quarterly' : 'Yearly'} EMI
                </h3>
                <p className="EmiCalculator__ResultAmount">{formatCurrency(results.monthlyEMI)}</p>
                <p className="EmiCalculator__ResultDescription">
                  Amount to pay {formData.paymentFrequency === 'monthly' ? 'every month' : 
                               formData.paymentFrequency === 'quarterly' ? 'every quarter' : 'every year'}
                </p>
              </div>

              <div className="EmiCalculator__ResultCard">
                <div className="EmiCalculator__ResultIcon">💰</div>
                <h3 className="EmiCalculator__ResultTitle">Total Interest</h3>
                <p className="EmiCalculator__ResultAmount EmiCalculator__ResultAmount--interest">{formatCurrency(results.totalInterest)}</p>
                <p className="EmiCalculator__ResultDescription">Total interest you will pay</p>
              </div>

              <div className="EmiCalculator__ResultCard EmiCalculator__ResultCard--highlight">
                <div className="EmiCalculator__ResultIcon">📊</div>
                <h3 className="EmiCalculator__ResultTitle">Total Amount</h3>
                <p className="EmiCalculator__ResultAmount">{formatCurrency(results.totalAmount)}</p>
                <p className="EmiCalculator__ResultDescription">Total amount to be repaid</p>
              </div>
            </div>

            {/* Loan Summary */}
            <div className="EmiCalculator__SummarySection">
              <h3 className="EmiCalculator__SummaryTitle">Loan Summary</h3>
              <div className="EmiCalculator__SummaryGrid">
                <div className="EmiCalculator__SummaryCard">
                  <span className="EmiCalculator__SummaryLabel">Principal Amount</span>
                  <span className="EmiCalculator__SummaryValue">{formatCurrency(formData.loanAmount)}</span>
                </div>
                <div className="EmiCalculator__SummaryCard">
                  <span className="EmiCalculator__SummaryLabel">Interest Rate</span>
                  <span className="EmiCalculator__SummaryValue">{formData.interestRate}% p.a.</span>
                </div>
                <div className="EmiCalculator__SummaryCard">
                  <span className="EmiCalculator__SummaryLabel">Loan Term</span>
                  <span className="EmiCalculator__SummaryValue">{formData.loanTerm} Years</span>
                </div>
                <div className="EmiCalculator__SummaryCard">
                  <span className="EmiCalculator__SummaryLabel">Processing Fee</span>
                  <span className="EmiCalculator__SummaryValue">{formatCurrency(formData.processingFee)}</span>
                </div>
              </div>
            </div>

            {/* Yearly Breakdown */}
            <div className="EmiCalculator__BreakdownSection">
              <h3 className="EmiCalculator__BreakdownTitle">Yearly Breakdown</h3>
              <div className="EmiCalculator__BreakdownTable">
                <div className="EmiCalculator__TableHeader">
                  <span>Year</span>
                  <span>EMI</span>
                  <span>Principal</span>
                  <span>Interest</span>
                  <span>Balance</span>
                </div>
                <div className="EmiCalculator__TableBody">
                  {results.yearlyBreakdown.map((item, index) => (
                    <div key={index} className="EmiCalculator__TableRow">
                      <span>{item.year}</span>
                      <span>{formatCurrency(item.emi)}</span>
                      <span>{formatCurrency(item.principal)}</span>
                      <span className="EmiCalculator__TableInterest">{formatCurrency(item.interest)}</span>
                      <span className="EmiCalculator__TableBalance">{formatCurrency(formData.loanAmount - (item.principal * item.year))}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Loan Tips */}
            <div className="EmiCalculator__TipsSection">
              <h3 className="EmiCalculator__TipsTitle">💡 Loan Tips</h3>
              <div className="EmiCalculator__TipsGrid">
                <div className="EmiCalculator__TipCard">
                  <h4 className="EmiCalculator__TipTitle">Compare Interest Rates</h4>
                  <p className="EmiCalculator__TipText">Always compare interest rates from multiple lenders to get the best deal and reduce your EMI burden.</p>
                </div>
                <div className="EmiCalculator__TipCard">
                  <h4 className="EmiCalculator__TipTitle">Consider Prepayment</h4>
                  <p className="EmiCalculator__TipText">Making prepayments can significantly reduce your total interest outgo and loan tenure.</p>
                </div>
                <div className="EmiCalculator__TipCard">
                  <h4 className="EmiCalculator__TipTitle">Check Processing Fees</h4>
                  <p className="EmiCalculator__TipText">Factor in processing fees and other charges when calculating the total cost of your loan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
