require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  const products = await Product.find().limit(10).select('name price salePrice comparePrice').lean();
  console.log('Products:');
  products.forEach(product => {
    console.log(`- ${product.name}: $${product.price} (Compare: $${product.comparePrice || 'N/A'})`);
  });
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
