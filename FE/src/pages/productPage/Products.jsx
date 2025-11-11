import React, { useState, useEffect } from 'react'
import ProductService from '../../services/productService.js';
import './Product.css'; // Import CSS riêng cho Products

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products from API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await ProductService.getAllProducts();
      
      if (Array.isArray(products)) {
        setProducts(products);
        setFilteredProducts(products);
      } else {
        setError('Failed to load products - invalid response');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm sản phẩm
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        // Tìm kiếm trong tất cả các trường
        (product.ProductID && product.ProductID.toLowerCase().includes(value)) ||
        ((product.Name || product.ProductName) && (product.Name || product.ProductName).toLowerCase().includes(value)) ||
        (product.Barcode && product.Barcode.toLowerCase().includes(value)) ||
        (product.Brand && product.Brand.toLowerCase().includes(value)) ||
        (product.Category && product.Category.toLowerCase().includes(value)) ||
        (product.Location && product.Location.toLowerCase().includes(value)) ||
        (product.Unit && Array.isArray(product.Unit) && product.Unit.some(unit => 
          unit && typeof unit === 'object' && unit.name && unit.name.toLowerCase().includes(value)
        )) ||
        (product.Unit && typeof product.Unit === 'string' && product.Unit.toLowerCase().includes(value)) ||
        (product.SupplierID && product.SupplierID.toLowerCase().includes(value))
      );
      setFilteredProducts(filtered);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="page-content">
        <h1>Quản lý Sản phẩm</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>⏳ Đang tải dữ liệu sản phẩm...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="page-content">
        <h1>Quản lý Sản phẩm</h1>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <div>❌ Lỗi: {error}</div>
          <button onClick={loadProducts} style={{ marginTop: '10px', padding: '8px 16px' }}>
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>Quản lý Sản phẩm</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm sản phẩm"
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

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th className="product-col-id">Mã SP</th>
              <th className="product-col-barcode">Barcode</th>
              <th className="product-col-name">Tên sản phẩm</th>
              <th className="product-col-brand">Thương hiệu</th>
              <th className="product-col-category">Danh mục</th>
              <th className="product-col-detail">Chi tiết</th>
              <th className="product-col-price">Giá bán</th>
              <th className="product-col-cost">Giá vốn</th>
              <th className="product-col-stock">Tồn kho</th>
              <th className="product-col-location">Vị trí</th>
              <th className="product-col-unit">Đơn vị</th>
              <th className="product-col-supplier">Nhà cung cấp</th>
              <th className="product-col-manufacture">NSX</th>
              <th className="product-col-expiry">HSD</th>
              <th className="product-col-status">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product.ProductID || product._id}>
                  <td className="product-col-id"><strong>{product.ProductID}</strong></td>
                  <td className="product-col-barcode"><code>{product.Barcode || 'N/A'}</code></td>
                  <td className="product-col-name">
                    <div>
                      <div className="product-name">{product.Name || product.ProductName || 'N/A'}</div>
                      <div className="product-desc">{product.Description || ''}</div>
                    </div>
                  </td>
                  <td className="product-col-brand">{product.Brand || 'N/A'}</td>
                  <td className="product-col-category">
                    {product.Category && Array.isArray(product.Category) ? 
                      product.Category.join(', ') : 
                      (product.Category || 'N/A')
                    }
                  </td>
                  <td className="product-col-detail">
                    {product.Detail && Array.isArray(product.Detail) && product.Detail.length > 0 ? (
                      <div className="product-details">
                        {product.Detail.map((detail, index) => (
                          <div key={index} className="detail-item">
                            <strong>{detail.k}:</strong> {detail.v}
                          </div>
                        ))}
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="product-col-price price">{product.Price ? product.Price.toLocaleString('vi-VN') + '₫' : 'N/A'}</td>
                  <td className="product-col-cost cost">{product.Cost ? product.Cost.toLocaleString('vi-VN') + '₫' : 'N/A'}</td>
                  <td className="product-col-stock">
                    <span className="stock">
                      {product.Stock || 0} {(() => {
                        if (product.Unit && Array.isArray(product.Unit) && product.Unit.length > 0) {
                          const unit = product.Unit[0];
                          return typeof unit === 'object' ? (unit.name || unit.id || '') : (unit || '');
                        }
                        return typeof product.Unit === 'string' ? product.Unit : '';
                      })()}
                    </span>
                    {product.ReorderLevel && (
                      <div className="reorder-info">
                        (Tái đặt: {product.ReorderLevel})
                      </div>
                    )}
                  </td>
                  <td className="product-col-location location">{product.Location || 'N/A'}</td>
                  <td className="product-col-unit">
                    {(() => {
                      if (product.Unit && Array.isArray(product.Unit) && product.Unit.length > 0) {
                        const unit = product.Unit[0];
                        if (typeof unit === 'object') {
                          return unit.name || unit.id || unit._id || 'N/A';
                        }
                        return unit || 'N/A';
                      }
                      return typeof product.Unit === 'string' ? product.Unit : 'N/A';
                    })()}
                  </td>
                  <td className="product-col-supplier">
                    {(() => {
                      if (product.Supplier && typeof product.Supplier === 'object') {
                        return product.Supplier.name || product.Supplier.id || product.Supplier._id || 'N/A';
                      }
                      return product.SupplierID || product.Supplier || 'N/A';
                    })()}
                  </td>
                  <td className="product-col-manufacture manufacture-date">
                    {product.manufactureDate ? new Date(product.manufactureDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="product-col-expiry expiry-date">
                    {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="product-col-status">
                    <span className="status-badge active">
                      Hoạt động
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-icon">🔍</div>
                    <div className="no-results-text">
                      Không tìm thấy sản phẩm nào với từ khóa "<strong>{searchTerm}</strong>"
                    </div>
                    <div className="no-results-suggestion">
                      Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Products