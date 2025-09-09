import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Calendar,
  CreditCard,
  MapPin,
  Download,
  ArrowLeft,
  Phone,
  Mail,
  Eye,
  RotateCcw,
  Star,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react'
import api from '../utils/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useToast } from '../contexts/ToastContext'

const OrderDetailsPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [copiedTracking, setCopiedTracking] = useState(false)

  // Fetch order details
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: async () => {
      const response = await api.get(`/orders/${orderId}`)
      return response.data.data
    }
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />
      case 'processing':
        return <Package className="w-6 h-6 text-blue-500" />
      case 'shipped':
        return <Truck className="w-6 h-6 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />
      default:
        return <Package className="w-6 h-6 text-neutral-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    // Ensure price is a number and handle undefined/null values
    const numPrice = Number(price) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numPrice)
  }

  const copyTrackingNumber = async () => {
    if (order?.trackingNumber) {
      try {
        await navigator.clipboard.writeText(order.trackingNumber)
        setCopiedTracking(true)
        showToast('Tracking number copied to clipboard', 'success')
        setTimeout(() => setCopiedTracking(false), 2000)
      } catch (err) {
        showToast('Failed to copy tracking number', 'error')
      }
    }
  }

  const getOrderTimeline = () => {
    const timeline = [
      {
        status: 'pending',
        label: 'Order Placed',
        date: order?.createdAt,
        completed: true
      },
      {
        status: 'processing',
        label: 'Processing',
        date: order?.processingDate,
        completed: ['processing', 'shipped', 'delivered'].includes(order?.status)
      },
      {
        status: 'shipped',
        label: 'Shipped',
        date: order?.shippedDate,
        completed: ['shipped', 'delivered'].includes(order?.status)
      },
      {
        status: 'delivered',
        label: 'Delivered',
        date: order?.deliveredDate,
        completed: order?.status === 'delivered'
      }
    ]

    if (order?.status === 'cancelled') {
      return [
        timeline[0],
        {
          status: 'cancelled',
          label: 'Cancelled',
          date: order?.cancelledDate,
          completed: true
        }
      ]
    }

    return timeline
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container-width">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container-width">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <XCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">Order Not Found</h3>
            <p className="text-neutral-500 mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link
              to="/orders"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium inline-flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Order #{order._id.slice(-8)} - SecureShop</title>
        <meta name="description" content={`Order details for order #${order._id.slice(-8)}`} />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container-width">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center text-primary-600 hover:text-primary-700 mb-4 font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Orders
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary-900 mb-2">
                  Order #{order._id.slice(-8)}
                </h1>
                <p className="text-neutral-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className={`px-4 py-2 rounded-lg border text-lg font-medium ${getStatusColor(order.status)}`}>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Timeline */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-primary-900 mb-6">Order Timeline</h2>
                
                <div className="space-y-6">
                  {getOrderTimeline().map((step, index) => (
                    <div key={step.status} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-neutral-100 text-neutral-400'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Clock className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${
                            step.completed ? 'text-primary-900' : 'text-neutral-500'
                          }`}>
                            {step.label}
                          </h3>
                          {step.date && (
                            <span className="text-sm text-neutral-500">
                              {formatDate(step.date)}
                            </span>
                          )}
                        </div>
                        
                        {step.status === 'shipped' && order.trackingNumber && (
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="text-sm text-neutral-600">
                              Tracking: {order.trackingNumber}
                            </span>
                            <button
                              onClick={copyTrackingNumber}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              {copiedTracking ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-primary-900 mb-6">Order Items</h2>
                
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-neutral-200 rounded-lg">
                      <div className="w-20 h-20 bg-neutral-100 rounded-lg flex items-center justify-center">
                        <Package className="w-10 h-10 text-neutral-400" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary-900">{item.product.name}</h3>
                        <p className="text-neutral-600 text-sm mt-1">{item.product.category}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-neutral-600">Qty: {item.quantity}</span>
                          <span className="text-sm font-medium text-primary-900">
                            {formatPrice(item.price || item.priceAtTime || 0)} each
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-primary-900 text-lg">
                          {formatPrice((item.price || item.priceAtTime || 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-neutral-200 mt-6 pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(order.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Shipping</span>
                      <span className="font-medium">{formatPrice(order.shippingCost || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Tax</span>
                      <span className="font-medium">{formatPrice(order.tax || 0)}</span>
                    </div>
                    <div className="border-t border-neutral-200 pt-2 flex justify-between">
                      <span className="text-lg font-bold text-primary-900">Total</span>
                      <span className="text-lg font-bold text-primary-900">
                        {formatPrice(order.total || order.totalAmount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold text-primary-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  {order.status === 'delivered' && (
                    <>
                      <button className="w-full bg-primary-100 text-primary-700 px-4 py-3 rounded-lg hover:bg-primary-200 transition-colors font-medium flex items-center justify-center">
                        <Download className="w-5 h-5 mr-2" />
                        Download Invoice
                      </button>
                      <button className="w-full bg-green-100 text-green-700 px-4 py-3 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center justify-center">
                        <Star className="w-5 h-5 mr-2" />
                        Leave Review
                      </button>
                      <button className="w-full bg-yellow-100 text-yellow-700 px-4 py-3 rounded-lg hover:bg-yellow-200 transition-colors font-medium flex items-center justify-center">
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Return Items
                      </button>
                    </>
                  )}
                  
                  {(order.status === 'pending' || order.status === 'processing') && (
                    <button className="w-full bg-red-100 text-red-700 px-4 py-3 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center justify-center">
                      <XCircle className="w-5 h-5 mr-2" />
                      Cancel Order
                    </button>
                  )}

                  <button className="w-full bg-neutral-100 text-neutral-700 px-4 py-3 rounded-lg hover:bg-neutral-200 transition-colors font-medium flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contact Support
                  </button>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-bold text-primary-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </h3>
                  
                  <div className="text-sm text-neutral-700 space-y-1">
                    <p className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && (
                      <p className="flex items-center mt-2">
                        <Phone className="w-4 h-4 mr-2" />
                        {order.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold text-primary-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </h3>
                
                <div className="text-sm text-neutral-700 space-y-2">
                  <p>
                    <span className="font-medium">Method:</span> Card ending in ****{order.paymentMethod?.last4 || '1234'}
                  </p>
                  <p>
                    <span className="font-medium">Paid:</span> {formatDate(order.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span> {formatPrice(order.total || order.totalAmount || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetailsPage
