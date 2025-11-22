import React, { useState } from 'react'

export default function ApplyCarLoan(){
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    vehicleMake: '',
    vehicleModel: '',
    vehiclePrice: '',
    downPayment: '',
    loanAmount: '',
    tenure: '36',
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
    if (!form.vehicleMake.trim() || !form.vehicleModel.trim()) return 'Enter vehicle make and model'
    if (!form.vehiclePrice || Number(form.vehiclePrice) <= 0) return 'Enter vehicle price'
    if (!form.loanAmount || Number(form.loanAmount) <= 0) return 'Enter loan amount'
    if (!form.income || Number(form.income) <= 0) return 'Enter monthly income'
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return alert(err)
    setSubmitting(true)
    setTimeout(()=>{
      setSubmitting(false)
      alert(`Car loan application submitted for ${form.name} for ₹${Number(form.loanAmount).toLocaleString('en-IN')}. We'll contact you on ${form.mobile}`)
      setForm({ name: '', mobile: '', email: '', vehicleMake: '', vehicleModel: '', vehiclePrice: '', downPayment: '', loanAmount: '', tenure: '36', employment: 'Salaried', income: '' })
    }, 900)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Apply for Car Loan</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input name="mobile" value={form.mobile} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="10-digit mobile" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle Make</label>
              <input name="vehicleMake" value={form.vehicleMake} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. Maruti" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle Model</label>
              <input name="vehicleModel" value={form.vehicleModel} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. Swift" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle Price (INR)</label>
              <input name="vehiclePrice" value={form.vehiclePrice} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" />
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
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
                <option value="60">60</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Employment Type</label>
              <select name="employment" value={form.employment} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
                <option>Salaried</option>
                <option>Self-employed</option>
                <option>Business</option>
                <option>Retired</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Income (INR)</label>
            <input name="income" value={form.income} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div>
            <button type="submit" disabled={submitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Apply Now'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">Mock application: to make production-ready, connect to backend, add document uploads (ID, income proof), and eligibility checks.</div>
      </div>
    </div>
  )
}

