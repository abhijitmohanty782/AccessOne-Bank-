import React, { useState } from 'react'

export default function ApplyEducationLoan(){
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    course: '',
    institution: '',
    courseStart: '',
    amount: '',
    tenure: '24',
    coApplicant: '',
    income: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev=>({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!form.name.trim()) return 'Enter applicant name'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return 'Enter valid 10-digit mobile'
    if (!/.+@.+\..+/.test(form.email)) return 'Enter valid email'
    if (!form.course.trim()) return 'Enter course name'
    if (!form.institution.trim()) return 'Enter institution name'
    if (!form.amount || Number(form.amount) <= 0) return 'Enter loan amount'
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
      alert(`Education loan application submitted for ${form.name} for ₹${Number(form.amount).toLocaleString('en-IN')}. We'll reach at ${form.mobile}`)
      setForm({ name: '', mobile: '', email: '', course: '', institution: '', courseStart: '', amount: '', tenure: '24', coApplicant: '', income: '' })
    }, 1000)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Apply for Education Loan</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Applicant Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile</label>
              <input name="mobile" value={form.mobile} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="10-digit mobile" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Course / Program</label>
            <input name="course" value={form.course} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. MSc Computer Science" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Institution</label>
            <input name="institution" value={form.institution} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. XYZ University" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course Start Date (optional)</label>
              <input name="courseStart" value={form.courseStart} onChange={handleChange} type="date" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Co-applicant (optional)</label>
              <input name="coApplicant" value={form.coApplicant} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" placeholder="Name of co-applicant" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Loan Amount (INR)</label>
              <input name="amount" value={form.amount} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. 500000" />
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
            <label className="block text-sm font-medium text-gray-700">Monthly / Parent Income (INR)</label>
            <input name="income" value={form.income} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. 40000" />
          </div>

          <div>
            <button type="submit" disabled={submitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Apply Now'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">Mock form — to make production-ready I'd add document uploads (fee letter, admission offer), backend endpoint, and eligibility checks.</div>
      </div>
    </div>
  )
}

