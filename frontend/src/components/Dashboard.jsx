import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useAuth()
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('/api/user/balance')
        setBalance(response.data)
      } catch (error) {
        console.error('Error fetching balance:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBalance()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Account Overview */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium">{user?.account_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-medium capitalize">{user?.account_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Balance</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  ${balance?.balance?.toFixed(2) || '0.00'}
                </div>
                <p className="text-gray-600 mt-2">Available Balance</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="btn-primary w-full">
                  Transfer Money
                </button>
                <button className="btn-secondary w-full">
                  View Transactions
                </button>
                <button className="btn-secondary w-full">
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <p>No recent transactions</p>
                <p className="text-sm">Your transaction history will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
