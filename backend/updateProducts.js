const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('./models/Product');

const updateProducts = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'your-mongo-connection-string';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
    
    console.log('🔧 Updating products to active status...');
    
    // Update all products to active status and set stock
    const result = await Product.updateMany(
      {}, // All products
      { 
        $set: { 
          status: 'active',
          stock: 50 
        } 
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} products`);
    
    // Verify update
    const activeProducts = await Product.find({ status: 'active' }).select('name status stock');
    console.log('\n📦 Active Products:');
    activeProducts.forEach(product => {
      console.log(`   - ${product.name} [${product.status}] (Stock: ${product.stock})`);
    });
    
  } catch (error) {
    console.error('❌ Error updating products:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

updateProducts();
