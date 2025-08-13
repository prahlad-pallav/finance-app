import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './Sensex.css';
import Stock from './Stock';
import TradingViewLogo from '../../../Assests/TradingView.png';
import ScreenerLogo from '../../../Assests/Screener.jpeg';

// Sensex index symbol
const SENSEX_SYMBOL = '^BSESN';

// Top 30 Sensex stocks with their symbols - moved outside component to prevent recreation
const SENSEX_STOCKS = [
  { symbol: 'ADANIPORTS.BO', name: 'Adani Ports & SEZ', sector: 'Infrastructure' },
  { symbol: 'ASIANPAINT.BO', name: 'Asian Paints', sector: 'Chemicals' },
  { symbol: 'AXISBANK.BO', name: 'Axis Bank', sector: 'Banking' },
  { symbol: 'BAJFINANCE.BO', name: 'Bajaj Finance', sector: 'Financial Services' },
  { symbol: 'BAJAJFINSV.BO', name: 'Bajaj Finserv', sector: 'Financial Services' },
  { symbol: 'BEL.BO', name: 'Bharat Electronics', sector: 'Defense' },
  { symbol: 'BHARTIARTL.BO', name: 'Bharti Airtel', sector: 'Telecommunications' },
  { symbol: 'ETERNAL.BO', name: 'Eternal', sector: 'Chemicals' },
  { symbol: 'HCLTECH.BO', name: 'HCLTech', sector: 'Information Technology' },
  { symbol: 'HDFCBANK.BO', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'HINDUNILVR.BO', name: 'Hindustan Unilever', sector: 'FMCG' },
  { symbol: 'ICICIBANK.BO', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'INFY.BO', name: 'Infosys', sector: 'Information Technology' },
  { symbol: 'ITC.BO', name: 'ITC', sector: 'FMCG' },
  { symbol: 'KOTAKBANK.BO', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'LT.BO', name: 'Larsen & Toubro', sector: 'Infrastructure' },
  { symbol: 'M&M.BO', name: 'Mahindra & Mahindra', sector: 'Automobile' },
  { symbol: 'MARUTI.BO', name: 'Maruti Suzuki', sector: 'Automobile' },
  { symbol: 'NTPC.BO', name: 'NTPC', sector: 'Power' },
  { symbol: 'POWERGRID.BO', name: 'Power Grid', sector: 'Power' },
  { symbol: 'RELIANCE.BO', name: 'Reliance Industries', sector: 'Oil & Gas' },
  { symbol: 'SBIN.BO', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'SUNPHARMA.BO', name: 'Sun Pharma', sector: 'Pharmaceuticals' },
  { symbol: 'TCS.BO', name: 'Tata Consultancy Services', sector: 'Information Technology' },
  { symbol: 'TATAMOTORS.BO', name: 'Tata Motors', sector: 'Automobile' },
  { symbol: 'TATASTEEL.BO', name: 'Tata Steel', sector: 'Metals' },
  { symbol: 'TECHM.BO', name: 'Tech Mahindra', sector: 'Information Technology' },
  { symbol: 'TITAN.BO', name: 'Titan Company', sector: 'Consumer Goods' },
  { symbol: 'TRENT.BO', name: 'Trent', sector: 'Retail' },
  { symbol: 'ULTRACEMCO.BO', name: 'UltraTech Cement', sector: 'Cement' }
];

