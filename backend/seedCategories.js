const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const categories = [
  {
    name: 'Network Security',
    slug: 'network-security',
    description: 'Advanced network security solutions and firewalls',
    isActive: true
  },
  {
    name: 'Endpoint Protection',
    slug: 'endpoint-protection', 
    description: 'Comprehensive endpoint security software and hardware',
    isActive: true
  },
  {
    name: 'Cloud Security',
    slug: 'cloud-security',
    description: 'Cloud-based security solutions and services',
    isActive: true
  },
  {
    name: 'Identity Management',
    slug: 'identity-management',
    description: 'Identity and access management solutions',
    isActive: true
  },
  {
    name: 'Data Protection',
    slug: 'data-protection',
    description: 'Data encryption and backup solutions',
    isActive: true
  },
  {
    name: 'Threat Intelligence',
    slug: 'threat-intelligence',
    description: 'Advanced threat detection and intelligence platforms',
    isActive: true
  }
];

async function seedCategories() {
  try {
    console.log('🌱 Starting category seeding...');
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('📝 Cleared existing categories');
    
    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);
    
    // Display created categories
    createdCategories.forEach(category => {
      console.log(`   - ${category.name} (${category._id})`);
    });

    console.log('🎉 Category seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
