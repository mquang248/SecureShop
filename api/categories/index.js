// Categories API for Vercel
const connectDB = require('../utils/db');
const Category = require('../models/Category');

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

    // Get all categories
    const categories = await Category.find({})
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Categories API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};
