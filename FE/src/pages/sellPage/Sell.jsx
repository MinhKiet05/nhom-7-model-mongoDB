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
  const [showCheckout, setShowCheckout] = useState(false);

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
          Unit: Array.isArray(product.Unit) ? product.Unit : [],
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
    
    // Find current valid price (prefer IsCurrent flag, then date range)
    const now = new Date();
    
    // First, look for prices marked as current
    const currentPrices = productPrices.filter(price => price.IsCurrent);
    if (currentPrices.length > 0) {
      const validCurrentPrice = currentPrices.find(price => {
        if (!price.Start || !price.End) return true; // No date restriction
        const startDate = new Date(price.Start);
        const endDate = new Date(price.End);
        return startDate <= now && now <= endDate;
      });
      
      if (validCurrentPrice) {
        return {
          price: validCurrentPrice.Price,
          otherTax: Array.isArray(validCurrentPrice.OtherTax) ? validCurrentPrice.OtherTax.join(', ') : validCurrentPrice.OtherTax,
          note: validCurrentPrice.Note,
          unitId: validCurrentPrice.UnitID
        };
      }
    }
    
    // If no current price, find any valid price by date range
    const validPrice = productPrices.find(price => {
      if (!price.Start || !price.End) return false;
      const startDate = new Date(price.Start);
      const endDate = new Date(price.End);
      return startDate <= now && now <= endDate;
    });
    
    if (validPrice) {
      return {
        price: validPrice.Price,
        otherTax: Array.isArray(validPrice.OtherTax) ? validPrice.OtherTax.join(', ') : validPrice.OtherTax,
        note: validPrice.Note,
        unitId: validPrice.UnitID
      };
    }
    
    // Fallback to most recent price
    const latestPrice = productPrices[0];
    if (latestPrice) {
      return {
        price: latestPrice.Price,
        otherTax: Array.isArray(latestPrice.OtherTax) ? latestPrice.OtherTax.join(', ') : latestPrice.OtherTax,
        note: latestPrice.Note,
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

  // Calculate tax for a product
  const calculateProductTax = (product, quantity, price) => {
    if (!Array.isArray(product.TaxID) || product.TaxID.length === 0) {
      return { taxAmount: 0, taxDetails: [] };
    }

    const priceInfo = getCurrentPrice(product.ProductID);
    let totalTaxAmount = 0;
    const taxDetails = [];

    product.TaxID.forEach(taxCode => {
      const taxInfo = getTaxInfo(taxCode);
      if (taxInfo && taxInfo.status === 'active') {
        const taxAmount = (price * quantity * taxInfo.percent) / 100;
        totalTaxAmount += taxAmount;
        taxDetails.push({
          taxCode: taxCode,
          taxName: taxInfo.name,
          percent: taxInfo.percent,
          amount: taxAmount
        });
      }
    });

    // Add other tax from price if exists
    if (priceInfo && priceInfo.otherTax) {
      const match = priceInfo.otherTax.match(/(\d+)%/);
      if (match) {
        const otherTaxPercent = parseFloat(match[1]);
        const otherTaxAmount = (price * quantity * otherTaxPercent) / 100;
        totalTaxAmount += otherTaxAmount;
        taxDetails.push({
          taxCode: 'OTHER',
          taxName: priceInfo.otherTax,
          percent: otherTaxPercent,
          amount: otherTaxAmount
        });
      }
    }

    return { taxAmount: totalTaxAmount, taxDetails };
  };

  // Calculate total tax for all selected products
  const getTotalTaxBreakdown = () => {
    let totalSubtotal = 0;
    let totalTaxAmount = 0;
    const taxSummary = {};

    selectedProducts.forEach(item => {
      const price = item.currentPrice || item.Price || 0;
      const subtotal = Number(price) * Number(item.quantity || 0);
      totalSubtotal += subtotal;

      const { taxAmount, taxDetails } = calculateProductTax(item, item.quantity, price);
      totalTaxAmount += taxAmount;

      // Aggregate tax by type
      taxDetails.forEach(tax => {
        const key = `${tax.taxCode}_${tax.percent}`;
        if (!taxSummary[key]) {
          taxSummary[key] = {
            taxName: tax.taxName,
            percent: tax.percent,
            amount: 0
          };
        }
        taxSummary[key].amount += tax.amount;
      });
    });

    return {
      subtotal: totalSubtotal,
      totalTax: totalTaxAmount,
      total: totalSubtotal + totalTaxAmount,
      taxBreakdown: Object.values(taxSummary)
    };
  };

  // Handle checkout
  const handleCheckout = () => {
    if (selectedProducts.length > 0) {
      setShowCheckout(true);
    }
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
                <th className="sell-col-price">Giá bán</th>
                <th className="sell-col-category">Danh mục</th>
                <th className="sell-col-tax">Thuế</th>
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
                        Đơn vị: {Array.isArray(product.Unit) && product.Unit.length > 0 ? product.Unit[0].name : (product.Unit || 'N/A')}
                      </div>
                    </td>

                    {/* Giá bán */}
                    <td className="sell-col-price">
                      {(() => {
                        const priceInfo = getCurrentPrice(product.ProductID);
                        const displayPrice = priceInfo ? priceInfo.price : (product.Price || 0);
                        
                        // Get unit name from product.Unit array or priceInfo.unitId
                        let displayUnit = 'đơn vị';
                        if (Array.isArray(product.Unit) && product.Unit.length > 0) {
                          displayUnit = product.Unit[0].name;
                        } else if (priceInfo && priceInfo.unitId) {
                          // Check if unitId matches any Unit in product.Unit array
                          if (Array.isArray(product.Unit)) {
                            const matchedUnit = product.Unit.find(unit => unit.id === priceInfo.unitId);
                            displayUnit = matchedUnit ? matchedUnit.name : priceInfo.unitId;
                          } else {
                            displayUnit = priceInfo.unitId;
                          }
                        } else if (product.Unit) {
                          displayUnit = product.Unit;
                        }
                        
                        return (
                          <>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#059669',
                              fontFamily: 'monospace',
                              textAlign: 'center',
                              marginBottom: '4px'
                            }}>
                              {displayPrice ? `${Number(displayPrice).toLocaleString('vi-VN')}₫` : 'Liên hệ'}
                            </div>
                            
                            
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
                    </td>

                    {/* Thuế */}
                    <td className="sell-col-tax">
                      {Array.isArray(product.TaxID) && product.TaxID.length > 0 ? (
                        product.TaxID.map((taxCode, index) => {
                          const taxInfo = getTaxInfo(taxCode);
                          return (
                            <div key={index} style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '600',
                              marginBottom: '2px',
                              backgroundColor: taxInfo ? (taxInfo.percent <= 5 ? '#dcfce7' : '#fef2f2') : '#f3f4f6',
                              color: taxInfo ? (taxInfo.percent <= 5 ? '#059669' : '#dc2626') : '#6b7280',
                              display: 'inline-block'
                            }}>
                              {taxInfo ? `${taxInfo.name}` : taxCode}
                            </div>
                          );
                        })
                      ) : (
                        <span style={{
                          fontSize: '11px',
                          color: '#6b7280',
                          fontStyle: 'italic'
                        }}>
                          Không áp dụng
                        </span>
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
                  <td colSpan="6" className="no-results">
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
          <button 
            className="checkout-btn" 
            disabled={selectedProducts.length === 0}
            onClick={handleCheckout}
          >
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

      {/* Checkout Modal */}
      {showCheckout && (() => {
        const calculation = getTotalTaxBreakdown();
        return (
          <div className="checkout-modal-overlay" onClick={() => setShowCheckout(false)}>
            <div className="checkout-modal" onClick={e => e.stopPropagation()}>
              <div className="checkout-modal-header">
                <h2>Chi tiết thanh toán</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowCheckout(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="checkout-modal-body">
                {/* Selected Products */}
                <div className="selected-products">
                  <h3>Sản phẩm đã chọn</h3>
                  {selectedProducts.map(item => {
                    const price = item.currentPrice || item.Price || 0;
                    const subtotal = Number(price) * Number(item.quantity || 0);
                    const { taxAmount } = calculateProductTax(item, item.quantity, price);
                    
                    return (
                      <div key={item.ProductID} className="checkout-product-item">
                        <div className="product-name">{item.Name}</div>
                        <div className="product-details">
                          <span>{item.quantity} × {Number(price).toLocaleString('vi-VN')}₫</span>
                          <span className="product-subtotal">
                            {subtotal.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tax Breakdown */}
                <div className="tax-breakdown">
                  <h3>Chi tiết thuế</h3>
                  {calculation.taxBreakdown.length > 0 ? (
                    calculation.taxBreakdown.map((tax, index) => (
                      <div key={index} className="tax-item">
                        <span>{tax.taxName} ({tax.percent}%)</span>
                        <span>{tax.amount.toLocaleString('vi-VN')}₫</span>
                      </div>
                    ))
                  ) : (
                    <div className="tax-item">
                      <span>Không có thuế</span>
                      <span>0₫</span>
                    </div>
                  )}
                </div>

                {/* Total Summary */}
                <div className="checkout-summary">
                  <div className="summary-row">
                    <span>Tổng tiền hàng:</span>
                    <span>{calculation.subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="summary-row">
                    <span>Tổng thuế:</span>
                    <span>{calculation.totalTax.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="summary-row total">
                    <span>Tổng cộng:</span>
                    <span>{calculation.total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>

              <div className="checkout-modal-footer">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowCheckout(false)}
                >
                  Hủy
                </button>
                        <button
                            className="confirm-checkout-btn"
                            onClick={() => {
                                alert('Thanh toán thành công!');
                                setShowCheckout(false);
                                setSelectedProducts([]);
                            }}
                            style={{backgroundColor:"#3498db"}}
                >
                  Xác nhận thanh toán
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Sell;
