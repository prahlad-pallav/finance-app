from flask import Flask, jsonify
from flask_cors import CORS
from nsepython import nsefetch

app = Flask(__name__)

# Configure CORS
CORS(app)

def get_nifty50_symbols():
    """Get Nifty 50 stock symbols from NSE API"""
    try:
        # NSE API for Nifty 50 index
        url = "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050"
        
        # Fetch data
        data = nsefetch(url)
        
        # Extract stock symbols
        nifty50_symbols = [stock["symbol"] for stock in data["data"]]
        
        return {
            'success': True,
            'symbols': nifty50_symbols,
            'count': len(nifty50_symbols)
        }
    except Exception as e:
        print(f"Error fetching Nifty50 symbols: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

def get_all_indices():
    """Get all indices from NSE API"""
    try:
        # NSE API for all indices
        url = "https://www.nseindia.com/api/allIndices"
        
        # Fetch data
        data = nsefetch(url)
        
        print(f"Raw API Response:", data)
        
        # Extract indices data
        indices_data = []
        
        if 'data' in data and isinstance(data['data'], list):
            print(f"First 10 indices:", data['data'][:10])
            for index in data['data']:
                index_info = {
                    'key': index.get('key', ''),
                    'name': index.get('index', ''),
                    'symbol': index.get('indexSymbol', ''),
                    'lastPrice': index.get('last', 0),
                    'change': index.get('variation', 0),
                    'pChange': index.get('percentChange', 0),
                    'previousClose': index.get('previousClose', 0),
                    'open': index.get('open', 0),
                    'high': index.get('high', 0),
                    'low': index.get('low', 0),
                    'yearHigh': index.get('yearHigh', 0),
                    'yearLow': index.get('yearLow', 0),
                    'indicativeClose': index.get('indicativeClose', 0),
                    'pe': index.get('pe', ''),
                    'pb': index.get('pb', ''),
                    'dy': index.get('dy', ''),
                    'advances': index.get('advances', '0'),
                    'declines': index.get('declines', '0'),
                    'unchanged': index.get('unchanged', '0'),
                    'perChange365d': index.get('perChange365d', 0),
                    'date365dAgo': index.get('date365dAgo', ''),
                    'perChange30d': index.get('perChange30d', 0),
                    'date30dAgo': index.get('date30dAgo', ''),
                    'previousDay': index.get('previousDay', 0),
                    'oneWeekAgo': index.get('oneWeekAgo', 0),
                    'oneMonthAgo': index.get('oneMonthAgo', 0),
                    'oneYearAgo': index.get('oneYearAgo', 0),
                    'chartTodayPath': index.get('chartTodayPath', ''),
                    'chart30dPath': index.get('chart30dPath', ''),
                    'chart365dPath': index.get('chart365dPath', '')
                }
                indices_data.append(index_info)
        
        return {
            'success': True,
            'indices': indices_data,
            'count': len(indices_data)
        }
    except Exception as e:
        print(f"Error fetching all indices: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

# def get_live_gainers():
#     """Get live analysis gainers from NSE API"""
#     try:
#         # NSE API for live analysis gainers
#         url = "https://www.nseindia.com/api/live-analysis-gainers"
        
#         # Fetch data
#         data = nsefetch(url)
        
#         print(f"URL:", url)
#         print(f"Live Gainers API Response:", data)
        
#         # Extract gainers data
#         gainers_data = []
        
#         if 'data' in data and isinstance(data['data'], list):
#             print(f"Processing {len(data['data'])} gainers...")
#             for stock in data['data']:
#                 stock_info = {
#                     'symbol': stock.get('symbol', ''),
#                     'ltp': stock.get('ltp', 0),
#                     'change': stock.get('change', 0),
#                     'pChange': stock.get('pChange', 0),
#                     'previousClose': stock.get('previousClose', 0),
#                     'open': stock.get('open', 0),
#                     'high': stock.get('high', 0),
#                     'low': stock.get('low', 0),
#                     'volume': stock.get('totalTradedVolume', 0),
#                     'turnover': stock.get('turnover', 0),
#                     'yearHigh': stock.get('yearHigh', 0),
#                     'yearLow': stock.get('yearLow', 0),
#                     'pe': stock.get('pe', ''),
#                     'pb': stock.get('pb', ''),
#                     'dy': stock.get('dy', ''),
#                     'marketCap': stock.get('marketCap', 0),
#                     'sector': stock.get('sector', ''),
#                     'companyName': stock.get('companyName', '')
#                 }
#                 gainers_data.append(stock_info)
        
#         return {
#             'success': True,
#             'gainers': gainers_data,
#             'count': len(gainers_data)
#         }
#     except Exception as e:
#         print(f"Error fetching live gainers: {str(e)}")
#         return {
#             'success': False,
#             'error': str(e)
#         }

def get_52week_high_stocks():
    """Get 52-week high stocks from NSE API"""
    try:
        # NSE API for 52-week high stocks
        url = "https://www.nseindia.com/api/live-analysis-data-52weekhighstock"
        
        # Fetch data
        data = nsefetch(url)
        
        print(f"URL:", url)
        print(f"52-Week High Stocks API Response:", data)
        
        # Extract 52-week high stocks data
        high_stocks_data = []
        
        if 'data' in data and isinstance(data['data'], list):
            print(f"Processing {len(data['data'])} 52-week high stocks...")
            for stock in data['data']:
                stock_info = {
                    'symbol': stock.get('symbol', ''),
                    'series': stock.get('series', ''),
                    'companyName': stock.get('comapnyName', ''),  # Note: API has typo 'comapnyName'
                    'new52WHL': stock.get('new52WHL', 0),
                    'prev52WHL': stock.get('prev52WHL', 0),
                    'prevHLDate': stock.get('prevHLDate', ''),
                    'ltp': stock.get('ltp', 0),
                    'prevClose': stock.get('prevClose', 0),
                    'change': stock.get('change', 0),
                    'pChange': stock.get('pChange', 0)
                }
                high_stocks_data.append(stock_info)
        
        return {
            'success': True,
            'highStocks': high_stocks_data,
            'count': len(high_stocks_data),
            'totalHigh': data.get('high', 0),
            'timestamp': data.get('timestamp', '')
        }
    except Exception as e:
        print(f"Error fetching 52-week high stocks: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

def get_52week_low_stocks():
    """Get 52-week low stocks from NSE API"""
    try:
        # NSE API for 52-week low stocks
        url = "https://www.nseindia.com/api/live-analysis-data-52weeklowstock"
        
        # Fetch data
        data = nsefetch(url)
        
        print(f"URL:", url)
        print(f"52-Week Low Stocks API Response:", data)
        
        # Extract 52-week low stocks data
        low_stocks_data = []
        
        if 'data' in data and isinstance(data['data'], list):
            print(f"Processing {len(data['data'])} 52-week low stocks...")
            for stock in data['data']:
                stock_info = {
                    'symbol': stock.get('symbol', ''),
                    'series': stock.get('series', ''),
                    'companyName': stock.get('comapnyName', ''),  # Note: API has typo 'comapnyName'
                    'new52WHL': stock.get('new52WHL', 0),
                    'prev52WHL': stock.get('prev52WHL', 0),
                    'prevHLDate': stock.get('prevHLDate', ''),
                    'ltp': stock.get('ltp', 0),
                    'prevClose': stock.get('prevClose', 0),
                    'change': stock.get('change', 0),
                    'pChange': stock.get('pChange', 0)
                }
                low_stocks_data.append(stock_info)
        
        return {
            'success': True,
            'lowStocks': low_stocks_data,
            'count': len(low_stocks_data),
            'totalLow': data.get('low', 0),
            'timestamp': data.get('timestamp', '')
        }
    except Exception as e:
        print(f"Error fetching 52-week low stocks: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

@app.route('/')
def hello_world():
    return jsonify({
        'message': 'Hello World!',
        'status': 'success'
    })

@app.route('/api/hello')
def api_hello():
    return jsonify({
        'message': 'Hello from Finance API!',
        'status': 'success',
        'data': {
            'service': 'Finance Backend',
            'version': '1.0.0'
        }
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Finance API is running'
    })

@app.route('/api/nifty50/symbols')
def get_nifty50_symbols_endpoint():
    """Get list of Nifty 50 stock symbols"""
    try:
        result = get_nifty50_symbols()
        
        if result['success']:
            return jsonify({
                'status': 'success',
                'data': {
                    'symbols': result['symbols'],
                    'count': result['count']
                }
            })
        else:
            return jsonify({
                'status': 'error',
                'message': result['error']
            }), 503
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/indices/all')
def get_all_indices_endpoint():
    """Get all indices from NSE API"""
    try:
        result = get_all_indices()
        
        if result['success']:
            return jsonify({
                'status': 'success',
                'data': {
                    'indices': result['indices'],
                    'count': result['count']
                }
            })
        else:
            return jsonify({
                'status': 'error',
                'message': result['error']
            }), 503
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/live/gainers')
def get_live_gainers_endpoint():
    """Get live analysis gainers from NSE API"""
    try:
        result = get_live_gainers()
        
        if result['success']:
            return jsonify({
                'status': 'success',
                'data': {
                    'gainers': result['gainers'],
                    'count': result['count']
                }
            })
        else:
            return jsonify({
                'status': 'error',
                'message': result['error']
            }), 503
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/live/52week-high')
def get_52week_high_stocks_endpoint():
    """Get 52-week high stocks from NSE API"""
    try:
        result = get_52week_high_stocks()
        
        if result['success']:
            return jsonify({
                'status': 'success',
                'data': {
                    'highStocks': result['highStocks'],
                    'count': result['count'],
                    'totalHigh': result['totalHigh'],
                    'timestamp': result['timestamp']
                }
            })
        else:
            return jsonify({
                'status': 'error',
                'message': result['error']
            }), 503
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/live/52week-low')
def get_52week_low_stocks_endpoint():
    """Get 52-week low stocks from NSE API"""
    try:
        result = get_52week_low_stocks()
        
        if result['success']:
            return jsonify({
                'status': 'success',
                'data': {
                    'lowStocks': result['lowStocks'],
                    'count': result['count'],
                    'totalLow': result['totalLow'],
                    'timestamp': result['timestamp']
                }
            })
        else:
            return jsonify({
                'status': 'error',
                'message': result['error']
            }), 503
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
