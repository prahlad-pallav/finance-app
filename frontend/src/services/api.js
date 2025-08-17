// API service for communicating with Flask backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('API Service initialized with base URL:', this.baseURL);
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log(`Making API request to: ${url}`);
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'omit', // Don't send cookies
    };

    const config = {
      ...defaultOptions,
      ...options,
    };

    try {
      console.log('Request config:', config);
      
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        url: url,
        config: config
      });
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }

  // Get API info
  async getApiInfo() {
    return this.request('/api/hello');
  }

  // Nifty50 endpoints (when backend is ready)
  async getNifty50Stocks() {
    return this.request('/api/nifty50/stocks');
  }

  async getStockData(symbol) {
    return this.request(`/api/nifty50/stock/${symbol}`);
  }

  async getMarketOverview() {
    return this.request('/api/nifty50/market-overview');
  }

  async getStockHistory(symbol, period = '1y', interval = '1d') {
    const params = new URLSearchParams({ period, interval });
    return this.request(`/api/nifty50/stock/${symbol}/history?${params}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
