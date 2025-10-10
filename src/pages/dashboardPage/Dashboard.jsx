import React from 'react'

const Dashboard = () => {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Chào mừng đến với trang quản trị</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Tổng sản phẩm</h3>
          <p className="stat-number">1,234</p>
        </div>
        <div className="stat-card">
          <h3>Đơn hàng hôm nay</h3>
          <p className="stat-number">56</p>
        </div>
        <div className="stat-card">
          <h3>Doanh thu tháng</h3>
          <p className="stat-number">₫12,345,678</p>
        </div>
        <div className="stat-card">
          <h3>Khách hàng mới</h3>
          <p className="stat-number">89</p>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Hoạt động gần đây</h2>
        <ul>
          <li>Đơn hàng #1234 đã được tạo</li>
          <li>Sản phẩm "iPhone 15" đã được cập nhật</li>
          <li>Khách hàng Nguyễn Văn A đã đăng ký</li>
          <li>Đơn hàng #1233 đã được giao thành công</li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard