import React, { useState } from 'react'

export default function ApplyPersonalLoan() {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    amount: '',
    tenure: '12',
    purpose: '',
    employment: 'Salaried',
    income: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!form.name.trim()) return 'Enter full name'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return 'Enter valid 10-digit mobile starting with 6-9'
    if (!/.+@.+\..+/.test(form.email)) return 'Enter valid email'
    if (!form.amount || Number(form.amount) <= 0) return 'Enter a valid loan amount'
    if (!form.income || Number(form.income) <= 0) return 'Enter valid monthly income'
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      alert(err)
      return
    }
    setSubmitting(true)
    // mock submit
    setTimeout(() => {
      setSubmitting(false)
      alert(`Loan application submitted for ${form.name} for ₹${Number(form.amount).toLocaleString('en-IN')}. We will contact you on ${form.mobile}`)
      setForm({ name: '', mobile: '', email: '', amount: '', tenure: '12', purpose: '', employment: 'Salaried', income: '' })
    }, 1000)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Apply for Personal Loan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input name="mobile" value={form.mobile} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="10-digit mobile" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="you@example.com" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Loan Amount (INR)</label>
              <input name="amount" value={form.amount} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. 200000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tenure (months)</label>
              <select name="tenure" value={form.tenure} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
                <option value="60">60</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose of Loan</label>
            <input name="purpose" value={form.purpose} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. Home renovation" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Employment Type</label>
              <select name="employment" value={form.employment} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
                <option>Salaried</option>
                <option>Self-employed</option>
                <option>Student</option>
                <option>Retired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Monthly Income (INR)</label>
              <input name="income" value={form.income} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. 50000" />
            </div>
          </div>

          <div>
            <button type="submit" disabled={submitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Apply Now'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">This is a mock application form. To process real applications, I'll wire it to a backend endpoint and add server-side validation.</div>
      </div>
    </div>
  )
}

