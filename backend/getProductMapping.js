const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const products = await Product.find({})
      .select('_id name')
      .sort({createdAt: 1});
    
    console.log('Product ID Mapping:');
    console.log('===================');
    
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}: "${product.name}" -> ID: ${product._id}`);
    });
    
    console.log('\n\nMapping Object:');
    console.log('===============');
    const mapping = {};
    products.forEach((product, index) => {
      mapping[product._id.toString()] = index + 1;
    });
    
    console.log(JSON.stringify(mapping, null, 2));
    
    process.exit();
  })
  .catch(console.error);
