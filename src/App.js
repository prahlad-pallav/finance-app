import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h2>FinanceFlow</h2>
          </div>
          <nav className="nav">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
          <div className="header-buttons">
            <button className="btn-secondary">Login</button>
            <button className="btn-primary">Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <h1>Take Control of Your Financial Future</h1>
            <p>Track expenses, set budgets, and achieve your financial goals with our intuitive finance management platform.</p>
            <div className="hero-buttons">
              <button className="btn-primary btn-large">Start Free Trial</button>
              <button className="btn-outline btn-large">Watch Demo</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="dashboard-preview">
              <div className="chart-placeholder"></div>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>$2,450</h3>
                  <p>Monthly Savings</p>
                </div>
                <div className="stat-card">
                  <h3>15%</h3>
                  <p>Budget Increase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose FinanceFlow?</h2>
            <p>Everything you need to manage your finances effectively</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Smart Analytics</h3>
              <p>Get detailed insights into your spending patterns and financial health with AI-powered analytics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Goal Setting</h3>
              <p>Set and track financial goals with personalized recommendations and progress monitoring.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Bank-level security ensures your financial data is always protected and private.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile First</h3>
              <p>Access your finances anywhere with our responsive mobile app and web platform.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Multi-Account</h3>
              <p>Connect all your bank accounts, credit cards, and investment portfolios in one place.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Investment Tracking</h3>
              <p>Monitor your investments and get real-time market data to make informed decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>50K+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-item">
              <h3>$2.5M</h3>
              <p>Total Savings</p>
            </div>
            <div className="stat-item">
              <h3>95%</h3>
              <p>User Satisfaction</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Finances?</h2>
            <p>Join thousands of users who have already taken control of their financial future.</p>
            <button className="btn-primary btn-large">Get Started Today</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>FinanceFlow</h3>
              <p>Empowering individuals to achieve financial freedom through smart money management.</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
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
            <p>&copy; 2024 FinanceFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
