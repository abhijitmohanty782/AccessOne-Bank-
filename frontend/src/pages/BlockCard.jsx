import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BlockCard(){
  const [cardLast4, setCardLast4] = useState('')
  const [reason, setReason] = useState('Lost')
  const [contact, setContact] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    if (!/^[0-9]{4}$/.test(cardLast4)) return 'Enter last 4 digits of the card'
    if (!confirm) return 'Please confirm that you want to block the card'
    if (contact && !/^[6-9]\d{9}$/.test(contact)) return 'Enter a valid 10-digit mobile (optional)'
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return alert(err)
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      alert(`Card ending ${cardLast4} has been blocked (reason: ${reason}).`)
      navigate('/cards/details')
    }, 900)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-3">Block / Temporarily Block Card</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Card last 4 digits</label>
            <input value={cardLast4} onChange={(e)=>setCardLast4(e.target.value)} maxLength={4} className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. 4242" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <select value={reason} onChange={(e)=>setReason(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2">
              <option>Lost</option>
              <option>Stolen</option>
              <option>Unauthorized Transactions</option>
              <option>Temporary Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact number (optional)</label>
            <input value={contact} onChange={(e)=>setContact(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" placeholder="10-digit mobile" />
          </div>

          <div className="flex items-start">
            <input id="confirm" type="checkbox" checked={confirm} onChange={(e)=>setConfirm(e.target.checked)} className="mt-1 mr-2" />
            <label htmlFor="confirm" className="text-sm text-gray-700">I confirm I want to block this card immediately</label>
          </div>

          <div>
            <button type="submit" disabled={submitting} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded disabled:opacity-60">
              {submitting ? 'Processing...' : 'Block Card'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">If your card is lost or stolen, please contact customer support at once for additional assistance.</div>
      </div>
    </div>
  )
}

