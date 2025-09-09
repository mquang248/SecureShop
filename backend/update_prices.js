require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  // Update prices to realistic amounts (multiply by 1000 for VND)
  const updates = [
    { name: 'ShieldLock X1', price: 1500000 }, // 1.5M VND
    { name: 'VaultPass Pro', price: 2800000 }, // 2.8M VND
    { name: 'QuantumVPN Cube', price: 3500000 }, // 3.5M VND
    { name: 'BioKey Ultra', price: 1200000 }, // 1.2M VND
    { name: 'SafeComm Headset', price: 890000 }, // 890K VND
    { name: 'SecureCloud Gateway', price: 4500000 }, // 4.5M VND
    { name: 'MobileSecure Endpoint Agent', price: 650000 }, // 650K VND
  ];

  for (const update of updates) {
    const result = await Product.updateOne(
      { name: update.name },
      { $set: { price: update.price } }
    );
    console.log(`Updated ${update.name}: ${result.modifiedCount} products`);
  }

  console.log('Price update completed!');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
