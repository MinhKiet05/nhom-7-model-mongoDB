import React, { useState, useEffect } from 'react';
import TaxService from '../../services/taxService.js';
import './VAT.css';

const VAT = () => {
  const [taxes, setTaxes] = useState([]);
  const [filteredTaxes, setFilteredTaxes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load taxes from API
  useEffect(() => {
    loadTaxes();
  }, []);

  const loadTaxes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TaxService.getAllTaxes();
      
      if (Array.isArray(data)) {
        // Sanitize the data to ensure all fields are strings/numbers
        const sanitizedData = data.map(tax => ({
          ...tax,
          taxCode: tax.taxCode ? String(tax.taxCode) : '',
          name: tax.name ? String(tax.name) : '',
          descriptions: tax.descriptions ? String(tax.descriptions) : '',
          status: tax.status ? String(tax.status) : '',
          percent: tax.percent ? Number(tax.percent) : 0
        }));
        
        setTaxes(sanitizedData);
        setFilteredTaxes(sanitizedData);
      } else {
        setError('Failed to load taxes - invalid response');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm thuế
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredTaxes(taxes);
    } else {
      const filtered = taxes.filter(tax => {
        const taxCode = typeof tax.taxCode === 'string' ? tax.taxCode : String(tax.taxCode || '');
        const name = typeof tax.name === 'string' ? tax.name : String(tax.name || '');
        const descriptions = typeof tax.descriptions === 'string' ? tax.descriptions : String(tax.descriptions || '');
        const status = typeof tax.status === 'string' ? tax.status : String(tax.status || '');
        
        return taxCode.toLowerCase().includes(value) ||
               name.toLowerCase().includes(value) ||
               descriptions.toLowerCase().includes(value) ||
               status.toLowerCase().includes(value);
      });
      setFilteredTaxes(filtered);
    }
  };

  // Format date to Vietnamese format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return 'N/A';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="page-content">
        <h1>Quản lý Thuế (VAT)</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Đang tải dữ liệu thuế...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="page-content">
        <h1>Quản lý Thuế (VAT)</h1>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <div>Lỗi: {error}</div>
          <button onClick={loadTaxes} style={{ marginTop: '10px', padding: '8px 16px' }}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>Quản lý Thuế (VAT)</h1>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm theo mã thuế, tên thuế, mô tả..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="table-info">
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px'}}>
          {searchTerm ? (
            <>
              Tìm thấy: <strong>{filteredTaxes.length}</strong> loại thuế 
              <span style={{color: '#3b82f6'}}> (từ khóa: "{searchTerm}")</span>
            </>
          ) : (
            <>Tổng cộng: <strong>{taxes.length}</strong> loại thuế</>
          )}
        </p>
      </div>

      <div className="vat-table">
        <table>
          <thead>
            <tr>
              <th className="vat-col-code">Mã thuế</th>
              <th className="vat-col-info">Thông tin thuế</th>
              <th className="vat-col-percent">Tỷ lệ thuế</th>
              <th className="vat-col-dates">Thời gian áp dụng</th>
              <th className="vat-col-status">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredTaxes.length > 0 ? (
              filteredTaxes.map(tax => (
                <tr key={String(tax._id || tax.taxCode || Math.random())} className={tax.status !== 'active' ? 'inactive-row' : ''}>
                  {/* Mã thuế */}
                  <td className="vat-col-code">
                    <div className="tax-code-info">
                      <strong style={{fontSize: '14px', color: '#1f2937'}}>{tax.taxCode || 'N/A'}</strong>
                      <div style={{fontSize: '10px', color: '#6b7280', marginTop: '2px'}}>
                        ID: {tax._id ? String(tax._id).slice(-8) : 'N/A'}
                      </div>
                    </div>
                  </td>

                  {/* Thông tin thuế */}
                  <td className="vat-col-info">
                    <div className="tax-info">
                      <div className="tax-name" style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '6px', color: '#1f2937'}}>
                        {tax.name || 'N/A'}
                      </div>
                      <div style={{fontSize: '12px', color: '#6b7280', lineHeight: '1.4'}}>
                        {tax.descriptions || 'Không có mô tả'}
                      </div>
                    </div>
                  </td>

                  {/* Tỷ lệ thuế */}
                  <td className="vat-col-percent">
                    <div className="tax-percent">
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#059669',
                        textAlign: 'center'
                      }}>
                        {tax.percent || 0}%
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#6b7280',
                        textAlign: 'center',
                        marginTop: '2px'
                      }}>
                        Tỷ lệ thuế
                      </div>
                    </div>
                  </td>

                  {/* Thời gian áp dụng */}
                  <td className="vat-col-dates">
                    <div className="date-info">
                      <div style={{fontSize: '12px', marginBottom: '6px'}}>
                        <div style={{color: '#6b7280', fontSize: '10px'}}>Ngày bắt đầu:</div>
                        <div style={{fontWeight: '500', color: '#059669'}}>
                          {formatDate(tax.start)}
                        </div>
                      </div>
                      <div style={{fontSize: '12px'}}>
                        <div style={{color: '#6b7280', fontSize: '10px'}}>Ngày kết thúc:</div>
                        <div style={{
                          fontWeight: '500',
                          color: tax.end ? '#dc2626' : '#6b7280'
                        }}>
                          {tax.end ? formatDate(tax.end) : 'Không giới hạn'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="vat-col-status">
                    <div className="tax-status">
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: tax.status === 'active' ? '#dcfce7' : '#fef2f2',
                        color: tax.status === 'active' ? '#166534' : '#dc2626'
                      }}>
                        {tax.status === 'active' ? 'Đang áp dụng' : 'Không áp dụng'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-text">
                      {searchTerm ? 
                        `Không tìm thấy thuế nào với từ khóa "${searchTerm}"` : 
                        'Không có dữ liệu thuế'
                      }
                    </div>
                    <div className="no-results-suggestion">
                      {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Dữ liệu sẽ được hiển thị khi có thuế'}
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
};

export default VAT;
