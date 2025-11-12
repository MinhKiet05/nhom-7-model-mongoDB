import React, { useState, useEffect } from 'react'
import ReturnService from '../../services/returnService.js';
import './Returns.css'

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReturns();
  }, []);

  useEffect(() => {
    setFilteredReturns(returns);
  }, [returns]);

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

  // Search function - matches actual MongoDB data structure
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredReturns(returns);
    } else {
      const filtered = returns.filter(returnItem => 
        returnItem.ReturnID?.toLowerCase().includes(value) ||
        returnItem.Sale?.SaleID?.toLowerCase().includes(value) ||
        returnItem.Status?.toLowerCase().includes(value) ||
        returnItem.Customer?.CustomerID?.toLowerCase().includes(value) ||
        returnItem.Customer?.Name?.toLowerCase().includes(value) ||
        returnItem.Customer?.Phone?.toLowerCase().includes(value) ||
        returnItem.User?.UserID?.toLowerCase().includes(value) ||
        returnItem.User?.Name?.toLowerCase().includes(value) ||
        returnItem.ReturnType?.toLowerCase().includes(value) ||
        (returnItem.Notes && returnItem.Notes.toLowerCase().includes(value)) ||
        (returnItem.Items && returnItem.Items.some(item => 
          item.ProductID?.toLowerCase().includes(value) ||
          item.Name?.toLowerCase().includes(value) ||
          item.Reason?.toLowerCase().includes(value)
        ))
      );
      setFilteredReturns(filtered);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <h1>Quản lý Trả hàng</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Đang tải dữ liệu trả hàng...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <h1>Quản lý Trả hàng</h1>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <div>Lỗi: {error}</div>
          <button onClick={loadReturns} style={{ marginTop: '10px', padding: '8px 16px' }}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>Quản lý Phiếu trả hàng</h1>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm phiếu trả hàng theo mã, khách hàng, sản phẩm..."
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
              <th className="return-col-date">Ngày trả</th>
              <th className="return-col-sale">Hóa đơn gốc</th>
              <th className="return-col-customer">Khách hàng</th>
              <th className="return-col-user">Nhân viên xử lý</th>
              <th className="return-col-items">Sản phẩm trả</th>
              <th className="return-col-total">Số tiền hoàn</th>
              <th className="return-col-type">Loại trả</th>
              <th className="return-col-status">Trạng thái</th>
              <th className="return-col-notes">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.length > 0 ? (
              filteredReturns.map(returnItem => (
                <tr key={returnItem.ReturnID}>
                  {/* Mã trả hàng */}
                  <td className="return-col-id">
                    <strong style={{fontSize: '14px'}}>{returnItem.ReturnID}</strong>
                  </td>

                  {/* Ngày trả */}
                  <td className="return-col-date">
                    <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '2px'}}>
                      {new Date(returnItem.ReturnDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div style={{fontSize: '11px', color: '#666'}}>
                      {new Date(returnItem.ReturnDate).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                    </div>
                  </td>

                  {/* Hóa đơn gốc */}
                  <td className="return-col-sale">
                    <div style={{
                      padding: '6px 8px',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textAlign: 'center'
                    }}>
                      {returnItem.Sale.SaleID}
                    </div>
                    <div style={{fontSize: '10px', color: '#666', marginTop: '4px', textAlign: 'center'}}>
                      {new Date(returnItem.Sale.SaleDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div style={{fontSize: '10px', color: '#059669', fontWeight: '600', marginTop: '2px', textAlign: 'center', fontFamily: 'monospace'}}>
                      {returnItem.Sale.GrandTotal.toLocaleString('vi-VN')}₫
                    </div>
                  </td>

                  {/* Khách hàng */}
                  <td className="return-col-customer">
                    <div style={{fontWeight: 'bold', fontSize: '13px', marginBottom: '2px'}}>
                      {returnItem.Customer.Name}
                    </div>
                    <div style={{fontSize: '11px', color: '#666', marginBottom: '2px'}}>
                      ID: {returnItem.Customer.CustomerID}
                    </div>
                    <div style={{fontSize: '11px', color: '#3b82f6', fontFamily: 'monospace'}}>
                      {returnItem.Customer.Phone}
                    </div>
                  </td>

                  {/* Nhân viên xử lý */}
                  <td className="return-col-user">
                    <div style={{fontWeight: 'bold', fontSize: '13px', marginBottom: '2px'}}>
                      {returnItem.User.Name}
                    </div>
                    <div style={{fontSize: '11px', color: '#666', marginBottom: '2px'}}>
                      ID: {returnItem.User.UserID}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      backgroundColor: '#e0e7ff',
                      color: '#3730a3',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      {returnItem.User.Role}
                    </div>
                  </td>

                  {/* Sản phẩm trả */}
                  <td className="return-col-items">
                    <div className="items-list">
                      {returnItem.Items && returnItem.Items.map((item, index) => (
                        <div key={index} style={{
                          marginBottom: '8px',
                          padding: '6px',
                          backgroundColor: '#fef2f2',
                          borderRadius: '6px',
                          borderLeft: '3px solid #dc2626'
                        }}>
                          <div style={{fontWeight: 'bold', fontSize: '12px', marginBottom: '4px'}}>
                            {item.Name}
                          </div>
                          <div style={{fontSize: '11px', color: '#666', marginBottom: '4px'}}>
                            ID: {item.ProductID} • {item.Unit}
                          </div>
                          <div style={{fontSize: '11px', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px'}}>
                            <span style={{
                              padding: '2px 6px',
                              backgroundColor: '#fee2e2',
                              color: '#991b1b',
                              borderRadius: '4px',
                              fontWeight: '600'
                            }}>
                              SL: {item.Quantity}
                            </span>
                            <span style={{color: '#059669', fontWeight: '600', fontFamily: 'monospace'}}>
                              {item.Price.toLocaleString('vi-VN')}₫/{item.Unit}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '11px',
                            padding: '4px 6px',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '4px',
                            fontStyle: 'italic',
                            marginBottom: '4px'
                          }}>
                            Lý do: {item.Reason}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#dc2626',
                            fontFamily: 'monospace'
                          }}>
                            Hoàn: {item.RefundAmount.toLocaleString('vi-VN')}₫
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Số tiền hoàn */}
                  <td className="return-col-total">
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      color: '#dc2626',
                      fontSize: '14px'
                    }}>
                      {returnItem.TotalRefund.toLocaleString('vi-VN')}₫
                    </span>
                  </td>

                  {/* Loại trả */}
                  <td className="return-col-type">
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: returnItem.ReturnType === 'Refund' ? '#fee2e2' : '#dbeafe',
                      color: returnItem.ReturnType === 'Refund' ? '#991b1b' : '#1e40af'
                    }}>
                      {returnItem.ReturnType === 'Refund' ? 'Hoàn tiền' : 'Đổi hàng'}
                    </span>
                  </td>

                  {/* Trạng thái */}
                  <td className="return-col-status">
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: 
                        returnItem.Status === 'Completed' ? '#dcfce7' :
                        returnItem.Status === 'Pending' ? '#fef3c7' :
                        returnItem.Status === 'Rejected' ? '#fee2e2' : '#f3f4f6',
                      color:
                        returnItem.Status === 'Completed' ? '#166534' :
                        returnItem.Status === 'Pending' ? '#92400e' :
                        returnItem.Status === 'Rejected' ? '#991b1b' : '#374151'
                    }}>
                      {returnItem.Status === 'Completed' ? 'Hoàn thành' :
                       returnItem.Status === 'Pending' ? 'Chờ xử lý' :
                       returnItem.Status === 'Rejected' ? 'Từ chối' :
                       returnItem.Status}
                    </span>
                  </td>

                  {/* Ghi chú */}
                  <td className="return-col-notes">
                    <span style={{fontSize: '12px', color: '#666', fontStyle: 'italic'}}>
                      {returnItem.Notes || '-'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-text">
                      {searchTerm ? 
                        `Không tìm thấy phiếu trả hàng nào với từ khóa "${searchTerm}"` : 
                        'Không có dữ liệu phiếu trả hàng'
                      }
                    </div>
                    <div className="no-results-suggestion">
                      {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Dữ liệu sẽ được hiển thị khi có phiếu trả hàng'}
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