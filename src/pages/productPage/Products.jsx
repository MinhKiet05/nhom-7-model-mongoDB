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
              <th>Mã SP</th>
              <th>Barcode</th>
              <th>Tên sản phẩm</th>
              <th>Thương hiệu</th>
              <th>Danh mục</th>
              <th>Chi tiết</th>
              <th>Giá bán</th>
              <th>Giá vốn</th>
              <th>Tồn kho</th>
              <th>Vị trí</th>
              <th>Đơn vị</th>
              <th>Nhà cung cấp</th>
              <th>NSX</th>
              <th>HSD</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product.ProductID}>
                  <td><strong>{product.ProductID}</strong></td>
                  <td><code>{product.Barcode}</code></td>
                  <td>
                    <div>
                      <div className="product-name">{product.Name}</div>
                      <div className="product-desc">{product.Description}</div>
                    </div>
                  </td>
                  <td>{product.Brand}</td>
                  <td>
                    <div className="category-tags">
                      {product.Category.map((cat, index) => (
                        <span key={index} className="category-tag">{cat}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="product-details">
                      {product.Detail.map((detail, index) => (
                        <div key={index} className="detail-item">
                          <span className="detail-key">{detail.k}:</span>
                          <span className="detail-value">{detail.v}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="price">{product.Price.toLocaleString('vi-VN')}₫</td>
                  <td className="cost">{product.Cost.toLocaleString('vi-VN')}₫</td>
                  <td>
                    <span className={`stock ${product.Stock <= product.ReorderLevel ? 'low' : 'normal'}`}>
                      {product.Stock} {product.Unit}
                    </span>
                    <div className="reorder-info">
                      (Tái đặt: {product.ReorderLevel})
                    </div>
                  </td>
                  <td className="location">{product.Location}</td>
                  <td>{product.Unit}</td>
                  <td>
                    <div className="supplier-info">
                      <div className="supplier-name">{product.Supplier.name}</div>
                      <div className="supplier-id">ID: {product.Supplier.id}</div>
                    </div>
                  </td>
                  <td className="manufacture-date">
                    {new Date(product.manufactureDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="expiry-date">
                    <span className={`expiry ${new Date(product.expiryDate) < new Date() ? 'expired' : 
                      new Date(product.expiryDate) < new Date(Date.now() + 30*24*60*60*1000) ? 'warning' : 'normal'}`}>
                      {new Date(product.expiryDate).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                  <td>
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