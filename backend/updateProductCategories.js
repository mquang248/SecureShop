const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function updateProductCategories() {
  try {
    console.log('🔄 Starting product category updates...');
    
    // Get all categories
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    
    console.log('📂 Available categories:', Object.keys(categoryMap));
    
    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products to update`);
    
    // Category assignments based on product names
    const categoryAssignments = {
      'ShieldLock X1': 'Network Security',
      'VaultPass Pro': 'Identity Management', 
      'QuantumVPN Cube': 'Network Security',
      'BioKey Ultra': 'Identity Management',
      'SafeComm Headset': 'Endpoint Protection',
      'CyberEye Monitor': 'Threat Intelligence',
      'DarkTrace Mini': 'Threat Intelligence',
      'CryptoVault Stick': 'Data Protection',
      'PhishBlocker Pro': 'Endpoint Protection',
      'SafeCall Shield': 'Endpoint Protection',
      'ZeroTrace Drive': 'Data Protection',
      'Guardian Watch': 'Cloud Security'
    };
    
    let updatedCount = 0;
    
    for (const product of products) {
      const categoryName = categoryAssignments[product.name];
      if (categoryName && categoryMap[categoryName]) {
        await Product.findByIdAndUpdate(product._id, {
          category: categoryMap[categoryName]
        });
        console.log(`✅ Updated "${product.name}" -> ${categoryName}`);
        updatedCount++;
      } else {
        // Default to Network Security if no specific assignment
        await Product.findByIdAndUpdate(product._id, {
          category: categoryMap['Network Security']
        });
        console.log(`🔧 Updated "${product.name}" -> Network Security (default)`);
        updatedCount++;
      }
    }
    
    console.log(`🎉 Successfully updated ${updatedCount} products with categories!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating product categories:', error);
    process.exit(1);
  }
}

updateProductCategories();
