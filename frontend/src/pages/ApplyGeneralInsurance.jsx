import React, { useState } from 'react'

export default function ApplyGeneralInsurance(){
  const [form, setForm] = useState({
    policyType: 'vehicle',
    name: '',
    mobile: '',
    email: '',
    vehicleMake: '',
    vehicleModel: '',
    registrationNo: '',
    propertyAddress: '',
    tripStart: '',
    tripEnd: '',
    sumInsured: '',
    startDate: '',
    nominee: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!form.name.trim()) return 'Enter full name'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return 'Enter valid 10-digit mobile'
    if (!/.+@.+\..+/.test(form.email)) return 'Enter valid email'
    if (!form.sumInsured || Number(form.sumInsured) <= 0) return 'Enter sum insured'
    if (!form.startDate) return 'Select policy start date'
    // policy-specific checks
    if (form.policyType === 'vehicle' && (!form.vehicleMake.trim() || !form.registrationNo.trim())) return 'Enter vehicle make and registration number'
    if (form.policyType === 'home' && !form.propertyAddress.trim()) return 'Enter property address'
    if (form.policyType === 'travel' && (!form.tripStart || !form.tripEnd)) return 'Enter trip start and end dates'
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return alert(err)
    setSubmitting(true)
    setTimeout(()=>{
      setSubmitting(false)
      alert(`General insurance application submitted for ${form.name} (${form.policyType}). Sum insured: ₹${Number(form.sumInsured).toLocaleString('en-IN')}`)
      setForm({ policyType: 'vehicle', name: '', mobile: '', email: '', vehicleMake: '', vehicleModel: '', registrationNo: '', propertyAddress: '', tripStart: '', tripEnd: '', sumInsured: '', startDate: '', nominee: '', notes: '' })
    }, 900)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Apply for General Insurance</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Policy Type</label>
            <select name="policyType" value={form.policyType} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2">
              <option value="vehicle">Vehicle</option>
              <option value="home">Home</option>
              <option value="travel">Travel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
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

          {form.policyType === 'vehicle' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Make</label>
                <input name="vehicleMake" value={form.vehicleMake} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration No.</label>
                <input name="registrationNo" value={form.registrationNo} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
            </div>
          )}

          {form.policyType === 'home' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Address</label>
              <input name="propertyAddress" value={form.propertyAddress} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
          )}

          {form.policyType === 'travel' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Trip Start</label>
                <input name="tripStart" value={form.tripStart} onChange={handleChange} type="date" className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trip End</label>
                <input name="tripEnd" value={form.tripEnd} onChange={handleChange} type="date" className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sum Insured (INR)</label>
              <input name="sumInsured" value={form.sumInsured} onChange={handleChange} type="number" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Policy Start Date</label>
              <input name="startDate" value={form.startDate} onChange={handleChange} type="date" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nominee</label>
            <input name="nominee" value={form.nominee} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Notes (optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" rows={3} />
          </div>

          <div>
            <button type="submit" disabled={submitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Apply Now'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">Mock form — for production add document upload, backend endpoint and policy quotes.</div>
      </div>
    </div>
  )
}

