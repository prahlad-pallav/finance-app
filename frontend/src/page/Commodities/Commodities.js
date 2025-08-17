import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './Commodities.css';

const Commodities = () => {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState(null);

  // Gold API base URL
  const GOLD_API_BASE = 'https://api.gold-api.com';

  // Commodity symbols to track
  const commoditySymbols = useMemo(() => [
    { symbol: 'XAU', name: 'Gold', icon: '🥇', color: '#FFD700' },
    { symbol: 'XAG', name: 'Silver', icon: '🥈', color: '#C0C0C0' },
    { symbol: 'XPD', name: 'Palladium', icon: '💎', color: '#CED0DD' },
    { symbol: 'HG', name: 'Copper', icon: '🔶', color: '#B87333' }
  ], []);

  // Fetch commodity prices
  const fetchCommodityPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const pricePromises = commoditySymbols.map(async (commodity) => {
        try {
          const response = await fetch(`${GOLD_API_BASE}/price/${commodity.symbol}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          return {
            ...commodity,
            price: data.price,
            timestamp: data.timestamp,
            change: data.change || 0,
            changePercent: data.change_percent || 0
          };
        } catch (error) {
          console.error(`Error fetching ${commodity.symbol}:`, error);
          return {
            ...commodity,
            price: null,
            timestamp: null,
            change: 0,
            changePercent: 0,
            error: true
          };
        }
      });

      const results = await Promise.all(pricePromises);
      setCommodities(results);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching commodity data:', error);
      setError('Failed to fetch commodity data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [commoditySymbols]);

  // Format price with appropriate decimals
  const formatPrice = (price, symbol) => {
    if (price === null || price === undefined) return 'N/A';
    
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return 'N/A';
    
    // Different decimal places for different commodities
    if (symbol === 'XAU') {
      return numPrice.toFixed(2); // Gold - 2 decimals
    } else if (symbol === 'XAG') {
      return numPrice.toFixed(3); // Silver - 3 decimals
    } else if (symbol === 'HG') {
      return numPrice.toFixed(2); // Copper - 2 decimals
    } else {
      return numPrice.toFixed(2); // Others - 2 decimals
    }
  };

  // Format currency symbol
  const getCurrencySymbol = (symbol) => {
    if (symbol === 'HG') return '$'; // Copper is typically quoted in USD
    return '$'; // Default to USD for precious metals
  };

  // Handle commodity click for details
  const handleCommodityClick = (commodity) => {
    setSelectedCommodity(commodity);
  };

  // Close details modal
  const closeDetails = () => {
    setSelectedCommodity(null);
  };

  // Initial data fetch
  useEffect(() => {
    fetchCommodityPrices();
  }, [fetchCommodityPrices]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCommodityPrices();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchCommodityPrices]);

  return (
    <div className="Commodities">
      <div className="Commodities__Container">
        {/* Header */}
        <div className="Commodities__Header">
          <h1 className="Commodities__Title">Commodities Market</h1>
          <p className="Commodities__Subtitle">
            Real-time precious metals and commodity prices
          </p>
        </div>

        {/* Controls */}
        <div className="Commodities__Controls">
          <button 
            className="Commodities__RefreshBtn"
            onClick={fetchCommodityPrices}
            disabled={loading}
          >
            {loading ? (
              <svg className="Commodities__Spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M3 21v-5h5"/>
              </svg>
            )}
            {loading ? 'Updating...' : 'Refresh'}
          </button>

          {lastUpdated && (
            <div className="Commodities__LastUpdated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="Commodities__Error">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="Commodities__Loading">
            <div className="Commodities__LoadingSpinner"></div>
            <p>Fetching latest commodity prices...</p>
          </div>
        )}

        {/* Commodities Grid */}
        {!loading && !error && (
          <div className="Commodities__Grid">
            {commodities.map((commodity) => (
              <div 
                key={commodity.symbol}
                className={`Commodities__Card ${commodity.error ? 'Commodities__Card--error' : ''}`}
                onClick={() => !commodity.error && handleCommodityClick(commodity)}
              >
                <div className="Commodities__CardHeader">
                  <div 
                    className="Commodities__CardIcon"
                    style={{ backgroundColor: commodity.color + '20' }}
                  >
                    {commodity.icon}
                  </div>
                  <div className="Commodities__CardInfo">
                    <h3 className="Commodities__CardTitle">{commodity.name}</h3>
                    <p className="Commodities__CardSymbol">{commodity.symbol}</p>
                  </div>
                </div>

                <div className="Commodities__CardPrice">
                  {commodity.error ? (
                    <span className="Commodities__CardError">Data Unavailable</span>
                  ) : (
                    <span className="Commodities__CardAmount">
                      {getCurrencySymbol(commodity.symbol)}{formatPrice(commodity.price, commodity.symbol)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Market Summary */}
        {!loading && !error && commodities.length > 0 && (
          <div className="Commodities__Summary">
            <h3 className="Commodities__SummaryTitle">Market Summary</h3>
            <div className="Commodities__SummaryStats">
              <div className="Commodities__SummaryStat">
                <span className="Commodities__SummaryLabel">Total Commodities</span>
                <span className="Commodities__SummaryValue">{commodities.length}</span>
              </div>
              <div className="Commodities__SummaryStat">
                <span className="Commodities__SummaryLabel">Data Source</span>
                <span className="Commodities__SummaryValue">
                  <a 
                    href="https://gold-api.com/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="Commodities__SummaryLink"
                  >
                    Gold API
                  </a>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedCommodity && (
        <div className="Commodities__Modal" onClick={closeDetails}>
          <div className="Commodities__ModalContent" onClick={(e) => e.stopPropagation()}>
            <div className="Commodities__ModalHeader">
              <h2 className="Commodities__ModalTitle">
                {selectedCommodity.icon} {selectedCommodity.name}
              </h2>
              <button className="Commodities__ModalClose" onClick={closeDetails}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="Commodities__ModalBody">
              <div className="Commodities__ModalPrice">
                <span className="Commodities__ModalAmount">
                  {getCurrencySymbol(selectedCommodity.symbol)}{formatPrice(selectedCommodity.price, selectedCommodity.symbol)}
                </span>
                <span 
                  className="Commodities__ModalChange"
                  style={{ color: '#666' }}
                >
                  {selectedCommodity.change ? `${selectedCommodity.change >= 0 ? '+' : ''}${selectedCommodity.change}` : 'N/A'}
                </span>
              </div>

              <div className="Commodities__ModalDetails">
                <div className="Commodities__ModalDetail">
                  <span className="Commodities__ModalLabel">Symbol:</span>
                  <span className="Commodities__ModalValue">{selectedCommodity.symbol}</span>
                </div>
                <div className="Commodities__ModalDetail">
                  <span className="Commodities__ModalLabel">Last Updated:</span>
                  <span className="Commodities__ModalValue">
                    {selectedCommodity.timestamp ? new Date(selectedCommodity.timestamp).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="Commodities__ModalDetail">
                  <span className="Commodities__ModalLabel">Change:</span>
                  <span 
                    className="Commodities__ModalValue"
                    style={{ color: '#666' }}
                  >
                    {selectedCommodity.change ? `${selectedCommodity.change >= 0 ? '+' : ''}${selectedCommodity.change}` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commodities;
