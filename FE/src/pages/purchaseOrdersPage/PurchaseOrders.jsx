import React, { useState, useEffect } from 'react';
import './PurchaseOrders.css';
import PurchaseOrderService from '../../services/purchaseOrderService.js';

function PurchaseOrders() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tải dữ liệu purchase orders
  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      const data = await PurchaseOrderService.getAllPurchaseOrders();
      if (Array.isArray(data)) {
        setPurchaseOrders(data);
        setError(null);
      } else {
        setError('Failed to load purchase orders - invalid response');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Lọc theo status
  const statusFilteredOrders = selectedStatus === 'all' 
    ? purchaseOrders 
    : purchaseOrders.filter(po => po.Status === selectedStatus);

  // Lọc theo tìm kiếm
  const filteredOrders = statusFilteredOrders.filter(po => {
    const searchLower = searchValue.toLowerCase();
    return (
      po.POID?.toLowerCase().includes(searchLower) ||
      po.SupplierID?.toLowerCase().includes(searchLower) ||
      po.BranchID?.toLowerCase().includes(searchLower) ||
      po.OrderDate?.toLowerCase().includes(searchLower) ||
      po.ExpectedDate?.toLowerCase().includes(searchLower) ||
      po.Status?.toLowerCase().includes(searchLower) ||
      po.Notes?.toLowerCase().includes(searchLower) ||
      po.Subtotal?.toString().includes(searchLower) ||
      po.GrandTotal?.toString().includes(searchLower) ||
      po.Items?.some(item =>
        item.ProductID?.toLowerCase().includes(searchLower) ||
        item.ProductName?.toLowerCase().includes(searchLower)
      )
    );
  });

  return (
    <div className="page-content">
      <h1>Quản lý Phiếu nhập hàng</h1>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm theo mã phiếu, nhà cung cấp, chi nhánh, sản phẩm..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <select
          className="status-filter-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Draft">Nháp</option>
          <option value="Approved">Đã duyệt</option>
          <option value="Received">Đã nhận</option>
          <option value="Cancelled">Đã hủy</option>
        </select>
      </div>

      <div className="purchase-orders-table">
        {filteredOrders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="po-col-id">Mã đơn hàng</th>
                <th className="po-col-supplier">Nhà cung cấp</th>
                <th className="po-col-status">Trạng thái</th>
                <th className="po-col-orderdate">Ngày đặt hàng</th>
                <th className="po-col-items">Danh sách sản phẩm</th>
                <th className="po-col-subtotal">Tiền hàng</th>
                <th className="po-col-vat">VAT</th>
                <th className="po-col-total">Tổng tiền</th>
                <th className="po-col-created">Ngày tạo</th>
                <th className="po-col-updated">Cập nhật cuối</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((po) => {
                return (
                  <tr key={po.POID}>
                    {/* Mã đơn hàng */}
                    <td className="po-col-id">
                      <strong style={{fontSize: '14px'}}>{po.POID}</strong>
                    </td>

                    {/* Nhà cung cấp */}
                    <td className="po-col-supplier">
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {po.SupplierID}
                      </span>
                    </td>

                    {/* Trạng thái */}
                    <td className="po-col-status">
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: 
                          po.Status === 'Draft' ? '#f3f4f6' :
                          po.Status === 'Approved' ? '#dcfce7' :
                          po.Status === 'Received' ? '#dbeafe' :
                          po.Status === 'Cancelled' ? '#fee2e2' : '#f3f4f6',
                        color:
                          po.Status === 'Draft' ? '#374151' :
                          po.Status === 'Approved' ? '#166534' :
                          po.Status === 'Received' ? '#1e40af' :
                          po.Status === 'Cancelled' ? '#991b1b' : '#374151'
                      }}>
                        {po.Status === 'Draft' ? 'Nháp' :
                         po.Status === 'Approved' ? 'Đã duyệt' :
                         po.Status === 'Received' ? 'Đã nhận' :
                         po.Status === 'Cancelled' ? 'Đã hủy' :
                         po.Status || 'Chưa xác định'}
                      </span>
                    </td>

                    {/* Ngày đặt hàng */}
                    <td className="po-col-orderdate">
                      <span style={{fontSize: '12px'}}>
                        {po.OrderDate ? new Date(po.OrderDate).toLocaleDateString('vi-VN') : '-'}
                      </span>
                    </td>

                    {/* Danh sách sản phẩm */}
                    <td className="po-col-items">
                      {po.Items && po.Items.length > 0 ? (
                        <div>
                          {po.Items.map((item, idx) => (
                            <div key={idx} style={{
                              marginBottom: '8px',
                              padding: '8px',
                              backgroundColor: '#f9fafb',
                              borderRadius: '8px',
                              borderLeft: '3px solid #3b82f6'
                            }}>
                              <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '4px'}}>
                                {item.ProductName}
                              </div>
                              <div style={{fontSize: '11px', color: '#666', marginBottom: '4px'}}>
                                Mã SP: {item.ProductID} • Dòng: {item.LineNo}
                              </div>
                              <div style={{fontSize: '12px', marginBottom: '2px'}}>
                                Số lượng: <strong>{item.OrderedQty.toLocaleString('vi-VN')}</strong>
                              </div>
                              <div style={{fontSize: '12px', marginBottom: '2px'}}>
                                Đơn giá: <strong>{item.UnitCost.toLocaleString('vi-VN')} ₫</strong>
                              </div>
                              <div style={{fontSize: '12px', fontWeight: 'bold', color: '#059669'}}>
                                Thành tiền: {(item.OrderedQty * item.UnitCost).toLocaleString('vi-VN')} ₫
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{fontSize: '12px', color: '#9ca3af', fontStyle: 'italic'}}>
                          Không có sản phẩm
                        </span>
                      )}
                    </td>

                    {/* Tiền hàng */}
                    <td className="po-col-subtotal">
                      <span style={{fontFamily: 'monospace', fontWeight: '600', fontSize: '13px'}}>
                        {po.Totals?.Subtotal ? po.Totals.Subtotal.toLocaleString('vi-VN') + ' ₫' : '-'}
                      </span>
                    </td>

                    {/* VAT */}
                    <td className="po-col-vat">
                      <span style={{fontFamily: 'monospace', fontWeight: '600', fontSize: '13px', color: '#dc2626'}}>
                        {po.Totals?.VAT ? po.Totals.VAT.toLocaleString('vi-VN') + ' ₫' : '-'}
                      </span>
                    </td>

                    {/* Tổng tiền */}
                    <td className="po-col-total">
                      <span style={{fontFamily: 'monospace', fontWeight: 'bold', fontSize: '14px', color: '#059669'}}>
                        {po.Totals?.GrandTotal ? po.Totals.GrandTotal.toLocaleString('vi-VN') + ' ₫' : '-'}
                      </span>
                    </td>

                    {/* Ngày tạo */}
                    <td className="po-col-created">
                      <span style={{fontSize: '12px', color: '#666'}}>
                        {po.CreatedAt ? new Date(po.CreatedAt).toLocaleDateString('vi-VN') : '-'}
                      </span>
                    </td>

                    {/* Cập nhật cuối */}
                    <td className="po-col-updated">
                      <span style={{fontSize: '12px', color: '#666'}}>
                        {po.LastUpdatedAt ? new Date(po.LastUpdatedAt).toLocaleDateString('vi-VN') : '-'}
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
                  `Không tìm thấy phiếu nhập hàng nào với từ khóa "${searchValue}"` : 
                  'Không có dữ liệu phiếu nhập hàng'
                }
              </p>
              <p className="no-results-suggestion">
                {searchValue ? 'Thử tìm kiếm với từ khóa khác' : 'Dữ liệu sẽ được hiển thị khi có phiếu nhập hàng'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Đang tải dữ liệu purchase orders...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          <p>{error}</p>
          <button onClick={loadPurchaseOrders} style={{ marginTop: '10px' }}>
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
}

export default PurchaseOrders;