import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const ManageAccounts = () => {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    account_type: 'savings',
    initial_deposit: '',
    purpose: '',
    business_name: '',
    business_type: '',
    gst_number: '',
    pan_number: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/user/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.status === 200) {
        setAccounts(response.data.accounts || [])
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/user/accounts', {
        account_type: formData.account_type,
        initial_deposit: parseFloat(formData.initial_deposit) || 0,
        purpose: formData.purpose,
        business_name: formData.business_name,
        business_type: formData.business_type,
        gst_number: formData.gst_number,
        pan_number: formData.pan_number
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 201) {
        setMessage(`${formData.account_type.charAt(0).toUpperCase() + formData.account_type.slice(1)} account created successfully!`)
        setShowCreateForm(false)
        setFormData({
          account_type: 'savings',
          initial_deposit: '',
          purpose: '',
          business_name: '',
          business_type: '',
          gst_number: '',
          pan_number: ''
        })
        fetchAccounts()
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Manage Accounts</h1>
            <p className="text-gray-600 mt-2">View and manage your bank accounts</p>
          </div>

          <div className="mb-6">
            <button onClick={() => setShowCreateForm(true)} className="btn-primary">
              + Create Account
            </button>
          </div>

          {showCreateForm && (
            <div className="card mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>
                <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <select name="account_type" value={formData.account_type} onChange={handleChange} className="input-field" required>
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                    </select>
                  </div>

                  {formData.account_type === 'current' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Purpose
                        </label>
                        <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Name
                        </label>
                        <input type="text" name="business_name" value={formData.business_name} onChange={handleChange} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Type
                        </label>
                        <input type="text" name="business_type" value={formData.business_type} onChange={handleChange} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PAN Number
                        </label>
                        <input type="text" name="pan_number" value={formData.pan_number} onChange={handleChange} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          GST Number (Optional)
                        </label>
                        <input type="text" name="gst_number" value={formData.gst_number} onChange={handleChange} className="input-field" />
                      </div>
                    </>
                  )}
                </div>

                {message && (
                  <div className={`p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">{loading ? 'Creating...' : 'Create Account'}</button>
                </div>
              </form>
            </div>
          )}

          {/* Accounts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map(account => (
              <div key={account.account_number} className="card">
                <h3 className="font-semibold text-gray-900 capitalize">{account.account_type} Account</h3>
                <p className="text-sm text-gray-600">{account.account_number}</p>
                <p>Balance: ₹{account.balance.toLocaleString()}</p>
                {account.business_name && <p>Business: {account.business_name}</p>}
              </div>
            ))}
          </div>

          {accounts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Accounts Found</h3>
              <p className="text-gray-600">Create your first account to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageAccounts
