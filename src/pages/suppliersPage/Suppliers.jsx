import React, { useState } from 'react';
import './Suppliers.css';
import { suppliers } from '../../data/suppliers';

function Suppliers() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Lọc theo status
  const statusFilteredSuppliers = selectedStatus === 'all' 
    ? suppliers 
    : suppliers.filter(supplier => supplier.Status === selectedStatus);

  // Lọc theo tìm kiếm
  const filteredSuppliers = statusFilteredSuppliers.filter(supplier => {
    const searchLower = searchValue.toLowerCase();
    return (
      supplier.SupplierID?.toLowerCase().includes(searchLower) ||
      supplier.Name?.toLowerCase().includes(searchLower) ||
      supplier.TaxCode?.toLowerCase().includes(searchLower) ||
      supplier.Phone?.toLowerCase().includes(searchLower) ||
      supplier.Email?.toLowerCase().includes(searchLower) ||
      supplier.Address?.Street?.toLowerCase().includes(searchLower) ||
      supplier.Address?.District?.toLowerCase().includes(searchLower) ||
      supplier.Address?.City?.toLowerCase().includes(searchLower) ||
      supplier.PaymentTerms?.Type?.toLowerCase().includes(searchLower) ||
      supplier.Status?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="page-content">
      <h1>Quản lý nhà cung cấp</h1>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm theo mã, tên, MST, địa chỉ, điện thoại, email..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        
      </div>

      <div className="suppliers-table">
        {filteredSuppliers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="sup-col-id">Mã NCC</th>
                <th className="sup-col-name">Tên nhà cung cấp</th>
                <th className="sup-col-taxcode">Mã số thuế</th>
                <th className="sup-col-address">Địa chỉ</th>
                <th className="sup-col-phone">Điện thoại</th>
                <th className="sup-col-email">Email</th>
                <th className="sup-col-payment">Điều khoản thanh toán</th>
                <th className="sup-col-credit">Hạn mức</th>
                <th className="sup-col-status">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => {
                return (
                  <tr key={supplier.SupplierID}>
                    <td className="sup-col-id">
                      <span className="supplier-id">{supplier.SupplierID}</span>
                    </td>
                    <td className="sup-col-name">
                      <span className="supplier-name">{supplier.Name}</span>
                    </td>
                    <td className="sup-col-taxcode">
                      <span className="tax-code">{supplier.TaxCode}</span>
                    </td>
                    <td className="sup-col-address">
                      <div className="address-info">
                        <div className="address-street">{supplier.Address?.Street}</div>
                        <div className="address-details">
                          {supplier.Address?.District}, {supplier.Address?.City}
                        </div>
                      </div>
                    </td>
                    <td className="sup-col-phone">
                      <span className="phone-number">{supplier.Phone}</span>
                    </td>
                    <td className="sup-col-email">
                      <span className="email-address">{supplier.Email}</span>
                    </td>
                    <td className="sup-col-payment">
                      <span className={`payment-type ${supplier.PaymentTerms?.Type?.toLowerCase()}`}>
                        {supplier.PaymentTerms?.Type === 'COD' ? 'COD' :
                         supplier.PaymentTerms?.Type === 'NET7' ? 'NET 7' :
                         supplier.PaymentTerms?.Type === 'NET15' ? 'NET 15' :
                         supplier.PaymentTerms?.Type === 'NET30' ? ' NET 30' :
                         supplier.PaymentTerms?.Type}
                      </span>
                    </td>
                    <td className="sup-col-credit">
                      <span className="credit-limit">
                        {supplier.PaymentTerms?.CreditLimit > 0 
                          ? `${supplier.PaymentTerms.CreditLimit.toLocaleString('vi-VN')} ₫`
                          : '-'}
                      </span>
                    </td>
                    <td className="sup-col-status">
                      <span className={`status-badge ${supplier.Status?.toLowerCase()}`}>
                        {supplier.Status === 'Active' ? 'Hoạt động' : 
                         supplier.Status === 'Inactive' ? 'Tạm ngừng' :
                         supplier.Status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <div className="no-results-content">
              <p className="no-results-text">Không tìm thấy nhà cung cấp nào</p>
              <p className="no-results-suggestion">Thử tìm kiếm với từ khóa khác</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Suppliers;