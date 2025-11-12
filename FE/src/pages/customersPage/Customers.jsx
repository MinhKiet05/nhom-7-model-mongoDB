import React, { useState, useEffect } from 'react';
import './Customer.css';
import CustomerService from '../../services/customerService';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load customers from API
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const data = await CustomerService.getAllCustomers();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (err) {
        setError('Không thể tải dữ liệu khách hàng');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="page-content">
        <h1>Customers</h1>
        <p>Đang tải dữ liệu khách hàng...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-content">
        <h1>Customers</h1>
        <p style={{color: 'red'}}>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  // No data state
  if (!customers || customers.length === 0) {
    return (
      <div className="page-content">
        <h1>Customers</h1>
        <p>Không có dữ liệu khách hàng</p>
      </div>
    );
  }

  // Hàm tìm kiếm khách hàng
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => 
        // Tìm kiếm trong tất cả các trường với kiểm tra null/undefined
        customer.CustomerID?.toLowerCase().includes(value) ||
        customer.FullName?.toLowerCase().includes(value) ||
        customer.Gender?.toLowerCase().includes(value) ||
        customer.Phone?.toLowerCase().includes(value) ||
        customer.Email?.toLowerCase().includes(value) ||
        customer.MembershipType?.toLowerCase().includes(value) ||
        // Tìm kiếm trong Address array
        (Array.isArray(customer.Address) && customer.Address.some(addr => 
          addr.Street?.toLowerCase().includes(value) ||
          addr.District?.toLowerCase().includes(value) ||
          addr.City?.toLowerCase().includes(value) ||
          addr.Country?.toLowerCase().includes(value)
        ))
      );
      setFilteredCustomers(filtered);
    }
  };

  try {
    return (
      <div className="page-content">
        <h1>Quản lý Khách hàng</h1>
        <div className="search-container">
          <input
            type="text"
            className="search-input-main"
            placeholder="Tìm kiếm khách hàng"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="table-info">
          <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px'}}>
            {searchTerm ? (
              <>
                Tìm thấy: <strong>{filteredCustomers.length}</strong> khách hàng 
                <span style={{color: '#3b82f6'}}> (từ khóa: "{searchTerm}")</span>
              </>
            ) : (
              <>Tổng cộng: <strong>{customers.length}</strong> khách hàng</>
            )}
          </p>
        </div>

        <div className="customers-table">
        <table>
          <thead>
            <tr>
              <th className="customer-col-id">Mã KH</th>
              <th className="customer-col-name">Thông tin KH</th>
              <th className="customer-col-contact">Liên hệ</th>
              <th className="customer-col-address">Địa chỉ</th>
              <th className="customer-col-membership">Hạng TV</th>
              <th className="customer-col-stats">Thống kê</th>
              <th className="customer-col-status">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <tr key={customer.CustomerID} className={customer.Status === 'Deleted' || customer.Status === 'Inactive' ? 'inactive-row' : ''}>
                  {/* Mã khách hàng */}
                  <td className="customer-col-id">
                    <strong>{customer.CustomerID || 'N/A'}</strong>
                  </td>
                  
                  {/* Thông tin khách hàng */}
                  <td className="customer-col-name">
                    <div className="customer-info">
                      <div className="customer-name" style={{fontWeight: 'bold', fontSize: '14px'}}>
                        {customer.FullName || 'N/A'}
                      </div>
                      <div className="customer-details" style={{fontSize: '12px', color: '#666', marginTop: '4px'}}>
                        <span className={`gender ${(customer.Gender || 'nam').toLowerCase()}`} style={{
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          backgroundColor: customer.Gender === 'Nam' ? '#e3f2fd' : '#fce4ec',
                          color: customer.Gender === 'Nam' ? '#1976d2' : '#c2185b',
                          marginRight: '8px'
                        }}>
                          {customer.Gender || 'N/A'}
                        </span>
                        <span style={{color: '#888'}}>
                          {customer.BirthDate ? 
                            `${new Date().getFullYear() - new Date(customer.BirthDate).getFullYear()} tuổi` : 
                            'Chưa có ngày sinh'
                          }
                        </span>
                      </div>
                      <div style={{fontSize: '11px', color: '#999', marginTop: '2px'}}>
                        Tham gia: {customer.JoinDate ? new Date(customer.JoinDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </div>
                    </div>
                  </td>
                  
                  {/* Liên hệ */}
                  <td className="customer-col-contact">
                    <div className="contact-info">
                      <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '4px'}}>
                        {customer.Phone || 'Chưa có SĐT'}
                      </div>
                      <div style={{fontSize: '12px', color: '#666'}}>
                        {customer.Email || 'Chưa có email'}
                      </div>
                    </div>
                  </td>
                  
                  {/* Địa chỉ */}
                  <td className="customer-col-address">
                    {Array.isArray(customer.Address) && customer.Address.length > 0 ? (
                      <div className="address-info" style={{fontSize: '12px'}}>
                        {customer.Address.map((addr, index) => (
                          <div key={index} style={{marginBottom: index < customer.Address.length - 1 ? '6px' : '0'}}>
                            <div style={{fontWeight: 'bold', marginBottom: '2px'}}>
                              {addr.Street || 'N/A'}
                            </div>
                            <div style={{color: '#666'}}>
                              {addr.District || 'N/A'}, {addr.City || 'N/A'}
                            </div>
                            {addr.Country && addr.Country !== 'Việt Nam' && (
                              <div style={{color: '#888', fontSize: '11px'}}>
                                {addr.Country}
                              </div>
                            )}
                            {customer.Address.length > 1 && index < customer.Address.length - 1 && (
                              <div style={{borderBottom: '1px solid #e5e7eb', margin: '4px 0'}}></div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{color: '#9ca3af', fontStyle: 'italic', fontSize: '12px'}}>
                        Chưa có địa chỉ
                      </span>
                    )}
                  </td>
                  
                  {/* Hạng thành viên */}
                  <td className="customer-col-membership">
                    <span className={`membership ${(customer.MembershipType || 'regular').toLowerCase()}`} style={{
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: 
                        customer.MembershipType === 'Premium' ? '#f3e5f5' :
                        customer.MembershipType === 'VIP' ? '#fff8e1' :
                        customer.MembershipType === 'Regular' ? '#f5f5f5' : '#efebe9',
                      color:
                        customer.MembershipType === 'Premium' ? '#7b1fa2' :
                        customer.MembershipType === 'VIP' ? '#f57f17' :
                        customer.MembershipType === 'Regular' ? '#616161' : '#5d4037'
                    }}>
                      {customer.MembershipType || 'Regular'}
                    </span>
                  </td>
                  
                  {/* Thống kê */}
                  <td className="customer-col-stats">
                    <div className="stats-info">
                      <div style={{fontSize: '13px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '4px'}}>
                        {(customer.TotalSpent || 0).toLocaleString('vi-VN')}₫
                      </div>
                      <div style={{fontSize: '11px', color: '#666'}}>
                        {(customer.Points || 0).toLocaleString('vi-VN')} điểm
                      </div>
                    </div>
                  </td>
                  
                  {/* Trạng thái */}
                  <td className="customer-col-status">
                    <span className={`status-badge ${customer.Status?.toLowerCase() || 'active'}`} style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: 
                        customer.Status === 'Active' ? '#e8f5e8' :
                        customer.Status === 'Inactive' ? '#fff3e0' :
                        customer.Status === 'Suspended' ? '#ffebee' : '#f5f5f5',
                      color:
                        customer.Status === 'Active' ? '#2e7d32' :
                        customer.Status === 'Inactive' ? '#f57c00' :
                        customer.Status === 'Suspended' ? '#d32f2f' : '#666'
                    }}>
                      {customer.Status === 'Active' ? 'Hoạt động' : 
                       customer.Status === 'Inactive' ? 'Tạm ngưng' :
                       customer.Status === 'Suspended' ? 'Tạm khóa' : 
                       customer.Status === 'Deleted' ? 'Đã xóa' :
                       'Hoạt động'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-text">
                      Không tìm thấy khách hàng nào với từ khóa "<strong>{searchTerm}</strong>"
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
    );
  } catch (error) {
    return (
      <div className="page-content">
        <h1>Customers</h1>
        <p style={{color: 'red'}}>Có lỗi xảy ra: {error.message}</p>
      </div>
    );
  }
};

export default Customers;
