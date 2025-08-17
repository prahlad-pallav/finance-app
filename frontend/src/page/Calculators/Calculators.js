import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Calculators.css';

const Calculators = () => {
  const navigate = useNavigate();

  const calculatorOptions = [
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Calculate your Systematic Investment Plan returns and future value',
      icon: '📈',
      color: '#4CAF50',
      path: '/calculators/sip'
    },
    {
      id: 'compound-interest',
      title: 'Compound Interest Calculator',
      description: 'Calculate compound interest and compare with simple interest',
      icon: '💹',
      color: '#FF5722',
      path: '/calculators/compound-interest'
    },
    {
      id: 'simple-interest',
      title: 'Simple Interest Calculator',
      description: 'Calculate simple interest and understand the difference from compound',
      icon: '📊',
      color: '#FF9800',
      path: '/calculators/simple-interest'
    },
    {
      id: 'present-future-value',
      title: 'Present & Future Value',
      description: 'Calculate time value of money and understand PV vs FV',
      icon: '⏰',
      color: '#6f42c1',
      path: '/calculators/present-future-value'
    },
    {
      id: 'sip-setup',
      title: 'SIP Setup',
      description: 'Set up and configure your Systematic Investment Plan',
      icon: '⚙️',
      color: '#2196F3',
      path: '/calculators/sip-setup'
    },
    {
      id: 'lumpsum',
      title: 'Lump Sum Calculator',
      description: 'Calculate returns on one-time investments',
      icon: '💰',
      color: '#FF9800',
      path: '/calculators/lumpsum'
    },
    {
      id: 'emi-calculator',
      title: 'EMI Calculator',
      description: 'Calculate Equated Monthly Installments for loans',
      icon: '🏦',
      color: '#9C27B0',
      path: '/calculators/emi-calculator'
    }
  ];

  const handleCalculatorClick = (path) => {
    navigate(path);
  };

  return (
    <div className="CalculatorContainer">
      <div className="CalculatorHeader">
        <h1>Financial Calculators</h1>
        <p>Make informed financial decisions with our comprehensive calculators</p>
      </div>
      
      <div className="CalculatorGrid">
        {calculatorOptions.map((calculator) => (
          <div 
            key={calculator.id}
            className="CalculatorCard"
            onClick={() => handleCalculatorClick(calculator.path)}
            style={{ borderLeftColor: calculator.color }}
          >
            <div className="CalculatorIcon" style={{ backgroundColor: calculator.color }}>
              {calculator.icon}
            </div>
            <div className="CalculatorContent">
              <h3>{calculator.title}</h3>
              <p>{calculator.description}</p>
            </div>
            <div className="CalculatorArrow">
              →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calculators;
