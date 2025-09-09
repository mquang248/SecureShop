import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mquang248:Quang28082004@secureshop.rkpnj.mongodb.net/secureshop?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Product Schema (simplified for API)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '/placeholder-product.jpg' },
  featured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 },
  features: [String],
  specifications: { type: Map, of: String }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '/placeholder-category.jpg' }
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

// Routes
app.get('/api/test', async (req, res) => {
  try {
    await connectToDatabase();
    res.json({ 
      message: 'API is working with real MongoDB!', 
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    await connectToDatabase();
    const products = await Product.find({}).lean();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

app.get('/api/products/featured', async (req, res) => {
  try {
    await connectToDatabase();
    const featuredProducts = await Product.find({ featured: true }).lean();
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Failed to fetch featured products', details: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const productId = req.params.id;
    
    // Try to find by MongoDB ObjectId first
    let product;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId).lean();
    }
    
    // If not found, try to find by custom id field (if exists)
    if (!product) {
      product = await Product.findOne({ 
        $or: [
          { id: parseInt(productId) },
          { productId: parseInt(productId) }
        ]
      }).lean();
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).lean();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// Search products
app.get('/api/products/search/:query', async (req, res) => {
  try {
    await connectToDatabase();
    const query = req.params.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).lean();
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products', details: error.message });
  }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    await connectToDatabase();
    const category = req.params.category;
    const products = await Product.find({ 
      category: { $regex: category, $options: 'i' } 
    }).lean();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products by category', details: error.message });
  }
});

// Health check with database status
app.get('/api/health', async (req, res) => {
  try {
    await connectToDatabase();
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Connected',
      products: productCount,
      categories: categoryCount
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Vercel serverless function handler
export default function handler(req, res) {
  return app(req, res);
}
