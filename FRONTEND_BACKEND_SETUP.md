# Frontend-Backend Connection Guide

This guide explains how to connect your React frontend with the Flask backend.

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd finance-app/backend
pip install -r requirements.txt
python app.py
```
Your Flask backend will run on `http://localhost:5000`

### 2. Start the Frontend
```bash
cd finance-app/frontend
npm install
npm start
```
Your React app will run on `http://localhost:3000`

### 3. Test the Connection
Visit `http://localhost:3000/backend-test` to test the connection between frontend and backend.

## 📁 File Structure

```
finance-app/
├── backend/
│   ├── app.py              # Flask backend server
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js     # API service for backend communication
│   │   ├── components/
│   │   │   └── BackendTest.js  # Test component
│   │   └── App.js         # Main React app
│   └── package.json       # Node.js dependencies
└── FRONTEND_BACKEND_SETUP.md  # This file
```

## 🔧 API Service (`src/services/api.js`)

The API service provides a clean interface for communicating with your Flask backend:

```javascript
import apiService from '../services/api';

// Health check
const health = await apiService.healthCheck();

// Get API info
const info = await apiService.getApiInfo();

// Get Nifty50 stocks (when backend is ready)
const stocks = await apiService.getNifty50Stocks();

// Get specific stock data
const stockData = await apiService.getStockData('RELIANCE');

// Get market overview
const marketData = await apiService.getMarketOverview();
```

## 🌐 Environment Configuration

### Frontend Environment Variables
Create a `.env` file in the frontend directory:

```env
# .env
REACT_APP_API_URL=http://localhost:5000
```

### Backend Configuration
The backend is configured to:
- Run on `http://localhost:5000`
- Accept CORS requests from any origin
- Return JSON responses

## 🔄 CORS Configuration

The Flask backend has CORS enabled to allow requests from the React frontend:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows all origins
```

## 📡 Available API Endpoints

### Basic Endpoints
- `GET /` - Hello World message
- `GET /api/hello` - API information
- `GET /api/health` - Health check

### Nifty50 Endpoints (when implemented)
- `GET /api/nifty50/stocks` - Get all Nifty50 stocks
- `GET /api/nifty50/stock/<symbol>` - Get specific stock data
- `GET /api/nifty50/market-overview` - Get market overview
- `GET /api/nifty50/stock/<symbol>/history` - Get historical data

## 🧪 Testing the Connection

### 1. Backend Test Component
Visit `http://localhost:3000/backend-test` to see a visual test of the connection.

### 2. Browser Developer Tools
Open the browser console to see API requests and responses.

### 3. Manual Testing
```bash
# Test backend directly
curl http://localhost:5000/api/health

# Test from frontend
curl http://localhost:3000/backend-test
```

## 🔍 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem:** `Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:** Make sure the Flask backend has CORS enabled:
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```

#### 2. Backend Not Running
**Problem:** `Failed to fetch` or connection refused errors

**Solution:** 
- Check if backend is running: `python app.py`
- Verify port 5000 is not in use
- Check terminal for error messages

#### 3. Port Conflicts
**Problem:** Port already in use

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

#### 4. Environment Variables
**Problem:** API calls going to wrong URL

**Solution:** Check your `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Production Deployment

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Deployment
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Environment Variables for Production
```env
# Frontend .env.production
REACT_APP_API_URL=https://your-backend-domain.com

# Backend environment
FLASK_ENV=production
```

## 📚 Integration Examples

### Using API Service in Components

```javascript
import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getApiInfo();
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{data?.message}</h1>
      <p>Service: {data?.data?.service}</p>
    </div>
  );
};
```

### Error Handling

```javascript
const handleApiCall = async () => {
  try {
    const data = await apiService.getStockData('RELIANCE');
    // Handle success
  } catch (error) {
    if (error.message.includes('404')) {
      // Handle not found
    } else if (error.message.includes('503')) {
      // Handle service unavailable
    } else {
      // Handle other errors
    }
  }
};
```

## 🔄 Next Steps

1. **Test the basic connection** using the BackendTest component
2. **Implement Nifty50 functionality** in the backend
3. **Update frontend components** to use the API service
4. **Add error handling** and loading states
5. **Implement caching** for better performance
6. **Add authentication** if needed

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify both frontend and backend are running
3. Test the backend directly with curl
4. Check the terminal output for error messages
