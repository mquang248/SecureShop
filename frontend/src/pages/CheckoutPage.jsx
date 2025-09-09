import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Shield, CreditCard, MapPin, Truck, AlertCircle } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import api from '../utils/api'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('stripe')

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Vietnam'
    }
  })

  useEffect(() => {
    if (!cart?.items || cart.items.length === 0) {
      navigate('/cart')
    }
  }, [cart, navigate])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const shippingCost = cart?.subtotal >= 50 ? 0 : 9.99
  const taxAmount = (cart?.subtotal || 0) * 0.08  // 8% tax
  const totalAmount = (cart?.subtotal || 0) + taxAmount + shippingCost - (cart?.discount || 0)

  const onSubmit = async (data) => {
    setIsProcessing(true)
    try {
      const orderData = {
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          address1: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode || '',
          country: data.country,
          phone: data.phone,
          email: data.email
        },
        paymentMethod,
        notes: data.notes || '',
        items: cart.items.map(item => ({
          product: item.product._id,
          variant: item.variant?._id,
          quantity: item.quantity,
          price: item.priceAtTime || item.product?.price || 0
        })),
        subtotal: cart.subtotal,
        tax: taxAmount,
        shippingCost,
        discount: cart.discount || 0,
        total: totalAmount
      }

      const response = await api.post('/orders', orderData)
      
      if (response.data.success) {
        await clearCart()
        showToast('Order placed successfully!', 'success')
        navigate(`/orders/${response.data.data._id}`)
      }
    } catch (error) {
      console.error('Order creation error:', error.response?.data)
      const errorMessage = error.response?.data?.details 
        ? error.response.data.details.map(d => d.msg).join(', ')
        : error.response?.data?.message || 'An error occurred while placing order'
      showToast(errorMessage, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!cart?.items || cart.items.length === 0) {
    return null
  }

  return (
    <>
      <Helmet>
        <title>Secure Checkout - SecureShop</title>
        <meta name="description" content="Secure checkout with multiple payment methods and complete shipping information" />
      </Helmet>

      <div className="container-width section-padding py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Checkout</h1>
            <div className="flex items-center space-x-2 text-green-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Payment is encrypted and secure</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Forms */}
              <div className="space-y-8">
                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-card p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-6">Contact Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        {...register('firstName', { required: 'Please enter first name' })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.firstName ? 'border-red-500' : 'border-neutral-300'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        {...register('lastName', { required: 'Please enter last name' })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.lastName ? 'border-red-500' : 'border-neutral-300'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Please enter email',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email không hợp lệ'
                        }
                      })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Please enter phone number' })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-card p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-neutral-900">Shipping Address</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        {...register('address', { required: 'Please enter address' })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.address ? 'border-red-500' : 'border-neutral-300'
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          {...register('city', { required: 'Please enter city' })}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.city ? 'border-red-500' : 'border-neutral-300'
                          }`}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          State/Province *
                        </label>
                        <input
                          type="text"
                          {...register('state', { required: 'Please enter state/province' })}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.state ? 'border-red-500' : 'border-neutral-300'
                          }`}
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Mã bưu điện
                        </label>
                        <input
                          type="text"
                          {...register('zipCode')}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Country *
                        </label>
                        <select
                          {...register('country', { required: 'Please select country' })}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="Vietnam">Vietnam</option>
                          <option value="USA">United States</option>
                          <option value="Canada">Canada</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-card p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-neutral-900">Payment Method</h2>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50">
                      <input
                        type="radio"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary-600"
                      />
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Thẻ tín dụng/ghi nợ</div>
                        <div className="text-sm text-neutral-600">Visa, Mastercard, American Express</div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50">
                      <input
                        type="radio"
                        value="momo"
                        checked={paymentMethod === 'momo'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary-600"
                      />
                      <Truck className="w-5 h-5" />
                      <div>
                        <div className="font-medium">MoMo Payment</div>
                        <div className="text-sm text-neutral-600">Pay via MoMo digital wallet</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-card p-6 sticky top-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-6">Your Order</h2>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden">
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <AlertCircle className="w-6 h-6 text-neutral-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-neutral-900 truncate">
                            {item.product.name}
                          </h3>
                          {item.variant && (
                            <p className="text-xs text-neutral-600">
                              {item.variant.name}
                            </p>
                          )}
                          <p className="text-xs text-neutral-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-neutral-900">
                          {formatPrice((item.priceAtTime || item.product?.price || 0) * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Tạm tính</span>
                      <span className="font-medium">{formatPrice(cart.subtotal || 0)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Phí vận chuyển</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? 'Miễn phí' : formatPrice(shippingCost)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-neutral-600">Thuế (8%)</span>
                      <span className="font-medium">{formatPrice(taxAmount)}</span>
                    </div>

                    {cart.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá</span>
                        <span>-{formatPrice(cart.discount)}</span>
                      </div>
                    )}

                    <hr />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-primary-600">{formatPrice(totalAmount)}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full mt-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <LoadingSpinner size="small" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>Place Order</span>
                      </>
                    )}
                  </button>

                  {/* Security Note */}
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-700">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Giao dịch được bảo mật</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Your payment information is encrypted with 256-bit SSL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CheckoutPage
