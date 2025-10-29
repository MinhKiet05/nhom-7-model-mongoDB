import React, { useState } from 'react'
import products from '../../data/products'; // Giả sử bạn có dữ liệu sản phẩm trong một file riêng
import './Product.css'; // Import CSS riêng cho Products

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm tìm kiếm sản phẩm
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        // Tìm kiếm trong tất cả các trường
        product.ProductID.toLowerCase().includes(value) ||
        product.Barcode.toLowerCase().includes(value) ||
        product.Name.toLowerCase().includes(value) ||
        product.Brand.toLowerCase().includes(value) ||
        product.Description.toLowerCase().includes(value) ||
        product.Category.some(cat => cat.toLowerCase().includes(value)) ||
        product.Detail.some(detail => 
          detail.k.toLowerCase().includes(value) || 
          detail.v.toLowerCase().includes(value)
        ) ||
        product.Location.toLowerCase().includes(value) ||
        product.Unit.toLowerCase().includes(value) ||
        product.Supplier.name.toLowerCase().includes(value) ||
        product.Info.Status.toLowerCase().includes(value)
      );
      setFilteredProducts(filtered);
    }
  };

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
                <tr key={product.ProductID} className={product.Info?.Status !== 'Active' ? 'inactive-row' : ''}>
                  <td className="product-col-id"><strong>{product.ProductID}</strong></td>
                  <td className="product-col-barcode"><code>{product.Barcode}</code></td>
                  <td className="product-col-name">
                    <div>
                      <div className="product-name">{product.Name}</div>
                      <div className="product-desc">{product.Description}</div>
                    </div>
                  </td>
                  <td className="product-col-brand">{product.Brand}</td>
                  <td className="product-col-category">
                    <div className="category-tags">
                      {product.Category.map((cat, index) => (
                        <span key={index} className="category-tag">{cat}</span>
                      ))}
                    </div>
                  </td>
                  <td className="product-col-detail">
                    <div className="product-details">
                      {product.Detail.map((detail, index) => (
                        <div key={index} className="detail-item">
                          <span className="detail-key">{detail.k}:</span>
                          <span className="detail-value">{detail.v}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="product-col-price price">{product.Price.toLocaleString('vi-VN')}₫</td>
                  <td className="product-col-cost cost">{product.Cost.toLocaleString('vi-VN')}₫</td>
                  <td className="product-col-stock">
                    <span className={`stock ${product.Stock <= product.ReorderLevel ? 'low' : 'normal'}`}>
                      {product.Stock} {product.Unit}
                    </span>
                    <div className="reorder-info">
                      (Tái đặt: {product.ReorderLevel})
                    </div>
                  </td>
                  <td className="product-col-location location">{product.Location}</td>
                  <td className="product-col-unit">{product.Unit}</td>
                  <td className="product-col-supplier">
                    <div className="supplier-info">
                      <div className="supplier-name">{product.Supplier.name}</div>
                      <div className="supplier-id">ID: {product.Supplier.id}</div>
                    </div>
                  </td>
                  <td className="product-col-manufacture manufacture-date">
                    {new Date(product.manufactureDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="product-col-expiry expiry-date">
                    <span className={`expiry ${new Date(product.expiryDate) < new Date() ? 'expired' : 
                      new Date(product.expiryDate) < new Date(Date.now() + 30*24*60*60*1000) ? 'warning' : 'normal'}`}>
                      {new Date(product.expiryDate).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                  <td className="product-col-status">
                    <span className={`status ${product.Info.Status.toLowerCase()}`}>
                      {product.Info.Status}
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