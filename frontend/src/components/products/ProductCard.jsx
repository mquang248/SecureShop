import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../contexts/CartContext'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'
import { getProductUrl } from '../../utils/productMapping'

const ProductCard = ({ product, layout = 'grid' }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'warning')
      return
    }

    setIsLoading(true)
    try {
      await addToCart(product._id, 1)
      showToast('Product added to cart!', 'success')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setIsLoading(false)
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

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
  const productUrl = getProductUrl(product._id)

  if (layout === 'list') {
    return (
      <div className="group bg-white rounded-xl border border-neutral-200 hover:border-primary-300 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <Link to={productUrl} className="flex h-48">
          {/* Image Container */}
          <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden bg-neutral-100">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                <Eye className="w-12 h-12 text-neutral-400" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-3 left-3 space-y-2">
              {product.featured && (
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-md">
                  Featured
                </span>
              )}
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
                  -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </span>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 flex-1 mr-4">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating?.average || 0)}
                  <span className="text-sm text-neutral-500 ml-1">
                    ({product.rating?.count || 0})
                  </span>
                </div>
              </div>
              
              <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                {product.shortDescription || product.description}
              </p>
              
              {/* Stock Status */}
              <div className="mb-4">
                {product.inventory?.quantity > 0 ? (
                  <span className="text-sm text-green-600 font-medium">
                    ✓ In Stock
                    {product.inventory.quantity <= (product.inventory.lowStockThreshold || 10) && (
                      <span className="text-amber-600 ml-1">
                        (Only {product.inventory.quantity} left)
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">
                    ✗ Out of Stock
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                {product.comparePrice && product.comparePrice > product.price ? (
                  <>
                    <span className="text-xl font-bold text-red-600">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-neutral-500 line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-neutral-900">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Link
                  to={productUrl}
                  className="flex items-center gap-2 px-3 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium border border-neutral-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">View Detail</span>
                </Link>
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || !(product.inventory?.quantity > 0)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium border ${
                    (product.inventory?.quantity > 0) && !isLoading
                      ? 'bg-primary-600 hover:bg-primary-700 text-white border-primary-600'
                      : 'bg-neutral-400 text-neutral-500 cursor-not-allowed border-neutral-400'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        {(product.inventory?.quantity > 0) ? 'Add to Cart' : 'Out of Stock'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div className="group bg-white rounded-xl border border-neutral-200 hover:border-primary-300 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
      <Link to={productUrl} className="block flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-200">
              <Eye className="w-12 h-12 text-neutral-400" />
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="p-2 bg-white rounded-full shadow-md hover:bg-neutral-50 transition-colors">
                <Heart className="w-4 h-4 text-neutral-600" />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2">
            {product.featured && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-md">
                Featured
              </span>
            )}
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
                -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
              </span>
            )}
            {!(product.inventory?.quantity > 0) && (
              <span className="px-2 py-1 bg-neutral-500 text-white text-xs font-medium rounded-md">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col">
            {/* Brand */}
            <div className="min-h-[1.25rem] mb-1">
              {product.brand && (
                <p className="text-sm text-neutral-500">{product.brand}</p>
              )}
            </div>

            {/* Name */}
            <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-900 transition-colors min-h-[3rem] flex items-start">
              {product.name}
            </h3>

            {/* Short Description */}
            <div className="min-h-[2.5rem] mb-3">
              {product.shortDescription ? (
                <p className="text-sm text-neutral-600 line-clamp-2">
                  {product.shortDescription}
                </p>
              ) : (
                <p className="text-sm text-neutral-600 line-clamp-2">
                  {product.description || ''}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-3 min-h-[1.5rem]">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating?.average || 0)}
              </div>
              <span className="text-sm text-neutral-500">
                ({product.rating?.count || 0})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-4 min-h-[1.75rem]">
              {product.comparePrice && product.comparePrice > product.price ? (
                <>
                  <span className="text-lg font-bold text-red-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-neutral-500 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4 min-h-[1.25rem] flex items-center">
              {product.inventory?.quantity > 0 ? (
                <span className="text-sm text-green-600 font-medium">
                  ✓ In Stock
                  {product.inventory.quantity <= (product.inventory.lowStockThreshold || 10) && (
                    <span className="text-amber-600 ml-1">
                      (Only {product.inventory.quantity} left)
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-sm text-red-600 font-medium">
                  ✗ Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="px-4 pb-4 mt-auto">
        <div className="flex items-center space-x-2 h-10">
          <Link
            to={productUrl}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">View Detail</span>
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={!(product.inventory?.quantity > 0) || isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium transition-colors text-sm border ${
              (product.inventory?.quantity > 0) && !isLoading
                ? 'bg-primary-600 hover:bg-primary-700 text-white border-primary-600'
                : 'bg-neutral-200 text-neutral-500 cursor-not-allowed border-neutral-200'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {(product.inventory?.quantity > 0) ? 'Add to Cart' : 'Out of Stock'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
