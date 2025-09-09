# Environment Variables for Vercel Deployment

Copy these environment variables to your Vercel dashboard:

## Production Environment Variables

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/secureshop_prod?retryWrites=true&w=majority

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-production-key-min-32-characters
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend API URL (Your Vercel app URL)
VITE_API_URL=https://your-app-name.vercel.app/api

# AWS Configuration (Optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=sk_live_your-live-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Security Configuration
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecureProductionPassword123!
```

## How to Add Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable above with your actual values
5. Make sure to select "Production", "Preview", and "Development" for each variable
