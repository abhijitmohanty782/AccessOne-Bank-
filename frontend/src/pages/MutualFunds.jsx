import React, { useState } from 'react'

// Lightweight Mutual Funds form using Tailwind (no MUI required)
const MutualFunds = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    investmentAmount: '',
    fundType: '',
    tenure: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const fundOptions = [
    'Equity Fund',
    'Debt Fund',
    'Hybrid Fund',
    'Index Fund',
    'ELSS (Tax Saving Fund)'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.investmentAmount || !formData.fundType) {
      alert('Please fill required fields')
      return
    }
    console.log('MutualFund submission:', formData)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-2">🎉 Thank You!</h2>
        <p className="text-gray-700">Your Mutual Fund investment request has been submitted successfully.</p>
        <button onClick={() => setSubmitted(false)} className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded">Submit Another</button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Mutual Fund Investment Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount (₹)</label>
          <input name="investmentAmount" type="number" value={formData.investmentAmount} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fund Type</label>
          <select name="fundType" value={formData.fundType} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Select Fund Type</option>
            {fundOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Investment Tenure (Years)</label>
          <input name="tenure" type="number" value={formData.tenure} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <button type="submit" className="w-full bg-red-600 text-white font-semibold py-2 rounded">Submit Investment</button>
        </div>
      </form>
    </div>
  )
}

export default MutualFunds

