import React, { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, AlertCircle, Info, Calendar, Copy, ExternalLink } from 'lucide-react'

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [trackingResult, setTrackingResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock tracking data for demonstration
  const mockTrackingData = {
    orderNumber: 'SO-2024-001234',
    status: 'in_transit',
    estimatedDelivery: '2024-01-15',
    trackingNumber: 'VN123456789US',
    carrier: 'Vietnam Post',
    orderDate: '2024-01-10',
    totalAmount: '$299.99',
    items: [
      { name: 'Security Camera System', quantity: 1, price: '$199.99' },
      { name: 'Motion Sensor', quantity: 2, price: '$50.00' }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Ho Chi Minh City, Viet Nam',
      phone: '0987654321'
    },
    timeline: [
      {
        status: 'Order Placed',
        date: '2024-01-10 14:30',
        description: 'Your order has been successfully placed and payment confirmed',
        completed: true,
        icon: <CheckCircle className="w-5 h-5" />
      },
      {
        status: 'Processing',
        date: '2024-01-11 09:15',
        description: 'Order is being prepared and packaged for shipment',
        completed: true,
        icon: <Package className="w-5 h-5" />
      },
      {
        status: 'Shipped',
        date: '2024-01-12 16:45',
        description: 'Package has been dispatched and is on its way to you',
        completed: true,
        icon: <Truck className="w-5 h-5" />
      },
      {
        status: 'In Transit',
        date: '2024-01-13 08:20',
        description: 'Package is currently in transit to your delivery address',
        completed: true,
        current: true,
        icon: <MapPin className="w-5 h-5" />
      },
      {
        status: 'Out for Delivery',
        date: 'Expected: 2024-01-15 AM',
        description: 'Package will be out for delivery',
        completed: false,
        icon: <Truck className="w-5 h-5" />
      },
      {
        status: 'Delivered',
        date: 'Expected: 2024-01-15',
        description: 'Package will be delivered to your address',
        completed: false,
        icon: <CheckCircle className="w-5 h-5" />
      }
    ]
  }

  const handleTrackOrder = (e) => {
    e.preventDefault()
    if (!orderNumber || !email) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setTrackingResult(mockTrackingData)
      setIsLoading(false)
    }, 1500)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'in_transit': return 'text-blue-600 bg-blue-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-neutral-600 bg-neutral-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered'
      case 'in_transit': return 'In Transit'
      case 'processing': return 'Processing'
      case 'shipped': return 'Shipped'
      case 'cancelled': return 'Cancelled'
      default: return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Track Your <span className="text-accent-500">Order</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-200 mb-8">
              Get real-time updates on your order status and delivery
            </p>
          </div>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="py-16">
        <div className="container-width section-padding">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-primary-800 mb-6 text-center">Enter Order Details</h2>
              
              <form onSubmit={handleTrackOrder} className="space-y-6">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                    Order Number
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g., SO-2024-001234"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-accent-700 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Tracking...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Search className="w-5 h-5 mr-2" />
                      Track Order
                    </div>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Can't find your order number?</p>
                    <p>Check your email confirmation or contact our support team at <strong>0987654321</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Results */}
      {trackingResult && (
        <section className="pb-16">
          <div className="container-width section-padding">
            <div className="max-w-4xl mx-auto">
              {/* Order Summary */}
              <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-primary-800">Order Details</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingResult.status)}`}>
                    {getStatusText(trackingResult.status)}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Order Number</p>
                    <div className="flex items-center">
                      <p className="font-bold text-primary-700">{trackingResult.orderNumber}</p>
                      <button
                        onClick={() => copyToClipboard(trackingResult.orderNumber)}
                        className="ml-2 text-neutral-400 hover:text-accent-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Tracking Number</p>
                    <div className="flex items-center">
                      <p className="font-bold text-primary-700">{trackingResult.trackingNumber}</p>
                      <button
                        onClick={() => copyToClipboard(trackingResult.trackingNumber)}
                        className="ml-2 text-neutral-400 hover:text-accent-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Estimated Delivery</p>
                    <p className="font-bold text-primary-700">{trackingResult.estimatedDelivery}</p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Carrier</p>
                    <p className="font-bold text-primary-700">{trackingResult.carrier}</p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h3 className="text-xl font-bold text-primary-800 mb-6">Tracking Timeline</h3>
                
                <div className="space-y-6">
                  {trackingResult.timeline.map((event, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        event.completed
                          ? event.current
                            ? 'bg-accent-600 text-white'
                            : 'bg-green-600 text-white'
                          : 'bg-neutral-200 text-neutral-400'
                      }`}>
                        {event.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-bold ${
                            event.completed ? 'text-primary-700' : 'text-neutral-500'
                          }`}>
                            {event.status}
                          </p>
                          <p className={`text-sm ${
                            event.completed ? 'text-neutral-600' : 'text-neutral-400'
                          }`}>
                            {event.date}
                          </p>
                        </div>
                        <p className={`text-sm ${
                          event.completed ? 'text-neutral-600' : 'text-neutral-400'
                        }`}>
                          {event.description}
                        </p>
                        {event.current && (
                          <div className="mt-2 p-2 bg-accent-50 border border-accent-200 rounded-lg">
                            <p className="text-sm text-accent-800">
                              <strong>Current Status:</strong> Your package is currently in transit and will be delivered soon.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h3 className="text-xl font-bold text-primary-800 mb-6">Order Items</h3>
                
                <div className="space-y-4">
                  {trackingResult.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-neutral-200 last:border-b-0">
                      <div>
                        <p className="font-medium text-primary-700">{item.name}</p>
                        <p className="text-sm text-neutral-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-primary-700">{item.price}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center">
                  <p className="font-bold text-lg text-primary-800">Total</p>
                  <p className="font-bold text-lg text-primary-800">{trackingResult.totalAmount}</p>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-primary-800 mb-6">Shipping Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-primary-700 mb-3">Delivery Address</h4>
                    <div className="text-neutral-600">
                      <p className="font-medium">{trackingResult.shippingAddress.name}</p>
                      <p>{trackingResult.shippingAddress.address}</p>
                      <p>Phone: {trackingResult.shippingAddress.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-primary-700 mb-3">Need Help?</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-neutral-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>Call us: </span>
                        <a href="tel:0987654321" className="text-accent-600 hover:text-accent-700 font-medium ml-1">
                          0987654321
                        </a>
                      </div>
                      <div className="flex items-center text-neutral-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>Email: </span>
                        <a href="mailto:support@secureshop.com" className="text-accent-600 hover:text-accent-700 font-medium ml-1">
                          support@secureshop.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-width section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need Additional Help?</h2>
            <p className="text-xl text-primary-100 mb-8">
              Our support team is available 24/7 to assist you with order tracking and delivery questions
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-6 rounded-xl">
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Call Support</h3>
                <p className="text-sm text-primary-100 mb-2">Mon-Fri 9AM-6PM ICT</p>
                <a href="tel:0987654321" className="text-accent-300 font-bold">0987654321</a>
              </div>
              
              <div className="bg-white/10 p-6 rounded-xl">
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Email Support</h3>
                <p className="text-sm text-primary-100 mb-2">We respond within 2-4 hours</p>
                <a href="mailto:support@secureshop.com" className="text-accent-300 font-bold">support@secureshop.com</a>
              </div>
              
              <div className="bg-white/10 p-6 rounded-xl">
                <ExternalLink className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Support Center</h3>
                <p className="text-sm text-primary-100 mb-2">Browse help articles</p>
                <a href="/support" className="text-accent-300 font-bold">Visit Support</a>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-xl">
              <h3 className="font-bold mb-2">Visit Our Office</h3>
              <p className="text-primary-100">
                123 Ho Chi Minh City, Viet Nam<br />
                Business Hours: Mon-Fri 9AM-6PM ICT
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TrackOrderPage
