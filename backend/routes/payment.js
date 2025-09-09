const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, param, validationResult } = require('express-validator');
const Order = require('../models/Order');
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

const router = express.Router();

// @desc    Create payment intent
// @route   POST /api/payment/create-intent
// @access  Private
router.post('/create-intent',
  [
    body('orderId').isMongoId().withMessage('Valid order ID is required'),
    body('paymentMethod').isIn(['stripe', 'paypal', 'momo', 'zalopay']).withMessage('Invalid payment method')
  ],
  auditLog('payment_intent_create'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { orderId, paymentMethod } = req.body;

    // Get order
    const order = await Order.findOne({ 
      _id: orderId, 
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order could not be found'
      });
    }

    if (order.payment.status === 'completed') {
      return res.status(400).json({
        error: 'Order already paid',
        message: 'This order has already been paid'
      });
    }

    let paymentIntent;

    switch (paymentMethod) {
      case 'stripe':
        try {
          paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.total * 100), // Convert to cents
            currency: order.currency.toLowerCase(),
            metadata: {
              orderId: order._id.toString(),
              userId: req.user._id.toString(),
              orderNumber: order.orderNumber
            },
            automatic_payment_methods: {
              enabled: true,
            },
            shipping: {
              name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
              address: {
                line1: order.shippingAddress.address1,
                line2: order.shippingAddress.address2,
                city: order.shippingAddress.city,
                state: order.shippingAddress.state,
                postal_code: order.shippingAddress.zipCode,
                country: order.shippingAddress.country
              }
            }
          });

          res.json({
            success: true,
            data: {
              clientSecret: paymentIntent.client_secret,
              paymentIntentId: paymentIntent.id
            }
          });
        } catch (error) {
          console.error('Stripe error:', error);
          return res.status(500).json({
            error: 'Payment processing error',
            message: 'Failed to create payment intent'
          });
        }
        break;

      case 'paypal':
        // PayPal integration would go here
        res.json({
          success: true,
          data: {
            paymentUrl: `https://paypal.com/checkout?amount=${order.total}&order=${order._id}`,
            paymentId: `paypal_${order._id}`
          }
        });
        break;

      case 'momo':
        // MoMo integration (Vietnam) would go here
        res.json({
          success: true,
          data: {
            paymentUrl: `https://momo.vn/payment?amount=${order.total}&order=${order._id}`,
            paymentId: `momo_${order._id}`
          }
        });
        break;

      case 'zalopay':
        // ZaloPay integration (Vietnam) would go here
        res.json({
          success: true,
          data: {
            paymentUrl: `https://zalopay.vn/payment?amount=${order.total}&order=${order._id}`,
            paymentId: `zalopay_${order._id}`
          }
        });
        break;

      default:
        return res.status(400).json({
          error: 'Invalid payment method',
          message: 'The specified payment method is not supported'
        });
    }
  })
);

// @desc    Confirm payment
// @route   POST /api/payment/confirm
// @access  Private
router.post('/confirm',
  [
    body('orderId').isMongoId().withMessage('Valid order ID is required'),
    body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required')
  ],
  auditLog('payment_confirm'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { orderId, paymentIntentId } = req.body;

    // Get order
    const order = await Order.findOne({ 
      _id: orderId, 
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order could not be found'
      });
    }

    try {
      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        // Update order payment status
        await order.updatePaymentStatus('completed', paymentIntent.id);

        // Run fraud detection
        const fraudScore = await runFraudDetection(order, paymentIntent);
        order.fraudScore = fraudScore.score;
        order.riskAssessment = fraudScore.risk;
        await order.save();

        res.json({
          success: true,
          message: 'Payment confirmed successfully',
          data: { 
            order,
            fraudScore: fraudScore.score,
            riskAssessment: fraudScore.risk
          }
        });
      } else {
        await order.updatePaymentStatus('failed', paymentIntent.id);
        
        res.status(400).json({
          error: 'Payment failed',
          message: 'Payment was not successful',
          data: { status: paymentIntent.status }
        });
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      await order.updatePaymentStatus('failed');
      
      res.status(500).json({
        error: 'Payment processing error',
        message: 'Failed to confirm payment'
      });
    }
  })
);

