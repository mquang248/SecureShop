import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Shield, 
  Truck, 
  RotateCcw, 
  CheckCircle,
  ArrowLeft,
  Plus,
  Minus,
  Eye,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'
import { productIdMapping, getProductUrl } from '../utils/productMapping'
import api from '../utils/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ProductReviews from '../components/products/ProductReviews'

const ProductTemplate = ({ productId }) => {
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const { isAuthenticated } = useAuth()

  // Find MongoDB ID from productId (1-18)
  const getMongoIdFromProductId = (id) => {
    return Object.keys(productIdMapping).find(key => productIdMapping[key] === parseInt(id))
  }

  const mongoId = getMongoIdFromProductId(productId)

  // Fetch product data and related products from API
  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', mongoId],
    queryFn: async () => {
      if (!mongoId) {
        console.error('ProductTemplate: No mongoId found for productId:', productId)
        throw new Error('Product not found')
      }
      const response = await api.get(`/products/${mongoId}`)
      return response.data.data // Return both product and relatedProducts
    },
    enabled: !!mongoId,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  })

  const product = productData?.product
  const relatedProducts = productData?.relatedProducts || []

  useEffect(() => {
    setSelectedImageIndex(0)
  }, [product])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Show error only if there's a real error (not just loading)
  if (error && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to load product</h1>
          <p className="text-gray-600 mb-6">
            An error occurred while loading product information. Please try again later.
            <br />
            <small className="text-gray-500">
              {error?.message || 'Unable to connect to server'}
            </small>
          </p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/shop"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'warning')
      return
    }

    if (!product?.inventory?.quantity || product.inventory.quantity < quantity) {
      showToast('Not enough stock available', 'error')
      return
    }

    try {
      await addToCart(product._id, quantity)
      showToast(`Added ${quantity} ${product.name} to cart!`, 'success')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    const maxQuantity = Math.min(product?.inventory?.quantity || 0, 10)
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity)
    }
  }

  const nextImage = () => {
    if (!product?.images || product.images.length === 0) return
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    if (!product?.images || product.images.length === 0) return
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  return (
    <>
      <Helmet>
        <title>{product?.name || 'Product'} - SecureShop</title>
        <meta name="description" content={product?.shortDescription || 'Product details'} />
        <meta property="og:title" content={product?.name || 'Product'} />
        <meta property="og:description" content={product?.shortDescription || 'Product details'} />
        <meta property="og:type" content="product" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb & Back Button */}
          <div className="flex items-center justify-between mb-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-primary-600">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-primary-600">Shop</Link>
              <span>/</span>
              <span className="text-gray-900">{product?.name || 'Product'}</span>
            </nav>
            
            <Link
              to="/shop"
              className="flex items-center px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Link>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product?.images?.[selectedImageIndex]?.url || '/placeholder-product.jpg'}
                    alt={product?.images?.[selectedImageIndex]?.alt || product?.name || 'Product'}
                    className="w-full h-full object-cover"
                  />
                  
                  {product?.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Image Thumbnails */}
                {product?.images && product.images.length > 1 && (
                  <div className="flex space-x-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index
                            ? 'border-primary-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image?.url || '/placeholder-product.jpg'}
                          alt={image?.alt || `Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                      {product?.category?.name || 'Category'}
                    </span>
                    <div className="text-2xl font-bold text-primary-600">
                      #{productId}
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product?.name || 'Product Name'}
                  </h1>
                  {product?.brand && (
                    <p className="text-gray-600 mb-4">by <span className="font-medium">{product.brand}</span></p>
                  )}
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">
                      {renderStars(product?.rating?.average || 0)}
                    </div>
                    <span className="text-gray-600">
                      {product?.rating?.average ? `${product.rating.average.toFixed(1)} ` : ''}
                      ({product?.rating?.count || 0} reviews)
                    </span>
                  </div>

                  <p className="text-lg text-gray-600 mb-6">
                    {product?.shortDescription || product?.description || 'Product description'}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-primary-600">
                    {formatPrice(product?.price || 0)}
                  </span>
                  {product?.comparePrice && product.comparePrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>

                {/* Features */}
                {product?.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stock Status */}
                <div className="space-y-2">
                  {product?.inventory?.quantity > 0 ? (
                    <div>
                      <p className="text-green-600 font-medium flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        In Stock
                      </p>
                      {product.inventory.quantity <= (product.inventory.lowStockThreshold || 10) && (
                        <p className="text-amber-600 text-sm">
                          Only {product.inventory.quantity} left in stock
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-red-600 font-medium">Out of Stock</p>
                  )}
                </div>

                {/* Quantity & Add to Cart */}
                {product?.inventory?.quantity > 0 && (
                  <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= Math.min(product?.inventory?.quantity || 0, 10)}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </button>
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                )}

                {/* Security Features */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Maximum Security</h4>
                      <p className="text-sm text-blue-700">
                        Product is encrypted and protected to military standards
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warranty & Support */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Warranty */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-900">Warranty</h4>
                        <p className="text-sm text-green-700">
                          {product?.warranty?.duration || '24 months'} official warranty
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          {product?.warranty?.coverage || 'Comprehensive hardware and software warranty'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* After-sales Support */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 text-purple-600">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-900">After-sales</h4>
                        <p className="text-sm text-purple-700">
                          Technical support {product?.support?.duration || '24/7'}
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          {product?.support?.channels || 'Hotline, Email, Live Chat Support'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="border-t border-gray-200">
              <div className="flex space-x-8 px-8">
                {['description', 'specifications', 'warranty'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 border-b-2 font-medium transition-colors ${
                      activeTab === tab
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'description' && 'Description'}
                    {tab === 'specifications' && 'Specifications'}
                    {tab === 'warranty' && 'Warranty & Support'}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product?.specifications && Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                    {(!product?.specifications || Object.keys(product.specifications).length === 0) && (
                      <p className="text-gray-500">Specifications will be updated soon.</p>
                    )}
                  </div>
                )}

                {activeTab === 'warranty' && (
                  <div className="space-y-8">
                    {/* Warranty Information */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Warranty Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 rounded-lg p-6">
                          <h4 className="font-semibold text-green-900 mb-3">Warranty Period</h4>
                          <p className="text-green-700 text-lg font-medium mb-2">
                            {product?.warranty?.duration || '24 months'}
                          </p>
                          <p className="text-green-600 text-sm">
                            From purchase date
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-6">
                          <h4 className="font-semibold text-blue-900 mb-3">Warranty Coverage</h4>
                          <ul className="text-blue-700 text-sm space-y-1">
                            <li>✓ Hardware defects from manufacturer</li>
                            <li>✓ Free software updates</li>
                            <li>✓ Original parts replacement</li>
                            <li>✓ Remote technical support</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* After-sales Support */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">After-sales Service</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-purple-50 rounded-lg p-6 text-center">
                          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-semibold text-purple-900 mb-2">24/7 Support</h4>
                          <div className="space-y-1 text-purple-700 text-sm">
                            <div className="flex items-center justify-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>1900-xxxx</span>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>support@secureshop.com</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-6 text-center">
                          <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Truck className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-semibold text-orange-900 mb-2">Door-to-door Pickup</h4>
                          <p className="text-orange-700 text-sm">
                            Free pickup<br/>
                            within city area
                          </p>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-6 text-center">
                          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <RotateCcw className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-semibold text-indigo-900 mb-2">Easy Returns</h4>
                          <p className="text-indigo-700 text-sm">
                            7-day returns<br/>
                            no questions asked
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Warranty Contact</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Warranty Center</h4>
                          <p className="text-gray-600 text-sm">
                            Address: 123 ABC Street, XYZ District, Ho Chi Minh City<br/>
                            Working hours: 8:00 - 17:00 (Mon-Fri)<br/>
                            Tel: (028) 1234-5678
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Online Support</h4>
                          <p className="text-gray-600 text-sm">
                            Website: warranty.secureshop.com<br/>
                            Live Chat: 24/7<br/>
                            Email: warranty@secureshop.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Product Reviews Section */}
          <div className="mt-16">
            <ProductReviews 
              productId={product?._id} 
              productName={product?.name}
            />
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => {
                  const relatedProductUrl = getProductUrl(relatedProduct._id)

                  return (
                    <Link
                      key={relatedProduct._id}
                      to={relatedProductUrl}
                      className="group bg-white rounded-lg border border-gray-200 hover:border-primary-300 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={relatedProduct?.images?.[0]?.url || '/placeholder-product.jpg'}
                          alt={relatedProduct?.name || 'Related product'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {relatedProduct?.name || 'Product'}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary-600">
                            {formatPrice(relatedProduct?.price || 0)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductTemplate
