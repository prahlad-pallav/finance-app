from nsepython import nsefetch
from app.utils.logger import logger
from app.config.config import Config
import time

class NSEService:
    """Service class for NSE API interactions"""
    
    def __init__(self):
        self.base_url = Config.NSE_BASE_URL
        self.timeout = Config.NSE_TIMEOUT
    
    def fetch_data(self, endpoint):
        """Generic method to fetch data from NSE API"""
        try:
            url = f"{self.base_url}/{endpoint}"
            logger.info(f"Fetching data from: {url}")
            
            # Add delay to respect rate limits
            time.sleep(0.1)
            
            data = nsefetch(url)
            logger.info(f"Successfully fetched data from {endpoint}")
            
            return {
                'success': True,
                'data': data
            }
        except Exception as e:
            logger.error(f"Error fetching data from {endpoint}: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_nifty50_symbols(self):
        """Get Nifty 50 stock symbols"""
        endpoint = "equity-stockIndices?index=NIFTY%2050"
        result = self.fetch_data(endpoint)
        
        if result['success']:
            try:
                data = result['data']
                nifty50_symbols = [stock["symbol"] for stock in data["data"]]
                
                return {
                    'success': True,
                    'symbols': nifty50_symbols,
                    'count': len(nifty50_symbols)
                }
            except Exception as e:
                logger.error(f"Error processing Nifty50 symbols: {str(e)}")
                return {
                    'success': False,
                    'error': str(e)
                }
        
        return result
    
    def get_all_indices(self):
        """Get all indices from NSE"""
        endpoint = "allIndices"
        result = self.fetch_data(endpoint)
        
        if result['success']:
            try:
                data = result['data']
                indices_data = []
                
                if 'data' in data and isinstance(data['data'], list):
                    logger.info(f"Processing {len(data['data'])} indices...")
                    
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
                logger.error(f"Error processing indices data: {str(e)}")
                return {
                    'success': False,
                    'error': str(e)
                }
        
        return result
    
    def get_52week_high_stocks(self):
        """Get 52-week high stocks"""
        endpoint = "live-analysis-data-52weekhighstock"
        result = self.fetch_data(endpoint)
        
        if result['success']:
            try:
                data = result['data']
                high_stocks_data = []
                
                if 'data' in data and isinstance(data['data'], list):
                    logger.info(f"Processing {len(data['data'])} 52-week high stocks...")
                    
                    for stock in data['data']:
                        stock_info = {
                            'symbol': stock.get('symbol', ''),
                            'series': stock.get('series', ''),
                            'companyName': stock.get('comapnyName', ''),
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
                logger.error(f"Error processing 52-week high stocks: {str(e)}")
                return {
                    'success': False,
                    'error': str(e)
                }
        
        return result
    
    def get_52week_low_stocks(self):
        """Get 52-week low stocks"""
        endpoint = "live-analysis-data-52weeklowstock"
        result = self.fetch_data(endpoint)
        
        if result['success']:
            try:
                data = result['data']
                low_stocks_data = []
                
                if 'data' in data and isinstance(data['data'], list):
                    logger.info(f"Processing {len(data['data'])} 52-week low stocks...")
                    
                    for stock in data['data']:
                        stock_info = {
                            'symbol': stock.get('symbol', ''),
                            'series': stock.get('series', ''),
                            'companyName': stock.get('comapnyName', ''),
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
                logger.error(f"Error processing 52-week low stocks: {str(e)}")
                return {
                    'success': False,
                    'error': str(e)
                }
        
        return result
