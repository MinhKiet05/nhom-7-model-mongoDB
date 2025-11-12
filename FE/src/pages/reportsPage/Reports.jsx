import React, { useState, useEffect } from 'react';
import './Reports.css';
import ReportService from '../../services/reportService.js';

function Reports() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load reports data
  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchValue, selectedType]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await ReportService.getAllReports();
      setReports(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu reports');
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    // Filter by type first
    const typeFilteredReports = selectedType === 'all' 
      ? reports 
      : reports.filter(report => report.Type === selectedType);

    // Then filter by search term
    if (searchValue === '') {
      setFilteredReports(typeFilteredReports);
    } else {
      const searchLower = searchValue.toLowerCase();
      const filtered = typeFilteredReports.filter(report => {
        return (
          report.ReportID?.toLowerCase().includes(searchLower) ||
          report.Type?.toLowerCase().includes(searchLower) ||
          report.BranchID?.toLowerCase().includes(searchLower) ||
          report.GeneratedBy?.toLowerCase().includes(searchLower) ||
          report.Notes?.toLowerCase().includes(searchLower) ||
          (report.Metrics?.TopProducts?.some(prod =>
            prod.ProductID?.toLowerCase().includes(searchLower) ||
            prod.ProductName?.toLowerCase().includes(searchLower)
          ))
        );
      });
      setFilteredReports(filtered);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <h1>Quản lý Báo cáo Thống kê</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Đang tải dữ liệu báo cáo...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <h1>Quản lý Báo cáo Thống kê</h1>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <div>Lỗi: {error}</div>
          <button onClick={loadReports} style={{ marginTop: '10px', padding: '8px 16px' }}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>Quản lý Báo cáo Thống kê</h1>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm báo cáo theo mã, loại, chi nhánh, người tạo..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <select
          className="type-filter-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">Tất cả loại báo cáo</option>
          <option value="Finance">Tài chính</option>
          <option value="Sales">Bán hàng</option>
          <option value="Inventory">Tồn kho</option>
          <option value="Customer">Khách hàng</option>
        </select>
      </div>

      <div className="table-info">
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px'}}>
          {searchValue || selectedType !== 'all' ? (
            <>
              Tìm thấy: <strong>{filteredReports.length}</strong> báo cáo 
              {searchValue && <span style={{color: '#3b82f6'}}> (từ khóa: "{searchValue}")</span>}
              {selectedType !== 'all' && <span style={{color: '#059669'}}> (loại: {selectedType})</span>}
            </>
          ) : (
            <>Tổng cộng: <strong>{reports.length}</strong> báo cáo thống kê</>
          )}
        </p>
      </div>

      <div className="reports-table">
        <table>
          <thead>
            <tr>
              <th className="rpt-col-id">Mã báo cáo</th>
              <th className="rpt-col-type">Loại báo cáo</th>
              <th className="rpt-col-period">Kỳ báo cáo</th>
              <th className="rpt-col-branch">Chi nhánh</th>
              <th className="rpt-col-sales">Doanh thu</th>
              <th className="rpt-col-profit">Lợi nhuận</th>
              <th className="rpt-col-orders">Đơn hàng</th>
              <th className="rpt-col-customers">Khách hàng</th>
              <th className="rpt-col-stockvalue">Giá trị kho</th>
              <th className="rpt-col-topproducts">Top sản phẩm</th>
              <th className="rpt-col-generator">Người tạo</th>
              <th className="rpt-col-notes">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report.ReportID}>
                  {/* Mã báo cáo */}
                  <td className="rpt-col-id">
                    <strong style={{fontSize: '13px', fontFamily: 'monospace'}}>
                      {report.ReportID}
                    </strong>
                  </td>

                  {/* Loại báo cáo */}
                  <td className="rpt-col-type">
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: 
                        report.Type === 'Finance' ? '#dcfce7' :
                        report.Type === 'Sales' ? '#dbeafe' :
                        report.Type === 'Inventory' ? '#fef3c7' :
                        report.Type === 'Customer' ? '#fce7f3' : '#f3f4f6',
                      color:
                        report.Type === 'Finance' ? '#166534' :
                        report.Type === 'Sales' ? '#1e40af' :
                        report.Type === 'Inventory' ? '#92400e' :
                        report.Type === 'Customer' ? '#9f1239' : '#374151'
                    }}>
                      {report.Type === 'Finance' ? 'Tài chính' :
                       report.Type === 'Sales' ? 'Bán hàng' :
                       report.Type === 'Inventory' ? 'Tồn kho' :
                       report.Type === 'Customer' ? 'Khách hàng' :
                       report.Type}
                    </span>
                  </td>

                  {/* Kỳ báo cáo */}
                  <td className="rpt-col-period">
                    <div style={{fontSize: '11px'}}>
                      <div style={{fontWeight: '600', color: '#059669', marginBottom: '2px'}}>
                        {new Date(report.Period.StartDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div style={{color: '#666', margin: '2px 0', textAlign: 'center'}}>đến</div>
                      <div style={{fontWeight: '600', color: '#dc2626'}}>
                        {new Date(report.Period.EndDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </td>

                  {/* Chi nhánh */}
                  <td className="rpt-col-branch">
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#e0e7ff',
                      color: '#3730a3',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      fontFamily: 'monospace'
                    }}>
                      {report.BranchID === 'ALL_BRANCHES' ? 'Tất cả CN' : report.BranchID}
                    </span>
                  </td>

                  {/* Doanh thu */}
                  <td className="rpt-col-sales">
                    {report.Metrics?.TotalSales != null ? (
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: '700',
                        color: '#059669',
                        fontSize: '13px'
                      }}>
                        {report.Metrics.TotalSales.toLocaleString('vi-VN')}₫
                      </span>
                    ) : (
                      <span style={{color: '#9ca3af'}}>-</span>
                    )}
                  </td>

                  {/* Lợi nhuận */}
                  <td className="rpt-col-profit">
                    {report.Metrics?.TotalProfit != null ? (
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: '700',
                        color: '#2563eb',
                        fontSize: '13px'
                      }}>
                        {report.Metrics.TotalProfit.toLocaleString('vi-VN')}₫
                      </span>
                    ) : (
                      <span style={{color: '#9ca3af'}}>-</span>
                    )}
                  </td>

                  {/* Đơn hàng */}
                  <td className="rpt-col-orders">
                    {report.Metrics?.TotalOrders != null ? (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        fontFamily: 'monospace'
                      }}>
                        {report.Metrics.TotalOrders.toLocaleString('vi-VN')}
                      </span>
                    ) : (
                      <span style={{color: '#9ca3af'}}>-</span>
                    )}
                  </td>

                  {/* Khách hàng */}
                  <td className="rpt-col-customers">
                    {report.Metrics?.TotalCustomers != null ? (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        fontFamily: 'monospace'
                      }}>
                        {report.Metrics.TotalCustomers.toLocaleString('vi-VN')}
                      </span>
                    ) : (
                      <span style={{color: '#9ca3af'}}>-</span>
                    )}
                  </td>

                  {/* Giá trị kho */}
                  <td className="rpt-col-stockvalue">
                    {report.Metrics?.StockValue != null && report.Metrics.StockValue > 0 ? (
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: '700',
                        color: '#6b7280',
                        fontSize: '13px'
                      }}>
                        {report.Metrics.StockValue.toLocaleString('vi-VN')}₫
                      </span>
                    ) : (
                      <span style={{color: '#9ca3af'}}>-</span>
                    )}
                  </td>

                  {/* Top sản phẩm */}
                  <td className="rpt-col-topproducts">
                    {report.Metrics?.TopProducts && report.Metrics.TopProducts.length > 0 ? (
                      <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                        {report.Metrics.TopProducts.slice(0, 3).map((prod, idx) => (
                          <div key={idx} style={{
                            padding: '6px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '6px',
                            borderLeft: '3px solid #3b82f6'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginBottom: '4px'
                            }}>
                              <span style={{
                                padding: '2px 6px',
                                backgroundColor: '#fbbf24',
                                color: '#78350f',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: '700'
                              }}>
                                #{idx + 1}
                              </span>
                              <span style={{fontSize: '11px', fontWeight: 'bold'}}>
                                {prod.ProductName}
                              </span>
                            </div>
                            <div style={{fontSize: '10px', color: '#666', marginBottom: '2px'}}>
                              ID: {prod.ProductID}
                            </div>
                            <div style={{fontSize: '10px', display: 'flex', gap: '8px'}}>
                              <span>SL: <strong>{prod.QuantitySold}</strong></span>
                              <span style={{color: '#059669', fontWeight: 'bold', fontFamily: 'monospace'}}>
                                {prod.Revenue.toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{color: '#9ca3af', fontStyle: 'italic'}}>Không có dữ liệu</span>
                    )}
                  </td>

                  {/* Người tạo */}
                  <td className="rpt-col-generator">
                    <div style={{
                      padding: '4px 8px',
                      backgroundColor: '#e0e7ff',
                      color: '#3730a3',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      {report.GeneratedBy}
                    </div>
                    <div style={{fontSize: '10px', color: '#666', fontFamily: 'monospace'}}>
                      {new Date(report.GeneratedAt).toLocaleString('vi-VN')}
                    </div>
                  </td>

                  {/* Ghi chú */}
                  <td className="rpt-col-notes">
                    <span style={{fontSize: '12px', color: '#666', fontStyle: 'italic'}}>
                      {report.Notes || '-'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-text">
                      {searchValue || selectedType !== 'all' ? 
                        'Không tìm thấy báo cáo nào với tiêu chí đã chọn' : 
                        'Không có dữ liệu báo cáo'
                      }
                    </div>
                    <div className="no-results-suggestion">
                      {searchValue || selectedType !== 'all' ? 
                        'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc' : 
                        'Dữ liệu sẽ được hiển thị khi có báo cáo'
                      }
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
}

export default Reports;