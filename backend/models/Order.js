const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  selectedVariants: [{
    name: String,
    value: String
  }]
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  company: String,
  address1: {
    type: String,
    required: true
  },
  address2: String,
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'US'
  },
  phone: String
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    default: function() {
      return `SS${Date.now().toString().slice(-6)}${Math.random().toString().substr(2, 4)}`;
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  
  // Order items
  items: [orderItemSchema],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Addresses
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  billingAddress: shippingAddressSchema,
  
  // Payment
  payment: {
    method: {
      type: String,
      enum: ['stripe', 'paypal', 'momo', 'zalopay'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    failureReason: String
  },
  
  // Shipping
  shipping: {
    method: String,
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date
  },
  
  // Order status
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // Notes and communication
  notes: String,
  customerNotes: String,
  
  // Coupon/Discount
  coupon: {
    code: String,
    discount: Number,
    discountType: String
  },
  
  // Fulfillment
  fulfillment: {
    status: {
      type: String,
      enum: ['unfulfilled', 'partial', 'fulfilled'],
      default: 'unfulfilled'
    },
    items: [{
      item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      fulfilledAt: Date
    }]
  },
  
  // Fraud detection
  fraudScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  riskAssessment: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  
  // Metadata
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin'],
    default: 'web'
  },
  ipAddress: String,
  userAgent: String,
  
  // Timestamps
  cancelledAt: Date,
  refundedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
orderSchema.virtual('customerName').get(function() {
  return `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`;
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for items count
orderSchema.virtual('itemsCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ email: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && (!this.orderNumber || this.orderNumber.startsWith('SS' + Date.now().toString().slice(-6)))) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `SS${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(status, notes = '') {
  this.status = status;
  if (notes) this.notes = notes;
  
  // Set timestamps based on status
  switch (status) {
    case 'shipped':
      this.shipping.shippedAt = new Date();
      break;
    case 'delivered':
      this.shipping.deliveredAt = new Date();
      break;
    case 'cancelled':
      this.cancelledAt = new Date();
      break;
    case 'refunded':
      this.refundedAt = new Date();
      this.payment.status = 'refunded';
      break;
  }
  
  return this.save();
};

// Method to update payment status
orderSchema.methods.updatePaymentStatus = function(status, transactionId = '') {
  this.payment.status = status;
  if (transactionId) this.payment.transactionId = transactionId;
  
  if (status === 'completed') {
    this.payment.paidAt = new Date();
    if (this.status === 'pending') {
      this.status = 'processing';
    }
  }
  
  return this.save();
};

// Method to add tracking number
orderSchema.methods.addTracking = function(trackingNumber, carrier = '') {
  this.shipping.trackingNumber = trackingNumber;
  if (carrier) this.shipping.carrier = carrier;
  
  if (this.status === 'processing') {
    this.status = 'shipped';
    this.shipping.shippedAt = new Date();
  }
  
  return this.save();
};

// Method to calculate fulfillment status
orderSchema.methods.updateFulfillmentStatus = function() {
  const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  const fulfilledItems = this.fulfillment.items.reduce((sum, item) => sum + item.quantity, 0);
  
  if (fulfilledItems === 0) {
    this.fulfillment.status = 'unfulfilled';
  } else if (fulfilledItems < totalItems) {
    this.fulfillment.status = 'partial';
  } else {
    this.fulfillment.status = 'fulfilled';
  }
  
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
