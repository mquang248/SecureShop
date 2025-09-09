const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Products routes
app.get('/api/products', (req, res) => {
  // Mock products data
  const products = [
    {
      id: 1,
      name: "Advanced Firewall System",
      price: 299.99,
      description: "Professional-grade firewall with AI threat detection",
      category: "Network Security",
      image: "/placeholder-product.jpg",
      featured: true,
      features: ["AI-powered threat detection", "Real-time monitoring", "Cloud integration"],
      specifications: {
        "Throughput": "10 Gbps",
        "Supported Protocols": "HTTP/HTTPS, FTP, SSH",
        "Operating System": "Linux-based"
      }
    },
    {
      id: 2,
      name: "Enterprise VPN Gateway",
      price: 599.99,
      description: "Secure VPN gateway for enterprise networks",
      category: "Network Security",
      image: "/placeholder-product.jpg",
      featured: true,
      features: ["Site-to-site VPN", "Remote access VPN", "Multi-protocol support"],
      specifications: {
        "Concurrent Users": "500",
        "Encryption": "AES-256",
        "Protocols": "IPSec, SSL/TLS"
      }
    }
  ];
  
  res.json(products);
});

app.get('/api/products/featured', (req, res) => {
  const featuredProducts = [
    {
      id: 1,
      name: "Advanced Firewall System",
      price: 299.99,
      description: "Professional-grade firewall with AI threat detection",
      category: "Network Security",
      image: "/placeholder-product.jpg",
      featured: true
    },
    {
      id: 2,
      name: "Enterprise VPN Gateway", 
      price: 599.99,
      description: "Secure VPN gateway for enterprise networks",
      category: "Network Security",
      image: "/placeholder-product.jpg",
      featured: true
    }
  ];
  
  res.json(featuredProducts);
});

app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  
  // Mock product detail
  const product = {
    id: productId,
    name: `Security Product ${productId}`,
    price: 299.99 + (productId * 50),
    description: `Professional security solution ${productId}`,
    category: "Network Security",
    image: "/placeholder-product.jpg",
    features: [
      "Advanced threat protection",
      "Real-time monitoring",
      "Cloud integration",
      "24/7 support"
    ],
    specifications: {
      "Model": `SP-${productId}00`,
      "Throughput": "10 Gbps",
      "Supported Protocols": "HTTP/HTTPS, FTP, SSH",
      "Operating System": "Linux-based",
      "Memory": "8GB RAM",
      "Storage": "256GB SSD"
    }
  };
  
  res.json(product);
});

// Categories route
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 1, name: "Network Security", description: "Firewalls, VPNs, and network protection" },
    { id: 2, name: "Endpoint Security", description: "Antivirus, EDR, and device protection" },
    { id: 3, name: "Cloud Security", description: "Cloud-native security solutions" },
    { id: 4, name: "Identity & Access", description: "IAM and authentication solutions" }
  ];
  
  res.json(categories);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
