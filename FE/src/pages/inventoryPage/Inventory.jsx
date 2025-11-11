import React, { useState, useEffect } from 'react';
import './Inventory.css';
import InventoryService from '../../services/inventoryService.js';

function Inventory() {
  const [searchValue, setSearchValue] = useState('');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tải dữ liệu inventory
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await InventoryService.getAllInventory();
      setInventory(data);
      setError(null);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu inventory');
    } finally {
      setLoading(false);
    }
  };

  // Lọc theo tìm kiếm - hiển thị tất cả inventory
  const filteredInventory = inventory.filter(inv => {
    const searchLower = searchValue.toLowerCase();
    return (
      inv.InventoryID?.toLowerCase().includes(searchLower) ||
      inv.BranchID?.toLowerCase().includes(searchLower) ||
      inv.WarehouseID?.toLowerCase().includes(searchLower) ||
      inv.Product?.ProductID?.toLowerCase().includes(searchLower) ||
      inv.Product?.ProductName?.toLowerCase().includes(searchLower) ||
      inv.Product?.Unit?.toLowerCase().includes(searchLower) ||
      inv.Quantity?.OnHand?.toString().includes(searchLower) ||
      inv.Quantity?.Reserved?.toString().includes(searchLower) ||
      inv.Quantity?.Available?.toString().includes(searchLower) ||
      inv.Cost?.UnitCost?.toString().includes(searchLower) ||
      inv.Cost?.TotalValue?.toString().includes(searchLower) ||
      inv.ReorderPoint?.toString().includes(searchLower) ||
      inv.MovementHistory?.some(move =>
        move.MovementID?.toLowerCase().includes(searchLower) ||
        move.Type?.toLowerCase().includes(searchLower) ||
        move.Reference?.toLowerCase().includes(searchLower)
      )
    );
  });

  return (
    <div className="page-content">
      <h1>Quản lý tồn kho</h1>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm theo mã, chi nhánh, kho, sản phẩm, số lượng..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="inventory-table">
        {filteredInventory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="inv-col-id">Mã tồn kho</th>
                <th className="inv-col-branch">Chi nhánh</th>
                <th className="inv-col-warehouse">Kho</th>
                <th className="inv-col-product">Sản phẩm</th>
                <th className="inv-col-unit">Đơn vị</th>
                <th className="inv-col-onhand">Tồn kho</th>
                <th className="inv-col-reserved">Đã đặt</th>
                <th className="inv-col-available">Khả dụng</th>
                <th className="inv-col-unitcost">Giá vốn</th>
                <th className="inv-col-totalvalue">Tổng giá trị</th>
                <th className="inv-col-reorder">Điểm đặt lại</th>
                <th className="inv-col-history">Lịch sử xuất nhập</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((inv) => {
                const stockStatus = inv.Quantity?.Available <= inv.ReorderPoint 
                  ? 'low-stock' 
                  : inv.Quantity?.Available > inv.ReorderPoint * 2 
                  ? 'high-stock' 
                  : 'normal-stock';

                return (
                  <tr key={inv.InventoryID} className={inv.Status !== 'Active' ? 'inactive-row' : ''}>
                    <td className="inv-col-id">
                      <span className="inventory-id">{inv.InventoryID}</span>
                    </td>
                    <td className="inv-col-branch">
                      <span className="branch-badge">{inv.BranchID}</span>
                    </td>
                    <td className="inv-col-warehouse">
                      <span className="warehouse-badge">{inv.WarehouseID}</span>
                    </td>
                    <td className="inv-col-product">
                      <div className="product-info">
                        <div className="product-name">{inv.Product?.ProductName}</div>
                        <div className="product-id">{inv.Product?.ProductID}</div>
                      </div>
                    </td>
                    <td className="inv-col-unit">
                      <span className="unit-badge">{inv.Product?.Unit}</span>
                    </td>
                    <td className="inv-col-onhand">
                      <span className={`quantity-badge ${stockStatus}`}>
                        {inv.Quantity?.OnHand?.toLocaleString('vi-VN')}
                      </span>
                    </td>
                    <td className="inv-col-reserved">
                      <span className="reserved-badge">
                        {inv.Quantity?.Reserved?.toLocaleString('vi-VN')}
                      </span>
                    </td>
                    <td className="inv-col-available">
                      <span className={`available-badge ${stockStatus}`}>
                        {inv.Quantity?.Available?.toLocaleString('vi-VN')}
                      </span>
                    </td>
                    <td className="inv-col-unitcost">
                      <span className="unit-cost">
                        {inv.Cost?.UnitCost?.toLocaleString('vi-VN')} ₫
                      </span>
                    </td>
                    <td className="inv-col-totalvalue">
                      <span className="total-value">
                        {inv.Cost?.TotalValue?.toLocaleString('vi-VN')} ₫
                      </span>
                    </td>
                    <td className="inv-col-reorder">
                      <span className="reorder-badge">
                        {inv.ReorderPoint?.toLocaleString('vi-VN')}
                      </span>
                    </td>
                    <td className="inv-col-history">
                      <div className="movement-history">
                        {inv.MovementHistory && inv.MovementHistory.length > 0 ? (
                          inv.MovementHistory.map((move, idx) => (
                            <div key={idx} className="movement-item">
                              <span className={`movement-type ${move.Type === 'Nhập' ? 'inbound' : 'outbound'}`}>
                                {move.Type === 'Nhập' ? '↓' : '↑'} {move.Type}
                              </span>
                              <span className="movement-qty">
                                {move.QuantityChange > 0 ? '+' : ''}{move.QuantityChange}
                              </span>
                              <span className="movement-date">{move.Date}</span>
                              <span className="movement-ref">{move.Reference}</span>
                            </div>
                          ))
                        ) : (
                          <span className="no-movement">Chưa có</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <div className="no-results-content">
              <div className="no-results-icon">📦</div>
              <p className="no-results-text">Không tìm thấy tồn kho nào</p>
              <p className="no-results-suggestion">Thử tìm kiếm với từ khóa khác</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Đang tải dữ liệu inventory...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          <p>{error}</p>
          <button onClick={loadInventory} style={{ marginTop: '10px' }}>
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
}

export default Inventory;