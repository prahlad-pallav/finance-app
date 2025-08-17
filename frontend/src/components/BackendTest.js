import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const BackendTest = () => {
  const [apiStatus, setApiStatus] = useState('loading');
  const [apiInfo, setApiInfo] = useState(null);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      setApiStatus('loading');
      setError(null);
      setDebugInfo({});

      console.log('Starting backend connection test...');
      console.log('API Base URL:', apiService.baseURL);

      // Test health check
      console.log('Testing health check...');
      const healthData = await apiService.healthCheck();
      console.log('Health check response:', healthData);

      // Test API info
      console.log('Testing API info...');
      const apiData = await apiService.getApiInfo();
      console.log('API info response:', apiData);

      setApiInfo(apiData);
      setApiStatus('connected');
      setDebugInfo({
        baseUrl: apiService.baseURL,
        healthCheck: 'success',
        apiInfo: 'success',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Backend connection failed:', err);
      setError(err.message);
      setApiStatus('error');
      setDebugInfo({
        baseUrl: apiService.baseURL,
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'connected':
        return '#10B981';
      case 'error':
        return '#EF4444';
      default:
        return '#F59E0B';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'connected':
        return 'Connected to Backend';
      case 'error':
        return 'Connection Failed';
      default:
        return 'Connecting...';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Backend Connection Test</h2>
      
      <div style={{ 
        padding: '15px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            animation: apiStatus === 'loading' ? 'pulse 1.5s infinite' : 'none'
          }}></div>
          <strong>{getStatusText()}</strong>
        </div>
        
        {apiStatus === 'connected' && apiInfo && (
          <div>
            <p><strong>Message:</strong> {apiInfo.message}</p>
            <p><strong>Service:</strong> {apiInfo.data?.service}</p>
            <p><strong>Version:</strong> {apiInfo.data?.version}</p>
          </div>
        )}
        
        {apiStatus === 'error' && error && (
          <div style={{ color: '#EF4444' }}>
            <p><strong>Error:</strong> {error}</p>
            <p>Make sure your Flask backend is running on http://localhost:5000</p>
          </div>
        )}
      </div>

      {/* Debug Information */}
      <div style={{ 
        padding: '15px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#f0f0f0',
        fontSize: '12px'
      }}>
        <h4>Debug Information</h4>
        <pre style={{ 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-word',
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      {/* Troubleshooting Steps */}
      <div style={{ 
        padding: '15px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#fff3cd',
        borderColor: '#ffeaa7'
      }}>
        <h4>Troubleshooting Steps</h4>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Check if Flask backend is running: <code>python app.py</code></li>
          <li>Verify backend URL: <code>http://localhost:5000</code></li>
          <li>Test backend directly: <code>curl http://localhost:5000/api/health</code></li>
          <li>Check browser console for detailed error messages</li>
          <li>Ensure no firewall is blocking the connection</li>
        </ol>
      </div>

      <button 
        onClick={testBackendConnection}
        disabled={apiStatus === 'loading'}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: apiStatus === 'loading' ? 'not-allowed' : 'pointer',
          opacity: apiStatus === 'loading' ? 0.6 : 1,
          marginRight: '10px'
        }}
      >
        {apiStatus === 'loading' ? 'Testing...' : 'Test Connection'}
      </button>

      <button 
        onClick={() => {
          console.log('Manual backend test...');
          fetch('http://localhost:5000/api/health')
            .then(response => response.json())
            .then(data => {
              console.log('Manual fetch result:', data);
              alert('Manual fetch successful! Check console for details.');
            })
            .catch(error => {
              console.error('Manual fetch error:', error);
              alert('Manual fetch failed! Check console for details.');
            });
        }}
        style={{
          padding: '10px 20px',
          backgroundColor: '#10B981',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Manual Test
      </button>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BackendTest;
