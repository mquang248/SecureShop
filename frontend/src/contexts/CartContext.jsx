import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import api from '../utils/api'

const CartContext = createContext()

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
        loading: false,
        error: null,
      }
    case 'ADD_ITEM_SUCCESS':
      return {
        ...state,
        cart: action.payload,
        loading: false,
        error: null,
      }
    case 'UPDATE_ITEM_SUCCESS':
      return {
        ...state,
        cart: action.payload,
        loading: false,
        error: null,
      }
    case 'REMOVE_ITEM_SUCCESS':
      return {
        ...state,
        cart: action.payload,
        loading: false,
        error: null,
      }
    case 'CLEAR_CART_SUCCESS':
      return {
        ...state,
        cart: {
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          itemsCount: 0,
        },
        loading: false,
        error: null,
      }
    case 'APPLY_COUPON_SUCCESS':
      return {
        ...state,
        cart: action.payload,
        loading: false,
        error: null,
      }
    case 'REMOVE_COUPON_SUCCESS':
      return {
        ...state,
        cart: action.payload,
        loading: false,
        error: null,
      }
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
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
const initialState = {
  cart: {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemsCount: 0,
  },
  loading: false,
  error: null,
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isAuthenticated, user } = useAuth()

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR_CART_SUCCESS' })
      return
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await api.get('/cart')
      dispatch({ type: 'SET_CART', payload: response.data.data.cart })
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      // Only clear cart if it's a real error, not a network error
      if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch({ type: 'CLEAR_CART_SUCCESS' })
      } else {
        // For other errors, just set loading = false without clearing cart
        dispatch({ type: 'SET_LOADING', payload: false })
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' })
      }
    }
  }, [isAuthenticated])

  // Add item to cart
  const addToCart = useCallback(async (productId, quantity = 1, selectedVariants = []) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await api.post('/cart/items', {
        productId,
        quantity,
        selectedVariants,
      })
      
      dispatch({ type: 'ADD_ITEM_SUCCESS', payload: response.data.data.cart })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw new Error(errorMessage)
    }
  }, [])

  // Update item quantity
  const updateItemQuantity = useCallback(async (itemId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await api.put(`/cart/items/${itemId}`, { quantity })
      
      dispatch({ type: 'UPDATE_ITEM_SUCCESS', payload: response.data.data.cart })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update item quantity'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw new Error(errorMessage)
    }
  }, [])

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await api.delete(`/cart/items/${itemId}`)
      
      dispatch({ type: 'REMOVE_ITEM_SUCCESS', payload: response.data.data.cart })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw new Error(errorMessage)
    }
  }, [])

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      await api.delete('/cart')
      
      dispatch({ type: 'CLEAR_CART_SUCCESS' })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw new Error(errorMessage)
    }
  }, [])

  // Apply coupon
  const applyCoupon = useCallback(async (code) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await api.post('/cart/coupon', { code })
      
      dispatch({ type: 'APPLY_COUPON_SUCCESS', payload: response.data.data.cart })
      return { success: true, message: response.data.message }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to apply coupon'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw new Error(errorMessage)
    }
  }, [])

  // Remove coupon
  const removeCoupon = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await api.delete('/cart/coupon')
      
      dispatch({ type: 'REMOVE_COUPON_SUCCESS', payload: response.data.data.cart })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove coupon'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw new Error(errorMessage)
    }
  }, [])

  // Get cart summary
  const getCartSummary = useCallback(async () => {
    try {
      const response = await api.get('/cart/summary')
      return response.data.data
    } catch (error) {
      console.error('Failed to get cart summary:', error)
      return {
        itemsCount: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
      }
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart()
    } else {
      dispatch({ type: 'CLEAR_CART_SUCCESS' })
    }
  }, [isAuthenticated, user, fetchCart])

  const value = {
    ...state,
    fetchCart,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartSummary,
    clearError,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
