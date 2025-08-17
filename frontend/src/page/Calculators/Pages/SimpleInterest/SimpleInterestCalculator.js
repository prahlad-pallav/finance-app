import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import './SimpleInterestCalculator.css';

const SimpleInterestCalculator = ({ onBack }) => {
  const [formData, setFormData] = useState({
    principal: 100000,
    rate: 8,
    time: 10
  });

  const [results, setResults] = useState({
    totalInvestment: 0,
    totalInterest: 0,
    maturityAmount: 0,
    yearlyBreakdown: [],
    chartData: [],
    comparisonData: []
  });

  const calculateSimpleInterest = useCallback(() => {
    const { principal, rate, time } = formData;
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    
    if (P && r && t) {
      const I = P * r * t; // Simple Interest = Principal × Rate × Time
      const A = P + I; // Amount = Principal + Interest

      // Calculate yearly breakdown
      const yearlyBreakdown = [];
      const chartData = [];
      const comparisonData = [];
      
      for (let year = 1; year <= t; year++) {
        const yearInterest = P * r * year;
        const yearAmount = P + yearInterest;
        
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

        // Calculate compound interest for comparison
        const compoundAmount = P * Math.pow(1 + r, year);
        const compoundInterest = compoundAmount - P;
        
        comparisonData.push({
          year: `Year ${year}`,
          simple: Math.round(yearAmount),
          compound: Math.round(compoundAmount),
          difference: Math.round(compoundAmount - yearAmount)
        });
      }

      setResults({
        totalInvestment: Math.round(P),
        totalInterest: Math.round(I),
        maturityAmount: Math.round(A),
        yearlyBreakdown,
        chartData,
        comparisonData
      });
    }
  }, [formData]);

  useEffect(() => {
    calculateSimpleInterest();
  }, [calculateSimpleInterest]);

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
        <div className="SimpleInterestCalculator__Tooltip">
          <p className="SimpleInterestCalculator__TooltipLabel">{label}</p>
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
        <div className="SimpleInterestCalculator__Tooltip">
          <p className="SimpleInterestCalculator__TooltipLabel">{label}</p>
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
    <div className="SimpleInterestCalculator">
      <div className="SimpleInterestCalculator__Container">
        <div className="SimpleInterestCalculator__Header">
          <button className="SimpleInterestCalculator__BackButton" onClick={onBack}>← Back</button>
          <h1 className="SimpleInterestCalculator__Title">Simple Interest Calculator</h1>
          <p className="SimpleInterestCalculator__Subtitle">Calculate simple interest and understand how it differs from compound interest</p>
        </div>

        <div className="SimpleInterestCalculator__Content">
          {/* Input Section */}
          <div className="SimpleInterestCalculator__InputSection">
            <h2 className="SimpleInterestCalculator__SectionTitle">Investment Details</h2>
            <div className="SimpleInterestCalculator__InputGrid">
              <div className="SimpleInterestCalculator__InputGroup">
                <label htmlFor="principal" className="SimpleInterestCalculator__Label">Principal Amount (₹)</label>
                <input
                  type="number"
                  id="principal"
                  name="principal"
                  value={formData.principal}
                  onChange={handleInputChange}
                  min="1000"
                  step="1000"
                  className="SimpleInterestCalculator__Input"
                />
                <div className="SimpleInterestCalculator__Slider">
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={formData.principal}
                    onChange={(e) => setFormData(prev => ({ ...prev, principal: parseInt(e.target.value) }))}
                    className="SimpleInterestCalculator__RangeInput"
                  />
                  <div className="SimpleInterestCalculator__SliderLabels">
                    <span>₹10,000</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>
              </div>

              <div className="SimpleInterestCalculator__InputGroup">
                <label htmlFor="rate" className="SimpleInterestCalculator__Label">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  id="rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  min="1"
                  max="25"
                  step="0.1"
                  className="SimpleInterestCalculator__Input"
                />
                <div className="SimpleInterestCalculator__Slider">
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="0.5"
                    value={formData.rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                    className="SimpleInterestCalculator__RangeInput"
                  />
                  <div className="SimpleInterestCalculator__SliderLabels">
                    <span>1%</span>
                    <span>25%</span>
                  </div>
                </div>
              </div>

              <div className="SimpleInterestCalculator__InputGroup">
                <label htmlFor="time" className="SimpleInterestCalculator__Label">Time Period (Years)</label>
                <input
                  type="number"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  className="SimpleInterestCalculator__Input"
                />
                <div className="SimpleInterestCalculator__Slider">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: parseInt(e.target.value) }))}
                    className="SimpleInterestCalculator__RangeInput"
                  />
                  <div className="SimpleInterestCalculator__SliderLabels">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="SimpleInterestCalculator__ResultsSection">
            <h2 className="SimpleInterestCalculator__SectionTitle">Investment Summary</h2>
            <div className="SimpleInterestCalculator__ResultsGrid">
              <div className="SimpleInterestCalculator__ResultCard">
                <div className="SimpleInterestCalculator__ResultIcon">💰</div>
                <h3 className="SimpleInterestCalculator__ResultTitle">Principal Amount</h3>
                <p className="SimpleInterestCalculator__ResultAmount">{formatCurrency(results.totalInvestment)}</p>
                <p className="SimpleInterestCalculator__ResultDescription">Amount you invested</p>
              </div>

              <div className="SimpleInterestCalculator__ResultCard">
                <div className="SimpleInterestCalculator__ResultIcon">📈</div>
                <h3 className="SimpleInterestCalculator__ResultTitle">Total Interest</h3>
                <p className="SimpleInterestCalculator__ResultAmount SimpleInterestCalculator__ResultAmount--interest">{formatCurrency(results.totalInterest)}</p>
                <p className="SimpleInterestCalculator__ResultDescription">Interest earned</p>
              </div>

              <div className="SimpleInterestCalculator__ResultCard SimpleInterestCalculator__ResultCard--highlight">
                <div className="SimpleInterestCalculator__ResultIcon">🎯</div>
                <h3 className="SimpleInterestCalculator__ResultTitle">Final Amount</h3>
                <p className="SimpleInterestCalculator__ResultAmount">{formatCurrency(results.maturityAmount)}</p>
                <p className="SimpleInterestCalculator__ResultDescription">Total amount you will have</p>
              </div>
            </div>

            {/* Growth Chart */}
            {results.chartData.length > 0 && (
              <div className="SimpleInterestCalculator__ChartSection">
                <h3 className="SimpleInterestCalculator__ChartTitle">Investment Growth Over Time</h3>
                <div className="SimpleInterestCalculator__ChartContainer">
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
              <div className="SimpleInterestCalculator__ChartSection">
                <h3 className="SimpleInterestCalculator__ChartTitle">Simple vs Compound Interest Comparison</h3>
                <div className="SimpleInterestCalculator__ChartContainer">
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
                      <Bar dataKey="simple" fill="#ffc107" name="Simple Interest" />
                      <Bar dataKey="compound" fill="#28a745" name="Compound Interest" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Investment Summary */}
            <div className="SimpleInterestCalculator__SummarySection">
              <h3 className="SimpleInterestCalculator__SummaryTitle">Calculation Summary</h3>
              <div className="SimpleInterestCalculator__SummaryGrid">
                <div className="SimpleInterestCalculator__SummaryCard">
                  <span className="SimpleInterestCalculator__SummaryLabel">Principal Amount</span>
                  <span className="SimpleInterestCalculator__SummaryValue">{formatCurrency(formData.principal)}</span>
                </div>
                <div className="SimpleInterestCalculator__SummaryCard">
                  <span className="SimpleInterestCalculator__SummaryLabel">Interest Rate</span>
                  <span className="SimpleInterestCalculator__SummaryValue">{formData.rate}% p.a.</span>
                </div>
                <div className="SimpleInterestCalculator__SummaryCard">
                  <span className="SimpleInterestCalculator__SummaryLabel">Time Period</span>
                  <span className="SimpleInterestCalculator__SummaryValue">{formData.time} Years</span>
                </div>
                <div className="SimpleInterestCalculator__SummaryCard">
                  <span className="SimpleInterestCalculator__SummaryLabel">Interest Type</span>
                  <span className="SimpleInterestCalculator__SummaryValue">Simple Interest</span>
                </div>
              </div>
            </div>

            {/* Yearly Breakdown */}
            <div className="SimpleInterestCalculator__BreakdownSection">
              <h3 className="SimpleInterestCalculator__BreakdownTitle">Yearly Breakdown</h3>
              <div className="SimpleInterestCalculator__BreakdownTable">
                <div className="SimpleInterestCalculator__TableHeader">
                  <span>Year</span>
                  <span>Principal</span>
                  <span>Interest</span>
                  <span>Total Amount</span>
                </div>
                <div className="SimpleInterestCalculator__TableBody">
                  {results.yearlyBreakdown.map((item, index) => (
                    <div key={index} className="SimpleInterestCalculator__TableRow">
                      <span>{item.year}</span>
                      <span>{formatCurrency(item.principal)}</span>
                      <span className="SimpleInterestCalculator__TableInterest">{formatCurrency(item.interest)}</span>
                      <span className="SimpleInterestCalculator__TableTotal">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Investment Tips */}
            <div className="SimpleInterestCalculator__TipsSection">
              <h3 className="SimpleInterestCalculator__TipsTitle">💡 Simple Interest Tips</h3>
              <div className="SimpleInterestCalculator__TipsGrid">
                <div className="SimpleInterestCalculator__TipCard">
                  <h4 className="SimpleInterestCalculator__TipTitle">Understanding Simple Interest</h4>
                  <p className="SimpleInterestCalculator__TipText">Simple interest is calculated only on the principal amount, not on accumulated interest.</p>
                </div>
                <div className="SimpleInterestCalculator__TipCard">
                  <h4 className="SimpleInterestCalculator__TipTitle">When to Use</h4>
                  <p className="SimpleInterestCalculator__TipText">Simple interest is commonly used for short-term loans, car loans, and some personal loans.</p>
                </div>
                <div className="SimpleInterestCalculator__TipCard">
                  <h4 className="SimpleInterestCalculator__TipTitle">Comparison with Compound</h4>
                  <p className="SimpleInterestCalculator__TipText">Simple interest typically yields lower returns compared to compound interest over long periods.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleInterestCalculator;
