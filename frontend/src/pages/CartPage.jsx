import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { getProductUrl } from '../utils/productMapping'

const CartPage = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    isLoading,
    total 
  } = useCart()
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()

  const formatPrice = (price) => {
    // Ensure price is a number and convert to USD format
    const numPrice = Number(price) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numPrice)
  }

  // Calculate tax and totals
  const subtotal = cart?.subtotal || 0
  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax rate
  const totalWithTax = subtotal + shipping + tax

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId)
      return
    }

    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId)
      showToast('Product removed from cart', 'success')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to remove all products?')) {
      try {
        await clearCart()
        showToast('All products removed', 'success')
      } catch (error) {
        showToast(error.message, 'error')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container-width section-padding py-12">
        <div className="flex justify-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  // Show login message if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - SecureShop</title>
        </Helmet>

        <div className="container-width section-padding py-12">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="w-24 h-24 text-neutral-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Sign in to view your cart</h1>
            <p className="text-neutral-600 mb-8">
              You need to sign in to view and manage your shopping cart.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/login"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Sign In</span>
              </Link>
              <Link 
                to="/shop"
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - SecureShop</title>
        </Helmet>

        <div className="container-width section-padding py-12">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="w-24 h-24 text-neutral-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Your cart is empty</h1>
            <p className="text-neutral-600 mb-8">
              You don't have any products in your cart yet. Discover our amazing products!
            </p>
            <Link 
              to="/shop"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{`Giỏ hàng (${cart?.items?.length || 0}) - SecureShop`}</title>
      </Helmet>

      <div className="container-width section-padding py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Shopping Cart ({cart?.items?.length || 0} items)
          </h1>
          {cart?.items?.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa tất cả</span>
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart?.items?.map((item) => (
              <div 
                key={item._id}
                className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-card"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden">
                  {item.product.images?.[0] ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-neutral-400" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link 
                    to={getProductUrl(item.product._id)}
                    className="text-lg font-semibold text-neutral-900 hover:text-primary-600 transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  {item.variant && (
                    <p className="text-sm text-neutral-600 mt-1">
                      Phân loại: {item.variant.name}
                    </p>
                  )}
                  <p className="text-neutral-600 mt-1">
                    SKU: {item.product.sku}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-semibold text-neutral-900">
                    {formatPrice(item.priceAtTime || item.product?.price || 0)}
                  </p>
                  {item.product?.salePrice && item.product.salePrice < item.product.price && (
                    <p className="text-sm text-neutral-500 line-through">
                      {formatPrice(item.product.price)}
                    </p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    className="p-1 hover:bg-neutral-100 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center py-1 border border-neutral-300 rounded">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    className="p-1 hover:bg-neutral-100 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Total for this item */}
                <div className="text-right min-w-[100px]">
                  <p className="text-lg font-bold text-primary-600">
                    {formatPrice((item.priceAtTime || item.product?.price || 0) * item.quantity)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tạm tính</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-600">Phí vận chuyển</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-600">Tax (8%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>

                {cart?.discount && cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(cart.discount)}</span>
                  </div>
                )}

                <hr className="border-neutral-200" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary-600">{formatPrice(totalWithTax)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  to="/checkout"
                  className="w-full btn-primary text-center block"
                >
                  Tiến hành thanh toán
                </Link>
                
                <Link
                  to="/shop"
                  className="w-full btn-secondary text-center block"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Tax Information */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <span className="font-medium">Note:</span> Tax is calculated at 8% of the total product value.
                </p>
              </div>

              {/* Security Badge */}
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Your information is encrypted and protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CartPage
