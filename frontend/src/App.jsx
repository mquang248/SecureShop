import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Layout from './components/Layout/Layout'
import ScrollToTop from './components/common/ScrollToTop'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductLinksPage from './pages/ProductLinksPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import NotFoundPage from './pages/NotFoundPage'
import PrivateRoute from './components/auth/PrivateRoute'
import AdminRoute from './components/auth/AdminRoute'
// Import 18 product pages
import {
  Product1, Product2, Product3, Product4, Product5, Product6,
  Product7, Product8, Product9, Product10, Product11, Product12,
  Product13, Product14, Product15, Product16, Product17, Product18
} from './product'
// New pages
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'
import ShippingInfoPage from './pages/ShippingInfoPage'
import ReturnsExchangesPage from './pages/ReturnsExchangesPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import SecurityPage from './pages/SecurityPage'
import SupportCenterPage from './pages/SupportCenterPage'
import TrackOrderPage from './pages/TrackOrderPage'
import { useToast } from './contexts/ToastContext'
import Toast from './components/ui/Toast'
import { useAuth } from './contexts/AuthContext'
import { useEffect } from 'react'

function App() {
  const { toast, hideToast } = useToast()
  const { checkAuthStatus } = useAuth()

  useEffect(() => {
    // Check authentication status on app load
    checkAuthStatus()
  }, [checkAuthStatus])

  return (
    <>
      <Helmet>
        <title>SecureShop - Secure Shopping, Powered by Cloud</title>
        <meta name="description" content="Modern e-commerce platform with enterprise-grade security and cloud infrastructure. Shop securely with confidence." />
        <link rel="canonical" href="https://secureshop.com" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <ScrollToTop />
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            
            {/* 18 individual product pages with IDs from 1-18 */}
            <Route path="/shop/1" element={<Product1 />} />
            <Route path="/shop/2" element={<Product2 />} />
            <Route path="/shop/3" element={<Product3 />} />
            <Route path="/shop/4" element={<Product4 />} />
            <Route path="/shop/5" element={<Product5 />} />
            <Route path="/shop/6" element={<Product6 />} />
            <Route path="/shop/7" element={<Product7 />} />
            <Route path="/shop/8" element={<Product8 />} />
            <Route path="/shop/9" element={<Product9 />} />
            <Route path="/shop/10" element={<Product10 />} />
            <Route path="/shop/11" element={<Product11 />} />
            <Route path="/shop/12" element={<Product12 />} />
            <Route path="/shop/13" element={<Product13 />} />
            <Route path="/shop/14" element={<Product14 />} />
            <Route path="/shop/15" element={<Product15 />} />
            <Route path="/shop/16" element={<Product16 />} />
            <Route path="/shop/17" element={<Product17 />} />
            <Route path="/shop/18" element={<Product18 />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Private Routes */}
            <Route path="/cart" element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            } />
            <Route path="/checkout" element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            } />
            <Route path="/orders/:id" element={
              <PrivateRoute>
                <OrderDetailsPage />
              </PrivateRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } />
            
            {/* Information Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/shipping" element={<ShippingInfoPage />} />
            <Route path="/returns" element={<ReturnsExchangesPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/support" element={<SupportCenterPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>

        {/* Toast Container */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={hideToast}
          />
        )}
      </div>
    </>
  )
}

export default App
