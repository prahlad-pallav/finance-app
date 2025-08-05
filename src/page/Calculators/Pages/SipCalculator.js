import React, { useState, useEffect, useCallback } from 'react';
import './SipCalculator.css';

const SipCalculator = ({ onBack }) => {
  const [formData, setFormData] = useState({
    investmentAmount: 10000,
    expectedReturn: 12,
    tenure: 10,
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0]
  });

  const [results, setResults] = useState({
    totalInvestment: 0,
    totalReturns: 0,
    maturityAmount: 0,
    yearlyBreakdown: []
  });

  const calculateSIP = useCallback(() => {
    const { investmentAmount, expectedReturn, tenure, frequency } = formData;
    const monthlyInvestment = parseFloat(investmentAmount);
    const rate = parseFloat(expectedReturn) / 100;
    const time = parseFloat(tenure);
    
    if (monthlyInvestment && rate && time) {
      let investmentPerPeriod, periodsPerYear, totalPeriods;
      
      // Adjust for investment frequency
      switch (frequency) {
        case 'monthly':
          investmentPerPeriod = monthlyInvestment;
          periodsPerYear = 12;
          totalPeriods = time * 12;
          break;
        case 'weekly':
          investmentPerPeriod = monthlyInvestment / 4;
          periodsPerYear = 52;
          totalPeriods = time * 52;
          break;
        case 'quarterly':
          investmentPerPeriod = monthlyInvestment * 3;
          periodsPerYear = 4;
          totalPeriods = time * 4;
          break;
        default:
          investmentPerPeriod = monthlyInvestment;
          periodsPerYear = 12;
          totalPeriods = time * 12;
      }
      
      const periodRate = rate / periodsPerYear;
      const maturityAmount = investmentPerPeriod * 
        ((Math.pow(1 + periodRate, totalPeriods) - 1) / periodRate) * 
        (1 + periodRate);
      
      const totalInvestment = investmentPerPeriod * totalPeriods;
      const totalReturns = maturityAmount - totalInvestment;

      // Calculate yearly breakdown
      const yearlyBreakdown = [];
      for (let year = 1; year <= time; year++) {
        const yearPeriods = year * periodsPerYear;
        const yearAmount = investmentPerPeriod * 
          ((Math.pow(1 + periodRate, yearPeriods) - 1) / periodRate) * 
          (1 + periodRate);
        const yearInvestment = investmentPerPeriod * yearPeriods;
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
    }
  }, [formData]);

  useEffect(() => {
    calculateSIP();
  }, [calculateSIP]);

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

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'monthly': return 'Monthly';
      case 'weekly': return 'Weekly';
      case 'quarterly': return 'Quarterly';
      default: return 'Monthly';
    }
  };

  return (
    <div className="SipCalculator">
      <div className="SipCalculator__Container">
        <div className="SipCalculator__Header">
          <button className="SipCalculator__BackButton" onClick={onBack}>← Back</button>
          <h1 className="SipCalculator__Title">SIP Calculator</h1>
          <p className="SipCalculator__Subtitle">Calculate your wealth creation potential with Systematic Investment Plans</p>
        </div>

        <div className="SipCalculator__Content">
          {/* Input Section */}
          <div className="SipCalculator__InputSection">
            <h2 className="SipCalculator__SectionTitle">Investment Details</h2>
            <div className="SipCalculator__InputGrid">
              <div className="SipCalculator__InputGroup">
                <label htmlFor="investmentAmount" className="SipCalculator__Label">Investment Amount (₹)</label>
                <input
                  type="number"
                  id="investmentAmount"
                  name="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={handleInputChange}
                  min="100"
                  step="100"
                  className="SipCalculator__Input"
                />
                <div className="SipCalculator__Slider">
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={formData.investmentAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, investmentAmount: parseInt(e.target.value) }))}
                    className="SipCalculator__RangeInput"
                  />
                  <div className="SipCalculator__SliderLabels">
                    <span>₹1,000</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>
                <div className="SipCalculator__AmountPreview">
                  {getFrequencyLabel(formData.frequency)} Investment: {formatCurrency(formData.investmentAmount)}
                </div>
              </div>

              <div className="SipCalculator__InputGroup">
                <label htmlFor="frequency" className="SipCalculator__Label">Investment Frequency</label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="SipCalculator__Select"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div className="SipCalculator__InputGroup">
                <label htmlFor="expectedReturn" className="SipCalculator__Label">Expected Return Rate (% p.a.)</label>
                <input
                  type="number"
                  id="expectedReturn"
                  name="expectedReturn"
                  value={formData.expectedReturn}
                  onChange={handleInputChange}
                  min="1"
                  max="25"
                  step="0.1"
                  className="SipCalculator__Input"
                />
                <div className="SipCalculator__Slider">
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="0.5"
                    value={formData.expectedReturn}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedReturn: parseFloat(e.target.value) }))}
                    className="SipCalculator__RangeInput"
                  />
                  <div className="SipCalculator__SliderLabels">
                    <span>5%</span>
                    <span>25%</span>
                  </div>
                </div>
              </div>

              <div className="SipCalculator__InputGroup">
                <label htmlFor="tenure" className="SipCalculator__Label">Investment Tenure (Years)</label>
                <input
                  type="number"
                  id="tenure"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  className="SipCalculator__Input"
                />
                <div className="SipCalculator__Slider">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={formData.tenure}
                    onChange={(e) => setFormData(prev => ({ ...prev, tenure: parseInt(e.target.value) }))}
                    className="SipCalculator__RangeInput"
                  />
                  <div className="SipCalculator__SliderLabels">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>

              <div className="SipCalculator__InputGroup">
                <label htmlFor="startDate" className="SipCalculator__Label">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="SipCalculator__Input"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="SipCalculator__ResultsSection">
            <h2 className="SipCalculator__SectionTitle">Investment Summary</h2>
            <div className="SipCalculator__ResultsGrid">
              <div className="SipCalculator__ResultCard">
                <div className="SipCalculator__ResultIcon">💰</div>
                <h3 className="SipCalculator__ResultTitle">Total Investment</h3>
                <p className="SipCalculator__ResultAmount">{formatCurrency(results.totalInvestment)}</p>
                <p className="SipCalculator__ResultDescription">Amount you will invest</p>
              </div>

              <div className="SipCalculator__ResultCard">
                <div className="SipCalculator__ResultIcon">📈</div>
                <h3 className="SipCalculator__ResultTitle">Total Returns</h3>
                <p className="SipCalculator__ResultAmount SipCalculator__ResultAmount--returns">{formatCurrency(results.totalReturns)}</p>
                <p className="SipCalculator__ResultDescription">Wealth gained from returns</p>
              </div>

              <div className="SipCalculator__ResultCard SipCalculator__ResultCard--highlight">
                <div className="SipCalculator__ResultIcon">🎯</div>
                <h3 className="SipCalculator__ResultTitle">Maturity Amount</h3>
                <p className="SipCalculator__ResultAmount">{formatCurrency(results.maturityAmount)}</p>
                <p className="SipCalculator__ResultDescription">Final corpus you will have</p>
              </div>
            </div>

            {/* Investment Summary */}
            <div className="SipCalculator__SummarySection">
              <h3 className="SipCalculator__SummaryTitle">SIP Summary</h3>
              <div className="SipCalculator__SummaryGrid">
                <div className="SipCalculator__SummaryCard">
                  <span className="SipCalculator__SummaryLabel">Investment Frequency</span>
                  <span className="SipCalculator__SummaryValue">{getFrequencyLabel(formData.frequency)}</span>
                </div>
                <div className="SipCalculator__SummaryCard">
                  <span className="SipCalculator__SummaryLabel">Per Period Investment</span>
                  <span className="SipCalculator__SummaryValue">{formatCurrency(formData.investmentAmount)}</span>
                </div>
                <div className="SipCalculator__SummaryCard">
                  <span className="SipCalculator__SummaryLabel">Expected Return</span>
                  <span className="SipCalculator__SummaryValue">{formData.expectedReturn}% p.a.</span>
                </div>
                <div className="SipCalculator__SummaryCard">
                  <span className="SipCalculator__SummaryLabel">Investment Period</span>
                  <span className="SipCalculator__SummaryValue">{formData.tenure} Years</span>
                </div>
              </div>
            </div>

            {/* Yearly Breakdown */}
            <div className="SipCalculator__BreakdownSection">
              <h3 className="SipCalculator__BreakdownTitle">Yearly Breakdown</h3>
              <div className="SipCalculator__BreakdownTable">
                <div className="SipCalculator__TableHeader">
                  <span>Year</span>
                  <span>Investment</span>
                  <span>Returns</span>
                  <span>Total Value</span>
                </div>
                <div className="SipCalculator__TableBody">
                  {results.yearlyBreakdown.map((item, index) => (
                    <div key={index} className="SipCalculator__TableRow">
                      <span>{item.year}</span>
                      <span>{formatCurrency(item.investment)}</span>
                      <span className="SipCalculator__TableReturns">{formatCurrency(item.returns)}</span>
                      <span className="SipCalculator__TableTotal">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Investment Tips */}
            <div className="SipCalculator__TipsSection">
              <h3 className="SipCalculator__TipsTitle">💡 Investment Tips</h3>
              <div className="SipCalculator__TipsGrid">
                <div className="SipCalculator__TipCard">
                  <h4 className="SipCalculator__TipTitle">Start Early</h4>
                  <p className="SipCalculator__TipText">The earlier you start, the more time your money has to grow through compound interest.</p>
                </div>
                <div className="SipCalculator__TipCard">
                  <h4 className="SipCalculator__TipTitle">Stay Consistent</h4>
                  <p className="SipCalculator__TipText">Regular investments, even small amounts, can create significant wealth over time.</p>
                </div>
                <div className="SipCalculator__TipCard">
                  <h4 className="SipCalculator__TipTitle">Diversify</h4>
                  <p className="SipCalculator__TipText">Spread your investments across different asset classes to reduce risk.</p>
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
