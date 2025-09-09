import React from 'react'
import { Truck, Clock, Globe, Shield, Package, MapPin, AlertCircle, CheckCircle } from 'lucide-react'

const ShippingInfoPage = () => {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      price: '$9.99',
      time: '5-7 business days',
      description: 'Reliable delivery for non-urgent orders',
      icon: <Truck className="w-6 h-6" />
    },
    {
      name: 'Expedited Shipping',
      price: '$19.99',
      time: '2-3 business days',
      description: 'Faster delivery for urgent orders',
      icon: <Clock className="w-6 h-6" />
    },
    {
      name: 'Overnight Delivery',
      price: '$39.99',
      time: '1 business day',
      description: 'Next business day delivery',
      icon: <Package className="w-6 h-6" />
    },
    {
      name: 'International Shipping',
      price: '$29.99+',
      time: '7-14 business days',
      description: 'Global delivery with customs handling',
      icon: <Globe className="w-6 h-6" />
    }
  ]

  const restrictions = [
    {
      type: 'Restricted Items',
      items: [
        'Explosive materials',
        'Hazardous chemicals',
        'Weapons and ammunition',
        'Radioactive materials'
      ],
      icon: <AlertCircle className="w-6 h-6 text-red-500" />
    },
    {
      type: 'Special Handling',
      items: [
        'Fragile electronics',
        'Sensitive security equipment',
        'High-value items over $10,000',
        'Temperature-sensitive products'
      ],
      icon: <Shield className="w-6 h-6 text-amber-500" />
    }
  ]

  const trackingFeatures = [
    'Real-time location updates',
    'Delivery notifications',
    'Photo confirmation of delivery',
    'Signature required options',
    'Safe place delivery instructions',
    'Neighbor delivery options'
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Shipping <span className="text-accent-500">Information</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-200 mb-8">
              Fast, secure, and reliable delivery worldwide
            </p>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              We understand that security products are often time-sensitive. 
              That's why we've partnered with leading carriers to ensure your orders 
              arrive quickly and securely.
            </p>
          </div>
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="bg-accent-500 py-4">
        <div className="container-width section-padding">
          <div className="text-center text-white">
            <p className="text-lg font-medium">
              🚚 Free Standard Shipping on orders over $50! 
              <span className="ml-2 opacity-90">No code required</span>
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-16 bg-white">
        <div className="container-width section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 mb-4">
              Shipping Options
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Choose the delivery speed that works best for your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingOptions.map((option, index) => (
              <div key={index} className="bg-neutral-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-accent-100 text-accent-600 rounded-lg mr-3">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-700">{option.name}</h3>
                    <p className="text-accent-600 font-medium">{option.price}</p>
                  </div>
                </div>
                <p className="text-neutral-600 text-sm mb-3">{option.description}</p>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-neutral-400 mr-2" />
                  <span className="text-sm font-medium text-neutral-700">{option.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processing & Handling */}
      <section className="py-16 bg-neutral-50">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-800 mb-4">
                Order Processing & Handling
              </h2>
              <p className="text-lg text-neutral-600">
                Understanding our fulfillment process
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-primary-700 mb-6">Processing Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-600">Order Received</h4>
                      <p className="text-neutral-600 text-sm">Immediate confirmation and payment processing</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-600">Security Verification</h4>
                      <p className="text-neutral-600 text-sm">Authentication and fraud prevention checks (1-2 hours)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-600">Fulfillment</h4>
                      <p className="text-neutral-600 text-sm">Picking, packing, and quality control (2-4 hours)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-sm font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-600">Shipped</h4>
                      <p className="text-neutral-600 text-sm">Package handed to carrier with tracking information</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-primary-700 mb-6">Cutoff Times</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-accent-500 pl-4">
                    <h4 className="font-medium text-primary-600">Same-Day Processing</h4>
                    <p className="text-neutral-600 text-sm">Orders placed before 2:00 PM PST on business days</p>
                  </div>
                  <div className="border-l-4 border-neutral-300 pl-4">
                    <h4 className="font-medium text-primary-600">Next-Day Processing</h4>
                    <p className="text-neutral-600 text-sm">Orders placed after 2:00 PM PST or on weekends</p>
                  </div>
                  <div className="border-l-4 border-neutral-300 pl-4">
                    <h4 className="font-medium text-primary-600">Holiday Schedule</h4>
                    <p className="text-neutral-600 text-sm">No processing on federal holidays, resumed next business day</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h4 className="font-medium text-primary-600 mb-3">Business Hours</h4>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                    <p>Saturday: 10:00 AM - 4:00 PM PST</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Information */}
      <section className="py-16 bg-white">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-800 mb-4">
                Package Tracking
              </h2>
              <p className="text-lg text-neutral-600">
                Stay informed every step of the way
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-primary-700 mb-6">Tracking Features</h3>
                <div className="space-y-3">
                  {trackingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-neutral-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-primary-50 rounded-xl">
                  <h4 className="font-bold text-primary-700 mb-2">Pro Tip</h4>
                  <p className="text-neutral-700 text-sm">
                    Download our mobile app for push notifications and enhanced tracking features. 
                    You can also set up SMS alerts for delivery updates.
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 p-8 rounded-xl">
                <h3 className="text-xl font-bold text-primary-700 mb-6">How to Track</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-primary-600">Check Your Email</p>
                      <p className="text-neutral-600 text-sm">Tracking number sent when shipped</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-primary-600">Use Our Tracker</p>
                      <p className="text-neutral-600 text-sm">Enter tracking number on our website</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-primary-600">Get Updates</p>
                      <p className="text-neutral-600 text-sm">Real-time status and delivery notifications</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restrictions & Special Handling */}
      <section className="py-16 bg-neutral-50">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-800 mb-4">
                Shipping Restrictions & Special Handling
              </h2>
              <p className="text-lg text-neutral-600">
                Important information about restricted items and special requirements
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {restrictions.map((category, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="flex items-center mb-6">
                    {category.icon}
                    <h3 className="text-xl font-bold text-primary-700 ml-3">{category.type}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-neutral-700">
                        <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-amber-600 mr-3 mt-1" />
                <div>
                  <h4 className="font-bold text-amber-800 mb-2">Important Notice</h4>
                  <p className="text-amber-700 text-sm">
                    Some security products may require additional verification or special handling. 
                    Our team will contact you if your order requires additional documentation or 
                    has special shipping requirements. International orders may be subject to 
                    customs regulations and additional fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="py-16 bg-white">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">
              International Shipping
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              We ship to over 50 countries worldwide
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-neutral-50 p-6 rounded-xl">
                <Globe className="w-8 h-8 text-accent-500 mx-auto mb-3" />
                <h3 className="font-bold text-primary-700 mb-2">Global Coverage</h3>
                <p className="text-neutral-600 text-sm">Shipping to 50+ countries with local customs handling</p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-xl">
                <Shield className="w-8 h-8 text-accent-500 mx-auto mb-3" />
                <h3 className="font-bold text-primary-700 mb-2">Customs Support</h3>
                <p className="text-neutral-600 text-sm">We handle all customs documentation and declarations</p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-xl">
                <MapPin className="w-8 h-8 text-accent-500 mx-auto mb-3" />
                <h3 className="font-bold text-primary-700 mb-2">Local Delivery</h3>
                <p className="text-neutral-600 text-sm">Partnership with local carriers for final delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ShippingInfoPage
