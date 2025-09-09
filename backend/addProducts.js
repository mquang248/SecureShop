require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI);

async function addProducts() {
  try {
    console.log('Connected to MongoDB');
    
    // Find existing category and admin user
    const networkCategory = await Category.findOne({ name: 'Network Security' });
    const adminUser = await User.findOne({ role: 'admin' });
    
    console.log('Found category:', networkCategory?.name);
    console.log('Found admin user:', adminUser?.email);
    
    if (!networkCategory || !adminUser) {
      console.log('Missing category or admin user');
      return;
    }
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Add products
    const products = [
      {
        name: 'Advanced Firewall System',
        price: 299.99,
        description: 'Professional-grade firewall with AI threat detection and real-time monitoring capabilities.',
        category: networkCategory._id,
        images: [{ url: '/placeholder-product.jpg', alt: 'Advanced Firewall System', isPrimary: true }],
        featured: true,
        inStock: true,
        sku: 'FW-ADV-001',
        rating: { average: 4.8 },
        createdBy: adminUser._id
      },
      {
        name: 'Enterprise VPN Gateway',
        price: 599.99,
        description: 'Secure VPN gateway for enterprise networks with high-performance encryption.',
        category: networkCategory._id,
        images: [{ url: '/placeholder-product.jpg', alt: 'Enterprise VPN Gateway', isPrimary: true }],
        featured: true,
        inStock: true,
        sku: 'VPN-ENT-002',
        rating: { average: 4.7 },
        createdBy: adminUser._id
      },
      {
        name: 'Intrusion Detection System',
        price: 399.99,
        description: 'Advanced IDS with machine learning capabilities for threat detection.',
        category: networkCategory._id,
        images: [{ url: '/placeholder-product.jpg', alt: 'Intrusion Detection System', isPrimary: true }],
        featured: false,
        inStock: true,
        sku: 'IDS-ML-003',
        rating: { average: 4.6 },
        createdBy: adminUser._id
      },
      {
        name: 'Endpoint Protection Suite',
        price: 149.99,
        description: 'Comprehensive endpoint security solution with anti-malware and behavioral analysis.',
        category: networkCategory._id,
        images: [{ url: '/placeholder-product.jpg', alt: 'Endpoint Protection Suite', isPrimary: true }],
        featured: true,
        inStock: true,
        sku: 'EPS-COMP-004',
        rating: { average: 4.5 },
        createdBy: adminUser._id
      },
      {
        name: 'Data Encryption Tool',
        price: 199.99,
        description: 'Military-grade encryption for sensitive data with advanced key management.',
        category: networkCategory._id,
        images: [{ url: '/placeholder-product.jpg', alt: 'Data Encryption Tool', isPrimary: true }],
        featured: false,
        inStock: true,
        sku: 'DET-MIL-005',
        rating: { average: 4.9 },
        createdBy: adminUser._id
      }
    ];
    
    const insertedProducts = await Product.insertMany(products);
    console.log(`Added ${insertedProducts.length} products`);
    
    // Summary
    const totalProducts = await Product.countDocuments();
    const featuredProducts = await Product.countDocuments({ featured: true });
    
    console.log('\n=== Summary ===');
    console.log(`Total Products: ${totalProducts}`);
    console.log(`Featured Products: ${featuredProducts}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

addProducts();
