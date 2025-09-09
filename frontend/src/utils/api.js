import axios from 'axios'

// Get API URL with fallback
const getApiUrl = () => {
  // Always use relative path in production for Vercel
  if (import.meta.env.PROD) {
    return '/api'
  }
  
  // Development fallback
  return 'http://localhost:5000/api'
}

// Create axios instance
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000, // Increased timeout for serverless functions
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
            { refreshToken }
          )

          const { token, refreshToken: newRefreshToken } = response.data.data
          
          localStorage.setItem('token', token)
          localStorage.setItem('refreshToken', newRefreshToken)
          
          // Update authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          originalRequest.headers.Authorization = `Bearer ${token}`
          
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        delete api.defaults.headers.common['Authorization']
        
        // Only redirect if we're not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.'
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      error.message = 'Too many requests. Please try again later.'
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.'
    }

    return Promise.reject(error)
  }
)

export default api
