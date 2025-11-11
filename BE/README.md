# Backend - Cửa hàng tiện lợi API

## Cài đặt

```powershell
cd BE
npm install
```

## Cấu hình

Sao chép `.env` và điều chỉnh các biến môi trường:

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=CuaHangTienLoi
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Chạy

### Development
```powershell
npm run dev
```

### Production
```powershell
npm start
```

### Test kết nối MongoDB
```powershell
npm test
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/customers` - Lấy tất cả khách hàng
- `GET /api/customers/:id` - Lấy khách hàng theo ID
- `POST /api/customers` - Tạo khách hàng mới
- `PUT /api/customers/:id` - Cập nhật khách hàng
- `DELETE /api/customers/:id` - Xóa khách hàng (soft delete)

## Cấu trúc thư mục

```
BE/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── customerController.js # Business logic
├── models/
│   ├── index.js            # Export all models
│   ├── Customer.js         # Customer schema
│   ├── Product.js          # Product schema  
│   ├── Inventory.js        # Inventory schema
│   ├── Supplier.js         # Supplier schema
│   ├── User.js             # User schema
│   ├── Promotion.js        # Promotion schema
│   ├── Tax.js              # Tax schema
│   ├── Price.js            # Price schema
│   ├── Sale.js             # Sale schema
│   ├── Return.js           # Return schema
│   ├── PurchaseOrder.js    # Purchase Order schema
│   ├── Report.js           # Report schema
│   └── Workshift.js        # Workshift schema
├── routes/
│   └── customers.js         # API routes
├── scripts/
│   └── test-connection.js   # Test MongoDB connection
├── .env                     # Environment variables
├── server.js                # Main server file
└── package.json
```