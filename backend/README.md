# Finance App Backend

A Flask backend for the Finance Application with Nifty50 stocks data integration using yfinance.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python app.py
   ```

3. **Access the API:**
   - Main endpoint: http://localhost:5000/
   - API endpoint: http://localhost:5000/api/hello
   - Health check: http://localhost:5000/api/health

## API Endpoints

### Basic Endpoints
- `GET /` - Hello World message
- `GET /api/hello` - API information
- `GET /api/health` - Health check

### Nifty50 Stocks Endpoints
- `GET /api/nifty50/stocks` - Get list of all Nifty50 stocks
- `GET /api/nifty50/stock/<symbol>` - Get detailed data for a specific stock
- `GET /api/nifty50/market-overview` - Get market overview for all Nifty50 stocks
- `GET /api/nifty50/stock/<symbol>/history` - Get historical data for a specific stock

## Nifty50 API Usage Examples

### 1. Get All Nifty50 Stocks
```bash
GET http://localhost:5000/api/nifty50/stocks
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "name": "RELIANCE",
      "symbol": "RELIANCE.NS"
    },
    {
      "name": "TCS",
      "symbol": "TCS.NS"
    }
  ],
  "count": 50
}
```

### 2. Get Specific Stock Data
```bash
GET http://localhost:5000/api/nifty50/stock/RELIANCE
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "symbol": "RELIANCE",
    "name": "Reliance Industries Limited",
    "current_price": 2456.78,
    "previous_close": 2440.50,
    "open": 2445.00,
    "high": 2460.00,
    "low": 2430.00,
    "volume": 1234567,
    "market_cap": 1654321000000,
    "pe_ratio": 18.5,
    "dividend_yield": 0.45,
    "sector": "Energy",
    "industry": "Oil & Gas Refining & Marketing",
    "price_history": [2400.50, 2410.25, ...],
    "dates": ["2024-01-01", "2024-01-02", ...]
  }
}
```

### 3. Get Market Overview
```bash
GET http://localhost:5000/api/nifty50/market-overview
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "name": "RELIANCE",
      "symbol": "RELIANCE.NS",
      "current_price": 2456.78,
      "change": 16.28,
      "change_percent": 0.67,
      "volume": 1234567
    }
  ],
  "count": 50,
  "timestamp": "2024-01-15T10:30:00"
}
```

### 4. Get Historical Data
```bash
GET http://localhost:5000/api/nifty50/stock/RELIANCE/history?period=1y&interval=1d
```

**Query Parameters:**
- `period`: Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
- `interval`: Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)

**Response:**
```json
{
  "status": "success",
  "data": {
    "symbol": "RELIANCE",
    "period": "1y",
    "interval": "1d",
    "history": [
      {
        "date": "2024-01-15",
        "open": 2445.00,
        "high": 2460.00,
        "low": 2430.00,
        "close": 2456.78,
        "volume": 1234567
      }
    ]
  }
}
```

## Available Nifty50 Stocks

The API supports all 50 stocks in the Nifty50 index including:
- RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK, HINDUNILVR, ITC, SBIN, BHARTIARTL, KOTAKBANK
- And 40 more stocks...

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `404` - Stock not found
- `500` - Server error

Error responses include:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Dependencies

- Flask - Web framework
- Flask-CORS - Cross-origin resource sharing
- yfinance - Yahoo Finance data
- pandas - Data manipulation
