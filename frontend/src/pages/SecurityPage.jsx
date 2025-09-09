import React from 'react'
import { Shield, Lock, Eye, Server, CheckCircle, AlertTriangle, Users, Globe } from 'lucide-react'

const SecurityPage = () => {
  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-green-600" />,
      title: "SSL/TLS Encryption",
      description: "All data transmission is protected with industry-standard 256-bit SSL encryption.",
      details: "End-to-end encryption ensures your personal and payment information is secure during transmission."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "PCI DSS Compliance",
      description: "We maintain Level 1 PCI DSS compliance for secure payment processing.",
      details: "The highest level of payment security standards, regularly audited by third-party assessors."
    },
    {
      icon: <Server className="w-8 h-8 text-purple-600" />,
      title: "Secure Infrastructure",
      description: "Enterprise-grade cloud infrastructure with 99.9% uptime guarantee.",
      details: "Multi-layered security architecture with redundancy and automatic failover systems."
    },
    {
      icon: <Eye className="w-8 h-8 text-orange-600" />,
      title: "24/7 Monitoring",
      description: "Continuous security monitoring and threat detection systems.",
      details: "Real-time monitoring for suspicious activities, automated threat response, and incident management."
    }
  ]

  const certifications = [
    {
      name: "SOC 2 Type II",
      description: "Service Organization Control 2 certification for security, availability, and confidentiality",
      icon: <Shield className="w-6 h-6" />,
      status: "Certified"
    },
    {
      name: "ISO 27001",
      description: "International standard for information security management systems",
      icon: <Globe className="w-6 h-6" />,
      status: "Certified"
    },
    {
      name: "PCI DSS Level 1",
      description: "Payment Card Industry Data Security Standard compliance",
      icon: <Lock className="w-6 h-6" />,
      status: "Compliant"
    },
    {
      name: "GDPR Compliant",
      description: "General Data Protection Regulation compliance for EU users",
      icon: <Users className="w-6 h-6" />,
      status: "Compliant"
    }
  ]

  const securityPractices = [
    {
      category: "Data Protection",
      practices: [
        "Advanced encryption for data at rest and in transit",
        "Regular security audits and penetration testing",
        "Secure data backup and disaster recovery procedures",
        "Data minimization and retention policies"
      ]
    },
    {
      category: "Access Control",
      practices: [
        "Multi-factor authentication for all accounts",
        "Role-based access control and permissions",
        "Regular access reviews and user deprovisioning",
        "Secure password policies and requirements"
      ]
    },
    {
      category: "Network Security",
      practices: [
        "Web application firewall (WAF) protection",
        "DDoS protection and mitigation",
        "Intrusion detection and prevention systems",
        "Network segmentation and isolation"
      ]
    },
    {
      category: "Incident Response",
      practices: [
        "24/7 security operations center (SOC)",
        "Automated threat detection and response",
        "Incident response team and procedures",
        "Regular security training for all staff"
      ]
    }
  ]

  const tips = [
    {
      title: "Use Strong Passwords",
      description: "Create unique, complex passwords with at least 12 characters including uppercase, lowercase, numbers, and symbols."
    },
    {
      title: "Enable Two-Factor Authentication",
      description: "Add an extra layer of security to your account with SMS or authenticator app-based 2FA."
    },
    {
      title: "Keep Software Updated",
      description: "Regularly update your browser, operating system, and security software to protect against vulnerabilities."
    },
    {
      title: "Monitor Your Accounts",
      description: "Regularly check your account activity and report any suspicious or unauthorized transactions immediately."
    },
    {
      title: "Shop on Secure Networks",
      description: "Avoid making purchases on public Wi-Fi networks. Use a secure, private connection for online shopping."
    },
    {
      title: "Verify Website Security",
      description: "Always look for the padlock icon and 'https://' in the URL before entering sensitive information."
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Security <span className="text-accent-500">First</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-200 mb-8">
              Your security is our top priority
            </p>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              We implement enterprise-grade security measures to protect your personal information, 
              payment data, and shopping experience. Learn about our comprehensive security practices 
              and how we keep you safe.
            </p>
          </div>
        </div>
      </section>

      {/* Security Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container-width section-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">256-bit</div>
              <div className="text-neutral-600 text-sm">SSL Encryption</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-neutral-600 text-sm">Uptime SLA</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <div className="text-neutral-600 text-sm">Security Monitoring</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">SOC 2</div>
              <div className="text-neutral-600 text-sm">Type II Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-neutral-50">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 mb-4">
                Enterprise-Grade Security
              </h2>
              <p className="text-lg text-neutral-600">
                Multi-layered security architecture protecting every aspect of your experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-neutral-100 rounded-lg mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-primary-700">{feature.title}</h3>
                  </div>
                  <p className="text-neutral-600 mb-4">{feature.description}</p>
                  <p className="text-neutral-500 text-sm">{feature.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-800 mb-4">
                Security Certifications & Compliance
              </h2>
              <p className="text-lg text-neutral-600">
                We maintain the highest industry standards for security and compliance
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
                        {cert.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-primary-700">{cert.name}</h3>
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {cert.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-neutral-600 text-sm">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-16 bg-neutral-50">
        <div className="container-width section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-800 mb-4">
                Our Security Practices
              </h2>
              <p className="text-lg text-neutral-600">
                Comprehensive security measures across all aspects of our operations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityPractices.map((category, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="font-bold text-primary-700 mb-4">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.practices.map((practice, practiceIndex) => (
                      <li key={practiceIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-neutral-600 text-sm">{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Tips */}
      <section className="py-16 bg-white">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-800 mb-4">
                Security Tips for Safe Shopping
              </h2>
              <p className="text-lg text-neutral-600">
                How you can protect yourself while shopping online
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <div key={index} className="bg-neutral-50 p-6 rounded-xl">
                  <h3 className="font-bold text-primary-700 mb-3">{tip.title}</h3>
                  <p className="text-neutral-600 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Report Security Issues */}
      <section className="py-16 bg-red-50">
        <div className="container-width section-padding">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-red-800 mb-4">
                Report Security Concerns
              </h2>
              <p className="text-lg text-red-700 mb-8">
                If you discover a security vulnerability or have concerns about our security practices, 
                please report them immediately.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-red-700 mb-4">Emergency Security Issues</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> security@secureshop.com</p>
                  <p><strong>Phone:</strong> 0987654321</p>
                  <p><strong>Response Time:</strong> Within 1 hour</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-red-700 mb-4">General Security Concerns</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> security-report@secureshop.com</p>
                  <p><strong>Support Portal:</strong> Submit a ticket</p>
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-primary-700 mb-3">Responsible Disclosure</h3>
                <p className="text-neutral-600 text-sm">
                  We appreciate responsible disclosure of security vulnerabilities. 
                  We will work with security researchers to verify, reproduce, and address 
                  any legitimate security concerns as quickly as possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-width section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Questions About Our Security?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Our security team is available to answer any questions about our practices and certifications
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 p-6 rounded-xl">
                <Shield className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Security Team</h3>
                <p className="text-sm text-primary-100 mb-4">Get answers about our security measures</p>
                <button className="w-full bg-white text-primary-600 py-2 px-4 rounded-lg hover:bg-neutral-100 transition-colors">
                  Contact Security
                </button>
              </div>
              
              <div className="bg-white/10 p-6 rounded-xl">
                <Lock className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Compliance Team</h3>
                <p className="text-sm text-primary-100 mb-4">Questions about certifications and compliance</p>
                <button className="w-full bg-white text-primary-600 py-2 px-4 rounded-lg hover:bg-neutral-100 transition-colors">
                  Contact Compliance
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SecurityPage
