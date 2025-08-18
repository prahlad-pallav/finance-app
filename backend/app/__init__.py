from flask import Flask, jsonify
from flask_cors import CORS
from app.config.config import config
from app.utils.logger import logger
import os

def create_app(config_name='default'):
    """Application factory pattern"""
    
    # Create Flask app
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Configure CORS
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Register blueprints
    from app.api.routes import api_bp
    app.register_blueprint(api_bp)
    
    # Root route
    @app.route('/')
    def hello_world():
        return jsonify({
            'message': 'Hello World!',
            'status': 'success',
            'service': 'Finance API',
            'version': app.config['API_VERSION']
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'status': 'error',
            'message': 'Endpoint not found'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {error}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500
    
    # Log application startup
    logger.info(f"Finance API started with config: {config_name}")
    
    return app
