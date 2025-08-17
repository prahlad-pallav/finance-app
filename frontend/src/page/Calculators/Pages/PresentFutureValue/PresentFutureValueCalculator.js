import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import './PresentFutureValueCalculator.css';

const PresentFutureValueCalculator = ({ onBack }) => {
  const [formData, setFormData] = useState({
    amount: 100000,
    rate: 8,
    time: 10,
    calculationType: 'future-value', // 'future-value' or 'present-value'
    compoundingFrequency: 'annually'
  });

  const [results, setResults] = useState({
    presentValue: 0,
    futureValue: 0,
    yearlyBreakdown: [],
    chartData: [],
    comparisonData: []
  });

  const calculateValues = useCallback(() => {
    const { amount, rate, time, calculationType, compoundingFrequency } = formData;
    const P = parseFloat(amount);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    
    if (P && r && t) {
      let n; // number of times interest is compounded per year
      let frequencyLabel;
      
      switch (compoundingFrequency) {
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

      let presentValue, futureValue;
      
      if (calculationType === 'future-value') {
        // Calculate Future Value from Present Value
        futureValue = P * Math.pow(1 + r/n, n * t);
        presentValue = P;
      } else {
        // Calculate Present Value from Future Value
        presentValue = P / Math.pow(1 + r/n, n * t);
        futureValue = P;
      }

      // Calculate yearly breakdown
      const yearlyBreakdown = [];
      const chartData = [];
      const comparisonData = [];
      
      for (let year = 0; year <= t; year++) {
        let yearPresentValue, yearFutureValue;
        
        if (calculationType === 'future-value') {
          yearPresentValue = presentValue;
          yearFutureValue = presentValue * Math.pow(1 + r/n, n * year);
        } else {
          yearFutureValue = futureValue;
          yearPresentValue = futureValue / Math.pow(1 + r/n, n * year);
        }
        
        yearlyBreakdown.push({
          year,
          presentValue: yearPresentValue,
          futureValue: yearFutureValue,
          discountFactor: 1 / Math.pow(1 + r/n, n * year)
        });

        chartData.push({
          year: year === 0 ? 'Today' : `Year ${year}`,
          presentValue: Math.round(yearPresentValue),
          futureValue: Math.round(yearFutureValue)
        });

        // Calculate simple interest for comparison
        if (calculationType === 'future-value') {
          const simpleFutureValue = presentValue * (1 + r * year);
          comparisonData.push({
            year: year === 0 ? 'Today' : `Year ${year}`,
            compound: Math.round(yearFutureValue),
            simple: Math.round(simpleFutureValue),
            difference: Math.round(yearFutureValue - simpleFutureValue)
          });
        }
      }

      setResults({
        presentValue: Math.round(presentValue),
        futureValue: Math.round(futureValue),
        yearlyBreakdown,
        chartData,
        comparisonData,
        frequencyLabel
      });
    }
  }, [formData]);

  useEffect(() => {
    calculateValues();
  }, [calculateValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'calculationType' ? value : (parseFloat(value) || 0)
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
        <div className="PresentFutureValueCalculator__Tooltip">
          <p className="PresentFutureValueCalculator__TooltipLabel">{label}</p>
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
        <div className="PresentFutureValueCalculator__Tooltip">
          <p className="PresentFutureValueCalculator__TooltipLabel">{label}</p>
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
    <div className="PresentFutureValueCalculator">
      <div className="PresentFutureValueCalculator__Container">
        <div className="PresentFutureValueCalculator__Header">
          <button className="PresentFutureValueCalculator__BackButton" onClick={onBack}>← Back</button>
          <h1 className="PresentFutureValueCalculator__Title">Present & Future Value Calculator</h1>
          <p className="PresentFutureValueCalculator__Subtitle">Calculate the time value of money and understand present vs future value</p>
        </div>

        <div className="PresentFutureValueCalculator__Content">
          {/* Input Section */}
          <div className="PresentFutureValueCalculator__InputSection">
            <h2 className="PresentFutureValueCalculator__SectionTitle">Calculation Details</h2>
            <div className="PresentFutureValueCalculator__InputGrid">
              <div className="PresentFutureValueCalculator__InputGroup">
                <label htmlFor="calculationType" className="PresentFutureValueCalculator__Label">Calculation Type</label>
                <select
                  id="calculationType"
                  name="calculationType"
                  value={formData.calculationType}
                  onChange={handleInputChange}
                  className="PresentFutureValueCalculator__Select"
                >
                  <option value="future-value">Calculate Future Value</option>
                  <option value="present-value">Calculate Present Value</option>
                </select>
              </div>

              <div className="PresentFutureValueCalculator__InputGroup">
                <label htmlFor="amount" className="PresentFutureValueCalculator__Label">
                  {formData.calculationType === 'future-value' ? 'Present Value (₹)' : 'Future Value (₹)'}
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="1000"
                  step="1000"
                  className="PresentFutureValueCalculator__Input"
                />
                <div className="PresentFutureValueCalculator__Slider">
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                    className="PresentFutureValueCalculator__RangeInput"
                  />
                  <div className="PresentFutureValueCalculator__SliderLabels">
                    <span>₹10,000</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>
              </div>

              <div className="PresentFutureValueCalculator__InputGroup">
                <label htmlFor="rate" className="PresentFutureValueCalculator__Label">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  id="rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  min="1"
                  max="25"
                  step="0.1"
                  className="PresentFutureValueCalculator__Input"
                />
                <div className="PresentFutureValueCalculator__Slider">
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="0.5"
                    value={formData.rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                    className="PresentFutureValueCalculator__RangeInput"
                  />
                  <div className="PresentFutureValueCalculator__SliderLabels">
                    <span>1%</span>
                    <span>25%</span>
                  </div>
                </div>
              </div>

              <div className="PresentFutureValueCalculator__InputGroup">
                <label htmlFor="time" className="PresentFutureValueCalculator__Label">Time Period (Years)</label>
                <input
                  type="number"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  className="PresentFutureValueCalculator__Input"
                />
                <div className="PresentFutureValueCalculator__Slider">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: parseInt(e.target.value) }))}
                    className="PresentFutureValueCalculator__RangeInput"
                  />
                  <div className="PresentFutureValueCalculator__SliderLabels">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>

              <div className="PresentFutureValueCalculator__InputGroup">
                <label htmlFor="compoundingFrequency" className="PresentFutureValueCalculator__Label">Compounding Frequency</label>
                <select
                  id="compoundingFrequency"
                  name="compoundingFrequency"
                  value={formData.compoundingFrequency}
                  onChange={handleInputChange}
                  className="PresentFutureValueCalculator__Select"
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
          <div className="PresentFutureValueCalculator__ResultsSection">
            <h2 className="PresentFutureValueCalculator__SectionTitle">Results</h2>
            <div className="PresentFutureValueCalculator__ResultsGrid">
              <div className="PresentFutureValueCalculator__ResultCard">
                <div className="PresentFutureValueCalculator__ResultIcon">💰</div>
                <h3 className="PresentFutureValueCalculator__ResultTitle">Present Value</h3>
                <p className="PresentFutureValueCalculator__ResultAmount">{formatCurrency(results.presentValue)}</p>
                <p className="PresentFutureValueCalculator__ResultDescription">Value today</p>
              </div>

              <div className="PresentFutureValueCalculator__ResultCard PresentFutureValueCalculator__ResultCard--highlight">
                <div className="PresentFutureValueCalculator__ResultIcon">📈</div>
                <h3 className="PresentFutureValueCalculator__ResultTitle">Future Value</h3>
                <p className="PresentFutureValueCalculator__ResultAmount">{formatCurrency(results.futureValue)}</p>
                <p className="PresentFutureValueCalculator__ResultDescription">Value after {formData.time} years</p>
              </div>

              <div className="PresentFutureValueCalculator__ResultCard">
                <div className="PresentFutureValueCalculator__ResultIcon">⚡</div>
                <h3 className="PresentFutureValueCalculator__ResultTitle">Time Value</h3>
                <p className="PresentFutureValueCalculator__ResultAmount PresentFutureValueCalculator__ResultAmount--difference">
                  {formatCurrency(Math.abs(results.futureValue - results.presentValue))}
                </p>
                <p className="PresentFutureValueCalculator__ResultDescription">
                  {formData.calculationType === 'future-value' ? 'Interest earned' : 'Discount applied'}
                </p>
              </div>
            </div>

            {/* Growth Chart */}
            {results.chartData.length > 0 && (
              <div className="PresentFutureValueCalculator__ChartSection">
                <h3 className="PresentFutureValueCalculator__ChartTitle">Value Over Time</h3>
                <div className="PresentFutureValueCalculator__ChartContainer">
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
                        dataKey="presentValue" 
                        stroke="#007bff" 
                        strokeWidth={3}
                        name="Present Value"
                        dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="futureValue" 
                        stroke="#28a745" 
                        strokeWidth={3}
                        name="Future Value"
                        dot={{ fill: '#28a745', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Comparison Chart (only for future value calculations) */}
            {results.comparisonData.length > 0 && formData.calculationType === 'future-value' && (
              <div className="PresentFutureValueCalculator__ChartSection">
                <h3 className="PresentFutureValueCalculator__ChartTitle">Compound vs Simple Interest Comparison</h3>
                <div className="PresentFutureValueCalculator__ChartContainer">
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

            {/* Calculation Summary */}
            <div className="PresentFutureValueCalculator__SummarySection">
              <h3 className="PresentFutureValueCalculator__SummaryTitle">Calculation Summary</h3>
              <div className="PresentFutureValueCalculator__SummaryGrid">
                <div className="PresentFutureValueCalculator__SummaryCard">
                  <span className="PresentFutureValueCalculator__SummaryLabel">Calculation Type</span>
                  <span className="PresentFutureValueCalculator__SummaryValue">
                    {formData.calculationType === 'future-value' ? 'Future Value' : 'Present Value'}
                  </span>
                </div>
                <div className="PresentFutureValueCalculator__SummaryCard">
                  <span className="PresentFutureValueCalculator__SummaryLabel">Input Amount</span>
                  <span className="PresentFutureValueCalculator__SummaryValue">{formatCurrency(formData.amount)}</span>
                </div>
                <div className="PresentFutureValueCalculator__SummaryCard">
                  <span className="PresentFutureValueCalculator__SummaryLabel">Interest Rate</span>
                  <span className="PresentFutureValueCalculator__SummaryValue">{formData.rate}% p.a.</span>
                </div>
                <div className="PresentFutureValueCalculator__SummaryCard">
                  <span className="PresentFutureValueCalculator__SummaryLabel">Time Period</span>
                  <span className="PresentFutureValueCalculator__SummaryValue">{formData.time} Years</span>
                </div>
                <div className="PresentFutureValueCalculator__SummaryCard">
                  <span className="PresentFutureValueCalculator__SummaryLabel">Compounding</span>
                  <span className="PresentFutureValueCalculator__SummaryValue">{results.frequencyLabel}</span>
                </div>
              </div>
            </div>

            {/* Yearly Breakdown */}
            <div className="PresentFutureValueCalculator__BreakdownSection">
              <h3 className="PresentFutureValueCalculator__BreakdownTitle">Yearly Breakdown</h3>
              <div className="PresentFutureValueCalculator__BreakdownTable">
                <div className="PresentFutureValueCalculator__TableHeader">
                  <span>Year</span>
                  <span>Present Value</span>
                  <span>Future Value</span>
                  <span>Discount Factor</span>
                </div>
                <div className="PresentFutureValueCalculator__TableBody">
                  {results.yearlyBreakdown.map((item, index) => (
                    <div key={index} className="PresentFutureValueCalculator__TableRow">
                      <span>{item.year === 0 ? 'Today' : item.year}</span>
                      <span>{formatCurrency(item.presentValue)}</span>
                      <span className="PresentFutureValueCalculator__TableFutureValue">{formatCurrency(item.futureValue)}</span>
                      <span className="PresentFutureValueCalculator__TableDiscountFactor">{item.discountFactor.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Educational Tips */}
            <div className="PresentFutureValueCalculator__TipsSection">
              <h3 className="PresentFutureValueCalculator__TipsTitle">💡 Time Value of Money Tips</h3>
              <div className="PresentFutureValueCalculator__TipsGrid">
                <div className="PresentFutureValueCalculator__TipCard">
                  <h4 className="PresentFutureValueCalculator__TipTitle">Understanding PV & FV</h4>
                  <p className="PresentFutureValueCalculator__TipText">Present Value is what money is worth today, while Future Value is what it will be worth after earning interest.</p>
                </div>
                <div className="PresentFutureValueCalculator__TipCard">
                  <h4 className="PresentFutureValueCalculator__TipTitle">Discount Rate Impact</h4>
                  <p className="PresentFutureValueCalculator__TipText">Higher interest rates increase future value but decrease present value due to the time value of money.</p>
                </div>
                <div className="PresentFutureValueCalculator__TipCard">
                  <h4 className="PresentFutureValueCalculator__TipTitle">Compounding Frequency</h4>
                  <p className="PresentFutureValueCalculator__TipText">More frequent compounding (monthly/daily) generally yields higher future values than annual compounding.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentFutureValueCalculator;
