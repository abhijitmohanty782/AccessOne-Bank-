import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AccountStatement = () => {
  const [accounts, setAccounts] = useState([])
  const [accountNumber, setAccountNumber] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [pendingId, setPendingId] = useState('')
  const [otp, setOtp] = useState('')
  const [phase, setPhase] = useState('form') // form | otp | result
  const [result, setResult] = useState(null)
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

  const initiate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('/api/statement/initiate', {
        account_number: accountNumber,
        start_date: startDate,
        end_date: endDate
      }, { headers: { Authorization: `Bearer ${token}` } })
      setPendingId(res.data.pending_statement_id)
      setPhase('otp')
      setMessage('OTP sent to your email. Enter the 6-digit code.')
    } catch (e) {
      setMessage(e.response?.data?.error || 'Failed to initiate statement')
    } finally {
      setLoading(false)
    }
  }

  const verify = async (e) => {
    e.preventDefault()
    if (!/^[0-9]{6}$/.test(otp)) { setMessage('Enter a valid 6-digit OTP'); return }
    setLoading(true)
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('/api/statement/verify', {
        pending_statement_id: pendingId,
        otp
      }, { headers: { Authorization: `Bearer ${token}` } })
      setResult(res.data)
      setPhase('result')
    } catch (e) {
      setMessage(e.response?.data?.error || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const printPage = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Account Statement</h1>
          {message && <div className={`mb-4 p-3 rounded ${message.toLowerCase().includes('fail')||message.toLowerCase().includes('error')? 'bg-red-100 text-red-700':'bg-blue-100 text-blue-800'}`}>{message}</div>}

          {phase === 'form' && (
            <form onSubmit={initiate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded" value={accountNumber} onChange={e=>setAccountNumber(e.target.value)}>
                  {accounts.map(a => (
                    <option key={a.account_number} value={a.account_number}>{a.account_type?.toUpperCase()} - {a.account_number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded" value={startDate} onChange={e=>setStartDate(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded" value={endDate} onChange={e=>setEndDate(e.target.value)} required />
              </div>
              <div className="md:col-span-3">
                <button type="submit" disabled={loading} className="btn-primary">{loading? 'Requesting...' : 'Request Statement'}</button>
              </div>
            </form>
          )}

          {phase === 'otp' && (
            <form onSubmit={verify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value)} className="input-field tracking-widest text-center" placeholder="______" required />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary">{loading? 'Verifying...' : 'Verify OTP'}</button>
                <button type="button" onClick={initiate} disabled={loading} className="px-4 py-2 rounded bg-gray-200">Resend OTP</button>
              </div>
            </form>
          )}

          {phase === 'result' && result && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-semibold">Account: {result.account?.account_number}</div>
                  <div className="text-sm text-gray-600">{result.start_date} to {result.end_date}</div>
                </div>
                <button onClick={printPage} className="px-4 py-2 rounded bg-blue-600 text-white">Print</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-2">Date</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Mode</th>
                      <th className="p-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.transactions.map(t => (
                      <tr key={t._id} className="border-b">
                        <td className="p-2">{t.timestamp || t.created_at}</td>
                        <td className="p-2 capitalize">{t.type || '-'}</td>
                        <td className="p-2">{t.transfer_mode || '-'}</td>
                        <td className="p-2">₹{t.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountStatement



