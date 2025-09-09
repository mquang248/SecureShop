// Main products API for Vercel
const connectDB = require('../utils/db');
const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    // Parse query parameters
    const url = new URL(req.url, 'http://localhost');
    const searchParams = url.searchParams;
    
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || '-createdAt';

    // Build query
    let query = {};

    // Apply search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Apply category filter
    if (category) {
      query.category = category;
    }

    // Build sort object
    let sortObj = {};
    if (sort === '-createdAt') {
      sortObj = { createdAt: -1 };
    } else if (sort === 'price') {
      sortObj = { price: 1 };
    } else if (sort === '-price') {
      sortObj = { price: -1 };
    } else if (sort === 'name') {
      sortObj = { name: 1 };
    } else if (sort === '-rating') {
      sortObj = { rating: -1 };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    const response = {
      success: true,
      data: {
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        hasNext: skip + limit < totalProducts,
        hasPrev: page > 1
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Products API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};