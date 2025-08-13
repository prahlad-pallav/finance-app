import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './BankNifty.css';
import Stock from './Stock';
import TradingViewLogo from '../../../Assests/TradingView.png';
import ScreenerLogo from '../../../Assests/Screener.jpeg';

// Bank Nifty index symbol
const BANKNIFTY_SYMBOL = '^NSEBANK';

// Top 12 Bank Nifty stocks with their symbols - moved outside component to prevent recreation
const BANKNIFTY_STOCKS = [
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank', sector: 'Banking' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'INDUSINDBK.NS', name: 'IndusInd Bank', sector: 'Banking' },
  { symbol: 'BANKBARODA.NS', name: 'Bank of Baroda', sector: 'Banking' },
  { symbol: 'PNB.NS', name: 'Punjab National Bank', sector: 'Banking' },
  { symbol: 'CANBK.NS', name: 'Canara Bank', sector: 'Banking' },
  { symbol: 'IDFCFIRSTB.NS', name: 'IDFC First Bank', sector: 'Banking' },
  { symbol: 'FEDERALBNK.NS', name: 'Federal Bank', sector: 'Banking' },
  { symbol: 'AUBANK.NS', name: 'AU Small Finance Bank', sector: 'Banking' }
];

const BankNifty = () => {
  const [bankNiftyData, setBankNiftyData] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sortBy, setSortBy] = useState('marketCap'); // marketCap, change, volume, name, sector
  const [selectedSector, setSelectedSector] = useState('all'); // all, Banking, etc.
  const [sortDirection, setSortDirection] = useState('desc'); // asc, desc

  // Memoize the stocks array to prevent unnecessary re-renders
  const bankNiftyStocks = useMemo(() => BANKNIFTY_STOCKS, []);

  // Fetch Bank Nifty index data
  const fetchBankNiftyData = useCallback(async () => {
    try {
      // Try direct API call without CORS proxy
      const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${BANKNIFTY_SYMBOL}?interval=1d&range=1d`;
      
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
      
      const bankNiftyInfo = {
        symbol: BANKNIFTY_SYMBOL,
        name: 'Bank Nifty',
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
      
      setBankNiftyData(bankNiftyInfo);
    } catch (error) {
      console.error('Error fetching Bank Nifty data:', error);
      setError('Failed to fetch Bank Nifty index data');
    }
  }, []);

  // Fetch stock data
  const fetchStockData = useCallback(async () => {
    try {
      const stockPromises = bankNiftyStocks.map(async (stock) => {
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
  }, [bankNiftyStocks]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([fetchBankNiftyData(), fetchStockData()]);
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
  }, [fetchBankNiftyData, fetchStockData]);

  // Get unique sectors for filtering
  const sectors = useMemo(() => {
    const sectorSet = new Set(bankNiftyStocks.map(stock => stock.sector));
    return ['all', ...Array.from(sectorSet).sort()];
  }, [bankNiftyStocks]);

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
          <p>Loading Bank Nifty data...</p>
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
          <h1>Bank Nifty - NSE</h1>
          <p>NSE Bank Nifty Index (NIFTY BANK)</p>
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
      {bankNiftyData && (
        <div className="index-overview">
          <div className="index-main">
            <div className="index-name">
              <h2>{bankNiftyData.name}</h2>
              <span className="index-symbol">{bankNiftyData.symbol}</span>
            </div>
            <div className="index-price">
              <span className="price-value">{formatCurrency(bankNiftyData.price)}</span>
              <span className={`price-change ${bankNiftyData.change >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(bankNiftyData.change)} ({formatPercentage(bankNiftyData.changePercent)})
              </span>
            </div>
          </div>
          <div className="index-details">
            <div className="detail-item">
              <span className="detail-label">Open</span>
              <span className="detail-value">{formatCurrency(bankNiftyData.open)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">High</span>
              <span className="detail-value">{formatCurrency(bankNiftyData.high)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Low</span>
              <span className="detail-value">{formatCurrency(bankNiftyData.low)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Previous Close</span>
              <span className="detail-value">{formatCurrency(bankNiftyData.previousClose)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Volume</span>
              <span className="detail-value">{formatNumber(bankNiftyData.volume)}</span>
            </div>
          </div>
        </div>
      )}

      {/* External Links */}
      <div className="external-links">
        <a 
          href="https://www.tradingview.com/symbols/NSE-NIFTYBANK/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="external-link"
        >
          <img src={TradingViewLogo} alt="TradingView" />
          <span>View on TradingView</span>
        </a>
        <a 
          href="https://www.screener.in/company/NIFTYBANK/" 
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
          <h3>Bank Nifty Constituents ({filteredAndSortedStocks.length} stocks)</h3>
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
                      <span className="stock-symbol">{stock.symbol.replace('.NS', '')}</span>
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

export default BankNifty;
