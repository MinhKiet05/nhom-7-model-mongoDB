import React, { useState, useEffect } from 'react';
import CustomerService from '../services/customerService.js';
import ProductService from '../services/productService.js';
import SupplierService from '../services/supplierService.js';
import WorkshiftService from '../services/workshiftService.js';

const ApiTestComponent = () => {
  const [status, setStatus] = useState('testing');
  const [results, setResults] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setStatus('testing');
    setResults([]);
    
    const testResults = [];
    let hasErrors = false;
    let customers = [], products = [], suppliers = [], workshifts = [];

    try {
      // Test Customer API
      customers = await CustomerService.getAllCustomers();
      if (Array.isArray(customers)) {
        testResults.push({
          test: 'Customers API',
          status: 'SUCCESS',
          message: `Found ${customers.length} customers`
        });
      } else {
        testResults.push({
          test: 'Customers API',
          status: 'ERROR',
          message: 'Failed to fetch customers - invalid response'
        });
        hasErrors = true;
      }

      // Test Product API
      products = await ProductService.getAllProducts();
      if (Array.isArray(products)) {
        testResults.push({
          test: 'Products API',
          status: 'SUCCESS',
          message: `Found ${products.length} products`
        });
      } else {
        testResults.push({
          test: 'Products API',
          status: 'ERROR',
          message: 'Failed to fetch products - invalid response'
        });
        hasErrors = true;
      }

      // Test Supplier API
      suppliers = await SupplierService.getAllSuppliers();
      if (Array.isArray(suppliers)) {
        testResults.push({
          test: 'Suppliers API',
          status: 'SUCCESS',
          message: `Found ${suppliers.length} suppliers`
        });
      } else {
        testResults.push({
          test: 'Suppliers API',
          status: 'ERROR',
          message: 'Failed to fetch suppliers - invalid response'
        });
        hasErrors = true;
      }

      // Test Workshift API
      workshifts = await WorkshiftService.getAllWorkshifts();
      if (Array.isArray(workshifts)) {
        testResults.push({
          test: 'Workshifts API',
          status: 'SUCCESS',
          message: `Found ${workshifts.length} workshifts`
        });
      } else {
        testResults.push({
          test: 'Workshifts API',
          status: 'ERROR',
          message: 'Failed to fetch workshifts - invalid response'
        });
        hasErrors = true;
      }

      // Test data samples
      if (!hasErrors) {
        const sampleData = [];
        if (customers?.length > 0) {
          sampleData.push(`Customer: ${customers[0].FullName || customers[0].CustomerName || 'Unknown'}`);
        }
        if (products?.length > 0) {
          sampleData.push(`Product: ${products[0].Name || products[0].ProductName || 'Unknown'}`);
        }
        if (suppliers?.length > 0) {
          sampleData.push(`Supplier: ${suppliers[0].Name || suppliers[0].SupplierName || 'Unknown'}`);
        }
        if (workshifts?.length > 0) {
          sampleData.push(`Workshift: ${workshifts[0].ShiftID || workshifts[0].Name || 'Unknown'}`);
        }

        if (sampleData.length > 0) {
          testResults.push({
            test: 'Data Sample',
            status: 'SUCCESS',
            message: sampleData.join(' | ')
          });
        }
      }

      setResults(testResults);
      setStatus(hasErrors ? 'error' : 'success');

    } catch (error) {
      setResults([
        { test: 'Connection Test', status: 'ERROR', message: error.message }
      ]);
      setStatus('error');
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #ddd', 
      borderRadius: '8px', 
      marginBottom: '20px',
      backgroundColor: status === 'success' ? '#d4edda' : status === 'error' ? '#f8d7da' : '#fff3cd'
    }}>
      <h3>🔗 API Connection Test</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Status: </strong>
        <span style={{ 
          color: status === 'success' ? 'green' : status === 'error' ? 'red' : 'orange',
          fontWeight: 'bold'
        }}>
          {status === 'testing' ? '⏳ TESTING...' : status === 'success' ? '✅ ALL CONNECTED' : '❌ CONNECTION ISSUES'}
        </span>
      </div>

      <div>
        <strong>API Endpoints:</strong>
        {results.map((result, index) => (
          <div key={index} style={{ 
            margin: '5px 0', 
            padding: '8px', 
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: '4px',
            borderLeft: `4px solid ${result.status === 'SUCCESS' ? 'green' : 'red'}`
          }}>
            <strong>{result.test}:</strong> 
            <span style={{ 
              color: result.status === 'SUCCESS' ? 'green' : 'red', 
              marginLeft: '10px',
              fontWeight: 'bold'
            }}>
              {result.status === 'SUCCESS' ? '✅' : '❌'} {result.status}
            </span>
            {result.message && (
              <div style={{ 
                fontSize: '0.9em', 
                color: '#666', 
                marginTop: '4px',
                fontStyle: 'italic'
              }}>
                {result.message}
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={testConnection} 
        style={{ 
          marginTop: '15px', 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
      >
        🔄 Test All APIs Again
      </button>
    </div>
  );
};

export default ApiTestComponent;