import pytest
from app import create_app

@pytest.fixture
def client():
    """Create a test client for the app"""
    app = create_app('testing')
    with app.test_client() as client:
        yield client

def test_hello_world(client):
    """Test the root endpoint"""
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert 'Hello World!' in data['message']

def test_api_hello(client):
    """Test the API hello endpoint"""
    response = client.get('/api/hello')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert data['data']['service'] == 'Finance Backend'

def test_health_check(client):
    """Test the health check endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'

def test_404_error(client):
    """Test 404 error handling"""
    response = client.get('/nonexistent')
    assert response.status_code == 404
    data = response.get_json()
    assert data['status'] == 'error'
