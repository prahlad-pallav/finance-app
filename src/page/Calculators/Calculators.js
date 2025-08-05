import React, { useState } from 'react';
import './Calculators.css';
import SipCalculator from './Pages/SipCalculator';
import SipSetupCalculator from './Pages/SipSetupCalculator';
import LumpsumCalculator from './Pages/LumpsumCalculator';
import EmiCalculator from './Pages/EmiCalculator';

const Calculators = () => {
  const [activeCalculator, setActiveCalculator] = useState(null);

  const calculatorOptions = [
    {
      id: 'sip-calculator',
      title: 'SIP Calculator',
      description: 'Calculate your Systematic Investment Plan returns and future value',
      icon: '📈',
      color: '#4CAF50'
    },
    {
      id: 'sip-setup',
      title: 'SIP Setup',
      description: 'Set up and configure your Systematic Investment Plan',
      icon: '⚙️',
      color: '#2196F3'
    },
    {
      id: 'lumpsum',
      title: 'Lump Sum Calculator',
      description: 'Calculate returns on one-time investments',
      icon: '💰',
      color: '#FF9800'
    },
    {
      id: 'emi-calculator',
      title: 'EMI Calculator',
      description: 'Calculate Equated Monthly Installments for loans',
      icon: '🏦',
      color: '#9C27B0'
    }
  ];

  const handleCalculatorClick = (calculatorId) => {
    setActiveCalculator(calculatorId);
  };

  const handleBackToDashboard = () => {
    setActiveCalculator(null);
  };

  const renderCalculatorContent = () => {
    switch (activeCalculator) {
      case 'sip-calculator':
        return <SipCalculator onBack={handleBackToDashboard} />;
      case 'sip-setup':
        return <SipSetupCalculator onBack={handleBackToDashboard} />;
      case 'lumpsum':
        return <LumpsumCalculator onBack={handleBackToDashboard} />;
      case 'emi-calculator':
        return <EmiCalculator onBack={handleBackToDashboard} />;
      default:
        return null;
    }
  };

  if (activeCalculator) {
    return (
      <div className="CalculatorContainer">
        {renderCalculatorContent()}
      </div>
    );
  }

  return (
    <div className="CalculatorsDashboard">
      <div className="CalculatorsDashboard__Header">
        <h1 className="CalculatorsDashboard__Title">Financial Calculators</h1>
        <p className="CalculatorsDashboard__Subtitle">Choose the calculator that fits your financial planning needs</p>
      </div>
      
      <div className="CalculatorsDashboard__Grid">
        {calculatorOptions.map((calculator) => (
          <div
            key={calculator.id}
            className="CalculatorCard"
            onClick={() => handleCalculatorClick(calculator.id)}
            style={{ '--card-color': calculator.color }}
          >
            <div className="CalculatorCard__Icon" style={{ backgroundColor: calculator.color }}>
              <span>{calculator.icon}</span>
            </div>
            <div className="CalculatorCard__Content">
              <h3 className="CalculatorCard__Title">{calculator.title}</h3>
              <p className="CalculatorCard__Description">{calculator.description}</p>
            </div>
            <div className="CalculatorCard__Arrow">
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calculators;
