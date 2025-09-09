# Backend Deployment Guide

## Quick Deploy Options

### 1. Railway (Recommended - Free Tier Available)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy backend
cd backend
railway up
```

Set environment variables in Railway dashboard:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `NODE_ENV`: production

### 2. Render (Free Tier Available)

1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create new Web Service
4. Set:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables

### 3. Heroku

```bash
# Install Heroku CLI
# Login and create app
heroku login
heroku create your-app-name

# Deploy backend only
git subtree push --prefix backend heroku main
```

### 4. Vercel (Serverless Functions)

```bash
# Deploy backend as serverless functions
cd backend
vercel --prod
```

## After Backend Deployment

1. Copy your backend URL (e.g., `https://your-app.railway.app`)
2. Update Vercel environment variables:
   - `VITE_API_URL`: `https://your-app.railway.app/api`
3. Redeploy frontend on Vercel

## Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
NODE_ENV=production
PORT=5000
```

### Frontend (.env.local)
```
VITE_API_URL=https://your-backend-url.com/api
```
