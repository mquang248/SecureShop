const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/secure_shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fixPricing = async () => {
  try {
    console.log('🔄 Đang cập nhật giá sản phẩm...');

    // Tìm sản phẩm có giá thấp (dưới $10)
    const lowPriceProducts = await Product.find({
      price: { $lt: 10 }
    });

    console.log(`📦 Tìm thấy ${lowPriceProducts.length} sản phẩm có giá thấp.`);

    if (lowPriceProducts.length > 0) {
      // Cập nhật giá sản phẩm
      for (const product of lowPriceProducts) {
        // Tạo giá ngẫu nhiên từ $159 đến $989.99
        const newPrice = Math.floor(Math.random() * (989.99 - 159 + 1)) + 159;
        const roundedPrice = Math.round(newPrice * 100) / 100; // Làm tròn 2 chữ số thập phân
        
        // Tạo comparePrice cao hơn 10-30%
        const comparePrice = Math.round(roundedPrice * (1 + Math.random() * 0.3 + 0.1) * 100) / 100;
        
        // Đặt salePrice bằng price
        const salePrice = roundedPrice;

        await Product.findByIdAndUpdate(product._id, {
          price: roundedPrice,
          salePrice: salePrice,
          comparePrice: comparePrice
        });

        console.log(`✅ Cập nhật ${product.name}: $${product.price} → $${roundedPrice}`);
      }

      console.log(`🎉 Đã cập nhật giá cho ${lowPriceProducts.length} sản phẩm!`);
    } else {
      console.log('✅ Không có sản phẩm nào cần cập nhật giá.');
    }

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Đã đóng kết nối database.');
  }
};

fixPricing();
