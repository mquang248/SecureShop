// Featured products API for Vercel
const connectDB = require('../../utils/db');
const Product = require('../../models/Product');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    // Get featured products
    const featuredProducts = await Product.find({ featured: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.status(200).json({
      success: true,
      data: featuredProducts
    });
  } catch (error) {
    console.error('Featured Products API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};
