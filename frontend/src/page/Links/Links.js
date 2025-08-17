import React, { useState } from 'react';
import './Links.css';
import TradingViewLogo from '../../Assests/TradingView.png';
import ScreenerLogo from '../../Assests/Screener.jpeg';

const Links = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const linkCategories = [
    { id: 'all', name: 'All Links' },
    { id: 'trading', name: 'Trading & Charts' },
    { id: 'screening', name: 'Stock Screeners' },
    { id: 'news', name: 'Financial News' },
    { id: 'education', name: 'Education' },
    { id: 'tools', name: 'Financial Tools' }
  ];

  const links = [
    {
      id: 1,
      name: 'TradingView',
      description: 'Advanced charting platform with real-time data and social trading features',
      url: 'https://www.tradingview.com',
      category: 'trading',
      icon: TradingViewLogo,
      isImage: true,
      tags: ['charts', 'trading', 'analysis']
    },
    {
      id: 2,
      name: 'Finviz Stock Screener',
      description: 'Powerful stock screening tool with 60+ filters and real-time data',
      url: 'https://finviz.com/screener.ashx',
      category: 'screening',
      icon: '🔍',
      isImage: false,
      tags: ['screener', 'stocks', 'filters']
    },
    {
      id: 3,
      name: 'Yahoo Finance Screener',
      description: 'Comprehensive stock screener with fundamental and technical filters',
      url: 'https://finance.yahoo.com/screener',
      category: 'screening',
      icon: '📊',
      isImage: false,
      tags: ['screener', 'fundamentals', 'yahoo']
    },
    {
      id: 4,
      name: 'Screener.in',
      description: 'Stock analysis and screening tool for investors in India with 10 years of financial data',
      url: 'https://www.screener.in',
      category: 'screening',
      icon: ScreenerLogo,
      isImage: true,
      tags: ['indian', 'screener', 'analysis', 'financial data']
    },
    {
      id: 5,
      name: 'Tijori Finance',
      description: 'Indian financial data platform with comprehensive market insights',
      url: 'https://www.tijorifinance.com',
      category: 'tools',
      icon: '🇮🇳',
      isImage: false,
      tags: ['indian', 'finance', 'data', 'insights']
    },
    {
      id: 6,
      name: 'Trendlyne',
      description: 'Indian stock market analysis and screening platform',
      url: 'https://trendlyne.com',
      category: 'screening',
      icon: '📊',
      isImage: false,
      tags: ['indian', 'screening', 'analysis', 'stocks']
    },
    {
      id: 7,
      name: 'Chittorgarh IPO',
      description: 'Comprehensive IPO information and analysis for Indian markets',
      url: 'https://chittorgarh.com',
      category: 'tools',
      icon: '📋',
      isImage: false,
      tags: ['ipo', 'indian', 'new listings', 'analysis']
    },
    {
      id: 8,
      name: 'Trading Economics',
      description: 'Global economic indicators, forecasts, and financial data',
      url: 'https://tradingeconomics.com',
      category: 'tools',
      icon: '🌍',
      isImage: false,
      tags: ['economics', 'indicators', 'global', 'data']
    },
    {
      id: 9,
      name: 'Money Control',
      description: 'Leading Indian financial news and market analysis platform',
      url: 'https://www.moneycontrol.com',
      category: 'news',
      icon: '💰',
      isImage: false,
      tags: ['indian', 'news', 'markets', 'analysis']
    }
  ];

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleLinkClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="Links">
      <div className="Links__Container">
        {/* Header */}
        <div className="Links__Header">
          <h1 className="Links__Title">Financial Links</h1>
          <p className="Links__Subtitle">
            Curated collection of essential financial websites, tools, and resources
          </p>
        </div>

        {/* Search and Filter */}
        <div className="Links__Controls">
          <div className="Links__Search">
            <input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="Links__SearchInput"
            />
            <svg className="Links__SearchIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>

          <div className="Links__Categories">
            {linkCategories.map(category => (
              <button
                key={category.id}
                className={`Links__CategoryBtn ${selectedCategory === category.id ? 'Links__CategoryBtn--active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="Links__Results">
          <span className="Links__ResultsCount">
            {filteredLinks.length} link{filteredLinks.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Links Grid */}
        <div className="Links__Grid">
          {filteredLinks.map(link => (
            <div key={link.id} className="Links__Card" onClick={() => handleLinkClick(link.url)}>
              <div className="Links__CardHeader">
                <div className="Links__CardIcon">
                  {link.isImage ? (
                    <img 
                      src={link.icon} 
                      alt={link.name} 
                      className="Links__CardImage"
                    />
                  ) : (
                    <span className="Links__CardEmoji">{link.icon}</span>
                  )}
                </div>
                <div className="Links__CardInfo">
                  <h3 className="Links__CardTitle">{link.name}</h3>
                  <p className="Links__CardDescription">{link.description}</p>
                </div>
              </div>
              
              <div className="Links__CardFooter">
                <div className="Links__CardTags">
                  {link.tags.map(tag => (
                    <span key={tag} className="Links__CardTag">{tag}</span>
                  ))}
                </div>
                <div className="Links__CardAction">
                  <span className="Links__CardUrl">{link.url}</span>
                  <svg className="Links__CardArrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7"/>
                    <path d="M7 7h10v10"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLinks.length === 0 && (
          <div className="Links__Empty">
            <div className="Links__EmptyIcon">🔍</div>
            <h3 className="Links__EmptyTitle">No links found</h3>
            <p className="Links__EmptyText">
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;
