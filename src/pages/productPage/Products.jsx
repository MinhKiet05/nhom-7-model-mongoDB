import React, { useState } from 'react'

const Products = () => {
  const [products] = useState([
    { id: 1, name: 'iPhone 15 Pro', price: '29,990,000₫', stock: 15, category: 'Điện thoại' },
    { id: 2, name: 'Samsung Galaxy S24', price: '22,990,000₫', stock: 23, category: 'Điện thoại' },
    { id: 3, name: 'MacBook Air M2', price: '34,990,000₫', stock: 8, category: 'Laptop' },
    { id: 4, name: 'Dell XPS 13', price: '28,990,000₫', stock: 12, category: 'Laptop' },
    { id: 5, name: 'AirPods Pro', price: '6,490,000₫', stock: 45, category: 'Phụ kiện' },
  ])

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Quản lý sản phẩm</h1>
        <button className="btn-primary">Thêm sản phẩm mới</button>
      </div>

      <div className="products-filter">
        <input type="text" placeholder="Tìm kiếm sản phẩm..." className="search-input" />
        <select className="filter-select">
          <option value="">Tất cả danh mục</option>
          <option value="phone">Điện thoại</option>
          <option value="laptop">Laptop</option>
          <option value="accessory">Phụ kiện</option>
        </select>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Danh mục</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                  <span className={`stock ${product.stock < 10 ? 'low' : 'normal'}`}>
                    {product.stock}
                  </span>
                </td>
                <td>{product.category}</td>
                <td>
                  <button className="btn-edit">Sửa</button>
                  <button className="btn-delete">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Products