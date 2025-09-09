import React from 'react'
import { Shield, Truck, Globe, Users, Award, Heart } from 'lucide-react'

const AboutPage = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-accent-500" />,
      title: "Secure Shopping",
      description: "Enterprise-grade security with SSL encryption and PCI compliance to protect your data."
    },
    {
      icon: <Truck className="w-8 h-8 text-accent-500" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping with real-time tracking for all your orders."
    },
    {
      icon: <Globe className="w-8 h-8 text-accent-500" />,
      title: "Global Reach",
      description: "Serving customers worldwide with localized payment methods and support."
    },
    {
      icon: <Users className="w-8 h-8 text-accent-500" />,
      title: "Expert Support",
      description: "24/7 customer support from our dedicated team of security professionals."
    },
    {
      icon: <Award className="w-8 h-8 text-accent-500" />,
      title: "Quality Products",
      description: "Carefully curated selection of top-tier security equipment and solutions."
    },
    {
      icon: <Heart className="w-8 h-8 text-accent-500" />,
      title: "Customer First",
      description: "Your satisfaction and security are our top priorities in everything we do."
    }
  ]

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "10K+", label: "Products Sold" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About <span className="text-accent-500">SecureShop</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-200 mb-8">
              Your trusted partner in digital security solutions
            </p>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              We're dedicated to providing enterprise-grade security products and solutions 
              to protect what matters most to you. From small businesses to large corporations, 
              we deliver the tools and expertise you need to stay secure in an ever-evolving digital landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-width section-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-neutral-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 mb-4">
                Our Story
              </h2>
              <p className="text-lg text-neutral-600">
                Built by security experts, for security professionals
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-primary-700 mb-4">
                  Founded on Security
                </h3>
                <p className="text-neutral-700 mb-6">
                  SecureShop was founded in 2020 by a team of cybersecurity veterans who recognized 
                  the need for a trusted, secure platform to purchase professional security equipment 
                  and software solutions.
                </p>
                <p className="text-neutral-700 mb-6">
                  Our founders, with over 20 years of combined experience in enterprise security, 
                  understood that security professionals needed more than just products—they needed 
                  a partner they could trust.
                </p>
                <p className="text-neutral-700">
                  Today, we serve thousands of customers worldwide, from individual security 
                  consultants to Fortune 500 companies, all united in their commitment to 
                  protecting digital assets and maintaining the highest security standards.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-primary-700 mb-4">
                  Our Mission
                </h3>
                <p className="text-neutral-700 mb-6">
                  To democratize access to enterprise-grade security solutions and make 
                  professional security tools accessible to organizations of all sizes.
                </p>
                
                <h3 className="text-xl font-bold text-primary-700 mb-4">
                  Our Vision
                </h3>
                <p className="text-neutral-700">
                  A world where every organization, regardless of size, has access to 
                  the security tools and knowledge they need to protect their digital assets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-width section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 mb-4">
              Why Choose SecureShop?
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              We're not just another e-commerce platform. We're security specialists 
              who understand what you need to protect your digital infrastructure.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-700 mb-3">
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

      {/* Team Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container-width section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 mb-4">
              Our Commitment
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Every product on our platform is carefully vetted by our security experts. 
              We only partner with trusted manufacturers and vendors who meet our strict 
              security and quality standards.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <Shield className="w-12 h-12 text-accent-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary-700 mb-3">
                Security First
              </h3>
              <p className="text-neutral-600">
                Every transaction is protected with enterprise-grade security measures.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <Award className="w-12 h-12 text-accent-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary-700 mb-3">
                Quality Guaranteed
              </h3>
              <p className="text-neutral-600">
                All products are tested and verified by our security professionals.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <Users className="w-12 h-12 text-accent-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary-700 mb-3">
                Expert Support
              </h3>
              <p className="text-neutral-600">
                Get help from real security experts who understand your needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
