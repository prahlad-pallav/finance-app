import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                </div>
              </div>
              <h3>GainGuru</h3>
              <p>Your trusted partner for smart financial management and wealth creation.</p>
            </div>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><button 
                className="footer-link" 
                onClick={() => handleNavigation('/calculators')}
              >
                Calculators
              </button></li>
              <li><button 
                className="footer-link" 
                onClick={() => handleNavigation('/calculators/sip')}
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
          <p>&copy; 2024 GainGuru. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
