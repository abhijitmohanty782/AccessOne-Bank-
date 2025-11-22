import React, { useState } from 'react'

export default function ChequeBookRequest() {
  const [form, setForm] = useState({
    account: '',
    leaves: '25',
    address: '',
    contact: '',
    remarks: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!form.account.trim()) return 'Select or enter account number'
    if (!/^[6-9]\d{9}$/.test(form.contact)) return 'Enter valid 10-digit contact number'
    if (!form.address.trim()) return 'Enter delivery address'
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return alert(err)
    setSubmitting(true)
    setTimeout(()=>{
      setSubmitting(false)
      alert(`Cheque book request submitted for account ${form.account} (${form.leaves} leaves). It will be delivered to the provided address.`)
      setForm({ account: '', leaves: '25', address: '', contact: '', remarks: '' })
    }, 900)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Cheque Book Request</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Number</label>
            <input name="account" value={form.account} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. 1234567890 or select from accounts" />
            <div className="text-sm text-gray-500 mt-1">If you have multiple accounts, you can enter the account number here.</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Leaves</label>
            <select name="leaves" value={form.leaves} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
              <option value="25">25 Leaves</option>
              <option value="50">50 Leaves</option>
              <option value="100">100 Leaves</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" rows={3} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input name="contact" value={form.contact} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="10-digit mobile" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Remarks (optional)</label>
            <input name="remarks" value={form.remarks} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div>
            <button type="submit" disabled={submitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Request Cheque Book'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">We'll process your cheque book request and deliver to the provided address. For urgent requests, contact customer care.</div>
      </div>
    </div>
  )
}

