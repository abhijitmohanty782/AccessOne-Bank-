import React, { useState } from 'react'

export default function ApplyLifeInsurance(){
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    dob: '',
    sumAssured: '',
    term: '20',
    nomineeName: '',
    nomineeRelation: '',
    nomineeDob: '',
    premiumFreq: 'yearly',
    employment: 'Salaried',
    income: '',
    smoker: false,
    healthIssues: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    if (!form.name.trim()) return 'Enter full name'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return 'Enter valid 10-digit mobile'
    if (!/.+@.+\..+/.test(form.email)) return 'Enter valid email'
    if (!form.dob) return 'Enter date of birth'
    if (!form.sumAssured || Number(form.sumAssured) <= 0) return 'Enter sum assured'
    if (!form.nomineeName.trim()) return 'Enter nominee name'
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return alert(err)
    setSubmitting(true)
    setTimeout(()=>{
      setSubmitting(false)
      alert(`Life insurance application submitted for ${form.name}. Sum assured: ₹${Number(form.sumAssured).toLocaleString('en-IN')}`)
      setForm({ name: '', mobile: '', email: '', dob: '', sumAssured: '', term: '20', nomineeName: '', nomineeRelation: '', nomineeDob: '', premiumFreq: 'yearly', employment: 'Salaried', income: '', smoker: false, healthIssues: '' })
    }, 1000)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Apply for Life Insurance</h2>
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
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input name="dob" value={form.dob} onChange={handleChange} type="date" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sum Assured (INR)</label>
              <input name="sumAssured" value={form.sumAssured} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. 1000000" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Policy Term (years)</label>
              <select name="term" value={form.term} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Premium Frequency</label>
              <select name="premiumFreq" value={form.premiumFreq} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nominee Name</label>
            <input name="nomineeName" value={form.nomineeName} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nominee Relation</label>
              <input name="nomineeRelation" value={form.nomineeRelation} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nominee DOB (optional)</label>
              <input name="nomineeDob" value={form.nomineeDob} onChange={handleChange} type="date" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Employment Type</label>
              <select name="employment" value={form.employment} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
                <option>Salaried</option>
                <option>Self-employed</option>
                <option>Retired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Monthly Income (INR)</label>
              <input name="income" value={form.income} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input name="smoker" checked={form.smoker} onChange={handleChange} type="checkbox" />
            <label className="text-sm text-gray-700">I am a smoker</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Health issues / Notes (optional)</label>
            <textarea name="healthIssues" value={form.healthIssues} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" rows={3} />
          </div>

          <div>
            <button type="submit" disabled={submitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Apply Now'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">Mock form: to make production-ready, add KYC/document uploads (ID, medical), backend endpoint and underwriting checks.</div>
      </div>
    </div>
  )
}

