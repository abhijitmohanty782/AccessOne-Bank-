import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const Bar = ({ value, max, color }) => {
  const height = max > 0 ? Math.round((value / max) * 120) : 0
  return (
    <div className="flex flex-col items-center justify-end" style={{height: 140}}>
      <div className="text-xs text-gray-600 mb-1">₹{Math.round(value)}</div>
      <div className="w-6" style={{height}}>
        <div className="w-full rounded" style={{height, backgroundColor: color}}></div>
      </div>
    </div>
  )
}

const AccountOverview = () => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [accountNumber, setAccountNumber] = useState('')
  const [accounts, setAccounts] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/analytics/monthly', {
        params: { year, account_number: accountNumber },
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data.monthly || [])
    } catch (e) {
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (accountNumber) fetchData() }, [year, accountNumber])

  const maxVal = useMemo(() => {
    return Math.max(0, ...data.flatMap(m => [m.debit || 0, m.credit || 0]))
  }, [data])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Account Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" value={year} onChange={e=>setYear(parseInt(e.target.value||new Date().getFullYear()))}
                     className="w-full px-3 py-2 border border-gray-300 rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
              <select value={accountNumber} onChange={e=>setAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded">
                {accounts.map(a => (
                  <option key={a.account_number} value={a.account_number}>
                    {a.account_type?.toUpperCase()} - {a.account_number}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="mb-4 text-red-600">{error}</div>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-12 gap-4">
                  {data.map((m, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="flex gap-2 items-end">
                        <Bar value={m.debit||0} max={maxVal} color="#ef4444" />
                        <Bar value={m.credit||0} max={maxVal} color="#10b981" />
                      </div>
                      <div className="mt-2 text-sm text-gray-700">{monthLabels[idx]}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-6 text-sm">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 inline-block rounded" style={{background:'#ef4444'}}></span> Debit</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 inline-block rounded" style={{background:'#10b981'}}></span> Credit</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountOverview



