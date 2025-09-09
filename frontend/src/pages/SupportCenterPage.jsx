import React, { useState } from 'react'
import { MessageCircle, Phone, Mail, Clock, Search, BookOpen, Video, Download, Users, AlertCircle, CheckCircle, ArrowRight, Package, CreditCard, User, Settings, Info } from 'lucide-react'

const SupportCenterPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const supportCategories = [
    { id: 'all', name: 'All Topics', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'orders', name: 'Orders & Shipping', icon: <Package className="w-4 h-4" /> },
    { id: 'payments', name: 'Payments & Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'account', name: 'Account Issues', icon: <User className="w-4 h-4" /> },
    { id: 'technical', name: 'Technical Support', icon: <Settings className="w-4 h-4" /> },
    { id: 'products', name: 'Product Information', icon: <Info className="w-4 h-4" /> }
  ]

  const quickActions = [
    {
      title: 'Track Your Order',
      description: 'Get real-time updates on your order status',
      icon: <Package className="w-8 h-8 text-blue-600" />,
      action: 'Track Order',
      link: '/track-order'
    },
    {
      title: 'Start Live Chat',
      description: 'Chat with our support team instantly',
      icon: <MessageCircle className="w-8 h-8 text-green-600" />,
      action: 'Start Chat',
      link: '#'
    },
    {
      title: 'Call Support',
      description: 'Speak directly with our experts',
      icon: <Phone className="w-8 h-8 text-purple-600" />,
      action: 'Call Now',
      link: 'tel:0987654321'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: <Mail className="w-8 h-8 text-orange-600" />,
      action: 'Send Email',
      link: 'mailto:support@secureshop.com'
    }
  ]

  const supportChannels = [
    {
      name: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 24/7',
      responseTime: 'Immediate',
      icon: <MessageCircle className="w-6 h-6 text-green-600" />,
      status: 'online'
    },
    {
      name: 'Phone Support',
      description: 'Speak directly with our experts',
      availability: 'Mon-Fri 9AM-6PM ICT',
      responseTime: 'Immediate',
      icon: <Phone className="w-6 h-6 text-blue-600" />,
      phone: '0987654321'
    },
    {
      name: 'Email Support',
      description: 'Send us detailed questions or concerns',
      availability: 'Available 24/7',
      responseTime: '2-4 hours',
      icon: <Mail className="w-6 h-6 text-purple-600" />,
      email: 'support@secureshop.com'
    },
    {
      name: 'Video Call',
      description: 'Schedule a video consultation',
      availability: 'By appointment',
      responseTime: 'Same day',
      icon: <Video className="w-6 h-6 text-orange-600" />,
      status: 'schedule'
    }
  ]

  const popularTopics = [
    {
      title: 'How to track my order?',
      category: 'orders',
      views: 1250,
      description: 'Learn how to track your order status and delivery updates'
    },
    {
      title: 'Payment methods accepted',
      category: 'payments',
      views: 980,
      description: 'See all payment options available for your region'
    },
    {
      title: 'How to reset my password?',
      category: 'account',
      views: 875,
      description: 'Step-by-step guide to reset your account password'
    },
    {
      title: 'Return and exchange policy',
      category: 'orders',
      views: 750,
      description: 'Everything you need to know about returns and exchanges'
    },
    {
      title: 'Product compatibility guide',
      category: 'products',
      views: 620,
      description: 'Check if products are compatible with your system'
    },
    {
      title: 'Installation troubleshooting',
      category: 'technical',
      views: 580,
      description: 'Common installation issues and solutions'
    }
  ]

  const selfServiceTools = [
    {
      title: 'Knowledge Base',
      description: 'Browse our comprehensive help articles',
      icon: <BookOpen className="w-6 h-6" />,
      articles: '500+ articles'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: <Video className="w-6 h-6" />,
      articles: '50+ videos'
    },
    {
      title: 'Downloads',
      description: 'Get manuals, drivers, and software',
      icon: <Download className="w-6 h-6" />,
      articles: '100+ files'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users and experts',
      icon: <Users className="w-6 h-6" />,
      articles: '1000+ topics'
    }
  ]

  const filteredTopics = popularTopics.filter(topic => {
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Support <span className="text-accent-500">Center</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-200 mb-8">
              We're here to help you 24/7
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles, guides, or FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-neutral-900 placeholder-neutral-500 focus:ring-2 focus:ring-accent-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="container-width section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">Quick Actions</h2>
            <p className="text-lg text-neutral-600">Get help instantly with these quick options</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div key={index} className="bg-neutral-50 p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {action.icon}
                  </div>
                  <h3 className="font-bold text-primary-700 mb-2">{action.title}</h3>
                  <p className="text-neutral-600 text-sm mb-4">{action.description}</p>
                  <button className="w-full bg-accent-600 text-white py-2 px-4 rounded-lg hover:bg-accent-700 transition-colors">
                    {action.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16 bg-neutral-50">
        <div className="container-width section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">Contact Our Support Team</h2>
            <p className="text-lg text-neutral-600">Choose the best way to reach us</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {channel.icon}
                  <h3 className="font-bold text-primary-700 ml-3">{channel.name}</h3>
                  {channel.status === 'online' && (
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                        Online
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-neutral-600 text-sm mb-4">{channel.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Availability:</span>
                    <span className="font-medium">{channel.availability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Response:</span>
                    <span className="font-medium">{channel.responseTime}</span>
                  </div>
                  {channel.phone && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Phone:</span>
                      <a href={`tel:${channel.phone}`} className="font-medium text-accent-600 hover:text-accent-700">
                        {channel.phone}
                      </a>
                    </div>
                  )}
                  {channel.email && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Email:</span>
                      <a href={`mailto:${channel.email}`} className="font-medium text-accent-600 hover:text-accent-700">
                        {channel.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-white">
        <div className="container-width section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">Popular Help Topics</h2>
            <p className="text-lg text-neutral-600">Find answers to commonly asked questions</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {supportCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-accent-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic, index) => (
              <div key={index} className="bg-neutral-50 p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-primary-700 flex-1">{topic.title}</h3>
                  <ArrowRight className="w-4 h-4 text-neutral-400 ml-2" />
                </div>
                <p className="text-neutral-600 text-sm mb-4">{topic.description}</p>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="capitalize">{topic.category}</span>
                  <span>{topic.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Self-Service Tools */}
      <section className="py-16 bg-neutral-50">
        <div className="container-width section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">Self-Service Resources</h2>
            <p className="text-lg text-neutral-600">Find answers on your own with these helpful resources</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selfServiceTools.map((tool, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-accent-100 text-accent-600 rounded-lg">
                    {tool.icon}
                  </div>
                </div>
                <h3 className="font-bold text-primary-700 mb-2">{tool.title}</h3>
                <p className="text-neutral-600 text-sm mb-4">{tool.description}</p>
                <div className="text-accent-600 font-medium text-sm mb-4">{tool.articles}</div>
                <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                  Browse Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-width section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl text-primary-100 mb-8">
              Our support team is available 24/7 to assist you with any questions or concerns
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-6 rounded-xl">
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Call Us</h3>
                <p className="text-sm text-primary-100 mb-2">Mon-Fri 9AM-6PM ICT</p>
                <a href="tel:0987654321" className="text-accent-300 font-bold">0987654321</a>
              </div>
              
              <div className="bg-white/10 p-6 rounded-xl">
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Email Us</h3>
                <p className="text-sm text-primary-100 mb-2">We respond within 2-4 hours</p>
                <a href="mailto:support@secureshop.com" className="text-accent-300 font-bold">support@secureshop.com</a>
              </div>
              
              <div className="bg-white/10 p-6 rounded-xl">
                <MessageCircle className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Live Chat</h3>
                <p className="text-sm text-primary-100 mb-2">Available 24/7</p>
                <button className="text-accent-300 font-bold">Start Chat</button>
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

export default SupportCenterPage
