import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()
console.log("BASE URL =>", import.meta.env.VITE_API_BASE_URL);

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Set axios base URL once
  if (!axios.defaults.baseURL) {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  }

  // Set up axios interceptor for auth token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/user/profile')
          setUser(response.data)
        } catch (error) {
          console.error('Auth check failed:', error)
          logout()
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token: newToken, ...userData } = response.data
      
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('token', newToken)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      }
    }
  }

  // OTP-based registration
  const registerInitiate = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register/initiate', userData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send OTP'
      }
    }
  }

  const registerVerify = async (email, otp) => {
    try {
      const response = await axios.post('/api/auth/register/verify', { email, otp })
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'OTP verification failed'
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    login,
    register,
    registerInitiate,
    registerVerify,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
