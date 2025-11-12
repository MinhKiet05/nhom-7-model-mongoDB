import React, { useState, useEffect } from 'react';
import './Suppliers.css';
import SupplierService from '../../services/supplierService.js';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Load suppliers from API
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const suppliers = await SupplierService.getAllSuppliers();
      
      if (Array.isArray(suppliers)) {
        setSuppliers(suppliers);
      } else {
        setError('Failed to load suppliers - invalid response');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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
                <th className="sup-col-status">Trạng thái</th>
                <th className="sup-col-created">Ngày tạo</th>
                <th className="sup-col-updated">Cập nhật cuối</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => {
                return (
                  <tr key={supplier.SupplierID} className={supplier.Status !== 'Active' ? 'inactive-row' : ''}>
                    {/* Mã nhà cung cấp */}
                    <td className="sup-col-id">
                      <strong style={{fontSize: '14px'}}>{supplier.SupplierID}</strong>
                    </td>

                    {/* Tên nhà cung cấp */}
                    <td className="sup-col-name">
                      <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '2px'}}>
                        {supplier.Name}
                      </div>
                    </td>

                    {/* Mã số thuế */}
                    <td className="sup-col-taxcode">
                      <span style={{fontFamily: 'monospace', fontWeight: '600', fontSize: '13px'}}>
                        {supplier.TaxCode}
                      </span>
                    </td>

                    {/* Địa chỉ */}
                    <td className="sup-col-address">
                      <div>
                        <div style={{fontSize: '12px', fontWeight: '500', marginBottom: '2px'}}>
                          {supplier.Address?.Street}
                        </div>
                        <div style={{fontSize: '11px', color: '#666'}}>
                          {supplier.Address?.District}, {supplier.Address?.City}
                        </div>
                        {supplier.Address?.Country && (
                          <div style={{fontSize: '10px', color: '#888'}}>
                            {supplier.Address.Country}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Điện thoại */}
                    <td className="sup-col-phone">
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: '600',
                        fontSize: '13px',
                        color: '#3b82f6'
                      }}>
                        {supplier.Phone}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="sup-col-email">
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#666',
                        wordBreak: 'break-all'
                      }}>
                        {supplier.Email}
                      </span>
                    </td>

                    {/* Trạng thái */}
                    <td className="sup-col-status">
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: 
                          supplier.Status === 'Active' ? '#dcfce7' :
                          supplier.Status === 'TemporarilyHold' ? '#fef3c7' :
                          supplier.Status === 'Inactive' ? '#fee2e2' : '#f3f4f6',
                        color:
                          supplier.Status === 'Active' ? '#166534' :
                          supplier.Status === 'TemporarilyHold' ? '#92400e' :
                          supplier.Status === 'Inactive' ? '#991b1b' : '#374151'
                      }}>
                        {supplier.Status === 'Active' ? 'Hoạt động' :
                         supplier.Status === 'TemporarilyHold' ? 'Tạm dừng' :
                         supplier.Status === 'Inactive' ? 'Ngưng' :
                         supplier.Status || 'Chưa xác định'}
                      </span>
                    </td>

                    {/* Ngày tạo */}
                    <td className="sup-col-created">
                      <span style={{fontSize: '12px', color: '#666'}}>
                        {supplier.CreatedAt ? new Date(supplier.CreatedAt).toLocaleDateString('vi-VN') : '-'}
                      </span>
                    </td>

                    {/* Cập nhật cuối */}
                    <td className="sup-col-updated">
                      <span style={{fontSize: '12px', color: '#666'}}>
                        {supplier.LastUpdatedAt ? new Date(supplier.LastUpdatedAt).toLocaleDateString('vi-VN') : '-'}
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
              <p className="no-results-text">
                {searchValue ? 
                  `Không tìm thấy nhà cung cấp nào với từ khóa "${searchValue}"` : 
                  'Không có dữ liệu nhà cung cấp'
                }
              </p>
              <p className="no-results-suggestion">
                {searchValue ? 'Thử tìm kiếm với từ khóa khác' : 'Dữ liệu sẽ được hiển thị khi có nhà cung cấp'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Suppliers;