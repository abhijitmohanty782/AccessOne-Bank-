import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const SecuritySettings = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [securitySettings, setSecuritySettings] = useState({
    account_blocked: false,
    card_blocked: false,
    online_transactions: true,
    atm_transactions: true,
    upi_transactions: true,
    international_transactions: false,
    sms_alerts: true,
    email_alerts: true,
    push_notifications: true,
    two_factor_auth: false,
    biometric_auth: false,
    login_notifications: true,
    transaction_limits: {
      daily_limit: 50000,
      monthly_limit: 500000,
      per_transaction_limit: 25000
    }
  })

  useEffect(() => {
    fetchSecuritySettings()
  }, [])

  const fetchSecuritySettings = async () => {
    try {
      // Simulate API call to fetch security settings
      // In real app, this would be: const response = await axios.get('/api/user/security-settings')
      setSecuritySettings(prev => ({
        ...prev,
        // Simulate some settings being loaded
        account_blocked: false,
        card_blocked: false
      }))
    } catch (error) {
      console.error('Error fetching security settings:', error)
    }
  }

  const handleToggle = async (setting, value) => {
    setLoading(true)
    setMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setSecuritySettings(prev => ({
        ...prev,
        [setting]: value
      }))
      
      setMessage(`${setting.replace('_', ' ')} ${value ? 'enabled' : 'disabled'} successfully!`)
    } catch (error) {
      setMessage('Failed to update setting. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBlockAccount = async () => {
    setLoading(true)
    setMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSecuritySettings(prev => ({
        ...prev,
        account_blocked: !prev.account_blocked
      }))
      
      setMessage(`Account ${securitySettings.account_blocked ? 'unblocked' : 'blocked'} successfully!`)
    } catch (error) {
      setMessage('Failed to update account status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBlockCard = async () => {
    setLoading(true)
    setMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSecuritySettings(prev => ({
        ...prev,
        card_blocked: !prev.card_blocked
      }))
      
      setMessage(`Card ${securitySettings.card_blocked ? 'unblocked' : 'blocked'} successfully!`)
    } catch (error) {
      setMessage('Failed to update card status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLimitChange = async (limitType, value) => {
    setLoading(true)
    setMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setSecuritySettings(prev => ({
        ...prev,
        transaction_limits: {
          ...prev.transaction_limits,
          [limitType]: parseFloat(value)
        }
      }))
      
      setMessage('Transaction limit updated successfully!')
    } catch (error) {
      setMessage('Failed to update transaction limit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account security and transaction preferences</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* Account Control */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Control</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Account Status</h3>
                  <p className="text-sm text-gray-600">
                    {securitySettings.account_blocked ? 'Account is currently blocked' : 'Account is active'}
                  </p>
                </div>
                <button
                  onClick={handleBlockAccount}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    securitySettings.account_blocked
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  } disabled:opacity-50`}
                >
                  {securitySettings.account_blocked ? 'Unblock Account' : 'Block Account'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Card Status</h3>
                  <p className="text-sm text-gray-600">
                    {securitySettings.card_blocked ? 'Card is currently blocked' : 'Card is active'}
                  </p>
                </div>
                <button
                  onClick={handleBlockCard}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    securitySettings.card_blocked
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  } disabled:opacity-50`}
                >
                  {securitySettings.card_blocked ? 'Unblock Card' : 'Block Card'}
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Controls */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Transaction Controls</h2>
            
            <div className="space-y-4">
              {[
                { key: 'online_transactions', label: 'Online Transactions', description: 'Allow online banking transactions' },
                { key: 'atm_transactions', label: 'ATM Transactions', description: 'Allow ATM withdrawals and deposits' },
                { key: 'upi_transactions', label: 'UPI Transactions', description: 'Allow UPI payments and transfers' },
                { key: 'international_transactions', label: 'International Transactions', description: 'Allow international card transactions' }
              ].map(setting => (
                <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{setting.label}</h3>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(setting.key, !securitySettings[setting.key])}
                    disabled={loading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      securitySettings[setting.key] ? 'bg-primary-600' : 'bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securitySettings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Limits */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Transaction Limits</h2>
            
            <div className="space-y-4">
              {[
                { key: 'daily_limit', label: 'Daily Limit', description: 'Maximum amount per day' },
                { key: 'monthly_limit', label: 'Monthly Limit', description: 'Maximum amount per month' },
                { key: 'per_transaction_limit', label: 'Per Transaction Limit', description: 'Maximum amount per transaction' }
              ].map(limit => (
                <div key={limit.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{limit.label}</h3>
                    <p className="text-sm text-gray-600">{limit.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">₹</span>
                    <input
                      type="number"
                      value={securitySettings.transaction_limits[limit.key]}
                      onChange={(e) => handleLimitChange(limit.key, e.target.value)}
                      className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={loading}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
            
            <div className="space-y-4">
              {[
                { key: 'sms_alerts', label: 'SMS Alerts', description: 'Receive SMS notifications for transactions' },
                { key: 'email_alerts', label: 'Email Alerts', description: 'Receive email notifications for transactions' },
                { key: 'push_notifications', label: 'Push Notifications', description: 'Receive push notifications on mobile' },
                { key: 'login_notifications', label: 'Login Notifications', description: 'Get notified of new login attempts' }
              ].map(setting => (
                <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{setting.label}</h3>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(setting.key, !securitySettings[setting.key])}
                    disabled={loading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      securitySettings[setting.key] ? 'bg-primary-600' : 'bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securitySettings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Authentication Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Authentication Settings</h2>
            
            <div className="space-y-4">
              {[
                { key: 'two_factor_auth', label: 'Two-Factor Authentication', description: 'Require additional verification for login' },
                { key: 'biometric_auth', label: 'Biometric Authentication', description: 'Use fingerprint or face recognition' }
              ].map(setting => (
                <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{setting.label}</h3>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(setting.key, !securitySettings[setting.key])}
                    disabled={loading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      securitySettings[setting.key] ? 'bg-primary-600' : 'bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securitySettings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecuritySettings
