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
        (user.Account?.Username && user.Account.Username.toLowerCase().includes(value)) ||
        (user.FullName && user.FullName.toLowerCase().includes(value)) ||
        (user.Phone && user.Phone.toLowerCase().includes(value)) ||
        (user.Roles && Array.isArray(user.Roles) && user.Roles.some(role => role.toLowerCase().includes(value))) ||
        (user.Status && user.Status.toLowerCase().includes(value))
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
          <div> Đang tải dữ liệu nhân viên...</div>
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
          <div>Lỗi: {error}</div>
          <button onClick={loadUsers} style={{ marginTop: '10px', padding: '8px 16px' }}>
             Thử lại
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
              <th className="user-col-id">Mã nhân viên</th>
              <th className="user-col-info">Thông tin cá nhân</th>
              <th className="user-col-account">Tài khoản</th>
              <th className="user-col-roles">Vai trò</th>
              <th className="user-col-contact">Liên hệ</th>
              <th className="user-col-status">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.UserID || user._id || index} className={user.Status !== 'Active' ? 'inactive-row' : ''}>
                  {/* Mã nhân viên */}
                  <td className="user-col-id">
                    <strong style={{fontSize: '14px'}}>{user.UserID}</strong>
                  </td>

                  {/* Thông tin cá nhân */}
                  <td className="user-col-info">
                    <div className="user-info">
                      <div className="user-name" style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '2px'}}>
                        {user.FullName}
                      </div>
                    </div>
                  </td>

                  {/* Tài khoản */}
                  <td className="user-col-account">
                    <div className="account-info">
                      <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '4px'}}>
                        {user.Account?.Username || 'N/A'}
                      </div>
                      <div style={{fontSize: '10px', color: '#999'}}>
                        {user.Account?.Password ? '••••••••' : 'Chưa có mật khẩu'}
                      </div>
                    </div>
                  </td>

                  {/* Vai trò */}
                  <td className="user-col-roles">
                    <div className="roles-container">
                      {user.Roles && Array.isArray(user.Roles) ? (
                        user.Roles.map((role, index) => (
                          <span key={index} style={{
                            padding: '4px 8px',
                            backgroundColor: 
                              role === 'Manager' ? '#e0e7ff' :
                              role === 'Cashier' ? '#fef3c7' :
                              role === 'Stocker' ? '#dcfce7' :
                              role === 'Guard' ? '#f3e8ff' : '#f3f4f6',
                            color:
                              role === 'Manager' ? '#3730a3' :
                              role === 'Cashier' ? '#92400e' :
                              role === 'Stocker' ? '#166534' :
                              role === 'Guard' ? '#7c3aed' : '#374151',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            display: 'inline-block',
                            marginBottom: '2px'
                          }}>
                            {role}
                          </span>
                        ))
                      ) : (
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          {user.Roles || 'N/A'}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Liên hệ */}
                  <td className="user-col-contact">
                    <div className="contact-info">
                      <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '4px'}}>
                        {user.Phone || 'Chưa có SĐT'}
                      </div>
                      <div style={{fontSize: '11px', color: '#666'}}>
                        {user.Email || 'Chưa có email'}
                      </div>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="user-col-status">
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textAlign: 'center',
                      backgroundColor: user.Status === 'Active' ? '#dcfce7' : '#fee2e2',
                      color: user.Status === 'Active' ? '#166534' : '#991b1b'
                    }}>
                      {user.Status === 'Active' ? 'Hoạt động' : 'Ngưng hoạt động'}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-text">
                      {searchTerm ? 
                        `Không tìm thấy nhân viên nào với từ khóa "${searchTerm}"` : 
                        'Không có dữ liệu nhân viên'
                      }
                    </div>
                    <div className="no-results-suggestion">
                      {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Dữ liệu sẽ được hiển thị khi có nhân viên'}
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
