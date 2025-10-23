import React, { useState } from 'react'
import workshifts from "../../data/workshifts";
import './Workshits.css'; // Import CSS riêng cho Workshits

const Workshifts = () => {
  // Chỉ lấy các ca làm việc có Status = "Active"
  const activeShifts = workshifts.filter(shift => shift.Status === "Active");
  const [filteredShifts, setFilteredShifts] = useState(activeShifts);
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm tìm kiếm ca làm việc (chỉ trong các ca Active)
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredShifts(activeShifts);
    } else {
      const filtered = activeShifts.filter(shift => 
        shift.ShiftID.toLowerCase().includes(value) ||
        shift.Name.toLowerCase().includes(value) ||
        shift.BranchID.toLowerCase().includes(value) ||
        shift.Time.Start.toLowerCase().includes(value) ||
        shift.Time.End.toLowerCase().includes(value) ||
        shift.RolesRequired.some(role => role.toLowerCase().includes(value)) ||
        shift.CreateBy.toLowerCase().includes(value)
      );
      setFilteredShifts(filtered);
    }
  };

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
            <>Tổng cộng: <strong>{activeShifts.length}</strong> ca làm việc <span style={{color: '#10b981', fontWeight: '600'}}>(Active)</span></>
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
                <tr key={shift.ShiftID}>
                  <td className="shift-col-id"><strong>{shift.ShiftID}</strong></td>
                  <td className="shift-col-name">
                    <div className="shift-name">{shift.Name}</div>
                  </td>
                  <td className="shift-col-branch">
                    <span className="branch-badge">{shift.BranchID}</span>
                  </td>
                  <td className="shift-col-time">
                    <div className="time-info">
                      <div className="time-start">{shift.Time.Start}</div>
                      <div className="time-end">{shift.Time.End}</div>
                    </div>
                  </td>
                  <td className="shift-col-break">
                    <span className="break-time">{shift.BreakMinutes} phút</span>
                  </td>
                  <td className="shift-col-max">
                    <span className="max-employees">{shift.MaxEmployees} người</span>
                  </td>
                  <td className="shift-col-roles">
                    <div className="roles-tags">
                      {shift.RolesRequired.map((role, index) => (
                        <span key={index} className="role-tag">{role}</span>
                      ))}
                    </div>
                  </td>
                  <td className="shift-col-creator creator">{shift.CreateBy}</td>
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