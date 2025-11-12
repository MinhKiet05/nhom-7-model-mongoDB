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
                <th className="inv-col-location">Vị trí</th>
                <th className="inv-col-product">Thông tin sản phẩm</th>
                <th className="inv-col-quantity">Số lượng tồn kho</th>
                <th className="inv-col-cost">Giá trị</th>
                <th className="inv-col-status">Trạng thái kho</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((inv) => {
                const stockStatus = inv.Quantity?.Available <= inv.ReorderPoint 
                  ? 'low-stock' 
                  : inv.Quantity?.Available > inv.ReorderPoint * 2 
                  ? 'high-stock' 
                  : 'normal-stock';

                const stockPercentage = inv.ReorderPoint 
                  ? Math.round((inv.Quantity?.Available / inv.ReorderPoint) * 100)
                  : 100;

                return (
                  <tr key={inv.InventoryID} className={inv.Status !== 'Active' ? 'inactive-row' : ''}>
                    {/* Mã tồn kho */}
                    <td className="inv-col-id">
                      <strong style={{fontSize: '13px'}}>{inv.InventoryID}</strong>
                      <div style={{fontSize: '11px', color: '#666', marginTop: '2px'}}>
                        Cập nhật: {inv.UpdatedAt ? new Date(inv.UpdatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </div>
                    </td>

                    {/* Vị trí (Chi nhánh + Kho) */}
                    <td className="inv-col-location">
                      <div className="location-info">
                        <div className="location-name">
                          Chi nhánh: {inv.BranchID}
                        </div>
                        <div className="location-details">
                          Kho: {inv.WarehouseID}
                        </div>
                      </div>
                    </td>

                    {/* Thông tin sản phẩm */}
                    <td className="inv-col-product">
                      <div className="product-info">
                        <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '4px'}}>
                          {inv.Product?.ProductName || 'N/A'}
                        </div>
                        <div style={{fontSize: '11px', color: '#666', marginBottom: '2px'}}>
                          ID: <code style={{backgroundColor: '#f5f5f5', padding: '1px 4px', borderRadius: '3px'}}>
                            {inv.Product?.ProductID}
                          </code>
                        </div>
                        <div style={{
                          fontSize: '10px', 
                          padding: '2px 6px', 
                          backgroundColor: '#fff3e0', 
                          color: '#f57c00',
                          borderRadius: '10px',
                          display: 'inline-block'
                        }}>
                          Đơn vị: {inv.Product?.Unit}
                        </div>
                      </div>
                    </td>

                    {/* Số lượng tồn kho */}
                    <td className="inv-col-quantity">
                      <div className="quantity-info">
                        <div style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '6px'}}>
                          <span style={{
                            color: stockStatus === 'low-stock' ? '#d32f2f' : 
                                   stockStatus === 'high-stock' ? '#2e7d32' : '#f57c00'
                          }}>
                            Tồn kho: {inv.Quantity?.OnHand?.toLocaleString('vi-VN') || 0}
                          </span>
                        </div>
                        
                        <div style={{fontSize: '11px', marginBottom: '4px'}}>
                          <span style={{color: '#666'}}>Khả dụng: </span>
                          <strong style={{
                            color: stockStatus === 'low-stock' ? '#d32f2f' : '#2e7d32'
                          }}>
                            {inv.Quantity?.Available?.toLocaleString('vi-VN') || 0}
                          </strong>
                        </div>

                        {inv.Quantity?.Reserved > 0 && (
                          <div style={{fontSize: '10px', color: '#f57c00'}}>
                            Đã đặt: {inv.Quantity?.Reserved?.toLocaleString('vi-VN')}
                          </div>
                        )}

                        <div style={{
                          fontSize: '9px', 
                          color: stockStatus === 'low-stock' ? '#d32f2f' : '#666',
                          marginTop: '4px'
                        }}>
                          Điểm đặt lại: {inv.ReorderPoint?.toLocaleString('vi-VN')} ({stockPercentage}%)
                        </div>
                      </div>
                    </td>

                    {/* Giá trị */}
                    <td className="inv-col-cost">
                      <div className="cost-info">
                        <div style={{fontSize: '13px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '4px'}}>
                          Tổng giá trị: {inv.Cost?.TotalValue?.toLocaleString('vi-VN') || 0}₫
                        </div>
                        <div style={{fontSize: '11px', color: '#666'}}>
                          Đơn giá: {inv.Cost?.UnitCost?.toLocaleString('vi-VN') || 0}₫/{inv.Product?.Unit}
                        </div>
                        <div style={{fontSize: '10px', color: '#999', marginTop: '2px'}}>
                          Cập nhật giá: {inv.Cost?.LastUpdated ? new Date(inv.Cost.LastUpdated).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                      </div>
                    </td>

                    {/* Trạng thái kho */}
                    <td className="inv-col-status">
                      <div className="status-info">
                        <div style={{
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          backgroundColor: inv.Status === 'Active' ? '#e8f5e8' : '#ffebee',
                          color: inv.Status === 'Active' ? '#2e7d32' : '#d32f2f'
                        }}>
                          {inv.Status === 'Active' ? 'Hoạt động' : 'Ngừng'}
                        </div>
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
              <p className="no-results-text">
                {searchValue ? 
                  `Không tìm thấy tồn kho nào với từ khóa "${searchValue}"` : 
                  'Không có dữ liệu tồn kho'
                }
              </p>
              <p className="no-results-suggestion">
                {searchValue ? 'Thử tìm kiếm với từ khóa khác' : 'Dữ liệu sẽ được hiển thị khi có sản phẩm trong kho'}
              </p>
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