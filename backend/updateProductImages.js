const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/secure_shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateProductImages = async () => {
  try {
    console.log('🔄 Đang cập nhật hình ảnh sản phẩm...');

    // Cập nhật hình ảnh cho các sản phẩm
    const updates = [
      {
        name: 'MobileSecure Endpoint Agent',
        images: [
          { url: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=500&h=300&fit=crop', alt: 'MobileSecure Endpoint Agent', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=500&h=300&fit=crop', alt: 'Mobile Security Features', isPrimary: false },
          { url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&h=300&fit=crop', alt: 'Endpoint Protection', isPrimary: false }
        ]
      },
      {
        name: 'CloudAccess Identity Hub',
        images: [
          { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop', alt: 'CloudAccess Identity Hub', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop', alt: 'Cloud Identity Management', isPrimary: false },
          { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop', alt: 'Access Control', isPrimary: false }
        ]
      },
      {
        name: 'SecureCloud Gateway',
        images: [
          { url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&h=300&fit=crop', alt: 'SecureCloud Gateway', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop', alt: 'Cloud Security Gateway', isPrimary: false },
          { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop', alt: 'Network Protection', isPrimary: false }
        ]
      },
      {
        name: 'DataGuard Backup Shield',
        images: [
          { url: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=500&h=300&fit=crop', alt: 'DataGuard Backup Shield', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop', alt: 'Data Backup Solution', isPrimary: false },
          { url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500&h=300&fit=crop', alt: 'Enterprise Backup', isPrimary: false }
        ]
      },
      {
        name: 'ThreatHunter AI Platform',
        images: [
          { url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop', alt: 'ThreatHunter AI Platform', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop', alt: 'AI Threat Detection', isPrimary: false },
          { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop', alt: 'Machine Learning Security', isPrimary: false }
        ]
      },
      {
        name: 'SecureWifi Manager Pro',
        images: [
          { url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&h=300&fit=crop', alt: 'SecureWifi Manager Pro', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=500&h=300&fit=crop', alt: 'WiFi Security Management', isPrimary: false },
          { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop', alt: 'Wireless Network Security', isPrimary: false }
        ]
      }
    ];

    let updatedCount = 0;

    for (const update of updates) {
      const result = await Product.updateOne(
        { name: update.name },
        { 
          $set: { 
            images: update.images
          }
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Đã cập nhật hình ảnh cho: ${update.name}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Không tìm thấy sản phẩm: ${update.name}`);
      }
    }

    console.log(`\n🎉 Hoàn thành! Đã cập nhật hình ảnh cho ${updatedCount}/${updates.length} sản phẩm.`);

    // Hiển thị danh sách sản phẩm đã cập nhật
    console.log('\n📋 Danh sách sản phẩm với hình ảnh mới:');
    const updatedProducts = await Product.find({ 
      name: { $in: updates.map(u => u.name) } 
    }).select('name images');
    
    updatedProducts.forEach(product => {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      console.log(`   • ${product.name}: ${primaryImage?.url || 'Không có hình ảnh'}`);
    });

  } catch (error) {
    console.error('❌ Lỗi cập nhật hình ảnh:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Đã đóng kết nối database.');
  }
};

updateProductImages();
