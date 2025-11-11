# Production Deployment Fixes

## Problem: "Failed to fetch" on Vercel deployment

### Root Cause:
1. Backend CORS doesn't allow Vercel domain
2. Environment variables not properly set on Vercel

### Solution:

#### 1. Update Backend CORS (✅ Done)
Added Vercel domains to CORS origin list in `server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.FRONTEND_URL,
    'https://nhom-7-model-mongodb.vercel.app',
    'https://nhom-7-model-mongodb-git-main-minhkiet05s-projects.vercel.app',
    /\.vercel\.app$/
  ].filter(Boolean),
  credentials: true
}));
```

#### 2. Redeploy Backend
Push updated code to GitHub to trigger Render redeploy:

```bash
git add .
git commit -m "Fix CORS for Vercel deployment"
git push origin main
```

#### 3. Set Vercel Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://nhom-7-model-mongodb.onrender.com/api` |

#### 4. Redeploy Vercel
After setting env vars, redeploy Vercel frontend.

### Testing:
1. Check backend: https://nhom-7-model-mongodb.onrender.com/api/health
2. Check frontend: https://your-vercel-app.vercel.app
3. Check browser Network tab for CORS errors

### Common Issues:
- **CORS Error**: Backend needs Vercel domain in origin list
- **404/DNS Error**: Backend URL incorrect in environment variables
- **Certificate Error**: Backend not serving HTTPS properly