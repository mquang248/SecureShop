// Simple test for API connection
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: 'Vercel Function'
  });
});

// Products test endpoint (mock data for testing)
app.get('/api/products/featured', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: '1',
        name: 'Test Product 1',
        price: 99.99,
        description: 'This is a test product',
        images: [{ url: '/placeholder-product.jpg', isPrimary: true }],
        featured: true
      },
      {
        _id: '2', 
        name: 'Test Product 2',
        price: 149.99,
        description: 'This is another test product',
        images: [{ url: '/placeholder-product.jpg', isPrimary: true }],
        featured: true
      }
    ]
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: {
      products: [
        {
          _id: '1',
          name: 'Test Product 1',
          price: 99.99,
          description: 'This is a test product',
          images: [{ url: '/placeholder-product.jpg', isPrimary: true }],
          featured: true
        },
        {
          _id: '2',
          name: 'Test Product 2', 
          price: 149.99,
          description: 'This is another test product',
          images: [{ url: '/placeholder-product.jpg', isPrimary: true }],
          featured: true
        }
      ],
      pagination: {
        totalPages: 1,
        currentPage: 1,
        totalProducts: 2
      }
    }
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: ['/api/test', '/api/products', '/api/products/featured']
  });
});

module.exports = app;
