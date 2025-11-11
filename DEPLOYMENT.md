# Deployment Guide

## Project Structure
```
├── BE/ (Backend - Express.js + MongoDB)
├── FE/ (Frontend - React + Vite)
└── README.md
```

## Option 1: Frontend Vercel + Backend Render (Recommended)

### 1. Deploy Backend on Render

1. **Create Render Account**: https://render.com
2. **New Web Service**: Connect your GitHub repo
3. **Settings**:
   - **Name**: `cuahangtienloi-backend`
   - **Root Directory**: `BE`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://thminhkiet05_db_user:rd9dtjKwgmDoiSug@cuahangtienloi.u0az1is.mongodb.net/CuaHangTienLoi
   NODE_ENV=production
   PORT=10000
   ```
5. **Deploy**: Click "Create Web Service"

### 2. Deploy Frontend on Vercel

1. **Create Vercel Account**: https://vercel.com
2. **New Project**: Import from GitHub
3. **Framework**: Vite
4. **Root Directory**: `FE` 
5. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
   (Replace with your actual Render backend URL)
6. **Deploy**: Click "Deploy"

### 3. Update CORS in Backend

After getting Vercel frontend URL, update backend CORS:
```javascript
// In BE/server.js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

## Option 2: All-in-One on Vercel (Advanced)

### 1. Convert Backend to Serverless Functions

Move backend files to `api/` folder structure:
```
├── api/
│   ├── customers.js
│   ├── products.js
│   └── ... (each route as separate file)
├── FE/ (Frontend files)
```

### 2. Vercel Configuration

Create `vercel.json` at root:
```json
{
  "functions": {
    "api/**/*.js": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

## Environment Variables Setup

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend-url/api
```

### Render/Railway (Backend)
```
MONGODB_URI=mongodb+srv://thminhkiet05_db_user:rd9dtjKwgmDoiSug@cuahangtienloi.u0az1is.mongodb.net/CuaHangTienLoi
NODE_ENV=production
PORT=10000
```

## MongoDB Atlas Network Access

Add these IPs to Atlas whitelist:
- **Vercel**: `0.0.0.0/0` (or specific Vercel IPs)
- **Render**: `0.0.0.0/0` (or specific Render IPs)

## Testing Deployment

1. **Backend Health Check**: `https://your-backend.onrender.com/api/health`
2. **Frontend**: `https://your-app.vercel.app`
3. **Data Flow**: Frontend → Backend → MongoDB Atlas

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Update backend CORS origin list
2. **API Connection**: Check VITE_API_URL environment variable
3. **Database Connection**: Verify MongoDB Atlas IP whitelist
4. **Build Errors**: Check Node.js version compatibility

### Debug Commands:
```bash
# Test backend locally
cd BE && npm start

# Test frontend locally  
cd FE && npm run dev

# Build frontend
cd FE && npm run build
```