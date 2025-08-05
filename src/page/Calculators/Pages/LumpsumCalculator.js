import React, { useState, useEffect, useCallback } from 'react';
import './LumpsumCalculator.css';

const LumpsumCalculator = ({ onBack }) => {
  const [formData, setFormData] = useState({
    principal: 100000,
    expectedReturn: 12,
    timePeriod: 5,
    investmentType: 'mutual-fund',
    riskLevel: 'moderate'
  });

  const [results, setResults] = useState({
    totalInvestment: 0,
    totalReturns: 0,
    maturityAmount: 0,
    yearlyBreakdown: []
  });

  const calculateLumpSum = useCallback(() => {
    const { principal, expectedReturn, timePeriod } = formData;
    const p = parseFloat(principal);
    const rate = parseFloat(expectedReturn) / 100;
    const time = parseFloat(timePeriod);
    
    if (p && rate && time) {
      const futureValue = p * Math.pow(1 + rate, time);
      const totalReturns = futureValue - p;

      // Calculate yearly breakdown
      const yearlyBreakdown = [];
      for (let year = 1; year <= timePeriod; year++) {
        const yearValue = p * Math.pow(1 + rate, year);
        const yearReturns = yearValue - p;
        
        yearlyBreakdown.push({
          year,
          investment: p,
          returns: yearReturns,
          total: yearValue
        });
      }

      setResults({
        totalInvestment: Math.round(p),
        totalReturns: Math.round(totalReturns),
        maturityAmount: Math.round(futureValue),
        yearlyBreakdown
      });
    }
  }, [formData]);

  useEffect(() => {
    calculateLumpSum();
  }, [calculateLumpSum]);

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

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return '#28a745';
      case 'moderate': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="LumpsumCalculator">
      <div className="LumpsumCalculator__Container">
        <div className="LumpsumCalculator__Header">
          <button className="LumpsumCalculator__BackButton" onClick={onBack}>← Back</button>
          <h1 className="LumpsumCalculator__Title">Lump Sum Calculator</h1>
          <p className="LumpsumCalculator__Subtitle">Calculate returns on one-time investments and plan your wealth creation</p>
        </div>

        <div className="LumpsumCalculator__Content">
          {/* Input Section */}
          <div className="LumpsumCalculator__InputSection">
            <h2 className="LumpsumCalculator__SectionTitle">Investment Details</h2>
            <div className="LumpsumCalculator__InputGrid">
              <div className="LumpsumCalculator__InputGroup">
                <label htmlFor="principal" className="LumpsumCalculator__Label">Principal Amount (₹)</label>
                <input
                  type="number"
                  id="principal"
                  name="principal"
                  value={formData.principal}
                  onChange={handleInputChange}
                  min="1000"
                  step="1000"
                  className="LumpsumCalculator__Input"
                />
                <div className="LumpsumCalculator__Slider">
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={formData.principal}
                    onChange={(e) => setFormData(prev => ({ ...prev, principal: parseInt(e.target.value) }))}
                    className="LumpsumCalculator__RangeInput"
                  />
                  <div className="LumpsumCalculator__SliderLabels">
                    <span>₹10,000</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>
              </div>

              <div className="LumpsumCalculator__InputGroup">
                <label htmlFor="expectedReturn" className="LumpsumCalculator__Label">Expected Return Rate (% p.a.)</label>
                <input
                  type="number"
                  id="expectedReturn"
                  name="expectedReturn"
                  value={formData.expectedReturn}
                  onChange={handleInputChange}
                  min="1"
                  max="25"
                  step="0.5"
                  className="LumpsumCalculator__Input"
                />
                <div className="LumpsumCalculator__Slider">
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="0.5"
                    value={formData.expectedReturn}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedReturn: parseFloat(e.target.value) }))}
                    className="LumpsumCalculator__RangeInput"
                  />
                  <div className="LumpsumCalculator__SliderLabels">
                    <span>5%</span>
                    <span>25%</span>
                  </div>
                </div>
              </div>

              <div className="LumpsumCalculator__InputGroup">
                <label htmlFor="timePeriod" className="LumpsumCalculator__Label">Investment Period (Years)</label>
                <input
                  type="number"
                  id="timePeriod"
                  name="timePeriod"
                  value={formData.timePeriod}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  className="LumpsumCalculator__Input"
                />
                <div className="LumpsumCalculator__Slider">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={formData.timePeriod}
                    onChange={(e) => setFormData(prev => ({ ...prev, timePeriod: parseInt(e.target.value) }))}
                    className="LumpsumCalculator__RangeInput"
                  />
                  <div className="LumpsumCalculator__SliderLabels">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>

              <div className="LumpsumCalculator__InputGroup">
                <label htmlFor="investmentType" className="LumpsumCalculator__Label">Investment Type</label>
                <select
                  id="investmentType"
                  name="investmentType"
                  value={formData.investmentType}
                  onChange={(e) => setFormData(prev => ({ ...prev, investmentType: e.target.value }))}
                  className="LumpsumCalculator__Select"
                >
                  <option value="mutual-fund">Mutual Fund</option>
                  <option value="fixed-deposit">Fixed Deposit</option>
                  <option value="equity-shares">Equity Shares</option>
                  <option value="bonds">Bonds</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="gold">Gold</option>
                </select>
              </div>

              <div className="LumpsumCalculator__InputGroup">
                <label htmlFor="riskLevel" className="LumpsumCalculator__Label">Risk Level</label>
                <select
                  id="riskLevel"
                  name="riskLevel"
                  value={formData.riskLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, riskLevel: e.target.value }))}
                  className="LumpsumCalculator__Select"
                >
                  <option value="low">Low Risk</option>
                  <option value="moderate">Moderate Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="LumpsumCalculator__ResultsSection">
            <h2 className="LumpsumCalculator__SectionTitle">Investment Summary</h2>
            <div className="LumpsumCalculator__ResultsGrid">
              <div className="LumpsumCalculator__ResultCard">
                <div className="LumpsumCalculator__ResultIcon">💰</div>
                <h3 className="LumpsumCalculator__ResultTitle">Total Investment</h3>
                <p className="LumpsumCalculator__ResultAmount">{formatCurrency(results.totalInvestment)}</p>
                <p className="LumpsumCalculator__ResultDescription">Amount you will invest</p>
              </div>

              <div className="LumpsumCalculator__ResultCard">
                <div className="LumpsumCalculator__ResultIcon">📈</div>
                <h3 className="LumpsumCalculator__ResultTitle">Total Returns</h3>
                <p className="LumpsumCalculator__ResultAmount LumpsumCalculator__ResultAmount--returns">{formatCurrency(results.totalReturns)}</p>
                <p className="LumpsumCalculator__ResultDescription">Wealth gained from returns</p>
              </div>

              <div className="LumpsumCalculator__ResultCard LumpsumCalculator__ResultCard--highlight">
                <div className="LumpsumCalculator__ResultIcon">🎯</div>
                <h3 className="LumpsumCalculator__ResultTitle">Maturity Amount</h3>
                <p className="LumpsumCalculator__ResultAmount">{formatCurrency(results.maturityAmount)}</p>
                <p className="LumpsumCalculator__ResultDescription">Final corpus you will have</p>
              </div>
            </div>

            {/* Risk Indicator */}
            <div className="LumpsumCalculator__RiskSection">
              <h3 className="LumpsumCalculator__RiskTitle">Risk Assessment</h3>
              <div className="LumpsumCalculator__RiskIndicator">
                <div 
                  className="LumpsumCalculator__RiskBar"
                  style={{ backgroundColor: getRiskColor(formData.riskLevel) }}
                >
                  <span className="LumpsumCalculator__RiskLabel">{formData.riskLevel.toUpperCase()}</span>
                </div>
                <p className="LumpsumCalculator__RiskDescription">
                  {formData.riskLevel === 'low' && 'Conservative investment with stable returns'}
                  {formData.riskLevel === 'moderate' && 'Balanced approach with moderate risk and returns'}
                  {formData.riskLevel === 'high' && 'Aggressive investment with potential for higher returns'}
                </p>
              </div>
            </div>

            {/* Yearly Breakdown */}
            <div className="LumpsumCalculator__BreakdownSection">
              <h3 className="LumpsumCalculator__BreakdownTitle">Yearly Breakdown</h3>
              <div className="LumpsumCalculator__BreakdownTable">
                <div className="LumpsumCalculator__TableHeader">
                  <span>Year</span>
                  <span>Investment</span>
                  <span>Returns</span>
                  <span>Total Value</span>
                </div>
                <div className="LumpsumCalculator__TableBody">
                  {results.yearlyBreakdown.map((item, index) => (
                    <div key={index} className="LumpsumCalculator__TableRow">
                      <span>{item.year}</span>
                      <span>{formatCurrency(item.investment)}</span>
                      <span className="LumpsumCalculator__TableReturns">{formatCurrency(item.returns)}</span>
                      <span className="LumpsumCalculator__TableTotal">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Investment Tips */}
            <div className="LumpsumCalculator__TipsSection">
              <h3 className="LumpsumCalculator__TipsTitle">💡 Investment Tips</h3>
              <div className="LumpsumCalculator__TipsGrid">
                <div className="LumpsumCalculator__TipCard">
                  <h4 className="LumpsumCalculator__TipTitle">Diversify Your Portfolio</h4>
                  <p className="LumpsumCalculator__TipText">Spread your investments across different asset classes to reduce risk and maximize returns.</p>
                </div>
                <div className="LumpsumCalculator__TipCard">
                  <h4 className="LumpsumCalculator__TipTitle">Consider Tax Implications</h4>
                  <p className="LumpsumCalculator__TipText">Understand the tax implications of your investment choices to optimize your after-tax returns.</p>
                </div>
                <div className="LumpsumCalculator__TipCard">
                  <h4 className="LumpsumCalculator__TipTitle">Review Regularly</h4>
                  <p className="LumpsumCalculator__TipText">Monitor your investments periodically and rebalance your portfolio as needed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LumpsumCalculator;
