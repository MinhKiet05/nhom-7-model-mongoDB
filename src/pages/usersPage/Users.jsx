import React, { useState } from 'react'
import { users } from '../../data/users'
import './Users.css'

const Users = () => {
  // Chỉ lấy các users có Status = "Active"
  const activeUsers = users.filter(user => user.Status === "Active");
  const [filteredUsers, setFilteredUsers] = useState(activeUsers);
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm tìm kiếm nhân viên
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredUsers(activeUsers);
    } else {
      const filtered = activeUsers.filter(user => 
        user.UserID.toLowerCase().includes(value) ||
        user.Username.toLowerCase().includes(value) ||
        user.FullName.toLowerCase().includes(value) ||
        user.Gender.toLowerCase().includes(value) ||
        user.Phone.toLowerCase().includes(value) ||
        user.Email.toLowerCase().includes(value) ||
        (user.Address && (
          user.Address.Street.toLowerCase().includes(value) ||
          user.Address.District.toLowerCase().includes(value) ||
          user.Address.City.toLowerCase().includes(value)
        )) ||
        user.Role.some(role => role.toLowerCase().includes(value)) ||
        user.Position.toLowerCase().includes(value) ||
        user.BranchID.toLowerCase().includes(value)
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="page-content">
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm nhân viên..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="table-info">
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px'}}>
          {searchTerm ? (
            <>
              Tìm thấy: <strong>{filteredUsers.length}</strong> nhân viên 
              <span style={{color: '#3b82f6'}}> (từ khóa: "{searchTerm}")</span>
            </>
          ) : (
            <>Tổng cộng: <strong>{activeUsers.length}</strong> nhân viên <span style={{color: '#10b981', fontWeight: '600'}}>(Active)</span></>
          )}
        </p>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th className="user-col-id">Mã NV</th>
              <th className="user-col-username">Username</th>
              <th className="user-col-name">Họ và tên</th>
              <th className="user-col-gender">Giới tính</th>
              <th className="user-col-birth">Ngày sinh</th>
              <th className="user-col-phone">Số điện thoại</th>
              <th className="user-col-email">Email</th>
              <th className="user-col-address">Địa chỉ</th>
              <th className="user-col-position">Chức vụ</th>
              <th className="user-col-roles">Vai trò</th>
              <th className="user-col-salary">Lương</th>
              <th className="user-col-branch">Chi nhánh</th>
              <th className="user-col-hire">Ngày vào</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.UserID}>
                  <td className="user-col-id">
                    <strong>{user.UserID}</strong>
                  </td>
                  <td className="user-col-username">
                    <span className="username">{user.Username}</span>
                  </td>
                  <td className="user-col-name">
                    <div className="user-name">{user.FullName}</div>
                  </td>
                  <td className="user-col-gender">
                    <span className={`gender ${user.Gender.toLowerCase()}`}>
                      {user.Gender}
                    </span>
                  </td>
                  <td className="user-col-birth birth-date">
                    {new Date(user.BirthDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="user-col-phone phone">{user.Phone}</td>
                  <td className="user-col-email email">{user.Email}</td>
                  <td className="user-col-address">
                    {user.Address ? (
                      <div className="address-info">
                        <div className="address-street">{user.Address.Street}</div>
                        <div className="address-detail">
                          {user.Address.District}, {user.Address.City}
                        </div>
                      </div>
                    ) : (
                      <span style={{color: '#9ca3af', fontStyle: 'italic'}}>N/A</span>
                    )}
                  </td>
                  <td className="user-col-position">
                    <span className="position">{user.Position}</span>
                  </td>
                  <td className="user-col-roles">
                    <div className="roles-tags">
                      {user.Role.map((role, index) => (
                        <span key={index} className="role-tag">{role}</span>
                      ))}
                    </div>
                  </td>
                  <td className="user-col-salary">
                    <span className="salary">
                      {user.Salary.toLocaleString('vi-VN')}₫
                    </span>
                  </td>
                  <td className="user-col-branch">
                    <span className="branch-badge">{user.BranchID}</span>
                  </td>
                  <td className="user-col-hire hire-date">
                    {new Date(user.HireDate).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-icon">🔍</div>
                    <div className="no-results-text">
                      Không tìm thấy nhân viên nào với từ khóa "<strong>{searchTerm}</strong>"
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

export default Users
