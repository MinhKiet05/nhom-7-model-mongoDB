import React, { useState } from 'react';
import './Customer.css';
import { customers } from '../../data/customers';

const Customers = () => {
  // Debug: Kiểm tra data có load được không
  console.log('Customers data:', customers);
  
  // Lọc chỉ những khách hàng có Status: "Active"
  const activeCustomers = customers ? customers.filter(customer => customer.Status === "Active") : [];
  const [filteredCustomers, setFilteredCustomers] = useState(activeCustomers);
  const [searchTerm, setSearchTerm] = useState('');

  // Kiểm tra nếu không có data
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
      setFilteredCustomers(activeCustomers);
    } else {
      const filtered = activeCustomers.filter(customer => 
        // Tìm kiếm trong tất cả các trường với kiểm tra null/undefined
        customer.CustomerID?.toLowerCase().includes(value) ||
        customer.FullName?.toLowerCase().includes(value) ||
        customer.Gender?.toLowerCase().includes(value) ||
        customer.Phone?.toLowerCase().includes(value) ||
        customer.Email?.toLowerCase().includes(value) ||
        customer.Address?.Street?.toLowerCase().includes(value) ||
        customer.Address?.District?.toLowerCase().includes(value) ||
        customer.Address?.City?.toLowerCase().includes(value) ||
        customer.MembershipType?.toLowerCase().includes(value)
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
              <>Tổng cộng: <strong>{activeCustomers.length}</strong> khách hàng hoạt động</>
            )}
          </p>
        </div>

        <div className="customers-table">
        <table>
          <thead>
            <tr>
              <th className="customer-col-id">Mã KH</th>
              <th className="customer-col-name">Họ và tên</th>
              <th className="customer-col-gender">Giới tính</th>
              <th className="customer-col-birth">Ngày sinh</th>
              <th className="customer-col-phone">Số điện thoại</th>
              <th className="customer-col-email">Email</th>
              <th className="customer-col-address">Địa chỉ</th>
              <th className="customer-col-membership">Loại TV</th>
              <th className="customer-col-points">Điểm</th>
              <th className="customer-col-join-date">Ngày tham gia</th>
              <th className="customer-col-total-spent">Tổng chi tiêu</th>
              <th className="customer-col-created-by">Người tạo</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <tr key={customer.CustomerID}>
                  <td className="customer-col-id"><strong>{customer.CustomerID || 'N/A'}</strong></td>
                  <td className="customer-col-name">
                    <div className="customer-name">{customer.FullName || 'N/A'}</div>
                  </td>
                  <td className="customer-col-gender">
                    <span className={`gender ${(customer.Gender || 'nam').toLowerCase()}`}>
                      {customer.Gender || 'N/A'}
                    </span>
                  </td>
                  <td className="customer-col-birth birth-date">
                    {customer.BirthDate ? new Date(customer.BirthDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="customer-col-phone phone">{customer.Phone || 'N/A'}</td>
                  <td className="customer-col-email email">{customer.Email || 'N/A'}</td>
                  <td className="customer-col-address">
                    {customer.Address ? (
                      <div className="address-info">
                        <div className="address-street">{customer.Address.Street || 'N/A'}</div>
                        <div className="address-detail">
                          {customer.Address.District || 'N/A'}, {customer.Address.City || 'N/A'}
                        </div>
                      </div>
                    ) : (
                      <span style={{color: '#9ca3af', fontStyle: 'italic'}}>Chưa có địa chỉ</span>
                    )}
                  </td>
                  <td className="customer-col-membership">
                    <span className={`membership ${(customer.MembershipType || 'regular').toLowerCase()}`}>
                      {customer.MembershipType || 'Regular'}
                    </span>
                  </td>
                  <td className="customer-col-points points">
                    <span className="points-value">{(customer.Points || 0).toLocaleString('vi-VN')}</span>
                  </td>
                  <td className="customer-col-join-date join-date">
                    {customer.JoinDate ? new Date(customer.JoinDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="customer-col-total-spent total-spent">
                    {(customer.TotalSpent || 0).toLocaleString('vi-VN')}₫
                  </td>
                  <td className="customer-col-created-by created-by">{customer.CreatedBy || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-icon">🔍</div>
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
    console.error('Error rendering Customers:', error);
    return (
      <div className="page-content">
        <h1>Customers</h1>
        <p style={{color: 'red'}}>Có lỗi xảy ra: {error.message}</p>
      </div>
    );
  }
};

export default Customers;
