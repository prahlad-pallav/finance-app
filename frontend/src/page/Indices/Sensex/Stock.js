import React, { useState, useEffect, useCallback } from 'react';
import './Stock.css';

const Stock = ({ stock, onClose }) => {
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
  }, [stock.name, stock.sector]);

  // Load stock details when component mounts
  useEffect(() => {
    if (stock && stock.symbol) {
      fetchStockDetails(stock.symbol);
    }
  }, [stock, fetchStockDetails]);

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
            <span className="stock-modal-symbol">{stock.symbol.replace('.BO', '')}</span>
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
                  <span className="stock-price-value">{formatCurrency(stockDetails.currentPrice)}</span>
                  <span className={`stock-price-change ${stockDetails.change >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(stockDetails.change)} ({formatPercentage(stockDetails.changePercent)})
                  </span>
                </div>
                <div className="stock-price-details">
                  <div className="stock-price-detail">
                    <span className="detail-label">Open</span>
                    <span className="detail-value">{formatCurrency(stockDetails.open)}</span>
                  </div>
                  <div className="stock-price-detail">
                    <span className="detail-label">High</span>
                    <span className="detail-value">{formatCurrency(stockDetails.high)}</span>
                  </div>
                  <div className="stock-price-detail">
                    <span className="detail-label">Low</span>
                    <span className="detail-value">{formatCurrency(stockDetails.low)}</span>
                  </div>
                  <div className="stock-price-detail">
                    <span className="detail-label">Previous Close</span>
                    <span className="detail-value">{formatCurrency(stockDetails.previousClose)}</span>
                  </div>
                </div>
              </div>

              {/* Key Statistics */}
              <div className="stock-statistics">
                <h3>Key Statistics</h3>
                <div className="stock-stats-grid">
                  <div className="stock-stat">
                    <span className="stat-label">Market Cap</span>
                    <span className="stat-value">{formatCurrency(stockDetails.marketCap)}</span>
                  </div>
                  <div className="stock-stat">
                    <span className="stat-label">P/E Ratio</span>
                    <span className="stat-value">{stockDetails.peRatio ? stockDetails.peRatio.toFixed(2) : '-'}</span>
                  </div>
                  <div className="stock-stat">
                    <span className="stat-label">Dividend Yield</span>
                    <span className="stat-value">{stockDetails.dividendYield ? formatPercentage(stockDetails.dividendYield) : '-'}</span>
                  </div>
                  <div className="stock-stat">
                    <span className="stat-label">Beta</span>
                    <span className="stat-value">{stockDetails.beta ? stockDetails.beta.toFixed(2) : '-'}</span>
                  </div>
                  <div className="stock-stat">
                    <span className="stat-label">52 Week High</span>
                    <span className="stat-value">{formatCurrency(stockDetails.fiftyTwoWeekHigh)}</span>
                  </div>
                  <div className="stock-stat">
                    <span className="stat-label">52 Week Low</span>
                    <span className="stat-value">{formatCurrency(stockDetails.fiftyTwoWeekLow)}</span>
                  </div>
                  <div className="stock-stat">
                    <span className="stat-label">Volume</span>
                    <span className="stat-value">{formatNumber(stockDetails.volume)}</span>
                  </div>
                  <div className="stock-stat">
                    <span className="stat-label">Avg Volume</span>
                    <span className="stat-value">{formatNumber(stockDetails.averageVolume)}</span>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder */}
              {chartData && chartData.length > 0 && (
                <div className="stock-chart">
                  <h3>Price Chart (Last 30 Days)</h3>
                  <div className="chart-placeholder">
                    <p>Chart data available for {chartData.length} days</p>
                    <div className="chart-data-preview">
                      {chartData.slice(-5).map((item, index) => (
                        <div key={index} className="chart-data-point">
                          <span className="chart-date">{item.date}</span>
                          <span className="chart-price">{formatCurrency(item.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="stock-additional-info">
                <h3>Additional Information</h3>
                <div className="stock-info-grid">
                  <div className="stock-info-item">
                    <span className="info-label">Exchange</span>
                    <span className="info-value">{stockDetails.exchange}</span>
                  </div>
                  <div className="stock-info-item">
                    <span className="info-label">Currency</span>
                    <span className="info-value">{stockDetails.currency}</span>
                  </div>
                  <div className="stock-info-item">
                    <span className="info-label">Last Updated</span>
                    <span className="info-value">{stockDetails.lastUpdated.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="stock-external-links">
                <h3>External Links</h3>
                <div className="stock-links">
                  <a 
                    href={`https://www.tradingview.com/symbols/BSE-${stock.symbol.replace('.BO', '')}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stock-link tradingview-link"
                  >
                    View on TradingView
                  </a>
                  <a 
                    href={`https://www.screener.in/company/${stock.symbol.replace('.BO', '')}/`}
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