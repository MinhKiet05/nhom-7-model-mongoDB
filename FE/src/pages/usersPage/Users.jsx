import React, { useState, useEffect } from 'react'
import UserService from '../../services/userService.js';
import './Users.css'

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load users from API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const users = await UserService.getAllUsers();
      
      if (Array.isArray(users)) {
        setUsers(users);
        setFilteredUsers(users);
      } else {
        setError('Failed to load users - invalid response');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm nhân viên
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        (user.UserID && user.UserID.toLowerCase().includes(value)) ||
        (user.Username && user.Username.toLowerCase().includes(value)) ||
        (user.FullName && user.FullName.toLowerCase().includes(value)) ||
        (user.Gender && user.Gender.toLowerCase().includes(value)) ||
        (user.Phone && user.Phone.toLowerCase().includes(value)) ||
        (user.Email && user.Email.toLowerCase().includes(value)) ||
        (user.Role && Array.isArray(user.Role) && user.Role.some(role => role.toLowerCase().includes(value))) ||
        (user.Position && user.Position.toLowerCase().includes(value)) ||
        (user.BranchID && user.BranchID.toLowerCase().includes(value))
      );
      setFilteredUsers(filtered);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="page-content">
        <h1>Quản lý Nhân viên</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>⏳ Đang tải dữ liệu nhân viên...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="page-content">
        <h1>Quản lý Nhân viên</h1>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <div>❌ Lỗi: {error}</div>
          <button onClick={loadUsers} style={{ marginTop: '10px', padding: '8px 16px' }}>
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>Quản lý Nhân viên</h1>
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
            <>Tổng cộng: <strong>{users.length}</strong> nhân viên</>
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
              <th className="user-col-status">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.UserID || user._id || index} className={user.Status !== 'Active' ? 'inactive-row' : ''}>
                  <td className="user-col-id">
                    <strong>{user.UserID || user._id}</strong>
                  </td>
                  <td className="user-col-username">
                    <span className="username">{user.Username || 'N/A'}</span>
                  </td>
                  <td className="user-col-name">
                    <div className="user-name">{user.FullName || 'N/A'}</div>
                  </td>
                  <td className="user-col-gender">
                    <span className={`gender ${user.Gender ? user.Gender.toLowerCase() : 'unknown'}`}>
                      {user.Gender || 'N/A'}
                    </span>
                  </td>
                  <td className="user-col-birth birth-date">
                    {user.BirthDate ? new Date(user.BirthDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="user-col-phone phone">{user.Phone || 'N/A'}</td>
                  <td className="user-col-email email">{user.Email || 'N/A'}</td>
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
                    <span className="position">{user.Position || 'N/A'}</span>
                  </td>
                  <td className="user-col-roles">
                    <div className="roles-tags">
                      {user.Role && Array.isArray(user.Role) ? (
                        user.Role.map((role, index) => (
                          <span key={index} className="role-tag">{role}</span>
                        ))
                      ) : (
                        <span className="role-tag">{user.Role || 'N/A'}</span>
                      )}
                    </div>
                  </td>
                  <td className="user-col-salary">
                    <span className="salary">
                      {user.Salary ? user.Salary.toLocaleString('vi-VN') + '₫' : 'N/A'}
                    </span>
                  </td>
                  <td className="user-col-branch">
                    <span className="branch-badge">{user.BranchID || 'N/A'}</span>
                  </td>
                  <td className="user-col-hire hire-date">
                    {user.HireDate ? new Date(user.HireDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="user-col-status status">
                    <span className={`status-badge ${user.Status?.toLowerCase() || 'active'}`}>
                      {user.Status === 'Active' ? 'Hoạt động' : 
                       user.Status === 'Inactive' ? 'Không hoạt động' : 
                       user.Status === 'Resigned' ? 'Đã nghỉ việc' :
                       user.Status || 'Hoạt động'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="no-results">
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
