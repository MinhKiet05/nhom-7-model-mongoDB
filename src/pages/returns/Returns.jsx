import React, { useState } from 'react'
import returns from '../../data/returns';
import './Returns.css';

const Returns = () => {
  const [filteredReturns, setFilteredReturns] = useState(returns);
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm tìm kiếm phiếu trả hàng
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredReturns(returns);
    } else {
      const filtered = returns.filter(returnItem => 
        returnItem.ReturnID.toLowerCase().includes(value) ||
        returnItem.SaleID.toLowerCase().includes(value) ||
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
                <tr key={returnItem.ReturnID}>
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