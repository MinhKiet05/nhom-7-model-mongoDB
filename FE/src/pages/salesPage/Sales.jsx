import React, { useState, useEffect } from 'react'
import SaleService from '../../services/saleService.js';
import './Sales.css';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load sales from API
  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const sales = await SaleService.getAllSales();
      
      if (Array.isArray(sales)) {
        setSales(sales);
        setFilteredSales(sales);
      } else {
        setError('Failed to load sales - invalid response');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm hóa đơn
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredSales(sales);
    } else {
      const filtered = sales.filter(sale => 
        sale.SaleID.toLowerCase().includes(value) ||
        sale.Customer.CustomerID.toLowerCase().includes(value) ||
        sale.Customer.FullName.toLowerCase().includes(value) ||
        sale.Customer.Phone.toLowerCase().includes(value) ||
        sale.User.UserID.toLowerCase().includes(value) ||
        sale.User.FullName.toLowerCase().includes(value) ||
        sale.User.Phone.toLowerCase().includes(value) ||
        sale.PaymentMethod.toLowerCase().includes(value) ||
        sale.Status.toLowerCase().includes(value) ||
        (sale.Notes && sale.Notes.toLowerCase().includes(value)) ||
        sale.Items.some(item => 
          item.ProductID.toLowerCase().includes(value) ||
          item.ProductName.toLowerCase().includes(value)
        )
      );
      setFilteredSales(filtered);
    }
  };

  return (
    <div className="page-content">
      <h1>Quản lý Hóa đơn</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm hóa đơn..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="table-info">
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px'}}>
          {searchTerm ? (
            <>
              Tìm thấy: <strong>{filteredSales.length}</strong> hóa đơn 
              <span style={{color: '#3b82f6'}}> (từ khóa: "{searchTerm}")</span>
            </>
          ) : (
            <>Tổng cộng: <strong>{sales.length}</strong> hóa đơn</>
          )}
        </p>
      </div>

      <div className="sales-table">
        <table>
          <thead>
            <tr>
              <th className="sale-col-id">Mã HĐ</th>
              <th className="sale-col-date">Ngày giờ</th>
              <th className="sale-col-customer">Khách hàng</th>
              <th className="sale-col-user">Nhân viên</th>
              <th className="sale-col-items">Sản phẩm</th>
              <th className="sale-col-subtotal">Tạm tính</th>
              <th className="sale-col-discount">Giảm giá</th>
              <th className="sale-col-vat">VAT</th>
              <th className="sale-col-total">Tổng tiền</th>
              <th className="sale-col-payment">Thanh toán</th>
              <th className="sale-col-status">Trạng thái</th>
              <th className="sale-col-notes">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map(sale => (
                <tr key={sale.SaleID}>
                  <td className="sale-col-id">
                    <strong>{sale.SaleID}</strong>
                  </td>
                  <td className="sale-col-date">
                    <div className="date-time">
                      <div className="date">
                        {new Date(sale.Date).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="time">
                        {new Date(sale.Date).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </div>
                  </td>
                  <td className="sale-col-customer">
                    <div className="person-info">
                      <div className="person-name">{sale.Customer.FullName}</div>
                      <div className="person-id">{sale.Customer.CustomerID}</div>
                      <div className="person-phone">{sale.Customer.Phone}</div>
                    </div>
                  </td>
                  <td className="sale-col-user">
                    <div className="person-info">
                      <div className="person-name">{sale.User.FullName}</div>
                      <div className="person-id">{sale.User.UserID}</div>
                      <div className="person-phone">{sale.User.Phone}</div>
                    </div>
                  </td>
                  <td className="sale-col-items">
                    <div className="items-list">
                      {sale.Items.map((item, index) => (
                        <div key={index} className="item-row">
                          <div className="item-name">
                            {item.ProductName}
                          </div>
                          <div className="item-detail">
                            <span className="item-qty">x{item.Quantity || 0}</span>
                            <span className="item-price">
                              {item.UnitPrice ? item.UnitPrice.toLocaleString('vi-VN') + '₫' : '0₫'}
                            </span>
                            {item.Discount && item.Discount > 0 && (
                              <span className="item-discount">
                                -{item.Discount.toLocaleString('vi-VN')}₫
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="sale-col-subtotal">
                    <span className="subtotal">
                      {sale.Subtotal ? sale.Subtotal.toLocaleString('vi-VN') + '₫' : '0₫'}
                    </span>
                  </td>
                  <td className="sale-col-discount">
                    {sale.DiscountTotal && sale.DiscountTotal > 0 ? (
                      <span className="discount-value">
                        -{sale.DiscountTotal.toLocaleString('vi-VN')}₫
                      </span>
                    ) : (
                      <span style={{color: '#9ca3af'}}>-</span>
                    )}
                  </td>
                  <td className="sale-col-vat">
                    {sale.VAT && sale.VAT > 0 ? (
                      <span className="vat-value">
                        +{sale.VAT.toLocaleString('vi-VN')}₫
                      </span>
                    ) : (
                      <span style={{color: '#9ca3af'}}>-</span>
                    )}
                  </td>
                  <td className="sale-col-total">
                    <span className="grand-total">
                      {sale.GrandTotal ? sale.GrandTotal.toLocaleString('vi-VN') + '₫' : '0₫'}
                    </span>
                  </td>
                  <td className="sale-col-payment">
                    <span className={`payment-method ${sale.PaymentMethod ? sale.PaymentMethod.toLowerCase() : 'unknown'}`}>
                      {sale.PaymentMethod || 'N/A'}
                    </span>
                  </td>
                  <td className="sale-col-status">
                    <span className={`status ${sale.Status ? sale.Status.toLowerCase() : 'unknown'}`}>
                      {sale.Status}
                    </span>
                  </td>
                  <td className="sale-col-notes">
                    <span className="notes">{sale.Notes || '-'}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-icon">🔍</div>
                    <div className="no-results-text">
                      Không tìm thấy hóa đơn nào với từ khóa "<strong>{searchTerm}</strong>"
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

export default Sales   