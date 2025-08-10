import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import './CompoundInterestCalculator.css';

const CompoundInterestCalculator = ({ onBack }) => {
  const [formData, setFormData] = useState({
    principal: 100000,
    rate: 8,
    time: 10,
    compoundFrequency: 'annually'
  });

  const [results, setResults] = useState({
    totalInvestment: 0,
    totalInterest: 0,
    maturityAmount: 0,
    yearlyBreakdown: [],
    chartData: [],
    comparisonData: []
  });

  const calculateCompoundInterest = useCallback(() => {
    const { principal, rate, time, compoundFrequency } = formData;
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    
    if (P && r && t) {
      let n; // number of times interest is compounded per year
      let frequencyLabel;
      
      switch (compoundFrequency) {
        case 'annually':
          n = 1;
          frequencyLabel = 'Annually';
          break;
        case 'semi-annually':
          n = 2;
          frequencyLabel = 'Semi-Annually';
          break;
        case 'quarterly':
          n = 4;
          frequencyLabel = 'Quarterly';
          break;
        case 'monthly':
          n = 12;
          frequencyLabel = 'Monthly';
          break;
        case 'daily':
          n = 365;
          frequencyLabel = 'Daily';
          break;
        default:
          n = 1;
          frequencyLabel = 'Annually';
      }
      
      const A = P * Math.pow(1 + r/n, n * t);
      const totalInterest = A - P;

      // Calculate yearly breakdown
      const yearlyBreakdown = [];
      const chartData = [];
      const comparisonData = [];
      
      for (let year = 1; year <= t; year++) {
        const yearAmount = P * Math.pow(1 + r/n, n * year);
        const yearInterest = yearAmount - P;
        
        yearlyBreakdown.push({
          year,
          principal: P,
          interest: yearInterest,
          total: yearAmount
        });

        chartData.push({
          year: `Year ${year}`,
          principal: Math.round(P),
          interest: Math.round(yearInterest),
          total: Math.round(yearAmount)
        });

        // Calculate simple interest for comparison
        const simpleInterest = P * r * year;
        const simpleTotal = P + simpleInterest;
        
        comparisonData.push({
          year: `Year ${year}`,
          compound: Math.round(yearAmount),
          simple: Math.round(simpleTotal),
          difference: Math.round(yearAmount - simpleTotal)
        });
      }

      setResults({
        totalInvestment: Math.round(P),
        totalInterest: Math.round(totalInterest),
        maturityAmount: Math.round(A),
        yearlyBreakdown,
        chartData,
        comparisonData,
        frequencyLabel
      });
    }
  }, [formData]);

  useEffect(() => {
    calculateCompoundInterest();
  }, [calculateCompoundInterest]);

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="CompoundInterestCalculator__Tooltip">
          <p className="CompoundInterestCalculator__TooltipLabel">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ComparisonTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="CompoundInterestCalculator__Tooltip">
          <p className="CompoundInterestCalculator__TooltipLabel">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="CompoundInterestCalculator">
      <div className="CompoundInterestCalculator__Container">
        <div className="CompoundInterestCalculator__Header">
          <button className="CompoundInterestCalculator__BackButton" onClick={onBack}>← Back</button>
          <h1 className="CompoundInterestCalculator__Title">Compound Interest Calculator</h1>
          <p className="CompoundInterestCalculator__Subtitle">Calculate how your money grows with compound interest over time</p>
        </div>

        <div className="CompoundInterestCalculator__Content">
          {/* Input Section */}
          <div className="CompoundInterestCalculator__InputSection">
            <h2 className="CompoundInterestCalculator__SectionTitle">Investment Details</h2>
            <div className="CompoundInterestCalculator__InputGrid">
              <div className="CompoundInterestCalculator__InputGroup">
                <label htmlFor="principal" className="CompoundInterestCalculator__Label">Principal Amount (₹)</label>
                <input
                  type="number"
                  id="principal"
                  name="principal"
                  value={formData.principal}
                  onChange={handleInputChange}
                  min="1000"
                  step="1000"
                  className="CompoundInterestCalculator__Input"
                />
                <div className="CompoundInterestCalculator__Slider">
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={formData.principal}
                    onChange={(e) => setFormData(prev => ({ ...prev, principal: parseInt(e.target.value) }))}
                    className="CompoundInterestCalculator__RangeInput"
                  />
                  <div className="CompoundInterestCalculator__SliderLabels">
                    <span>₹10,000</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>
              </div>

              <div className="CompoundInterestCalculator__InputGroup">
                <label htmlFor="rate" className="CompoundInterestCalculator__Label">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  id="rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  min="1"
                  max="25"
                  step="0.1"
                  className="CompoundInterestCalculator__Input"
                />
                <div className="CompoundInterestCalculator__Slider">
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="0.5"
                    value={formData.rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                    className="CompoundInterestCalculator__RangeInput"
                  />
                  <div className="CompoundInterestCalculator__SliderLabels">
                    <span>1%</span>
                    <span>25%</span>
                  </div>
                </div>
              </div>

              <div className="CompoundInterestCalculator__InputGroup">
                <label htmlFor="time" className="CompoundInterestCalculator__Label">Time Period (Years)</label>
                <input
                  type="number"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  className="CompoundInterestCalculator__Input"
                />
                <div className="CompoundInterestCalculator__Slider">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: parseInt(e.target.value) }))}
                    className="CompoundInterestCalculator__RangeInput"
                  />
                  <div className="CompoundInterestCalculator__SliderLabels">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>

              <div className="CompoundInterestCalculator__InputGroup">
                <label htmlFor="compoundFrequency" className="CompoundInterestCalculator__Label">Compounding Frequency</label>
                <select
                  id="compoundFrequency"
                  name="compoundFrequency"
                  value={formData.compoundFrequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, compoundFrequency: e.target.value }))}
                  className="CompoundInterestCalculator__Select"
                >
                  <option value="annually">Annually</option>
                  <option value="semi-annually">Semi-Annually</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="CompoundInterestCalculator__ResultsSection">
            <h2 className="CompoundInterestCalculator__SectionTitle">Investment Summary</h2>
            <div className="CompoundInterestCalculator__ResultsGrid">
              <div className="CompoundInterestCalculator__ResultCard">
                <div className="CompoundInterestCalculator__ResultIcon">💰</div>
                <h3 className="CompoundInterestCalculator__ResultTitle">Principal Amount</h3>
                <p className="CompoundInterestCalculator__ResultAmount">{formatCurrency(results.totalInvestment)}</p>
                <p className="CompoundInterestCalculator__ResultDescription">Amount you invested</p>
              </div>

              <div className="CompoundInterestCalculator__ResultCard">
                <div className="CompoundInterestCalculator__ResultIcon">📈</div>
                <h3 className="CompoundInterestCalculator__ResultTitle">Total Interest</h3>
                <p className="CompoundInterestCalculator__ResultAmount CompoundInterestCalculator__ResultAmount--interest">{formatCurrency(results.totalInterest)}</p>
                <p className="CompoundInterestCalculator__ResultDescription">Interest earned</p>
              </div>

              <div className="CompoundInterestCalculator__ResultCard CompoundInterestCalculator__ResultCard--highlight">
                <div className="CompoundInterestCalculator__ResultIcon">🎯</div>
                <h3 className="CompoundInterestCalculator__ResultTitle">Final Amount</h3>
                <p className="CompoundInterestCalculator__ResultAmount">{formatCurrency(results.maturityAmount)}</p>
                <p className="CompoundInterestCalculator__ResultDescription">Total amount you will have</p>
              </div>
            </div>

            {/* Growth Chart */}
            {results.chartData.length > 0 && (
              <div className="CompoundInterestCalculator__ChartSection">
                <h3 className="CompoundInterestCalculator__ChartTitle">Investment Growth Over Time</h3>
                <div className="CompoundInterestCalculator__ChartContainer">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={results.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis 
                        tickFormatter={(value) => `${(value / 100000).toFixed(1)}L`}
                        label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="principal" 
                        stroke="#007bff" 
                        strokeWidth={3}
                        name="Principal"
                        dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#28a745" 
                        strokeWidth={3}
                        name="Total Amount"
                        dot={{ fill: '#28a745', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Comparison Chart */}
            {results.comparisonData.length > 0 && (
              <div className="CompoundInterestCalculator__ChartSection">
                <h3 className="CompoundInterestCalculator__ChartTitle">Compound vs Simple Interest Comparison</h3>
                <div className="CompoundInterestCalculator__ChartContainer">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={results.comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis 
                        tickFormatter={(value) => `${(value / 100000).toFixed(1)}L`}
                        label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip content={<ComparisonTooltip />} />
                      <Legend />
                      <Bar dataKey="compound" fill="#28a745" name="Compound Interest" />
                      <Bar dataKey="simple" fill="#ffc107" name="Simple Interest" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Investment Summary */}
            <div className="CompoundInterestCalculator__SummarySection">
              <h3 className="CompoundInterestCalculator__SummaryTitle">Calculation Summary</h3>
              <div className="CompoundInterestCalculator__SummaryGrid">
                <div className="CompoundInterestCalculator__SummaryCard">
                  <span className="CompoundInterestCalculator__SummaryLabel">Principal Amount</span>
                  <span className="CompoundInterestCalculator__SummaryValue">{formatCurrency(formData.principal)}</span>
                </div>
                <div className="CompoundInterestCalculator__SummaryCard">
                  <span className="CompoundInterestCalculator__SummaryLabel">Interest Rate</span>
                  <span className="CompoundInterestCalculator__SummaryValue">{formData.rate}% p.a.</span>
                </div>
                <div className="CompoundInterestCalculator__SummaryCard">
                  <span className="CompoundInterestCalculator__SummaryLabel">Time Period</span>
                  <span className="CompoundInterestCalculator__SummaryValue">{formData.time} Years</span>
                </div>
                <div className="CompoundInterestCalculator__SummaryCard">
                  <span className="CompoundInterestCalculator__SummaryLabel">Compounding</span>
                  <span className="CompoundInterestCalculator__SummaryValue">{results.frequencyLabel}</span>
                </div>
              </div>
            </div>

            {/* Yearly Breakdown */}
            <div className="CompoundInterestCalculator__BreakdownSection">
              <h3 className="CompoundInterestCalculator__BreakdownTitle">Yearly Breakdown</h3>
              <div className="CompoundInterestCalculator__BreakdownTable">
                <div className="CompoundInterestCalculator__TableHeader">
                  <span>Year</span>
                  <span>Principal</span>
                  <span>Interest</span>
                  <span>Total Amount</span>
                </div>
                <div className="CompoundInterestCalculator__TableBody">
                  {results.yearlyBreakdown.map((item, index) => (
                    <div key={index} className="CompoundInterestCalculator__TableRow">
                      <span>{item.year}</span>
                      <span>{formatCurrency(item.principal)}</span>
                      <span className="CompoundInterestCalculator__TableInterest">{formatCurrency(item.interest)}</span>
                      <span className="CompoundInterestCalculator__TableTotal">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Investment Tips */}
            <div className="CompoundInterestCalculator__TipsSection">
              <h3 className="CompoundInterestCalculator__TipsTitle">💡 Compound Interest Tips</h3>
              <div className="CompoundInterestCalculator__TipsGrid">
                <div className="CompoundInterestCalculator__TipCard">
                  <h4 className="CompoundInterestCalculator__TipTitle">Start Early</h4>
                  <p className="CompoundInterestCalculator__TipText">The earlier you invest, the more time compound interest has to work in your favor.</p>
                </div>
                <div className="CompoundInterestCalculator__TipCard">
                  <h4 className="CompoundInterestCalculator__TipTitle">Higher Frequency</h4>
                  <p className="CompoundInterestCalculator__TipText">More frequent compounding (monthly/daily) generally yields higher returns than annual compounding.</p>
                </div>
                <div className="CompoundInterestCalculator__TipCard">
                  <h4 className="CompoundInterestCalculator__TipTitle">Reinvest Earnings</h4>
                  <p className="CompoundInterestCalculator__TipText">Let your interest earnings compound by reinvesting them rather than withdrawing them.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
