import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Shield, 
  Search,
  LogOut,
  Package,
  Home,
  Store,
  Info,
  Phone
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useQuery } from '@tanstack/react-query'
import api from '../../utils/api'
import { getProductUrl } from '../../utils/productMapping'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const searchRef = useRef(null)
  const userMenuRef = useRef(null)
  const { isAuthenticated, user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Search suggestions API call
  const { data: searchSuggestions, isLoading: searchLoading } = useQuery({
    queryKey: ['searchSuggestions', debouncedSearchQuery],
    queryFn: async () => {
      if (debouncedSearchQuery.length < 1) return { products: [] }
      try {
        const response = await api.get(`/products?search=${encodeURIComponent(debouncedSearchQuery)}&limit=5`)
        return response.data.data || { products: [] }
      } catch (error) {
        console.error('Search API error:', error)
        return { products: [] }
      }
    },
    enabled: debouncedSearchQuery.length >= 1,
    staleTime: 300000, // 5 minutes
  })

  // Hide suggestions and menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search suggestions
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false)
        setSelectedSuggestionIndex(-1)
      }
      // Close user menu when clicking outside
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSearchSuggestions || !searchSuggestions?.products.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => 
        prev < searchSuggestions.products.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedSuggestionIndex >= 0) {
        const selectedProduct = searchSuggestions.products[selectedSuggestionIndex]
        navigate(getProductUrl(selectedProduct._id))
        setSearchQuery('')
        setShowSearchSuggestions(false)
        setSelectedSuggestionIndex(-1)
      } else {
        handleSearch(e)
      }
    } else if (e.key === 'Escape') {
      setShowSearchSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsUserMenuOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setShowSearchSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setSelectedSuggestionIndex(-1)
    setShowSearchSuggestions(value.length > 0)
  }

  const handleSuggestionClick = (product) => {
    navigate(getProductUrl(product._id))
    setSearchQuery('')
    setShowSearchSuggestions(false)
    setSelectedSuggestionIndex(-1)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const cartItemsCount = cart?.itemsCount || 0

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="SecureShop Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-primary-600">SecureShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/shop" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1"
            >
              <Store className="w-4 h-4" />
              <span>Shop</span>
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1"
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1"
            >
              <Phone className="w-4 h-4" />
              <span>Contact</span>
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-6" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.length > 0 && setShowSearchSuggestions(true)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                
                {/* Search Suggestions Dropdown */}
                {showSearchSuggestions && searchQuery.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {searchLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                        Searching...
                      </div>
                    ) : searchSuggestions?.products?.length > 0 ? (
                      <>
                        <div className="p-2 text-xs text-gray-500 border-b border-gray-100">
                          Gợi ý sản phẩm ({searchSuggestions.products.length})
                        </div>
                        {searchSuggestions.products.map((product, index) => (
                          <div
                            key={product._id}
                            onClick={() => handleSuggestionClick(product)}
                            className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 ${
                              selectedSuggestionIndex === index ? 'bg-primary-50' : ''
                            }`}
                          >
                            <img
                              src={(product.images?.find(img => img.isPrimary) || product.images?.[0])?.url || '/placeholder-product.jpg'}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md mr-3 flex-shrink-0"
                              onError={(e) => {
                                e.target.src = '/placeholder-product.jpg'
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {product.name}
                              </div>
                              <div className="text-sm text-primary-600 font-semibold">
                                {product.comparePrice && product.comparePrice > product.price ? (
                                  <>
                                    {formatPrice(product.price)}
                                    <span className="ml-2 text-xs text-gray-500 line-through">
                                      {formatPrice(product.comparePrice)}
                                    </span>
                                  </>
                                ) : (
                                  formatPrice(product.price)
                                )}
                              </div>
                              {product.category?.name && (
                                <div className="text-xs text-gray-500">
                                  {product.category.name}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {searchSuggestions.products.length > 0 && (
                          <div className="p-3 border-t border-gray-100">
                            <button
                              onClick={handleSearch}
                              className="w-full text-left text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Xem tất cả kết quả cho "{searchQuery}"
                            </button>
                          </div>
                        )}
                      </>
                    ) : searchQuery.length > 0 && !searchLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        Không tìm thấy sản phẩm nào cho "{searchQuery}"
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden sm:block">
                    {user?.name ? user.name.split(' ').pop() : user?.email?.split('@')[0]}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            {/* Mobile Search */}
            <div className="pt-4 mb-4" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchQuery.length > 0 && setShowSearchSuggestions(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  
                  {/* Mobile Search Suggestions */}
                  {showSearchSuggestions && searchQuery.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                      {searchLoading ? (
                        <div className="p-4 text-center text-gray-500">
                          <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                          Searching...
                        </div>
                      ) : searchSuggestions?.products?.length > 0 ? (
                        <>
                          {searchSuggestions.products.map((product, index) => (
                            <div
                              key={product._id}
                              onClick={() => {
                                handleSuggestionClick(product)
                                setIsMenuOpen(false)
                              }}
                              className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 ${
                                selectedSuggestionIndex === index ? 'bg-primary-50' : ''
                              }`}
                            >
                              <img
                                src={(product.images?.find(img => img.isPrimary) || product.images?.[0])?.url || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded-md mr-3 flex-shrink-0"
                                onError={(e) => {
                                  e.target.src = '/placeholder-product.jpg'
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate text-sm">
                                  {product.name}
                                </div>
                                <div className="text-sm text-primary-600 font-semibold">
                                  {product.comparePrice && product.comparePrice > product.price ? (
                                    <>
                                      {formatPrice(product.price)}
                                      <span className="ml-1 text-xs text-gray-500 line-through">
                                        {formatPrice(product.comparePrice)}
                                      </span>
                                    </>
                                  ) : (
                                    formatPrice(product.price)
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="p-3 border-t border-gray-100">
                            <button
                              onClick={(e) => {
                                handleSearch(e)
                                setIsMenuOpen(false)
                              }}
                              className="w-full text-left text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Xem tất cả kết quả
                            </button>
                          </div>
                        </>
                      ) : searchQuery.length > 0 && !searchLoading ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          Không tìm thấy sản phẩm nào
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link 
                to="/shop" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-2"
              >
                <Store className="w-4 h-4" />
                <span>Shop</span>
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-2"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Contact</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
