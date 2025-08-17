import React, { useState, useEffect, useCallback } from 'react';
import './Stock.css';

const Stock = ({ stock, onClose }) => {
  const [stockDetails, setStockDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Fetch detailed stock information from Yahoo Finance API
  const fetchStockDetails = useCallback(async (symbol) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch detailed stock data
      const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`;
      
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

      const result = data.chart.result[0];
      const quote = result.meta;
      const indicators = result.indicators.quote[0];
      const timestamps = result.timestamp;

      // Prepare chart data
      const chartPoints = [];
      if (timestamps && indicators.close) {
        for (let i = 0; i < timestamps.length; i++) {
          if (indicators.close[i] !== null && indicators.close[i] !== undefined) {
            chartPoints.push({
              date: new Date(timestamps[i] * 1000).toLocaleDateString(),
              price: indicators.close[i],
              volume: indicators.volume[i] || 0
            });
          }
        }
      }

      const stockInfo = {
        symbol: symbol,
        name: stock.name,
        sector: stock.sector,
        price: quote.regularMarketPrice,
        change: quote.regularMarketPrice - quote.chartPreviousClose,
        changePercent: ((quote.regularMarketPrice - quote.chartPreviousClose) / quote.chartPreviousClose) * 100,
        volume: indicators.volume[0] || 0,
        high: quote.regularMarketDayHigh || quote.regularMarketPrice,
        low: quote.regularMarketDayLow || quote.regularMarketPrice,
        open: indicators.open[0] || quote.regularMarketPrice,
        previousClose: quote.chartPreviousClose,
        marketCap: quote.regularMarketPrice * 1000000, // Approximate market cap
        peRatio: quote.trailingPE || 'N/A',
        dividendYield: quote.trailingAnnualDividendYield ? (quote.trailingAnnualDividendYield * 100).toFixed(2) + '%' : 'N/A',
        beta: quote.beta || 'N/A',
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 'N/A',
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 'N/A',
        averageVolume: quote.averageVolume || 'N/A',
        chartData: chartPoints
      };

      setStockDetails(stockInfo);
      setChartData(chartPoints);
    } catch (error) {
      console.error('Error fetching stock details:', error);
      setError('Failed to fetch stock details');
    } finally {
      setLoading(false);
    }
  }, [stock.name, stock.sector]);

  // Load stock details when component mounts
  useEffect(() => {
    if (stock && stock.symbol) {
      fetchStockDetails(stock.symbol);
    }
  }, [stock, fetchStockDetails]);

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined || num === 'N/A') return 'N/A';
    return new Intl.NumberFormat('en-IN').format(Math.round(num));
  };

  // Format currency
  const formatCurrency = (num) => {
    if (num === null || num === undefined || num === 'N/A') return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Format percentage
  const formatPercentage = (num) => {
    if (num === null || num === undefined || num === 'N/A') return 'N/A';
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!stock) return null;

  return (
    <div className="stock-modal-overlay" onClick={handleBackdropClick}>
      <div className="stock-modal">
        <div className="stock-modal-header">
          <div className="stock-modal-title">
            <h2>{stock.name}</h2>
            <span className="stock-modal-symbol">{stock.symbol.replace('.NS', '')}</span>
            <span className="stock-modal-sector">{stock.sector}</span>
          </div>
          <button className="stock-modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="stock-modal-body">
          {loading && (
            <div className="stock-loading">
              <div className="stock-loading-spinner"></div>
              <p>Loading stock details...</p>
            </div>
          )}

          {error && (
            <div className="stock-error">
              <h3>Error</h3>
              <p>{error}</p>
              <button onClick={() => fetchStockDetails(stock.symbol)}>Retry</button>
            </div>
          )}

          {stockDetails && !loading && !error && (
            <>
              {/* Price Overview */}
              <div className="stock-price-overview">
                <div className="stock-current-price">
                  <span className="stock-price-value">{formatCurrency(stockDetails.price)}</span>
                  <span className={`stock-price-change ${stockDetails.change >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(stockDetails.change)} ({formatPercentage(stockDetails.changePercent)})
                  </span>
                </div>
                <div className="stock-price-details">
                  <div className="stock-price-item">
                    <span className="stock-price-label">Open</span>
                    <span className="stock-price-value-small">{formatCurrency(stockDetails.open)}</span>
                  </div>
                  <div className="stock-price-item">
                    <span className="stock-price-label">High</span>
                    <span className="stock-price-value-small">{formatCurrency(stockDetails.high)}</span>
                  </div>
                  <div className="stock-price-item">
                    <span className="stock-price-label">Low</span>
                    <span className="stock-price-value-small">{formatCurrency(stockDetails.low)}</span>
                  </div>
                  <div className="stock-price-item">
                    <span className="stock-price-label">Previous Close</span>
                    <span className="stock-price-value-small">{formatCurrency(stockDetails.previousClose)}</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="stock-statistics">
                <h3>Key Statistics</h3>
                <div className="stock-stats-grid">
                  <div className="stock-stat-item">
                    <span className="stock-stat-label">Market Cap</span>
                    <span className="stock-stat-value">{formatCurrency(stockDetails.marketCap)}</span>
                  </div>
                  <div className="stock-stat-item">
                    <span className="stock-stat-label">P/E Ratio</span>
                    <span className="stock-stat-value">{stockDetails.peRatio}</span>
                  </div>
                  <div className="stock-stat-item">
                    <span className="stock-stat-label">Dividend Yield</span>
                    <span className="stock-stat-value">{stockDetails.dividendYield}</span>
                  </div>
                  <div className="stock-stat-item">
                    <span className="stock-stat-label">Beta</span>
                    <span className="stock-stat-value">{stockDetails.beta}</span>
                  </div>
                  <div className="stock-stat-item">
                    <span className="stock-stat-label">52 Week High</span>
                    <span className="stock-stat-value">{formatCurrency(stockDetails.fiftyTwoWeekHigh)}</span>
                  </div>
                  <div className="stock-stat-item">
                    <span className="stock-stat-label">52 Week Low</span>
                    <span className="stock-stat-value">{formatCurrency(stockDetails.fiftyTwoWeekLow)}</span>
                  </div>
                  <div className="stock-stat-item">
                    <span className="stock-stat-label">Volume</span>
                    <span className="stock-stat-value">{formatNumber(stockDetails.volume)}</span>
                  </div>
                  <div className="stock-stat-item">
                    <span className="stock-stat-label">Avg Volume</span>
                    <span className="stock-stat-value">{formatNumber(stockDetails.averageVolume)}</span>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder */}
              {chartData && chartData.length > 0 && (
                <div className="stock-chart">
                  <h3>Price Chart (5 Days)</h3>
                  <div className="stock-chart-container">
                    <div className="stock-chart-placeholder">
                      <p>Chart data available for {chartData.length} days</p>
                      <div className="stock-chart-data">
                        {chartData.slice(-5).map((point, index) => (
                          <div key={index} className="stock-chart-point">
                            <span className="stock-chart-date">{point.date}</span>
                            <span className="stock-chart-price">{formatCurrency(point.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="stock-additional-info">
                <h3>About {stock.name}</h3>
                <p>
                  {stock.name} is a leading {stock.sector.toLowerCase()} company listed on the National Stock Exchange (NSE). 
                  The company is part of the Bank Nifty index, which represents the performance of the banking sector in India.
                </p>
                <p>
                  Bank Nifty is a sectoral index that tracks the performance of the 12 most liquid and large capitalized banking stocks 
                  listed on the NSE. It provides investors with exposure to the banking sector's performance.
                </p>
              </div>

              {/* External Links */}
              <div className="stock-external-links">
                <h3>External Links</h3>
                <div className="stock-links">
                  <a 
                    href={`https://www.tradingview.com/symbols/NSE-${stock.symbol.replace('.NS', '')}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stock-link tradingview-link"
                  >
                    View on TradingView
                  </a>
                  <a 
                    href={`https://www.screener.in/company/${stock.symbol.replace('.NS', '')}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stock-link screener-link"
                  >
                    View on Screener
                  </a>
                  <a 
                    href={`https://finance.yahoo.com/quote/${stock.symbol}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stock-link yahoo-link"
                  >
                    View on Yahoo Finance
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
