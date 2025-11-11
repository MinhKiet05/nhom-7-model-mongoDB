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
          <div>⏳ Đang tải dữ liệu ca làm việc...</div>
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
          <div>❌ Lỗi: {error}</div>
          <button onClick={loadWorkshifts} style={{ marginTop: '10px', padding: '8px 16px' }}>
            🔄 Thử lại
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
              <th className="shift-col-id">Mã ca</th>
              <th className="shift-col-name">Tên ca</th>
              <th className="shift-col-branch">Chi nhánh</th>
              <th className="shift-col-time">Thời gian</th>
              <th className="shift-col-break">Nghỉ giải lao</th>
              <th className="shift-col-max">Số NV tối đa</th>
              <th className="shift-col-roles">Vai trò yêu cầu</th>
              <th className="shift-col-creator">Người tạo</th>
            </tr>
          </thead>
          <tbody>
            {filteredShifts.length > 0 ? (
              filteredShifts.map(shift => (
                <tr key={shift.ShiftID || shift._id}>
                  <td className="shift-col-id"><strong>{shift.ShiftID}</strong></td>
                  <td className="shift-col-name">
                    <div className="shift-name">Ca làm việc</div>
                  </td>
                  <td className="shift-col-branch">
                    <span className="branch-badge">Chi nhánh chính</span>
                  </td>
                  <td className="shift-col-time">
                    <div className="time-info">
                      <div className="time-start">{shift.StartAt ? new Date(shift.StartAt).toLocaleTimeString('vi-VN') : 'N/A'}</div>
                      <div className="time-end">{shift.EndAt ? new Date(shift.EndAt).toLocaleTimeString('vi-VN') : 'N/A'}</div>
                    </div>
                  </td>
                  <td className="shift-col-break">
                    <span className="break-time">30 phút</span>
                  </td>
                  <td className="shift-col-max">
                    <span className="max-employees">{shift.MaxEmployees || 1} người</span>
                  </td>
                  <td className="shift-col-roles">
                    <div className="roles-tags">
                      {shift.Employees && shift.Employees.length > 0 ? (
                        shift.Employees.map((emp, index) => (
                          <span key={index} className="role-tag">{emp.Role || 'Nhân viên'}</span>
                        ))
                      ) : (
                        <span className="role-tag">Nhân viên</span>
                      )}
                    </div>
                  </td>
                  <td className="shift-col-creator creator">
                    {shift.Employees && shift.Employees.length > 0 ? shift.Employees[0].FullName : 'Admin'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-icon">🔍</div>
                    <div className="no-results-text">
                      Không tìm thấy ca làm việc nào với từ khóa "<strong>{searchTerm}</strong>"
                    </div>
                    <div className="no-results-suggestion">
                      Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả
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