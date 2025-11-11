# Nhóm 7 Model MongoDB - Cửa Hàng Tiện Lợi

## 📋 Mô tả Project
Hệ thống quản lý cửa hàng tiện lợi với React frontend và Express.js backend, sử dụng MongoDB Atlas.

## 🏗️ Cấu trúc Project
```
├── BE/                 # Backend (Express.js + MongoDB)
│   ├── config/         # Database configuration
│   ├── controllers/    # API controllers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   └── server.js       # Main server file
├── FE/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   └── services/   # API services
│   └── package.json
└── DEPLOYMENT.md       # Deployment guide
```

## 🚀 Chạy Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### Backend Setup
```bash
cd BE
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
npm start
```

### Frontend Setup  
```bash
cd FE
npm install
cp .env.example .env.local
# Edit .env.local if needed
npm run dev
```

## 🌐 Production Deployment

Xem hướng dẫn chi tiết trong [DEPLOYMENT.md](./DEPLOYMENT.md)

### Recommended Stack:
- **Frontend**: Vercel
- **Backend**: Render/Railway  
- **Database**: MongoDB Atlas

### Environment Variables:

**Backend (.env):**
```
MONGODB_URI=mongodb+srv://your-connection-string
NODE_ENV=production
PORT=5000
```

**Frontend (.env.local):**
```
VITE_API_URL=https://your-backend-url/api
```

## 📦 Features

### Backend APIs:
- ✅ Customers management
- ✅ Products management  
- ✅ Suppliers management
- ✅ Sales tracking
- ✅ Inventory management
- ✅ Reports generation
- ✅ User management
- ✅ Purchase orders
- ✅ Returns management
- ✅ Promotions

### Frontend Pages:
- 🏠 Dashboard
- 👥 Customers
- 📦 Products
- 🏪 Suppliers  
- 💰 Sales
- 📊 Inventory
- 📈 Reports
- 👤 Users
- 📋 Purchase Orders
- ↩️ Returns  
- 🎯 Promotions

## 🔧 Tech Stack

**Backend:**
- Express.js
- MongoDB + Mongoose
- CORS, Helmet, Morgan
- dotenv

**Frontend:**  
- React 18
- Vite
- CSS Modules
- Fetch API

## 📱 API Endpoints

Base URL: `http://localhost:5000/api` (local) or `https://your-backend.com/api`

```
GET    /api/health         # Health check
GET    /api/customers      # Get all customers
GET    /api/products       # Get all products  
GET    /api/suppliers      # Get all suppliers
GET    /api/sales          # Get all sales
GET    /api/inventory      # Get inventory
GET    /api/reports        # Get reports
GET    /api/users          # Get users
GET    /api/purchaseorders # Get purchase orders
GET    /api/returns        # Get returns
GET    /api/promotions     # Get promotions
```

## 🛠️ Development

### Adding New Features:
1. Backend: Add route in `BE/routes/`, controller in `BE/controllers/`, model in `BE/models/`
2. Frontend: Add service in `FE/src/services/`, component in `FE/src/pages/`
3. Update navigation in `FE/src/components/layout/`

### Code Style:
- Use ES6+ features
- Async/await for promises  
- Error handling with try/catch
- Consistent naming conventions

## 🚨 Troubleshooting

### Common Issues:
- **CORS Error**: Check backend CORS configuration and frontend API URL
- **Database Connection**: Verify MongoDB Atlas connection string and IP whitelist
- **Build Error**: Check Node.js version compatibility and dependencies

### Debug Tools:
```bash
# Check backend health
curl http://localhost:5000/api/health

# View backend logs  
cd BE && npm start

# Build frontend
cd FE && npm run build
```

## 📄 License
MIT License

## 👥 Team
Nhóm 7 - Model MongoDB