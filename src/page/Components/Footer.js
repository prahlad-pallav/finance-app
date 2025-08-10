import React from 'react';
import './Footer.css';

const Footer = ({ setCurrentPage }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FinApp</h3>
            <p>Empowering individuals to achieve financial freedom through smart money management.</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><button 
                className="footer-link" 
                onClick={() => setCurrentPage('calculators')}
              >
                Calculators
              </button></li>
              <li><button 
                className="footer-link" 
                onClick={() => setCurrentPage('sip-calculator')}
              >
                SIP Calculator
              </button></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#api">API</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#community">Community</a></li>
              <li><a href="#status">Status</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 FinApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
