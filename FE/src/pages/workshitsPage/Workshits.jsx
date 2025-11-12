import React, { useState, useEffect } from 'react'
import WorkshiftService from '../../services/workshiftService.js';
import './Workshits.css'; // Import CSS riêng cho Workshits

const Workshifts = () => {
  const [workshifts, setWorkshifts] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load workshifts from API
  useEffect(() => {
    loadWorkshifts();
  }, []);

  const loadWorkshifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const workshifts = await WorkshiftService.getAllWorkshifts();
      
      if (Array.isArray(workshifts)) {
        setWorkshifts(workshifts);
        setFilteredShifts(workshifts);
      } else {
        setError('Failed to load workshifts - invalid response');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm ca làm việc
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredShifts(workshifts);
    } else {
      const filtered = workshifts.filter(shift => 
        (shift.ShiftID && shift.ShiftID.toLowerCase().includes(value)) ||
        (shift.Status && shift.Status.toLowerCase().includes(value)) ||
        (shift.Employees && shift.Employees.some(emp => 
          emp.FullName && emp.FullName.toLowerCase().includes(value)
        ))
      );
      setFilteredShifts(filtered);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="page-content">
        <h1>Quản lý ca làm việc</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Đang tải dữ liệu ca làm việc...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="page-content">
        <h1>Quản lý ca làm việc</h1>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <div>Lỗi: {error}</div>
          <button onClick={loadWorkshifts} style={{ marginTop: '10px', padding: '8px 16px' }}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>Quản lý ca làm việc</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm ca làm việc..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="table-info">
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px'}}>
          {searchTerm ? (
            <>
              Tìm thấy: <strong>{filteredShifts.length}</strong> ca làm việc 
              <span style={{color: '#3b82f6'}}> (từ khóa: "{searchTerm}")</span>
            </>
          ) : (
            <>Tổng cộng: <strong>{workshifts.length}</strong> ca làm việc</>
          )}
        </p>
      </div>

      <div className="workshifts-table">
        <table>
          <thead>
            <tr>
              <th className="shift-col-id">Mã ca làm việc</th>
              <th className="shift-col-time">Thời gian làm việc</th>
              <th className="shift-col-max">Số lượng NV</th>
              <th className="shift-col-employees">Danh sách nhân viên</th>
              <th className="shift-col-status">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredShifts.length > 0 ? (
              filteredShifts.map(shift => (
                <tr key={shift.ShiftID || shift._id}>
                  {/* Mã ca làm việc */}
                  <td className="shift-col-id">
                    <strong style={{fontSize: '14px'}}>{shift.ShiftID}</strong>
                  </td>

                  {/* Thời gian làm việc */}
                  <td className="shift-col-time">
                    <div className="time-info">
                      <div style={{fontSize: '12px', marginBottom: '4px'}}>
                        <strong>Bắt đầu:</strong> {shift.StartAt ? new Date(shift.StartAt).toLocaleString('vi-VN') : 'Chưa xác định'}
                      </div>
                      <div style={{fontSize: '12px'}}>
                        <strong>Kết thúc:</strong> {shift.EndAt ? new Date(shift.EndAt).toLocaleString('vi-VN') : 'Chưa xác định'}
                      </div>
                    </div>
                  </td>

                  {/* Số lượng nhân viên */}
                  <td className="shift-col-max">
                    <div style={{textAlign: 'center'}}>
                      <div style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '2px'}}>
                        {shift.Employees ? shift.Employees.length : 0}/{shift.MaxEmployees || 1}
                      </div>
                      <div style={{fontSize: '10px', color: '#666'}}>
                        Hiện tại/Tối đa
                      </div>
                    </div>
                  </td>

                  {/* Danh sách nhân viên */}
                  <td className="shift-col-employees">
                    {shift.Employees && shift.Employees.length > 0 ? (
                      <div>
                        {shift.Employees.map((emp, index) => (
                          <div key={index} style={{marginBottom: '6px', padding: '4px 0', borderBottom: index < shift.Employees.length - 1 ? '1px solid #f0f0f0' : 'none'}}>
                            <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '2px'}}>
                              {emp.FullName}
                            </div>
                            <div style={{fontSize: '11px', color: '#666'}}>
                              ID: {emp.UserID} • 
                              <span style={{
                                padding: '2px 6px',
                                backgroundColor: 
                                  emp.Role === 'Cashier' ? '#fef3c7' :
                                  emp.Role === 'Stocker' ? '#dcfce7' :
                                  emp.Role === 'Manager' ? '#e0e7ff' : '#f3f4f6',
                                color:
                                  emp.Role === 'Cashier' ? '#92400e' :
                                  emp.Role === 'Stocker' ? '#166534' :
                                  emp.Role === 'Manager' ? '#3730a3' : '#374151',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: '600',
                                marginLeft: '4px'
                              }}>
                                {emp.Role}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', textAlign: 'center'}}>
                        Chưa có nhân viên
                      </div>
                    )}
                  </td>

                  {/* Trạng thái */}
                  <td className="shift-col-status">
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textAlign: 'center',
                      backgroundColor: 
                        shift.Status === 'Scheduled' ? '#dbeafe' :
                        shift.Status === 'InProgress' ? '#fef3c7' :
                        shift.Status === 'Completed' ? '#dcfce7' :
                        shift.Status === 'Cancelled' ? '#fee2e2' : '#f3f4f6',
                      color:
                        shift.Status === 'Scheduled' ? '#1e40af' :
                        shift.Status === 'InProgress' ? '#92400e' :
                        shift.Status === 'Completed' ? '#166534' :
                        shift.Status === 'Cancelled' ? '#991b1b' : '#374151'
                    }}>
                      {shift.Status === 'Scheduled' ? 'Đã lên lịch' :
                       shift.Status === 'InProgress' ? 'Đang diễn ra' :
                       shift.Status === 'Completed' ? 'Hoàn thành' :
                       shift.Status === 'Cancelled' ? 'Đã hủy' :
                       shift.Status || 'Chưa xác định'}
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
                        `Không tìm thấy ca làm việc nào với từ khóa "${searchTerm}"` : 
                        'Không có dữ liệu ca làm việc'
                      }
                    </div>
                    <div className="no-results-suggestion">
                      {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Dữ liệu sẽ được hiển thị khi có ca làm việc'}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Workshifts