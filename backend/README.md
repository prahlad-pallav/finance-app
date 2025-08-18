# Finance API - NSE India Data Service

A Flask-based REST API for fetching financial data from NSE India.

## 🏗️ Project Structure

```
finance-app/backend/
├── app/                          # Application package
│   ├── __init__.py              # Flask app factory
│   ├── api/                     # API routes
│   │   ├── __init__.py
│   │   └── routes.py            # API endpoints
│   ├── config/                  # Configuration
│   │   ├── __init__.py
│   │   └── config.py            # App configuration
│   ├── models/                  # Data models (future)
│   │   └── __init__.py
│   ├── services/                # Business logic
│   │   ├── __init__.py
│   │   └── nse_service.py       # NSE API service
│   └── utils/                   # Utilities
│       ├── __init__.py
│       └── logger.py            # Logging utility
├── tests/                       # Test files
├── logs/                        # Application logs
├── run.py                       # Application entry point
├── requirements.txt             # Python dependencies
├── env.example                  # Environment variables example
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables

Copy the example environment file:
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```bash
FLASK_CONFIG=development
SECRET_KEY=your-secret-key-here
```

### 3. Run the Application

```bash
python run.py
```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Base Endpoints
- `GET /` - Hello world
- `GET /api/hello` - API hello
- `GET /api/health` - Health check

### NSE Data Endpoints
- `GET /api/nifty50/symbols` - Nifty 50 stock symbols
- `GET /api/indices/all` - All NSE indices
- `GET /api/live/52week-high` - 52-week high stocks
- `GET /api/live/52week-low` - 52-week low stocks

## 🏛️ Architecture

### Application Factory Pattern
- Uses Flask application factory for better testing and configuration
- Modular structure with blueprints
- Environment-based configuration

### Service Layer
- `NSEService` handles all NSE API interactions
- Centralized error handling and logging
- Rate limiting and timeout management

### Configuration Management
- Environment-based configuration
- Separate configs for development, production, and testing
- Secure secret management

### Logging
- Structured logging with file and console output
- Configurable log levels
- Request/response logging

## 🔧 Configuration

### Environment Variables
- `FLASK_CONFIG`: Configuration environment (development/production/testing)
- `SECRET_KEY`: Flask secret key
- `NSE_BASE_URL`: NSE API base URL
- `NSE_TIMEOUT`: API timeout in seconds
- `CORS_ORIGINS`: Allowed CORS origins
- `LOG_LEVEL`: Logging level

### Configuration Classes
- `DevelopmentConfig`: Development settings
- `ProductionConfig`: Production settings
- `TestingConfig`: Testing settings

## 🧪 Testing

Run tests (when implemented):
```bash
python -m pytest tests/
```

## 📝 Logging

Logs are stored in `logs/app.log` with the following format:
```
2024-01-15 10:30:00 - finance_api - INFO - Fetching Nifty50 symbols
```

## 🔒 Security

- CORS configuration for frontend access
- Environment-based secret management
- Input validation and sanitization
- Error handling without exposing internals

## 🚀 Deployment

### Development
```bash
FLASK_CONFIG=development python run.py
```

### Production
```bash
FLASK_CONFIG=production python run.py
```

## 📊 Data Sources

All data is fetched from NSE India APIs:
- Nifty 50 symbols
- All indices data
- 52-week high/low stocks
- Live market data

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Use proper logging
5. Follow PEP 8 style guidelines

## 📄 License

This project is for educational purposes.
