import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const TransferSystem = () => {
  const { user } = useAuth()
  const [beneficiaries, setBeneficiaries] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [otpPhase, setOtpPhase] = useState(false)
  const [otp, setOtp] = useState('')
  const [pendingTransferId, setPendingTransferId] = useState('')
  const [beneficiariesLoading, setBeneficiariesLoading] = useState(true)

  const [transferForm, setTransferForm] = useState({
    from_acc_number: '',
    beneficiary_id: '',
    amount: '',
    transfer_mode: 'same_bank'
  })

  const [beneficiaryForm, setBeneficiaryForm] = useState({
    name: '',
    account_number: '',
    ifsc: '',
    email: '',
    bank_name: 'SBI'
  })

  // Fetch user accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('/api/user/accounts', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.status === 200) {
          setAccounts(res.data.accounts || [])
          if (res.data.accounts.length > 0) {
            setTransferForm(prev => ({
              ...prev,
              from_acc_number: res.data.accounts[0].account_number
            }))
          }
        }
      } catch (err) {
        console.error('Error fetching accounts:', err)
      }
    }
    fetchAccounts()
  }, [])

  // Fetch beneficiaries
  useEffect(() => {
    fetchBeneficiaries()
  }, [])

  const fetchBeneficiaries = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/beneficiaries', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.status === 200) {
        setBeneficiaries(res.data.beneficiaries || [])
      }
    } catch (err) {
      console.error('Error fetching beneficiaries:', err)
      setBeneficiaries([])
    } finally {
      setBeneficiariesLoading(false)
    }
  }

  const handleTransferChange = e => {
    setTransferForm({ ...transferForm, [e.target.name]: e.target.value })
  }

  const handleBeneficiaryChange = e => {
    setBeneficiaryForm({ ...beneficiaryForm, [e.target.name]: e.target.value })
  }

  const handleTransfer = async e => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        '/api/transfer/initiate',
        transferForm,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.status === 200) {
        setPendingTransferId(response.data.pending_transfer_id)
        setOtpPhase(true)
        setMessage('OTP sent to your email. Please enter the 6-digit code to confirm.')
      }
    } catch (error) {
      console.error('Transfer error:', error)
      setMessage(error.response?.data?.error || 'Transfer failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyTransfer = async e => {
    e.preventDefault()
    if (!/^[0-9]{6}$/.test(otp)) {
      setMessage('Enter a valid 6-digit OTP')
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        '/api/transfer/verify',
        { pending_transfer_id: pendingTransferId, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.status === 200) {
        setMessage('Transfer completed successfully!')
        setTransferForm(prev => ({ ...prev, beneficiary_id: '', amount: '', transfer_mode: 'same_bank' }))
        setOtp('')
        setOtpPhase(false)
        setPendingTransferId('')
        fetchBeneficiaries()
      }
    } catch (err) {
      console.error('Verify transfer error:', err)
      setMessage(err.response?.data?.error || 'OTP verification failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBeneficiary = async e => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        '/api/beneficiaries',
        beneficiaryForm,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.status === 201) {
        setMessage(response.data.message)
        setBeneficiaryForm({ name: '', account_number: '', ifsc: '', email: '', bank_name: 'SBI' })
        fetchBeneficiaries()
      }
    } catch (error) {
      console.error('Add beneficiary error:', error)
      setMessage(error.response?.data?.error || 'Failed to add beneficiary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const transferModes = [
    { value: 'same_bank', label: 'Same Bank Transfer' },
    { value: 'other_bank_imps', label: 'Other Bank - IMPS (Instant)' },
    { value: 'other_bank_rtgs', label: 'Other Bank - RTGS (Delayed)' }
  ]

  const banks = [
    { value: 'SBI', label: 'State Bank of India' },
    { value: 'HDFC', label: 'HDFC Bank' },
    { value: 'ICICI', label: 'ICICI Bank' },
    { value: 'AXIS', label: 'Axis Bank' },
    { value: 'KOTAK', label: 'Kotak Mahindra Bank' },
    { value: 'OTHER', label: 'Other Bank' }
  ]

  // Cleaned selectable beneficiaries logic
  const getSelectableBeneficiaries = () => {
    // Remove duplicates by account number
    const uniqueBeneficiariesMap = {}
    beneficiaries.forEach(b => {
      if (!uniqueBeneficiariesMap[b.account_number]) {
        uniqueBeneficiariesMap[b.account_number] = b
      }
    })

    // Separate verified and pending
    const verified = []
    const pending = []
    Object.values(uniqueBeneficiariesMap).forEach(b => {
      if (b.verified) verified.push({ ...b, pending: false })
      else pending.push({ ...b, pending: true })
    })

    // Return verified first, then pending
    return [...verified, ...pending]
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Money Transfer System</h1>

          {message && (
            <div
              className={`mb-6 p-4 rounded-md ${
                message.toLowerCase().includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Transfer Form */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Transfer Money</h2>
              {!otpPhase ? (
              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                  <select
                    name="from_acc_number"
                    value={transferForm.from_acc_number}
                    onChange={handleTransferChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading || accounts.length === 0}
                  >
                    {accounts.map(acc => (
                      <option key={acc.account_number} value={acc.account_number}>
                        {acc.account_type?.toUpperCase() || 'ACCOUNT'} - {acc.account_number}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Beneficiary</label>
                  <select
                    name="beneficiary_id"
                    value={transferForm.beneficiary_id}
                    onChange={handleTransferChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading || beneficiariesLoading}
                  >
                    <option value="">Select beneficiary</option>
                    {getSelectableBeneficiaries().map(b => (
                      <option key={b._id} value={b._id} disabled={b.pending}>
                        {b.name} - {b.account_number} {b.pending ? ' ⏳ Pending' : ' ✅'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Mode</label>
                  <select
                    name="transfer_mode"
                    value={transferForm.transfer_mode}
                    onChange={handleTransferChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  >
                    {transferModes.map(mode => (
                      <option key={mode.value} value={mode.value}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={transferForm.amount}
                    onChange={handleTransferChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    min="1"
                    max="100000"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Transfer Money'}
                </button>
              </form>
              ) : (
              <form onSubmit={handleVerifyTransfer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={otp}
                    onChange={(e)=>setOtp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest text-center"
                    placeholder="______"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={handleTransfer}
                    disabled={loading}
                    className="w-40 bg-gray-200 text-gray-800 py-2 px-4 rounded-md disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
              )}
            </div>

            {/* Add Beneficiary Form */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Beneficiary</h2>
              <form onSubmit={handleAddBeneficiary} className="space-y-4">
                {['name', 'account_number', 'ifsc', 'email'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={beneficiaryForm[field]}
                      onChange={handleBeneficiaryChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${field.replace('_', ' ')}`}
                      required
                      disabled={loading}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <select
                    name="bank_name"
                    value={beneficiaryForm.bank_name}
                    onChange={handleBeneficiaryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    {banks.map(bank => (
                      <option key={bank.value} value={bank.value}>
                        {bank.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Beneficiary'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferSystem
