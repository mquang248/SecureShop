const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { xssProtection } = require('../middleware/security');

// Simple audit log function
const auditLog = (action) => {
  return (req, res, next) => {
    const logData = {
      action,
      user: req.user ? req.user._id : 'anonymous',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    };
    
    console.log('AUDIT:', JSON.stringify(logData));
    next();
  };
};

const router = express.Router();

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
router.get('/',
  optionalAuth,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sort').optional().isIn(['price', '-price', 'rating', '-rating', 'createdAt', '-createdAt', 'name', '-name']),
    query('category').optional().isMongoId().withMessage('Invalid category ID'),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('rating').optional().isFloat({ min: 0, max: 5 }),
    query('featured').optional().isBoolean(),
    query('inStock').optional().isBoolean(),
    query('search').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('Search must be between 1 and 100 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      minPrice,
      maxPrice,
      rating,
      featured,
      inStock,
      search
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (inStock === 'true') filter['inventory.quantity'] = { $gt: 0 };
    if (rating) filter['rating.average'] = { $gte: parseFloat(rating) };

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Search filter - Simple text match on product name only
    if (search) {
      filter.name = { 
        $regex: search, 
        $options: 'i' // Case-insensitive search
      };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .populate('createdBy', 'firstName lastName')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-reviews'),
      Product.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts: total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        },
        filters: {
          category,
          minPrice,
          maxPrice,
          rating,
          featured,
          inStock,
          search,
          sort
        }
      }
    });
  })
);

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured',
  asyncHandler(async (req, res) => {
    const products = await Product.find({ 
      status: 'active', 
      featured: true 
    })
      .populate('category', 'name slug')
      .sort('-rating.average')
      .limit(8)
      .select('-reviews');

    res.json({
      success: true,
      data: { products }
    });
  })
);

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
router.get('/categories', 
  asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true })
      .select('name slug description')
      .sort('name');

    res.json({
      success: true,
      data: categories
    });
  })
);

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id',
  optionalAuth,
  param('id').isMongoId().withMessage('Invalid product ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('reviews.user', 'firstName lastName avatar')
      .populate('createdBy', 'firstName lastName');

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product could not be found'
      });
    }

    // Increment views
    await product.incrementViews();

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active'
    })
      .limit(4)
      .select('name price images rating');

    res.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });
  })
);

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/',
  authenticateToken,
  requireAdmin,
  xssProtection,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
    body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('sku').trim().notEmpty().withMessage('SKU is required'),
    body('category').isMongoId().withMessage('Valid category is required'),
    body('inventory.quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
  ],
  auditLog('product_create'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Check if SKU already exists
    const existingSku = await Product.findOne({ sku: req.body.sku.toUpperCase() });
    if (existingSku) {
      return res.status(400).json({
        error: 'SKU already exists',
        message: 'A product with this SKU already exists'
      });
    }

    // Verify category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        error: 'Invalid category',
        message: 'The specified category does not exist'
      });
    }

    const product = await Product.create({
      ...req.body,
      sku: req.body.sku.toUpperCase(),
      createdBy: req.user._id
    });

    await product.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  })
);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id',
  authenticateToken,
  requireAdmin,
  xssProtection,
  param('id').isMongoId().withMessage('Invalid product ID'),
  auditLog('product_update'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product could not be found'
      });
    }

    // Check SKU uniqueness if it's being changed
    if (req.body.sku && req.body.sku.toUpperCase() !== product.sku) {
      const existingSku = await Product.findOne({ 
        sku: req.body.sku.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      
      if (existingSku) {
        return res.status(400).json({
          error: 'SKU already exists',
          message: 'A product with this SKU already exists'
        });
      }
    }

    // Verify category if it's being changed
    if (req.body.category && req.body.category !== product.category.toString()) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({
          error: 'Invalid category',
          message: 'The specified category does not exist'
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        sku: req.body.sku ? req.body.sku.toUpperCase() : product.sku,
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  })
);

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  param('id').isMongoId().withMessage('Invalid product ID'),
  auditLog('product_delete'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product could not be found'
      });
    }

    // Soft delete by changing status to archived
    product.status = 'archived';
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  })
);

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews',
  authenticateToken,
  [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters')
  ],
  auditLog('review_create'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product could not be found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        error: 'Review already exists',
        message: 'You have already reviewed this product'
      });
    }

    await product.addReview(req.user._id, rating, comment);
    await product.populate('reviews.user', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { product }
    });
  })
);

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
router.get('/:id/reviews',
  [
    param('id').isMongoId().withMessage('Invalid product ID')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const product = await Product.findById(req.params.id)
      .populate({
        path: 'reviews.user',
        select: 'firstName lastName avatar'
      })
      .select('reviews rating');

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product could not be found'
      });
    }

    // Paginate reviews
    const totalReviews = product.reviews.length;
    const reviews = product.reviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          limit: parseInt(limit)
        },
        averageRating: product.rating.average,
        totalRatings: product.rating.count
      }
    });
  })
);

// @desc    Update inventory
// @route   PATCH /api/products/:id/inventory
// @access  Private/Admin
router.patch('/:id/inventory',
  authenticateToken,
  requireAdmin,
  [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('operation').isIn(['set', 'add', 'subtract']).withMessage('Operation must be set, add, or subtract')
  ],
  auditLog('inventory_update'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { quantity, operation = 'set' } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product could not be found'
      });
    }

    switch (operation) {
      case 'set':
        product.inventory.quantity = quantity;
        break;
      case 'add':
        product.inventory.quantity += quantity;
        break;
      case 'subtract':
        product.inventory.quantity = Math.max(0, product.inventory.quantity - quantity);
        break;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      data: {
        product: {
          id: product._id,
          name: product.name,
          sku: product.sku,
          inventory: product.inventory
        }
      }
    });
  })
);

module.exports = router;
