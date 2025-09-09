import React, { useState } from 'react'
import { Shield, Eye, Lock, Users, Globe, FileText, Calendar, Mail } from 'lucide-react'

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'collection', title: 'Information We Collect', icon: <FileText className="w-4 h-4" /> },
    { id: 'usage', title: 'How We Use Your Information', icon: <Users className="w-4 h-4" /> },
    { id: 'sharing', title: 'Information Sharing', icon: <Globe className="w-4 h-4" /> },
    { id: 'security', title: 'Data Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'cookies', title: 'Cookies & Tracking', icon: <Lock className="w-4 h-4" /> },
    { id: 'rights', title: 'Your Rights', icon: <Users className="w-4 h-4" /> },
    { id: 'contact', title: 'Contact Us', icon: <Mail className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Privacy <span className="text-accent-500">Policy</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-200 mb-8">
              Your privacy is our priority
            </p>
            <div className="flex items-center justify-center space-x-4 text-neutral-300">
              <Calendar className="w-5 h-5" />
              <span>Last updated: September 1, 2025</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-width section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="font-bold text-primary-700 mb-4">Quick Navigation</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-accent-100 text-accent-700'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {section.icon}
                      <span className="text-sm">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Overview */}
                {activeSection === 'overview' && (
                  <div>
                    <h2 className="text-3xl font-bold text-primary-800 mb-6">Privacy Policy Overview</h2>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-neutral-700 mb-6">
                        At SecureShop, we are committed to protecting your privacy and ensuring the security 
                        of your personal information. This Privacy Policy explains how we collect, use, disclose, 
                        and safeguard your information when you visit our website or use our services.
                      </p>

                      <div className="grid md:grid-cols-2 gap-6 my-8">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                          <Shield className="w-8 h-8 text-green-600 mb-3" />
                          <h3 className="font-bold text-green-800 mb-2">Data Protection</h3>
                          <p className="text-green-700 text-sm">
                            We use enterprise-grade security measures to protect your personal information.
                          </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                          <Lock className="w-8 h-8 text-blue-600 mb-3" />
                          <h3 className="font-bold text-blue-800 mb-2">Secure Processing</h3>
                          <p className="text-blue-700 text-sm">
                            All data processing follows industry standards and regulatory compliance.
                          </p>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-primary-700 mb-4">Key Principles</h3>
                      <ul className="space-y-2 text-neutral-700">
                        <li>• <strong>Transparency:</strong> We clearly explain what data we collect and why</li>
                        <li>• <strong>Purpose Limitation:</strong> We only use data for specified, legitimate purposes</li>
                        <li>• <strong>Data Minimization:</strong> We collect only what's necessary for our services</li>
                        <li>• <strong>Security:</strong> We implement appropriate technical and organizational measures</li>
                        <li>• <strong>User Control:</strong> You have rights over your personal data</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Information We Collect */}
                {activeSection === 'collection' && (
                  <div>
                    <h2 className="text-3xl font-bold text-primary-800 mb-6">Information We Collect</h2>
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-bold text-primary-700 mb-4">Personal Information</h3>
                        <div className="bg-neutral-50 rounded-xl p-6">
                          <p className="text-neutral-700 mb-4">
                            We collect personal information that you voluntarily provide to us when you:
                          </p>
                          <ul className="space-y-2 text-neutral-600">
                            <li>• Create an account or register for our services</li>
                            <li>• Make a purchase or place an order</li>
                            <li>• Subscribe to our newsletter or marketing communications</li>
                            <li>• Contact us for customer support</li>
                            <li>• Participate in surveys, contests, or promotions</li>
                            <li>• Apply for a job or submit a resume</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-primary-700 mb-4">Types of Personal Data</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="border border-neutral-200 rounded-xl p-6">
                            <h4 className="font-bold text-primary-600 mb-3">Identity Data</h4>
                            <ul className="text-sm text-neutral-600 space-y-1">
                              <li>• Full name</li>
                              <li>• Email address</li>
                              <li>• Phone number</li>
                              <li>• Date of birth</li>
                              <li>• Professional title</li>
                            </ul>
                          </div>
                          <div className="border border-neutral-200 rounded-xl p-6">
                            <h4 className="font-bold text-primary-600 mb-3">Financial Data</h4>
                            <ul className="text-sm text-neutral-600 space-y-1">
                              <li>• Billing address</li>
                              <li>• Payment method (encrypted)</li>
                              <li>• Purchase history</li>
                              <li>• Invoicing information</li>
                              <li>• Tax identification</li>
                            </ul>
                          </div>
                          <div className="border border-neutral-200 rounded-xl p-6">
                            <h4 className="font-bold text-primary-600 mb-3">Technical Data</h4>
                            <ul className="text-sm text-neutral-600 space-y-1">
                              <li>• IP address</li>
                              <li>• Browser type and version</li>
                              <li>• Device information</li>
                              <li>• Operating system</li>
                              <li>• Referring website</li>
                            </ul>
                          </div>
                          <div className="border border-neutral-200 rounded-xl p-6">
                            <h4 className="font-bold text-primary-600 mb-3">Usage Data</h4>
                            <ul className="text-sm text-neutral-600 space-y-1">
                              <li>• Pages visited</li>
                              <li>• Time spent on site</li>
                              <li>• Click patterns</li>
                              <li>• Search queries</li>
                              <li>• Feature usage</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* How We Use Your Information */}
                {activeSection === 'usage' && (
                  <div>
                    <h2 className="text-3xl font-bold text-primary-800 mb-6">How We Use Your Information</h2>
                    <div className="space-y-6">
                      <p className="text-neutral-700">
                        We use the information we collect for various legitimate business purposes, including:
                      </p>

                      <div className="grid gap-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                          <h3 className="font-bold text-blue-800 mb-3">Service Delivery</h3>
                          <ul className="text-blue-700 space-y-1 text-sm">
                            <li>• Processing and fulfilling orders</li>
                            <li>• Providing customer support</li>
                            <li>• Managing your account and preferences</li>
                            <li>• Delivering products and services</li>
                          </ul>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                          <h3 className="font-bold text-green-800 mb-3">Communication</h3>
                          <ul className="text-green-700 space-y-1 text-sm">
                            <li>• Sending order confirmations and updates</li>
                            <li>• Responding to inquiries and requests</li>
                            <li>• Providing important service announcements</li>
                            <li>• Sending marketing communications (with consent)</li>
                          </ul>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                          <h3 className="font-bold text-purple-800 mb-3">Business Operations</h3>
                          <ul className="text-purple-700 space-y-1 text-sm">
                            <li>• Fraud prevention and security monitoring</li>
                            <li>• Analytics and performance improvement</li>
                            <li>• Legal compliance and regulatory requirements</li>
                            <li>• Business development and strategic planning</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Information Sharing */}
                {activeSection === 'sharing' && (
                  <div>
                    <h2 className="text-3xl font-bold text-primary-800 mb-6">Information Sharing</h2>
                    <div className="space-y-6">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <h3 className="font-bold text-red-800 mb-3">We DO NOT Sell Your Data</h3>
                        <p className="text-red-700">
                          We never sell, rent, or trade your personal information to third parties for their marketing purposes.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-primary-700 mb-4">Limited Sharing Scenarios</h3>
                        <div className="space-y-4">
                          <div className="border border-neutral-200 rounded-xl p-6">
                            <h4 className="font-bold text-primary-600 mb-2">Service Providers</h4>
                            <p className="text-neutral-700 text-sm mb-2">
                              We share data with trusted third-party service providers who help us operate our business:
                            </p>
                            <ul className="text-neutral-600 text-sm space-y-1">
                              <li>• Payment processors (for transaction processing)</li>
                              <li>• Shipping companies (for order fulfillment)</li>
                              <li>• Cloud hosting providers (for data storage)</li>
                              <li>• Email service providers (for communications)</li>
                              <li>• Analytics providers (for website improvement)</li>
                            </ul>
                          </div>

                          <div className="border border-neutral-200 rounded-xl p-6">
                            <h4 className="font-bold text-primary-600 mb-2">Legal Requirements</h4>
                            <p className="text-neutral-700 text-sm">
                              We may disclose your information when required by law, such as:
                            </p>
                            <ul className="text-neutral-600 text-sm space-y-1 mt-2">
                              <li>• Compliance with legal proceedings or court orders</li>
                              <li>• Response to government requests or investigations</li>
                              <li>• Protection of our rights, property, or safety</li>
                              <li>• Enforcement of our terms of service</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Security */}
                {activeSection === 'security' && (
                  <div>
                    <h2 className="text-3xl font-bold text-primary-800 mb-6">Data Security</h2>
                    <div className="space-y-6">
                      <p className="text-neutral-700">
                        We implement comprehensive security measures to protect your personal information against 
                        unauthorized access, alteration, disclosure, or destruction.
                      </p>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                          <Shield className="w-8 h-8 text-green-600 mb-3" />
                          <h3 className="font-bold text-green-800 mb-3">Technical Safeguards</h3>
                          <ul className="text-green-700 text-sm space-y-1">
                            <li>• SSL/TLS encryption for data transmission</li>
                            <li>• AES-256 encryption for data at rest</li>
                            <li>• Regular security audits and penetration testing</li>
                            <li>• Multi-factor authentication</li>
                            <li>• Secure cloud infrastructure</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                          <Lock className="w-8 h-8 text-blue-600 mb-3" />
                          <h3 className="font-bold text-blue-800 mb-3">Organizational Measures</h3>
                          <ul className="text-blue-700 text-sm space-y-1">
                            <li>• Access controls and user permissions</li>
                            <li>• Employee training on data protection</li>
                            <li>• Regular policy reviews and updates</li>
                            <li>• Incident response procedures</li>
                            <li>• Third-party security assessments</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <h3 className="font-bold text-amber-800 mb-3">Compliance & Certifications</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                          <div className="bg-white p-4 rounded-lg">
                            <div className="font-bold text-amber-700">SOC 2</div>
                            <div className="text-xs text-amber-600">Type II</div>
                          </div>
                          <div className="bg-white p-4 rounded-lg">
                            <div className="font-bold text-amber-700">ISO 27001</div>
                            <div className="text-xs text-amber-600">Certified</div>
                          </div>
                          <div className="bg-white p-4 rounded-lg">
                            <div className="font-bold text-amber-700">PCI DSS</div>
                            <div className="text-xs text-amber-600">Level 1</div>
                          </div>
                          <div className="bg-white p-4 rounded-lg">
                            <div className="font-bold text-amber-700">GDPR</div>
                            <div className="text-xs text-amber-600">Compliant</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cookies & Tracking */}
                {activeSection === 'cookies' && (
                  <div>
                    <h2 className="text-3xl font-bold text-primary-800 mb-6">Cookies & Tracking</h2>
                    <div className="space-y-6">
                      <p className="text-neutral-700">
                        We use cookies and similar tracking technologies to enhance your browsing experience 
                        and analyze website performance.
                      </p>

                      <div className="grid gap-6">
                        <div className="border border-neutral-200 rounded-xl p-6">
                          <h3 className="font-bold text-primary-700 mb-3">Essential Cookies</h3>
                          <p className="text-neutral-700 text-sm mb-2">
                            These cookies are necessary for the website to function properly:
                          </p>
                          <ul className="text-neutral-600 text-sm space-y-1">
                            <li>• Session management and authentication</li>
                            <li>• Shopping cart functionality</li>
                            <li>• Security and fraud prevention</li>
                            <li>• Load balancing and performance</li>
                          </ul>
                        </div>

                        <div className="border border-neutral-200 rounded-xl p-6">
                          <h3 className="font-bold text-primary-700 mb-3">Analytics Cookies</h3>
                          <p className="text-neutral-700 text-sm mb-2">
                            Help us understand how visitors interact with our website:
                          </p>
                          <ul className="text-neutral-600 text-sm space-y-1">
                            <li>• Page views and user behavior</li>
                            <li>• Traffic sources and referrals</li>
                            <li>• Performance metrics</li>
                            <li>• Error tracking and debugging</li>
                          </ul>
                        </div>

                        <div className="border border-neutral-200 rounded-xl p-6">
                          <h3 className="font-bold text-primary-700 mb-3">Marketing Cookies</h3>
                          <p className="text-neutral-700 text-sm mb-2">
                            Used to deliver relevant advertisements (with your consent):
                          </p>
                          <ul className="text-neutral-600 text-sm space-y-1">
                            <li>• Personalized content recommendations</li>
                            <li>• Retargeting advertisements</li>
                            <li>• Social media integration</li>
                            <li>• Campaign effectiveness measurement</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="font-bold text-blue-800 mb-3">Cookie Management</h3>
                        <p className="text-blue-700 text-sm mb-4">
                          You can control cookie settings through your browser preferences or our cookie management tool. 
                          Note that disabling certain cookies may affect website functionality.
                        </p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Manage Cookie Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Your Rights */}
                {activeSection === 'rights' && (
                  <div>
                    <h2 className="text-3xl font-bold text-primary-800 mb-6">Your Privacy Rights</h2>
                    <div className="space-y-6">
                      <p className="text-neutral-700">
                        You have various rights regarding your personal data. The specific rights available 
                        to you may depend on your location and applicable laws.
                      </p>

                      <div className="grid gap-4">
                        <div className="bg-white border border-neutral-200 rounded-xl p-6">
                          <h3 className="font-bold text-primary-700 mb-2">Right to Access</h3>
                          <p className="text-neutral-700 text-sm">
                            Request a copy of the personal data we hold about you and information about how we process it.
                          </p>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-xl p-6">
                          <h3 className="font-bold text-primary-700 mb-2">Right to Rectification</h3>
                          <p className="text-neutral-700 text-sm">
                            Request correction of inaccurate or incomplete personal data.
                          </p>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-xl p-6">
                          <h3 className="font-bold text-primary-700 mb-2">Right to Erasure</h3>
                          <p className="text-neutral-700 text-sm">
                            Request deletion of your personal data under certain circumstances.
                          </p>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-xl p-6">
                          <h3 className="font-bold text-primary-700 mb-2">Right to Portability</h3>
                          <p className="text-neutral-700 text-sm">
                            Request transfer of your personal data to another service provider in a structured format.
                          </p>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-xl p-6">
                          <h3 className="font-bold text-primary-700 mb-2">Right to Object</h3>
                          <p className="text-neutral-700 text-sm">
                            Object to processing of your personal data for direct marketing or other legitimate interests.
                          </p>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-xl p-6">
                          <h3 className="font-bold text-primary-700 mb-2">Right to Restrict Processing</h3>
                          <p className="text-neutral-700 text-sm">
                            Request limitation of processing under certain circumstances.
                          </p>
                        </div>
                      </div>

                      <div className="bg-accent-50 border border-accent-200 rounded-xl p-6">
                        <h3 className="font-bold text-accent-800 mb-3">How to Exercise Your Rights</h3>
                        <p className="text-accent-700 text-sm mb-4">
                          To exercise any of these rights, please contact our Data Protection Officer using the 
                          contact information provided in this policy. We will respond to your request within 
                          30 days (or as required by applicable law).
                        </p>
                        <button className="bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors">
                          Submit Privacy Request
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact */}
                {activeSection === 'contact' && (
                  <div>
                    <h2 className="text-3xl font-bold text-primary-800 mb-6">Contact Us</h2>
                    <div className="space-y-6">
                      <p className="text-neutral-700">
                        If you have any questions about this Privacy Policy or our data practices, 
                        please contact us using the information below.
                      </p>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white border border-neutral-200 rounded-xl p-6">
                          <h3 className="font-bold text-primary-700 mb-4">Data Protection Officer</h3>
                          <div className="space-y-2 text-sm text-neutral-600">
                            <p><strong>Email:</strong> privacy@secureshop.com</p>
                            <p><strong>Phone:</strong> 0987654321</p>
                            <p><strong>Address:</strong> 123 Ho Chi Minh City, Viet Nam</p>
                          </div>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-xl p-6">
                          <h3 className="font-bold text-primary-700 mb-4">EU Representative</h3>
                          <div className="space-y-2 text-sm text-neutral-600">
                            <p><strong>Email:</strong> eu-privacy@secureshop.com</p>
                            <p><strong>Phone:</strong> +44 20 1234 5678</p>
                            <p><strong>Address:</strong> 456 Privacy Lane, London, UK SW1A 1AA</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-neutral-50 rounded-xl p-6">
                        <h3 className="font-bold text-primary-700 mb-3">Response Times</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-neutral-500">General Inquiries:</span>
                            <span className="font-medium text-primary-600 ml-2">24-48 hours</span>
                          </div>
                          <div>
                            <span className="text-neutral-500">Privacy Requests:</span>
                            <span className="font-medium text-primary-600 ml-2">30 days</span>
                          </div>
                          <div>
                            <span className="text-neutral-500">Data Breach Reports:</span>
                            <span className="font-medium text-primary-600 ml-2">72 hours</span>
                          </div>
                          <div>
                            <span className="text-neutral-500">Urgent Matters:</span>
                            <span className="font-medium text-primary-600 ml-2">Same day</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
