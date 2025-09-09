require('dotenv').config();
const mongoose = require('mongoose');
const Cart = require('./models/Cart');

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  // Clear all carts to force users to re-add items with new USD prices
  const result = await Cart.deleteMany({});
  console.log(`Cleared ${result.deletedCount} carts`);
  
  console.log('Cart clearing completed! Users will need to re-add items with USD prices.');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
