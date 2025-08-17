import React, { useState, useEffect, useCallback } from 'react';
import './CryptoDetails.css';
import CryptoCharts from './CryptoCharts';
import {
  fetchCryptoDetails,
  formatNumber,
  formatPrice,
  getChangeColor,
  formatChange,
  formatDate,
  handleApiError,
  isValidCryptoId
} from './utils';

const CryptoDetails = ({ cryptoId, onBack }) => {
  const [cryptoData, setCryptoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');

  const fetchCryptoData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchCryptoDetails(cryptoId);
      setCryptoData(data);
    } catch (err) {
      const errorInfo = handleApiError(err, 'fetching cryptocurrency details');
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  }, [cryptoId]);

  useEffect(() => {
    if (cryptoId && isValidCryptoId(cryptoId)) {
      fetchCryptoData();
    }
  }, [cryptoId, fetchCryptoData]);

  if (loading) {
    return (
      <div className="CryptoDetails">
        <div className="CryptoDetails__Loading">
          <div className="CryptoDetails__Spinner"></div>
          <p>Loading cryptocurrency details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="CryptoDetails">
        <div className="CryptoDetails__Error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchCryptoData} className="CryptoDetails__RetryBtn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!cryptoData) {
    return (
      <div className="CryptoDetails">
        <div className="CryptoDetails__Error">
          <h2>No Data Available</h2>
          <p>Unable to load cryptocurrency details.</p>
          <button onClick={onBack} className="CryptoDetails__BackBtn">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="CryptoDetails">
      <div className="CryptoDetails__Container">
        {/* Header */}
        <div className="CryptoDetails__Header">
          <button onClick={onBack} className="CryptoDetails__BackBtn">
            ← Back to Dashboard
          </button>
          <div className="CryptoDetails__TitleSection">
            <div className="CryptoDetails__CoinInfo">
              <img 
                src={cryptoData.image?.large} 
                alt={cryptoData.name} 
                className="CryptoDetails__CoinIcon"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="CryptoDetails__CoinDetails">
                <h1 className="CryptoDetails__Title">{cryptoData.name} ({cryptoData.symbol?.toUpperCase()})</h1>
                <p className="CryptoDetails__Subtitle">{cryptoData.symbol?.toUpperCase()} · Cryptocurrency</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="CryptoDetails__Tabs">
          {['overview', 'markets', 'historical', 'news'].map((tab) => (
            <button
              key={tab}
              className={`CryptoDetails__Tab ${activeTab === tab ? 'CryptoDetails__Tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <div className="CryptoDetails__Content">
          {activeTab === 'overview' && (
            <div className="CryptoDetails__Overview">
              {/* Key Metrics Cards */}
              <div className="CryptoDetails__MetricsGrid">
                <div className="CryptoDetails__MetricCard">
                  <h3 className="CryptoDetails__MetricLabel">Price</h3>
                  <p className="CryptoDetails__MetricValue">
                    {formatPrice(cryptoData.market_data?.current_price?.usd)}
                  </p>
                  <span 
                    className="CryptoDetails__MetricChange"
                    style={{ color: getChangeColor(cryptoData.market_data?.price_change_percentage_24h) }}
                  >
                    {formatChange(cryptoData.market_data?.price_change_percentage_24h)}
                  </span>
                </div>

                <div className="CryptoDetails__MetricCard">
                  <h3 className="CryptoDetails__MetricLabel">24h Change</h3>
                  <p 
                    className="CryptoDetails__MetricValue"
                    style={{ color: getChangeColor(cryptoData.market_data?.price_change_percentage_24h) }}
                  >
                    {formatChange(cryptoData.market_data?.price_change_percentage_24h)}
                  </p>
                  <span 
                    className="CryptoDetails__MetricChange"
                    style={{ color: getChangeColor(cryptoData.market_data?.price_change_percentage_24h) }}
                  >
                    {formatChange(cryptoData.market_data?.price_change_percentage_24h)}
                  </span>
                </div>

                <div className="CryptoDetails__MetricCard">
                  <h3 className="CryptoDetails__MetricLabel">24h High</h3>
                  <p className="CryptoDetails__MetricValue">
                    {formatPrice(cryptoData.market_data?.high_24h?.usd)}
                  </p>
                  <span 
                    className="CryptoDetails__MetricChange"
                    style={{ color: getChangeColor(cryptoData.market_data?.price_change_percentage_24h) }}
                  >
                    {formatChange(cryptoData.market_data?.price_change_percentage_24h)}
                  </span>
                </div>
              </div>

              {/* Price Chart Section */}
              <div className="CryptoDetails__ChartSection">
                <div className="CryptoDetails__ChartHeader">
                  <div className="CryptoDetails__ChartTitle">
                    <h2 className="CryptoDetails__ChartTitleText">{cryptoData.name} Price</h2>
                    <p className="CryptoDetails__ChartPrice">
                      {formatPrice(cryptoData.market_data?.current_price?.usd)}
                    </p>
                    <span 
                      className="CryptoDetails__ChartChange"
                      style={{ color: getChangeColor(cryptoData.market_data?.price_change_percentage_24h) }}
                    >
                      1D {formatChange(cryptoData.market_data?.price_change_percentage_24h)}
                    </span>
                  </div>
                  <div className="CryptoDetails__TimeRangeSelector">
                    {['1d', '7d', '30d', '90d', '1y'].map((range) => (
                      <button
                        key={range}
                        className={`CryptoDetails__TimeButton ${timeRange === range ? 'CryptoDetails__TimeButton--active' : ''}`}
                        onClick={() => setTimeRange(range)}
                      >
                        {range.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="CryptoDetails__ChartWrapper">
                  <CryptoCharts
                    cryptoId={cryptoId}
                    timeRange={timeRange}
                    currentPrice={cryptoData.market_data?.current_price?.usd}
                    priceChange={cryptoData.market_data?.price_change_percentage_24h}
                  />
                </div>
              </div>

              {/* About Section */}
              <div className="CryptoDetails__AboutSection">
                <h2 className="CryptoDetails__AboutTitle">About {cryptoData.name}</h2>
                <div 
                  className="CryptoDetails__AboutContent"
                  dangerouslySetInnerHTML={{ 
                    __html: cryptoData.description?.en?.replace(/\n/g, '<br/>') || 
                    `${cryptoData.name} is a decentralized digital currency that operates on a peer-to-peer network. It was created as an open-source project and uses blockchain technology to secure and verify transactions.`
                  }}
                />
              </div>

              {/* News Section */}
              <div className="CryptoDetails__NewsSection">
                <h2 className="CryptoDetails__NewsTitle">News</h2>
                <div className="CryptoDetails__NewsCard">
                  <div className="CryptoDetails__NewsContent">
                    <h3 className="CryptoDetails__NewsHeadline">
                      {cryptoData.name} Price Surges as Institutional Investors Show Interest
                    </h3>
                    <p className="CryptoDetails__NewsSummary">
                      The price of {cryptoData.name} has experienced a significant surge in recent trading sessions, 
                      driven by increased institutional interest and positive market sentiment. Analysts attribute 
                      this growth to growing adoption and market optimism, with predictions of further gains in 
                      the coming weeks.
                    </p>
                  </div>
                  <div className="CryptoDetails__NewsImage">
                    <div className="CryptoDetails__NewsImagePlaceholder">
                      <span>📰</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'markets' && (
            <div className="CryptoDetails__Markets">
              <h2 className="CryptoDetails__SectionTitle">Market Data</h2>
              <div className="CryptoDetails__MarketGrid">
                <div className="CryptoDetails__MarketCard">
                  <h3>Market Cap</h3>
                  <p>{formatNumber(cryptoData.market_data?.market_cap?.usd)}</p>
                </div>
                <div className="CryptoDetails__MarketCard">
                  <h3>24h Volume</h3>
                  <p>{formatNumber(cryptoData.market_data?.total_volume?.usd)}</p>
                </div>
                <div className="CryptoDetails__MarketCard">
                  <h3>Circulating Supply</h3>
                  <p>{cryptoData.market_data?.circulating_supply?.toLocaleString()} {cryptoData.symbol?.toUpperCase()}</p>
                </div>
                <div className="CryptoDetails__MarketCard">
                  <h3>Max Supply</h3>
                  <p>{cryptoData.market_data?.max_supply ? `${cryptoData.market_data.max_supply.toLocaleString()} ${cryptoData.symbol?.toUpperCase()}` : 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'historical' && (
            <div className="CryptoDetails__Historical">
              <h2 className="CryptoDetails__SectionTitle">Historical Data</h2>
              <div className="CryptoDetails__HistoricalNote">
                <p>Historical price data and charts would be displayed here.</p>
                <p>Current Price: {formatPrice(cryptoData.market_data?.current_price?.usd)}</p>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="CryptoDetails__News">
              <h2 className="CryptoDetails__SectionTitle">Latest News</h2>
              <div className="CryptoDetails__NewsList">
                <div className="CryptoDetails__NewsItem">
                  <h3>{cryptoData.name} Adoption Increases Globally</h3>
                  <p>Recent developments show growing adoption of {cryptoData.name} across various sectors...</p>
                  <span className="CryptoDetails__NewsDate">{formatDate(new Date())}</span>
                </div>
                <div className="CryptoDetails__NewsItem">
                  <h3>Market Analysis: {cryptoData.name} Price Trends</h3>
                  <p>Expert analysis of current market trends and future predictions for {cryptoData.name}...</p>
                  <span className="CryptoDetails__NewsDate">{formatDate(new Date(Date.now() - 86400000))}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoDetails;
