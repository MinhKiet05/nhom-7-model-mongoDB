import React, { useState } from 'react';
import './PurchaseOrders.css';
import { purchaseOrders } from '../../data/purchase_orders';

function PurchaseOrders() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

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
      <h1>Phiếu nhập hàng</h1>
      
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
          <option value="Pending">Đang chờ</option>
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
                <th className="po-col-id">Mã phiếu</th>
                <th className="po-col-supplier">Nhà cung cấp</th>
                <th className="po-col-branch">Chi nhánh</th>
                <th className="po-col-orderdate">Ngày đặt</th>
                <th className="po-col-expecteddate">Ngày dự kiến</th>
                <th className="po-col-status">Trạng thái</th>
                <th className="po-col-items">Sản phẩm</th>
                <th className="po-col-subtotal">Tiền hàng</th>
                <th className="po-col-vat">VAT</th>
                <th className="po-col-total">Tổng tiền</th>
                <th className="po-col-notes">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((po) => {
                return (
                  <tr key={po.POID}>
                    <td className="po-col-id">
                      <span className="po-id">{po.POID}</span>
                    </td>
                    <td className="po-col-supplier">
                      <span className="supplier-badge">{po.SupplierID}</span>
                    </td>
                    <td className="po-col-branch">
                      <span className="branch-badge">{po.BranchID}</span>
                    </td>
                    <td className="po-col-orderdate">
                      <span className="order-date">
                        {new Date(po.OrderDate).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td className="po-col-expecteddate">
                      <span className="expected-date">
                        {po.ExpectedDate}
                      </span>
                    </td>
                    <td className="po-col-status">
                      <span className={`status-badge ${po.Status?.toLowerCase()}`}>
                        {po.Status === 'Pending' ? 'Đang chờ' :
                         po.Status === 'Approved' ? 'Đã duyệt' :
                         po.Status === 'Received' ? 'Đã nhận' :
                         po.Status === 'Cancelled' ? 'Đã hủy' :
                         po.Status}
                      </span>
                    </td>
                    <td className="po-col-items">
                      <div className="items-list">
                        {po.Items && po.Items.length > 0 ? (
                          po.Items.map((item, idx) => (
                            <div key={idx} className="item-row">
                              <div className="item-header">
                                <span className="item-name">{item.ProductName}</span>
                                <span className="item-id">{item.ProductID}</span>
                              </div>
                              <div className="item-details">
                                <span className="item-qty">
                                  SL: <strong>{item.OrderedQty}</strong> {item.Unit}
                                </span>
                                <span className="item-cost">
                                  Giá: <strong>{item.UnitCost?.toLocaleString('vi-VN')} ₫</strong>
                                </span>
                                {item.Discount > 0 && (
                                  <span className="item-discount">
                                    Giảm: <strong>{item.Discount?.toLocaleString('vi-VN')} ₫</strong>
                                  </span>
                                )}
                              </div>
                              <div className="item-total">
                                Thành tiền: <strong>{((item.OrderedQty * item.UnitCost) - item.Discount).toLocaleString('vi-VN')} ₫</strong>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="no-items">Không có sản phẩm</span>
                        )}
                      </div>
                    </td>
                    <td className="po-col-subtotal">
                      <span className="subtotal-amount">
                        {po.Subtotal?.toLocaleString('vi-VN')} ₫
                      </span>
                    </td>
                    <td className="po-col-vat">
                      <span className="vat-amount">
                        {po.VAT?.toLocaleString('vi-VN')} ₫
                      </span>
                    </td>
                    <td className="po-col-total">
                      <span className="total-amount">
                        {po.GrandTotal?.toLocaleString('vi-VN')} ₫
                      </span>
                    </td>
                    <td className="po-col-notes">
                      {po.Notes ? (
                        <span className="notes-text">{po.Notes}</span>
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
              <div className="no-results-icon">📄</div>
              <p className="no-results-text">Không tìm thấy phiếu nhập hàng nào</p>
              <p className="no-results-suggestion">Thử tìm kiếm với từ khóa khác</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PurchaseOrders;