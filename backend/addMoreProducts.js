const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function addMoreTestProducts() {
  try {
    console.log('🔄 Adding more test products...');
    
    // Get categories
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    
    // Get an admin user for createdBy (create a dummy one if needed)
    let adminUser;
    try {
      const User = require('./models/User');
      adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        // Create a dummy admin for system products
        adminUser = await User.create({
          firstName: 'System',
          lastName: 'Admin',
          email: 'system@secureshop.com',
          password: 'SystemAdmin123!',
          role: 'admin',
          isVerified: true
        });
      }
    } catch (error) {
      console.log('Using fallback admin ID');
      adminUser = { _id: new mongoose.Types.ObjectId() };
    }
    
    const additionalProducts = [
      {
        name: 'SecureWifi Manager Pro',
        description: 'Advanced wireless network security management system with enterprise-grade encryption and monitoring capabilities.',
        shortDescription: 'Enterprise wireless security management',
        price: 299.99,
        comparePrice: 399.99,
        sku: 'SWM-PRO-001',
        category: categoryMap['Network Security'],
        status: 'active',
        featured: true,
        inventory: {
          quantity: 25,
          lowStockThreshold: 5
        },
        rating: {
          average: 4.8,
          count: 34
        },
        tags: ['wifi', 'wireless', 'network', 'enterprise'],
        createdBy: adminUser._id
      },
      {
        name: 'DataGuard Backup Shield',
        description: 'Comprehensive data backup and recovery solution with advanced encryption and cloud sync capabilities.',
        shortDescription: 'Enterprise data backup solution',
        price: 149.99,
        comparePrice: 199.99,
        sku: 'DGS-001',
        category: categoryMap['Data Protection'],
        status: 'active',
        featured: false,
        inventory: {
          quantity: 40,
          lowStockThreshold: 5
        },
        rating: {
          average: 4.5,
          count: 28
        },
        tags: ['backup', 'data', 'recovery', 'cloud'],
        createdBy: adminUser._id
      },
      {
        name: 'ThreatHunter AI Platform',
        description: 'Advanced AI-powered threat detection and response system for enterprise environments.',
        shortDescription: 'AI threat detection platform',
        price: 899.99,
        comparePrice: 1199.99,
        sku: 'THA-PLT-001',
        category: categoryMap['Threat Intelligence'],
        status: 'active',
        featured: true,
        inventory: {
          quantity: 15,
          lowStockThreshold: 3
        },
        rating: {
          average: 4.9,
          count: 42
        },
        tags: ['ai', 'threat', 'detection', 'enterprise'],
        createdBy: adminUser._id
      },
      {
        name: 'MobileSecure Endpoint Agent',
        description: 'Comprehensive mobile device security solution for BYOD environments.',
        shortDescription: 'Mobile endpoint security',
        price: 79.99,
        comparePrice: 99.99,
        sku: 'MSE-AGT-001',
        category: categoryMap['Endpoint Protection'],
        status: 'active',
        featured: false,
        inventory: {
          quantity: 60,
          lowStockThreshold: 10
        },
        rating: {
          average: 4.3,
          count: 55
        },
        tags: ['mobile', 'endpoint', 'byod', 'device'],
        createdBy: adminUser._id
      },
      {
        name: 'CloudAccess Identity Hub',
        description: 'Centralized identity and access management for cloud and hybrid environments.',
        shortDescription: 'Cloud identity management',
        price: 199.99,
        sku: 'CAI-HUB-001',
        category: categoryMap['Identity Management'],
        status: 'active',
        featured: false,
        inventory: {
          quantity: 30,
          lowStockThreshold: 5
        },
        rating: {
          average: 4.6,
          count: 37
        },
        tags: ['cloud', 'identity', 'access', 'sso'],
        createdBy: adminUser._id
      },
      {
        name: 'SecureCloud Gateway',
        description: 'Advanced cloud security gateway with DLP, CASB, and threat protection capabilities.',
        shortDescription: 'Cloud security gateway',
        price: 599.99,
        comparePrice: 799.99,
        sku: 'SCG-001',
        category: categoryMap['Cloud Security'],
        status: 'active',
        featured: true,
        inventory: {
          quantity: 20,
          lowStockThreshold: 3
        },
        rating: {
          average: 4.7,
          count: 29
        },
        tags: ['cloud', 'gateway', 'dlp', 'casb'],
        createdBy: adminUser._id
      }
    ];

    // Insert new products
    const createdProducts = await Product.insertMany(additionalProducts);
    console.log(`✅ Created ${createdProducts.length} additional products`);
    
    // Display created products
    createdProducts.forEach(product => {
      console.log(`   - ${product.name} ($${product.price})`);
    });

    console.log('🎉 Additional products created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating additional products:', error);
    process.exit(1);
  }
}

addMoreTestProducts();
