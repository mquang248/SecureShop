const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');
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
const { sendOrderConfirmationEmail, sendShippingNotificationEmail } = require('../utils/email');

const router = express.Router();

// @desc    Get user orders with time filtering
// @route   GET /api/orders/user
// @access  Private
router.get('/user',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
    query('timeFilter').optional().isIn(['30days', '90days', 'year'])
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { page = 1, limit = 10, status, timeFilter } = req.query;
    const filter = { user: req.user._id };
    
    if (status) filter.status = status;

    // Apply time filter
    if (timeFilter) {
      const now = new Date();
      let startDate;
      
      switch (timeFilter) {
        case '30days':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case '90days':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }
      
      if (startDate) {
        filter.createdAt = { $gte: startDate };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .populate('items.product', 'name images category'),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parseInt(limit)
      }
    });
  })
);

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get('/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { page = 1, limit = 10, status } = req.query;
    const filter = { user: req.user._id };
    
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .populate('items.product', 'name images'),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit: parseInt(limit)
        }
      }
    });
  })
);

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id',
  param('id').isMongoId().withMessage('Invalid order ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order could not be found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  })
);

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
router.post('/',
  xssProtection,
  [
    body('shippingAddress.firstName').trim().notEmpty().withMessage('First name is required'),
    body('shippingAddress.lastName').trim().notEmpty().withMessage('Last name is required'),
    body('shippingAddress.address1').trim().notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
    body('shippingAddress.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
    body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
    body('paymentMethod').isIn(['stripe', 'paypal', 'momo', 'zalopay']).withMessage('Invalid payment method'),
    body('billingAddress').optional().isObject().withMessage('Billing address must be an object')
  ],
  auditLog('order_create'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images inventory.quantity');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        error: 'Empty cart',
        message: 'Cart is empty. Add items before creating an order.'
      });
    }

    // Validate inventory for all items
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          error: 'Invalid product',
          message: 'One or more products in your cart are no longer available'
        });
      }

      if (item.product.inventory.trackQuantity && 
          item.product.inventory.quantity < item.quantity) {
        return res.status(400).json({
          error: 'Insufficient inventory',
          message: `Insufficient stock for ${item.product.name}. Only ${item.product.inventory.quantity} available.`
        });
      }
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images && item.product.images.length > 0 ? 
             item.product.images[0].url : null,
      quantity: item.quantity,
      price: item.priceAtTime || item.product.price,
      selectedVariants: item.selectedVariants || []
    }));

    // Create order
    let order;
    try {
      order = await Order.create({
        user: req.user._id,
        email: req.user.email,
        items: orderItems,
        subtotal: req.body.subtotal || cart.subtotal,
        tax: req.body.tax || (req.body.subtotal || cart.subtotal) * 0.08,
        shipping: req.body.shippingCost || 0,
        discount: req.body.discount || 0,
        total: req.body.total || cart.total,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        payment: {
          method: paymentMethod,
          status: 'pending'
        },
        coupon: cart.coupon,
        notes: req.body.notes || '',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      console.log('Order created successfully:', order._id);
    } catch (orderError) {
      console.error('Order creation error:', orderError);
      return res.status(400).json({
        error: 'Order creation failed',
        message: orderError.message,
        details: orderError.errors
      });
    }

    // Update product inventory
    for (const item of cart.items) {
      if (item.product.inventory.trackQuantity) {
        await item.product.updateInventory(item.quantity, 'subtract');
      }
    }

    // Clear cart
    await cart.clearCart();

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(req.user, order);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  })
);

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
router.patch('/:id/cancel',
  param('id').isMongoId().withMessage('Invalid order ID'),
  auditLog('order_cancel'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order could not be found'
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return res.status(400).json({
        error: 'Cannot cancel order',
        message: 'This order cannot be cancelled due to its current status'
      });
    }

    // Update order status
    await order.updateStatus('cancelled', 'Cancelled by customer');

    // Restore inventory
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product && product.inventory.trackQuantity) {
        await product.updateInventory(item.quantity, 'add');
      }
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  })
);

// @desc    Request order return
// @route   POST /api/orders/:id/return
// @access  Private
router.post('/:id/return',
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('reason').trim().isLength({ min: 10, max: 500 }).withMessage('Reason must be between 10 and 500 characters'),
    body('items').isArray({ min: 1 }).withMessage('At least one item must be selected for return')
  ],
  auditLog('order_return_request'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { reason, items } = req.body;

    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order could not be found'
      });
    }

    // Check if order is eligible for return (delivered within 30 days)
    if (order.status !== 'delivered') {
      return res.status(400).json({
        error: 'Order not eligible',
        message: 'Only delivered orders can be returned'
      });
    }

    const deliveryDate = new Date(order.shipping.deliveredAt);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    if (deliveryDate < thirtyDaysAgo) {
      return res.status(400).json({
        error: 'Return period expired',
        message: 'Returns are only accepted within 30 days of delivery'
      });
    }

    // Add return request to order notes
    const returnRequest = {
      requestedAt: new Date(),
      reason,
      items,
      status: 'pending'
    };

    order.notes = (order.notes || '') + 
      `\n\nReturn Request (${new Date().toLocaleDateString()}): ${reason}`;
    
    await order.save();

    res.json({
      success: true,
      message: 'Return request submitted successfully. We will review and contact you within 2 business days.',
      data: { returnRequest }
    });
  })
);

// @desc    Get order tracking info
// @route   GET /api/orders/:id/tracking
// @access  Private
router.get('/:id/tracking',
  param('id').isMongoId().withMessage('Invalid order ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).select('orderNumber status shipping createdAt');

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order could not be found'
      });
    }

    // Create tracking timeline
    const timeline = [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Your order has been received and is being processed',
        date: order.createdAt,
        completed: true
      },
      {
        status: 'processing',
        title: 'Order Processing',
        description: 'Your order is being prepared for shipment',
        date: order.status === 'processing' ? new Date() : null,
        completed: ['processing', 'shipped', 'delivered'].includes(order.status)
      },
      {
        status: 'shipped',
        title: 'Order Shipped',
        description: 'Your order has been shipped and is on its way',
        date: order.shipping.shippedAt,
        completed: ['shipped', 'delivered'].includes(order.status)
      },
      {
        status: 'delivered',
        title: 'Order Delivered',
        description: 'Your order has been successfully delivered',
        date: order.shipping.deliveredAt,
        completed: order.status === 'delivered'
      }
    ];

    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        currentStatus: order.status,
        trackingNumber: order.shipping.trackingNumber,
        carrier: order.shipping.carrier,
        estimatedDelivery: order.shipping.estimatedDelivery,
        timeline
      }
    });
  })
);

module.exports = router;