const Sensex = () => {
  const [sensexData, setSensexData] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sortBy, setSortBy] = useState('marketCap'); // marketCap, change, volume, name, sector
  const [selectedSector, setSelectedSector] = useState('all'); // all, Banking, IT, etc.
  const [sortDirection, setSortDirection] = useState('desc'); // asc, desc

  // Memoize the stocks array to prevent unnecessary re-renders
  const sensexStocks = useMemo(() => SENSEX_STOCKS, []);

  // Fetch Sensex index data
  const fetchSensexData = useCallback(async () => {
    try {
      // Try direct API call without CORS proxy
      const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${SENSEX_SYMBOL}?interval=1d&range=1d`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.chart || !data.chart.result || !data.chart.result[0]) {
        throw new Error('Invalid data structure received');
      }
      
      const quote = data.chart.result[0].meta;
      const indicators = data.chart.result[0].indicators.quote[0];
      
      const sensexInfo = {
        symbol: SENSEX_SYMBOL,
        name: 'Sensex',
        price: quote.regularMarketPrice,
        change: quote.regularMarketPrice - quote.chartPreviousClose,
        changePercent: ((quote.regularMarketPrice - quote.chartPreviousClose) / quote.chartPreviousClose) * 100,
        volume: indicators.volume[0],
        high: quote.regularMarketDayHigh,
        low: quote.regularMarketDayLow,
        open: indicators.open[0],
        previousClose: quote.chartPreviousClose,
        timestamp: quote.regularMarketTime * 1000
      };
      
      setSensexData(sensexInfo);
    } catch (error) {
      console.error('Error fetching Sensex data:', error);
      setError('Failed to fetch Sensex index data');
    }
  }, []);

  // Fetch stock data
  const fetchStockData = useCallback(async () => {
    try {
      const stockPromises = sensexStocks.map(async (stock) => {
        try {
          // Add delay to prevent rate limiting
          await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
          
          // Use direct API call without CORS proxy
          const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${stock.symbol}?interval=1d&range=1d`;
          
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (!data.chart || !data.chart.result || !data.chart.result[0]) {
            throw new Error('Invalid data structure received');
          }
          
          const quote = data.chart.result[0].meta;
          const indicators = data.chart.result[0].indicators.quote[0];
          
          // Validate required fields
          if (!quote.regularMarketPrice || !quote.chartPreviousClose) {
            throw new Error('Missing required price data');
          }
          
          return {
            ...stock,
            price: quote.regularMarketPrice,
            change: quote.regularMarketPrice - quote.chartPreviousClose,
            changePercent: ((quote.regularMarketPrice - quote.chartPreviousClose) / quote.chartPreviousClose) * 100,
            volume: indicators.volume[0] || 0,
            high: quote.regularMarketDayHigh || quote.regularMarketPrice,
            low: quote.regularMarketDayLow || quote.regularMarketPrice,
            open: indicators.open[0] || quote.regularMarketPrice,
            previousClose: quote.chartPreviousClose,
            marketCap: quote.regularMarketPrice * 1000000, // Approximate market cap
            timestamp: quote.regularMarketTime * 1000
          };
        } catch (error) {
          console.error(`Error fetching ${stock.symbol}:`, error);
          return {
            ...stock,
            price: null,
            change: 0,
            changePercent: 0,
            volume: 0,
            error: true,
            errorMessage: error.message
          };
        }
      });

      const results = await Promise.all(stockPromises);
      setStocks(results);
      
      // Log successful fetches
      const successfulFetches = results.filter(stock => !stock.error);
      const failedFetches = results.filter(stock => stock.error);
      
      console.log(`Successfully fetched ${successfulFetches.length} stocks`);
      if (failedFetches.length > 0) {
        console.warn(`Failed to fetch ${failedFetches.length} stocks:`, failedFetches.map(s => s.symbol));
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to fetch stock data');
    }
  }, [sensexStocks]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([fetchSensexData(), fetchStockData()]);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load market data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchSensexData, fetchStockData]);

  // Get unique sectors for filtering
  const sectors = useMemo(() => {
    const sectorSet = new Set(sensexStocks.map(stock => stock.sector));
    return ['all', ...Array.from(sectorSet).sort()];
  }, [sensexStocks]);

  // Filter and sort stocks
  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks;
    
    // Filter by sector
    if (selectedSector !== 'all') {
      filtered = filtered.filter(stock => stock.sector === selectedSector);
    }
    
    // Sort stocks
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'marketCap':
          aValue = a.marketCap || 0;
          bValue = b.marketCap || 0;
          break;
        case 'change':
          aValue = a.change || 0;
          bValue = b.change || 0;
          break;
        case 'volume':
          aValue = a.volume || 0;
          bValue = b.volume || 0;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'sector':
          aValue = a.sector.toLowerCase();
          bValue = b.sector.toLowerCase();
          break;
        default:
          aValue = a.marketCap || 0;
          bValue = b.marketCap || 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [stocks, selectedSector, sortBy, sortDirection]);

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('en-IN').format(Math.round(num));
  };

  // Format currency
  const formatCurrency = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Format percentage
  const formatPercentage = (num) => {
    if (num === null || num === undefined) return '-';
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  // Get sort icon
  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="nifty50-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Sensex data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nifty50-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="nifty50-container">
      {/* Header */}
      <div className="nifty50-header">
        <div className="nifty50-title">
          <h1>Sensex - Bombay Stock Exchange</h1>
          <p>Bombay Stock Exchange Sensitive Index (BSE SENSEX)</p>
        </div>
        <div className="nifty50-actions">
          <button 
            className="refresh-btn"
            onClick={() => window.location.reload()}
            title="Refresh data"
          >
            🔄 Refresh
          </button>
          {lastUpdated && (
            <span className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Index Overview */}
      {sensexData && (
        <div className="index-overview">
          <div className="index-main">
            <div className="index-name">
              <h2>{sensexData.name}</h2>
              <span className="index-symbol">{sensexData.symbol}</span>
            </div>
            <div className="index-price">
              <span className="price-value">{formatCurrency(sensexData.price)}</span>
              <span className={`price-change ${sensexData.change >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(sensexData.change)} ({formatPercentage(sensexData.changePercent)})
              </span>
            </div>
          </div>
          <div className="index-details">
            <div className="detail-item">
              <span className="detail-label">Open</span>
              <span className="detail-value">{formatCurrency(sensexData.open)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">High</span>
              <span className="detail-value">{formatCurrency(sensexData.high)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Low</span>
              <span className="detail-value">{formatCurrency(sensexData.low)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Previous Close</span>
              <span className="detail-value">{formatCurrency(sensexData.previousClose)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Volume</span>
              <span className="detail-value">{formatNumber(sensexData.volume)}</span>
            </div>
          </div>
        </div>
      )}

      {/* External Links */}
      <div className="external-links">
        <a 
          href="https://www.tradingview.com/symbols/BSE-SENSEX/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="external-link"
        >
          <img src={TradingViewLogo} alt="TradingView" />
          <span>View on TradingView</span>
        </a>
        <a 
          href="https://www.screener.in/company/SENSEX/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="external-link"
        >
          <img src={ScreenerLogo} alt="Screener" />
          <span>View on Screener</span>
        </a>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="sector-filter">Filter by Sector:</label>
          <select 
            id="sector-filter"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>
                {sector === 'all' ? 'All Sectors' : sector}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Sort by:</label>
          <div className="sort-buttons">
            <button 
              className={`sort-btn ${sortBy === 'marketCap' ? 'active' : ''}`}
              onClick={() => handleSortChange('marketCap')}
            >
              Market Cap {getSortIcon('marketCap')}
            </button>
            <button 
              className={`sort-btn ${sortBy === 'change' ? 'active' : ''}`}
              onClick={() => handleSortChange('change')}
            >
              Change {getSortIcon('change')}
            </button>
            <button 
              className={`sort-btn ${sortBy === 'volume' ? 'active' : ''}`}
              onClick={() => handleSortChange('volume')}
            >
              Volume {getSortIcon('volume')}
            </button>
            <button 
              className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
              onClick={() => handleSortChange('name')}
            >
              Name {getSortIcon('name')}
            </button>
            <button 
              className={`sort-btn ${sortBy === 'sector' ? 'active' : ''}`}
              onClick={() => handleSortChange('sector')}
            >
              Sector {getSortIcon('sector')}
            </button>
          </div>
        </div>
      </div>

      {/* Stocks Table */}
      <div className="stocks-container">
        <div className="stocks-header">
          <h3>Sensex Constituents ({filteredAndSortedStocks.length} stocks)</h3>
        </div>
        
        <div className="stocks-table-container">
          <table className="stocks-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Sector</th>
                <th>Price</th>
                <th>Change</th>
                <th>Change %</th>
                <th>Volume</th>
                <th>Market Cap</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedStocks.map((stock) => (
                <tr key={stock.symbol} className={stock.error ? 'error-row' : ''}>
                  <td className="stock-name">
                    <div className="stock-info">
                      <span className="stock-symbol">{stock.symbol.replace('.BO', '')}</span>
                      <span className="stock-full-name">{stock.name}</span>
                    </div>
                  </td>
                  <td className="stock-sector">{stock.sector}</td>
                  <td className="stock-price">
                    {stock.error ? '-' : formatCurrency(stock.price)}
                  </td>
                  <td className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    {stock.error ? '-' : formatCurrency(stock.change)}
                  </td>
                  <td className={`stock-change-percent ${stock.changePercent >= 0 ? 'positive' : 'negative'}`}>
                    {stock.error ? '-' : formatPercentage(stock.changePercent)}
                  </td>
                  <td className="stock-volume">
                    {stock.error ? '-' : formatNumber(stock.volume)}
                  </td>
                  <td className="stock-market-cap">
                    {stock.error ? '-' : formatCurrency(stock.marketCap)}
                  </td>
                  <td className="stock-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => setSelectedStock(stock)}
                      disabled={stock.error}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Details Modal */}
      {selectedStock && (
        <Stock 
          stock={selectedStock} 
          onClose={() => setSelectedStock(null)} 
        />
      )}
    </div>
  );
};

export default Sensex; 