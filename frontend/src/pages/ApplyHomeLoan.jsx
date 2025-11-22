import React, { useState } from 'react'

export default function ApplyHomeLoan(){
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    propertyValue: '',
    downPayment: '',
    loanAmount: '',
    tenure: '120',
    propertyType: 'Apartment',
    address: '',
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
    if (!form.propertyValue || Number(form.propertyValue) <= 0) return 'Enter property value'
    if (!form.loanAmount || Number(form.loanAmount) <= 0) return 'Enter desired loan amount'
    if (!form.income || Number(form.income) <= 0) return 'Enter valid monthly income'
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return alert(err)
    setSubmitting(true)
    setTimeout(()=>{
      setSubmitting(false)
      alert(`Home loan application submitted for ${form.name} for ₹${Number(form.loanAmount).toLocaleString('en-IN')}`)
      setForm({ name: '', mobile: '', email: '', propertyValue: '', downPayment: '', loanAmount: '', tenure: '120', propertyType: 'Apartment', address: '', employment: 'Salaried', income: '' })
    }, 1000)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Apply for Home Loan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile</label>
              <input name="mobile" value={form.mobile} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="10-digit mobile" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Value (INR)</label>
              <input name="propertyValue" value={form.propertyValue} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Down Payment (INR)</label>
              <input name="downPayment" value={form.downPayment} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Desired Loan Amount (INR)</label>
              <input name="loanAmount" value={form.loanAmount} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tenure (months)</label>
              <select name="tenure" value={form.tenure} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
                <option value="60">60</option>
                <option value="120">120</option>
                <option value="180">180</option>
                <option value="240">240</option>
                <option value="300">300</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Type</label>
              <select name="propertyType" value={form.propertyType} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
                <option>Apartment</option>
                <option>Independent House</option>
                <option>Plot</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Property Address</label>
            <input name="address" value={form.address} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Employment Type</label>
              <select name="employment" value={form.employment} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
                <option>Salaried</option>
                <option>Self-employed</option>
                <option>Business</option>
                <option>Retired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Monthly Income (INR)</label>
              <input name="income" value={form.income} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <button type="submit" disabled={submitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Apply Now'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">Mock form: to make this production-ready, I'll connect it to the backend, add document uploads, and perform eligibility checks.</div>
      </div>
    </div>
  )
}

