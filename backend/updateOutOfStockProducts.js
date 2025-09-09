const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/secure_shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateOutOfStockProducts = async () => {
  try {
    console.log('🔄 Đang cập nhật sản phẩm out of stock...');

    // Tìm tất cả sản phẩm có inventory.quantity = 0
    const outOfStockProducts = await Product.find({
      'inventory.quantity': 0
    });

    console.log(`📦 Tìm thấy ${outOfStockProducts.length} sản phẩm out of stock.`);

    let updatedCount = 0;

    for (const product of outOfStockProducts) {
      // Tạo giá ngẫu nhiên từ 129-859
      const newPrice = Math.floor(Math.random() * (859 - 129 + 1)) + 129;
      
      // Tạo số lượng tồn kho ngẫu nhiên từ 10-100
      const newQuantity = Math.floor(Math.random() * (100 - 10 + 1)) + 10;

      // Có thể tạo comparePrice cao hơn để có discount
      const hasDiscount = Math.random() > 0.5; // 50% chance có discount
      const comparePrice = hasDiscount ? Math.floor(newPrice * (1.1 + Math.random() * 0.4)) : null; // 10-50% discount

      const updateData = {
        price: newPrice,
        'inventory.quantity': newQuantity,
        'inventory.trackQuantity': true
      };

      if (comparePrice) {
        updateData.comparePrice = comparePrice;
      }

      await Product.updateOne(
        { _id: product._id },
        { $set: updateData }
      );

      console.log(`✅ ${product.name}: $${newPrice} (Quantity: ${newQuantity})`);
      updatedCount++;
    }

    console.log(`\n🎉 Hoàn thành! Đã cập nhật ${updatedCount} sản phẩm.`);

    // Hiển thị danh sách sản phẩm đã cập nhật
    console.log('\n📋 Danh sách sản phẩm với giá và tồn kho mới:');
    const updatedProducts = await Product.find({
      _id: { $in: outOfStockProducts.map(p => p._id) }
    }).select('name price comparePrice inventory.quantity');
    
    updatedProducts.forEach(product => {
      const discount = product.comparePrice ? 
        ` (Was $${product.comparePrice} - ${Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% off)` : '';
      console.log(`   • ${product.name}: $${product.price}${discount} - Stock: ${product.inventory.quantity}`);
    });

  } catch (error) {
    console.error('❌ Lỗi cập nhật sản phẩm:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Đã đóng kết nối database.');
  }
};

updateOutOfStockProducts();
