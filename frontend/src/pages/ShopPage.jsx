import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { Search, Grid, List, Filter, X, ChevronDown, ChevronUp, Shield } from 'lucide-react'
import api from '../utils/api'
import ProductCard from '../components/products/ProductCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-createdAt')
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  })
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1)
  const [viewMode, setViewMode] = useState('grid')
  const [filtersVisible, setFiltersVisible] = useState(false)

  // Fetch products with filters
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory, sortBy, priceRange, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sort: sortBy
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)
      if (priceRange.min) params.append('minPrice', priceRange.min)
      if (priceRange.max) params.append('maxPrice', priceRange.max)
      
      const response = await api.get(`/products?${params.toString()}`)
      return response.data.data
    }
  })

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/products/categories')
      return response.data.data
    }
  })

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory) params.set('category', selectedCategory)
    if (sortBy !== '-createdAt') params.set('sort', sortBy)
    if (priceRange.min) params.set('minPrice', priceRange.min)
    if (priceRange.max) params.set('maxPrice', priceRange.max)
    if (currentPage > 1) params.set('page', currentPage.toString())
    
    setSearchParams(params)
  }, [searchTerm, selectedCategory, sortBy, priceRange, currentPage, setSearchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    // URL will be updated by useEffect below
  }

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSortBy('-createdAt')
    setPriceRange({ min: '', max: '' })
    setCurrentPage(1)
  }

  if (error) {
    return (
      <div className="container-width section-padding py-12">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Products Unavailable</h3>
            <p className="text-orange-700 mb-4">
              Cannot connect to backend API. This is a demo frontend.
            </p>
            <p className="text-sm text-orange-600">
              Deploy the backend API and set VITE_API_URL to see products.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Shop - SecureShop</title>
        <meta name="description" content="Browse our secure collection of products with advanced filtering and search capabilities." />
      </Helmet>

      <div className="container-width section-padding py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-4">Shop</h1>
          <p className="text-neutral-600">
            Discover our premium product collection with advanced security systems
          </p>
        </div>

        {/* Main Content - Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  <span className="font-medium">Filters</span>
                  {(selectedCategory || priceRange.min || priceRange.max || searchTerm) && (
                    <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {[selectedCategory, priceRange.min, priceRange.max, searchTerm].filter(Boolean).length}
                    </span>
                  )}
                </div>
                {filtersVisible ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {/* Filters Panel */}
            <div className={`${filtersVisible ? 'block' : 'hidden'} lg:block bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden`}>
              {/* Search Section */}
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">Search</h3>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </form>
              </div>

              {/* Category Filter */}
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-neutral-700">All Categories</span>
                  </label>
                  {categoriesData?.map(category => (
                    <label key={category._id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category._id}
                        checked={selectedCategory === category._id}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-neutral-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">Price Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Price from (USD)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => {
                        setPriceRange(prev => ({ ...prev, min: e.target.value }))
                        setCurrentPage(1)
                      }}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Price to (USD)</label>
                    <input
                      type="number"
                      placeholder="∞"
                      value={priceRange.max}
                      onChange={(e) => {
                        setPriceRange(prev => ({ ...prev, max: e.target.value }))
                        setCurrentPage(1)
                      }}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory || priceRange.min || priceRange.max || searchTerm) && (
                <div className="p-6 border-b border-neutral-200">
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Active Filters</h3>
                  <div className="space-y-2">
                    {searchTerm && (
                      <div className="flex items-center justify-between bg-primary-50 px-3 py-2 rounded-lg">
                        <span className="text-sm text-primary-800">Search: "{searchTerm}"</span>
                        <button
                          onClick={() => {
                            setSearchTerm('')
                            setCurrentPage(1)
                          }}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {selectedCategory && (
                      <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                        <span className="text-sm text-green-800">
                          {categoriesData?.find(c => c._id === selectedCategory)?.name}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedCategory('')
                            setCurrentPage(1)
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {(priceRange.min || priceRange.max) && (
                      <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                        <span className="text-sm text-blue-800">
                          Price: ${priceRange.min || '0'} - ${priceRange.max || '∞'}
                        </span>
                        <button
                          onClick={() => {
                            setPriceRange({ min: '', max: '' })
                            setCurrentPage(1)
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Clear All Filters */}
              <div className="p-6">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-neutral-600 border border-neutral-300 rounded-lg hover:bg-neutral-50 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Products */}
          <div className="lg:col-span-3">
            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-6">
              {/* Sort and View Controls */}
              <div className="flex items-center gap-4">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm min-w-0"
                  >
                    <option value="-createdAt">Newest</option>
                    <option value="createdAt">Oldest</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                    <option value="-name">Name: Z to A</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-1 border border-neutral-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' 
                      ? 'bg-primary-600 text-white shadow-sm' 
                      : 'text-neutral-600 hover:bg-neutral-100'}`}
                    title="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' 
                      ? 'bg-primary-600 text-white shadow-sm' 
                      : 'text-neutral-600 hover:bg-neutral-100'}`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="text-center">
                  <LoadingSpinner size="large" />
                  <p className="text-neutral-600 mt-4">Loading products...</p>
                </div>
              </div>
            ) : productsData?.products.length > 0 ? (
              <>
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
                  : "space-y-6"
                }>
                  {productsData.products.map(product => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      layout={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {productsData.pagination.totalPages > 1 && (
                  <div className="mt-12">
                    <div className="flex flex-col items-center space-y-4">
                      {/* Page Info */}
                      <div className="text-sm text-neutral-600">
                        Page {currentPage} / {productsData.pagination.totalPages}
                      </div>
                      
                      {/* Pagination Buttons */}
                      <div className="flex flex-wrap justify-center gap-2">
                        {/* Previous Button */}
                        <button
                          onClick={() => {
                            setCurrentPage(currentPage - 1)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            currentPage === 1
                              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                              : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                          }`}
                        >
                          ← Previous
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: Math.min(productsData.pagination.totalPages, 7) }, (_, i) => {
                          let pageNumber;
                          if (productsData.pagination.totalPages <= 7) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 4) {
                            pageNumber = i + 1;
                          } else if (currentPage >= productsData.pagination.totalPages - 3) {
                            pageNumber = productsData.pagination.totalPages - 6 + i;
                          } else {
                            pageNumber = currentPage - 3 + i;
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => {
                                setCurrentPage(pageNumber)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                              }}
                              className={`px-4 py-2 rounded-lg font-medium ${
                                currentPage === pageNumber
                                  ? 'bg-primary-600 text-white shadow-md'
                                  : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}

                        {/* Next Button */}
                        <button
                          onClick={() => {
                            setCurrentPage(currentPage + 1)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          disabled={currentPage === productsData.pagination.totalPages}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            currentPage === productsData.pagination.totalPages
                              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                              : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                          }`}
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                    No products found
                  </h3>
                  <p className="text-neutral-500 mb-6">
                    {searchTerm || selectedCategory || priceRange.min || priceRange.max
                      ? 'Try adjusting the filters to see more results.'
                      : 'Currently no products available in the system.'
                    }
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ShopPage
