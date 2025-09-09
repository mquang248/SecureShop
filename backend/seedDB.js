require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:nMGa1Bz9w9kVV0Nc@cluster0.6rqit.mongodb.net/secure_shop?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schemas
const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  image: String,
  featured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  sku: String,
  rating: Number,
  reviewCount: Number,
  createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

async function seedDatabase() {
  try {
    console.log('Connected to MongoDB');
    
    // Drop collections to remove indexes
    try {
      await mongoose.connection.db.collection('categories').drop();
      await mongoose.connection.db.collection('products').drop();
      console.log('Dropped collections');
    } catch (error) {
      console.log('Collections may not exist, continuing...');
    }

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Network Security',
        description: 'Advanced network security solutions',
        slug: 'network-security'
      },
      {
        name: 'Endpoint Security',
        description: 'Comprehensive endpoint protection',
        slug: 'endpoint-security'
      },
      {
        name: 'Data Protection',
        description: 'Data encryption and protection tools',
        slug: 'data-protection'
      },
      {
        name: 'Identity Management',
        description: 'Identity and access management solutions',
        slug: 'identity-management'
      }
    ]);
    console.log('Created categories:', categories.length);

    // Create products
    const products = await Product.insertMany([
      {
        name: 'Advanced Firewall System',
        price: 299.99,
        description: 'Professional-grade firewall with AI threat detection and real-time monitoring capabilities.',
        category: categories[0]._id,
        image: '/placeholder-product.jpg',
        featured: true,
        inStock: true,
        sku: 'FW-ADV-001',
        rating: 4.8,
        reviewCount: 124
      },
      {
        name: 'Enterprise VPN Gateway',
        price: 599.99,
        description: 'Secure VPN gateway for enterprise networks with high-performance encryption.',
        category: categories[0]._id,
        image: '/placeholder-product.jpg',
        featured: true,
        inStock: true,
        sku: 'VPN-ENT-002',
        rating: 4.7,
        reviewCount: 89
      },
      {
        name: 'Intrusion Detection System',
        price: 399.99,
        description: 'Advanced IDS with machine learning capabilities for threat detection.',
        category: categories[0]._id,
        image: '/placeholder-product.jpg',
        featured: false,
        inStock: true,
        sku: 'IDS-ML-003',
        rating: 4.6,
        reviewCount: 67
      },
      {
        name: 'Endpoint Protection Suite',
        price: 149.99,
        description: 'Comprehensive endpoint security solution with anti-malware and behavioral analysis.',
        category: categories[1]._id,
        image: '/placeholder-product.jpg',
        featured: true,
        inStock: true,
        sku: 'EPS-COMP-004',
        rating: 4.5,
        reviewCount: 203
      },
      {
        name: 'Data Encryption Tool',
        price: 199.99,
        description: 'Military-grade encryption for sensitive data with advanced key management.',
        category: categories[2]._id,
        image: '/placeholder-product.jpg',
        featured: false,
        inStock: true,
        sku: 'DET-MIL-005',
        rating: 4.9,
        reviewCount: 156
      },
      {
        name: 'Identity Access Manager',
        price: 449.99,
        description: 'Complete identity and access management solution with SSO capabilities.',
        category: categories[3]._id,
        image: '/placeholder-product.jpg',
        featured: true,
        inStock: true,
        sku: 'IAM-SSO-006',
        rating: 4.7,
        reviewCount: 92
      },
      {
        name: 'Security Monitoring Dashboard',
        price: 349.99,
        description: 'Real-time security monitoring and analytics dashboard for enterprise environments.',
        category: categories[0]._id,
        image: '/placeholder-product.jpg',
        featured: false,
        inStock: true,
        sku: 'SMD-RT-007',
        rating: 4.4,
        reviewCount: 78
      },
      {
        name: 'Mobile Device Security',
        price: 89.99,
        description: 'Complete mobile device management and security solution.',
        category: categories[1]._id,
        image: '/placeholder-product.jpg',
        featured: false,
        inStock: true,
        sku: 'MDS-MDM-008',
        rating: 4.3,
        reviewCount: 134
      }
    ]);
    
    console.log('Created products:', products.length);
    console.log('Database seeded successfully!');
    
    // Display summary
    const totalCategories = await Category.countDocuments();
    const totalProducts = await Product.countDocuments();
    const featuredProducts = await Product.countDocuments({ featured: true });
    
    console.log('\n=== Database Summary ===');
    console.log(`Total Categories: ${totalCategories}`);
    console.log(`Total Products: ${totalProducts}`);
    console.log(`Featured Products: ${featuredProducts}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
