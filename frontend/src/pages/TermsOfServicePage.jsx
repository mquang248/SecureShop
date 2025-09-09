import React from 'react'
import { Scale, Shield, FileText, AlertCircle, CheckCircle, Calendar } from 'lucide-react'

const TermsOfServicePage = () => {
  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms' },
    { id: 'services', title: 'Description of Services' },
    { id: 'accounts', title: 'User Accounts' },
    { id: 'conduct', title: 'User Conduct' },
    { id: 'intellectual', title: 'Intellectual Property' },
    { id: 'payment', title: 'Payment Terms' },
    { id: 'privacy', title: 'Privacy' },
    { id: 'disclaimer', title: 'Disclaimers' },
    { id: 'limitation', title: 'Limitation of Liability' },
    { id: 'termination', title: 'Termination' },
    { id: 'governing', title: 'Governing Law' },
    { id: 'contact', title: 'Contact Information' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Terms of <span className="text-accent-500">Service</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-200 mb-8">
              Legal terms and conditions for using SecureShop
            </p>
            <div className="flex items-center justify-center space-x-4 text-neutral-300">
              <Calendar className="w-5 h-5" />
              <span>Effective Date: September 1, 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-primary-700 mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-primary-600 hover:text-accent-600 transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container-width section-padding py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          {/* Acceptance of Terms */}
          <section id="acceptance" className="mb-12">
            <h2 className="text-2xl font-bold text-primary-800 mb-4 flex items-center">
              <Scale className="w-6 h-6 mr-2" />
              1. Acceptance of Terms
            </h2>
            <div className="prose prose-lg max-w-none text-neutral-700">
              <p className="mb-4">
                Welcome to SecureShop. These Terms of Service ("Terms") govern your use of our website, 
                mobile applications, and services (collectively, the "Service") operated by SecureShop Inc. 
                ("we," "us," or "our").
              </p>
              <p className="mb-4">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree 
                with any part of these terms, then you may not access the Service.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-1" />
                  <p className="text-blue-800 text-sm">
                    <strong>Important:</strong> These terms constitute a legally binding agreement. 
                    Please read them carefully before using our services.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Description of Services */}
          <section id="services" className="mb-12">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">2. Description of Services</h2>
            <div className="prose prose-lg max-w-none text-neutral-700">
              <p className="mb-4">
                SecureShop is an e-commerce platform specializing in security products and solutions. 
                Our services include:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Online marketplace for security equipment and software</li>
                <li>Product information, reviews, and recommendations</li>
                <li>Order processing and fulfillment services</li>
                <li>Customer support and technical assistance</li>
                <li>User account management and order tracking</li>
                <li>Payment processing and transaction security</li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect of the Service 
                at any time with or without notice.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section id="accounts" className="mb-12">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">3. User Accounts</h2>
            <div className="prose prose-lg max-w-none text-neutral-700">
              <h3 className="text-lg font-bold text-primary-700 mb-2">Account Creation</h3>
              <p className="mb-4">
                To access certain features of our Service, you must create an account. When creating 
                an account, you agree to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate and current</li>
                <li>Maintain the security and confidentiality of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h3 className="text-lg font-bold text-primary-700 mb-2">Account Responsibilities</h3>
              <p className="mb-4">
                You are responsible for safeguarding your account credentials and for all activities 
                that occur under your account. We are not liable for any loss or damage arising from 
                your failure to protect your account information.
              </p>
            </div>
          </section>

          {/* User Conduct */}
          <section id="conduct" className="mb-12">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">4. User Conduct</h2>
            <div className="prose prose-lg max-w-none text-neutral-700">
              <p className="mb-4">You agree not to use the Service to:</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 mb-2">Prohibited Activities</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Violate any laws or regulations</li>
                    <li>• Infringe on intellectual property rights</li>
                    <li>• Transmit harmful or malicious code</li>
                    <li>• Engage in fraudulent activities</li>
                    <li>• Harass or abuse other users</li>
                    <li>• Attempt to gain unauthorized access</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-2">Acceptable Use</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Use services for legitimate purposes</li>
                    <li>• Respect other users and staff</li>
                    <li>• Provide accurate information</li>
                    <li>• Follow security best practices</li>
                    <li>• Report suspicious activities</li>
                    <li>• Comply with all applicable laws</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section id="intellectual" className="mb-12">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">5. Intellectual Property Rights</h2>
            <div className="prose prose-lg max-w-none text-neutral-700">
              <h3 className="text-lg font-bold text-primary-700 mb-2">Our Content</h3>
              <p className="mb-4">
                The Service and its original content, features, and functionality are and will remain 
                the exclusive property of SecureShop Inc. and its licensors. The Service is protected 
                by copyright, trademark, and other laws.
              </p>

              <h3 className="text-lg font-bold text-primary-700 mb-2">User Content</h3>
              <p className="mb-4">
                By posting content on our Service, you grant us a non-exclusive, worldwide, royalty-free 
                license to use, reproduce, modify, and distribute such content for the purpose of 
                operating and improving our Service.
              </p>

              <h3 className="text-lg font-bold text-primary-700 mb-2">Trademarks</h3>
              <p>
                SecureShop and related logos are trademarks of SecureShop Inc. You may not use our 
                trademarks without our prior written permission.
              </p>
            </div>
          </section>

          {/* Payment Terms */}
          <section id="payment" className="mb-12">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">6. Payment Terms</h2>
            <div className="prose prose-lg max-w-none text-neutral-700">
              <h3 className="text-lg font-bold text-primary-700 mb-2">Pricing and Payment</h3>
              <p className="mb-4">
                All prices are listed in USD and include applicable taxes unless otherwise stated. 
                Payment is due at the time of purchase. We accept major credit cards, PayPal, 
                and other approved payment methods.
              </p>

              <h3 className="text-lg font-bold text-primary-700 mb-2">Refunds and Returns</h3>
              <p className="mb-4">
                Our refund and return policy is outlined separately and forms part of these Terms. 
                Generally, we offer a 30-day return window for most products, subject to certain 
                conditions and restrictions.
              </p>

              <h3 className="text-lg font-bold text-primary-700 mb-2">Disputes</h3>
              <p>
                If you have a billing dispute, please contact our customer service team within 
                60 days of the charge. We will work with you to resolve any legitimate disputes.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section id="privacy" className="mb-12">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">7. Privacy</h2>
            <div className="prose prose-lg max-w-none text-neutral-700">
              <p className="mb-4">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, 
                and protect your information when you use our Service. By using our Service, you 
                agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Privacy Policy:</strong> Please review our Privacy Policy, which also 
                  governs your use of the Service, to understand our practices.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section id="disclaimer" className="mb-12">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">8. Disclaimers</h2>
            <div className="prose prose-lg max-w-none text-neutral-700">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="font-bold text-amber-800 mb-2">SERVICE PROVIDED "AS IS"</h3>
                <p className="text-amber-700 text-sm mb-4">
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no 
                  representations or warranties of any kind, express or implied, as to the 
                  operation of the Service or the information included therein.
                </p>
                <p className="text-amber-700 text-sm">
                  We do not warrant that the Service will be uninterrupted, secure, or error-free, 
                  or that defects will be corrected.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section id="limitation" className="mb-12">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">9. Limitation of Liability</h2>
            <div className="prose prose-lg max-w-none text-neutral-700">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800 text-sm mb-4">
                  <strong>LIMITATION OF LIABILITY:</strong> In no event shall SecureShop Inc., 
                  its directors, employees, or agents be liable for any indirect, incidental, 
                  special, consequential, or punitive damages, including lost profits, arising 
                  out of your use of the Service.
                </p>
                <p className="text-red-800 text-sm">
                  Our total liability to you for all claims arising from your use of the Service 
                  shall not exceed the amount you paid us in the twelve months preceding the claim.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section id="termination" className="mb-12">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">10. Termination</h2>
            <div className="prose prose-lg max-w-none text-neutral-700">
              <p className="mb-4">
                We may terminate or suspend your account and access to the Service immediately, 
                without prior notice or liability, for any reason, including breach of these Terms.
              </p>
              <p className="mb-4">
                You may terminate your account at any time by contacting our customer service. 
                Upon termination, your right to use the Service will cease immediately.
              </p>
              <p>
                Provisions that by their nature should survive termination shall survive, including 
                ownership provisions, warranty disclaimers, and limitations of liability.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section id="governing" className="mb-12">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">11. Governing Law</h2>
            <div className="prose prose-lg max-w-none text-neutral-700">
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of 
                the State of California, United States, without regard to its conflict of law principles.
              </p>
              <p>
                Any disputes arising under these Terms shall be resolved in the courts of 
                California, and you consent to the jurisdiction of such courts.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">12. Contact Information</h2>
            <div className="prose prose-lg max-w-none text-neutral-700">
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-neutral-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Email:</strong> legal@secureshop.com</p>
                    <p><strong>Phone:</strong> 0987654321</p>
                  </div>
                  <div>
                    <p><strong>Address:</strong> 123 Ho Chi Minh City, Viet Nam</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="border-t border-neutral-200 pt-6">
            <p className="text-sm text-neutral-500 text-center">
              These Terms of Service were last updated on September 1, 2025.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage
