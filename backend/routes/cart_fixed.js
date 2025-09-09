const express = require('express');
const { body, param, validationResult } = require('express-validator');
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

const router = express.Router();

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/',
  asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price salePrice images inventory.quantity status sku'
      });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id });
    }

    // Filter out any items where the product no longer exists or is inactive
    const validItems = cart.items.filter(item => 
      item.product && item.product.status === 'active'
    );

    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.json({
      success: true,
      data: { cart }
    });
  })
);

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
router.post('/items',
  xssProtection,
  [
    body('productId').isMongoId().withMessage('Valid product ID is required'),
    body('quantity').isInt({ min: 1, max: 99 }).withMessage('Quantity must be between 1 and 99'),
    body('selectedVariants').optional().isArray().withMessage('Selected variants must be an array')
  ],
  auditLog('cart_add_item'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { productId, quantity, selectedVariants = [] } = req.body;

    // Verify product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product could not be found'
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        error: 'Product unavailable',
        message: 'This product is not currently available'
      });
    }

    // Check inventory
    if (product.inventory.trackQuantity && product.inventory.quantity < quantity) {
      return res.status(400).json({
        error: 'Insufficient inventory',
        message: `Only ${product.inventory.quantity} items available in stock`
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id });
    }

    // Add item to cart
    await cart.addItem(productId, quantity, product.price, selectedVariants);

    // Populate and return updated cart
    await cart.populate({
      path: 'items.product',
      select: 'name price salePrice images inventory.quantity sku'
    });

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: { cart }
    });
  })
);

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
router.put('/items/:itemId',
  [
    param('itemId').isMongoId().withMessage('Valid item ID is required'),
    body('quantity').isInt({ min: 0, max: 99 }).withMessage('Quantity must be between 0 and 99')
  ],
  auditLog('cart_update_item'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found',
        message: 'Your cart could not be found'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        error: 'Item not found',
        message: 'The item was not found in your cart'
      });
    }

    // If quantity is 0, remove the item
    if (quantity === 0) {
      cart.items.pull(itemId);
    } else {
      // Verify product inventory for the new quantity
      const product = await Product.findById(item.product);
      if (product && product.inventory.trackQuantity && product.inventory.quantity < quantity) {
        return res.status(400).json({
          error: 'Insufficient inventory',
          message: `Only ${product.inventory.quantity} items available in stock`
        });
      }
      
      item.quantity = quantity;
    }

    await cart.save();

    // Populate and return updated cart
    await cart.populate({
      path: 'items.product',
      select: 'name price salePrice images inventory.quantity sku'
    });

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: { cart }
    });
  })
);

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
router.delete('/items/:itemId',
  param('itemId').isMongoId().withMessage('Valid item ID is required'),
  auditLog('cart_remove_item'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found',
        message: 'Your cart could not be found'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        error: 'Item not found',
        message: 'The item was not found in your cart'
      });
    }

    cart.items.pull(itemId);
    await cart.save();

    // Populate and return updated cart
    await cart.populate({
      path: 'items.product',
      select: 'name price salePrice images inventory.quantity sku'
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: { cart }
    });
  })
);

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/',
  auditLog('cart_clear'),
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found',
        message: 'Your cart could not be found'
      });
    }

    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: { 
        cart: {
          items: [],
          itemsCount: 0,
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0
        }
      }
    });
  })
);

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
router.post('/coupon',
  [
    body('code').trim().isLength({ min: 1 }).withMessage('Coupon code is required')
  ],
  auditLog('cart_apply_coupon'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { code } = req.body;

    // Simple coupon validation (you can expand this)
    const coupon = {
      'SAVE10': { discount: 10, type: 'percentage' },
      'SAVE20': { discount: 20, type: 'percentage' },
      'FREESHIP': { discount: 0, type: 'free_shipping' }
    }[code.toUpperCase()];

    if (!coupon) {
      return res.status(400).json({
        error: 'Invalid coupon',
        message: 'The coupon code is not valid or has expired'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found',
        message: 'Your cart could not be found'
      });
    }

    await cart.applyCoupon(code.toUpperCase(), coupon.discount, coupon.type);

    // Populate and return updated cart
    await cart.populate({
      path: 'items.product',
      select: 'name price salePrice images inventory.quantity sku'
    });

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: { cart }
    });
  })
);

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
router.delete('/coupon',
  auditLog('cart_remove_coupon'),
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found',
        message: 'Your cart could not be found'
      });
    }

    await cart.removeCoupon();

    // Populate and return updated cart
    await cart.populate({
      path: 'items.product',
      select: 'name price salePrice images inventory.quantity sku'
    });

    res.json({
      success: true,
      message: 'Coupon removed successfully',
      data: { 
        cart,
        itemsCount: cart.itemsCount,
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        total: cart.total,
        coupon: cart.coupon
      }
    });
  })
);

module.exports = router;
