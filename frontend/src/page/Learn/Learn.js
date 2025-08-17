import React, { useState } from 'react';
import './Learn.css';

const Learn = () => {
  const [activeSection, setActiveSection] = useState('basics');

  const learningSections = [
    {
      id: 'basics',
      title: 'Basics of Stock Market',
      icon: '📈',
      color: '#00b4d8',
      content: {
        overview: 'Understanding the fundamentals of how stock markets work and basic investment concepts.',
        topics: [
          {
            title: 'What is a Stock Market?',
            description: 'A stock market is a marketplace where shares of publicly traded companies are bought and sold.',
            details: [
              'Stock markets facilitate the exchange of securities between buyers and sellers',
              'They provide companies with access to capital through public offerings',
              'Investors can buy ownership stakes in companies through stock purchases',
              'Markets are regulated to ensure fair trading practices'
            ]
          },
          {
            title: 'Types of Orders',
            description: 'Different ways to buy and sell stocks in the market.',
            details: [
              'Market Order: Buy/sell at current market price',
              'Limit Order: Buy/sell at a specific price or better',
              'Stop Loss: Automatically sell if price falls below a certain level',
              'Stop Limit: Combines stop loss with limit order'
            ]
          },
          {
            title: 'Market Participants',
            description: 'Key players in the stock market ecosystem.',
            details: [
              'Individual Investors: Retail traders and long-term investors',
              'Institutional Investors: Mutual funds, pension funds, hedge funds',
              'Market Makers: Provide liquidity and facilitate trading',
              'Brokers: Execute trades on behalf of investors'
            ]
          },
          {
            title: 'Risk Management',
            description: 'Essential strategies to protect your investments.',
            details: [
              'Diversification: Spread investments across different assets',
              'Position Sizing: Limit exposure to any single investment',
              'Stop Losses: Set automatic exit points for losses',
              'Regular Review: Monitor and adjust your portfolio'
            ]
          }
        ]
      }
    },
    {
      id: 'technical',
      title: 'Technical Analysis',
      icon: '📊',
      color: '#10B981',
      content: {
        overview: 'Learn to analyze price patterns, trends, and market indicators to make trading decisions.',
        topics: [
          {
            title: 'Chart Types',
            description: 'Different ways to visualize price movements.',
            details: [
              'Line Charts: Simple price movement over time',
              'Bar Charts: Show open, high, low, and close prices',
              'Candlestick Charts: Visual representation of price action',
              'Point & Figure: Focus on significant price movements'
            ]
          },
          {
            title: 'Support & Resistance',
            description: 'Key price levels that influence market movements.',
            details: [
              'Support: Price level where buying interest is strong',
              'Resistance: Price level where selling pressure increases',
              'Breakouts: When price moves beyond support/resistance',
              'Retests: Price returning to test these levels'
            ]
          },
          {
            title: 'Technical Indicators',
            description: 'Mathematical tools to analyze market trends.',
            details: [
              'Moving Averages: Smooth out price fluctuations',
              'RSI (Relative Strength Index): Measure overbought/oversold conditions',
              'MACD: Momentum and trend following indicator',
              'Bollinger Bands: Volatility and price channel indicator'
            ]
          },
          {
            title: 'Pattern Recognition',
            description: 'Identifying recurring price patterns for trading signals.',
            details: [
              'Head & Shoulders: Reversal pattern indicating trend change',
              'Double Tops/Bottoms: Reversal patterns at key levels',
              'Triangles: Continuation patterns showing consolidation',
              'Flags & Pennants: Short-term continuation patterns'
            ]
          }
        ]
      }
    },
    {
      id: 'fundamental',
      title: 'Fundamental Analysis',
      icon: '📋',
      color: '#F59E0B',
      content: {
        overview: 'Evaluate companies based on financial statements, business models, and economic factors.',
        topics: [
          {
            title: 'Financial Statements',
            description: 'Key documents that reveal a company\'s financial health.',
            details: [
              'Income Statement: Revenue, expenses, and profitability',
              'Balance Sheet: Assets, liabilities, and shareholder equity',
              'Cash Flow Statement: Cash inflows and outflows',
              'Notes to Accounts: Additional financial information'
            ]
          },
          {
            title: 'Key Ratios',
            description: 'Important metrics to evaluate company performance.',
            details: [
              'P/E Ratio: Price relative to earnings',
              'P/B Ratio: Price relative to book value',
              'ROE: Return on equity',
              'Debt-to-Equity: Financial leverage measure'
            ]
          },
          {
            title: 'Industry Analysis',
            description: 'Understanding the broader business environment.',
            details: [
              'Competitive Landscape: Market share and competition',
              'Industry Trends: Growth patterns and market dynamics',
              'Regulatory Environment: Laws affecting the industry',
              'Economic Factors: Macroeconomic influences'
            ]
          },
          {
            title: 'Valuation Methods',
            description: 'Different approaches to determine stock value.',
            details: [
              'DCF Analysis: Discounted cash flow valuation',
              'Comparable Analysis: Compare with similar companies',
              'Asset-Based: Value based on company assets',
              'Dividend Discount: Value based on dividend payments'
            ]
          }
        ]
      }
    },
    {
      id: 'mutual-funds',
      title: 'Mutual Funds',
      icon: '🏦',
      color: '#8B5CF6',
      content: {
        overview: 'Learn about mutual funds, their types, benefits, and how to choose the right ones.',
        topics: [
          {
            title: 'What are Mutual Funds?',
            description: 'Pooled investment vehicles that invest in a diversified portfolio.',
            details: [
              'Professional Management: Expert fund managers make decisions',
              'Diversification: Spread risk across multiple investments',
              'Liquidity: Easy to buy and sell fund units',
              'Regulation: Governed by regulatory authorities'
            ]
          },
          {
            title: 'Types of Mutual Funds',
            description: 'Different categories based on investment objectives.',
            details: [
              'Equity Funds: Invest primarily in stocks',
              'Debt Funds: Invest in bonds and fixed income',
              'Hybrid Funds: Mix of equity and debt',
              'Index Funds: Track specific market indices'
            ]
          },
          {
            title: 'Expense Ratios & Fees',
            description: 'Understanding the costs associated with mutual funds.',
            details: [
              'Expense Ratio: Annual fee as percentage of assets',
              'Entry Load: Fee charged when buying units',
              'Exit Load: Fee charged when selling units',
              'Management Fee: Fee paid to fund managers'
            ]
          },
          {
            title: 'How to Choose',
            description: 'Factors to consider when selecting mutual funds.',
            details: [
              'Investment Goal: Align with your financial objectives',
              'Risk Tolerance: Match your comfort with volatility',
              'Past Performance: Historical returns and consistency',
              'Fund Manager: Track record and experience'
            ]
          }
        ]
      }
    }
  ];

  const currentSection = learningSections.find(section => section.id === activeSection);

  return (
    <div className="Learn">
      <div className="Learn__Container">
        {/* Header */}
        <div className="Learn__Header">
          <h1 className="Learn__Title">Financial Education</h1>
          <p className="Learn__Subtitle">
            Master the fundamentals of investing and financial markets
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="Learn__Navigation">
          {learningSections.map((section) => (
            <button
              key={section.id}
              className={`Learn__Tab ${activeSection === section.id ? 'Learn__Tab--active' : ''}`}
              onClick={() => setActiveSection(section.id)}
              style={{
                '--tab-color': section.color
              }}
            >
              <span className="Learn__TabIcon">{section.icon}</span>
              <span className="Learn__TabTitle">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="Learn__Content">
          {currentSection && (
            <>
              {/* Section Overview */}
              <div className="Learn__Overview">
                <div className="Learn__OverviewHeader">
                  <div 
                    className="Learn__OverviewIcon"
                    style={{ backgroundColor: currentSection.color + '20' }}
                  >
                    {currentSection.icon}
                  </div>
                  <div className="Learn__OverviewInfo">
                    <h2 className="Learn__OverviewTitle">{currentSection.title}</h2>
                    <p className="Learn__OverviewDescription">{currentSection.content.overview}</p>
                  </div>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="Learn__Topics">
                {currentSection.content.topics.map((topic, index) => (
                  <div key={index} className="Learn__TopicCard">
                    <div className="Learn__TopicHeader">
                      <h3 className="Learn__TopicTitle">{topic.title}</h3>
                      <p className="Learn__TopicDescription">{topic.description}</p>
                    </div>
                    <div className="Learn__TopicDetails">
                      <ul className="Learn__TopicList">
                        {topic.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="Learn__TopicItem">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="Learn__Progress">
                <div className="Learn__ProgressBar">
                  <div 
                    className="Learn__ProgressFill"
                    style={{ 
                      width: `${((learningSections.findIndex(s => s.id === activeSection) + 1) / learningSections.length) * 100}%`,
                      backgroundColor: currentSection.color
                    }}
                  ></div>
                </div>
                <span className="Learn__ProgressText">
                  {learningSections.findIndex(s => s.id === activeSection) + 1} of {learningSections.length} sections
                </span>
              </div>
            </>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="Learn__QuickNav">
          <h3 className="Learn__QuickNavTitle">Quick Navigation</h3>
          <div className="Learn__QuickNavGrid">
            {learningSections.map((section) => (
              <button
                key={section.id}
                className={`Learn__QuickNavItem ${activeSection === section.id ? 'Learn__QuickNavItem--active' : ''}`}
                onClick={() => setActiveSection(section.id)}
                style={{
                  '--item-color': section.color
                }}
              >
                <span className="Learn__QuickNavIcon">{section.icon}</span>
                <span className="Learn__QuickNavText">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
