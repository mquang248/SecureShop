import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Search, HelpCircle, Shield, CreditCard, Truck, User, Settings, AlertCircle } from 'lucide-react'

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [openFAQ, setOpenFAQ] = useState(null)

  const categories = [
    { id: 'all', name: 'All Topics', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'security', name: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'orders', name: 'Orders & Shipping', icon: <Truck className="w-4 h-4" /> },
    { id: 'payment', name: 'Payment & Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'account', name: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'technical', name: 'Technical Support', icon: <Settings className="w-4 h-4" /> }
  ]

  const faqs = [
    // Security
    {
      id: 1,
      category: 'security',
      question: 'How secure is my personal and payment information?',
      answer: 'We use enterprise-grade SSL 256-bit encryption to protect all data transmission. Your payment information is processed through PCI DSS Level 1 certified payment processors and is never stored on our servers. We also implement multi-factor authentication and regular security audits to ensure maximum protection.'
    },
    {
      id: 2,
      category: 'security',
      question: 'What security certifications do you have?',
      answer: 'SecureShop is PCI DSS Level 1 certified, SOC 2 Type II compliant, and follows ISO 27001 security standards. We undergo regular third-party security audits and maintain a 99.9% uptime guarantee with enterprise-grade infrastructure.'
    },
    {
      id: 3,
      category: 'security',
      question: 'How do you verify the authenticity of security products?',
      answer: 'All security products undergo rigorous verification processes. We work directly with manufacturers and authorized distributors, conduct product authenticity checks, and maintain detailed chain-of-custody documentation. Each product includes authenticity certificates and verification codes.'
    },

    // Orders & Shipping
    {
      id: 4,
      category: 'orders',
      question: 'What are your shipping options and delivery times?',
      answer: 'We offer standard shipping (5-7 business days), expedited shipping (2-3 business days), and overnight delivery. International shipping is available to most countries with delivery times of 7-14 business days. Free shipping is available on orders over $50.'
    },
    {
      id: 5,
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can track your package through our website, mobile app, or directly on the carrier\'s website. Real-time updates are provided throughout the delivery process.'
    },
    {
      id: 6,
      category: 'orders',
      question: 'Can I modify or cancel my order after placing it?',
      answer: 'Orders can be modified or cancelled within 1 hour of placement. After this window, orders enter our fulfillment process and cannot be changed. Contact our support team immediately if you need to make changes.'
    },
    {
      id: 7,
      category: 'orders',
      question: 'What is your return and exchange policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with all packaging and documentation. Security software and digital products are non-returnable once activated. Return shipping is free for defective items.'
    },

    // Payment & Billing
    {
      id: 8,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. For enterprise customers, we also offer invoice billing and purchase order processing.'
    },
    {
      id: 9,
      category: 'payment',
      question: 'Do you offer payment plans or financing?',
      answer: 'Yes, we offer flexible payment plans for orders over $500. Options include 3, 6, and 12-month payment plans with competitive interest rates. Enterprise customers can also set up credit accounts with net payment terms.'
    },
    {
      id: 10,
      category: 'payment',
      question: 'How do taxes work for my order?',
      answer: 'Tax rates are automatically calculated based on your shipping address. We collect sales tax for all applicable states and countries. Tax-exempt organizations can provide their exemption certificates during checkout.'
    },

    // Account
    {
      id: 11,
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" in the top right corner, provide your email and create a secure password. You\'ll receive a verification email to activate your account. Account creation enables order tracking, faster checkout, and access to exclusive deals.'
    },
    {
      id: 12,
      category: 'account',
      question: 'I forgot my password. How do I reset it?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a secure password reset link within a few minutes. For security, this link expires after 24 hours.'
    },
    {
      id: 13,
      category: 'account',
      question: 'How do I update my account information?',
      answer: 'Log into your account and click "Profile Settings" to update your personal information, shipping addresses, and communication preferences. Changes to email addresses require verification for security purposes.'
    },

    // Technical Support
    {
      id: 14,
      category: 'technical',
      question: 'I\'m having trouble with a security software installation. Can you help?',
      answer: 'Yes! Our technical support team includes certified security professionals who can assist with installation, configuration, and troubleshooting. Contact us via live chat, email, or phone for step-by-step guidance.'
    },
    {
      id: 15,
      category: 'technical',
      question: 'Do you provide technical documentation and training?',
      answer: 'We provide comprehensive documentation, video tutorials, and training materials for all products. Enterprise customers receive access to our training portal with advanced courses and certification programs.'
    },
    {
      id: 16,
      category: 'technical',
      question: 'What if a product doesn\'t work with my existing systems?',
      answer: 'We offer pre-purchase compatibility consultations and a 30-day compatibility guarantee. If a product doesn\'t integrate properly with your existing systems, we\'ll help find an alternative solution or process a full refund.'
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Frequently Asked <span className="text-accent-500">Questions</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-200 mb-8">
              Find answers to common questions about our products and services
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-neutral-900 placeholder-neutral-500 focus:ring-2 focus:ring-accent-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container-width section-padding">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-accent-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-neutral-600 mb-2">
                  No results found
                </h3>
                <p className="text-neutral-500">
                  Try adjusting your search terms or browse different categories
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-primary-700 pr-4">
                        {faq.question}
                      </h3>
                      {openFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                      )}
                    </button>
                    
                    {openFAQ === faq.id && (
                      <div className="px-6 pb-4">
                        <div className="border-t border-neutral-100 pt-4">
                          <p className="text-neutral-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary-50">
        <div className="container-width section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">
              Still have questions?
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Our support team is here to help. Get in touch with us for personalized assistance.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <HelpCircle className="w-8 h-8 text-accent-500 mx-auto mb-3" />
                <h3 className="font-medium text-primary-700 mb-2">Live Chat</h3>
                <p className="text-sm text-neutral-600 mb-4">Get instant help from our support team</p>
                <button className="w-full bg-accent-500 text-white py-2 px-4 rounded-lg hover:bg-accent-600 transition-colors">
                  Start Chat
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <CreditCard className="w-8 h-8 text-accent-500 mx-auto mb-3" />
                <h3 className="font-medium text-primary-700 mb-2">Email Support</h3>
                <p className="text-sm text-neutral-600 mb-4">Send us a detailed message</p>
                <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                  Send Email
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Truck className="w-8 h-8 text-accent-500 mx-auto mb-3" />
                <h3 className="font-medium text-primary-700 mb-2">Phone Support</h3>
                <p className="text-sm text-neutral-600 mb-4">Speak directly with our experts</p>
                <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FAQPage
