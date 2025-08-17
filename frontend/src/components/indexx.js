import React, { useState, useEffect } from 'react';
import './indexx.css';

const Indexx = () => {
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchNifty50Symbols = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/nifty50/symbols`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setSymbols(data.data.symbols);
        setLastUpdated(new Date().toLocaleString());
      } else {
        throw new Error(data.message || 'Failed to fetch symbols');
      }
    } catch (err) {
      console.error('Error fetching Nifty50 symbols:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNifty50Symbols();
  }, []);

  const handleRefresh = () => {
    fetchNifty50Symbols();
  };

  if (loading) {
    return (
      <div className="indexx-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Nifty50 symbols...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="indexx-container">
        <div className="error">
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="refresh-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="indexx-container">
      <div className="header">
        <h1>Nifty 50 Index</h1>
        <div className="header-info">
          <span className="symbol-count">
            Total Symbols: {symbols.length}
          </span>
          {lastUpdated && (
            <span className="last-updated">
              Last Updated: {lastUpdated}
            </span>
          )}
        </div>
        <button onClick={handleRefresh} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="symbols-grid">
        {symbols.map((symbol, index) => (
          <div key={index} className="symbol-card">
            <div className="symbol-name">{symbol}</div>
            <div className="symbol-number">#{index + 1}</div>
          </div>
        ))}
      </div>

      <div className="footer">
        <p>Data fetched from NSE API via Flask Backend</p>
        <p>Total Nifty 50 stocks: {symbols.length}</p>
      </div>
    </div>
  );
};

export default Indexx;
