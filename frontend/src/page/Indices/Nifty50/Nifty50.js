import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './Nifty50.css';
import Stock from './Stock';
import TradingViewLogo from '../../../Assests/TradingView.png';
import ScreenerLogo from '../../../Assests/Screener.jpeg';

// Nifty 50 index symbol
const NIFTY_SYMBOL = '^NSEI';

// Top 50 Nifty stocks with their symbols - moved outside component to prevent recreation
const NIFTY_STOCKS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Oil & Gas' },
  { symbol: 'TCS.NS', name: 'TCS', sector: 'Information Technology' },  
  { symbol: 'INFY.NS', name: 'Infosys', sector: 'Information Technology' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', sector: 'FMCG' },
  { symbol: 'ITC.NS', name: 'ITC', sector: 'FMCG' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', sector: 'Telecommunications' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank', sector: 'Banking' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints', sector: 'Chemicals' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki', sector: 'Automobile' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies', sector: 'Information Technology' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical', sector: 'Pharmaceuticals' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', sector: 'Automobile' },
  { symbol: 'WIPRO.NS', name: 'Wipro', sector: 'Information Technology' },
  { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement', sector: 'Cement' },
  { symbol: 'TITAN.NS', name: 'Titan Company', sector: 'Consumer Goods' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', sector: 'Financial Services' },
  { symbol: 'NESTLEIND.NS', name: 'Nestle India', sector: 'FMCG' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid Corporation', sector: 'Power' },
  { symbol: 'BAJAJFINSV.NS', name: 'Bajaj Finserv', sector: 'Financial Services' },
  { symbol: 'ADANIENT.NS', name: 'Adani Enterprises', sector: 'Diversified' },
  { symbol: 'JSWSTEEL.NS', name: 'JSW Steel', sector: 'Metals' },
  { symbol: 'TECHM.NS', name: 'Tech Mahindra', sector: 'Information Technology' },
  { symbol: 'HINDALCO.NS', name: 'Hindalco Industries', sector: 'Metals' },
  { symbol: 'ONGC.NS', name: 'ONGC', sector: 'Oil & Gas' },
  { symbol: 'TATACONSUM.NS', name: 'Tata Consumer Products', sector: 'FMCG' },
  { symbol: 'NTPC.NS', name: 'NTPC', sector: 'Power' },
  { symbol: 'INDUSINDBK.NS', name: 'IndusInd Bank', sector: 'Banking' },
  { symbol: 'COALINDIA.NS', name: 'Coal India', sector: 'Mining' },
  { symbol: 'CIPLA.NS', name: 'Cipla', sector: 'Pharmaceuticals' },
  { symbol: 'DIVISLAB.NS', name: 'Divi\'s Laboratories', sector: 'Pharmaceuticals' },
  { symbol: 'SHREECEM.NS', name: 'Shree Cement', sector: 'Cement' },
  { symbol: 'EICHERMOT.NS', name: 'Eicher Motors', sector: 'Automobile' },
  { symbol: 'HEROMOTOCO.NS', name: 'Hero MotoCorp', sector: 'Automobile' },
  { symbol: 'DRREDDY.NS', name: 'Dr Reddy\'s Laboratories', sector: 'Pharmaceuticals' },
  { symbol: 'BRITANNIA.NS', name: 'Britannia Industries', sector: 'FMCG' },
  { symbol: 'GRASIM.NS', name: 'Grasim Industries', sector: 'Cement' },
  { symbol: 'ADANIPORTS.NS', name: 'Adani Ports', sector: 'Infrastructure' },
  { symbol: 'TATASTEEL.NS', name: 'Tata Steel', sector: 'Metals' },
  { symbol: 'BPCL.NS', name: 'BPCL', sector: 'Oil & Gas' },
  { symbol: 'UPL.NS', name: 'UPL', sector: 'Chemicals' },
  { symbol: 'VEDL.NS', name: 'Vedanta', sector: 'Metals' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro', sector: 'Infrastructure' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'M&M.NS', name: 'Mahindra & Mahindra', sector: 'Automobile' },
  { symbol: 'SBILIFE.NS', name: 'SBI Life Insurance', sector: 'Insurance' },
  { symbol: 'HDFCLIFE.NS', name: 'HDFC Life Insurance', sector: 'Insurance' },
  { symbol: 'ICICIGI.NS', name: 'ICICI Lombard GIC', sector: 'Insurance' },
  { symbol: 'APOLLOHOSP.NS', name: 'Apollo Hospitals', sector: 'Healthcare' },
  { symbol: 'BAJAJ-AUTO.NS', name: 'Bajaj Auto', sector: 'Automobile' }
];

const Nifty50 = () => {
  const [niftyData, setNiftyData] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sortBy, setSortBy] = useState('marketCap'); // marketCap, change, volume, name, sector
  const [selectedSector, setSelectedSector] = useState('all'); // all, Banking, IT, etc.
  const [sortDirection, setSortDirection] = useState('desc'); // asc, desc

  // Memoize the stocks array to prevent unnecessary re-renders
  const niftyStocks = useMemo(() => NIFTY_STOCKS, []);

  // Fetch Nifty 50 index data
  const fetchNiftyData = useCallback(async () => {
    try {
      // Try direct API call without CORS proxy
      const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${NIFTY_SYMBOL}?interval=1d&range=1d`;
      
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
      
      const niftyInfo = {
        symbol: NIFTY_SYMBOL,
        name: 'Nifty 50',
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
      
      setNiftyData(niftyInfo);
    } catch (error) {
      console.error('Error fetching Nifty data:', error);
      setError('Failed to fetch Nifty 50 index data');
    }
  }, []);

  // Fetch stock data
  const fetchStockData = useCallback(async () => {
    try {
      const stockPromises = niftyStocks.map(async (stock) => {
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
  }, [niftyStocks]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    await Promise.all([fetchNiftyData(), fetchStockData()]);
    
    setLastUpdated(new Date());
    setLoading(false);
  }, [fetchNiftyData, fetchStockData]);

  // Format price
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return parseFloat(price).toFixed(2);
  };

  // Format change percentage
  const formatChangePercent = (changePercent) => {
    if (changePercent === null || changePercent === undefined) return '0.00%';
    const numChange = parseFloat(changePercent);
    if (isNaN(numChange)) return '0.00%';
    return `${numChange >= 0 ? '+' : ''}${numChange.toFixed(2)}%`;
  };

  // Get change color
  const getChangeColor = (change) => {
    if (change === null || change === undefined) return '#666';
    const numChange = parseFloat(change);
    if (isNaN(numChange)) return '#666';
    return numChange >= 0 ? '#10B981' : '#EF4444';
  };

  // Format volume
  const formatVolume = (volume) => {
    if (!volume) return 'N/A';
    const numVolume = parseFloat(volume);
    if (isNaN(numVolume)) return 'N/A';
    
    if (numVolume >= 1000000000) {
      return `${(numVolume / 1000000000).toFixed(2)}B`;
    } else if (numVolume >= 1000000) {
      return `${(numVolume / 1000000).toFixed(2)}M`;
    } else if (numVolume >= 1000) {
      return `${(numVolume / 1000).toFixed(2)}K`;
    }
    return numVolume.toLocaleString();
  };

  // Sort stocks
  const sortedStocks = [...stocks].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'marketCap':
        comparison = (b.marketCap || 0) - (a.marketCap || 0);
        break;
      case 'change':
        comparison = Math.abs(b.changePercent || 0) - Math.abs(a.changePercent || 0);
        break;
      case 'volume':
        comparison = (b.volume || 0) - (a.volume || 0);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'sector':
        comparison = a.sector.localeCompare(b.sector);
        break;
      default:
        comparison = 0;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Filter stocks by sector
  const filteredStocks = selectedSector === 'all' 
    ? sortedStocks 
    : sortedStocks.filter(stock => stock.sector === selectedSector);

  // Get unique sectors for filter dropdown
  const uniqueSectors = useMemo(() => {
    const sectors = [...new Set(niftyStocks.map(stock => stock.sector))];
    return sectors.sort();
  }, [niftyStocks]);

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  // Get sort indicator
  const getSortIndicator = (column) => {
    if (sortBy !== column) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Handle stock click
  const handleStockClick = (stock) => {
    setSelectedStock(stock);
  };

  // Close modal
  const closeModal = () => {
    setSelectedStock(null);
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  return (
    <div className="Nifty50">
      <div className="Nifty50__Container">
        {/* Header */}
        <div className="Nifty50__Header">
          <h1 className="Nifty50__Title">Nifty 50 Index</h1>
          <p className="Nifty50__Subtitle">
            Real-time data for Nifty 50 index and its top 50 constituent stocks
          </p>
        </div>

        {/* Controls */}
        <div className="Nifty50__Controls">
          <button 
            className="Nifty50__RefreshBtn"
            onClick={fetchAllData}
            disabled={loading}
          >
            {loading ? (
              <svg className="Nifty50__Spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

          <div className="Nifty50__Filter">
            <label htmlFor="sectorSelect">Filter by Sector:</label>
            <select 
              id="sectorSelect"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="Nifty50__SortSelect"
            >
              <option value="all">All Sectors</option>
              {uniqueSectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          {lastUpdated && (
            <div className="Nifty50__LastUpdated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="Nifty50__Error">
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
          <div className="Nifty50__Loading">
            <div className="Nifty50__LoadingSpinner"></div>
            <p>Fetching latest Nifty 50 data...</p>
          </div>
        )}

        {/* Nifty 50 Index Card */}
        {niftyData && !loading && (
          <div className="Nifty50__IndexCard">
            <div className="Nifty50__IndexHeader">
              <div className="Nifty50__IndexIcon">📈</div>
              <div className="Nifty50__IndexInfo">
                <h2 className="Nifty50__IndexName">{niftyData.name}</h2>
                <p className="Nifty50__IndexSymbol">{niftyData.symbol}</p>
              </div>
            </div>
            <div className="Nifty50__IndexPrice">
              <span className="Nifty50__IndexAmount">₹{formatPrice(niftyData.price)}</span>
              <span 
                className="Nifty50__IndexChange"
                style={{ color: getChangeColor(niftyData.changePercent) }}
              >
                {formatChangePercent(niftyData.changePercent)}
              </span>
            </div>
            <div className="Nifty50__IndexDetails">
              <div className="Nifty50__IndexDetail">
                <span>High:</span>
                <span>₹{formatPrice(niftyData.high)}</span>
              </div>
              <div className="Nifty50__IndexDetail">
                <span>Low:</span>
                <span>₹{formatPrice(niftyData.low)}</span>
              </div>
              <div className="Nifty50__IndexDetail">
                <span>Open:</span>
                <span>₹{formatPrice(niftyData.open)}</span>
              </div>
              <div className="Nifty50__IndexDetail">
                <span>Volume:</span>
                <span>{formatVolume(niftyData.volume)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stocks List */}
        {!loading && !error && (
          <div className="Nifty50__StocksList">
            {/* List Header */}
            <div className="Nifty50__ListHeader">
              <div 
                className="Nifty50__ListHeaderCell Nifty50__ListHeaderCell--sortable"
                onClick={() => handleSort('name')}
              >
                Stock {getSortIndicator('name')}
              </div>
              <div 
                className="Nifty50__ListHeaderCell Nifty50__ListHeaderCell--sortable"
                onClick={() => handleSort('marketCap')}
              >
                Price {getSortIndicator('marketCap')}
              </div>
              <div 
                className="Nifty50__ListHeaderCell Nifty50__ListHeaderCell--sortable"
                onClick={() => handleSort('change')}
              >
                Change {getSortIndicator('change')}
              </div>
              <div 
                className="Nifty50__ListHeaderCell Nifty50__ListHeaderCell--sortable"
                onClick={() => handleSort('volume')}
              >
                Volume {getSortIndicator('volume')}
              </div>
              <div 
                className="Nifty50__ListHeaderCell Nifty50__ListHeaderCell--sortable"
                onClick={() => handleSort('sector')}
              >
                Sector {getSortIndicator('sector')}
              </div>
              <div className="Nifty50__ListHeaderCell">
                Links
              </div>
            </div>

            {/* Stocks List Items */}
            {filteredStocks.map((stock) => (
              <div 
                key={stock.symbol}
                className={`Nifty50__ListItem ${stock.error ? 'Nifty50__ListItem--error' : ''}`}
              >
                <div 
                  className="Nifty50__ListItemCell Nifty50__ListItemCell--stock"
                  onClick={() => !stock.error && handleStockClick(stock)}
                  style={{ cursor: !stock.error ? 'pointer' : 'default' }}
                >
                  <div className="Nifty50__StockInfo">
                    <h3 className="Nifty50__StockName">{stock.name}</h3>
                    <p className="Nifty50__StockSymbol">{stock.symbol}</p>
                  </div>
                </div>

                <div className="Nifty50__ListItemCell Nifty50__ListItemCell--price">
                  {stock.error ? (
                    <span className="Nifty50__StockError">N/A</span>
                  ) : (
                    <span className="Nifty50__StockAmount">₹{formatPrice(stock.price)}</span>
                  )}
                </div>

                <div className="Nifty50__ListItemCell Nifty50__ListItemCell--change">
                  {stock.error ? (
                    <span className="Nifty50__StockError">N/A</span>
                  ) : (
                    <span 
                      className="Nifty50__StockChange"
                      style={{ color: getChangeColor(stock.changePercent) }}
                    >
                      {formatChangePercent(stock.changePercent)}
                    </span>
                  )}
                </div>

                <div className="Nifty50__ListItemCell Nifty50__ListItemCell--volume">
                  {stock.error ? (
                    <span className="Nifty50__StockError">N/A</span>
                  ) : (
                    <span className="Nifty50__StockVolume">{formatVolume(stock.volume)}</span>
                  )}
                </div>

                <div className="Nifty50__ListItemCell Nifty50__ListItemCell--sector">
                  <span className="Nifty50__StockSector">{stock.sector}</span>
                </div>

                <div className="Nifty50__ListItemCell Nifty50__ListItemCell--links">
                  <div className="Nifty50__StockLinks">
                    <a 
                      href={`https://www.tradingview.com/symbols/NSE-${stock.symbol.replace('.NS', '')}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="Nifty50__StockLink Nifty50__StockLink--tradingview"
                      onClick={(e) => e.stopPropagation()}
                      title="TradingView Chart"
                    >
                      <img 
                        src={TradingViewLogo} 
                        alt="TradingView" 
                        width="16" 
                        height="16"
                        className="Nifty50__StockLinkImage"
                      />
                    </a>
                    
                    <a 
                      href={`https://www.screener.in/company/${stock.symbol.replace('.NS', '')}/consolidated/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="Nifty50__StockLink Nifty50__StockLink--screener"
                      onClick={(e) => e.stopPropagation()}
                      title="Screener.in Analysis"
                    >
                      <img 
                        src={ScreenerLogo} 
                        alt="Screener.in" 
                        width="16" 
                        height="16"
                        className="Nifty50__StockLinkImage"
                      />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="Nifty50__Results">
          <span className="Nifty50__ResultsCount">
            {filteredStocks.length} stock{filteredStocks.length !== 1 ? 's' : ''} found
            {selectedSector !== 'all' && ` in ${selectedSector}`}
          </span>
        </div>

        {/* Summary */}
        {!loading && !error && stocks.length > 0 && (
          <div className="Nifty50__Summary">
            <h3 className="Nifty50__SummaryTitle">Market Summary</h3>
            <div className="Nifty50__SummaryStats">
              <div className="Nifty50__SummaryStat">
                <span className="Nifty50__SummaryLabel">Total Stocks</span>
                <span className="Nifty50__SummaryValue">{stocks.length}</span>
              </div>
              <div className="Nifty50__SummaryStat">
                <span className="Nifty50__SummaryLabel">Data Source</span>
                <span className="Nifty50__SummaryValue">
                  <a 
                    href="https://finance.yahoo.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="Nifty50__SummaryLink"
                  >
                    Yahoo Finance
                  </a>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stock Details Modal */}
      {selectedStock && (
        <Stock
          stock={selectedStock}
          isOpen={!!selectedStock}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Nifty50;
