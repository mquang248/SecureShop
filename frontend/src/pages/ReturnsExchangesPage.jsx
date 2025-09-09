import React, { useState } from 'react'
import { RotateCcw, Package, CheckCircle, AlertCircle, Clock, Shield, CreditCard, Truck } from 'lucide-react'

const ReturnsExchangesPage = () => {
  const [activeTab, setActiveTab] = useState('returns')

  const returnProcess = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Start your return request online or contact customer service',
      time: '5 minutes'
    },
    {
      step: 2,
      title: 'Receive RMA',
      description: 'Get your Return Merchandise Authorization number',
      time: '24 hours'
    },
    {
      step: 3,
      title: 'Package & Ship',
      description: 'Pack items securely and ship using provided label',
      time: '1-3 days'
    },
    {
      step: 4,
      title: 'Processing',
      description: 'We inspect and process your return',
      time: '3-5 days'
    },
    {
      step: 5,
      title: 'Refund Issued',
      description: 'Refund processed to original payment method',
      time: '2-3 days'
    }
  ]

  const returnReasons = [
    { reason: 'Defective Product', refundType: 'Full Refund + Free Return Shipping', timeLimit: '30 days' },
    { reason: 'Wrong Item Received', refundType: 'Full Refund + Free Return Shipping', timeLimit: '30 days' },
    { reason: 'Not as Described', refundType: 'Full Refund + Free Return Shipping', timeLimit: '30 days' },
    { reason: 'Changed Mind', refundType: 'Full Refund (Customer Pays Return Shipping)', timeLimit: '30 days' },
    { reason: 'Better Price Found', refundType: 'Price Match or Full Refund', timeLimit: '14 days' },
    { reason: 'Compatibility Issues', refundType: 'Full Refund or Exchange', timeLimit: '30 days' }
  ]

  const nonReturnableItems = [
    'Software licenses (once activated)',
    'Digital downloads',
    'Custom-configured hardware',
    'Items damaged by misuse',
    'Products older than 30 days',
    'Items without original packaging'
  ]

  const exchangeTypes = [
    {
      type: 'Size/Model Exchange',
      description: 'Switch to different size or model of same product',
      fee: 'Free (within 30 days)',
      time: '5-7 business days'
    },
    {
      type: 'Product Upgrade',
      description: 'Upgrade to higher-tier product',
      fee: 'Pay difference + $10 restocking',
      time: '7-10 business days'
    },
    {
      type: 'Different Product',
      description: 'Exchange for completely different product',
      fee: 'Free if same value, pay/refund difference',
      time: '7-10 business days'
    },
    {
      type: 'Warranty Exchange',
      description: 'Replace defective item under warranty',
      fee: 'Free (expedited shipping available)',
      time: '2-3 business days'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Returns & <span className="text-accent-500">Exchanges</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-200 mb-8">
              Hassle-free returns and exchanges for your peace of mind
            </p>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              We stand behind every product we sell. If you're not completely satisfied 
              with your purchase, we'll make it right with our comprehensive return and exchange policy.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container-width section-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-accent-500">30 Days</div>
              <div className="text-neutral-600 text-sm">Return Window</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-500">Free</div>
              <div className="text-neutral-600 text-sm">Return Shipping*</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-500">24 Hours</div>
              <div className="text-neutral-600 text-sm">RMA Processing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-500">2-3 Days</div>
              <div className="text-neutral-600 text-sm">Refund Processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 bg-white">
        <div className="container-width section-padding">
          <div className="flex justify-center">
            <div className="flex bg-neutral-100 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('returns')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'returns'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                Returns
              </button>
              <button
                onClick={() => setActiveTab('exchanges')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'exchanges'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                Exchanges
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Returns Tab */}
      {activeTab === 'returns' && (
        <>
          {/* Return Process */}
          <section className="py-16 bg-neutral-50">
            <div className="container-width section-padding">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-primary-800 mb-4">
                    How Returns Work
                  </h2>
                  <p className="text-lg text-neutral-600">
                    Simple 5-step process to return your items
                  </p>
                </div>

                <div className="space-y-8">
                  {returnProcess.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold mr-6">
                        {step.step}
                      </div>
                      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-primary-700">{step.title}</h3>
                          <span className="text-sm text-accent-600 font-medium">{step.time}</span>
                        </div>
                        <p className="text-neutral-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Return Reasons & Policies */}
          <section className="py-16 bg-white">
            <div className="container-width section-padding">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-primary-800 mb-4">
                    Return Policies by Reason
                  </h2>
                  <p className="text-lg text-neutral-600">
                    Different return reasons have different policies
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                    <thead className="bg-primary-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-primary-700 font-bold">Return Reason</th>
                        <th className="px-6 py-4 text-left text-primary-700 font-bold">Refund Policy</th>
                        <th className="px-6 py-4 text-left text-primary-700 font-bold">Time Limit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnReasons.map((item, index) => (
                        <tr key={index} className="border-t border-neutral-100">
                          <td className="px-6 py-4 text-neutral-700 font-medium">{item.reason}</td>
                          <td className="px-6 py-4 text-neutral-600">{item.refundType}</td>
                          <td className="px-6 py-4 text-neutral-600">{item.timeLimit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Non-Returnable Items */}
          <section className="py-16 bg-neutral-50">
            <div className="container-width section-padding">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-primary-800 mb-4">
                    Non-Returnable Items
                  </h2>
                  <p className="text-lg text-neutral-600">
                    Items that cannot be returned for hygiene, security, or technical reasons
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    {nonReturnableItems.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                        <span className="text-neutral-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start">
                      <AlertCircle className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-amber-800 mb-2">Special Cases</h4>
                        <p className="text-amber-700 text-sm">
                          Even non-returnable items may be eligible for return if they arrive defective, 
                          damaged, or not as described. Contact our support team for assistance with 
                          special circumstances.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Exchanges Tab */}
      {activeTab === 'exchanges' && (
        <>
          {/* Exchange Types */}
          <section className="py-16 bg-neutral-50">
            <div className="container-width section-padding">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-primary-800 mb-4">
                    Exchange Options
                  </h2>
                  <p className="text-lg text-neutral-600">
                    Multiple exchange options to meet your needs
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {exchangeTypes.map((exchange, index) => (
                    <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                      <h3 className="text-xl font-bold text-primary-700 mb-4">{exchange.type}</h3>
                      <p className="text-neutral-600 mb-6">{exchange.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">Processing Fee:</span>
                          <span className="font-medium text-primary-600">{exchange.fee}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">Processing Time:</span>
                          <span className="font-medium text-primary-600">{exchange.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Exchange Process */}
          <section className="py-16 bg-white">
            <div className="container-width section-padding">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-primary-800 mb-4">
                    Exchange Process
                  </h2>
                  <p className="text-lg text-neutral-600">
                    How exchanges work step by step
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary-700 mb-2">Contact Us</h4>
                        <p className="text-neutral-600 text-sm">
                          Reach out to customer service to discuss your exchange options and get approval.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary-700 mb-2">Send Original Item</h4>
                        <p className="text-neutral-600 text-sm">
                          Package and ship your original item using our prepaid return label.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary-700 mb-2">Process Payment</h4>
                        <p className="text-neutral-600 text-sm">
                          We'll charge or refund any price difference and process exchange fees if applicable.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-sm font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary-700 mb-2">Ship New Item</h4>
                        <p className="text-neutral-600 text-sm">
                          Your replacement item ships as soon as we receive and process your return.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 p-8 rounded-xl">
                    <h3 className="text-xl font-bold text-primary-700 mb-6">Exchange Benefits</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-neutral-700">Faster than return + new order</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-neutral-700">Preserve original order discounts</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-neutral-700">Priority processing</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-neutral-700">Free shipping on replacement</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-neutral-700">Dedicated exchange support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Contact CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-width section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Need Help with Returns or Exchanges?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Our customer service team is here to make the process as smooth as possible
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-6 rounded-xl">
                <Package className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Start Return</h3>
                <p className="text-sm text-primary-100 mb-4">Begin your return process online</p>
                <button className="w-full bg-white text-primary-600 py-2 px-4 rounded-lg hover:bg-neutral-100 transition-colors">
                  Start Return
                </button>
              </div>
              
              <div className="bg-white/10 p-6 rounded-xl">
                <RotateCcw className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Request Exchange</h3>
                <p className="text-sm text-primary-100 mb-4">Exchange for a different item</p>
                <button className="w-full bg-white text-primary-600 py-2 px-4 rounded-lg hover:bg-neutral-100 transition-colors">
                  Request Exchange
                </button>
              </div>
              
              <div className="bg-white/10 p-6 rounded-xl">
                <Shield className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Contact Support</h3>
                <p className="text-sm text-primary-100 mb-4">Speak with our experts</p>
                <button className="w-full bg-white text-primary-600 py-2 px-4 rounded-lg hover:bg-neutral-100 transition-colors">
                  Get Help
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ReturnsExchangesPage
