const express = require('express');
const { query, param, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { requireAdmin } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
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

// Simple admin IP whitelist (for demo - in production use proper middleware)
const adminIPWhitelist = (req, res, next) => {
  // For development, allow all IPs
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  const allowedIPs = process.env.ADMIN_ALLOWED_IPS ? 
    process.env.ADMIN_ALLOWED_IPS.split(',') : [];
  
  if (allowedIPs.length > 0) {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!allowedIPs.includes(clientIP)) {
      console.warn(`Unauthorized admin access attempt from IP: ${clientIP}`);
      return res.status(403).json({
        error: 'Access denied',
        message: 'Access denied from this IP address'
      });
    }
  }
  
  next();
};

const router = express.Router();

// Apply admin middleware to all routes
router.use(requireAdmin);
router.use(adminIPWhitelist);

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard',
  auditLog('admin_dashboard_view'),
  asyncHandler(async (req, res) => {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      topProducts
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { 'payment.status': 'completed' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.find()
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name')
        .sort('-createdAt')
        .limit(10),
      Product.find({
        status: 'active',
        'inventory.trackQuantity': true,
        $expr: { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] }
      }).limit(10),
      Product.aggregate([
        { $match: { status: 'active' } },
        { $sort: { sales: -1 } },
        { $limit: 5 },
        { $project: { name: 1, sales: 1, price: 1, images: 1 } }
      ])
    ]);

    // Calculate monthly revenue
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          'payment.status': 'completed',
          createdAt: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        recentOrders,
        lowStockProducts,
        topProducts,
        monthlyRevenue
      }
    });
  })
);

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().trim(),
    query('role').optional().isIn(['user', 'admin'])
  ],
  auditLog('admin_users_view'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { page = 1, limit = 20, search, role } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) filter.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -mfaSecret -backupCodes')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  })
);

// @desc    Get all orders with pagination
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
    query('search').optional().trim()
  ],
  auditLog('admin_orders_view'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { page = 1, limit = 20, status, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  })
);

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
router.patch('/orders/:id/status',
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    query('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
    query('notes').optional().trim()
  ],
  auditLog('admin_order_status_update'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { status, notes, trackingNumber, carrier } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order could not be found'
      });
    }

    await order.updateStatus(status, notes);

    if (trackingNumber) {
      await order.addTracking(trackingNumber, carrier);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  })
);

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
router.get('/analytics',
  [
    query('period').optional().isIn(['7d', '30d', '90d', '1y']),
    query('metric').optional().isIn(['revenue', 'orders', 'users', 'products'])
  ],
  auditLog('admin_analytics_view'),
  asyncHandler(async (req, res) => {
    const { period = '30d', metric = 'revenue' } = req.query;

    // Calculate date range
    const days = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };

    const startDate = new Date(Date.now() - days[period] * 24 * 60 * 60 * 1000);

    let analyticsData;

    switch (metric) {
      case 'revenue':
        analyticsData = await Order.aggregate([
          {
            $match: {
              'payment.status': 'completed',
              createdAt: { $gte: startDate }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
              },
              revenue: { $sum: '$total' },
              orders: { $sum: 1 }
            }
          },
          { $sort: { '_id': 1 } }
        ]);
        break;

      case 'orders':
        analyticsData = await Order.aggregate([
          {
            $match: { createdAt: { $gte: startDate } }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id': 1 } }
        ]);
        break;

      case 'users':
        analyticsData = await User.aggregate([
          {
            $match: { createdAt: { $gte: startDate } }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id': 1 } }
        ]);
        break;

      case 'products':
        analyticsData = await Product.aggregate([
          {
            $match: { createdAt: { $gte: startDate } }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id': 1 } }
        ]);
        break;
    }

    res.json({
      success: true,
      data: {
        metric,
        period,
        analytics: analyticsData
      }
    });
  })
);

// @desc    Get categories
// @route   GET /api/admin/categories
// @access  Private/Admin
router.get('/categories',
  auditLog('admin_categories_view'),
  asyncHandler(async (req, res) => {
    const categories = await Category.find()
      .populate('subcategories')
      .populate('productsCount')
      .sort('name');

    res.json({
      success: true,
      data: { categories }
    });
  })
);

module.exports = router;
