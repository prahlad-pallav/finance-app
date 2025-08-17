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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
