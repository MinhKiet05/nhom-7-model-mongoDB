import React, { useState, useEffect } from 'react'
import PromotionService from '../../services/promotionService.js'
import './Promotions.css'

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load promotions from API
  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      const promotions = await PromotionService.getAllPromotions();
      
      if (Array.isArray(promotions)) {
        setPromotions(promotions);
        setFilteredPromotions(promotions);
      } else {
        setError('Failed to load promotions - invalid response');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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
              <th className="promo-col-start">Ngày bắt đầu</th>
              <th className="promo-col-end">Ngày kết thúc</th>
              <th className="promo-col-products">Sản phẩm áp dụng</th>
              <th className="promo-col-categories">Danh mục áp dụng</th>
              <th className="promo-col-customer">Loại khách</th>
              <th className="promo-col-usage-max">Giới hạn/KH</th>
              <th className="promo-col-usage-total">Tổng giới hạn</th>
              <th className="promo-col-status">Trạng thái</th>
              <th className="promo-col-creator">Người tạo</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotions.length > 0 ? (
              filteredPromotions.map(promo => (
                <tr key={promo.PromotionID} className={!promo.IsActive ? 'inactive-row' : ''}>
                  {/* Mã khuyến mãi */}
                  <td className="promo-col-id">
                    <strong>{promo.PromotionID}</strong>
                  </td>

                  {/* Tên khuyến mãi */}
                  <td className="promo-col-name">
                    <div style={{fontWeight: 'bold', fontSize: '13px'}}>
                      {promo.PromotionName}
                    </div>
                  </td>

                  {/* Mô tả */}
                  <td className="promo-col-desc">
                    <span style={{fontSize: '12px', color: '#666'}}>
                      {promo.Description}
                    </span>
                  </td>

                  {/* Loại giảm giá */}
                  <td className="promo-col-type">
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: 
                        promo.DiscountType === 'percentage' ? '#dcfce7' :
                        promo.DiscountType === 'fixed_amount' ? '#dbeafe' :
                        promo.DiscountType === 'FreeItem' ? '#fef3c7' :
                        promo.DiscountType === 'free_shipping' ? '#f3e8ff' : '#f3f4f6',
                      color:
                        promo.DiscountType === 'percentage' ? '#166534' :
                        promo.DiscountType === 'fixed_amount' ? '#1e40af' :
                        promo.DiscountType === 'FreeItem' ? '#92400e' :
                        promo.DiscountType === 'free_shipping' ? '#7c3aed' : '#374151'
                    }}>
                      {promo.DiscountType === 'percentage' ? 'Giảm %' :
                       promo.DiscountType === 'fixed_amount' ? 'Giảm tiền' :
                       promo.DiscountType === 'FreeItem' ? 'Tặng SP' :
                       promo.DiscountType === 'free_shipping' ? 'Miễn ship' :
                       promo.DiscountType}
                    </span>
                  </td>

                  {/* Giá trị giảm */}
                  <td className="promo-col-value">
                    <span style={{fontWeight: 'bold', color: '#dc2626'}}>
                      {promo.DiscountType === 'percentage' ? `${promo.DiscountValue}%` :
                       promo.DiscountType === 'fixed_amount' ? `${promo.DiscountValue.toLocaleString('vi-VN')}₫` :
                       promo.DiscountType === 'FreeItem' ? 'Tặng kèm' :
                       promo.DiscountType === 'free_shipping' ? 'Miễn phí' :
                       promo.DiscountValue || '-'}
                    </span>
                  </td>

                  {/* Giá trị tối thiểu */}
                  <td className="promo-col-min">
                    {promo.MinPurchaseAmount > 0 ? (
                      <span style={{fontWeight: '500'}}>
                        {promo.MinPurchaseAmount.toLocaleString('vi-VN')}₫
                      </span>
                    ) : (
                      <span style={{color: '#9ca3af'}}>-</span>
                    )}
                  </td>

                  {/* Ngày bắt đầu */}
                  <td className="promo-col-start">
                    <span style={{fontSize: '12px'}}>
                      {new Date(promo.StartDate).toLocaleDateString('vi-VN')}
                    </span>
                  </td>

                  {/* Ngày kết thúc */}
                  <td className="promo-col-end">
                    <span style={{fontSize: '12px'}}>
                      {new Date(promo.EndDate).toLocaleDateString('vi-VN')}
                    </span>
                  </td>

                  {/* Sản phẩm áp dụng */}
                  <td className="promo-col-products">
                    {promo.ApplicableProducts && promo.ApplicableProducts.length > 0 ? (
                      <div>
                        {promo.ApplicableProducts.map((prod, index) => (
                          <span key={index} style={{
                            display: 'inline-block',
                            margin: '1px',
                            padding: '2px 6px',
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600'
                          }}>
                            {prod}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{color: '#9ca3af', fontSize: '11px', fontStyle: 'italic'}}>Tất cả</span>
                    )}
                  </td>

                  {/* Danh mục áp dụng */}
                  <td className="promo-col-categories">
                    {promo.ApplicableCategories && promo.ApplicableCategories.length > 0 ? (
                      <div>
                        {promo.ApplicableCategories.map((cat, index) => (
                          <span key={index} style={{
                            display: 'inline-block',
                            margin: '1px',
                            padding: '2px 6px',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '500'
                          }}>
                            {cat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{color: '#9ca3af', fontSize: '11px', fontStyle: 'italic'}}>Tất cả</span>
                    )}
                  </td>

                  {/* Loại khách hàng */}
                  <td className="promo-col-customer">
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: 
                        promo.CustomerType === 'all' ? '#e0e7ff' :
                        promo.CustomerType === 'vip' ? '#fef3c7' : '#f3f4f6',
                      color:
                        promo.CustomerType === 'all' ? '#3730a3' :
                        promo.CustomerType === 'vip' ? '#92400e' : '#374151'
                    }}>
                      {promo.CustomerType === 'all' ? 'Tất cả' :
                       promo.CustomerType === 'vip' ? 'VIP' :
                       promo.CustomerType}
                    </span>
                  </td>

                  {/* Giới hạn sử dụng mỗi khách */}
                  <td className="promo-col-usage-max">
                    <span style={{fontWeight: '600'}}>
                      {promo.MaxUsagePerCustomer}
                    </span>
                  </td>

                  {/* Tổng giới hạn sử dụng */}
                  <td className="promo-col-usage-total">
                    <span style={{fontWeight: '600'}}>
                      {promo.TotalUsageLimit.toLocaleString('vi-VN')}
                    </span>
                  </td>

                  {/* Trạng thái */}
                  <td className="promo-col-status">
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: promo.IsActive ? '#dcfce7' : '#fee2e2',
                      color: promo.IsActive ? '#166534' : '#991b1b'
                    }}>
                      {promo.IsActive ? 'Hoạt động' : 'Ngưng'}
                    </span>
                  </td>

                  {/* Người tạo */}
                  <td className="promo-col-creator">
                    <span style={{fontSize: '12px', color: '#666'}}>
                      {promo.CreatedBy}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-text">
                      {searchTerm ? 
                        `Không tìm thấy khuyến mãi nào với từ khóa "${searchTerm}"` : 
                        'Không có dữ liệu khuyến mãi'
                      }
                    </div>
                    <div className="no-results-suggestion">
                      {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Dữ liệu sẽ được hiển thị khi có khuyến mãi'}
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
