#!/usr/bin/env python3
"""
Finance API - Main Application Entry Point
"""

import os
from app import create_app
from app.utils.logger import logger

def main():
    """Main application entry point"""
    
    # Get configuration from environment
    config_name = os.environ.get('FLASK_CONFIG', 'development')
    
    # Create application
    app = create_app(config_name)
    
    # Run application
    if __name__ == '__main__':
        logger.info("Starting Finance API server...")
        app.run(
            debug=app.config['DEBUG'],
            host='0.0.0.0',
            port=5000
        )

if __name__ == '__main__':
    main()
