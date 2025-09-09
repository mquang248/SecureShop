# 🚀 SecureShop Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/secure-shop.git
cd secure-shop
```

### 2. Environment Setup
```bash
# Copy environment template
cp env.template .env

# Edit .env with your actual values
# Required: MONGODB_URI, JWT_SECRET
# Optional: AWS, Stripe, Email configs
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 4. Database Setup (Optional)
```bash
# Seed sample data
cd backend
node seedDB.js
node seedCategories.js
node seedSecurityProducts.js
```

### 5. Start Development
```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm run dev:backend  # Backend on :5000
npm run dev:frontend # Frontend on :3000
```

## 🌐 Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
secure-shop/
├── frontend/          # React.js frontend
├── backend/           # Node.js/Express backend
├── nginx/            # Nginx configuration
├── docker-compose.yml # Docker setup
└── README.md         # Project documentation
```

## 🔧 Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Optional
- `AWS_*` - For file uploads to S3
- `STRIPE_*` - For payment processing
- `EMAIL_*` - For notifications and MFA

## 🚨 Security Notes

- Never commit `.env` files
- Use strong JWT secrets
- Enable MFA in production
- Use HTTPS in production

## 📦 Deployment

See `docker-compose.yml` for containerized deployment.

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill processes on port 5000
taskkill /f /im node.exe

# Or change PORT in .env
```

### Database Connection Issues
- Check MONGODB_URI format
- Verify network access to MongoDB Atlas
- Check firewall settings