// @desc    Process refund
// @route   POST /api/payment/refund
// @access  Private
router.post('/refund',
  [
    body('orderId').isMongoId().withMessage('Valid order ID is required'),
    body('amount').optional().isFloat({ min: 0 }).withMessage('Refund amount must be positive'),
    body('reason').trim().isLength({ min: 5, max: 200 }).withMessage('Reason must be between 5 and 200 characters')
  ],
  auditLog('payment_refund'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { orderId, amount, reason } = req.body;

    // Get order
    const order = await Order.findOne({ 
      _id: orderId, 
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order could not be found'
      });
    }

    if (order.payment.status !== 'completed') {
      return res.status(400).json({
        error: 'Cannot refund',
        message: 'Only completed payments can be refunded'
      });
    }

    try {
      const refundAmount = amount ? Math.round(amount * 100) : Math.round(order.total * 100);
      
      const refund = await stripe.refunds.create({
        payment_intent: order.payment.transactionId,
        amount: refundAmount,
        reason: 'requested_by_customer',
        metadata: {
          orderId: order._id.toString(),
          reason: reason
        }
      });

      // Update order status
      await order.updateStatus('refunded', `Refund processed: ${reason}`);
      order.payment.status = 'refunded';
      await order.save();

      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: { 
          refundId: refund.id,
          amount: refund.amount / 100,
          status: refund.status
        }
      });
    } catch (error) {
      console.error('Refund error:', error);
      res.status(500).json({
        error: 'Refund processing error',
        message: 'Failed to process refund'
      });
    }
  })
);

// @desc    Stripe webhook
// @route   POST /api/payment/webhook
// @access  Public
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Update order status if not already updated
        if (paymentIntent.metadata.orderId) {
          const order = await Order.findById(paymentIntent.metadata.orderId);
          if (order && order.payment.status === 'pending') {
            await order.updatePaymentStatus('completed', paymentIntent.id);
          }
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        // Update order status
        if (failedPayment.metadata.orderId) {
          const order = await Order.findById(failedPayment.metadata.orderId);
          if (order) {
            await order.updatePaymentStatus('failed', failedPayment.id);
          }
        }
        break;

      case 'charge.dispute.created':
        const dispute = event.data.object;
        console.log('Chargeback created:', dispute.id);
        // Handle chargeback
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  })
);

// @desc    Get payment methods
// @route   GET /api/payment/methods
// @access  Private
router.get('/methods',
  asyncHandler(async (req, res) => {
    const paymentMethods = [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        description: 'Visa, MasterCard, American Express',
        icon: 'credit-card',
        enabled: true,
        fees: '2.9% + $0.30'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: 'paypal',
        enabled: true,
        fees: '2.9% + $0.30'
      },
      {
        id: 'momo',
        name: 'MoMo Wallet',
        description: 'Vietnam mobile payment',
        icon: 'mobile',
        enabled: true,
        fees: '1.5%'
      },
      {
        id: 'zalopay',
        name: 'ZaloPay',
        description: 'Vietnam digital wallet',
        icon: 'wallet',
        enabled: true,
        fees: '1.8%'
      }
    ];

    res.json({
      success: true,
      data: { paymentMethods }
    });
  })
);

// Fraud detection function (mock implementation)
const runFraudDetection = async (order, paymentIntent) => {
  let score = 0;
  let risk = 'low';

  // Basic fraud detection rules
  
  // Check amount
  if (order.total > 1000) score += 10;
  if (order.total > 5000) score += 20;

  // Check shipping vs billing address
  if (JSON.stringify(order.shippingAddress) !== JSON.stringify(order.billingAddress)) {
    score += 15;
  }

  // Check payment method country vs shipping country
  if (paymentIntent.charges?.data[0]?.payment_method_details?.card?.country !== order.shippingAddress.country) {
    score += 25;
  }

  // Check velocity (multiple orders in short time)
  const recentOrders = await Order.countDocuments({
    user: order.user,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  if (recentOrders > 3) score += 30;

  // Determine risk level
  if (score >= 70) risk = 'high';
  else if (score >= 40) risk = 'medium';

  return { score, risk };
};

module.exports = router;
