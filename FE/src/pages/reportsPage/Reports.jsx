import React, { useState, useEffect } from 'react';
import './Reports.css';
import ReportService from '../../services/reportService.js';

function Reports() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tải dữ liệu reports
  useEffect(() => {
    loadReports();
  }, []);

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

  // Lọc theo loại báo cáo
  const typeFilteredReports = selectedType === 'all' 
    ? reports 
    : reports.filter(report => report.Type === selectedType);

  // Lọc theo tìm kiếm
  const filteredReports = typeFilteredReports.filter(report => {
    const searchLower = searchValue.toLowerCase();
    return (
      report.ReportID?.toLowerCase().includes(searchLower) ||
      report.Type?.toLowerCase().includes(searchLower) ||
      report.BranchID?.toLowerCase().includes(searchLower) ||
      report.Period?.StartDate?.toLowerCase().includes(searchLower) ||
      report.Period?.EndDate?.toLowerCase().includes(searchLower) ||
      report.Metrics?.TotalSales?.toString().includes(searchLower) ||
      report.Metrics?.TotalProfit?.toString().includes(searchLower) ||
      report.Metrics?.TotalOrders?.toString().includes(searchLower) ||
      report.Metrics?.TotalCustomers?.toString().includes(searchLower) ||
      report.Metrics?.StockValue?.toString().includes(searchLower) ||
      report.GeneratedBy?.toLowerCase().includes(searchLower) ||
      report.Notes?.toLowerCase().includes(searchLower) ||
      report.Metrics?.TopProducts?.some(prod =>
        prod.ProductID?.toLowerCase().includes(searchLower) ||
        prod.ProductName?.toLowerCase().includes(searchLower)
      )
    );
  });

  return (
    <div className="page-content">
      <h1>Quản lý Báo cáo - Thống kê</h1>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm theo mã báo cáo, loại, chi nhánh, thời gian..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <select
          className="type-filter-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">Tất cả loại BC</option>
          <option value="Sales">Bán hàng</option>
          <option value="Inventory">Tồn kho</option>
        </select>
      </div>

      <div className="reports-table">
        {filteredReports.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="rpt-col-id">Mã báo cáo</th>
                <th className="rpt-col-type">Loại BC</th>
                <th className="rpt-col-branch">Chi nhánh</th>
                <th className="rpt-col-period">Thời gian</th>
                <th className="rpt-col-sales">Doanh thu</th>
                <th className="rpt-col-profit">Lợi nhuận</th>
                <th className="rpt-col-orders">Đơn hàng</th>
                <th className="rpt-col-customers">Khách hàng</th>
                <th className="rpt-col-stockvalue">Giá trị kho</th>
                <th className="rpt-col-topproducts">Sản phẩm bán chạy</th>
                <th className="rpt-col-generator">Người tạo</th>
                <th className="rpt-col-notes">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => {
                return (
                  <tr key={report.ReportID}>
                    <td className="rpt-col-id">
                      <span className="report-id">{report.ReportID}</span>
                    </td>
                    <td className="rpt-col-type">
                      <span className={`report-type ${report.Type?.toLowerCase()}`}>
                        {report.Type === 'Sales' ? 'Bán hàng' : 
                         report.Type === 'Inventory' ? 'Tồn kho' :
                         report.Type === 'Customer' ? 'Khách hàng' :
                         report.Type}
                      </span>
                    </td>
                    <td className="rpt-col-branch">
                      <span className="branch-badge">{report.BranchID}</span>
                    </td>
                    <td className="rpt-col-period">
                      <div className="period-info">
                        <div className="period-start">{report.Period?.StartDate}</div>
                        <div className="period-end">{report.Period?.EndDate}</div>
                      </div>
                    </td>
                    <td className="rpt-col-sales">
                      {report.Metrics?.TotalSales != null ? (
                        <span className="metric-sales">
                          {report.Metrics.TotalSales.toLocaleString('vi-VN')} ₫
                        </span>
                      ) : (
                        <span className="na-value">-</span>
                      )}
                    </td>
                    <td className="rpt-col-profit">
                      {report.Metrics?.TotalProfit != null ? (
                        <span className="metric-profit">
                          {report.Metrics.TotalProfit.toLocaleString('vi-VN')} ₫
                        </span>
                      ) : (
                        <span className="na-value">-</span>
                      )}
                    </td>
                    <td className="rpt-col-orders">
                      {report.Metrics?.TotalOrders != null ? (
                        <span className="metric-orders">
                          {report.Metrics.TotalOrders.toLocaleString('vi-VN')}
                        </span>
                      ) : (
                        <span className="na-value">-</span>
                      )}
                    </td>
                    <td className="rpt-col-customers">
                      {report.Metrics?.TotalCustomers != null ? (
                        <span className="metric-customers">
                          {report.Metrics.TotalCustomers.toLocaleString('vi-VN')}
                        </span>
                      ) : (
                        <span className="na-value">-</span>
                      )}
                    </td>
                    <td className="rpt-col-stockvalue">
                      {report.Metrics?.StockValue != null ? (
                        <span className="metric-stockvalue">
                          {report.Metrics.StockValue.toLocaleString('vi-VN')} ₫
                        </span>
                      ) : (
                        <span className="na-value">-</span>
                      )}
                    </td>
                    <td className="rpt-col-topproducts">
                      {report.Metrics?.TopProducts && report.Metrics.TopProducts.length > 0 ? (
                        <div className="top-products">
                          {report.Metrics.TopProducts.map((prod, idx) => (
                            <div key={idx} className="product-item">
                              <div className="product-header">
                                <span className="product-rank">#{idx + 1}</span>
                                <span className="product-name">{prod.ProductName}</span>
                              </div>
                              <div className="product-stats">
                                <span className="product-qty">
                                  Số lượng: <strong>{prod.QuantitySold}</strong>
                                </span>
                                <span className="product-revenue">
                                  Doanh thu: <strong>{prod.Revenue?.toLocaleString('vi-VN')} ₫</strong>
                                </span>
                              </div>
                              <span className="product-id">{prod.ProductID}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="na-value">Không có</span>
                      )}
                    </td>
                    <td className="rpt-col-generator">
                      <span className="generator-badge">{report.GeneratedBy}</span>
                      <div className="generated-time">
                        {new Date(report.GeneratedAt).toLocaleString('vi-VN')}
                      </div>
                    </td>
                    <td className="rpt-col-notes">
                      {report.Notes ? (
                        <span className="notes-text">{report.Notes}</span>
                      ) : (
                        <span className="na-value">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <div className="no-results-content">
              <p className="no-results-text">Không tìm thấy báo cáo nào</p>
              <p className="no-results-suggestion">Thử tìm kiếm với từ khóa khác</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Đang tải dữ liệu reports...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          <p>{error}</p>
          <button onClick={loadReports} style={{ marginTop: '10px' }}>
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
}

export default Reports;