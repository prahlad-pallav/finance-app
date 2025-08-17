// Cryptocurrency API Base URL
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// API Endpoints
export const API_ENDPOINTS = {
  TOP_CRYPTOS: '/coins/markets',
  GLOBAL_DATA: '/global',
  CRYPTO_DETAILS: '/coins',
  MARKET_CHART: '/market_chart',
  SEARCH: '/search',
  TRENDING: '/search/trending'
};

/**
 * Fetch top cryptocurrencies with market data
 * @param {number} limit - Number of cryptocurrencies to fetch (default: 10)
 * @param {string} currency - Currency for prices (default: 'usd')
 * @returns {Promise<Array>} Array of cryptocurrency data
 */
export const fetchTopCryptocurrencies = async (limit = 10, currency = 'usd') => {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}${API_ENDPOINTS.TOP_CRYPTOS}?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top cryptocurrencies:', error);
    throw error;
  }
};

/**
 * Fetch global cryptocurrency market data
 * @returns {Promise<Object>} Global market data
 */
export const fetchGlobalMarketData = async () => {
  try {
    const response = await fetch(`${COINGECKO_API_BASE}${API_ENDPOINTS.GLOBAL_DATA}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching global market data:', error);
    throw error;
  }
};

/**
 * Fetch detailed cryptocurrency information
 * @param {string} cryptoId - Cryptocurrency ID
 * @returns {Promise<Object>} Detailed cryptocurrency data
 */
export const fetchCryptoDetails = async (cryptoId) => {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}${API_ENDPOINTS.CRYPTO_DETAILS}/${cryptoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    throw error;
  }
};

/**
 * Fetch historical market chart data
 * @param {string} cryptoId - Cryptocurrency ID
 * @param {string} timeRange - Time range ('1d', '7d', '30d', '90d', '1y')
 * @param {string} currency - Currency for prices (default: 'usd')
 * @returns {Promise<Array>} Processed chart data
 */
export const fetchChartData = async (cryptoId, timeRange, currency = 'usd') => {
  try {
    // Calculate days based on time range
    const daysMap = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };

    const days = daysMap[timeRange] || 7;
    const interval = timeRange === '1d' ? 'hourly' : 'daily';

    const response = await fetch(
      `${COINGECKO_API_BASE}${API_ENDPOINTS.CRYPTO_DETAILS}/${cryptoId}${API_ENDPOINTS.MARKET_CHART}?vs_currency=${currency}&days=${days}&interval=${interval}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Process the data for charts
    const processedData = data.prices.map(([timestamp, price]) => ({
      timestamp: timestamp,
      date: new Date(timestamp),
      price: parseFloat(price.toFixed(6)),
      formattedDate: formatChartDate(new Date(timestamp), timeRange),
      formattedPrice: formatPrice(price)
    }));

    return processedData;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

/**
 * Search cryptocurrencies
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 */
export const searchCryptocurrencies = async (query) => {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}${API_ENDPOINTS.SEARCH}?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.coins || [];
  } catch (error) {
    console.error('Error searching cryptocurrencies:', error);
    throw error;
  }
};

/**
 * Fetch trending cryptocurrencies
 * @returns {Promise<Array>} Trending cryptocurrencies
 */
export const fetchTrendingCryptocurrencies = async () => {
  try {
    const response = await fetch(`${COINGECKO_API_BASE}${API_ENDPOINTS.TRENDING}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.coins || [];
  } catch (error) {
    console.error('Error fetching trending cryptocurrencies:', error);
    throw error;
  }
};

// ===== FORMATTING UTILITIES =====

/**
 * Format number with appropriate suffix (K, M, B, T)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (!num || isNaN(num)) return '$0.00';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

/**
 * Format price with appropriate decimal places
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
export const formatPrice = (price) => {
  if (!price || isNaN(price)) return '$0.00';
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toLocaleString()}`;
};

/**
 * Get color based on price change
 * @param {number} change - Price change percentage
 * @returns {string} Color hex code
 */
export const getChangeColor = (change) => {
  if (!change || isNaN(change)) return '#b0b0b0';
  return change >= 0 ? '#00ff88' : '#ff4444';
};

/**
 * Format price change percentage
 * @param {number} change - Price change percentage
 * @returns {string} Formatted change
 */
export const formatChange = (change) => {
  if (!change || isNaN(change)) return '0.00%';
  return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
};

/**
 * Format date for display
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Format date for chart display based on time range
 * @param {Date} date - Date to format
 * @param {string} timeRange - Time range
 * @returns {string} Formatted date
 */
export const formatChartDate = (date, timeRange) => {
  if (timeRange === '1d') {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  } else if (timeRange === '7d') {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short' 
    });
  } else if (timeRange === '30d') {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: '2-digit' 
    });
  }
};

// ===== VALIDATION UTILITIES =====

/**
 * Validate cryptocurrency ID
 * @param {string} cryptoId - Cryptocurrency ID to validate
 * @returns {boolean} Is valid
 */
export const isValidCryptoId = (cryptoId) => {
  return cryptoId && typeof cryptoId === 'string' && cryptoId.trim().length > 0;
};

/**
 * Validate time range
 * @param {string} timeRange - Time range to validate
 * @returns {boolean} Is valid
 */
export const isValidTimeRange = (timeRange) => {
  const validRanges = ['1d', '7d', '30d', '90d', '1y'];
  return validRanges.includes(timeRange);
};

// ===== CACHE UTILITIES =====

/**
 * Simple cache for API responses
 */
class ApiCache {
  constructor() {
    this.cache = new Map();
    this.maxAge = 5 * 60 * 1000; // 5 minutes
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache();

// ===== ERROR HANDLING =====

/**
 * Handle API errors gracefully
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @returns {Object} Error information
 */
export const handleApiError = (error, context = 'API call') => {
  console.error(`Error in ${context}:`, error);
  
  let message = 'An unexpected error occurred';
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    message = 'Network error. Please check your internet connection.';
  } else if (error.message.includes('429')) {
    message = 'Rate limit exceeded. Please try again later.';
  } else if (error.message.includes('404')) {
    message = 'Data not found.';
  } else if (error.message.includes('500')) {
    message = 'Server error. Please try again later.';
  } else if (error.message) {
    message = error.message;
  }
  
  return {
    error: true,
    message,
    context
  };
};

// ===== CONSTANTS =====

export const TIME_RANGES = {
  ONE_DAY: '1d',
  ONE_WEEK: '7d',
  ONE_MONTH: '30d',
  THREE_MONTHS: '90d',
  ONE_YEAR: '1y'
};

export const CURRENCIES = {
  USD: 'usd',
  EUR: 'eur',
  GBP: 'gbp',
  JPY: 'jpy'
};

export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 250;

// ===== EXPORT ALL UTILITIES =====

const cryptoUtils = {
  // API functions
  fetchTopCryptocurrencies,
  fetchGlobalMarketData,
  fetchCryptoDetails,
  fetchChartData,
  searchCryptocurrencies,
  fetchTrendingCryptocurrencies,
  
  // Formatting functions
  formatNumber,
  formatPrice,
  getChangeColor,
  formatChange,
  formatDate,
  formatChartDate,
  
  // Validation functions
  isValidCryptoId,
  isValidTimeRange,
  
  // Cache
  apiCache,
  
  // Error handling
  handleApiError,
  
  // Constants
  TIME_RANGES,
  CURRENCIES,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  
  // API endpoints
  API_ENDPOINTS
};

export default cryptoUtils;
