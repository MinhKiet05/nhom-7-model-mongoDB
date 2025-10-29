import React, { useState } from 'react'
import { promotions } from '../../data/promotions'
import './Promotions.css'

const Promotions = () => {
  // Hiển thị tất cả promotions (kể cả không active)
  const [filteredPromotions, setFilteredPromotions] = useState(promotions);
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm tìm kiếm khuyến mãi
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredPromotions(promotions);
    } else {
      const filtered = promotions.filter(promo => 
        promo.PromotionID.toLowerCase().includes(value) ||
        promo.PromotionName.toLowerCase().includes(value) ||
        promo.Description.toLowerCase().includes(value) ||
        promo.DiscountType.toLowerCase().includes(value) ||
        promo.CustomerType.toLowerCase().includes(value) ||
        promo.ApplicableProducts.some(prod => prod.toLowerCase().includes(value)) ||
        promo.ApplicableCategories.some(cat => cat.toLowerCase().includes(value)) ||
        promo.CreatedBy.toLowerCase().includes(value)
      );
      setFilteredPromotions(filtered);
    }
  };

  return (
    <div className="page-content">
      <h1>Quản lý Khuyến mãi</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm khuyến mãi..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="table-info">
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px'}}>
          {searchTerm ? (
            <>
              Tìm thấy: <strong>{filteredPromotions.length}</strong> khuyến mãi 
              <span style={{color: '#3b82f6'}}> (từ khóa: "{searchTerm}")</span>
            </>
          ) : (
            <>Tổng cộng: <strong>{promotions.length}</strong> khuyến mãi</>
          )}
        </p>
      </div>

      <div className="promotions-table">
        <table>
          <thead>
            <tr>
              <th className="promo-col-id">Mã KM</th>
              <th className="promo-col-name">Tên khuyến mãi</th>
              <th className="promo-col-desc">Mô tả</th>
              <th className="promo-col-type">Loại giảm</th>
              <th className="promo-col-value">Giá trị</th>
              <th className="promo-col-min">Tối thiểu</th>
              <th className="promo-col-period">Thời gian</th>
              <th className="promo-col-products">Sản phẩm</th>
              <th className="promo-col-categories">Danh mục</th>
              <th className="promo-col-customer">Khách hàng</th>
              <th className="promo-col-usage">Giới hạn SD</th>
              <th className="promo-col-status">Trạng thái</th>
              <th className="promo-col-creator">Người tạo</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotions.length > 0 ? (
              filteredPromotions.map(promo => (
                <tr key={promo.PromotionID} className={!promo.IsActive ? 'inactive-row' : ''}>
                  <td className="promo-col-id">
                    <strong>{promo.PromotionID}</strong>
                  </td>
                  <td className="promo-col-name">
                    <div className="promo-name">{promo.PromotionName}</div>
                  </td>
                  <td className="promo-col-desc">
                    <span className="promo-desc">{promo.Description}</span>
                  </td>
                  <td className="promo-col-type">
                    <span className={`discount-type ${promo.DiscountType.toLowerCase()}`}>
                      {promo.DiscountType}
                    </span>
                  </td>
                  <td className="promo-col-value">
                    <span className="discount-value">
                      {promo.DiscountType === 'Percentage' ? `${promo.DiscountValue}%` :
                       promo.DiscountType === 'FixedAmount' ? `${promo.DiscountValue.toLocaleString('vi-VN')}₫` :
                       `x${promo.DiscountValue}`}
                    </span>
                  </td>
                  <td className="promo-col-min">
                    {promo.MinPurchaseAmount > 0 ? (
                      <span className="min-purchase">
                        {promo.MinPurchaseAmount.toLocaleString('vi-VN')}₫
                      </span>
                    ) : (
                      <span style={{color: '#9ca3af'}}>-</span>
                    )}
                  </td>
                  <td className="promo-col-period">
                    <div className="period-info">
                      <div className="period-start">
                        {new Date(promo.StartDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="period-arrow">→</div>
                      <div className="period-end">
                        {new Date(promo.EndDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </td>
                  <td className="promo-col-products">
                    {promo.ApplicableProducts.length > 0 ? (
                      <div className="products-tags">
                        {promo.ApplicableProducts.map((prod, index) => (
                          <span key={index} className="product-tag">{prod}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={{color: '#9ca3af', fontStyle: 'italic'}}>Tất cả</span>
                    )}
                  </td>
                  <td className="promo-col-categories">
                    {promo.ApplicableCategories.length > 0 ? (
                      <div className="categories-tags">
                        {promo.ApplicableCategories.map((cat, index) => (
                          <span key={index} className="category-tag">{cat}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={{color: '#9ca3af', fontStyle: 'italic'}}>Tất cả</span>
                    )}
                  </td>
                  <td className="promo-col-customer">
                    <span className={`customer-type ${promo.CustomerType.toLowerCase()}`}>
                      {promo.CustomerType}
                    </span>
                  </td>
                  <td className="promo-col-usage">
                    <div className="usage-info">
                      <div className="usage-per">
                        <span className="usage-label">/KH:</span>
                        <span className="usage-num">{promo.MaxUsagePerCustomer}</span>
                      </div>
                      <div className="usage-total">
                        <span className="usage-label">Tổng:</span>
                        <span className="usage-num">{promo.TotalUsageLimit.toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="promo-col-status status">
                    <span className={`status-badge ${promo.IsActive ? 'active' : 'inactive'}`}>
                      {promo.IsActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="promo-col-creator">
                    <span className="creator">{promo.CreatedBy}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-icon">🔍</div>
                    <div className="no-results-text">
                      Không tìm thấy khuyến mãi nào với từ khóa "<strong>{searchTerm}</strong>"
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

export default Promotions
