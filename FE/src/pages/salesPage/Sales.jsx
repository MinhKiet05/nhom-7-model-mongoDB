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
        sale.Customer.Name.toLowerCase().includes(value) ||
        sale.Customer.Phone.toLowerCase().includes(value) ||
        sale.User.UserID.toLowerCase().includes(value) ||
        sale.User.Name.toLowerCase().includes(value) ||
        sale.PaymentMethod.toLowerCase().includes(value) ||
        sale.Status.toLowerCase().includes(value) ||
        (sale.Notes && sale.Notes.toLowerCase().includes(value)) ||
        sale.Items.some(item => 
          item.ProductID.toLowerCase().includes(value) ||
          item.Name.toLowerCase().includes(value)
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
              <th className="sale-col-id">Mã hóa đơn</th>
              <th className="sale-col-date">Ngày bán</th>
              <th className="sale-col-customer">Khách hàng</th>
              <th className="sale-col-user">Nhân viên bán</th>
              <th className="sale-col-items">Chi tiết sản phẩm</th>
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
                  {/* Mã hóa đơn */}
                  <td className="sale-col-id">
                    <strong style={{fontSize: '14px'}}>{sale.SaleID}</strong>
                  </td>

                  {/* Ngày bán */}
                  <td className="sale-col-date">
                    <div className="date-time">
                      <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '2px'}}>
                        {new Date(sale.SaleDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div style={{fontSize: '11px', color: '#666'}}>
                        {new Date(sale.SaleDate).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </div>
                  </td>

                  {/* Khách hàng */}
                  <td className="sale-col-customer">
                    <div className="person-info">
                      <div style={{fontWeight: 'bold', fontSize: '13px', marginBottom: '2px'}}>
                        {sale.Customer.Name}
                      </div>
                      <div style={{fontSize: '11px', color: '#666', marginBottom: '2px'}}>
                        ID: {sale.Customer.CustomerID}
                      </div>
                      <div style={{fontSize: '11px', color: '#3b82f6', fontFamily: 'monospace'}}>
                        {sale.Customer.Phone}
                      </div>
                    </div>
                  </td>

                  {/* Nhân viên bán */}
                  <td className="sale-col-user">
                    <div className="person-info">
                      <div style={{fontWeight: 'bold', fontSize: '13px', marginBottom: '2px'}}>
                        {sale.User.Name}
                      </div>
                      <div style={{fontSize: '11px', color: '#666', marginBottom: '2px'}}>
                        ID: {sale.User.UserID}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        backgroundColor: '#e0e7ff',
                        color: '#3730a3',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        {sale.User.Role}
                      </div>
                    </div>
                  </td>

                  {/* Chi tiết sản phẩm */}
                  <td className="sale-col-items">
                    <div className="items-list">
                      {sale.Items && sale.Items.map((item, index) => (
                        <div key={index} style={{
                          marginBottom: '8px',
                          padding: '6px',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          borderLeft: '3px solid #3b82f6'
                        }}>
                          <div style={{fontWeight: 'bold', fontSize: '12px', marginBottom: '4px'}}>
                            {item.Name}
                          </div>
                          <div style={{fontSize: '11px', color: '#666', marginBottom: '4px'}}>
                            ID: {item.ProductID} • {item.Unit}
                          </div>
                          <div style={{fontSize: '11px', display: 'flex', gap: '8px', alignItems: 'center'}}>
                            <span style={{
                              padding: '2px 6px',
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                              borderRadius: '4px',
                              fontWeight: '600'
                            }}>
                              SL: {item.Quantity}
                            </span>
                            <span style={{color: '#059669', fontWeight: '600', fontFamily: 'monospace'}}>
                              {item.Price.toLocaleString('vi-VN')}₫/{item.Unit}
                            </span>
                            {item.DiscountValue > 0 && (
                              <span style={{color: '#dc2626', fontWeight: '600', fontFamily: 'monospace'}}>
                                Giảm: {item.DiscountValue.toLocaleString('vi-VN')}₫
                              </span>
                            )}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            marginTop: '4px',
                            paddingTop: '4px',
                            borderTop: '1px solid #e5e7eb',
                            fontWeight: '600'
                          }}>
                            Thành tiền: <span style={{color: '#059669', fontFamily: 'monospace'}}>
                              {item.LineTotal.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Giảm giá */}
                  <td className="sale-col-discount">
                    {sale.DiscountTotal && sale.DiscountTotal > 0 ? (
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: '600',
                        color: '#dc2626',
                        fontSize: '13px'
                      }}>
                        -{sale.DiscountTotal.toLocaleString('vi-VN')}₫
                      </span>
                    ) : (
                      <span style={{color: '#9ca3af'}}>-</span>
                    )}
                  </td>

                  {/* VAT */}
                  <td className="sale-col-vat">
                    {sale.VAT && sale.VAT > 0 ? (
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: '600',
                        color: '#059669',
                        fontSize: '13px'
                      }}>
                        +{sale.VAT.toLocaleString('vi-VN')}₫
                      </span>
                    ) : (
                      <span style={{color: '#9ca3af'}}>-</span>
                    )}
                  </td>

                  {/* Tổng tiền */}
                  <td className="sale-col-total">
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      color: '#059669',
                      fontSize: '14px'
                    }}>
                      {sale.GrandTotal.toLocaleString('vi-VN')}₫
                    </span>
                  </td>

                  {/* Phương thức thanh toán */}
                  <td className="sale-col-payment">
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: 
                        sale.PaymentMethod === 'Cash' ? '#dcfce7' :
                        sale.PaymentMethod === 'Credit Card' ? '#dbeafe' :
                        sale.PaymentMethod === 'Momo' ? '#fef3c7' :
                        sale.PaymentMethod === 'Transfer' ? '#e0e7ff' : '#f3f4f6',
                      color:
                        sale.PaymentMethod === 'Cash' ? '#166534' :
                        sale.PaymentMethod === 'Credit Card' ? '#1e40af' :
                        sale.PaymentMethod === 'Momo' ? '#92400e' :
                        sale.PaymentMethod === 'Transfer' ? '#3730a3' : '#374151'
                    }}>
                      {sale.PaymentMethod === 'Cash' ? 'Tiền mặt' :
                       sale.PaymentMethod === 'Credit Card' ? 'Thẻ tín dụng' :
                       sale.PaymentMethod === 'Momo' ? 'MoMo' :
                       sale.PaymentMethod === 'Transfer' ? 'Chuyển khoản' :
                       sale.PaymentMethod}
                    </span>
                  </td>

                  {/* Trạng thái */}
                  <td className="sale-col-status">
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: 
                        sale.Status === 'Completed' ? '#dcfce7' :
                        sale.Status === 'Pending' ? '#fef3c7' :
                        sale.Status === 'Cancelled' ? '#fee2e2' : '#f3f4f6',
                      color:
                        sale.Status === 'Completed' ? '#166534' :
                        sale.Status === 'Pending' ? '#92400e' :
                        sale.Status === 'Cancelled' ? '#991b1b' : '#374151'
                    }}>
                      {sale.Status === 'Completed' ? 'Hoàn thành' :
                       sale.Status === 'Pending' ? 'Chờ xử lý' :
                       sale.Status === 'Cancelled' ? 'Đã hủy' :
                       sale.Status}
                    </span>
                  </td>

                  {/* Ghi chú */}
                  <td className="sale-col-notes">
                    <span style={{fontSize: '12px', color: '#666', fontStyle: 'italic'}}>
                      {sale.Notes || '-'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-text">
                      {searchTerm ? 
                        `Không tìm thấy hóa đơn nào với từ khóa "${searchTerm}"` : 
                        'Không có dữ liệu hóa đơn'
                      }
                    </div>
                    <div className="no-results-suggestion">
                      {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Dữ liệu sẽ được hiển thị khi có hóa đơn'}
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