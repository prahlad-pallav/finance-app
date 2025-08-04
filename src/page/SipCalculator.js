import React, { useState, useEffect } from 'react';
import './SipCalculator.css';

const SipCalculator = () => {
  const [formData, setFormData] = useState({
    monthlyInvestment: 10000,
    timePeriod: 10,
    expectedReturn: 12
  });

  const [results, setResults] = useState({
    totalInvestment: 0,
    totalReturns: 0,
    maturityAmount: 0,
    yearlyBreakdown: []
  });

  const calculateSIP = () => {
    const { monthlyInvestment, timePeriod, expectedReturn } = formData;
    const monthlyRate = expectedReturn / 12 / 100;
    const totalMonths = timePeriod * 12;
    
    // Calculate maturity amount using SIP formula
    const maturityAmount = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    
    const totalInvestment = monthlyInvestment * totalMonths;
    const totalReturns = maturityAmount - totalInvestment;

    // Calculate yearly breakdown
    const yearlyBreakdown = [];
    for (let year = 1; year <= timePeriod; year++) {
      const yearMonths = year * 12;
      const yearAmount = monthlyInvestment * 
        ((Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate) * 
        (1 + monthlyRate);
      const yearInvestment = monthlyInvestment * yearMonths;
      const yearReturns = yearAmount - yearInvestment;
      
      yearlyBreakdown.push({
        year,
        investment: yearInvestment,
        returns: yearReturns,
        total: yearAmount
      });
    }

    setResults({
      totalInvestment: Math.round(totalInvestment),
      totalReturns: Math.round(totalReturns),
      maturityAmount: Math.round(maturityAmount),
      yearlyBreakdown
    });
  };

  useEffect(() => {
    calculateSIP();
  }, [formData]);

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

  return (
    <div className="sip-calculator">
      <div className="container">
        <div className="calculator-header">
          <h1>SIP Calculator</h1>
          <p>Calculate your wealth creation potential with Systematic Investment Plans</p>
        </div>

        <div className="calculator-content">
          {/* Input Section */}
          <div className="input-section">
            <h2>Investment Details</h2>
            <div className="input-grid">
              <div className="input-group">
                <label htmlFor="monthlyInvestment">Monthly Investment (₹)</label>
                <input
                  type="number"
                  id="monthlyInvestment"
                  name="monthlyInvestment"
                  value={formData.monthlyInvestment}
                  onChange={handleInputChange}
                  min="100"
                  step="100"
                />
                <div className="input-slider">
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={formData.monthlyInvestment}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyInvestment: parseInt(e.target.value) }))}
                  />
                  <div className="slider-labels">
                    <span>₹1,000</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="timePeriod">Time Period (Years)</label>
                <input
                  type="number"
                  id="timePeriod"
                  name="timePeriod"
                  value={formData.timePeriod}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                />
                <div className="input-slider">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={formData.timePeriod}
                    onChange={(e) => setFormData(prev => ({ ...prev, timePeriod: parseInt(e.target.value) }))}
                  />
                  <div className="slider-labels">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="expectedReturn">Expected Return Rate (% p.a.)</label>
                <input
                  type="number"
                  id="expectedReturn"
                  name="expectedReturn"
                  value={formData.expectedReturn}
                  onChange={handleInputChange}
                  min="1"
                  max="25"
                  step="0.1"
                />
                <div className="input-slider">
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="0.5"
                    value={formData.expectedReturn}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedReturn: parseFloat(e.target.value) }))}
                  />
                  <div className="slider-labels">
                    <span>5%</span>
                    <span>25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="results-section">
            <h2>Investment Summary</h2>
            <div className="results-grid">
              <div className="result-card">
                <div className="result-icon">💰</div>
                <h3>Total Investment</h3>
                <p className="result-amount">{formatCurrency(results.totalInvestment)}</p>
                <p className="result-description">Amount you will invest</p>
              </div>

              <div className="result-card">
                <div className="result-icon">📈</div>
                <h3>Total Returns</h3>
                <p className="result-amount returns">{formatCurrency(results.totalReturns)}</p>
                <p className="result-description">Wealth gained from returns</p>
              </div>

              <div className="result-card highlight">
                <div className="result-icon">🎯</div>
                <h3>Maturity Amount</h3>
                <p className="result-amount">{formatCurrency(results.maturityAmount)}</p>
                <p className="result-description">Final corpus you will have</p>
              </div>
            </div>

            {/* Yearly Breakdown */}
            <div className="breakdown-section">
              <h3>Yearly Breakdown</h3>
              <div className="breakdown-table">
                <div className="table-header">
                  <span>Year</span>
                  <span>Investment</span>
                  <span>Returns</span>
                  <span>Total Value</span>
                </div>
                <div className="table-body">
                  {results.yearlyBreakdown.map((item, index) => (
                    <div key={index} className="table-row">
                      <span>{item.year}</span>
                      <span>{formatCurrency(item.investment)}</span>
                      <span className="returns">{formatCurrency(item.returns)}</span>
                      <span className="total">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Investment Tips */}
            <div className="tips-section">
              <h3>💡 Investment Tips</h3>
              <div className="tips-grid">
                <div className="tip-card">
                  <h4>Start Early</h4>
                  <p>The earlier you start, the more time your money has to grow through compound interest.</p>
                </div>
                <div className="tip-card">
                  <h4>Stay Consistent</h4>
                  <p>Regular investments, even small amounts, can create significant wealth over time.</p>
                </div>
                <div className="tip-card">
                  <h4>Diversify</h4>
                  <p>Spread your investments across different asset classes to reduce risk.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SipCalculator;
