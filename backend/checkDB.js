const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const checkDatabase = async () => {
  try {
    console.log('🔍 Checking database status...\n');

    // Check users
    const userCount = await User.countDocuments();
    console.log(`👥 Users: ${userCount}`);
    
    if (userCount > 0) {
      const users = await User.find().select('email role firstName lastName').limit(5);
      users.forEach(user => {
        console.log(`   - ${user.firstName} ${user.lastName} (${user.email}) [${user.role}]`);
      });
    }

    // Check categories
    const categoryCount = await Category.countDocuments();
    console.log(`\n📂 Categories: ${categoryCount}`);
    
    if (categoryCount > 0) {
      const categories = await Category.find().select('name slug isActive');
      categories.forEach(category => {
        console.log(`   - ${category.name} (${category.slug}) [${category.isActive ? 'Active' : 'Inactive'}]`);
      });
    }

    // Check products
    const productCount = await Product.countDocuments();
    console.log(`\n📦 Products: ${productCount}`);
    
    if (productCount > 0) {
      const products = await Product.find()
        .populate('category', 'name')
        .select('name price comparePrice stock status')
        .limit(5);
      
      products.forEach(product => {
        const price = product.comparePrice ? `${product.price} (sale from ${product.comparePrice})` : product.price;
        console.log(`   - ${product.name} - ${price}đ (Stock: ${product.stock}) [${product.status || 'Unknown'}]`);
        console.log(`     Category: ${product.category?.name || 'N/A'}`);
      });
    }

    console.log('\n✅ Database check completed!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the checker
connectDB().then(checkDatabase);
