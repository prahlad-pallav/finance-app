from flask import Blueprint, jsonify
from app.services.nse_service import NSEService
from app.utils.logger import logger

# Create Blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Initialize NSE Service
nse_service = NSEService()

@api_bp.route('/hello')
def api_hello():
    """Hello API endpoint"""
    return jsonify({
        'message': 'Hello from Finance API!',
        'status': 'success',
        'data': {
            'service': 'Finance Backend',
            'version': '1.0.0'
        }
    })

@api_bp.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Finance API is running'
    })

@api_bp.route('/nifty50/symbols')
def get_nifty50_symbols():
    """Get list of Nifty 50 stock symbols"""
    try:
        logger.info("Fetching Nifty50 symbols")
        result = nse_service.get_nifty50_symbols()
        
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
        logger.error(f"Error in Nifty50 symbols endpoint: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@api_bp.route('/indices/all')
def get_all_indices():
    """Get all indices from NSE API"""
    try:
        logger.info("Fetching all indices")
        result = nse_service.get_all_indices()
        
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
        logger.error(f"Error in all indices endpoint: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@api_bp.route('/live/52week-high')
def get_52week_high_stocks():
    """Get 52-week high stocks from NSE API"""
    try:
        logger.info("Fetching 52-week high stocks")
        result = nse_service.get_52week_high_stocks()
        
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
        logger.error(f"Error in 52-week high stocks endpoint: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@api_bp.route('/live/52week-low')
def get_52week_low_stocks():
    """Get 52-week low stocks from NSE API"""
    try:
        logger.info("Fetching 52-week low stocks")
        result = nse_service.get_52week_low_stocks()
        
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
        logger.error(f"Error in 52-week low stocks endpoint: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
