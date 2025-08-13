import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <h1>Take Control of Your Financial Future</h1>
            <p>Track expenses, set budgets, and achieve your financial goals with our intuitive finance management platform.</p>
            <div className="hero-buttons">
              <button 
                className="btn-primary btn-large" 
                onClick={() => navigate('/calculators')}
              >
                Try Calculators
              </button>
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
            <h2>Why Choose GainGuru?</h2>
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
            <div className="feature-card" onClick={() => navigate('/currency')}>
              <div className="feature-icon">💱</div>
              <h3>Currency Converter</h3>
              <p>Track INR exchange rates and view historical trends with real-time currency conversion.</p>
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
            <button 
              className="btn-primary btn-large"
              onClick={() => navigate('/calculators')}
            >
              Get Started Today
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home; 