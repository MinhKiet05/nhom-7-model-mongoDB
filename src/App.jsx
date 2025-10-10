import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/sidebar/sidebar'
import Dashboard from './pages/dashboardPage/Dashboard'
import Products from './pages/productPage/Products'
import './App.css'

// Import các page components khác (tạm thời tạo các component đơn giản)
const Users = () => <div className="page-content"><h1>Users</h1><p>Quản lý nhân viên & người dùng</p></div>
const WorkShifts = () => <div className="page-content"><h1>Work Shifts</h1><p>Quản lý ca làm việc</p></div>
const Customers = () => <div className="page-content"><h1>Customers</h1><p>Quản lý khách hàng</p></div>
const Promotions = () => <div className="page-content"><h1>Promotions</h1><p>Quản lý khuyến mãi</p></div>
const Inventory = () => <div className="page-content"><h1>Inventory</h1><p>Quản lý tồn kho</p></div>
const Reports = () => <div className="page-content"><h1>Reports</h1><p>Báo cáo - Thống kê</p></div>
const Sales = () => <div className="page-content"><h1>Sales</h1><p>Hóa đơn bán hàng</p></div>
const Returns = () => <div className="page-content"><h1>Returns</h1><p>Đổi/Trả hàng</p></div>
const Suppliers = () => <div className="page-content"><h1>Suppliers</h1><p>Quản lý nhà cung cấp</p></div>
const PurchaseOrders = () => <div className="page-content"><h1>Purchase Orders</h1><p>Phiếu nhập hàng</p></div>

function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/work-shifts" element={<WorkShifts />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
