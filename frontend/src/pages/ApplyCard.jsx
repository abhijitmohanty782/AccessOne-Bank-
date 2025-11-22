import React, { useState } from 'react'

export default function ApplyCard() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', cardType: 'Platinum', limit: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!form.name.trim()) return 'Enter full name'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return 'Enter valid 10-digit mobile starting with 6-9'
    if (!/.+@.+\..+/.test(form.email)) return 'Enter valid email'
    if (form.limit && Number(form.limit) <= 0) return 'Credit limit must be positive'
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
      alert(`Application submitted for ${form.name}. We'll contact you at ${form.mobile}`)
      setForm({ name: '', mobile: '', email: '', cardType: 'Platinum', limit: '' })
    }, 900)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Apply for New Card</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="John Doe" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input name="mobile" value={form.mobile} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="10-digit mobile" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Card Type</label>
            <select name="cardType" value={form.cardType} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
              <option>Platinum</option>
              <option>Gold</option>
              <option>Classic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Requested Credit Limit (INR)</label>
            <input name="limit" value={form.limit} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. 50000" />
          </div>

          <div>
            <button type="submit" disabled={submitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Apply Now'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          By applying you agree to our terms. This is a mock form — to connect it to real backend APIs, I can wire it up next.
        </div>
      </div>
    </div>
  )
}

