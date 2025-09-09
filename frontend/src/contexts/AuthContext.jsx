import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext()

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

// Initial state
const getInitialState = () => {
  const token = localStorage.getItem('token')
  return {
    isAuthenticated: !!token, // true nếu có token
    user: null,
    token: token,
    loading: false,
    error: null,
  }
}

const initialState = getInitialState()

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set authorization header if token exists on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [])

  // Login function
  const login = useCallback(async (email, password, mfaToken = null) => {
    try {
      dispatch({ type: 'LOGIN_START' })

      const response = await api.post('/auth/login', {
        email,
        password,
        mfaToken,
      })

      if (response.data.requiresMFA) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'MFA_REQUIRED' })
        return { requiresMFA: true }
      }

      const { token, user } = response.data.data

      // Store token in localStorage
      localStorage.setItem('token', token)
      if (response.data.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken)
      }

      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      })

      return { success: true, user }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
      throw new Error(errorMessage)
    }
  }, [])

  // Register function
  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' })

      const response = await api.post('/auth/register', userData)

      // Registration successful, but email verification required
      dispatch({ type: 'LOGIN_FAILURE', payload: null })
      
      return {
        success: true,
        message: response.data.message,
        requiresVerification: true,
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
      throw new Error(errorMessage)
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout API
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      
      // Clear authorization header
      delete api.defaults.headers.common['Authorization']
      
      dispatch({ type: 'LOGOUT' })
    }
  }, [])

  // Check auth status
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      dispatch({ type: 'LOGOUT' })
      return
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Check if token is valid by fetching user data
      const response = await api.get('/auth/me')
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.data.user,
          token,
        },
      })
    } catch (error) {
      console.error('Auth check error:', error)
      // Only logout if it's definitely an authentication error (401, 403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        delete api.defaults.headers.common['Authorization']
        dispatch({ type: 'LOGOUT' })
      } else {
        // For network or server errors, keep current state
        console.warn('Network or server error, keeping current auth state')
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Update user profile
  const updateProfile = useCallback(async (userData) => {
    try {
      const response = await api.put('/users/profile', userData)
      
      // Backend returns { success: true, data: { user } } format
      const updatedUser = response.data.data.user
      
      dispatch({
        type: 'UPDATE_USER',
        payload: updatedUser,
      })
      
      return updatedUser
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed'
      throw new Error(errorMessage)
    }
  }, [])

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      await api.put('/users/change-password', {
        currentPassword,
        newPassword,
      })
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed'
      throw new Error(errorMessage)
    }
  }, [])

  // Setup MFA
  const setupMFA = useCallback(async () => {
    try {
      const response = await api.post('/auth/setup-mfa')
      return response.data.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'MFA setup failed'
      throw new Error(errorMessage)
    }
  }, [])

  // Verify and enable MFA
  const verifyMFA = useCallback(async (token) => {
    try {
      const response = await api.post('/auth/verify-mfa', { token })
      
      // Update user with MFA enabled
      dispatch({
        type: 'UPDATE_USER',
        payload: { mfaEnabled: true },
      })
      
      return response.data.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'MFA verification failed'
      throw new Error(errorMessage)
    }
  }, [])

  // Disable MFA
  const disableMFA = useCallback(async (mfaToken) => {
    try {
      await api.post('/auth/disable-mfa', { mfaToken })
      
      // Update user with MFA disabled
      dispatch({
        type: 'UPDATE_USER',
        payload: { mfaEnabled: false },
      })
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'MFA disable failed'
      throw new Error(errorMessage)
    }
  }, [])

  // Forgot password
  const forgotPassword = useCallback(async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset request failed'
      throw new Error(errorMessage)
    }
  }, [])

  // Reset password
  const resetPassword = useCallback(async (token, password) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed'
      throw new Error(errorMessage)
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  const value = {
    ...state,
    login,
    register,
    logout,
    checkAuthStatus,
    updateProfile,
    changePassword,
    setupMFA,
    verifyMFA,
    disableMFA,
    forgotPassword,
    resetPassword,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
