import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ExternalLink, Eye, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import api from '../utils/api'
import { Helmet } from 'react-helmet-async'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { getProductUrl } from '../utils/productMapping'

const ProductLinksPage = () => {
  const [copiedId, setCopiedId] = useState(null)

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['allProductsForLinks'],
    queryFn: async () => {
      const response = await api.get('/products?limit=100')
      return response.data.data
    }
  })

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price * 1000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Product URL List - SecureShop</title>
        <meta name="description" content="List of all product detail page URLs" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container-width section-padding py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-primary-900 mb-4">
              Product URL List
            </h1>
            <p className="text-xl text-neutral-600 mb-6">
              All {productsData?.products?.length || 0} product detail pages with unique URLs
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-3xl mx-auto">
              <p className="text-blue-800 text-sm">
                💡 <strong>Note:</strong> Each product has a dynamic URL following the format <code>/shop/:id</code>. 
                Click on the links below to access each product page directly.
              </p>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {productsData?.products?.map((product, index) => {
              const productUrl = getProductUrl(product._id)
              const fullUrl = `${window.location.origin}${productUrl}`
              const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
              
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-center space-x-6">
                    {/* Number Badge */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>

                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden">
                        {primaryImage ? (
                          <img
                            src={primaryImage.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Eye className="w-8 h-8 text-neutral-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-2">
                        {product.category?.name} • {formatPrice(product.price)}
                      </p>
                      
                      {/* URL Display */}
                      <div className="bg-neutral-50 rounded-lg p-3 border">
                        <div className="flex items-center justify-between">
                          <code className="text-sm text-neutral-700 font-mono">
                            {productUrl}
                          </code>
                          <button
                            onClick={() => copyToClipboard(fullUrl, product._id)}
                            className="ml-2 p-2 text-neutral-500 hover:text-primary-600 transition-colors"
                            title="Copy full URL"
                          >
                            {copiedId === product._id ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex space-x-2">
                      <Link
                        to={productUrl}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Page
                      </Link>
                      <Link
                        to={productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Technical Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">🔗 Routing</h3>
                  <p className="text-sm text-neutral-600">
                    React Router with dynamic routes <code>/shop/:id</code>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">📱 Responsive</h3>
                  <p className="text-sm text-neutral-600">
                    All pages are responsive and mobile-friendly
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">🚀 Performance</h3>
                  <p className="text-sm text-neutral-600">
                    Lazy loading, React Query caching, code splitting
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">📊 SEO</h3>
                  <p className="text-sm text-neutral-600">
                    Dynamic meta tags, structured data, sitemap ready
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductLinksPage
