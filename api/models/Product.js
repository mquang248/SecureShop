const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  image: {
    type: String,
    default: '/placeholder-product.jpg'
  },
  images: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  features: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  warranty: {
    type: String
  },
  returnPolicy: {
    type: String,
    default: '30 days'
  },
  shipping: {
    weight: String,
    dimensions: String,
    freeShipping: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Create indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
