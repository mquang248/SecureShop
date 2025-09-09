import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
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
  Search,
  Filter,
  Eye,
  RotateCcw,
  Star,
  MessageCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const OrdersPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState('all')

  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['user-orders', selectedStatus, timeFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      if (timeFilter !== 'all') params.append('timeFilter', timeFilter)
      
      const response = await api.get(`/orders/user?${params}`)
      return response.data.data
    }
  })

  // Filter orders based on search query
  const filteredOrders = orders?.filter(order => 
    order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => 
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || []

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Package className="w-5 h-5 text-neutral-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  return (
    <>
      <Helmet>
        <title>My Orders - SecureShop</title>
        <meta name="description" content="View and manage your order history, track shipments, and download invoices." />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container-width">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">My Orders</h1>
            <p className="text-neutral-600">Track and manage your order history</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Time Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Time</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 3 Months</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-center text-sm text-neutral-600">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Orders Found</h3>
              <p className="text-neutral-500 mb-6">
                {searchQuery || selectedStatus !== 'all' || timeFilter !== 'all' 
                  ? 'Try adjusting your filters to see more results.'
                  : "You haven't placed any orders yet."
                }
              </p>
              {!searchQuery && selectedStatus === 'all' && timeFilter === 'all' && (
                <Link
                  to="/shop"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium inline-flex items-center"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Start Shopping
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div>
                          <h3 className="font-semibold text-primary-900">Order #{order._id.slice(-8)}</h3>
                          <p className="text-sm text-neutral-600">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-primary-900">
                          {formatPrice(order.total || order.totalAmount || 0)}
                        </span>
                        <div className="flex space-x-2">
                          <Link
                            to={`/orders/${order._id}`}
                            className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                          {order.status === 'delivered' && (
                            <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center">
                              <Download className="w-4 h-4 mr-2" />
                              Invoice
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg">
                          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border">
                            <Package className="w-8 h-8 text-neutral-400" />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-primary-900">{item.product.name}</h4>
                            <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
                            <p className="text-sm font-medium text-primary-900">
                              {formatPrice(item.price || item.priceAtTime || 0)} each
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-primary-900">
                              {formatPrice((item.price || item.priceAtTime || 0) * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Info */}
                    {order.shippingAddress && (
                      <div className="mt-6 pt-6 border-t border-neutral-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              Shipping Address
                            </h4>
                            <div className="text-sm text-neutral-600">
                              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                              <p>{order.shippingAddress.street}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Payment Method
                            </h4>
                            <div className="text-sm text-neutral-600">
                              <p>Card ending in ****{order.paymentMethod?.last4 || '1234'}</p>
                              <p>Paid on {formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Actions */}
                    <div className="mt-6 pt-6 border-t border-neutral-200 flex flex-wrap gap-3">
                      {order.status === 'delivered' && (
                        <>
                          <button className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium flex items-center">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Return Items
                          </button>
                          <button className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium flex items-center">
                            <Star className="w-4 h-4 mr-2" />
                            Leave Review
                          </button>
                        </>
                      )}
                      
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center">
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel Order
                        </button>
                      )}

                      <button className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default OrdersPage
