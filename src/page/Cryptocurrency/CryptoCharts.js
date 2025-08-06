import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './CryptoCharts.css';
import {
  fetchChartData,
  formatPrice,
  handleApiError,
  isValidCryptoId,
  isValidTimeRange
} from './utils';

const CryptoCharts = ({ cryptoId, timeRange, currentPrice, priceChange }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChartDataFromAPI = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchChartData(cryptoId, timeRange);
      setChartData(data);
    } catch (err) {
      const errorInfo = handleApiError(err, 'fetching chart data');
      setError(errorInfo.message);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [cryptoId, timeRange]);

  useEffect(() => {
    if (cryptoId && timeRange && isValidCryptoId(cryptoId) && isValidTimeRange(timeRange)) {
      fetchChartDataFromAPI();
    }
  }, [cryptoId, timeRange, fetchChartDataFromAPI]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="CryptoCharts__Tooltip">
          <p className="CryptoCharts__TooltipDate">{data.formattedDate}</p>
          <p className="CryptoCharts__TooltipPrice">{data.formattedPrice}</p>
        </div>
      );
    }
    return null;
  };

  const CustomXAxisTick = ({ x, y, payload }) => {
    // Show fewer labels for better readability
    const shouldShowLabel = timeRange === '1d' ? 
      payload.index % 4 === 0 : 
      payload.index % Math.max(1, Math.floor(chartData.length / 8)) === 0;

    if (!shouldShowLabel) return null;

    return (
      <text x={x} y={y + 15} textAnchor="middle" fill="#666" fontSize="12">
        {payload.value}
      </text>
    );
  };

  const CustomYAxisTick = ({ x, y, payload }) => {
    return (
      <text x={x - 10} y={y} textAnchor="end" fill="#666" fontSize="12">
        {formatPrice(payload.value)}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="CryptoCharts__Loading">
        <div className="CryptoCharts__Spinner"></div>
        <p>Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="CryptoCharts__Error">
        <p>Failed to load chart data</p>
        <button onClick={fetchChartDataFromAPI} className="CryptoCharts__RetryBtn">
          Retry
        </button>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="CryptoCharts__NoData">
        <p>No chart data available for this time range.</p>
      </div>
    );
  }

  return (
    <div className="CryptoCharts">
      <div className="CryptoCharts__Container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00b4d8" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e9ecef" 
              strokeWidth={1}
            />
            
            <XAxis 
              dataKey="formattedDate"
              tick={<CustomXAxisTick />}
              axisLine={false}
              tickLine={false}
              stroke="#666"
              fontSize={12}
            />
            
            <YAxis 
              tick={<CustomYAxisTick />}
              axisLine={false}
              tickLine={false}
              stroke="#666"
              fontSize={12}
              domain={['dataMin - 0.1', 'dataMax + 0.1']}
            />
            
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{
                stroke: '#00b4d8',
                strokeWidth: 2,
                strokeDasharray: '5 5'
              }}
            />
            
            <Area
              type="monotone"
              dataKey="price"
              stroke="#00b4d8"
              strokeWidth={3}
              fill="url(#priceGradient)"
              fillOpacity={0.6}
              dot={false}
              activeDot={{
                r: 6,
                stroke: '#00b4d8',
                strokeWidth: 2,
                fill: '#ffffff'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Chart Stats */}
        <div className="CryptoCharts__Stats">
          <div className="CryptoCharts__Stat">
            <span className="CryptoCharts__StatLabel">Current Price:</span>
            <span className="CryptoCharts__StatValue">{formatPrice(currentPrice)}</span>
          </div>
          <div className="CryptoCharts__Stat">
            <span className="CryptoCharts__StatLabel">24h Change:</span>
            <span 
              className="CryptoCharts__StatValue"
              style={{ color: priceChange >= 0 ? '#00ff88' : '#ff4444' }}
            >
              {priceChange >= 0 ? '+' : ''}{priceChange?.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoCharts;
