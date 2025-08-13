import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './Currency.css';

const Currency = () => {
  const navigate = useNavigate();
  
  const [currencyData, setCurrencyData] = useState({
    fromCurrency: 'INR',
    toCurrency: 'USD',
    amount: 1000,
    // historicalData: [],
    currentRate: null,
    isLoading: false,
    error: null,
    // historicalError: null,
    // isHistoricalLoading: false
  });

  // const [timeRange, setTimeRange] = useState('1M'); // 1W, 1M, 3M, 6M, 1Y

  const popularCurrencies = [
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' }
  ];

  // Free Currency API key - you'll need to get your own from https://app.freecurrencyapi.com/
  const API_KEY = 'fca_live_qEBjUXHDoaiFFtIH2wJ6Saqhr63Uf81JtL9vlQz2'; // Replace with your actual API key
  const BASE_URL = 'https://api.freecurrencyapi.com/v1';

  const fetchCurrentRate = useCallback(async () => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      setCurrencyData(prev => ({
        ...prev,
        error: 'Please add your Free Currency API key to use this feature'
      }));
      return;
    }

    setCurrencyData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(
        `${BASE_URL}/latest?apikey=${API_KEY}&base_currency=${currencyData.fromCurrency}&currencies=${currencyData.toCurrency}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch current rate');
      }

      const data = await response.json();
      const rate = data.data[currencyData.toCurrency];
      
      setCurrencyData(prev => ({
        ...prev,
        currentRate: rate,
        isLoading: false
      }));
    } catch (error) {
      setCurrencyData(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
    }
  }, [currencyData.fromCurrency, currencyData.toCurrency]);

  /*
  const fetchHistoricalData = useCallback(async () => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      return;
    }

    setCurrencyData(prev => ({ ...prev, isHistoricalLoading: true }));

    try {
      // Get today's date in UTC to avoid timezone issues
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Calculate how many days back to go based on time range
      let daysBack;
      switch (timeRange) {
        case '1W':
          daysBack = 7;
          break;
        case '1M':
          daysBack = 30;
          break;
        case '3M':
          daysBack = 90;
          break;
        case '6M':
          daysBack = 180;
          break;
        case '1Y':
          daysBack = 365;
          break;
        default:
          daysBack = 30;
      }

      // Generate array of dates to fetch (limit to last 7 days for free tier)
      const datesToFetch = [];
      const maxDays = Math.min(daysBack, 7); // Free tier limitation
      
      for (let i = maxDays; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        datesToFetch.push(date.toISOString().split('T')[0]);
      }

      console.log('Fetching historical data for dates:', datesToFetch);

      // Fetch data for each date
      const allData = {};
      
      for (const dateStr of datesToFetch) {
        try {
          const response = await fetch(
            `${BASE_URL}/historical?apikey=${API_KEY}&date=${dateStr}&base_currency=${currencyData.fromCurrency}&currencies=${currencyData.toCurrency}`
          );

          if (response.ok) {
            const data = await response.json();
            if (data.data && data.data[dateStr]) {
              allData[dateStr] = data.data[dateStr];
            }
          } else {
            console.warn(`Failed to fetch data for ${dateStr}:`, response.status);
          }
        } catch (error) {
          console.warn(`Error fetching data for ${dateStr}:`, error);
        }
      }

      // Transform data for Recharts
      const transformedData = Object.entries(allData).map(([date, rates]) => ({
        date,
        rate: rates[currencyData.toCurrency],
        value: (currencyData.amount * rates[currencyData.toCurrency]).toFixed(2)
      }));

      if (transformedData.length > 0) {
        setCurrencyData(prev => ({
          ...prev,
          historicalData: transformedData,
          historicalError: null,
          isHistoricalLoading: false
        }));
      } else {
        throw new Error('No historical data available for the selected time range');
      }

    } catch (error) {
      console.error('Error fetching historical data:', error);
      
      // Provide sample data for demonstration if API fails
      const sampleData = [];
      const baseRate = currencyData.currentRate || 0.012; // Default INR to USD rate
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Generate realistic sample data with some variation
        const variation = (Math.random() - 0.5) * 0.002; // ±0.1% variation
        const rate = baseRate + variation;
        
        sampleData.push({
          date: dateStr,
          rate: rate,
          value: (currencyData.amount * rate).toFixed(2)
        });
      }
      
      setCurrencyData(prev => ({
        ...prev,
        historicalData: sampleData,
        historicalError: `API Error: ${error.message}. Showing sample data for demonstration.`
      }));
      setCurrencyData(prev => ({ ...prev, isHistoricalLoading: false }));
    }
  }, [currencyData.fromCurrency, currencyData.toCurrency, currencyData.amount, timeRange]);
  */

  useEffect(() => {
    fetchCurrentRate();
  }, [fetchCurrentRate]);

  /*
  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);
  */

  const handleCurrencyChange = (field, value) => {
    setCurrencyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmountChange = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    setCurrencyData(prev => ({
      ...prev,
      amount
    }));
  };

  const swapCurrencies = () => {
    setCurrencyData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency
    }));
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2
    }).format(amount);
  };

  /*
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    });
  };
  */

  const getCurrencyInfo = (code) => {
    return popularCurrencies.find(curr => curr.code === code) || { code, name: code, flag: '🏳️' };
  };

  const convertedAmount = currencyData.currentRate ? currencyData.amount * currencyData.currentRate : 0;

  return (
    <div className="Currency">
      <div className="Currency__Container">
        <div className="Currency__Header">
          <button className="Currency__BackButton" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="Currency__Title">Currency Converter</h1>
          <p className="Currency__Subtitle">Track INR exchange rates and view historical trends (INR to USD by default)</p>
        </div>

        {currencyData.error && (
          <div className="Currency__Error">
            <p>{currencyData.error}</p>
            <p>Get your free API key from <a href="https://app.freecurrencyapi.com/" target="_blank" rel="noopener noreferrer">Free Currency API</a></p>
          </div>
        )}

        <div className="Currency__Content">
          {/* Currency Converter */}
          <div className="Currency__ConverterSection">
            <h2 className="Currency__SectionTitle">Live Exchange Rate</h2>
            
            <div className="Currency__ConverterCard">
              <div className="Currency__InputGroup">
                <label className="Currency__Label">From</label>
                <div className="Currency__SelectWrapper">
                  <select
                    value={currencyData.fromCurrency}
                    onChange={(e) => handleCurrencyChange('fromCurrency', e.target.value)}
                    className="Currency__Select"
                  >
                    {popularCurrencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="number"
                  value={currencyData.amount}
                  onChange={handleAmountChange}
                  className="Currency__AmountInput"
                  placeholder="Enter amount"
                />
              </div>

              <button className="Currency__SwapButton" onClick={swapCurrencies}>
                ⇄
              </button>

              <div className="Currency__InputGroup">
                <label className="Currency__Label">To</label>
                <div className="Currency__SelectWrapper">
                  <select
                    value={currencyData.toCurrency}
                    onChange={(e) => handleCurrencyChange('toCurrency', e.target.value)}
                    className="Currency__Select"
                  >
                    {popularCurrencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="Currency__ResultAmount">
                  {currencyData.isLoading ? (
                    <span className="Currency__Loading">Loading...</span>
                  ) : (
                    formatCurrency(convertedAmount, currencyData.toCurrency)
                  )}
                </div>
              </div>
            </div>

            {currencyData.currentRate && (
              <div className="Currency__RateInfo">
                <p className="Currency__RateText">
                  1 {getCurrencyInfo(currencyData.fromCurrency).code} = {formatCurrency(currencyData.currentRate, currencyData.toCurrency)}
                </p>
                <p className="Currency__RateText">
                  1 {getCurrencyInfo(currencyData.toCurrency).code} = {formatCurrency(1 / currencyData.currentRate, currencyData.fromCurrency)}
                </p>
                <button 
                  className="Currency__PresetButton"
                  onClick={() => {
                    setCurrencyData(prev => ({
                      ...prev,
                      fromCurrency: 'INR',
                      toCurrency: 'USD'
                    }));
                  }}
                >
                  Reset to INR → USD
                </button>
              </div>
            )}
          </div>

          {/* Historical Chart */}
          {/* 
          <div className="Currency__ChartSection">
            <div className="Currency__ChartHeader">
              <h2 className="Currency__SectionTitle">Historical Trends</h2>
              <div className="Currency__TimeRangeSelector">
                {['1W', '1M', '3M', '6M', '1Y'].map(range => (
                  <button
                    key={range}
                    className={`Currency__TimeButton ${timeRange === range ? 'Currency__TimeButton--active' : ''}`}
                    onClick={() => setTimeRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="Currency__ChartNote">
              <p><strong>Note:</strong> Free tier shows last 7 days. <a href="https://currencyapi.com/docs/range" target="_blank" rel="noopener noreferrer">Upgrade to currencyapi.com</a> for extended historical data.</p>
            </div>

            <div className="Currency__ChartContainer">
              {currencyData.isHistoricalLoading ? (
                <div className="Currency__NoData">
                  <p>Loading historical data...</p>
                </div>
              ) : currencyData.historicalError ? (
                <div className={`Currency__Error ${currencyData.historicalData.length > 0 ? 'Currency__Error--warning' : ''}`}>
                  <p>{currencyData.historicalError}</p>
                  {currencyData.historicalData.length > 0 && (
                    <p><strong>Note:</strong> Chart shows sample data for demonstration purposes.</p>
                  )}
                  <button 
                    className="Currency__RetryButton"
                    onClick={() => {
                      setCurrencyData(prev => ({ ...prev, historicalError: null }));
                      fetchHistoricalData();
                    }}
                  >
                    Retry Historical Data
                  </button>
                </div>
              ) : currencyData.historicalData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={currencyData.historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value, currencyData.toCurrency)}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      labelFormatter={formatDate}
                      formatter={(value, name) => [
                        formatCurrency(value, currencyData.toCurrency),
                        'Exchange Rate'
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="#667eea"
                      fill="#667eea"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="Currency__NoData">
                  <p>Loading historical data...</p>
                </div>
              )}
            </div>
          </div>
          */}

          {/* Popular Currency Pairs */}
          <div className="Currency__PopularSection">
            <h2 className="Currency__SectionTitle">Popular Currency Pairs</h2>
            <div className="Currency__PopularGrid">
              {popularCurrencies.map(currency => (
                <div 
                  key={currency.code}
                  className={`Currency__PopularCard ${
                    currency.code === currencyData.fromCurrency || currency.code === currencyData.toCurrency 
                      ? 'Currency__PopularCard--active' 
                      : ''
                  }`}
                  onClick={() => handleCurrencyChange('toCurrency', currency.code)}
                >
                  <div className="Currency__PopularFlag">{currency.flag}</div>
                  <div className="Currency__PopularInfo">
                    <h3 className="Currency__PopularCode">{currency.code}</h3>
                    <p className="Currency__PopularName">{currency.name}</p>
                  </div>
                  {(currency.code === currencyData.fromCurrency || currency.code === currencyData.toCurrency) && (
                    <div className="Currency__PopularIndicator">
                      {currency.code === currencyData.fromCurrency ? 'From' : 'To'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Currency;
