import React, { useState, useEffect } from 'react';
import './Cryptocurrency.css';
import CryptoDetails from './CryptoDetails';
import {
  fetchTopCryptocurrencies,
  fetchGlobalMarketData,
  formatNumber,
  formatPrice,
  getChangeColor,
  formatChange,
  handleApiError,
  DEFAULT_LIMIT
} from './utils';

const Cryptocurrency = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both top cryptocurrencies and global data in parallel
      const [cryptoData, globalMarketData] = await Promise.all([
        fetchTopCryptocurrencies(DEFAULT_LIMIT),
        fetchGlobalMarketData()
      ]);

      setCryptocurrencies(cryptoData);
      setGlobalData(globalMarketData);
    } catch (err) {
      const errorInfo = handleApiError(err, 'fetching cryptocurrency data');
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoClick = (crypto) => {
    setSelectedCrypto(crypto.id);
  };

  const handleBackToDashboard = () => {
    setSelectedCrypto(null);
  };

  // If a cryptocurrency is selected, show the details page
  if (selectedCrypto) {
    return (
      <CryptoDetails
        cryptoId={selectedCrypto}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (loading) {
    return (
      <div className="Cryptocurrency">
        <div className="Cryptocurrency__Loading">
          <div className="Cryptocurrency__Spinner"></div>
          <p>Loading cryptocurrency data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Cryptocurrency">
        <div className="Cryptocurrency__Error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchCryptoData} className="Cryptocurrency__RetryBtn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="Cryptocurrency">
      {/* Header */}
      <div className="Cryptocurrency__Header">
        <div className="Cryptocurrency__TitleSection">
          <h1 className="Cryptocurrency__Title">Cryptocurrency Dashboard</h1>
          <p className="Cryptocurrency__Subtitle">Top {DEFAULT_LIMIT} cryptocurrencies by market cap</p>
        </div>
        <button onClick={fetchCryptoData} className="Cryptocurrency__RefreshBtn">
          ↻ Refresh
        </button>
      </div>

      {/* Global Market Stats */}
      {globalData && (
        <div className="Cryptocurrency__GlobalStats">
          <div className="Cryptocurrency__StatCard">
            <h3>Total Market Cap</h3>
            <p>{formatNumber(globalData.total_market_cap?.usd)}</p>
          </div>
          <div className="Cryptocurrency__StatCard">
            <h3>24h Volume</h3>
            <p>{formatNumber(globalData.total_volume?.usd)}</p>
          </div>
          <div className="Cryptocurrency__StatCard">
            <h3>Market Cap Change</h3>
            <p style={{ color: getChangeColor(globalData.market_cap_change_percentage_24h_usd) }}>
              {formatChange(globalData.market_cap_change_percentage_24h_usd)}
            </p>
          </div>
          <div className="Cryptocurrency__StatCard">
            <h3>Active Cryptocurrencies</h3>
            <p>{globalData.active_cryptocurrencies?.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Cryptocurrency Table */}
      <div className="Cryptocurrency__TableContainer">
        <table className="Cryptocurrency__Table">
          <thead className="Cryptocurrency__TableHead">
            <tr>
              <th>#</th>
              <th>Coin</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>Market Cap</th>
              <th>Volume (24h)</th>
            </tr>
          </thead>
          <tbody className="Cryptocurrency__TableBody">
            {cryptocurrencies.map((crypto, index) => (
              <tr
                key={crypto.id}
                className="Cryptocurrency__TableRow"
                onClick={() => handleCryptoClick(crypto)}
                style={{ cursor: 'pointer' }}
              >
                <td className="Cryptocurrency__TableRank">{index + 1}</td>
                <td className="Cryptocurrency__TableCoin">
                  <div className="Cryptocurrency__CoinInfo">
                    <img 
                      src={crypto.image} 
                      alt={crypto.name}
                      className="Cryptocurrency__CoinIcon"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="Cryptocurrency__CoinDetails">
                      <span className="Cryptocurrency__CoinName">{crypto.name}</span>
                      <span className="Cryptocurrency__CoinSymbol">{crypto.symbol?.toUpperCase()}</span>
                    </div>
                  </div>
                </td>
                <td className="Cryptocurrency__TablePrice">
                  {formatPrice(crypto.current_price)}
                </td>
                <td 
                  className="Cryptocurrency__TableChange"
                  style={{ color: getChangeColor(crypto.price_change_percentage_24h) }}
                >
                  {formatChange(crypto.price_change_percentage_24h)}
                </td>
                <td className="Cryptocurrency__TableMarketCap">
                  {formatNumber(crypto.market_cap)}
                </td>
                <td className="Cryptocurrency__TableVolume">
                  {formatNumber(crypto.total_volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="Cryptocurrency__Footer">
        <p>Data provided by CoinGecko API</p>
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Cryptocurrency;
