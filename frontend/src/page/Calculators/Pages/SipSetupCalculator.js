import React, { useState } from 'react';
import './SipSetupCalculator.css';

const SipSetupCalculator = ({ onBack }) => {
  const [setupData, setSetupData] = useState({
    fundName: '',
    amount: '',
    startDate: '',
    frequency: 'monthly',
    bankAccount: '',
    autoDebit: false,
    fundType: 'equity',
    riskProfile: 'moderate',
    investmentGoal: 'retirement'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSetupData({
      ...setupData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionStatus('success');
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmissionStatus(null);
        setSetupData({
          fundName: '',
          amount: '',
          startDate: '',
          frequency: 'monthly',
          bankAccount: '',
          autoDebit: false,
          fundType: 'equity',
          riskProfile: 'moderate',
          investmentGoal: 'retirement'
        });
      }, 3000);
    }, 2000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="SipSetupCalculator">
      <div className="SipSetupCalculator__Container">
        <div className="SipSetupCalculator__Header">
          <button className="SipSetupCalculator__BackButton" onClick={onBack}>← Back</button>
          <h1 className="SipSetupCalculator__Title">SIP Setup</h1>
          <p className="SipSetupCalculator__Subtitle">Configure your Systematic Investment Plan for automated wealth creation</p>
        </div>

        <div className="SipSetupCalculator__Content">
          <form onSubmit={handleSubmit} className="SipSetupCalculator__Form">
            {/* Fund Selection Section */}
            <div className="SipSetupCalculator__Section">
              <h2 className="SipSetupCalculator__SectionTitle">Fund Selection</h2>
              <div className="SipSetupCalculator__InputGrid">
                <div className="SipSetupCalculator__InputGroup">
                  <label className="SipSetupCalculator__Label">Fund/Mutual Fund Name</label>
                  <input
                    type="text"
                    name="fundName"
                    value={setupData.fundName}
                    onChange={handleInputChange}
                    placeholder="Enter fund name"
                    required
                    className="SipSetupCalculator__Input"
                  />
                </div>

                <div className="SipSetupCalculator__InputGroup">
                  <label className="SipSetupCalculator__Label">Fund Type</label>
                  <select 
                    name="fundType" 
                    value={setupData.fundType} 
                    onChange={handleInputChange}
                    className="SipSetupCalculator__Select"
                  >
                    <option value="equity">Equity Fund</option>
                    <option value="debt">Debt Fund</option>
                    <option value="hybrid">Hybrid Fund</option>
                    <option value="index">Index Fund</option>
                    <option value="sectoral">Sectoral Fund</option>
                  </select>
                </div>

                <div className="SipSetupCalculator__InputGroup">
                  <label className="SipSetupCalculator__Label">Risk Profile</label>
                  <select 
                    name="riskProfile" 
                    value={setupData.riskProfile} 
                    onChange={handleInputChange}
                    className="SipSetupCalculator__Select"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Investment Details Section */}
            <div className="SipSetupCalculator__Section">
              <h2 className="SipSetupCalculator__SectionTitle">Investment Details</h2>
              <div className="SipSetupCalculator__InputGrid">
                <div className="SipSetupCalculator__InputGroup">
                  <label className="SipSetupCalculator__Label">SIP Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={setupData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    min="500"
                    step="100"
                    required
                    className="SipSetupCalculator__Input"
                  />
                  <div className="SipSetupCalculator__AmountPreview">
                    Monthly Investment: {formatCurrency(setupData.amount)}
                  </div>
                </div>

                <div className="SipSetupCalculator__InputGroup">
                  <label className="SipSetupCalculator__Label">Investment Frequency</label>
                  <select 
                    name="frequency" 
                    value={setupData.frequency} 
                    onChange={handleInputChange}
                    className="SipSetupCalculator__Select"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>

                <div className="SipSetupCalculator__InputGroup">
                  <label className="SipSetupCalculator__Label">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={setupData.startDate}
                    onChange={handleInputChange}
                    required
                    className="SipSetupCalculator__Input"
                  />
                </div>

                <div className="SipSetupCalculator__InputGroup">
                  <label className="SipSetupCalculator__Label">Investment Goal</label>
                  <select 
                    name="investmentGoal" 
                    value={setupData.investmentGoal} 
                    onChange={handleInputChange}
                    className="SipSetupCalculator__Select"
                  >
                    <option value="retirement">Retirement Planning</option>
                    <option value="education">Child Education</option>
                    <option value="house">House Purchase</option>
                    <option value="vacation">Vacation Fund</option>
                    <option value="emergency">Emergency Fund</option>
                    <option value="wealth">Wealth Creation</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="SipSetupCalculator__Section">
              <h2 className="SipSetupCalculator__SectionTitle">Bank Details</h2>
              <div className="SipSetupCalculator__InputGrid">
                <div className="SipSetupCalculator__InputGroup">
                  <label className="SipSetupCalculator__Label">Bank Account Number</label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={setupData.bankAccount}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                    required
                    className="SipSetupCalculator__Input"
                  />
                </div>

                <div className="SipSetupCalculator__InputGroup">
                  <label className="SipSetupCalculator__Label">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    placeholder="Enter IFSC code"
                    className="SipSetupCalculator__Input"
                  />
                </div>
              </div>

              <div className="SipSetupCalculator__CheckboxGroup">
                <label className="SipSetupCalculator__CheckboxLabel">
                  <input
                    type="checkbox"
                    name="autoDebit"
                    checked={setupData.autoDebit}
                    onChange={handleInputChange}
                    className="SipSetupCalculator__Checkbox"
                  />
                  <span className="SipSetupCalculator__CheckboxText">
                    Enable Auto-Debit for hassle-free investments
                  </span>
                </label>
              </div>
            </div>

            {/* Summary Section */}
            <div className="SipSetupCalculator__SummarySection">
              <h3 className="SipSetupCalculator__SummaryTitle">Setup Summary</h3>
              <div className="SipSetupCalculator__SummaryGrid">
                <div className="SipSetupCalculator__SummaryCard">
                  <span className="SipSetupCalculator__SummaryLabel">Fund Type</span>
                  <span className="SipSetupCalculator__SummaryValue">{setupData.fundType}</span>
                </div>
                <div className="SipSetupCalculator__SummaryCard">
                  <span className="SipSetupCalculator__SummaryLabel">Monthly Investment</span>
                  <span className="SipSetupCalculator__SummaryValue">{formatCurrency(setupData.amount)}</span>
                </div>
                <div className="SipSetupCalculator__SummaryCard">
                  <span className="SipSetupCalculator__SummaryLabel">Frequency</span>
                  <span className="SipSetupCalculator__SummaryValue">{setupData.frequency}</span>
                </div>
                <div className="SipSetupCalculator__SummaryCard">
                  <span className="SipSetupCalculator__SummaryLabel">Risk Profile</span>
                  <span className="SipSetupCalculator__SummaryValue">{setupData.riskProfile}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="SipSetupCalculator__SubmitSection">
              <button 
                type="submit" 
                className={`SipSetupCalculator__SubmitButton ${isSubmitting ? 'SipSetupCalculator__SubmitButton--loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Setting up SIP...' : 'Setup SIP'}
              </button>
            </div>

            {/* Success Message */}
            {submissionStatus === 'success' && (
              <div className="SipSetupCalculator__SuccessMessage">
                <div className="SipSetupCalculator__SuccessIcon">✅</div>
                <h3 className="SipSetupCalculator__SuccessTitle">SIP Setup Successful!</h3>
                <p className="SipSetupCalculator__SuccessText">
                  Your Systematic Investment Plan has been configured successfully. 
                  You will receive a confirmation email shortly.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SipSetupCalculator;
