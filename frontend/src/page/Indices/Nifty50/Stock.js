import React, { useState, useEffect, useCallback } from 'react';
import './Stock.css';

const Stock = ({ stock, isOpen, onClose }) => {
  const [stockDetails, setStockDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Fetch detailed stock information from Yahoo Finance API
  const fetchStockDetails = useCallback(async (symbol) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch detailed quote information
      const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d&includePrePost=true`;
      const quoteResponse = await fetch(quoteUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!quoteResponse.ok) {
        throw new Error(`Failed to fetch stock data: ${quoteResponse.status}`);
      }

      const quoteData = await quoteResponse.json();
      
      if (!quoteData.chart || !quoteData.chart.result || !quoteData.chart.result[0]) {
        throw new Error('Invalid data structure received');
      }

      const result = quoteData.chart.result[0];
      const meta = result.meta;
      const indicators = result.indicators.quote[0];
      const timestamps = result.timestamp;

      // Get the latest data point
      const latestIndex = timestamps.length - 1;
      
      const details = {
        symbol: symbol,
        name: stock.name,
        sector: stock.sector,
        currentPrice: meta.regularMarketPrice,
        previousClose: meta.previousClose,
        open: indicators.open[latestIndex],
        high: indicators.high[latestIndex],
        low: indicators.low[latestIndex],
        volume: indicators.volume[latestIndex],
        change: meta.regularMarketPrice - meta.previousClose,
        changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
        marketCap: meta.marketCap,
        peRatio: meta.trailingPE,
        dividendYield: meta.trailingAnnualDividendYield ? meta.trailingAnnualDividendYield * 100 : null,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
        averageVolume: meta.averageVolume,
        beta: meta.beta,
        currency: meta.currency,
        exchange: meta.exchangeName,
        lastUpdated: new Date(meta.regularMarketTime * 1000)
      };

      setStockDetails(details);

      // Fetch chart data for the last 30 days
      const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=30d`;
      const chartResponse = await fetch(chartUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (chartResponse.ok) {
        const chartDataResponse = await chartResponse.json();
        if (chartDataResponse.chart && chartDataResponse.chart.result && chartDataResponse.chart.result[0]) {
          const chartResult = chartDataResponse.chart.result[0];
          const chartTimestamps = chartResult.timestamp;
          const chartPrices = chartResult.indicators.quote[0].close;
          
          const formattedChartData = chartTimestamps.map((timestamp, index) => ({
            date: new Date(timestamp * 1000).toLocaleDateString(),
            price: chartPrices[index] || 0
          })).filter(item => item.price > 0);

          setChartData(formattedChartData);
        }
      }

    } catch (err) {
      console.error('Error fetching stock details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [stock.name, stock.sector]); // Removed stock.symbol since it's passed as parameter

  // Fetch details when modal opens
  useEffect(() => {
    if (isOpen && stock) {
      fetchStockDetails(stock.symbol);
    }
  }, [isOpen, stock, fetchStockDetails]); // Added fetchStockDetails to dependencies

  // Format functions
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChangePercent = (changePercent) => {
    if (!changePercent) return 'N/A';
    const sign = changePercent >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  const formatVolume = (volume) => {
    if (!volume) return 'N/A';
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(2)}B`;
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toString();
  };

  const formatMarketCap = (marketCap) => {
    if (!marketCap) return 'N/A';
    if (marketCap >= 1000000000000) {
      return `₹${(marketCap / 1000000000000).toFixed(2)}T`;
    } else if (marketCap >= 1000000000) {
      return `₹${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `₹${(marketCap / 1000000).toFixed(2)}M`;
    }
    return `₹${marketCap.toString()}`;
  };

  const getChangeColor = (change) => {
    if (!change) return '#666';
    return change >= 0 ? '#22c55e' : '#ef4444';
  };

  if (!isOpen) return null;

  return (
    <div className="Stock__Modal" onClick={onClose}>
      <div className="Stock__ModalContent" onClick={(e) => e.stopPropagation()}>
        <div className="Stock__ModalHeader">
          <div className="Stock__ModalTitle">
            <h2>{stock.name}</h2>
            <span className="Stock__ModalSymbol">{stock.symbol}</span>
          </div>
          <button className="Stock__ModalClose" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="Stock__ModalBody">
          {loading && (
            <div className="Stock__Loading">
              <div className="Stock__Spinner"></div>
              <p>Loading stock details...</p>
            </div>
          )}

          {error && (
            <div className="Stock__Error">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <p>Error: {error}</p>
            </div>
          )}

          {stockDetails && !loading && !error && (
            <>
              {/* Price Section */}
              <div className="Stock__PriceSection">
                <div className="Stock__CurrentPrice">
                  <span className="Stock__Price">₹{formatPrice(stockDetails.currentPrice)}</span>
                  <span 
                    className="Stock__Change"
                    style={{ color: getChangeColor(stockDetails.change) }}
                  >
                    {formatChangePercent(stockDetails.changePercent)}
                  </span>
                </div>
                <div className="Stock__PriceChange">
                  <span 
                    className="Stock__ChangeAmount"
                    style={{ color: getChangeColor(stockDetails.change) }}
                  >
                    ₹{formatPrice(Math.abs(stockDetails.change))}
                  </span>
                  <span className="Stock__ChangeText">
                    {stockDetails.change >= 0 ? 'up' : 'down'} from previous close
                  </span>
                </div>
              </div>

              {/* Key Statistics */}
              <div className="Stock__StatsSection">
                <h3>Key Statistics</h3>
                <div className="Stock__StatsGrid">
                  <div className="Stock__StatItem">
                    <span className="Stock__StatLabel">Previous Close</span>
                    <span className="Stock__StatValue">₹{formatPrice(stockDetails.previousClose)}</span>
                  </div>
                  <div className="Stock__StatItem">
                    <span className="Stock__StatLabel">Open</span>
                    <span className="Stock__StatValue">₹{formatPrice(stockDetails.open)}</span>
                  </div>
                  <div className="Stock__StatItem">
                    <span className="Stock__StatLabel">Day High</span>
                    <span className="Stock__StatValue">₹{formatPrice(stockDetails.high)}</span>
                  </div>
                  <div className="Stock__StatItem">
                    <span className="Stock__StatLabel">Day Low</span>
                    <span className="Stock__StatValue">₹{formatPrice(stockDetails.low)}</span>
                  </div>
                  <div className="Stock__StatItem">
                    <span className="Stock__StatLabel">Volume</span>
                    <span className="Stock__StatValue">{formatVolume(stockDetails.volume)}</span>
                  </div>
                  <div className="Stock__StatItem">
                    <span className="Stock__StatLabel">Avg Volume</span>
                    <span className="Stock__StatValue">{formatVolume(stockDetails.averageVolume)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="Stock__DetailsSection">
                <h3>Additional Details</h3>
                <div className="Stock__DetailsGrid">
                  <div className="Stock__DetailItem">
                    <span className="Stock__DetailLabel">Market Cap</span>
                    <span className="Stock__DetailValue">{formatMarketCap(stockDetails.marketCap)}</span>
                  </div>
                  <div className="Stock__DetailItem">
                    <span className="Stock__DetailLabel">P/E Ratio</span>
                    <span className="Stock__DetailValue">{stockDetails.peRatio ? stockDetails.peRatio.toFixed(2) : 'N/A'}</span>
                  </div>
                  <div className="Stock__DetailItem">
                    <span className="Stock__DetailLabel">Dividend Yield</span>
                    <span className="Stock__DetailValue">{stockDetails.dividendYield ? `${stockDetails.dividendYield.toFixed(2)}%` : 'N/A'}</span>
                  </div>
                  <div className="Stock__DetailItem">
                    <span className="Stock__DetailLabel">52 Week High</span>
                    <span className="Stock__DetailValue">₹{formatPrice(stockDetails.fiftyTwoWeekHigh)}</span>
                  </div>
                  <div className="Stock__DetailItem">
                    <span className="Stock__DetailLabel">52 Week Low</span>
                    <span className="Stock__DetailValue">₹{formatPrice(stockDetails.fiftyTwoWeekLow)}</span>
                  </div>
                  <div className="Stock__DetailItem">
                    <span className="Stock__DetailLabel">Beta</span>
                    <span className="Stock__DetailValue">{stockDetails.beta ? stockDetails.beta.toFixed(2) : 'N/A'}</span>
                  </div>
                  <div className="Stock__DetailItem">
                    <span className="Stock__DetailLabel">Sector</span>
                    <span className="Stock__DetailValue">{stockDetails.sector}</span>
                  </div>
                  <div className="Stock__DetailItem">
                    <span className="Stock__DetailLabel">Exchange</span>
                    <span className="Stock__DetailValue">{stockDetails.exchange}</span>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              {chartData && chartData.length > 0 && (
                <div className="Stock__ChartSection">
                  <h3>30-Day Price Chart</h3>
                  <div className="Stock__Chart">
                    <div className="Stock__ChartContainer">
                      {chartData.map((point, index) => (
                        <div 
                          key={index}
                          className="Stock__ChartBar"
                          style={{
                            height: `${(point.price / Math.max(...chartData.map(p => p.price))) * 100}%`,
                            backgroundColor: getChangeColor(point.price - (index > 0 ? chartData[index - 1].price : point.price))
                          }}
                          title={`${point.date}: ₹${formatPrice(point.price)}`}
                        />
                      ))}
                    </div>
                    <div className="Stock__ChartLabels">
                      <span>{chartData[0]?.date}</span>
                      <span>{chartData[Math.floor(chartData.length / 2)]?.date}</span>
                      <span>{chartData[chartData.length - 1]?.date}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Last Updated */}
              <div className="Stock__LastUpdated">
                <p>Last updated: {stockDetails.lastUpdated.toLocaleString()}</p>
                <p>Data source: <a href="https://finance.yahoo.com" target="_blank" rel="noopener noreferrer">Yahoo Finance</a></p>
              </div>

              {/* External Links Section */}
              <div className="Stock__ExternalLinks">
                <h3>External Links</h3>
                <div className="Stock__LinksGrid">
                  <a 
                    href={`https://www.tradingview.com/symbols/NSE-${stockDetails.symbol.replace('.NS', '')}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="Stock__ExternalLink Stock__ExternalLink--tradingview"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span>TradingView Chart</span>
                  </a>
                  
                  <a 
                    href={`https://www.screener.in/company/${stockDetails.symbol.replace('.NS', '')}/consolidated/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="Stock__ExternalLink Stock__ExternalLink--screener"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3h18v18H3z"/>
                      <path d="M9 9h6v6H9z"/>
                      <path d="M3 9h6"/>
                      <path d="M15 9h6"/>
                      <path d="M3 15h6"/>
                      <path d="M15 15h6"/>
                    </svg>
                    <span>Screener.in Analysis</span>
                  </a>
                  
                  <a 
                    href={`https://finance.yahoo.com/quote/${stockDetails.symbol}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="Stock__ExternalLink Stock__ExternalLink--yahoo"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span>Yahoo Finance</span>
                  </a>
                  
                  <a 
                    href={`https://www.moneycontrol.com/india/stockpricequote/${stockDetails.symbol.replace('.NS', '').toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="Stock__ExternalLink Stock__ExternalLink--moneycontrol"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                      <path d="M12 6v2m0 8v2"/>
                    </svg>
                    <span>MoneyControl</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stock;
