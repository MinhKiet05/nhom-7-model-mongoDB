import React, { useState, useEffect } from 'react';
import ProductService from '../../services/productService.js';
import TaxService from '../../services/taxService.js';
import PriceService from '../../services/priceService.js';
import './Sell.css';

const Sell = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taxes, setTaxes] = useState([]);
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all data simultaneously
      const [productsData, taxesData, pricesData] = await Promise.all([
        ProductService.getAllProducts(),
        TaxService.getAllTaxes(),
        PriceService.getAllPrices()
      ]);
      
      // Process products data
      if (Array.isArray(productsData)) {
        const sanitizedProducts = productsData.map(product => ({
          ...product,
          ProductID: product.ProductID ? String(product.ProductID) : '',
          Name: product.Name ? String(product.Name) : '',
          Brand: product.Brand ? String(product.Brand) : '',
          Description: product.Description ? String(product.Description) : '',
          Category: product.Category ? String(product.Category) : '',
          Unit: product.Unit ? String(product.Unit) : '',
          Barcode: product.Barcode ? String(product.Barcode) : '',
          TaxID: Array.isArray(product.TaxID) ? product.TaxID : [product.TaxID].filter(Boolean)
        }));
        setProducts(sanitizedProducts);
      } else {
        setError('Failed to load products - invalid response');
        return;
      }
      
      // Process taxes data
      if (Array.isArray(taxesData)) {
        setTaxes(taxesData);
      }
      
      // Process prices data
      if (Array.isArray(pricesData)) {
        setPrices(pricesData);
      }
      
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => {
        const productId = typeof product.ProductID === 'string' ? product.ProductID : String(product.ProductID || '');
        const name = typeof product.Name === 'string' ? product.Name : String(product.Name || '');
        const brand = typeof product.Brand === 'string' ? product.Brand : String(product.Brand || '');
        const barcode = typeof product.Barcode === 'string' ? product.Barcode : String(product.Barcode || '');
        
        return productId.toLowerCase().includes(value) ||
               name.toLowerCase().includes(value) ||
               brand.toLowerCase().includes(value) ||
               barcode.toLowerCase().includes(value);
      });
      setFilteredProducts(filtered);
    }
  };

  const updateQuantity = (productId, change) => {
    setSelectedProducts(prev => {
      const existing = prev.find(item => item.ProductID === productId);
      
      if (existing) {
        const newQuantity = existing.quantity + change;
        if (newQuantity <= 0) {
          return prev.filter(item => item.ProductID !== productId);
        }
        return prev.map(item => 
          item.ProductID === productId 
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else if (change > 0) {
        const product = products.find(p => p.ProductID === productId);
        const priceInfo = getCurrentPrice(productId);
        const currentPrice = priceInfo ? priceInfo.price : (product.Price || 0);
        
        return [...prev, { 
          ...product, 
          quantity: 1,
          currentPrice: currentPrice,
          priceInfo: priceInfo
        }];
      }
      
      return prev;
    });
  };

  const getSelectedQuantity = (productId) => {
    const selected = selectedProducts.find(item => item.ProductID === productId);
    return selected ? selected.quantity : 0;
  };

  const getTotalAmount = () => {
    return selectedProducts.reduce((total, item) => {
      const price = item.currentPrice || item.Price || 0;
      return total + (Number(price) * Number(item.quantity || 0));
    }, 0);
  };

  const getTotalItems = () => {
    return selectedProducts.reduce((total, item) => total + item.quantity, 0);
  };

  // Get tax information by taxCode
  const getTaxInfo = (taxCode) => {
    if (!taxCode || !Array.isArray(taxes)) return null;
    return taxes.find(tax => tax.taxCode === taxCode);
  };

  // Get current price for a product
  const getCurrentPrice = (productId) => {
    if (!productId || !Array.isArray(prices)) return null;
    
    const productPrices = prices.filter(price => price.ProductID === productId);
    if (productPrices.length === 0) return null;
    
    // Find current valid price
    const now = new Date();
    for (const priceRecord of productPrices) {
      if (Array.isArray(priceRecord.PriceList)) {
        for (const priceItem of priceRecord.PriceList) {
          const startDate = new Date(priceItem.Start);
          const endDate = new Date(priceItem.End);
          if (startDate <= now && now <= endDate) {
            return {
              price: priceItem.Price,
              otherTax: priceItem.OtherTax,
              note: priceItem.Note,
              unitId: priceRecord.UnitID
            };
          }
        }
      }
    }
    
    // If no current price found, return the most recent one
    const latestPrice = productPrices[0];
    if (latestPrice && Array.isArray(latestPrice.PriceList) && latestPrice.PriceList.length > 0) {
      const firstPrice = latestPrice.PriceList[0];
      return {
        price: firstPrice.Price,
        otherTax: firstPrice.OtherTax,
        note: firstPrice.Note,
        unitId: latestPrice.UnitID
      };
    }
    
    return null;
  };

  // Get tax display name and percentage
  const getTaxDisplay = (taxCode) => {
    const taxInfo = getTaxInfo(taxCode);
    if (!taxInfo) return taxCode || 'N/A';
    return `${taxInfo.name} (${taxInfo.percent}%)`;
  };

  if (loading) {
    return (
      <div className="page-content">
        <h1>Bán hàng</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Đang tải danh sách sản phẩm...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <h1>Bán hàng</h1>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <div>Lỗi: {error}</div>
          <button onClick={loadAllData} style={{ marginTop: '10px', padding: '8px 16px' }}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>Bán hàng</h1>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm sản phẩm theo mã, tên, thương hiệu, mã vạch..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="table-info">
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px'}}>
          {searchTerm ? (
            <>
              Tìm thấy: <strong>{filteredProducts.length}</strong> sản phẩm 
              <span style={{color: '#3b82f6'}}> (từ khóa: "{searchTerm}")</span>
            </>
          ) : (
            <>Tổng cộng: <strong>{products.length}</strong> sản phẩm</>
          )}
        </p>
      </div>

      <div className="sell-content">
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th className="sell-col-id">Mã sản phẩm</th>
                <th className="sell-col-info">Thông tin sản phẩm</th>
                <th className="sell-col-category">Danh mục</th>
                <th className="sell-col-quantity">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={String(product.ProductID || Math.random())}>
                    {/* Mã sản phẩm */}
                    <td className="sell-col-id">
                      <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '4px'}}>
                        {product.ProductID || 'N/A'}
                      </div>
                      <div style={{fontSize: '11px', color: '#666', fontFamily: 'monospace'}}>
                        {product.Barcode || 'N/A'}
                      </div>
                    </td>

                    {/* Thông tin sản phẩm */}
                    <td className="sell-col-info">
                      <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '4px'}}>
                        {product.Name || 'N/A'}
                      </div>
                      <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>
                        Thương hiệu: {product.Brand || 'N/A'}
                      </div>
                      <div style={{fontSize: '12px', marginBottom: '4px'}}>
                        {product.Description || 'N/A'}
                      </div>
                      <div style={{fontSize: '11px', color: '#666'}}>
                        Đơn vị: {product.Unit || 'N/A'}
                      </div>
                      {(() => {
                        const priceInfo = getCurrentPrice(product.ProductID);
                        const displayPrice = priceInfo ? priceInfo.price : (product.Price || 0);
                        const displayUnit = priceInfo ? priceInfo.unitId : (product.Unit || 'đơn vị');
                        return (
                          <>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: '#059669',
                              fontFamily: 'monospace',
                              marginTop: '4px'
                            }}>
                              {displayPrice ? `${Number(displayPrice).toLocaleString('vi-VN')}₫/${displayUnit}` : 'Liên hệ'}
                            </div>
                            {priceInfo && priceInfo.otherTax && (
                              <div style={{
                                fontSize: '10px',
                                color: '#c2410c',
                                fontWeight: '600',
                                marginTop: '2px'
                              }}>
                                {priceInfo.otherTax}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </td>

                    {/* Danh mục */}
                    <td className="sell-col-category">
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af'
                      }}>
                        {product.Category || 'N/A'}
                      </span>
                      {Array.isArray(product.TaxID) && product.TaxID.length > 0 ? (
                        product.TaxID.map((taxCode, index) => {
                          const taxInfo = getTaxInfo(taxCode);
                          return (
                            <div key={index} style={{
                              fontSize: '10px',
                              color: taxInfo ? (taxInfo.percent <= 5 ? '#059669' : '#dc2626') : '#6b7280',
                              fontWeight: '600',
                              marginTop: '4px'
                            }}>
                              {taxInfo ? `${taxInfo.name}: ${taxInfo.percent}%` : `Thuế: ${taxCode}`}
                            </div>
                          );
                        })
                      ) : (
                        <div style={{
                          fontSize: '11px',
                          color: '#6b7280',
                          fontWeight: '600',
                          marginTop: '4px'
                        }}>
                          Thuế: Không áp dụng
                        </div>
                      )}
                    </td>

                    {/* Số lượng */}
                    <td className="sell-col-quantity">
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn decrease"
                          onClick={() => updateQuantity(product.ProductID, -1)}
                          disabled={getSelectedQuantity(product.ProductID) === 0}
                        >
                          -
                        </button>
                        <span className="quantity-display">
                          {getSelectedQuantity(product.ProductID)}
                        </span>
                        <button 
                          className="quantity-btn increase"
                          onClick={() => updateQuantity(product.ProductID, 1)}
                        >
                          +
                        </button>
                      </div>
                      {getSelectedQuantity(product.ProductID) > 0 && (() => {
                        const priceInfo = getCurrentPrice(product.ProductID);
                        const currentPrice = priceInfo ? priceInfo.price : (product.Price || 0);
                        const quantity = getSelectedQuantity(product.ProductID);
                        const totalPrice = Number(currentPrice) * quantity;
                        
                        return (
                          <div style={{
                            fontSize: '11px',
                            color: '#059669',
                            fontWeight: 'bold',
                            marginTop: '4px',
                            fontFamily: 'monospace'
                          }}>
                            Thành tiền: {totalPrice.toLocaleString('vi-VN')}₫
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    <div className="no-results-content">
                      <div className="no-results-text">
                        {searchTerm ? 
                          `Không tìm thấy sản phẩm nào với từ khóa "${searchTerm}"` : 
                          'Không có dữ liệu sản phẩm'
                        }
                      </div>
                      <div className="no-results-suggestion">
                        {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Dữ liệu sẽ được hiển thị khi có sản phẩm'}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Checkout Button */}
        <div className="checkout-section">
          <button className="checkout-btn" disabled={selectedProducts.length === 0}>
            <div className="checkout-info">
              <div className="checkout-items">
                {getTotalItems()} sản phẩm
              </div>
              <div className="checkout-total">
                {getTotalAmount().toLocaleString('vi-VN')}₫
              </div>
            </div>
            <div className="checkout-text">
              Thanh toán
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sell;
