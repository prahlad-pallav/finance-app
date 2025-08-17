from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
