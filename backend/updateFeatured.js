const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('./models/Product');

const updateFeaturedProducts = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'your-mongo-connection-string';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
    
    console.log('🌟 Updating featured products to show only top 4...');
    
    // First, set all products to not featured
    await Product.updateMany({}, { featured: false });
    
    // Get top 4 products by rating and set them as featured
    const topProducts = await Product.find({ status: 'active' })
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(4);
    
    const topProductIds = topProducts.map(p => p._id);
    
    // Set top 4 products as featured
    await Product.updateMany(
      { _id: { $in: topProductIds } },
      { featured: true }
    );
    
    console.log('✅ Updated featured products:');
    const featuredProducts = await Product.find({ featured: true })
      .select('name rating.average rating.count')
      .sort({ 'rating.average': -1 });
    
    featuredProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product.rating.average}⭐ - ${product.rating.count} reviews)`);
    });
    
  } catch (error) {
    console.error('❌ Error updating featured products:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

updateFeaturedProducts();
