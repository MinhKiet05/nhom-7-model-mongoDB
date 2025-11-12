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
        // Ensure all products have proper structure
        const normalizedProducts = products.map(product => ({
          ...product,
          ProductID: product.ProductID || '',
          Name: product.Name || product.ProductName || '',
          Brand: product.Brand || '',
          Category: product.Category || '',
          Description: product.Description || '',
          Supplier: product.Supplier || '',
          TaxID: Array.isArray(product.TaxID) ? product.TaxID : [],
          Unit: Array.isArray(product.Unit) ? product.Unit : [],
          Detail: Array.isArray(product.Detail) ? product.Detail : []
        }));
        
        setProducts(normalizedProducts);
        setFilteredProducts(normalizedProducts);
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
        (Array.isArray(product.Unit) && product.Unit.some(unit => 
          unit && typeof unit === 'object' && unit.name && unit.name.toLowerCase().includes(value)
        )) ||
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
          <div> Đang tải dữ liệu sản phẩm...</div>
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
          <div>Lỗi: {error}</div>
          <button onClick={loadProducts} style={{ marginTop: '10px', padding: '8px 16px' }}>
            Thử lại
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
              <th className="product-col-id">Mã sản phẩm</th>
              <th className="product-col-info">Thông tin sản phẩm</th>
              <th className="product-col-category">Danh mục</th>
              <th className="product-col-tax">Thuế</th>
              <th className="product-col-details">Thông số kỹ thuật</th>
              <th className="product-col-dates">Ngày sản xuất/HSD</th>
              <th className="product-col-supplier">Nhà cung cấp</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product.ProductID || product._id} className={product.Info?.Status !== 'Active' ? 'inactive-row' : ''}>
                  {/* Mã sản phẩm */}
                  <td className="product-col-id">
                    <div className="product-id-info">
                      <strong style={{fontSize: '14px'}}>{product.ProductID}</strong>
                      <div style={{fontSize: '11px', color: '#666', marginTop: '2px'}}>
                        {product.Barcode}
                      </div>
                    </div>
                  </td>

                  {/* Thông tin sản phẩm */}
                  <td className="product-col-info">
                    <div className="product-info">
                      <div className="product-name" style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '4px'}}>
                        {product.Name}
                      </div>
                      <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>
                        Thương hiệu: {product.Brand}
                      </div>
                      <div style={{fontSize: '11px', color: '#888', lineHeight: '1.4'}}>
                        {product.Description}
                      </div>
                      <div style={{fontSize: '10px', color: '#999', marginTop: '4px'}}>
                        Đơn vị: {Array.isArray(product.Unit) && product.Unit.length > 0 ? product.Unit[0].name : 'N/A'}
                      </div>
                    </div>
                  </td>

                  {/* Danh mục */}
                  <td className="product-col-category">
                    <div style={{
                      padding: '6px 12px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      {product.Category}
                    </div>
                  </td>

                  {/* Thuế */}
                  <td className="product-col-tax">
                    {Array.isArray(product.TaxID) && product.TaxID.length > 0 ? (
                      product.TaxID.map((taxCode, index) => (
                        <div key={index} style={{
                          padding: '4px 8px',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textAlign: 'center',
                          marginBottom: index < product.TaxID.length - 1 ? '4px' : '0'
                        }}>
                          {taxCode}
                        </div>
                      ))
                    ) : (
                      <div style={{
                        padding: '4px 8px',
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        Không có
                      </div>
                    )}
                  </td>

                  {/* Thông số kỹ thuật */}
                  <td className="product-col-details">
                    {product.Detail && product.Detail.length > 0 ? (
                      <div className="product-details">
                        {product.Detail.map((detail, index) => (
                          <div key={index} style={{
                            fontSize: '11px',
                            marginBottom: '3px',
                            padding: '2px 0',
                            borderBottom: index < product.Detail.length - 1 ? '1px solid #f0f0f0' : 'none'
                          }}>
                            <span style={{color: '#666'}}>{detail.k}:</span>
                            <span style={{fontWeight: '500', marginLeft: '4px'}}>{detail.v}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{fontSize: '11px', color: '#999', fontStyle: 'italic'}}>
                        Chưa có thông tin chi tiết
                      </div>
                    )}
                  </td>

                  {/* Ngày sản xuất/HSD */}
                  <td className="product-col-dates">
                    <div className="date-info">
                      <div style={{fontSize: '12px', marginBottom: '6px'}}>
                        <div style={{color: '#666', fontSize: '10px'}}>Ngày SX:</div>
                        <div style={{fontWeight: '500'}}>
                          {product.ManufactureDate ? new Date(product.ManufactureDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                      </div>
                      <div style={{fontSize: '12px'}}>
                        <div style={{color: '#666', fontSize: '10px'}}>Hạn sử dụng:</div>
                        <div style={{
                          fontWeight: '500',
                          color: product.ExpiryDate && new Date(product.ExpiryDate) < new Date() ? '#dc2626' : '#059669'
                        }}>
                          {product.ExpiryDate ? new Date(product.ExpiryDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Nhà cung cấp */}
                  <td className="product-col-supplier">
                    <div className="supplier-info">
                      <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '4px'}}>
                        {product.Supplier}
                      </div>
                      {Array.isArray(product.Unit) && product.Unit.length > 0 && product.Unit[0].price && (
                        <div style={{fontSize: '12px', color: '#059669', fontWeight: '500'}}>
                          Giá: {Number(product.Unit[0].price).toLocaleString('vi-VN')}₫
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
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
    </div>
  )
}

export default Products