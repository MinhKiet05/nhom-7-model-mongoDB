import React, { useState, useEffect } from 'react'
import ReturnService from '../../services/returnService.js';
import './Returns.css'

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReturns();
  }, []);

  const loadReturns = async () => {
    try {
      setLoading(true);
      setError(null);
      const returns = await ReturnService.getAllReturns();
      
      if (Array.isArray(returns)) {
        setReturns(returns);
      } else {
        setError('Failed to load returns - invalid response');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <h1>Quản lý Trả hàng</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>⏳ Đang tải dữ liệu trả hàng...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <h1>Quản lý Trả hàng</h1>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <div>❌ Lỗi: {error}</div>
          <button onClick={loadReturns} style={{ marginTop: '10px', padding: '8px 16px' }}>
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>Quản lý Trả hàng</h1>
      
      <div className="table-info">
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px'}}>
          Tổng cộng: <strong>{returns.length}</strong> đơn trả hàng
        </p>
      </div>

      <div className="returns-table">
        <table>
          <thead>
            <tr>
              <th>Mã trả hàng</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {returns.length > 0 ? (
              returns.map(returnItem => (
                <tr key={returnItem.ReturnID || returnItem._id}>
                  <td><strong>{returnItem.ReturnID}</strong></td>
                  <td>{returnItem.CustomerID || 'N/A'}</td>
                  <td>{returnItem.TotalAmount ? returnItem.TotalAmount.toLocaleString('vi-VN') + '₫' : 'N/A'}</td>
                  <td>{returnItem.ReturnDate ? new Date(returnItem.ReturnDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                  <td>
                    <span className="status-badge active">
                      {returnItem.Status || 'Hoàn thành'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Chưa có đơn trả hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  const [filteredReturns, setFilteredReturns] = useState(returns);
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm tìm kiếm phiếu trả hàng - hiển thị tất cả document
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredReturns(returns);
    } else {
      const filtered = returns.filter(returnItem => 
        returnItem.ReturnID.toLowerCase().includes(value) ||
        returnItem.SaleID.toLowerCase().includes(value) ||
        returnItem.Status.toLowerCase().includes(value) ||
        returnItem.Customer.CustomerID.toLowerCase().includes(value) ||
        returnItem.Customer.FullName.toLowerCase().includes(value) ||
        returnItem.Customer.Phone.toLowerCase().includes(value) ||
        returnItem.User.UserID.toLowerCase().includes(value) ||
        returnItem.User.FullName.toLowerCase().includes(value) ||
        returnItem.User.Phone.toLowerCase().includes(value) ||
        returnItem.ReturnType.toLowerCase().includes(value) ||
        returnItem.Status.toLowerCase().includes(value) ||
        (returnItem.Notes && returnItem.Notes.toLowerCase().includes(value)) ||
        returnItem.Items.some(item => 
          item.ProductID.toLowerCase().includes(value) ||
          item.ProductName.toLowerCase().includes(value) ||
          item.Reason.toLowerCase().includes(value)
        )
      );
      setFilteredReturns(filtered);
    }
  };

  return (
    <div className="page-content">
      <h1>Quản lý Phiếu trả hàng</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm phiếu trả hàng..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="table-info">
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px'}}>
          {searchTerm ? (
            <>
              Tìm thấy: <strong>{filteredReturns.length}</strong> phiếu trả 
              <span style={{color: '#3b82f6'}}> (từ khóa: "{searchTerm}")</span>
            </>
          ) : (
            <>Tổng cộng: <strong>{returns.length}</strong> phiếu trả hàng</>
          )}
        </p>
      </div>

      <div className="returns-table">
        <table>
          <thead>
            <tr>
              <th className="return-col-id">Mã trả hàng</th>
              <th className="return-col-date">Ngày giờ</th>
              <th className="return-col-sale">Mã HĐ gốc</th>
              <th className="return-col-customer">Khách hàng</th>
              <th className="return-col-user">Nhân viên</th>
              <th className="return-col-items">Sản phẩm trả</th>
              <th className="return-col-total">Tổng hoàn</th>
              <th className="return-col-type">Loại</th>
              <th className="return-col-status">Trạng thái</th>
              <th className="return-col-notes">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.length > 0 ? (
              filteredReturns.map(returnItem => (
                <tr key={returnItem.ReturnID} className={returnItem.Status !== 'Processed' ? 'inactive-row' : ''}>
                  <td className="return-col-id">
                    <strong>{returnItem.ReturnID}</strong>
                  </td>
                  <td className="return-col-date">
                    <div className="date-time">
                      <div className="date">
                        {new Date(returnItem.Date).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="time">
                        {new Date(returnItem.Date).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </div>
                  </td>
                  <td className="return-col-sale">
                    <span className="sale-ref">{returnItem.SaleID}</span>
                  </td>
                  <td className="return-col-customer">
                    <div className="person-info">
                      <div className="person-name">{returnItem.Customer.FullName}</div>
                      <div className="person-id">{returnItem.Customer.CustomerID}</div>
                      <div className="person-phone">{returnItem.Customer.Phone}</div>
                    </div>
                  </td>
                  <td className="return-col-user">
                    <div className="person-info">
                      <div className="person-name">{returnItem.User.FullName}</div>
                      <div className="person-id">{returnItem.User.UserID}</div>
                      <div className="person-phone">{returnItem.User.Phone}</div>
                    </div>
                  </td>
                  <td className="return-col-items">
                    <div className="items-list">
                      {returnItem.Items.map((item, index) => (
                        <div key={index} className="item-row">
                          <div className="item-name">
                            {item.ProductName}
                          </div>
                          <div className="item-detail">
                            <span className="item-qty">x{item.Quantity}</span>
                            <span className="item-reason">{item.Reason}</span>
                            <span className="item-refund">
                              {item.RefundAmount.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="return-col-total">
                    <span className="total-refund">
                      {returnItem.TotalRefund.toLocaleString('vi-VN')}₫
                    </span>
                  </td>
                  <td className="return-col-type">
                    <span className={`return-type ${returnItem.ReturnType.toLowerCase()}`}>
                      {returnItem.ReturnType}
                    </span>
                  </td>
                  <td className="return-col-status">
                    <span className={`status ${returnItem.Status.toLowerCase()}`}>
                      {returnItem.Status}
                    </span>
                  </td>
                  <td className="return-col-notes">
                    <span className="notes">{returnItem.Notes || '-'}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-icon">🔍</div>
                    <div className="no-results-text">
                      Không tìm thấy phiếu trả hàng nào với từ khóa "<strong>{searchTerm}</strong>"
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

export default Returns