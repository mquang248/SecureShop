import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Shield, 
  Cloud, 
  Lock, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Globe,
  Award
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import ProductCard from '../components/products/ProductCard'
import SecurityBadge from '../components/common/SecurityBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const HomePage = () => {
  // Fetch featured products
  const { data: featuredProducts, isLoading: loadingProducts, error } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await api.get('/products/featured')
      console.log('API Response:', response.data)
      return response.data.data.products
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-accent-500" />,
      title: "Enterprise Security",
      description: "Military-grade encryption, MFA, and fraud detection protect every transaction."
    },
    {
      icon: <Cloud className="w-8 h-8 text-accent-500" />,
      title: "Cloud-Powered",
      description: "Built on AWS with auto-scaling, CDN, and 99.9% uptime guarantee."
    },
    {
      icon: <Zap className="w-8 h-8 text-accent-500" />,
      title: "Lightning Fast",
      description: "Optimized performance with global CDN and edge computing."
    },
    {
      icon: <Globe className="w-8 h-8 text-accent-500" />,
      title: "Global Reach",
      description: "Worldwide shipping with real-time tracking and local payment methods."
    }
  ]

  const trustIndicators = [
    "SSL 256-bit Encryption",
    "PCI DSS Level 1 Certified",
    "SOC 2 Type II Compliant",
    "ISO 27001 Certified",
    "GDPR Compliant",
    "99.9% Uptime SLA"
  ]

  const stats = [
    { number: "500K+", label: "Secure Transactions" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Security Monitoring" },
    { number: "256-bit", label: "SSL Encryption" }
  ]

  return (
    <>
      <Helmet>
        <title>SecureShop - Secure Shopping, Powered by Cloud</title>
        <meta name="description" content="Experience secure online shopping with enterprise-grade security, cloud infrastructure, and modern technology. Shop with confidence at SecureShop." />
      </Helmet>

      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-width section-padding py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center space-x-2 mb-6">
                <SecurityBadge text="Secure Platform" />
                <SecurityBadge text="Cloud Powered" />
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Secure Shopping,
                <span className="block text-accent-500">Powered by Cloud</span>
              </h1>
              
              <p className="text-xl text-neutral-200 mb-8 leading-relaxed">
                Experience the future of e-commerce with enterprise-grade security, 
                lightning-fast performance, and cloud reliability. Shop with complete confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/shop"
                  className="btn-primary flex items-center justify-center px-8 py-3 text-lg"
                >
                  Start Shopping
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/security"
                  className="btn-outline text-white border-white hover:bg-white hover:text-primary-900 flex items-center justify-center px-8 py-3 text-lg"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Security Features
                </Link>
              </div>
            </div>
            
            <div className="relative">
              {/* Hero Image/Graphic */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4">
                      <div className="text-2xl lg:text-3xl font-bold text-accent-500 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-sm text-neutral-200">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating Security Icons */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce-subtle">
                <Shield className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg animate-bounce-subtle" style={{ animationDelay: '1s' }}>
                <Lock className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-neutral-100 py-8">
        <div className="container-width section-padding">
          <div className="text-center mb-6">
            <h2 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">
              Trusted by customers worldwide
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 text-sm text-neutral-600">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-center">{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-width section-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
              Why Choose SecureShop?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Built with modern technology and security-first approach to deliver 
              the best shopping experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-neutral-100 rounded-full group-hover:bg-accent-50 transition-colors">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-neutral-50">
        <div className="container-width section-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-neutral-600">
              Discover our most popular and trending items
            </p>
          </div>
          
          {loadingProducts ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-orange-50 rounded-lg border border-orange-200">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cloud className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Backend API Not Connected</h3>
                <p className="text-orange-700 mb-4">
                  The backend API is not available. This is a demo frontend deployment.
                </p>
                <div className="text-sm text-orange-600 space-y-1">
                  <p>To connect with live data:</p>
                  <p>1. Deploy backend API (Node.js/Express)</p>
                  <p>2. Set VITE_API_URL environment variable</p>
                  <p>3. Redeploy frontend</p>
                </div>
              </div>
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              {featuredProducts.slice(0, 4).map((product) => (
                <div key={product._id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured products available.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="btn-primary inline-flex items-center px-8 py-3 text-lg"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Security Showcase */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container-width section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Award className="w-6 h-6 text-accent-500" />
                <span className="text-accent-500 font-semibold">Security First</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Enterprise-Grade Security for Every Transaction
              </h2>
              
              <p className="text-xl text-neutral-300 mb-8">
                Your security is our priority. We implement the same security measures 
                used by Fortune 500 companies to protect your data and transactions.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Multi-Factor Authentication</h4>
                    <p className="text-neutral-300">Two-factor authentication with backup codes and biometric options.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Real-time Fraud Detection</h4>
                    <p className="text-neutral-300">AI-powered fraud detection monitors every transaction in real-time.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">End-to-End Encryption</h4>
                    <p className="text-neutral-300">All data is encrypted in transit and at rest using 256-bit encryption.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <Shield className="w-12 h-12 text-accent-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">SSL Certificate</h4>
                <p className="text-sm text-neutral-300">256-bit encryption</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <Lock className="w-12 h-12 text-accent-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">PCI Compliant</h4>
                <p className="text-sm text-neutral-300">Level 1 certified</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <CheckCircle className="w-12 h-12 text-accent-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">SOC 2 Type II</h4>
                <p className="text-sm text-neutral-300">Audited annually</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <Award className="w-12 h-12 text-accent-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">ISO 27001</h4>
                <p className="text-sm text-neutral-300">Certified secure</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="py-20 bg-accent-500">
        <div className="container-width section-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Experience Secure Shopping?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust SecureShop for their online shopping needs.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-accent-500 hover:bg-neutral-100 font-semibold px-8 py-3 rounded-md transition-colors inline-flex items-center justify-center"
            >
              Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/shop"
              className="border-2 border-white text-white hover:bg-white hover:text-accent-500 font-semibold px-8 py-3 rounded-md transition-colors inline-flex items-center justify-center"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
