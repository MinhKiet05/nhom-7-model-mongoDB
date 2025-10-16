import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/sidebar/sidebar'
import Dashboard from './pages/dashboardPage/Dashboard'
import Products from './pages/productPage/Products'
import Customers from './pages/customersPage/Customers'
import Workshifts from './pages/workshits/Workshits'
import Sales from './pages/sales/Sales'
import Returns from './pages/returns/Returns'
import './App.css'

// Import các page components khác (tạm thời tạo các component đơn giản)
const Users = () => <div className="page-content"><h1>Users</h1><p>Quản lý nhân viên & người dùng</p></div>
const Promotions = () => <div className="page-content"><h1>Promotions</h1><p>Quản lý khuyến mãi</p></div>
const Inventory = () => <div className="page-content"><h1>Inventory</h1><p>Quản lý tồn kho</p></div>
const Reports = () => <div className="page-content"><h1>Reports</h1><p>Báo cáo - Thống kê</p></div>
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
          <Route path="/work-shifts" element={<Workshifts />} />
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
