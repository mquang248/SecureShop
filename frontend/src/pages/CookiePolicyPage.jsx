import React, { useState } from 'react'
import { Cookie, Settings, Eye, Shield, Info, X, Check } from 'lucide-react'

const CookiePolicyPage = () => {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Always enabled
    analytics: true,
    marketing: false,
    preferences: true
  })

  const handleCookieToggle = (type) => {
    if (type === 'essential') return // Cannot disable essential cookies
    
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const saveCookieSettings = () => {
    // Save to localStorage or send to backend
    localStorage.setItem('cookieSettings', JSON.stringify(cookieSettings))
    alert('Cookie preferences saved!')
  }

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      examples: ['Session management', 'Security tokens', 'Load balancing', 'Shopping cart'],
      enabled: cookieSettings.essential,
      required: true
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: ['Page views', 'User behavior', 'Performance metrics', 'Error tracking'],
      enabled: cookieSettings.analytics,
      required: false
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements and track ad performance.',
      examples: ['Personalized ads', 'Retargeting', 'Social media integration', 'Campaign tracking'],
      enabled: cookieSettings.marketing,
      required: false
    },
    {
      id: 'preferences',
      name: 'Preference Cookies',
      description: 'These cookies remember your choices and preferences to provide a personalized experience.',
      examples: ['Language settings', 'Theme preferences', 'Layout choices', 'Search filters'],
      enabled: cookieSettings.preferences,
      required: false
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Cookie <span className="text-accent-500">Policy</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-200 mb-8">
              How we use cookies to improve your experience
            </p>
            <div className="flex items-center justify-center space-x-2 text-neutral-300">
              <Cookie className="w-5 h-5" />
              <span>Last updated: September 1, 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Banner Info */}
      <section className="py-8 bg-amber-50 border-b border-amber-200">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-amber-800 mb-2">Cookie Consent Notice</h3>
                <p className="text-amber-700 text-sm">
                  By continuing to use our website, you consent to our use of cookies as described in this policy. 
                  You can change your cookie preferences at any time using the settings below.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-width section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {/* What Are Cookies */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-primary-800 mb-6">What Are Cookies?</h2>
                  <div className="prose prose-lg max-w-none text-neutral-700">
                    <p className="mb-4">
                      Cookies are small text files that are placed on your device when you visit our website. 
                      They help us provide you with a better experience by remembering your preferences, 
                      analyzing how you use our site, and enabling certain functionality.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 my-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <Cookie className="w-8 h-8 text-blue-600 mb-3" />
                        <h3 className="font-bold text-blue-800 mb-2">First-Party Cookies</h3>
                        <p className="text-blue-700 text-sm">
                          Set directly by our website to provide core functionality and improve your experience.
                        </p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <Shield className="w-8 h-8 text-green-600 mb-3" />
                        <h3 className="font-bold text-green-800 mb-2">Third-Party Cookies</h3>
                        <p className="text-green-700 text-sm">
                          Set by external services we use, such as analytics providers and payment processors.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Cookie Types */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-primary-800 mb-6">Types of Cookies We Use</h2>
                  <div className="space-y-6">
                    {cookieTypes.map((cookie) => (
                      <div key={cookie.id} className="border border-neutral-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-primary-700 mb-2">{cookie.name}</h3>
                            <p className="text-neutral-600 mb-4">{cookie.description}</p>
                          </div>
                          <div className="ml-4">
                            {cookie.required ? (
                              <div className="flex items-center space-x-2 text-green-600">
                                <Check className="w-5 h-5" />
                                <span className="text-sm font-medium">Required</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleCookieToggle(cookie.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  cookie.enabled ? 'bg-accent-500' : 'bg-neutral-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    cookie.enabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-neutral-50 rounded-lg p-4">
                          <h4 className="font-medium text-neutral-700 mb-2">Examples:</h4>
                          <div className="flex flex-wrap gap-2">
                            {cookie.examples.map((example, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs text-neutral-600"
                              >
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* How We Use Cookies */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-primary-800 mb-6">How We Use Cookies</h2>
                  <div className="grid gap-6">
                    <div className="bg-neutral-50 rounded-xl p-6">
                      <h3 className="font-bold text-primary-700 mb-3">Website Functionality</h3>
                      <ul className="text-neutral-600 space-y-1 text-sm">
                        <li>• Remember your login status and preferences</li>
                        <li>• Maintain your shopping cart contents</li>
                        <li>• Enable secure transactions and prevent fraud</li>
                        <li>• Provide customer support features</li>
                      </ul>
                    </div>

                    <div className="bg-neutral-50 rounded-xl p-6">
                      <h3 className="font-bold text-primary-700 mb-3">Performance & Analytics</h3>
                      <ul className="text-neutral-600 space-y-1 text-sm">
                        <li>• Analyze website traffic and user behavior</li>
                        <li>• Identify and fix technical issues</li>
                        <li>• Optimize website performance and loading times</li>
                        <li>• Track conversion rates and user engagement</li>
                      </ul>
                    </div>

                    <div className="bg-neutral-50 rounded-xl p-6">
                      <h3 className="font-bold text-primary-700 mb-3">Personalization</h3>
                      <ul className="text-neutral-600 space-y-1 text-sm">
                        <li>• Show relevant product recommendations</li>
                        <li>• Remember your language and region preferences</li>
                        <li>• Customize content based on your interests</li>
                        <li>• Provide personalized marketing communications</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Third-Party Services */}
                <section className="mb-8">
                  <h2 className="text-3xl font-bold text-primary-800 mb-6">Third-Party Services</h2>
                  <div className="prose prose-lg max-w-none text-neutral-700">
                    <p className="mb-4">
                      We use several third-party services that may set their own cookies. These services 
                      have their own privacy policies and cookie policies:
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border border-neutral-200 rounded-lg overflow-hidden">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th className="px-6 py-3 text-left font-bold text-primary-700">Service</th>
                            <th className="px-6 py-3 text-left font-bold text-primary-700">Purpose</th>
                            <th className="px-6 py-3 text-left font-bold text-primary-700">Cookie Policy</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-neutral-100">
                            <td className="px-6 py-4 font-medium">Google Analytics</td>
                            <td className="px-6 py-4 text-sm text-neutral-600">Website analytics and reporting</td>
                            <td className="px-6 py-4 text-sm">
                              <a href="#" className="text-accent-600 hover:text-accent-700">View Policy</a>
                            </td>
                          </tr>
                          <tr className="border-t border-neutral-100">
                            <td className="px-6 py-4 font-medium">Stripe</td>
                            <td className="px-6 py-4 text-sm text-neutral-600">Payment processing</td>
                            <td className="px-6 py-4 text-sm">
                              <a href="#" className="text-accent-600 hover:text-accent-700">View Policy</a>
                            </td>
                          </tr>
                          <tr className="border-t border-neutral-100">
                            <td className="px-6 py-4 font-medium">Intercom</td>
                            <td className="px-6 py-4 text-sm text-neutral-600">Customer support chat</td>
                            <td className="px-6 py-4 text-sm">
                              <a href="#" className="text-accent-600 hover:text-accent-700">View Policy</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Cookie Settings Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-primary-700 mb-6 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Cookie Preferences
                </h3>
                
                <div className="space-y-4 mb-6">
                  {cookieTypes.map((cookie) => (
                    <div key={cookie.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-neutral-700">{cookie.name}</div>
                        <div className="text-xs text-neutral-500">
                          {cookie.required ? 'Always active' : 'Optional'}
                        </div>
                      </div>
                      <div className="ml-4">
                        {cookie.required ? (
                          <div className="w-11 h-6 bg-green-500 rounded-full flex items-center justify-end pr-1">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCookieToggle(cookie.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              cookie.enabled ? 'bg-accent-500' : 'bg-neutral-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                cookie.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={saveCookieSettings}
                  className="w-full bg-accent-600 text-white py-3 px-4 rounded-lg hover:bg-accent-700 transition-colors font-medium"
                >
                  Save Preferences
                </button>

                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h4 className="font-medium text-neutral-700 mb-3">Browser Controls</h4>
                  <p className="text-sm text-neutral-600 mb-4">
                    You can also control cookies through your browser settings:
                  </p>
                  <div className="space-y-2 text-xs">
                    <a href="#" className="block text-accent-600 hover:text-accent-700">Chrome Cookie Settings</a>
                    <a href="#" className="block text-accent-600 hover:text-accent-700">Firefox Cookie Settings</a>
                    <a href="#" className="block text-accent-600 hover:text-accent-700">Safari Cookie Settings</a>
                    <a href="#" className="block text-accent-600 hover:text-accent-700">Edge Cookie Settings</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookiePolicyPage
