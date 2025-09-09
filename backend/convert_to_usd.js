require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  // Convert VND to USD (approximate rate: 1 USD = 24,000 VND)
  const exchangeRate = 24000;
  
  const products = await Product.find({}).select('name price');
  
  for (const product of products) {
    const usdPrice = Math.round((product.price / exchangeRate) * 100) / 100; // Round to 2 decimal places
    await Product.updateOne(
      { _id: product._id },
      { $set: { price: usdPrice } }
    );
    console.log(`Updated ${product.name}: ${product.price} VND -> $${usdPrice} USD`);
  }

  console.log('Price conversion to USD completed!');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
