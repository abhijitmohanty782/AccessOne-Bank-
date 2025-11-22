import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const ChangePassword = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const handleChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Validate passwords match
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setMessage('New passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    const password = passwordForm.new_password
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    if (!/(?=.*[a-z])/.test(password)) {
      setMessage('Password must contain at least one lowercase letter')
      setLoading(false)
      return
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      setMessage('Password must contain at least one uppercase letter')
      setLoading(false)
      return
    }

    if (!/(?=.*\d)/.test(password)) {
      setMessage('Password must contain at least one number')
      setLoading(false)
      return
    }

    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?])/.test(password)) {
      setMessage('Password must contain at least one special character')
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/auth/change_password', {
        old_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        setMessage('Password changed successfully!')
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: ''
        })
      }
    } catch (error) {
      console.error('Change password error:', error)
      setMessage(error.response?.data?.error || 'Failed to change password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/(?=.*[a-z])/.test(password)) strength++
    if (/(?=.*[A-Z])/.test(password)) strength++
    if (/(?=.*\d)/.test(password)) strength++
    if (/(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?])/.test(password)) strength++
    
    return {
      score: strength,
      label: strength < 2 ? 'Weak' : strength < 4 ? 'Medium' : 'Strong',
      color: strength < 2 ? 'bg-red-500' : strength < 4 ? 'bg-yellow-500' : 'bg-green-500'
    }
  }

  const passwordStrength = getPasswordStrength(passwordForm.new_password)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h1>
          
          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                value={passwordForm.current_password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                value={passwordForm.new_password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                required
                disabled={loading}
              />
              
              {/* Password Strength Indicator */}
              {passwordForm.new_password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${
                      passwordStrength.score < 2 ? 'text-red-600' : 
                      passwordStrength.score < 4 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={passwordForm.confirm_password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
              
              {/* Password Match Indicator */}
              {passwordForm.confirm_password && (
                <div className="mt-1">
                  {passwordForm.new_password === passwordForm.confirm_password ? (
                    <span className="text-sm text-green-600">✓ Passwords match</span>
                  ) : (
                    <span className="text-sm text-red-600">✗ Passwords do not match</span>
                  )}
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className={`flex items-center ${passwordForm.new_password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="mr-2">{passwordForm.new_password.length >= 8 ? '✓' : '○'}</span>
                  At least 8 characters long
                </li>
                <li className={`flex items-center ${/(?=.*[a-z])/.test(passwordForm.new_password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="mr-2">{/(?=.*[a-z])/.test(passwordForm.new_password) ? '✓' : '○'}</span>
                  At least one lowercase letter
                </li>
                <li className={`flex items-center ${/(?=.*[A-Z])/.test(passwordForm.new_password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="mr-2">{/(?=.*[A-Z])/.test(passwordForm.new_password) ? '✓' : '○'}</span>
                  At least one uppercase letter
                </li>
                <li className={`flex items-center ${/(?=.*\d)/.test(passwordForm.new_password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="mr-2">{/(?=.*\d)/.test(passwordForm.new_password) ? '✓' : '○'}</span>
                  At least one number
                </li>
                <li className={`flex items-center ${/(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?])/.test(passwordForm.new_password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="mr-2">{/(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?])/.test(passwordForm.new_password) ? '✓' : '○'}</span>
                  At least one special character
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || passwordForm.new_password !== passwordForm.confirm_password || passwordStrength.score < 5}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
