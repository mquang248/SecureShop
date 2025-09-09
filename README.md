# 🔒 SecureShop - Enterprise E-Commerce Platform

> **Secure Shopping, Powered by Cloud**

A modern, enterprise-grade e-commerce platform built with security-first principles, cloud-native architecture, and cutting-edge technology stack.

![SecureShop Banner](https://via.placeholder.com/1200x400/0A2540/FFFFFF?text=SecureShop+-+Secure+Shopping%2C+Powered+by+Cloud)

## 🌟 Features

### 🔐 Security First
- **Enterprise-grade authentication** with JWT and MFA/2FA
- **Role-based access control** (User/Admin)
- **Real-time fraud detection** with AI-powered monitoring
- **End-to-end encryption** (256-bit SSL/TLS)
- **PCI DSS Level 1 compliance**
- **OWASP security best practices**
- **XSS/SQL injection protection**
- **Rate limiting and DDoS protection**

### ☁️ Cloud-Native Architecture
- **AWS infrastructure** with auto-scaling
- **S3 for secure file storage** with CloudFront CDN
- **MongoDB Atlas** for database
- **Load balancer** for high availability
- **Container-ready** with Docker
- **99.9% uptime guarantee**
- **Global edge computing**

### 🛒 E-Commerce Features
- **Product catalog** with advanced search and filtering
- **Shopping cart** with real-time updates
- **Secure checkout** with multiple payment options
- **Order management** with tracking and history
- **Admin dashboard** with analytics
- **Inventory management** with low-stock alerts
- **Review and rating system**
- **Coupon and discount system**

### 💳 Payment Integration
- **Stripe** for credit/debit cards
- **PayPal** support
- **MoMo Wallet** (Vietnam)
- **ZaloPay** (Vietnam)
- **Real-time payment processing**
- **Refund management**
- **Fraud detection**

### 📱 Modern UI/UX
- **Responsive design** for all devices
- **TailwindCSS** for styling
- **shadcn/ui** components
- **Accessibility compliant** (WCAG 2.1)
- **Progressive Web App** ready
- **Dark mode support**

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CloudFront CDN                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 Load Balancer                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
┌─────────▼─────────┐    ┌─────────▼─────────┐
│   Frontend App    │    │   Backend API     │
│   (React + Nginx) │    │   (Node.js)      │
└─────────┬─────────┘    └─────────┬─────────┘
          │                        │
          └────────┬─────────────────┘
                   │
    ┌──────────────▼──────────────┐
    │        MongoDB Atlas        │
    │      (Cloud Database)       │
    └─────────────────────────────┘

External Services:
├── AWS S3 (File Storage)
├── Stripe (Payments)
├── SendGrid/SES (Email)
└── CloudWatch (Monitoring)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- MongoDB Atlas account
- AWS account (for S3 and CloudFront)
- Stripe account

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/secureshop.git
cd secureshop
```

### 2. Environment Setup

#### Backend Configuration
```bash
cd backend
cp config/env.example .env
```

Edit `.env` with your configuration:
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secureshop

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=secureshop-assets

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

#### Frontend Configuration
```bash
cd frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
echo "VITE_STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key" >> .env
```

### 3. Development Setup

#### Option A: Local Development
```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api/docs

#### Option B: Docker Development
```bash
# Copy environment variables
cp backend/config/env.example backend/.env
cp frontend/.env.example frontend/.env

# Start with Docker Compose
docker-compose up --build
```

### 4. Production Deployment

#### Docker Production
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up --build -d
```

#### AWS EC2 Deployment
```bash
# 1. Launch EC2 instance (t3.medium or larger)
# 2. Install Docker and Docker Compose
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo usermod -a -G docker ec2-user

# 3. Deploy application
git clone https://github.com/your-org/secureshop.git
cd secureshop
sudo docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Project Structure

```
secureshop/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts (Auth, Cart, etc.)
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS and styling
│   ├── public/             # Static assets
│   └── Dockerfile          # Frontend container
├── backend/                 # Node.js backend
│   ├── routes/             # API route handlers
│   ├── models/             # MongoDB models
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── Dockerfile          # Backend container
├── nginx/                  # Nginx reverse proxy
│   ├── nginx.conf          # Main nginx config
│   ├── default.conf        # Site configuration
│   └── Dockerfile          # Nginx container
├── docker-compose.yml      # Development compose
├── docker-compose.prod.yml # Production compose
└── README.md               # This file
```

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Multi-factor authentication (TOTP)
- Password strength enforcement
- Account lockout protection
- Session management

### Data Protection
- End-to-end encryption (TLS 1.3)
- Data encryption at rest
- PII data anonymization
- GDPR compliance features
- Secure password storage (bcrypt)

### API Security
- Rate limiting (Express Rate Limit)
- Input validation and sanitization
- CORS protection
- CSRF protection
- XSS protection
- SQL injection prevention

### Infrastructure Security
- WAF (Web Application Firewall)
- DDoS protection
- Network segmentation
- Security headers
- Audit logging
- Vulnerability scanning

## 💳 Payment Processing

### Supported Payment Methods
- **Credit/Debit Cards** (Visa, MasterCard, Amex)
- **PayPal** (Express Checkout)
- **Digital Wallets** (Apple Pay, Google Pay)
- **Regional Options** (MoMo, ZaloPay for Vietnam)

### Security Compliance
- PCI DSS Level 1 certified
- Strong Customer Authentication (SCA)
- 3D Secure 2.0 support
- Fraud detection and prevention
- Secure tokenization

### Payment Flow
1. Customer selects items and proceeds to checkout
2. Payment method selection and details entry
3. Fraud detection analysis
4. Payment processing via Stripe/PayPal
5. Order confirmation and email receipt
6. Webhook handling for payment updates

## 🛠️ Technology Stack

### Frontend
- **React.js 18** - Modern UI library
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - High-quality components
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Axios** - HTTP client

### Backend
- **Node.js 18** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting
- **Multer** - File upload handling

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Reverse proxy and load balancer
- **AWS EC2** - Compute instances
- **AWS S3** - Object storage
- **AWS CloudFront** - CDN
- **MongoDB Atlas** - Managed database
- **Let's Encrypt** - SSL certificates

### DevOps & Monitoring
- **Docker Compose** - Multi-container apps
- **GitHub Actions** - CI/CD pipeline
- **AWS CloudWatch** - Monitoring and logging
- **Sentry** - Error tracking
- **New Relic** - Application monitoring

## 📊 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register        # User registration
POST /api/auth/login           # User login
POST /api/auth/logout          # User logout
POST /api/auth/refresh         # Refresh token
POST /api/auth/forgot-password # Password reset request
POST /api/auth/reset-password  # Password reset
POST /api/auth/setup-mfa       # Setup MFA
POST /api/auth/verify-mfa      # Verify MFA
GET  /api/auth/me              # Get current user
```

### Product Endpoints
```http
GET    /api/products           # Get all products
GET    /api/products/:id       # Get product by ID
POST   /api/products           # Create product (Admin)
PUT    /api/products/:id       # Update product (Admin)
DELETE /api/products/:id       # Delete product (Admin)
GET    /api/products/featured  # Get featured products
POST   /api/products/:id/reviews # Add product review
```

### Cart & Orders
```http
GET    /api/cart               # Get user cart
POST   /api/cart/items         # Add item to cart
PUT    /api/cart/items/:id     # Update cart item
DELETE /api/cart/items/:id     # Remove cart item
POST   /api/orders             # Create order
GET    /api/orders             # Get user orders
GET    /api/orders/:id         # Get order details
```

### Payment Endpoints
```http
POST /api/payment/create-intent # Create payment intent
POST /api/payment/confirm       # Confirm payment
POST /api/payment/refund        # Process refund
POST /api/payment/webhook       # Stripe webhook
GET  /api/payment/methods       # Get payment methods
```

## 🚀 Deployment Guide

### Vercel Deployment (Frontend Only)

Deploy the frontend to Vercel for fast, global CDN distribution:

#### 1. Prerequisites
- Vercel account
- GitHub repository
- Backend API deployed separately (AWS, Railway, etc.)

#### 2. Quick Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod
```

#### 3. Environment Variables
Set these environment variables in Vercel dashboard:
```
VITE_API_URL=https://your-backend-api.com/api
VITE_APP_ENV=production
```

#### 4. Custom Domain (Optional)
```bash
# Add custom domain
vercel domains add yourdomain.com
vercel alias your-deployment-url.vercel.app yourdomain.com
```

### AWS EC2 Deployment

#### 1. Infrastructure Setup
```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-12345678 \
  --subnet-id subnet-12345678
```

#### 2. Security Groups
```bash
# Allow HTTP, HTTPS, and SSH
aws ec2 authorize-security-group-ingress \
  --group-id sg-12345678 \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-12345678 \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

#### 3. Load Balancer Setup
```bash
# Create Application Load Balancer
aws elbv2 create-load-balancer \
  --name secureshop-alb \
  --subnets subnet-12345678 subnet-87654321 \
  --security-groups sg-12345678
```

#### 4. Auto Scaling Configuration
```bash
# Create launch template
aws ec2 create-launch-template \
  --launch-template-name secureshop-template \
  --launch-template-data file://launch-template.json

# Create auto scaling group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name secureshop-asg \
  --launch-template LaunchTemplateName=secureshop-template \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2
```

### S3 and CloudFront Setup

#### 1. S3 Bucket Creation
```bash
# Create S3 bucket for assets
aws s3 mb s3://secureshop-assets

# Set bucket policy
aws s3api put-bucket-policy \
  --bucket secureshop-assets \
  --policy file://s3-policy.json
```

#### 2. CloudFront Distribution
```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### Database Setup (MongoDB Atlas)

1. **Create Cluster**
   - Sign up for MongoDB Atlas
   - Create a new cluster
   - Configure network access (whitelist IPs)
   - Create database user

2. **Connection Configuration**
   ```bash
   # Add to backend/.env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secureshop
   ```

### SSL Certificate Setup

#### Using Let's Encrypt
```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📈 Monitoring & Analytics

### Application Monitoring
- **Performance metrics** (response time, throughput)
- **Error tracking** with stack traces
- **User behavior analytics**
- **Conversion funnel analysis**

### Infrastructure Monitoring
- **Server health** (CPU, memory, disk)
- **Database performance** (query time, connections)
- **Network metrics** (bandwidth, latency)
- **Security events** (failed logins, attacks)

### Business Analytics
- **Sales dashboard** with real-time data
- **Customer insights** and segmentation
- **Product performance** analysis
- **Fraud detection** reports

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# AWS Services
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=...

# Payment
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Email
EMAIL_HOST=...
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
ADMIN_ALLOWED_IPS=192.168.1.1,10.0.0.1
```

#### Frontend (.env)
```bash
VITE_API_URL=https://api.secureshop.com/api
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_ENVIRONMENT=production
```

### Nginx Configuration
Key security headers and optimizations are configured in `nginx/default.conf`:
- SSL/TLS configuration
- Security headers (HSTS, CSP, etc.)
- Rate limiting
- Gzip compression
- Proxy settings

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                  # Run all tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests
npm run test:coverage    # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                 # Run tests
npm run test:coverage    # Coverage report
npm run test:e2e         # End-to-end tests
```

### Security Testing
```bash
# OWASP ZAP security scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000

# Dependency vulnerability scan
npm audit
npm audit fix
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation
- Follow semantic commit messages
- Ensure security best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing frontend library
- **Express.js** for the robust backend framework
- **MongoDB** for the flexible database
- **Stripe** for secure payment processing
- **AWS** for cloud infrastructure
- **Open Source Community** for the incredible tools

## 📞 Support

For support and questions:

- **Email**: support@secureshop.com
- **Documentation**: https://docs.secureshop.com
- **Issues**: [GitHub Issues](https://github.com/your-org/secureshop/issues)
- **Security**: security@secureshop.com

---

<div align="center">

**🔒 SecureShop - Where Security Meets Commerce 🛒**

Made with ❤️ by the SecureShop Team

[Website](https://secureshop.com) • [Documentation](https://docs.secureshop.com) • [Support](mailto:support@secureshop.com)

</div>
