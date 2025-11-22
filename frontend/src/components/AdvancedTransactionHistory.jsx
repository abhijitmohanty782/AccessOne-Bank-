import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdvancedTransactionHistory = () => {
  const [type, setType] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('/api/user/accounts', { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
          setAccounts(res.data.accounts || [])
          if (res.data.accounts?.length) setAccountNumber(res.data.accounts[0].account_number)
        }
      } catch (e) {}
    }
    fetchAccounts()
  }, [])

  const fetchTx = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      const params = {}
      if (accountNumber) params.account_number = accountNumber
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      if (type !== 'all') params.type = type
      const res = await axios.get('/api/transactions/filter', { params, headers: { Authorization: `Bearer ${token}` } })
      setTransactions(res.data.transactions || [])
    } catch (e) {
      setMessage(e.response?.data?.error || 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (accountNumber) fetchTx() }, [accountNumber])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Transaction History (Advanced)</h1>
          <form onSubmit={fetchTx} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded" value={accountNumber} onChange={e=>setAccountNumber(e.target.value)}>
                {accounts.map(a => (
                  <option key={a.account_number} value={a.account_number}>{a.account_type?.toUpperCase()} - {a.account_number}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded" value={type} onChange={e=>setType(e.target.value)}>
                <option value="all">All</option>
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded" value={startDate} onChange={e=>setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded" value={endDate} onChange={e=>setEndDate(e.target.value)} />
            </div>
            <div className="md:col-span-5">
              <button type="submit" disabled={loading} className="btn-primary">{loading? 'Filtering...' : 'Apply Filters'}</button>
            </div>
          </form>

          {message && <div className="mb-4 text-red-600">{message}</div>}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Date</th>
                  <th className="p-2">Account</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Mode</th>
                  <th className="p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t._id} className="border-b">
                    <td className="p-2">{t.timestamp || t.created_at}</td>
                    <td className="p-2">{t.account_number || '-'}</td>
                    <td className="p-2 capitalize">{t.type || '-'}</td>
                    <td className="p-2">{t.transfer_mode || '-'}</td>
                    <td className="p-2">₹{t.amount}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td className="p-2 text-gray-500" colSpan={5}>No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedTransactionHistory



