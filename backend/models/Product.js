const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: [500, 'Review cannot exceed 500 characters']
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  barcode: String,
  
  // Inventory
  inventory: {
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    trackQuantity: {
      type: Boolean,
      default: true
    }
  },
  
  // Product details
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: String,
    trim: true
  },
  tags: [String],
  
  // Product features and specifications
  features: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: Map,
    of: String,
    default: new Map()
  },
  
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // SEO
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  
  // Product attributes
  attributes: [{
    name: String,
    value: String
  }],
  
  // Variants (for products with different sizes, colors, etc.)
  variants: [{
    name: String,
    options: [String],
    required: {
      type: Boolean,
      default: false
    }
  }],
  
  // Reviews and ratings
  reviews: [reviewSchema],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Status and visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  
  // Shipping
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    }
  },
  
  // Warranty and Support
  warranty: {
    duration: {
      type: String,
      default: '24 tháng'
    },
    coverage: {
      type: String,
      default: 'Bảo hành chính hãng theo quy định nhà sản xuất'
    }
  },
  support: {
    duration: {
      type: String,
      default: '24/7'
    },
    channels: {
      type: String,
      default: 'Hotline, Email, Chat trực tuyến'
    }
  },
  
  // Digital product
  isDigital: {
    type: Boolean,
    default: false
  },
  downloadUrl: String,
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  publishedAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
productSchema.virtual('inStock').get(function() {
  return this.inventory.quantity > 0;
});

productSchema.virtual('isLowStock').get(function() {
  return this.inventory.quantity <= this.inventory.lowStockThreshold;
});

productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0];
});

// Indexes
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ sku: 1 });

// Middleware to update rating when reviews change
productSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    const validReviews = this.reviews.filter(review => review.rating);
    
    if (validReviews.length > 0) {
      const totalRating = validReviews.reduce((sum, review) => sum + review.rating, 0);
      this.rating.average = Math.round((totalRating / validReviews.length) * 10) / 10;
      this.rating.count = validReviews.length;
    } else {
      this.rating.average = 0;
      this.rating.count = 0;
    }
  }
  next();
});

// Method to add review
productSchema.methods.addReview = function(userId, rating, comment) {
  // Check if user already reviewed this product
  const existingReview = this.reviews.find(review => 
    review.user.toString() === userId.toString()
  );
  
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    this.reviews.push({
      user: userId,
      rating,
      comment
    });
  }
  
  return this.save();
};

// Method to increment views
productSchema.methods.incrementViews = function() {
  return this.updateOne({ $inc: { views: 1 } });
};

// Method to update inventory
productSchema.methods.updateInventory = function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.inventory.quantity = Math.max(0, this.inventory.quantity - quantity);
  } else {
    this.inventory.quantity += quantity;
  }
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
