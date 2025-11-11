import React, { useState, useEffect } from 'react';

const SimpleAPITest = () => {
  const [results, setResults] = useState({});

  const testDirectAPI = async () => {
    const tests = {
      products: 'http://localhost:5000/api/products',
      users: 'http://localhost:5000/api/users', 
      workshifts: 'http://localhost:5000/api/workshifts',
      promotions: 'http://localhost:5000/api/promotions'
    };

    const newResults = {};

    for (const [key, url] of Object.entries(tests)) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          newResults[key] = `✅ SUCCESS - ${data.count} items`;
        } else {
          newResults[key] = `❌ ERROR - ${response.status}`;
        }
      } catch (error) {
        newResults[key] = `❌ ERROR - ${error.message}`;
      }
    }

    setResults(newResults);
  };

  useEffect(() => {
    testDirectAPI();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #007bff', 
      borderRadius: '8px', 
      marginBottom: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>🔍 Direct API Test</h3>
      {Object.entries(results).map(([key, result]) => (
        <div key={key} style={{ margin: '5px 0' }}>
          <strong>{key}:</strong> {result}
        </div>
      ))}
      <button 
        onClick={testDirectAPI}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Again
      </button>
    </div>
  );
};

export default SimpleAPITest;