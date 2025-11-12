// src/components/layout/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css'; // File CSS để tạo kiểu

// Import icons từ react-icons
import {
  LuUsers, LuClock, LuShoppingCart, LuTag, LuPackage,
  LuArchive, LuTrendingUp, LuDollarSign, LuUndo,
  LuTruck, LuClipboardList
} from "react-icons/lu";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* Logo nhóm 7 */}
        <h2 className="logo">NHÓM 7</h2>
        <p className="subtitle">Hệ thống quản lý bán hàng cửa hàng tiện lợi</p>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-title">QUẢN LÝ</p>
        <ul>
          <li>
            <NavLink to="/sell">
              <LuClipboardList />
              <span>Sell (Bán hàng)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/customers">
              <LuShoppingCart />
              <span>Customers (Khách hàng)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/inventory">
              <LuArchive />
              <span>Inventory (Tồn kho)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/price">
              <LuClipboardList />
              <span>Price (Giá cả)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/products">
              <LuPackage />
              <span>Products (Sản phẩm)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/promotions">
              <LuTag />
              <span>Promotions (Khuyến mãi)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/purchase-orders">
              <LuClipboardList />
              <span>Purchase Orders (Phiếu nhập hàng)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports">
              <LuTrendingUp />
              <span>Reports (Báo cáo - Thống kê)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/returns">
              <LuUndo />
              <span>Returns (Đổi/Trả)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/sales">
              <LuDollarSign />
              <span>Sales (Hóa đơn bán hàng)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/suppliers">
              <LuTruck />
              <span>Suppliers (Nhà cung cấp)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/users">
              <LuUsers />
              <span>Users (Nhân viên)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/VAT">
              <LuClipboardList />
              <span>VAT (Thuế GTGT)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/work-shifts">
              <LuClock />
              <span>Work Shifts (Ca làm việc)</span>
            </NavLink>
          </li>
        </ul>
      </nav>

    </aside>
  );
};

export default Sidebar;