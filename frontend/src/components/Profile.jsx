import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const Profile = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    date_of_birth: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [balance, setBalance] = useState(null)
  const [balanceLoading, setBalanceLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || ''
      })
      fetchBalance()
    }
  }, [user])

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/user/balance', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.status === 200) {
        // backend returns { total_balance, accounts }
        setBalance(response.data.total_balance)
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setBalanceLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const response = await axios.put('/api/user/profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        setMessage('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Update error:', error)
      setMessage(error.response?.data?.error || 'Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Management</h1>
          
          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>

            {/* Account Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Information</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">User ID:</span>
                  <span className="font-medium text-gray-900">{user?._id}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{user?.email}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user?.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Login:</span>
                  <span className="font-medium text-gray-900">
                    {user?.last_login ? new Date(user.last_login).toLocaleDateString('en-IN') : 'Never'}
                  </span>
                </div>
              </div>

              {/* Balance Information */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Account Balance</h3>
                {balanceLoading ? (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading balance...</p>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      ₹{balance?.toLocaleString('en-IN') || '0'}
                    </div>
                    <p className="text-gray-600 mt-2">Available Balance</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
